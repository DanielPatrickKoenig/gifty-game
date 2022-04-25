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
        <JunctionTester 
            v-if="ready"
            :jc="junction" 
        />
    </div>
</template>

<script>
import Environment3d from '../classes/Environment3d';
import PlayerControl from './PlayerControl.vue';
import {TweenLite} from 'gsap';
import BatterUpController from '../classes/controllers/BatterUpController';
import Walker1Controller from '../classes/controllers/Walker1Controller';
import Walker2Controller from '../classes/controllers/Walker2Controller';
import GroundController from '../classes/controllers/GroundController';
import {ControllerTypes} from '../classes/controllers/BaseController';
import LightController, {LightTypes} from '../classes/controllers/LightController';
import JunctionController from '../classes/controllers/JunctionController';
import {POVModes} from '../classes/POVManager';

import JunctionTester from './JunctionTester.vue';
export default {
    components:{
        PlayerControl,
        JunctionTester
    },
    data () {
        return {
            env: null,
            batterUp: null,
            walker: null,
            junction: null,
            ready: false
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
        onMove(e){
            console.log(e);
            this.playerControllers.forEach(item => item.move(e));            
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
                    // console.log(this.junction.getDistance(this.walker.location()));
                },
                onComplete: this.renderLoop
            });
        },
        pitch(){
            this.batterUp.pitch();
        }
    },
    mounted(){
        this.env = new Environment3d(this.$refs.stage, {width: 1000, height: 700, gravity: -5, pov: POVModes.ISOMETRIC});

        const lightController = new LightController({environment: this.env});
        lightController.addLight({type: LightTypes.DIRECTIONAL, color: 0xffffff, intensity: 5});
        
        new GroundController({environment: this.env}, 'https://danielpatrickkoenig.github.io/spirit-of-kovak/dist/dirt_row.png');

        this.batterUp = new BatterUpController({environment: this.env});

        this.walker = new Walker1Controller({environment: this.env});

        this.walker2 = new Walker2Controller({environment: this.env});

        this.junction = new JunctionController({environment: this.env}, {x: -12, y: 0, z: 16}, this.walker2);
        this.junction.addPath([{x: 9, y: 0, z: 5}, {x: 12, y: 0, z: 8}, {x: 14, y: 0, z: 8}, {x: 14, y: 0, z: 12}, {x: 19, y: 0, z: 12}]);
        this.junction.addPath([{x: 14, y: 0, z: 6}, {x: 14, y: 0, z: 8}, {x: 12, y: 0, z: 8}, {x: 7, y: 0, z: 19}, {x: 12, y: 0, z: 19}, {x: 16, y: 0, z: 17}]);
        this.junction.addPath([{x: 12, y: 0, z: 16}, {x: 12, y: 0, z: 19}, {x: 10, y: 0, z: 26}]);
        // this.junction.pathToPoint({x: 7, y: 0, z: 19});
       
       this.ready = true;

        this.renderLoop();
        

        
    }
}
</script>

<style>

</style>