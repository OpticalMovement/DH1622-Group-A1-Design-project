import Phaser from "phaser"
import SettingsMenu from "./SettingsMenu"
import DebugMenu from "./DebugMenu"
import Textures from "./Textures"

export default class UIScene extends Phaser.Scene 
{
    private settingsMenu!: SettingsMenu
    private debugMenu!: DebugMenu

    constructor() 
    {
        super("UIScene")
    }

    create() 
    {
        
        this.settingsMenu = new SettingsMenu(this)
        const MenuButton = this.add.sprite(100, 30, Textures.MenuButton).setOrigin(1, 0).setDepth(2).setScale(1.2);
        MenuButton.setInteractive()
            .setFrame(0)
            .setDepth(2)
            .on('pointerover', () => MenuButton.setFrame(1))
            .on('pointerout', () => MenuButton.setFrame(0))
            .on('pointerdown', () => MenuButton.setFrame(2))
            .on('pointerup', () => { MenuButton.setFrame(0)
                if (this.settingsMenu.isOpen) 
                {
                    this.settingsMenu.hide()
                    // this.scene.resume(Scenes.GAME)

                } 
                else 
                {
                    this.settingsMenu.show()
                    // this.scene.pause(Scenes.GAME)
                }     
        })
        
        // Debug menu
        this.debugMenu = new DebugMenu(this)
        const DebugButton = this.add.sprite(770, 30, Textures.Debugbutton).setOrigin(1, 0).setDepth(2).setScale(1.2);
        DebugButton.setInteractive()
            .setFrame(0)
            .setDepth(2)
            .on('pointerover', () => DebugButton.setFrame(1))
            .on('pointerout', () => DebugButton.setFrame(0))
            .on('pointerdown', () => DebugButton.setFrame(2))
            .on('pointerup', () => { DebugButton.setFrame(0)
                if (this.debugMenu.isOpen) 
                {
                    this.debugMenu.hide()
                    // this.scene.resume(Scenes.GAME)

                } 
                else 
                {
                    this.debugMenu.show()
                    // this.scene.pause(Scenes.GAME)
                }     
        })


    }
}