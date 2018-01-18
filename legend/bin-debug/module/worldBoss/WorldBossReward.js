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
 * 世界boss奖励介绍弹窗 2017/12/5
 */
var game;
(function (game) {
    var WorldBossReward = (function (_super) {
        __extends(WorldBossReward, _super);
        function WorldBossReward(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._worldBossModel = game.WorldBossModel.getInstance();
            return _this;
        }
        WorldBossReward.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
        };
        WorldBossReward.prototype.updateView = function () {
            this._worldBossModel.changeToPage(this._worldBossInfo);
            if (!this.killReward) {
                this.killReward = new game.WorldBossInfoItem();
            }
            this.killReward.updateReward(this._worldBossInfo.killReward);
            this.gp_killReward.addChild(this.killReward);
            if (!this.joinReward) {
                this.joinReward = new game.WorldBossInfoItem();
            }
            this.joinReward.updateReward(this._worldBossInfo.joinReward);
            this.gp_joinReward.addChild(this.joinReward);
        };
        /**
         * 打开窗口
         */
        WorldBossReward.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._worldBossInfo = openParam;
            this.updateView();
        };
        /**
         * 关闭窗口
         */
        WorldBossReward.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        WorldBossReward.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        WorldBossReward.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossReward;
    }(BaseView));
    game.WorldBossReward = WorldBossReward;
    __reflect(WorldBossReward.prototype, "game.WorldBossReward");
})(game || (game = {}));
//# sourceMappingURL=WorldBossReward.js.map