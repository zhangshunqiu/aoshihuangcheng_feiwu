/**
 * Author: liuyonggen
 * 副本模块主控制器 2017/11/27
 */
module game{
    export class CopyController extends BaseController{

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
            this.registerProtocal(31001, this.handlerGetCopyInfo, this);
            this.registerProtocal(31002, this.handlerChallengeCopy, this);
            this.registerProtocal(31003, this.handlerSweepCopy, this);
        }

        /**
         * 获取副本信息
         */
        private handlerGetCopyInfo(data) {
            (CopyModel.getInstance() as CopyModel).updateInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.COPY_INFO_UPDATE, data.type);
        }

        /**
         * 请求挑战副本
         */
        private handlerChallengeCopy(data) {
            this.dispatchEvent(PanelNotify.COPY_ASK_CHALLENGE_RESULT);
        }

        /**
         * 扫荡副本
         */
        private handlerSweepCopy(data) {
            (BossModel.getInstance() as BossModel).dropItem = data.list;
            App.WinManager.openWin(WinName.BOSS_WIN, "copySweep");
            this.dispatchEvent(PanelNotify.COPY_ASK_CHALLENGE_RESULT);
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