/**
 * Author: liuyonggen
 * 世界boss奖励介绍弹窗 2017/12/5
 */
module game {
    export class WorldBossReward extends BaseView {
        public img_close: eui.Image;
        public gp_killReward: eui.Group;
        public gp_joinReward: eui.Group;
        private _worldBossInfo: any;
        private killReward: WorldBossInfoItem;
        private joinReward: WorldBossInfoItem;

        private _worldBossModel: WorldBossModel = WorldBossModel.getInstance();

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
        }

        private updateView() {
            this._worldBossModel.changeToPage(this._worldBossInfo);
            if(!this.killReward) {
                this.killReward = new WorldBossInfoItem();
            }
            this.killReward.updateReward(this._worldBossInfo.killReward);
            this.gp_killReward.addChild(this.killReward);
            if(!this.joinReward) {
                this.joinReward = new WorldBossInfoItem();
            }
            this.joinReward.updateReward(this._worldBossInfo.joinReward);
            this.gp_joinReward.addChild(this.joinReward);
        }

        /**
		 * 打开窗口
		 */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            this._worldBossInfo = openParam;
            this.updateView();
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