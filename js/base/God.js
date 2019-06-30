import * as THREE from "../libs/three";
import "../libs/controls/OrbitControls";

let ctx = canvas.getContext('webgl');

export default class God {
    constructor() {
        this.renderer = this.initRender();
        this.scene = this.initScene();
        // this.camera = this.initPerspectiveCamera();
        this.camera = this.initOrthographicCamera();
        // this.ambientLight = this.initAmbientLight();
        // this.spotLight = this.initSpotLight([0, 2, 2]);
        this.DirectionalLight = this.initDirectionalLight([0, 2, 2]);
        this.DirectionalLight = this.initDirectionalLight([1, 0, 2]);
        // this.controler = this.initControls();

    }

    initRender() {

        // alpha - canvas是否包含alpha (透明度)。默认为 false
        // antialias - 是否执行抗锯齿。默认为false.
        // precision - highp高精度贴图.
        let renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            precision: 'highp',
            context: ctx,
            canvas: canvas
        });

        renderer.setSize(window.innerWidth, window.innerHeight);

        // 设置颜色及其透明度
        renderer.setClearColor(new THREE.Color(0xcccccc));

        renderer.setClearAlpha(1);

        // 开启阴影
        renderer.shadowMap.enabled = true;

        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
        renderer.setPixelRatio(window.devicePixelRatio);

        // 开启vr
        // renderer.vr.enabled = true;
        // // vr按钮
        // document.body.appendChild( WEBVR.createButton( renderer ) );

        document.body.appendChild(renderer.domElement);

        return renderer;

    }

    initScene() {
        return new THREE.Scene();
    }

    initOrthographicCamera() {
        let width = window.innerWidth;
        let height = window.innerHeight;

        height = 1.7 * (
            height / width);
        width = 1.7;

        let camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 1000);

        camera.position.set(-1, 1.5, 2);

        camera.lookAt(new THREE.Vector3(0.2, 0, 0));

        return camera;
    }

    initPerspectiveCamera() {
        let aspect = window.innerWidth / window.innerHeight;

        let camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);

        camera.position.set(-2, 2, 2);

        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera;

        // let cameras = [];
        // let aspect = window.innerWidth / window.innerHeight;
        //
        // let camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        //
        // camera.viewport = new THREE.Vector4(5, 5, 5, 5);
        //
        // camera.position.x = 0;
        // camera.position.y = 0;
        // camera.position.z = 5;
        //
        // camera.position.multiplyScalar(2);
        // camera.updateMatrixWorld();
        //
        // camera.lookAt(new THREE.Vector3(0, 0, 0));
        //
        // cameras.push(camera);
        // cameras.push(camera);
        // let arrayCamera = new THREE.ArrayCamera(cameras);
        // arrayCamera.position.z = 3;
        // return arrayCamera;
    }

    initAmbientLight() {
        // 自然光
        let ambientLight = new THREE.AmbientLight(0xffffff, 2);

        this.scene.add(ambientLight);

        return ambientLight;
    }

    initSpotLight([x, y, z]) {

        //聚光灯光源
        let spotLight = new THREE.SpotLight(0xffffff, 5, 10);

        spotLight.position.set(x, y, z);

        //告诉光需要开启阴影投射
        spotLight.castShadow = true;

        //pointLight.shadow.radius = 1;

        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.mapSize.width = 2048;

        this.scene.add(spotLight);

        return spotLight;

    }

    initDirectionalLight([x, y, z]) {

        //灯光源
        let DirectionalLight = new THREE.DirectionalLight(0xffffff, 5, 10);

        DirectionalLight.position.set(x, y, z);

        //告诉光需要开启阴影投射
        DirectionalLight.castShadow = true;

        //pointLight.shadow.radius = 1;

        DirectionalLight.shadow.mapSize.height = 2048;
        DirectionalLight.shadow.mapSize.width = 2048;

        this.scene.add(DirectionalLight);

        return DirectionalLight;

    }

//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
    initControls() {

        let controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        // 使动画循环使用时阻尼或自转 意思是否有惯性

        controls.enableDamping = true;

        //动态阻尼系数 就是鼠标拖拽旋转灵敏度

        //controls.dampingFactor = 0.25;

        //是否可以缩放

        controls.enableZoom = true;

        //是否自动旋转

        controls.autoRotate = false;

        //设置相机距离原点的最近距离

        controls.minDistance = 2;

        //设置相机距离原点的最远距离

        controls.maxDistance = 10;

        //是否开启右键拖拽

        controls.enablePan = true;

        // 如果使用animate方法时，将此函数删除

        //controls.addEventListener( 'change', render );

        return controls;

    }
}
