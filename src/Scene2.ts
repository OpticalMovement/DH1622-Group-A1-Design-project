import Phaser from 'phaser'
import Textures from './Textures';
import { Scene2Text } from './Text';

export default class Scene2 extends Phaser.Scene {

    // Initialize common scene variables
	navButtonsEnabled: boolean;
    navLeft: Phaser.GameObjects.Image;
    navRight: Phaser.GameObjects.Image;
	totalScore: integer;
	scene2Score: integer;
    totalScoreText: Phaser.GameObjects.Text;
	sceneScoreText: Phaser.GameObjects.Text;
	textStyle: any;
	scaleTween: any;
	scoreBoxHolder: Phaser.GameObjects.Container;

    // Initialize local scene variables
	infoBox: Phaser.GameObjects.Image;
    introText1: Phaser.GameObjects.Text;
	introText2: Phaser.GameObjects.Text;
	introText3: Phaser.GameObjects.Text;
	instructionText: Phaser.GameObjects.Text;
	instructionTextMemorize: Phaser.GameObjects.Text;
	sequence: number[];
	sequenceText: Phaser.GameObjects.Text;
	currentSequence: number[] = [];
	sequenceInputDisplay: Phaser.GameObjects.Text;
	level = 4;
	showingSequence = true;
	buttons = new Array(10);
	buttonText = new Array(10);
	submitButton: Phaser.GameObjects.Image;
	submitButtonText: Phaser.GameObjects.Text;
	deleteButton: Phaser.GameObjects.Image;
	deleteButtonText: Phaser.GameObjects.Text;
	gameFinished = false;
	introImage: Phaser.GameObjects.Image;
	ProceedButton: Phaser.GameObjects.Sprite;
	ProceedButtonText: Phaser.GameObjects.Text;
	

    constructor() {
        super("Scene2");
    }
	init(): void {
        this.scene2Score = 0;
		this.totalScore = this.registry.get('totalScore');
		this.infoBox = this.add.image(-100, -100, "infoBox");
		this.navButtonsEnabled = false;
    }
	create(): void {
		this.textStyle = { font: "30px VCR", fill: "white",  wordWrap: true, wordWrapWidth: this.infoBox.width, align: "center",};

		// Add MenuSlide1 sprite
		this.add.image(400, 700, "Test2BG").setScale(4);
		// Scene debug text
        this.debugText();
		this.toggleNavButtons();

		this.textBoxIntro();	

		// Check if UIScene is active with the scenemanager, if not, start it
		if (this.scene.isActive('UIScene') == false) {
			this.scene.run('UIScene');
			console.log('Starting UIScene from Scene2');
		}
	}

	update(): void {
		if (this.navButtonsEnabled) {
            this.navButtons();
        }
	}

	gameLoop(): void {
		// Make sure nothing starts when the game is finished
		if (this.level == 13)
		{	
			this.gameFinished = true;
			this.textBoxOutro();
			this.deleteButtons();
			this.hideInstructionsMemorize();
			this.hideSequence();
		}
		if (this.gameFinished == false) {

			// Generate the initial sequence of digits and display them
			this.sequence = this.generateSequence(this.level);
			this.displaySequence();
	
			// Set a timer to hide the sequence after a short time
			let timer = ((this.level * 1000)*1.2);
			this.time.addEvent({ delay: timer, callback: this.hideSequence, callbackScope: this });
			// Set a timer to show the buttons after a short time
			this.time.addEvent({ delay: timer, callback: this.generateButtons, callbackScope: this });
		}	

	}

	generateSequence(length: number): number[] {
    	const sequence: number[] = [];
    	for (let i = 0; i < length; i++) {
        	sequence.push(Math.floor(Math.random() * 10));
    	}
		console.log("Sequence created: " + sequence);
		console.log("Sequence length: " + sequence.length);
		console.log("Level: " + this.level);
    	return sequence;
	}

	displaySequence(): void {
		this.displayInstructionsMemorize();
		// Animate the sequence text each digit separately
    	const sequenceString = this.sequence.join(' ');
    	this.sequenceText = this.add.text(100, 300, sequenceString, {font: "60px Consolas"}).setColor('white');
		this.sequenceText.postFX.addGlow(0x1eff4f, 1.5, 0.3, false);
		this.sequenceText.alpha = 0;

		this.tweens.add({
			targets: this.sequenceText,
			alpha: 1,
			duration: 1000,
			ease: 'Linear',
			repeat: 0,
			yoyo: false
		});
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
		this.sequenceInputDisplay = this.add.text(100, 300, sequenceString, {font: "60px Consolas"}).setColor('white');
		this.sequenceInputDisplay.postFX.addGlow(0x1eff4f, 1.5, 0.3, false);
	}

	buttonClick(answer: number): void {
		// Check if input sequence is showing
		if (this.sequenceInputDisplay != null) {
			this.sequenceInputDisplay.destroy();
		}
		this.currentSequence.push(answer);
		const sequenceString = this.currentSequence.join(' ');
		// add the current answer to the display in a temporary text
		this.sequenceInputDisplay = this.add.text(100, 300, sequenceString, {font: "60px Consolas"}).setColor('white');
		this.sequenceInputDisplay.postFX.addGlow(0x1eff4f, 1.5, 0.3, false);
    }

	submitClick(): void {
		// Check if input sequence is showing
		if (this.sequenceInputDisplay != null) {
			this.sequenceInputDisplay.destroy();
		}
		this.checkSequence(this.currentSequence);
		if (this.checkSequence(this.currentSequence)) {
			this.addScore();
			this.level += 1;
		} else {
			this.level += 1;
		}
		this.deleteButtons();
		this.hideInstructions();
		this.currentSequence = [];
		this.gameLoop();
	}

	checkSequence(input: number[]): boolean {
		console.log("Checking sequence" + input);
    	if (input.length !== this.sequence.length) {
       		return false;
    	}
    	for (let i = 0; i < this.sequence.length; i++) {
        	if (input[i] !== this.sequence[i]) {
            	return false;
        	}
    	}
    	return true;
	}

	hideSequence(): void {
		this.hideInstructionsMemorize();
    	this.sequenceText.destroy();
    	this.showingSequence = false;
	}

	displayInstructions(): void {
		// Create a text with instructions
		this.instructionText = this.add.text(400, 200, 'MATA IN SIFFRORNA I SAMMA ORDNING\nTRYCK SEDAN ENTER', {font: "30px Consolas"});
		this.instructionText.setOrigin(0.5, 0.5);
		this.instructionText.setWordWrapWidth(600);
		this.instructionText.setAlign('center');
	}		

	hideInstructions(): void {
		this.instructionText.destroy();
	}

	displayInstructionsMemorize(): void {
		// Create a text with instructions
		this.instructionTextMemorize = this.add.text(400, 200, 'MEMORERA SIFFRORNA', {font: "30px Consolas"});
		this.instructionTextMemorize.setOrigin(0.5, 0.5);
		this.instructionTextMemorize.setWordWrapWidth(600);
		this.instructionTextMemorize.setAlign('center');
	}		

	hideInstructionsMemorize(): void {
		this.instructionTextMemorize.destroy();
	}

	addScore(): void {
        this.scene2Score += 1;
		this.totalScore += 1;
        this.registry.set('scene2Score', this.scene2Score);
		this.registry.set('totalScore', this.totalScore);
        this.updateScore();
    }

    updateScore(): void {
        this.sceneScoreText.setText("Reg scene 2 score: " + this.registry.get('scene2Score'));
		this.totalScoreText.setText("Reg total score: " + this.registry.get('totalScore'))
    }
	
	generateButtons(): void {
		this.displayInstructions();
		let textColor = 'white';
		let line1xStart = 155;
		let line1xStep = 160;
		let line1x = 635;
		let line1y = 820;
		let line2y = 985;
		let line3y = 1150;
		// Create object with glow settings
		let glowSettings = {string: 0x1eff4f, intensity: 1.5, number: 0.3, Boolean: false};
		this.deleteButton = this.add.image(line1x, line1y, "answerBox")
			.setInteractive()
			.setAlpha(0.01)
			.setScale(0.9)
			.on('pointerdown', () => {this.deleteButton.setAlpha(0.6); this.deleteButtonAction();})
			.on('pointerover', () => this.deleteButton.setAlpha(0.3))
			.on('pointerup', () => this.deleteButton.setAlpha(0.3))
			.on('pointerout', () => this.deleteButton.setAlpha(0.01));
		this.deleteButtonText = this.add.text(line1x, line1y, "DEL", {font: "60px Consolas", align: 'center'}).setOrigin(0.5, 0.5).setColor(textColor);
		this.deleteButtonText.postFX.addGlow(glowSettings.string, glowSettings.intensity, glowSettings.number, glowSettings.Boolean);
		this.submitButton = this.add.image(line1x, line3y, "answerBox")
			.setInteractive()
			.setAlpha(0.01)
			.setScale(0.9)
			.on('pointerdown', () => {this.submitButton.setAlpha(0.6); this.submitClick();})
			.on('pointerover', () => this.submitButton.setAlpha(0.3))
			.on('pointerup', () => this.submitButton.setAlpha(0.3))
			.on('pointerout', () => this.submitButton.setAlpha(0.01));
		this.submitButtonText = this.add.text(line1x, line3y, "ENT", {font: "60px Consolas", align: 'center'}).setOrigin(0.5, 0.5).setColor(textColor);
		this.submitButtonText.postFX.addGlow(glowSettings.string, glowSettings.intensity, glowSettings.number, glowSettings.Boolean);
		// Create buttons in 3x3 grid with the zero button outside the grid on the right
		for(let i = 0; i < 10; i++) {
			if (i<1) {
				this.buttons[i] = this.add.image(line1xStart + line1xStep*3, line2y, "answerBox")
				.setInteractive()
				.setAlpha(0.01)
				.setScale(0.9)
				.on('pointerdown', () => {this.buttons[i].setAlpha(0.6); this.buttonClick(i);})
				.on('pointerover', () => this.buttons[i].setAlpha(0.3))
				.on('pointerup', () => this.buttons[i].setAlpha(0.3))
				.on('pointerout', () => this.buttons[i].setAlpha(0.01));
			// add text to the button
			this.buttonText[i] = this.add.text(line1xStart + line1xStep*3, line2y, i.toString(), {font: "60px Consolas", align: 'center'}).setOrigin(0.5, 0.5).setColor(textColor);
			this.buttonText[i].postFX.addGlow(glowSettings.string, glowSettings.intensity, glowSettings.number, glowSettings.Boolean);
			} else if (i<4) {
				this.buttons[i] = this.add.image(line1xStart + line1xStep*(i-1), line1y, "answerBox")	
					.setInteractive()
					.setAlpha(0.01)
					.setScale(0.9)
					.on('pointerdown', () => {this.buttons[i].setAlpha(0.6); this.buttonClick(i);})
					.on('pointerover', () => this.buttons[i].setAlpha(0.3))
					.on('pointerup', () => this.buttons[i].setAlpha(0.3))
					.on('pointerout', () => this.buttons[i].setAlpha(0.01));
				// add text to the button
				this.buttonText[i] = this.add.text(line1xStart + line1xStep*(i-1), line1y, i.toString(), {font: "60px Consolas", align: 'center'}).setOrigin(0.5, 0.5).setColor(textColor);
				this.buttonText[i].postFX.addGlow(glowSettings.string, glowSettings.intensity, glowSettings.number, glowSettings.Boolean);
			} else if (i<7) {
				this.buttons[i] = this.add.image(line1xStart + line1xStep*(i-4), line2y, "answerBox")
					.setInteractive()
					.setAlpha(0.01)
					.setScale(0.9)
					.on('pointerdown', () => {this.buttons[i].setAlpha(0.6); this.buttonClick(i);})
					.on('pointerover', () => this.buttons[i].setAlpha(0.3))
					.on('pointerup', () => this.buttons[i].setAlpha(0.3))
					.on('pointerout', () => this.buttons[i].setAlpha(0.01));
				// add text to the button
				this.buttonText[i] = this.add.text(line1xStart + line1xStep*(i-4), line2y, i.toString(), {font: "60px Consolas", align: 'center'}).setOrigin(0.5, 0.5).setColor(textColor);
				this.buttonText[i].postFX.addGlow(glowSettings.string, glowSettings.intensity, glowSettings.number, glowSettings.Boolean);
			} else {
				this.buttons[i] = this.add.image(line1xStart + line1xStep*(i-7), line3y, "answerBox")
					.setInteractive()
					.setAlpha(0.01)
					.setScale(0.9)
					.on('pointerdown', () => {this.buttons[i].setAlpha(0.6); this.buttonClick(i);})
					.on('pointerover', () => this.buttons[i].setAlpha(0.3))
					.on('pointerup', () => this.buttons[i].setAlpha(0.3))
					.on('pointerout', () => this.buttons[i].setAlpha(0.01));
				// add text to the button
				this.buttonText[i] = this.add.text(line1xStart + line1xStep*(i-7), line3y, i.toString(), {font: "60px Consolas", align: 'center'}).setOrigin(0.5, 0.5).setColor(textColor);
				this.buttonText[i].postFX.addGlow(glowSettings.string, glowSettings.intensity, glowSettings.number, glowSettings.Boolean);
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

	startTest(): void{
        this.infoBox.destroy();
        this.introText1.destroy();
		this.introText2.destroy();
		this.introText3.destroy();
		this.introImage.destroy();
		this.ProceedButton.destroy();
		this.ProceedButtonText.destroy();
		// Start test
		this.gameLoop();
    }

	textBoxIntro(): void{
        this.infoBox = this.add.image(400, 700, Textures.BackgroundGameIntro);
        this.introImage = this.add.image(400, 650, Textures.ImageTest2);
        this.introText1 = this.add.text(100, 150, Scene2Text.testNumber, {font: "25px VCR"}).setWordWrapWidth(400).setOrigin(0,0.5);
        this.introText2 = this.add.text(100, 200, Scene2Text.introLabel, {font: "45px VCR"}).setWordWrapWidth(400).setOrigin(0,0.5);
        this.introText3 = this.add.text(100, 300, Scene2Text.introText, {font: "30px VCR"}).setWordWrapWidth(400).setOrigin(0,0.5);
        this.ProceedButton = this.add.sprite(400, 1180, Textures.GreenBar)
			.setFrame(0)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => { this.ProceedButton.setFrame(2), this.startTest(); })
			.on('pointerover', () => { this.ProceedButton.setFrame(1); })
			.on('pointerout', () => { this.ProceedButton.setFrame(0); });
		this.ProceedButtonText = this.add.text(400, 1180, Scene2Text.startTestText, {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');

    }

    textBoxOutro(): void{
        this.infoBox = this.add.image(400, 600, "textBox");
        this.infoBox.setScale(1.2);
        this.introText1 = this.add.text(400, 600, "Bra jobbat!\nDu är klar med andra testet\n\nKlicka för att gå vidare", this.textStyle);
        this.introText1.setScale(1);
        this.introText1.setOrigin(0.5,0.5);
        this.infoBox.setInteractive();
        this.infoBox.on('pointerdown', this.nextScene, this);

    }

	debugText(): void {
		this.add.text(200, 20, "Scene2: Minnestest v1")
		this.sceneScoreText = this.add.text(200, 40, "Reg scene 2 score: " + this.registry.get('scene2Score'));
		this.totalScoreText = this.add.text(200, 60, "Reg total score: " + this.registry.get('totalScore'));
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
        this.scene.start("Scene3");
    }
    previousScene(): void {
        this.scene.start("Scene1");
    }
}
