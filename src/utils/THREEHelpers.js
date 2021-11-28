import * as THREE from 'three';
import {degreesToRadians} from './Utilities.js';
const RotationAxis = {
    X: 'x',
    Y: 'y',
    Z: 'z'
}
function setRotation(object, axis, value){
    const [x, y, z] = [
        axis.includes(RotationAxis.X) || axis.includes(RotationAxis.X.toUpperCase()) ? 1 : 0,
        axis.includes(RotationAxis.Y) || axis.includes(RotationAxis.Y.toUpperCase()) ? 1 : 0,
        axis.includes(RotationAxis.Z) || axis.includes(RotationAxis.Z.toUpperCase()) ? 1 : 0
    ];
    object.rotateOnAxis ( new THREE.Vector3( x, y, z), degreesToRadians(value) );
}
function getRaycastIntersections({x, y}, objects, camera, renderer){
    const elementX = x - renderer.domElement.getBoundingClientRect().left;
    const elementY = y - renderer.domElement.getBoundingClientRect().top;
    const mousePos = new THREE.Vector2(
        ( elementX / renderer.domElement.getBoundingClientRect().width ) * 2 - 1,
        - ( elementY / renderer.domElement.getBoundingClientRect().height ) * 2 + 1); 
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mousePos, camera);
    return raycaster.intersectObjects(objects);
}
function getDescendantTree (scope, collection){
    if(!collection){
        collection = [];
    }
    collection.push(scope);
    if(scope.children.length){
        for(let i = 0; i < scope.children.length; i++){
            getDescendantTree(scope.children[i], collection);
        }
    }
    return collection;
}
function object3DSelector(scope, filters) {
    if(!filters){
        filters = [];
    }
    if(filters.join){
        return getDescendantTree(scope).filter(item => filters.filter(_item => item[Object.keys(_item)[0]] === _item[Object.keys(_item)[0]]).length === filters.length);
    }
    else{
        return getDescendantTree(scope).filter(item => Object.keys(filters).filter(_item => item[_item] === filters[_item]).length === Object.keys(filters).length);
    }
}
export {setRotation, RotationAxis, getRaycastIntersections, object3DSelector}