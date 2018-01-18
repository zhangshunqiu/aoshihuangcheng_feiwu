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
 *勋章模块界面逻辑 2017/06/20.
  现在改成成就界面
 */
var game;
(function (game) {
    // export class MyTabbar extends eui.TabBar
    // {
    // 	public setTapTabBar(index:number){
    //        this.setSelectedIndex(index,true);
    // 	}
    // }
    var MetalView = (function (_super) {
        __extends(MetalView, _super);
        function MetalView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._mustdomodel = game.MustDoModel.getInstance();
            _this._curSelIndex = 0;
            return _this;
        }
        MetalView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.METAL);
            }, this);
            this.bt_back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.METAL);
            }, this);
            this.initView();
        };
        MetalView.prototype.initBtnTips = function () {
            //App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_DAILY, this.rb_mustdo);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_ACHIEVE, this.rb_achieve);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TASK_ACHIEVETITLE, this.rb_title);
        };
        MetalView.prototype.initView = function () {
            var _this = this;
            this.initBtnTips();
            var radioGroup = new eui.RadioButtonGroup();
            radioGroup.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var radioGroup = evt.target;
                _this.changeMustDoState(radioGroup.selectedValue);
            }, this);
            this.rb_achieve.group = radioGroup;
            this.rb_achieve.label = "成就";
            this.rb_achieve.value = 2;
            this.rb_title.group = radioGroup;
            this.rb_title.label = "称号";
            this.rb_title.value = 3;
            //this.rb_medal.selected = true;
            // this.tab_medal.validateNow();
            // this.tab_medal.addEventListener(eui.UIEvent.CREATION_COMPLETE, this._onCreatComplete, this)
        };
        /**
         * 打开窗口
        */
        MetalView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (openParam && openParam.index) {
                if (openParam.index == 2) {
                    this.changeMustDoState(this.rb_title.value);
                    this.rb_title.selected = true;
                }
            }
            else {
                this.changeMustDoState(this.rb_achieve.value);
                this.rb_achieve.selected = true;
            }
            // if (this._medal_view == null) {
            // 	this._medal_view =  new MustDoMedalView("MustDoMedalSkin");
            // 	this.addChild(this._medal_view);
            // }
            // this._medal_view.readyOpen({ data: {} });
            // this._curSelView = this._medal_view;
            // this._curSelIndex = 1;
        };
        /**
         * 关闭窗口
         */
        MetalView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        MetalView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            this._curSelIndex = 0;
        };
        /**
         * 销毁
         */
        MetalView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        MetalView.prototype.changeMustDoState = function (index) {
            var _this = this;
            if (this._curSelIndex == index) {
                return;
            }
            if (this._curSelView) {
                this._curSelView.clear();
            }
            switch (index + 1) {
                case MustDoType.ACHIEVE:
                    //this._curgroup = this.gp_achieve;
                    //this._curgroup.visible = true;
                    if (this._achieve_view == null) {
                        this._achieve_view = new game.MustDoAchieveView("MustDoAchieveSkin");
                        this.addChild(this._achieve_view);
                    }
                    this._achieve_view.readyOpen({ data: {} });
                    this._curSelView = this._achieve_view;
                    RES.getResAsync("task_chengjiu_title_png", function (texture) {
                        _this.commonWin.img_title.texture = texture;
                    }, this);
                    break;
                case MustDoType.TITLE:
                    if (this._title_view == null) {
                        this._title_view = new game.MustDoTitleView("MustDoTitleSkin");
                        this.addChild(this._title_view);
                    }
                    this._title_view.readyOpen({ data: {} });
                    this._curSelView = this._title_view;
                    RES.getResAsync("title_chenghao_title_png", function (texture) {
                        _this.commonWin.img_title.texture = texture;
                    }, this);
            }
            //this._curtype = index;
            this._curSelIndex = index;
        };
        return MetalView;
    }(BaseView));
    game.MetalView = MetalView;
    __reflect(MetalView.prototype, "game.MetalView");
})(game || (game = {}));
//# sourceMappingURL=MetalView.js.map