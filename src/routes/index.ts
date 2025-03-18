import express, { type Express } from 'express'
import videoRoutes from '@src/routes/video'

export default (app: Express) => {

    app.get('/', (req, res, next) => {
        res.send("test")
    })

    app.use('/', videoRoutes())
    
}