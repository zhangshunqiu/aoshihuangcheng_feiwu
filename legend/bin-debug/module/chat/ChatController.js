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
 * lihe 聊天系统控制层
 */
var game;
(function (game) {
    var ChatController = (function (_super) {
        __extends(ChatController, _super);
        function ChatController() {
            var _this = _super.call(this) || this;
            _this._linkEventId = 0;
            _this._equip_id = 0;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        ChatController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(17001, this.handleChatList, this);
            this.registerProtocal(17003, this.handleOneChat, this);
            this.registerProtocal(17005, this.handlerEquipInfo, this);
        };
        /**
         * 初始化事件监听
         */
        ChatController.prototype.initEventListener = function () {
            if (this._linkEventId == 0) {
                this.addEventListener(RichTextField.LINK_EVENT, this.onClickTextLink, this);
            }
        };
        /**
         * 文本链接点击事件
         */
        ChatController.prototype.onClickTextLink = function (str) {
            var strs = str.split("_");
            switch (strs[0]) {
                case "skip":
                    MainModuleJump.jumpToModule(parseInt(strs[1]));
                    break;
                case "item":
                    App.GlobalTips.showItemTips(ClientType.BASE_ITEM, parseInt(strs[1]), null);
                    break;
                case "equip":
                    this._equip_id = parseInt(strs[1]);
                    App.Socket.send(17005, { id: parseInt(strs[1]) });
                    break;
            }
        };
        ChatController.prototype.handleChatList = function (data) {
            App.loglh("receiveChatList data :");
            game.ChatModel.getInstance().getChatList(data);
            if (data.channel == 1)
                this.dispatchEvent(PanelNotify.CHAT_LIST_UPDATE);
        };
        ChatController.prototype.handleOneChat = function (data) {
            App.loglh("receiveOneChat data :", data.channel, data.msg.content);
            game.ChatModel.getInstance().getOneChat(data);
            this.dispatchEvent(PanelNotify.CHAT_HAS_NEW_INFO, game.ChatModel.getInstance().getChatVo(data.channel, data.msg));
            if ((data.channel - 1) != ChatType.SYSTEM && App.WinManager.isOpen(WinName.CHAT) == false) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.CHAT, true);
            }
        };
        ChatController.prototype.handlerEquipInfo = function (data) {
            game.ChatModel.getInstance().getEquipInfo(data);
            App.GlobalTips.showItemTips(ClientType.EQUIP, data.good_id, data.id, data);
        };
        ChatController.prototype.getChatList = function () {
            if (!this._isApplyList) {
                //聊天系统请求数据
                App.Socket.send(17001, { page: 1, channel: 1 });
                egret.setTimeout(function () { App.Socket.send(17001, { page: 1, channel: 2 }); }, this, 100);
                egret.setTimeout(function () { App.Socket.send(17001, { page: 1, channel: 3 }); }, this, 200);
                egret.setTimeout(function () { App.Socket.send(17001, { page: 1, channel: 4 }); }, this, 400);
                this._isApplyList = true;
            }
        }; /**
         * 销毁
         */
        ChatController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (this._linkEventId != 0) {
                this.removeEventListener(RichTextField.LINK_EVENT, this._linkEventId);
                this._linkEventId = 0;
            }
        };
        /**
         * 清理
         */
        ChatController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return ChatController;
    }(BaseController));
    game.ChatController = ChatController;
    __reflect(ChatController.prototype, "game.ChatController");
})(game || (game = {}));
//# sourceMappingURL=ChatController.js.map