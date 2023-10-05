import Phaser from 'phaser'
import Textures from './Textures';
import { Scene6Text } from './Text';

export default class Scene6 extends Phaser.Scene {

    // Initialize common scene variables
    rotImage: Phaser.GameObjects.Text;
    totalScore: integer;
    scene6Score: integer;
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
    symbolsIndex: string[];
    currentSymbol: integer;
    symbolHolder: Phaser.GameObjects.Image;
    left: Phaser.GameObjects.Image;
    right: Phaser.GameObjects.Image;
    buttonStates: any;
    boxes: Phaser.Physics.Arcade.Group;
    boxGenerator: any;
    cursors: any;
    timeIsUp: boolean;
    timeLeft: number;
    timedEvent: any;
    timeText: Phaser.GameObjects.Text;
    player: Phaser.Physics.Arcade.Sprite;
    introImage: Phaser.GameObjects.Image;
    ProceedButton: Phaser.GameObjects.Sprite;
	ProceedButtonText: Phaser.GameObjects.Text;


    constructor() {
        super("Scene6");
        this.buttonStates = {left: false, right: false};
    }
    init(): void {

        this.scene6Score = 0;
		this.totalScore = this.registry.get('totalScore');
        this.navButtonsEnabled = false;
        this.infoBox = this.add.image(-100, -100, "infoBox");
        // Create symbols
        this.symbolsIndex = ['symbol0', 'symbol1', 'symbol2', 'symbol3', 'symbol4'];
        this.currentSymbol = 1;
        this.timeIsUp = false;
    }
	create(): void {

        this.textStyle = { font: "30px VCR", fill: "white",  wordWrap: true, wordWrapWidth: this.infoBox.width, align: "center",};
        
        // Add background image
        this.add.image(400, 700, Textures.BackgroundGame);

        this.debugText();

        this.textBoxIntro();

        this.toggleNavButtons();

        // Set up arrow key controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create a group for the falling boxes
        this.boxes = this.physics.add.group();

        // Create a player that is moved by the arrow keys
        this.player = this.physics.add.sprite(400, 800, 'gripen');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        this.player.setDrag(1000, 0);
        this.player.setDepth(1);

        // Make player invisible
        this.player.alpha = 0;

        // Check if UIScene is active with the scenemanager, if not, start it
        if (this.scene.isActive('UIScene') == false) {
            this.scene.run('UIScene');
            console.log("Starting UIScene from Scene6");
        }
        
    }

    update(): void {

        // Player controls
        if (this.cursors.left.isDown || this.buttonStates.left) {
            this.player.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown || this.buttonStates.right) {
            this.player.setVelocityX(300);
        }
        else {
            this.player.setVelocityX(0);
        }


        // Delete box when it goes under y = 1000
        this.boxes.children.each((box) => {
            let boxImage = box as Phaser.Physics.Arcade.Image;
            if (boxImage.y > 1000) {
                boxImage.destroy();
            }
            // Check for trigger collision
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), boxImage.getBounds())) {
                this.hitObstacle(this.player, box);
            }
            // Added a return true to avoid typescript error
            return true;
        });

        if (this.navButtonsEnabled) {
            this.navButtons();
        }
    }

    hitObstacle(player: any, obstacle: any) {
        
        console.log("Hit obstacle");
        obstacle.destroy();
        this.subtractScore();

        // Animation a tint on the player
        this.player.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            this.player.setTint(0xffffff);
        }
        , [], this);

        
    }

    generateBox(): void {
        // Create a new box and set its velocity abd random x position
        let box = this.boxes.create(Phaser.Math.Between(50, 750), 0, 'symbol1');
        box.setScale(0.3);

        // Increase velocity over time but limit it to 800
        box.setVelocityY(Math.min(300, 100 + (120-this.timeLeft)*10));

    }

    symbolSwitcher(): void{
        // Display one symbol at a time at random
        this.currentSymbol = Phaser.Math.Between(1, 4);
        if (this.currentSymbol > 4) {
            this.currentSymbol = 0;
        }
        this.symbolHolder.setTexture(this.symbolsIndex[this.currentSymbol]);

    }

    createButtons(): void {
        let buttonscale = 0.37;
        this.left = this.add.image(120, 1160, "Left") 
            .setInteractive()
			.setAlpha(0.8)
			.on('pointerdown', () => {this.left.setAlpha(0.6); this.buttonStates.left = true;})
			.on('pointerover', () => this.left.setAlpha(0.3))
			.on('pointerup', () => this.left.setAlpha(0.3))
            .on('pointerup', () => this.buttonStates.left = false)
			.on('pointerout', () => this.left.setAlpha(0.8));
        this.right = this.add.image(680, 1160, "Right")
            .setInteractive()
            .setAlpha(0.8)
            .on('pointerdown', () => {this.right.setAlpha(0.6); this.buttonStates.right = true;})
            .on('pointerover', () => this.right.setAlpha(0.3))
            .on('pointerup', () => this.right.setAlpha(0.3))
            .on('pointerup', () => this.buttonStates.right = false)
            .on('pointerout', () => this.right.setAlpha(0.8));
        // Set button scale
        this.left.setScale(buttonscale);
        this.right.setScale(buttonscale);
    }


    checkAnswer(): void{
        // Only check answer if the time is not up
        if (!this.timeIsUp) {
            // Check if the symbol that is displayed is the same as the one that is clicked
            if (this.currentSymbol == 3){
                this.addScore();
                console.log("Correct symbol");
            } else {
                this.subtractScore();
                console.log("Wrong symbol");
            }
        }

    }

    gameLoop(): void{  
        this.infoBox.destroy();
        this.introImage.destroy();
        this.introText1.destroy();
        this.introText2.destroy();
        this.introText3.destroy();
        this.ProceedButton.destroy();
        this.ProceedButtonText.destroy();
        this.createButtons();
        this.generateBox();
        this.createCountdown(120);
        // Create a falling box with increasing velocity and even spacing
        this.boxGenerator = this.time.addEvent({
            delay: 3000,                // ms
            callback: this.generateBox,
            callbackScope: this,
            loop: true
        });
        this.symbolHolder = this.add.image(400, 1150, this.symbolsIndex[this.currentSymbol]);
        this.time.addEvent({ delay: 2000, callback: this.symbolSwitcher, callbackScope: this, loop: true });
        // Make symbols clickable
        this.symbolHolder.setInteractive();
        this.symbolHolder.on('pointerdown', this.checkAnswer, this);

        // Show player
        this.player.alpha = 1;


    }

    createCountdown(seconds: integer): void {
        this.timeLeft = seconds;
        this.timeText = this.add.text(50, 80, `Time left: ${this.timeLeft}`, { font: "30px Helvetica" });
    
        // Set a timed event
        this.timedEvent = this.time.addEvent({
            delay: 1000,                // ms
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });    
    }

    calculateDelay(remainingTime: number): number {
        // This will decrease delay as time progresses, making boxes spawn faster over time
        if (remainingTime > 100) {
            return 3000;
        } 
        else {
        return Math.max(400, remainingTime * 10);
        }
    }


    updateTimer(): void {
        this.timeLeft -= 1;  // Decrease the time left
        this.timeText.setText(`Time left: ${this.timeLeft}`);  // Update the time text  
        this.boxGenerator.delay = this.calculateDelay(this.timeLeft);  // Update the arrow generator delay
            // If time's up, stop the event
            if(this.timeLeft <= 0) {
                this.timedEvent.remove();
                this.timeText.setText('Time is up!');
                this.textBoxOutro();
                this.timeIsUp = true;
            }
    }


    textBoxIntro(): void{
        this.infoBox = this.add.image(400, 700, Textures.BackgroundGameIntro);
        this.introImage = this.add.image(400, 650, Textures.ImageTest6);
        this.introText1 = this.add.text(100, 150, Scene6Text.testNumber, {font: "25px VCR"}).setOrigin(0,0.5);
        this.introText2 = this.add.text(100, 200, Scene6Text.introLabel, {font: "45px VCR"}).setOrigin(0,0.5);
        this.introText3 = this.add.text(100, 300, Scene6Text.introText, {font: "30px VCR"}).setOrigin(0,0.5);
        this.ProceedButton = this.add.sprite(400, 1180, Textures.GreenBar)
            .setFrame(0)
            .setInteractive()
            .setDepth(1)
            .on('pointerdown', () => { this.ProceedButton.setFrame(2), this.gameLoop(); })
            .on('pointerover', () => { this.ProceedButton.setFrame(1); })
            .on('pointerout', () => { this.ProceedButton.setFrame(0); });
        this.ProceedButtonText = this.add.text(400, 1180, Scene6Text.startTestText, {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');

    }

    textBoxOutro(): void{
        // Destroy all graphics
        this.symbolHolder.setAlpha(0);
        this.left.destroy();
        this.right.destroy();
        this.timeText.destroy();
        this.player.alpha = 0;
        this.boxGenerator.destroy();

        this.infoBox = this.add.image(400, 600, "textBox");
        this.infoBox.setScale(1.2);
        this.introText1 = this.add.text(400, 600, "Bra jobbat!\nDu är klar med sista testet\n\nKlicka för att gå vidare", this.textStyle);
        this.introText1.setScale(1);
        this.introText1.setOrigin(0.5,0.5);
        this.infoBox.setInteractive();
        this.infoBox.on('pointerdown', this.nextScene, this);

    }
    
    debugText(): void {
        // Scene text
	    this.add.text(50, 130, "Scene6: Simultanförmåga")
	    this.sceneScoreText = this.add.text(50, 150, "Reg scene 6 score: " + this.registry.get('scene6Score'));
	    this.totalScoreText = this.add.text(50, 170, "Reg total score: " + this.registry.get('totalScore'));
        
	}

    addScore(): void {
        this.scene6Score += 1;
		this.totalScore += 1;
        this.registry.set('scene6Score', this.scene6Score);
		this.registry.set('totalScore', this.totalScore);
        this.updateScore();
    }

    subtractScore(): void {
        if (this.scene6Score > 0) {
            this.scene6Score -= 1;
            this.totalScore -= 1;
            this.registry.set('scene6Score', this.scene6Score);
            this.registry.set('totalScore', this.totalScore);
            this.updateScore();
        }
    }

    updateScore(): void {
        this.sceneScoreText.setText("Reg scene 6 score: " + this.registry.get('scene6Score'));
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
        this.scene.start("EndScene");
    }
    previousScene(): void {
        this.scene.start("Scene5");
    }
}
