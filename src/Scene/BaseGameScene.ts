import { Scene } from "phaser";

export class BaseGameScene extends Scene{
    constructor(){
        super({key: "BaseGame"});
    }
    
    /** should load these images before setting the scene  - the things loaded here */
    preload() {
    }

    /** after the preload is completed this should initialize and align the loaded assets */
    create(){
        this.add.image(0, 0, "baseGameBG").setScale(2);
    }
}