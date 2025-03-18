import 'dotenv/config'
import express from 'express'
import middlewares from '@src/middlewares'
import routes from '@src/routes'

let app = express()

middlewares(app)

routes(app)

app.listen(process.env.PORT, error => {
    if (error)
        console.log(`Error on running server: ${error.message}`)
    else
        console.log(`Server running on port ${process.env.PORT} -> http://localhost:3000`)
})