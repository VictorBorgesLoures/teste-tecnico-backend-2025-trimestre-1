import express, { type Express } from 'express'
import videoRoutes from '@src/routes/video'

export default (app: Express) => {

    app.get('/', (req, res, next) => {
        res.status(200).send("Server is live")
    })

    app.use('/', videoRoutes())
    
}