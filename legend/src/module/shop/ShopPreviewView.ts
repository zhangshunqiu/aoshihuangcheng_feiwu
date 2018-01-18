module game {
	export class ShopPreviewView extends BaseView{
		public scroller:eui.Scroller;
		public gp_preview:eui.Group;

		public constructor(vo) {
			super(vo);
		}

		protected childrenCreated():void {
			super.childrenCreated();
			this.scroller.verticalScrollBar.visible = false;
			this.scroller.verticalScrollBar.autoVisibility = false;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
				// WinManager.getInstance().closePopWin(WinName.POP_SHOP_PREVIEW);
			},this);
		}
		/**
		 * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
			//展示极品

			let data = App.ConfigManager.normalShopConfig();
			for (let key in data) {
				var itemInfo = App.ConfigManager.itemConfig()[data[key]["goods"]];
				var baseItem:customui.BaseItem = new customui.BaseItem();
				baseItem.updateBaseItem(1,data[key]["goods"],data[key]["num"]);
				baseItem.setItemNameVisible(true);
				this.gp_preview.addChild(baseItem);
				// this.shopBaseItem.updateBaseItem(1, this.data.goods, this.data.num);
			}

			
			
		}
	
		/**
		 * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
		 */
		public clear(data: any = null): void {
			super.clear(data);

		}

		/**
		 * 销毁
		 */
		public destroy(): void {
			super.destroy();
		
		}
	}
}