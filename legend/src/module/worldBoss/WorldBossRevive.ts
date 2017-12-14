 module game{
    export class WorldBossRevive extends BaseView {
        public lb_bossName: eui.Label;
        public lb_bossLv: eui.Label;
        public img_icon: eui.Image;
        public img_close: eui.Image;
        public img_revive: eui.Image;
        public btn_challenge: eui.Button;
        public revive:any;
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
        }

        public onTouchChallenge() {
             App.Socket.send(36002, {scene_id:this.revive.scene_id});
             this.closeWin();
        }

        public closeWin(): void {
            super.closeWin();
        }

        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        public clear(data: any = null): void {
            super.clear(data);
        }
        /**
         * 销毁
         */
        public destroy(): void {
            super.destroy();
        }
    }

    
 }