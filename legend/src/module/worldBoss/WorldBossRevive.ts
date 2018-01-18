 module game{
    export class WorldBossRevive extends BaseView {
        public lb_bossName: eui.Label;
        public lb_bossLv: eui.Label;
        public img_icon: eui.Image;
        public img_close: eui.Image;
        public img_revive: eui.Image;
        public btn_challenge: eui.Button;
        public revive:any;
        public _worldBossFightEventId: number = 0;
        private _worldBossModel: WorldBossModel = WorldBossModel.getInstance();


        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

         public childrenCreated() {
            super.childrenCreated();
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
        }

        private updateView() {
            let bossId = App.ConfigManager.getWorldBossInfoById(this.revive.scene_id).monster_list[0][2];
            let bossInfo = App.ConfigManager.getMonsterById(bossId);
            this.lb_bossName.text = bossInfo.name;
            this.lb_bossLv.text = "LV." + bossInfo.lv;
            this.img_icon.source = this.revive.icon + "_png";
        }
        
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            this.revive = this._worldBossModel.revive;
            this.updateView();
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallenge, this);
            if(this._worldBossFightEventId == 0) {
                this._worldBossFightEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_FIGHT, this.closeWin, this);
            }
        }

        public onTouchChallenge() {
             App.Socket.send(36002, {scene_id:this.revive.scene_id});
        }

        public closeWin(): void {
            super.closeWin();
        }

        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        public clear(data: any = null): void {
            super.clear(data);
            if (this._worldBossFightEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_FIGHT, this._worldBossFightEventId);
                this._worldBossFightEventId = 0;
            }
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();
        }
    }

    
 }