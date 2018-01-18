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
    var FirstRechargeListItem = (function (_super) {
        __extends(FirstRechargeListItem, _super);
        function FirstRechargeListItem() {
            var _this = _super.call(this) || this;
            _this.skinName = FirstRechargeListItemSkin;
            _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.handlerToRecharge, _this);
            return _this;
        }
        FirstRechargeListItem.prototype.handlerToRecharge = function () {
            //点击充值	this.data是充值的人民币
        };
        FirstRechargeListItem.prototype.dataChanged = function () {
            var charge_rate = ConfigManager.getInstance().getConstConfigByType("CHARGE_RATE")["value"];
            var multiple = ConfigManager.getInstance().getFirstChargeInfo()["1"]["multi"];
            this.lb_money.text = this.data + "元";
            this.lb_gold.text = "获得" + (this.data * multiple * charge_rate) + "元宝";
            this.lb_gold.textFlow = [
                { text: "获得", style: { textColor: 0xB3A1A1 } },
                { text: (this.data * multiple * charge_rate) + "", style: { textColor: 0xffea01 } },
                { text: "元宝", style: { textColor: 0xB3A1A1 } }
            ];
        };
        return FirstRechargeListItem;
    }(eui.ItemRenderer));
    game.FirstRechargeListItem = FirstRechargeListItem;
    __reflect(FirstRechargeListItem.prototype, "game.FirstRechargeListItem");
})(game || (game = {}));
//# sourceMappingURL=FirstRechargeListItem.js.map