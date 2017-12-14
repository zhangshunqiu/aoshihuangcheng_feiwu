/**
 * 夺宝控制器
 * author ：zrj
*/

module game{
	export class RaiderController extends BaseController{
		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(26001,this.handleRecord,this);
			this.registerProtocal(26002,this.handleRecordPush,this);
			this.registerProtocal(26003,this.handleRaidOne,this);
			this.registerProtocal(26004,this.handleRaidTen,this);
			this.registerProtocal(26005,this.handleStorage,this);
			this.registerProtocal(26006,this.handleStorageWithdraw,this);
		}

		/**
		 * 寻宝记录
		*/
		public handleRecord(data) {
			App.logzrj("data: ",data);
			if (data.open_days){
				RaiderModel.getInstance().curDay = data.open_days;
			}
			RaiderModel.getInstance().updatestorageRecord(data.treasure_log);
			this.dispatchEvent(PanelNotify.RAIDER_UPDATE_VIEW);
		}

		/**
		 * 寻宝记录下推
		*/
		public handleRecordPush(data) {
			App.logzrj("data: ",data);
			RaiderModel.getInstance().updatestorageRecord(data.treasure_log);
			this.dispatchEvent(PanelNotify.RAIDER_UPDATE_VIEW);
		}

		/**
		 * 寻宝1次
		*/
		public handleRaidOne(data) {
			App.logzrj("data: ",data);
			RaiderModel.getInstance().time = 1;
			this.dispatchEvent(PanelNotify.RAIDER_UPDATE_VIEW);
			this.dispatchEvent(PanelNotify.RAIDER_OPEN_REWARD,data.treasure);
		}

		/**
		 * 寻宝10次
		*/
		public handleRaidTen(data) {
			App.logzrj("data: ",data);
			RaiderModel.getInstance().time = 10;
			// this.dispatchEvent(PanelNotify.RAIDER_UPDATE_VIEW);
			this.dispatchEvent(PanelNotify.RAIDER_OPEN_REWARD,data.treasure);
		}

		/**
		 * 仓库列表
		*/
		public handleStorage(data) {
			App.logzrj("data: ",data);
			RaiderModel.getInstance().updateStorageInfo(data.treasure);
			this.dispatchEvent(PanelNotify.RAIDER_UPDATE_STORAGE);
		}

		/**
		 * 仓库一键取出
		*/
		public handleStorageWithdraw(data) {
			App.logzrj("data: ",data);
			RaiderModel.getInstance().updateStorageInfo([]);
			this.dispatchEvent(PanelNotify.RAIDER_UPDATE_STORAGE);
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