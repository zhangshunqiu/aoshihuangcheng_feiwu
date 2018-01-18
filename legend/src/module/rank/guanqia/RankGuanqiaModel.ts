/**
 * Author: yangyipeng                               
 * 关卡排行榜模块模型 
 */
module game {
	export class RankGuanqiaModel extends BaseModel{
		private _myRank:number;
		private _rankListArr:eui.ArrayCollection;
		private _rankArr:Array<GuanqiaListVo>;

		public get rankArr() {
			return this._rankArr;
		}
		public get myRank() {
			return this._myRank;
		}
		public get rankListArr() {
			return this._rankListArr;
		}

		public constructor() {
			super();
		}

		public ReceiveGuanqiaData(data):void {
			//我的排名
			this._myRank = data.my_rank;

			//关卡列表
			var arr = [];
			var list:Array<any> = data.list;
			for(var i:number =0 ;i<list.length;i++) {
				var guanqiaListVo:GuanqiaListVo = new GuanqiaListVo();
				guanqiaListVo.combat = this.fixNum(list[i].combat); //进位
				guanqiaListVo.name = list[i].name;
				guanqiaListVo.guanqia = list[i].layer;
				guanqiaListVo.rank = list[i].rank;
				guanqiaListVo.month_card = list[i].month_card;
				guanqiaListVo.vipLv = list[i].vip;
				arr.push(guanqiaListVo);
			}
			this._rankListArr = new eui.ArrayCollection(arr);
			this._rankArr = arr;
		}

		private fixNum(num:number):string {
			if(num/1000000 >= 1) {
				var _num:number = num/10000;
				return _num.toFixed(1) + "万";
			}else {
				return num + "";
			}
		}

		/**
		 * 清理
		 */
		public clear() {
			super.clear();
		}

		/**
		 * 销毁
		 */
		public destroy() {
			super.destroy();
			//销毁处理
		}
	}

	export class GuanqiaListVo{
		public rank:number;
		public name:string;
		public combat:string;
		public guanqia:number;
		public vipLv:number;
		public month_card:boolean;
		constructor() {

		}
	}
}