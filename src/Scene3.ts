import Phaser, { GameObjects } from 'phaser'
import Textures from './Textures';
import { Scene3Text } from './Text';

export default class Scene3 extends Phaser.Scene {

    // Initialize common scene variables
    navButtonsEnabled: boolean;
    navLeft: Phaser.GameObjects.Image;
    navRight: Phaser.GameObjects.Image;
	totalScore: integer;
	scene3Score: integer;
    totalScoreText: Phaser.GameObjects.Text;
	sceneScoreText: Phaser.GameObjects.Text;
    scaleTween: any;
    textStyle: any;

    // Initialize local scene variables
    infoBox: Phaser.GameObjects.Image;
    introText1: Phaser.GameObjects.Text; 
    introText2: Phaser.GameObjects.Text;
    introText3: Phaser.GameObjects.Text;
    triggerZone: Phaser.GameObjects.Zone;
    left: Phaser.GameObjects.Image;
    right: Phaser.GameObjects.Image;
    up: Phaser.GameObjects.Image;
    down: Phaser.GameObjects.Image;
    boxes: Phaser.Physics.Arcade.Group;
    cursors: any;
    arrowGenerator: any;
    buttonStates: any;
    timeIsUp: boolean;
    timeLeft: number;
    timedEvent: any;
    timeText: Phaser.GameObjects.Text;
    triggerZoneArea: Phaser.GameObjects.Rectangle;
    introImage: Phaser.GameObjects.Image;
    ProceedButton: Phaser.GameObjects.Sprite;
	ProceedButtonText: Phaser.GameObjects.Text;


    constructor() {
        super("Scene3");
        this.buttonStates = {up: false, down: false, left: false, right: false};
    }

    init(): void {
        this.scene3Score = 0;
		this.totalScore = this.registry.get('totalScore');
        this.infoBox = this.add.image(-100, -100, "infoBox");
        this.navButtonsEnabled = false;
        this.timeIsUp = false;
    }

	create(): void {
        this.textStyle = { font: "30px VCR", fill: "white",  wordWrap: true, wordWrapWidth: this.infoBox.width, align: "center",};

        // Add background image
        this.add.image(400, 700, Textures.BackgroundGame).setDepth(-1);
        this.textBoxIntro();
        this.debugText();
        
        this.toggleNavButtons();

        // Set up arrow key controls
        this.cursors = this.input.keyboard.createCursorKeys()!;

        // Create a group for the falling boxes
        this.boxes = this.physics.add.group();

        // Add a listener for when button is pressed
        this.input.keyboard.on('keydown', this.arrowPress, this);

        // Check if UIScene is active with the scenemanager, if not, start it
        if (this.scene.isActive('UIScene') == false) {
            this.scene.run('UIScene');
            console.log('Starting UIScene from Scene3');
        }


    }  

    update(): void {
        // Loop over all the boxes
        this.boxes.children.each((box) => {
            // Cast box to an Image
            let boxImage = box as Phaser.Physics.Arcade.Image;

            // If the box is in the trigger zone and the corresponding key is pressed, increase score
            if (Phaser.Geom.Intersects.RectangleToRectangle(boxImage.getBounds(), this.triggerZone.getBounds())) {
                if ((boxImage.texture.key === 'Up' && (this.buttonStates.up || this.cursors.up.isDown)) ||
                    (boxImage.texture.key === 'Down' && (this.buttonStates.down || this.cursors.down.isDown)) ||
                    (boxImage.texture.key === 'Left' && (this.buttonStates.left || this.cursors.left.isDown)) ||
                    (boxImage.texture.key === 'Right' && (this.buttonStates.right || this.cursors.right.isDown))) {

                        console.log()
                        
                        let zoneHeight = this.triggerZone.height;
                        let boxY = boxImage.y;
                        let zoneTop = this.triggerZone.y - zoneHeight/2;
                        let zoneBottom = this.triggerZone.y + zoneHeight/2;
        
                        // Calculate normalized distance (1 means box is at the top of the zone, 0 means at the bottom)
                        let normalizedDistance = 1 - ((boxY - zoneTop) / (zoneBottom - zoneTop));

                        if (normalizedDistance <= 0.7) {
                            this.addScore();
                        } else if (normalizedDistance > 0.7) {
                            console.log("Miss!");
                        }
                        boxImage.destroy();
                }
            } else if (boxImage.y > 1000) {
                boxImage.destroy();
            }
            // Added a return true to avoid typescript error
            return true;
        });

          if (this.navButtonsEnabled) {
            this.navButtons();
        }
        console.log("Time left: " + (this.timeLeft*10));
    }

    generateArrow(): void {
        const arrows = ['Left', 'Right', 'Up', 'Down'];
        const arrow = Phaser.Utils.Array.GetRandom(arrows);

        // Create a new box and set its velocity
        const box = this.boxes.create(400, 0, arrow);
        box.setScale(0.3);

        // Increase velocity over time but limit it to 800
        box.setVelocityY(Math.min(800, 100 + (120-this.timeLeft)*10));
        console.log("Velocity: " + box.body.velocity.y);
    }

    createButtons(): void {
        let buttonscale = 0.37;
        this.left = this.add.image(120, 1160, "Left") 
            .setInteractive()
			.setAlpha(0.8)
			.on('pointerdown', () => {this.left.setAlpha(0.6); this.buttonStates.left = true; this.arrowPress(1);})
			.on('pointerover', () => this.left.setAlpha(0.3))
			.on('pointerup', () => this.left.setAlpha(0.3))
            .on('pointerup', () => this.buttonStates.left = false)
			.on('pointerout', () => this.left.setAlpha(0.8));
        this.right = this.add.image(305, 1160, "Right")
            .setInteractive()
            .setAlpha(0.8)
            .on('pointerdown', () => {this.right.setAlpha(0.6); this.buttonStates.right = true; this.arrowPress(2);})
            .on('pointerover', () => this.right.setAlpha(0.3))
            .on('pointerup', () => this.right.setAlpha(0.3))
            .on('pointerup', () => this.buttonStates.right = false)
            .on('pointerout', () => this.right.setAlpha(0.8));
        this.up = this.add.image(495, 1160, "Up")
            .setInteractive()
            .setAlpha(0.8)
            .on('pointerdown', () => {this.up.setAlpha(0.6); this.buttonStates.up = true; this.arrowPress(3);})
            .on('pointerover', () => this.up.setAlpha(0.3))
            .on('pointerup', () => this.up.setAlpha(0.3))
            .on('pointerup', () => this.buttonStates.up = false)
            .on('pointerout', () => this.up.setAlpha(0.8));
        this.down = this.add.image(680, 1160, "Down")
            .setInteractive()
            .setAlpha(0.8)
            .on('pointerdown', () => {this.down.setAlpha(0.6); this.buttonStates.down = true; this.arrowPress(4);})
            .on('pointerover', () => this.down.setAlpha(0.3))
            .on('pointerup', () => this.down.setAlpha(0.3))
            .on('pointerup', () => this.buttonStates.down = false)
            .on('pointerout', () => this.down.setAlpha(0.8));
        // Set button scale
        this.left.setScale(buttonscale);
        this.right.setScale(buttonscale);
        this.up.setScale(buttonscale);
        this.down.setScale(buttonscale);

    }

    arrowPress(direction: integer): void {
        console.log("Arrow pressed" + direction);

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

    gameLoop(): void {
        // Start the game loop
        this.createButtons();
        this.generateArrow();
        this.createCountdown(120);
        // Create the trigger zone
        this.triggerZone = this.add.zone(400, 800, 200, 200);
        this.triggerZone.setOrigin(0.5, 0.5);
        // Visualize the trigger zone
        this.triggerZoneArea = this.add.rectangle(this.triggerZone.x, this.triggerZone.y, this.triggerZone.width, this.triggerZone.height, 0x000000, 0.5);

        // Create a falling box with increasing velocity and even spacing
        this.arrowGenerator = this.time.addEvent({
            delay: 3000,                // ms
            callback: this.generateArrow,
            callbackScope: this,
            loop: true
        });
    }

    startTest(): void{
        this.infoBox.destroy();
        this.introImage.destroy();
        this.introText1.destroy();
        this.introText2.destroy();
        this.introText3.destroy();
        this.ProceedButton.destroy();
        this.ProceedButtonText.destroy();
		// Start test
		this.gameLoop();
    }

    updateTimer(): void {
        if (!this.timeIsUp) {
            this.timeLeft -= 1;  // Decrease the time left
            this.timeText.setText(`Time left: ${this.timeLeft}`).setAlign("left");  // Update the time text
        }

        
        this.arrowGenerator.delay = this.calculateDelay(this.timeLeft);  // Update the arrow generator delay
        console.log("Delay: " + this.arrowGenerator.delay);

            // If time's up, stop the event
            if(this.timeLeft <= 0) {
                this.timedEvent.remove();
                this.timeText.setText('Time is up!');
                this.textBoxOutro();
                this.timeIsUp = true;
            }
    }


    createCountdown(seconds: integer): void {
        this.timeLeft = seconds;
        this.timeText = this.add.text(180, 60, `Time left: ${this.timeLeft}`, { font: "30px VCR" }).setDepth(2);
    
        // Set a timed event
        this.timedEvent = this.time.addEvent({
            delay: 1000,                // ms
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });    
    }

    textBoxIntro(): void{
        this.infoBox = this.add.image(400, 700, Textures.BackgroundGameIntro);
        this.introImage = this.add.image(400, 650, Textures.ImageTest3);
        this.introText1 = this.add.text(100, 150, Scene3Text.testNumber, {font: "25px VCR"}).setOrigin(0,0.5);
        this.introText2 = this.add.text(100, 200, Scene3Text.introLabel, {font: "45px VCR"}).setOrigin(0,0.5);
        this.introText3 = this.add.text(100, 300, Scene3Text.introText, {font: "30px VCR"}).setOrigin(0,0.5);
        this.ProceedButton = this.add.sprite(400, 1180, Textures.GreenBar)
			.setFrame(0)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => { this.ProceedButton.setFrame(2), this.startTest(); })
			.on('pointerover', () => { this.ProceedButton.setFrame(1); })
			.on('pointerout', () => { this.ProceedButton.setFrame(0); });
		this.ProceedButtonText = this.add.text(400, 1180, Scene3Text.startTestText, {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');

    }

    textBoxOutro(): void{
        // Destroy all objects
        this.triggerZone.destroy();
        this.triggerZoneArea.destroy();
        this.left.destroy();
        this.right.destroy();
        this.up.destroy();
        this.down.destroy();
        this.arrowGenerator.destroy();
        //Destroy all boxes
        this.boxes.clear(true, true);
        this.introText1 = this.add.text(400, 600, "Bra jobbat!\nDu är klar med tredje testet\n\nKlicka för att gå vidare", this.textStyle);
        this.introText1.setDepth(1);
        this.infoBox = this.add.image(400, 600, "textBox");
        this.infoBox.setScale(1.2);



        this.introText1.setScale(1);
        this.introText1.setOrigin(0.5,0.5);
        this.infoBox.setInteractive();
        this.infoBox.on('pointerdown', this.nextScene, this);
    }

    addScore(): void {
        this.scene3Score += 1;
		this.totalScore += 1;
        this.registry.set('scene3Score', this.scene3Score);
		this.registry.set('totalScore', this.totalScore);
        this.updateScore();
    }
    updateScore(): void {
        this.sceneScoreText.setText("Reg scene 3 score: " + this.registry.get('scene3Score'));
		this.totalScoreText.setText("Reg total score: " + this.registry.get('totalScore'))
    }

    debugText(): void {
        // Scene text
        this.add.text(200, 20, "Scene3: Hand-Öga-koordination")
        this.sceneScoreText = this.add.text(200, 40, "Reg scene 3 score: " + this.registry.get('scene3Score'));
        this.totalScoreText = this.add.text(200, 60, "Reg total score: " + this.registry.get('totalScore'));
        
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
        this.scene.start("Scene4");
    }
    previousScene(): void {
        this.scene.start("Scene2");
    }
}
