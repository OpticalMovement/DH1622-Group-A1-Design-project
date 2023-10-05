import Textures from "./Textures";

export default class DebugMenu{

    private scene: Phaser.Scene;
    private container!: Phaser.GameObjects.Container;
    private checkMark!: Phaser.GameObjects.Image;
    private open = false;

    get isOpen()
    {
        return this.open;
    }

    constructor(scene: Phaser.Scene) 
    {

        this.scene = scene;

        
        const { width } = scene.scale;

        this.container = scene.add.container(width, 0);

        const panel = scene.add.image(400, 750, Textures.MenuPanel)
            .setOrigin(0.5, 0.5)
            .setScale(0.85)
            .setAlpha(1)
            .setDepth(2);

        const toggleSound = scene.add.image(100, 200, Textures.CheckBox)
            .setOrigin(0, 0)
            .setScale(1);

        this.checkMark = scene.add.image(toggleSound.x + toggleSound.width * 0.5, toggleSound.y + toggleSound.height * 0.5, Textures.Checkmark);

        const text1 = scene.add.text(this.checkMark.x + 50, this.checkMark.y, "GÖR NÅTT DEBUGIGT", { font: "30px VCR" }).setOrigin(0, 0.5);
        const text2 = scene.add.text(400, 350, "BYT SCEN/TEST", { font: "40px VCR" }).setAlign('center').setOrigin(0.5, 0.5);

        const nextSceneButton = scene.add.image(550, 450, Textures.Right).setOrigin(0.5, 0.5).setScale(0.2);
        nextSceneButton.setInteractive()
            .setFrame(0)
            .setDepth(2)
            .on('pointerover', () => nextSceneButton.setAlpha(0.6))
            .on('pointerout', () => nextSceneButton.setAlpha(1))
            .on('pointerdown', () => nextSceneButton.setAlpha(0.3))
            .on('pointerup', () => { nextSceneButton.setAlpha(1)
                this.nextScene();
        });
        const nextSceneText = scene.add.text(nextSceneButton.x, nextSceneButton.y + 80, "NÄSTA TEST", { font: "25px VCR" }).setOrigin(0.5, 0.5);

        const previousSceneButton = scene.add.image(250, 450, Textures.Left).setOrigin(0.5, 0.5).setScale(0.2);
        previousSceneButton.setInteractive()
            .setFrame(0)
            .setDepth(2)
            .on('pointerover', () => previousSceneButton.setAlpha(0.6))
            .on('pointerout', () => previousSceneButton.setAlpha(1))
            .on('pointerdown', () => previousSceneButton.setAlpha(0.3))
            .on('pointerup', () => { previousSceneButton.setAlpha(1)
                this.previousScene();
        });
        const previousSceneText = scene.add.text(previousSceneButton.x, previousSceneButton.y + 80, "FÖREGÅENDE TEST", { font: "25px VCR" }).setOrigin(0.5, 0.5);



        

        this.container.add(panel);
        this.container.add(toggleSound);
        this.container.add(this.checkMark);
        this.container.add(text1);
        this.container.add(text2);
        this.container.add(nextSceneButton);
        this.container.add(previousSceneButton);
        this.container.add(nextSceneText);
        this.container.add(previousSceneText);
        
        toggleSound.setInteractive()
            .on('pointerdown', () => {
                this.toggleSound();
        });
            
    }

    nextScene()
    {
        // Get all active scenes in the game
        var scenes = this.scene.game.scene.getScenes(true);
        console.log("Active scenes:");
        console.log(scenes);

        // Get the key of the first scene in the array
        var currentSceneKey = scenes[0].scene.key;
    
        // If Preloader is the current scene, then the next scene is Scene1
        if (currentSceneKey === 'PreloadScene') {
            this.scene.scene.start('Scene1');
            // Terminate the Preloader scene
            this.scene.scene.stop('PreloadScene');
        }
        // If Scene1 is the current scene, then the next scene is Scene2
        else if (currentSceneKey === 'Scene1') {
            this.scene.scene.start('Scene2');
            // Terminate the Scene1 scene
            this.scene.scene.stop('Scene1');
        }
        // If Scene2 is the current scene, then the next scene is Scene3
        else if (currentSceneKey === 'Scene2') {
            this.scene.scene.start('Scene3');
            // Terminate the Scene2 scene
            this.scene.scene.stop('Scene2');
        }
        // If Scene3 is the current scene, then the next scene is Scene4
        else if (currentSceneKey === 'Scene3') {
            this.scene.scene.start('Scene4');
            // Terminate the Scene3 scene
            this.scene.scene.stop('Scene3');
        }
        // If Scene4 is the current scene, then the next scene is Scene5
        else if (currentSceneKey === 'Scene4') {
            this.scene.scene.start('Scene5');
            // Terminate the Scene4 scene
            this.scene.scene.stop('Scene4');
        }
        // If Scene5 is the current scene, then the next scene is Scene6
        else if (currentSceneKey === 'Scene5') {
            this.scene.scene.start('Scene6');
            // Terminate the Scene5 scene
            this.scene.scene.stop('Scene5');
        }
        // If Scene6 is the current scene, then the next scene is EndScene
        else if (currentSceneKey === 'Scene6') {
            this.scene.scene.start('EndScene');
            // Terminate the Scene6 scene
            this.scene.scene.stop('Scene6');
        }
        // If EndScene is the current scene, then the next scene is PreloadScene
        else if (currentSceneKey === 'EndScene') {
            this.scene.scene.start('PreloadScene');
            // Terminate the EndScene scene
            this.scene.scene.stop('EndScene');
        }


    }

    previousScene()
    {
        // Get all active scenes in the game
        var scenes = this.scene.game.scene.getScenes(true);
        console.log("Active scenes:");
        console.log(scenes);

        // Get the key of the first scene in the array
        var currentSceneKey = scenes[0].scene.key;

        // If Preloader is the current scene, then the previous scene is EndScene
        if (currentSceneKey === 'PreloadScene') {
            this.scene.scene.start('EndScene');
            // Terminate the Preloader scene
            this.scene.scene.stop('PreloadScene');
        }
        // If Scene1 is the current scene, then the previous scene is PreloadScene
        else if (currentSceneKey === 'Scene1') {
            this.scene.scene.start('PreloadScene');
            // Terminate the Scene1 scene
            this.scene.scene.stop('Scene1');
        }
        // If Scene2 is the current scene, then the previous scene is Scene1
        else if (currentSceneKey === 'Scene2') {
            this.scene.scene.start('Scene1');
            // Terminate the Scene2 scene
            this.scene.scene.stop('Scene2');
        }
        // If Scene3 is the current scene, then the previous scene is Scene2
        else if (currentSceneKey === 'Scene3') {
            this.scene.scene.start('Scene2');
            // Terminate the Scene3 scene
            this.scene.scene.stop('Scene3');
        }
        // If Scene4 is the current scene, then the previous scene is Scene3
        else if (currentSceneKey === 'Scene4') {
            this.scene.scene.start('Scene3');
            // Terminate the Scene4 scene
            this.scene.scene.stop('Scene4');
        }
        // If Scene5 is the current scene, then the previous scene is Scene4
        else if (currentSceneKey === 'Scene5') {
            this.scene.scene.start('Scene4');
            // Terminate the Scene5 scene
            this.scene.scene.stop('Scene5');
        }
        // If Scene6 is the current scene, then the previous scene is Scene5
        else if (currentSceneKey === 'Scene6') {
            this.scene.scene.start('Scene5');
            // Terminate the Scene6 scene
            this.scene.scene.stop('Scene6');
        }
        // If EndScene is the current scene, then the previous scene is Scene6
        else if (currentSceneKey === 'EndScene') {
            this.scene.scene.start('Scene6');
            // Terminate the EndScene scene
            this.scene.scene.stop('EndScene');
        }



    }

    private toggleSound()
    {
        this.checkMark.visible = !this.checkMark.visible;
        var debug = this.scene.game.config.physics.arcade.debug;

        debug = false;
    }

    show() 
    {
        if (this.open) {
            return
        };
        
        const { width } = this.container.scene.scale;

        this.container.scene.tweens.add({
            targets: this.container,
            x: width - 800,
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
            x: width + 800,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut
        });

        this.open = false;
    }


}
