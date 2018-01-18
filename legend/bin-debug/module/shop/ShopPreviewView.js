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
    var ShopPreviewView = (function (_super) {
        __extends(ShopPreviewView, _super);
        function ShopPreviewView(vo) {
            return _super.call(this, vo) || this;
        }
        ShopPreviewView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.scroller.verticalScrollBar.visible = false;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // WinManager.getInstance().closePopWin(WinName.POP_SHOP_PREVIEW);
            }, this);
        };
        /**
         * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
         */
        ShopPreviewView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            //展示极品
            var data = App.ConfigManager.normalShopConfig();
            for (var key in data) {
                var itemInfo = App.ConfigManager.itemConfig()[data[key]["goods"]];
                var baseItem = new customui.BaseItem();
                baseItem.updateBaseItem(1, data[key]["goods"], data[key]["num"]);
                baseItem.setItemNameVisible(true);
                this.gp_preview.addChild(baseItem);
                // this.shopBaseItem.updateBaseItem(1, this.data.goods, this.data.num);
            }
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        ShopPreviewView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        ShopPreviewView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ShopPreviewView;
    }(BaseView));
    game.ShopPreviewView = ShopPreviewView;
    __reflect(ShopPreviewView.prototype, "game.ShopPreviewView");
})(game || (game = {}));
//# sourceMappingURL=ShopPreviewView.js.map