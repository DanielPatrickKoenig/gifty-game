import {ControllerTypes} from './BaseController';
import CustomMeshController from './CustomMeshController';
import RigManager from '../RigManager';
import ModelLoader from '../ModelLoader';
import Navigator from '../Navigator';

export default class CharacterController extends CustomMeshController{
    constructor(data, glbFile, startPosition){
        super(data, glbFile, startPosition);
        this.navigator = null;
        this.rigManager = null;
    }
    async loadModel (){
        const model = await new ModelLoader(this.glbFile).load();
        this.scene.add(model);
        model.rotateY(-180 * (Math.PI/180));
        this.modelLoaded(model);
    }
    update(){
        if(this.navigator){
            const onFloor = this.physics && this.physics.onFloor(this.navigator.physicsBody);
            if(this.rigManager.currentState === 'idle' && onFloor){
                this.navigator.idle();
            }
            this.navigator.syncToBody();
        }
    }
    modelLoaded(model){
        this.rigManager = new RigManager({
            model,
            camera: this.camera, 
            scene: this.scene
        });
        this.navigator = new Navigator(model, .1, this.environment, this.startPosition);
    }
    getControllerType(){
        return [ControllerTypes.CHARACTER];
    }
    move(){
        this.rigManager.currentState = 'moving';
        this.navigator.moveForward();
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
    space(){
        this.navigator.jump();
    }
    setState(state){
        if(this.rigManager){
            this.rigManager.currentState = state;
        }
        
    }
}