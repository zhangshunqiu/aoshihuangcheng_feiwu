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
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 窗口基类背景皮肤
 */
var ComBaseViewBg = (function (_super) {
    __extends(ComBaseViewBg, _super);
    function ComBaseViewBg(params) {
        var _this = _super.call(this) || this;
        _this._wealthEventId = 0;
        _this.skinName = "ComBaseViewBgSkin";
        return _this;
    }
    ComBaseViewBg.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        if (this.hasEventListener(egret.Event.REMOVED_FROM_STAGE) == false) {
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        }
        this.btn_winCoin.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            App.GlobalTips.showItemWayTips(0, 101);
        }, this);
        this.btn_winGold.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            game.RechargeOpenManager.getInstance().openRechargeView();
        }, this);
        // egret.callLater(() => {
        // 	this.mask = new egret.Rectangle(0, 0, this.width, this.height);
        // }, this);
        if (this._winVo) {
            this.setTitleSource(this._winVo.title);
        }
        this.updateWealthInfo();
    };
    Object.defineProperty(ComBaseViewBg.prototype, "winVo", {
        /**
         * 设置串口VO，必须要设置
         */
        set: function (value) {
            this._winVo = value;
            if (this._wealthEventId == 0) {
                this._wealthEventId = App.EventSystem.addEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this.updateWealthInfo, this);
            }
            if (this._winVo) {
                this.setTitleSource(this._winVo.title);
            }
            //this.updateWealthInfo();
        },
        enumerable: true,
        configurable: true
    });
    ComBaseViewBg.prototype.setTitleSource = function (title) {
        if (title && title != "" && this.img_winTitle) {
            this.img_winTitle.source = title;
        }
    };
    ComBaseViewBg.prototype.clear = function () {
        if (this.hasEventListener(egret.Event.REMOVED_FROM_STAGE)) {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        }
        if (this._wealthEventId != 0) {
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_UPDATE_PLAYER_INFO, this._wealthEventId);
            this._wealthEventId = 0;
        }
    };
    ComBaseViewBg.prototype.destroy = function () {
        this.clear();
    };
    ComBaseViewBg.prototype.updateWealthInfo = function () {
        if (this.lb_winCoin) {
            this.lb_winCoin.text = GlobalUtil.fixNum(App.RoleManager.roleWealthInfo.coin);
        }
        if (this.lb_winGold) {
            this.lb_winGold.text = GlobalUtil.fixNum(App.RoleManager.roleWealthInfo.gold);
        }
    };
    ComBaseViewBg.prototype.onRemoveFromStage = function () {
        this.destroy();
    };
    return ComBaseViewBg;
}(eui.Component));
__reflect(ComBaseViewBg.prototype, "ComBaseViewBg");
//# sourceMappingURL=ComBaseViewBg.js.map