const state = {
    TIMESTAMP: 0,
    GROUND_Y: 385,
    CANVAS:{
      WIDTH: 960,
      HEIGHT: 576,
    },
    PLAYER: {
        INSTANCE: null,
        X: null,
        Y: null,
        FACING_RIGHT: true,
        MOVING: false
    },
    ENEMIES: [],
    ENEMY_LAST_ATTACK: "",
    BACKGROUND: {
        X: 0,
        Y: 0,
        WIDTH: null,
        HEIGHT: null,
        VISIBLE_WIDTH: 0
    }
}

export default state;