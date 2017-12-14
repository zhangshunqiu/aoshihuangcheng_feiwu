module game {
	export class MailBaseItem extends eui.ItemRenderer{
		private baseItem:customui.BaseItem;
		public constructor() {
			super();
		
// this.skinName =MailBaseItemSkin;
		}
		protected dataChanged() 
		{	
			console.log(this.data);
			var type = this.data.type;
			var num = this.data.num;
			var good_id = this.data.good_id;
			this.baseItem.updateBaseItem(type,good_id,num);
			this.baseItem.lb_name.visible = true;
		}
	}
}