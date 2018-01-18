
/**
 * module : 英雄数据模型
 * author : zrj
*/
module game {
	export class HeroModel extends BaseModel {
		public baseInfo: any;
		public heroInfo: Array<HeroVO>;
		public curPos: number = 0; //当前选中第几位英雄
		public curPart: number = 1; //当前选中装备位置

		public heroHeadFrame = [false, false]; //新英雄解锁特效
		public heroHeadRedDot = [false, false, false]; //英雄头部红点
		public heroHeadRedDot2 = [false, false, false]; //英雄头部红点2 特殊装备用
		public heroEquipPartRedDot: Array<Array<boolean>> = [
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false]]; //英雄部位红点

		public heroSpecialEquipPartRedDot: Array<Array<boolean>> = [
			[false, false, false, false, false, false],
			[false, false, false, false, false, false],
			[false, false, false, false, false, false]]; //英雄特殊装备红点

		public isEquipPuton: boolean = false;  //穿戴装备的阈值，每次穿戴完成为true，在英雄信息里置为false
		public isSpecialEquip: boolean = false;  //特殊装备的阈值，每次特殊装备有改变为true，在英雄信息里置为false
		public constructor() {
			super();
			this.baseInfo = {};
			this.heroInfo = [];
		}

		public updateBaseInfo(info) {
			this.baseInfo = {};
			this.baseInfo = info;
			this.baseInfo.exp = info.exp.toNumber();
		}
		/**更新英雄信息
		 * 
		 */
		public updateHeroInfo(info) {
			// this.heroInfo = [];
			for (let k in info) {
				let findId: Boolean = false;
				for (var i: number = 0; i < this.heroInfo.length; i++) {
					var vo: game.HeroVO = this.heroInfo[i];
					if (vo.id == info[k].id) {
						this.heroInfo[i].updateInfo(info[k]);
						findId = true;
					}
				}
				if (findId == false) {
					this.heroInfo.push(new HeroVO(info[k]));
				}
			}
			this.heroInfo.sort((a, b) => {
				if (a.id < b.id) {
					return -1;
				}
				return 1;
			})
			// App.logzrj(this.heroInfo);
		}
		//增加伙伴
		public addNewHero(info) {
			for (let k in info) {
				this.heroInfo.push(new HeroVO(info[k]));
			}
			this.heroInfo.sort((a, b) => {
				if (a.id < b.id) {
					return -1;
				}
				return 1;
			})
		}

		//获取普通装备信息
		public getHeroEquipByPosPart(pos, part) {
			if (pos >= this.heroInfo.length || this.heroInfo.length == 0) {
				return null;
			}
			let info = this.heroInfo[pos].equip_info;
			for (let j in info) {
				if (Number(info[j].part) === part && info[j].equip) {
					return info[j];
				}
			}
		}

		//获取特殊装备信息
		public getHeroSpecialEquipByPosPart(pos, part) {
			if (pos >= this.heroInfo.length || this.heroInfo.length == 0) {
				return null;
			}
			let info = this.heroInfo[pos].specialEquip;
			for (let j in info) {
				if (Number(info[j].pos) === part && info[j].id) {
					return info[j];
				}
			}
		}


		public getHeroVoById(id: number): HeroVO {
			var vo: HeroVO;
			for (var i: number = 0; i < this.heroInfo.length; i++) {
				vo = this.heroInfo[i];
				if (vo.id == id) {
					return vo;
				}
			}
			return null;
		}

		//获得当前选择的伙伴
		public getCurHero() {
			return this.heroInfo[this.curPos];
		}


		//检测是否有可穿戴的更好的装备 对应单个位置
		public checkBetterEquipRedDot(curEquipInfo) {
			let myBaseInfo = App.ConfigManager.equipConfig()[curEquipInfo.good_id];
			let pos = EquipModel.getInstance().getPosByType(myBaseInfo.sub_type); //对应英雄身上部位

			//先将相关部位红点干掉
			for (let k = 0; k < this.heroInfo.length; k++) {  //对应职业
				if (this.heroInfo[k].job == myBaseInfo.limit_career) {
					if (typeof pos == "number") {
						this.heroEquipPartRedDot[k][pos - 1] = false;
					} else { //对应有两个部位的
						pos.forEach((v, idx, a) => {
							this.heroEquipPartRedDot[k][v - 1] = false;
						}, this)
					}
					break;
				}
			}
			//开始检索
			for (let i = 0; i < BackpackModel.getInstance().equipBackpack.length; i++) {
				let equipInfo = BackpackModel.getInstance().equipBackpack[i];
				let baseInfo = App.ConfigManager.equipConfig()[equipInfo.good_id];
				for (let k = 0; k < this.heroInfo.length; k++) {
					let value = this.heroInfo[k];
					let index = k;
					if (baseInfo.limit_career != value.job || baseInfo.sub_type != myBaseInfo.sub_type || (baseInfo.sex != value.sex && baseInfo.sex != 0) || baseInfo.limit_lv > App.RoleManager.roleInfo.lv) { //性别等级部位都不对
						continue;
					}
					if (typeof pos == "number") {
						let myEquipInfo = this.getHeroEquipByPosPart(index, pos);
						if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
							this.heroHeadRedDot[index] = true;
							this.heroEquipPartRedDot[index][pos - 1] = true;
						} else if (myEquipInfo) {
							if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
								this.heroHeadRedDot[index] = true;
								this.heroEquipPartRedDot[index][pos - 1] = true;
							} else {
							}
						}
					} else { //对应有两个部位的
						pos.forEach((v, idx, a) => {
							let myEquipInfo = this.getHeroEquipByPosPart(index, v);
							if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
								this.heroHeadRedDot[index] = true;
								this.heroEquipPartRedDot[index][v - 1] = true;
							} else if (myEquipInfo) {
								if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
									this.heroHeadRedDot[index] = true;
									this.heroEquipPartRedDot[index][v - 1] = true;
								} else {
								}
							}
						}, this);
					}
				};
			}

			App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, false);
			for (let i = 0; i < this.heroHeadRedDot.length; i++) {
				if (this.heroHeadRedDot[i]) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
				}
			}
			for (let i = 0; i < this.heroHeadRedDot2.length; i++) {
				if (this.heroHeadRedDot2[i]) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
				}
			}

		}

		//检测是否有可穿戴的更好的装备
		public checkBetterEquipRedDotAll() {
			this.resetRedDot();
			for (let i = 0; i < BackpackModel.getInstance().equipBackpack.length; i++) {
				let equipInfo = BackpackModel.getInstance().equipBackpack[i];
				let baseInfo = App.ConfigManager.equipConfig()[equipInfo.good_id];
				for (let k = 0; k < this.heroInfo.length; k++) {
					let value = this.heroInfo[k];
					let index = k;
					if (baseInfo.limit_career != value.job || (baseInfo.sex != value.sex && baseInfo.sex != 0) || baseInfo.limit_lv > App.RoleManager.roleInfo.lv) { //性别等级都不对
						continue;
					}
					let pos = EquipModel.getInstance().getPosByType(baseInfo.sub_type); //对应英雄身上部位
					if (typeof pos == "number") {
						let myEquipInfo = this.getHeroEquipByPosPart(index, pos);
						if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
							// return true;
							this.heroHeadRedDot[index] = true;
							this.heroEquipPartRedDot[index][pos - 1] = true;
						} else if (myEquipInfo) {
							if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
								// return true;
								this.heroHeadRedDot[index] = true;
								this.heroEquipPartRedDot[index][pos - 1] = true;
							} else {
								// return false;
								// this.heroHeadRedDot[index] = false;
								// this.heroEquipPartRedDot[index][pos - 1] = false;
							}
						}
					} else { //对应有两个部位的
						pos.forEach((v, idx, a) => {
							let myEquipInfo = this.getHeroEquipByPosPart(index, v);
							if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
								// return true;
								this.heroHeadRedDot[index] = true;
								this.heroEquipPartRedDot[index][v - 1] = true;
							} else if (myEquipInfo) {
								if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
									// return true;
									this.heroHeadRedDot[index] = true;
									this.heroEquipPartRedDot[index][v - 1] = true;
								} else {
									// return false;
									// this.heroHeadRedDot[index] = false;
									// this.heroEquipPartRedDot[index][v - 1] = false;
								}
							}
						}, this);
					}
				};
			}

			for (let i = 0; i < this.heroHeadRedDot.length; i++) {
				if (this.heroHeadRedDot[i]) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
				}
			}
			for (let i = 0; i < this.heroHeadRedDot2.length; i++) {
				if (this.heroHeadRedDot2[i]) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
				}
			}
		}

		//重置装备红点
		public resetRedDot() {
			this.heroInfo.forEach((value, index, array) => {
				this.heroHeadRedDot[index] = false;
				for (let i = 0; i < 10; i++) {
					this.heroEquipPartRedDot[index][i] = false;
				}
				// for (let i = 0; i < 6; i++) {
				// 	this.heroSpecialEquipPartRedDot[index][i] = false;
				// }
			}, this)
			App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, false);
		}

		//检测是否可以添加新伙伴
		public checkNewPartner() {
			let info1 = App.ConfigManager.getPartnerConfigById(1); //第二个
			let info2 = App.ConfigManager.getPartnerConfigById(2); //第三个
			//第二个条件
			if (this.heroInfo.length == 1 && (App.RoleManager.roleInfo.lv >= info1.level || App.RoleManager.roleInfo.vipLv >= info1.vip)) {
				this.heroHeadFrame[0] = true;
			} else {
				this.heroHeadFrame[0] = false;
			}
			//第三个条件
			if (this.heroInfo.length < 3 && (App.RoleManager.roleInfo.turn >= info2.transmigration || App.RoleManager.roleInfo.vipLv >= info2.vip)) {
				this.heroHeadFrame[1] = true;
			} else {
				this.heroHeadFrame[1] = false;
			}
		}

		//一键换装
		public changeBestEquip(pos) {
			let equipDic = {};
			let equipMark = {}; //装备标记，标记哪几个装备已经被选中
			let value = this.heroInfo[pos];
			//开始检索
			for (let k = 1; k <= this.heroEquipPartRedDot[pos].length; k++) {
				if (!this.heroEquipPartRedDot[pos][k - 1]) { //跳过false的
					continue;
				}
				for (let i = 0; i < BackpackModel.getInstance().equipBackpack.length; i++) {
					if (equipMark[k] == i || (k == ConstEquipPart.HAND2 && equipMark[k - 1] == i) || (k == ConstEquipPart.RING2 && equipMark[k - 1] == i)) { //跳过被标记的
						continue;
					}
					let equipInfo = BackpackModel.getInstance().equipBackpack[i];
					let baseInfo = App.ConfigManager.equipConfig()[equipInfo.good_id];
					let subType = EquipModel.getInstance().getTypeByPos(k); //装备子类型
					if (baseInfo.limit_career != value.job || baseInfo.sub_type != subType || (baseInfo.sex != value.sex && baseInfo.sex != 0) || baseInfo.limit_lv > App.RoleManager.roleInfo.lv) { //性别等级部位都不对
						continue;
					}
					let myEquipInfo = this.getHeroEquipByPosPart(pos, k);
					let temp = undefined;
					if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
						temp = equipInfo;
					} else if (myEquipInfo) {
						if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
							temp = equipInfo;
						}
					}
					if (!equipDic[k]) {
						if (temp) {
							equipDic[k] = temp;
							equipMark[k] = i;
						}
					} else {
						if (temp && temp.equip.score > equipDic[k].equip.score) {
							equipDic[k] = temp;
							equipMark[k] = i;
						}
					}
				}
			}
			//pos5 pos7战力肯定大于等于 pos6 pos8
			if (equipDic[ConstEquipPart.HAND2]) { //第二件筛选
				let myEquipInfo = this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND1);
				if (myEquipInfo && equipDic[ConstEquipPart.HAND1] && myEquipInfo.equip.score > equipDic[ConstEquipPart.HAND1].equip.score) { //有第二件筛选出来的
					equipDic[ConstEquipPart.HAND2] = equipDic[ConstEquipPart.HAND1];
					equipDic[ConstEquipPart.HAND1] = undefined;
				}
			} else if (this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND2)) {  //有第二件装备中
				let myEquipInfo1 = this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND1);
				let myEquipInfo2 = this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND2);
				if (myEquipInfo1 && myEquipInfo2 && myEquipInfo1.equip.score > myEquipInfo2.equip.score) {
					equipDic[ConstEquipPart.HAND2] = equipDic[ConstEquipPart.HAND1];
					equipDic[ConstEquipPart.HAND1] = undefined;
				}
			} else if (this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND1)) {  //有第一件装备中
				if (!this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND2)) {
					equipDic[ConstEquipPart.HAND2] = equipDic[ConstEquipPart.HAND1];
					equipDic[ConstEquipPart.HAND1] = undefined;
				}
			}

			if (equipDic[ConstEquipPart.RING2]) { //第二件筛选
				let myEquipInfo = this.getHeroEquipByPosPart(pos, ConstEquipPart.RING1);
				if (myEquipInfo && equipDic[ConstEquipPart.RING1] && myEquipInfo.equip.score > equipDic[ConstEquipPart.RING1].equip.score) { //有第二件筛选出来的
					equipDic[ConstEquipPart.RING2] = equipDic[ConstEquipPart.RING1];
					equipDic[ConstEquipPart.RING1] = undefined;
				}
			} else if (this.getHeroEquipByPosPart(pos, ConstEquipPart.RING2)) {  //有第二件装备中
				let myEquipInfo1 = this.getHeroEquipByPosPart(pos, ConstEquipPart.RING1);
				let myEquipInfo2 = this.getHeroEquipByPosPart(pos, ConstEquipPart.RING2);
				if (myEquipInfo1 && myEquipInfo2 && myEquipInfo1.equip.score > myEquipInfo2.equip.score) {
					equipDic[ConstEquipPart.RING2] = equipDic[ConstEquipPart.RING1];
					equipDic[ConstEquipPart.RING1] = undefined;
				}
			} else if (this.getHeroEquipByPosPart(pos, ConstEquipPart.RING1)) {  //有第一件装备中
				if (!this.getHeroEquipByPosPart(pos, ConstEquipPart.RING2)) {
					equipDic[ConstEquipPart.RING2] = equipDic[ConstEquipPart.RING1];
					equipDic[ConstEquipPart.RING1] = undefined;
				}
			}

			App.logzrj("dict", equipDic);

			return equipDic;
		}

		//检测特殊装备是否可以升级 对应单个位置
		public checkSpecialEquipRedDot(part) {
			for (let i = 0; i < this.heroInfo.length; i++) {
				let specialInfo = this.heroInfo[i].getEquipSpecialByPart(part);
				if (specialInfo.id) { //已经激活
					let info = App.ConfigManager.getEquipSpecialById(specialInfo.id);  //特殊装备信息
					let canActive = false; //能否激活
					if (part == ConstSpecialEquipPart.PARA_RING || part == ConstSpecialEquipPart.BODY_RING) {  //戒指
						let ringInfo = App.ConfigManager.getEquipSpecialById(specialInfo.id);
						for (let i = 0; i < 4; i++) {
							let singleRingInfo = App.ConfigManager.getEquipSpecialFragmentById(ringInfo.ring_id[i]); //单个戒指部位信息
							if (specialInfo.getpieceByKey(ringInfo.ring_id[i])) { //激活了
								//
							} else if (BossModel.getInstance().level >= singleRingInfo.condition && ringInfo.next_id) {  //可激活
								canActive = true;
							}
						}
						if (canActive) {
							this.heroSpecialEquipPartRedDot[i][part - 1] = true;
						} else {
							this.heroSpecialEquipPartRedDot[i][part - 1] = false;
						}

					} else { //其他部位
						if (info.next_id) {
							let nextInfo = App.ConfigManager.getEquipSpecialById(info.next_id);
							let cost = nextInfo.item[0];  //消耗
							let itemInfo = (BackpackModel.getInstance() as BackpackModel).getItemByTypeIdUuid(cost[1], cost[0]);
							if (!itemInfo) {
								itemInfo = { num: 0 };
							}
							if (itemInfo.num >= cost[2]) { //足够
								this.heroSpecialEquipPartRedDot[i][part - 1] = true;
							} else {
								this.heroSpecialEquipPartRedDot[i][part - 1] = false;
							}
						} else {
							this.heroSpecialEquipPartRedDot[i][part - 1] = false;
						}

					}
				} else {  //未激活
					let info = App.ConfigManager.getEquipSpecialByPartLevel(part, 0);
					if (info.condition && typeof info.condition == "number") {
						if (info.condition_level) {
							if (BossModel.getInstance().level >= info.condition && App.RoleManager.roleInfo.lv >= info.condition_level) {
								this.heroSpecialEquipPartRedDot[i][part - 1] = true;
							} else {
								this.heroSpecialEquipPartRedDot[i][part - 1] = false;
							}
						} else {
							if (BossModel.getInstance().level >= info.condition) {
								this.heroSpecialEquipPartRedDot[i][part - 1] = true;
							} else {
								this.heroSpecialEquipPartRedDot[i][part - 1] = false;
							}
						}
					} else if (info.condition_level) {
						if (App.RoleManager.roleInfo.lv >= info.condition_level) {
							this.heroSpecialEquipPartRedDot[i][part - 1] = true;
						} else {
							this.heroSpecialEquipPartRedDot[i][part - 1] = false;
						}
					}
				}
			}
		}

		//检测特殊装备是否可以升级 所有
		public checkSpecialEquipRedDotAll() {
			//初始化
			if (!this.heroSpecialEquipPartRedDot[0]) {
				this.heroSpecialEquipPartRedDot = [
					[false, false, false, false, false, false],
					[false, false, false, false, false, false],
					[false, false, false, false, false, false]];
			}
			for (let i = 1; i <= 6; i++) {
				this.checkSpecialEquipRedDot(i);
			}
			for (let i = 0; i < this.heroSpecialEquipPartRedDot.length; i++) {
				let exist = false;
				for (let k in this.heroSpecialEquipPartRedDot[i]) {
					if (this.heroSpecialEquipPartRedDot[i][k]) {
						exist = true;
						break;
					}
				}
				if (exist) {
					this.heroHeadRedDot2[i] = true;
				} else {
					this.heroHeadRedDot2[i] = false;
				}
			}
			App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, false);
			for (let i = 0; i < this.heroHeadRedDot.length; i++) {
				if (this.heroHeadRedDot[i]) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
				}
			}

			for (let i = 0; i < this.heroHeadRedDot2.length; i++) {
				if (this.heroHeadRedDot2[i]) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
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