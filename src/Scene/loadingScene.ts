import { Scene } from "phaser";
import { animations } from "../PositionData/config";

export class loadingScene extends Scene {
    progressBar: Phaser.GameObjects.Rectangle;
    progressBox: Phaser.GameObjects.Rectangle;
    loadingText: Phaser.GameObjects.Text;
    bg: Phaser.GameObjects.Sprite;
    bgContainer: Phaser.GameObjects.Container;
    constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    /** should load these images before setting the scene */
    public preload() {
        this.startLoadingProgress();
        this.load.setBaseURL('./Assets');
        this.load.image("BG_02", "BackGrounds/BG_02.png").on("complete", () => {
            this.bg = this.add.sprite(0, 0, "BG_02");
            this.bg.setOrigin(0);
            this.bgContainer && this.bgContainer.add(this.bg);
        }, this);
        this.load.image("BG_01", "BackGrounds/BG_01.png");
        this.load.image("BG_03", "BackGrounds/BG_03.png");
        animations.forEach((anim: any) => {
            for (let i = 0; i <= anim.frameCount; i++)
                this.load.image(`${anim.name}_${i}`, `Characters/0/${anim.name}/${anim.name}_${i}.png`)
        });
    }

    /** starts the loading process with preload */
    private startLoadingProgress(): void {
        this.bgContainer = this.add.container(0, 0);
        this.progressBar = this.add.rectangle(190, 280, 0, 30, 0xff00ff, 1);
        this.progressBox = this.add.rectangle(630, 280, 900, 50, 0x222222, 0.8);
        this.progressBox.setOrigin(0.5);
        // Adds loading percentage text
        this.loadingText = this.make.text({
            x: 640,
            y: 355,
            text: '0%',
            style: {
                font: '30px Arial',
                color: '#ffffff'
            }
        });
        this.loadingText.setOrigin(0.5, 0.5);
        this.load.on('progress', (value: number) => {
            this.progressBar.width = 880 * value;
            this.loadingText.setText(parseInt(String(value * 100), 10) + '%');
        });
        this.load.on('complete', this.onLoadComplete, this);
    }

    public onLoadComplete() {
        console.log("All assets loaded");
        this.progressBar.destroy();
        this.loadingText.destroy();
        this.tweens.add({
            targets: this.progressBox, scaleX: 0.25, ease: 'Power1', duration: 1000,
            onComplete: (tween) => {
                this.progressBox.setInteractive();
                this.progressBox.on("pointerup", this.onTapToPlayPressed, this);
            }
        });
    }

    /** after the preload is completed this should initialize and align the loaded assets */
    public create() { }

    private onTapToPlayPressed(): void {
        this.progressBox.removeInteractive();
        this.progressBox.off("pointerup");
        this.progressBox.destroy();
        this.bg.destroy();
        this.children.removeAll();
        this.scene.start("BaseGame");
        this.scene.stop("default");
    }
}