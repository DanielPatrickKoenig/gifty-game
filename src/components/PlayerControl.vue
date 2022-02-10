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
    tabindex="-1"
  >
    sup
  </div>
</template>

<script>
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
            dragStart: {x:0,y:0}
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
            this.$emit('pov-start');
            this.dragStart={x:e.clientX,y:e.clientY};
            this.dragging = true;
        },
        mouseMove(e){
            if(this.dragging){
                this.$emit('pov-change', {x:this.dragStart.x-e.clientX,y:this.dragStart.y-e.clientY});
                // console.log({x:this.dragStart.x-e.clientX,y:this.dragStart.y-e.clientY});
            }
            
            
        },
        mouseUp(){
            this.dragging = false;
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