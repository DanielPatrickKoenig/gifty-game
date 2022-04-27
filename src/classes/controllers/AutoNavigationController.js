import jt from 'jstrig';
import LocatableController from "./LocatableController";
export default class AutoNavigationController extends LocatableController{
    constructor(data, path, character){
        super(data, path[0]);
        this.character = character;
        this.path = path;
        this.pathIndex = 0;
        this.paused = false;
    }
    location(){
        return this.path[this.pathIndex];
    }
    getMinimumDistance(){
        return .5;
    }
    update(){
        if(this.paused){
            this.character.moveStop();
        }
        else if(this.character && this.character.location() && !this.insideThreshold(this.character)){
            const characterLocation = this.character.location();
            const angle = jt.angle({x: this.location().x, y: this.location().z}, {x: characterLocation.x, y: characterLocation.z});
            this.character.navigator.setRotation(angle, true);
            this.character.move(-1);
        }
        else if(this.pathIndex < this.path.length - 1){
            this.pathIndex++;
        }
        else{
            this.character.moveStop();
        }
        
    }
}