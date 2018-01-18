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
 * Author: lihe
 * Email： hersletter@qq.com
 * 天梯争霸tips界面 2017/06/20.
 */
var game;
(function (game) {
    var EncounterLogView = (function (_super) {
        __extends(EncounterLogView, _super);
        function EncounterLogView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._list_log = new eui.List();
            _this._log_eventId = 0;
            _this._encountermodel = game.EncounterModel.getInstance();
            return _this;
        }
        EncounterLogView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.ENCOUNTER_LOGS);
            }, this);
            this.scr_logs.viewport = this._list_log;
            this.scr_logs.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scr_logs.verticalScrollBar.autoVisibility = false;
            this.scr_logs.verticalScrollBar.visible = false;
            this._list_log.itemRenderer = EncounterLogItem;
        };
        EncounterLogView.prototype.updateLogList = function () {
            this._list_log.dataProvider = new eui.ArrayCollection(this._encountermodel.log_list);
        };
        /**
                 * 打开窗口
                */
        EncounterLogView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._log_eventId == 0) {
                this._log_eventId = App.EventSystem.addEventListener(PanelNotify.ENCOUNTER_LOG_UPDATE, this.updateLogList, this);
            }
            App.Socket.send(38004, null);
        };
        /**
         * 关闭窗口
         */
        EncounterLogView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        EncounterLogView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._log_eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.ENCOUNTER_LOG_UPDATE, this._log_eventId);
                this._log_eventId = 0;
            }
        };
        /**
         * 销毁
         */
        EncounterLogView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return EncounterLogView;
    }(BaseView));
    game.EncounterLogView = EncounterLogView;
    __reflect(EncounterLogView.prototype, "game.EncounterLogView");
    var EncounterLogItem = (function (_super) {
        __extends(EncounterLogItem, _super);
        function EncounterLogItem() {
            var _this = _super.call(this) || this;
            _this._items = [];
            _this.skinName = "EncounterLogItemSkin";
            _this._items.push(_this.item1);
            _this._items.push(_this.item2);
            _this._items.push(_this.item3);
            _this._items.push(_this.item4);
            _this._items.push(_this.item5);
            _this.item1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(_this.elo.reward_list[0].type, _this.elo.reward_list[0].good_id, null);
            }, _this);
            _this.item2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(_this.elo.reward_list[1].type, _this.elo.reward_list[1].good_id, null);
            }, _this);
            _this.item3.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(_this.elo.reward_list[2].type, _this.elo.reward_list[2].good_id, null);
            }, _this);
            _this.item4.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(_this.elo.reward_list[3].type, _this.elo.reward_list[3].good_id, null);
            }, _this);
            _this.item5.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(_this.elo.reward_list[4].type, _this.elo.reward_list[4].good_id, null);
            }, _this);
            return _this;
        }
        EncounterLogItem.prototype.dataChanged = function () {
            var info = this.data;
            this.elo = info;
            this.lb_name.text = info.name;
            var timestamp = info.time;
            var newDate = new Date();
            newDate.setTime(timestamp * 1000);
            this.lb_time.text = newDate.toLocaleString(); //newDate.toLocaleDateString()+.format('yyyy-MM-dd h:m:s')?
            if (info.res = 1) {
                this.img_sucess.visible = true;
                this.img_fail.visible = false;
            }
            else {
                this.img_sucess.visible = false;
                this.img_fail.visible = true;
            }
            for (var i = 0; i < this._items.length; i++) {
                if (i < info.reward_list.length) {
                    this._items[i].setItemNumVisible(true);
                    this._items[i].updateBaseItem(info.reward_list[i].type, info.reward_list[i].good_id, info.reward_list[i].good_num);
                }
                else {
                    this._items[i].visible = false;
                }
            }
        };
        return EncounterLogItem;
    }(eui.ItemRenderer));
    game.EncounterLogItem = EncounterLogItem;
    __reflect(EncounterLogItem.prototype, "game.EncounterLogItem");
})(game || (game = {}));
//# sourceMappingURL=EncounterLogView.js.map