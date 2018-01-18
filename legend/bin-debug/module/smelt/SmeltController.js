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
 * 熔炼控制器
 * author ： zrj
*/
var game;
(function (game) {
    var SmeltController = (function (_super) {
        __extends(SmeltController, _super);
        function SmeltController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        SmeltController.prototype.initProtocol = function () {
            this.registerProtocal(14011, this.handleSmeltR, this);
            this.registerProtocal(14015, this.handleOrangeSmeltR, this);
        };
        SmeltController.prototype.handleSmeltR = function (data) {
            // console.log("dispatchEvent smelt");
            this.dispatchEvent(PanelNotify.SMELT_SMELT_EQUIP);
        };
        //橙装熔炼返回
        SmeltController.prototype.handleOrangeSmeltR = function (data) {
            this.dispatchEvent(PanelNotify.SMELT_ORANGE_EQUIP);
        };
        /**
         * 销毁
         */
        SmeltController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        SmeltController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return SmeltController;
    }(BaseController));
    game.SmeltController = SmeltController;
    __reflect(SmeltController.prototype, "game.SmeltController");
})(game || (game = {}));
//# sourceMappingURL=SmeltController.js.map