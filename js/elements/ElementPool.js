export default class ElementPool {
    constructor(max, target) {
        this.target = target
        this.max = max
        this.pool = []
        this.available = 0
    }

    getElement() {
        if (this.available > 0) {
            const shift = this.pool.shift()
            this.recycle(shift)
            this.pool.push(shift)
            return shift
        } else {
            this.pool.push(new this.target())
            if (this.pool.length >= this.max) {
                this.available = this.pool.length - this.max + 1
            }
            return this.pool[this.pool.length - 1]
        }
    }

    getAllElements() {
        let max = this.max
        let elements = []
        while (max > 0) {
            elements.push(this.getElement())
            max--
        }
        return elements
    }

    recycle(item) {

    }

}
