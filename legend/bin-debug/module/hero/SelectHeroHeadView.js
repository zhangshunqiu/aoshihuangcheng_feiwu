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
 * module : 英雄模块子视图
 * author ： lh
*/
var game;
(function (game) {
    /**
     * 顶部英雄列表
    */
    var SelectHeroHeadView = (function (_super) {
        __extends(SelectHeroHeadView, _super);
        function SelectHeroHeadView(_skinName) {
            if (_skinName === void 0) { _skinName = ""; }
            var _this = _super.call(this, _skinName) || this;
            _this._heroHeadList = [];
            _this.currentIndex = undefined;
            _this._partnerHandleEventId = 0;
            _this.heroModel = game.HeroModel.getInstance();
            _this._redTipList = [];
            _this._tipFrameArray = [];
            _this.skinName = "HeadComponent";
            return _this;
        }
        SelectHeroHeadView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        SelectHeroHeadView.prototype.initView = function () {
            var _this = this;
            this._heroHeadList.push(this.item_hero1);
            this._heroHeadList.push(this.item_hero2);
            this._heroHeadList.push(this.item_hero3);
            var _loop_1 = function (i) {
                var mc1 = new AMovieClip();
                mc1.x = mc1.y = 53;
                mc1.scaleX = mc1.scaleY = 1.4;
                mc1.playMCKey("efficon", "", -1, null, function () { mc1.frameRate = 8; }, this_1);
                mc1.visible = false;
                this_1.gp_main.getChildAt(i + 1).addChild(mc1);
                this_1._tipFrameArray.push(mc1);
            };
            var this_1 = this;
            for (var i = 0; i <= 1; i++) {
                _loop_1(i);
            }
            var _loop_2 = function (i) {
                this_2.gp_main.getChildAt(i).addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
                    if (i <= _this.heroModel.heroInfo.length - 1) {
                        _this.changeIndex(i);
                    }
                    else {
                        _this.showNewHero(i);
                    }
                }, this_2);
                btnTip = new BtnTips(null, this_2.gp_main.getChildAt(i));
                // btnTip.show("1");
                this_2._redTipList.push(btnTip);
            };
            var this_2 = this, btnTip;
            for (var i = 0; i < 3; i++) {
                _loop_2(i);
            }
            var info1 = App.ConfigManager.getPartnerConfigById(1); //第二个
            var info2 = App.ConfigManager.getPartnerConfigById(2); //第三个
            this.lb_tip1.lineSpacing = 6;
            this.lb_tip1.textFlow = [{ text: info1.level + "级\n", style: { textColor: 0xf59411 } }, { text: "解锁", style: { textColor: 0xc39b82 } }];
            this.lb_tip2.lineSpacing = 6;
            if (info2.level != 0) {
                this.lb_tip2.textFlow = [{ text: info2.level + "级\n", style: { textColor: 0xf59411 } }, { text: "解锁", style: { textColor: 0xc39b82 } }];
            }
            else {
                this.lb_tip2.textFlow = [{ text: info2.transmigration + "转\n", style: { textColor: 0xf59411 } }, { text: "解锁", style: { textColor: 0xc39b82 } }];
            }
            //打开上次位置
            this.changeIndex(game.HeroModel.getInstance().curPos);
            this.updateView();
        };
        SelectHeroHeadView.prototype.changeIndex = function (i) {
            if (this.currentIndex == undefined) {
                this.currentIndex = i;
            }
            else if (this.currentIndex == i) {
                return;
            }
            this.gp_main.getChildAt(this.currentIndex).getChildAt(2).visible = false;
            this.gp_main.getChildAt(i).getChildAt(2).visible = true;
            this.currentIndex = i;
            game.HeroModel.getInstance().curPos = i;
            App.EventSystem.dispatchEvent(PanelNotify.HERO_CHANGE, i);
            App.EventSystem.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT, i);
        };
        //选择新英雄
        SelectHeroHeadView.prototype.showNewHero = function (index) {
            var view = new game.HeroNewPartner(index);
            EventSystem.getInstance().dispatchEvent(WinManagerEvent.WIN_ADD, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), view));
        };
        SelectHeroHeadView.prototype.updateView = function () {
            var _this = this;
            this.heroModel.heroInfo.forEach(function (value, index, array) {
                var headKey = App.ConfigManager.getSmallHeroIconBySexAndJob(value.sex, value.job, 2);
                RES.getResAsync(headKey + "_png", function (texture) {
                    _this.gp_main.getChildAt(index).getChildAt(1).source = texture;
                    //(<eui.Image>(<eui.Group>this.gp_main.getChildAt(index)).getChildAt(1)).scaleX = 0.76;
                    //(<eui.Image>(<eui.Group>this.gp_main.getChildAt(index)).getChildAt(1)).scaleY = 0.76;
                }, _this);
                _this.gp_main.getChildAt(index).getChildAt(0).visible = true;
                var careerTag = ConstCareerIcon[value.job];
                RES.getResAsync(careerTag + "_png", function (texture) {
                    _this.gp_main.getChildAt(index).getChildAt(0).source = texture;
                }, _this);
            }, this);
            for (var i = 0; i < 3; i++) {
                if (i + 1 <= this.heroModel.heroInfo.length) {
                    if (i == 1) {
                        this.lb_tip1.visible = false;
                    }
                    else if (i == 2) {
                        this.lb_tip2.visible = false;
                    }
                }
                else {
                    if (i == 1) {
                        this.lb_tip1.visible = true;
                        this.gp_main.getChildAt(1).getChildAt(0).visible = false;
                        this.gp_main.getChildAt(1).getChildAt(1).visible = false;
                    }
                    else if (i == 2) {
                        this.lb_tip2.visible = true;
                        this.gp_main.getChildAt(2).getChildAt(0).visible = false;
                        this.gp_main.getChildAt(1).getChildAt(1).visible = false;
                    }
                }
            }
        };
        /**
         * 打开窗口
         */
        SelectHeroHeadView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            //打开上次位置
            this.changeIndex(game.HeroModel.getInstance().curPos);
            this.updateView();
            if (this._partnerHandleEventId == 0) {
                this._partnerHandleEventId = App.EventSystem.addEventListener(PanelNotify.HERO_NEW_PARTNER, this.updateView, this);
            }
        };
        /**
        * 显示红点按钮提示
        */
        SelectHeroHeadView.prototype.showRedTips = function (index, value) {
            var d = this._redTipList[index];
            if (d) {
                d.show(value);
            }
        };
        /**
        * 关闭红点按钮提示
        */
        SelectHeroHeadView.prototype.hideRedTips = function (index) {
            var d = this._redTipList[index];
            if (d) {
                d.hide();
            }
        };
        /**
         * 显示红点按钮提示,value值控制显隐,空值为隐藏
         */
        SelectHeroHeadView.prototype.setRedTips = function (index, value) {
            var d = this._redTipList[index];
            if (d) {
                if (value) {
                    d.show(value);
                }
                else {
                    d.hide();
                }
            }
        };
        SelectHeroHeadView.prototype.setNewPartnerTip = function (index, value) {
            var mc = this._tipFrameArray[index];
            if (value) {
                mc.visible = true;
            }
            else {
                mc.visible = false;
            }
        };
        /**
         * 清理所有红点按钮提示
         */
        SelectHeroHeadView.prototype.clearAllRedTips = function () {
            for (var i = 0; i < this._redTipList.length; i++) {
                this._redTipList[i].hide();
            }
        };
        /**
         * 清理
         */
        SelectHeroHeadView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._partnerHandleEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_NEW_PARTNER, this._partnerHandleEventId);
                this._partnerHandleEventId = 0;
            }
        };
        /**
         * 销毁
         */
        SelectHeroHeadView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            for (var i = 0; i < this._tipFrameArray.length; i++) {
                this._tipFrameArray[i].destroy();
            }
        };
        return SelectHeroHeadView;
    }(BaseChildView));
    game.SelectHeroHeadView = SelectHeroHeadView;
    __reflect(SelectHeroHeadView.prototype, "game.SelectHeroHeadView");
    var HeroHeadItem = (function (_super) {
        __extends(HeroHeadItem, _super);
        function HeroHeadItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "HeroHeadItemSkin";
            return _this;
        }
        return HeroHeadItem;
    }(eui.ItemRenderer));
    game.HeroHeadItem = HeroHeadItem;
    __reflect(HeroHeadItem.prototype, "game.HeroHeadItem");
})(game || (game = {}));
//# sourceMappingURL=SelectHeroHeadView.js.map