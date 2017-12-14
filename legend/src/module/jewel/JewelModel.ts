/**
 * module : 宝石数据模块
 * author : zrj
*/
module game {
	export class JewelModel extends BaseModel {

		public heroheadRedPoint = [false, false, false];
		public equipPartRedPoint = {};
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
					let numInfo = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(ClientType.BASE_ITEM,jewelInfo[i].stone_id);
					if (numInfo) {
						if (numInfo.num >= 2) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}
			}
		}

		public checkCanUpgradeAll() {
			for (let i = 0; i < this.heroModel.heroInfo.length; i++) {
				this.heroheadRedPoint[i] = false;
				for (let k = 1; k <= 10; k++) {
					if (this.checkCanUpgradeByPos(i, k)) {
						this.heroheadRedPoint[i] = true;
						this.equipPartRedPoint[k] = true;
					} else {
						this.equipPartRedPoint[k] = false;
						// this.heroheadRedPoint[i] = false;
					}
				}
			}

			App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, false);
			for (let i = 0; i < this.heroheadRedPoint.length; i++) {
				if (this.heroheadRedPoint[i]) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_RUBY_EMBED, true);
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