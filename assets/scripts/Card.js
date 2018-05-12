const UILoader = require("./gameFrame/UILoader");
const gameConst = require("GameConst");

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

    setCardDataByInfo(cardInfo) {
        this.setCardState(cardInfo.state);
        //位置初始化
        this.node.position = cardInfo.initPos;
        //idx初始化
        this.idx = cardInfo.idx;
        this.setCanSelectState(false);
        var orientation = this.node.getChildByName('orientation');
        orientation.active = false;
        this.setCardTypeAndValue(cardInfo.type, cardInfo.value);
    },

    setCardTypeAndValue(type, value) {
        this.cardType = type;
        this.cardValue = value;
        //红蓝类型
        UILoader.setSpriteFrame(this.node, "image/bg_item_" + type);
        //动物类型、名称
        UILoader.setSpriteFrame(this.animal, 'image/animal_' + value);
        UILoader.setSpriteFrame(this.animalName, `image/name_${type}_${value}`);
    },

    setCardState(state) {
        this.state = state;
        switch (state) {
            case gameConst.CardState.CardBack:
                this.cardBack.active = true;
                this.node.opacity = 255;
                break;
            case gameConst.CardState.CardFace:
                this.cardBack.active = false;
                this.node.opacity = 255;
                break;
            case gameConst.CardState.Invalid:
                this.node.opacity = 0;
                break;
        }
    },

    setCanSelectState(canSelect) {
        this.selectTag.active = canSelect;
    },

    showCanMoveOrientation(orientations) {
        this.orientations.map((node, idx) => {
            //value: 0--隐藏 1--显示绿色 2--显示红色
            var value = orientations[idx];
            if (value > 0) {
                UILoader.setSpriteFrame(node, 'image/jiantou_' + value);
                node.active = true;
            } else {
                node.active = false;
            }
        });

        var orientation = this.node.getChildByName('orientation');
        orientation.active = true;
    },

    shake(callback) {
        var shake = this.node.getComponent("Shake");
        shake.shake(() => {
            this.setCardState(gameConst.CardState.CardFace);
            if(callback){
                callback();
            }
        });
    }



});