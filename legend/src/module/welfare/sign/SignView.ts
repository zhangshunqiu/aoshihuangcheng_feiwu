/**
* Author: yangyipeng
* Email： hersletter@qq.com
* 签到UI界面逻辑 2017/06/20.
*/
module game {
	export class SignView extends BaseChildView{

		public gp_reward:eui.Group;
		public progressBar:eui.ProgressBar;
		public list_signItem:eui.List;

		private _event1:number =0;
		public constructor(skinName:string) {
			super("SignViewSkin");
		}

		protected childrenCreated() {
			super.childrenCreated();
			this.initView();
		}

		/**
		 * 打开窗口
		 */
		public open(openParam: any = null): void {
			super.open(openParam);
			
			if(this._event1 == 0)
			{
				App.EventSystem.addEventListener(PanelNotify.SIGN_INFO_UPDATE,this.handlerGetSigns,this);
			}	
			//请求签到数据
			if(!(SignModel.getInstance() as SignModel).hasData){
				App.Socket.send(23001,{});
			}else{
				this.signItemsUpdate();
				this.listRewardUpdate();
				this.progressUpdate();
			}
			this.list_signItem.itemRenderer = SignItem;
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
			super.clear();
			if(this._event1 != 0)
			{
				App.EventSystem.removeEventListener(PanelNotify.SIGN_INFO_UPDATE);
			}
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
			
		}

		
		/**
		 * 创建额外奖励列表
		 */
		private initView():void
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
			this.list_signItem.dataProvider = (SignModel.getInstance() as SignModel).signItemArr;
		}

		/**
		 * 额外奖励数据更新
		 */
		private listRewardUpdate():void
		{
			var rewardList = (SignModel.getInstance() as SignModel).reward;
			for(var i:number=0;i<rewardList.length;i++)
			{	
				var totalLen:number = this.gp_reward.width;
				var days:number = rewardList[i]["day"];
				var signReward:SignReward =  this.gp_reward.getChildAt(i) as SignReward;
				signReward.x = (days/30) * totalLen -120; 
				signReward.rewardData = rewardList[i];
				signReward.showRewardUi();
			}			
		}

		/**
		 * 更新进度条
		 */
		private progressUpdate():void
		{	
			var signDays:number = (SignModel.getInstance() as SignModel).signDays;
			var totalDays:number = 30;
			this.progressBar.value = Math.floor((signDays/totalDays) * 100);
		}

		
	}
}