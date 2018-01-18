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
 * 世界boss助威弹窗 2017/12/5
 */
var game;
(function (game) {
    var WorldBossCheer = (function (_super) {
        __extends(WorldBossCheer, _super);
        function WorldBossCheer(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._worldBossCheerEventId = 0;
            _this._worldBossCheerResultEventId = 0;
            _this._num = 0;
            _this._harm = 0;
            _this._harmTimes = 0;
            _this._worldBossModel = game.WorldBossModel.getInstance();
            return _this;
        }
        WorldBossCheer.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_cancle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_comfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchComfirm, this);
            this._harm = App.ConfigManager.getConstConfigByType("WORLD_BOSS_BUFF_ADD").value;
            this._harmTimes = App.ConfigManager.getConstConfigByType("WORLD_BOSS_CHEER_ATT").value;
            this.lb_harm.text = this._harm + "%";
            this.lb_maxHarm.text = this._harm * this._harmTimes + "%";
            this.lb_gold.text = App.ConfigManager.getConstConfigByType("WORLD_BOSS_CHEER_GOLD").value;
        };
        WorldBossCheer.prototype.onTouchComfirm = function () {
            if (this._num == this._harmTimes) {
                var text = [{ text: "助威效果已达到上限", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                App.GlobalTips.showTips(text);
            }
            else {
                App.Socket.send(36006, { scene_id: this._worldBossInfo.scene_id });
                this.img_comfirm.touchEnabled = false;
            }
        };
        WorldBossCheer.prototype.updateView = function (num) {
            this._num = num;
            this.img_comfirm.touchEnabled = true;
            this.lb_currentHarm.text = this._harm * num + "%";
        };
        WorldBossCheer.prototype.cheerResult = function () {
            App.Socket.send(36005, { scene_id: this._worldBossInfo.scene_id });
            var gold = App.ConfigManager.getConstConfigByType("WORLD_BOSS_CHEER_GOLD").value;
            var text = [{ text: "助威成功，消耗" + gold + "元宝", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
            App.GlobalTips.showTips(text);
        };
        /**
         * 打开窗口
         */
        WorldBossCheer.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._worldBossInfo = openParam;
            App.Socket.send(36005, { scene_id: this._worldBossInfo.scene_id });
            if (this._worldBossCheerEventId == 0) {
                this._worldBossCheerEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_CHEER, this.updateView, this);
            }
            if (this._worldBossCheerResultEventId == 0) {
                this._worldBossCheerResultEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_CHEER_RESULT, this.cheerResult, this);
            }
        };
        /**
         * 关闭窗口
         */
        WorldBossCheer.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        WorldBossCheer.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._worldBossCheerEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_CHEER, this._worldBossCheerEventId);
                this._worldBossCheerEventId = 0;
            }
            if (this._worldBossCheerResultEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_CHEER_RESULT, this._worldBossCheerResultEventId);
                this._worldBossCheerResultEventId = 0;
            }
        };
        /**
         * 销毁
         */
        WorldBossCheer.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossCheer;
    }(BaseView));
    game.WorldBossCheer = WorldBossCheer;
    __reflect(WorldBossCheer.prototype, "game.WorldBossCheer");
})(game || (game = {}));
//# sourceMappingURL=WorldBossCheer.js.map