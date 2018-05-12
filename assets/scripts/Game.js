const UILoader = require("./gameFrame/UILoader");
const gameConst = require("GameConst");

cc.Class({
    extends: cc.Component,

    properties: {
        //地图节点
        mapNode: {
            default: null,
            type: cc.Node
        },

        //header信息
        header: {
            default: null,
            type: cc.Node
        },

        //当前游戏描述
        curDesc: {
            default: null,
            type: cc.Sprite
        }
    },

    onLoad() {
        //第一次进入初始化数据
        this.initMapData();
        //游戏数据
        this.gameData = {};
    },

    start() {
        this.gameStart();
    },

    /**
     * 初始化 地图数据
     */
    initMapData() {
        this._mapInfo = [];
        for (var i = 0; i < 4; i++) {
            var arr = [];
            this._mapInfo[i] = arr;
            for (var j = 0; j < 4; j++) {
                var cardNode = this.mapNode.getChildByName(`card_${i}_${j}`);
                cardNode.on('click', this.onCardSelect, this);
                var cardInfo = {
                    node: cardNode, //每次移动后交换node，其他数据只做初始化使用
                    idx: [i, j],
                    initPos: cardNode.position,
                    state: gameConst.CardState.CardBack,
                    type: 0,
                    value: 0,
                };
                arr[j] = cardInfo;
            }
        }
    },

    /**
     * 游戏开始
     */
    gameStart() {
        this.gameData.state = gameConst.GameState.Start;
        //设置玩家信息
        this.setPlayerInfo();
        //重置卡牌数据
        this.resetCardData();
        //随机先手玩家
        this.gameData.curPlayerType = Math.random2(1, 2);
        this.showFisrtToast();

        if (this.gameData.curPlayerType == this.gameData.user.playerType) {
            //自己的回合
        } else {
            //对方的回合（调用AI）

        }

    },

    /**
     * 设置玩家信息
     */
    setPlayerInfo() {
        //双方阵营数据
        this.gameData.user = {};
        this.gameData.other = {};
        //设置双方颜色阵营
        this.gameData.user.playerType = gameConst.PlayerType.Red;
        this.gameData.other.playerType = gameConst.PlayerType.Blue;
        //对战信息背景
        var bg = this.header.getChildByName('bg');
        bg.scaleX = 1;
        //对战信息显示
        var user1 = this.header.getChildByName('info1');
        var user2 = this.header.getChildByName('info2');
        //头像框颜色设置
        var headFrame1 = user1.getChildByName('head_frame');
        UILoader.setSpriteFrame(headFrame1, "image/head_" + gameConst.PlayerType.Red);

        var headFrame2 = user2.getChildByName('head_frame');
        UILoader.setSpriteFrame(headFrame2, "image/head_" + gameConst.PlayerType.Blue);

        //头像
        var head1 = user1.getChildByName('head').getChildByName('image');
        UILoader.setSpriteFrame(head1, "image/animal_" + Math.random2(1, 8));

        var head2 = user2.getChildByName('head').getChildByName('image');
        UILoader.setSpriteFrame(head2, "image/animal_" + Math.random2(1, 8));

        //名称、性别
        var name1 = user1.getChildByName('name').getComponent(cc.Label);
        var name2 = user2.getChildByName('name').getComponent(cc.Label);
        name1.string = '自己';
        name2.string = '电脑';
        UILoader.setSpriteFrame(user1.getChildByName('sex'), "image/sex_" + Math.random2(1, 2));
        UILoader.setSpriteFrame(user2.getChildByName('sex'), "image/sex_" + Math.random2(1, 2));
    },

    /**
     * 重置卡牌数据
     */
    resetCardData() {
        var cardData = this.randomCardData();
        var idx = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var data = cardData[idx];

                var cardInfo = this._mapInfo[i][j];
                var card = cardInfo.node.getComponent('Card');
                cardInfo.state = gameConst.CardState.CardBack;
                //红蓝类型
                cardInfo.type = parseInt(data / 100);
                //动物类型、名称
                cardInfo.value = parseInt(data % 100);
                //设置card数据
                card.setCardDataByInfo(cardInfo);

                idx++;
            }
        }

    },

    /**
     * 随机卡牌 数据
     */
    randomCardData() {
        var cardData = gameConst.getCardData();
        cardData.shuffle();
        return cardData;
    },

    /**
     * 认输事件
     */
    onRenShuClick() {

    },

    /**
     * 卡牌被点击
     */
    onCardSelect(event) {

        if (this.gameData.state != gameConst.GameState.Gaming) {
            return;
        }

        if (this.gameData.curPlayerType != this.gameData.user.playerType) {
            //不是自己的回合,不处理
            this.showToast('对手的回合');
            return;
        }
        var card = event.target.getComponent('Card');
        if (card.state == gameConst.CardState.CardFace
            && card.cardType != this.gameData.curPlayerType) {
            this.showToast('这是对手的牌');
            return;
        }

        if (card.state == gameConst.CardState.CardBack) {
            //变暗所有卡牌
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var cardInfo = this._mapInfo[i][j];
                    var cardScript = this._mapInfo[i][j].node.getComponent('Card');
                    cardScript.setCanSelectState(false);
                }
            }
            card.shake((() => {
                this.gameData.curPlayerType = 3 - this.gameData.curPlayerType;
                this.showToast('对手的回合');
            }));
        }

        if (card.state == gameConst.CardState.CardFace) {
            //判断可移动方位:上下左右
            var orientations = [];
            var closeCount = 0;

            var idxV = card.idx[0];
            var idxH = card.idx[1];

            var idxUp = idxV - 1;
            var idxDown = idxV + 1;
            var idxLeft = idxH - 1;
            var idxRight = idxH + 1;

            //获取上下左右的卡牌状态
            var upCard = idxUp < 0 ? null : this._mapInfo[idxUp][idxH].node.getComponent('Card');
            var downCard = idxDown > 3 ? null : this._mapInfo[idxDown][idxH].node.getComponent('Card');
            var leftCard = idxLeft < 0 ? null : this._mapInfo[idxV][idxLeft].node.getComponent('Card');
            var rightCard = idxRight > 3 ? null : this._mapInfo[idxV][idxRight].node.getComponent('Card');

            var cardArr = [upCard, downCard, leftCard, rightCard];
            for (var i = 0; i < cardArr.length; i++) {
                var item = cardArr[i];
                if (item) {
                    var compareValue = this.compareCard(card, item);
                    if (compareValue > 0) {
                        orientations.push(gameConst.MoveType.Open);
                    } else if (compareValue == 0) {
                        orientations.push(gameConst.MoveType.Close);
                        closeCount++;
                    } else {
                        orientations.push(gameConst.MoveType.Die);
                    }
                } else {
                    orientations.push(gameConst.MoveType.Close);
                    closeCount++;
                }
            }

            if (closeCount == 4) {
                this.showToast('无法移动');
                return;
            }

            event.target.scale = 1.1;
            event.target.setLocalZOrder(99);
            card.showCanMoveOrientation(orientations);
        }

    },

    /**
     * card1 与 card2 比较
     * @param card1 
     * @param card2 
     */
    compareCard(card1, card2) {
        if (!card1 || !card2) {
            return -1;
        }
        //无效状态
        if (card2.state == gameConst.CardState.Invalid) {
            return 1;
        } else if (card2.state == gameConst.CardState.CardBack
            || card2.cardType == card1.cardType) {
            return 0;
        } else {
            if (card2.cardValue >= card1.cardValue ||
                (card2.cardValue == gameConst.AnimalType.Shu &&
                    card1.cardValue == gameConst.AnimalType.Xiang)) {
                return -1;
            } else {
                return 1;
            }
        }
    },

    /**
     * 先手玩家显示
     */
    showFisrtToast() {
        var playerType = this.gameData.curPlayerType;
        UILoader.instantiate("prefabs/gameToast", this.node, (node) => {
            var toast = node.getComponent('Toast');
            UILoader.setSpriteFrame(toast.node, "image/bg_toast_" + playerType, (node) => {
                if (this.gameData.user.playerType == playerType) {
                    toast.show('你的回合', () => {
                        //点亮所有卡牌
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                var cardInfo = this._mapInfo[i][j];
                                var card = this._mapInfo[i][j].node.getComponent('Card');
                                card.setCanSelectState(true);
                            }
                        }
                        this.gameData.state = gameConst.GameState.Gaming;
                    });
                } else {
                    toast.show('对手的回合', ()=>{
                        this.gameData.state = gameConst.GameState.Gaming;
                    });
                }
            });
        });

    },

    showToast(content) {
        UILoader.instantiate("prefabs/gameToast", this.node, (node) => {
            var toast = node.getComponent('Toast');
            UILoader.setSpriteFrame(toast.node,
                "image/bg_toast_" + this.gameData.curPlayerType,
                (node) => {
                    toast.show(content);
                });
        });
    }

});
