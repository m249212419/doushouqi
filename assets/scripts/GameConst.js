
//游戏状态
var GameState = {
    Start: 1,   //开始
    Gaming: 2,  //游戏中
    End: 3      //结束
};

//卡牌状态
var CardState = {
    CardBack: 1,    //背面
    CardFace: 2,    //正面
    Invalid: 3      //无效
};

//卡片类型
var CardType = {
    Shu: 1,
    Mao: 2,
    Gou: 3,
    Lang: 4,
    Bao: 5,
    Hu: 6,
    Shi: 7,
    Xiang: 8
}

//卡片数据:红蓝
var CardData = [];
for(var i=1; i<=8; i++){
    CardData.push(100+i);
    CardData.push(200+i);
}

//玩家类型：红/蓝
var PlayerType = {
    Red: 1,
    Blue: 2
}

//游戏倒计时
var DelayTime = 20;

exports.gameConst = {
    gameState: GameState,
    cardState: CardState,
    cardType: CardType,
    getCardData: function(){
        return CardData.clone();
    },

    playerType: PlayerType,
    delayTime: DelayTime
};