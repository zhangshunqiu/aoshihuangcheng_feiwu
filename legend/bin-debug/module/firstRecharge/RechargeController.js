/**
 * Author: yangyipeng                 （必须加上，知道是谁做的）
 * 充值模块控制器 2017/06/20.
 */
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
var game;
(function (game) {
    var RechargeController = (function (_super) {
        __extends(RechargeController, _super);
        function RechargeController() {
            var _this = _super.call(this) || this;
            _this._rechargeModel = game.RechargeModel.getInstance();
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化事件监听
         */
        RechargeController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 初始化协议
         */
        RechargeController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(28001, this.handlerFirstRecharge, this); //领取首充奖励 成功返回1 失败错误提示 
            this.registerProtocal(28002, this.handlerRechargeViewData, this); //常规充值界面 (vip等级 再充x元宝升级vip  充值列表)
            this.registerProtocal(28003, this.handlerFirstRechargeState, this); //获取首充状态  0未首充 1已充未领奖励 2已领奖励
        };
        /**
         * 领取首充奖励 成功返回1 失败错误提示
         */
        RechargeController.prototype.handlerFirstRecharge = function (data) {
            if (data.result) {
                App.Socket.send(28003, {});
                if (WinManager.getInstance().isOpen(WinName.RECHARGE_FIRST)) {
                    WinManager.getInstance().closeWin(WinName.RECHARGE_FIRST);
                }
            }
        };
        /**
         * 常规充值界面
         */
        RechargeController.prototype.handlerRechargeViewData = function (data) {
            this._rechargeModel.updateRechargeViewData(data);
            this.dispatchEvent(PanelNotify.RECHARGE_INFO_UPDATE);
        };
        /**
         * 获取首充状态
         */
        RechargeController.prototype.handlerFirstRechargeState = function (data) {
            RoleManager.getInstance().roleInfo.first_charge = data.result; //0未首充 1已充未领奖励 2已领奖励
            if (data.result == 2) {
                App.EventSystem.dispatchEvent(PanelNotify.REMOVE_TOP_BTN, MainUIBtnType.FIRSTCHARGE);
            }
        };
        /**
         * 清理
         */
        RechargeController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        RechargeController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return RechargeController;
    }(BaseController));
    game.RechargeController = RechargeController;
    __reflect(RechargeController.prototype, "game.RechargeController");
})(game || (game = {}));
//# sourceMappingURL=RechargeController.js.map