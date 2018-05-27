/* 存放全局变量 */
var _Config = {
    MAX_PLAYER_COUNT: 2,

    Event: {
        GAME_START_EVENT: "gameStart",
        OPEN_CARD: "openCard",
        PLAYER_MOVE_EVENT: "playerMove",
        GAIN_SCORE_EVENT: "gainScore",
        PLAYER_POSITION_EVENT: "playerPosition",
    },

    channel: 'MatchVS',
    platform: 'alpha',
    gameId: 200922,
    gameVersion: 1,
    appKey: '42471a8aaf0a41ba86f0506552838644',
    secret: '09acfcab27ad49b9ac960345cf40b293',

    userInfo: null,
    playerUserIds: [],
    isRoomOwner: false,
    events: {},
};
module.exports = _Config;