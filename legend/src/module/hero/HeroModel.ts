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

		public heroHeadRedDot = [false, false, false]; //英雄头部红点
		public heroEquipPartRedDot = [
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false]]; //英雄部位红点

		public isEquipPuton : boolean = false;  //穿戴装备的阈值，每次穿戴完成为true，在英雄信息里置为false
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
						this.heroEquipPartRedDot[k][pos-1] = false;
					} else { //对应有两个部位的
						pos.forEach((v, idx, a) => {
							this.heroEquipPartRedDot[k][v-1] = false;
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
						if (!myEquipInfo && App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && (baseInfo.sex == value.sex|| baseInfo.sex == 0) ) {
							this.heroHeadRedDot[index] = true;
							this.heroEquipPartRedDot[index][pos - 1] = true;
						} else if(myEquipInfo){
							if (equipInfo.equip.score > myEquipInfo.equip.score && App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && (baseInfo.sex == value.sex|| baseInfo.sex == 0) ) {
								this.heroHeadRedDot[index] = true;
								this.heroEquipPartRedDot[index][pos - 1] = true;
							} else {
							}
						}
					} else { //对应有两个部位的
						pos.forEach((v, idx, a) => {
							let myEquipInfo = this.getHeroEquipByPosPart(index, v);
							if (!myEquipInfo && App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && (baseInfo.sex == value.sex|| baseInfo.sex == 0) ) {
								this.heroHeadRedDot[index] = true;
								this.heroEquipPartRedDot[index][v - 1] = true;
							} else if(myEquipInfo){
								if (equipInfo.equip.score > myEquipInfo.equip.score && App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && (baseInfo.sex == value.sex|| baseInfo.sex == 0) ) {
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
						if (!myEquipInfo && App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && (baseInfo.sex == value.sex|| baseInfo.sex == 0) ) {
							// return true;
							this.heroHeadRedDot[index] = true;
							this.heroEquipPartRedDot[index][pos - 1] = true;
						} else if(myEquipInfo) {
							if (equipInfo.equip.score > myEquipInfo.equip.score && App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && (baseInfo.sex == value.sex|| baseInfo.sex == 0) ) {
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
							if (!myEquipInfo && App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && (baseInfo.sex == value.sex|| baseInfo.sex == 0) ) {
								// return true;
								this.heroHeadRedDot[index] = true;
								this.heroEquipPartRedDot[index][v - 1] = true;
							} else if(myEquipInfo){
								if (equipInfo.equip.score > myEquipInfo.equip.score && App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && (baseInfo.sex == value.sex|| baseInfo.sex == 0) ) {
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
		}

		//重置红点
		public resetRedDot() {
			this.heroInfo.forEach((value, index, array) => {
				this.heroHeadRedDot[index] = false;
				for (let i = 0; i < 10; i++) {
					this.heroEquipPartRedDot[index][i] = false;
				}
			}, this)
			App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, false);
		}

		//检测是否可以添加新伙伴
		public checkNewPartner() {
			
		}

		public clear() {
			super.clear();
		}

		public destroy() {
			super.destroy();
		}
	}
}