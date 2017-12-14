/**
 * Author: liuyonggen
 * 月卡每日奖励弹窗 2017/11/24
 */
module game {
    export class MonthCardDailyReward extends BaseView {
        public re_close: eui.Group;
        public lb_day: eui.Label;
        public img_getReward: eui.Image;
        public _monthCardModel: MonthCardModel = MonthCardModel.getInstance();

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_getReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
            this.updateView();
        }

        private updateView() {
            this.lb_day.text = this._monthCardModel.day + "";
        }

        private getReward() {
            App.Socket.send(25002, {});
            this._monthCardModel.rewardNum--;
            this._monthCardModel.day++;
            if(this._monthCardModel.rewardNum == 0) {
                this.closeWin();
                App.BtnTipManager.setTypeValue(ConstBtnTipType.MOUTHCARD, false);
            } else {
                this.updateView();
            }
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