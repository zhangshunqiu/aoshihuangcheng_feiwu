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
    var EncounterRewardListItem = (function (_super) {
        __extends(EncounterRewardListItem, _super);
        function EncounterRewardListItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "EncounterRewardListItemSkin";
            return _this;
        }
        EncounterRewardListItem.prototype.dataChanged = function () {
            _super.prototype.dataChanged.call(this);
            var rankUp = this.data.rank_up;
            var rankDown = this.data.rank_down;
            var rewardArr = this.data.reward;
            if (rankUp == rankDown) {
                this.lb_rank.text = "第" + rankUp + "名";
            }
            else {
                this.lb_rank.text = "第" + rankUp + "名" + "~" + "第" + rankDown + "名";
            }
            this.baseItem0.updateBaseItem(rewardArr[0][0], rewardArr[0][1], rewardArr[0][2]);
            this.baseItem0.anchorOffsetX = 0;
            this.baseItem0.anchorOffsetY = 0;
            this.baseItem1.updateBaseItem(rewardArr[1][0], rewardArr[1][1], rewardArr[1][2]);
            this.baseItem1.anchorOffsetX = 0;
            this.baseItem1.anchorOffsetY = 0;
        };
        return EncounterRewardListItem;
    }(eui.ItemRenderer));
    game.EncounterRewardListItem = EncounterRewardListItem;
    __reflect(EncounterRewardListItem.prototype, "game.EncounterRewardListItem");
})(game || (game = {}));
//# sourceMappingURL=EncounterRewardListItem.js.map