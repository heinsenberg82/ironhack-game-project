export default class HitBox {
    constructor(x, y, dx, dy, width, height, callbackFlipX, flipped = false) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.height = height;
        this.callbackFlipCalcX = callbackFlipX;
        this.update(this.x, this.y, flipped);
    }

    
    static detectCollision(boxA, boxB) {
        const result = !(boxA.x > boxB.x + boxB.width ||
            boxA.x + boxA.width < boxB.x ||
            boxA.y > boxB.y + boxB.height ||
            boxA.y + boxA.height < boxB.y
        );
        
        return result;
    }
    
    update(x, y, flipped){
        this.x = x + this.dx;
        this.y = y + this.dy;

        if (flipped){
            this.x = this.callbackFlipCalcX?.(this.x);   
        }
        
        return this;
    }
}