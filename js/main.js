import God from './base/God.js';
import Floor from './elements/Floor.js';
import * as THREE from "./libs/three";
import DeskPool from "./elements/DeskPool";
import Chess from "./elements/Chess";
import TWEEN from './libs/tween.min';
import Router from "./base/Router";

/**
 * 游戏主函数
 */
export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        this.aniId = 0;

        // this.gapX = 0.8;
        // this.gapY = 1;
        // this.cameraSlopeX = this.gapX / 10;
        // this.deskSlopeY = this.gapY / 10;
        this.god = new God();
        this.router = new Router();
        // this.god.scene.add(new Floor());

        this.start();
    }

    createDesks() {
        this.god.scene.dispose();

        this.deskPool = this.deskPool || new DeskPool(3);
        let desk1 = this.deskPool.getElement();
        let desk2 = this.deskPool.getElement();

        desk1.material.color = new THREE.Color(0xffffff);
        desk2.material.color = new THREE.Color(0xfff000);


        desk1.position.copy(new THREE.Vector3(0, 0, 0));
        desk2.position.copy(new THREE.Vector3(this.router.gapX, 0, 0));

        this.god.scene.add(desk1);
        this.god.scene.add(desk2);
        this.newDesk = desk2;

    }

    createChess() {
        this.chess = this.chess || new Chess();
        this.chess.position.copy(new THREE.Vector3(0, 0.2, 0));
        this.god.scene.add(this.chess);
    }

    start() {
        this.router.init();
        this.createDesks();
        this.createChess();

        //辅助工具
        // let boxHelper = new THREE.BoxHelper(this.newDesk, 0xff0000);
        // let axesHelper = new THREE.AxesHelper(50);
        // let cameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);

        // 将辅助线添加到场景当中
        // this.god.scene.add(boxHelper);
        // this.god.scene.add(cameraHelper);
        // this.god.scene.add(axesHelper);


         this.initCameraAndLight();

        this.point = 0;

        this.bindLoop = this.loop.bind(this);

        canvas.removeEventListener(
            'touchstart',
            this.bindTouchStartHandler
        );

        canvas.removeEventListener(
            'touchend',
            this.bindTouchEndHandler
        );

        this.bindTouchStartHandler = this.touchStartHandler.bind(this);
        this.bindTouchEndHandler = this.touchEndHandler.bind(this);

        canvas.addEventListener(
            'touchstart',
            this.bindTouchStartHandler
        );

        canvas.addEventListener(
            'touchend',
            this.bindTouchEndHandler
        );

        // 清除上一局的动画
        window.cancelAnimationFrame(this.aniId);

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }

    initCameraAndLight() {
        this.god.camera.position.set(-1, 1.5, 2);
        this.god.DirectionalLight.position.set(0, 2, 2);
    }

    touchStartHandler() {
        if (this.newDesk.position.y !== 0) return;

        this.touchStart = new Date().getTime();
    }

    touchEndHandler() {
        const destination = this.calculatePosition(new Date().getTime() - this.touchStart);
        const target = { x: this.chess.position.x, y: this.chess.position.y, z: this.chess.position.z, angle: 0 };

        const tweenX = new TWEEN.Tween(target).to(
            {
                x: (
                    destination.x),
                z: (
                    destination.z),
                angle: (
                    Math.PI + target.angle),
            }, 500);
        tweenX.easing(TWEEN.Easing.Sinusoidal.InOut);
        tweenX.onUpdate(() => {
            this.updateChessPosition(target);
        });

        const tweenY = new TWEEN.Tween(target).to(
            {
                y: (
                    destination.y),
            }, 250);
        tweenY.easing(TWEEN.Easing.Sinusoidal.InOut);
        tweenY.onUpdate(() => {
            this.chess.position.y = target.y;
        }).onComplete(() => {
            const target = { y: this.chess.position.y };

            const tweenY = new TWEEN.Tween(target).to(
                {
                    y: (
                        0.2),
                }, 250);
            tweenY.easing(TWEEN.Easing.Sinusoidal.InOut);
            tweenY.onUpdate(() => {
                this.chess.position.y = target.y;
            });
            tweenY.start()
        });

        tweenX.start();
        tweenY.start();

        setTimeout(() => {
            if (!this.checkResult(destination)) return;
            this.updateNewDesk();
        }, 850);

    }

    checkResult(position) {
        const _this = this;
        let resultX = position.x < this.newDesk.position.x + 0.2 && position.x > this.newDesk.position.x - 0.2;
        let resultZ = position.z < this.newDesk.position.z + 0.2 && position.z > this.newDesk.position.z - 0.2;
        let result = resultX && resultZ;
        if (!result) {
            wx.showModal({
                title: '游戏结束，确定重新开始？',
                content: `得分：${this.point}`,
                success(res) {
                    if (res.confirm) {
                        _this.start();
                    } else if (res.cancel) {
                        _this.start();
                        console.log('用户点击取消')
                    }
                }
            });
        } else {
            this.point++;
        }
        return result;
    }

    calculatePosition(time) {
        const slope = time / 400;
        const { x, y ,z} = this.chess.position;
        let position = { x: x + this.router.gapX * slope, y: y + slope * 0.5 , z: z + this.router.gapZ * slope};
        if (this.router.gapX === 0) {
            position.x  =this.newDesk.position.x;
        }

        if (this.router.gapZ === 0) {
            position.z  =this.newDesk.position.z;
        }

        return position
    }


    updateChessPosition(target) {
        this.chess.position.x = target.x;
        this.chess.position.z = target.z;
        let quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), target.angle);
        this.chess.quaternion.copy(quaternion);
    }

    updateNewDesk() {
        let position = this.newDesk.position;
        let desk = this.deskPool.getElement();
        this.god.scene.remove(desk);
        let targetPosition = this.router.getTargetPosition(position);
        desk.position.copy(targetPosition);
        this.newDesk = desk;
        this.god.scene.add(this.newDesk);
    }

    update() {
        if (this.newDesk && this.newDesk.position.y > 0) {
            this.updateNewDeskPosition();
            this.updateCameraAndLight();
        }
    }

    updateNewDeskPosition() {
        if (this.newDesk.position.y - this.router.slopeY < 0) {
            this.newDesk.position.y = 0;
            return
        }
        this.newDesk.position.y -= this.router.slopeY;
    }

    updateCameraAndLight() {
        this.god.camera.position.x += this.router.slopeX;
        this.god.camera.position.z += this.router.slopeZ;
        // this.god.DirectionalLight.position.x += this.router.slopeX;
    }

    render() {
        // 渲染
        this.god.renderer.render(this.god.scene, this.god.camera);
    }


    // 实现游戏帧循环
    loop() {
        // 通过TWEEN更新动画
        TWEEN.update();
        this.update();
        this.render();

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
