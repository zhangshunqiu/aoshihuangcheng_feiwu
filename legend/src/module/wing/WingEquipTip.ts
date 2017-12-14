/**
 * Author liuyonggen
 * 翅膀装备属性弹窗  2017/11/16
 */
module game{
    export class WingEquipTip extends BaseView{
        public lb_name: eui.Label;
        public lb_step: eui.Label;
        public btn_goStep: eui.Button;
        public lb_attack: eui.Label;
        public lb_defense: eui.Label;
        public lb_equipScore: eui.Label;
        public img_icon: eui.Image;
        public img_icon_frame: eui.Image;
        public re_close: eui.Rect;
        private _wingModel: WingModel = WingModel.getInstance();
        private _backpackModel: BackpackModel = BackpackModel.getInstance();
        private _eventId: number = 0;
        private data: any;

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                App.WinManager.closeWin(WinName.WING_EQUIP_TIP);
            }, this)
            this.btn_goStep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goStep, this);
        }

        private openWingEquipTip(data) {
            this.data = data;
            this.lb_name.text = data.name;
            this.lb_step.text = data.step;
            this.btn_goStep.visible = data.goStep;
            this.lb_attack.text = data.attack;
            // this.lb_defense.text = data.defense;
            this.lb_equipScore.text = data.score;
            this.img_icon.source = data.source + "_png";
            this.img_icon_frame.source = data.frameSource;
            
        }

        private goStep() {
            App.Socket.send(15026,{id:this._wingModel.wingInfo.heroId, pos:this.data.pos, good_id:this._wingModel.wingInfo.wingEquip[this.data.pos-1].good_id});
            this.lb_step.text = this.data.step + 1;
            this.btn_goStep.visible = false;
        }

        /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
            if(this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.WING_EQUIP_TIP, this.openWingEquipTip, this);
            }
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
            if(this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_EQUIP_TIP, this._eventId);
                this._eventId = 0;
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