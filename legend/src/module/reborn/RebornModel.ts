/**
 * 转生模块数据模型
 * author : zrj
*/
module game{
	export class RebornModel extends BaseModel{
		public exchangeInfo : any;  //格式：[{type:,used_times:}...]
		public constructor(){
			super();
		}

		public getExchangeInfoByType(type) {
			for (let k in this.exchangeInfo) {
				if (this.exchangeInfo[k].type == type) {
					return this.exchangeInfo[k];
				}
			}
		}


		//能否重生
		public checkCanReborn() {
			let nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
			if (nextInfo) {
				if (App.RoleManager.roleInfo.lifeExp >= nextInfo.need_num) {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_UP,true);
				} else {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_UP,false);
				}
			} else {
				App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_UP,false);
			}

			if (!this.checkCanExchangeLevel() && !this.checkCanExchangeExpert() && !this.checkCanExchangeSuper()) {
				App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_CULTURE,false);
			} else {
				if (nextInfo){
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_CULTURE,true);
				} else {
					App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_REBORN_CULTURE,false);
				}
			}

		}

		//降低等级
		public checkCanExchangeLevel() {
			let nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
			if (!nextInfo) {
				return false;
			}
			if(App.ConfigManager.getConstConfigByType("TRANSMI_CONVERT_NUM").value > this.getExchangeInfoByType(ConstRebornExchangeType.LEVEL).used_times){
				if (App.RoleManager.roleInfo.lv > 80) {
					return true;
				}
			}
			return false;
		}

		//高级转生丹次数
		public checkCanExchangeExpert() {
			let nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
			if (!nextInfo) {
				return false;
			}
			if(App.ConfigManager.getConstConfigByType("TRANSMI_EXPERP_NUM").value > this.getExchangeInfoByType(ConstRebornExchangeType.REDUCE).used_times){
                let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 19);
				if (itemInfo) {
					return true;
				}
			}
			return false;
		}

		//超级转生丹次数
		public checkCanExchangeSuper() {
			let nextInfo = App.ConfigManager.getRebornAttrInfoById(RoleManager.getInstance().roleInfo.turn + 1);
			if (!nextInfo) {
				return false;
			}
			if(App.ConfigManager.getConstConfigByType("TRANSMI_SUPER_NUM").value > this.getExchangeInfoByType(ConstRebornExchangeType.SUPER).used_times){
				let itemInfo = BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 20);
				if (itemInfo) {
					return true;
				}
			}
			return false;
		}

		public clear(){
			super.clear();
		}

		public destroy(){
			super.destroy();
		}
	}
}