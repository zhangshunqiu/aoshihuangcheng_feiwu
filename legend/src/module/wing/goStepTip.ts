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

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.gp_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.closeWin(WinName.WING_STEP_TIP);
            }, this);
            this.gp_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
            this.lb_step.text = App.ConfigManager.getConstConfigByType("WING_LEVEL_UP").value;
            this.lb_step0.text = App.ConfigManager.getConstConfigByType("WING_LEVEL_UP").value;
        }

        private confirm() {
            if((BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.BASE_ITEM,17)) { //如果有直升丹
                App.Socket.send(15024, {id:this._wingModel.wingInfo.heroId});
            } else {
                let view = new ItemWay(ClientType.BASE_ITEM, 17);
				PopUpManager.addPopUp({ obj: view });
            }
            App.WinManager.closeWin(WinName.WING_STEP_TIP);
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