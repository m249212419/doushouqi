// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        loading: cc.Node
    },

    start () {

    },

    // update (dt) {},

    onStartGame(event) {
        var loading = this.loading.getComponent('Loading');
        loading.loadScene("game");
        // cc.director.preloadScene("game", function () {
        //     cc.log("Next scene preloaded");
        //     cc.director.loadScene('game');
        // });
        this.loading.active = true;
    },

});
