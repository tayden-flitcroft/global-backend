import express from 'express'
import {
    CountResponse, GenerationData,
    ListBuilderRequest, NextCallParams, PokemonDataContent,
    PokemonListResponse,
    ResultsContent,
    SpritesContent,
    TypesResponse, Versions
} from '../interfaces'
import { pokedexUri } from '../configs/config'
import { sanitizedUrl } from '../helpers/helpers'

export const listBuilder = async (req: ListBuilderRequest, res: express.Response, next: express.NextFunction) => {
    const { limit, offset } = req.query
    let url = `${pokedexUri}/pokemon`
    if (limit || offset) {
        url = url + `/?limit=${limit}&offset=${offset}`
    } else {
        url = url + '/?limit=100'
    }
    const pokemonData = []
    const params = {} as NextCallParams

    await fetch(url)
        .then((resp) => resp.json())
        .then((resp: PokemonListResponse) => {
            const { results } = resp

            const nextUrlParams = new URLSearchParams(resp.next.split('?')[1])
            for (const param of nextUrlParams) {
                params[param[0]] = param[1]
            }

            if (results.length) {
                const pokemonDataUrls = results.map(({ name }) => `${pokedexUri}/pokemon/${name}`)

                return Promise.all(pokemonDataUrls.map(async (pokemonUrl) => {
                    await fetch(pokemonUrl)
                        .then((r) => r.json())
                        .then((r) => {
                            const { name, id, sprites, types }: { name: string, id: string, sprites: SpritesContent, types: TypesResponse } = r
                            const { versions, front_default, front_shiny } = sprites

                            const sortedSprites = Object.keys(sprites).map((key) => {
                                const sprite = sprites[key] as string
                                if (sprite) {
                                    return { [key]: sprite }
                                }
                                return null
                            })
                                .filter(k => k && !k?.other && !k?.versions)
                            const additionalSprites = Object.keys(versions).map((generation) => versions[generation]) as GenerationData[]
                            if (additionalSprites.length) {
                                additionalSprites.forEach((version) => {
                                    Object.keys(version).forEach((game) => {
                                        const currentGameData = version[game] as SpritesContent
                                        if (game !== 'icons' && currentGameData.front_default) {
                                            sortedSprites.push({ [game]: version[game] })
                                        }
                                    })
                                })
                            }

                            pokemonData.push({
                                id,
                                name,
                                default_image: front_default,
                                default_image_shiny: front_shiny,
                                sprites: sortedSprites,
                                types
                            })
                        })
                }))
            }
        })
        .then(() => {
            pokemonData.sort((a, b) => a.id - b.id)
            res.status(200).json({ pokemonData, params })
        })
        .catch((err) => {
            res.status(400).json(err)
        })
}

export const countBuilder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await fetch(`${pokedexUri}/pokedex/1`)
        .then((resp) => resp.json())
        .then((resp: CountResponse) => {
            const { entry_number } = resp.pokemon_entries[resp.pokemon_entries.length - 1]
            res.status(200).json({ count: entry_number })
        })
        .catch(() => {
            res.sendStatus(400)
        })
    next()
}
