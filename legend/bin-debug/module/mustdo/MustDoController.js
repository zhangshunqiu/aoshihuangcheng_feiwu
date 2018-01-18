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
    var MustDoController = (function (_super) {
        __extends(MustDoController, _super);
        function MustDoController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        MustDoController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            //每日必做
            this.registerProtocal(18001, this.handleMustDoList, this); //收到每日必做信息
            this.registerProtocal(18002, this.handleTakeTaskResult, this); //领取每日任务奖励反馈
            this.registerProtocal(18003, this.handleTakeChestResult, this); //领取活跃度宝箱奖励反馈
            this.registerProtocal(18004, this.handleActivityReset, this); //每日四点信息重置
            //成就
            this.registerProtocal(19001, this.handleAchieveInfo, this); //收到成就信息
            this.registerProtocal(19002, this.handleTakeAchieveResult, this); //领取成就奖励
            this.registerProtocal(19003, this.handleTakeAllAchieveResult, this); //一键领取成就
            this.registerProtocal(19004, this.handleGetUnTakeAchieve, this); //领取未领取成就
            //勋章
            this.registerProtocal(19005, this.handleMedalInfo, this); //收到勋章界面信息
            this.registerProtocal(19006, this.handleMedalLevUp, this); //处理界面升级
            //称号
            this.registerProtocal(32001, this.handleTitleInfo, this); //收到称号界面信息
            this.registerProtocal(32002, this.handleUseTitle, this); //处理使用称号
            this.registerProtocal(32003, this.handleShowTitle, this); //处理显示称号
        };
        //称号
        MustDoController.prototype.handleTitleInfo = function (data) {
            App.loglh("handleTitleInfo");
            game.MustDoModel.getInstance().getTitleInfo(data);
            this.dispatchEvent(PanelNotify.MUSTDO_UPDATETITLE);
        };
        MustDoController.prototype.handleUseTitle = function (data) {
            App.loglh("handleUseTitle");
            App.Socket.send(32001, null);
        };
        MustDoController.prototype.handleShowTitle = function (data) {
            App.loglh("handleShowTitle");
            App.Socket.send(32001, null);
            // if(data)
            var info = App.ConfigManager.getTitleInfoById(game.MustDoModel.getInstance().selectTitleId);
            this.dispatchEvent(SceneEventType.UPDATE_HONOR_TITLE, { objId: game.HeroModel.getInstance().getCurHero().id, honorId: info.icon });
        };
        //成就
        MustDoController.prototype.handleAchieveInfo = function (data) {
            App.loglh("handleAchieveInfo");
            App.loglh(data);
            game.MustDoModel.getInstance().getAchieveInfo(data);
            this.dispatchEvent(PanelNotify.MUSTDO_UPDATESACHIEVE);
        };
        MustDoController.prototype.handleTakeAchieveResult = function (data) {
            App.loglh("handleTakeAchieveResult");
            App.loglh(data);
            App.Socket.send(19001, null);
        };
        MustDoController.prototype.handleTakeAllAchieveResult = function (data) {
            App.loglh("handleTakeAllAchieveResult");
            App.loglh(data);
            App.Socket.send(19001, null);
        };
        //领取未领取成就
        MustDoController.prototype.handleGetUnTakeAchieve = function (data) {
            App.loglh("handleGetUnTakeAchieve");
            App.loglh(data);
            App.Socket.send(19005, null);
        };
        //勋章
        MustDoController.prototype.handleMedalInfo = function (data) {
            App.loglh("handleMedalInfo");
            App.loglh(data);
            game.MustDoModel.getInstance().getMedalInfo(data);
            this.dispatchEvent(PanelNotify.MUSTDO_UPDATEMEDAL);
        };
        MustDoController.prototype.handleMedalLevUp = function (data) {
            App.loglh("handleMedalLevUp");
            App.loglh(data);
            App.Socket.send(19005, null);
        };
        //每日必做
        MustDoController.prototype.handleMustDoList = function (data) {
            App.loglh("handleMustDoList");
            App.loglh(data);
            game.MustDoModel.getInstance().getActivityInfo(data);
            this.dispatchEvent(PanelNotify.MUSTDO_UPDATEACTIVITY);
        };
        MustDoController.prototype.handleTakeTaskResult = function (data) {
            App.loglh("handleMustDoList");
            App.loglh(data);
            App.Socket.send(18001, null);
        };
        MustDoController.prototype.handleTakeChestResult = function (data) {
            App.loglh("handleMustDoList");
            App.loglh(data);
            App.Socket.send(18001, null);
        };
        MustDoController.prototype.handleActivityReset = function (data) {
            App.loglh("handleMustDoList");
            App.loglh(data);
            App.Socket.send(18001, null);
        };
        /**
        * 销毁
        */
        MustDoController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        MustDoController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return MustDoController;
    }(BaseController));
    game.MustDoController = MustDoController;
    __reflect(MustDoController.prototype, "game.MustDoController");
})(game || (game = {}));
//# sourceMappingURL=MustDoController.js.map