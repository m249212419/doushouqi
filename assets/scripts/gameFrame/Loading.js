
cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },

        progressEffect: {
            default: null,
            type: cc.Node
        },

        progressLabel: {
            default: null,
            type: cc.Label
        }
    },

    /**
     * 
     * @param {场景名称} sceneName 
     * @param {加载完成后回调} onLoaded 
     */
    loadScene(sceneName, onLoaded) {
        this._preloadScene(sceneName, onLoaded);
    },

    /**
     * 加载资源(待完成)
     */
    loadAssets() {

    },

    /**
     * 预加载
     * @param {场景名称} sceneName 
     * @param {加载完成后回调} onLoaded 
     */
    _preloadScene(sceneName, onLoaded) {
        let info = cc.director._getSceneUuid(sceneName)
        if (info) {
            cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName)
            cc.loader.load(
                { uuid: info.uuid, type: 'uuid' },
                (completedCount, totalCount, item) => {
                    this._updateProgress(completedCount, totalCount)
                },
                (error, asset) => {
                    if (error) {
                        cc.error(1210, sceneName, error.message);
                    } else {
                        cc.director.loadScene(sceneName);
                    }
                    if (onLoaded) {
                        onLoaded(error, asset);
                    }
                }
            )
        } else {
            cc.error('Error PreloadScene: ' + sceneName);
        }
    },

    /**
     * 更新进度
     * @param {完成数量} completedCount 
     * @param {总数量} totalCount 
     */
    _updateProgress(completedCount, totalCount) {
        let step = completedCount / totalCount;
        this.progressBar.progress = step;
        if(this.progressEffect){
            this.progressEffect.x = -643 / 2 + 643 * step;
        }
        if(this.progressLabel){
            // this.progressLabel.string = `${completedCount}/${totalCount}`; 
            this.progressLabel.string = `${parsInt(step*100)}%`; 
        }
        
    }


});
