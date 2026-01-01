export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('background','assets/images/background.png');
        this.load.image('platform','assets/images/platform.png');
        this.load.image('gem','assets/images/gem.png');
        this.load.image('npc','assets/images/npc.png');
        this.load.spritesheet('player','assets/images/player.png',{frameWidth:2048,frameHeight:2048});
        this.load.audio('jump','assets/audio/jump.wav');
        this.load.audio('collect','assets/audio/collect.wav');
        this.load.audio('trade','assets/audio/trade.wav');
        this.load.audio('bg_music','assets/audio/bg_music.mp3');
    }

    create() {
        // Fond
        this.add.image(400,300,'background').setScrollFactor(0).setScale(0.25);

        // Plateformes
        this.platforms = this.physics.add.staticGroup();
        const platformData = [
            {x:400,y:580,width:800},
            {x:200,y:450,width:150},
            {x:600,y:350,width:150},
            {x:400,y:250,width:150},
            {x:700,y:200,width:100}
        ];
        platformData.forEach(p=>{
            const plat=this.platforms.create(p.x,p.y,'platform').setScale(p.width/2048,0.05).refreshBody();
        });

        // Player
        this.player = this.physics.add.sprite(100,450,'player').setScale(0.05);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(this.player.width*1, this.player.height*1);
        this.physics.add.collider(this.player,this.platforms);

        // Animations
        this.anims.create({key:'left', frames:this.anims.generateFrameNumbers('player',{start:0,end:3}), frameRate:10, repeat:-1});
        this.anims.create({key:'turn', frames:[{key:'player',frame:4}], frameRate:20});
        this.anims.create({key:'right', frames:this.anims.generateFrameNumbers('player',{start:5,end:8}), frameRate:10, repeat:-1});

        // Cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // Joyaux
        this.gems = this.physics.add.group();
        this.createGems(100);
        this.physics.add.overlap(this.player,this.gems,this.collectGem,null,this);

        // PNJ
        this.npcs=this.physics.add.staticGroup();
        this.createNPCs();

        // Caméra
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setLerp(0.1,0.1);
        this.cameras.main.setZoom(0.4);

        // Sons
        this.jumpSound = this.sound.add('jump');
        this.collectSound = this.sound.add('collect');
        this.tradeSound = this.sound.add('trade');
        this.bgMusic = this.sound.add('bg_music',{loop:true,volume:0.5});
        this.bgMusic.play();

        // Boutons tactiles
        this.createTouchControls();
    }

    update() {
        let moveX=0;
        if(this.moveLeft) moveX=-160;
        else if(this.moveRight) moveX=160;

        this.player.setVelocityX(moveX);

        if(moveX<0) this.player.anims.play('left',true);
        else if(moveX>0) this.player.anims.play('right',true);
        else this.player.anims.play('turn');

        if(this.jump && this.player.body.touching.down){
            this.player.setVelocityY(-330);
            this.jumpSound.play();
            this.jump=false;
        }

        // Clavier
        if(this.cursors.left.isDown) this.player.setVelocityX(-160);
        else if(this.cursors.right.isDown) this.player.setVelocityX(160);

        if(this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
            this.jumpSound.play();
        }
    }

    createGems(amount){
        for(let i=0;i<amount;i++){
            const x=Phaser.Math.Between(50,750);
            const y=Phaser.Math.Between(50,500);
            const gem=this.gems.create(x,y,'gem').setScale(0.02);
            gem.setBounceY(Phaser.Math.FloatBetween(0.2,0.5));
            this.physics.add.collider(gem,this.platforms);
        }
    }

    collectGem(player,gem){
        gem.disableBody(true,true);
        window.playerData.gems++;
        this.collectSound.play();
        this.events.emit('updateUI');
    }

    createNPCs(){
        const npcData=[
            {x:500,y:450},
            {x:700,y:350},
            {x:300,y:300}
        ];
        npcData.forEach(d=>{
            const npc=this.npcs.create(d.x,d.y,'npc').setScale(0.05);
            this.physics.add.collider(npc,this.platforms);
            npc.setInteractive();
            npc.on('pointerdown',()=>{
                if(window.playerData.gems>=5){
                    window.playerData.gems-=5;
                    window.playerData.coins+=1;
                    this.tradeSound.play();
                    this.events.emit('updateUI');
                }
            });
        });
    }

    createTouchControls(){
        // Zones tactiles
        this.moveLeft=false; this.moveRight=false; this.jump=false;
        this.leftBtn=this.add.rectangle(80,500,120,120,0x000000,0.3).setScrollFactor(0).setInteractive();
        this.rightBtn=this.add.rectangle(200,500,120,120,0x000000,0.3).setScrollFactor(0).setInteractive();
        this.jumpBtn=this.add.rectangle(700,500,120,120,0x000000,0.3).setScrollFactor(0).setInteractive();

        this.leftBtn.on('pointerdown',()=>{this.moveLeft=true;});
        this.leftBtn.on('pointerup',()=>{this.moveLeft=false;});
        this.rightBtn.on('pointerdown',()=>{this.moveRight=true;});
        this.rightBtn.on('pointerup',()=>{this.moveRight=false;});
        this.jumpBtn.on('pointerdown',()=>{this.jump=true;});
    }
}

