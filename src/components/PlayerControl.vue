<template>
  <div
    class="controls"
    ref="controls"
    @keydown.space="onSpace"
    @keydown.down="forward"
    @keydown.up="backward"
    @keyup.down="stop"
    @keyup.up="stop"
    @keydown.left="onLeftDown"
    @keydown.right="onRightDown"
    @keyup.left="onLeftUp"
    @keyup.right="onRightUp"
    @mousedown="mouseDown"
    @mousemove="mouseMove"
    @mouseup="mouseUp"
    @touchstart="mouseDown"
    @touchmove="mouseMove"
    @touchend="mouseUp"
    tabindex="-1"
  >
    sup
  </div>
</template>

<script>
import { processPointerEvent } from '../utils/Utilities';
export default {
    props: {
        startDirection:{
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            direction: this.startDirection,
            turnSpeed: 1,
            moveSpeed: 1,
            dragging: false,
            dragStart: {x:0,y:0},
            lastPosition: null,
            isMobile: false,
        }
    },

    methods: {
        updateDirection(direction){
            // console.log('direction');
            this.$emit('direction-change', this.turnSpeed * direction);
        },
        move(reverse){
            // console.log('move');
            this.$emit('move', this.moveSpeed*(reverse ? -1 : 1));
        },
        stop(){
            // console.log('stop');
            this.$emit('stop');
        },
        onSpace () {
            this.$emit('space');
        },
        onLeftDown () {
            // this.$emit('space');
            this.direction-=this.turnSpeed;
            this.updateDirection(-1);
        },
        onRightDown () {
            // this.$emit('space');
            this.direction+=this.turnSpeed;
            this.updateDirection(1);
        },
        onLeftUp () {
            // this.$emit('space');
            // this.direction-=this.turnSpeed;
            this.updateDirection(0);
        },
        onRightUp () {
            // this.$emit('space');
            // this.direction+=this.turnSpeed;
            this.updateDirection(0);
        },
        forward(){
            this.move();
        },
        backward(){ 
            this.move(true);
        },
        mouseDown(e){
            const mobile = e.touches && e.touches.length;
            this.isMobile = mobile;
            if(mobile){
                e.preventDefault();
            }
            this.$emit('pov-start', { mobile });
            this.dragStart = processPointerEvent(e);
            this.dragging = true;
        },
        mouseMove(e){
            if(this.dragging){
                const lp = this.lastPosition ? this.lastPosition : this.dragStart;
                const position = processPointerEvent(e);

                if(e.touches && e.touches.length){
                     if(position.x < lp.x){
                        this.updateDirection(1);
                    }
                    else if(position.x > lp.x){
                        this.updateDirection(-1);
                    }
                    this.lastPosition = position;
                }
                else{
                    this.$emit('pov-change', {x:this.dragStart.x-position.x,y:this.dragStart.y-position.y});
                }
                // console.log({x:this.dragStart.x-e.clientX,y:this.dragStart.y-e.clientY});
            }
            
            
        },
        mouseUp(){
            this.dragging = false;
            if(this.isMobile){
                this.updateDirection(0);
                this.lastPosition = null;
                this.$emit('pov-end', { mobile: this.isMobile });
            }
        }
    },
    mounted(){
        // console.log(this.$refs.controls);
        this.$refs.controls.focus();
    }
}
</script>

<style>
.controls{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
}
</style>