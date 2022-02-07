import * as THREE from 'three';
import { Object3D } from 'three';
import {ShapeTypes} from '../utils/Utilities.js';
import {getRaycastIntersections, object3DSelector, createPrimitive} from '../utils/THREEHelpers.js';
import Physics from '../classes/Physics.js';
export default class Environment3d{
    constructor(element, { width, height, background, gravity }){
        const _width = width ? width : 1000;
        const _height = height ? height :  700;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( background | 0xFFFFFF );
        this.cameraContainer = new Object3D();
        this.camera = new THREE.PerspectiveCamera( 75, _width / _height, 0.1, 1000 );
        this.cameraContainer.add(this.camera);
        this.scene.add(this.cameraContainer);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( _width, _height );
        element.appendChild(this.renderer.domElement);
        this.physics = null;
        console.log(this.cameraContainer);
        if(gravity){
            this.physics = new Physics({ gravity, clock: new THREE.Clock() });   
            setTimeout(() => {
                this.physics.update();
            },10);
        }
        
    }
    render(){
        this.renderer.render(this.scene, this.camera);
    }
    rayCastHits({x, y}, objects){
        return getRaycastIntersections({x, y}, objects, this.camera, this.renderer);
    }
    selector(scope, filters) {
        return object3DSelector(scope, filters);
    }
    createPlane({size, orientation, position, mass, material, rotation}){
        return createPrimitive({ type: ShapeTypes.PLANE, size, position, orientation, mass, physics: this.physics, material, rotation, scene: this.scene })
    }
    createBox({size, orientation, position, mass, material, rotation}){
        return createPrimitive({ type: ShapeTypes.BOX, size, position, orientation, mass, physics: this.physics, material, rotation, scene: this.scene })
    }
    createSphere({size, orientation, position, mass, material, rotation}){
        return createPrimitive({ type: ShapeTypes.SPHERE, size, position, orientation, mass, physics: this.physics, material, rotation, scene: this.scene })
    }
}