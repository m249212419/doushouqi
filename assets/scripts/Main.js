
const UILoader = require("./gameFrame/UILoader");

cc.Class({
    extends: cc.Component,

    properties: {
        loading: cc.Node
    },

    start () {
        UILoader.loadRes("prefabs/gameToast", cc.Prefab, (prefab) => {
            UILoader.instantiate(prefab, this.node, (node)=>{
                var toast = node.getComponent('Toast');
                toast.show('这是一个Toast');
            });
        });
    },

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
