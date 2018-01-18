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
        private _wingEquipStepEventId: number = 0;
        private _data: any;
        private _wingEquipStepMc: AMovieClip;
        public gp_main: eui.Group;

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this)
            this.btn_goStep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goStep, this);
        }

        private openWingEquipTip(data) {
            this._data = data;
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
            App.Socket.send(15026,{id:this._wingModel.wingInfo.heroId, pos:this._data.pos, good_id:this._wingModel.wingInfo.wingEquip[this._data.pos-1].good_id});
        }

        private onWingEquipStepSuccess() {
            this.lb_step.text = this._data.step + 1;
            this.btn_goStep.visible = false;
            this.lb_attack.text = this._wingModel.wingInfo.wingEquipAttr[this._data.attackType];
            switch(this._data.pos) {
                case 1: 
                    this.lb_equipScore.text = this._wingModel.wingInfo.wingEquipAttr.zhengyuScore + "";
                    this.img_icon_frame.source = QualityFrame[this._wingModel.wingInfo.WingEquipStep.zhengyuQuality];
                    break;
                case 2: 
                    this.lb_equipScore.text = this._wingModel.wingInfo.wingEquipAttr.fuyuScore + "";
                    this.img_icon_frame.source = QualityFrame[this._wingModel.wingInfo.WingEquipStep.fuyuQuality];
                    break;
                case 3: 
                    this.lb_equipScore.text = this._wingModel.wingInfo.wingEquipAttr.rongyuScore + "";
                    this.img_icon_frame.source = QualityFrame[this._wingModel.wingInfo.WingEquipStep.rongyuQuality];
                    break;
                case 4: 
                    this.lb_equipScore.text = this._wingModel.wingInfo.wingEquipAttr.xuyuScore + "";
                    this.img_icon_frame.source = QualityFrame[this._wingModel.wingInfo.WingEquipStep.xuyuQuality];
                    break;
            }
            this.joinEffect();
        }

        private joinEffect() {
            if(this._wingEquipStepMc == null) {
                this._wingEquipStepMc = new AMovieClip();
            }
            this.gp_main.addChild(this._wingEquipStepMc);
            this._wingEquipStepMc.x = 177;
            this._wingEquipStepMc.y = 314;
            this._wingEquipStepMc.playMCKey("effsjcg", "", 1);
            if(this._wingEquipStepMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this._wingEquipStepMc.addEventListener(egret.Event.COMPLETE, this.removeWingEquipStepMc, this);
            }
        }

        private removeWingEquipStepMc() {
            if(this._wingEquipStepMc) {
                this._wingEquipStepMc.destroy();
                if(this._wingEquipStepMc.parent) {
                    this._wingEquipStepMc.parent.removeChild(this._wingEquipStepMc);
                }
                this._wingEquipStepMc = null;
            }
        }

        /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
            if(this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.WING_EQUIP_TIP, this.openWingEquipTip, this);
            }
            if(this._wingEquipStepEventId == 0) {
                this._wingEquipStepEventId = App.EventSystem.addEventListener(PanelNotify.WING_EQUIP_STEP_SUCCESS, this.onWingEquipStepSuccess, this);
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
            if(this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_EQUIP_TIP, this._eventId);
                this._eventId = 0;
            }
            if(this._wingEquipStepEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_EQUIP_STEP_SUCCESS, this._wingEquipStepEventId);
                this._wingEquipStepEventId = 0;
            }
            this.removeWingEquipStepMc();
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
            super.destroy();
		}
    }
}