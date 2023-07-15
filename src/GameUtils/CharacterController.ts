import { GameConstants } from "../Constants/Constants";
import { game } from "../PositionData/config";
import { BaseGameScene } from "../Scene/BaseGameScene";
import { TimeUtils } from "../Utilities/TimeUtils";

export class CharacterController {
    private isIdle: boolean = false;
    private singleAction: boolean = false;
    constructor(private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
        private keyboard: any,
        private bgContainer: Phaser.GameObjects.Container, private extraBG: Phaser.GameObjects.Image,
        private scene: BaseGameScene) {
    }

    /** to be invoked in scene class */
    public update() {
        if (this.singleAction) return;
        if (this.keyboard.D.isDown) {
            this.run(true);
        }
        else if (this.keyboard.A.isDown) {
            this.run(false);
        }
        else if (this.keyboard.W.isDown) {
            this.playSingleAction("Jump");
        }
        else if (this.keyboard.F.isDown) {
            this.playSingleAction("Attack");
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
        /** handle condition for animations that are not loaded */
        if((this.scene.anims as any).anims.entries[anim].frames.length === 0) return;
        if (this.singleAction) {
            this.player.playAfterRepeat(anim);
        }
        else if (!this.singleAction) {
            this.player.play(anim);
        }
        if (single) {
            this.singleAction = true;
            const animObj = (this.scene.anims as any).anims.entries[anim];
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
        if (this.isIdle) {
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
}