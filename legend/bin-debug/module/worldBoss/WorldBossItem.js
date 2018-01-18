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
    var WorldBossItem = (function (_super) {
        __extends(WorldBossItem, _super);
        function WorldBossItem() {
            var _this = _super.call(this) || this;
            _this._worldBossModel = game.WorldBossModel.getInstance();
            _this._returnTimeTimer = 0;
            _this.skinName = "WorldBossItem";
            _this.initView();
            return _this;
        }
        WorldBossItem.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.checkBox.addEventListener(eui.UIEvent.CHANGE, this.onCheckBoxChange, this);
        };
        WorldBossItem.prototype.onCheckBoxChange = function () {
            App.Socket.send(36007, { scene_id: this.worldBossItem.scene_id });
        };
        WorldBossItem.prototype.initView = function () {
        };
        WorldBossItem.prototype.updateView = function (worldBossItem, pbWorldBossItem) {
            var _this = this;
            this.worldBossItem = worldBossItem;
            this.pbWorldBossItem = pbWorldBossItem;
            var bossId = worldBossItem.monster_list[0][2];
            var bossInfo = App.ConfigManager.getMonsterById(bossId);
            this.lb_bossName.text = bossInfo.name;
            this.lb_bossLv.text = "LV." + bossInfo.lv;
            this.lb_man.text = pbWorldBossItem.num + "人";
            this.img_icon.source = worldBossItem.icon + "_png";
            if ((App.RoleManager.roleInfo.lv >= worldBossItem.lv_limit && worldBossItem.lv_limit) ||
                (App.RoleManager.roleInfo.turn >= worldBossItem.transmigration && worldBossItem.transmigration)) {
                this.checkBox.visible = true;
                this.lb_limitLv.visible = false;
                if (pbWorldBossItem.notice == 1) {
                    this.checkBox.selected = true;
                }
                else {
                    this.checkBox.selected = false;
                }
            }
            else {
                this.checkBox.visible = false;
                this.lb_limitLv.visible = true;
                if (worldBossItem.lv_limit) {
                    this.lb_limitLv.text = worldBossItem.lv_limit + "级开启";
                }
                else {
                    this.lb_limitLv.text = worldBossItem.transmigration + "转开启";
                }
            }
            if (pbWorldBossItem.refresh_time) {
                this.img_hadKill.visible = true;
                this.lb_refreshTime.visible = true;
                if (this._returnTimeTimer == 0) {
                    this._returnTimeTimer = App.GlobalTimer.addSchedule(1000, 0, function () {
                        pbWorldBossItem.refresh_time--;
                        _this.lb_refreshTime.text = GlobalUtil.getFormatBySecond1(pbWorldBossItem.refresh_time);
                        if (pbWorldBossItem.refresh_time <= 0) {
                            _this.stopTimer();
                            _this.lb_refreshTime.visible = false;
                        }
                    }, this);
                }
                this.lb_refreshTime.text = pbWorldBossItem.refresh_time;
            }
            else {
                this.img_hadKill.visible = false;
                this.lb_refreshTime.visible = false;
            }
            this.img_killRecord.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openWin(WinName.WORLDBOSS_KILL_RECORD, _this.worldBossItem.scene_id);
            }, this);
        };
        WorldBossItem.prototype.stopTimer = function () {
            if (this._returnTimeTimer != 0) {
                App.GlobalTimer.remove(this._returnTimeTimer);
                this._returnTimeTimer = 0;
            }
        };
        WorldBossItem.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        };
        WorldBossItem.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
        };
        WorldBossItem.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        WorldBossItem.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            this.stopTimer();
        };
        /**
         * 销毁
         */
        WorldBossItem.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossItem;
    }(BaseView));
    game.WorldBossItem = WorldBossItem;
    __reflect(WorldBossItem.prototype, "game.WorldBossItem");
})(game || (game = {}));
//# sourceMappingURL=WorldBossItem.js.map