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
var game;
(function (game) {
    var PlayerHeroAttr = (function (_super) {
        __extends(PlayerHeroAttr, _super);
        function PlayerHeroAttr(vo) {
            var _this = _super.call(this, vo) || this;
            _this._attrArray = ["ac", "mac", "sc", "hp", "mp", "def", "sdef", "crit", "rcrit", "hit_rate", "dodge", "damage_deepen", "damage_reduction", "paralysis", "damage_offset_rate"];
            return _this;
        }
        PlayerHeroAttr.prototype.childrenCreated = function () {
            this.img_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                WinManager.getInstance().closePopWin(WinName.POP_PLAYER_HERO_ATTR);
            }, this);
            this.tabBar.itemRenderer = game.PlayerMsgTabItem;
            this.tabBar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.tabItemHandler, this);
        };
        /**
         * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
         */
        PlayerHeroAttr.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.initTabBar();
            this.showHeroMsg();
        };
        PlayerHeroAttr.prototype.tabItemHandler = function (event) {
            if (event.itemIndex <= game.PlayerMsgModel.getInstance().heroNum) {
                game.PlayerMsgModel.getInstance().curPos = event.itemIndex;
                this.showHeroMsg();
                App.EventSystem.dispatchEvent(PanelNotify.PLAYER_HERO_ATTRIBUTE_INDEX_CHANGE);
            }
        };
        /**
         * 显示英雄头像
         */
        PlayerHeroAttr.prototype.initTabBar = function () {
            var dataArr = game.PlayerMsgModel.getInstance().herosHeadPic();
            this.tabBar.dataProvider = new eui.ArrayCollection(dataArr);
        };
        /**
         * 显示英雄信息
         */
        PlayerHeroAttr.prototype.showHeroMsg = function () {
            this.tabSelectIndex();
            this.showHeroAttr();
            this.showHeroScore();
        };
        /**
         * 改变切换卡选中状态
         */
        PlayerHeroAttr.prototype.tabSelectIndex = function () {
            var index = game.PlayerMsgModel.getInstance().curPos;
            var items = this.tabBar.$children;
            for (var i = 0; i < items.length; i++) {
                if (i == index) {
                    items[i].img_select.visible = true;
                }
                else {
                    items[i].img_select.visible = false;
                }
            }
        };
        /**
         * 显示英雄战力
         */
        PlayerHeroAttr.prototype.showHeroScore = function () {
            var index = game.PlayerMsgModel.getInstance().curPos;
            var heroDatas = game.PlayerMsgModel.getInstance().heroList;
            var heroData = heroDatas[index];
            this.bitmap_score.text = heroData["score"]; //英雄战力
        };
        /**
         * 显示英雄属性
         */
        PlayerHeroAttr.prototype.showHeroAttr = function () {
            var index = game.PlayerMsgModel.getInstance().curPos;
            var heroDatas = game.PlayerMsgModel.getInstance().heroList;
            var heroData = heroDatas[index];
            var heroAttr = heroData["attribute"];
            for (var i = 0; i < this._attrArray.length; i++) {
                var attrName = this._attrArray[i];
                switch (attrName) {
                    // 	key = "ac";
                    // } else if (heroInfo.job == CareerType.MAGES) {
                    // 	key = "mac";
                    // } else if (heroInfo.job == CareerType.TAOIST) {
                    // 	key = "sc";
                    case "ac":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        if (value) {
                            this.lb_ac.text = value + "";
                        }
                        break;
                    case "mac":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        if (value) {
                            this.lb_ac.text = value + "";
                        }
                        break;
                    case "sc":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        if (value) {
                            this.lb_ac.text = value + "";
                        }
                        break;
                    case "hp":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_hp.text = value + "";
                        break;
                    case "mp":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_mp.text = value + "";
                        break;
                    case "def":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_def.text = value + "";
                        break;
                    case "sdef":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_sdef.text = value + "";
                        break;
                    case "crit":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_crit.text = value / 100 + "%";
                        break;
                    case "rcrit":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_rcrit.text = value / 100 + "%";
                        break;
                    case "hit_rate":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_hit_rate.text = value / 100 + "%";
                        break;
                    case "dodge":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_dodge.text = value / 100 + "%";
                        break;
                    case "damage_deepen":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_damage_deepen.text = value / 100 + "%";
                        break;
                    case "damage_reduction":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_damage_reduction.text = value / 100 + "%";
                        break;
                    case "paralysis":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_paralysis.text = value / 100 + "%";
                        break;
                    case "damage_offset_rate":
                        var key = ConstAttributeArray.indexOf(attrName);
                        var value = game.PlayerMsgModel.getInstance().getAtrributeByKey(key, heroAttr)["value"];
                        this.lb_damage_offset_rate.text = value / 100 + "%";
                        break;
                    default:
                        break;
                }
            }
        };
        /**
         * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
         */
        PlayerHeroAttr.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        PlayerHeroAttr.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return PlayerHeroAttr;
    }(BaseView));
    game.PlayerHeroAttr = PlayerHeroAttr;
    __reflect(PlayerHeroAttr.prototype, "game.PlayerHeroAttr");
})(game || (game = {}));
//# sourceMappingURL=PlayerHeroAttr.js.map