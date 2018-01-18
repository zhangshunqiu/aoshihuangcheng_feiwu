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
 * module: 限购礼包
 * author : zrj
*/
var game;
(function (game) {
    var ActivityLimitGift = (function (_super) {
        __extends(ActivityLimitGift, _super);
        function ActivityLimitGift(skinName) {
            var _this = _super.call(this, skinName) || this;
            _this.list = new eui.List();
            _this.activityModel = game.ActivityModel.getInstance();
            _this._viewHandleId = 0;
            _this._countDown = 0;
            _this.skinName = "ActivityLimitGiftSkin";
            return _this;
        }
        ActivityLimitGift.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
            this.list.itemRenderer = ActivityLimitGiftItem;
            this.scroller.viewport = this.list;
            this.list.useVirtualLayout = true;
        };
        ActivityLimitGift.prototype.updateView = function () {
            var _this = this;
            var activityData = this.activityModel.limitGiftInfo;
            if (!this._dataArray) {
                this._dataArray = new eui.ArrayCollection(this.activityModel.limitGiftInfo.list);
                this.list.dataProvider = this._dataArray;
            }
            else {
                // this._dataArray.source = activityData;
                var offset = this.list.scrollV;
                this._dataArray.refresh();
                // this._dataArray.itemUpdated(2);
                this.list.validateNow();
                this.scroller.viewport.scrollV = offset;
            }
            //倒计时
            if (this._countDown) {
                App.GlobalTimer.remove(this._countDown);
                this._countDown = undefined;
            }
            this.lb_time.text = game.InvestUtil.getFormatBySecond1(this.activityModel.dailyRankInfo.left_time);
            this._countDown = App.GlobalTimer.addSchedule(1000, activityData.left_time, this.updateTime, this, function () {
                App.GlobalTimer.remove(_this._countDown);
                _this._countDown = undefined;
                App.Socket.send(30004, {});
            }, this);
        };
        ActivityLimitGift.prototype.updateTime = function () {
            this.activityModel.limitGiftInfo.left_time--;
            this.lb_time.text = game.InvestUtil.getFormatBySecond1(this.activityModel.limitGiftInfo.left_time);
        };
        /**
         * 打开窗口
         */
        ActivityLimitGift.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            // if (this._viewHandleId == 0) {
            // 	this._viewHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW,this.updateView,this);
            // }
            App.Socket.send(30004, {});
        };
        /**
         * 清理
         */
        ActivityLimitGift.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            // if (this._viewHandleId != 0) {
            // 	App.EventSystem.removeEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW,this._viewHandleId);
            // 	this._viewHandleId = 0;
            // }
            if (this._countDown) {
                App.GlobalTimer.remove(this._countDown);
                this._countDown = undefined;
            }
        };
        /**
         * 销毁
         */
        ActivityLimitGift.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ActivityLimitGift;
    }(BaseChildView));
    game.ActivityLimitGift = ActivityLimitGift;
    __reflect(ActivityLimitGift.prototype, "game.ActivityLimitGift");
    var ActivityLimitGiftItem = (function (_super) {
        __extends(ActivityLimitGiftItem, _super);
        function ActivityLimitGiftItem() {
            var _this = _super.call(this) || this;
            _this.activityModel = game.ActivityModel.getInstance();
            _this.skinName = "ActivityLimitGiftItemSkin";
            _this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(30005, { id: _this.data.id });
            }, _this);
            return _this;
        }
        ActivityLimitGiftItem.prototype.dataChanged = function () {
            var _this = this;
            var baseInfo = App.ConfigManager.getLimitGiftInfoById(this.data.id);
            var itemInfo = App.ConfigManager.getItemInfoById(baseInfo.goods);
            this.baseItem.updateBaseItem(ClientType.BASE_ITEM, baseInfo.goods, baseInfo.num);
            this.lb_name.text = itemInfo.name;
            this.lb_cur_price.text = String(Math.ceil(baseInfo.number * baseInfo.discount / 10));
            this.lb_origin_price.text = String(baseInfo.number);
            this.bmlb_discount.text = baseInfo.discount;
            if (baseInfo.money == CurrencyType.COIN) {
                RES.getResAsync("common_jinbi_png", function (texture) {
                    _this.img_gold.source = texture;
                    _this.img_gold1.source = texture;
                }, this);
            }
            else if (baseInfo.money == CurrencyType.GOLD) {
                RES.getResAsync("common_yuanbao_png", function (texture) {
                    _this.img_gold.source = texture;
                    _this.img_gold1.source = texture;
                }, this);
            }
            if (this.data.left_num == 0) {
                this.btn_buy.visible = false;
                this.img_txt.visible = false;
                this.lb_time.visible = false;
                this.img_have_buy.visible = true;
                this.btn_buy.touchEnabled = false;
                this.lb_time.textFlow = [{ text: "可购买：" }, { text: this.data.left_num + "", style: { textColor: 0xf10000 } }, { text: "/" + baseInfo.limit, style: { textColor: 0x00f829 } }];
            }
            else {
                this.btn_buy.visible = true;
                this.img_txt.visible = true;
                this.lb_time.visible = true;
                this.img_have_buy.visible = false;
                this.btn_buy.touchEnabled = true;
                this.lb_time.textFlow = [{ text: "可购买：" }, { text: this.data.left_num + "/" + baseInfo.limit, style: { textColor: 0x00f829 } }];
            }
        };
        return ActivityLimitGiftItem;
    }(eui.ItemRenderer));
    game.ActivityLimitGiftItem = ActivityLimitGiftItem;
    __reflect(ActivityLimitGiftItem.prototype, "game.ActivityLimitGiftItem");
})(game || (game = {}));
//# sourceMappingURL=ActivityLimitGift.js.map