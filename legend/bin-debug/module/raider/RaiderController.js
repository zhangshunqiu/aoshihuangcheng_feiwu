/**
 * 夺宝控制器
 * author ：zrj
*/
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
    var RaiderController = (function (_super) {
        __extends(RaiderController, _super);
        function RaiderController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        RaiderController.prototype.initProtocol = function () {
            this.registerProtocal(26001, this.handleRecord, this);
            this.registerProtocal(26002, this.handleRecordPush, this);
            this.registerProtocal(26003, this.handleRaidOne, this);
            this.registerProtocal(26004, this.handleRaidTen, this);
            this.registerProtocal(26005, this.handleStorage, this);
            this.registerProtocal(26006, this.handleStorageWithdraw, this);
        };
        /**
         * 寻宝记录
        */
        RaiderController.prototype.handleRecord = function (data) {
            App.logzrj("data: ", data);
            if (data.open_days) {
                game.RaiderModel.getInstance().curDay = data.open_days;
            }
            game.RaiderModel.getInstance().updatestorageRecord(data.treasure_log);
            this.dispatchEvent(PanelNotify.RAIDER_UPDATE_VIEW);
        };
        /**
         * 寻宝记录下推
        */
        RaiderController.prototype.handleRecordPush = function (data) {
            App.logzrj("data: ", data);
            game.RaiderModel.getInstance().updatestorageRecord(data.treasure_log);
            this.dispatchEvent(PanelNotify.RAIDER_UPDATE_VIEW);
        };
        /**
         * 寻宝1次
        */
        RaiderController.prototype.handleRaidOne = function (data) {
            App.logzrj("data: ", data);
            game.RaiderModel.getInstance().time = 1;
            this.dispatchEvent(PanelNotify.RAIDER_UPDATE_VIEW);
            this.dispatchEvent(PanelNotify.RAIDER_OPEN_REWARD, data.treasure);
        };
        /**
         * 寻宝10次
        */
        RaiderController.prototype.handleRaidTen = function (data) {
            App.logzrj("data: ", data);
            game.RaiderModel.getInstance().time = 10;
            // this.dispatchEvent(PanelNotify.RAIDER_UPDATE_VIEW);
            this.dispatchEvent(PanelNotify.RAIDER_OPEN_REWARD, data.treasure);
        };
        /**
         * 仓库列表
        */
        RaiderController.prototype.handleStorage = function (data) {
            App.logzrj("data: ", data);
            game.RaiderModel.getInstance().updateStorageInfo(data.treasure);
            this.dispatchEvent(PanelNotify.RAIDER_UPDATE_STORAGE);
        };
        /**
         * 仓库一键取出
        */
        RaiderController.prototype.handleStorageWithdraw = function (data) {
            App.logzrj("data: ", data);
            game.RaiderModel.getInstance().updateStorageInfo([]);
            this.dispatchEvent(PanelNotify.RAIDER_UPDATE_STORAGE);
        };
        /**
         * 销毁
         */
        RaiderController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        RaiderController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return RaiderController;
    }(BaseController));
    game.RaiderController = RaiderController;
    __reflect(RaiderController.prototype, "game.RaiderController");
})(game || (game = {}));
//# sourceMappingURL=RaiderController.js.map