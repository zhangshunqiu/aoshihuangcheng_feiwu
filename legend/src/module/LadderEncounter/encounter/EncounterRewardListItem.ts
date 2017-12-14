module game {
	export class EncounterRewardListItem extends eui.ItemRenderer{

		public lb_rank:eui.Label;
		public baseItem0:customui.BaseItem;
		public baseItem1:customui.BaseItem;

		public constructor() {
			super();
			this.skinName = "EncounterRewardListItemSkin";
		}
		protected dataChanged():void
		{
			super.dataChanged();
			var rankUp:number = this.data.rank_up;
			var rankDown:number = this.data.rank_down;
			var rewardArr:Array<any> = this.data.reward;

			if(rankUp == rankDown)
			{
				this.lb_rank.text = "第" + rankUp + "名";
			}else
			{
				this.lb_rank.text = "第" + rankUp + "名" +"~" + "第" +  rankDown +"名";
			}
			this.baseItem0.updateBaseItem(rewardArr[0][0],rewardArr[0][1],rewardArr[0][2]);
			this.baseItem0.anchorOffsetX = 0;
			this.baseItem0.anchorOffsetY =0;
			this.baseItem1.updateBaseItem(rewardArr[1][0],rewardArr[1][1],rewardArr[1][2]);
			this.baseItem1.anchorOffsetX = 0;
			this.baseItem1.anchorOffsetY =0;
			
		}
	}
}