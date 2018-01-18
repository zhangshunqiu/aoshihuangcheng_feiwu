/**
 * Author: yangyipeng                                      
 * 查看玩家信息模块控制器 
 */
module game{
    export class PlayerMsgController extends BaseController {                       //控制器必须继承BaseController
        private _playerMsgModel:PlayerMsgModel;
        private _broadEventId:number = 0;
        private _broadEventName:string = "zzz";
        public constructor() {
            super();
            this._playerMsgModel = PlayerMsgModel.getInstance();
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
            //协议监听示范 ,唯一，只能再一个地方监听
            this.registerProtocal(15030, this.handlerPlayMsg, this);
    
        }

        private handlerPlayMsg(data):void {
            this._playerMsgModel.updateData(data);
            this.dispatchEvent(PanelNotify.PLAYER_MSG_INQUIRE);
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