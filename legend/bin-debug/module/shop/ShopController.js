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
 * 商城控制器
 * author : zrj
*/
var game;
(function (game) {
    var ShopController = (function (_super) {
        __extends(ShopController, _super);
        function ShopController() {
            var _this = _super.call(this) || this;
            _this.shopModel = game.ShopModel.getInstance();
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        ShopController.prototype.initProtocol = function () {
            this.registerProtocal(16001, this.handleMysteryR, this);
            this.registerProtocal(16002, this.handleLimitR, this);
            this.registerProtocal(16003, this.handleBuyR, this);
            this.registerProtocal(16004, this.handleRefreshR, this);
        };
        /**
         * 神秘商店数据
         */
        ShopController.prototype.handleMysteryR = function (data) {
            App.logzrj("data  ", data);
            this.shopModel.updateMysterySopInfo(data);
            this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST, 1);
        };
        /**
         * 限购商店数据
         */
        ShopController.prototype.handleLimitR = function (data) {
            App.logzrj("data  ", data);
            this.shopModel.updateLimitSopInfo(data);
            this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST, ShopType.LIMIT);
        };
        /**
         * 购买物品返回
         */
        ShopController.prototype.handleBuyR = function (data) {
            App.logzrj("data  ", data);
            if (data.type == 1) {
                this.shopModel.deleteMysteryShopInfo(data);
                this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST, ShopType.MYSTERY);
            }
            else if (data.type == 2) {
                this.shopModel.handleLimitShopInfo(data);
                this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST, ShopType.LIMIT);
            }
            else {
                this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST, ShopType.NORMAL);
            }
        };
        /**
         * 刷新神秘商店数据
         */
        ShopController.prototype.handleRefreshR = function (data) {
            App.logzrj("data  ", data);
            this.shopModel.updateMysterySopInfo(data);
            this.dispatchEvent(PanelNotify.SHOP_UPDATE_LIST, ShopType.MYSTERY);
        };
        /**
         * 销毁
         */
        ShopController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        ShopController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return ShopController;
    }(BaseController));
    game.ShopController = ShopController;
    __reflect(ShopController.prototype, "game.ShopController");
})(game || (game = {}));
//# sourceMappingURL=ShopController.js.map