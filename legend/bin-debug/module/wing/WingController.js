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
 * 翅膀模块控制器 2017/11/16
 */
var game;
(function (game) {
    var WingController = (function (_super) {
        __extends(WingController, _super);
        function WingController() {
            var _this = _super.call(this) || this;
            _this._wingInfoUpdateEventId = 0;
            _this._heroInfoUpdateEventId = 0;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        WingController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(15021, this.handlerOpenWingInfo, this);
            this.registerProtocal(15022, this.handlerWingInfo, this);
            this.registerProtocal(15023, this.handlerWingStepSuccess, this);
            this.registerProtocal(15024, this.handlerWingStepSuccess, this);
            this.registerProtocal(15025, this.handlerWingInfo, this);
            this.registerProtocal(15026, this.handlerWingEquipStepResult, this);
            this.registerProtocal(14012, this.handlerTransformResult, this);
        };
        WingController.prototype.handlerOpenWingInfo = function (data) {
            game.WingModel.getInstance().updateWingInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.WING_INFO_UPDATE);
            var wingModel = game.WingModel.getInstance();
            (SceneController.getInstance().updateWingModel(wingModel.wingInfo.wingId, wingModel.wingInfo.heroId));
        };
        WingController.prototype.handlerWingInfo = function (data) {
            game.WingModel.getInstance().updateWingInfo(data);
            App.EventSystem.dispatchEvent(PanelNotify.WING_INFO_UPDATE);
        };
        WingController.prototype.handlerWingStepSuccess = function (data) {
            game.WingModel.getInstance().updateWingInfo(data);
            if (data) {
                var wingModel = game.WingModel.getInstance();
                (SceneController.getInstance().updateWingModel(wingModel.wingInfo.wingId, wingModel.wingInfo.heroId));
            }
            App.EventSystem.dispatchEvent(PanelNotify.WING_INFO_UPDATE);
            this.dispatchEvent(PanelNotify.WING_STEP_SUCCESS);
        };
        /**羽翼装备升阶结果 */
        WingController.prototype.handlerWingEquipStepResult = function (data) {
            if (data.id >= 0) {
                game.WingModel.getInstance().updateWingInfo(data);
                this.dispatchEvent(PanelNotify.WING_EQUIP_STEP_SUCCESS, data);
                App.EventSystem.dispatchEvent(PanelNotify.WING_INFO_UPDATE);
            }
        };
        WingController.prototype.handlerTransformResult = function (data) {
            App.EventSystem.dispatchEvent(PanelNotify.WING_TRANSFORM_RESULT, data);
        };
        /**
         * 红点
         */
        WingController.prototype.updateWingbtnTips = function () {
            var _wingModel = game.WingModel.getInstance();
            var btnTip = _wingModel.judgeBtnTip();
            for (var i = 0; i < btnTip.length; i++) {
                if (btnTip[i].devBool || btnTip[i].equipBool) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.WING, true);
                }
                else {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.WING, false);
                }
            }
        };
        /**
        * 初始化事件监听
        */
        WingController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
            if (this._wingInfoUpdateEventId == 0) {
                this._wingInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.WING_INFO_UPDATE, this.updateWingbtnTips, this);
            }
        };
        /**
         * 销毁
         */
        WingController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        WingController.prototype.clear = function () {
            _super.prototype.clear.call(this);
            if (this._wingInfoUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_INFO_UPDATE, this._wingInfoUpdateEventId);
                this._wingInfoUpdateEventId = 0;
            }
        };
        return WingController;
    }(BaseController));
    game.WingController = WingController;
    __reflect(WingController.prototype, "game.WingController");
})(game || (game = {}));
//# sourceMappingURL=WingController.js.map