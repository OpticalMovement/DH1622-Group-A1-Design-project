import Phaser from 'phaser'
import { GlobalFunctions } from './Globals';
import Textures from './Textures';
import { Scene1Text } from './Text';
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

export default class Scene1 extends Phaser.Scene {

    // Initialize common scene variables
    navButtonsEnabled: boolean;
    navLeft: Phaser.GameObjects.Image;
    navRight: Phaser.GameObjects.Image;
    totalScore: integer;
	scene1Score: integer;
    totalScoreText: Phaser.GameObjects.Text;
	sceneScoreText: Phaser.GameObjects.Text;
    infoBox: Phaser.GameObjects.Image;
    introText1: Phaser.GameObjects.Text;
    introText2: Phaser.GameObjects.Text;
    introText3: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    textStyle: any;
    scaleTween: any;
    ProceedButton: Phaser.GameObjects.Image;
    ProceedButtonText: Phaser.GameObjects.Text;
    scoreBoxHolder: Phaser.GameObjects.Container;

    // Initialize local scene variables
    timedEvent: any;
    randomAlphaDelay: integer;
    Button1: Phaser.GameObjects.Image;
    Button2: Phaser.GameObjects.Image;
    Button3: Phaser.GameObjects.Image;
    Button4: Phaser.GameObjects.Image;
    firstRun: boolean;
    lastRun: boolean;
    quizHolder: Phaser.GameObjects.Image;
    answerBox1: Phaser.GameObjects.Sprite;
    activeQuestion: integer;
    introImage: Phaser.GameObjects.Image;
    quizPosition: integer[];

    constructor() {
        super("Scene1");
    }
    init(): void {
        this.scene1Score = 0;
        this.totalScore = this.registry.get('totalScore');
        this.infoBox = this.add.image(-100, -100, "infoBox");
        this.firstRun = true;
        this.lastRun = false;
        this.activeQuestion = 0;
        this.navButtonsEnabled = false;
        this.quizPosition = [400, 770];
    }
    create(): void {
        this.textStyle = { font: "30px VCR", fill: "white",  wordWrap: true, wordWrapWidth: this.infoBox.width, align: "center",};

		this.add.image(400, 700, Textures.BackgroundGame).setScale(1).setDepth(0);

        this.scoreBox();
        this.toggleNavButtons();
        
        // The quizHandler is the container for the quiz and initalized in textBoxIntro()
        this.textBoxIntro();
        
        //this.createCountdown(60);

        // Check if UIScene is active with the scenemanager, if not, start it
        if (this.scene.isActive('UIScene') == false) {
            this.scene.run('UIScene');
            console.log('Starting UIScene from Scene1');
        }

    }

    update(): void {
        if (this.navButtonsEnabled) {
            this.navButtons();
        }
        
    }

    createQuizButtons(): void{
        this.Button1 = this.add.image(175, 1160, "answerBox")
            .setInteractive()
            .setAlpha(0.01)
            .on('pointerdown', () => {this.Button1.setAlpha(0.6) , this.checkScore(1)})
            .on('pointerover', () => this.Button1.setAlpha(0.3))
            .on('pointerup', () => this.Button1.setAlpha(0.3))
            .on('pointerout', () => this.Button1.setAlpha(0.01));

        this.Button2 = this.add.image(325, 1160, "answerBox")
            .setInteractive()
            .setAlpha(0.01)
            .on('pointerdown', () => {this.Button2.setAlpha(0.6) , this.checkScore(2)})
            .on('pointerover', () => this.Button2.setAlpha(0.3))
            .on('pointerup', () => this.Button2.setAlpha(0.3))
            .on('pointerout', () => this.Button2.setAlpha(0.01));

        this.Button3 = this.add.image(475, 1160, "answerBox")
            .setInteractive()
            .setAlpha(0.01)
            .on('pointerdown', () => {this.Button3.setAlpha(0.6) , this.checkScore(3)})
            .on('pointerover', () => this.Button3.setAlpha(0.3))
            .on('pointerup', () => this.Button3.setAlpha(0.3))
            .on('pointerout', () => this.Button3.setAlpha(0.01));

        this.Button4 = this.add.image(624, 1160, "answerBox")
            .setInteractive()
            .setAlpha(0.01)
            .on('pointerdown', () => {this.Button4.setAlpha(0.6) , this.checkScore(4)})
            .on('pointerover', () => this.Button4.setAlpha(0.3))
            .on('pointerup', () => this.Button4.setAlpha(0.3))
            .on('pointerout', () => this.Button4.setAlpha(0.01));
    }

    quizHandler(currentQuiz: integer): void{
        if (this.firstRun == false) {
            this.destroyQuizButtons();
        }
        if (this.quizHolder != null) {
            this.quizHolder.destroy();
        }
        if (currentQuiz == 0) {
            //Empty
        }
        else if (currentQuiz == 1){
            this.quizHolder = this.add.image(this.quizPosition[0], this.quizPosition[1], "quiz1");
        } 
        else if (currentQuiz == 2){
            this.quizHolder = this.add.image(this.quizPosition[0], this.quizPosition[1], "quiz2");
        } 
        else if (currentQuiz == 3){
            this.quizHolder = this.add.image(this.quizPosition[0], this.quizPosition[1], "quiz3");
        } 
        else if (currentQuiz == 4){
            this.quizHolder = this.add.image(this.quizPosition[0], this.quizPosition[1], "quiz4");
        }
        else if (currentQuiz == 5){
            this.quizHolder = this.add.image(this.quizPosition[0], this.quizPosition[1], "quiz5");
        }
        else if (currentQuiz == 6){
            this.quizHolder = this.add.image(this.quizPosition[0], this.quizPosition[1], "quiz6");
        }
        else if (currentQuiz == 7){
            this.quizHolder = this.add.image(this.quizPosition[0], this.quizPosition[1], "quiz7");
        }
        else if (currentQuiz == 8){
            this.lastRun = true;
            this.textBoxOutro();
        }
        this.scaleTween = this.tweens.add({
            targets: this.quizHolder,
            y: this.quizHolder.y + 5,
            scale: { value: 1, duration: 50, ease: 'Power1'},
            delay: 1,
            yoyo: false,
            loop: 0
        });
        // Wait until tween is complete then add buttons, check if last run
        if (this.lastRun == false) {
            this.scaleTween.on('complete', () => {
                if (this.firstRun == false) {
                    this.createQuizButtons();
                    console.log("Quiz buttons created");
                }
            });
        }
        this.firstRun = false;
    }

    destroyQuizButtons(): void {
        this.Button1.destroy();
        this.Button2.destroy();
        this.Button3.destroy();
        this.Button4.destroy();
    }

    createCountdown(seconds: integer): void {
        let timeLeft = seconds;
        let timeText = this.add.text(500, 1200, `Time left: ${timeLeft}`, { font: "30px FM-Regular" });
    
        // Set a timed event
        let timedEvent = this.time.addEvent({
            delay: 1000,                // ms
            callback: onEvent,
            callbackScope: this,
            loop: true
        });
    
        function onEvent() {
            timeLeft -= 1;  // Decrease the time left
            timeText.setText(`Time left: ${timeLeft}`);  // Update the time text
    
            // If time's up, stop the event
            if(timeLeft <= 0) {
                timedEvent.remove();
                timeText.setText('Time is up!');
            }
        }
    }

    startTest(): void{
        this.infoBox.destroy();
        this.introText1.destroy();
        this.introText2.destroy();
        this.introText3.destroy();
        this.introImage.destroy();
        this.ProceedButton.destroy();
        this.ProceedButtonText.destroy();
        this.activeQuestion = 1;
        this.quizHandler(this.activeQuestion);
    }

    textBoxIntro(): void{
        this.infoBox = this.add.image(400, 700, Textures.BackgroundGameIntro);
        const tutorialAnimation = this.anims.create({
            key: 'playTest1',
            frames: this.anims.generateFrameNumbers(Textures.ImageTest1, { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });
        this.introImage = this.add.sprite(400, 700, Textures.ImageTest1).play('playTest1').setScale(2.5);
        
        this.introText1 = this.add.text(100, 150, Scene1Text.testNumber, {font: "25px VCR"}).setAlign('left').setOrigin(0,0.5);
        this.introText2 = this.add.text(100, 200, Scene1Text.introLabel, {font: "45px VCR"}).setAlign('left').setOrigin(0,0.5);
        this.introText3 = this.add.text(100, 300, Scene1Text.introText, {font: "30px VCR"}).setAlign('left').setOrigin(0,0.5);
        this.ProceedButton = this.add.sprite(400, 1180, Textures.GreenBar)
			.setFrame(0)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => { this.ProceedButton.setFrame(2), this.startTest(); })
			.on('pointerover', () => { this.ProceedButton.setFrame(1); })
			.on('pointerout', () => { this.ProceedButton.setFrame(0); });
		this.ProceedButtonText = this.add.text(400, 1180, Scene1Text.startTestText, {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');


    }

    textBoxOutro(): void{
        this.destroyQuizButtons();
        this.infoBox = this.add.image(400, 700, Textures.BackgroundGameOutro);
        this.introText1 = this.add.text(100, 240, Scene1Text.outroText1, {font: "40px VCR"}).setOrigin(0,0.5).setAlign('left');
        this.introText2 = this.add.text(100, 430, Scene1Text.outroText2, this.textStyle).setOrigin(0,0.5).setAlign('left');
        this.introText3 = this.add.text(100, 460, Scene1Text.outroText3, this.textStyle).setOrigin(0,0.5).setAlign('left');
        this.scoreText = this.add.text(100, 330, this.scene1Score + " POÄNG", {font: "80px VCR"}).setOrigin(0,0.5).setAlign('left');
        this.ProceedButton = this.add.sprite(400, 1180, Textures.GreenBar)
			.setFrame(0)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => { this.ProceedButton.setFrame(2), this.nextScene(); })
			.on('pointerover', () => { this.ProceedButton.setFrame(1); })
			.on('pointerout', () => { this.ProceedButton.setFrame(0); });
		this.ProceedButtonText = this.add.text(400, 1180, "TILL NÄSTA TEST", {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');
    }

    checkScore(answer: number) {
        console.log(answer);
        let correct = false;
        if (this.activeQuestion == 1) {
            if (answer == 1) {
                this.addScore();
                correct = true;
            }
        }
        if (this.activeQuestion == 2) {
            if (answer == 4) {
                this.addScore();
                correct = true;
            }
        }
        if (this.activeQuestion == 3) {
            if (answer == 3) {
                this.addScore();
                correct = true;
            }
        }
        if (this.activeQuestion == 4) {
            if (answer == 1) {
                this.addScore();
                correct = true;
            }
        }
        if (this.activeQuestion == 5) {
            if (answer == 1) {
                this.addScore();
                correct = true;   
            }
        }
        if (this.activeQuestion == 6) {
            if (answer == 2) {
                this.addScore();
                correct = true;   
            }
        }
        if (this.activeQuestion == 7) {
            if (answer == 3) {
                this.addScore();
                correct = true;   
            }
        }
        if (correct == false) {
            this.updateScore();
        }
        
    }

    addScore(): void {
        this.scene1Score += 1;
		this.totalScore += 1;
        this.registry.set('scene1Score', this.scene1Score);
		this.registry.set('totalScore', this.totalScore);
        this.updateScore();
    }

    updateScore(): void {
        this.sceneScoreText.setText("POÄNG: " + this.registry.get('scene1Score'));
		this.totalScoreText.setText("TOTALT: " + this.registry.get('totalScore'))
        this.activeQuestion += 1;
        this.quizHandler(this.activeQuestion);
    }

    scoreBox(): void {
        this.scoreBoxHolder = this.add.container(400, -150);
        const scoreBoxImage = this.add.image(0, 0, Textures.ScoreBox).setOrigin(0.5, 0.5).setScale(1.05).setDepth(2);
        this.sceneScoreText = this.add.text(-200, -3, "POÄNG: " + this.registry.get('scene1Score'), {font: "28px VCR"})
            .setOrigin(0, 1).setDepth(3).setAlign('left');
        this.totalScoreText = this.add.text(-200, 27, "TOTALT: " + this.registry.get('totalScore'), {font: "28px VCR"})
            .setOrigin(0, 1).setDepth(3).setAlign('left');
        this.scoreBoxHolder.add(scoreBoxImage);
        this.scoreBoxHolder.add(this.sceneScoreText);
        this.scoreBoxHolder.add(this.totalScoreText);

        // Add tween to scoreBoxHolder
        this.scaleTween = this.tweens.add({
            targets: this.scoreBoxHolder,
            y: this.scoreBoxHolder.y + 215,
            scale: { value: 1, duration: 50, ease: 'Power1'},
            delay: 1,
            yoyo: false,
            loop: 0
        });
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
        this.scene.start("Scene2");
    }

    previousScene(): void {
        this.scene.start("PreloadScene");
    }

}