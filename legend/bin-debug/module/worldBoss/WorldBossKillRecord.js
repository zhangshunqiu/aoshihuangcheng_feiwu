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
 * 世界boss击杀记录弹窗 2017/12/5
 */
var game;
(function (game) {
    var WorldBossKillRecord = (function (_super) {
        __extends(WorldBossKillRecord, _super);
        function WorldBossKillRecord(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._worldBossModel = game.WorldBossModel.getInstance();
            return _this;
        }
        WorldBossKillRecord.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
        };
        WorldBossKillRecord.prototype.updateView = function () {
            for (var i = 0; i < 5; i++) {
                if (i < this._worldBossModel.killRecord.length) {
                    var newDate = new Date(this._worldBossModel.killRecord[i].time * 1000);
                    var hour = newDate.getHours();
                    if (hour < 10) {
                        hour = "0" + hour;
                    }
                    var min = newDate.getMinutes();
                    if (min < 10) {
                        min = "0" + min;
                    }
                    this["lb_time" + i].text = hour + ":" + min;
                    this["lb_kill" + i].text = this._worldBossModel.killRecord[i].nick;
                    this["lb_score" + i].text = this._worldBossModel.killRecord[i].score;
                }
                else {
                    this["lb_time" + i].visible = false;
                    this["lb_kill" + i].visible = false;
                    this["lb_score" + i].visible = false;
                }
            }
        };
        /**
         * 打开窗口
         */
        WorldBossKillRecord.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.Socket.send(36003, { scene_id: openParam });
            App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_KILLRECORD_UPDATE, this.updateView, this);
        };
        /**
         * 关闭窗口
         */
        WorldBossKillRecord.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        WorldBossKillRecord.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_KILLRECORD_UPDATE);
        };
        /**
         * 销毁
         */
        WorldBossKillRecord.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossKillRecord;
    }(BaseView));
    game.WorldBossKillRecord = WorldBossKillRecord;
    __reflect(WorldBossKillRecord.prototype, "game.WorldBossKillRecord");
})(game || (game = {}));
//# sourceMappingURL=WorldBossKillRecord.js.map