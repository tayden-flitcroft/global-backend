import express from 'express'
import cors from 'cors'
import { corsConfig } from '../configs/cors-config'
import {
    contactEmailBuilder,
    projectsBuilder,
    sendPdfWorker, sendResume
} from '../builders/portfolio-builders'

const portfolioRouter = express.Router()

portfolioRouter.options('*', cors(corsConfig))
portfolioRouter.use(cors(corsConfig))
portfolioRouter.use(express.json())

portfolioRouter.get('/projects', (req: express.Request, res:express.Response, next: express.NextFunction) => projectsBuilder(req, res, next))
portfolioRouter.post('/contact', async (req: express.Request, res: express.Response, next:express.NextFunction) => await contactEmailBuilder(req, res, next))
portfolioRouter.get('/pdf-worker', (req: express.Request, res: express.Response, next: express.NextFunction) => sendPdfWorker(req, res, next))
portfolioRouter.get('/resume', (req: express.Request, res: express.Response, next: express.NextFunction) => sendResume(req, res, next))

export default portfolioRouter
