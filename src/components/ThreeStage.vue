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

        const navigator = new Navigator(model, .1);
        this.navigator = navigator;
        // this.$refs.stage.addEventListener('click', () => {
        //     console.log('clickd');
        //     navigator.forward2D();
        //     tp.reposition();
        // });

        const rm = new RigManager({
            model, 
            renderer: this.env.renderer, 
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
        console.log(rm);
        // const rightLeg = this.env.selector(model, [{type: 'Bone'}, {name: 'rightLeg'}])[0];
        // const leftLeg = this.env.selector(model, [{type: 'Bone'}, {name: 'leftLeg'}])[0];
        // setRotation(rightLeg, 'z', -30);
        // setRotation(leftLeg, 'z', 30);
        // rightLeg.rotateOnAxis ( new THREE.Vector3( 0,0,1), degreesToRadians(-30) );
        // leftLeg.rotateOnAxis ( new THREE.Vector3( 0,0,1), degreesToRadians(30) );
        // rightLeg.rotateZ(degreesToRadians(-30));
        // leftLeg.rotateZ(degreesToRadians(30));
        this.env.render();
    }
}
</script>

<style>

</style>