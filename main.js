import LobbyScene from './scenes/LobbyScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: [LobbyScene, GameScene, UIScene],
    parent: 'game-wrapper'
};

const game = new Phaser.Game(config);

// Inventaire global
window.playerData = {
    gems: 0,
    coins: 0
};
