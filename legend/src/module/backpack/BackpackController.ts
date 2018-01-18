/**
 * module : 背包模块控制器
 * author ：zrj
 * 
*/

module game{
	export class BackpackController extends BaseController{
		private backpackModel : BackpackModel = (BackpackModel.getInstance() as BackpackModel);

		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(14001,this.receiveGoodList,this);
			this.registerProtocal(14002,this.updateGoodList,this);
			this.registerProtocal(14003,this.backpackChangedR,this);
			this.registerProtocal(14004,this.backpackChangedR,this);
		}

		//获取背包列表
		public receiveGoodList(data) {
			this.backpackModel.updateBackpack(data);
			App.EventSystem.dispatchEvent(PanelNotify.HERO_ON_HERO_BAG_UPDATE);
			
		}

		//更新背包列表
		public updateGoodList(data) {
			// App.logzrj("data:",data);
			this.backpackModel.updateBackpackItemInfo(data.playergoods);
			App.EventSystem.dispatchEvent(PanelNotify.HERO_ON_HERO_BAG_UPDATE);
		}

		//使用 出售物品
		public backpackChangedR(data) {
			App.EventSystem.dispatchEvent(PanelNotify.HERO_ON_HERO_BAG_UPDATE);
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