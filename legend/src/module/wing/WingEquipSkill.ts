/**
 * Author: liuyonggen
 * 翅膀装备技能弹窗  2017/11/16
 */
module game{
    export class WingEquipSkill extends BaseView{
        private re_close: eui.Rect;
        private _wingModel: WingModel = WingModel.getInstance();


        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.closeWin(WinName.WING_SKILL);
            }, this);
            this.updateView();
        }

        private updateView() {

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