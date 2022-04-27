<template>
    <svg style="width: 500px; height: 500px; display:block;">
        <g class="base-paths">
            <path
                v-for="(p, i) in paths"
                :key="`path-${i}`"
                :d="p.path"
                fill="transparent"
                stroke="#000000"
            />
        </g>
        <g v-if="calculatedPath">
            <circle r="4" :cx="calculatedPath.start.x * scale"  :cy="calculatedPath.start.z * scale" fill="#000000" />
            <circle r="4" :cx="calculatedPath.end.x * scale"  :cy="calculatedPath.end.z * scale" fill="#000000" />
        </g>
    </svg>
</template>

<script>
import JunctionController from '../classes/controllers/JunctionController';
export default {
    props:{
        jc: {
            type: JunctionController,
            required: true
        }
    },
    data(){
        return {
            scale: 10
        };
    },
    computed:{
        paths () {
            const groupedPaths = this.jc.getPaths();
            return Object.keys(groupedPaths).map(item => {
                const points = groupedPaths[item].map(_item => _item.point);
                return { points, path: `M${points.map((_item, _index) => `${_index ? 'L' : ''}  ${_item.x * this.scale}  ${_item.z * this.scale}`)}` };
            });
        },
        calculatedPath(){
            return this.jc.pathToPoint({x: 21, y: 0, z: 31});
            // return this.jc.pathToPoint({x: 19, y: 0, z: 12});
        }
    }
}
</script>

<style lang="scss" scoped>
.base-paths{
    path{
        &:nth-child(1){
            stroke: #cc0000;
        }
        &:nth-child(2){
            stroke: #00cc00;
        }
        &:nth-child(3){
            stroke: #0000cc;
        }
        &:nth-child(4){
            stroke: #cc00cc;
        }
        &:nth-child(5){
            stroke: #00cccc;
        }
        &:nth-child(6){
            stroke: #cccc00;
        }
    }
    
}
</style>