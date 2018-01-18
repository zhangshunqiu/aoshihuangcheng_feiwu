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
 * 副本系统数据模型 2017/11/27
 */
var game;
(function (game) {
    var CopyView = (function (_super) {
        __extends(CopyView, _super);
        function CopyView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._copyInfoUpdateEventId = 0;
            _this._curIndex = 0;
            _this._askChallengeEventId = 0;
            _this._copyModel = game.CopyModel.getInstance();
            return _this;
        }
        CopyView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            RES.getResAsync("copy_fuben_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.initView();
        };
        CopyView.prototype.initView = function () {
            var data = ["个人BOSS", "材料副本", "挑战副本"];
            this.tabbar.dataProvider = new eui.ArrayCollection(data);
            this.tabbar.selectedIndex = this._curIndex;
            this.tabbar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.changeIndex, this);
            this.initBossView();
            this.initMaterialView();
            this.initChallegeView();
            this.validateNow();
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.COPY_PERSONAL, this.tabbar.getChildAt(0));
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.COPY_MATERIAL, this.tabbar.getChildAt(1));
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.COPY_CHALLENGE, this.tabbar.getChildAt(2));
        };
        /**红点 */
        CopyView.prototype.setBtnRedTip = function () {
            if (this._copyModel.canChallenge.bossBool) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_PERSONAL, true);
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_PERSONAL, false);
            }
            if (this._copyModel.canChallenge.materialBool) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_MATERIAL, true);
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_MATERIAL, false);
            }
        };
        CopyView.prototype.changeIndex = function (event) {
            this.changeView(event.itemIndex);
            if (event.itemIndex == ConstCopyType.Tower) {
                if (App.BtnTipManager.getTypeValue(ConstBtnTipType.COPY_CHALLENGE)) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.COPY_CHALLENGE, false);
                }
            }
        };
        CopyView.prototype.changeView = function (selectIndex) {
            this.gp_boss.visible = false;
            this.gp_challenge.visible = false;
            this.gp_material.visible = false;
            this.img_btnBg1.visible = false;
            this.img_btnBg2.visible = false;
            this.img_btnBg3.visible = false;
            switch (selectIndex) {
                case 0:
                    this.gp_boss.visible = true;
                    App.Socket.send(31001, { id: 1 });
                    this.img_btnBg1.visible = true;
                    break;
                case 1:
                    this.gp_material.visible = true;
                    App.Socket.send(31001, { id: 2 });
                    this.img_btnBg2.visible = true;
                    break;
                case 2:
                    this.gp_challenge.visible = true;
                    App.Socket.send(31001, { id: 3 });
                    this.img_btnBg3.visible = true;
                    break;
            }
        };
        CopyView.prototype.initBossView = function () {
            this.list_boss.itemRenderer = bossItem;
            var layout = new eui.TileLayout();
            layout.requestedColumnCount = 1;
            layout.verticalGap = 2;
            layout.verticalAlign = egret.VerticalAlign.TOP;
            this.list_boss.layout = layout;
            this.scroller_boss.viewport = this.list_boss;
            this.scroller_boss.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller_boss.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller_boss.verticalScrollBar.autoVisibility = false;
            this.scroller_boss.verticalScrollBar.visible = false;
        };
        CopyView.prototype.initChallegeView = function () {
            var _this = this;
            this.list_challenge.itemRenderer = backpackItem;
            var layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.horizontalGap = 0;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            this.list_challenge.layout = layout;
            // this.list_challenge.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeBoss, this);
            this.img_nextBoss1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.updateChallengeView(_this._copyModel.challengeCopyInfo1);
            }, this);
            this.img_nextBoss2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.updateChallengeView(_this._copyModel.challengeCopyInfo2);
            }, this);
            this.gp_bossModel.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.updateChallengeView(_this._copyModel.challengeCopyInfo0);
            }, this);
        };
        CopyView.prototype.initMaterialView = function () {
            this.list_material.itemRenderer = MaterialItem;
            var layout = new eui.TileLayout();
            layout.requestedColumnCount = 1;
            layout.verticalAlign = egret.VerticalAlign.TOP;
            this.list_material.layout = layout;
            this.scroller_material.viewport = this.list_material;
            this.scroller_material.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller_material.scrollPolicyV = eui.ScrollPolicy.ON;
            this.scroller_material.verticalScrollBar.autoVisibility = false;
            this.scroller_material.verticalScrollBar.visible = false;
        };
        CopyView.prototype.updateChallengeView = function (challengeCopyInfo) {
            this.list_challenge.dataProvider = new eui.ArrayCollection(challengeCopyInfo.drop_list);
            this.lb_score.text = challengeCopyInfo.score;
            this.lb_nowLevel.text = "第" + (this._copyModel.topId - 30199) + "关";
            this.lb_level.text = "第" + (this._copyModel.topId - 30199) + "关";
            this.lb_nextLevel1.text = "第" + (this._copyModel.topId - 30198) + "关";
            this.lb_nextLevel2.text = "第" + (this._copyModel.topId - 30197) + "关";
            if (challengeCopyInfo.scene_id == this._copyModel.topId) {
                this.btn_challenge.visible = true;
                this.img_challenge.visible = true;
                this.lb_tip.visible = false;
                this.joinBoss(this._copyModel.bossInfo.resId, 1);
            }
            else {
                this.btn_challenge.visible = false;
                this.img_challenge.visible = false;
                this.lb_tip.visible = true;
                this.lb_tip.text = "人物达到" + challengeCopyInfo.lv_limit + "级可进行挑战";
            }
        };
        CopyView.prototype.updateBossView = function () {
            this.list_boss.dataProvider = new eui.ArrayCollection(this._copyModel.bossCopyInfoArr);
            this.list_boss.validateNow();
            this.checkGuide();
        };
        CopyView.prototype.updateMaterialInfo = function () {
            this.list_material.dataProvider = new eui.ArrayCollection(this._copyModel.materialCopyInfoArr);
        };
        CopyView.prototype.updateInfo = function (type) {
            if (type == 1) {
                this.updateBossView();
            }
            else if (type == 2) {
                this.updateMaterialInfo();
            }
            else {
                this.updateChallengeView(this._copyModel.challengeCopyInfo0);
            }
            this.setBtnRedTip();
        };
        CopyView.prototype.joinBoss = function (resId, scale) {
            if (this._bossMc == null) {
                this._bossMc = new AMovieClip();
                this._bossMc.scaleX = scale;
                this._bossMc.scaleY = scale;
                this.gp_bossModel.addChild(this._bossMc);
                this._bossMc.frameRate = 4;
            }
            this._bossMc.playMCKey(resId + "15"); //加15是获得模型的正面
        };
        CopyView.prototype.onTouchChallengeBoss = function () {
            if (!GlobalUtil.checkBagCapacity()) {
                App.Socket.send(31002, { type: 3, id: this._copyModel.topId });
            }
        };
        // private itemTap(event: eui.ItemTapEvent) {
        //     let itemData = event.item;
        //     App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        // }
        CopyView.prototype.checkGuide = function () {
            if (this.list_boss.numChildren > 0) {
                App.GuideManager.bindClickBtn(this.list_boss.getChildAt(0).getChildByName("gp_right").getChildByName("btn_challenge"), 1016, 2);
                App.GuideManager.checkGuide(1016);
            }
        };
        CopyView.prototype.removeGuide = function () {
            App.GuideManager.removeClickBtn(1016, 2);
        };
        /**
         * openParam
         * @param {type: ConstCopyType.Boss}  ConstCopyType.Boss为boss副本，ConstCopyType.Material为材料副本,ConstCopyType.Tower为爬塔副本
         */
        CopyView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam) {
                this.tabbar.selectedIndex = openParam.type;
                this.changeView(this.tabbar.selectedIndex);
            }
            App.Socket.send(31001, { id: 1 });
            egret.setTimeout(function () {
                App.Socket.send(31001, { id: 2 });
            }, this, 100);
            if (this._copyInfoUpdateEventId == 0) {
                this._copyInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.COPY_INFO_UPDATE, this.updateInfo, this);
            }
            if (this._askChallengeEventId == 0) {
                this._askChallengeEventId = App.EventSystem.addEventListener(PanelNotify.COPY_ASK_CHALLENGE_RESULT, this.closeWin, this);
            }
        };
        /**
         * 关闭窗口
         */
        CopyView.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        CopyView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._copyInfoUpdateEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.COPY_INFO_UPDATE, this._copyInfoUpdateEventId);
                this._copyInfoUpdateEventId = 0;
            }
            if (this._askChallengeEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.COPY_ASK_CHALLENGE_RESULT, this._askChallengeEventId);
                this._askChallengeEventId = 0;
            }
            this.removeGuide();
        };
        /**
         * 销毁
         */
        CopyView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (this._bossMc) {
                this._bossMc.destroy();
                this._bossMc = null;
            }
        };
        return CopyView;
    }(BaseView));
    game.CopyView = CopyView;
    __reflect(CopyView.prototype, "game.CopyView");
    var bossItem = (function (_super) {
        __extends(bossItem, _super);
        function bossItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "BossItem";
            _this.initView();
            _this.gp_right.name = "gp_right";
            _this.btn_challenge.name = "btn_challenge";
            return _this;
        }
        bossItem.prototype.initView = function () {
            var _this = this;
            this.list.itemRenderer = backpackItem;
            var layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.horizontalGap = 0;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            this.list.layout = layout;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (!GlobalUtil.checkBagCapacity()) {
                    App.Socket.send(31002, { type: 1, id: _this.data.scene_id });
                }
            }, this);
        };
        bossItem.prototype.itemTap = function (event) {
            var itemData = event.item;
            App.GlobalTips.showItemTips(itemData[0], itemData[1], null);
        };
        bossItem.prototype.dataChanged = function () {
            this.lb_bossName.text = this.data.name;
            this.img_bossIcon.source = this.data.icon + "_png";
            this.lb_challengeNum.text = Math.max(this.data.times_limit, 0) + "次";
            this.list.dataProvider = new eui.ArrayCollection(this.data.drop_list);
            this.updateBtn();
        };
        bossItem.prototype.updateBtn = function () {
            if ((App.RoleManager.roleInfo.lv >= this.data.lv_limit) && this.data.lv_limit != 0 || (App.RoleManager.roleInfo.turn >= this.data.transmigration && this.data.transmigration)) {
                this.gp_right.visible = true;
                this.lb_tip.visible = false;
                if (this.data.times_limit > 0) {
                    this.btn_challenge.currentState = "up";
                    this.btn_challenge.touchEnabled = true;
                    this.img_challenge.visible = true;
                    this.img_done.visible = false;
                }
                else {
                    this.btn_challenge.currentState = "down";
                    this.btn_challenge.touchEnabled = false;
                    this.img_challenge.visible = false;
                    this.img_done.visible = true;
                }
            }
            else {
                this.gp_right.visible = false;
                this.lb_tip.visible = true;
                if (this.data.lv_limit) {
                    this.lb_tip.text = "人物达到" + this.data.lv_limit + "级可进行挑战";
                }
                else {
                    this.lb_tip.text = "人物达到" + this.data.transmigration + "转可进行挑战";
                }
            }
        };
        return bossItem;
    }(eui.ItemRenderer));
    __reflect(bossItem.prototype, "bossItem");
    var MaterialItem = (function (_super) {
        __extends(MaterialItem, _super);
        function MaterialItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "MaterialItem";
            _this.initView();
            return _this;
        }
        MaterialItem.prototype.initView = function () {
            var _this = this;
            this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this.data.times_limit > 0) {
                    if (!GlobalUtil.checkBagCapacity()) {
                        App.Socket.send(31002, { type: 2, id: _this.data.scene_id });
                    }
                }
                else if (_this.data.sweep > 0) {
                    if (!GlobalUtil.checkBagCapacity()) {
                        App.Socket.send(31003, { type: 2, id: _this.data.scene_id });
                    }
                }
                else {
                }
            }, this);
        };
        MaterialItem.prototype.dataChanged = function () {
            switch (this.data.name) {
                case "翅膀副本":
                    this.img_materialName.source = "copy_material_name_chibangfuben_png";
                    this.img_icon.source = "copy_material_icon_icon_chibang_png";
                    this.img_bg.source = "copy_material_bg_chibang_png";
                    break;
                case "护盾副本":
                    this.img_materialName.source = "copy_material_name_hudunfuben_png";
                    this.img_icon.source = "copy_material_hudun_png";
                    this.img_bg.source = "copy_material_bg_hudun_png";
                    break;
                case "肩甲副本":
                    this.img_materialName.source = "copy_material_name_jianjiafuben_png";
                    this.img_icon.source = "copy_material_icon_jianjia_png";
                    this.img_bg.source = "copy_material_bg_jianjia_png";
                    break;
            }
            this.updateBtn();
        };
        MaterialItem.prototype.updateBtn = function () {
            if (App.RoleManager.roleInfo.lv >= this.data.lv_limit) {
                this.gp_right.visible = true;
                this.lb_tip.visible = false;
                this.btn_challenge.currentState = "up";
                this.btn_challenge.touchEnabled = true;
                this.lb_desText.textAlign = "left";
                this.lb_challengeNum.visible = true;
                this.img_done.visible = false;
                if (this.data.times_limit > 0) {
                    this.img_challenge.visible = true;
                    this.gp_sweep.visible = false;
                    this.lb_desText.text = "挑战次数：";
                    this.lb_challengeNum.text = Math.max(this.data.times_limit, 0) + "次";
                }
                else if (this.data.sweep > 0) {
                    this.img_challenge.visible = false;
                    this.gp_sweep.visible = true;
                    this.img_sweep.visible = true;
                    this.img_done.visible = false;
                    this.lb_desText.text = "扫荡次数：";
                    this.lb_challengeNum.text = Math.max(this.data.sweep, 0) + "次";
                    this.lb_gold.text = App.ConfigManager.getConstConfigByType("MATERIAL_SWEEP_GOLD").value;
                }
                else {
                    this.btn_challenge.currentState = "down";
                    this.btn_challenge.touchEnabled = false;
                    this.img_challenge.visible = false;
                    this.gp_sweep.visible = false;
                    this.img_done.visible = true;
                    this.lb_desText.text = "提升VIP可增加扫荡次数";
                    this.lb_desText.textAlign = "center";
                    this.lb_challengeNum.visible = false;
                }
            }
            else {
                this.gp_right.visible = false;
                this.lb_tip.visible = true;
                if (this.data.lv_limit) {
                    this.lb_tip.text = "人物达到" + this.data.lv_limit + "级可进行挑战";
                }
            }
        };
        return MaterialItem;
    }(eui.ItemRenderer));
    __reflect(MaterialItem.prototype, "MaterialItem");
    var backpackItem = (function (_super) {
        __extends(backpackItem, _super);
        function backpackItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"backpackItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"90\" height=\"90\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
            return _this;
            // this.baseItem.lb_name.visible = true;
        }
        backpackItem.prototype.dataChanged = function () {
            this.baseItem.updateBaseItem(this.data[0], this.data[1], null);
        };
        return backpackItem;
    }(eui.ItemRenderer));
    __reflect(backpackItem.prototype, "backpackItem");
})(game || (game = {}));
//# sourceMappingURL=CopyView.js.map