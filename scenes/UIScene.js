export default class UIScene extends Phaser.Scene {
    constructor(){
        super('UIScene');
    }

    create(){
        this.gemText=this.add.text(16,16,'Joyaux: 0',{fontSize:'32px',fill:'#fff'}).setScrollFactor(0);
        this.coinText=this.add.text(16,60,'Coins: 0',{fontSize:'32px',fill:'#fff'}).setScrollFactor(0);

        const gameScene=this.scene.get('GameScene');
        gameScene.events.on('updateUI',()=>{this.updateUI();});
        this.updateUI();
    }

    updateUI(){
        this.gemText.setText('Joyaux: '+window.playerData.gems);
        this.coinText.setText('Coins: '+window.playerData.coins);
    }
}

