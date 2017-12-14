/**
 * 商城数据模型
 * author : zrj
*/
module game {
	export class ShopModel extends BaseModel {
		public mysteryShop: Array<any>= [];  //神秘商城
		public limitShop: Array<any>= [];  //限购商城
		public normalShop: Array<any>= [];  //神秘商城

		public leftTime: number;     //神秘商店刷新倒计时
		public refreshNum: number;	       //神秘商店今天已刷新次数

		public limitNum: number = 1;     //限购商店当前批次
		public limitLeftTime: number;     //限购商店刷新倒计时
		public constructor() {
			super();
		}

		public updateMysterySopInfo(data) {
			this.mysteryShop = data.shop;
			this.leftTime = data.left_time;
			this.refreshNum = data.refresh_num;
		}

		public updateLimitSopInfo(data) {
			this.limitShop = data.shop_buy;
			this.limitLeftTime = data.left_time;
			this.limitNum = data.num;
		}

		public getLimitInfoById(id) {
			for (let i=0;i<this.limitShop.length;i++) {
				if (this.limitShop[i].id == id) {
					return this.limitShop[i];
				}
			}
		}
		//删除神秘商店已购买
		public deleteMysteryShopInfo(data) {
			for(let key=0;key<this.mysteryShop.length;key++) {
				let info = this.mysteryShop[key];
				if(this.mysteryShop[key].id == data.id) {
					this.mysteryShop.splice(key,1);
					break;
				}
			}
		}

		//更新限购商店已购买
		public handleLimitShopInfo(data) {
			let exist = false;
			for(let key=0;key<this.limitShop.length;key++) {
				let info = this.limitShop[key];
				if(this.limitShop[key].id == data.id) {
					exist = true;
					this.limitShop[key].limit -= data.num;
					break;
				}
			}
			if (!exist) {
				this.limitShop.push({id:data.id, limit:data.num});
			}
		}

		// public updateNormalSopInfo(data) {

		// }


		public clear() {
			super.clear();
		}

		public destroy() {
			super.destroy();
		}
	}
}