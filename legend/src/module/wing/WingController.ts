/**
 * Author: liuyonggen
 * 翅膀模块控制器 2017/11/16
 */
module game {
	export class WingController extends BaseController {
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
			this.registerProtocal(15021, this.handlerWingInfo, this);
			this.registerProtocal(15022, this.handlerWingInfo, this);
			this.registerProtocal(15023, this.handlerWingStepSuccess, this);
			this.registerProtocal(15024, this.handlerWingStepSuccess, this);
			this.registerProtocal(15025, this.handlerWingInfo, this);
			this.registerProtocal(14012, this.handlerTransformResult, this);
		}

		public handlerWingInfo(data) {
			(WingModel.getInstance() as WingModel).updateWingInfo(data);
		}

		public handlerWingStepSuccess(data) {
			(WingModel.getInstance() as WingModel).updateWingInfo(data);
			if(data) {
				 let wingModel: WingModel = WingModel.getInstance(); 
				 (SceneController.getInstance().updateWingModel(wingModel.wingInfo.wingId, wingModel.wingInfo.heroId));
			}
			this.dispatchEvent(PanelNotify.WING_STEP_SUCCESS);
		}

		public handlerTransformResult(data) {
			App.EventSystem.dispatchEvent(PanelNotify.WING_TRANSFORM_RESULT, data);
		}

		/**
		 * 红点
		 */
		private updateWingbtnTips() {
			let _wingModel: WingModel = WingModel.getInstance();
            // let _backpackModel: BackpackModel = BackpackModel.getInstance();
            // for(let index:number=0; index<3; index++) {
            //     _wingModel.wingInfo = _wingModel.wingInfoObj[(HeroModel.getInstance() as HeroModel).heroInfo[index].id];
            //     let wingStar =  _backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,16) ? 
            //     _backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,16).num > _wingModel.wingInfo.wingStar : false;
            //     if((_wingModel.heroInfo.coin > _wingModel.wingInfo.coinStar || wingStar ||   //可用金币升星    //可用羽翼升星
            //     _wingModel.wingInfo.wingEquipGoStep.zhengyuStep || _wingModel.wingInfo.wingEquipGoStep.fuyuStep ||
            //     _wingModel.wingInfo.wingEquipGoStep.rongyuStep || _wingModel.wingInfo.wingEquipGoStep.xuyuStep || //羽翼能否升阶  
            //     _backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,17)) &&   //有羽翼直升丹
            //     App.RoleManager.roleInfo.lv >= _wingModel.wingInfo.openLv){  //并且角色等级大于15
            //         App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_WING_TRAIN, true);
            //     } else if(_wingModel.wingInfo.replaceWingEquip){ //有可替换的羽翼装备
            //         App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_WING_TRAIN, true);
            //     } else {
            //         App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_WING_EQUIP, false);
            //     }
            // }
			let btnTip = _wingModel.judgeBtnTip();
            for(let i:number=0; i<btnTip.length; i++) {
                if(btnTip[i].bool) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_TRAIN, true);
					return;
                } else {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_EQUIP, false);
                }
            }
			
		}

		/**
	 	* 初始化事件监听
	 	*/
		protected initEventListener() {
			super.initEventListener();
			if(this._heroInfoUpdateEventId == 0) {
				this._heroInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.WING_INFO_UPDATE, this.updateWingbtnTips, this);
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
			if(this._heroInfoUpdateEventId != 0) {
				App.EventSystem.removeEventListener(PanelNotify.WING_INFO_UPDATE, this._heroInfoUpdateEventId);
				this._heroInfoUpdateEventId = 0;
			}
		}

	}
}