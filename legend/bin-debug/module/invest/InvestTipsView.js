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
    var InvestTipsView = (function (_super) {
        __extends(InvestTipsView, _super);
        function InvestTipsView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            return _super.call(this, viewConf) || this;
        }
        InvestTipsView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
        };
        InvestTipsView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this);
            this.lb_content.textFlow = (new egret.HtmlTextParser).parser('<font size=24>1.限制投资只是限制玩家投资的时间，玩家投资后，可在</font>'
                + '<font color=0x00f828 size=24 >任意</font>'
                + '<font size=24>时间内完成并且领取奖励\n</font>'
                + '<font size=24>2.投资计划只能投资</font>'
                + '<font color=0x00f828 size=24 >一次，</font>'
                + '<font size=24>奖励也只能领取</font>'
                + '<font color=0x00f828 size=24 >一次，\n</font>');
        };
        /**
         * 界面返回
         */
        InvestTipsView.prototype.handlerCloseBtn = function () {
            WinManager.getInstance().closePopWin(WinName.POP_INVEST_TIPS);
        };
        InvestTipsView.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        InvestTipsView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return InvestTipsView;
    }(BaseView));
    game.InvestTipsView = InvestTipsView;
    __reflect(InvestTipsView.prototype, "game.InvestTipsView");
})(game || (game = {}));
//# sourceMappingURL=InvestTipsView.js.map