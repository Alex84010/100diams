export default class UIScene extends Phaser.Scene {
    constructor(){
        super('UIScene');
    }

    create(){
        // UI texte
        this.gemText=this.add.text(16,16,'Joyaux: 0',{fontSize:'24px',fill:'#fff'}).setScrollFactor(0);
        this.coinText=this.add.text(16,50,'Coins: 0',{fontSize:'24px',fill:'#fff'}).setScrollFactor(0);

        // Écoute des événements
        const gameScene=this.scene.get('GameScene');
        gameScene.events.on('updateUI',()=>{this.updateUI();});
        this.updateUI();
    }

    updateUI(){
        this.gemText.setText('Joyaux: '+window.playerData.gems);
        this.coinText.setText('Coins: '+window.playerData.coins);
    }
}
