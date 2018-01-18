module game {
	export class GuanqiaListItem extends eui.ItemRenderer{

		public lb_rank:eui.Label;
		public lb_name:eui.Label;
		public lb_combat:eui.Label;
		public lb_guanqia:eui.Label;
		public gp_vip:eui.Group;
		public img_yue:eui.Image;
		public img_vip:eui.Image;
		public bitmap_vip:eui.BitmapLabel;

		public constructor() {
			super();
			this.skinName = GuanqiaListItemSkin;
		}

		protected dataChanged():void {
			console.log(this.data);
			var vo:GuanqiaListVo = this.data;
			this.lb_name.text = vo.name;
			this.lb_rank.text = vo.rank + "";
			this.lb_combat.text = vo.combat;
			this.lb_guanqia.text = vo.guanqia + "";
			if(vo.month_card) {
				this.img_yue.visible = true;
			}else {
				this.img_yue.visible = false;
			}
			if(vo.vipLv) {
				this.img_vip.visible = true;
				this.bitmap_vip.visible = true;
				this.bitmap_vip.text = vo.vipLv + "";
			}else {
				this.img_vip.visible = false;
				this.bitmap_vip.visible = false;
			}
		}
	}
}