/**
 * lihe 聊天系统控制层
 */
module game {
	export class ChatController extends BaseController {
		public constructor() {
			super();
			this.initProtocol();
			this.initEventListener();
		}
        private _isApplyList:boolean;
		private _linkEventId:number = 0;
		private _equip_id:number = 0;

		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			super.initProtocol();
			this.registerProtocal(17001, this.handleChatList, this);
			this.registerProtocal(17003, this.handleOneChat, this);
			this.registerProtocal(17005,this.handlerEquipInfo,this);
			

		}

		/**
		 * 初始化事件监听
		 */
		protected initEventListener() {
			if(this._linkEventId == 0){
				this.addEventListener(RichTextField.LINK_EVENT,this.onClickTextLink,this)
			}
		}

		/**
		 * 文本链接点击事件
		 */
		private onClickTextLink(str:string){
           
		   let strs: string[] = str.split("_");
           switch(strs[0]){
			   case "skip":
					MainModuleJump.jumpToModule(parseInt(strs[1]));
			        break;
			  case "item":
			        App.GlobalTips.showItemTips(ClientType.BASE_ITEM, parseInt(strs[1]), null);
			        break;
			  case "equip":
			        this._equip_id = parseInt(strs[1]);
			        App.Socket.send(17005,{id:parseInt(strs[1])});
			        break;
				
		   }
		}
    
		public handleChatList(data) {
			App.loglh("receiveChatList data :");
			(ChatModel.getInstance() as ChatModel).getChatList(data);
			if (data.channel == 1)
				this.dispatchEvent(PanelNotify.CHAT_LIST_UPDATE);
            
		}

		public handleOneChat(data) {
			App.loglh("receiveOneChat data :",data.channel,data.msg.content);
			(ChatModel.getInstance() as ChatModel).getOneChat(data);
			this.dispatchEvent(PanelNotify.CHAT_HAS_NEW_INFO, (ChatModel.getInstance() as ChatModel).getChatVo(data.channel, data.msg));
			if((data.channel-1) != ChatType.SYSTEM && App.WinManager.isOpen(WinName.CHAT) == false){
				App.BtnTipManager.setTypeValue(ConstBtnTipType.CHAT,true);
			}
		}

       public handlerEquipInfo(data){
              (ChatModel.getInstance() as ChatModel).getEquipInfo(data);
			   App.GlobalTips.showItemTips(ClientType.EQUIP, data.good_id,data.id,data);
	   } 
	   
		public getChatList(){
            
			if(!this._isApplyList){
			//聊天系统请求数据
			App.Socket.send(17001, { page: 1, channel: 1 }); 
			egret.setTimeout(()=>{App.Socket.send(17001, { page: 1, channel: 2 });  },this,100);
			egret.setTimeout(()=>{App.Socket.send(17001, { page: 1, channel: 3 });  },this,200);
			egret.setTimeout(()=>{App.Socket.send(17001, { page: 1, channel: 4 });  },this,400);
           
			this._isApplyList = true;
			}

		}		/**
		 * 销毁
		 */
		public destroy() {
			super.destroy();
			if(this._linkEventId != 0){
				this.removeEventListener(RichTextField.LINK_EVENT,this._linkEventId);
				this._linkEventId = 0;
			}
		}

		/**
		 * 清理
		 */
		public clear() {
			super.clear();
		}
	}
}