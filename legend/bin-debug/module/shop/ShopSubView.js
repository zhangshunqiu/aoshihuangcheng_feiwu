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
 * 商城子视图
 * author ： zrj
*/
var game;
(function (game) {
    //批量购买弹窗
    var ShopBuyWinView = (function (_super) {
        __extends(ShopBuyWinView, _super);
        /**
         * @param params 传构造参数 id：商品id   good_id:道具配置表的id   type：金钱类型  max：最大购买数量  price:单价  shopType:商店类型 num:图标内数量
        */
        function ShopBuyWinView(params) {
            var _this = _super.call(this, params) || this;
            _this.shopModel = game.ShopModel.getInstance();
            _this._num = 1;
            _this.count = 0; //计数器，记录数量
            _this._totalCount = 0; //总购买数量
            _this._timeId = 0;
            // this._id = params.id;
            // this._good_id = params.good_id;
            // this._type = params.type;
            // this._max = params.max;
            // this._price = params.price;
            // this._num = params.num;
            // this._shopType = params.shopType;
            _this.skinName = "ShopBuyWinSkin";
            return _this;
        }
        ShopBuyWinView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // App.EventSystem.dispatchEvent(PanelNotify.SHOP_CLOSE_BUY_WIN);
                // PopUpManager.removePopUp(this);
                App.WinManager.closeWin(WinName.POP_SHOP_BUY);
            }, this);
            // this.initView();
        };
        ShopBuyWinView.prototype.initView = function () {
            var _this = this;
            var itemInfo = App.ConfigManager.itemConfig()[this._good_id];
            this.lb_name.text = itemInfo.name;
            this.lb_desc.text = itemInfo.des;
            this.baseItem.updateBaseItem(1, this._good_id, this._num);
            this.lb_price.text = String(this._price);
            if (this._type == CurrencyType.COIN) {
                RES.getResAsync("common_jinbi_png", function (texture) {
                    _this.img_money.source = texture;
                    _this.img_money2.source = texture;
                }, this);
            }
            else {
                RES.getResAsync("common_yuanbao_png", function (texture) {
                    _this.img_money.source = texture;
                    _this.img_money2.source = texture;
                }, this);
            }
            this.addKeepEvent(this.img_add, 1);
            this.addKeepEvent(this.img_mind, -1);
            this.addKeepEvent(this.img_add10, 10);
            this.addKeepEvent(this.img_mind10, -10);
            //+1
            this.img_add.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.calculate(1);
            }, this);
            //-1
            this.img_mind.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.calculate(-1);
            }, this);
            //+10
            this.img_add10.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.calculate(10);
            }, this);
            //-10
            this.img_mind10.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.calculate(-10);
            }, this);
            this.img_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(16003, { type: _this._shopType, id: _this._id, num: _this._totalCount });
            }, this);
            //默认是一个
            this.calculate(1);
        };
        ShopBuyWinView.prototype.addKeepEvent = function (obj, value) {
            var _this = this;
            obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
                var time = new Date().getTime();
                _this._timeId = App.GlobalTimer.addSchedule(100, 0, function () {
                    if (new Date().getTime() - time > 300) {
                        _this.calculate(value);
                    }
                }, _this);
            }, this);
            obj.addEventListener(egret.TouchEvent.TOUCH_END, function () {
                if (_this._timeId != 0) {
                    App.GlobalTimer.remove(_this._timeId);
                }
            }, this);
            obj.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function (event) {
                if (_this._timeId != 0) {
                    App.GlobalTimer.remove(_this._timeId);
                }
            }, this);
            obj.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this._timeId != 0) {
                    App.GlobalTimer.remove(_this._timeId);
                }
            }, this);
            obj.addEventListener(egret.TouchEvent.TOUCH_CANCEL, function () {
                if (_this._timeId != 0) {
                    App.GlobalTimer.remove(_this._timeId);
                }
            }, this);
        };
        ShopBuyWinView.prototype.calculate = function (num) {
            var totalCount = this.count + num;
            if (totalCount <= 0) {
                totalCount = 1;
            }
            else if (this._max && totalCount > this._max) {
                totalCount = this._max;
            }
            totalCount = this.autoMax(totalCount);
            this.count = totalCount;
            this.lb_total.text = String(totalCount * this._price);
            this.lb_count.text = totalCount;
            this._totalCount = totalCount;
        };
        //自动计算到可买最大数量
        ShopBuyWinView.prototype.autoMax = function (totalCount) {
            for (var i = totalCount; i >= 1; i--) {
                if (this._type == CurrencyType.COIN) {
                    if (i * this._price <= App.RoleManager.roleWealthInfo.coin) {
                        return i;
                    }
                }
                else if (this._type == CurrencyType.GOLD) {
                    if (i * this._price <= App.RoleManager.roleWealthInfo.gold) {
                        return i;
                    }
                }
            }
            return 1;
        };
        /**
         * 打开窗口
         */
        ShopBuyWinView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._id = openParam.data.id;
            this._good_id = openParam.data.good_id;
            this._type = openParam.data.type;
            this._max = openParam.data.max;
            this._price = openParam.data.price;
            this._num = openParam.data.num;
            this._shopType = openParam.data.shopType;
            this.initView();
        };
        /**
         * 关闭窗口
         */
        ShopBuyWinView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ShopBuyWinView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        ShopBuyWinView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ShopBuyWinView;
    }(BaseView));
    game.ShopBuyWinView = ShopBuyWinView;
    __reflect(ShopBuyWinView.prototype, "game.ShopBuyWinView");
})(game || (game = {}));
//# sourceMappingURL=ShopSubView.js.map