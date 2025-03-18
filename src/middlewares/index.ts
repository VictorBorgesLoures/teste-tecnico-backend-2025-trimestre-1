import { type Express } from 'express'
import bodyParser from 'body-parser'

export default (app: Express) => {
    
    app.use(bodyParser.json())

}