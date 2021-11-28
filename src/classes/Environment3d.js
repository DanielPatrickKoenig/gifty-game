import * as THREE from 'three';
import { Object3D } from 'three';
import {getRaycastIntersections, object3DSelector} from '../utils/THREEHelpers.js';
export default class Environment3d{
    constructor(element, { width, height, background }){
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
        console.log(this.cameraContainer);
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
}