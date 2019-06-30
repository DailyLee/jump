import * as THREE from "../libs/three";

export default class Desk {
    constructor(position = { x: 0},color) {
        this.color = color || 0x000000;
        return this.init(position);
    }

    init(position) {
        let boxGeometry = new THREE.BoxBufferGeometry(0.4, 0.2, 0.4);
        //let boxGeometry = new THREE.PlaneBufferGeometry(10, 10, 32, 32);
        // boxGeometry.center();
        let boxMaterial = new THREE.MeshStandardMaterial({ color: this.color });
        //let boxMaterial = new THREE.MeshPhysicalMaterial({ color: 0xcccccc });
        //boxMaterial.emissive = new THREE.Color(0,0,0);
        let box = new THREE.Mesh(boxGeometry, boxMaterial);

        // 设置位置
        box.position.x = position.x;
        box.position.y = position.y || 0.1;

        return box;
    }
}
