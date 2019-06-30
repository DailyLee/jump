import * as THREE from "../libs/three";

export default class Router {
    constructor() {
        this.init();
    }

    getTargetPosition(target) {
        this.update();
        return new THREE.Vector3(target.x + this.gapX, 1, target.z + this.gapZ)
    }

    init() {
        this.xNum = 0;
        this.zNum = 0;
        this.gapX = 0.8;
        this.gapY = 1;
        this.gapZ = 0;
        this.slopeX = this.gapX / 10;
        this.slopeY = this.gapY / 10;
        this.slopeZ = this.gapZ / 10;
    }

    update() {
        if (this.xNum < 2) {
            let number = Math.random();
            console.log(number)

            this.gapX = number * 0.6 + 0.5;
            this.slopeX = this.gapX / 10;
            if (this.xNum === 0 && this.gapZ !== 0) {
                this.slopeX = 0;
            }
            this.gapZ = 0;
            this.slopeZ = 0;
            this.xNum++;
            if (this.xNum >= 2) {
                this.zNum = 0;
            }
            return
        }
        if (this.zNum < 2) {
            this.gapZ = -(Math.random() * 0.6 + 0.5);
            this.slopeZ = this.gapZ / 10;
            this.gapX = 0;
            if (this.zNum !== 0) {
                this.slopeX = 0;
            }
            this.zNum++;
            if (this.zNum >= 2) {
                this.xNum = 0;
            }
        }
    }

}
