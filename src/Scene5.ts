import Phaser from 'phaser'
import Textures from './Textures';
import { Scene5Text } from './Text';

export default class Scene5 extends Phaser.Scene {

    // Initialize common scene variables
    rotImage: Phaser.GameObjects.Text;
    totalScore: integer;
    scene5Score: integer;
    totalScoreText: Phaser.GameObjects.Text;
    sceneScoreText: Phaser.GameObjects.Text;
    scaleTween: any;
    textStyle: any;

    // Initialize local scene variables
    infoBox: Phaser.GameObjects.Image;
    introText1: Phaser.GameObjects.Text; 
    introText2: Phaser.GameObjects.Text;
    introText3: Phaser.GameObjects.Text;
    navButtonsEnabled: boolean;
    navLeft: Phaser.GameObjects.Image;
    navRight: Phaser.GameObjects.Image;
    boxes: Phaser.Physics.Arcade.Group;
    triggerZone: Phaser.GameObjects.Zone;
    timer: Phaser.Time.TimerEvent;
    boxCount: integer;
    boxCountText: Phaser.GameObjects.Text;
    boxCountTween: any;
    boxInZoneTime: integer;  
    guess: integer;
    radarBG: Phaser.GameObjects.Image;
    timeIsUp: boolean;
    timeLeft: number;
    timedEvent: any;
    timeText: Phaser.GameObjects.Text;
    instructionText: Phaser.GameObjects.Text;
	currentSequence: number[] = [];
	sequenceInputDisplay: Phaser.GameObjects.Text;
	showingSequence = true;
	buttons = new Array(10);
	buttonText = new Array(10);
	submitButton: Phaser.GameObjects.Image;
	submitButtonText: Phaser.GameObjects.Text;
	deleteButton: Phaser.GameObjects.Image;
	deleteButtonText: Phaser.GameObjects.Text;
    introImage: Phaser.GameObjects.Image;
    ProceedButton: Phaser.GameObjects.Sprite;
	ProceedButtonText: Phaser.GameObjects.Text;


    constructor() {
        super("Scene5");
    }
    init(): void {

        this.scene5Score = 0;
		this.totalScore = this.registry.get('totalScore');
        this.navButtonsEnabled = false;
        this.infoBox = this.add.image(-100, -100, "infoBox");
        this.boxCount = 0;
    }
	create(): void {
        this.textStyle = { font: "30px VCR", fill: "white",  wordWrap: true, wordWrapWidth: this.infoBox.width, align: "center",};

        //Add background image
        this.add.image(400, 700, Textures.BackgroundGame);

        this.debugText();

        this.textBoxIntro();

        this.toggleNavButtons();

        this.boxes = this.physics.add.group();

        // Check if UIScene is active with the scenemanager, if not, start it
        if (this.scene.isActive('UIScene') == false) {
            this.scene.run('UIScene');
            console.log('Starting UIScene from Scene5');
        }
    
    }

    update(): void {
        // Check the boxes position and count them if they are below the y: 820
        this.boxes.children.each((box: any) => {
            if (box.y > 830 && !box.counted) {
                this.countBox(box);
                // Change color of the box to green
                box.setTint(0x00ff00);
            }
            // Added a return true to avoid typescript error
            return true;
        });

        if (this.navButtonsEnabled) {
            this.navButtons();
        }
    }

    updateTimer(): void {
        this.timeLeft -= 1;  // Decrease the time left
        this.timeText.setText(`Time left: ${this.timeLeft}`);  // Update the time text
        console.log(this.timeLeft);

        // If time's up, stop the event
        if(this.timeLeft <= 0) {
            this.timedEvent.remove();
            this.timeText.setText('Time is up!');
            this.timeIsUp = true;
            this.endGame();
        }
    }


    createCountdown(seconds: integer): void {
        this.timeLeft = seconds;
        this.timeText = this.add.text(600, 100, `Time left: ${this.timeLeft}`, { font: "30px Helvetica" });
    
        // Set a timed event
        this.timedEvent = this.time.addEvent({
            delay: 1000,                // ms
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });    
    }

    spawnBox (): void{
        // Spawn a box at a random x position above the screen with a random velocity downwards
        // Give it a name so we can count them
        let box = this.boxes.create(Phaser.Math.Between(0, 800), -100, 'gripen');
        box.setName('box' + this.boxCount);
        box.setScale(0.5);
        box.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(100, 400));
        box.setCollideWorldBounds(true);
        box.setBounce(1);
        // Give them white color
        box.setTint(0xffffff);
        // Make them spin
        box.setAngularVelocity(300);
        // Make them collide with each other
        this.physics.add.collider(this.boxes, this.boxes);
        
        



        // Make them disappear after 20 seconds
        this.time.addEvent({
            delay: 20000, // 20 seconds
            callback: box.destroy,
            callbackScope: box,
            loop: false
        });
 
  
    }

    countBox(box: any): void {
        box.counted = true; // Mark the box as counted
        this.boxCount++;
        console.log(this.boxCount);
    }

    boxInZoneTimer(): void {
        // Add time to boxInZoneTime constantly
        /*
        this.boxInZoneTime++;
        console.log(this.boxInZoneTime);
        */
    }


    endGame(): void {
        // Stop the game and let the player input their guess.
        this.physics.pause();
        // Destroy all boxes
        this.boxes.children.each((box: any) => {
            box.destroy();
            // Added a return true to avoid typescript error
            return true;
        });
        // Destroy the trigger zone
        this.triggerZone.destroy();
        this.timeText.destroy();
        this.timedEvent.destroy();
        this.radarBG.destroy();
        //this.graphics.destroy();

        // Show buttons for submitting guess
        this.generateButtons();



        // Calculate score based on how close guess is to actual count
        let score = Math.max(0, 100 - Math.abs(this.guess - this.boxCount));
            
        console.log(`Game Over! Your score is ${score}`);

    }

    displayInstructions(): void {
		// Create a text with instructions
		this.instructionText = this.add.text(400, 200, 'HUR MÅNGA PASSAGER?\nTRYCK SEDAN ENTER', {font: "30px Helvetica"});
		this.instructionText.setOrigin(0.5, 0.5);
		this.instructionText.setWordWrapWidth(600);
		this.instructionText.setAlign('center');
	}		

	hideInstructions(): void {
		this.instructionText.destroy();
	}

    submitClick(): void {
		// Check if input sequence is showing
		if (this.sequenceInputDisplay != null) {
			this.sequenceInputDisplay.destroy();
		}
		this.addScore(this.checkAnswer(this.currentSequence));

		this.deleteButtons();
		this.hideInstructions();
		this.currentSequence = [];
        this.textBoxOutro();
	}

    checkAnswer(input: number[]): number {
		console.log("Checking answer" + input);
    	// Convert the input to a number
        let inputNumber = parseInt(input.join(''));
        console.log(inputNumber);
        // Check if the input is correct and how close it is to the actual count
        let score = Math.max(0, 20 - Math.abs(inputNumber - this.boxCount));
        console.log(`Game Over! Your score is ${score}`);
        return score;

	}

    generateButtons(): void {
		this.displayInstructions();
		this.deleteButton = this.add.image(500, 750, "answerBox")
			.setInteractive()
			.setAlpha(0.01)
			.on('pointerdown', () => {this.deleteButton.setAlpha(0.6); this.deleteButtonAction();})
			.on('pointerover', () => this.deleteButton.setAlpha(0.3))
			.on('pointerup', () => this.deleteButton.setAlpha(0.3))
			.on('pointerout', () => this.deleteButton.setAlpha(0.01));
		this.deleteButtonText = this.add.text(500, 750, "DEL", {font: "60px FM-Regular", align: 'center'}).setOrigin(0.5, 0.5);
		this.submitButton = this.add.image(300, 750, "answerBox")
			.setInteractive()
			.setAlpha(0.01)
			.on('pointerdown', () => {this.submitButton.setAlpha(0.6); this.submitClick();})
			.on('pointerover', () => this.submitButton.setAlpha(0.3))
			.on('pointerup', () => this.submitButton.setAlpha(0.3))
			.on('pointerout', () => this.submitButton.setAlpha(0.01));
		this.submitButtonText = this.add.text(300, 750, "ENT", {font: "60px FM-Regular", align: 'center'}).setOrigin(0.5, 0.5);
		for(let i = 0; i < 10; i++) {
			if (i<5) {
				this.buttons[i] = this.add.image(100 + 150*i, 900, "answerBox")	
					.setInteractive()
					.setAlpha(0.01)
					.on('pointerdown', () => {this.buttons[i].setAlpha(0.6); this.buttonClick(i);})
					.on('pointerover', () => this.buttons[i].setAlpha(0.3))
					.on('pointerup', () => this.buttons[i].setAlpha(0.3))
					.on('pointerout', () => this.buttons[i].setAlpha(0.01));
				// add text to the button
				this.buttonText[i] = this.add.text(100 + 150*i, 900, i.toString(), {font: "60px FM-Regular", align: 'center'}).setOrigin(0.5, 0.5);
			} else {
				this.buttons[i] = this.add.image(100 + 150*(i-5), 1100, "answerBox")
					.setInteractive()
					.setAlpha(0.01)
					.on('pointerdown', () => {this.buttons[i].setAlpha(0.6); this.buttonClick(i);})
					.on('pointerover', () => this.buttons[i].setAlpha(0.3))
					.on('pointerup', () => this.buttons[i].setAlpha(0.3))
					.on('pointerout', () => this.buttons[i].setAlpha(0.01));
				// add text to the button
				this.buttonText[i] = this.add.text(100 + 150*(i-5), 1100, i.toString(), {font: "60px FM-Regular", align: 'center'}).setOrigin(0.5, 0.5);
			}
		}
	}

	deleteButtons(): void {
		this.submitButton.destroy();
		this.submitButtonText.destroy();
		this.deleteButton.destroy();
		this.deleteButtonText.destroy();
		for(let i = 0; i < 10; i++) {
			this.buttons[i].destroy();
		}
		// Delete button text
		for(let i = 0; i < 10; i++) {
			this.buttonText[i].destroy();
		}
	}

    deleteButtonAction(): void {
		// Check if input sequence is showing
		if (this.sequenceInputDisplay != null) {
			this.sequenceInputDisplay.destroy();
		}
		// Erase the last digit from the input sequence
		this.currentSequence.pop();
		const sequenceString = this.currentSequence.join(' ');
		// add the current answer to the display in a temporary text
		this.sequenceInputDisplay = this.add.text(400, 400, sequenceString, {font: "60px Helvetica"});
		this.sequenceInputDisplay.setOrigin(0.5, 0.5);

	}

	buttonClick(answer: number): void {
		// Check if input sequence is showing
		if (this.sequenceInputDisplay != null) {
			this.sequenceInputDisplay.destroy();
		}
		this.currentSequence.push(answer);
		const sequenceString = this.currentSequence.join(' ');
		// add the current answer to the display in a temporary text
		this.sequenceInputDisplay = this.add.text(400, 400, sequenceString, {font: "60px Helvetica"});
		this.sequenceInputDisplay.setOrigin(0.5, 0.5);

    }

    addGraphics(): void{    
        // Add radarBG 
        this.radarBG = this.add.image(400, 650, "radarBG");
        this.radarBG.setScale(0.8);

    }

    startTest(): void{  
        this.infoBox.destroy();
        this.introImage.destroy();
        this.introText1.destroy();
        this.introText2.destroy();
        this.introText3.destroy();
        this.ProceedButton.destroy();
        this.ProceedButtonText.destroy();

        // Spawn boxes every 1 seconds the first 60 seconds
        this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.spawnBox,
            callbackScope: this,
            loop: true,
        });

        // Create trigger zone
        this.triggerZone = this.add.zone(0, 830, 800, 400).setOrigin(0);
        
        // Give trigger zone a physics body so it can detect collisions, but only one detection should be enough
        this.physics.world.enable(this.triggerZone, Phaser.Physics.Arcade.STATIC_BODY);

        this.addGraphics();
        // Count boxes that enter the trigger zone and update boxCountText
        this.physics.add.overlap(this.triggerZone, this.boxes, this.boxInZoneTimer, undefined, this);

        // 120 seconds timer
        //this.timer = this.time.delayedCall(900000, this.endGame, [], this);
        this.createCountdown(120);
        
    }

    textBoxIntro(): void{
        this.infoBox = this.add.image(400, 700, Textures.BackgroundGameIntro);
        this.introImage = this.add.image(400, 650, Textures.ImageTest5);
        this.introText1 = this.add.text(100, 150, Scene5Text.testNumber, {font: "25px VCR"}).setOrigin(0,0.5);
        this.introText2 = this.add.text(100, 200, Scene5Text.introLabel, {font: "45px VCR"}).setOrigin(0,0.5);
        this.introText3 = this.add.text(100, 300, Scene5Text.introText, {font: "30px VCR"}).setOrigin(0,0.5);
        this.ProceedButton = this.add.sprite(400, 1180, Textures.GreenBar)
            .setFrame(0)
            .setInteractive()
            .setDepth(1)
            .on('pointerdown', () => { this.ProceedButton.setFrame(2), this.startTest(); })
            .on('pointerover', () => { this.ProceedButton.setFrame(1); })
            .on('pointerout', () => { this.ProceedButton.setFrame(0); });
        this.ProceedButtonText = this.add.text(400, 1180, Scene5Text.startTestText, {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');

    }

    textBoxOutro(): void{
        // Destroy all graphics

        this.infoBox = this.add.image(400, 600, "textBox");
        this.infoBox.setScale(1.2);
        this.introText1 = this.add.text(400, 600, "Bra jobbat!\nDu är klar med femte testet\n\nKlicka för att gå vidare", this.textStyle);
        this.introText1.setScale(1);
        this.introText1.setOrigin(0.5,0.5);
        this.infoBox.setInteractive();
        this.infoBox.on('pointerdown', this.nextScene, this);

    }
    
    debugText(): void {
        // Scene text
	    this.add.text(100, 1200, "Scene5: Koncentration")
	    this.sceneScoreText = this.add.text(100, 1240, "Reg scene 5 score: " + this.registry.get('scene5Score'));
	    this.totalScoreText = this.add.text(100, 1220, "Reg total score: " + this.registry.get('totalScore'));
        
	}

    addScore(score: integer): void {
        this.scene5Score += score;
		this.totalScore += score;
        this.registry.set('scene5Score', this.scene5Score);
		this.registry.set('totalScore', this.totalScore);
        this.updateScore();
    }
    updateScore(): void {
        this.sceneScoreText.setText("Reg scene 5 score: " + this.registry.get('scene5Score'));
		this.totalScoreText.setText("Reg total score: " + this.registry.get('totalScore'))
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
        this.scene.start("Scene6");
    }
    previousScene(): void {
        this.scene.start("Scene4");
    }
}
