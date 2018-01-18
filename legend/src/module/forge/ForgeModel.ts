/**
 * module : 锻造模块数据模型
 * author : zrj
*/
module game {
	export class ForgeModel extends BaseModel {

		public curPart: number; //当前强化位置
		public curStarPart: number; //当前升星位置
		public curOrangePart: number; //当前橙装位置

		public strengthHeroRedDot = [false, false, false]; //强化的英雄红点记录;
		public starHeroRedDot = [false, false, false]; //升星的英雄红点记录;
		public orangeHeroRedDot = [false, false, false]; //橙装升级的英雄红点记录;
		public constructor() {
			super();
		}

		public updateStrengthPart(data) {
			this.curPart = data.part + 1;
			if (this.curPart > 10) {
				this.curPart = ConstEquipPart.WEAPON;
			}
		}

		public updateStarPart(data) {
			this.curStarPart = data.part;
			if (this.curStarPart > 10) {
				this.curStarPart = ConstEquipPart.WEAPON;
			}
		}

		/**
		 * 强化
		*/
		public getStrengthByPartLevel(part, level) {
			let key = "1" + (part >= 10 ? String(part) : "0" + part) + (level > 100 ? String(level) : level >= 10 ? "0" + String(level) : "00" + String(level));
			return App.ConfigManager.castConfig()[key];
		}
		/**
		 * 升星
		*/
		public getStarByPartLevel(part, level) {
			// let key = "2" + (part>=10?String(part):"0"+part) + (level > 100 ? String(level) : level > 10 ? "0" + String(level) : "00" + String(level));
			let key = "200" + (level > 100 ? String(level) : level >= 10 ? "0" + String(level) : "00" + String(level));
			return App.ConfigManager.castConfig()[key];
		}

		public checkCanStrength(pos) {
			let heroModel = HeroModel.getInstance() as HeroModel;
			let tempLv = 999999;
			heroModel.heroInfo[pos].equip_info.forEach((value, index, array) => {
				if (!this.curPart && value.part <= 10) {
					this.curPart = value.part;
					tempLv = value.lv;
				} else if (this.curPart == value.part) {
					tempLv = value.lv;
				} else if (tempLv > value.lv && value.part <= 10) {
					this.curPart = value.part;
					tempLv = value.lv;
				}
			}, this);
			//判断等级
			if (App.RoleManager.roleInfo.lv <= tempLv) {
				return false;
			}

			let equip = heroModel.heroInfo[pos].getPartInfoByPart(this.curPart);
			let curLevel = equip ? equip.lv : 0;
			let forgeInfo = this.getStrengthByPartLevel(this.curPart, curLevel + 1);
			let costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
			let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, costInfo[0]);
			if (!itemInfo) {
				itemInfo = { num: 0 };
			}
			if (itemInfo.num >= costInfo[1]) { //足够
				// return true;
				this.strengthHeroRedDot[pos] = true;
				App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STRENGTH, true);
				return true;
			} else {
				this.strengthHeroRedDot[pos] = false;
				App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STRENGTH, false);
				return false;
			}
		}

		public checkCanStarup(pos) {
			let heroInfo = HeroModel.getInstance().heroInfo[pos];

			this.starHeroRedDot[pos] = false;
			App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STAR, false);
			for (let i = 1; i <= 10; i++) {
				let part = i;
				let equip = heroInfo.getPartInfoByPart(part);
				let curLevel = equip ? equip.star : 0;
				let forgeInfo = this.getStarByPartLevel(part, curLevel + 1);
				let maxLevel = false;
				if (!forgeInfo) { //没有下一等级
					// return false;
					continue;
				}
				let costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
				let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, costInfo[0]);
				let itemConfig = App.ConfigManager.itemConfig()[costInfo[0]];
				if (!itemInfo) {
					itemInfo = { num: 0 };
				}
				if (maxLevel) {
					costInfo[1] = 0;
				}
				if (itemInfo.num >= costInfo[1]) { //足够
					// return true;
					this.starHeroRedDot[pos] = true;
					App.BtnTipManager.setTypeValue(ConstBtnTipType.FORGE_STAR, true);
					return;
				} else {
					// return false;
				}
			}

		}

		//根据具体部位去判断
		public checkCanStarupByPart(pos, part?) {
			let heroInfo = HeroModel.getInstance().heroInfo[pos];
			let equip = heroInfo.getPartInfoByPart(part);
			let curLevel = equip ? equip.star : 0;
			let forgeInfo = this.getStarByPartLevel(part, curLevel + 1);
			let maxLevel = false;
			if (!forgeInfo) { //没有下一等级
				return false;
			}
			let costInfo = (forgeInfo.consume.substring(1, forgeInfo.consume.length - 1)).split(",");
			let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, costInfo[0]);
			let itemConfig = App.ConfigManager.itemConfig()[costInfo[0]];
			if (!itemInfo) {
				itemInfo = { num: 0 };
			}
			if (maxLevel) {
				costInfo[1] = 0;
			}
			if (itemInfo.num >= costInfo[1]) { //足够
				return true;
			} else {
				return false;
			}

		}

		//橙装升级
		public checkCanOrangeUp(pos) {
			let heroInfo = HeroModel.getInstance().heroInfo[pos];

			this.orangeHeroRedDot[pos] = false;
			App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_ORANGEEQUIP, false);
			for (let i = 1; i <= 10; i++) {
				if(this.checkCanOrangeUpByPart(pos,i)) {
					this.orangeHeroRedDot[pos] = true;
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_ORANGEEQUIP, true);
					break;
				}
			}

		}

		//根据具体部位去判断
		public checkCanOrangeUpByPart(pos, part?) {
			let heroInfo = HeroModel.getInstance().heroInfo[pos];
			let equipVO = heroInfo.getEquipByPart(part);
			if (!equipVO) {
				return false;
			}
			let equipInfo = App.ConfigManager.getEquipById(equipVO.good_id);
			if (!equipInfo || equipInfo.upgrade == 0) {
				return false;
			}
			let nextInfo = App.ConfigManager.getEquipById(equipInfo.upgrade);

			if (!nextInfo) {
				return false;
			}
			if (App.RoleManager.roleInfo.turn < nextInfo.reincarnation) {
				return false;
			} else if (App.RoleManager.roleInfo.lv < nextInfo.limit_lvl) {
				return false;
			}
			//橙装精华
			let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 11);
			if (!itemInfo) {
				itemInfo = { num: 0 };
			}
			if (itemInfo.num >= equipInfo.consumption) { //足够
				return true;
			} else {
				return false;
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