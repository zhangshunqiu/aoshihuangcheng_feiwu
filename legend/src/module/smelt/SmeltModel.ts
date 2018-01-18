/**
 * 熔炼数据模型
 * author : zrj
*/
module game {
	export class SmeltModel extends BaseModel {
		public _dataArray: Array<EquipVO> = []; //选中的熔炼装备
		public curSmeltArr: any[] = []; //当前要熔炼的装备
		public selectedQuality: any = {}; //熔炼选中的品质
		public constructor() {
			super();
		}

		public filterEquip() {
			// let equipBackpack = BackpackModel.getInstance().equipBackpack;
			let temp = [];
			for (let i = 0; i < this._dataArray.length; i++) {
				let info = App.ConfigManager.equipConfig()[this._dataArray[i].good_id];
				if (this.selectedQuality[info.quality]) {
					temp.push(this._dataArray[i]);
				}
			}
			this._dataArray = temp;
		}

		public FilterEquipByScore() {
			this._dataArray = [];
			let equipModel = EquipModel.getInstance() as EquipModel;
			let result = [];
			let temp = { 1: {}, 2: {}, 3: {}, 4: {} }; //保存未穿戴装备最强的
			let heroInfo: Array<HeroVO> = HeroModel.getInstance().heroInfo;
			BackpackModel.getInstance().equipBackpack.forEach((value, index, array) => {  //背包里的装备
				let exist = false; //是否有这个职业
				let equipInfo = App.ConfigManager.equipConfig()[value.good_id];
				let mypos = equipModel.getPosByType(equipInfo.sub_type); //拿到对应part
				let hadSelect = false;  //已经选了这个装备

				for (let key in result) {
					if (result[key].id == value.id) {
						hadSelect = true;
					}
				}
				//还没被选择
				if (!hadSelect) {
					let changeResult = function (career, pos) {
						if (career == 0) {//通用
							return;
						}
						if (!temp[career][pos]) { //未缓存
							if (pos == ConstEquipPart.HAND2 || pos == ConstEquipPart.RING2) { //第二个手镯和戒指
								if (temp[career][pos - 1] && temp[career][pos - 1].id != value.id) { //和第一个不同
									temp[career][pos] = value;
								} else if (!temp[career][pos - 1]) { //第一个是空的
									temp[career][pos] = value;
								}
							} else {
								temp[career][pos] = value;
							}

						} else if (temp[career][pos].score < value.score) { //有更好的
							if (pos == ConstEquipPart.HAND1 || pos == ConstEquipPart.RING1) { //第一个手镯和戒指
								if (!temp[career][pos + 1]) {
									temp[career][pos + 1] = value;
								} else {
									if (temp[career][pos + 1].score > temp[career][pos].score) {
										result.push(temp[career][pos]);
										temp[career][pos] = value;
									} else {
										result.push(temp[career][pos + 1]);
										temp[career][pos + 1] = temp[career][pos];
										temp[career][pos] = value;
									}

								}

							} else if (pos == ConstEquipPart.HAND2 || pos == ConstEquipPart.RING2) { //无需处理了

							} else {
								result.push(temp[career][pos]);
								temp[career][pos] = value;
							}
						} else if (pos == ConstEquipPart.HAND1 || pos == ConstEquipPart.RING1) {
							if (!temp[career][pos + 1]) {
								temp[career][pos + 1] = value;
							}
						} else {
							if (temp[career][pos].id != value.id) {
								result.push(value);
							}

						}
					}

					heroInfo.forEach((value2, index2, array2) => {  //遍历英雄
						if (value2.job == equipInfo.limit_career) { //职业对了
							exist = true;

							let doFilte = function (pos) {  //筛选
								let part = value2.equipExist(pos);
								if (part >= 0) {  //装备了装备
									if (value2.equip_info[part].equip.score < value.score) { //有更好的
										changeResult(value2.job, pos);
									} else {
										result.push(value);
									}
								} else {
									changeResult(value2.job, pos)
								}
							}
							doFilte.bind(this);

							if (equipInfo.sex == 0 || value2.sex == equipInfo.sex) {
								if (typeof mypos == "number") {
									doFilte(mypos)
								} else {
									mypos.forEach((v, i, a) => {
										doFilte(v);
									}, this);
								}
							} else {
								result.push(value);
							}

						}
					}, this)

					//不存在这个职业
					if (!exist) {
						if (typeof mypos == "number") {
							changeResult(equipInfo.limit_career, mypos);
						} else {
							mypos.forEach((v, i, a) => {
								changeResult(equipInfo.limit_career, v);
							}, this);
						}
					}
				}


			}, this)

			let tempResult = []; 
			let mark = {}
			for (let i = 0; i < result.length; i++) {
				if (mark[result[i].id]) {

				} else {
					tempResult.push(result[i]);
					mark[result[i].id] = true;
				}
			}
			result = tempResult;

			let finalResult = []; //最后
			for (let i = 0; i < result.length; i++) {
				let equipInfo = App.ConfigManager.equipConfig()[result[i].good_id];
				let pos = equipModel.getPosByType(equipInfo.sub_type);
				if (typeof pos == "number") {
					if (temp[equipInfo.limit_career][pos] && temp[equipInfo.limit_career][pos].id == result[i].id) {
						// result.splice(i, 1);
					} else {
						finalResult.push(result[i]);
					}
				} else {
					let exist = false;
					pos.forEach((v, index, a) => {
						if (temp[equipInfo.limit_career][v] && temp[equipInfo.limit_career][v].id == result[i].id) {
							// result.splice(i, 1);
							exist = true;
						} else {
						}
					}, this);
					if (!exist) {
						finalResult.push(result[i]);
					}
				}

			}

			this._dataArray = finalResult;
		}

		public sortByQuality() {
			let whiteArr: any[] = [];
			let greenArr: any[] = [];
			let blueArr: any[] = [];
			let pupleArr: any[] = [];
			for(let i:number=0; i<this._dataArray.length; i++) {
				let equipInfo = App.ConfigManager.equipConfig()[this._dataArray[i].good_id];
				switch(equipInfo.quality) {
					case ConstQuality.WHITE:
						whiteArr.push(this._dataArray[i]);
						break;

					case ConstQuality.GREEN:
						greenArr.push(this._dataArray[i]);
						break;

					case ConstQuality.BLUE:
						blueArr.push(this._dataArray[i]);
						break;

					case ConstQuality.PUPLE:
						pupleArr.push(this._dataArray[i]);
						break;

					//不用default
				}
			}
			this._dataArray = whiteArr.concat(greenArr, blueArr, pupleArr);
		}

		public clear() {
			super.clear();
		}

		public destroy() {
			super.destroy();
		}
	}
}