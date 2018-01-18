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
 * 翅膀模块视图窗口  2018/1/3
 */
var game;
(function (game) {
    var WingAllView = (function (_super) {
        __extends(WingAllView, _super);
        function WingAllView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._curSelIndex = 0;
            _this._wingInfoUpdateEventId = 0;
            _this._changeHeroEventId = 0;
            _this._partnerHandleEventId = 0;
            _this.wingModel = game.WingModel.getInstance();
            return _this;
        }
        WingAllView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.initView();
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WING_TRAIN, this.rb_develop, 128, -1);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WING_EQUIP, this.rb_equip, 128, -1);
        };
        WingAllView.prototype.heroBtnTip = function () {
            var _wingModel = game.WingModel.getInstance();
            var btnTip = _wingModel.judgeBtnTip();
            for (var i = 0; i < btnTip.length; i++) {
                if (btnTip[i].devBool || btnTip[i].equipBool) {
                    this.heroHead.showRedTips(i, true);
                }
                else {
                    this.heroHead.hideRedTips(i);
                }
            }
        };
        WingAllView.prototype.updateWingbtnTips = function () {
            var _wingModel = game.WingModel.getInstance();
            var btnTip = _wingModel.judgeBtnTip();
            if (btnTip[game.HeroModel.getInstance().curPos].devBool) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_TRAIN, true);
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_TRAIN, false);
            }
            if (btnTip[game.HeroModel.getInstance().curPos].equipBool) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_EQUIP, true);
            }
            else {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.WING_EQUIP, false);
            }
        };
        WingAllView.prototype.checkAllBtnTip = function () {
            var btnTip = this.wingModel.judgeBtnTip();
            for (var i = 0; i < btnTip.length; i++) {
                if (btnTip[i].devBool || btnTip[i].equipBool) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.WING, true);
                    break;
                }
                else {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.WING, false);
                }
            }
        };
        /**
        * 切换英雄
        */
        WingAllView.prototype.changeHero = function (curPos) {
            this.wingModel.wingInfo = this.wingModel.wingInfoObj[game.HeroModel.getInstance().heroInfo[curPos].id];
            this.wingModel.wingInfo.currentStar = this.wingModel.wingInfo.star || 0;
            this.wingModel.wingInfo.currentWingEquip = this.wingModel.wingInfo.wingEquip;
            if (this.wingModel.wingInfo.wingId) {
                this.rb_equip.visible = true;
                this.rb_develop.x = 216;
                // this.rb_transform.visible = true;
            }
            else {
                this.updateView(1); //打开羽翼培养界面
                this.rb_develop.x = 291;
                this.rb_equip.visible = false;
                // this.rb_transform.visible = false;
            }
            this.updateWingbtnTips();
        };
        WingAllView.prototype.initView = function () {
            var _this = this;
            var radioGroup = new eui.RadioButtonGroup();
            radioGroup.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var radioGroup = evt.target;
                _this.updateView(radioGroup.selectedValue);
            }, this);
            this.rb_develop.group = radioGroup;
            this.rb_develop.value = 1;
            this.rb_develop.label = "羽翼培养";
            this.rb_develop.selected = true;
            this.rb_equip.group = radioGroup;
            this.rb_equip.label = "羽翼装备";
            this.rb_equip.value = 2;
            // this.rb_transform.group = radioGroup;
            // this.rb_transform.label = "羽翼转换";
            // this.rb_transform.value = 3;
            this.updateView(1);
        };
        WingAllView.prototype.updateView = function (index) {
            if (this._curSelIndex == index) {
                return;
            }
            if (this._curSelView) {
                this._curSelView.clear();
            }
            if (index == 1) {
                if (this.view_develop == null) {
                    this.view_develop = new game.WingDevelopView("WingDevelopSkin");
                }
                this.addChild(this.view_develop);
                this.view_develop.readyOpen({ data: {} });
                this._curSelView = this.view_develop;
                // this.img_developSelector.visible = true;
                this.addChild(this.heroHead);
                this.addChild(this.img_back);
            }
            else if (index == 2) {
                if (this.view_equip == null) {
                    this.view_equip = new game.WingEquipView("WingEquipSkin");
                }
                this.addChild(this.view_equip);
                this.view_equip.readyOpen({ data: {} });
                this._curSelView = this.view_equip;
                // this.img_equipSelector.visible = true;
                this.addChild(this.heroHead);
                this.addChild(this.img_back);
            }
            else if (index == 3) {
                if (this.view_transform == null) {
                    this.view_transform = new game.WingTransformView("WingTransformSkin");
                }
                this.addChild(this.view_transform);
                this.view_transform.readyOpen({ data: {} });
                this._curSelView = this.view_transform;
                // this.img_transformSelector.visible = true;
            }
            this._curSelIndex = index;
        };
        WingAllView.prototype.heroHeadUpdateView = function () {
            this.heroHead.updateView();
            this.checkNewHero();
        };
        /**检车能否开启新伙伴 */
        WingAllView.prototype.checkNewHero = function () {
            var heroModel = game.HeroModel.getInstance();
            heroModel.checkNewPartner();
            if (heroModel.heroHeadFrame[0]) {
                this.heroHead.setNewPartnerTip(0, true);
            }
            else {
                this.heroHead.setNewPartnerTip(0, false);
            }
            if (heroModel.heroHeadFrame[1]) {
                this.heroHead.setNewPartnerTip(1, true);
            }
            else {
                this.heroHead.setNewPartnerTip(1, false);
            }
        };
        /**
         * 打开窗口
        */
        WingAllView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.baseViewBg.winVo = this.winVo;
            this.updateView(this._curSelIndex);
            if (this.wingModel.wingInfo.wingId) {
                this.rb_equip.visible = true;
                this.rb_develop.x = 216;
                // this.rb_transform.visible = true;
            }
            else {
                this.updateView(1); //打开羽翼培养界面
                this.rb_equip.visible = false;
                this.rb_develop.x = 291;
                // this.rb_transform.visible = false;
            }
            this.heroBtnTip();
            this.updateWingbtnTips();
            this.checkNewHero();
            if (this._changeHeroEventId == 0) {
                this._changeHeroEventId = App.EventSystem.addEventListener(PanelNotify.HERO_CHANGE, this.changeHero, this);
            }
            if (this._partnerHandleEventId == 0) {
                this._partnerHandleEventId = App.EventSystem.addEventListener(PanelNotify.HERO_NEW_PARTNER, this.heroHeadUpdateView, this);
            }
        };
        /**
         * 关闭窗口
         */
        WingAllView.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        WingAllView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._curSelView) {
                this._curSelView.clear();
            }
            if (this._wingInfoUpdateEventId == 0) {
                this._wingInfoUpdateEventId = App.EventSystem.addEventListener(PanelNotify.WING_INFO_UPDATE, this.heroBtnTip, this);
            }
            if (this._changeHeroEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_CHANGE, this._changeHeroEventId);
                this._changeHeroEventId = 0;
            }
            if (this._partnerHandleEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_NEW_PARTNER, this._partnerHandleEventId);
                this._partnerHandleEventId = 0;
            }
            if (this.baseViewBg) {
                this.baseViewBg.destroy();
            }
            this.checkAllBtnTip();
        };
        /**
         * 销毁
         */
        WingAllView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WingAllView;
    }(BaseView));
    game.WingAllView = WingAllView;
    __reflect(WingAllView.prototype, "game.WingAllView");
})(game || (game = {}));
//# sourceMappingURL=WingAllView.js.map