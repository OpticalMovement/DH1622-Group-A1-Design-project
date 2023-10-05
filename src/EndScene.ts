import Phaser from 'phaser'
import Textures from './Textures';
import { EndSceneText } from './Text';

export default class EndScene extends Phaser.Scene {

    // Initialize common scene variables
    rotImage: Phaser.GameObjects.Text;
    totalScore: integer;
    totalScoreText: Phaser.GameObjects.Text;
    scenesScoreText: Phaser.GameObjects.Text[];
    scaleTween: any;
    textStyle: any;

    // Initialize local scene variables
    infoBox: Phaser.GameObjects.Image;
    introText: Phaser.GameObjects.Text; 
    navButtonsEnabled: boolean;
    navLeft: Phaser.GameObjects.Image;
    navRight: Phaser.GameObjects.Image;
    introImage: Phaser.GameObjects.Image;
    introText1: Phaser.GameObjects.Text;
    introText2: Phaser.GameObjects.Text;
    introText3: Phaser.GameObjects.Text;
    shareButton: Phaser.GameObjects.Sprite;
    shareButtonText: Phaser.GameObjects.Text;
    ProceedButton: Phaser.GameObjects.Sprite;
    ProceedButtonText: Phaser.GameObjects.Text;


    constructor() {
        super("EndScene");
    }
    init(): void {
		this.totalScore = this.registry.get('totalScore');
        this.navButtonsEnabled = false;
        // Add background image
        this.infoBox = this.add.image(400, 700, Textures.BackgroundBase);
    }
	create(): void {
        this.textStyle = { font: "30px VCR", fill: "white",  wordWrap: true, wordWrapWidth: this.infoBox.width, align: "center",};
        this.debugText();

        this.textBoxIntro();

        this.toggleNavButtons();

        // Check if UIScene is active with the scenemanager, if not, start it
        if (this.scene.isActive('UIScene') == false) {
            this.scene.run('UIScene');
            console.log("Starting UIScene from EndScene");
        }


    }

    update(): void {
        

        if (this.navButtonsEnabled) {
            this.navButtons();
        }
    }

    displayScore(): void {
        // Display total score in the middle of the screen
        // Animate it as a fade in
        this.totalScoreText = this.add.text(400, 300, "Total poäng: " + this.totalScore, {font: "40px VCR"});
        this.totalScoreText.setScale(1);
        this.totalScoreText.setOrigin(0.5,0.5);
        this.scaleTween = this.tweens.add({
            targets: this.totalScoreText,
            scale: { value: 1, duration: 1000, ease: 'Power1'},
            delay: 10,
            yoyo: false,
            loop: 1
        });
        // Get the score from each scene and displat it in a list
        // Animate it as a fade in
        this.scenesScoreText = [];
        for (let i = 0; i < 6; i++) {
            this.scenesScoreText[i] = this.add.text(400, 400 + (i+1)*50, "Del " + (i+1) + " poäng: " + this.registry.get('scene' + (i+1) + 'Score'), this.textStyle);
            this.scenesScoreText[i].setScale(1);
            this.scenesScoreText[i].setOrigin(0.5,0.5);
            this.scaleTween = this.tweens.add({
                targets: this.scenesScoreText[i],
                scale: { value: 1, duration: 1000, ease: 'Power1'},
                delay: 10,
                yoyo: false,
                loop: 1
            });
        }
        // Add a link to a website with more information with clickable text
        // Animate it as a fade in
        this.introText = this.add.text(400, 800, "Läs mer om pilottesterna på \nwww.forsvarsmakten.se/pilot", this.textStyle);
        this.introText.setScale(1);
        this.introText.setOrigin(0.5,0.5);
        this.introText.setInteractive();
        this.introText.on('pointerdown', () => window.open("https://www.forsvarsmakten.se/pilot", "_blank"));

        this.scaleTween = this.tweens.add({
            targets: this.infoBox,
            y: this.infoBox.y - 5,
            //scale: { value: 1, duration: 1000, ease: 'Power1'},
            delay: 10,
            yoyo: false,
            loop: 1
        });



    }

    startTest(): void{  
        this.infoBox.destroy();
        this.introImage.destroy();
        this.introText2.destroy();
        this.introText3.destroy();
        this.shareButton.destroy();
        this.shareButtonText.destroy();
        this.ProceedButton.destroy();
        this.ProceedButtonText.destroy();
        this.displayScore();
    }

    shareButtonPressed(): void{
        
    }

    textBoxIntro(): void{
        this.infoBox = this.add.image(400, 700, Textures.BackgroundGameIntro);
        this.introImage = this.add.image(400, 650, "gif3");
        this.introText2 = this.add.text(100, 200, EndSceneText.testFinished, {font: "40px VCR"}).setOrigin(0,0.5);
        this.introText3 = this.add.text(100, 300, EndSceneText.introText, {font: "30px VCR"}).setOrigin(0,0.5);
        this.shareButton = this.add.sprite(400, 1110, Textures.GreenBar)
            .setFrame(0)
            .setInteractive()
            .setDepth(1)
            .on('pointerdown', () => { this.shareButton.setFrame(2), this.startTest(); })
            .on('pointerover', () => { this.shareButton.setFrame(1); })
            .on('pointerout', () => { this.shareButton.setFrame(0); });
        this.shareButtonText = this.add.text(400, 1110, EndSceneText.Button1, {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');
        this.ProceedButton = this.add.sprite(400, 1230, Textures.GreenBar)
            .setFrame(0)
            .setInteractive()
            .setDepth(1)
            .on('pointerdown', () => { this.ProceedButton.setFrame(2), this.startTest(); })
            .on('pointerover', () => { this.ProceedButton.setFrame(1); })
            .on('pointerout', () => { this.ProceedButton.setFrame(0); });
        this.ProceedButtonText = this.add.text(400, 1230, EndSceneText.Button2, {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');

    }

    
    debugText(): void {
        // Scene text
	    this.add.text(100, 1200, "Slutscen")
	    this.totalScoreText = this.add.text(100, 1220, "Reg total score: " + this.registry.get('totalScore'));
        
	}


    toggleNavButtons(): void {
        this.input.keyboard.on('keydown-T', () => {
            this.navButtonsEnabled = !this.navButtonsEnabled;
        });  
    }

    navButtons(): void {
		this.navLeft = this.add.image(50,1250,"Left");
		this.navLeft.setScale(0.1);
		this.navLeft.setInteractive();
		this.navLeft.on('pointerdown', this.previousScene, this);
		this.navRight = this.add.image(750,1250,"Right");
		this.navRight.setScale(0.1);
		this.navRight.setInteractive();
		this.navRight.on('pointerdown', this.nextScene, this);
	}

    nextScene(): void {
        this.scene.start("Scene1");
    }
    previousScene(): void {
        this.scene.start("Scene6");
    }
}
