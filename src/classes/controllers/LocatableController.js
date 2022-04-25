import BaseController, {ControllerTypes} from './BaseController';
import { getDistance } from '../../utils/THREEHelpers';
export default class LocatableController extends BaseController{
    constructor(data, startPosition){
        super(data);
        this.startPosition = startPosition;
    }
    getControllerType(){
        return ControllerTypes.CUSTOM_MESH;
    }
    location(){
        return this.startPosition;
    }
    getMinimumDistance(){
        return 1;
    }
    getDistance({x, y, z}){
        return getDistance(this.location, {x, y, z});
    }
}