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
/**
 * module : 游戏最上面数值栏和下方功能栏
 * author ： zrj
 *
*/
var game;
(function (game) {
    var MainBottom = (function (_super) {
        __extends(MainBottom, _super);
        function MainBottom(viewconf) {
            var _this = _super.call(this, viewconf) || this;
            _this._curStatus = ConstSceneType.MAIN;
            _this._backPagTipEventId = 0;
            _this.heroModel = game.HeroModel.getInstance();
            _this._buttomBtnList = [];
            _this._isShowBackPagFullTips = false;
            _this._winOpenEventId = 0;
            _this._winCloseEventId = 0;
            // this.skinName = "MainBottomSkin";
            _this.bottom = 0;
            return _this;
        }
        MainBottom.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
            this.validateNow();
            this._handle = App.EventSystem.addEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this.updateBaseInfo, this);
            this._sceneHandle = App.EventSystem.addEventListener(SceneEventType.INIT_SCENE, this.updateSceneStatus, this);
            if (this._backPagTipEventId == 0) {
                this._backPagTipEventId = App.EventSystem.addEventListener(PanelNotify.MAIN_BACKPAG_FULL_TIPS, this.updateBackPagFullTips, this);
            }
            if (this._winOpenEventId == 0) {
                this._winOpenEventId = App.EventSystem.addEventListener(WinManagerEvent.WIN_OPEN, this.selectButton, this);
            }
            if (this._winCloseEventId == 0) {
                this._winCloseEventId = App.EventSystem.addEventListener(WinManagerEvent.WIN_CLOSE, this.closeButton, this);
            }
        };
        MainBottom.prototype.initView = function () {
            this.debug.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.openWin(WinName.TEST);
            }, this);
            this.touchEnabled = false;
            this.img_main.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                if (SceneUtil.isMainScene(SceneModel.getInstance().sceneId) || SceneUtil.isBossScene(SceneModel.getInstance().sceneId) || SceneUtil.isArenaScene(SceneModel.getInstance().sceneId)) {
                    App.Socket.send(13001, {});
                }
                else if (SceneUtil.isWorldBossScene(SceneModel.getInstance().sceneId)) {
                    App.Socket.send(36008, {}); //退出挑战世界boss
                }
                else {
                    App.Socket.send(11003, {});
                }
            }, this);
            // this.img_backpack.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.Event) => {
            //     App.WinManager.openWin(WinName.BACKPACK);
            // }, this);
            // this.img_role.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.Event) => {
            //     App.WinManager.openWin(WinName.HERO);
            // }, this);
            // this.img_forge.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.Event) => {
            //     App.WinManager.openWin(WinName.FORGE);
            // }, this);
            // this.img_achieve.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.Event) => {
            // App.WinManager.openWin(WinName.ARTIFACT);
            // }, this);
            this.img_shop.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.openWin(WinName.SHOP);
            }, this);
            // this.img_add_money.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            //     App.GlobalTips.showItemWayTips(0,101);
            // }, this);
            // this.img_add_diamond.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            //     RechargeOpenManager.getInstance().openRechargeView();
            // }, this);
            this.updateBackPagFullTips(this._isShowBackPagFullTips);
            this.updateBottomBtn();
            this.joinPbEffect();
            this.updateBaseInfo();
        };
        /**
         * 背包满提示信息
         */
        MainBottom.prototype.updateBackPagFullTips = function (data) {
            this._isShowBackPagFullTips = data;
            if (this.img_backPag_full) {
                if (this._isShowBackPagFullTips) {
                    this.img_backPag_full.visible = true;
                }
                else {
                    this.img_backPag_full.visible = false;
                }
            }
        };
        MainBottom.prototype.updateBaseInfo = function () {
            var baseInfo = App.RoleManager.roleInfo;
            var wealthInfo = App.RoleManager.roleWealthInfo;
            this.lb_level.text = baseInfo.lv + "级";
            this.lb_name.text = baseInfo.name;
            // this.lb_diamond.text = String(wealthInfo.gold);
            // this.lb_money.text = String(wealthInfo.coin);
            // if (wealthInfo.coin > 10000000) {
            //     this.lb_money.text = Math.floor(wealthInfo.coin / 10000) + "万";
            // }
            // if (wealthInfo.gold > 1000000) {
            //     this.lb_money.text = Math.floor(wealthInfo.coin / 10000) + "万";
            // }
            // if (baseInfo.turn) {
            //     this.lb_level.text = baseInfo.turn + "转" + baseInfo.lv + "级";
            // }
            var upExp;
            if (baseInfo == App.ConfigManager.getConstConfigByType("LEVEL_MAX")) {
                upExp = App.ConfigManager.getExpConfigByLv(Number(baseInfo.lv));
            }
            else {
                upExp = App.ConfigManager.getExpConfigByLv(Number(baseInfo.lv) + 1); //升级经验
            }
            this.pb_exp.maximum = upExp.exp;
            this.pb_exp.value = App.RoleManager.roleInfo.exp;
            this.pb_exp.labelDisplay.visible = false;
            this.pb_exp1.maximum = upExp.exp;
            this.pb_exp1.value = App.RoleManager.roleInfo.exp;
            this.gp_pbEffect.x = this.pb_exp.value / this.pb_exp.maximum * this.pb_exp.width + 75;
        };
        MainBottom.prototype.joinPbEffect = function () {
            var _this = this;
            if (this._pbMc == null) {
                this._pbMc = new AMovieClip();
            }
            this.gp_pbEffect.addChild(this._pbMc);
            this._pbMc.playMCKey("efftyjdt", "", -1, null, function () {
                _this._pbMc.frameRate = 8;
            }, this);
            this._pbMc.x = -42;
            this._pbMc.y = 10;
            this.gp_pbEffect.mask = this.re_pbMask;
        };
        MainBottom.prototype.updateBottomBtn = function () {
            for (var i = 0; i < this._buttomBtnList.length; i++) {
                var item = this._buttomBtnList[i];
                item.destroy();
                if (item.parent) {
                    item.parent.removeChild(item);
                }
            }
            this._buttomBtnList = [];
            var _loop_1 = function () {
                var d = MainUIBottomListConf[j];
                var item_1 = new IconButton(d);
                if (d.btnTipType != ConstBtnTipType.NULL) {
                    App.BtnTipManager.addBtnTipItem(d.btnTipType, item_1, 80, 10);
                }
                item_1.addEventListener(egret.TouchEvent.TOUCH_END, function () {
                    // App.WinManager.openWin(String(d.winName));
                    if (App.WinManager.isOpen(String(d.winName))) {
                        App.WinManager.closeWin(String(d.winName));
                    }
                    else {
                        App.WinManager.openWin(String(d.winName));
                    }
                }, this_1);
                this_1.gp_btn.addChild(item_1);
                item_1.x = j * 90 + 130;
                item_1.y = -15;
                this_1._buttomBtnList.push(item_1);
            };
            var this_1 = this;
            for (var j = 0; j < MainUIBottomListConf.length; j++) {
                _loop_1();
            }
        };
        MainBottom.prototype.updateSceneStatus = function (data) {
            // this.img_maincity.visible = false;
            this.img_bossR.visible = false;
            this.img_field.visible = false;
            if (SceneUtil.isMainScene(SceneModel.getInstance().sceneId)) {
                this.img_field.visible = true;
            }
            else if (SceneUtil.isHookScene(SceneModel.getInstance().sceneId)) {
                // this.img_maincity.visible = true;
            }
            else if (SceneUtil.isBossScene(SceneModel.getInstance().sceneId) || SceneUtil.isActivityScene(SceneModel.getInstance().sceneId)) {
                this.img_bossR.visible = true;
            }
            else {
                this.img_field.visible = true;
            }
        };
        MainBottom.prototype.selectButton = function (vo) {
            if (vo) {
                switch (vo.winName) {
                    case WinName.HERO:
                        this.onSelected(this._buttomBtnList[0]);
                        break;
                    case WinName.BACKPACK:
                        this.onSelected(this._buttomBtnList[1]);
                        break;
                    case WinName.FORGE:
                        this.onSelected(this._buttomBtnList[2]);
                        break;
                    case WinName.WING:
                        this.onSelected(this._buttomBtnList[3]);
                        break;
                    case WinName.METAL:
                        this.onSelected(this._buttomBtnList[4]);
                        break;
                }
            }
        };
        MainBottom.prototype.closeButton = function (vo) {
            if (vo) {
                switch (vo.winName) {
                    case WinName.HERO:
                        this.onClosed(this._buttomBtnList[0]);
                        break;
                    case WinName.BACKPACK:
                        this.onClosed(this._buttomBtnList[1]);
                        break;
                    case WinName.FORGE:
                        this.onClosed(this._buttomBtnList[2]);
                        break;
                    case WinName.WING:
                        this.onClosed(this._buttomBtnList[3]);
                        break;
                    case WinName.METAL:
                        this.onClosed(this._buttomBtnList[4]);
                        break;
                }
            }
        };
        MainBottom.prototype.onSelected = function (obj) {
            obj.setSelected(true);
        };
        MainBottom.prototype.onClosed = function (obj) {
            obj.setSelected(false);
        };
        //引导检测
        // private checkGuide() {
        //     if (App.GuideManager.needGuide) {
        //         if(App.GuideManager.startGuide && App.GuideManager.curGuideId) { //开始引导了，有引导id
        //             let guideIdArray :Array<number> = [1000,1001]; //引导id数组
        //             let buttonArray = [this._buttomBtnList[0],this._buttomBtnList[1]];  //绑定按钮数组
        //             let guideStepArray = [1,1];//引导步骤数组
        //             for(let i=0;i<guideIdArray.length;i++) {
        //                 if (guideIdArray[i] == App.GuideManager.curGuideId && guideStepArray[i] == App.GuideManager.curGuideStep) { //当前引导id和step
        //                     App.GuideManager.bindClickBtn(buttonArray[i], guideIdArray[i], guideStepArray[i]);
        //                     App.GuideManager.checkGuide(guideIdArray[i]);
        //                     break;
        //                 }
        //             }
        //         }
        //     } else {
        //         if (this._guideTimeHandler) {
        //             App.GlobalTimer.remove(this._guideTimeHandler);
        //             this._guideTimeHandler = undefined;
        //         }
        //     }
        // }
        MainBottom.prototype.openWin = function (openParam) {
            _super.prototype.openWin.call(this, openParam);
            // if (!this._guideTimeHandler) {
            //     this._guideTimeHandler = App.GlobalTimer.addSchedule(1000, 0, this.checkGuide, this);
            // }
        };
        MainBottom.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        MainBottom.prototype.clear = function () {
            _super.prototype.clear.call(this);
            if (this._guideTimeHandler) {
                App.GlobalTimer.remove(this._guideTimeHandler);
                this._guideTimeHandler = undefined;
                var guideIdArray = [1000, 1001]; //引导id数组
                var guideStepArray = [1, 1]; //引导步骤数组
                for (var i = 0; i < guideIdArray.length; i++) {
                    App.GuideManager.removeClickBtn(guideIdArray[i], guideStepArray[i]);
                }
            }
        };
        MainBottom.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this._handle);
            App.EventSystem.removeEventListener(SceneEventType.INIT_SCENE, this._sceneHandle);
            if (this._winOpenEventId != 0) {
                App.EventSystem.removeEventListener(WinManagerEvent.WIN_OPEN, this._winOpenEventId);
                this._winOpenEventId = 0;
            }
            if (this._winCloseEventId != 0) {
                App.EventSystem.removeEventListener(WinManagerEvent.WIN_CLOSE, this._winCloseEventId);
                this._winCloseEventId = 0;
            }
        };
        return MainBottom;
    }(BaseView));
    game.MainBottom = MainBottom;
    __reflect(MainBottom.prototype, "game.MainBottom");
})(game || (game = {}));
//# sourceMappingURL=MainBottom.js.map