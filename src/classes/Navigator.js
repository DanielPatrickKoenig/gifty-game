import jt from 'jstrig';
import {radiansToDegrees} from '../utils/Utilities.js';
export default class Navigator{
    constructor (mover, speed) {
        this.mover = mover;
        this.speed = speed;
    }
    forward2D(){
        this.move2D(-1);
    }
    backward2D(){
        this.move2D(1);
    }
    move2D(direction) {
        this.mover.position.x = jt.orbit(this.mover.position.x, this.speed * direction, radiansToDegrees(this.mover.rotation.y), jt.OrbitType.COS);
        this.mover.position.z = jt.orbit(this.mover.position.z, this.speed * direction, radiansToDegrees(this.mover.rotation.y), jt.OrbitType.SIN);
    }
}