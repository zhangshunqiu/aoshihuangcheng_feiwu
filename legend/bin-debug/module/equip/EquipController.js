/**
 * module : 装备模块控制器
 * author : zrj
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
    var EquipController = (function (_super) {
        __extends(EquipController, _super);
        function EquipController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        EquipController.prototype.initProtocol = function () {
        };
        /**
         * 销毁
         */
        EquipController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        EquipController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return EquipController;
    }(BaseController));
    game.EquipController = EquipController;
    __reflect(EquipController.prototype, "game.EquipController");
})(game || (game = {}));
//# sourceMappingURL=EquipController.js.map