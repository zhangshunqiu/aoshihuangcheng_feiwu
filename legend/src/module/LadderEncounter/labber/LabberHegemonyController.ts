/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 每日必做控制器 2017/06/20.
 */
module game {
    export class LabberHegemonyController extends BaseController {
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
            //Labber

            this.registerProtocal(37001, this.handlerHegemonyInfo, this);//收到天梯界面信息
            this.registerProtocal(37002, this.handlerMatchEnemy, this);//匹配对手
            this.registerProtocal(37003, this.handlerBuyTimes, this);//购买匹配次数
            this.registerProtocal(37004, this.handlerLabberRewardInfo, this);//天梯奖励界面信息
            this.registerProtocal(37005, this.handlerHegemonyResultInfo, this);//争霸结果结算

        }

        public handlerHegemonyInfo(data) {

            (LabberHegemonyModel.getInstance() as LabberHegemonyModel).updateLabberHegemonyInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.HEGEMONY_INFO_UPDATE);
        }

        public handlerMatchEnemy(data) {

            (LabberHegemonyModel.getInstance() as LabberHegemonyModel).getMatchEnemyInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.HEGEMONY_MATCH_UPDATE);
        }

        public handlerBuyTimes(data) {
            App.Socket.send(37001,null);
        }

        public handlerLabberRewardInfo(data) {
             (LabberHegemonyModel.getInstance() as LabberHegemonyModel).getLabberRewardInfo(data);
             App.EventSystem.dispatchEvent(PanelNotify.HEGEMONY_REWARD_UPDATE);
             
        }

        public handlerHegemonyResultInfo(data){
             (LabberHegemonyModel.getInstance() as LabberHegemonyModel).getHegemonyResultInfo(data);
             App.WinManager.openWin(WinName.HEGEMONY_LABBER_RESULT);
        }


    }


}