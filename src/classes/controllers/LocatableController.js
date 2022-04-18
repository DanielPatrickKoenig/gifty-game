import BaseController, {ControllerTypes} from './BaseController';
export default class LocatableController extends BaseController{
    constructor(data, startPosition){
        super(data);
        this.startPosition = startPosition;
        this.loadModel();
    }
    getControllerType(){
        return ControllerTypes.CUSTOM_MESH;
    }
    location(){
        return this.startPosition;
    }
}