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
 * Email： 506977655@qq.com
 * 签到控制器 2017/11/20.
 */
var game;
(function (game) {
    var SignController = (function (_super) {
        __extends(SignController, _super);
        function SignController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            _this._signModel = game.SignModel.getInstance();
            return _this;
        }
        /**
         * 初始化事件监听
         */
        SignController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 初始化协议
         */
        SignController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(23001, this.signViewDataBack, this);
            this.registerProtocal(23002, this.signReturn, this);
            this.registerProtocal(23003, this.resignReturn, this);
            this.registerProtocal(23004, this.rewardReturn, this);
            this.registerProtocal(23005, this.rewardRefresh, this);
            //协议发送示范
            //this.sendProtocal(1000,{})
        };
        /**
         * 请求签到界面数据
         */
        SignController.prototype.signViewDataBack = function (data) {
            this._signModel.setSignViewData(data);
            // this._signModel.rewardDayInit();
            App.EventSystem.dispatchEvent(PanelNotify.SIGN_INFO_UPDATE);
            this.updateSignRewardTips();
        };
        /**
         * 更新签到奖励提示
         */
        SignController.prototype.updateSignRewardTips = function () {
            if (this._signModel.hasSignReward()) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.WELFARE_SIGN, true);
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.WELFARE_SIGN, false);
            }
        };
        /**
         * 签到返回
         */
        SignController.prototype.signReturn = function (data) {
            if (data.result) {
                //成功
                App.Socket.send(23001, {});
            }
            else {
                //失败
                console.log("失败");
            }
            // this._signModel.setSign(data);
        };
        /**
         * 补签返回
         */
        SignController.prototype.resignReturn = function (data) {
            if (data.result) {
                //成功
                App.Socket.send(23001, {});
            }
            else {
                //失败
                console.log("失败");
            }
            // this._signModel.setResign(data);
        };
        /**
         * 领取额外奖励返回
         */
        SignController.prototype.rewardReturn = function (data) {
            if (data.result) {
                App.Socket.send(23001, {});
            }
            else {
                //失败
                console.log("失败");
            }
            //  this._signModel.setRewardStatus(data);
        };
        /**
         * 签到物品刷新返回
         */
        SignController.prototype.rewardRefresh = function (data) {
            // this._signModel.signItemRefresh(data);
            App.Socket.send(23001, {});
        };
        /**
         * 清理
         */
        SignController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        SignController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            //销毁处理
        };
        return SignController;
    }(BaseController));
    game.SignController = SignController;
    __reflect(SignController.prototype, "game.SignController");
})(game || (game = {}));
//# sourceMappingURL=SignController.js.map