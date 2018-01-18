/**
 * Author: YANGYIPENG          （必须加上，知道是谁做的）
 * 投资模块模型 2017/06/20.
 */
module game {
	export class InvestModel extends BaseModel{
		private _isBuy:boolean = false;
		private _leftTime:number;
		private _listData:eui.ArrayCollection;
		public constructor() {
			super();
		}

		public get listData():eui.ArrayCollection
		{
			return this._listData;
		}

		public get isBuy():boolean
		{
			return this._isBuy;
		}
		
		public get leftTime():number
		{
			return this._leftTime;
		}

		public investDataUpdate(data):void
		{
			// message pbInvestment{
			// optional int32 buy  = 1;               //是否已购买1是0否
			// optional int32 left_time  = 2;         //剩余时间(秒数)
			// repeated pbItem items = 3;             //已领取列表
			this._isBuy =data.buy;
			this._leftTime = new Date().getSeconds() + data.left_time;
			var investList:Array<any> = [];
			(data.items as Array<any>).forEach(function(item, index) {
				investList.push(item.id)
			})
			var investConfig = ConfigManager.getInstance().getInvestInfo();
			var _arr:Array<InvestVo> = [];
			for(var key in investConfig)
			{	

				if(investList.indexOf(Number(key)) != -1)
				{
					var investVo:InvestVo = new InvestVo(investConfig[key],true);//true已经领取
					_arr.push(investVo);
				}else{
					var investVo:InvestVo = new InvestVo(investConfig[key],false);//false还没有领取
					_arr.push(investVo);
				}
			
			}
			this._listData = new eui.ArrayCollection(_arr);
		
		}	
		
		public investBuy(data):void
		{
			if(data.result)
			{
				this._isBuy = true;
			}
		}

		public investReward(id):void
		{
			var investList:Array<InvestVo> = this._listData.source;

			for(var i:number=0;i<investList.length;i++)
			{
				if(investList[i].id == id)
				{
					investList[i].get = true;
					this._listData.refresh();
					break;
				}
				// this._listData.refresh();
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
}