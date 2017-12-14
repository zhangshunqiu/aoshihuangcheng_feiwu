/**
 * 转生模块控制器
 * ahthor : zrj
*/
module game{
	export class RebornController extends BaseController{
		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(20001,this.handleRebornR,this);
			this.registerProtocal(20002,this.handleRebornInfoR,this);
			this.registerProtocal(20003,this.handleRebornExchangeR,this);
		}

		/**
		 * 转生
		 */
		public handleRebornR(data){
			// App.logzrj("data: ",data);
			RebornModel.getInstance().checkCanReborn();
			this.dispatchEvent(PanelNotify.REBORN_SUCCESS);
			this.dispatchEvent(PanelNotify.REBORN_UPDATE_VIEW);
		}

		/**
		 * 转生兑换信息
		 */
		public handleRebornInfoR(data){
			App.logzrj("data: ",data);
			RebornModel.getInstance().exchangeInfo = data.get_life_exp_list;
			RebornModel.getInstance().checkCanReborn();
			this.dispatchEvent(PanelNotify.REBORN_UPDATE_INFO_VIEW);
		}

		/**
		 * 转生兑换
		 */
		public handleRebornExchangeR(data){
			// App.logzrj("data: ",data);
			this.dispatchEvent(PanelNotify.REBORN_UPDATE_VIEW);
			this.dispatchEvent(PanelNotify.REBORN_UPDATE_INFO_VIEW);
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