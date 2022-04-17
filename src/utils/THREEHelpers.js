import * as THREE from 'three';
import {degreesToRadians, ShapeTypes, defaultDimensionValues} from './Utilities.js';
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
function createPrimitive({ type, size, position, orientation, mass, physics, material, rotation, scene }){
    let geometry;
    const shapeSize = size ? size : defaultDimensionValues().size;
    const shapePosition = position ? position : defaultDimensionValues().position;
    const shapeOrientation = orientation ? orientation : defaultDimensionValues().orientation;
    const shapeRotation = rotation ? rotation : defaultDimensionValues().rotation;
    switch(type){
        case ShapeTypes.PLANE:{
            geometry = new THREE.PlaneGeometry( shapeSize.x, shapeSize.y );
            break;
        }
        case ShapeTypes.BOX:{
            geometry = new THREE.BoxGeometry( size.x, size.y, size.z );
            break;
        }
        case ShapeTypes.SPHERE:{
            geometry = new THREE.SphereGeometry( size.r );
            break;
        }
        case ShapeTypes.CYLINDER:{
            geometry = new THREE.CylinderGeometry( size.r, size.r, size.h, 32 );
            break;
        }
    }
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = shapePosition.x;
    mesh.position.y = shapePosition.y;
    mesh.position.z = shapePosition.z;
    mesh.rotation.x = degreesToRadians(shapeRotation.x);
    mesh.rotation.y = degreesToRadians(shapeRotation.y);
    mesh.rotation.z = degreesToRadians(shapeRotation.z);
    scene.add(mesh);
    let body;
    if(physics){
        body = physics.addShape({type, mass, size: shapeSize, position: shapePosition, orientation: shapeOrientation, mesh});
    }
    return {mesh, body};
}

function getCollisions(mesh, collidableMeshList){
    const collisionMatrix = [];
    for (let vertexIndex = 0; vertexIndex < mesh.geometry.attributes.position.array.length; vertexIndex++)
    {       
        const localVertex = new THREE.Vector3().fromBufferAttribute(mesh.geometry.attributes.position, vertexIndex).clone();
        const globalVertex = localVertex.applyMatrix4(mesh.matrix);
        const directionVector = globalVertex.sub( mesh.position );

        const ray = new THREE.Raycaster( mesh.position, directionVector.clone().normalize() );
        const collisionResults = ray.intersectObjects( collidableMeshList );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
        {
            collisionMatrix.push(collisionResults);
            // a collision occurred... do something...
        }
    }
    return collisionMatrix;
}
export {setRotation, RotationAxis, getRaycastIntersections, object3DSelector, createPrimitive, getCollisions}