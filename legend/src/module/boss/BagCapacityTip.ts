module game{
    export class BagCapacityTip extends BaseView {
        public gp_smelt: eui.Group;

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.gp_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goSmelt, this);
        }

		private goSmelt() {
			App.WinManager.openWin(WinName.SMELT);
            App.WinManager.closeWin(WinName.BOSS_BAG_TIP);
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
		public closeWin(callback): void {
			super.closeWin(callback);
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