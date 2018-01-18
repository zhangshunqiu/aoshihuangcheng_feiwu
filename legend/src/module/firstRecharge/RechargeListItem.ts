module game {
	export class RechargeListItem extends eui.ItemRenderer{
		public lb_money:eui.Label;
		public gp_attach:eui.Group;
		public lb_gold_attach:eui.Label;
		public img_gold:eui.Image;
		public lb_gold_total:eui.BitmapLabel;

		public constructor() {
			super();
			this.skinName = RechargeListItemSkin;
		}
		protected dataChanged():void
		{	
			this.img_gold.source = "VIPcharge_yuanbao" + this.itemIndex + "_png";
			var charge_rate = ConfigManager.getInstance().getConstConfigByType("CHARGE_RATE")["value"];
			var configData = this.data[0]
			if(this.data[1])
			{
				//可以赠送元宝
				this.gp_attach.visible = true;
				this.lb_gold_attach.text = configData.ext_gold + "元宝";
				this.lb_gold_total.text = (configData.rmb * charge_rate + configData.ext_gold);
				
			}else{
				//不可以赠送元宝
				this.gp_attach.visible = false;
				this.lb_gold_total.text = (configData.rmb * charge_rate) + "";
			}
			this.lb_money.text = configData.rmb + "元";
		}
	}
}