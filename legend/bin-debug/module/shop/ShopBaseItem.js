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
var ShopBaseItem = (function (_super) {
    __extends(ShopBaseItem, _super);
    function ShopBaseItem(id) {
        return _super.call(this, id) || this;
    }
    ShopBaseItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.img_discount = new eui.Image();
        this.addChild(this.img_discount);
        this.img_discount.left = 10;
        this.img_discount.top = 5;
    };
    ShopBaseItem.prototype.setDiscountIcon = function (icon) {
        var _this = this;
        if (icon) {
            RES.getResAsync(icon + "_png", function (texture) {
                if (_this.img_discount) {
                    _this.img_discount.source = texture;
                }
            }, this);
        }
        else {
            this.img_discount.source = null;
        }
    };
    return ShopBaseItem;
}(customui.BaseItem));
__reflect(ShopBaseItem.prototype, "ShopBaseItem");
//# sourceMappingURL=ShopBaseItem.js.map