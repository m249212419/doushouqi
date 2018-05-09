
var gameConst = require("GameConst");

cc.Class({
    extends: cc.Component,

    properties: {
        cardBack: cc.Node,
        animal: cc.Sprite,
        animalName: cc.Sprite,
        selectTag: cc.Node,
        orientations: [cc.Node],
        winTag: cc.Node
    },

    onLoad() {
        
    },

    setCardDataByIdx(index) {

    },

    setCardState(state) {

    },

    showCardFace() {

    },

    setCanSelectState(select) {

    },

    showCanMoveOrientation(orientations) {

    },

    shake() {
        var shake = this.node.getComponent("Shake");
        shake.shake(()=>{
            this.cardBack.active = false;
        });
    }



});