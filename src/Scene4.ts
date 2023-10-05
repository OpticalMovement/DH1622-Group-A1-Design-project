import Phaser from 'phaser'
import Textures from './Textures';
import { Scene4Text } from './Text';

export default class Scene4 extends Phaser.Scene {

    // Initialize common scene variables
    rotImage: Phaser.GameObjects.Text;
	totalScore: integer;
	scene4Score: integer;
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
    bullseye: Phaser.GameObjects.Image;
    instructionText: Phaser.GameObjects.Text;
    bullseyeCall: Phaser.GameObjects.Text;
    aircraft: Phaser.GameObjects.Sprite[];
    selectedAircraft: Phaser.GameObjects.Sprite;
    text: Phaser.GameObjects.Text;
    arrow: Phaser.GameObjects.Image;
    rotateTween: any;
    level: integer;
    introImage: Phaser.GameObjects.Image;
    ProceedButton: Phaser.GameObjects.Sprite;
	ProceedButtonText: Phaser.GameObjects.Text;

    constructor() {
        super("Scene4");
    }
    init(): void {
        this.scene4Score = 0;
		this.totalScore = this.registry.get('totalScore');
        this.navButtonsEnabled = false;
        this.infoBox = this.add.image(-100, -100, "infoBox");
        this.level = 1;

    }

    create(): void {
        this.textStyle = { font: "30px VCR", fill: "white",  wordWrap: true, wordWrapWidth: this.infoBox.width, align: "center",};
        
		this.add.image(400, 700, Textures.BackgroundGame);
        
        this.debugText();

        this.textBoxIntro();
	    // Navbuttons Sceneselection
        this.toggleNavButtons();

        // Create aircraft that rotates and displays distance and bearing to bullseye and heading
        this.arrow = this.add.image(70, 100, "gripenAligned");
        this.arrow.setScale(0.5);
        this.rotImage = this.add.text(30, 30, "Debug heading: 0°", { font: "20px Consolas"});

        // Check if UIScene is active with the scenemanager, if not, start it
        if (this.scene.isActive('UIScene') == false) {
            this.scene.run('UIScene');
            console.log('Starting UIScene from Scene4');
        }

    }

    update(): void {
        // Update aircrafts rotation
        this.arrow.rotation += 0.01;
        // Display heading
        let heading = this.unitConversion(0, 0, this.arrow.rotation)[2];
        this.rotImage.setText(`Debug heading: ${Math.round(heading)}°`);
        


        if (this.navButtonsEnabled) {
            this.navButtons();
        }
    }


    unitConversion(distance: number, bearing: number, heading: number): number[]{
        // Convert to degrees
        bearing = bearing * 180 / Math.PI;
        heading = heading * 180 / Math.PI;

        // Convert distance scale from 0-600 to 0-40
        distance = distance / 8.925; 
        if (bearing >= 0 && bearing <= 180) {
            bearing = 90 + bearing;
        }
        if (bearing >= -180 && bearing < -90) {
            bearing = 450 + bearing;
        }
        if (bearing >= -90 && bearing < 0) {
            bearing = 90 + bearing;
        }
        if (heading >= 0 && heading <= 180) {
            heading = 90 + heading;
        }
        if (heading >= -180 && heading < -90) {
            heading = 450 + heading;
        }
        if (heading >= -90 && heading < 0) {
            heading = 90 + heading;
        }
        return [distance, bearing, heading];
    }

    gameLoop(): void {
        // Game loop
        this.spawnAircrafts();
        this.aircraftCoordinates();
        // Check level
        if (this.level == 21) {
            // End  game
            this.textBoxOutro();
        }
    }

    startTest(): void { 
        this.infoBox.destroy();
        this.introImage.destroy();
        this.introText1.destroy();
        this.introText2.destroy();
        this.introText3.destroy();
        this.ProceedButton.destroy();
        this.ProceedButtonText.destroy();
        this.spawnGraphics();
        this.gameLoop();
    }

    spawnAircrafts(): void {
        // Spawn 10 aircrafts at random positions and rotations and dont let them spawn too close to each other
        this.aircraft = [];
        for (let i = 0; i < 10; i++) {
            let x = Phaser.Math.Between(100, 700);
            let y = Phaser.Math.Between(100, 700);
            let rot = Phaser.Math.Between(0, 2*Math.PI);
            let aircraft = this.add.sprite(x, y, "gripenAligned");
            // Check if the current aircraft is too close to any other aircraft already spawned and generate new coordinates if it is
            for (let j = 0; j < this.aircraft.length; j++) {
                let distance = Phaser.Math.Distance.Between(aircraft.x, aircraft.y, this.aircraft[j].x, this.aircraft[j].y);
                if (distance < 100) {
                    aircraft.x = Phaser.Math.Between(100, 700);
                    aircraft.y = Phaser.Math.Between(100, 700);
                    j = 0;
                }   
            }
            aircraft.setInteractive();
            aircraft.setScale(0);
            aircraft.setRotation(rot);
            this.aircraft.push(aircraft);
        }
        this.scaleAndRotateAircrafts();

        this.input.on('gameobjectdown', this.checkAircraft, this);

    }

    aircraftCoordinates(): void {
        let selectedAircraft = Phaser.Math.Between(0, 9);
        this.selectedAircraft = this.aircraft[selectedAircraft];
        //this.selectedAircraft.setTint(0x00ff00);
        let x = this.selectedAircraft.x;
        let y = this.selectedAircraft.y;
        let rot = this.selectedAircraft.rotation;
        let distance = Phaser.Math.Distance.Between(400, 500, x, y);
        let angle = Phaser.Math.Angle.Between(400, 500, x, y);

        // Convert with unitConversion function
        let converted = this.unitConversion(distance, angle, rot);

        // Display the coordinates of the selected aircraft
        this.text = this.add.text(400, 1100, 
            `AVSTÅND: ${Math.round(converted[0])} nm 
            BÄRING: ${Math.round(converted[1])}° 
            RIKTNING: ${Math.round(converted[2])}°`, { font: "30px Helvetica"});
        this.text.setOrigin(0.5);
        this.text.setAlign('center');
        this.text.setWordWrapWidth(600, true);
        this.text.setDepth(1);
        //Create rectangle behind text with dark grey background
        let rect = new Phaser.Geom.Rectangle(200, 1030, 400, 140);
        let graphics = this.add.graphics({ fillStyle: { color: 0x333333 } });
        graphics.fillRectShape(rect);
        graphics.setDepth(0);

    }

    scaleAndRotateAircrafts(): void {
        // Animate the aircrafts from scale 0 to 1 in sequence and rotate them to their correct rotation
        for (let i = 0; i < 10; i++) {
            this.scaleTween = this.tweens.add({
                targets: this.aircraft[i],
                scale: 1,
                duration: 1000,
                ease: 'Power2',
                delay: i * 200,
            });
            this.rotateTween = this.tweens.add({
                targets: this.aircraft[i],
                rotation: (this.aircraft[i].rotation),
                duration: 1000,
                ease: 'Power2',
                delay: i * 200,
            });
        }
    }

    nextLevel(): void {
        // Destroy the aircrafts and spawn new ones
        for (let i = 0; i < 10; i++) {
            this.aircraft[i].destroy();
        }
        // Remove the text
        this.text.destroy();
        // Remove the coordinates
        // Disable the input
        this.input.off('gameobjectdown', this.checkAircraft, this);
        // Check that the aircrafts are destroyed
        this.level++;
        console.log(this.level);
        this.gameLoop();
    }


    checkAircraft(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite): void {
        // Check if the clicked aircraft is the correct one
        // If it is, add score and spawn new aircrafts
        // If it is not, do nothing
        console.log("Aircraft clicked");
        if (gameObject.rotation == this.selectedAircraft.rotation) {
            this.addScore();
            this.nextLevel();
        } else {
            console.log("Wrong aircraft");
            this.nextLevel();
        }
    }


    selectAircraft(): void {   
        // If an aircraft is already selected, deselect it
        if (this.selectedAircraft != null) {
            this.selectedAircraft.setTint(0xffffff);
        }
    }

    spawnGraphics(): void {
        // Create the bullseye
        this.bullseye = this.add.image(400, 500, "Bullseye");
        this.bullseye.setScale(0.68);

        // Display instructions
        this.displayInstructions();

    }

    addScore(): void {
        this.scene4Score += 1;
		this.totalScore += 1;
        this.registry.set('scene4Score', this.scene4Score);
		this.registry.set('totalScore', this.totalScore);
        this.updateScore();
    }
    updateScore(): void {
        this.sceneScoreText.setText("Reg scene 4 score: " + this.registry.get('scene4Score'));
		this.totalScoreText.setText("Reg total score: " + this.registry.get('totalScore'))
    }

    displayInstructions(): void {
		// Create a text with instructions
		this.instructionText = this.add.text(400, 950, 'ANGE FLYGPLANET SOM\nBÄST MATCHAR MÅLANGIVELSEN', {font: "30px Helvetica"});
		this.instructionText.setOrigin(0.5, 0.5);
		this.instructionText.setWordWrapWidth(600);
		this.instructionText.setAlign('center');
        // Move text to the front
        this.instructionText.depth = 1;
        // Add rectangle behind text
        var graphics = this.add.graphics();
        graphics.fillRect(100, 900, 600, 100);
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeRect(100, 900, 600, 100);

	}	

	hideInstructions(): void {
		this.instructionText.destroy();
	}

    
    textBoxIntro(): void{
        this.infoBox = this.add.image(400, 700, Textures.BackgroundGameIntro);
        this.introImage = this.add.image(400, 650, Textures.ImageTest4);
        this.introText1 = this.add.text(100, 150, Scene4Text.testNumber, {font: "25px VCR"}).setOrigin(0,0.5);
        this.introText2 = this.add.text(100, 200, Scene4Text.introLabel, {font: "45px VCR"}).setOrigin(0,0.5);
        this.introText3 = this.add.text(100, 300, Scene4Text.introText, {font: "30px VCR"}).setOrigin(0,0.5);
        this.ProceedButton = this.add.sprite(400, 1180, Textures.GreenBar)
			.setFrame(0)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => { this.ProceedButton.setFrame(2), this.startTest(); })
			.on('pointerover', () => { this.ProceedButton.setFrame(1); })
			.on('pointerout', () => { this.ProceedButton.setFrame(0); });
		this.ProceedButtonText = this.add.text(400, 1180, Scene4Text.startTestText, {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');
    }

    textBoxOutro(): void{
        // Destroy all graphics
        this.infoBox.destroy();
        this.introText1.destroy();
        this.bullseye.destroy();
        this.text.destroy();
        this.instructionText.destroy();
        // Destroy all aircrafts
        for (let i = 0; i < 10; i++) {
            this.aircraft[i].destroy();
        }


        this.infoBox = this.add.image(400, 600, "textBox");
        this.infoBox.setScale(1.2);
        this.introText1 = this.add.text(400, 600, "Bra jobbat!\nDu är klar med fjärde testet\n\nKlicka för att gå vidare", this.textStyle);
        this.introText1.setScale(1);
        this.introText1.setOrigin(0.5,0.5);
        this.infoBox.setInteractive();
        this.infoBox.on('pointerdown', this.nextScene, this);

    }
    
    debugText(): void {
        // Scene text
	    this.add.text(100, 1200, "Scene4: Spatialt tänkande")
	    this.sceneScoreText = this.add.text(100, 1240, "Reg scene 4 score: " + this.registry.get('scene4Score'));
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
        this.scene.start("Scene5");
    }
    previousScene(): void {
        this.scene.start("Scene3");
    }
}
