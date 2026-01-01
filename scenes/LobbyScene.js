export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super('LobbyScene');
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('player', 'assets/images/player.png');
        this.load.image('button', 'assets/images/button.png');
    }

    create() {
        this.add.image(400, 300, 'background');
        this.add.image(400, 200, 'player').setScale(0.5);

        const playButton = this.add.image(400, 400, 'button').setInteractive();
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
            this.scene.launch('UIScene');
        });

        this.add.text(370, 390, 'Jouer', { fontSize: '24px', fill: '#fff' });
    }
}
