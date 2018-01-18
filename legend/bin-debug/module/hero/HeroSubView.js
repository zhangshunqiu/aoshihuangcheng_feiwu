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
 * author ： zrj
*/
var game;
(function (game) {
    /**
     * 顶部英雄列表
    */
    var HeroHeadComponentView = (function (_super) {
        __extends(HeroHeadComponentView, _super);
        function HeroHeadComponentView(_skinName) {
            if (_skinName === void 0) { _skinName = ""; }
            var _this = _super.call(this, _skinName) || this;
            _this.currentIndex = undefined;
            _this._partnerHandleEventId = 0;
            _this.heroModel = game.HeroModel.getInstance();
            _this._redTipList = [];
            _this._tipFrameArray = [];
            _this.skinName = "HeadComponent";
            return _this;
        }
        HeroHeadComponentView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        HeroHeadComponentView.prototype.initView = function () {
            var _this = this;
            var _loop_1 = function (i) {
                var mc1 = new AMovieClip();
                mc1.x = mc1.y = 45;
                mc1.scaleX = mc1.scaleY = 1.0;
                mc1.playMCKey("effjsxjs", "", -1, null, function () { mc1.frameRate = 8; }, this_1);
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
                btnTip = new BtnTips(null, this_2.gp_main.getChildAt(i), 90, 90);
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
                this.lb_tip2.textFlow = [{ text: info2.transmigration + "转\n", style: { textColor: 0xf10000 } }, { text: "解锁", style: { textColor: 0xc39b82 } }];
            }
            //打开上次位置
            this.changeIndex(game.HeroModel.getInstance().curPos);
            this.updateView();
        };
        HeroHeadComponentView.prototype.changeIndex = function (i) {
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
        HeroHeadComponentView.prototype.showNewHero = function (index) {
            var view = new HeroNewPartner(index);
            EventSystem.getInstance().dispatchEvent(WinManagerEvent.WIN_ADD, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), view));
        };
        HeroHeadComponentView.prototype.updateView = function () {
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
                RES.getResAsync(careerTag, function (texture) {
                    _this.gp_main.getChildAt(index).getChildAt(0).source = texture;
                }, _this);
            }, this);
            for (var i = 0; i < 3; i++) {
                if (i + 1 <= this.heroModel.heroInfo.length) {
                    if (i == 1) {
                        this.lb_tip1.visible = false;
                        this.gp_main.getChildAt(1).getChildAt(0).visible = true;
                        this.gp_main.getChildAt(1).getChildAt(1).visible = true;
                        this.gp_main.getChildAt(1).getChildAt(3).visible = false;
                    }
                    else if (i == 2) {
                        this.lb_tip2.visible = false;
                        this.gp_main.getChildAt(2).getChildAt(0).visible = true;
                        this.gp_main.getChildAt(2).getChildAt(1).visible = true;
                        this.gp_main.getChildAt(2).getChildAt(3).visible = false;
                    }
                }
                else {
                    if (i == 1) {
                        this.lb_tip1.visible = true;
                        this.gp_main.getChildAt(1).getChildAt(0).visible = false;
                        this.gp_main.getChildAt(1).getChildAt(1).visible = false;
                        this.gp_main.getChildAt(1).getChildAt(3).visible = true;
                    }
                    else if (i == 2) {
                        this.lb_tip2.visible = true;
                        this.gp_main.getChildAt(2).getChildAt(0).visible = false;
                        this.gp_main.getChildAt(2).getChildAt(1).visible = false;
                        this.gp_main.getChildAt(2).getChildAt(3).visible = true;
                    }
                }
            }
        };
        /**
         * 打开窗口
         */
        HeroHeadComponentView.prototype.open = function (openParam) {
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
        HeroHeadComponentView.prototype.showRedTips = function (index, value) {
            var d = this._redTipList[index];
            if (d) {
                d.show(value);
            }
        };
        /**
        * 关闭红点按钮提示
        */
        HeroHeadComponentView.prototype.hideRedTips = function (index) {
            var d = this._redTipList[index];
            if (d) {
                d.hide();
            }
        };
        /**
         * 显示红点按钮提示,value值控制显隐,空值为隐藏
         */
        HeroHeadComponentView.prototype.setRedTips = function (index, value) {
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
        HeroHeadComponentView.prototype.setNewPartnerTip = function (index, value) {
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
        HeroHeadComponentView.prototype.clearAllRedTips = function () {
            for (var i = 0; i < this._redTipList.length; i++) {
                this._redTipList[i].hide();
            }
        };
        /**
         * 清理
         */
        HeroHeadComponentView.prototype.clear = function (data) {
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
        HeroHeadComponentView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            for (var i = 0; i < this._tipFrameArray.length; i++) {
                this._tipFrameArray[i].destroy();
            }
        };
        return HeroHeadComponentView;
    }(BaseChildView));
    game.HeroHeadComponentView = HeroHeadComponentView;
    __reflect(HeroHeadComponentView.prototype, "game.HeroHeadComponentView");
    /**
     * 创建新伙伴
    */
    var HeroNewPartner = (function (_super) {
        __extends(HeroNewPartner, _super);
        function HeroNewPartner(index) {
            var _this = _super.call(this) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this._index = 1; //英雄位置，从0开始计算
            _this.skinName = "HeroSelectSkin";
            _this._index = index;
            _this.readyOpenWin();
            return _this;
        }
        ;
        HeroNewPartner.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.y += 64;
            this.initView();
            this.updateView();
        };
        HeroNewPartner.prototype.initView = function () {
            var _this = this;
            RES.getResAsync("partner_kaiqixinjuese_title_png", function (texture) {
                _this.commonWin.img_title.texture = texture;
            }, this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                EventSystem.getInstance().dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), _this));
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                EventSystem.getInstance().dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), _this));
            }, this);
            this.img_open.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this.heroModel.heroHeadFrame[_this._index - 1]) {
                    App.Socket.send(15011, { sex: _this.sex, job: _this.career });
                }
            }, this);
            this.btn_male.labelDisplay.textColor = 0xFFFC00;
            this.btn_female.labelDisplay.textColor = 0xFFFC00;
            this.btn_male.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.sex = ConstSex.MAN;
                _this.updateView();
            }, this);
            this.btn_female.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.sex = ConstSex.WOMAN;
                _this.updateView();
            }, this);
            this.btn_warrior.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.career = CareerType.SOLDIER;
                _this.updateView();
            }, this);
            this.btn_magic.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.career = CareerType.MAGES;
                _this.updateView();
            }, this);
            this.btn_pastor.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.career = CareerType.TAOIST;
                _this.updateView();
            }, this);
            this.img_role = new eui.Image;
            this.img_role.horizontalCenter = 1;
            this.img_role.scaleX = this.img_role.scaleY = 0.7;
            this.img_role.y = -220;
            this.gp_middle.addChild(this.img_role);
            var exist = {}; //存在职业
            this.heroModel.heroInfo.forEach(function (value, index, array) {
                if (value.job == CareerType.SOLDIER) {
                    _this.btn_warrior.touchEnabled = false;
                    exist[1] = true;
                    _this.img_over1.visible = true;
                }
                else if (value.job == CareerType.MAGES) {
                    _this.btn_magic.touchEnabled = false;
                    exist[2] = true;
                    _this.img_over2.visible = true;
                }
                else {
                    _this.btn_pastor.touchEnabled = false;
                    exist[3] = true;
                    _this.img_over3.visible = true;
                }
            }, this);
            this.sex = ConstSex.MAN;
            this.career = CareerType.SOLDIER;
            for (var i = 1; i <= 3; i++) {
                if (!exist[i]) {
                    this.career = i;
                    break;
                }
            }
            var info = App.ConfigManager.getPartnerConfigById(this._index);
            if (info.level != 0) {
                this.lb_tip.textFlow = [{ text: "解锁需要：" }, { text: info.level + "级", style: { textColor: 0xff7900 } }, { text: "或" }, { text: "VIP" + info.vip, style: { textColor: 0xff0000 } }];
            }
            else {
                this.lb_tip.textFlow = [{ text: "解锁需要：" }, { text: info.transmigration + "转", style: { textColor: 0xff7900 } }, { text: "或" }, { text: "VIP" + info.vip, style: { textColor: 0xff0000 } }];
            }
        };
        HeroNewPartner.prototype.updateView = function () {
            var info = game.LoginModel.getInstance().getInfoByCareerAndSex(this.career, this.sex); //拿配置信息
            this.sex == ConstSex.WOMAN ? this.btn_warrior.currentState = "down" : this.btn_warrior.currentState = "up";
            this.sex == ConstSex.WOMAN ? this.btn_magic.currentState = "down" : this.btn_magic.currentState = "up";
            this.sex == ConstSex.WOMAN ? this.btn_pastor.currentState = "down" : this.btn_pastor.currentState = "up";
            switch (this.career) {
                case CareerType.SOLDIER: {
                    this.img_selected.y = this.btn_warrior.y - 19;
                    this.img_career.source = RES.getRes("role_zhan_png");
                    break;
                }
                case CareerType.MAGES: {
                    this.img_selected.y = this.btn_magic.y - 19;
                    this.img_career.source = RES.getRes("role_fa_png");
                    break;
                }
                case CareerType.TAOIST: {
                    this.img_selected.y = this.btn_pastor.y - 19;
                    this.img_career.source = RES.getRes("role_dao_png");
                    break;
                }
            }
            this.sex == ConstSex.MAN ? this.btn_male.currentState = "down" : this.btn_male.currentState = "up";
            this.sex == ConstSex.WOMAN ? this.btn_female.currentState = "down" : this.btn_female.currentState = "up";
            this.updateDesc(info.description);
        };
        HeroNewPartner.prototype.updateDesc = function (desc) {
            var _this = this;
            this.lb_desc.text = desc;
            var key = this.career + "000" + this.sex;
            RES.getResAsync(key + "_png", function (texture) {
                _this.img_role.source = texture;
            }, this);
        };
        HeroNewPartner.prototype.createRoleCallback = function (data) {
            EventSystem.getInstance().dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), this));
        };
        /**
         * 打开窗口
         */
        HeroNewPartner.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (!this._handle) {
                this._handle = App.EventSystem.addEventListener(PanelNotify.HERO_NEW_PARTNER, this.createRoleCallback, this);
            }
        };
        /**
         * 关闭窗口
         */
        HeroNewPartner.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        HeroNewPartner.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._handle) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_NEW_PARTNER, this._handle);
            }
        };
        /**
         * 销毁
         */
        HeroNewPartner.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return HeroNewPartner;
    }(BaseView));
    game.HeroNewPartner = HeroNewPartner;
    __reflect(HeroNewPartner.prototype, "game.HeroNewPartner");
})(game || (game = {}));
//# sourceMappingURL=HeroSubView.js.map