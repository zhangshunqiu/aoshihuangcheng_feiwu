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
 * 商城数据模型
 * author : zrj
*/
var game;
(function (game) {
    var ShopModel = (function (_super) {
        __extends(ShopModel, _super);
        function ShopModel() {
            var _this = _super.call(this) || this;
            _this.mysteryShop = []; //神秘商城
            _this.limitShop = []; //限购商城
            _this.normalShop = []; //神秘商城
            _this.limitNum = 1; //限购商店当前批次
            return _this;
        }
        ShopModel.prototype.updateMysterySopInfo = function (data) {
            this.mysteryShop = data.shop;
            this.leftTime = data.left_time;
            this.refreshNum = data.refresh_num;
        };
        ShopModel.prototype.updateLimitSopInfo = function (data) {
            this.limitShop = data.shop_buy;
            this.limitLeftTime = data.left_time;
            this.limitNum = data.num;
        };
        ShopModel.prototype.getLimitInfoById = function (id) {
            for (var i = 0; i < this.limitShop.length; i++) {
                if (this.limitShop[i].id == id) {
                    return this.limitShop[i];
                }
            }
        };
        //删除神秘商店已购买
        ShopModel.prototype.deleteMysteryShopInfo = function (data) {
            for (var key = 0; key < this.mysteryShop.length; key++) {
                var info = this.mysteryShop[key];
                if (this.mysteryShop[key].id == data.id) {
                    this.mysteryShop.splice(key, 1);
                    break;
                }
            }
        };
        //更新限购商店已购买
        ShopModel.prototype.handleLimitShopInfo = function (data) {
            var exist = false;
            for (var key = 0; key < this.limitShop.length; key++) {
                var info = this.limitShop[key];
                if (this.limitShop[key].id == data.id) {
                    exist = true;
                    this.limitShop[key].limit += data.num;
                    break;
                }
            }
            if (!exist) {
                this.limitShop.push({ id: data.id, limit: data.num });
            }
        };
        // public updateNormalSopInfo(data) {
        // }
        ShopModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        ShopModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ShopModel;
    }(BaseModel));
    game.ShopModel = ShopModel;
    __reflect(ShopModel.prototype, "game.ShopModel");
})(game || (game = {}));
//# sourceMappingURL=ShopModel.js.map