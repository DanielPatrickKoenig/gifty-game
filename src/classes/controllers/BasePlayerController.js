import {ControllerTypes} from './BaseController';
import BaseCharacterController from './BaseCharacterController';
import ThirdPerson from '../ThirdPerson';
export default class BasePlayerController extends BaseCharacterController{
    constructor(data){
        super(data, 'https://danielpatrickkoenig.github.io/three-game-exparament/public/gifty.glb');
        this.pov = null;
    }
    getControllerType(){
        return ControllerTypes.PLAYER;
    }
    move(){
        this.rigManager.currentState = 'moving';
        this.navigator.moveForward();
    }
    modelLoaded(model){
        super.modelLoaded(model);
        this.pov = new ThirdPerson(model, this.environment.cameraContainer);
        this.pov.reposition();
    }
    directionChange(change){
            
        if(change<0){
            this.navigator.turnLeft();
        }
        else if(change>0){
            this.navigator.turnRight();
        }
        else{
            this.navigator.stopTurning();
        }
        this.navigator.turn(change);
    }
    moveStop(){
        this.rigManager.currentState = 'idle';
        this.navigator.stopMoving();
    }
    povStart(e){
        this.povBase = this.pov.angleOffset;
        if(e.mobile){
            this.rigManager.currentState = 'moving';
            this.navigator.mobileMoving = true;
        }
        
    }
    povEnd(e){
        if(e.mobile){
            this.rigManager.currentState = 'idle';
            this.navigator.mobileMoving = false;
        }
    }
    povChange(e){
        this.pov.angleOffset =this.povBase + e.x;
        this.pov.reposition();
    }
    space(){
        this.navigator.jump();
    }
}