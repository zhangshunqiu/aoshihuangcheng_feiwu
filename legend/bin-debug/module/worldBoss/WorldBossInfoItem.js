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
 * 世界boss视图窗口 2017/12/5
 */
var game;
(function (game) {
    var WorldBossInfoItem = (function (_super) {
        __extends(WorldBossInfoItem, _super);
        function WorldBossInfoItem() {
            var _this = _super.call(this) || this;
            _this.maxIndex = 0;
            _this._eventId = 0;
            _this._worldBossFightEventId = 0;
            _this._vipModel = game.VipModel.getInstance();
            _this._worldBossModel = game.WorldBossModel.getInstance();
            _this.skinName = "WorldBossInfoItem";
            _this.initView();
            return _this;
        }
        WorldBossInfoItem.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.img_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toLeft, this);
            this.img_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toRight, this);
            this.gp_main.addChild(this.pageView);
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.challengeBoss, this);
            this.img_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.openWin(WinName.WORLDBOSS_REWARD, _this.worldBossInfo.worldBossItem);
            }, this);
            if (this._worldBossFightEventId == 0) {
                this._worldBossFightEventId = App.EventSystem.addEventListener(PanelNotify.WORLDBOSS_FIGHT, function () {
                    App.WinManager.closeWin(WinName.WORLDBOSS);
                }, this);
            }
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.PAGE_CURRENTINDEX_UPDATE, this.onCurrentIndexUpdate, this);
            }
        };
        WorldBossInfoItem.prototype.challengeBoss = function () {
            if (this.worldBossInfo.pbWorldBossItem.status == 0) {
                var text = [{ text: "等级不足或Boss未复活", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                App.GlobalTips.showTips(text);
            }
            else {
                if (this.worldBossInfo.pbWorldBossItem.left_times == 0) {
                    App.WinManager.openWin(WinName.WORLDBOSS_BUY_TIMES);
                }
                else if (!GlobalUtil.checkBagCapacity()) {
                    App.Socket.send(36002, { scene_id: this.worldBossInfo.worldBossItem.scene_id });
                }
            }
        };
        WorldBossInfoItem.prototype.initView = function () {
            this.pageView = new PageView();
            this.pageView.setTabbarEnabled(false);
            this.pageView.itemRenderer = backpackGroup;
            this.pageView.horizontalCenter = 1;
            this.pageView.height = 200;
            this.pageView.width = 450;
        };
        WorldBossInfoItem.prototype.updateView = function (data) {
            this.worldBossInfo = data;
            this._worldBossModel.changeToPage(data.worldBossItem);
            this.maxIndex = data.worldBossItem.killReward.length;
            this.pageView.dataProvider = new eui.ArrayCollection(data.worldBossItem.killReward);
            if (data.worldBossItem.killReward.length < 2) {
                this.img_left.visible = false;
                this.img_right.visible = false;
            }
            else {
                this.onCurrentIndexUpdate();
            }
            if (data.pbWorldBossItem.status == 1) {
                this.btn_challenge.currentState = "up";
            }
            else {
                this.btn_challenge.currentState = "down";
            }
        };
        WorldBossInfoItem.prototype.updateReward = function (data) {
            this.pageView.dataProvider = new eui.ArrayCollection(data);
            this.maxIndex = data.length;
            if (data.length < 2) {
                this.img_left.visible = false;
                this.img_right.visible = false;
            }
            else {
                this.onCurrentIndexUpdate();
            }
            this.gp_other.visible = false;
            this.btn_challenge.visible = false;
            this.img_challenge.visible = false;
        };
        WorldBossInfoItem.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        };
        WorldBossInfoItem.prototype.toLeft = function () {
            var index = this.pageView.currentIndex - 1;
            App.loglyg("index", index);
            if (index >= 0) {
                this.pageView.jumpToPages(index);
                // this.pageView.currentIndex = index;
                this.onCurrentIndexUpdate();
            }
        };
        WorldBossInfoItem.prototype.toRight = function () {
            var index = this.pageView.currentIndex + 1;
            if (index <= 10) {
                this.pageView.jumpToPages(index);
                this.onCurrentIndexUpdate();
                // this.pageView.currentIndex = index;
            }
        };
        WorldBossInfoItem.prototype.onCurrentIndexUpdate = function () {
            if (this.pageView.currentIndex === 0) {
                this.img_left.visible = false;
                this.img_right.visible = true;
            }
            else if (this.pageView.currentIndex === this.maxIndex - 1) {
                this.img_right.visible = false;
                this.img_left.visible = true;
            }
            else {
                this.img_left.visible = true;
                this.img_right.visible = true;
            }
        };
        WorldBossInfoItem.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        WorldBossInfoItem.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.PAGE_CURRENTINDEX_UPDATE, this._eventId);
                this._eventId = 0;
            }
            if (this._worldBossFightEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WORLDBOSS_FIGHT, this._worldBossFightEventId);
                this._worldBossFightEventId = 0;
            }
        };
        /**
         * 销毁
         */
        WorldBossInfoItem.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WorldBossInfoItem;
    }(BaseView));
    game.WorldBossInfoItem = WorldBossInfoItem;
    __reflect(WorldBossInfoItem.prototype, "game.WorldBossInfoItem");
    var backpackGroup = (function (_super) {
        __extends(backpackGroup, _super);
        function backpackGroup() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"backpackItemSkin\" width=\"500\" height=\"200\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:List id=\"list\" width=\"500\" height=\"200\">\n\t\t\t\t\t\t\n\t\t\t\t\t</e:List>\n\t\t\t\t</e:Skin>";
            var layout = new eui.TileLayout();
            layout.requestedColumnCount = 4;
            layout.requestedRowCount = 2;
            layout.verticalGap = -15;
            layout.verticalAlign = egret.VerticalAlign.JUSTIFY;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            _this.list.layout = layout;
            _this.list.itemRenderer = backpackItem;
            _this.list.x = 20;
            _this.list.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (e) {
                e.stopImmediatePropagation();
            }, _this);
            _this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, _this.itemTap, _this);
            return _this;
        }
        backpackGroup.prototype.reload = function (data) {
            this.list.dataProvider = new eui.ArrayCollection(data);
        };
        backpackGroup.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        };
        return backpackGroup;
    }(PageViewItem));
    __reflect(backpackGroup.prototype, "backpackGroup");
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
//# sourceMappingURL=WorldBossInfoItem.js.map