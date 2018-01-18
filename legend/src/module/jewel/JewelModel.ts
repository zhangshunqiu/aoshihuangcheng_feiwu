/**
 * module : 宝石数据模块
 * author : zrj
*/
module game {
	export class JewelModel extends BaseModel {

		public heroheadRedPoint = [false, false, false];
		public equipPartRedPoint = {1:{},2:{},3:{},4:{}};
		private heroModel: HeroModel = HeroModel.getInstance();
		public constructor() {
			super();
		}

		public checkCanUpgradeByPos(pos, part) {
			let heroInfo = this.heroModel.heroInfo[pos];
			let jewelInfo = heroInfo.getJewelInfoByPart(part);
			for (let i = 0; i < jewelInfo.length; i++) {
				let info = App.ConfigManager.getJewelInfoById(jewelInfo[i].stone_id);
				if (info) { //已激活
					let numInfo = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.BASE_ITEM, jewelInfo[i].stone_id);
					if (numInfo) {
						let maxLevel = App.ConfigManager.getConstConfigByType("JEWEL_LEVEL_MAX").value;
						let baseInfo = App.ConfigManager.getItemInfoById(jewelInfo[i].stone_id);
						if (numInfo.num >= 2 && baseInfo.limit_lv < maxLevel) {
							return true;
						} else {
							// return false;
						}
					} else {
						// return false;
					}
				} else {
					// return false;
				}
			}
			return false;
		}

		public checkCanUpgradeAll() {
			for (let i = 0; i < this.heroModel.heroInfo.length; i++) {
				this.heroheadRedPoint[i] = false;
				for (let k = 1; k <= 10; k++) {
					if (this.checkCanUpgradeByPos(i, k)) {
						this.heroheadRedPoint[i] = true;
						this.equipPartRedPoint[i+1][k] = true;
					} else {
						this.equipPartRedPoint[i+1][k] = false;
						// this.heroheadRedPoint[i] = false;
					}
				}
			}

			// App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, false);
			// for (let i = 0; i < this.heroheadRedPoint.length; i++) {
			// 	if (this.heroheadRedPoint[i]) {
			// 		App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, true);
			// 		break;
			// 	}
			// }
		}

		public checkCanEmble(pos) {
			let heroInfo = this.heroModel.heroInfo[pos];
			for (let k = 1; k <= 10; k++) {
				let jewelInfo = heroInfo.getJewelInfoByPart(k);
				for (let i = 0; i < jewelInfo.length; i++) {
					let info = App.ConfigManager.getJewelInfoById(jewelInfo[i].stone_id);
					if (info) { //已激活
						//
					} else {
						let jewelArray : Array<any> = (BackpackModel.getInstance() as BackpackModel).getItemArrayByTypeAndSubType(ItemType.RUBY,i+1);
						if (jewelArray.length > 0) {
							return true;
						}
					}
				}
			}
			return false;
		}

		public checkCanEmbleAll() {
			App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, false);
			for (let i = 0; i < this.heroModel.heroInfo.length; i++) {
				if (this.checkCanEmble(i)) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, true);
					this.heroheadRedPoint[i] = true;
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