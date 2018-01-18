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
    var WorldBossRevive = (function (_super) {
        __extends(WorldBossRevive, _super);
        function WorldBossRevive(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._worldBossFightEventId = 0;
            _this._worldBossModel = game.WorldBossModel.getInstance();
            return _this;
        }
        WorldBossRevive.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
        };
        WorldBossRevive.prototype.updateView = function () {
            var bossId = App.ConfigManager.getWorldBossInfoById(this.revive.scene_id).monster_list[0][2];
            var bossInfo = App.ConfigManager.getMonsterById(bossId);
            this.lb_bossName.text = bossInfo.name;
            this.lb_bossLv.text = "LV." + bossInfo.lv;
            this.img_icon.source = this.revive.icon + "_png";
        };
        WorldBossRevive.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.revive = this._worldBossModel.revive;
            this.updateView();
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallenge, this);
            if (this._worldBossFightEventId == 0) {
                this._worldBossFightEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_FIGHT, this.closeWin, this);
            }
        };
        WorldBossRevive.prototype.onTouchChallenge = function () {
            App.Socket.send(36002, { scene_id: this.revive.scene_id });
        };
        WorldBossRevive.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        WorldBossRevive.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._worldBossFightEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_FIGHT, this._worldBossFightEventId);
                this._worldBossFightEventId = 0;
            }
        };
        /**
         * 销毁
         */
        WorldBossRevive.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossRevive;
    }(BaseView));
    game.WorldBossRevive = WorldBossRevive;
    __reflect(WorldBossRevive.prototype, "game.WorldBossRevive");
})(game || (game = {}));
//# sourceMappingURL=WorldBossRevive.js.map