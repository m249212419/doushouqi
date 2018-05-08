

var gameConst = require("GameConst");

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

    // LIFE-CYCLE CALLBACKS:

    onLoad() { 
        //第一次进入初始化数据
        this.initMapData();
    },

    start() {
        this.gameStart();
    },

    update(dt) {

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
                    node: cardNode,
                    posIdx:[i, j],
                    pos:cardNode.position,
                };

                cardNode.cardInfo = cardInfo;
                arr[j] = cardInfo;
            }
        }
        console.log(this._mapInfo);
    },

    /**
     * 游戏开始
     */
    gameStart() {
        //设置玩家信息，确认红蓝双方
        this.setPlayerInfo();
        //重置卡牌数据
        this.resetCardData();
        /**
         * 显示开始提示
         * 1.随机先手玩家
         * 2.提示先手
         */
        
    },

    /**
     * 设置玩家信息
     */
    setPlayerInfo() {

    },

    /**
     * 重置卡牌数据
     */
    resetCardData(){
        var cardData = this.randomCardData();
        console.log(cardData);
    },

    /**
     * 随机卡牌 数据
     */
    randomCardData(){
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
        console.log(event.target.name);
    }

});
