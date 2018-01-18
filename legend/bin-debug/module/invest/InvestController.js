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
 * 投资模块控制器 2017/06/20.
 */
var game;
(function (game) {
    var InvestController = (function (_super) {
        __extends(InvestController, _super);
        function InvestController() {
            var _this = _super.call(this) || this;
            _this._investModel = game.InvestModel.getInstance();
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
        * 初始化事件监听
        */
        InvestController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 初始化协议
         */
        InvestController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(34001, this.handlerInvestData, this);
            this.registerProtocal(34002, this.handlerInvestResult, this);
            this.registerProtocal(34003, this.handlerGetReward, this);
        };
        /**
         * 投资信息返回
         */
        InvestController.prototype.handlerInvestData = function (data) {
            this._investModel.investDataUpdate(data);
            if (data["left_time"] <= 0) {
                this.dispatchEvent(PanelNotify.REMOVE_TOP_BTN, MainUIBtnType.INVEST);
            }
            else {
                this.dispatchEvent(PanelNotify.INVEST_INFO_UPDATE);
            }
        };
        /**
         * 点击投资购买返回
         */
        InvestController.prototype.handlerInvestResult = function (data) {
            this._investModel.investBuy(data);
            this.dispatchEvent(PanelNotify.INVEST_INFO_UPDATE);
        };
        /**
         * 领取投资奖励返回
         */
        InvestController.prototype.handlerGetReward = function (data) {
            this._investModel.investReward(data.id);
            // this.dispatchEvent(PanelNotify.INVEST_INFO_UPDATE);
        };
        /**
         * 清理
         */
        InvestController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        InvestController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return InvestController;
    }(BaseController));
    game.InvestController = InvestController;
    __reflect(InvestController.prototype, "game.InvestController");
})(game || (game = {}));
//# sourceMappingURL=InvestController.js.map