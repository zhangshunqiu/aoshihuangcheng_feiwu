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
 * Boss模块主控制器 2017/11/13
 */
var game;
(function (game) {
    var BossController = (function (_super) {
        __extends(BossController, _super);
        function BossController() {
            var _this = _super.call(this) || this;
            _this._sceneChangeEventId = 0;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        BossController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(13011, this.handlerGetBossReward, this);
            this.registerProtocal(13012, this.handlerBossRewardLevel, this);
            this.registerProtocal(13013, this.handlerMeetBoss, this);
            this.registerProtocal(13014, this.handlerChallengeMeetBoss, this);
        };
        BossController.prototype.updateChallengeBtnTips = function () {
            // if(){
            //     App.BtnTipManager.setTypeValue(ConstBtnTipType.BOSS_CHALLENGE,true);
            // }else{
            // 	App.BtnTipManager.setTypeValue(ConstBtnTipType.BOSS_CHALLENGE,false);
            // }
        };
        /**
         * 获取挑战boss通关奖励
         */
        BossController.prototype.handlerGetBossReward = function (data) {
            App.loglyg("获得boss奖励", data);
        };
        /**
         * 已获取挑战boss通关奖励的最高等级
         */
        BossController.prototype.handlerBossRewardLevel = function (data) {
            game.BossModel.getInstance().updateBossRewardInfo(data.id);
            App.EventSystem.dispatchEvent(PanelNotify.BOSS_REWARD_UPDATE);
        };
        /**
         * 随机遭遇boss
         */
        BossController.prototype.handlerMeetBoss = function (data) {
            App.EventSystem.dispatchEvent(PanelNotify.BOSS_MEET, data.result); //1为遭遇boss
        };
        /**
         * 请求挑战遭遇boss
         */
        BossController.prototype.handlerChallengeMeetBoss = function (data) {
            if (data.id) {
                this.dispatchEvent(PanelNotify.BOSS_MEET_START_CHALLENGE);
            }
        };
        /**
         * 初始化事件监听
         */
        BossController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
            if (this._sceneChangeEventId === 0) {
                this._sceneChangeEventId = App.EventSystem.addEventListener(SceneEventType.SCENE_INIT_COMPLETE, function () {
                    game.BossModel.getInstance().updateSceneInfo();
                    game.BossModel.getInstance().wave = 0;
                    App.EventSystem.dispatchEvent(PanelNotify.BOSS_WAVE_UPDATE);
                }, this);
            }
        };
        /**
         * 销毁
         */
        BossController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        BossController.prototype.clear = function () {
            _super.prototype.clear.call(this);
            if (this._sceneChangeEventId != 0) {
                App.EventSystem.removeEventListener(SceneEventType.SCENE_INIT_COMPLETE, this._sceneChangeEventId);
                this._sceneChangeEventId = 0;
            }
        };
        return BossController;
    }(BaseController));
    game.BossController = BossController;
    __reflect(BossController.prototype, "game.BossController");
})(game || (game = {}));
//# sourceMappingURL=BossController.js.map