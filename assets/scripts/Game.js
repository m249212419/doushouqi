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
        //注册事件监听
        this.registerEvent();
    },

    start() {
        //游戏数据
        this.gameData = {};
        this.node.emit('gameStart');
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

        this.selectedCard = null;
        this.curCard = null;

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
        this.node.emit('gameStart');
    },

    /**
     * 卡牌被点击
     */
    onCardSelect(event) {

        if (this.gameData.state != gameConst.GameState.Gaming) {
            return;
        }
        // if (this.gameData.curPlayerType != this.gameData.user.playerType) {
        //     //不是自己的回合,不处理
        //     this.showToast('对手的回合');
        //     return;
        // }

        var card = event.target.getComponent('Card');
        //存在选中的牌
        if (this.selectedCard) {
            if (this.selectedCard.idx[0] == card.idx[0] &&
                this.selectedCard.idx[1] == card.idx[1]) {
                //同一张牌
                this.selectedCard.node.setLocalZOrder(0);
                this.selectedCard.showCanMoveOrientation();
                this.selectedCard.node.scale = 1;
                this.selectedCard = null;
                return;
            }


            var validPos = function () {
                //判断是否为选中牌的周边牌
                var cardArr = this.getUpDownLeftRightCard(this.selectedCard);

                for (var i = 0; i < cardArr.length; i++) {
                    var item = cardArr[i];
                    if (item) {
                        if (item.idx[0] == card.idx[0] && item.idx[1] == card.idx[1]) {
                            return true;
                        }
                    }
                }
                return false;
            }

            var isValidPos = validPos.bind(this)();

            if (isValidPos) {
                if (card.state == gameConst.CardState.Invalid) {

                    /**
                      * 0 一样大
                      * 1 可通行
                      * 2 可吃
                      * 3 被吃
                      */
                    this.node.emit('moveCard', {
                        selectedIdx: this.selectedCard.idx,
                        moveIdx: card.idx,
                        compareValue: 1
                    });
                    return;
                }

                if (card.state == gameConst.CardState.CardFace
                    && card.cardType != this.gameData.curPlayerType) {


                    //判断大小：吃牌、自杀、同归于尽
                    var compareValue = this.compareCard(this.selectedCard, card);

                    this.node.emit('moveCard', {
                        selectedIdx: this.selectedCard.idx,
                        moveIdx: card.idx,
                        compareValue: compareValue
                    });

                    return;
                }
            }


            this.showToast('无法移动');
            return;
        }

        if (card.state == gameConst.CardState.CardFace
            && card.cardType != this.gameData.curPlayerType) {
            this.showToast('这是对手的牌');
            return;
        }

        if (card.state == gameConst.CardState.CardBack) {
            // card.shake((() => {
            //     this.throwTurn(card);
            // }));
            this.node.emit('openCard', { cardIdx: card.idx });
        }

        if (card.state == gameConst.CardState.CardFace) {
            //判断可移动方位:上下左右
            var orientations = [];
            var closeCount = 0;

            var cardArr = this.getUpDownLeftRightCard(card);
            for (var i = 0; i < cardArr.length; i++) {
                var item = cardArr[i];
                if (item) {
                    var compareValue = this.compareCard(card, item);
                    if (compareValue == 1 || compareValue == 2) {
                        orientations.push(gameConst.MoveType.Open);
                    } else if (compareValue == -1) {
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
            this.selectedCard = card;
        }

    },

    gameOver(card) {


        card.showWinTag(() => {
            //展示结束面板

        });
    },

    throwTurn(card) {
        this.gameData.curPlayerType = 3 - this.gameData.curPlayerType;
        if (this.curCard) {
            this.curCard.setUpTagVisble(false);
        }
        this.curCard = card;
        this.curCard.setUpTagVisble(true);
        if (this.gameData.curPlayerType == this.gameData.user.playerType) {
            //变亮能选择的卡牌
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var cardInfo = this._mapInfo[i][j];
                    var cardScript = this._mapInfo[i][j].node.getComponent('Card');
                    if (cardScript.state == gameConst.CardState.CardBack) {
                        cardScript.setCanSelectState(true);
                    } else if (cardScript.state == gameConst.CardState.CardFace &&
                        cardScript.cardType == this.gameData.curPlayerType) {
                        cardScript.setCanSelectState(true);
                    } else {
                        cardScript.setCanSelectState(false);
                    }
                }
            }
            this.showToast('你的回合');
        } else {
            //变暗所有卡牌
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var cardInfo = this._mapInfo[i][j];
                    var cardScript = this._mapInfo[i][j].node.getComponent('Card');
                    cardScript.setCanSelectState(false);
                }
            }
            this.showToast('对手的回合');
        }
    },

    getUpDownLeftRightCard(card) {
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
        return cardArr;
    },

    /**
     * card1 与 card2 比较
     * -1 不可通行
     * 0 一样大
     * 1 可通行
     * 2 可吃
     * 3 被吃
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
            return -1;
        } else {
            if (card2.cardValue > card1.cardValue) {
                if (card2.cardValue == gameConst.AnimalType.Xiang &&
                    card1.cardValue == gameConst.AnimalType.Shu) {
                    //鼠吃象
                    return 2;
                }
                return 3;
            } else if (card2.cardValue == card1.cardValue) {
                //拼了
                return 0;
            } else {
                if (card2.cardValue == gameConst.AnimalType.Shu &&
                    card1.cardValue == gameConst.AnimalType.Xiang) {
                    //鼠吃象
                    return 3;
                }
                return 2;
            }
        }
    },

    /**
     * 先手玩家显示
     */
    showFisrtToast() {
        var that = this;
        var playerType = this.gameData.curPlayerType;
        UILoader.instantiate("prefabs/gameToast", (node) => {
            var toast = node.getComponent('Toast');
            UILoader.setSpriteFrame(toast.node, "image/bg_toast_" + playerType, (node) => {
                that.node.addChild(node);
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
                    toast.show('对手的回合', () => {
                        this.gameData.state = gameConst.GameState.Gaming;
                    });
                }
            });
        });

    },

    showToast(content) {
        var that = this;
        UILoader.instantiate("prefabs/gameToast", (node) => {
            var toast = node.getComponent('Toast');
            UILoader.setSpriteFrame(toast.node,
                "image/bg_toast_" + this.gameData.curPlayerType,
                (node) => {
                    that.node.addChild(node);
                    toast.show(content);
                });
        });
    },

    registerEvent() {
        this.node.on('gameStart', (event) => {
            this.gameStart();
        });
        this.node.on('openCard', (event) => {
            var card = this._mapInfo[event.detail.cardIdx[0]][event.detail.cardIdx[1]].node.getComponent('Card');
            card.shake((() => {
                this.throwTurn(card);
            }));
        });
        this.node.on('moveCard', (event) => {

            var selectedCard = this._mapInfo[event.detail.selectedIdx[0]][event.detail.selectedIdx[1]].node.getComponent('Card');
            var card = this._mapInfo[event.detail.moveIdx[0]][event.detail.moveIdx[1]].node.getComponent('Card');

            /**
             * 0 一样大
             * 1 可通行
             * 2 可吃
             * 3 被吃
             */
            var compareValue = event.detail.compareValue;

            selectedCard.node.scale = 1.1;
            selectedCard.node.setLocalZOrder(99);

            var pos = selectedCard.node.position;
            var animationPos = pos;
            selectedCard.moveToPos(card.node.position, () => {

                if (compareValue != 1) {
                    UILoader.instantiate("prefabs/animal_die", (node) => {
                        node.position = animationPos;
                        this.mapNode.addChild(node);
                        node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
                            UILoader.destroy(node);
                        })));
                    });
                }

                var isGameOver = function () {
                    var validCard = [];
                    var blueCount = 0;
                    var redCount = 0;
                    for (var i = 0; i < 4; i++) {
                        for (var j = 0; j < 4; j++) {
                            var cardInfo = this._mapInfo[i][j];
                            var cardScript = this._mapInfo[i][j].node.getComponent('Card');
                            if (cardScript.state == gameConst.CardState.Invalid) {
                                if (cardScript.cardType == gameConst.PlayerType.Red) {
                                    redCount++;
                                } else {
                                    blueCount++;
                                }
                            } else {
                                validCard.push(cardScript);
                            }
                        }
                    }
                    //游戏结束
                    if (redCount == 8 || blueCount == 8) {
                        this.gameData.state = gameConst.GameState.End;
                        return { over: true, validCard: validCard };
                    }
                    return { over: false };
                }

                var winCard = null;

                if (compareValue == 3) {
                    selectedCard.setCardState(gameConst.CardState.Invalid);
                    selectedCard.node.position = pos;
                    animationPos = card.node.position;

                    var overIfo = isGameOver.bind(this)()
                    if (overIfo.over) {
                        winCard = card;
                    }
                } else if (compareValue == 0) {
                    selectedCard.setCardState(gameConst.CardState.Invalid);
                    card.setCardState(gameConst.CardState.Invalid);
                    selectedCard.node.position = pos;
                    animationPos = card.node.position;

                    var overIfo = isGameOver.bind(this)()
                    if (overIfo.over) {
                        if (overIfo.validCard.length > 0) {
                            winCard = overIfo.validCard[0];
                        } else {
                            winCard = selectedCard;
                        }
                    }
                } else {
                    card.node.position = pos;
                    
                    if(compareValue == 2){
                        card.setCardState(gameConst.CardState.Invalid);
                    }

                    [this._mapInfo[card.idx[0]][card.idx[1]].node,
                    this._mapInfo[selectedCard.idx[0]][selectedCard.idx[1]].node] =
                        [selectedCard.node, card.node];
                    [card.idx, selectedCard.idx] = [selectedCard.idx, card.idx];

                    animationPos = selectedCard.node.position;

                    var overIfo = isGameOver.bind(this)()
                    if (overIfo.over) {
                        winCard = selectedCard;
                    }
                }

                selectedCard.node.setLocalZOrder(0);
                selectedCard.showCanMoveOrientation();
                selectedCard.node.scale = 1;
                if (winCard) {
                    this.node.emit('gameOver', { cardIdx: winCard.idx });
                } else {
                    this.throwTurn(selectedCard);
                    this.selectedCard = null;
                }

            });

        });
        this.node.on('gameOver', (event) => {
            var card = this._mapInfo[event.detail.cardIdx[0]][event.detail.cardIdx[1]].node.getComponent('Card');
            this.gameOver(card);
        });
    }

});
