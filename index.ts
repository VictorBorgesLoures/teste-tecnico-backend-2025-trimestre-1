import 'dotenv/config'
import express from 'express'

let app = express()

app.get("/", (req, res, next) => {
    res.send("Server running...")
})

app.listen(process.env.PORT, error => {
    if (error)
        console.log(`Error on running server: ${error.message}`)
    else
        console.log(`Server running on port ${process.env.PORT} -> http://localhost:3000`)
})