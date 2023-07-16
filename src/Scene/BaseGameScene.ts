import { Scene } from "phaser";
import { animations, game } from "../PositionData/config";
import { GameConstants } from "../Constants/Constants";
import { CharacterController } from "../GameUtils/CharacterController";
import { NPCController } from "../GameUtils/NPCController";

export class BaseGameScene extends Scene {
    private bgContainer: Phaser.GameObjects.Container;
    private extraBG: Phaser.GameObjects.Image;
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private characterController: CharacterController;
    private keyboard: any;
    public _gamePad: Phaser.Input.Gamepad.Gamepad;
    private floor: Phaser.GameObjects.Rectangle;
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
        this.floor = this.add.rectangle(0, game.height, game.width, 0, 0xcdcdcd).setOrigin(0, 0.5).setAlpha(0);
        this.physics.add.existing(this.floor, true);
        this.setupAnimations();
        this.player = this.physics.add.sprite(0, -200, "proto0_Idle_0").setOrigin(0.5, 1).setScale(GameConstants.CharacterScale).setCollideWorldBounds(true);
        this.player.play("proto0_Idle");
        this.player.x = GameConstants.CharacterStartX;
        this.input.gamepad && this.input.gamepad.once('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
            //   'pad' is a reference to the gamepad that was just connected
            console.log("Game Pad Connected!");
            this._gamePad = pad;
        });
        this.characterController = new CharacterController(this.player, this.keyboard, this.bgContainer, this.extraBG, this, "proto0");
        this.physics.add.collider(this.player, this.floor);
        // this.sendAntagonist();
    }

    /** @todo: create the antagonist here and have it's target set to the player in action
     * the background and NPC position should be kept separated to better show relative motion
     */
    private sendAntagonist(): void {
        const antagonist = this.physics.add.sprite(1920, 500, "anta0_Idle_0").setOrigin(0.5, 1).setScale(-1, 1).setCollideWorldBounds(true, 1, 0);
        antagonist.play("anta0_Idle");
        new NPCController(antagonist, true, this.bgContainer, this.extraBG, this, this.player);
        this.physics.add.collider(antagonist, this.floor);
    }

    update(time: number, delta: number): void {
        this.characterController.update();
    }

    generateFrames(anim: string, lastframe: number, character: string): Array<any> {
        const frames: Array<any> = [];
        for (let i = 0; i <= lastframe; i++) {
            frames.push({ key: `${character}_${anim}_${i}` });
        }
        return frames;
    }

    /** setup all characters as listed in the config file */
    private setupAnimations(): void {
        for (let character in animations) {
            animations[character].forEach((anim: any) => {
                this.anims.create({
                    key: `${character}_${anim.name}`,
                    frames: this.generateFrames(anim.name, anim.frameCount, character),
                    frameRate: 10,
                    repeat: anim.noloop ? 0 : -1
                });
            });
        }
    }
}