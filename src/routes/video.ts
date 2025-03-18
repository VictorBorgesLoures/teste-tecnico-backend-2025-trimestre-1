import express from 'express'
import fileManagerIntance from '@src/fileManager'

const MAX_VIDEO_INPUT_SIZE = 10 * 2**10 * 2**10
console.log(`File size: ${MAX_VIDEO_INPUT_SIZE}`)

export default () => {
    let router = express.Router()
    console.log("Loading video routes")

    router.post('/upload/video', (req, res, next) => {
        if (req.headers['content-length'] === undefined) {
            res.status(400)
                .setHeader('Content-Type','text/plain')
                .send("Header Content-lenght is empty")
        } else if(parseInt(req.headers['content-length']) > MAX_VIDEO_INPUT_SIZE) {
            res.status(400)
                .setHeader('Content-Type','text/plain')
                .send(`Video passed max size of 10MB`)
        } else {
            fileManagerIntance.upload_stream(req, res)
                .then(accepted => {
                    if (accepted)
                        res.status(204)
                            .setHeader('Content-Type','text/plain')
                            .send("File uploaded")
                    else 
                        res.status(500)
                            .setHeader('Content-Type','text/plain')
                            .send("Cannot upload file")
                })
                .catch(e => {
                    console.log(e)
                    res.status(400)
                        .setHeader('Content-Type','text/plain')
                        .send(`Error: ${e.message}`)
                })
        }
    })

    

    router.get('/static/video/:filename', (req, res, next) => {
        const rangeString = req.headers['range']
        fileManagerIntance.read_stream(req, res)
            .then( videoStream => {
                if(videoStream == null) 
                    res.status(404)
                        .setHeader('Content-Type','text/plain')
                        .send("Video not found")
                else {
                    let initRange = 0
                    let endRange = videoStream.buffer.byteLength-1
                    if(rangeString !== undefined) {
                        const rangeArray = rangeString.split('=')[1].split('-')
                        initRange = rangeArray.length > 0 
                            ? parseInt(rangeArray[0]) 
                            : initRange
                        endRange = rangeArray.length > 1 
                            ? rangeArray[1] == '' 
                                ? endRange 
                                : parseInt(rangeArray[1]) 
                            : endRange
                    }
                    if( initRange >= videoStream.buffer.byteLength
                        || endRange >= videoStream.buffer.byteLength
                        || initRange >= endRange
                    )
                        res.status(500)
                            .setHeader('Content-Type','text/plain')
                            .send("Range wrong format")
                    else {
                        res.status(endRange-initRange+1 != videoStream.byteLength ? 206 : 200)
                            .header({
                                'Content-Length': endRange-initRange+1,
                                'Content-Range': `bytes ${initRange}-${endRange}/${videoStream.byteLength}`,
                                'Content-Type': `video/${req.params['filename'].split('.').at(-1)}`,
                            })
                            .end(videoStream.slice(initRange, endRange+1))
                    }
                }
            })
            .catch(e => {
                console.log(e)
                res.status(500)
                    .setHeader('Content-Type','text/plain')
                    .send("Internal Error")
            })
    })

    return router
}