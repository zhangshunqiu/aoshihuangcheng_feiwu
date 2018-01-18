var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 引导模块管理器
 * author ： zrj
 *
*/
var GuideManager = (function () {
    function GuideManager() {
        this.guideModel = GuideModel.getInstance();
        this.guideBtnDic = {};
        this.needGuide = true; //是否需要引导
        //初始化引导界面
        this.initGuideView();
    }
    GuideManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new GuideManager();
        }
        return this._instance;
    };
    GuideManager.prototype.initGuideView = function () {
        if (!this.guideView) {
            this.guideView = new GuideView();
            App.EventSystem.dispatchEvent(WinManagerEvent.WIN_ADD, new WinManagerEvent(new WinManagerVO("", "", WinLay.GUIDE_LAY), this.guideView));
            this.guideView.left = this.guideView.right = this.guideView.top = this.guideView.bottom = 0;
            this.guideView.visible = false; //默认隐藏
        }
        // this.curGuideId = 1000;
        // this.curGuideStep = 1;
    };
    /**
     * 模块是否开启
     * @param moduleName  传winName，如果没有，传配置表里的client_name
     */
    GuideManager.prototype.isModuleOpen = function (moduleName) {
        var info = App.ConfigManager.getModuleOpenInfoByName(moduleName);
        if (info) {
            if ((App.RoleManager.roleInfo.turn >= info.limit[1] && info.limit[1] != 0)) {
                if (game.BossModel.getInstance().level >= info.limit[2]) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (App.RoleManager.roleInfo.lv >= info.limit[0]) {
                if (game.BossModel.getInstance().level >= info.limit[2]) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (game.BossModel.getInstance().level >= info.limit[2] && info.limit[2] != 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    };
    /**
     * 模块未开启提示
     * @param moduleName  传winName，如果没有，传配置表里的client_name
    */
    GuideManager.prototype.moduleNotOpenTip = function (moduleName) {
        var info = App.ConfigManager.getModuleOpenInfoByName(moduleName);
        if (info) {
            var str = "";
            if (game.BossModel.getInstance().level >= info.limit[2] && info.limit[2] != 0) {
                if ((App.RoleManager.roleInfo.turn < info.limit[1] && info.limit[1] != 0)) {
                    str += "转生等级" + info.limit[1] + "转开启" + info.name;
                }
                if (App.RoleManager.roleInfo.lv < info.limit[0]) {
                    str += "人物等级" + info.limit[0] + "级开启" + info.name;
                }
            }
            else {
                if (info.limit[2] != 0) {
                    var sceneInfo = App.ConfigManager.getHookSceneConfigByLevel(info.limit[2]);
                    str += "通关关卡" + sceneInfo.name + "开启" + info.name;
                }
                else {
                    if ((App.RoleManager.roleInfo.turn < info.limit[1] && info.limit[1] != 0)) {
                        str += "转生等级" + info.limit[1] + "转开启" + info.name;
                    }
                    if (App.RoleManager.roleInfo.lv < info.limit[0]) {
                        str += "人物等级" + info.limit[0] + "级开启" + info.name;
                    }
                }
            }
            App.GlobalTips.showTips(str);
        }
    };
    /**
     * 设置当前已完成最新引导id
    */
    GuideManager.prototype.setFinishGuideId = function (id) {
        if (!id) {
            this.curGuideId = 0;
            this.lastGuideId = 0;
            this.curGuideStep = 0;
            this.needGuide = true;
        }
        else {
            this.lastGuideId = id;
            var finishGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(id, 1);
            if (finishGuideInfo && finishGuideInfo.next_id) {
                this.curGuideId = finishGuideInfo.next_id;
                this.curGuideStep = 0;
                this.needGuide = true;
            }
            else {
                this.curGuideId = 0;
                this.curGuideStep = 0;
                this.needGuide = false;
            }
        }
        // this.startGuide = true;
        // this.checkGuide(this.curGuideId);
    };
    /**
     * 绑定点击事件，特地引导id对应特定step的特定按钮
     * @param btn 绑定的按钮
     * @param id 绑定的引导id
     * @param step 绑定的引导step
     */
    GuideManager.prototype.bindClickBtn = function (btn, id, step) {
        var _this = this;
        if (!this.guideBtnDic[id]) {
            this.guideBtnDic[id] = {};
        }
        if (this.curGuideId && this.curGuideId == id && (!this.guideBtnDic[id][step] || this.guideBtnDic[id][step].hashCode != btn.hashCode)) {
            if (btn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                btn.once(egret.TouchEvent.TOUCH_TAP, function () {
                    _this.NextStep(step);
                }, this, false, 9999);
                // App.logzrj("btnnnn",btn);
            }
            else if (btn.hasEventListener(egret.TouchEvent.TOUCH_END)) {
                btn.once(egret.TouchEvent.TOUCH_END, function () {
                    _this.NextStep(step);
                }, this, false, 9999);
            }
            this.guideBtnDic[id][step] = btn;
        }
    };
    /**
     * 解除绑定点击事件，特地引导id对应特定step的特定按钮
     * @param id 绑定的引导id
     * @param step 绑定的引导step
     */
    GuideManager.prototype.removeClickBtn = function (id, step) {
        if (this.guideBtnDic[id]) {
            if (step) {
                delete this.guideBtnDic[id][step];
            }
            else {
                delete this.guideBtnDic[id];
            }
        }
        // this.guideBtnDic = {};
    };
    /**
     * 根据任务ID判断是否开始引导
     * @param id 任务id
    */
    GuideManager.prototype.checkStartGuide = function (id) {
        if (App.agentConfig.guide) {
        }
        var curGUideInfo = App.ConfigManager.getGuideInfoByTaskId(id);
        if (curGUideInfo) {
            if (curGUideInfo.id >= this.curGuideId) {
                return true;
            }
        }
        return false;
    };
    /**
     * 开始引导
     * @param id 绑定的引导id
    */
    GuideManager.prototype.setStartGuide = function (id) {
        if (this.checkSpecialCondition(id)) {
            this.nextGuide();
        }
        else {
            if (this.lastGuideId || this.lastGuideId == 0) {
                this.startGuide = true;
                this.curGuideId = id;
                this.curGuideStep = 1;
            }
            else {
            }
        }
    };
    /**
     * 检测当前是否需要引导，引导到哪一步
     *  @param id 引导的id
    */
    GuideManager.prototype.checkGuide = function (id) {
        // if (1) { //屏蔽
        //     return;
        // }
        if (this.needGuide) {
            if (this.startGuide && id == this.curGuideId) {
                var curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(this.curGuideId, this.curGuideStep);
                if (curGuideInfo) {
                    if (this.guideBtnDic[this.curGuideId] && this.guideBtnDic[this.curGuideId][this.curGuideStep]) {
                        this.showGuide();
                    }
                }
                else {
                    App.logzrj("hideeee", this.curGuideStep);
                    this.hideGuide();
                    // this.removeClickBtn(this.curGuideId);
                    // this.nextGuide();
                }
            }
            else {
            }
        }
        else {
            for (var key in this.guideBtnDic) {
                delete this.guideBtnDic[key];
            }
        }
    };
    //下一个引导
    GuideManager.prototype.nextGuide = function () {
        var curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(this.curGuideId, this.curGuideStep);
        if (curGuideInfo && curGuideInfo.next_id) {
            App.Socket.send(9012, this.curGuideId);
            App.logzrj("finishGuide", this.curGuideId);
            this.startGuide = false;
            this.curGuideId = curGuideInfo.next_id;
            this.curGuideStep = 0;
        }
        else {
            this.curGuideId = 0;
            this.needGuide = false;
        }
        // this.needGuide = false;
        this.hideGuide();
    };
    //当前引导下一步
    GuideManager.prototype.NextStep = function (step) {
        // this.curGuideStep++;
        this.hideGuide();
        var curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(this.curGuideId, step + 1);
        if (!curGuideInfo) {
            this.removeClickBtn(this.curGuideId, null);
            this.nextGuide();
        }
        else {
            this.curGuideStep = step + 1;
            this.checkGuide(this.curGuideId);
        }
        // this.checkGuide(this.curGuideId); //不应该在这里检测
    };
    /**
     * 处理引导过程中的特殊情况
     * @param id 引导的id
    */
    GuideManager.prototype.checkSpecialCondition = function (id) {
        switch (id) {
            case 1000: {
                var equipInfo = game.HeroModel.getInstance().heroInfo[0].getEquipByPart(ConstEquipPart.WEAPON);
                if (equipInfo) {
                    return true;
                }
                break;
            }
            case 1002: {
                var equipInfo = game.HeroModel.getInstance().heroInfo[0].getEquipByPart(ConstEquipPart.CLOTH);
                if (equipInfo) {
                    return true;
                }
                break;
            }
            case 1019: {
                var artifactInfo = game.ArtifactModel.getInstance().artifactList;
                for (var key in artifactInfo) {
                    if (artifactInfo[key] != 0) {
                        return true;
                    }
                }
                break;
            }
            case 3: {
                var heroId = game.HeroModel.getInstance().heroInfo[0].id;
                var wingInfo = game.WingModel.getInstance().wingInfoObj[heroId];
                if (wingInfo) {
                    return true;
                }
                break;
            }
            case 3: {
                break;
            }
        }
    };
    GuideManager.prototype.showGuide = function () {
        this.guideView.showGuide();
    };
    GuideManager.prototype.hideGuide = function () {
        this.guideView.hideGuide();
    };
    return GuideManager;
}());
__reflect(GuideManager.prototype, "GuideManager");
//# sourceMappingURL=GuideManager.js.map