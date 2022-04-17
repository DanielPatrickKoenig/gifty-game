const ControllerTypes = {
    NORMAL: 0,
    PLAYER: 1,
    CHARACTER: 2
}
export default class BaseController{
    constructor({environment}){
        this.environment = environment;
        this.camera = this.environment.camera;
        this.scene = this.environment.scene;
        this.renderer = this.environment.renderer;
        this.physics = this.environment.physics;
        this.items = {};
        this.controllerID = `${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}`;
        this.register();
        this.init();
    }
    init(){
        
    }

    register(){
        this.environment.registerController(this);
    }
    unregister(){
        this.environment.unregisterController(this);
    }
    getControllerType(){
        return ControllerTypes.NORMAL;
    }
    addItem(name, item){
        this.items[name] = item;
    }
    update(){

    }
}
export {ControllerTypes};