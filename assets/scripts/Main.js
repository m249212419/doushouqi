
const UILoader = require("./gameFrame/UILoader");

cc.Class({
    extends: cc.Component,

    properties: {
        loading: cc.Node
    },

    start () {
        cc.global = {};
    },

    onStartGame(event) {
        // cc.global.isShuangRenDanJi = true;
        cc.global.isDanRenDanJi = true;
        var loading = this.loading.getComponent('Loading');
        loading.loadScene("game");
        this.loading.active = true;
    },

});
