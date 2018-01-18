var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var game;
(function (game) {
    var MainLineTaskView = (function (_super) {
        __extends(MainLineTaskView, _super);
        function MainLineTaskView(skinName) {
            var _this = _super.call(this, "MainLineTaskSkin") || this;
            _this._mainModule = game.MainUIModel.getInstance();
            _this._mainlinetaks_eventid = 0;
            _this._cur_taskid = -1;
            _this._cur_taskstate = 0;
            _this._chanllengeEventId = 0; //能否挑战boss的事件id
            return _this;
        }
        Object.defineProperty(MainLineTaskView.prototype, "taskId", {
            get: function () {
                return this._cur_taskid;
            },
            set: function (v) {
                this._cur_taskid = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainLineTaskView.prototype, "taskState", {
            get: function () {
                return this._cur_taskstate;
            },
            set: function (v) {
                this._cur_taskstate = v;
            },
            enumerable: true,
            configurable: true
        });
        MainLineTaskView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            // this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // 	this.getMainLineTaskReward();
            // }, this);
            this.btn_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this._cur_taskstate == 1) {
                    _this.getMainLineTaskReward();
                }
                else {
                    var info = App.ConfigManager.getMainLineTaskInfoById(_this._mainModule.taskId);
                    MainModuleJump.jumpToModule(info.skip);
                }
            }, this);
            //this.baseItem.lb_name.visible = false;
            //this.baseItem.img_frame.visible = false;
            //this.baseItem.img_icon.touchEnabled = false;
        };
        /**
             * 打开窗口
             */
        MainLineTaskView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            if (this._mainlinetaks_eventid === 0) {
                this._mainlinetaks_eventid = App.EventSystem.addEventListener(PanelNotify.MAIN_LINE_TASK_GET_INFO, this.updateMailLineTask, this);
            }
            if (this._chanllengeEventId === 0) {
                this._chanllengeEventId = App.EventSystem.addEventListener(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE, this.checkBossGuide, this);
            }
            if (this._canGetMc == null) {
                this._canGetMc = new AMovieClip();
                this._canGetMc.x = this.btn_goto.x + 180;
                this._canGetMc.y = this.btn_goto.y - 20;
                this._canGetMc.touchEnabled = false;
                this._canGetMc.visible = false;
                this.addChildAt(this._canGetMc, 1);
            }
            if (this._canGetFrameMc == null) {
                this._canGetFrameMc = new AMovieClip();
                this._canGetFrameMc.x = this.btn_goto.x + 254;
                this._canGetFrameMc.y = this.btn_goto.y + 47;
                this._canGetFrameMc.touchEnabled = false;
                this._canGetFrameMc.visible = false;
                this.addChild(this._canGetFrameMc);
            }
            this.updateMailLineTask();
            if (!this._guideTimeHandler) {
                this._guideTimeHandler = App.GlobalTimer.addSchedule(800, 0, this.checkGuide, this);
            }
        };
        /**
         * 清理
         */
        MainLineTaskView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._canGetMc) {
                this._canGetMc.visible = false;
                if (this._canGetMc.hasEventListener(egret.Event.COMPLETE)) {
                    this._canGetMc.removeEventListener(egret.Event.COMPLETE, this.effctComplete, this);
                }
                this._canGetMc.stop();
                this._canGetMc.destroy();
                this._canGetMc = null;
            }
            if (this._canGetFrameMc) {
                this._canGetFrameMc.visible = false;
                this._canGetFrameMc.stop();
                this._canGetFrameMc.destroy();
                this._canGetFrameMc = null;
            }
            if (this._mainlinetaks_eventid != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MAIN_LINE_TASK_GET_INFO, this._mainlinetaks_eventid);
                this._mainlinetaks_eventid = 0;
            }
            if (this._chanllengeEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MAIN_BOSS_CAN_CHANLLENGE, this._chanllengeEventId);
                this._chanllengeEventId = 0;
            }
            if (this._guideTimeHandler) {
                App.GlobalTimer.remove(this._guideTimeHandler);
                this._guideTimeHandler = undefined;
                // let guideIdArray :Array<number> = [1000,1001]; //引导id数组
                // let guideStepArray = [1,1];//引导步骤数组
                // for(let i=0;i<guideIdArray.length;i++) {
                //     App.GuideManager.removeClickBtn(guideIdArray[i],guideStepArray[i]);
                // }
            }
        };
        /**
         * 销毁
         */
        MainLineTaskView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        MainLineTaskView.prototype.showHideMainLineTask = function (isshow) {
            if (isshow) {
                this._mainModule.isMainTaskShow = true;
                this.updateMailLineTask();
            }
            else {
                this._mainModule.isMainTaskShow = false;
                this.visible = false;
            }
        };
        MainLineTaskView.prototype.updateMailLineTask = function () {
            var _this = this;
            if (!this._mainModule.isMainTaskShow)
                return;
            if (this._mainModule.taskId == 0) {
                this.visible = false;
                return;
            }
            else {
                this.visible = true;
            }
            if (this._cur_taskid != this._mainModule.taskId && this._cur_taskid > 0) {
                // 新任务特效
                this._canGetMc.visible = true;
                this._canGetMc.playMCKey("effjsrw", "", 1, null, function () {
                    _this._canGetMc.frameRate = 15;
                }, this);
                if (this._canGetMc.hasEventListener(egret.Event.COMPLETE) == false) {
                    this._canGetMc.addEventListener(egret.Event.COMPLETE, this.effctComplete, this);
                }
            }
            if (this._cur_taskstate == 0 && this._mainModule.taskState == 1) {
                //任务完成特效
                this._canGetMc.visible = true;
                this._canGetMc.playMCKey("effrwwc", "", 1, null, function () {
                    _this._canGetMc.frameRate = 15;
                }, this);
                if (this._canGetMc.hasEventListener(egret.Event.COMPLETE) == false) {
                    this._canGetMc.addEventListener(egret.Event.COMPLETE, this.effctComplete, this);
                }
            }
            if (this._mainModule.taskState == 1) {
                //任务完成底框特效
                this._canGetFrameMc.visible = true;
                this._canGetFrameMc.playMCKey("effrwts", "", -1, null, function () {
                    _this._canGetFrameMc.frameRate = 6;
                }, this);
            }
            else {
                this._canGetFrameMc.stop();
                this._canGetFrameMc.visible = false;
            }
            var info = App.ConfigManager.getMainLineTaskInfoById(this._mainModule.taskId);
            if (this._mainModule.taskState == 1)
                this.lb_taskname.textFlow =
                    [{ text: info.name + "" }, { text: "(已完成)", style: { textColor: 0x00f829 } }];
            else
                this.lb_taskname.textFlow =
                    [{ text: info.name + "" }, { text: "(" + this._mainModule.curTaskIndex + "/" + this._mainModule.totalTask + ")", style: { textColor: 0x00f829 } }];
            this.lb_taskdetail.text = info.des;
            this.goto_id = info.skip;
            this._cur_taskid = this._mainModule.taskId;
            this._cur_taskstate = this._mainModule.taskState;
            this.checkGuideStart();
        };
        MainLineTaskView.prototype.effctComplete = function (e) {
            this._canGetMc.visible = false;
        };
        MainLineTaskView.prototype.getMainLineTaskReward = function () {
            if (this._cur_taskstate = 1)
                App.Socket.send(29002, null);
        };
        //开始检测引导
        MainLineTaskView.prototype.checkGuideStart = function () {
            //检测新手引导 一切从这里开始
            if (App.agentConfig.guide) {
                if (App.agentConfig.AgentCode == "test") {
                    if (App.RoleManager.roleInfo.account.substring(0, 2).toUpperCase() == "XS") {
                    }
                    else {
                        return;
                    }
                }
                else {
                }
            }
            else {
                return;
            }
            var guideInfo = App.ConfigManager.getGuideInfoByTaskId(this._cur_taskid);
            if (guideInfo && App.GuideManager.checkStartGuide(guideInfo.task_id) && this._cur_taskstate != 1) {
                App.GuideManager.setStartGuide(guideInfo.id);
            }
        };
        //引导检测，是否可以开始
        MainLineTaskView.prototype.checkGuide = function () {
            if (App.GuideManager.needGuide) {
                if (App.GuideManager.startGuide && App.GuideManager.curGuideId) {
                    if (this.checkGuideEnvironment()) {
                        var curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(App.GuideManager.curGuideId, 1);
                        if (curGuideInfo.type == 1) {
                            if (this._checkBossGuide) {
                                App.GuideManager.bindClickBtn(this.btn_goto, App.GuideManager.curGuideId, 1);
                                App.GuideManager.checkGuide(App.GuideManager.curGuideId);
                            }
                            else {
                            }
                        }
                        else {
                            App.GuideManager.bindClickBtn(this.btn_goto, App.GuideManager.curGuideId, 1);
                            App.GuideManager.checkGuide(App.GuideManager.curGuideId);
                        }
                    }
                }
            }
            else {
                if (this._guideTimeHandler) {
                    App.GlobalTimer.remove(this._guideTimeHandler);
                    this._guideTimeHandler = undefined;
                }
            }
        };
        //检测是否有其他窗口挡住引导
        MainLineTaskView.prototype.checkGuideEnvironment = function () {
            if (GameRootLay.gameLayer()._moduleLay.numChildren == 0 && GameRootLay.gameLayer()._panelLay.numChildren == 0) {
                return true;
            }
            else {
                for (var i = 0; i < GameRootLay.gameLayer()._moduleLay.numChildren; i++) {
                    if (GameRootLay.gameLayer()._moduleLay.getChildAt(i).visible) {
                        return false;
                    }
                }
                for (var i = 0; i < GameRootLay.gameLayer()._panelLay.numChildren; i++) {
                    if (GameRootLay.gameLayer()._panelLay.getChildAt(i).visible) {
                        return false;
                    }
                }
                return true;
            }
        };
        MainLineTaskView.prototype.checkBossGuide = function (data) {
            if (data) {
                this._checkBossGuide = true;
                this.checkGuideStart();
            }
            else {
                this._checkBossGuide = false;
            }
        };
        return MainLineTaskView;
    }(BaseChildView));
    game.MainLineTaskView = MainLineTaskView;
    __reflect(MainLineTaskView.prototype, "game.MainLineTaskView");
})(game || (game = {}));
//# sourceMappingURL=MainLineTaskView.js.map