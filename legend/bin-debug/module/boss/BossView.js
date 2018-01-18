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
 * Boss模块视图窗口  2017/11/13
 */
var game;
(function (game) {
    var BossView = (function (_super) {
        __extends(BossView, _super);
        function BossView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._bossRewardEventId = 0;
            _this._askChallengeEventId = 0;
            _this._rankUpdateEventId = 0;
            _this.bossModel = game.BossModel.getInstance();
            return _this;
        }
        BossView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.closeWin(WinName.BOSS);
            }, this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.closeWin(WinName.BOSS);
            }, this);
            this.lb_look_ranking.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                WinManager.getInstance().openWin(WinName.RankGuanqia);
            }, this);
            this.gp_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.challengeBoss, this); //点击挑战boss
            this.img_getReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetReward, this);
            this.getReward();
            this.initView(); //初始化挑战boss界面
        };
        BossView.prototype.challengeBoss = function () {
            if (!GlobalUtil.checkBagCapacity()) {
                App.Socket.send(13002, {});
            }
        };
        BossView.prototype.getReward = function () {
            if (this.bossModel.getBossRewardNum > 0) {
                if (this.bossModel.passReward) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.BOSS_CHALLENGE, true);
                    this.gp_getReward.visible = true;
                    this.lb_passRewardName.text = this.bossModel.passReward.name;
                    this.img_passReward1.source = this.bossModel.passReward.icon + "_png";
                }
            }
            else {
                this.gp_getReward.visible = false;
                App.BtnTipManager.setTypeValue(ConstBtnTipType.BOSS_CHALLENGE, false);
            }
        };
        BossView.prototype.onGetReward = function () {
            App.Socket.send(13011, {});
            this.bossModel.getBossRewardNum--;
            this.bossModel.getPassReward();
            this.getReward();
        };
        BossView.prototype.initView = function () {
            //获取关卡
            this.btlb_guanqia.text = "第" + this.bossModel.sceneInfo.lv_limit + "关";
            //获取关卡boss
            var bossInfo = this.bossModel.bossInfo;
            this.joinBoss(bossInfo.resId, bossInfo.magnify_ratio);
            //获取boss名称
            var bossName = "boss_txt_" + bossInfo.name_photo + "_png";
            this.img_bossName.source = bossName;
            //获取已挑战次数
            this.pb_challengeNum.value = (this.bossModel.sceneInfo.lv_limit - 1) % 10;
            //获取掉落物品
            this.getDrop();
        };
        BossView.prototype.getDrop = function () {
            var _this = this;
            this.img_passReward.source = this.bossModel.currentPassReward.icon + "_png";
            this.list.itemRenderer = backpackItem;
            var layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.horizontalGap = 20;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            this.list.layout = layout;
            this.list.dataProvider = new eui.ArrayCollection(this.bossModel.showDrop);
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
            this.img_passReward.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.GlobalTips.showItemTips(1, _this.bossModel.currentPassReward.id, null);
            }, this);
        };
        BossView.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(itemData.type, itemData.good_id, itemData.id);
        };
        BossView.prototype.joinBoss = function (resId, scale) {
            this.mc = new AMovieClip();
            this.mc.scaleX = scale;
            this.mc.scaleY = scale;
            this.gp_boss.addChild(this.mc);
            this.mc.frameRate = 4;
            this.mc.playMCKey(resId + "15");
        };
        BossView.prototype.checkGuide = function () {
            if (App.GuideManager.startGuide && App.GuideManager.curGuideId) {
                var curGuideInfo = App.ConfigManager.getGuideInfoByIdAndStep(App.GuideManager.curGuideId, 2);
                if (curGuideInfo.type == 1) {
                    this._curGuideId = App.GuideManager.curGuideId;
                    App.GuideManager.bindClickBtn(this.gp_challenge, App.GuideManager.curGuideId, 2);
                    App.GuideManager.checkGuide(this._curGuideId);
                }
            }
        };
        BossView.prototype.removeGuide = function () {
            if (this._curGuideId) {
                App.GuideManager.removeClickBtn(this._curGuideId, 2);
            }
        };
        BossView.prototype.updateRank = function () {
            //获取关卡排名
            var ranking = game.RankGuanqiaModel.getInstance().rankArr;
            for (var i = 1; i <= 3; i++) {
                this["lb_no" + i].text = i + "." + ranking[i - 1]["name"];
                this["lb_no" + i + "_guanqia"].text = "第" + ranking[i - 1]["guanqia"] + '关';
            }
        };
        /**
         * 打开窗口
         */
        BossView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._bossRewardEventId == 0) {
                this._bossRewardEventId = App.EventSystem.addEventListener(PanelNotify.BOSS_REWARD_UPDATE, this.getReward, this);
            }
            if (this._askChallengeEventId == 0) {
                this._askChallengeEventId = App.EventSystem.addEventListener(PanelNotify.BOSS_CHALLENGE, this.closeWin, this);
            }
            if (this._rankUpdateEventId == 0) {
                this._rankUpdateEventId = App.EventSystem.addEventListener(PanelNotify.RANK_GUANQIA_UPDATE, this.updateRank, this);
            }
            App.Socket.send(13012, {});
            egret.setTimeout(function () {
                App.Socket.send(27009, {});
            }, this, 100);
            this.checkGuide();
        };
        /**
         * 关闭窗口
         */
        BossView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        BossView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._bossRewardEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.BOSS_REWARD_UPDATE, this._bossRewardEventId);
                this._bossRewardEventId = 0;
            }
            this.removeGuide();
            if (this._askChallengeEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.BOSS_CHALLENGE, this._askChallengeEventId);
                this._askChallengeEventId = 0;
            }
            if (this._rankUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.RANK_GUANQIA_UPDATE, this._rankUpdateEventId);
                this._rankUpdateEventId = 0;
            }
        };
        /**
         * 销毁
         */
        BossView.prototype.destory = function () {
            _super.prototype.destroy.call(this);
            if (this.mc) {
                this.mc.destroy();
                this.mc = null;
                delete this.mc;
            }
        };
        return BossView;
    }(BaseView));
    game.BossView = BossView;
    __reflect(BossView.prototype, "game.BossView");
    var backpackItem = (function (_super) {
        __extends(backpackItem, _super);
        function backpackItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"backpackItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"90\" height=\"90\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
            _this.baseItem.setItemNameVisible(true);
            _this.baseItem.setItemNumVisible(false);
            return _this;
        }
        backpackItem.prototype.dataChanged = function () {
            this.baseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
        };
        return backpackItem;
    }(eui.ItemRenderer));
    __reflect(backpackItem.prototype, "backpackItem");
})(game || (game = {}));
//# sourceMappingURL=BossView.js.map