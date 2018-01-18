/**
 * Author: liuyonggen
 * 月卡系统控制模块 2017/11/24
 */
module game {
    export class MonthCardController extends BaseController {
        public _eventId: number = 0;
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
            this.registerProtocal(25001, this.handlerMonthCardInterface, this);
            this.registerProtocal(25002, this.handlerMonthCardGetReward, this);
            this.registerProtocal(25003, this.handlerBuyMonthCardNum, this);
        }

        private handlerMonthCardInterface(data) {   //left_time	 月卡剩余时间//day 今天月卡的天数（day>=1） //reward_num// 未领取的奖励数
            (MonthCardModel.getInstance() as MonthCardModel).updateInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.MONTHCARD_INFO_UPDATE);
        }

        private handlerMonthCardGetReward(data) {
            if(data.result) {
                this.dispatchEvent(PanelNotify.MONTHCARD_GET_SUCCESS);
               
            }
        }

        private handlerBuyMonthCardNum(data) {
            (MonthCardModel.getInstance() as MonthCardModel).updateBuyNum(data.result);
            App.WinManager.openWin(WinName.MONTHCARD_BUY_REWARD);
        
        }

         /**
         * 初始化事件监听                                           
         */
        protected initEventListener() {
            super.initEventListener();
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