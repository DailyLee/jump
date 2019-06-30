import * as THREE from "../libs/three";

export default class Floor {
    constructor() {
        return this.init()
    }

    init() {
        let planeGeometry = new THREE.PlaneBufferGeometry(20, 20, 32, 32);
        //let planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 32, 32);
        // planeGeometry.center();
        let planeMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        //let planeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xcccccc });
        //planeMaterial.emissive = new THREE.Color(0,0,0);
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);

        // 转动平面到水平
        plane.rotation.x = -0.5 * Math.PI;

        // 设置平面位置
        // plane.position.y = box.min.y;

        // 设置阴影
        plane.receiveShadow = true;

        return plane;

    }
}
