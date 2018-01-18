/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 天梯争霸tips界面 2017/06/20.
 */
module game {
    export class CountDownView extends BaseView {
        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        public lb_time: eui.Label;
        private _count_timeId: number = 0;
        private _total_sec: number = 120;

        protected childrenCreated() {
            super.childrenCreated();

        }

        public onCountDown() {

            this.lb_time.text = GlobalUtil.getFormatBySecond1(this._total_sec);
            this._total_sec--;
            if (this._total_sec < 0) {
                if (this._count_timeId != 0) {
                    App.GlobalTimer.remove(this._count_timeId);
                    this._count_timeId = 0;
                }
                this.closeWin(null);

            }
        }
		/**
				 * 打开窗口
				*/
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            
            if (openParam&&openParam.sec) {
                this._total_sec = openParam.sec;
            }
            else{
                this._total_sec = 120;
            }
            if (this._count_timeId == 0) {
                this._count_timeId = App.GlobalTimer.addSchedule(1000, 0, this.onCountDown, this);
            }

            this.x = 220;
            this.y = 950;
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
            if (this._count_timeId != 0) {
                App.GlobalTimer.remove(this._count_timeId);
                this._count_timeId = 0;
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