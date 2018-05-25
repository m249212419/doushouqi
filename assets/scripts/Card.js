const ResUtils = require("./gameFrame/ResUtils");
const gameConst = require("GameConst");

cc.Class({
    extends: cc.Component,

    properties: {
        cardBack: cc.Node,
        animal: cc.Sprite,
        animalName: cc.Sprite,
        selectTag: cc.Node,
        orientations: [cc.Node],
        winTag: cc.Node,
        upTag: cc.Node,
    },

    setCardDataByInfo(cardInfo) {
        this.setCardState(cardInfo.state);
        //位置初始化
        this.node.position = cardInfo.initPos;
        this.node.scale = 1;
        //idx初始化
        this.idx = cardInfo.idx;
        this.setCanSelectState(false);
        var orientation = this.node.getChildByName('orientation');
        orientation.active = false;
        this.setCardTypeAndValue(cardInfo.type, cardInfo.value);
        this.winTag.active = false;
        this.upTag.active = false;
        this.node.setLocalZOrder(0);
    },

    setCardTypeAndValue(type, value) {
        this.cardType = type;
        this.cardValue = value;
        //红蓝类型
        ResUtils.setSpriteFrame(this.node, "image/bg_item_" + type);
        //动物类型、名称
        ResUtils.setSpriteFrame(this.animal, 'image/animal_' + value);
        ResUtils.setSpriteFrame(this.animalName, `image/name_${type}_${value}`);
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
        var orientation = this.node.getChildByName('orientation');
        if (orientations && orientations.length > 0) {
            this.orientations.map((node, idx) => {
                //value: 0--隐藏 1--显示绿色 2--显示红色
                var value = orientations[idx];
                if (value > 0) {
                    ResUtils.setSpriteFrame(node, 'image/jiantou_' + value);
                    node.active = true;
                } else {
                    node.active = false;
                }
            });
            orientation.active = true;
        } else {
            orientation.active = false;
        }
    },

    shake(callback) {
        var shake = this.node.getComponent("Shake");
        shake.shake(() => {
            this.setCardState(gameConst.CardState.CardFace);
            if (callback) {
                callback();
            }
        });
    },

    setUpTagVisble(visble) {
        this.upTag.active = visble;
    },

    moveToPos(position, callback) {
        this.node.runAction(cc.sequence(cc.moveTo(0.2, position), cc.callFunc(() => {
            if (callback) {
                callback();
            }
        })));
    },

    showWinTag(callback) {
        this.node.setLocalZOrder(100);
        var orientation = this.node.getChildByName('orientation');
        orientation.active = false;
        this.upTag.active = false;
        this.selectTag.active = false;
        ResUtils.setSpriteFrame(this.winTag, 'image/word_win_'+this.cardType, ()=>{
            this.winTag.active = true;
            this.node.runAction(cc.sequence(
                cc.spawn(cc.moveTo(0.3, cc.v2(0, 0)), cc.scaleTo(0.3, 1.5)),
                cc.callFunc(() => {
                    if (callback) {
                        callback();
                    }
                })));
        });
    }



});