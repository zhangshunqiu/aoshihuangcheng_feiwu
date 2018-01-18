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
 * 天梯争霸tips界面 2017/06/20.
 */
var game;
(function (game) {
    var LabberTipsView = (function (_super) {
        __extends(LabberTipsView, _super);
        function LabberTipsView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._mustdomodel = game.MustDoModel.getInstance();
            return _this;
        }
        LabberTipsView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.HEGEMONY_LABBER_TIPS);
            }, this);
        };
        /**
                 * 打开窗口
                */
        LabberTipsView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.lb_tips.textFlow = (new egret.HtmlTextParser).parser('1.每<font color=0xff8500>周一10：00</font>开放天梯争霸，所有达到<font color=0xff8500>80级</font>的玩家可参与本玩法\n2.天梯共包括<font color=0xff8500>青铜、白银、黄金、钻石</font>4个段位，每个段分5级，段位越高，结算时获得奖励越丰富\n3.在匹配中击败对手可以获得1颗星星，被对手击败会掉1颗星星，星星满时可提升当前段位\n4.<font color=0x22a322>青铜</font>和<font color=0x74e7ff>白银</font>段位中，挑战对手失败不会掉星。所有段位挑战失败不会掉落到本级别以下\n5.在挑战中连续获胜2场即可获得<font color=0xff8500>连胜</font>状态。在青铜和白银段位中，连胜状态下每次获胜可获得2个星星\n6.挑战次数定时恢复，每天可额外购买挑战次数，购买次数每天早上<font color=0xff8500>4点</font>刷新\n7.每次参与天梯争霸有概率额外获得<font color=0xffea01>惊喜奖励</font>，成功击杀天梯战魂可<font color=0xffea01>提高</font>获得概率\n8.<font color=0xff8500>每周日22：00</font>天梯争霸进入休战期，休战期间玩家不可进入匹配\n9.<font color=0xff8500>每周日22：30</font>结算本周天梯争霸段位奖励。奖励通过邮件发放，所有玩家段位重置，下<font color=0xff8500>周一10：00</font>重新开放挑战\n10.天梯争霸结算后，<font color=0xff8500>钻石前5名</font>玩家可额外获得珍稀奖励，通过邮件发放\n11.净胜场不会低于0，玩家挑战成功一次，净胜场加一，玩家挑战失败一次，净胜场减一');
        };
        /**
         * 关闭窗口
         */
        LabberTipsView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        LabberTipsView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        LabberTipsView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return LabberTipsView;
    }(BaseView));
    game.LabberTipsView = LabberTipsView;
    __reflect(LabberTipsView.prototype, "game.LabberTipsView");
})(game || (game = {}));
//# sourceMappingURL=LabberTipsView.js.map