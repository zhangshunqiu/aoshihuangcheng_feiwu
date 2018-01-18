/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 主界面的聊天窗口 2017/06/20.
 */
module game {
    export class ChatPortView extends BaseView {
        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
        }


        public gp_chatlist: eui.Group;
        public scr_chatlist: eui.Scroller;
        public vp_chatlist: eui.Group;
        private _uichatlist: Array<any> = [];
        private _nextchatposiy: number = 0;
        private _eventid_chatlist = 0;
        private _eventid_onechat: number = 0;
        private _chatModel: ChatModel = ChatModel.getInstance();

        protected childrenCreated() {
            super.childrenCreated();
                
            ChatController.getInstance().getChatList();
            //聊天窗口
            if (this._eventid_chatlist == 0)
                this._eventid_chatlist = App.EventSystem.addEventListener(PanelNotify.CHAT_LIST_UPDATE, this.playChatList, this);

            if (this._eventid_onechat == 0){
                this._eventid_onechat = App.EventSystem.addEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this.playOneChat, this);
            }

            this.scr_chatlist.viewport = this.vp_chatlist;
            this.scr_chatlist.scrollPolicyH = eui.ScrollPolicy.OFF;
            // if (this._uichatlist.length < 1)
            //     this.playChatList();
        }

        //聊天窗口
        //把收到的消息列表显示出来
        public playChatList() {
            // _chatList
            for (let i = 0; i < this._chatModel.chatAllList.length; i++) {

                let item = new RichTextField;
                item.size = 18;
                item.textHtml = ChatUtil.getChatPortText(this._chatModel.chatAllList[i]);
                item.width = 400;
                //item.maxWidth = 420;
                item.lineSpacing = 10;
                this.vp_chatlist.addChild(item);
                item.$setY(this._nextchatposiy);
                item.x += 5;
                this._nextchatposiy += item.height + 10;
                this._uichatlist.push(item);
                this.vp_chatlist.height = 1000;

            }
            this.scr_chatlist.viewport.scrollV = this._nextchatposiy - this.scr_chatlist.height;
        }

        //有新消息加入
        public playOneChat(data) {

            if (this._uichatlist.length > 100) {
                this._nextchatposiy -= this._uichatlist[0].height;
                for (let i = 0; i < this._uichatlist.length; i++) {
                    this._uichatlist[i].y -= this._uichatlist[0].height;
                    this.vp_chatlist.removeChild(this._uichatlist[0]);
                }
            }
            let item = new RichTextField;
            item.size = 18;
            //item.textFlow = ChatUtil.getChatPortText(data);
            item.textHtml = ChatUtil.getChatPortText(data);
            //item.maxWidth = 420;
            item.width =400;
            item.lineSpacing = 10;
            this.vp_chatlist.addChild(item);
            item.$setY(this._nextchatposiy);
            item.x += 5;
            this._nextchatposiy += item.height + 10;
            this._uichatlist.push(item);

            this._uichatlist.shift();
            this.scr_chatlist.viewport.scrollV = this._nextchatposiy - this.scr_chatlist.height;
        }

		/**
				 * 打开窗口
				*/
        public openWin(openParam: any = null): void {
            super.openWin(openParam);

              ChatController.getInstance().getChatList();
            //聊天窗口
            if (this._eventid_chatlist == 0)
                this._eventid_chatlist = App.EventSystem.addEventListener(PanelNotify.CHAT_LIST_UPDATE, this.playChatList, this);

            if (this._eventid_onechat == 0){
                this._eventid_onechat = App.EventSystem.addEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this.playOneChat, this);
            }

            this.x = 155;
            this.y = 945;
             if (this._uichatlist.length < 1)
                this.playChatList();
        }

		/**
		 * 关闭窗口
		 */
        public closeWin(callback): void {
            super.closeWin(callback);
        }

		/**
		 * 清理
		 */
        public clear(data: any = null): void {
            super.clear(data);
            //清理聊天窗口事件
            if(this._eventid_chatlist != 0){
                App.EventSystem.removeEventListener(PanelNotify.CHAT_LIST_UPDATE, this._eventid_chatlist);
                this._eventid_chatlist = 0
            }
            if(this._eventid_onechat != 0){
                App.EventSystem.removeEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this._eventid_onechat);
                this._eventid_onechat = 0
            }

        }
		/**
		 * 销毁
		 */
        public destroy(): void {
            super.destroy();
        }


    }


}