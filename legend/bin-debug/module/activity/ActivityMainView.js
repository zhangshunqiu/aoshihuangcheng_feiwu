/**
 * module : 活动模块主界面 显示
 * author ：zrj
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
    var ActivityMainView = (function (_super) {
        __extends(ActivityMainView, _super);
        function ActivityMainView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.list = new eui.List();
            _this._viewDict = {};
            _this._mainHandleId = 0;
            _this._changeHandleId = 0;
            _this._viewHandleId = 0;
            _this.activityModel = game.ActivityModel.getInstance();
            return _this;
        }
        ActivityMainView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        ActivityMainView.prototype.initView = function () {
            var _this = this;
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
            var layout = new eui.HorizontalLayout();
            layout.gap = 10;
            layout.verticalAlign = egret.VerticalAlign.MIDDLE;
            this.list.layout = layout;
            this.list.itemRenderer = ActivityMainItem;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
            this.scroller.horizontalScrollBar.autoVisibility = false;
            this.scroller.horizontalScrollBar.visible = false;
            this.scroller.viewport = this.list;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, function (event) {
                if (ActivityManager.getInstance().curActivityId != event.item) {
                    ActivityManager.getInstance().openActivity(event.item);
                }
            }, this);
            this.img_front.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.scroller.viewport.scrollH -= _this.list.width;
                if (_this.scroller.viewport.scrollH <= 0) {
                    _this.scroller.viewport.scrollH = 0;
                }
            }, this);
            this.img_next.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.scroller.viewport.scrollH += _this.list.width;
                var childNum = _this.list.numChildren;
                var showNum = 5;
                var totalLen = Math.floor(childNum / 5) * 540;
                if (_this.scroller.viewport.scrollH >= totalLen) {
                    _this.scroller.viewport.scrollH = totalLen;
                }
            }, this);
        };
        ActivityMainView.prototype.changeActivity = function (data) {
            if (!data.id) {
                return;
            }
            if (!this._curSubView) {
            }
            else {
                this._curSubView.clear();
                this._curSubView = undefined;
            }
            if (this._viewDict[data.id]) {
                this._curSubView = this._viewDict[data.id];
                this._curSubView.readyOpen(data);
            }
            else {
                var clazz = egret.getDefinitionByName(ActivityConfig[data.id].view);
                this._curSubView = new clazz();
                this._curSubView.readyOpen(data);
                this.gp_subview.addChild(this._curSubView);
                this._viewDict[data.id] = this._curSubView;
            }
        };
        ActivityMainView.prototype.updateMainView = function () {
            this.list.dataProvider = new eui.ArrayCollection(ActivityManager.getInstance().activityDict);
            this.list.validateNow();
            this.changeActivity({ id: this.list.dataProvider.getItemAt(0) });
            var count = 0;
            for (var i = 0; i < this.list.dataProvider.length; i++) {
                this.activityModel.checkActicityRedDot(this.list.dataProvider.getItemAt(i));
                switch (i) {
                    case 4: {
                        App.GlobalTimer.addSchedule(count * 100, 1, function () {
                            App.Socket.send(30008, {});
                        }, this);
                        break;
                    }
                    case 5: {
                        App.GlobalTimer.addSchedule(count * 100, 1, function () {
                            App.Socket.send(30010, {});
                        }, this);
                        break;
                    }
                }
                count++;
            }
        };
        ActivityMainView.prototype.updateSubView = function () {
            if (this._curSubView && this._curSubView.updateView) {
                this._curSubView.updateView();
                this.checkRedDot();
            }
        };
        ActivityMainView.prototype.closeView = function () {
            // ActivityManager.getInstance().closeActivity();
            App.WinManager.closeWin(WinName.ACTIVITY);
        };
        //红点显隐
        ActivityMainView.prototype.checkRedDot = function () {
            for (var i = 0; i < this.list.dataProvider.length; i++) {
                if (this.list.dataProvider.getItemAt(i) && i < this.list.numChildren) {
                    var item = this.list.getChildAt(i);
                    if (item) {
                        if (this.activityModel.redDotDict[this.list.dataProvider.getItemAt(i)]) {
                            item.showTips();
                        }
                        else {
                            item.hideTips();
                        }
                    }
                }
            }
        };
        /**
         * 打开窗口
         * @param openParam.id 要打开的活动id，不传默认打开第一个
         */
        ActivityMainView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._mainHandleId == 0) {
                this._mainHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_MAIN_VIEW, this.updateMainView, this);
            }
            if (this._changeHandleId == 0) {
                this._changeHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_CHANGE_VIEW, this.changeActivity, this);
            }
            if (this._viewHandleId == 0) {
                this._viewHandleId = App.EventSystem.addEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW, this.updateSubView, this);
            }
            if (openParam && openParam.id) {
            }
            App.Socket.send(30001, {});
        };
        /**
         * 关闭窗口
         */
        ActivityMainView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ActivityMainView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._mainHandleId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ACTIVITY_UPDATE_MAIN_VIEW, this._mainHandleId);
                this._mainHandleId = 0;
            }
            if (this._changeHandleId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ACTIVITY_CHANGE_VIEW, this._changeHandleId);
                this._changeHandleId = 0;
            }
            if (this._viewHandleId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ACTIVITY_UPDATE_VIEW, this._viewHandleId);
                this._viewHandleId = 0;
            }
            for (var key in this._viewDict) {
                this._viewDict[key].clear();
            }
            ActivityManager.getInstance().closeActivity();
        };
        /**
         * 销毁
         */
        ActivityMainView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ActivityMainView;
    }(BaseView));
    game.ActivityMainView = ActivityMainView;
    __reflect(ActivityMainView.prototype, "game.ActivityMainView");
    var ActivityMainItem = (function (_super) {
        __extends(ActivityMainItem, _super);
        function ActivityMainItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "ActivityMainItemSkin";
            _this.redDot = App.BtnTipManager.creatBtnTip("", _this);
            return _this;
        }
        ActivityMainItem.prototype.dataChanged = function () {
            var _this = this;
            RES.getResAsync(ActivityConfig[this.data].nameIcon, function (texture) {
                _this.img_name.source = texture;
            }, this);
            RES.getResAsync(ActivityConfig[this.data].icon, function (texture) {
                _this.btn_icon.iconDisplay.texture = texture;
            }, this);
        };
        ActivityMainItem.prototype.showTips = function (data) {
            this.redDot.show(data);
        };
        ActivityMainItem.prototype.hideTips = function () {
            this.redDot.hide();
        };
        return ActivityMainItem;
    }(eui.ItemRenderer));
    game.ActivityMainItem = ActivityMainItem;
    __reflect(ActivityMainItem.prototype, "game.ActivityMainItem");
})(game || (game = {}));
//# sourceMappingURL=ActivityMainView.js.map