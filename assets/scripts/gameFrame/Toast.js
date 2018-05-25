
var ShowType = cc.Enum({
    FadeOut: 1
});

const ResUtils = require("./ResUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Label,
        showTime: 1,
        actionTime: 1,
        showPos: cc.v2(410, 780),
        showType: {
            default: ShowType.FadeOut,
            type: ShowType
        },
    },

    show(txt, callback) {
        if(this.showType == ShowType.FadeOut){
            this.showFadeOut(txt, callback);
        }
    },

    showFadeOut(txt, callback) {
        this.node.x = this.showPos.x;
        this.node.y = this.showPos.y;
        this.content.string = txt;
        this.node.runAction(cc.sequence(cc.delayTime(this.showTime), 
            cc.fadeOut(this.actionTime), 
            cc.callFunc(()=>{
                if(callback){
                    callback();
                }
                ResUtils.destroy(this.node);
            })));
    },


});
