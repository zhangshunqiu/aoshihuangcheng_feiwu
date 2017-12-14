/**
 * 合成模块数据模型
 * author ： zrj
*/
module game {
	export class SynthesisModel extends BaseModel {
		public synthesisType: number = 1;

		public jewelRedPoint = [false, false, false, false];
		public wingRedPoint = [false, false, false, false];
		public jewelSubRedPoint = {};
		public wingSubRedPoint = {};
		public constructor() {
			super();
		}

		public checkJewelCanSynthesisByType(type) {
			let data = App.ConfigManager.getItemInfoByTypeAndSubType(ItemType.RUBY, type);
			let exist = false;
			for (let i = 0; i < data.length; i++) {
				let info = App.ConfigManager.getSynthesisInfoById(data[i].id);
				let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, info.need);
				if (!itemInfo) {
					itemInfo = { num: 0 };
				}
				if (itemInfo.num >= info.number) { //足够
					this.jewelSubRedPoint[data[i].id] = true;
					exist = true;
				} else {
					this.jewelSubRedPoint[data[i].id] = false;
				}

			}
			return exist;
		}

		public checkJewelCanSynthesisAll() {
			if (this.checkJewelCanSynthesisByType(JewelType.ATTACK)) {
				this.jewelRedPoint[0] = true;
			} else {
				this.jewelRedPoint[0] = false;
			}
			if (this.checkJewelCanSynthesisByType(JewelType.LIFE)) {
				this.jewelRedPoint[1] = true;
			} else {
				this.jewelRedPoint[1] = false;
			}
			if (this.checkJewelCanSynthesisByType(JewelType.DEFENCE)) {
				this.jewelRedPoint[2] = true;
			} else {
				this.jewelRedPoint[2] = false;
			}
			if (this.checkJewelCanSynthesisByType(JewelType.MAGIC)) {
				this.jewelRedPoint[3] = true;
			} else {
				this.jewelRedPoint[3] = false;
			}

			App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE,false);
			for(let i=0;i<this.jewelRedPoint.length;i++) {
				if (this.jewelRedPoint[i]) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE,true);
					break;
				}
			}
		}

		public checkWingCanSynthesisByType(type) {
			let data = App.ConfigManager.getItemInfoByTypeAndSubType(ItemType.WING, type);
			let exist = false;
			for (let i = 0; i < data.length; i++) {
				let info = App.ConfigManager.getSynthesisInfoById(data[i].id);
				let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, info.need);
				if (!itemInfo) {
					itemInfo = { num: 0 };
				}
				if (itemInfo.num >= info.number) { //足够
					this.wingSubRedPoint[data[i].id] = true;
					exist = true;
				} else {
					this.wingSubRedPoint[data[i].id] = false;
				}

			}
			return exist;
		}

		public checkWingCanSynthesisAll() {
			if (this.checkWingCanSynthesisByType(WingEquipType.ZHENGYU)) {
				this.wingRedPoint[0] = true;
			} else {
				this.wingRedPoint[0] = false;
			}
			if (this.checkWingCanSynthesisByType(WingEquipType.FUYU)) {
				this.wingRedPoint[1] = true;
			} else {
				this.wingRedPoint[1] = false;
			}
			if (this.checkWingCanSynthesisByType(WingEquipType.RONGYU)) {
				this.wingRedPoint[2] = true;
			} else {
				this.wingRedPoint[2] = false;
			}
			if (this.checkWingCanSynthesisByType(WingEquipType.XUYU)) {
				this.wingRedPoint[3] = true;
			} else {
				this.wingRedPoint[3] = false;
			}

			App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_COMNINE_WING,false);
			for(let i=0;i<this.jewelRedPoint.length;i++) {
				if (this.wingRedPoint[i]) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_COMNINE_WING,true);
					break;
				}
			}
		}

		public clear() {
			super.clear();
		}

		public destroy() {
			super.destroy();
		}
	}
}