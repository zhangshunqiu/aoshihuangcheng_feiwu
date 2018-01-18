/**
 * Author: liuyonggen
 * 翅膀模块控制器 2017/11/16
 */
module game {
	export class WingController extends BaseController {
		private _wingInfoUpdateEventId: number = 0;
		private _heroInfoUpdateEventId: number = 0;

		public constructor() {
			super();
			this.initProtocol();
		    this.initEventListener();
		}

		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			super.initProtocol();
			this.registerProtocal(15021, this.handlerOpenWingInfo, this);
			this.registerProtocal(15022, this.handlerWingInfo, this);
			this.registerProtocal(15023, this.handlerWingStepSuccess, this);
			this.registerProtocal(15024, this.handlerWingStepSuccess, this);
			this.registerProtocal(15025, this.handlerWingInfo, this);
			this.registerProtocal(15026, this.handlerWingEquipStepResult, this);
			this.registerProtocal(14012, this.handlerTransformResult, this);
		}

		public handlerOpenWingInfo(data) {
			(WingModel.getInstance() as WingModel).updateWingInfo(data);
			App.EventSystem.dispatchEvent(PanelNotify.WING_INFO_UPDATE);
			let wingModel: WingModel = WingModel.getInstance(); 
			(SceneController.getInstance().updateWingModel(wingModel.wingInfo.wingId, wingModel.wingInfo.heroId));
		}

		public handlerWingInfo(data) {
			(WingModel.getInstance() as WingModel).updateWingInfo(data);
			App.EventSystem.dispatchEvent(PanelNotify.WING_INFO_UPDATE);
		}

		public handlerWingStepSuccess(data) {
			(WingModel.getInstance() as WingModel).updateWingInfo(data);
			if(data) {
				 let wingModel: WingModel = WingModel.getInstance(); 
				 (SceneController.getInstance().updateWingModel(wingModel.wingInfo.wingId, wingModel.wingInfo.heroId));
			}
			App.EventSystem.dispatchEvent(PanelNotify.WING_INFO_UPDATE);
			this.dispatchEvent(PanelNotify.WING_STEP_SUCCESS);
		}

		/**羽翼装备升阶结果 */
		public handlerWingEquipStepResult(data) {
			if (data.id >= 0) {
				(WingModel.getInstance() as WingModel).updateWingInfo(data);
				this.dispatchEvent(PanelNotify.WING_EQUIP_STEP_SUCCESS, data);
				App.EventSystem.dispatchEvent(PanelNotify.WING_INFO_UPDATE);
			} 
		}

		public handlerTransformResult(data) {
			App.EventSystem.dispatchEvent(PanelNotify.WING_TRANSFORM_RESULT, data);
		}

		/**
		 * 红点
		 */
		private updateWingbtnTips() {
			let _wingModel: WingModel = WingModel.getInstance();
			let btnTip = _wingModel.judgeBtnTip();
            for (let i: number = 0; i < btnTip.length; i++) {
				if (btnTip[i].devBool || btnTip[i].equipBool) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.WING, true);
				} else {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.WING, false);
				}
			}	
		}

		/**
	 	* 初始化事件监听
	 	*/
		protected initEventListener() {
			super.initEventListener();
			if(this._wingInfoUpdateEventId == 0) {
				this._wingInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.WING_INFO_UPDATE, this.updateWingbtnTips, this);
			}
		}

		/**
		 * 销毁
		 */
		public destroy() {
			super.destroy();
		}

		/**
		 * 清理
		 */
		public clear() {
			super.clear();
			if(this._wingInfoUpdateEventId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.WING_INFO_UPDATE, this._wingInfoUpdateEventId);
				this._wingInfoUpdateEventId = 0;
			}
		}

	}
}