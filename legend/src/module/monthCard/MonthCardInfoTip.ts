/**
 * Author: liuyonggen
 * 月卡详情弹窗 2017/11/24
 */
module game {
    export class MonthCardInfoTip extends BaseView {
        public re_close: eui.Group;

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
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