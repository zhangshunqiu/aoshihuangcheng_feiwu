module game {
	export class FortuneResultView extends BaseView{
		public lb_num:eui.Label;
				
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
			this.lb_num.text = this.openData + "";
		}

		/**
		 * 界面返回
		 */
		private handlerCloseBtn():void
		{
			WinManager.getInstance().closePopWin(WinName.POP_FORTUNE_RESULT);
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