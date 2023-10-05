class InfoBoxManager {
    static instance: InfoBoxManager;

    constructor() {
        if (!InfoBoxManager.instance) {
            InfoBoxManager.instance = this;
        }
        return InfoBoxManager.instance;
    }

    showInfoBox(scene: Phaser.Scene, text: string, callback: Function) {
        const infoBox = scene.add.image(400, 600, "textBox");
        infoBox.setScale(1.2);

        const introText = scene.add.text(400, 600, text, this.textStyle);
        introText.setWordWrapWidth(400);
        introText.setScale(1);
        introText.setOrigin(0.5, 0.5);

        infoBox.setInteractive();
        infoBox.on('pointerdown', () => {
            callback();
            infoBox.destroy();
            introText.destroy();
        });
    }

    private textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        // Define your text style here
    };
}

// Create an instance of the global class
new InfoBoxManager();