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
* Author: yangyipeng
* 排行榜提示 UI视图层
*/
var game;
(function (game) {
    var RankTipsView = (function (_super) {
        __extends(RankTipsView, _super);
        function RankTipsView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            return _super.call(this, viewConf) || this;
        }
        RankTipsView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerCloseBtn, this);
            this.lb_content.textFlow = (new egret.HtmlTextParser).parser('<font color=0xB5B5B5 size=24>1.排行榜奖励每天</font>'
                + '<font color=0x00f828 size=24 >4点</font>'
                + '<font color=0xB5B5B5 size=24>以邮件发送\n</font>'
                + '<font color=0xB5B5B5 size=24>2.称号奖励将会为玩家</font>'
                + '<font color=0x00f828 size=24 >自动激活</font>'
                + '<font color=0xB5B5B5 size=24>有效期自激活起</font>'
                + '<font color=0x00f828 size=24 >1天\n</font>'
                + '<font color=0xB5B5B5 size=24>3.膜拜将于每天早上</font>'
                + '<font color=0x00f828 size=24 >4点</font>'
                + '<font color=0xB5B5B5 size=24>刷新，玩家可以膜拜自己\n</font>');
        };
        RankTipsView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this);
        };
        /**
         * 界面返回
         */
        RankTipsView.prototype.handlerCloseBtn = function () {
            WinManager.getInstance().closePopWin(WinName.POP_RANK_QUESTION);
        };
        RankTipsView.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        RankTipsView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return RankTipsView;
    }(BaseView));
    game.RankTipsView = RankTipsView;
    __reflect(RankTipsView.prototype, "game.RankTipsView");
})(game || (game = {}));
//# sourceMappingURL=RankTipsView.js.map