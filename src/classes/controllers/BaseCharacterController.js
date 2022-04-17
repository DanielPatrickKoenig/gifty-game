import BaseController, {ControllerTypes} from './BaseController';
import RigManager from '../RigManager';
import ModelLoader from '../ModelLoader';
import Navigator from '../Navigator';

export default class BaseCharacterController extends BaseController{
    constructor(data, glbFile){
        super(data);
        this.glbFile = glbFile;
        this.navigator = null;
        this.loadModel();
    }
    async loadModel (){
        console.log(this.glbFile);
        const model = await new ModelLoader(this.glbFile).load();
        this.scene.add(model);
        model.rotateY(-180 * (Math.PI/180));
        this.rigManager = new RigManager({
            model,
            camera: this.camera, 
            scene: this.scene
        });
        this.modelLoaded(model);
    }
    modelLoaded(model){
        this.navigator = new Navigator(model, .1, this.environment);
    }
    getControllerType(){
        return ControllerTypes.CHARACTER;
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