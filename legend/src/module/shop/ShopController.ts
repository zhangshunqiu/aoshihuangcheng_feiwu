/**
 * 商城控制器
 * author : zrj
*/
module game{
	export class ShopController extends BaseController{
		public shopModel : ShopModel = ShopModel.getInstance();
		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(16001,this.handleMysteryR,this);
			this.registerProtocal(16002,this.handleLimitR,this);
			this.registerProtocal(16003,this.handleBuyR,this);
			this.registerProtocal(16004,this.handleRefreshR,this);
		}

		/**
		 * 神秘商店数据
		 */
		public handleMysteryR(data){
			App.logzrj("data  ",data);
			this.shopModel.updateMysterySopInfo(data);
			this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST,1);
		}

		/**
		 * 限购商店数据
		 */
		public handleLimitR(data){
			App.logzrj("data  ",data);
			this.shopModel.updateLimitSopInfo(data);
			this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST,ShopType.LIMIT);
		}

		/**
		 * 购买物品返回
		 */
		public handleBuyR(data){
			App.logzrj("data  ",data);
			if (data.type == 1){
				this.shopModel.deleteMysteryShopInfo(data);
				this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST,ShopType.MYSTERY);
			} else if (data.type == 2) {
				this.shopModel.handleLimitShopInfo(data);
				this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST,ShopType.LIMIT);
			} else {
				this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST,ShopType.NORMAL);
			}
			
		}

		/**
		 * 刷新神秘商店数据
		 */
		public handleRefreshR(data){
			App.logzrj("data  ",data);
			this.shopModel.updateMysterySopInfo(data);
			this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST,ShopType.MYSTERY);
		}

		/**
		 * 销毁
		 */
		public destroy(){
			super.destroy();
		}

		/**
		 * 清理
		 */
		public clear(){
			super.clear();
		}
	}
}