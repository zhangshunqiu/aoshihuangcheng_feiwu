/**
 * module : 游戏最上面数值栏和下方功能栏
 * author ： zrj
 * 
*/
module game {
    export class MainBottom1 extends BaseView {
        public gp_btn: eui.Group;
        public img_main: eui.Image;
        public img_field: eui.Image;
        public img_bossR: eui.Image;
        public img_shop: eui.Image;
        public img_bg: eui.Image;
        public re_pbMask: eui.Rect;
        public pb_exp: eui.ProgressBar;
        public gp_pbEffect: eui.Group;
        public pb_exp1: eui.ProgressBar;
        public img_backPag_full: eui.Image; //背包满提示

        private _curStatus: number = ConstSceneType.MAIN;
        private _handle: number;
        private _sceneHandle: number; //处理场景切换时主城按钮的切换
        private _backPagTipEventId: number = 0;
        private _buttomBtnList: Array<IconButton> = [];
        private _isShowBackPagFullTips: Boolean = false;
        private _guideTimeHandler: number; //新手引导计时器
        private _pbMc: AMovieClip;
        private _winOpenEventId: number = 0;
        private _winCloseEventId: number = 0;

        private heroModel: HeroModel = (HeroModel.getInstance() as HeroModel);

        public constructor() {
            super();
            this.skinName = "MainBottomSkin1";
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
            this.validateNow();
            this._handle = App.EventSystem.addEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this.updateBaseInfo, this);
            this._sceneHandle = App.EventSystem.addEventListener(SceneEventType.INIT_SCENE, this.updateSceneStatus, this)
            if (this._backPagTipEventId == 0) {
                this._backPagTipEventId = App.EventSystem.addEventListener(PanelNotify.MAIN_BACKPAG_FULL_TIPS, this.updateBackPagFullTips, this);
            }
            if (this._winOpenEventId == 0) {
                this._winOpenEventId = App.EventSystem.addEventListener(WinManagerEvent.WIN_OPEN, this.selectButton, this);
            }
            if (this._winCloseEventId == 0) {
                this._winCloseEventId = App.EventSystem.addEventListener(WinManagerEvent.WIN_CLOSE, this.closeButton, this);
            }
        }

        public initView() {
            this.touchEnabled = false;
            this.img_main.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchMainBtn, this);
            this.img_shop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchShopBtn, this);

            this.updateBackPagFullTips(this._isShowBackPagFullTips);
            this.updateBottomBtn();
            this.joinPbEffect();
            this.updateBaseInfo();
        }

        private onTouchMainBtn() {
            if (SceneUtil.isMainScene(SceneModel.getInstance().sceneId) || SceneUtil.isBossScene(SceneModel.getInstance().sceneId) || SceneUtil.isArenaScene(SceneModel.getInstance().sceneId)) {
                App.Socket.send(13001, {});
            } else if (SceneUtil.isWorldBossScene(SceneModel.getInstance().sceneId)) {
                App.Socket.send(36008, {});    //退出挑战世界boss
            } else {
                App.Socket.send(11003, {});
            }
        }

        private onTouchShopBtn() {
            App.WinManager.openWin(WinName.SHOP);
        }

        /**
         * 背包满提示信息
         */
        private updateBackPagFullTips(data: Boolean) {
            this._isShowBackPagFullTips = data;
            if (this.img_backPag_full) {
                if (this._isShowBackPagFullTips) {
                    this.img_backPag_full.visible = true;
                } else {
                    this.img_backPag_full.visible = false;
                }
            }
        }

        private updateBaseInfo() {
            let baseInfo = App.RoleManager.roleInfo;
            let wealthInfo = App.RoleManager.roleWealthInfo;
            let upExp;
            if (baseInfo == App.ConfigManager.getConstConfigByType("LEVEL_MAX")) {
                upExp = App.ConfigManager.getExpConfigByLv(Number(baseInfo.lv));
            } else {
                upExp = App.ConfigManager.getExpConfigByLv(Number(baseInfo.lv) + 1);  //升级经验
            }
            this.pb_exp.maximum = upExp.exp;
            this.pb_exp.value = App.RoleManager.roleInfo.exp;
            this.pb_exp.labelDisplay.visible = false;
            this.pb_exp1.maximum = upExp.exp;
            this.pb_exp1.value = App.RoleManager.roleInfo.exp;
            this.gp_pbEffect.x = this.pb_exp.value / this.pb_exp.maximum * this.pb_exp.width + 75;
        }

        private joinPbEffect() {
            if (this._pbMc == null) {
                this._pbMc = new AMovieClip();
            }
            this.gp_pbEffect.addChild(this._pbMc);
            this._pbMc.playMCKey("efftyjdt", "", -1, null, () => {
                this._pbMc.frameRate = 8;
            }, this);
            this._pbMc.x = -42;
            this._pbMc.y = 10;
            this.gp_pbEffect.mask = this.re_pbMask;
        }

        private updateBottomBtn() {
            for (var i: number = 0; i < this._buttomBtnList.length; i++) {
                var item: IconButton = this._buttomBtnList[i];
                item.destroy();
                if (item.parent) {
                    item.parent.removeChild(item);
                }
            }
            this._buttomBtnList = [];
            for (var j: number = 0; j < MainUIBottomListConf.length; j++) {
                let d: any = MainUIBottomListConf[j];
                let item: IconButton = new IconButton(d);
                if (d.btnTipType != ConstBtnTipType.NULL) {
                    App.BtnTipManager.addBtnTipItem(d.btnTipType, item, 80, 10);
                }
                item.addEventListener(egret.TouchEvent.TOUCH_END, () => {
                    // App.WinManager.openWin(String(d.winName));
                    if (App.WinManager.isOpen(String(d.winName))) {
                        App.WinManager.closeWin(String(d.winName));
                    } else {
                        App.WinManager.openWin(String(d.winName));
                    }
                }, this);
                this.gp_btn.addChild(item);
                item.x = j * 90 + 130;
                item.y = -15;
                this._buttomBtnList.push(item);
            }
        }

        private updateSceneStatus(data) {
            this.img_bossR.visible = false;
            this.img_field.visible = false;
            if (SceneUtil.isMainScene(SceneModel.getInstance().sceneId)) {
                this.img_field.visible = true;
            } else if (SceneUtil.isBossScene(SceneModel.getInstance().sceneId) || SceneUtil.isActivityScene(SceneModel.getInstance().sceneId)) {
                this.img_bossR.visible = true;
            } 
        }

        private selectButton(vo) {
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
                    //default
                }
            }
        }

        private closeButton(vo) {
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
                    //default
                }
            }
        }

        private onSelected(obj) {
            obj.setSelected(true);
        }

        private onClosed(obj) {
            obj.setSelected(false);
        }

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

        public openWin(openParam) {
            super.openWin(openParam);
            // if (!this._guideTimeHandler) {
            //     this._guideTimeHandler = App.GlobalTimer.addSchedule(1000, 0, this.checkGuide, this);
            // }
        }

        public closeWin() {
            super.closeWin();
        }

        public clear() {
            super.clear();
            if (this._guideTimeHandler) {
                App.GlobalTimer.remove(this._guideTimeHandler);
                this._guideTimeHandler = undefined;
                let guideIdArray: Array<number> = [1000, 1001]; //引导id数组
                let guideStepArray = [1, 1];//引导步骤数组
                for (let i = 0; i < guideIdArray.length; i++) {
                    App.GuideManager.removeClickBtn(guideIdArray[i], guideStepArray[i]);
                }
            }
        }

        public destroy() {
            super.destroy();
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
        }
    }
}