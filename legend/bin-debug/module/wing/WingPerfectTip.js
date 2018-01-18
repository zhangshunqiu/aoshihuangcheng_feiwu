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
 * 完美羽翼属性弹窗  2017/11/16
 */
var game;
(function (game) {
    var WingPerfectTip = (function (_super) {
        __extends(WingPerfectTip, _super);
        function WingPerfectTip(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._wingModel = game.WingModel.getInstance();
            return _this;
        }
        WingPerfectTip.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.updateView();
        };
        WingPerfectTip.prototype.updateView = function () {
            if (this._wingModel.wingInfo.perfectWing && this._wingModel.wingInfo.perfectWing != 9) {
                this.gp_nextAttr.visible = true;
                this.lb_active.text = "<已激活>";
                this.lb_active.textColor = 0x06ff00;
                this.lb_step.text = this._wingModel.wingInfo.perfectWing + '';
                this.lb_step1.text = this._wingModel.wingInfo.perfectWing + '';
                this.lb_step.textColor = 0x06ff00;
                this.lb_progress.text = "4";
                this.lb_progress.textColor = 0x06ff00;
                this.lb_rate.text = Math.floor(this._wingModel.wingInfo.perfectWingRate * 100) + "%";
                this.lb_step2.text = this._wingModel.wingInfo.perfectWing + 1 + '';
                this.lb_step3.text = this._wingModel.wingInfo.perfectWing + 1 + '';
                this.lb_progress1.text = this._wingModel.wingInfo.WingEquipStep.progress;
                this.lb_rate1.text = Math.floor(this._wingModel.wingInfo.perfectWingNextRate * 100) + "%";
                this.img_bg.height = 375;
            }
            else if (this._wingModel.wingInfo.perfectWing == 9) {
                this.gp_nextAttr.visible = false;
                this.img_bg.height = 208;
                this.lb_active.text = "<已激活>";
                this.lb_active.textColor = 0x06ff00;
                this.lb_step.text = "9";
                this.lb_step1.text = "9";
                this.lb_step.textColor = 0x06ff00;
                this.lb_rate.text = Math.floor(this._wingModel.wingInfo.perfectWingRate * 100) + "%";
                this.lb_progress.text = "4";
                this.lb_progress.textColor = 0x06ff00;
            }
            else {
                this.gp_nextAttr.visible = false;
                this.img_bg.height = 208;
                this.lb_active.text = "<未激活>";
                this.lb_active.textColor = 0xFE0000;
                this.lb_step.text = "1";
                this.lb_step1.text = "1";
                this.lb_rate.text = "1.5%";
                this.lb_progress.text = Math.floor(this._wingModel.wingInfo.WingEquipStep.progress) + "";
                this.lb_progress.textColor = 0xFE0000;
            }
        };
        /**
         * 打开窗口
         */
        WingPerfectTip.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
        };
        /**
         * 关闭窗口
         */
        WingPerfectTip.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        WingPerfectTip.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        WingPerfectTip.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WingPerfectTip;
    }(BaseView));
    game.WingPerfectTip = WingPerfectTip;
    __reflect(WingPerfectTip.prototype, "game.WingPerfectTip");
})(game || (game = {}));
//# sourceMappingURL=WingPerfectTip.js.map