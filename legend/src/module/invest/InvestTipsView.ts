module game {
	export class InvestTipsView extends BaseView{
		public lb_content:eui.Label;

		public constructor(viewConf: WinManagerVO = null) 
		{
			super(viewConf);
		}

		protected childrenCreated() 
		{
            super.childrenCreated();
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerCloseBtn,this);
        }

		public openWin(openParam: any = null): void {
			super.openWin();
			this.lb_content.textFlow = (new egret.HtmlTextParser).parser('<font size=24>1.限制投资只是限制玩家投资的时间，玩家投资后，可在</font>'
				+ '<font color=0x00f828 size=24 >任意</font>'
				+'<font size=24>时间内完成并且领取奖励\n</font>'

				+'<font size=24>2.投资计划只能投资</font>'
				+ '<font color=0x00f828 size=24 >一次，</font>'
				+'<font size=24>奖励也只能领取</font>'
				+ '<font color=0x00f828 size=24 >一次，\n</font>'
			);
		}
	
		/**
		 * 界面返回
		 */
		private handlerCloseBtn():void
		{
			WinManager.getInstance().closePopWin(WinName.POP_INVEST_TIPS);
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