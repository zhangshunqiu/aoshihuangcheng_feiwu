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
    var GuanqiaListItem = (function (_super) {
        __extends(GuanqiaListItem, _super);
        function GuanqiaListItem() {
            var _this = _super.call(this) || this;
            _this.skinName = GuanqiaListItemSkin;
            return _this;
        }
        GuanqiaListItem.prototype.dataChanged = function () {
            console.log(this.data);
            var vo = this.data;
            this.lb_name.text = vo.name;
            this.lb_rank.text = vo.rank + "";
            this.lb_combat.text = vo.combat;
            this.lb_guanqia.text = vo.guanqia + "";
            if (vo.month_card) {
                this.img_yue.visible = true;
            }
            else {
                this.img_yue.visible = false;
            }
            if (vo.vipLv) {
                this.img_vip.visible = true;
                this.bitmap_vip.visible = true;
                this.bitmap_vip.text = vo.vipLv + "";
            }
            else {
                this.img_vip.visible = false;
                this.bitmap_vip.visible = false;
            }
        };
        return GuanqiaListItem;
    }(eui.ItemRenderer));
    game.GuanqiaListItem = GuanqiaListItem;
    __reflect(GuanqiaListItem.prototype, "game.GuanqiaListItem");
})(game || (game = {}));
//# sourceMappingURL=GuanqiaListItem.js.map