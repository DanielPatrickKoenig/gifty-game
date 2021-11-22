<template>
  <div ref="stage" />
</template>

<script>
import * as THREE from 'three';
import Environment3d from '../classes/Environment3d';
import ModelLoader from '../classes/ModelLoader.js';
export default {
    data () {
        return {
            env: null
        };
    },
    async mounted(){
        this.env = new Environment3d(this.$refs.stage, {width: 1000, height: 700});
        this.env.camera.position.z = 6;

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); 
        this.env.scene.add( directionalLight );

        const model = await new ModelLoader('https://danielpatrickkoenig.github.io/three-game-exparament/public/testThing.glb').load();
        this.env.scene.add(model);
        this.env.render();
    }
}
</script>

<style>

</style>