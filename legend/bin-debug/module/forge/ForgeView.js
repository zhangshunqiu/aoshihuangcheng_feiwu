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
 * module : 锻造模块视图
 * author ：zrj
*/
var game;
(function (game) {
    var ForgeView = (function (_super) {
        __extends(ForgeView, _super);
        function ForgeView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._curSelIndex = 0;
            _this._equipStarArray = []; //升星数组
            _this._type = 1; //窗口类型
            _this.heroModel = game.HeroModel.getInstance();
            _this.forgeModel = game.ForgeModel.getInstance();
            _this.backpackModel = game.BackpackModel.getInstance();
            _this._handleId = 0; //动画效果id
            return _this;
        }
        ForgeView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        ForgeView.prototype.initView = function () {
            var _this = this;
            this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.FORGE);
            }, this);
            var radioGroup = new eui.RadioButtonGroup();
            this._radioGroup = radioGroup;
            radioGroup.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var radioGroup = evt.target;
                _this.updateForgeView(radioGroup.selectedValue);
            }, this);
            this.rb_strength.group = radioGroup;
            this.rb_strength.value = 1;
            this.rb_strength.label = "强化";
            this.rb_strength.selected = true;
            this.rb_star.group = radioGroup;
            this.rb_star.label = "升星";
            this.rb_star.value = 2;
            //初始化动画
            this._mc = new EffectMovieClip();
            this._mc.x = 115;
            this._mc.y = 35;
            this._mc.playMCKey("effjspf", "", -1, null, function () {
                _this._mc.frameRate = 10;
            }, null, this);
            console.log(this._mc.frameRate);
            this.gp_cap.addChildAt(this._mc, 1);
            // //默认选强化
            // this.updateForgeView(1);
            this.validateNow();
        };
        ForgeView.prototype.updateForgeView = function (index) {
            if (this._curSelIndex == index) {
                return;
            }
            if (this._curSelView) {
                this._curSelView.clear();
            }
            if (index == 1) {
                if (this._strengthView == null) {
                    this._strengthView = new ForgeStrengthView("ForgeStrengthSkin");
                    this.gp_sub.addChild(this._strengthView);
                }
                this._strengthView.readyOpen({ data: {} });
                this._curSelView = this._strengthView;
            }
            else if (index == 2) {
                if (this._starView == null) {
                    this._starView = new game.ForgeStarView("ForgeStarSkin");
                    this.gp_sub.addChild(this._starView);
                }
                this._starView.readyOpen({ data: {} });
                this._curSelView = this._starView;
            }
            this._curSelIndex = index;
            this._type = index;
            this.updateView();
        };
        //红点显示
        ForgeView.prototype.checkRedDot = function (viewNum) {
            var _this = this;
            this.headComponent.clearAllRedTips();
            if (viewNum == 1) {
                this.forgeModel.strengthHeroRedDot.forEach(function (value, index, array) {
                    _this.headComponent.setRedTips(index, value);
                }, this);
            }
            else {
                this.forgeModel.starHeroRedDot.forEach(function (value, index, array) {
                    _this.headComponent.setRedTips(index, value);
                    _this._curSelView.checkRedDot(_this.heroModel.curPos);
                    // for (let i = 1; i <= 10; i++) {
                    // 	let show = this.forgeModel.checkCanStarupByPart(this.heroModel.curPos, i);
                    // 	if (show) {
                    // 		this._equipStarArray[i - 1].showRedTips(null);
                    // 	} else {
                    // 		this._equipStarArray[i - 1].hideRedTips();
                    // 	}
                    // }
                }, this);
            }
            game.HeroModel.getInstance().checkNewPartner();
            if (this.heroModel.heroHeadFrame[0]) {
                this.headComponent.setNewPartnerTip(0, true);
            }
            else {
                this.headComponent.setNewPartnerTip(0, false);
            }
            if (this.heroModel.heroHeadFrame[1]) {
                this.headComponent.setNewPartnerTip(1, true);
            }
            else {
                this.headComponent.setNewPartnerTip(1, false);
            }
        };
        ForgeView.prototype.onShowStrength = function () {
            if (this._curSelView) {
                this._curSelView.updateView();
                this._type = 1;
                this.checkRedDot(1);
            }
        };
        ForgeView.prototype.onShowStar = function () {
            if (this._curSelView) {
                // this.updateStarView();
                this._curSelView.updateView();
                this._type = 2;
                this.checkRedDot(2);
            }
        };
        ForgeView.prototype.updateView = function () {
            if (!this.visible) {
                return;
            }
            // this.updateEquip();
            if (this._type == 1) {
                this.onShowStrength();
            }
            else if (this._type == 2) {
                this.onShowStar();
            }
            this.bmlb_cap.text = this.heroModel.heroInfo[this.heroModel.curPos].score + "";
        };
        ForgeView.prototype.checkGuide = function () {
            // App.GuideManager.bindClickBtn(this.img_all, 1009, 2);
            //		App.GuideManager.bindClickBtn(this.commonWin.img_close, 1009, 3);
            App.GuideManager.checkGuide(1009);
        };
        ForgeView.prototype.removeGuide = function () {
            App.GuideManager.removeClickBtn(1009, 2);
            App.GuideManager.removeClickBtn(1009, 3);
        };
        /**
         * 打开窗口
         * param.type : 默认是1强化，传2是升星
         */
        ForgeView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam && openParam.type) {
                this._type = openParam.type;
                this.updateForgeView(this._type);
                this.headComponent.open(openParam);
            }
            else {
                this._type = 1;
                this.updateForgeView(this._type);
                this.headComponent.open(openParam);
            }
            this._radioGroup.selectedValue = this._type;
            if (openParam && openParam.lastModule) {
                this._lastModule = openParam.lastModule;
            }
            if (!this._handleId) {
                this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
            }
            // App.EventSystem.addEventListener(PanelNotify.FORGE_STRENGTH_EQUIP, this.animationStrength, this);
            // App.EventSystem.addEventListener(PanelNotify.FORGE_STAR_EQUIP, this.animationStar, this);
            if (this.com_baseview) {
                this.com_baseview.winVo = this.winVo;
            }
            this.headComponent.readyOpen();
            this.checkGuide();
        };
        /**
         * 关闭窗口
         */
        ForgeView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
            // this.forgeModel.curPart = undefined;
        };
        /**
         * 清理
         */
        ForgeView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._handleId) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._handleId);
                this._handleId = undefined;
            }
            // App.EventSystem.removeEventListener(PanelNotify.FORGE_STRENGTH_EQUIP);
            // App.EventSystem.removeEventListener(PanelNotify.FORGE_STAR_EQUIP);
            this.headComponent.clear();
            if (this.com_baseview) {
                this.com_baseview.destroy();
            }
            this._curSelIndex = 0;
            this._lastModule = undefined;
            this.removeGuide();
        };
        /**
         * 销毁
         */
        ForgeView.prototype.destroy = function () {
            this._mc.destroy();
        };
        return ForgeView;
    }(BaseView));
    game.ForgeView = ForgeView;
    __reflect(ForgeView.prototype, "game.ForgeView");
})(game || (game = {}));
//# sourceMappingURL=ForgeView.js.map