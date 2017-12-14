/**
 * module : 装备模块数据模型
 * author : zrj
*/
module game{
	export class EquipModel extends BaseModel{

		public equipInfo : Array<any> = [];

		public constructor(){
			super();
			this.equipInfo = [];
		}

		/**
		 * 根据部位获得装备类型
		*/
		public getTypeByPos(pos) {
			let type = 1; //装备类型
			if (pos <= 4) {
				type = pos;
			} else if (pos == 5 || pos == 6) {
				type = 5;
			} else if (pos == 7 || pos == 8) {
				type = 6;
			} else if (pos > 8) {
				type = pos - 2;
			}
			return type;
		}
		
		/**
		 * 根据装备类型获得部位
		*/
		public getPosByType(type) {
			let pos = undefined; //装备位置
			if (type <= 4) {
				pos = type;
			} else if (type == 5 ) {
				pos = [5,6];
			} else if (type == 6) {
				pos = [7,8];
			} else if (type > 6) {
				pos = type + 2;
			}
			return pos;
		}


		public attributeFilter(attrInfo) {
			let attr = {};
			for(let key in attrInfo) {
				if (key !="id" && key !="name" && key !="att_type" && key !="level" && attrInfo[key] !=0) {
					attr[key] = attrInfo[key];
				}
			}
			return attr;
		}

		public getEquipInfoById(id) {
			let _table = App.ConfigManager.equipConfig();
			for(let key in _table) {
				let info = _table[key];
				if (info.id == id) {
					return info;
				}
			}
			return null;
		}

		public getEquipArrayByType(type) {
			let _table = App.ConfigManager.equipConfig();
			let arr = [];
			for(let key in _table) {
				let info = _table[key];
				if (info.sub_type == type) {
					arr.push(info);
				}
			}
			return arr;
		}

		public sortEquipByCap(array:Array<EquipVO>) {
			array.sort((a,b)=>{
				if (a.score >b.score){
					return -1;
				}
				return 1;
			})
		}

		//检测更好的装备
		public checkBetterEquip(pos,part,equipInfo :EquipVO) {
			let heroModel = HeroModel.getInstance() as HeroModel;
			let myEquipInfo = heroModel.getHeroEquipByPosPart(pos,part);
			let baseInfo = App.ConfigManager.equipConfig[equipInfo.good_id];
			if (!myEquipInfo && App.RoleManager.roleInfo.lv >=  baseInfo.level && baseInfo.sex == heroModel.heroInfo[pos].sex) {
				return true;
			} else {
				if (equipInfo.score > myEquipInfo.score && App.RoleManager.roleInfo.lv >=  baseInfo.level && baseInfo.sex == heroModel.heroInfo[pos].sex) {
					return true;
				} else {
					return false;
				}
			}
		}

		public clear(){
			super.clear();
		}

		public destroy(){
			super.destroy();
		}
	}
}