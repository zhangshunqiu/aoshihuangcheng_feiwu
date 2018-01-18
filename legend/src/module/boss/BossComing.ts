module game {
    export class BossComing extends BaseView {
        public gp_effect: eui.Group;
        private _bossMc1: AMovieClip;
        private _bossMc2: AMovieClip;
        private img_bossComing: eui.Image;
        private img_effect: eui.Image;
        private _timer: number = 0;

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
        }

        private joinEffect() {
            // this._bossMc1 = new AMovieClip();
            this._bossMc2 = new AMovieClip();
            // this.gp_effect.addChild(this._bossMc1);
            // this._bossMc1.x = 360;
            // this._bossMc1.y = 518;
            this.gp_effect.addChild(this._bossMc2);
            this._bossMc2.x = 338;
            this._bossMc2.y = 300;
            // this._bossMc1.playMCKey("efftzboss01", "", 3, null, ()=>{
            //     this._bossMc1.frameRate = 10;
            // }, this);
            this._bossMc2.playMCKey("efftzboss02", "", 1);
            // this._bossMc1.addEventListener(egret.Event.COMPLETE, this.closeWin, this);
            this._bossMc2.addEventListener(egret.Event.COMPLETE, () => {
                this._bossMc2.visible = false;
            }, this);


        }

        private joinFrameEffect() {
            let i = 5;
            let size = 0.2

            egret.setTimeout(() => {
                if (this._timer == 0) {
                    this._timer = App.GlobalTimer.addSchedule(100, 5, () => {
                        this.img_effect.alpha = size * i;
                        i--;
                    }, this, this.closeWin, this);
                }
            }, this, 2000);
        }

        /**
		 * 打开窗口
		 */
        public openWin(openParam: any = null): void {
            super.openWin(openParam);
            this.joinFrameEffect();
            egret.setTimeout(() => {
                this.joinEffect();
            }, this, 600)
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
            if (this._bossMc1) {
                this._bossMc1.removeEventListener(egret.Event.COMPLETE, this.closeWin, this);
                this._bossMc1.destroy();
                this._bossMc1 = null;
            }
            if (this._bossMc2) {

                this._bossMc2.destroy();
                this._bossMc2 = null
            }
            if (this._timer != 0) {
                App.GlobalTimer.remove(this._timer);
                this._timer = 0;
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