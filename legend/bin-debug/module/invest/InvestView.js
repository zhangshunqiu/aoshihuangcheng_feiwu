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
* 投资UI视图层 2017/06/20.
*/
var game;
(function (game) {
    var InvestView = (function (_super) {
        __extends(InvestView, _super);
        function InvestView(vo) {
            var _this = _super.call(this, vo) || this;
            _this._intervalId = 0;
            _this._eventId = 0;
            return _this;
        }
        InvestView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_question.addEventListener(egret.TouchEvent.TOUCH_TAP, this.question, this);
            this.gp_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyInvest, this);
            this.scroller.verticalScrollBar.visible = false;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.list_invest.itemRenderer = game.InvestListItem;
        };
        InvestView.prototype.question = function () {
            WinManager.getInstance().openPopWin(WinName.POP_INVEST_TIPS);
        };
        InvestView.prototype.closeWin = function () {
            WinManager.getInstance().closeWin(this.winVo.winName);
        };
        /**
         * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
         */
        InvestView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.INVEST_INFO_UPDATE, this.showInvestInfo, this);
            }
            this.initView();
        };
        InvestView.prototype.initView = function () {
            var listData = game.InvestModel.getInstance().listData;
            if (listData) {
                //展示
                this.showInvestInfo();
            }
            else {
                //请求
                App.Socket.send(34001, {});
            }
        };
        InvestView.prototype.buyInvest = function () {
            if (game.InvestModel.getInstance().isBuy) {
                App.GlobalTips.showTips("已购买投资!");
            }
            else {
                var vipLv = ConfigManager.getInstance().getConstConfigByType("INVEST_VIP")["value"];
                var costGold = ConfigManager.getInstance().getConstConfigByType("INVEST_GOLD")["value"];
                if (RoleManager.getInstance().roleInfo.vipLv >= vipLv && RoleManager.getInstance().roleWealthInfo.gold >= costGold) {
                    App.Socket.send(34002, {});
                }
                else {
                    App.GlobalTips.showTips("VIP等级或元宝不足!");
                }
            }
        };
        /**
         * 展示投资页面信息
         */
        InvestView.prototype.showInvestInfo = function () {
            this.bitmap_gold.text = ConfigManager.getInstance().getConstConfigByType("INVEST_GOLD")["value"];
            this.bitmap_beishu.text = ConfigManager.getInstance().getConstConfigByType("INVEST_MULTIPLE")["value"];
            this.lb_vip.text = "VIP" + ConfigManager.getInstance().getConstConfigByType("INVEST_VIP")["value"] + "以上可投资";
            if (game.InvestModel.getInstance().leftTime > 0) {
                this.lb_invest_time.text = "剩余时间：" + game.InvestUtil.getFormatBySecond1(game.InvestModel.getInstance().leftTime);
                if (this._intervalId != 0) {
                    clearInterval(this._intervalId);
                    this._intervalId = 0;
                }
                if (this._intervalId == 0) {
                    var that = this;
                    this._intervalId = setInterval(function () {
                        var leftTime = game.InvestModel.getInstance().leftTime - new Date().getSeconds();
                        if (leftTime <= 0) {
                            leftTime = 0;
                            clearInterval(this._intervalId);
                            this._intervalId = 0;
                        }
                        that.lb_invest_time.text = "剩余时间：" + game.InvestUtil.getFormatBySecond1(leftTime);
                    }, 1000);
                }
            }
            else {
                that.lb_invest_time.text = "剩余时间：" + game.InvestUtil.getFormatBySecond1(0);
                App.Socket.send(34001, {});
            }
            // if((InvestModel.getInstance() as InvestModel).isBuy)
            // {
            // 	this.btn_invest.currentState = "up";
            // }else
            // {
            // 	this.btn_invest.currentState = "down";
            // } 
            this.list_invest.dataProvider = game.InvestModel.getInstance().listData;
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        InvestView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.INVEST_INFO_UPDATE, this._eventId);
                this._eventId = 0;
            }
            if (this._intervalId != 0) {
                clearInterval(this._intervalId);
                this._intervalId = 0;
            }
        };
        /**
         * 销毁
         */
        InvestView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return InvestView;
    }(BaseView));
    game.InvestView = InvestView;
    __reflect(InvestView.prototype, "game.InvestView");
})(game || (game = {}));
//# sourceMappingURL=InvestView.js.map