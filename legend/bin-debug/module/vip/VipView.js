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
 * Vip系统数据模型 2017/11/21
 */
var game;
(function (game) {
    var VipView = (function (_super) {
        __extends(VipView, _super);
        function VipView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._eventId = 0;
            _this._eventId1 = 0;
            _this._heroModel = game.HeroModel.getInstance();
            _this._vipModel = game.VipModel.getInstance();
            return _this;
        }
        VipView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
            this.updateView();
            this.validateNow();
        };
        VipView.prototype.setBtnRedTip = function () {
            if (this._vipModel.hasReward) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.VIPGIFT, true);
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.VIPGIFT, false);
            }
        };
        VipView.prototype.initView = function () {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.VIP);
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.VIP);
            }, this);
            this.img_left.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toLeft, this);
            this.img_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toRight, this);
            this.img_charge.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                game.RechargeOpenManager.getInstance().openRechargeView();
            }, this);
            this.pageView = new PageView();
            this.pageView.setTabbarEnabled(false);
            this.pageView.itemRenderer = vipGroup;
            this.pageView.horizontalCenter = 1;
            this.pageView.height = 1000;
            this.pageView.width = 680;
            this.gp_main.addChild(this.pageView);
            this.pageView.cancelSlide();
        };
        VipView.prototype.updateVipInfo = function () {
            this.pageView.dataProvider = new eui.ArrayCollection(this._vipModel.vipArr);
            this.pageView.currentIndex = this._vipModel.currentIndex;
            this.updateView();
            this.onCurrentIndexUpdate();
            this.checkGuide();
        };
        VipView.prototype.updateView = function () {
            var vipInfo = this._vipModel.vipInfo;
            var nextVipInfo = this._vipModel.nextVipInfo;
            this.btlb_vip.text = vipInfo.vip;
            if (vipInfo.vip == 10) {
                this.btlb_nextVip.text = vipInfo.vip;
                this.gp_maxVip.visible = true;
                this.gp_notMaxVip.visible = false;
            }
            else {
                this.btlb_nextVip.text = vipInfo.vip + 1;
                this.lb_nextVip.text = vipInfo.vip + 1;
                this.lb_gold.text = this._vipModel.upGold + "";
            }
        };
        VipView.prototype.toLeft = function () {
            var index = this.pageView.currentIndex - 1;
            App.loglyg("index", index);
            if (index >= 0) {
                this.pageView.jumpToPages(index);
                // this.pageView.currentIndex = index;
            }
        };
        VipView.prototype.toRight = function () {
            var index = this.pageView.currentIndex + 1;
            if (index <= 10) {
                this.pageView.jumpToPages(index);
                // this.pageView.currentIndex = index;
            }
        };
        VipView.prototype.onCurrentIndexUpdate = function () {
            if (this.pageView.currentIndex === 0) {
                this.img_left.visible = false;
            }
            else if (this.pageView.currentIndex === 10) {
                this.img_right.visible = false;
            }
            else {
                this.img_left.visible = true;
                this.img_right.visible = true;
            }
        };
        VipView.prototype.checkGuide = function () {
            var gp = this.pageView.getChildAt(0).getChildAt(0);
            App.GuideManager.bindClickBtn(gp.getChildAt(0).getChildByName("btn_get"), 1021, 2);
            App.GuideManager.checkGuide(1021);
        };
        VipView.prototype.removeGuide = function () {
            App.GuideManager.removeClickBtn(1021, 2);
        };
        VipView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.Socket.send(24001, {});
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.VIP_REWARD_UPDATE, this.updateVipInfo, this);
            }
            if (this._eventId1 == 0) {
                this._eventId1 = App.EventSystem.addEventListener(PanelNotify.PAGE_CURRENTINDEX_UPDATE, this.onCurrentIndexUpdate, this);
            }
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        VipView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.VIP_REWARD_UPDATE, this._eventId);
                this._eventId = 0;
            }
            if (this._eventId1 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.PAGE_CURRENTINDEX_UPDATE, this._eventId1);
                this._eventId1 = 0;
            }
            this._vipModel.btnRedTip();
            this.setBtnRedTip();
            this.removeGuide();
        };
        /**
         * 销毁
         */
        VipView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return VipView;
    }(BaseView));
    game.VipView = VipView;
    __reflect(VipView.prototype, "game.VipView");
    var vipGroup = (function (_super) {
        __extends(vipGroup, _super);
        function vipGroup() {
            var _this = _super.call(this) || this;
            _this.count = 1;
            _this._heroModel = game.HeroModel.getInstance();
            _this._vipModel = game.VipModel.getInstance();
            _this.skinName = "VipGiftSkin";
            return _this;
        }
        vipGroup.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.gp_list.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
            this.btn_get.name = "btn_get";
        };
        vipGroup.prototype.onTouch = function (event) {
            event.stopPropagation();
        };
        vipGroup.prototype.updateGift = function () {
            this.list.itemRenderer = backpackItem;
            var layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.horizontalGap = 22;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            this.list.layout = layout;
            var data = [];
            for (var i = 0; i < this.vipInfo.rewards.length; i++) {
                var obj = {};
                obj.type = this.vipInfo.rewards[i][0];
                obj.good_id = this.vipInfo.rewards[i][1];
                obj.num = this.vipInfo.rewards[i][2];
                data.push(obj);
            }
            this.list.dataProvider = new eui.ArrayCollection(data);
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
            this.count = 1;
        };
        vipGroup.prototype.reload = function (data) {
            // this.list.dataProvider = new eui.ArrayCollection(data);
            this.vipInfo = data;
            this.updateGift();
            this.updateView();
        };
        vipGroup.prototype.updateView = function () {
            var vipInfo = this.vipInfo;
            var nextVipInfo = this._vipModel.nextVipInfo;
            // this.btlb_vip.text = vipInfo.vip;
            this.btlb_vip0.text = vipInfo.vip;
            this.btlb_vip1.text = vipInfo.vip;
            // this.lb_backpackNum.text = vipInfo.bag + "个";
            // this.lb_transcriptNum.text = vipInfo.transcript + "次";
            // this.lb_moneyTreeNum.text = vipInfo.money_tree + "次";
            // this.lb_arenaNum.text = vipInfo.arena + "次";
            // this.lb_quickFightNum.text = vipInfo.quick_fight + "次";
            this.privilege();
            this.judgeGetOrNot();
        };
        vipGroup.prototype.privilege = function () {
            for (var k in this.vipInfo) {
                switch (k) {
                    case "bag":
                        if (!this.vipInfo[k]) {
                            this.lb_backpack.visible = false;
                            this.lb_backpackNum.visible = false;
                            break;
                        }
                        this.lb_backpack.visible = true;
                        this.lb_backpackNum.visible = true;
                        this.lb_backpack.text = this.count + "、免费获得     背包";
                        this.lb_backpackNum.text = this.vipInfo.bag + "个";
                        this.lb_backpack.y = 8 + (this.count - 1) * 36;
                        this.lb_backpackNum.y = 8 + (this.count - 1) * 36;
                        this.count++;
                        break;
                    case "money_tree":
                        if (!this.vipInfo[k]) {
                            this.lb_moneyTree.visible = false;
                            this.lb_moneyTreeNum.visible = false;
                            break;
                        }
                        this.lb_moneyTree.visible = true;
                        this.lb_moneyTreeNum.visible = true;
                        this.lb_moneyTree.text = this.count + "、摇钱树每天可使用";
                        this.lb_moneyTreeNum.text = this.vipInfo.money_tree + "次";
                        this.lb_moneyTree.y = 8 + (this.count - 1) * 36;
                        this.lb_moneyTreeNum.y = 8 + (this.count - 1) * 36;
                        this.count++;
                        break;
                    case "transcript":
                        if (!this.vipInfo[k]) {
                            this.lb_transcript.visible = false;
                            this.lb_transcriptNum.visible = false;
                            break;
                        }
                        this.lb_transcript.visible = true;
                        this.lb_transcriptNum.visible = true;
                        this.lb_transcript.text = this.count + "、每天可购买材料副本";
                        this.lb_transcriptNum.text = this.vipInfo.transcript + "次";
                        this.lb_transcript.y = 8 + (this.count - 1) * 36;
                        this.lb_transcriptNum.y = 8 + (this.count - 1) * 36;
                        this.count++;
                        break;
                    case "quick_fight":
                        if (!this.vipInfo[k]) {
                            this.lb_quickFight.visible = false;
                            this.lb_quickFightNum.visible = false;
                            break;
                        }
                        this.lb_quickFight.visible = true;
                        this.lb_quickFightNum.visible = true;
                        this.lb_quickFight.text = this.count + "、快速战斗每天可多购买";
                        this.lb_quickFightNum.text = this.vipInfo.quick_fight + "次";
                        this.lb_quickFight.y = 8 + (this.count - 1) * 36;
                        this.lb_quickFightNum.y = 8 + (this.count - 1) * 36;
                        this.count++;
                        break;
                    case "arena":
                        if (!this.vipInfo[k]) {
                            this.lb_arena.visible = false;
                            this.lb_arenaNum.visible = false;
                            break;
                        }
                        this.lb_arena.visible = true;
                        this.lb_arenaNum.visible = true;
                        this.lb_arena.text = this.count + "、竞技场每天可购买";
                        this.lb_arenaNum.text = this.vipInfo.arena + "次";
                        this.lb_arena.y = 8 + (this.count - 1) * 36;
                        this.lb_arenaNum.y = 8 + (this.count - 1) * 36;
                        this.count++;
                        break;
                    case "partner":
                        if (!this.vipInfo[k]) {
                            this.lb_partner.visible = false;
                            this.lb_partnerNum.visible = false;
                            break;
                        }
                        this.lb_partner.visible = true;
                        this.lb_partnerNum.visible = true;
                        this.lb_partner.text = this.count + "、可提前解锁";
                        this.lb_partnerNum.text = "第" + this.vipInfo[k] + "个伙伴";
                        this.lb_partner.y = 8 + (this.count - 1) * 36;
                        this.lb_partnerNum.y = 8 + (this.count - 1) * 36;
                        this.count++;
                        break;
                    case "smelt":
                        if (!this.vipInfo[k]) {
                            this.lb_smelt.visible = false;
                            break;
                        }
                        this.lb_smelt.visible = true;
                        this.lb_smelt.text = this.count + "、装备一键熔炼";
                        this.lb_smelt.y = 8 + (this.count - 1) * 36;
                        this.count++;
                        break;
                    case "wipe":
                        if (!this.vipInfo[k]) {
                            this.lb_wipe.visible = false;
                            break;
                        }
                        this.lb_wipe.visible = true;
                        this.lb_wipe.text = this.count + "、一键扫荡个人BOSS";
                        this.lb_wipe.y = 8 + (this.count - 1) * 36;
                        this.count++;
                        break;
                }
            }
        };
        vipGroup.prototype.judgeGetOrNot = function () {
            if (this.vipInfo.rewardList.state == 1) {
                this.img_receive.visible = true;
                this.img_hadReceive.visible = false;
                this.btn_get.visible = true;
                this.btn_get.currentState = "up";
                this.btn_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
            }
            else if (this.vipInfo.rewardList.state == 2) {
                this.img_receive.visible = false;
                this.img_hadReceive.visible = true;
                this.btn_get.visible = true;
                this.btn_get.currentState = "down";
            }
            else {
                this.img_receive.visible = false;
                this.img_hadReceive.visible = false;
                this.btn_get.visible = false;
            }
        };
        vipGroup.prototype.getReward = function () {
            App.Socket.send(24002, { lv: this.vipInfo.rewardList.lv });
            this._vipModel.vipArr[this.vipInfo.rewardList.lv].rewardList.state;
            this.vipInfo.rewardList.state = 2;
            this.judgeGetOrNot();
        };
        return vipGroup;
    }(PageViewItem));
    __reflect(vipGroup.prototype, "vipGroup");
    var backpackItem = (function (_super) {
        __extends(backpackItem, _super);
        function backpackItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"backpackItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"90\" height=\"90\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
            _this.baseItem.setItemNameVisible(true);
            return _this;
        }
        backpackItem.prototype.dataChanged = function () {
            this.baseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
        };
        return backpackItem;
    }(eui.ItemRenderer));
    __reflect(backpackItem.prototype, "backpackItem");
})(game || (game = {}));
//# sourceMappingURL=VipView.js.map