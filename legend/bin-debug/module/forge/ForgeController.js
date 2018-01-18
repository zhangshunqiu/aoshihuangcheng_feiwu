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
 * module : 锻造模块控制器
 * author : zrj
*/
var game;
(function (game) {
    var ForgeController = (function (_super) {
        __extends(ForgeController, _super);
        function ForgeController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        ForgeController.prototype.initProtocol = function () {
            this.registerProtocal(15004, this.handleForgeR, this);
            this.registerProtocal(15005, this.handleFastForgeR, this);
            this.registerProtocal(15006, this.handleForgeStarR, this);
        };
        /**
         * 强化武器部位
        */
        ForgeController.prototype.handleForgeR = function (data) {
            App.logzrj("handleForgeR", data);
            game.ForgeModel.getInstance().updateStrengthPart(data);
            this.dispatchEvent(PanelNotify.FORGE_STRENGTH_EQUIP);
        };
        /**
         * 一件强化武器部位
        */
        ForgeController.prototype.handleFastForgeR = function (data) {
            App.logzrj("handleFastForgeR", data);
            game.ForgeModel.getInstance().updateStrengthPart(data);
            this.dispatchEvent(PanelNotify.FORGE_STRENGTH_EQUIP);
        };
        /**
         * 武器部位升星
        */
        ForgeController.prototype.handleForgeStarR = function (data) {
            App.logzrj("handleForgeStarR", data);
            game.ForgeModel.getInstance().updateStarPart(data);
            this.dispatchEvent(PanelNotify.FORGE_STAR_EQUIP);
        };
        /**
         * 销毁
         */
        ForgeController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        ForgeController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return ForgeController;
    }(BaseController));
    game.ForgeController = ForgeController;
    __reflect(ForgeController.prototype, "game.ForgeController");
})(game || (game = {}));
//# sourceMappingURL=ForgeController.js.map