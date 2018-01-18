/**
* Author: yangyipeng
* 排行榜提示 UI视图层 
*/
module game {
	export class RankTipsView extends BaseView{

		public lb_content:eui.Label;


		public constructor(viewConf: WinManagerVO = null) 
		{
			super(viewConf);
		
		}

		protected childrenCreated() 
		{
            super.childrenCreated();
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
			this.lb_content.textFlow  =(new egret.HtmlTextParser).parser('<font color=0xB5B5B5 size=24>1.排行榜奖励每天</font>'
				+ '<font color=0x00f828 size=24 >4点</font>'
				+'<font color=0xB5B5B5 size=24>以邮件发送\n</font>'

				+'<font color=0xB5B5B5 size=24>2.称号奖励将会为玩家</font>'
				+ '<font color=0x00f828 size=24 >自动激活</font>'
				+'<font color=0xB5B5B5 size=24>有效期自激活起</font>'
				+ '<font color=0x00f828 size=24 >1天\n</font>'

				+'<font color=0xB5B5B5 size=24>3.膜拜将于每天早上</font>'
				+ '<font color=0x00f828 size=24 >4点</font>'
				+'<font color=0xB5B5B5 size=24>刷新，玩家可以膜拜自己\n</font>'
			);
        }

		public openWin(openParam: any = null): void {
			super.openWin();
		}

	
		/**
		 * 界面返回
		 */
		private handlerCloseBtn():void
		{
			WinManager.getInstance().closePopWin(WinName.POP_RANK_QUESTION);
		}


		public clear():void
		{	
			super.clear();
		}

		public destroy():void
		{
			super.destroy();
		}
		
	}
}