/**
* Author: yangyipeng
* Email： hersletter@qq.com
* 邮件ListItem UI视图层 2017/06/20.
*/
module game {
	export class MailListItem extends eui.ItemRenderer{
		
		// private lb_theme:eui.Label;
		private lb_time:eui.Label;
		// private lb_read:eui.Label;
		private img_reward:eui.Image;
		private lb_theme0:eui.Label;
		public constructor() {
			super();
		}
		
		protected childrenCreated() 
		{
            super.childrenCreated();
			this.skinName = MailListItemSkin;
			// this.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
			// 	// App.WinManager.openWin(WinName.MAIL_DETAIL);
			// 	var detailView = new MailDetail(this.data);
			// 	PopUpManager.addPopUp({obj:detailView,effectType:1,dark:true});
			// 	// (MailModel.getInstance() as MailModel).mailArr.removeItemAt(0);
			// },this);
	
        }

		protected dataChanged() 
		{
			
			this.lb_time.text = this.data.Time;
			// this.lb_theme.text = this.data.Theme;
			if(this.data.isRead)
			{	
				this.lb_theme0.textFlow = [{ text: this.data.Theme, style: { textColor: 0xFFC000 }},{ text: "  已读", style: { textColor: 12566463 } }];
				// this.lb_read.text = "已读"
				// this.lb_read.textColor = 780544;
			}else{
				this.lb_theme0.textFlow = [{ text: this.data.Theme, style: { textColor: 0xFFC000 }},{ text: "  未读", style: { textColor: 780544 } }];
				// this.lb_read.text = "未读";
				// this.lb_read.textColor = 12566463;
			}
			if(this.data.reward.length>0 && !this.data.isRead)
			{
				this.img_reward.visible = true;
			}else
			{
				this.img_reward.visible = false;
			}

		}
	}
}