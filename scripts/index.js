import Background from "./Background.js"
import state from "./state.js";
import Hero from "./Hero.js";
import Enemy from "./Enemy.js";

let fpsInterval, startTime, now, then, elapsed;

window.addEventListener("load", ()=>{
    const canvas = document.getElementById("main-canvas");
    /** @type { CanvasRenderingContext2D } */
    const ctx = canvas.getContext("2d");
    const player = new Hero(ctx);
    const enemy = new Enemy(ctx);
    const enemies = [ enemy ];

    const background = new Background(enemies);

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = window.performance.now();
        startTime = then;
        animate();
    }
    
    function animate(){
        requestAnimationFrame(animate);

        now = window.performance.now();
        elapsed = now - then;
        
        if (elapsed > fpsInterval){
            state.GAME_FRAME++;
            clear(ctx);
            background.draw(ctx);
            
            player.draw(ctx);
            enemy.draw(ctx)
            player.update(ctx);
            enemy.update();
            
            if (player.state.hitbox.detectCollision(enemy.state.hitbox)){
                console.log("collision detected")
            }
            
            background.configMove();
        }
    }
    
    startAnimating(25);
    
});

function clear(ctx){
    ctx.clearRect(0, 0, state.CANVAS.WIDTH, state.CANVAS.HEIGHT);
}