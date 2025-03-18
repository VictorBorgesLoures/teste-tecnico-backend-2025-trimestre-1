import MulterStorage from "./multerStorage"

class FileManager {
    constructor() {
        throw Error(`Class ${FileManager.name} cannot be instanciated.`)
    }

    static getInstance() {
        // With different env we can change the instance of the storage
        // const ENV = process.env.ENV
        return new MulterStorage()
    }
}

let fileManagerIntance = FileManager.getInstance()

export default fileManagerIntance

