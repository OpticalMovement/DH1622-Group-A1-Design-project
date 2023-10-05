import 'phaser';
import PreloadScene from './PreloadScene';
import Scene1 from './Scene1';
import Scene2 from './Scene2';
import Scene3 from './Scene3';
import Scene4 from './Scene4';
import Scene5 from './Scene5';
import Scene6 from './Scene6';
import EndScene from './EndScene';
import UIScene from './UIScene';


var config = {
    type:Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: 800,
    height: 1400, 
    backgroundColor: 0x000000,
    parent: 'Pilottester',
    scene: [PreloadScene, Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, EndScene, UIScene],
    pixelArt: false,
    fps: {
        target: 60,
        forceSetTimeOut: true
      },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    myCustomProperty: true

};


var game = new Phaser.Game(config);



window.onload = function() {
    console.log('Window loaded');
    var links = document.querySelectorAll('#menu .links a, #menu .actions a');

    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            console.log('Link clicked');
            event.preventDefault();
            var sceneKey = link.getAttribute('data-scene');
            if (sceneKey) {
                game.scene.start(sceneKey);
            }
        });
    });
};