/**
 * 熔炼控制器
 * author ： zrj
*/
module game{
	export class SmeltController extends BaseController{
		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(14011,this.handleSmeltR,this);
			this.registerProtocal(14015,this.handleOrangeSmeltR,this);
		}

		public handleSmeltR(data) {
			// console.log("dispatchEvent smelt");
			this.dispatchEvent(PanelNotify.SMELT_SMELT_EQUIP);
		}

		//橙装熔炼返回
		public handleOrangeSmeltR(data) {
			this.dispatchEvent(PanelNotify.SMELT_ORANGE_EQUIP);
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