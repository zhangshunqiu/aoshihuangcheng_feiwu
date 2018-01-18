module game {
    export class MainHead extends BaseView {
        public img_head: eui.Image;
        // public img_add_money : eui.Image;
        // public img_add_diamond : eui.Image;

        // public lb_level : eui.Label;
        // public lb_money : eui.Label;
        // public lb_diamond : eui.Label;
        public lb_name: eui.Label;
        // public lb_vip : eui.Label;
        // public lb_career : eui.Label;
        // public lb_fightcap : eui.Label;
        // public lb_area : eui.Label;
        public lb_gold: eui.Label;
        public lb_coin: eui.Label;
        public btn_addCoin: eui.Button;
        public btn_addGold: eui.Button;
        public lb_info_exp: eui.Label;
        public lb_turn: eui.Label;
        public lb_turnText: eui.Label;
        public lb_lv: eui.Label;  // 等级
        public lb_level: eui.Label;  // 关卡
        public lb_info_money: eui.Label;
        // public img_rank : eui.Image; //排行榜
        // public gp_fight_info: eui.Group; 

        public bmlb_fightcap: eui.BitmapLabel;
        public bmlb_vip: eui.BitmapLabel;
        public img_vip: eui.Group;
        public lb_perHour: eui.Label;
        public img_expIcon: eui.Image;

        private heroModel: HeroModel = (HeroModel.getInstance() as HeroModel);
        private _updateAreaHandle: number;
        private _infoHandle: number
        private _hideFightInfoEventId: number = 0;
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
            if (this._hideFightInfoEventId == 0) {
                this._hideFightInfoEventId = App.EventSystem.addEventListener(PanelNotify.MAIN_HIDE_FIGHT_INFO, this.hideFightInfo, this);
            }
        }

        public initView() {
            // this.img_rank.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            //     App.WinManager.openWin(WinName.RANK);
            // },this);
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

        public upateMoney() {

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

        private hideFightInfo(bool) {
            // if(bool) {
            //     this.gp_fight_info.visible = false;
            // } else {
            //     this.gp_fight_info.visible = true;
            // }
        }

        public openWin(openParam) {
            super.openWin(openParam);
        }

        public closeWin() {
            super.closeWin();
        }

        public clear() {
            super.clear();
            if (this._hideFightInfoEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MAIN_HIDE_FIGHT_INFO, this._hideFightInfoEventId);
                this._hideFightInfoEventId = 0;
            }
        }

        public destroy() {
            super.destroy();
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this._infoHandle);
            App.EventSystem.removeEventListener(SceneEventType.SCENE_INIT_COMPLETE, this._updateAreaHandle);
            if (this._combatEff) {
                this._combatEff.parent.removeChild(this._combatEff);
                this._combatEff.destroy();
                this._combatEff = null;
            }
        }
    }
}