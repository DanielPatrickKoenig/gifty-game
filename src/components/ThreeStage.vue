<template>
    <div>
        <div ref="stage" />
        <button>Move</button>
        <PlayerControl
            @move="onMove"
            @direction-change="onDirectionChange"
            @stop="onMoveStop"
            @pov-change="onPovChange"
            @pov-start="onPovStart"
        />
    </div>
</template>

<script>
import * as THREE from 'three';
import Environment3d from '../classes/Environment3d';
import ModelLoader from '../classes/ModelLoader.js';
import RigManager from '../classes/RigManager.js';
import Navigator from '../classes/Navigator.js';
import ThirdPerson from '../classes/ThirdPerson.js';
import {degreesToRadians} from '../utils/Utilities.js';
import PlayerControl from './PlayerControl.vue';
import {TweenLite} from 'gsap';
import Physics, {ShapeTypes} from '../classes/Physics.js';
export default {
    components:{
        PlayerControl
    },
    data () {
        return {
            env: null,
            rm: null,
            navigator: null,
            tp: null,
            povBase: 0,
            physics: null
        };
    },
    methods: {
        onMove(){
            this.rm.currentState = 'walking';
            this.tp.reposition();
            this.navigator.forward2D();
            
        },
        onDirectionChange(change){
            this.tp.reposition();
            this.navigator.turn(change);
        },
        onMoveStop(){
            this.rm.currentState = 'idle';
        },
        onPovStart(){
            this.povBase = this.tp.angleOffset;
        },
        onPovChange(e){
            this.tp.angleOffset =this.povBase + e.x;
            this.tp.reposition();
        },
        renderLoop(){
            this.env.render();
            const loopProps = {n:0};
            TweenLite.to(loopProps, 1, {
                n:1,
                onUpdate:() => {
                    this.env.render();
                },
                onComplete: this.renderLoop
            });
            
        }
    },
    async mounted(){
        this.env = new Environment3d(this.$refs.stage, {width: 1000, height: 700});
        this.env.cameraContainer.position.z = 12;
        this.env.cameraContainer.position.y = 10;
        this.env.camera.rotation.x = degreesToRadians(-15);
        // this.env.camera.rotation.y = degreesToRadians(10);

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 ); 
        this.env.scene.add( directionalLight );

        const model = await new ModelLoader('https://danielpatrickkoenig.github.io/three-game-exparament/public/gifty.glb').load();
        this.env.scene.add(model);
        model.rotateY(-135 * (Math.PI/180));
        this.env.render();

        const tp = new ThirdPerson(model, this.env.cameraContainer);
        this.tp = tp;

        this.tp.reposition();

        const groundTex = new THREE.TextureLoader().load( 'https://danielpatrickkoenig.github.io/spirit-of-kovak/dist/dirt_row.png' );
        const groundMat = new THREE.MeshBasicMaterial( { map: groundTex } );
        const groundGeo = new THREE.PlaneGeometry( 50, 50 );
        const ground = new THREE.Mesh( groundGeo, groundMat );
        this.env.scene.add( ground );
        ground.rotation.x = degreesToRadians(-90);

        this.physics = new Physics({ gravity: -5, clock: new THREE.Clock() });
        this.physics.addShape({type: ShapeTypes.PLANE, mass: 0, size: {x: 50, y: 0, z: 50}, position: { x: 0, y: 0, z: 0 }, orientation: { x: 1, y: 0, z: 0 }, mesh: ground});

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y = 8;
        cube.position.x = 5;
        this.env.scene.add( cube );

        this.physics.addShape({type: ShapeTypes.BOX, mass: 1, size: {x: cube.scale.x, y: cube.scale.y, z: cube.scale.z}, position: {x: cube.position.x, y: cube.position.y, z: cube.position.z}, mesh: cube});

        const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
        const material2 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube2 = new THREE.Mesh( geometry2, material2 );
        cube2.position.y = 12;
        cube2.position.x = 5.8;
        this.env.scene.add( cube2 );

        this.physics.addShape({type: ShapeTypes.BOX, mass: 1, size: {x: cube2.scale.x, y: cube2.scale.y, z: cube2.scale.z}, position: {x: cube2.position.x, y: cube2.position.y, z: cube2.position.z}, mesh: cube2});

        const navigator = new Navigator(model, .1);
        navigator.addFloor(ground);
        this.navigator = navigator;

        const rm = new RigManager({
            model,
            camera: this.env.camera, 
            scene: this.env.scene
        });

        this.rm = rm;
        
        rm.currentState = 'idle';
        
        rm.cycle('rightLeg', 'z', [{value:-30, time:.5}, {value:30, time:.5}], ['walking', 'carying']);
        rm.cycle('leftLeg', 'z', [{value:30, time:.5}, {value:-30, time:.5}], ['walking', 'carying']);
        rm.cycle('rightLeg', 'z', [{value:0, time:.5}], ['idle', 'holding']);
        rm.cycle('leftLeg', 'z', [{value:0, time:.5}], ['idle', 'holding']);
        rm.cycle('leftArm', 'z', [{value:-90, time:.5}], ['walking', 'idle']);
        rm.cycle('leftArm', 'y', [{value:0, time:.5}], ['idle']);
        rm.cycle('leftArm', 'y', [{value:-20, time:.5}, {value:20, time:.5}], ['walking']);
        rm.cycle('leftArm', 'y', [{value:90, time:.5}], ['carying', 'holding']);
        rm.cycle('rightArm', 'z', [{value:90, time:.5}], ['walking', 'idle']);
        rm.cycle('rightArm', 'y', [{value:0, time:.5}], ['idle']);
        rm.cycle('rightArm', 'y', [{value:-20, time:.5}, {value:20, time:.5}], ['walking']);
        rm.cycle('rightArm', 'y', [{value:-90, time:.5}], ['carying', 'holding']);
        
        
        this.renderLoop();
        setTimeout(() => {
            this.physics.update();
        },2000);
        

        
    }
}
</script>

<style>

</style>