/**
 * Author: liuyonggen
 * 羽翼直升丹弹窗 2017/11/16
 */
module game{
    export class goStepTip extends BaseView{
        public gp_cancel: eui.Group;
        public gp_confirm: eui.Group;
        public lb_step: eui.Label;
        public lb_step0: eui.Label;
        private _wingModel: WingModel = WingModel.getInstance();
        private _wingStepsuccessEventId: number = 0;

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.gp_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.gp_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
            this.lb_step.text = App.ConfigManager.getConstConfigByType("WING_LEVEL_UP").value;
            this.lb_step0.text = App.ConfigManager.getConstConfigByType("WING_LEVEL_UP").value;
        }

        private confirm() {
            if (this._wingModel.wingInfo.exp == this._wingModel.wingInfo.expStar) {
                let text = [{ text: "羽翼经验已满，请先羽翼升阶", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
                App.GlobalTips.showTips(text);
            } else if((BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.BASE_ITEM,17)) { //如果有直升丹
                App.Socket.send(15024, {id:this._wingModel.wingInfo.heroId});
            } else {
                App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, 17);
            }
        }

        
        /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
            if(this._wingStepsuccessEventId == 0) {
                this._wingStepsuccessEventId = App.EventSystem.addEventListener(PanelNotify.WING_STEP_SUCCESS, this.closeWin, this);
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
            if (this._wingStepsuccessEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_STEP_SUCCESS, this._wingStepsuccessEventId);
                this._wingStepsuccessEventId = 0;
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