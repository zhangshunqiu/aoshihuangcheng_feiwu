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
 * module: 每日竞技
 * author : liuyonggen
*/
var game;
(function (game) {
    var ActivityPreferentialGift = (function (_super) {
        __extends(ActivityPreferentialGift, _super);
        function ActivityPreferentialGift(skinName) {
            var _this = _super.call(this, skinName) || this;
            _this._timer = 0; // 定时器id
            _this._currentIndex = 0;
            _this._activityModel = game.ActivityModel.getInstance();
            _this.skinName = "ActivityPreferentialGift";
            return _this;
        }
        ActivityPreferentialGift.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            var _loop_1 = function (i) {
                this_1["gp_gift" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    _this._currentIndex = i;
                    _this.updateView();
                }, this_1);
            };
            var this_1 = this;
            for (var i = 0; i < 4; i++) {
                _loop_1(i);
            }
            this.list.itemRenderer = backpackItem;
            var layout = new eui.TileLayout();
            layout.requestedColumnCount = 3;
            layout.verticalGap = 15;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            this.list.layout = layout;
            this.list.dataProvider = new eui.ArrayCollection([]);
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
            this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(30007, { id: _this._currentIndex + 1 });
            }, this);
        };
        ActivityPreferentialGift.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        };
        ActivityPreferentialGift.prototype.updateView = function () {
            var info = App.ConfigManager.getRechargeGiftInfoById(this._currentIndex + 1);
            this.lb_gold.text = info.gold;
            this.lb_name.text = info.name;
            this.img_display.source = info.icon + "_png";
            this.list.dataProvider = new eui.ArrayCollection(info.reward);
            this.updateTime();
            if (this._activityModel.perferentialGiftInfo.list[this._currentIndex].state == 1) {
                this.btn_buy.currentState = "up";
                this.img_buy.visible = true;
                this.img_alreadyBuy.visible = false;
            }
            else {
                this.btn_buy.currentState = "down";
                this.img_alreadyBuy.visible = true;
                this.img_buy.visible = false;
            }
        };
        ActivityPreferentialGift.prototype.updateTime = function () {
            this.lb_day.text = Math.floor(this._activityModel.perferentialGiftInfo.left_time / (3600 * 24)) + "";
            this.lb_hour.text = Math.floor((this._activityModel.perferentialGiftInfo.left_time / 3600) % 24) + "";
            this.lb_minute.text = Math.floor((this._activityModel.perferentialGiftInfo.left_time / 60) % 60) + "";
        };
        /**
         * 打开窗口
         */
        ActivityPreferentialGift.prototype.open = function (openParam) {
            var _this = this;
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            App.Socket.send(30006, {});
            if (this._timer == 0) {
                this._timer = App.GlobalTimer.addSchedule(60000, 0, function () {
                    _this._activityModel.perferentialGiftInfo.left_time -= 60;
                    _this.updateTime();
                }, this);
            }
        };
        /**
         * 清理
         */
        ActivityPreferentialGift.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._timer != 0) {
                App.GlobalTimer.remove(this._timer);
                this._timer = 0;
            }
        };
        /**
         * 销毁
         */
        ActivityPreferentialGift.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ActivityPreferentialGift;
    }(BaseChildView));
    game.ActivityPreferentialGift = ActivityPreferentialGift;
    __reflect(ActivityPreferentialGift.prototype, "game.ActivityPreferentialGift");
    var backpackItem = (function (_super) {
        __extends(backpackItem, _super);
        function backpackItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"backpackItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"90\" height=\"90\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
            _this.baseItem.setItemNameVisible(true);
            _this.baseItem.setItemNumVisible(false);
            return _this;
        }
        backpackItem.prototype.dataChanged = function () {
            this.baseItem.updateBaseItem(this.data[0], this.data[1], this.data[2]);
        };
        return backpackItem;
    }(eui.ItemRenderer));
    __reflect(backpackItem.prototype, "backpackItem");
})(game || (game = {}));
//# sourceMappingURL=ActivityPreferentialGift.js.map