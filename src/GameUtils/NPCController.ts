import * as config from "../PositionData/config";
import { BaseGameScene } from "../Scene/BaseGameScene";

export class NPCController {
    private currentX: number;
    constructor(private NPC: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
        private isBoss: any,
        private bgContainer: Phaser.GameObjects.Container, private extraBG: Phaser.GameObjects.Image,
        private scene: BaseGameScene, private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, private anim: string) {
        this.currentX = this.NPC.x;
    }

    public update(): void {
        this.NPC.x = this.currentX - this.scene.playerDisplacement;
        if (this.anim === "Walk") {
            if (this.NPC.scaleX < 0 && this.NPC.x > 600) {
                this.currentX -= 2;
            }
            else if (this.NPC.scaleX > 0) {
                this.currentX += 2;
            }
            else if (this.NPC.scaleX < 0) {
                this.NPC.scaleX = -1 * this.NPC.scaleX;
            }
        }
        if(Math.abs(this.NPC.x - this.player.x) > (config.game.width * 2)){
            this.currentX = this.player.x + (config.game.width * 2);
        }
    }
}