module game {
	export class PlayerMsgTabItem extends eui.ItemRenderer{
		public img_career:eui.Image;
		public img_head:eui.Image;
		public img_select:eui.Image;
		public img_lock:eui.Image;
		public lb_tip:eui.Label;

		public constructor() {
			super();
			this.skinName = "PlayerMsgTabItemSkin";
			// this.img_head.scaleX = 0.7;
			// this.img_head.scaleY = 0.7;
		}
	
		protected dataChanged():void {
			if(this.data) {
				var sex = this.data["sex"];
				var job = this.data["job"];
				let headKey = //value.job + "0000" + value.sex;
                    App.ConfigManager.getSmallHeroIconBySexAndJob(sex, job, 2);
                RES.getResAsync(headKey + "_png", (texture) => {
                    this.img_head.source = texture;
                }, this);
				var careerTag = ConstCareerIcon[job]
                RES.getResAsync(careerTag, (texture) => {
                    this.img_career.source = texture;
					this.img_career.visible = true;
                }, this);
				this.img_lock.visible = false;
			}else {
				this.img_lock.visible = true;
				this.img_career.visible = false;

			}
			
			if(this.itemIndex == (PlayerMsgModel.getInstance() as PlayerMsgModel).curPos) {
				this.img_select.visible = true;
			}
			// if(this.data) {
			// 	RES.getResAsync(this.data,(texture)=>{
			// 		this.img_head.source = texture;
			// 	},this);
			// 	this.img_lock.visible = false;
			// }else {
			// 	this.img_lock.visible = true;
			// }
		}
	}
}