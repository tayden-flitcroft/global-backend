import express from 'express'
import cors from 'cors'
import { corsConfig } from '../configs/cors-config'
import {
    countBuilder,
    listBuilder
} from '../builders/pokedex-builders'

const pokedexRouter = express.Router()

pokedexRouter.options('*', cors(corsConfig))
pokedexRouter.use(cors(corsConfig))
pokedexRouter.use(express.json())

pokedexRouter.get('/count', async (req: express.Request, res: express.Response, next: express.NextFunction) => await countBuilder(req, res, next))
pokedexRouter.get('/pokemon/list', async (req: express.Request, res: express.Response, next: express.NextFunction) => await listBuilder(req, res, next))

export default pokedexRouter
