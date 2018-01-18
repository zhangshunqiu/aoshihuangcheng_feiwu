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
 * 世界boss购买次数弹窗 2017/12/5
 */
var game;
(function (game) {
    var WorldBossBuyTimes = (function (_super) {
        __extends(WorldBossBuyTimes, _super);
        function WorldBossBuyTimes(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._worldBossModel = game.WorldBossModel.getInstance();
            return _this;
        }
        WorldBossBuyTimes.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_cancle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_comfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(36004, {});
                _this.closeWin();
            }, this);
            this.updateView();
        };
        WorldBossBuyTimes.prototype.updateView = function () {
            var gold = App.ConfigManager.getConstConfigByType("WORLD_BOSS_BAY_GOLD").value;
            var times = App.ConfigManager.getConstConfigByType("WORLD_BOSS_BAY_NUM").value;
            var vipTimes = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv).bay_boss;
            var allTimes = times - this._worldBossModel.pbWorldBossInfo.buy_times + vipTimes;
            this.lb_gold.text = gold;
            this.lb_times.text = allTimes;
        };
        /**
         * 打开窗口
         */
        WorldBossBuyTimes.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
        };
        /**
         * 关闭窗口
         */
        WorldBossBuyTimes.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        WorldBossBuyTimes.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        WorldBossBuyTimes.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossBuyTimes;
    }(BaseView));
    game.WorldBossBuyTimes = WorldBossBuyTimes;
    __reflect(WorldBossBuyTimes.prototype, "game.WorldBossBuyTimes");
})(game || (game = {}));
//# sourceMappingURL=WorldBossBuyTimes.js.map