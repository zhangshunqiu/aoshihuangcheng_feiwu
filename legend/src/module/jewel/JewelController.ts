/**
 * module : 宝石模块控制器
 * author : zrj
*/
module game{
	export class JewelController extends BaseController{
		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(15008,this.handleJewelEquip,this);
			this.registerProtocal(15009,this.handleJewelUpgrade,this);
		}

		/**
		 * 宝石合成
		 */
		public handleJewelCombine(data){

		}

		/**
		 * 宝石一键镶嵌
		 */
		public handleJewelEquip(data){
			this.dispatchEvent(PanelNotify.JEWEL_UPDATE_ALL_VIEW,data);
		}

		/**
		 * 宝石升级
		 */
		public handleJewelUpgrade(data){
			this.dispatchEvent(PanelNotify.JEWEL_UPDATE_VIEW,data);
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