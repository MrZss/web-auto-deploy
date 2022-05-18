class logger {
    constructor() {
        this.list = []
    }

    add(msg) {
        this.list.push(msg)
        // scrollBottom()
    }

    get() {
        return this.list
    }

    clear() {
        this.list = []
    }
}


export default new logger();