export default class HitBox {
    constructor(dx, dy, width, height, callbackFlipCalcX) {
        this.x = 0;
        this.y = 0;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.height = height;
        this.callbackFlipCalcX = callbackFlipCalcX;
    }

    detectCollision(boxB) {
        return !(this.x > boxB.x + boxB.width ||
            this.x + this.width < boxB.x ||
            this.y > boxB.y + boxB.height ||
            this.y + this.height < boxB.y
        );
    }
    
    init(x, y){
        this.x = x + this.dx;
        this.y = y + this.dy;
        return this;
    }
}