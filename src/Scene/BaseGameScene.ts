import { Scene } from "phaser";
import { animations, game } from "../PositionData/config";
import { GameConstants } from "../Constants/Constants";

export class BaseGameScene extends Scene {
    private bgContainer: Phaser.GameObjects.Container;
    private extraBG: Phaser.GameObjects.Image;
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private keyboard: any;
    constructor() {
        super({ key: "BaseGame" });
    }

    /** should load these images before setting the scene  - the things loaded here */
    preload() {
    }

    /** after the preload is completed this should initialize and align the loaded assets */
    create() {
        this.bgContainer = this.add.container(0, 0);
        this.bgContainer.add(this.add.image(0, 0, "BG_01").setScale(1).setOrigin(0));
        this.extraBG = this.add.image(0, 0, "BG_01").setScale(1).setOrigin(0).setPosition(game.width, 0);
        this.bgContainer.add(this.extraBG);
        this.keyboard = this.input.keyboard.addKeys("W, A, S, D");
        let floor = this.add.rectangle(0, game.height, game.width, 200, 0xcdcdcd).setOrigin(0, 0.5).setAlpha(0) ;
        this.physics.add.existing(floor, true);
        animations.forEach((anim: any) => {
            this.anims.create({
                key: anim.name,
                frames: this.generateFrames(anim.name, anim.frameCount),
                frameRate: 10,
                repeat: anim.noloop ? 0: -1
            });
        });
        this.player = this.physics.add.sprite(0,-200,"Idle_0").setScale(GameConstants.CharacterScale).setCollideWorldBounds(true);
        this.player.play("Idle");
        this.player.x = GameConstants.CharacterStartX;
        this.physics.add.collider(this.player, floor);
    }

    private isIdle: boolean = true;
    update(time: number, delta: number): void {
        if (this.keyboard.D.isDown) {
            this.player.scaleX = GameConstants.CharacterScale;
            if(this.isIdle){
                this.player.play("Run");
            }
            this.isIdle = false;
            this.bgContainer.x -= 10;
            this.extraBG.x = (this.bgContainer.x < 0 ? 1 : -1) * game.width;
            (this.bgContainer.x <= -game.width) && (this.bgContainer.x = this.bgContainer.x + game.width);
        }
        else if (this.keyboard.A.isDown) {
            this.player.scaleX = - GameConstants.CharacterScale;
            if(this.isIdle){
                this.player.play("Run");
            }
            this.isIdle = false;
            this.bgContainer.x += 10;
            this.extraBG.x = (this.bgContainer.x < 0 ? 1 : -1) * game.width;
            (this.bgContainer.x >= game.width) && (this.bgContainer.x = this.bgContainer.x - game.width);
        }
        else{
            if(!this.isIdle){
                this.player.play("Idle");
            }
            this.isIdle = true;
        }
    }

    generateFrames(anim: string, lastframe: number): Array<any>{
        const frames: Array<any> = [];
        for(let i = 0; i <= lastframe; i++){
            frames.push({key: `${anim}_${i}`});
        }
        return frames;
    }
}