/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express'
import axios, { AxiosResponse } from 'axios'
import {
    CountResponse,
    ListBuilderRequest,
    PokemonListResponse,
    ResultsContent,
    GenerationData,
    PokemonDataContent
} from '../interfaces'
import { pokedexUri } from '../configs/config'

export const listBuilder = async (req: ListBuilderRequest, res: express.Response, next: express.NextFunction) => {
    const url = req.body?.nextUrl || `${pokedexUri}/api/v2/pokemon?limit=100`
    let results = []
    let nextUrl: string
    await axios.get(url)
        .then((resp: PokemonListResponse) => {
            results = resp.data.results
            nextUrl = resp.data.next
        })
        .catch(() => {
            res.sendStatus(404)
        })
    if (results.length > 0) {
        const pokemonDataReq: Promise<AxiosResponse>[] = results.map((item: ResultsContent) => {
            return axios.get(`${pokedexUri}/api/v2/pokemon/${item.name}`)
        })
        await Promise.all(pokemonDataReq)
            .then((resp: PokemonListResponse[]) => {
                const pokemonData = resp.map(item => {
                    const { id, sprites, types, name }: PokemonDataContent = item.data
                    const { versions } = sprites
                    const sortedSprites = Object.keys(sprites).map((key: string) => {
                        const sprite: string = sprites[key]
                        if (sprite) {
                            return { [key]: sprite }
                        }
                    }).filter(k => k && !k?.other && !k?.versions)
                    const additionalSprites: GenerationData[] = Object.keys(versions).map((version: string) => sprites.versions[version])
                    if (additionalSprites) {
                        additionalSprites.forEach(gen => {
                            Object.keys(gen).forEach((game: string) => {
                                if (game !== 'icons' && gen[game].front_default) {
                                    sortedSprites.push({ [game]: gen[game] })
                                }
                            })
                        })
                    }
                    return {
                        id,
                        name,
                        img:sprites.front_default,
                        img_shiny: sprites.front_shiny,
                        sprites: sortedSprites,
                        types
                    }
                })
                res.json({ nextUrl, pokemonData })
            })
            .catch(() => {
                res.status(400).send('Failed on group promise')
            })
        next()
    }
}

export const countBuilder = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await axios.get(`${pokedexUri}/api/v2/pokedex/1`)
        .then((resp: CountResponse) => {
            resp = resp.data
            const count = resp.pokemon_entries[resp.pokemon_entries.length - 1].entry_number
            res.status(200).json({ count })
        })
        .catch(() => {
            res.sendStatus(404)
        })
    next()
}