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
 * Author: liuyonggen
 * 世界boss视图窗口 2017/12/4
 */
var game;
(function (game) {
    var WorldBossView = (function (_super) {
        __extends(WorldBossView, _super);
        function WorldBossView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._curIndex = 0;
            // private _worldBossItemGroup: any = {};
            _this._bossItemWidth = 0;
            _this._bossItemHeight = 0;
            _this._returnTimeTimer = 0;
            _this._worldBossModel = game.WorldBossModel.getInstance();
            _this._worldBossInfoUpdateEventId = 0;
            _this._worldBossInfoItem = new game.WorldBossInfoItem();
            return _this;
        }
        WorldBossView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            RES.getResAsync("worldboss_boss_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_buyTimes.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openWin(WinName.WORLDBOSS_BUY_TIMES);
            }, this);
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
        };
        WorldBossView.prototype.initView = function () {
            var _this = this;
            var i = 0;
            for (var k in this._worldBossModel.worldBossInfo) {
                var worldBossItem = new game.WorldBossItem();
                worldBossItem.updateView(this._worldBossModel.worldBossInfo[k], this._worldBossModel.pbWorldBossInfo.bosses[i]);
                worldBossItem.index = i;
                worldBossItem.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                    _this.updateView(e.currentTarget["index"]);
                    _this._curIndex = e.currentTarget["index"];
                }, this);
                i++;
                this._worldBossModel.worldBossItemGroup[k] = worldBossItem;
            }
            for (var k in this._worldBossModel.worldBossItemGroup) {
                this._bossItemWidth = this._worldBossModel.worldBossItemGroup[k].width;
                this._bossItemHeight = this._worldBossModel.worldBossItemGroup[k].height;
                break;
            }
            this.lb_curTimes.text = this._worldBossModel.pbWorldBossInfo.left_times;
            this.lb_timesLimit.text = "/" + this._worldBossModel.maxTimesLimit;
            if (this._worldBossModel.pbWorldBossInfo.refresh_time <= 0) {
                this.gp_refreshTime.visible = false;
            }
            else if (this._returnTimeTimer == 0) {
                this._returnTimeTimer = App.GlobalTimer.addSchedule(1000, 0, function () {
                    _this._worldBossModel.pbWorldBossInfo.refresh_time--;
                    _this.lb_timesReturn.text = GlobalUtil.getFormatBySecond1(_this._worldBossModel.pbWorldBossInfo.refresh_time);
                    if (_this._worldBossModel.pbWorldBossInfo.refresh_time <= 0) {
                        _this.stopTimer();
                    }
                }, this);
            }
            this.updateView(this._curIndex);
        };
        WorldBossView.prototype.stopTimer = function () {
            if (this._returnTimeTimer != 0) {
                App.GlobalTimer.remove(this._returnTimeTimer);
                this._returnTimeTimer = 0;
            }
        };
        WorldBossView.prototype.updateView = function (index) {
            if (index === void 0) { index = 0; }
            var blank = 0; //世界boss的掉落物品信息预留高度
            var i = 0;
            for (var k in this._worldBossModel.worldBossItemGroup) {
                this._worldBossModel.worldBossItemGroup[k].x = 6;
                this._worldBossModel.worldBossItemGroup[k].y = i * this._bossItemHeight + blank;
                this.gp_middle.addChild(this._worldBossModel.worldBossItemGroup[k]);
                if (i == index) {
                    if (!this._worldBossInfoItem) {
                        this._worldBossInfoItem = new game.WorldBossInfoItem();
                    }
                    this._worldBossInfoItem.updateView(this._worldBossModel.worldBossItemGroup[k]);
                    this.gp_middle.addChild(this._worldBossInfoItem);
                    this._worldBossInfoItem.y = (index + 1) * this._bossItemHeight + 2;
                    blank = 360;
                }
                i++;
            }
        };
        WorldBossView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.Socket.send(36001, {});
            if (this._worldBossInfoUpdateEventId == 0) {
                this._worldBossInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_INFO_UPDATE, this.initView, this);
            }
        };
        WorldBossView.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        WorldBossView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._worldBossInfoUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_INFO_UPDATE, this._worldBossInfoUpdateEventId);
                this._worldBossInfoUpdateEventId = 0;
            }
            this.stopTimer();
        };
        /**
         * 销毁
         */
        WorldBossView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossView;
    }(BaseView));
    game.WorldBossView = WorldBossView;
    __reflect(WorldBossView.prototype, "game.WorldBossView");
})(game || (game = {}));
//# sourceMappingURL=WorldBossView.js.map