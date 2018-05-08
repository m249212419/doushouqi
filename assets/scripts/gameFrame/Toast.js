
cc.Class({
    extends: cc.Component,

    properties: {
        txtLabel: cc.Label
    },

    showFadeOut(txt, dt, pos) {
        if(!dt){

        }
        txtLabel.string = txt;
    },

    showDown(txt, dt) {
        if(!dt){

        }
        txtLabel.string = txt;
    }


});
