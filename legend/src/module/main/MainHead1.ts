/**
 * author: lyg
 * 主界面顶部部分
 */
module game {
    export class MainHead1 extends BaseView {
        private lb_turnText: eui.Label;
        private lb_name: eui.Label;
        private lb_turn: eui.Label;
        private lb_lv: eui.Label;
        private lb_level: eui.Label;
        private img_expIcon: eui.Image;
        private lb_info_money: eui.Label;
        private lb_info_exp: eui.Label;
        private lb_perHour: eui.Label;
        private img_vip: eui.Group;
        private bmlb_vip: eui.BitmapLabel;
        private bmlb_fightcap: eui.BitmapLabel;
        private btn_addCoin: eui.Button;
        private btn_addGold: eui.Button;
        private lb_coin: eui.Label;
        private lb_gold: eui.Label;

        private heroModel: HeroModel = (HeroModel.getInstance() as HeroModel);
        private _updateAreaHandle: number;
        private _infoHandle: number
        private _combatEff: EffectMovieClip;


        public constructor() {
            super();
            this.skinName = "MainHeadSkin";
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
            this._infoHandle = App.EventSystem.addEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this.updateBaseInfo, this);
            this._updateAreaHandle = App.EventSystem.addEventListener(SceneEventType.SCENE_INIT_COMPLETE, this.updateArea, this);
        }

        public initView() {
            this.img_vip.touchEnabled = true;
            this.img_vip.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.WinManager.openWin(WinName.VIP);
            }, this);
            this.btn_addCoin.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                App.GlobalTips.showItemWayTips(0, 101);
            }, this);

            this.btn_addGold.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                RechargeOpenManager.getInstance().openRechargeView();
            }, this);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.VIPGIFT, this.img_vip, 70, 5);
            this.joinCombatEff();
        }

        private joinCombatEff() {
            this._combatEff = new EffectMovieClip();
            this._combatEff.x = 230;
            this._combatEff.y = 28;
            this._combatEff.scaleX = 1;
            this._combatEff.scaleY = 1;
            this.addChildAt(this._combatEff, 1);
            this._combatEff.playMCKey("effjspf", "", -1, null, () => {
                this._combatEff.frameRate = 10;
            }, null, this);
        }
        private removeCombatEff() {
            if (this._combatEff) {
                if (this._combatEff.parent) {
                    this._combatEff.parent.removeChild(this._combatEff);
                }
                this._combatEff.destroy();
                this._combatEff = null;
            }
        }

        public updateBaseInfo() {
            let baseInfo = App.RoleManager.roleInfo;
            let wealthInfo = App.RoleManager.roleWealthInfo;
            this.lb_lv.text = baseInfo.lv + "";
            this.lb_name.text = baseInfo.name;
            if (baseInfo.turn) {
                this.lb_turn.visible = true;
                this.lb_turnText.visible = true;
                this.lb_turn.text = baseInfo.turn + "";
            } else {
                this.lb_turn.visible = false;
                this.lb_turnText.visible = false;
            }

            this.lb_coin.text = String(wealthInfo.coin);
            this.lb_gold.text = String(wealthInfo.gold);
            this.lb_coin.text = GlobalUtil.fixNum(wealthInfo.coin);
            this.lb_gold.text = GlobalUtil.fixNum(wealthInfo.gold);

            this.bmlb_vip.text = String(baseInfo.vipLv);
            this.bmlb_fightcap.text = String(App.RoleManager.getHeroFightcap());
        }

        public updateArea() {
            var hookSceneId: number = RoleManager.getInstance().roleInfo.hookSceneId;
            let sceneInfo = App.ConfigManager.getSceneConfigById(hookSceneId);
            let sceneExpInfo = App.ConfigManager.getAllExpConfigById(hookSceneId);
            this.lb_level.text = sceneInfo.lv_limit;
            // this.lb_area.text = sceneInfo.name;
            if (sceneExpInfo) {
                this.lb_info_exp.text = GlobalUtil.fixNum(sceneExpInfo.online_exp * 60);
                this.lb_perHour.x = this.lb_info_exp.x + this.lb_info_exp.width;
                this.lb_info_money.text = GlobalUtil.fixNum(sceneExpInfo.online_gold * 60);
            } else {

            }
        }


        public openWin(openParam) {
            super.openWin(openParam);
        }

        public closeWin() {
            super.closeWin();
        }

        public clear() {
            super.clear();
        }

        public destroy() {
            super.destroy();
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this._infoHandle);
            App.EventSystem.removeEventListener(SceneEventType.SCENE_INIT_COMPLETE, this._updateAreaHandle);
            this.removeCombatEff();
        }
    }
}