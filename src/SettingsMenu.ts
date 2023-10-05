import Textures from "./Textures";

export default class SettingsMenu{

    private scene: Phaser.Scene;
    private container!: Phaser.GameObjects.Container;
    private checkMark1!: Phaser.GameObjects.Image;
    private checkMark2!: Phaser.GameObjects.Image;
    private checkMark3!: Phaser.GameObjects.Image;
    private open = false;

    get isOpen()
    {
        return this.open;
    }

    constructor(scene: Phaser.Scene) 
    {

        this.scene = scene;
        
        const { width } = scene.scale;

        this.container = scene.add.container(0, width + 460);

        const panel1 = scene.add.image(400, 730, Textures.MenuPanel)
            .setOrigin(0.5, 0.5)
            .setScale(0.85)
            .setAlpha(1)
            .setDepth(1);

        const toggleSound = scene.add.image(120, 280, Textures.CheckBox)
            .setOrigin(0, 0)
            .setScale(1);
        this.checkMark1 = scene.add.image(toggleSound.x + toggleSound.width * 0.5, toggleSound.y + toggleSound.height * 0.5, Textures.Checkmark);
        const chechMark1Text = scene.add.text(this.checkMark1.x + 50, this.checkMark1.y, "LJUD PÅ/AV", { font: "40px VCR" }).setOrigin(0, 0.5);
        

        const toggleFullscreen = scene.add.image(120, 380, Textures.CheckBox)
            .setOrigin(0, 0)
            .setScale(1);
        this.checkMark2 = scene.add.image(toggleFullscreen.x + toggleFullscreen.width * 0.5, toggleFullscreen.y + toggleFullscreen.height * 0.5, Textures.Checkmark);
        const chechMark2Text = scene.add.text(this.checkMark2.x + 50, this.checkMark2.y, "HELSKÄRM PÅ/AV", { font: "40px VCR" }).setOrigin(0, 0.5);
        this.checkMark2.visible = false;

        const toggle3 = scene.add.image(120, 480, Textures.CheckBox)
            .setOrigin(0, 0)
            .setScale(1);
        this.checkMark3 = scene.add.image(toggle3.x + toggle3.width * 0.5, toggle3.y + toggle3.height * 0.5, Textures.Checkmark);
        const chechMark3Text = scene.add.text(this.checkMark3.x + 50, this.checkMark3.y, "DEBUG PHYSICS PÅ/AV", { font: "40px VCR" }).setOrigin(0, 0.5);
        


        const textTop = scene.add.text(200, 200, "INSTÄLLNINGAR", { font: "40px VCR" }).setAlign('center');

        // Create sprite with animation
        const sprite = scene.add.sprite(400, 800, Textures.TutorialTest1).setScale(1);
        // Create animation
        scene.anims.create({
            key: 'animationTest1',
            frames: scene.anims.generateFrameNumbers(Textures.TutorialTest1, { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        sprite.play('animationTest1');


        this.container.add(panel1);
        this.container.add(toggleSound);
        this.container.add(toggleFullscreen);
        this.container.add(toggle3);
        this.container.add(this.checkMark1);
        this.container.add(this.checkMark2);
        this.container.add(this.checkMark3);
        this.container.add(chechMark1Text);
        this.container.add(chechMark2Text);
        this.container.add(chechMark3Text);
        this.container.add(textTop);
        this.container.add(sprite);
        
        toggleSound.setInteractive()
            .on('pointerdown', () => {
                this.toggleSound();
        });
        toggleFullscreen.setInteractive()
            .on('pointerdown', () => {
                this.toggleFullscreen();
        });
        toggle3.setInteractive()
            .on('pointerdown', () => {
                this.toggle3();
        });

            
    }

    private toggleSound()
    {
        this.checkMark1.visible = !this.checkMark1.visible;

        this.scene.sound.mute = !this.scene.sound.mute;
    }
    private toggleFullscreen()
    {
        this.checkMark2.visible = !this.checkMark2.visible;

        this.scene.scale.toggleFullscreen();
    }
    private toggle3()
    {
        this.checkMark3.visible = !this.checkMark3.visible;

        this.scene.physics.world.drawDebug = !this.scene.physics.world.drawDebug;
    }

    show() 
    {
        if (this.open) {
            return
        };
        
        const { width } = this.container.scene.scale;

        this.container.scene.tweens.add({
            targets: this.container,
            y: width - 800,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut
        });

        this.open = true;
    }

    hide() 
    {
        if (!this.open) {
            return
        }

        const { width } = this.container.scene.scale;

        this.container.scene.tweens.add({
            targets: this.container,
            y: width + 460,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut
        });

        this.open = false;
    }


}
