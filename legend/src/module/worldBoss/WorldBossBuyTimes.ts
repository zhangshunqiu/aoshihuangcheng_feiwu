/**
 * Author: liuyonggen
 * 世界boss购买次数弹窗 2017/12/5
 */
module game {
    export class WorldBossBuyTimes extends BaseView {
        public img_close: eui.Image;
        public img_comfirm: eui.Image;
        public img_cancle: eui.Image;
        public lb_gold: eui.Label;
        public lb_times: eui.Label;

        private _worldBossModel: WorldBossModel = WorldBossModel.getInstance();

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_cancle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_comfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.Socket.send(36004, {});
                this.closeWin();
            }, this);
            this.updateView();
        }

        private updateView() {
            let gold = App.ConfigManager.getConstConfigByType("WORLD_BOSS_BAY_GOLD").value;
            let times = App.ConfigManager.getConstConfigByType("WORLD_BOSS_BAY_NUM").value;
            let vipTimes = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv).bay_boss; 
            let allTimes = times - this._worldBossModel.pbWorldBossInfo.buy_times + vipTimes;
            this.lb_gold.text = gold;
            this.lb_times.text = allTimes; 
        }

        /**
		 * 打开窗口
		 */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
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
        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }
    }
}