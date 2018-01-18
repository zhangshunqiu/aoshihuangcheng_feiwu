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
 * module: 连续充值
 * author : zrj
*/
var game;
(function (game) {
    var ActivityContinueRecharge = (function (_super) {
        __extends(ActivityContinueRecharge, _super);
        function ActivityContinueRecharge(skinName) {
            var _this = _super.call(this, skinName) || this;
            _this.list = new eui.List();
            _this.activityModel = game.ActivityModel.getInstance();
            _this._viewHandleId = 0;
            _this._countDown = 0;
            _this.skinName = "ActivityContinueRechargeSkin";
            return _this;
        }
        ActivityContinueRecharge.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
            this.list.itemRenderer = ActivityContinueRechargeItem;
            this.scroller.viewport = this.list;
            this.btn_rechange.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                game.RechargeOpenManager.getInstance().openRechargeView();
            }, this);
        };
        ActivityContinueRecharge.prototype.updateView = function () {
            var _this = this;
            var activityData = this.activityModel.continueRechargeInfo;
            if (!this._dataArray) {
                this._dataArray = new eui.ArrayCollection(this.activityModel.continueRechargeInfo.list);
                this.list.dataProvider = this._dataArray;
            }
            else {
                // this._dataArray.source = activityData;
                // this._dataArray.refresh();
                this._dataArray = new eui.ArrayCollection(this.activityModel.continueRechargeInfo.list);
                this.list.dataProvider = this._dataArray;
            }
            //倒计时
            if (this._countDown) {
                App.GlobalTimer.remove(this._countDown);
                this._countDown = undefined;
            }
            this.lb_time.text = game.InvestUtil.getFormatBySecond1(this.activityModel.continueRechargeInfo.left_time);
            this._countDown = App.GlobalTimer.addSchedule(1000, activityData.left_time, this.updateTime, this, function () {
                App.GlobalTimer.remove(_this._countDown);
                _this._countDown = undefined;
                App.Socket.send(30012, {});
            }, this);
            this.lb_have_day.text = "已达成" + this.activityModel.continueRechargeInfo.days + "天";
        };
        ActivityContinueRecharge.prototype.updateTime = function () {
            this.activityModel.continueRechargeInfo.left_time--;
            this.lb_time.text = game.InvestUtil.getFormatBySecond1(this.activityModel.continueRechargeInfo.left_time);
        };
        /**
         * 打开窗口
         */
        ActivityContinueRecharge.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            // if (this._viewHandleId == 0) {
            // 	this._viewHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW,this.updateView,this);
            // }
            App.Socket.send(30012, {});
        };
        /**
         * 清理
         */
        ActivityContinueRecharge.prototype.clear = function (data) {
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
        ActivityContinueRecharge.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ActivityContinueRecharge;
    }(BaseChildView));
    game.ActivityContinueRecharge = ActivityContinueRecharge;
    __reflect(ActivityContinueRecharge.prototype, "game.ActivityContinueRecharge");
    var ActivityContinueRechargeItem = (function (_super) {
        __extends(ActivityContinueRechargeItem, _super);
        function ActivityContinueRechargeItem() {
            var _this = _super.call(this) || this;
            _this.activityModel = game.ActivityModel.getInstance();
            _this.skinName = "ActivityContinueRechargeItemSkin";
            _this.btn_get.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(30013, { id: _this.data.id });
            }, _this);
            var layout = new eui.HorizontalLayout();
            layout.gap = 5;
            layout.horizontalAlign = egret.HorizontalAlign.LEFT;
            _this.gp_reward.layout = layout;
            return _this;
        }
        ActivityContinueRechargeItem.prototype.dataChanged = function () {
            var _this = this;
            var baseInfo = App.ConfigManager.getRechargeGiftInfoById(this.data.id);
            this.gp_reward.removeChildren();
            for (var k in baseInfo.reward) {
                var item = new customui.BaseItem();
                item.updateBaseItem(baseInfo.reward[k][0], baseInfo.reward[k][1], baseInfo.reward[k][2]);
                this.gp_reward.addChild(item);
            }
            if (this.data.state == 0) {
                this.btn_get.visible = true;
                this.img_txt.visible = true;
                this.img_have_get.visible = false;
                RES.getResAsync("invest_txt_weidabiao_png", function (texture) {
                    _this.img_txt.source = texture;
                }, this);
                this.btn_get.currentState = 'down';
                this.lb_name.textFlow = [{ text: "已达成" }, { text: this.activityModel.continueRechargeInfo.days + "", style: { textColor: 0xf10000 } }, { text: "/" + baseInfo.add_day + "天" }];
            }
            else if (this.data.state == 1) {
                this.btn_get.visible = true;
                this.img_txt.visible = true;
                this.img_have_get.visible = false;
                RES.getResAsync("invest_txt_lijilingqu_png", function (texture) {
                    _this.img_txt.source = texture;
                }, this);
                this.btn_get.currentState = 'up';
                this.lb_name.textFlow = [{ text: "已达成" }, { text: this.activityModel.continueRechargeInfo.days + "", style: { textColor: 0x00f829 } }, { text: "/" + baseInfo.add_day + "天" }];
            }
            else if (this.data.state == 2) {
                this.btn_get.visible = false;
                this.img_txt.visible = false;
                this.img_have_get.visible = true;
                RES.getResAsync("invest_txt_lijilingqu_png", function (texture) {
                    _this.img_txt.source = texture;
                }, this);
                this.lb_name.textFlow = [{ text: "已达成" }, { text: this.activityModel.continueRechargeInfo.days + "", style: { textColor: 0x00f829 } }, { text: "/" + baseInfo.add_day + "天" }];
            }
        };
        return ActivityContinueRechargeItem;
    }(eui.ItemRenderer));
    game.ActivityContinueRechargeItem = ActivityContinueRechargeItem;
    __reflect(ActivityContinueRechargeItem.prototype, "game.ActivityContinueRechargeItem");
})(game || (game = {}));
//# sourceMappingURL=ActivityContinueRecharge.js.map