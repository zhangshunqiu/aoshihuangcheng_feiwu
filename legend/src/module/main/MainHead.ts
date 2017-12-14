module game {
    export class MainHead extends BaseView {
        public img_head : eui.Image;
        // public img_add_money : eui.Image;
        // public img_add_diamond : eui.Image;

        // public lb_level : eui.Label;
        // public lb_money : eui.Label;
        // public lb_diamond : eui.Label;
        // public lb_name : eui.Label;
        // public lb_vip : eui.Label;
        // public lb_career : eui.Label;
        // public lb_fightcap : eui.Label;
        public lb_area : eui.Label;
        public lb_info_exp : eui.Label;
        public lb_info_money : eui.Label;
        public img_rank : eui.Image; //排行榜
        public gp_fight_info: eui.Group; 

        public bmlb_fightcap : eui.BitmapLabel;
        public bmlb_vip : eui.BitmapLabel;
        public img_vip : eui.Image; 

        private heroModel : HeroModel = (HeroModel.getInstance() as HeroModel);
        private _updateAreaHandle : number;
        private _infoHandle : number
        private _hideFightInfoEventId: number = 0;

        public constructor() {
            super();
            this.skinName = "MainHeadSkin";
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
            this._infoHandle = App.EventSystem.addEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO,this.updateBaseInfo,this);
            this._updateAreaHandle = App.EventSystem.addEventListener(SceneEventType.SCENE_INIT_COMPLETE, this.updateArea, this);
            if(this._hideFightInfoEventId == 0) {
                this._hideFightInfoEventId = App.EventSystem.addEventListener(PanelNotify.MAIN_HIDE_FIGHT_INFO, this.hideFightInfo, this);
            }
        }

        public initView(){
            this.img_rank.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
                App.WinManager.openWin(WinName.RANK);
            },this);
            this.img_vip.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.openWin(WinName.VIP);
            }, this);
        }

        public updateBaseInfo() {
            let baseInfo = App.RoleManager.roleInfo;
            // this.lb_level.text = baseInfo.lv;
            // this.lb_name.text = baseInfo.name;
            // this.lb_diamond.text = baseInfo.gold;
            // this.lb_money.text = baseInfo.coin;
            this.bmlb_vip.text = String(baseInfo.vipLv);
            this.bmlb_fightcap.text = String(App.RoleManager.getHeroFightcap());
        }

        public upateMoney() {

        }

        public updateArea() {
            var hookSceneId:number = RoleManager.getInstance().roleInfo.hookSceneId;
            let sceneInfo = App.ConfigManager.getSceneConfigById(hookSceneId);
            let sceneExpInfo = App.ConfigManager.getAllExpConfigById(hookSceneId);
            this.lb_area.text = sceneInfo.name;
            if (sceneExpInfo) {
                this.lb_info_exp.text = sceneExpInfo.online_exp*60 +"经验/小时";
                this.lb_info_money.text = sceneExpInfo.online_gold*60 +"金币/小时";
            } else {
                
            }
        }

        private hideFightInfo(bool) {
            if(bool) {
                this.gp_fight_info.visible = false;
            } else {
                this.gp_fight_info.visible = true;
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
            if(this._hideFightInfoEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.MAIN_HIDE_FIGHT_INFO, this._hideFightInfoEventId);
                this._hideFightInfoEventId = 0;
            }
        }

        public destroy() {
            super.destroy();
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO,this._infoHandle);
            App.EventSystem.removeEventListener(SceneEventType.SCENE_INIT_COMPLETE,this._updateAreaHandle);
        }
    }
}