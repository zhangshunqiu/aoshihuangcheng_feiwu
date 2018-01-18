/**
 * Author: liuyonggen
 * 完美羽翼属性弹窗  2017/11/16
 */
module game{
    export class WingPerfectTip extends BaseView{
        private re_close: eui.Rect;
        private img_bg: eui.Image;
        private lb_active: eui.Label;
        private lb_step: eui.Label;
        private lb_step1: eui.Label;
        private lb_rate: eui.Label;
        private lb_progress: eui.Label; 
        private gp_nextAttr: eui.Group;
        private lb_step2: eui.Label;
        private lb_step3: eui.Label;
        private lb_rate1: eui.Label;
        private lb_progress1: eui.Label;
        private _wingModel: WingModel = WingModel.getInstance();


        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.updateView();
        }

        private updateView() {
            if(this._wingModel.wingInfo.perfectWing && this._wingModel.wingInfo.perfectWing !=9) {  //如果四种羽翼都有，已激活
                this.gp_nextAttr.visible = true;
                this.lb_active.text = "<已激活>";
                this.lb_active.textColor = 0x06ff00;
                this.lb_step.text = this._wingModel.wingInfo.perfectWing + '';
                this.lb_step1.text = this._wingModel.wingInfo.perfectWing + '';
                this.lb_step.textColor = 0x06ff00;
                this.lb_progress.text = "4";
                this.lb_progress.textColor = 0x06ff00;
                this.lb_rate.text = Math.floor(this._wingModel.wingInfo.perfectWingRate * 100) + "%";
                this.lb_step2.text = this._wingModel.wingInfo.perfectWing + 1 + '';
                this.lb_step3.text = this._wingModel.wingInfo.perfectWing + 1 + '';
                this.lb_progress1.text = this._wingModel.wingInfo.WingEquipStep.progress;
                this.lb_rate1.text = Math.floor(this._wingModel.wingInfo.perfectWingNextRate * 100) + "%";
                this.img_bg.height = 375;
            } else if(this._wingModel.wingInfo.perfectWing ==9){
                this.gp_nextAttr.visible = false; 
                this.img_bg.height = 208;
                this.lb_active.text = "<已激活>";
                this.lb_active.textColor = 0x06ff00;
                this.lb_step.text = "9";
                this.lb_step1.text = "9";
                this.lb_step.textColor = 0x06ff00;
                this.lb_rate.text = Math.floor(this._wingModel.wingInfo.perfectWingRate * 100) + "%";
                this.lb_progress.text = "4";
                this.lb_progress.textColor = 0x06ff00;
            } else {
                this.gp_nextAttr.visible = false; 
                this.img_bg.height = 208;
                this.lb_active.text = "<未激活>";
                this.lb_active.textColor = 0xFE0000;
                this.lb_step.text = "1";
                this.lb_step1.text = "1";
                this.lb_rate.text = "1.5%";
                this.lb_progress.text = Math.floor(this._wingModel.wingInfo.WingEquipStep.progress) + "";
                this.lb_progress.textColor = 0xFE0000;
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