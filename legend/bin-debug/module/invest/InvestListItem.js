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
* 投资ListItem视图层 2017/06/20.
*/
var game;
(function (game) {
    var InvestListItem = (function (_super) {
        __extends(InvestListItem, _super);
        function InvestListItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "InvestListItemSkin";
            _this.btn_worShip.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.getReward, _this);
            return _this;
        }
        InvestListItem.prototype.getReward = function () {
            if (game.InvestModel.getInstance().isBuy) {
                App.Socket.send(34003, { id: this._rewardId });
            }
            else {
                App.GlobalTips.showTips("请先购买投资后领取奖励");
            }
        };
        InvestListItem.prototype.dataChanged = function () {
            var curLv = RoleManager.getInstance().roleInfo.lv;
            var curTurn = RoleManager.getInstance().roleInfo.turn;
            this._rewardId = this.data.id;
            if (this.data.level) {
                this.lb_level.text = "等级达到" + this.data.level + "级可领取";
            }
            if (this.data.turn) {
                this.lb_level.text = "等级达到" + this.data.turn + "转可领取";
            }
            this.lb_money.text = "可领取" + this.data.gold + "元宝";
            this.lb_num.text = this.data.gold;
            if (this.data.get) {
                this.img_get.visible = true;
                this.btn_worShip.visible = false;
                this.gp_cannot.visible = false;
            }
            else {
                //判断level是否 达到领取level
                if (this.data.level) {
                    if (curLv >= this.data.level) {
                        this.img_get.visible = false;
                        this.btn_worShip.visible = true;
                        this.gp_cannot.visible = false;
                    }
                    else {
                        //没达到等级（未达标）
                        this.img_get.visible = false;
                        this.btn_worShip.visible = false;
                        this.gp_cannot.visible = true;
                    }
                }
                //判断turn是否 达到领取turn
                if (this.data.turn) {
                    if (curTurn >= this.data.turn) {
                        this.img_get.visible = false;
                        this.btn_worShip.visible = true;
                        this.gp_cannot.visible = false;
                    }
                    else {
                        //没达到等级（未达标）
                        this.img_get.visible = false;
                        this.btn_worShip.visible = false;
                        this.gp_cannot.visible = true;
                    }
                }
            }
        };
        return InvestListItem;
    }(eui.ItemRenderer));
    game.InvestListItem = InvestListItem;
    __reflect(InvestListItem.prototype, "game.InvestListItem");
})(game || (game = {}));
//# sourceMappingURL=InvestListItem.js.map