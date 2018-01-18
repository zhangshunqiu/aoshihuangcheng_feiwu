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
 * 常规充值模块视图窗口 2017/06/20.
 */
var game;
(function (game) {
    var RechargeView = (function (_super) {
        __extends(RechargeView, _super);
        function RechargeView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._eventId = 0;
            return _this;
        }
        /**
         * 创建皮肤（初始化调用一次）
         */
        RechargeView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.gp_vip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showVip, this);
            this.list_rechargeItem.itemRenderer = game.RechargeListItem;
            this.scroller.verticalScrollBar.visible = false;
            this.scroller.verticalScrollBar.autoVisibility = false;
        };
        RechargeView.prototype.showVip = function () {
            WinManager.getInstance().openWin(WinName.VIP);
        };
        /**
         * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
         */
        RechargeView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.Socket.send(28002, {});
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.RECHARGE_INFO_UPDATE, this.handlerUpdateView, this);
            }
        };
        RechargeView.prototype.closeWin = function () {
            WinManager.getInstance().closeWin(this.winVo.winName);
        };
        RechargeView.prototype.handlerUpdateView = function () {
            var rechargeVo = game.RechargeModel.getInstance().rechargeViewData;
            this.btlb_vip.text = rechargeVo.vip;
            if (rechargeVo.vip == 10) {
                this.btlb_nextVip.text = rechargeVo.vip;
                this.gp_gold.visible = false;
                this.gp_maxVip.visible = true;
            }
            else {
                this.btlb_nextVip.text = rechargeVo.vip + 1;
                this.lb_nextVip.text = rechargeVo.vip + 1;
                this.lb_gold.text = rechargeVo.gold;
            }
            this.list_rechargeItem.dataProvider = rechargeVo.rechargeList;
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        RechargeView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.RECHARGE_INFO_UPDATE, this._eventId);
                this._eventId = 0;
            }
        };
        /**
         * 销毁
         */
        RechargeView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return RechargeView;
    }(BaseView));
    game.RechargeView = RechargeView;
    __reflect(RechargeView.prototype, "game.RechargeView");
})(game || (game = {}));
//# sourceMappingURL=RechargeView.js.map