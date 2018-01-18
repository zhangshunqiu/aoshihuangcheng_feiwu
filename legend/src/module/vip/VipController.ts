/**
 * Author: liuyonggen
 * vip系统控制模块 2017/11/21
 */
module game {
    export class VipController extends BaseController {
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
            this.registerProtocal(24001, this.handlerVipInterface, this);
            this.registerProtocal(24002, this.handlerVipGetReward, this);
        }

        public handlerVipInterface(data) {
            (VipModel.getInstance() as VipModel).updateInterfaceInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.VIP_REWARD_UPDATE);
        }

        public handlerVipGetReward(data) {
            if (data) {
                this.dispatchEvent(PanelNotify.VIP_GET_REWARD_SUCCESS);
            }
        }

         /**
         * 初始化事件监听                                           
         */
        protected initEventListener() {
            super.initEventListener();
            if(this._eventId == 0) {
                App.EventSystem.addEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, ()=>{
                    (VipModel.getInstance() as VipModel).getVipInfo();
                }, this);
            }
        }


        /**
         * 清理
         */
        public clear() {
            super.clear();
            if(this._eventId != 0) {
                App.EventSystem.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this._eventId);
                this._eventId = 0;
            }
        }

        /**
         * 销毁
         */
        public destroy() {
            super.destroy();
        }
    }
}