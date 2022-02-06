import CANNON from 'cannon';
const ShapeTypes = {
    PLANE: 'plane',
    BOX: 'box',
    SPHERE: 'sphere'
}
class Physics{
    constructor({ gravity, clock, onUpdate, scale }){
        this.world = new CANNON.World();
        this.world.gravity.set(0, gravity, 0);
        this.clock = clock;
        this.delta =  null;
        this.shapes = [];
        this.onUpdate = onUpdate;
        this.scale = scale ? scale : .5;

    }
    defaultVectorValues () {
        return {
            size: { x: 1, y: 1, z: 1 },
            position: { x: 0, y: 0, z: 0 },
            orientation: { x: 0, y: 0, z: 0 }
        }
    }
    processVec3({ property, values }){
        const prop = property ? property : 'position';
        let sizeScale = 1;
        if(property === 'size'){
            sizeScale = this.scale;
        }
        return new CANNON.Vec3(
            values.x ? values.x * sizeScale : this.defaultVectorValues()[prop].x * sizeScale,
            values.y ? values.y * sizeScale : this.defaultVectorValues()[prop].y * sizeScale,
            values.z ? values.z * sizeScale : this.defaultVectorValues()[prop].z * sizeScale
        );
    }
    addShape({ type, mass, size, position, orientation, mesh }){
        let shape;
        const sizeVector = this.processVec3({ values: size, property: 'size' });
        switch(type){
            case ShapeTypes.PLANE:{
                shape = new CANNON.Plane(sizeVector);
                break;
            }
            case ShapeTypes.BOX:{
                shape = new CANNON.Box(sizeVector);
                break;
            }
            case ShapeTypes.SPHERE:{
                shape = new CANNON.Sphere(sizeVector);
                break;
            }
        }
        const body = new CANNON.Body({ mass, shape });
        // body.addShape(shape);
        if (position) {
            const positionVector = this.processVec3({ values: position, property: 'position' });
            body.position = positionVector;
            console.log(body.position.y);
        }
        if (orientation) {
            const orientationVector = this.processVec3({ values: orientation, property: 'orientation' });
            body.quaternion.setFromAxisAngle(orientationVector, -Math.PI / 2);
        }
        this.world.addBody(body);
        this.shapes.push({ body, shape, mesh });
    }
    update(){
        requestAnimationFrame(() => {this.update()});
        this.delta = Math.min(this.clock.getDelta(), 0.1);
        if (this.delta > 0) {
            this.world.step(this.delta);
            this.shapes.forEach(item => {
                item.mesh.position.x = item.body.position.x;
                item.mesh.position.y = item.body.position.y;
                item.mesh.position.z = item.body.position.z;
                item.mesh.quaternion.set(
                    item.body.quaternion.x,
                    item.body.quaternion.y,
                    item.body.quaternion.z,
                    item.body.quaternion.w
                )
            });
            if(this.onUpdate){
                this.onUpdate();
            }
            
        }
    }
}

export default Physics;
export { ShapeTypes };