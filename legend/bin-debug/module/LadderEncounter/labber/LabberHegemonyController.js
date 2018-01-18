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
 * 每日必做控制器 2017/06/20.
 */
var game;
(function (game) {
    var LabberHegemonyController = (function (_super) {
        __extends(LabberHegemonyController, _super);
        function LabberHegemonyController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        LabberHegemonyController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            //Labber
            this.registerProtocal(37001, this.handlerHegemonyInfo, this); //收到天梯界面信息
            this.registerProtocal(37002, this.handlerMatchEnemy, this); //匹配对手
            this.registerProtocal(37003, this.handlerBuyTimes, this); //购买匹配次数
            this.registerProtocal(37004, this.handlerLabberRewardInfo, this); //天梯奖励界面信息
            this.registerProtocal(37005, this.handlerHegemonyResultInfo, this); //争霸结果结算
        };
        LabberHegemonyController.prototype.handlerHegemonyInfo = function (data) {
            game.LabberHegemonyModel.getInstance().updateLabberHegemonyInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.HEGEMONY_INFO_UPDATE);
        };
        LabberHegemonyController.prototype.handlerMatchEnemy = function (data) {
            game.LabberHegemonyModel.getInstance().getMatchEnemyInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.HEGEMONY_MATCH_UPDATE);
        };
        LabberHegemonyController.prototype.handlerBuyTimes = function (data) {
            App.Socket.send(37001, null);
        };
        LabberHegemonyController.prototype.handlerLabberRewardInfo = function (data) {
            game.LabberHegemonyModel.getInstance().getLabberRewardInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.HEGEMONY_REWARD_UPDATE);
        };
        LabberHegemonyController.prototype.handlerHegemonyResultInfo = function (data) {
            game.LabberHegemonyModel.getInstance().getHegemonyResultInfo(data);
            App.WinManager.openWin(WinName.HEGEMONY_LABBER_RESULT);
        };
        return LabberHegemonyController;
    }(BaseController));
    game.LabberHegemonyController = LabberHegemonyController;
    __reflect(LabberHegemonyController.prototype, "game.LabberHegemonyController");
})(game || (game = {}));
//# sourceMappingURL=LabberHegemonyController.js.map