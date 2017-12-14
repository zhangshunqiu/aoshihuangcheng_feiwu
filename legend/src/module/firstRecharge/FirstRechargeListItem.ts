module game {
	export class FirstRechargeListItem extends eui.ItemRenderer{
		public lb_gold:eui.Label;
		public lb_money:eui.Label;

		public constructor() {
			super();
			this.skinName = FirstRechargeListItemSkin;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.handlerToRecharge,this);
		}

		private handlerToRecharge():void
		{
			//点击充值	this.data是充值的人民币

		}

		protected dataChanged():void
		{
			var charge_rate:number = ConfigManager.getInstance().getConstConfigByType("CHARGE_RATE")["value"];
			var  multiple:number = ConfigManager.getInstance().getFirstChargeInfo()["1"]["multi"]
			this.lb_money.text = this.data + "元";
			this.lb_gold.text ="获得" + (this.data * multiple * charge_rate) + "元宝";
			this.lb_gold.textFlow =[
				{text:"获得",style:{textColor:0xB3A1A1}},
				{text:(this.data * multiple * charge_rate)+"",style:{textColor:0xffea01}},
				{text:"元宝",style:{textColor:0xB3A1A1}}
			];
		}	
	}
}