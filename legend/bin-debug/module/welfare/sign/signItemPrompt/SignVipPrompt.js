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
    var SignVipPrompt = (function (_super) {
        __extends(SignVipPrompt, _super);
        function SignVipPrompt(vo) {
            var _this = _super.call(this, vo) || this;
            _this._numberArr = [null, null, "双", "三", "四", "五"];
            return _this;
        }
        SignVipPrompt.prototype.childrenCreated = function () {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
            this.img_refuse.addEventListener(egret.TouchEvent.TOUCH_TAP, this.refuseHandler, this);
            this.img_accept.addEventListener(egret.TouchEvent.TOUCH_TAP, this.acceptHandler, this);
        };
        SignVipPrompt.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this);
            this._signDataConfig = this.openData[0];
            this._protocalId = this.openData[1];
            this.showLabelText();
        };
        SignVipPrompt.prototype.showLabelText = function () {
            // this.lb_text.text = "vip" + this._signData["vip"] + "可获取" + this._signData["multiple"] + "倍奖励";
            this.lb_text.textFlow = [{ text: "vip" + this._signDataConfig["vip"], style: { textColor: 0xeb0601 } },
                { text: "可", style: { textColor: 0xf87500 } },
                { text: this._numberArr[this._signDataConfig["multiple"]] + "倍", style: { textColor: 0x00f829 } },
                { text: "领取签到奖励", style: { textColor: 0xf87500 } }];
        };
        SignVipPrompt.prototype.closeHandler = function () {
            // PopUpManager.removePopUp(this);
            WinManager.getInstance().closePopWin(WinName.POP_SIGN_VIP);
        };
        SignVipPrompt.prototype.refuseHandler = function () {
            App.Socket.send(this._protocalId, {});
            // PopUpManager.removePopUp(this);
            WinManager.getInstance().closePopWin(WinName.POP_SIGN_VIP);
        };
        SignVipPrompt.prototype.acceptHandler = function () {
            //弹vip充值框
            WinManager.getInstance().openWin(WinName.VIP);
            WinManager.getInstance().closeWin(WinName.POP_SIGN_VIP);
        };
        SignVipPrompt.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        SignVipPrompt.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return SignVipPrompt;
    }(BaseView));
    game.SignVipPrompt = SignVipPrompt;
    __reflect(SignVipPrompt.prototype, "game.SignVipPrompt");
})(game || (game = {}));
//# sourceMappingURL=SignVipPrompt.js.map