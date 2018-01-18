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
    var RechargeListItem = (function (_super) {
        __extends(RechargeListItem, _super);
        function RechargeListItem() {
            var _this = _super.call(this) || this;
            _this.skinName = RechargeListItemSkin;
            return _this;
        }
        RechargeListItem.prototype.dataChanged = function () {
            this.img_gold.source = "VIPcharge_yuanbao" + this.itemIndex + "_png";
            var charge_rate = ConfigManager.getInstance().getConstConfigByType("CHARGE_RATE")["value"];
            var configData = this.data[0];
            if (this.data[1]) {
                //可以赠送元宝
                this.gp_attach.visible = true;
                this.lb_gold_attach.text = configData.ext_gold + "元宝";
                this.lb_gold_total.text = (configData.rmb * charge_rate + configData.ext_gold);
            }
            else {
                //不可以赠送元宝
                this.gp_attach.visible = false;
                this.lb_gold_total.text = (configData.rmb * charge_rate) + "";
            }
            this.lb_money.text = configData.rmb + "元";
        };
        return RechargeListItem;
    }(eui.ItemRenderer));
    game.RechargeListItem = RechargeListItem;
    __reflect(RechargeListItem.prototype, "game.RechargeListItem");
})(game || (game = {}));
//# sourceMappingURL=RechargeListItem.js.map