import * as THREE from 'three';
import BaseController from './BaseController';
const LightTypes = {
    DIRECTIONAL: 0,
    AMBIENT: 1,
    POINT: 2
};
export default class LightController extends BaseController{
    constructor(data){
        super(data);
    }
    addLight({type, color, intensity, distance, decay}){
        let light = null;
        switch(type){
            case LightTypes.DIRECTIONAL:{
                light = new THREE.DirectionalLight(color, intensity); 
                break;
            }
            case LightTypes.AMBIENT:{
                light = new THREE.AmbientLight(color); 
                break;
            }
            case LightTypes.POINT:{
                light = new THREE.PointLight(color, intensity, distance, decay); 
                break;
            }
        }
        if(light){
            this.scene.add(light);
        }
        return light;
    }
}
export {LightTypes};