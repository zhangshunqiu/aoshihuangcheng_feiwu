/**
 * module : 游戏最上面数值栏和下方功能栏
 * author ： zrj
 * 
*/
module game {
    export class MainBottom extends BaseView {
        public img_bg: eui.Image;
        public img_main: eui.Image;  //主城野外
        //public img_role: eui.Image;
        //public img_backpack: eui.Image;
        //public img_forge: eui.Image;
        //public img_achieve: eui.Image;
        public img_shop: eui.Image;

        public img_add_diamond: eui.Image;
        public img_add_money: eui.Image;
        public lb_name: eui.Label;
        public lb_level: eui.Label;
        public lb_money: eui.Label;
        public lb_diamond: eui.Label;

        public img_maincity: eui.Image;
        public img_field: eui.Image;
        public img_bossR: eui.Image;

        public gp_btn: eui.Group;

        public debug: eui.Button;  //此变量用于debug,之后应删除

        private _curStatus: number = ConstSceneType.MAIN;
        private _handle: number;
        private _sceneHandle: number; //处理场景切换时主城按钮的切换

        private _backPagTipEventId: number = 0;
        private heroModel: HeroModel = (HeroModel.getInstance() as HeroModel);

        private _buttomBtnList: Array<IconButton> = [];

        public img_backPag_full: eui.Image;//背包满提示
        private _isShowBackPagFullTips: Boolean = false;
        private _guideTimeHandler: number; //新手引导计时器

        public constructor(viewconf) {
            super(viewconf);
            // this.skinName = "MainBottomSkin";
            this.bottom = 0;
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
        }

        public initView() {

            this.debug.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.Event) => {  //此处用于打开debug窗口，上线后删除
                App.WinManager.openWin(WinName.TEST);
            }, this);

            this.touchEnabled = false;
            this.img_main.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.Event) => {
                if (SceneUtil.isMainScene(SceneModel.getInstance().sceneId)) {
                    App.Socket.send(13001, {});
                } else if (SceneUtil.isWorldBossScene(SceneModel.getInstance().sceneId)) {
                    App.Socket.send(36008, {});    //推出挑战世界boss
                } else {
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
            this.img_shop.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.Event) => {
                App.WinManager.openWin(WinName.SHOP);
            }, this);

            this.img_add_money.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

            }, this);

            this.img_add_diamond.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                RechargeOpenManager.getInstance().openRechargeView();
            }, this);

            this.updateBackPagFullTips(this._isShowBackPagFullTips);
            this.updateBottomBtn();
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
            this.lb_level.text = baseInfo.lv + "级";
            this.lb_name.text = baseInfo.name;
            this.lb_diamond.text = String(wealthInfo.gold);
            this.lb_money.text = String(wealthInfo.coin);
            if (wealthInfo.coin > 10000000) {
                this.lb_money.text = Math.floor(wealthInfo.coin / 10000) + "万";
            }
            if (baseInfo.turn) {
                this.lb_level.text = baseInfo.turn + "转" + baseInfo.lv + "级";
            }
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
                item.x = j * 107 + 164;
                item.y = -8;
                this._buttomBtnList.push(item);
            }
        }

        private updateSceneStatus(data) {
            this.img_maincity.visible = false;
            this.img_bossR.visible = false;
            this.img_field.visible = false;
            // this._curStatus = data ? data : ConstSceneType.MAIN;
            // if (data == ConstSceneType.MAIN) {  //主城
            //     this.img_field.visible = true;
            // } else if (data == ConstSceneType.FIELD) {  //野外挂机
            //     this.img_maincity.visible = true;
            // } else if (data == ConstSceneType.BOSS) {   //挑战boss
            //     this.img_bossR.visible = true;
            // } else {
            //     this.img_maincity.visible = true;
            // }

            if (SceneUtil.isMainScene(SceneModel.getInstance().sceneId)) {
                this.img_field.visible = true;
            } else if (SceneUtil.isHookScene(SceneModel.getInstance().sceneId)) {
                this.img_maincity.visible = true;
            } else if (SceneUtil.isBossScene(SceneModel.getInstance().sceneId)) {
                this.img_bossR.visible = true;
            } else {
                this.img_field.visible = true;
            }
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
                let guideIdArray :Array<number> = [1000,1001]; //引导id数组
                let guideStepArray = [1,1];//引导步骤数组
                for(let i=0;i<guideIdArray.length;i++) {
                    App.GuideManager.removeClickBtn(guideIdArray[i],guideStepArray[i]);
                }
            }
        }

        public destroy() {
            super.destroy();
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this._handle);
            App.EventSystem.removeEventListener(SceneEventType.INIT_SCENE, this._sceneHandle);
        }
    }
}