/**
 * Author: liuyonggen
 * 遭遇战模块主控制器 2017/12/7
 */
module game{
    export class EncounterController extends BaseController{

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
            this.registerProtocal(38001, this.handlerEncounterMain, this);
            this.registerProtocal(38002, this.handlerStartChallenge, this);
            this.registerProtocal(38003, this.handlerChallengeResult, this);
            this.registerProtocal(38004, this.handlerPkRecord, this);
            this.registerProtocal(38005, this.handlerReducePkNum, this);
        }

        /**
         * 遭遇战主界面信息
         */
        private handlerEncounterMain(data) {
           (EncounterModel.getInstance() as EncounterModel).updateInfo(data);
           App.EventSystem.dispatchEvent(PanelNotify.ENCOUNTER_INFO_UPDATE); 
        }
        /**
         * 玩家发起挑战 若返回则发起挑战成功
         */
        private handlerStartChallenge(data) {
            App.loglyg(data);
        }
        /**
         * 挑战结果
         */
        private handlerChallengeResult(data) {
            (BossModel.getInstance() as BossModel).dropItem = data.reward;
            if(data.result == 1) {
                App.WinManager.openWin(WinName.BOSS_WIN, "encounter");
            } else if(data.result == 2) {
                App.WinManager.openWin(WinName.BOSS_LOSE, "encounter");
            }      
        }
        /**
         * 玩家战斗记录
         */
        private handlerPkRecord(data) {
            
            (EncounterModel.getInstance() as EncounterModel).getEncounterLogInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.ENCOUNTER_LOG_UPDATE);
        }
        /**
         * 使用元宝消除pk值，若返回则代表成功
         */
        private handlerReducePkNum(data) {
            if(data.result)
            {
                this.dispatchEvent(PanelNotify.ENCOUNTER_PK_REDUCE_SUCCESS);
            }
        }
        
        /**
         * 初始化事件监听                                           
         */
        protected initEventListener() {
            super.initEventListener();
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