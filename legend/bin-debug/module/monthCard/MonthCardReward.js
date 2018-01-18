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
 * Author: liuyonggen
 * 月卡购买奖励弹窗 2017/11/24
 */
var game;
(function (game) {
    var MonthCardReward = (function (_super) {
        __extends(MonthCardReward, _super);
        function MonthCardReward(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._monthCardModel = game.MonthCardModel.getInstance();
            return _this;
        }
        MonthCardReward.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.list.itemRenderer = backpackItem;
            var layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.horizontalGap = 20;
            layout.horizontalAlign = egret.HorizontalAlign.CENTER;
            this.list.layout = layout;
            this.list.dataProvider = new eui.ArrayCollection(this._monthCardModel.rewardList);
        };
        /**
         * 打开窗口
         */
        MonthCardReward.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
        };
        /**
         * 关闭窗口
         */
        MonthCardReward.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        MonthCardReward.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        MonthCardReward.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return MonthCardReward;
    }(BaseView));
    game.MonthCardReward = MonthCardReward;
    __reflect(MonthCardReward.prototype, "game.MonthCardReward");
    var backpackItem = (function (_super) {
        __extends(backpackItem, _super);
        function backpackItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"backpackItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"90\" height=\"90\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
            _this.baseItem.setItemNameVisible(true);
            return _this;
        }
        backpackItem.prototype.dataChanged = function () {
            this.baseItem.updateBaseItem(this.data[0], this.data[1], this.data[2]);
        };
        return backpackItem;
    }(eui.ItemRenderer));
    __reflect(backpackItem.prototype, "backpackItem");
})(game || (game = {}));
//# sourceMappingURL=MonthCardReward.js.map