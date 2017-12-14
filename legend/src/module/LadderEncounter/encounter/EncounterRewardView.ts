/**
 * Author: yangyipeng
 * Email： hersletter@qq.com
 * 遭遇战每日奖励界面 2017/06/20.
 */
module game {
	export class EncounterRewardView extends eui.Component{
		
		public scroller:eui.Scroller;
		public list_reward:eui.List;
		public lb_myRank:eui.Label;
		public img_close:eui.Image;


		public constructor() {
			super();
			this.skinName = EncounterRewardViewSkin;
		} 

		protected childrenCreated():void
		{
			super.childrenCreated();
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				this.closeWin();
			},this);
			this.list_reward.itemRenderer = EncounterRewardListItem;
			this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.showUi,this);

			this.scroller.verticalScrollBar.visible = false;
			this.scroller.verticalScrollBar.autoVisibility = false;
			
		}

		private showUi():void
		{
			var rewardConfigData = ConfigManager.getInstance().getEncounterRankReward();
			var arr = [];
			for(var key in rewardConfigData)
			{
				arr.push(rewardConfigData[key]);
			}
			var dataArr:eui.ArrayCollection = new eui.ArrayCollection(arr);
			this.list_reward.dataProvider = dataArr;

			this.lb_myRank.textFlow = [
				{text:"我的当前排名: ",style:{textColor:0xf875000}},
				{text:(EncounterModel.getInstance() as EncounterModel).rank + "",style:{textColor:0xffea00}}
			]
		}


		public closeWin(): void {
			PopUpManager.removePopUp(this);
	    }

      
		
	}
}