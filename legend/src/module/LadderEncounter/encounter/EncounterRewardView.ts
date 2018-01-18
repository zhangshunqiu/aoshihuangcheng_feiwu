/**
 * Author: yangyipeng
 * Email： hersletter@qq.com
 * 遭遇战每日奖励界面 2017/06/20.
 */
module game {
	export class EncounterRewardView extends BaseView{
		
		public scroller:eui.Scroller;
		public list_reward:eui.List;
		public lb_myRank:eui.Label;
		public img_close:eui.Image;


		public constructor(vo) {
			super(vo);
			// this.skinName = EncounterRewardViewSkin;
		} 

		protected childrenCreated():void
		{
			super.childrenCreated();
			this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				this.closeWin();
			},this);
			this.list_reward.itemRenderer = EncounterRewardListItem;

			this.scroller.verticalScrollBar.visible = false;
			this.scroller.verticalScrollBar.autoVisibility = false;
			
		}
		/**
		 * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			this.showUi();
		}

		/**
		 * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
		 */
		public clear(data: any = null): void {
			super.clear(data);
		}

		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		
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
				{text:"我的当前排名: ",style:{textColor:0xf87500}},
				{text:(EncounterModel.getInstance() as EncounterModel).rank + "",style:{textColor:0xffea00}}
			]
		}


		public closeWin(): void {
			// PopUpManager.removePopUp(this);
			WinManager.getInstance().closePopWin(WinName.POP_Encounter_Reward);
	    }

      
		
	}
}