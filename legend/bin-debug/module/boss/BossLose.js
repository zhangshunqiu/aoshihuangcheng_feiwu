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
 * 挑战Boss失败弹出窗口 2017/11/13
 */
var game;
(function (game) {
    var BossLose = (function (_super) {
        __extends(BossLose, _super);
        function BossLose(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.countDownNum = 5;
            _this._timerId = 0;
            _this._worldBoss = false;
            _this._bossModel = game.BossModel.getInstance();
            return _this;
        }
        BossLose.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_role.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this);
            this.img_wing.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openWingWin, this);
            this.img_forge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openForgeWin, this);
            this.img_raid.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRaidWin, this);
            this.gp_go.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this);
            this.gp_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
            if (App.RoleManager.heroList.length == 3) {
                this.gp_middle.visible = false;
            }
        };
        BossLose.prototype.openHeroWin = function () {
            App.WinManager.openWin(WinName.HERO);
        };
        BossLose.prototype.openWingWin = function () {
            App.WinManager.openWin(WinName.WING);
        };
        BossLose.prototype.openForgeWin = function () {
            App.WinManager.openWin(WinName.FORGE);
        };
        BossLose.prototype.openRaidWin = function () {
            App.WinManager.openWin(WinName.RAIDER);
        };
        /**
         * 返回挂机场景
         */
        BossLose.prototype.onBack = function () {
            this.stopTime();
            App.WinManager.closeWin(WinName.BOSS_LOSE);
        };
        BossLose.prototype.timeUpdate = function () {
            if (this.countDownNum >= 0) {
                this.btlb_countDown.text = this.countDownNum + "";
                this.countDownNum--;
            }
            else {
                this.stopTime();
                this.onBack();
            }
        };
        BossLose.prototype.initDropList = function () {
            this.list = new eui.List();
            this.list.itemRenderer = getItem;
            var layout = new eui.TileLayout();
            layout.requestedColumnCount = 4;
            layout.verticalGap = 10;
            layout.horizontalGap = 10;
            layout.horizontalAlign = egret.HorizontalAlign.LEFT;
            this.list.layout = layout;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this); //点击物品弹出对应物品信息
            this.scroller.viewport = this.list;
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
            this.list.dataProvider = new eui.ArrayCollection([]);
        };
        BossLose.prototype.dropItem = function () {
            if (this.list) {
                this.list.dataProvider = new eui.ArrayCollection(this._bossModel.dropItem);
            }
        };
        /**
         * 点击弹出物品信息
         */
        BossLose.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(itemData.type, itemData.good_id, itemData.id);
        };
        /**
         * 打开窗口
         */
        BossLose.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam == "encounter") {
                this.gp_middle.visible = false;
                this.initDropList();
                this.dropItem();
            }
            if (SceneUtil.isWorldBossScene(SceneModel.getInstance().sceneId)) {
                this._worldBoss = true;
            }
            this.countDownNum = 5;
            if (this._timerId == 0) {
                this._timerId = App.GlobalTimer.addSchedule(1000, 0, this.timeUpdate, this);
            }
        };
        /**
         * 停止计时器
         */
        BossLose.prototype.stopTime = function () {
            if (this._timerId != 0) {
                App.GlobalTimer.remove(this._timerId);
                this._timerId = 0;
            }
        };
        /**
         * 关闭窗口
         */
        BossLose.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        BossLose.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            this.stopTime();
            App.GlobalTimer.remove(this._timerId);
            this._bossModel.wave = 0; //把打小怪的波数清零
            App.EventSystem.dispatchEvent(PanelNotify.BOSS_WAVE_UPDATE);
            if (this._worldBoss) {
                App.Socket.send(36008, {});
                this._worldBoss = false;
            }
            else {
                App.Socket.send(13001, {});
            }
        };
        /**
         * 销毁
         */
        BossLose.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return BossLose;
    }(BaseView));
    game.BossLose = BossLose;
    __reflect(BossLose.prototype, "game.BossLose");
    var getItem = (function (_super) {
        __extends(getItem, _super);
        function getItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"getItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"90\" height=\"90\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
            _this.baseItem.setItemNameVisible(true);
            return _this;
        }
        getItem.prototype.dataChanged = function () {
            this.data.id = this.data.id || this.data.good_id;
            this.data.type = this.data.type || ClientType.BASE_ITEM;
            this.data.num = this.data.num || this.data.good_num;
            this.baseItem.updateBaseItem(this.data.type, this.data.id, this.data.num);
        };
        return getItem;
    }(eui.ItemRenderer));
    __reflect(getItem.prototype, "getItem");
})(game || (game = {}));
//# sourceMappingURL=BossLose.js.map