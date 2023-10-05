import Phaser from 'phaser'
import SettingsMenu from './SettingsMenu';
import { GlobalFunctions } from './Globals';
import Textures from './Textures';
import { PreloadSceneText } from './Text';

export default class PreloadScene extends Phaser.Scene {

	// Initialize common scene variables
	image: Phaser.GameObjects.Image;
	navButton: Phaser.GameObjects.Image;
	navButtonsEnabled: boolean;
    navLeft: Phaser.GameObjects.Image;
    navRight: Phaser.GameObjects.Image;
	FVlogga: Phaser.GameObjects.Image;
	slide: number;
	boxes = new Array(6);
	boxText: Phaser.GameObjects.Text;
	ProceedButton: Phaser.GameObjects.Image;
	ProceedButtonText: Phaser.GameObjects.Text;
	IntroFrame: Phaser.GameObjects.Image;
	IntroText1: Phaser.GameObjects.Text;
	IntroText2: Phaser.GameObjects.Text;
	IntroText3: Phaser.GameObjects.Text;
	InfoButton: Phaser.GameObjects.Image;
	InfoButtonText: Phaser.GameObjects.Text;
	Menu1: Phaser.GameObjects.Image;
	Menu2: Phaser.GameObjects.Image;
	MenuLabel1: Phaser.GameObjects.Text;
	MenuLabel2: Phaser.GameObjects.Text;
	MenuText1: Phaser.GameObjects.Text;
	MenuText2: Phaser.GameObjects.Text;
	Popup: Phaser.GameObjects.Image;
	PopupLabel: Phaser.GameObjects.Text;
	PopupText: Phaser.GameObjects.Text;
	gif1: Phaser.GameObjects.Image;
	music: Phaser.Sound.BaseSound;


	// Initialize local scene variables

	constructor() {
		super('PreloadScene')
	}
	// Initialize all registry data variables
	init(): void {
		this.registry.set('totalScore', 0);
        this.registry.set('scene1Score', 0);
		this.registry.set('scene2Score', 0);
		this.registry.set('scene3Score', 0);
		this.registry.set('scene4Score', 0);
		this.registry.set('scene5Score', 0);
		this.registry.set('scene6Score', 0)
		this.navButtonsEnabled = false;
		this.slide = 1;
	}

	preload(): void {

		// Backgrounds
		this.load.image("Outro", "assets/images/Backgrounds/Outro.png");
		this.load.image("MenuPanel", "assets/images/Backgrounds/MenuPanelv2.png");
		this.load.image("Test2BG", "assets/images/Backgrounds/Test2Background.png");
		this.load.image("BackgroundBase", "assets/images/Backgrounds/BackgroundBase.png");
		this.load.image("BackgroundGame", "assets/images/Backgrounds/BackgroundGame.png");
		this.load.image("BackgroundGameIntro", "assets/images/Backgrounds/BackgroundGameIntro.png");
		this.load.image("BackgroundSlide1", "assets/images/Backgrounds/BackgroundSlide1v2.png");
		this.load.image("BackgroundSlide2", "assets/images/Backgrounds/BackgroundSlide2v2.png");
		
		//Images
		this.load.image("gripen", "assets/images/GripenVector100x100.png");
		this.load.image("gripenAligned", "assets/images/GripenVector100x100aligned.png");
        this.load.image("Bullseye", "assets/images/Bullseye.png");
        this.load.image("Left", "assets/images/Left.png");
        this.load.image("Right", "assets/images/Right.png");
		this.load.image("Up", "assets/images/Up.png");
		this.load.image("Down", "assets/images/Down.png");
        this.load.image("textBox", "assets/images/textBox.png");
		this.load.image("answerBox", "assets/images/answerBox.png");
		this.load.image("radarBG", "assets/images/radarBG.png");
		this.load.image("FVlogga", "assets/images/FVlogga.png");
		this.load.image("HeadsUp", "assets/images/HeadsUpSign.png");
		this.load.image("IntroFrame", "assets/images/IntroFrame.png");
		this.load.image("Checkmark", "assets/images/Buttons/Checkmark.png");
		this.load.image("CheckBox", "assets/images/Buttons/CheckBox.png");
		this.load.image("PixelPilot1", "assets/images/PixelPilot1.png");
		this.load.image("ScoreBox", "assets/images/ScoreBox.png");
		this.load.image("ImageEndScene", "assets/images/ImageEndScene.png");
		for(var i = 1; i < 8; i++){
			this.load.image("quiz" + i, "assets/images/quiz" + i + ".png");
		}
		for(var i = 1; i <= 4; i++){
			this.load.image("symbol" + i, "assets/images/symbol" + i + ".png");
		}
		for(var i = 1; i < 5; i++){
			this.load.image("gif" + i, "assets/images/Gifs/gif" + i + ".GIF");
		}
		for(var i = 2; i <= 6; i++){
			this.load.image("ImageTest" + i, "assets/images/Gifs/ImageTest" + i + ".png");
		}

		// Spritesheets
		this.load.spritesheet('PauseButton', "assets/images/Buttons/PauseButton.png", { frameWidth: 60, frameHeight: 60});
		this.load.spritesheet('DebugButton', "assets/images/Buttons/DebugButton.png", { frameWidth: 60, frameHeight: 60});
		this.load.spritesheet('MenuButton', "assets/images/Buttons/MenuButton.png", { frameWidth: 60, frameHeight: 60});
		this.load.spritesheet('Tutorial1', "assets/images/Gifs/Tutorial1.png", { frameWidth: 200, frameHeight: 350})
		this.load.spritesheet('sk60', "assets/images/Buttons/SK60v2.png", { frameWidth: 300, frameHeight: 300});
		this.load.spritesheet('GreenBar', "assets/images/Buttons/BarButtonv2.png", { frameWidth: 650, frameHeight: 80});
		this.load.spritesheet('quizButton', "assets/images/Buttons/QuizButtonSprite.png", { frameWidth: 150, frameHeight: 150});
		this.load.spritesheet('AnimationTest1', "assets/images/Gifs/Test1Animation.png", { frameWidth: 200, frameHeight: 200});
		this.load.spritesheet('ImageTest1', "assets/images/Gifs/ImageTest1.png", { frameWidth: 200, frameHeight: 200});
		
		// Bitmap fonts
		this.load.bitmapFont('Bits', 'assets/fonts/pixel.png', 'assets/fonts/pixel.xml');

		// Audio
		this.load.audio("Music1", "assets/audio/music1.mp3");
		
	}

	create(): void {
		
		// Create audio
		this.music = this.sound.add("Music1");
		var musicConfig = {
			mute: false,
			volume: 0.5,
			rate: 1,
			detune: 0,
			seek: 0,
			loop: true,
			delay: 0
		}
		this.music.play(musicConfig);

		this.add.image(400, 700, Textures.BackgroundBase).setScale(1);

		this.ProceedButton = this.add.sprite(400, 1180, Textures.GreenBar)
			.setFrame(0)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => { this.ProceedButton.setFrame(2), this.menuSlides(1); })
			.on('pointerover', () => { this.ProceedButton.setFrame(1); })
			.on('pointerout', () => { this.ProceedButton.setFrame(0); });
		this.ProceedButtonText = this.add.text(400, 1180, "FORTSÄTT", {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');

		this.InfoButton = this.add.sprite(400, 1280, Textures.GreenBar)
			.setFrame(0)
			.setInteractive()
			.setDepth(1)
			.on('pointerover', () => { this.InfoButton.setFrame(1); })
			.on('pointerout', () => { this.InfoButton.setFrame(0); })
			.on('pointerdown', () => window.open("https://jobb.forsvarsmakten.se/sv/utbildning/befattningsguiden/officers-befattningar/stridspilot/kp-pilot/", "_blank"));
		this.InfoButtonText = this.add.text(400, 1280, "LÄS OM RIKTIGA TESTET", {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');

		GlobalFunctions.myGlobalFunction();

		
		this.add.text(400, 150, "GROUP A1\nDESIGN PROTOTYPE", {font: "80px VCR"}).setOrigin(0.5,0.5).setAlign('center');
		
		
		this.IntroFrame = this.add.image(400, 480, "IntroFrame").setScale(0.36);
		this.IntroText1 = this.add.text(70, 730, PreloadSceneText.IntroText1, {font: "35px VCR"}).setOrigin(0,0.5).setAlign('left');
		this.IntroText2 = this.add.text(70, 820, PreloadSceneText.IntroText2, {font: "25px VCR"}).setOrigin(0,0.5).setAlign('left');
		this.IntroText3 = this.add.text(70, 920, PreloadSceneText.IntroText3, {font: "25px VCR"}).setOrigin(0,0.5).setAlign('left');


		// Toggle navbuttons
        this.toggleNavButtons();

		this.scene.launch('UIScene');


	}

	update(): void {
		if (this.navButtonsEnabled) {
            this.navButtons();
        }
	}

	menuSlides(slide: number) {
		if(slide == 1){
			this.slide1();
		}
		if(slide == 2){
			this.slide2();
		}
		if(slide == 3){
			this.slide3();
		}
		this.slide++;
	}

	slide1(): void {
		this.InfoButton.destroy();
		this.InfoButtonText.destroy();
		this.ProceedButton.destroy();
		this.ProceedButtonText.destroy();
		this.IntroFrame.destroy();
		this.IntroText1.destroy();
		this.IntroText2.destroy();
		this.IntroText3.destroy();
		this.Menu1 = this.add.image(400, 700, Textures.BackgroundSlide1);
		this.MenuLabel1 = this.add.text(400, 250, PreloadSceneText.MenuLabel1, {font: "40px VCR"}).setOrigin(0.5,0.5).setAlign('center');
		this.MenuText1 = this.add.text(400, 380, PreloadSceneText.MenuText1, {font: "30px VCR"}).setOrigin(0.5,0.5).setAlign('center');
		// Create 6 text boxes in a 2x3 grid with the 6 different skill texts from PreloadSceneText
		for(let i = 0; i < 6; i++){
			var x = 250 + (i%2)*300;
			var y = 550 + Math.floor(i/2)*240;
			this.boxes[i] = this.add.image(x, y, "textBox")
				.setInteractive()
				.setScale(0.5)
				.on('pointerdown', () => this.boxes[i].setAlpha(0.5))
				.on('pointerover', () =>  this.boxes[i].setAlpha(0.7))
				.on('pointerup', () =>  this.boxes[i].setAlpha(1))
				.on('pointerout', () =>  this.boxes[i].setAlpha(1));
			this.boxText = this.add.text(x, y+110, (PreloadSceneText as any)["Skill" + (i + 1)], {font: "20px VCR"}).setOrigin(0.5,0.5).setAlign('center');
			
		}
		this.ProceedButton = this.add.sprite(400, 1280, Textures.GreenBar)
			.setFrame(0)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => { this.ProceedButton.setFrame(2), this.menuSlides(this.slide); })
			.on('pointerover', () => { this.ProceedButton.setFrame(1); })
			.on('pointerout', () => { this.ProceedButton.setFrame(0); });
		this.ProceedButtonText = this.add.text(400, 1280, "FORTSÄTT", {font: "30px VCR"}).setOrigin(0.5,0.5).setDepth(2).setAlign('center');
	}

	slide2(): void {
		this.Menu1.destroy();
			this.MenuLabel1.destroy();
			this.MenuText1.destroy();
			this.boxText.destroy();
			for(var i = 0; i < 6; i++){
				this.boxes[i].destroy();
			}
			this.Menu2 = this.add.image(400, 700, Textures.BackgroundSlide2);
			this.MenuLabel2 = this.add.text(400, 250, PreloadSceneText.MenuLabel2, {font: "40px VCR"}).setOrigin(0.5,0.5).setAlign('center');
			this.MenuText2 = this.add.text(100, 380, PreloadSceneText.MenuText2, {font: "20px VCR"}).setOrigin(0,0.5).setAlign('left');
			this.Popup = this.add.image(400, 1000, Textures.Popup).setScale(1);
			this.PopupLabel = this.add.text(160, 970, PreloadSceneText.PopupLabel, {font: "40px VCR"}).setOrigin(0,0.5).setAlign('left').setDepth(2);
			this.PopupText = this.add.text(160, 1020, PreloadSceneText.PopupText, {font: "20px VCR"}).setOrigin(0,0.5).setAlign('left').setDepth(2);
			this.gif1 = this.add.image(400, 680, "gif1").setScale(1);
	}

	slide3(): void {
		this.Menu2.destroy();
		this.MenuLabel2.destroy();
		this.MenuText2.destroy();
		this.nextScene();
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

    }

}