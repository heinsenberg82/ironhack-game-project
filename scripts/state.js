const state = {
    GAME_FRAME: 0,
    GROUND_Y: 385,
    CANVAS:{
      WIDTH: 720,
      HEIGHT: 576,
    },
    PLAYER: {
        X: null,
        Y: null,
        FACING_RIGHT: true,
        MOVING: false
    },
    BACKGROUND: {
        X: 0,
        Y: 0,
        WIDTH: null,
        HEIGHT: null,
        VISIBLE_WIDTH: 0
    }
}

export default state;