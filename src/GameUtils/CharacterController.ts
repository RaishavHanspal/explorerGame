import { Vector } from "matter";
import { GameConstants } from "../Constants/Constants";
import { game } from "../PositionData/config";
import { BaseGameScene } from "../Scene/BaseGameScene";
import { TimeUtils } from "../Utilities/TimeUtils";
import * as nipplejs from 'nipplejs';

export class CharacterController {
    private isIdle: boolean = false;
    private singleAction: boolean = false;
    private nippleJoyStick: nipplejs.JoystickManager;
    private nipplePosition: "up" | "left" | "right" | "center" = "center";
    constructor(private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
        private keyboard: any,
        private bgContainer: Phaser.GameObjects.Container, private extraBG: Phaser.GameObjects.Image,
        private scene: BaseGameScene, private charCode: string) {
        this.initializeNipple();
    }

    /** to be invoked in scene class */
    public update() {
        if (this.singleAction) return;
        console.log((this.scene._gamePad && this.scene._gamePad.A), this.leftStickPosition("right"))
        if (this.keyboard.W.isDown || (this.scene._gamePad && this.scene._gamePad.A)) {
            this.playSingleAction("Jump");
        }
        else if (this.keyboard.F.isDown || (this.scene._gamePad && this.scene._gamePad.X)) {
            this.playSingleAction("Attack");
        }
        else if (this.keyboard.D.isDown || this.leftStickPosition("right") || this.nipplePosition === "right") {
            this.run(true);
        }
        else if (this.keyboard.A.isDown || this.leftStickPosition("left") || this.nipplePosition === "left") {
            this.run(false);
        }
        else {
            this.playIdle();
        }
        this.extraBG.x = (this.bgContainer.x < 0 ? 1 : -1) * game.width;
        (this.bgContainer.x <= -game.width) && (this.bgContainer.x = this.bgContainer.x + game.width);
        (this.bgContainer.x >= game.width) && (this.bgContainer.x = this.bgContainer.x - game.width);
    }

    /** play continuos and static animations using time calculated through framerate */
    private playAnim(anim: string, single?: boolean) {
        const animation: string = `${this.charCode}_${anim}`;
        const animObj: any = (this.scene.anims as any).anims.entries[animation];
        /** handle condition for animations that are not loaded */
        if (animObj.frames.length === 0) return;
        if (this.singleAction) {
            this.player.playAfterRepeat(animation);
        }
        else if (!this.singleAction) {
            this.player.play(animation);
        }
        if (single) {
            this.singleAction = true;
            const time: number = animObj.frames.length / animObj.frameRate;
            TimeUtils.setTimeOut(time * GameConstants.ONE_SECOND, this.scene, () => {
                this.singleAction = false;
                this.playIdle();
            }, this);
        }
    }

    /** handle running animation of the player - move till keys are in pressed state */
    private run(forward?: boolean) {
        this.player.scaleX = (forward ? 1 : -1) * GameConstants.CharacterScale;
        if (this.isIdle) {
            this.playAnim("Run");
        }
        this.isIdle = false;
        this.bgContainer.x += (forward ? -1 : 1) * 10;
    }

    /** use to play animation only to played once for each input */
    private playSingleAction(anim: string): void {
        if (!this.singleAction) {
            this.playAnim(anim, true);
        }
        this.isIdle = false;
    }

    /** play idle animation - this is looping anim - so only need to play after a non idle anim */
    private playIdle(): void {
        if (!this.isIdle) {
            this.playAnim("Idle");
        }
        this.isIdle = true;
    }

    /** initialize nipplejs instance to produce joystick for devices that don't have keyboards */
    private initializeNipple(): void {
        if (document.getElementById('JoyStick') && !document.getElementById('JoyStick').children.length) {
            this.nippleJoyStick = nipplejs.create({
                zone: document.getElementById('JoyStick'),
                mode: 'static',
                position: { bottom: '13%', left: '15%' },
                color: '#FAFAFA',
                dynamicPage: true,
                multitouch: true,
                restOpacity: 0.1,
                lockX: true
            })
            this.nippleJoyStick.on('dir:up', () => {
                this.nipplePosition = "up";
            })
            this.nippleJoyStick.on('dir:left', () => {
                this.nipplePosition = "left";
            })
            this.nippleJoyStick.on('dir:right', () => {
                this.nipplePosition = "right";
            })
            this.nippleJoyStick.on('end', () => {
                this.nipplePosition = "center";
            });
            document.getElementById("nipple-buttons").style.opacity = "1";
            document.getElementById("A-Button-Nipple").addEventListener("click", () => {
                this.playSingleAction("Jump");
            });
            document.getElementById("X-Button-Nipple").addEventListener("click", () => {
                this.playSingleAction("Attack");
            });
        }
    }

    private leftStickPosition(dir: "right" | "left" | "up"): boolean{
        if(this.scene._gamePad && this.scene._gamePad.leftStick){
            let resolve: boolean = false;
            const vector: Vector = this.scene._gamePad.leftStick;
            /** if true will give more preference to Jump then Run */
            let isVerticalMore: boolean = Math.abs(vector.y) >= Math.abs(this.scene._gamePad.leftStick.x);
            switch(dir){
                case "left": {
                    resolve = !isVerticalMore && (vector.x < 0);
                } break;
                case "right": {
                    resolve = !isVerticalMore && (vector.x > 0);
                } break;
                case "up": {
                    resolve = isVerticalMore && (vector.y < 0);
                } break;
            }
            return resolve;
        }
    }
}