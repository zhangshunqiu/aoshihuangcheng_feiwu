/**
 * Author: yangyipeng
 * Email： 506977655@qq.com
 * 签到控制器 2017/11/20.
 */
module game {
	export class SignController extends BaseController{
		
		private _signModel:SignModel;
		public constructor() {
			super();
			this.initProtocol();
			this.initEventListener();
			this._signModel = SignModel.getInstance();
  		}

		/**
		 * 初始化事件监听                                           
		 */
		protected initEventListener() {
			super.initEventListener();
		
		}

		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			super.initProtocol();
			this.registerProtocal(23001, this.signViewDataBack, this);
			this.registerProtocal(23002, this.signReturn, this);
			this.registerProtocal(23003, this.resignReturn, this);
			this.registerProtocal(23004, this.rewardReturn, this);
			this.registerProtocal(23005, this.rewardRefresh, this);
			//协议发送示范
			//this.sendProtocal(1000,{})
		}

		/**
		 * 请求签到界面数据
		 */
		private signViewDataBack(data):void
		{
			this._signModel.setSignViewData(data);
			// this._signModel.rewardDayInit();
			App.EventSystem.dispatchEvent(PanelNotify.SIGN_INFO_UPDATE);
			this.updateSignRewardTips();
		}

		/**
		 * 更新签到奖励提示
		 */
		private updateSignRewardTips():void
		{	
			if(this._signModel.hasSignReward()){
				App.BtnTipManager.setTypeValue(ConstBtnTipType.WELFARE_SIGN,true);
			}else{
				App.BtnTipManager.setTypeValue(ConstBtnTipType.WELFARE_SIGN,false);
			}
		}

		/**
		 * 签到返回
		 */
		private signReturn(data):void
		{	
			if(data.result)
			{
				//成功
				App.Socket.send(23001,{});
			
			}else
			{
				//失败
				console.log("失败")
			}
			// this._signModel.setSign(data);
		}

		/**
		 * 补签返回
		 */
		private resignReturn(data):void
		{	
			if(data.result)
			{
				//成功
				App.Socket.send(23001,{});
			
			}else
			{
				//失败
				console.log("失败")
			}
			// this._signModel.setResign(data);
		}

		/**
		 * 领取额外奖励返回
		 */
		private rewardReturn(data):void
		{	
			if(data.result)
			{
				App.Socket.send(23001,{});
			}else{
				//失败
				console.log("失败");
			}
			//  this._signModel.setRewardStatus(data);
		}

		/**
		 * 签到物品刷新返回
		 */
		private rewardRefresh(data):void
		{
			// this._signModel.signItemRefresh(data);
			App.Socket.send(23001,{});
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