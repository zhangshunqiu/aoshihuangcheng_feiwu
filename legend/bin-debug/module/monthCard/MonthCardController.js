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
 * Author: liuyonggen
 * 月卡系统控制模块 2017/11/24
 */
var game;
(function (game) {
    var MonthCardController = (function (_super) {
        __extends(MonthCardController, _super);
        function MonthCardController() {
            var _this = _super.call(this) || this;
            _this._eventId = 0;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        MonthCardController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(25001, this.handlerMonthCardInterface, this);
            this.registerProtocal(25002, this.handlerMonthCardGetReward, this);
            this.registerProtocal(25003, this.handlerBuyMonthCardNum, this);
        };
        MonthCardController.prototype.handlerMonthCardInterface = function (data) {
            game.MonthCardModel.getInstance().updateInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.MONTHCARD_INFO_UPDATE);
        };
        MonthCardController.prototype.handlerMonthCardGetReward = function (data) {
            if (data.result) {
                this.dispatchEvent(PanelNotify.MONTHCARD_GET_SUCCESS);
            }
        };
        MonthCardController.prototype.handlerBuyMonthCardNum = function (data) {
            game.MonthCardModel.getInstance().updateBuyNum(data.result);
            App.WinManager.openWin(WinName.MONTHCARD_BUY_REWARD);
        };
        /**
        * 初始化事件监听
        */
        MonthCardController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 清理
         */
        MonthCardController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        MonthCardController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return MonthCardController;
    }(BaseController));
    game.MonthCardController = MonthCardController;
    __reflect(MonthCardController.prototype, "game.MonthCardController");
})(game || (game = {}));
//# sourceMappingURL=MonthCardController.js.map