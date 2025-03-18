import express from 'express'
import fileManagerIntance from '@src/fileManager'

const MAX_VIDEO_INPUT = 10 * 2**10 * 2**10

export default () => {
    let router = express.Router()
    console.log("Loading video routes")

    router.post('/upload/video', (req, res, next) => {
        if (req.headers['content-length'] === undefined) {
            res.status(400).json({"error": 400, "message": "Header Content-lenght is empty"})
        } else if(parseInt(req.headers['content-length']) > MAX_VIDEO_INPUT) {
            res.status(400).json({"error": 400, "message": `Video passed max size of 10MB`})
        } else {
            fileManagerIntance.upload_stream(req, res)
                .then(accepted => {
                    if (accepted)
                        res.status(204).json({status: 204, message: "File uploaded"})
                    else 
                        res.status(500).json({status: 500, message: "Cannot upload file"})
                })
                .catch(e => {
                    console.log(e)
                    res.status(400).json({"error": 400, "message": `Error: ${e.message}`})
                })
        }
    })

    router.get('/static/video/:filename', (req, res, next) => {
        const range = req.headers['range'] === undefined ? 0 : parseInt(req.headers['range'])
        fileManagerIntance.read_stream(req, res)
            .then( videoStream => {
                if(videoStream == null) 
                    res.status(404).json({status:404, message: "Video not found"})
                else {
                    if(range > videoStream.buffer.byteLength)
                        res.status(500).send("Range exceds the bufferlenght bytes")
                    else {
                        res.status(range > 0 ? 206 : 200)
                            .header({
                                'Content-Length': videoStream.buffer.byteLength - range,
                                'Content-Type': `video/${req.params['filename'].split('.').at(-1)}`,
                            })
                            .send(Buffer.from(videoStream.buffer.slice(range)))
                    }
                }
            })
            .catch(e => {
                console.log(e)
                res.status(500).json({status:500, message: "Internal Error"})
            })
    })

    return router
}