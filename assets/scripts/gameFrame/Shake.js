/**
 * 自定义抖动效果
 */
var Shake = cc.Class({
    extends: cc.Component,

    properties: {
        //抖动时间
        duration: 0,
        //X轴抖动范围
        shakeX: 0,
        shakeY: 0,
    },

    shake: function (callback) {
        if(this.shaking){
            return;
        }
        this.callback = callback;
        this.shaking = true;
        this.dtCost = 0;
        this.nodeInitialPos = this.node.getPosition();
        this.unschedule(this.doSchedule);
        this.schedule(this.doSchedule, 0, cc.macro.REPEAT_FOREVER, 0);
    },
    doSchedule: function (dt) {
        var dt2 = dt * 50;
        var randX = this.getRandomStrength(-this.shakeX, this.shakeX) * dt2;
        var randY = this.getRandomStrength(-this.shakeY, this.shakeY) * dt2;
        this.node.setPosition(cc.pAdd(this.nodeInitialPos, cc.p(randX, randY)));
        this.dtCost += dt;
        if (this.dtCost >= this.duration) {
            this.unschedule(this.doSchedule);
            this.node.setPosition(this.nodeInitialPos);
            this.shaking = false;
            if(this.callback){
                this.callback();
            }
        }
    },
    //获取两个数间的随机值
    getRandomStrength: function (min, max) {
        return Math.random() * (max - min + 1) + min;
    },
});
