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
 * 副本模块主控制器 2017/11/27
 */
var game;
(function (game) {
    var CopyController = (function (_super) {
        __extends(CopyController, _super);
        function CopyController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        CopyController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(31001, this.handlerGetCopyInfo, this);
            this.registerProtocal(31002, this.handlerChallengeCopy, this);
            this.registerProtocal(31003, this.handlerSweepCopy, this);
        };
        /**
         * 获取副本信息
         */
        CopyController.prototype.handlerGetCopyInfo = function (data) {
            game.CopyModel.getInstance().updateInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.COPY_INFO_UPDATE, data.type);
        };
        /**
         * 请求挑战副本
         */
        CopyController.prototype.handlerChallengeCopy = function (data) {
            this.dispatchEvent(PanelNotify.COPY_ASK_CHALLENGE_RESULT);
        };
        /**
         * 扫荡副本
         */
        CopyController.prototype.handlerSweepCopy = function (data) {
            game.BossModel.getInstance().dropItem = data.list;
            App.WinManager.openWin(WinName.BOSS_WIN, "copySweep");
            this.dispatchEvent(PanelNotify.COPY_ASK_CHALLENGE_RESULT);
        };
        /**
         * 初始化事件监听
         */
        CopyController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 销毁
         */
        CopyController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        CopyController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return CopyController;
    }(BaseController));
    game.CopyController = CopyController;
    __reflect(CopyController.prototype, "game.CopyController");
})(game || (game = {}));
//# sourceMappingURL=CopyController.js.map