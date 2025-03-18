import nodeCache from 'node-cache'

export default abstract class Storage {

    _fileCache = new nodeCache({stdTTL: 60, checkperiod: 120 })

    read_stream(request: any, response: any) {
        throw Error ("Must implement read_stream(stream: string)")
    }

    upload_stream(request: any, response: any) {
        throw Error ("Must implement upload_stream(stream: string)")
    }

}