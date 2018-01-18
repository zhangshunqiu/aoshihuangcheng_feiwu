/**
 * module : 背包模块控制器
 * author ：zrj
 *
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
    var BackpackController = (function (_super) {
        __extends(BackpackController, _super);
        function BackpackController() {
            var _this = _super.call(this) || this;
            _this.backpackModel = game.BackpackModel.getInstance();
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        BackpackController.prototype.initProtocol = function () {
            this.registerProtocal(14001, this.receiveGoodList, this);
            this.registerProtocal(14002, this.updateGoodList, this);
            this.registerProtocal(14003, this.backpackChangedR, this);
            this.registerProtocal(14004, this.backpackChangedR, this);
        };
        //获取背包列表
        BackpackController.prototype.receiveGoodList = function (data) {
            this.backpackModel.updateBackpack(data);
            App.EventSystem.dispatchEvent(PanelNotify.HERO_ON_HERO_BAG_UPDATE);
        };
        //更新背包列表
        BackpackController.prototype.updateGoodList = function (data) {
            // App.logzrj("data:",data);
            this.backpackModel.updateBackpackItemInfo(data.playergoods);
            App.EventSystem.dispatchEvent(PanelNotify.HERO_ON_HERO_BAG_UPDATE);
        };
        //使用 出售物品
        BackpackController.prototype.backpackChangedR = function (data) {
            App.EventSystem.dispatchEvent(PanelNotify.HERO_ON_HERO_BAG_UPDATE);
        };
        /**
         * 销毁
         */
        BackpackController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        BackpackController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return BackpackController;
    }(BaseController));
    game.BackpackController = BackpackController;
    __reflect(BackpackController.prototype, "game.BackpackController");
})(game || (game = {}));
//# sourceMappingURL=BackpackController.js.map