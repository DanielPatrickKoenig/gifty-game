import jt from 'jstrig';
import {radiansToDegrees, degreesToRadians} from '../utils/Utilities.js';
export default class Navigator{
    constructor (mover, speed) {
        this.mover = mover;
        this.speed = speed;
        this.floors = [];
        this.walls = [];
    }
    forward2D(){
        this.move2D(-1);
    }
    backward2D(){
        this.move2D(1);
    }
    move2D(direction) {
        // console.log(this.mover.position.y);
        console.log(this.floors[0]);
        this.mover.position.x = jt.orbit(this.mover.position.x, this.speed * direction, radiansToDegrees(this.mover.rotation.y), jt.OrbitType.COS);
        this.mover.position.z = jt.orbit(this.mover.position.z, this.speed * direction, radiansToDegrees(this.mover.rotation.y), jt.OrbitType.SIN);
    }
    turn(rotation){
        this.mover.rotation.y+=degreesToRadians(rotation);
    }
    jump(){
        
    }
    addFloor(floor){
        this.floors.push(floor);
    }
}