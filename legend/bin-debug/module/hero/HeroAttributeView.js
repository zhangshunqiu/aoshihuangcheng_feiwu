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
* module : 英雄详细属性
* author : zrj
*/
var game;
(function (game) {
    var HeroAttributeView = (function (_super) {
        __extends(HeroAttributeView, _super);
        function HeroAttributeView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._curPos = 0;
            _this._labelArray = [];
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "HeroAttributeSkin";
            // this.y += 64;
            _this.readyOpenWin();
            return _this;
        }
        HeroAttributeView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        HeroAttributeView.prototype.initView = function () {
            var _this = this;
            // RES.getResAsync("equipping_juese_title_png", (texture) => {
            // 	this.commonWin.img_title.texture = texture;
            // }, this);
            this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                EventSystem.getInstance().dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), _this));
            }, this);
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                EventSystem.getInstance().dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(new WinManagerVO("", "", WinLay.MODULE_LAY), _this));
                App.WinManager.openWin(WinName.HERO);
            }, this);
            this._labelArray.push(this.lb_ac);
            this._labelArray.push(this.lb_hp);
            this._labelArray.push(this.lb_mp);
            this._labelArray.push(this.lb_def);
            this._labelArray.push(this.lb_sdef);
            this._labelArray.push(this.lb_crit);
            this._labelArray.push(this.lb_rcrit);
            this._labelArray.push(this.lb_hit_rate);
            this._labelArray.push(this.lb_dodge);
            this._labelArray.push(this.lb_damage_deepen);
            this._labelArray.push(this.lb_damage_reduction);
            this._labelArray.push(this.lb_paralysis);
            this._labelArray.push(this.lb_damage_offset_rate);
            this._curPos = this.heroModel.curPos;
            this.updateView(this._curPos);
        };
        HeroAttributeView.prototype.updateView = function (data) {
            this._curPos = data;
            var heroInfo = this.heroModel.heroInfo[this._curPos];
            // let attributeInfo = this.heroModel.heroInfo[this._curPos].attributeInfo;
            var attrArray = ["ac", "hp", "mp", "def", "sdef", "crit", "rcrit", "hit_rate", "dodge", "damage_deepen", "damage_reduction", "paralysis", "damage_offset_rate"];
            this.bmlb_cap.text = String(heroInfo.score);
            for (var i = 0; i < attrArray.length; i++) {
                if (i == 0) {
                    var key = "ac";
                    if (heroInfo.job == CareerType.SOLDIER) {
                        key = "ac";
                    }
                    else if (heroInfo.job == CareerType.MAGES) {
                        key = "mac";
                    }
                    else if (heroInfo.job == CareerType.TAOIST) {
                        key = "sc";
                    }
                    this._labelArray[i].text = "" + heroInfo.getAtrributeByKey(key).value;
                    if (heroInfo.getAtrributeByKey(key).addValue) {
                        this._labelArray[i].text = "+" + heroInfo.getAtrributeByKey(key).addValue;
                    }
                }
                else if (i <= 4) {
                    this._labelArray[i].text = "" + heroInfo.getAtrributeByKey(attrArray[i]).value;
                    if (heroInfo.getAtrributeByKey(attrArray[i]).addValue) {
                        this._labelArray[i].text = "+" + heroInfo.getAtrributeByKey(attrArray[i]).addValue;
                    }
                }
                else {
                    this._labelArray[i].text = "" + Math.floor(heroInfo.getAtrributeByKey(attrArray[i]).value / 100) + "%";
                    if (heroInfo.getAtrributeByKey(attrArray[i]).addValue) {
                        this._labelArray[i].text = "+" + Math.floor(heroInfo.getAtrributeByKey(attrArray[i]).addValue) + "%";
                    }
                }
            }
        };
        /**
         * 打开窗口
         */
        HeroAttributeView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (!this._handleId) {
                this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.updateView, this);
            }
            this.hero_head.readyOpen(openParam);
        };
        /**
         * 关闭窗口
         */
        HeroAttributeView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        HeroAttributeView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._handleId) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._handleId);
                this._handleId = undefined;
            }
            this.hero_head.clear(data);
        };
        /**
         * 销毁
         */
        HeroAttributeView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return HeroAttributeView;
    }(BaseView));
    game.HeroAttributeView = HeroAttributeView;
    __reflect(HeroAttributeView.prototype, "game.HeroAttributeView");
})(game || (game = {}));
//# sourceMappingURL=HeroAttributeView.js.map