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
 * 转生模块控制器
 * ahthor : zrj
*/
var game;
(function (game) {
    var RebornController = (function (_super) {
        __extends(RebornController, _super);
        function RebornController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        RebornController.prototype.initProtocol = function () {
            this.registerProtocal(20001, this.handleRebornR, this);
            this.registerProtocal(20002, this.handleRebornInfoR, this);
            this.registerProtocal(20003, this.handleRebornExchangeR, this);
        };
        /**
         * 转生
         */
        RebornController.prototype.handleRebornR = function (data) {
            // App.logzrj("data: ",data);
            game.RebornModel.getInstance().checkCanReborn();
            this.dispatchEvent(PanelNotify.REBORN_SUCCESS);
            this.dispatchEvent(PanelNotify.REBORN_UPDATE_VIEW);
        };
        /**
         * 转生兑换信息
         */
        RebornController.prototype.handleRebornInfoR = function (data) {
            App.logzrj("data: ", data);
            game.RebornModel.getInstance().exchangeInfo = data.get_life_exp_list;
            game.RebornModel.getInstance().checkCanReborn();
            this.dispatchEvent(PanelNotify.REBORN_UPDATE_INFO_VIEW);
        };
        /**
         * 转生兑换
         */
        RebornController.prototype.handleRebornExchangeR = function (data) {
            // App.logzrj("data: ",data);
            this.dispatchEvent(PanelNotify.REBORN_UPDATE_VIEW);
            this.dispatchEvent(PanelNotify.REBORN_UPDATE_INFO_VIEW);
        };
        /**
         * 销毁
         */
        RebornController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        RebornController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return RebornController;
    }(BaseController));
    game.RebornController = RebornController;
    __reflect(RebornController.prototype, "game.RebornController");
})(game || (game = {}));
//# sourceMappingURL=RebornController.js.map