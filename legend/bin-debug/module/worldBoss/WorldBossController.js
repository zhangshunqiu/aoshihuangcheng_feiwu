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
 * 世界boss系统控制模块 2017/12/4
 */
var game;
(function (game) {
    var WorldBossController = (function (_super) {
        __extends(WorldBossController, _super);
        function WorldBossController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        WorldBossController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(36001, this.handlerWorldBossInterface, this);
            this.registerProtocal(36002, this.handlerStartChallenge, this);
            this.registerProtocal(36003, this.handlerKillRecord, this);
            this.registerProtocal(36004, this.handlerBuyTimesResult, this);
            this.registerProtocal(36005, this.handlerWorldBossCheer, this);
            this.registerProtocal(36006, this.handlerWorldBossCheerResult, this);
            this.registerProtocal(36009, this.handlerWorldBossChallengeResult, this);
            this.registerProtocal(36010, this.handlerWorldBossHurtList, this);
        };
        /**
         * boss界面数据
         */
        WorldBossController.prototype.handlerWorldBossInterface = function (data) {
            game.WorldBossModel.getInstance().updateWorldBossInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_INFO_UPDATE);
            if (data.bosses.length < 3) {
                if (game.WorldBossModel.getInstance().showBossRevive()) {
                    App.WinManager.openWin(WinName.WORLDBOSS_REVIVE);
                }
            }
        };
        /**
         * 玩家发起挑战 服务器返回一个结果
         */
        WorldBossController.prototype.handlerStartChallenge = function (data) {
            App.loglyg(data);
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_FIGHT);
        };
        /**
         * 击杀记录
         */
        WorldBossController.prototype.handlerKillRecord = function (data) {
            game.WorldBossModel.getInstance().killRecord = data.kill_players;
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_KILLRECORD_UPDATE);
        };
        /**
         * 购买挑战世界boss次数协议，成功返回结果
         */
        WorldBossController.prototype.handlerBuyTimesResult = function (data) {
            game.WorldBossModel.getInstance().pbWorldBossInfo.left_times++;
            game.WorldBossModel.getInstance().pbWorldBossInfo.buy_times++;
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_INFO_UPDATE);
        };
        /**
         * 当前助威次数
         */
        WorldBossController.prototype.handlerWorldBossCheer = function (data) {
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_CHEER, data.num);
        };
        /**
         * 点击助威，返回助威是否成功
         */
        WorldBossController.prototype.handlerWorldBossCheerResult = function (data) {
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_CHEER_RESULT, data.result);
        };
        /**
         * 世界boss挑战结果
         */
        WorldBossController.prototype.handlerWorldBossChallengeResult = function (data) {
            //延迟弹出窗口
            SceneManager.getInstance().delayOpenCompleteView(data, this.worldBossChallengeResult, this);
        };
        /**
        * 执行世界boss挑战结果
        */
        WorldBossController.prototype.worldBossChallengeResult = function (data) {
            game.BossModel.getInstance().rank = data.rank;
            game.BossModel.getInstance().dropItem = data.reward;
            App.WinManager.openWin(WinName.BOSS_WIN);
        };
        /**
         * 世界boss伤害排行
         */
        WorldBossController.prototype.handlerWorldBossHurtList = function (data) {
            App.EventSystem.dispatchEvent(PanelNotify.WORLDBOSS_HURT_RANK_UPDATE, data);
        };
        /**
        * 初始化事件监听
        */
        WorldBossController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 清理
         */
        WorldBossController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        /**
         * 销毁
         */
        WorldBossController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossController;
    }(BaseController));
    game.WorldBossController = WorldBossController;
    __reflect(WorldBossController.prototype, "game.WorldBossController");
})(game || (game = {}));
//# sourceMappingURL=WorldBossController.js.map