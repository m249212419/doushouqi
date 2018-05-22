var engine;
var response = {};
try {
    engine = Matchvs.MatchvsEngine.getInstance();
} catch (e) {
    try {
        var jsMatchvs;
        if (wx && wx.connectSocket) {
            jsMatchvs = require("matchvs.all.weixin");
        } else {
            jsMatchvs = require("matchvs.all");
        }
        engine = new jsMatchvs.MatchvsEngine();
        response = new jsMatchvs.MatchvsResponse();
    } catch (e) {
        var MatchVSEngine = require('MatchvsEngine');
        engine = new MatchVSEngine();
    }
}
module.exports = {
    engine: engine,
    response: response
};
