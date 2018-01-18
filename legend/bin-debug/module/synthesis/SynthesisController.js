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
 * 合成模块控制器
 * author : zrj
*/
var game;
(function (game) {
    var SynthesisController = (function (_super) {
        __extends(SynthesisController, _super);
        function SynthesisController() {
            var _this = _super.call(this) || this;
            _this.initProtocol();
            _this.initEventListener();
            return _this;
        }
        /**
         * 初始化协议
         */
        SynthesisController.prototype.initProtocol = function () {
            this.registerProtocal(14013, this.handleCompoundR, this);
            this.registerProtocal(14014, this.handleOneCompoundR, this);
        };
        /**
         * 合成
         */
        SynthesisController.prototype.handleCompoundR = function (data) {
            App.logzrj("data: ", data);
            this.dispatchEvent(PanelNotify.SYNTHESIS_VIEW, data);
            // if(data.type == ConstSynthesisType.JEWEL){
            // 	this.dispatchEvent(PanelNotify.SYNTHESIS_JEWEL_VIEW,ConstSynthesisType.JEWEL);
            // } else if(data.type == ConstSynthesisType.WING) {
            // 	this.dispatchEvent(PanelNotify.SYNTHESIS_WING_VIEW,ConstSynthesisType.WING);
            // } else if (data.type == ConstSynthesisType.EQUIP) {
            // 	this.dispatchEvent(PanelNotify.SYNTHESIS_EQUIP_VIEW,ConstSynthesisType.EQUIP);
            // }
        };
        /**
         * 一键合成
         */
        SynthesisController.prototype.handleOneCompoundR = function (data) {
            App.logzrj("data: ", data);
            this.dispatchEvent(PanelNotify.SYNTHESIS_ALL_VIEW, data);
            // if(data.type == ConstSynthesisType.JEWEL){
            // 	this.dispatchEvent(PanelNotify.SYNTHESIS_JEWEL_VIEW,ConstSynthesisType.JEWEL);
            // } else if(data.type == ConstSynthesisType.WING) {
            // 	this.dispatchEvent(PanelNotify.SYNTHESIS_WING_VIEW,ConstSynthesisType.WING);
            // } else if (data.type == ConstSynthesisType.EQUIP) {
            // 	this.dispatchEvent(PanelNotify.SYNTHESIS_EQUIP_VIEW,ConstSynthesisType.EQUIP);
            // }
        };
        /**
         * 销毁
         */
        SynthesisController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        SynthesisController.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return SynthesisController;
    }(BaseController));
    game.SynthesisController = SynthesisController;
    __reflect(SynthesisController.prototype, "game.SynthesisController");
})(game || (game = {}));
//# sourceMappingURL=SynthesisController.js.map