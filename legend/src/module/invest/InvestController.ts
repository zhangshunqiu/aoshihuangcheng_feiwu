/**
 * Author: yangyipeng                
 * 投资模块控制器 2017/06/20.
 */
module game {
	export class InvestController extends BaseController{
		private _investModel:InvestModel;

		public constructor() {
			super();
			this._investModel = InvestModel.getInstance();
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
			this.registerProtocal(34001,this.handlerInvestData,this);
			this.registerProtocal(34002,this.handlerInvestResult,this);
			this.registerProtocal(34003,this.handlerGetReward,this);
		}
		
		/**
		 * 投资信息返回
		 */
		private handlerInvestData(data):void
		{	
			this._investModel.investDataUpdate(data);
			if(data["left_time"] <= 0) {
				this.dispatchEvent(PanelNotify.REMOVE_TOP_BTN,MainUIBtnType.INVEST);
			}else {
				this.dispatchEvent(PanelNotify.INVEST_INFO_UPDATE);
			}
		}

		/**
		 * 点击投资购买返回
		 */
		private handlerInvestResult(data):void
		{	
			this._investModel.investBuy(data);
			this.dispatchEvent(PanelNotify.INVEST_INFO_UPDATE);
		}

		/**
		 * 领取投资奖励返回
		 */
		private handlerGetReward(data):void
		{
			this._investModel.investReward(data.id);
			// this.dispatchEvent(PanelNotify.INVEST_INFO_UPDATE);
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
		}
	}
}