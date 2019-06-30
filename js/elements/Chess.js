import * as THREE from "../libs/three";

export default class Chess {
    constructor(position = { x: 0,y:0.4},color) {
        this.color = color || 0xff0000;
        return this.init(position);
    }

    init(position) {
        let cylinderGeometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.2, 8 );
        let cylinderMaterial = new THREE.MeshStandardMaterial({ color: this.color });
        let cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

        // 设置位置
        cylinder.position.x = position.x;
        cylinder.position.y = position.y || 0.1;

        return cylinder;
    }
}
