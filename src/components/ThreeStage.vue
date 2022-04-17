<template>
    <div>
        <div ref="stage" />
        
        <PlayerControl
            @move="onMove"
            @direction-change="onDirectionChange"
            @stop="onMoveStop"
            @pov-change="onPovChange"
            @pov-start="onPovStart"
            @pov-end="onPovEnd"
            @space="onSpace"
        />
        <button style="position:relative;" @click="pitch">pitch</button>
    </div>
</template>

<script>
import Environment3d from '../classes/Environment3d';
import {degreesToRadians} from '../utils/Utilities.js';
import PlayerControl from './PlayerControl.vue';
import {TweenLite} from 'gsap';
import BatterUpController from '../classes/controllers/BatterUpController';
import Walker1Controller from '../classes/controllers/Walker1Controller';
import GroundController from '../classes/controllers/GroundController';
import {ControllerTypes} from '../classes/controllers/BaseController';
import LightController, {LightTypes} from '../classes/controllers/LightController';
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
            batterUp: null,
            walker: null
        };
    },
    computed: {
        playerControllers () {
            return this.env.controllers.filter(item => item.type === ControllerTypes.PLAYER).map(item => item.controller);
        },
        controllers () {
            return this.env.controllers.map(item => item.controller);
        }
    },
    methods: {
        onMove(){
            this.playerControllers.forEach(item => item.move());            
        },
        onDirectionChange(change){
            this.playerControllers.forEach(item => item.directionChange(change));
        },
        onMoveStop(){
            this.playerControllers.forEach(item => item.moveStop());
        },
        onPovStart(e){
            this.playerControllers.forEach(item => item.povStart(e));
            
        },
        onPovEnd(e){
            this.playerControllers.forEach(item => item.povEnd(e));
        },
        onPovChange(e){
            this.playerControllers.forEach(item => item.povChange(e));
        },
        onSpace(){
            this.playerControllers.forEach(item => item.space());
        },
        
        renderLoop(){
            this.env.render();
            const loopProps = {n:0};
            TweenLite.to(loopProps, 1, {
                n:1,
                onUpdate:() => {
                    this.env.render();
                    this.controllers.forEach(item => item.update());
                },
                onComplete: this.renderLoop
            });
        },
        pitch(){
            this.batterUp.pitch();
        }
    },
    async mounted(){
        this.env = new Environment3d(this.$refs.stage, {width: 1000, height: 700, gravity: -5});
        this.env.cameraContainer.position.z = 12;
        this.env.cameraContainer.position.y = 10;
        this.env.camera.rotation.x = degreesToRadians(-15);

        const lightController = new LightController({environment: this.env});
        lightController.addLight({type: LightTypes.DIRECTIONAL, color: 0xffffff, intensity: 5});
        
        new GroundController({environment: this.env}, 'https://danielpatrickkoenig.github.io/spirit-of-kovak/dist/dirt_row.png');

        this.batterUp = new BatterUpController({environment: this.env});

        this.walker = new Walker1Controller({environment: this.env});
        
        this.renderLoop();
        

        
    }
}
</script>

<style>

</style>