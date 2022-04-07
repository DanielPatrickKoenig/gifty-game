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
            @pov-end="onPovEnd"
            @space="onSpace"
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
        };
    },
    methods: {
        onMove(){
            this.rm.currentState = 'walking';
            
            // this.navigator.forward2D();
            this.navigator.moveForward();
            
        },
        onDirectionChange(change){
            
            if(change<0){
                this.navigator.turnLeft();
            }
            else if(change>0){
                this.navigator.turnRight();
            }
            else{
                this.navigator.stopTurning();
            }
            this.navigator.turn(change);
        },
        onMoveStop(){
            this.rm.currentState = 'idle';
            this.navigator.stopMoving();
        },
        onPovStart(e){
            this.povBase = this.tp.angleOffset;
            if(e.mobile){
                this.rm.currentState = 'walking';
                this.navigator.mobileMoving = true;
            }
            
        },
        onPovEnd(e){
            if(e.mobile){
                this.rm.currentState = 'idle';
                this.navigator.mobileMoving = false;
            }
        },
        onPovChange(e){
            this.tp.angleOffset =this.povBase + e.x;
            this.tp.reposition();
        },
        onSpace(){
            this.navigator.jump();
        },
        renderLoop(){
            this.env.render();
            const loopProps = {n:0};
            TweenLite.to(loopProps, 1, {
                n:1,
                onUpdate:() => {
                    this.env.render();
                    const onFloor = this.env.physics && this.env.physics.onFloor(this.navigator.physicsBody);
                    console.log(onFloor);
                    if(this.rm.currentState === 'idle' && onFloor){
                        this.navigator.idle();
                    }
                    this.navigator.syncToBody();
                    this.tp.reposition();
                },
                onComplete: this.renderLoop
            });
        }
    },
    async mounted(){
        this.env = new Environment3d(this.$refs.stage, {width: 1000, height: 700, gravity: -5});
        this.env.cameraContainer.position.z = 12;
        this.env.cameraContainer.position.y = 10;
        this.env.camera.rotation.x = degreesToRadians(-15);

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
        const ground = this.env.createPlane({size: {x: 50, y: 50, z: 0}, rotation: { x: -90, y: 0, z: 0 }, mass: 0, material: groundMat, orientation: { x: 1, y: 0, z: 0 } });
        this.env.physics.floors.push(ground.body);

        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        this.env.createBox({size: {x: 2, y: 2, z: 2}, position: { x: 5, y: 8, z: 0 }, mass: 1, material });
        
        this.env.createBox({size: {x: 2, y: 2, z: 2}, position: { x: 5.8, y: 12, z: 0 }, mass: 1, material });
        this.env.createSphere({size: {r: 1}, position: { x: -4, y: 12, z: 0 }, mass: 1, material });
        
        const navigator = new Navigator(model, .1, this.env);
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
        

        
    }
}
</script>

<style>

</style>