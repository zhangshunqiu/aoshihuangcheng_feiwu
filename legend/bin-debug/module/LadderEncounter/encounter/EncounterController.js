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
 * 遭遇战模块主控制器 2017/12/7
 */
var game;
(function (game) {
    var EncounterController = (function (_super) {
        __extends(EncounterController, _super);
        function EncounterController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        EncounterController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(38001, this.handlerEncounterMain, this);
            this.registerProtocal(38002, this.handlerStartChallenge, this);
            this.registerProtocal(38003, this.handlerChallengeResult, this);
            this.registerProtocal(38004, this.handlerPkRecord, this);
            this.registerProtocal(38005, this.handlerReducePkNum, this);
        };
        /**
         * 遭遇战主界面信息
         */
        EncounterController.prototype.handlerEncounterMain = function (data) {
            game.EncounterModel.getInstance().updateInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.ENCOUNTER_INFO_UPDATE);
        };
        /**
         * 玩家发起挑战 若返回则发起挑战成功
         */
        EncounterController.prototype.handlerStartChallenge = function (data) {
            if (data.result) {
                App.EventSystem.dispatchEvent(PanelNotify.ENCOUNTER_START_CHALLENGE_SUCCESS);
            }
        };
        /**
         * 挑战结果
         */
        EncounterController.prototype.handlerChallengeResult = function (data) {
            //延迟弹出窗口
            SceneManager.getInstance().delayOpenCompleteView(data, this.challengeResult, this);
        };
        /**
         * 执行挑战结果
         */
        EncounterController.prototype.challengeResult = function (data) {
            game.BossModel.getInstance().dropItem = data.reward;
            if (data.result == 1) {
                App.WinManager.openWin(WinName.BOSS_WIN, "encounter");
            }
            else if (data.result == 2) {
                App.WinManager.openWin(WinName.BOSS_LOSE, "encounter");
            }
        };
        /**
         * 玩家战斗记录
         */
        EncounterController.prototype.handlerPkRecord = function (data) {
            game.EncounterModel.getInstance().getEncounterLogInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.ENCOUNTER_LOG_UPDATE);
        };
        /**
         * 使用元宝消除pk值，若返回则代表成功
         */
        EncounterController.prototype.handlerReducePkNum = function (data) {
            if (data.result) {
                this.dispatchEvent(PanelNotify.ENCOUNTER_PK_REDUCE_SUCCESS);
            }
        };
        /**
         * 初始化事件监听
         */
        EncounterController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
        };
        /**
         * 销毁
         */
        EncounterController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        EncounterController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return EncounterController;
    }(BaseController));
    game.EncounterController = EncounterController;
    __reflect(EncounterController.prototype, "game.EncounterController");
})(game || (game = {}));
//# sourceMappingURL=EncounterController.js.map