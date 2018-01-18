/**
 * Author: yangyipeng                                     
 * 排行榜模块控制器 
 */
module game {
        export class RankController extends BaseController {                       //控制器必须继承BaseController
        private _rankModel:RankModel;
      
        public constructor() {
            super();
            this._rankModel = RankModel.getInstance();
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
         * 接收的派发事件
         */
        private onBroadCastPlay() {
            //处理相应事件
        }

        /**
         * 初始化协议
         */
        protected initProtocol() {
            super.initProtocol();
            //协议监听示范 ,唯一，只能再一个地方监听
            this.registerProtocal(27001, this.handlerCombat, this);//战力
            this.registerProtocal(27002, this.handlerLv, this);//等级
            this.registerProtocal(27003, this.handlerFighter, this);//战圣
            this.registerProtocal(27004, this.handlerMagic, this);//法神
            this.registerProtocal(27005, this.handlerTaoist, this);//道尊
            this.registerProtocal(27006, this.handlerKill, this);//遭遇
            this.registerProtocal(27007, this.handlerMemal, this);//勋章
            this.registerProtocal(27008, this.handlerKing, this);//王者榜
            this.registerProtocal(27020, this.handlerWorship, this);//膜拜
        }

        private handlerCombat(data):void
        {   //假如list没有内容，说明这个排行榜没有排名，这时候只需要显示膜拜信息
            if(data["list"].length > 0) {
                this._rankModel.rankCombat(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE,ConstRankName.COMBAT);
            }else{
                this._rankModel.setWorShip(data["worship"],ConstRankName.COMBAT);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING,ConstRankName.COMBAT);
            }
        }

        private handlerLv(data):void
        {   if(data["list"].length > 0) {
                this._rankModel.rankLevel(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE,ConstRankName.LEVEL);
            }else{
                this._rankModel.setWorShip(data["worship"],ConstRankName.LEVEL);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING,ConstRankName.LEVEL);
            }
        }

        private handlerFighter(data):void
        {   if(data["list"].length > 0) {
                this._rankModel.rankFighter(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE,ConstRankName.FIGHTER);
            }else{
                this._rankModel.setWorShip(data["worship"],ConstRankName.FIGHTER);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING,ConstRankName.FIGHTER);
            }
        }

        private handlerMagic(data):void
        {   if(data["list"].length > 0) {
                this._rankModel.rankMagic(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE,ConstRankName.MAGIC);
            }else{
                this._rankModel.setWorShip(data["worship"],ConstRankName.MAGIC);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING,ConstRankName.MAGIC);
            }
        }

        private handlerTaoist(data):void
        {   if(data["list"].length > 0) {
                this._rankModel.rankTaoist(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE,ConstRankName.TAOIST);
            }else{
                this._rankModel.setWorShip(data["worship"],ConstRankName.TAOIST);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING,ConstRankName.TAOIST);
            }
        }

        private handlerKill(data):void
        {   
            if(data["list"].length > 0) {
                this._rankModel.rankKill(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE,ConstRankName.KILL);
            }else{
                this._rankModel.setWorShip(data["worship"],ConstRankName.KILL);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING,ConstRankName.KILL);
            }
            
        }

        private handlerMemal(data):void
        {   if(data["list"].length > 0) {
                this._rankModel.rankMemal(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE,ConstRankName.MEMAL);
            }else{
                this._rankModel.setWorShip(data["worship"],ConstRankName.MEMAL);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING,ConstRankName.MEMAL);
            }
        }

        private handlerKing(data):void
        {   if(data["list"].length > 0) {
                this._rankModel.rankKing(data);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_UPDATE,ConstRankName.KING);
            }else{
                this._rankModel.setWorShip(data["worship"],ConstRankName.KING);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_INFO_NOTHING,ConstRankName.KING);
            }
        }

        private handlerWorship(data):void
        {      
            if(data.result)
            {   
                this._rankModel.worship(data.result);
                App.EventSystem.dispatchEvent(PanelNotify.RANK_WORSHIP_UPDATE);
            }else{
                console.log("膜拜失败");
            }
        }
        /**
         * 翅膀信息返回
         * @param data any 返回数据
         */
        // private handlerWingInfo(data) {
        //     //处理协议相关功能
        //     var info:any = data;
        //     //派发事件
        //     this.dispatchEvent(PanelNotify.WING_INFO_UPDATE,info);
        // }



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