/**
 * 通过cc.loader.loadRes加载的资源 会缓存在内存里
 */
var audioPath = null;

const ResUtils = {

    loadRes(path, type, callback) {
        cc.loader.loadRes(path, type, (err, asset) => {
            if (err) {
                cc.log(`[资源加载] 错误 ${err}`);
                return;
            }
            if(callback){
                callback(asset)
            }
        });
    },

    destroy(node) {
        if (!node instanceof cc.Node) {
            cc.log("你要销毁的不是一个节点");
            return;
        }
        node.destroy();
    },

    playEffect(path, volume) {
        if (!path || !volume) {
            cc.log("参数错误");
            return;
        }
        let audioID = cc.audioEngine.play(path, false, volume);
        cc.audioEngine.setFinishCallback(audioID,  (ss, ss11) => {
            cc.loader.release(cc.loader._cache[ss.target.src].url);
        });
        return audioID;
    },

    playMusic(path, loop, volume) {
        if (!path || !volume) {
            cc.log("参数错误");
            return;
        }
        if (audioPath) {
            cc.loader.release(cc.loader._cache[audioPath].url);
        }
        audioPath = path;
        let audioID = cc.audioEngine.playMusic(path, loop, volume);
        cc.audioEngine.setFinishCallback(audioID,  (ss, ss11) => {
            cc.log("触发回调函数");
            cc.loader.release(cc.loader._cache[ss.target.src].url);
        });
        return audioID;
    },

    //方便扩展
    setSpriteFrame(node, spriteFrameName, callback) {
        this.loadRes(spriteFrameName, cc.SpriteFrame, (spriteFrame) => {
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            if(callback){
                callback(node);
            }
        });
    },

    instantiate(prefabName, callback) {
        this.loadRes(prefabName, cc.Prefab, (prefab) => {
            let node_prefab = cc.instantiate(prefab);
            if(callback){
                callback(node_prefab);
            }
        });
    },


};

module.exports = ResUtils;