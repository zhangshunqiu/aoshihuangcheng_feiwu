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
* module : 神器模块
* author : zrj
*/
var game;
(function (game) {
    var ArtifactView = (function (_super) {
        __extends(ArtifactView, _super);
        function ArtifactView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.list = new eui.List();
            _this._curIndex = 0;
            _this._costId = 0; //消耗物品id
            _this._career = 1; //默认战士
            _this.artifactModel = game.ArtifactModel.getInstance();
            return _this;
        }
        ArtifactView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        ArtifactView.prototype.initView = function () {
            this.bgEffect();
            this._effectMC = new EffectMovieClip();
            this._effectMC.x = 125;
            this._effectMC.y = 150;
            this.gp_effect.addChild(this._effectMC);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.ARTIFACT);
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeView, this);
            this.lb_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showWay, this);
            this.lb_get.textFlow = [{ text: "获取道具", style: { underline: true, textColor: 0x00f829 } }];
            this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.artifactUpgrade, this);
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.scroller.verticalScrollBar.visible = false;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.viewport = this.list;
            this.list.itemRenderer = ArtifactItem;
            this._originArray = new eui.ArrayCollection(App.ConfigManager.getArtifactArray());
            this.list.dataProvider = this._originArray;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this);
            this.list.requireSelection = true;
            this.list.selectedIndex = 0;
            this.floatEffect();
            this.updateView();
            this.validateNow();
        };
        //漂浮特效
        ArtifactView.prototype.floatEffect = function () {
            // egret.Tween.get(this.gp_effect, { loop: true }).to({ y: 80 }, 1000).to({ y: 40 }, 1800).to({ y: 60 }, 1000);
        };
        ArtifactView.prototype.itemTap = function (event) {
            if (event.itemIndex != this._curIndex) {
                this._curIndex = event.itemIndex;
                this.updateView();
                this.list.selectedIndex = event.itemIndex;
                var offset = this.list.scrollV;
                this.list.validateNow();
                this.list.scrollV = offset;
            }
        };
        ArtifactView.prototype.bgEffect = function () {
            this._bgMc = new AMovieClip();
            this._bgMc.x = 205;
            this._bgMc.y = 345;
            this.gp_effect.addChild(this._bgMc);
            this._bgMc.playMCKey("effsqbj");
        };
        ArtifactView.prototype.updateView = function () {
            var _this = this;
            var artifactInfo = undefined;
            var nextInfo = undefined;
            var isActive = false;
            var offset = this.list.scrollV;
            this._originArray.refresh();
            this.list.selectedIndex = this._curIndex;
            this.list.validateNow();
            this.list.scrollV = offset;
            if (this.artifactModel.artifactList[this._curIndex]) {
                artifactInfo = App.ConfigManager.getArtifactInfoById(this.artifactModel.artifactList[this._curIndex]);
                isActive = true;
                RES.getResAsync("wing_txt_shengjie_png", function (texture) {
                    _this.img_txt.source = texture;
                }, this);
            }
            else {
                artifactInfo = this._originArray.getItemAt(this._curIndex);
                RES.getResAsync("equip_sp_txt_jihuo_png", function (texture) {
                    _this.img_txt.source = texture;
                }, this);
                this.lb_cost.visible = true;
            }
            this._curArtifact = artifactInfo;
            this.lb_name.text = artifactInfo.name;
            var textArray = [];
            if (this._career == CareerType.SOLDIER) {
                if (artifactInfo["ac"] != 0) {
                    textArray.push({ text: "攻击：" + artifactInfo["ac"] });
                    textArray.push({ text: "\n" });
                }
            }
            else if (this._career == CareerType.MAGES) {
                if (artifactInfo["mac"] != 0) {
                    textArray.push({ text: "攻击：" + artifactInfo["mac"] });
                    textArray.push({ text: "\n" });
                }
            }
            else if (this._career == CareerType.TAOIST) {
                if (artifactInfo["sc"] != 0) {
                    textArray.push({ text: "攻击：" + artifactInfo["sc"] });
                    textArray.push({ text: "\n" });
                }
            }
            if (artifactInfo["hp"] != 0) {
                textArray.push({ text: ConstAttribute["hp"] + "：" + artifactInfo["hp"] });
                textArray.push({ text: "\n" });
            }
            if (artifactInfo["def"] != 0) {
                textArray.push({ text: ConstAttribute["def"] + "：" + artifactInfo["def"] });
                textArray.push({ text: "\n" });
            }
            if (artifactInfo["sdef"] != 0) {
                textArray.push({ text: ConstAttribute["sdef"] + "：" + artifactInfo["sdef"] });
                textArray.push({ text: "\n" });
            }
            if (artifactInfo["hit"] != 0) {
                textArray.push({ text: ConstAttribute["hit"] + "：" + artifactInfo["hit"] });
                textArray.push({ text: "\n" });
            }
            if (artifactInfo["dodge"] != 0) {
                textArray.push({ text: ConstAttribute["dodge"] + "：" + artifactInfo["dodge"] });
                textArray.push({ text: "\n" });
            }
            if (artifactInfo["crit"] != 0) {
                textArray.push({ text: ConstAttribute["crit"] + "：" + artifactInfo["crit"] });
                textArray.push({ text: "\n" });
            }
            if (artifactInfo["rcrit"] != 0) {
                textArray.push({ text: ConstAttribute["rcrit"] + "：" + artifactInfo["rcrit"] });
                textArray.push({ text: "\n" });
            }
            if (isActive) {
                if (artifactInfo.next_id) {
                    nextInfo = App.ConfigManager.getArtifactInfoById(artifactInfo.next_id);
                    var textArrayNext = [];
                    if (this._career == CareerType.SOLDIER) {
                        if (artifactInfo["ac"] != 0) {
                            textArrayNext.push({ text: "攻击：" + nextInfo["ac"] });
                            textArrayNext.push({ text: "\n" });
                        }
                    }
                    else if (this._career == CareerType.MAGES) {
                        if (nextInfo["mac"] != 0) {
                            textArrayNext.push({ text: "攻击：" + nextInfo["mac"] });
                            textArrayNext.push({ text: "\n" });
                        }
                    }
                    else if (this._career == CareerType.TAOIST) {
                        if (nextInfo["sc"] != 0) {
                            textArrayNext.push({ text: "攻击：" + nextInfo["sc"] });
                            textArrayNext.push({ text: "\n" });
                        }
                    }
                    if (nextInfo["hp"] != 0) {
                        textArrayNext.push({ text: ConstAttribute["hp"] + "：" + nextInfo["hp"] });
                        textArrayNext.push({ text: "\n" });
                    }
                    if (nextInfo["def"] != 0) {
                        textArrayNext.push({ text: ConstAttribute["def"] + "：" + nextInfo["def"] });
                        textArrayNext.push({ text: "\n" });
                    }
                    if (nextInfo["sdef"] != 0) {
                        textArrayNext.push({ text: ConstAttribute["sdef"] + "：" + nextInfo["sdef"] });
                        textArrayNext.push({ text: "\n" });
                    }
                    if (nextInfo["hit"] != 0) {
                        textArrayNext.push({ text: ConstAttribute["hit"] + "：" + nextInfo["hit"] });
                        textArrayNext.push({ text: "\n" });
                    }
                    if (nextInfo["dodge"] != 0) {
                        textArrayNext.push({ text: ConstAttribute["dodge"] + "：" + nextInfo["dodge"] });
                        textArrayNext.push({ text: "\n" });
                    }
                    if (nextInfo["crit"] != 0) {
                        textArrayNext.push({ text: ConstAttribute["crit"] + "：" + nextInfo["crit"] });
                        textArrayNext.push({ text: "\n" });
                    }
                    if (nextInfo["rcrit"] != 0) {
                        textArrayNext.push({ text: ConstAttribute["rcrit"] + "：" + nextInfo["rcrit"] });
                        textArrayNext.push({ text: "\n" });
                    }
                    textArray.pop();
                    textArrayNext.pop();
                    this.lb_attr.textFlow = textArray;
                    this.lb_attr_next.textFlow = textArrayNext;
                    this.lb_cost.visible = true;
                }
                else {
                    textArray.pop();
                    this.lb_attr.textFlow = textArray;
                    this.lb_attr_next.text = "已满阶";
                    this.lb_cost.visible = false;
                }
            }
            else {
                // let textArrayL = [];
                // textArrayL.push({ text: "攻击：0" + "\n" });
                // textArrayL.push({ text: ConstAttribute["hp"] + "：" + "0" + "\n" });
                // textArrayL.push({ text: ConstAttribute["def"] + "：" + "0" + "\n" });
                // textArrayL.push({ text: ConstAttribute["sdef"] + "：" + "0" });
                // this.lb_attr.textFlow = textArrayL;
                textArray.pop();
                this.lb_attr_next.textFlow = textArray;
                this.lb_attr.text = "未激活";
            }
            this.lb_desc.text = "";
            for (var key in ConstArtifactEffect) {
                if (artifactInfo[key] != 0) {
                    this.lb_desc.textFlow = [{ text: "神器特效：", style: { textColor: 0xf87500 } }, { text: ConstArtifactEffect[key] + "+" + artifactInfo[key] / 100 + "%" }];
                    break;
                }
            }
            var costInfo = artifactInfo.item[0];
            if (nextInfo && this.artifactModel.artifactList[this._curIndex]) {
                costInfo = nextInfo.item[0];
            }
            var costItem = App.ConfigManager.getItemInfoById(costInfo[1]);
            var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(costInfo[0], costInfo[1]);
            this._costId = costInfo[1];
            if (!itemInfo) {
                itemInfo = { num: 0 };
            }
            if (itemInfo.num >= costInfo[2]) {
                this.lb_cost.textFlow = [{ text: "消耗" }, { text: costItem.name, style: { textColor: ConstTextColor[costItem.quality] } }, { text: "：" },
                    { text: String(itemInfo.num), style: { textColor: 0x63d72a } }, { text: "/" + costInfo[2], style: { textColor: 0xbfbfbf } }];
            }
            else {
                this.lb_cost.textFlow = [{ text: "消耗" }, { text: costItem.name, style: { textColor: ConstTextColor[costItem.quality] } }, { text: "：" },
                    { text: String(itemInfo.num), style: { textColor: 0xb90b0a } }, { text: "/" + costInfo[2], style: { textColor: 0xbfbfbf } }];
            }
            this._effectMC.playMCKey(this._curArtifact.effects, "", -1, null, function () {
                _this._effectMC.frameRate = 8;
            }, null, this);
        };
        ArtifactView.prototype.artifactUpgrade = function () {
            if (this.artifactModel.artifactList[this._curIndex]) {
                App.Socket.send(33003, { id: this._curArtifact.id }); //发id
            }
            else {
                App.Socket.send(33002, { type: this._curArtifact.type });
            }
        };
        ArtifactView.prototype.closeView = function () {
            App.WinManager.closeWin(WinName.ARTIFACT);
            App.WinManager.openWin(WinName.HERO);
        };
        ArtifactView.prototype.showWay = function () {
            App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, this._costId);
        };
        ArtifactView.prototype.checkGuide = function () {
            App.GuideManager.bindClickBtn(this.btn_upgrade, 1019, 2);
            App.GuideManager.bindClickBtn(this.img_close, 1019, 3);
            App.GuideManager.checkGuide(1019);
        };
        ArtifactView.prototype.removeGuide = function () {
            App.GuideManager.removeClickBtn(1019, 2);
        };
        /**
         * 打开窗口
         */
        ArtifactView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam && openParam.career) {
                this._career = openParam.career;
            }
            if (!this._handleId) {
                this._handleId = App.EventSystem.addEventListener(PanelNotify.ARTIFACT_UPGRADE_BACK, this.updateView, this);
            }
            if (!this._updateHandleId) {
                this._updateHandleId = App.EventSystem.addEventListener(PanelNotify.ARTIFACT_UPDATE_VIEW, this.updateView, this);
            }
            App.Socket.send(33001, {});
            this.checkGuide();
        };
        /**
         * 关闭窗口
         */
        ArtifactView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        ArtifactView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._handleId) {
                App.EventSystem.removeEventListener(PanelNotify.ARTIFACT_UPGRADE_BACK, this._handleId);
                this._handleId = undefined;
            }
            if (this._updateHandleId) {
                App.EventSystem.removeEventListener(PanelNotify.ARTIFACT_UPDATE_VIEW, this._updateHandleId);
                this._updateHandleId = undefined;
            }
            this.removeGuide();
        };
        /**
         * 销毁
         */
        ArtifactView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._effectMC.destroy();
            if (this._bgMc) {
                this._bgMc.destroy();
                this._bgMc = null;
                delete this._bgMc;
            }
        };
        return ArtifactView;
    }(BaseView));
    game.ArtifactView = ArtifactView;
    __reflect(ArtifactView.prototype, "game.ArtifactView");
    var ArtifactItem = (function (_super) {
        __extends(ArtifactItem, _super);
        function ArtifactItem() {
            var _this = _super.call(this) || this;
            _this.artifactModel = game.ArtifactModel.getInstance();
            _this.skinName = "ArtifactItemSkin";
            return _this;
        }
        ArtifactItem.prototype.dataChanged = function () {
            var _this = this;
            var info = this.data;
            if (this.artifactModel.artifactList[this.itemIndex]) {
                info = App.ConfigManager.getArtifactInfoById(this.artifactModel.artifactList[this.itemIndex]);
                this.lb_tip.visible = false;
                RES.getResAsync(info.icon + "_png", function (texture) {
                    _this.img_icon.source = texture;
                }, this);
                this.lb_level.text = info.level + "阶";
            }
            else {
                this.lb_tip.text = info.des;
                this.lb_tip.visible = true;
                RES.getResAsync(info.icon + "_hui_png", function (texture) {
                    _this.img_icon.source = texture;
                }, this);
                this.lb_level.text = "";
            }
            if (this.selected) {
                this.img_arrow.visible = true;
                App.logzrj("select ", this.itemIndex);
            }
            else {
                this.img_arrow.visible = false;
                App.logzrj("unselect ", this.itemIndex);
            }
            RES.getResAsync(ConstArtifactQuality[info.quality], function (texture) {
                _this.img_bg.source = texture;
            }, this);
            // this.lb_level.text = info.level + "阶";
            this.lb_name.text = info.name;
            this.lb_name.textColor = ConstTextColor[info.quality];
        };
        return ArtifactItem;
    }(eui.ItemRenderer));
    __reflect(ArtifactItem.prototype, "ArtifactItem");
})(game || (game = {}));
//# sourceMappingURL=ArtifactView.js.map