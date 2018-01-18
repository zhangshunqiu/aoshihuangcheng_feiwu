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
 * 福利控制器 2017/11/20.
 */
var game;
(function (game) {
    var WelfareController = (function (_super) {
        __extends(WelfareController, _super);
        function WelfareController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        WelfareController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            //等级奖励
            this.registerProtocal(22001, this.handleLevelUpInfo, this); //收到等级礼包信息
            this.registerProtocal(22002, this.handleGetLevelUpWelfare, this); //处理领取等级礼包
            this.registerProtocal(22003, this.handleLevelPackageNumChange, this);
        };
        WelfareController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        WelfareController.prototype.handleGetLevelUpWelfare = function (data) {
            App.loglh("handleMustDoList");
            App.Socket.send(22001, null);
        };
        WelfareController.prototype.handleLevelUpInfo = function (data) {
            App.loglh("handleMustDoList");
            game.WelfareModel.getInstance().getWelfareLvList(data);
            this.dispatchEvent(PanelNotify.WELFARE_UPDATELEVELLIST);
        };
        WelfareController.prototype.handleLevelPackageNumChange = function (data) {
            App.loglh("handleMustDoList");
            game.WelfareModel.getInstance().updateRewardLeftNum(data);
            this.dispatchEvent(PanelNotify.WELFARE_UPDATELEVELLIST);
        };
        /**
        * 销毁
        */
        WelfareController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        WelfareController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return WelfareController;
    }(BaseController));
    game.WelfareController = WelfareController;
    __reflect(WelfareController.prototype, "game.WelfareController");
})(game || (game = {}));
//# sourceMappingURL=WelfareController.js.map