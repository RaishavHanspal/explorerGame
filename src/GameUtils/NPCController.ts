import { BaseGameScene } from "../Scene/BaseGameScene";

export class NPCController{
    constructor(private NPC: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
        private isBoss: any,
        private bgContainer: Phaser.GameObjects.Container, private extraBG: Phaser.GameObjects.Image,
        private scene: BaseGameScene, private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody){}
}