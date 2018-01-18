/**
 * author:yangyipeng
 * 关卡排行榜控制器
 */
module game {
	export class RankGuanqiaController extends BaseController{
		
		private _guanqiaModel:RankGuanqiaModel;
		public constructor() {
			super();
			this._guanqiaModel = RankGuanqiaModel.getInstance();
			this.initProtocol();
			this.initEventListener();
		}

		/**
		 * 初始化事件监听                                           
		 */
		protected initEventListener() {
			super.initEventListener();
		}

	

		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			super.initProtocol();
			this.registerProtocal(27009, this.handlerGuanqia, this);//战力
		}

		private handlerGuanqia(data):void {
			this._guanqiaModel.ReceiveGuanqiaData(data);
			this.dispatchEvent(PanelNotify.RANK_GUANQIA_UPDATE);
		}

		/**
		 * 清理
		 */
		public clear() {
			super.clear();
		
		}

		/**
		 * 销毁
		 */
		public destroy() {
			super.destroy();
			//销毁处理
		}

	}
}