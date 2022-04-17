import {ControllerTypes} from './BaseController';
import CharacterController from './CharacterController';
import ThirdPerson from '../ThirdPerson';
export default class PlayerController extends CharacterController{
    constructor(data, glbFile, startPosition){
        super(data, glbFile, startPosition);
        this.povBase = 0;
        this.pov = null;
    }
    update(){
        super.update();
        if(this.pov){
            this.pov.reposition();
        }
    }
    getControllerType(){
        return ControllerTypes.PLAYER;
    }
    modelLoaded(model){
        super.modelLoaded(model);
        this.pov = new ThirdPerson(model, this.environment.cameraContainer);
        this.pov.reposition();
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
}