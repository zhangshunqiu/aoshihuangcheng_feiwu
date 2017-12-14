/**
 * 引导模块管理器
 * author ： zrj
 * 
*/
class GuideManager {
    public guideModel: GuideModel = GuideModel.getInstance();
    public guideView: GuideView;
    public guideBtnDic = {};
    public curGuideId: number; //当前引导的id
    public curGuideStep: number; //当前引导步骤是第几步
    public needGuide: boolean = true; //是否需要引导
    public startGuide: boolean; //引导是否开始，触发器改变这个值
    public lastGuideId : number;//服务器记录的最后一个引导id

    private static _instance: GuideManager;
    public static getInstance(): GuideManager {
        if (this._instance == null) {
            this._instance = new GuideManager();
        }
        return this._instance;
    }
    public constructor() {
        //初始化引导界面
        this.initGuideView();
    }

    private initGuideView() {
        if (!this.guideView) {
            this.guideView = new GuideView();
            App.EventSystem.dispatchEvent(WinManagerEvent.WIN_ADD, new WinManagerEvent(new WinManagerVO("", "", WinLay.GUIDE_LAY), this.guideView));
            this.guideView.left = this.guideView.right = this.guideView.top = this.guideView.bottom = 0;
            this.guideView.visible = false; //默认隐藏
        }
        // this.curGuideId = 1000;
        // this.curGuideStep = 1;
    }

    /**
     * 模块是否开启
     * @param moduleName  传winName，如果没有，传配置表里的client_name
     */
    public isModuleOpen(moduleName: string) {
        let info = App.ConfigManager.getModuleOpenInfoByName(moduleName);
        if (info) {
            if ((App.RoleManager.roleInfo.turn >= info.limit[1] && info.limit[1] != 0)) { //转生
                if (game.BossModel.getInstance().level >= info.limit[2]) { //关卡
                    return true;
                } else {
                    return false;
                }
            } else if (App.RoleManager.roleInfo.lv >= info.limit[0]) {  //等级
                if (game.BossModel.getInstance().level >= info.limit[2]) { //关卡
                    return true;
                } else {
                    return false;
                }
            } else if (game.BossModel.getInstance().level >= info.limit[2]) { //关卡
                return true;
            } else {
                return false;
            }
        } else { //没有配置，默认开启
            return true;
        }
    }

    /**
     * 模块未开启提示
     * @param moduleName  传winName，如果没有，传配置表里的client_name
    */
    public moduleNotOpenTip(moduleName: string) {
        let info = App.ConfigManager.getModuleOpenInfoByName(moduleName);
        if (info) {
            let str = "";
            if (game.BossModel.getInstance().level >= info.limit[2] && info.limit[2] != 0) { //通关了关卡
                if ((App.RoleManager.roleInfo.turn < info.limit[1] && info.limit[1] != 0)) { //转生
                    str += "转生等级" + info.limit[1] + "转开启" + info.name;
                }
                if (App.RoleManager.roleInfo.lv < info.limit[0]) {  //等级
                    str += "人物等级" + info.limit[0] + "级开启" + info.name;
                }
            } else {
                if (info.limit[2] != 0) {
                    let sceneInfo = App.ConfigManager.getHookSceneConfigByLevel(info.limit[2]);
                    str += "通关关卡" + sceneInfo.name + "开启" + info.name;
                } else {
                    if ((App.RoleManager.roleInfo.turn < info.limit[1] && info.limit[1] != 0)) { //转生
                        str += "转生等级" + info.limit[1] + "转开启" + info.name;
                    }
                    if (App.RoleManager.roleInfo.lv < info.limit[0]) {  //等级
                        str += "人物等级" + info.limit[0] + "级开启" + info.name;
                    }
                }
            }
            App.GlobalTips.showTips(str);
        }
    }

    /**
     * 设置当前已完成最新引导id
    */
    public setFinishGuideId(id: number) {
        if (!id) {  //一个引导都没有完成
            this.curGuideId = 0;
            this.lastGuideId = 0;
            this.curGuideStep = 1;
            this.needGuide = true;
        } else {
            this.lastGuideId = id;
            let finishGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(id, 1);
            if (finishGuideInfo && finishGuideInfo.next_id) {
                this.curGuideId = finishGuideInfo.next_id;
                this.curGuideStep = 1;
                this.needGuide = true;
            } else {  //引导全部完成了
                this.curGuideId = 0;
                this.curGuideStep = 0;
                this.needGuide = false;
            }
        }
        // this.startGuide = true;
        this.checkGuide(this.curGuideId);
    }

    /**
     * 绑定点击事件，特地引导id对应特定step的特定按钮
     * @param btn 绑定的按钮
     * @param id 绑定的引导id
     * @param step 绑定的引导step
     */
    public bindClickBtn(btn: egret.DisplayObject, id: number, step: number) {
        if (!this.guideBtnDic[id]) {
            this.guideBtnDic[id] = {}
        }
        if (this.curGuideId && (!this.guideBtnDic[id][step] || this.guideBtnDic[id][step].hashCode != btn.hashCode)) { //有引导id才给绑定
            if (btn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                btn.once(egret.TouchEvent.TOUCH_TAP, () => {
                    this.NextStep(step);
                }, this, false, 9999);
                // App.logzrj("btnnnn",btn);
            } else if (btn.hasEventListener(egret.TouchEvent.TOUCH_END)) {
                btn.once(egret.TouchEvent.TOUCH_END, () => {
                    this.NextStep(step);
                }, this, false, 9999);
            }
            this.guideBtnDic[id][step] = btn;
        }
    }

    /**
     * 解除绑定点击事件，特地引导id对应特定step的特定按钮
     * @param id 绑定的引导id
     * @param step 绑定的引导step
     */
    public removeClickBtn(id: number, step: number) {
        if (this.guideBtnDic[id]) {
            if (step) {
                delete this.guideBtnDic[id][step];
            } else {
                delete this.guideBtnDic[id];
            }
        }
        // this.guideBtnDic = {};

    }

    /**
     * 根据任务ID判断是否开始引导
     * @param id 任务id
    */
    public checkStartGuide(id: number) {
        if (App.agentConfig.guide) {
            
        }
        let curGUideInfo = App.ConfigManager.getGuideInfoByTaskId(id);
        if (curGUideInfo) {
            if (curGUideInfo.id >= this.curGuideId) {
                return true;
            }
        }
        return false;
    }


    /**
     * 开始引导
     * @param id 绑定的引导id
    */
    public setStartGuide(id: number) {
        if (this.checkSpecialCondition(id)) {
            this.nextGuide();
        } else {
            if (this.lastGuideId || this.lastGuideId == 0) { //拿到服务端信息了
                this.startGuide = true;
                this.curGuideId = id;
                this.curGuideStep = 1;
            } else {

            }
        }
    }

    /**
     * 检测当前是否需要引导，引导到哪一步
     *  @param id 引导的id
    */
    public checkGuide(id: number) {
        // if (1) { //屏蔽
        //     return;
        // }
        if (this.needGuide) {  //需要新手引导
            if (this.startGuide && id == this.curGuideId) {
                let curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(this.curGuideId, this.curGuideStep);
                if (curGuideInfo) {
                    if (this.guideBtnDic[this.curGuideId] && this.guideBtnDic[this.curGuideId][this.curGuideStep]) {
                        this.showGuide();
                    }
                } else {
                    this.hideGuide();
                    // this.removeClickBtn(this.curGuideId);
                    // this.nextGuide();
                }
            } else {

            }
        } else {  //清除所有新手引导绑定
            for (let key in this.guideBtnDic) {
                delete this.guideBtnDic[key];
            }
        }
    }

    //下一个引导
    public nextGuide() {
        let curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(this.curGuideId, this.curGuideStep);
        if (curGuideInfo && curGuideInfo.next_id) { //完成引导，记录
            App.Socket.send(9012, this.curGuideId);
            this.startGuide = false;
            this.curGuideId = curGuideInfo.next_id;
            this.curGuideStep = 1;
        } else {
            this.curGuideId = 0;
            this.needGuide = false;
        }
        // this.needGuide = false;
        this.hideGuide();
    }
    //当前引导下一步
    public NextStep(step) {
        // this.curGuideStep++;
        this.hideGuide();
        let curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(this.curGuideId, step + 1);
        if (!curGuideInfo) { //走完所有步骤引导了
            this.removeClickBtn(this.curGuideId, null);
            this.nextGuide();
        } else {
            this.curGuideStep = step + 1;
            this.checkGuide(this.curGuideId);
        }
        // this.checkGuide(this.curGuideId); //不应该在这里检测
    }

    /**
     * 处理引导过程中的特殊情况 
     * @param id 引导的id
    */
    public checkSpecialCondition(id: number) {
        switch (id) {
            case 1000: { //装备武器
                let equipInfo = (game.HeroModel.getInstance() as game.HeroModel).heroInfo[0].getEquipByPart(ConstEquipPart.WEAPON);
                if (equipInfo) {
                    return true;
                }
                break;
            }
            case 1002: {  //装备衣服
                let equipInfo = (game.HeroModel.getInstance() as game.HeroModel).heroInfo[0].getEquipByPart(ConstEquipPart.CLOTH);
                if (equipInfo) {
                    return true;
                }
                break;
            }

            case 1019: {  //激活神器
                let artifactInfo = (game.ArtifactModel.getInstance() as game.ArtifactModel).artifactList;
                for (let key in artifactInfo) {
                    if (artifactInfo[key] != 0) {
                        return true;
                    }
                }
                break;
            }

            case 3: {  //激活翅膀
                let heroId = (game.HeroModel.getInstance() as game.HeroModel).heroInfo[0].id;
                let wingInfo = (game.WingModel.getInstance() as game.WingModel).wingInfoObj[heroId];
                if (wingInfo) {
                    return true;
                }
                break;
            }

            case 3: {  //VIP礼包

                break;
            }

        }
    }

    public showGuide() {
        this.guideView.showGuide();
    }

    public hideGuide() {
        this.guideView.hideGuide();
    }

}