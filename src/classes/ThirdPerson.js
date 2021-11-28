import jt from 'jstrig';
import {degreesToRadians, radiansToDegrees} from '../utils/Utilities.js';
export default class ThirdPerson{
    constructor(player, camera){
        this.player = player;
        this.camera = camera;
        this.angleOffset = -20;
        this.distanceToPlayer = 12;
    }
    reposition(){
        this.camera.position.x = jt.orbit(this.player.position.x, this.distanceToPlayer, radiansToDegrees(this.player.rotation.y) + this.angleOffset, jt.OrbitType.COS);
        this.camera.position.z = jt.orbit(this.player.position.z, this.distanceToPlayer, radiansToDegrees(this.player.rotation.y) + this.angleOffset, jt.OrbitType.SIN);
        this.camera.rotation.y = degreesToRadians(jt.angle({x: this.camera.position.x, y: this.camera.position.z}, {x: this.player.position.x, y: this.player.position.z})) * -1;
    }
}