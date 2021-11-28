<template>
    <div>
        <div ref="stage" />
        <button>Move</button>
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
export default {
    data () {
        return {
            env: null
        };
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

        const groundTex = new THREE.TextureLoader().load( 'https://danielpatrickkoenig.github.io/spirit-of-kovak/dist/dirt_row.png' );
        const groundMat = new THREE.MeshBasicMaterial( { map: groundTex } );
        const groundGeo = new THREE.PlaneGeometry( 50, 50 );
        const ground = new THREE.Mesh( groundGeo, groundMat );
        this.env.scene.add( ground );
        ground.rotation.x = degreesToRadians(-90);

        const navigator = new Navigator(model, .1);
        this.$refs.stage.addEventListener('click', () => {
            console.log('clickd');
            navigator.forward2D();
            tp.reposition();
        });

        const rm = new RigManager({
            model, 
            renderer: this.env.renderer, 
            camera: this.env.camera, 
            scene: this.env.scene
        });
        
        rm.currentState = 'walking';
        
        rm.cycle('rightLeg', 'z', [{value:-30, time:.5}, {value:30, time:.5}], ['walking', 'carying']);
        rm.cycle('leftLeg', 'z', [{value:30, time:.5}, {value:-30, time:.5}], ['walking', 'carying']);
        rm.cycle('rightLeg', 'z', [{value:0, time:.5}], ['idle']);
        rm.cycle('leftLeg', 'z', [{value:0, time:.5}], ['idle']);
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