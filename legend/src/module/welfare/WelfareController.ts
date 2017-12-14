/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 福利控制器 2017/11/20.
 */
module game {
    export class WelfareController extends BaseController {
        public constructor() {
            super();
            this.initProtocol();
            this.initEventListener();
        }
		/**
		 * 初始化协议
		 */
        protected initProtocol() {
            super.initProtocol();

            //等级奖励
            this.registerProtocal(22001, this.handleLevelUpInfo, this);//收到等级礼包信息
            this.registerProtocal(22002, this.handleGetLevelUpWelfare, this);//处理领取等级礼包
            this.registerProtocal(22003,this.handleLevelPackageNumChange,this);

        }

        protected initEventListener() {
            super.initEventListener();
        }

        public handleGetLevelUpWelfare(data) {

            App.loglh("handleMustDoList");
            App.Socket.send(22001, null);
        }

        public handleLevelUpInfo(data) {

            App.loglh("handleMustDoList");
            (WelfareModel.getInstance() as WelfareModel).getWelfareLvList(data);
            this.dispatchEvent(PanelNotify.WELFARE_UPDATELEVELLIST);
        }

        public handleLevelPackageNumChange(data){
            App.loglh("handleMustDoList");
            (WelfareModel.getInstance() as WelfareModel).updateRewardLeftNum(data);
             this.dispatchEvent(PanelNotify.WELFARE_UPDATELEVELLIST);
        }
        /**
        * 销毁
        */
        public destroy() {
            super.destroy();
        }

		/**
		 * 清理
		 */
        public clear() {
            super.clear();
        }
    }
}