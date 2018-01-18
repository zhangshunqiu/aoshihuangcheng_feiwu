var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 主界面的聊天窗口 2017/06/20.
 */
var game;
(function (game) {
    var ChatPortView = (function (_super) {
        __extends(ChatPortView, _super);
        function ChatPortView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._uichatlist = [];
            _this._nextchatposiy = 0;
            _this._eventid_chatlist = 0;
            _this._eventid_onechat = 0;
            _this._chatModel = game.ChatModel.getInstance();
            return _this;
        }
        ChatPortView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            game.ChatController.getInstance().getChatList();
            //聊天窗口
            if (this._eventid_chatlist == 0)
                this._eventid_chatlist = App.EventSystem.addEventListener(PanelNotify.CHAT_LIST_UPDATE, this.playChatList, this);
            if (this._eventid_onechat == 0) {
                this._eventid_onechat = App.EventSystem.addEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this.playOneChat, this);
            }
            this.scr_chatlist.viewport = this.vp_chatlist;
            this.scr_chatlist.scrollPolicyH = eui.ScrollPolicy.OFF;
            // if (this._uichatlist.length < 1)
            //     this.playChatList();
        };
        //聊天窗口
        //把收到的消息列表显示出来
        ChatPortView.prototype.playChatList = function () {
            // _chatList
            for (var i = 0; i < this._chatModel.chatAllList.length; i++) {
                var item = new RichTextField;
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
        };
        //有新消息加入
        ChatPortView.prototype.playOneChat = function (data) {
            if (this._uichatlist.length > 100) {
                this._nextchatposiy -= this._uichatlist[0].height;
                for (var i = 0; i < this._uichatlist.length; i++) {
                    this._uichatlist[i].y -= this._uichatlist[0].height;
                    this.vp_chatlist.removeChild(this._uichatlist[0]);
                }
            }
            var item = new RichTextField;
            item.size = 18;
            //item.textFlow = ChatUtil.getChatPortText(data);
            item.textHtml = ChatUtil.getChatPortText(data);
            //item.maxWidth = 420;
            item.width = 400;
            item.lineSpacing = 10;
            this.vp_chatlist.addChild(item);
            item.$setY(this._nextchatposiy);
            item.x += 5;
            this._nextchatposiy += item.height + 10;
            this._uichatlist.push(item);
            this._uichatlist.shift();
            this.scr_chatlist.viewport.scrollV = this._nextchatposiy - this.scr_chatlist.height;
        };
        /**
                 * 打开窗口
                */
        ChatPortView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            game.ChatController.getInstance().getChatList();
            //聊天窗口
            if (this._eventid_chatlist == 0)
                this._eventid_chatlist = App.EventSystem.addEventListener(PanelNotify.CHAT_LIST_UPDATE, this.playChatList, this);
            if (this._eventid_onechat == 0) {
                this._eventid_onechat = App.EventSystem.addEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this.playOneChat, this);
            }
            this.x = 155;
            this.y = 945;
            if (this._uichatlist.length < 1)
                this.playChatList();
        };
        /**
         * 关闭窗口
         */
        ChatPortView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ChatPortView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            //清理聊天窗口事件
            if (this._eventid_chatlist != 0) {
                App.EventSystem.removeEventListener(PanelNotify.CHAT_LIST_UPDATE, this._eventid_chatlist);
                this._eventid_chatlist = 0;
            }
            if (this._eventid_onechat != 0) {
                App.EventSystem.removeEventListener(PanelNotify.CHAT_HAS_NEW_INFO, this._eventid_onechat);
                this._eventid_onechat = 0;
            }
        };
        /**
         * 销毁
         */
        ChatPortView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ChatPortView;
    }(BaseView));
    game.ChatPortView = ChatPortView;
    __reflect(ChatPortView.prototype, "game.ChatPortView");
})(game || (game = {}));
//# sourceMappingURL=ChatPortView.js.map