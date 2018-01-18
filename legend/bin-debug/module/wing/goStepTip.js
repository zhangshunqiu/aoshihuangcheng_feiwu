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
 * 羽翼直升丹弹窗 2017/11/16
 */
var game;
(function (game) {
    var goStepTip = (function (_super) {
        __extends(goStepTip, _super);
        function goStepTip(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._wingModel = game.WingModel.getInstance();
            _this._wingStepsuccessEventId = 0;
            return _this;
        }
        goStepTip.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.gp_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.gp_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirm, this);
            this.lb_step.text = App.ConfigManager.getConstConfigByType("WING_LEVEL_UP").value;
            this.lb_step0.text = App.ConfigManager.getConstConfigByType("WING_LEVEL_UP").value;
        };
        goStepTip.prototype.confirm = function () {
            if (this._wingModel.wingInfo.exp == this._wingModel.wingInfo.expStar) {
                var text = [{ text: "羽翼经验已满，请先羽翼升阶", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                App.GlobalTips.showTips(text);
            }
            else if (game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 17)) {
                App.Socket.send(15024, { id: this._wingModel.wingInfo.heroId });
            }
            else {
                App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, 17);
            }
        };
        /**
         * 打开窗口
         */
        goStepTip.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._wingStepsuccessEventId == 0) {
                this._wingStepsuccessEventId = App.EventSystem.addEventListener(PanelNotify.WING_STEP_SUCCESS, this.closeWin, this);
            }
        };
        /**
         * 关闭窗口
         */
        goStepTip.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        goStepTip.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._wingStepsuccessEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_STEP_SUCCESS, this._wingStepsuccessEventId);
                this._wingStepsuccessEventId = 0;
            }
        };
        /**
         * 销毁
         */
        goStepTip.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return goStepTip;
    }(BaseView));
    game.goStepTip = goStepTip;
    __reflect(goStepTip.prototype, "game.goStepTip");
})(game || (game = {}));
//# sourceMappingURL=goStepTip.js.map