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
 *  2017/06/20.
 * 聊天查看屏蔽界面
 */
var game;
(function (game) {
    /**
     *
     */
    var ChatIconTipsView = (function (_super) {
        __extends(ChatIconTipsView, _super);
        function ChatIconTipsView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._chatModel = game.ChatModel.getInstance();
            return _this;
        }
        ChatIconTipsView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.rect_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                game.ChatModel.getInstance().selectPlayerName = "";
                game.ChatModel.getInstance().selectPlayerId = 0;
                App.WinManager.closeWin(WinName.CHAT_ICON_TIP);
            }, this);
            this.btn_view.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openPopWin(WinName.POP_PLAYER_MSG, _this._chatModel.selectPlayerId);
            }, this);
            this.btn_deny.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var okCB = function (selected) {
                    App.Socket.send(17004, { player_id: this._chatModel.selectPlayerId });
                };
                var textFlow = [{ text: "是否屏蔽玩家", style: { textColor: 0xee3b01, size: 20 } },
                    { text: _this._chatModel.selectPlayerName + "\n", style: { underline: true, textColor: 0x01acfe, size: 20 } },
                    { text: "提示：屏蔽只对此次登陆有效", style: { textColor: 0xf87500, size: 18 } }];
                App.GlobalTips.showAlert({ style: 0 /* COMMON */, textFlow: textFlow, okCB: okCB, context: _this, needCheckBox: false });
            }, this);
        };
        /**
                 * 打开窗口
                */
        ChatIconTipsView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam && openParam.x) {
                this.gp_item.x = openParam.x;
            }
            if (openParam && openParam.y) {
                this.gp_item.y = openParam.y;
            }
        };
        /**
         * 关闭窗口
         */
        ChatIconTipsView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ChatIconTipsView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        ChatIconTipsView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ChatIconTipsView;
    }(BaseView));
    game.ChatIconTipsView = ChatIconTipsView;
    __reflect(ChatIconTipsView.prototype, "game.ChatIconTipsView");
})(game || (game = {}));
//# sourceMappingURL=ChatIconTipsView.js.map