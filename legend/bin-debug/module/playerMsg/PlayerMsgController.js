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
 * Author: yangyipeng
 * 查看玩家信息模块控制器
 */
var game;
(function (game) {
    var PlayerMsgController = (function (_super) {
        __extends(PlayerMsgController, _super);
        function PlayerMsgController() {
            var _this = _super.call(this) || this;
            _this._broadEventId = 0;
            _this._broadEventName = "zzz";
            _this._playerMsgModel = game.PlayerMsgModel.getInstance();
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化事件监听
         */
        PlayerMsgController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 初始化协议
         */
        PlayerMsgController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            //协议监听示范 ,唯一，只能再一个地方监听
            this.registerProtocal(15030, this.handlerPlayMsg, this);
        };
        PlayerMsgController.prototype.handlerPlayMsg = function (data) {
            this._playerMsgModel.updateData(data);
            this.dispatchEvent(PanelNotify.PLAYER_MSG_INQUIRE);
        };
        /**
         * 清理
         */
        PlayerMsgController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        PlayerMsgController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return PlayerMsgController;
    }(BaseController));
    game.PlayerMsgController = PlayerMsgController;
    __reflect(PlayerMsgController.prototype, "game.PlayerMsgController");
})(game || (game = {}));
//# sourceMappingURL=PlayerMsgController.js.map