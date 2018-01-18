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
* Author: lihe
* Email： hersletter@qq.com
* 天梯争霸UI界面逻辑 2017/06/20.
*/
var game;
(function (game) {
    var LabberHegemonyWin = (function (_super) {
        __extends(LabberHegemonyWin, _super);
        function LabberHegemonyWin(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._curSelIndex = 0;
            return _this;
        }
        LabberHegemonyWin.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.HEGEMONY);
            }, this);
            RES.getResAsync("encounter_zaoyuzhan_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            this.initView();
        };
        LabberHegemonyWin.prototype.initView = function () {
            var _this = this;
            var radioGroup = new eui.RadioButtonGroup();
            radioGroup.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var radioGroup = evt.target;
                _this.updateView(radioGroup.selectedValue);
            }, this);
            this.rb_encounter.group = radioGroup;
            this.rb_encounter.value = 1;
            this.rb_encounter.label = "遭遇";
            this.rb_encounter.selected = true;
            this.rb_labber.group = radioGroup;
            this.rb_labber.label = "争霸";
            this.rb_labber.value = 2;
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.AREAN_ENCOUNTER, this.rb_encounter);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.AREAN_LABBER, this.rb_labber);
        };
        LabberHegemonyWin.prototype.updateView = function (index) {
            var _this = this;
            if (this._curSelIndex == index) {
                return;
            }
            if (this._curSelView) {
                this._curSelView.clear();
            }
            if (index == 1) {
                RES.getResAsync("encounter_zaoyuzhan_title_png", function (texture) {
                    _this.commonWin.img_title.texture = texture;
                }, this);
                if (this.view_encounter == null) {
                    this.view_encounter = new game.EncounterView("EncounterSkin");
                }
                this.addChild(this.view_encounter);
                this.view_encounter.readyOpen({ data: {} });
                this._curSelView = this.view_encounter;
            }
            else if (index == 2) {
                RES.getResAsync("labber_tiantizhengba_title_png", function (texture) {
                    _this.commonWin.img_title.texture = texture;
                }, this);
                if (this.view_labber == null) {
                    this.view_labber = new game.LabberView("LabberSkin");
                }
                this.addChild(this.view_labber);
                this.view_labber.readyOpen({ data: {} });
                this._curSelView = this.view_labber;
            }
            this._curSelIndex = index;
        };
        /**
         * 打开窗口
        */
        LabberHegemonyWin.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam && openParam.index) {
                if (openParam.index == 2) {
                    this.updateView(this.rb_labber.value);
                    this.rb_labber.selected = true;
                }
            }
            else {
                this.updateView(this.rb_encounter.value);
                this.rb_encounter.selected = true;
            }
            // if (this.view_encounter == null) {
            // 	this.view_encounter = new EncounterView("EncounterSkin")
            // }
            // this.addChild(this.view_encounter);
            // this.view_encounter.readyOpen({ data: {} });
            // this._curSelView = this.view_encounter;
            // this._curSelIndex = 1;
        };
        /**
         * 关闭窗口
         */
        LabberHegemonyWin.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        LabberHegemonyWin.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._curSelView) {
                this._curSelView.clear();
            }
            this._curSelIndex = 0;
        };
        /**
         * 销毁
         */
        LabberHegemonyWin.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return LabberHegemonyWin;
    }(BaseView));
    game.LabberHegemonyWin = LabberHegemonyWin;
    __reflect(LabberHegemonyWin.prototype, "game.LabberHegemonyWin");
})(game || (game = {}));
//# sourceMappingURL=LabberHegemonyWin.js.map