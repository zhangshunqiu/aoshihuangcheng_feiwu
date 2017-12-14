/**
 * Author: liuyonggen
 * 世界boss助威弹窗 2017/12/5
 */
module game {
    export class WorldBossCheer extends BaseView {
        public img_close: eui.Image;
        public img_comfirm: eui.Image;
        public img_cancle: eui.Image;
        public lb_harm: eui.Label;
        public lb_maxHarm: eui.Label;
        public lb_currentHarm: eui.Label;
        private _worldBossInfo: any;
        private _worldBossCheerEventId:number = 0;
        private _worldBossCheerResultEventId:number = 0;
        private _num: number = 0;
        private _harm: number = 0;
        private _harmTimes: number = 0;
        public lb_gold: eui.Label;

        private _worldBossModel: WorldBossModel = WorldBossModel.getInstance();

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_cancle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_comfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchComfirm, this);
            this._harm = App.ConfigManager.getConstConfigByType("WORLD_BOSS_BUFF_ADD").value;
            this._harmTimes = App.ConfigManager.getConstConfigByType("WORLD_BOSS_CHEER_ATT").value;
            this.lb_harm.text = this._harm + "%";
            this.lb_maxHarm.text = this._harm * this._harmTimes + "%";
            this.lb_gold.text = App.ConfigManager.getConstConfigByType("WORLD_BOSS_CHEER_GOLD").value;
        }

        private onTouchComfirm() {
            if(this._num == this._harmTimes) {
                let text = [{text:"助威效果已达到上限", style:{textColor:0xffffff,size:24,fontFamily:"SimHei"}}]
                App.GlobalTips.showTips(text);
            } else {
                App.Socket.send(36006, {scene_id: this._worldBossInfo.scene_id});
                this.img_comfirm.touchEnabled = false;
            }     
        }

        private updateView(num) {
            this._num = num;
            this.img_comfirm.touchEnabled = true;
            this.lb_currentHarm.text = this._harm * num + "%";
        }

        private cheerResult() {
            App.Socket.send(36005, {scene_id: this._worldBossInfo.scene_id});
            let gold = App.ConfigManager.getConstConfigByType("WORLD_BOSS_CHEER_GOLD").value;
            let text = [{text:"助威成功，消耗"+gold+"元宝", style:{textColor:0xffffff,size:24,fontFamily:"SimHei"}}]
            App.GlobalTips.showTips(text);
        }

        /**
		 * 打开窗口
		 */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            this._worldBossInfo = openParam;
            App.Socket.send(36005, {scene_id: this._worldBossInfo.scene_id});
            if(this._worldBossCheerEventId == 0) {
               this._worldBossCheerEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_CHEER, this.updateView, this);
            }
            if(this._worldBossCheerResultEventId == 0) {
                this._worldBossCheerResultEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_CHEER_RESULT, this.cheerResult, this);
            }
        }

		/**
		 * 关闭窗口
		 */
        public closeWin(): void {
            super.closeWin();
        }

		/**
		 * 清理
		 */
        public clear(data: any = null): void {
            super.clear(data);
            if(this._worldBossCheerEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_CHEER, this._worldBossCheerEventId);
                this._worldBossCheerEventId = 0;
            }
            if(this._worldBossCheerResultEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_CHEER_RESULT, this._worldBossCheerResultEventId);
                this._worldBossCheerResultEventId = 0;
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