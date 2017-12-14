/**
 * Author: yangyipeng
 * Email： hersletter@qq.com
 * 签到数据层逻辑 2017/06/20.
 */
module game {
	export class SignModel extends BaseModel{
		/**
		 * 已经签到的日数
		 */
		private _signDays:number;
		/**
		 * 可以签到的日数
		 */
		private _canSignDays:number;
		/**
		 *补签的日数
		 */
		private _reSignDays:number;
		/**
		 * 额外奖励
		 */
		private _rewardStatus:Array<any>=[{day:1,state:2},{day:1,state:2},{day:1,state:2},{day:1,state:2},{day:1,state:2}];
		/**
		 * 第几天可以领取额外奖励
		 */
		private _hasData:boolean = false;
		public constructor() {
			super();
		}
		public get signDays():number
		{
			return this._signDays;
		}
		public get canSignDays():number
		{
			return this._canSignDays;
		}
		public get reSignDays():number
		{
			return this._reSignDays;
		}
		public get reward():Array<any>
		{
			return this._rewardStatus;
		}

		public get hasData():boolean
		{
			return this._hasData;
		}


		/**
		 * 拿到签到界面数据
		 * 
		 * // 额外奖励
		message pbSignExtReward{
			optional int32 day			= 1;	// 天数
			optional int32 state		= 2;	// 状态（0不能领， 1可领取 2不可领）
		}

		// 界面
		message pbSignInterface{
			optional int32	signed_num 			= 1;	// 已签到天数
			optional int32	can_sign_num 		= 2;	// 可签到天数
			optional int32	fix_num				= 3;	// 可补签天数
			repeated pbSignExtReward extreward_list = 4; // 额外奖励列表
			}			
		 */
		public setSignViewData(data):void
		{
			this._signDays = data.signed_num;
			this._canSignDays = data.can_sign_num;
			this._reSignDays = data.fix_num;
			this._rewardStatus = data.extreward_list;

			if(!this._hasData)
			{
				this._hasData = true;
			}
		}

		/**
		 * 是否有签到奖励
		 */
		public hasSignReward():boolean{
			for(var i:number = 0;i<this._rewardStatus.length;i++){
				var v:any = this._rewardStatus[i];
				if(v.state == 1){
					return true;
				}
			}
			if(this._canSignDays > 0){
				return true;
			}
			return false;
		}

		/**
		 * 签到返回
		 */
		// public setSign(data):void
		// {
		// 	if(data.result)
		// 	{
		// 		//成功
		// 		App.Socket.send(23001,{});
			
		// 	}else
		// 	{
		// 		//失败
		// 		console.log("失败")
		// 	}
		// }

		/**
		 * 补签返回
		 */
		public setResign(data):void
		{
			if(data.result)
			{
				
				//成功
				App.Socket.send(23001,{});
				// this._signDays++;
				// this._reSignDays--;
				// if(this._reSignDays<=0)
				// {
				// 	this._reSignDays = 0;
				// }
				// App.EventSystem.dispatchEvent(PanelNotify.RESIGN_DAYS_CHANGE);
			}else
			{
				//失败
				console.log("失败");
			}
		}
		/**
		 * 领取奖励返回
		 */
		public setRewardStatus(data):void
		{	
			if(data.result)
			{
				App.Socket.send(23001,{});
			}else{
				//失败
				console.log("失败");
			}
		
		}
		/**
		 * 签到物品刷新
		 */
		public signItemRefresh(data):void
		{

		}

		/**
		 * 签到或补签后改变额外奖励列表状态
		 */
		// private rewardStateChange():void
		// {	

		// 	App.EventSystem.dispatchEvent(PanelNotify.SIGN_REWARD_UPDATE);
		// }

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