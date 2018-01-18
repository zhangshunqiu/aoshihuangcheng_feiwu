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
    var MailBaseItem = (function (_super) {
        __extends(MailBaseItem, _super);
        function MailBaseItem() {
            return _super.call(this) || this;
            // this.skinName =MailBaseItemSkin;
        }
        MailBaseItem.prototype.dataChanged = function () {
            var type = this.data.type;
            var num = this.data.num;
            var good_id = this.data.good_id;
            this.baseItem.updateBaseItem(type, good_id, num);
            this.baseItem.setItemNameVisible(true);
            this.baseItem.setItemNumVisible(true);
        };
        return MailBaseItem;
    }(eui.ItemRenderer));
    game.MailBaseItem = MailBaseItem;
    __reflect(MailBaseItem.prototype, "game.MailBaseItem");
})(game || (game = {}));
//# sourceMappingURL=MailBaseItem.js.map