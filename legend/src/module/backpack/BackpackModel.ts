/**
 * module : 背包模块数据模型
 * author ：zrj
 * 
*/
module game {
	export class BackpackModel extends BaseModel {

		/**
		 * 装备背包
		*/
		public equipBackpack: Array<EquipVO> = [];
		/**
		 * 物品背包
		*/
		public itemBackpack: Array<ItemVO> = [];
		/**
		 * 功能道具背包
		*/
		public chestBackpack: Array<ItemVO> = [];
		/**
		 * 背包容量
		*/
		public maxCapacity: number = 0;
		/**
		 * 背包当前容量
		*/
		public capacity: number = 0;

		private heroModel: HeroModel = HeroModel.getInstance();

		public constructor() {
			super();
			this.equipBackpack = [];
			this.itemBackpack = [];
			this.chestBackpack = [];
		}

		public updateBackpack(info) {
			this.equipBackpack = [];
			this.itemBackpack = [];
			this.chestBackpack = [];
			for (let k in info.playergoods) {
				let itemInfo = info.playergoods[k];
				if (itemInfo.type == ClientType.BASE_ITEM) { //物品
					let info3 = App.ConfigManager.getItemInfoById(itemInfo.good_id);
					if (!info3) {
						continue;
					}
					let info2 = info3.type;
					if (info2 == 0) {
						this.itemBackpack.push(new ItemVO(itemInfo));
					} else {
						this.chestBackpack.push(new ItemVO(itemInfo));
					}
				} else if (itemInfo.type == ClientType.EQUIP) {  //装备
					this.equipBackpack.push(new EquipVO(itemInfo));
				}
			}
			this.maxCapacity = info.total;
			this.capacity = this.itemBackpack.length + this.chestBackpack.length + this.equipBackpack.length;
			//是否提示熔炼
			this.updateSmeltBtnTip();
			this.handleRedDot(null);
			this.sortEquipBackpack();
		}

		public updateBackpackItemInfo(info) {
			for (let k in info) {
				let item = info[k];
				let pack = this.itemBackpack;
				let exist = false;
				//查找是否存在这个item
				if (item.type == 1) { //道具
					let tempInfo = App.ConfigManager.getItemInfoById(item.good_id);
					if (tempInfo.type == 0) {
						pack = this.itemBackpack;
					} else {
						pack = this.chestBackpack;
					}
				} else if (item.type == ClientType.EQUIP) { //装备
					pack = this.equipBackpack;
				}

				for (let i = 0; i < pack.length; i++) {
					if (pack[i].id == item.id) { //存在
						if (item.num > pack[i].num) { //获得物品
							let temp = new ItemVO(item);
							temp.num = item.num - pack[i].num;
							pack[i].updateInfo(item);
							this.handleReward(temp);
						} else {  //消耗物品
							pack[i].updateInfo(item);
							this.handleCost(item);
							if (item.num == 0) { //用完，删除
								pack.splice(i, 1);
								this.capacity -= 1;
							}
						}
						exist = true;
						break;
					}
				}
				if (!exist) { //不存在
					if (item.type == ClientType.BASE_ITEM) { //物品
						let info2 = App.ConfigManager.getItemInfoById(item.good_id).type;
						if (info2 == 0) {
							this.itemBackpack.push(new ItemVO(item));
						} else {
							this.chestBackpack.push(new ItemVO(item));
						}
					} else if (item.type == ClientType.EQUIP) {  //装备
						let newItem = new EquipVO(item);
						let exist = false;
						let newEquipInfo = App.ConfigManager.getEquipById(newItem.good_id);
						//@这里性能好差，优化一下@勇根
						for (let i:number=0; i<this.equipBackpack.length; i++) {
							let equipInfo = App.ConfigManager.getEquipById(this.equipBackpack[i].good_id);
							//这里要考虑if不为true情况 @勇根
							if (equipInfo.sorting < newEquipInfo.sorting) {
								this.equipBackpack.splice(i, 0, newItem);
								exist = true;
								break;
							}
						}
						//这里要考虑背包为空的情况 @勇根
						if (this.equipBackpack.length == 0 || !exist) {
							this.equipBackpack.push(newItem);
						}
						// this.equipBackpack.push(newItem);
					}
					this.capacity += 1;
					this.handleReward(item);
				}
				this.handleRedDot(item);
			}
			//是否提示熔炼
			this.updateSmeltBtnTip();
		}

		private sortEquipBackpack() {
			this.equipBackpack.sort((item1, item2)=>{
				let equipInfo1 = App.ConfigManager.getEquipById(item1.good_id);
				let equipInfo2 = App.ConfigManager.getEquipById(item2.good_id);
				if(equipInfo1 && equipInfo2) {
					return equipInfo2.sorting - equipInfo1.sorting;
				}
			})
		}

		/**
		 * 获得物品
		*/
		public handleReward(reward) {
			let info = undefined;
			if (reward.type == ClientType.BASE_ITEM) { //道具
				info = App.ConfigManager.getItemInfoById(reward.good_id);
			} else if (reward.type == ClientType.EQUIP) { //装备
				info = App.ConfigManager.getEquipById(reward.good_id);
			} else if (reward.type == ClientType.CURRENCY) { //元宝经验金钱
				if (reward.good_id == CurrencyType.COIN) {
					info = { name: "金币", quality: 0 };
				} else if (reward.good_id == CurrencyType.GOLD) {
					info = { name: "元宝", quality: 0 };
				} else if (reward.good_id == CurrencyType.TURN_EXP) {
					info = { name: "修为", quality: 0 };
				}
			}
			let text = [{ text: "获得 ", style: { textColor: 0xffff00, size: 24, fontFamily: "SimHei" } }, { text: info.name + "*" + reward.num, style: { textColor: ConstTextColor[info.quality], size: 24, fontFamily: "SimHei" } }]
			App.GlobalTips.showTips(text);
		}

		/**
		 * 消耗物品
		*/
		public handleCost(cost) {

		}

		/**
		 * 根据 type id uuid 获取背包里的内容，没有返回null,
		 * @param type ClientType
		 * @param id 配置表id
		 * @param uuid 背包唯一id
		*/
		public getItemByTypeIdUuid(type, good_id, uuid?): any {
			switch (type) {
				case 1: {
					let item: ItemVO = undefined;
					for (let key in this.itemBackpack) {
						if (uuid && this.itemBackpack[key].id == uuid) {
							return this.itemBackpack[key];
						} else if (Number(good_id) == this.itemBackpack[key].good_id) {
							if (!item) {
								item = new ItemVO(this.itemBackpack[key]);
							} else {
								item.num += this.itemBackpack[key].num;
							}
						}
					}
					for (let key in this.chestBackpack) {
						if (uuid && this.chestBackpack[key].id == uuid) {
							return this.chestBackpack[key];
						} else if (Number(good_id) == this.chestBackpack[key].good_id) {
							if (!item) {
								item = new ItemVO(this.chestBackpack[key]);
							} else {
								item.num += this.chestBackpack[key].num;
							}
						}
					}
					return item;
				}
				case 2: {
					for (let key in this.equipBackpack) {
						if (this.equipBackpack[key].id == uuid) {
							return this.equipBackpack[key];
						}
					}
					break;
				}
			}
			return null;
		}

		/**
		 * 根据 品质 获取背包里的内容，没有返回null
		*/
		public getEquipByQuality(quality: number): any {
			let arr = [];
			for (let key in this.equipBackpack) {
				let info = App.ConfigManager.getEquipById(this.equipBackpack[key].good_id);
				if (info.quality == quality) {
					arr.push(this.equipBackpack[key]);
				}
			}
			return arr;
		}

		/**
		 * 根据 职业 部位 获取背包里的内容，没有返回null
		*/
		public getEquipByCareerPart(career: number, part: number): any {
			let equipModel = EquipModel.getInstance() as EquipModel;
			let arr = [];
			for (let key in this.equipBackpack) {
				let info = App.ConfigManager.getEquipById(this.equipBackpack[key].good_id);
				if ((info.limit_career == career || part >= 11) && info.sub_type == equipModel.getTypeByPos(part)) {
					arr.push(this.equipBackpack[key]);
				}
			}
			return arr;
		}

		/**
		 * 根据 类型 获取背包里的道具数组，非装备，没有返回null
		*/
		public getItemArrayByTypeAndSubType(type: number, subType ?: number): any {
			let arr = [];
			let item: ItemVO = undefined;
			for (let key in this.itemBackpack) {
				let info = App.ConfigManager.getItemInfoById(this.itemBackpack[key].good_id);
				if (type == info.type) {
					if (subType) {
						if (subType == info.sub_type) {
							arr.push(this.itemBackpack[key]);
						}
					} else {
						arr.push(this.itemBackpack[key]);
					}
					
				}
			}
			for (let key in this.chestBackpack) {
				let info = App.ConfigManager.getItemInfoById(this.chestBackpack[key].good_id);
				if (type == info.type) {
					if (subType) {
						if (subType == info.sub_type) {
							arr.push(this.chestBackpack[key]);
						}
					} else {
						arr.push(this.chestBackpack[key]);
					}
					
				}
			}
			return arr;
		}

		/**
		 * 背包剩余空间
		*/
		public getRemindCapacity() {
			return this.maxCapacity - this.capacity;
		}

		//背包空间红点
		public updateSmeltBtnTip() {
			var num: number = this.getRemindCapacity();
			if (num <= 0) {
				App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK_SMELT, true);
				App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK, true);//由于需要父级显示不同的内容所以才加
				App.EventSystem.dispatchEvent(PanelNotify.MAIN_BACKPAG_FULL_TIPS, true, 500);
			} else if (num < 30) {
				App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK_SMELT, true);
				App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK, true);//由于需要父级显示不同的内容所以才加	
				App.EventSystem.dispatchEvent(PanelNotify.MAIN_BACKPAG_FULL_TIPS, false, 500);
			} else {
				App.BtnTipManager.setTypeValue(ConstBtnTipType.BACKPACK_SMELT, false);
				App.EventSystem.dispatchEvent(PanelNotify.MAIN_BACKPAG_FULL_TIPS, false, 500);
			}
		}
		/**
		 * 更新橙装熔炼提示
		 */
		private updateSmeltOrangeBtnTip() {

		}

		//处理背包改变的相关红点
		private handleRedDot(item) {
			if (!item) {  //首次进来，检索全部
				this.heroModel.heroInfo.forEach((value, index, array) => {
					ForgeModel.getInstance().checkCanStrength(index);
					ForgeModel.getInstance().checkCanStarup(index);
					ForgeModel.getInstance().checkCanOrangeUp(index);
				}, this);
				this.heroModel.checkBetterEquipRedDotAll();
				this.heroModel.checkSpecialEquipRedDotAll();
				SynthesisModel.getInstance().checkJewelCanSynthesisAll();
				SynthesisModel.getInstance().checkWingCanSynthesisAll();
				JewelModel.getInstance().checkCanUpgradeAll();
			} else if (item.type == ClientType.EQUIP) { //武器更新，装备面板红点
				this.heroModel.checkBetterEquipRedDot(item);
			} else if (item.type == ClientType.BASE_ITEM) {  //道具更新
				if (item.good_id == 10) { //强化石
					this.heroModel.heroInfo.forEach((value, index, array) => {
						ForgeModel.getInstance().checkCanStrength(index);
					}, this);
				} else if (item.good_id == 11) {//橙装精华
					this.heroModel.heroInfo.forEach((value, index, array) => {
						ForgeModel.getInstance().checkCanOrangeUp(index);
					}, this);
				} else if (item.good_id == 18) {//升星石
					this.heroModel.heroInfo.forEach((value, index, array) => {
						ForgeModel.getInstance().checkCanStarup(index);
					}, this);
				} else if (item.good_id == 22 || item.good_id == 23 || item.good_id == 24 || item.good_id == 25) { //特殊装备
					HeroModel.getInstance().checkSpecialEquipRedDotAll();
				} else {
					let itemInfo = App.ConfigManager.getItemInfoById(item.good_id);
					if (itemInfo.type == ItemType.RUBY || item.good_id == 1000) {  //宝石
						SynthesisModel.getInstance().checkJewelCanSynthesisAll();
						JewelModel.getInstance().checkCanUpgradeAll();
						JewelModel.getInstance().checkCanEmbleAll();
					} else if (itemInfo.type == ItemType.WING || item.good_id == 200) {  //翅膀
						SynthesisModel.getInstance().checkWingCanSynthesisAll();
					}
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