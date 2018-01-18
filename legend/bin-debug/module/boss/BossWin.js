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
 * 挑战boss成功弹出面板  2017/11/13
 */
var game;
(function (game) {
    var BossWin = (function (_super) {
        __extends(BossWin, _super);
        function BossWin(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.countDownNum = 5;
            _this._bossModel = game.BossModel.getInstance();
            _this._heroModel = game.HeroModel.getInstance();
            _this._timerId = 0;
            _this._tower = false; //是否在爬塔
            _this._worldBoss = false; //是否在挑战世界boss
            _this._copySweep = false; //副本扫荡
            _this._startChallengeTowerEventId = 0; //请求挑战副本事件
            return _this;
        }
        BossWin.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        BossWin.prototype.initView = function () {
            this.lb_exp.text = "经验：" + (this._bossModel.bossInfo.exp || 0);
            this.lb_level.text = "LV." + App.RoleManager.roleInfo.lv;
            this.pb_exp.maximum = App.ConfigManager.getExpConfigByLv(Number(App.RoleManager.roleInfo.lv) + 1).exp; //升级所需经验
            this.pb_exp.value = App.RoleManager.roleInfo.exp; //人物当前经验
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
            this.gp_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetAward, this);
            this.dropItem();
        };
        /**
         * 领取奖励
         */
        BossWin.prototype.onGetAward = function () {
            this.stopTime();
            App.WinManager.closeWin(WinName.BOSS_WIN);
            if (this._bossModel.hookId > 40000) {
                App.WinManager.openWin(WinName.INCOME_PROMOTE); //弹出关卡收益提升
            }
        };
        BossWin.prototype.dropItem = function () {
            if (this.list) {
                this.list.dataProvider = new eui.ArrayCollection(this._bossModel.dropItem);
            }
        };
        /**
         * 点击弹出物品信息
         */
        BossWin.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(itemData.type, itemData.id, null);
        };
        BossWin.prototype.timeUpdate = function () {
            if (this.countDownNum >= 0) {
                this.btlb_countDown.text = this.countDownNum + "";
                this.countDownNum--;
            }
            else {
                this.stopTime();
                this._tower = false;
                this.onGetAward();
            }
        };
        /**
         * 停止计时器
         */
        BossWin.prototype.stopTime = function () {
            if (this._timerId != 0) {
                App.GlobalTimer.remove(this._timerId);
                this._timerId = 0;
            }
        };
        /**
        * 打开窗口
        */
        BossWin.prototype.openWin = function (openParam) {
            var _this = this;
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._tower = false;
            this._worldBoss = false;
            this.countDownNum = 5;
            if (this._timerId == 0) {
                this._timerId = App.GlobalTimer.addSchedule(1000, 0, this.timeUpdate, this);
            }
            if (openParam) {
                if (openParam >= 30200 && openParam < 30300) {
                    this.gp_get.x = 167;
                    this.gp_nextLevel.visible = true;
                    this.gp_nextLevel.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                        App.Socket.send(31002, { type: 3, id: ++game.CopyModel.getInstance().topId });
                        _this._tower = true;
                    }, this);
                    if (this._startChallengeTowerEventId == 0) {
                        this._startChallengeTowerEventId = App.EventSystem.addEventListener(PanelNotify.COPY_ASK_CHALLENGE_RESULT, this.closeWin, this);
                    }
                }
                else if (openParam == "encounter") {
                    this.gp_bossTop.visible = false;
                    this.gp_worldBossTop.visible = false;
                    this.lb_rewardDes.y = 310;
                    this.scroller.y = 360;
                }
                else if (openParam == "copySweep") {
                    this._copySweep = true;
                }
            }
            else if (SceneUtil.isWorldBossScene(SceneModel.getInstance().sceneId)) {
                this.gp_bossTop.visible = false;
                this.lb_rewardDes.visible = false;
                this.gp_worldBossTop.visible = true;
                this.lb_rank.text = "第" + this._bossModel.rank;
                if (this._bossModel.rank == 1) {
                    this.img_rewardType.source = "worldboss_jishadajiang_png";
                }
                else {
                    this.img_rewardType.source = "worldboss_canyudajiang_png";
                }
                this._worldBoss = true;
            }
            this.dropItem();
        };
        /**
         * 关闭窗口
         */
        BossWin.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        BossWin.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            this.stopTime();
            if (this._worldBoss) {
                App.Socket.send(36008, {});
                this._worldBoss = false;
                this._tower = true; //此处设置只是为了不发13001
            }
            else if (this._copySweep) {
            }
            else if (!this._tower) {
                App.Socket.send(13001, {});
                if (this._startChallengeTowerEventId != 0) {
                    App.EventSystem.removeEventListener(PanelNotify.COPY_ASK_CHALLENGE_RESULT, this._startChallengeTowerEventId);
                    this._startChallengeTowerEventId = 0;
                }
            }
            this._bossModel.wave = 0;
            App.EventSystem.dispatchEvent(PanelNotify.BOSS_WAVE_UPDATE);
        };
        /**
         * 销毁
         */
        BossWin.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return BossWin;
    }(BaseView));
    game.BossWin = BossWin;
    __reflect(BossWin.prototype, "game.BossWin");
    var getItem = (function (_super) {
        __extends(getItem, _super);
        function getItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"getItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"100\" height=\"100\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
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
//# sourceMappingURL=BossWin.js.map