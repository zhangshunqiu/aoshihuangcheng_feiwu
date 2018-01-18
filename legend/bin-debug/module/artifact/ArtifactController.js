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
 * 神器模块控制器
 * author ：zrj
*/
var game;
(function (game) {
    var ArtifactController = (function (_super) {
        __extends(ArtifactController, _super);
        function ArtifactController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        ArtifactController.prototype.initProtocol = function () {
            this.registerProtocal(33001, this.handleInfo, this);
            this.registerProtocal(33002, this.handleActive, this);
            this.registerProtocal(33003, this.handleUpgrade, this);
        };
        /**
         * 神器信息返回
         */
        ArtifactController.prototype.handleInfo = function (data) {
            App.logzrj("data:", data);
            game.ArtifactModel.getInstance().updateArtifactList(data.weapons);
            this.dispatchEvent(PanelNotify.ARTIFACT_UPDATE_VIEW);
        };
        /**
         * 神器激活返回
         */
        ArtifactController.prototype.handleActive = function (data) {
            App.logzrj("data:", data);
            game.ArtifactModel.getInstance().updateArtifactList([data]);
            this.dispatchEvent(PanelNotify.ARTIFACT_UPGRADE_BACK);
        };
        /**
         * 神器升级返回
         */
        ArtifactController.prototype.handleUpgrade = function (data) {
            App.logzrj("data:", data);
            game.ArtifactModel.getInstance().updateArtifactList([data]);
            this.dispatchEvent(PanelNotify.ARTIFACT_UPGRADE_BACK);
        };
        /**
         * 销毁
         */
        ArtifactController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        ArtifactController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return ArtifactController;
    }(BaseController));
    game.ArtifactController = ArtifactController;
    __reflect(ArtifactController.prototype, "game.ArtifactController");
})(game || (game = {}));
//# sourceMappingURL=ArtifactController.js.map