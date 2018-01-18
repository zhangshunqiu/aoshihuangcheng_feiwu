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
 * 遭遇Boss模块视图窗口  2017/11/27
 */
var game;
(function (game) {
    var BossMeet = (function (_super) {
        __extends(BossMeet, _super);
        function BossMeet(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._bossModel = game.BossModel.getInstance();
            _this._startChallengeEventId = 0;
            return _this;
        }
        BossMeet.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_thinkAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.img_challengeBoss.addEventListener(egret.TouchEvent.TOUCH_TAP, this.challengeBoss, this);
            this.list.itemRenderer = backpackItem;
            var layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            this.list.layout = layout;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
        };
        BossMeet.prototype.challengeBoss = function () {
            App.Socket.send(13014, {});
        };
        BossMeet.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(ClientType.BASE_ITEM, itemData[0], null);
        };
        BossMeet.prototype.joinBoss = function (resId, scale) {
            if (this._bossMc == null) {
                this._bossMc = new AMovieClip();
                this._bossMc.scaleX = scale;
                this._bossMc.scaleY = scale;
                this.gp_boss.addChild(this._bossMc);
                this._bossMc.frameRate = 4;
            }
            this._bossMc.playMCKey(resId + "15"); //加15是获得模型的正面
        };
        BossMeet.prototype.updateView = function () {
            this.joinBoss(this._bossModel.meetBossInfo.resId, this._bossModel.meetBossInfo.magnify_ratio || 2);
            this.lb_bossName.text = this._bossModel.meetBossInfo.name;
            this.lb_bossLv.text = "Lv." + this._bossModel.meetBossInfo.lv;
            this.list.dataProvider = new eui.ArrayCollection(this._bossModel.sceneInfo.drop_list);
        };
        /**
         * 打开窗口
         */
        BossMeet.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._startChallengeEventId == 0) {
                this._startChallengeEventId = App.EventSystem.addEventListener(PanelNotify.BOSS_MEET_START_CHALLENGE, this.closeWin, this);
            }
            this.updateView();
        };
        /**
         * 关闭窗口
         */
        BossMeet.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        BossMeet.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._bossMc) {
                this._bossMc.destroy();
                this._bossMc = null;
            }
            if (this._startChallengeEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.BOSS_MEET_START_CHALLENGE, this._startChallengeEventId);
                this._startChallengeEventId = 0;
            }
        };
        /**
         * 销毁
         */
        BossMeet.prototype.destory = function () {
            _super.prototype.destroy.call(this);
        };
        return BossMeet;
    }(BaseView));
    game.BossMeet = BossMeet;
    __reflect(BossMeet.prototype, "game.BossMeet");
    var backpackItem = (function (_super) {
        __extends(backpackItem, _super);
        function backpackItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"backpackItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"90\" height=\"90\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
            return _this;
        }
        backpackItem.prototype.dataChanged = function () {
            this.baseItem.updateBaseItem(ClientType.BASE_ITEM, this.data[0], this.data[2]);
        };
        return backpackItem;
    }(eui.ItemRenderer));
    __reflect(backpackItem.prototype, "backpackItem");
})(game || (game = {}));
//# sourceMappingURL=BossMeet.js.map