import multer from 'multer'
import Storage from '@src/fileManager/Storage'
import fs from 'fs'
import path from 'path'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'upload'))
      },
    filename: function (req, file, cb) {

        cb(null,  file.originalname );

    }
})

export default class MulterStorage extends Storage {

    _multer = multer({storage}).single("video")

    constructor() {
        super()
    }

    read_stream(request: any, response: any): Promise<Buffer<ArrayBufferLike> | null> {
        return new Promise((resolve, reject) => {
            const streamCache = this._fileCache.get(request.params['filename'])
            if (streamCache === undefined) {
                fs.readFile(path.join(process.cwd(), 'upload', request.params['filename']), (err, data) => {
                    if(err)
                        resolve(null)
                    else {
                        console.log("Getting from file")
                        this._fileCache.set(request.params['filename'], data)
                        resolve(data)
                    }    
                })
            }
            else {
                console.log("Getting from cache")
                resolve(streamCache as null)
            }
        })
    }

    upload_stream(request: any, response: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._multer(request, response, err => {
                if(err) {
                    resolve(false)
                }
                else {
                    if (request.file.filename === undefined) {
                        reject(Error("Cannot set filename"))
                    } else
                        fs.readFile(path.join(process.cwd(), 'upload', request.file.filename),'utf8', (err, data) => {
                            if(err) {
                                reject(Error("Unable to read file"))
                            }
                            else {
                                this._fileCache.set(request.file.filename, data)
                                resolve(true)
                            }
                        })
                }
            })
        })
    }
}