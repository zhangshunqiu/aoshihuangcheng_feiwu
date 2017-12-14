/**
* Author: yangyipeng
* Email： hersletter@qq.com
* 签到UI界面逻辑 2017/06/20.
*/
module game {
	export class SignView extends eui.Component{

		private gp_items:eui.Group;
		private gp_reward:eui.Group;
		private progressBar:eui.ProgressBar;

		private _event1:number =0;
		private _event2:number =0;
		private _event3:number =0;
		private _event4:number =0;
		

		public constructor() {
			super();
			this.skinName = SignViewSkin;

			this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.CreatComplete,this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeSelf,this);
			if(this._event1 == 0)
			{
				App.EventSystem.addEventListener(PanelNotify.SIGN_INFO_UPDATE,this.handlerGetSigns,this);
			}	
			if(this._event2 == 0)
			{
				App.EventSystem.addEventListener(PanelNotify.SIGN_DAYS_CHANGE,this.signItemsUpdate,this);
			}
			if(this._event3 ==0)
			{
				App.EventSystem.addEventListener(PanelNotify.RESIGN_DAYS_CHANGE,this.signItemsUpdate,this);
			}
			if(this._event4 == 0)
			{
				App.EventSystem.addEventListener(PanelNotify.SIGN_REWARD_UPDATE,this.listRewardUpdate,this);
			}
			
			
		}

		protected childrenCreated():void
		{
			super.childrenCreated();
		}

		private CreatComplete():void
		{	
			SignManager.getInstance().itemGroup = this.gp_items;
			this.createSignItems();
			this.createListReward();
			//请求签到数据
			if(!(SignModel.getInstance() as SignModel).hasData){
				App.Socket.send(23001,{});
			}else{
				this.signItemsUpdate();
				this.listRewardUpdate();
				this.progressUpdate();
			}
		
		}
		
		/**
		 * 创建签到物品对象
		 */
		private createSignItems():void
		{	
			for(var i:number=1;i<=30;i++){
				var signItemConfig = ConfigManager.getInstance().getSignInfoById(i);
				var signItem:SignItem = new SignItem(signItemConfig);
				this.gp_items.addChild(signItem);
			}
			
		}
			/**
		 * 创建额外奖励列表
		 */
		private createListReward():void
		{	
			// var rewardList = (SignModel.getInstance() as SignModel).reward;
			var signConfig = ConfigManager.getInstance().getSignInfo();
			var signRewardId:number=0;
			for(var key in signConfig)
			{
				if(signConfig[key]["extra"].length>0)
				{	
					// var signReward = signConfig[key]["extra"][0];
					var itemData = signConfig[key];
					this.gp_reward.addChild(new SignReward(itemData,signRewardId));	
					signRewardId++;		
				}
			}
		
		}

		/**
		 * 签到列表数据返回
		 */
		private handlerGetSigns():void
		{
			this.signItemsUpdate();
			this.listRewardUpdate();
			this.progressUpdate();
		}

		/**
		 * SignItem数据更新
		 */
		private signItemsUpdate():void
		{	
			
			var signDays:number = (SignModel.getInstance() as SignModel).signDays;
			var canSignDays:number = (SignModel.getInstance() as SignModel).canSignDays;
			var reSignDays:number = (SignModel.getInstance() as SignModel).reSignDays;
			var leftDays:number = (30 - signDays - canSignDays - reSignDays);
			var itemNum:number = 0;
		
			
			for(var i:number=0;i<signDays;i++){
		
				var signItem:SignItem = this.gp_items.getChildAt(itemNum) as SignItem;
				signItem.status = ConstSignItemStatus.hasSigned;
				signItem.showUi();
				itemNum++;
			}
			for(var j:number=0;j<canSignDays;j++)
			{	
				var signItem:SignItem = this.gp_items.getChildAt(itemNum) as SignItem;
				signItem.status = ConstSignItemStatus.canSign;
				signItem.showUi();
				itemNum++;
			}
			for(var k:number=0;k<reSignDays;k++)
			{
				var signItem:SignItem = this.gp_items.getChildAt(itemNum) as SignItem;
				signItem.status = ConstSignItemStatus.reSign;
				signItem.showUi();
				itemNum++;
			}
			for(var m:number=0;m<leftDays;m++)
			{
				var signItem:SignItem = this.gp_items.getChildAt(itemNum) as SignItem;
				signItem.status = ConstSignItemStatus.notSign;
				signItem.showUi();
				itemNum++;
			}
			this.listRewardUpdate();
			
		}

	

		/**
		 * 额外奖励数据更新
		 */
		private listRewardUpdate():void
		{
			var rewardList = (SignModel.getInstance() as SignModel).reward;
			for(var i:number=0;i<rewardList.length;i++)
			{
				var signReward:SignReward =  this.gp_reward.getChildAt(i) as SignReward;
				signReward.rewardData = rewardList[i];
				signReward.showRewardUi();
			}			
		}


		/**
		 * 更新进度条
		 */
		private progressUpdate():void
		{	
			// var rewardList:Array<any> = (SignModel.getInstance() as SignModel).reward;
			// var totalLen:number = rewardList.length;
			// var len:number=0;
			// for(var i:number=0;i<totalLen;i++)
			// {
			// 	if(rewardList[i].state == 2)
			// 	{
			// 		len++;
			// 	}
			// }
			// this.progressBar.value = ((len -1)/(totalLen-1)) * 100;
			var signDays:number = (SignModel.getInstance() as SignModel).signDays;
			var totalDays:number = 30;
			this.progressBar.value = (signDays/totalDays) * 100;
			
		}

		private removeSelf():void
		{
			this.removeEventListener(eui.UIEvent.CREATION_COMPLETE,this.CreatComplete,this);
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeSelf,this);
			if(this._event1 != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.SIGN_INFO_UPDATE);
			}
			if(this._event2 != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.SIGN_DAYS_CHANGE);
			}
			if(this._event3 != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.RESIGN_DAYS_CHANGE);
			}
			if(this._event4 != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.SIGN_REWARD_UPDATE);
			}

			SignManager.getInstance().clear();
		}

		/**
		 * 签到回调
		 */
		// private handlerSign(data):void
		// {	
		// 	//判断一下窗口是否在打开，没有就返回

		// 	var index = data -1;
		// 	var signItem:SignItem = this.gp_items.getChildAt(index) as SignItem;
		// 	signItem.status = SignItemStatus.hasSigned;
		// 	signItem.showUi();
		// } 

		/**
		 * 补签回调
		 */
		// private handlerResign(data):void
		// {	
		// 	//判断一下窗口是否在打开.没有就返回 

		// 	var index = data -1;
		// 	var signItem:SignItem = this.gp_items.getChildAt(index) as SignItem;
		// 	signItem.status = SignItemStatus.hasSigned;
		// 	signItem.showUi();
		// 	//下一个signItem显示补签图标
		// 	var nextSignItem:SignItem = this.gp_items.getChildAt(data+1) as SignItem;
		// 	if(nextSignItem)
		// 	{
		// 		nextSignItem.showUi();
		// 	}
		// }

		/**
		 * 领取额外奖励回调
		 */
		// private handlerReward():void
		// {
		// 	var len:number = this.gp_reward.$children.length;
		// 	for(var i:number=0;i<len;i++)
		// 	{
		// 		var signReward:SignReward = this.gp_reward.getChildAt(i) as SignReward;
		// 		signReward.showRewardUi();
			
		// 	}
		// 	//还有进度条的逻辑要补

		// }

		
	}
}