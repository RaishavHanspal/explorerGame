import { Scene } from "phaser";
import { animations, game } from "../PositionData/config";
import { GameConstants } from "../Constants/Constants";
import { CharacterController } from "../GameUtils/CharacterController";

export class BaseGameScene extends Scene {
    private bgContainer: Phaser.GameObjects.Container;
    private extraBG: Phaser.GameObjects.Image;
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private characterController: CharacterController;
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
        this.keyboard = this.input.keyboard.addKeys("W, F, A, D");
        let floor = this.add.rectangle(0, game.height, game.width, 0, 0xcdcdcd).setOrigin(0, 0.5).setAlpha(0);
        this.physics.add.existing(floor, true);
        this.setupAnimations();
        this.player = this.physics.add.sprite(0, -200, "Idle_0").setOrigin(0.5, 1).setScale(GameConstants.CharacterScale).setCollideWorldBounds(true);
        this.player.play("Idle");
        this.player.x = GameConstants.CharacterStartX;
        this.characterController = new CharacterController(this.player, this.keyboard, this.bgContainer, this.extraBG, this);
        this.physics.add.collider(this.player, floor);
    }

    update(time: number, delta: number): void {
        this.characterController.update();
    }

    generateFrames(anim: string, lastframe: number): Array<any> {
        const frames: Array<any> = [];
        for (let i = 0; i <= lastframe; i++) {
            frames.push({ key: `${anim}_${i}` });
        }
        return frames;
    }

    /** setup all characters as listed in the config file */
    private setupAnimations(): void{
        for(let character in animations){
            animations[character].forEach((anim: any) => {
                this.anims.create({
                    key: anim.name,
                    frames: this.generateFrames(anim.name, anim.frameCount),
                    frameRate: 10,
                    repeat: anim.noloop ? 0 : -1
                });
            });
        }
    }
}