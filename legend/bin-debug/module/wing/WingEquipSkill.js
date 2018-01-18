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
 * 翅膀装备技能弹窗  2017/11/16
 */
var game;
(function (game) {
    var WingEquipSkill = (function (_super) {
        __extends(WingEquipSkill, _super);
        function WingEquipSkill(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._wingModel = game.WingModel.getInstance();
            return _this;
        }
        WingEquipSkill.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.re_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.updateView();
        };
        WingEquipSkill.prototype.updateView = function () {
        };
        /**
         * 打开窗口
         */
        WingEquipSkill.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
        };
        /**
         * 关闭窗口
         */
        WingEquipSkill.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        WingEquipSkill.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        WingEquipSkill.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WingEquipSkill;
    }(BaseView));
    game.WingEquipSkill = WingEquipSkill;
    __reflect(WingEquipSkill.prototype, "game.WingEquipSkill");
})(game || (game = {}));
//# sourceMappingURL=WingEquipSkill.js.map