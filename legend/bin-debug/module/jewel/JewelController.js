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
 * module : 宝石模块控制器
 * author : zrj
*/
var game;
(function (game) {
    var JewelController = (function (_super) {
        __extends(JewelController, _super);
        function JewelController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        JewelController.prototype.initProtocol = function () {
            this.registerProtocal(15008, this.handleJewelEquip, this);
            this.registerProtocal(15009, this.handleJewelUpgrade, this);
        };
        /**
         * 宝石合成
         */
        JewelController.prototype.handleJewelCombine = function (data) {
        };
        /**
         * 宝石一键镶嵌
         */
        JewelController.prototype.handleJewelEquip = function (data) {
            this.dispatchEvent(PanelNotify.JEWEL_UPDATE_ALL_VIEW, data);
        };
        /**
         * 宝石升级
         */
        JewelController.prototype.handleJewelUpgrade = function (data) {
            game.JewelModel.getInstance().checkCanUpgradeAll();
            this.dispatchEvent(PanelNotify.JEWEL_UPDATE_VIEW, data);
        };
        /**
         * 销毁
         */
        JewelController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        JewelController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return JewelController;
    }(BaseController));
    game.JewelController = JewelController;
    __reflect(JewelController.prototype, "game.JewelController");
})(game || (game = {}));
//# sourceMappingURL=JewelController.js.map