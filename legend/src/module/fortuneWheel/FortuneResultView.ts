module game {
	export class FortuneResultView extends eui.Component{
		public lb_num:eui.Label;
		public gold_num:number;
		public constructor(gold) {
			super();
			this.gold_num = gold;
			this.skinName =  "FortuneResultSkin";
			this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.showUi,this);
		}

		private showUi():void
		{	
			this.lb_num.text = this.gold_num + "";
		}
	}
}