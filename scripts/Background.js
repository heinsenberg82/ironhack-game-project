import state from "./state.js";

export default class Background {
    constructor() {
        this.x = 0;        
        this.y = 0;
        this.spriteWidth = 314;
        this.spriteHeight = 100;
        this.width = this.spriteWidth * 6;
        this.heigth = this.spriteHeight * 6;
        this.layers = [];
        this.speed = 1;
        
        this.layer1 = new Image();
        this.layer1.src = "/images/background/1-Background.png";
        this.layer1.speed = this.speed;

        this.layer2 = new Image();
        this.layer2.src = "/images/background/2-super far.png";
        this.layer2.speed = this.speed * 0.3;

        this.layer3 = new Image();
        this.layer3.src = "/images/background/3-far.png";
        this.layer3.speed = this.speed * 0.5;

        this.layer4 = new Image();
        this.layer4.src = "/images/background/4-far light.png";
        this.layer4.speed = this.speed * 0.7;

        this.layer5 = new Image();
        this.layer5.src = "/images/background/5-close.png";
        this.layer5.speed = this.speed * 0.8;

        this.layer6 = new Image();
        this.layer6.src = "/images/background/6-close light.png";
        this.layer6.speed = this.speed * 0.9;

        this.layer7 = new Image();
        this.layer7.src = "/images/background/7-tileset.png";
        this.layer7.speed = this.speed * 1;
        
        this.layers.push(this.layer1, this.layer2, this.layer3, this.layer4, this.layer5, this.layer6, this.layer7);
    }

    /** @param ctx { CanvasRenderingContext2D } */
    draw(ctx){
        this.layers.forEach(layer => {
            ctx.drawImage(layer, 0, 0, this.spriteWidth, this.spriteHeight,
                this.x * layer.speed, this.y, this.width, this.heigth);
        });
    }
    
    moveLeft(){
        if (this.x <= 0){
            this.x++;
        }
    }
    
    moveRight(){
        if (Math.abs(this.x) < this.width * 0.3){
            this.x-=2;
        }
    }
}