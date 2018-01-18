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
var customui;
(function (customui) {
    var BaseItem = (function (_super) {
        __extends(BaseItem, _super);
        function BaseItem(id) {
            var _this = _super.call(this) || this;
            _this.equipInfo = undefined; //服务端的装备属性
            _this._isStopShowTips = false;
            _this._itemMiniNum = 1;
            _this._itemNameVisible = false; //物品名称是否显示
            _this._careerVisible = false; //职业是否显示
            _this._isSelect = false;
            _this._textTipsVisible = false; //文本类型
            _this._textStarVisible = false; //星级
            _this._textStrengthVisible = false; //强化
            _this._textNumVisible = false; //数量
            _this._textLvVisible = false; //级别
            _this.skinName = "BaseItemSkin";
            _this._id = id;
            if (_this.hasEventListener(egret.Event.REMOVED_FROM_STAGE) == false) {
                _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
            }
            return _this;
        }
        BaseItem.prototype.onRemoveFromStage = function () {
            this.destroy();
        };
        /**
         * 销毁
         */
        BaseItem.prototype.destroy = function () {
            if (this._qualityMC) {
                this._qualityMC.stop();
                this._qualityMC.destroy();
                if (this._qualityMC.parent) {
                    this._qualityMC.parent.removeChild(this._qualityMC);
                }
                this._qualityMC = null;
            }
        };
        /**
         * 显示红点
         */
        BaseItem.prototype.showRedTips = function (value) {
            if (this._redBtnTips == null) {
                this._redBtnTips = new BtnTips(null, this);
            }
            this._redBtnTips.show(value);
        };
        /**
         * 隐藏红点
         */
        BaseItem.prototype.hideRedTips = function () {
            if (this._redBtnTips) {
                this._redBtnTips.hide();
            }
        };
        BaseItem.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            // if (!RES.getRes("common_default_png")) {
            //     RES.getResAsync("common_default_png", (texture) => {
            //     }, this);
            // }
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            // let itemInfo = undefined
            // if (this._id) {
            // }
            this.touchEnabled = false;
            if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP) == false) {
                this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemClick, this);
            }
        };
        BaseItem.prototype.onItemClick = function (event) {
            if (this._isStopShowTips) {
                return;
            }
            if (!this._type || !this._id) {
                return;
            }
            var map = this.$getEventMap();
            if (map && map[egret.TouchEvent.TOUCH_TAP]) {
                if (map[egret.TouchEvent.TOUCH_TAP].length > 1) {
                    this.setStopShowTips(true);
                    return;
                }
            }
            App.GlobalTips.showItemTips(this._type, this._id, null, this.equipInfo);
        };
        /**
         * 禁止弹出通用提示
         * @params ban  boolean
        */
        BaseItem.prototype.setStopShowTips = function (b) {
            this._isStopShowTips = b;
            if (this._isStopShowTips) {
                this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemClick, this);
            }
            else {
                if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP) == false) {
                    this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onItemClick, this);
                }
            }
        };
        /**
         * type : 类型
         * id : 配置表的id，非背包id
         * num : 数量, 可选
         * equipInfo: 装备位置信息
        */
        BaseItem.prototype.updateBaseItem = function (type, id, num, equipInfo) {
            var info = undefined;
            this._type = type;
            this._id = id;
            switch (type) {
                case 0:
                case ClientType.BASE_ITEM:
                    info = App.ConfigManager.itemConfig()[id];
                    break;
                case ClientType.EQUIP:
                    info = App.ConfigManager.equipConfig()[id];
                    break;
                case 3:
                default: break;
            }
            if (!info) {
                if (type == ClientType.BASE_ITEM) {
                    this.setStrengthLv(0);
                    this.setStarLv(0);
                }
                else if (type == ClientType.EQUIP) {
                    this.setStrengthLv(0);
                    this.setStarLv(0);
                    this.setItemBg(this.getFrameByQuality(-1));
                }
                //this.setQualityBg(-1);//可以不设
                this.setItemIcon(null);
                this.setItemName("");
                this.setItemNum(0);
                this.setCarrerIcon(0);
                this.setItemLv(0);
                if (equipInfo) {
                    this.setStrengthLv(equipInfo.lv);
                    this.setStarLv(equipInfo.star);
                    this.equipInfo = equipInfo;
                }
                else {
                    this.setStrengthLv(0);
                    this.setStarLv(0);
                }
                return;
            }
            this.setQualityBg(info.quality);
            this.setItemIcon(info.icon);
            this.setItemNum(num);
            if (type == ClientType.BASE_ITEM) {
                this.setCarrerIcon(0);
                //特殊处理，宝石
                if (info.type == ItemType.RUBY) {
                    this.setItemName(ConstJewelName[info.sub_type], ConstTextColor[info.quality]);
                    this.setItemLv(info.limit_lv);
                }
                else {
                    this.setItemLv(0);
                    this.setItemName(info.name, ConstTextColor[info.quality]);
                }
                this.setStrengthLv(0);
                this.setStarLv(0);
                this.setCarrerIconVisible(false);
            }
            else if (type == ClientType.EQUIP) {
                if (info.reincarnation) {
                    this.setItemName(info.reincarnation + "转", ConstTextColor[info.quality]);
                }
                else {
                    this.setItemName(info.limit_lvl + "级", ConstTextColor[info.quality]);
                }
                this.setItemLv(0);
                this.setCarrerIcon(info.limit_career);
                this.setCarrerIconVisible(true);
                if (equipInfo) {
                    this.setStrengthLv(equipInfo.lv);
                    this.setStarLv(equipInfo.star);
                    this.equipInfo = equipInfo;
                }
                else {
                    this.setStrengthLv(0);
                    this.setStarLv(0);
                }
            }
        };
        /**
         * 设置是否选择
         */
        BaseItem.prototype.setSelect = function (b) {
            this._isSelect = b;
            if (this.img_select) {
                this.img_select.visible = b;
            }
        };
        /**
         * 设置物品图标
         */
        BaseItem.prototype.setItemIcon = function (icon) {
            var _this = this;
            if (icon) {
                RES.getResAsync(icon + "_png", function (texture) {
                    if (_this.img_icon) {
                        _this.img_icon.source = texture;
                    }
                }, this);
            }
            else {
                this.img_icon.source = null;
            }
        };
        /**
         * 获取物品图标
         */
        BaseItem.prototype.getItemIcon = function () {
            return this.img_icon.source;
        };
        /**
         * 设置品质背景
         */
        BaseItem.prototype.setQualityBg = function (quality) {
            // RES.getResAsync(this.getFrameByQuality(quality), (texture) => {
            //     if(this.img_frame){
            //         this.img_frame.source = texture;
            //     }
            // }, this);
            this.setItemBg(this.getFrameByQuality(quality));
            if (quality == ConstQuality.ORANGE) {
                if (this._qualityMC == null) {
                    this._qualityMC = new AMovieClip();
                    this.addChild(this._qualityMC);
                    this._qualityMC.x = this.width / 2;
                    this._qualityMC.y = this.height / 2;
                }
                this._qualityMC.playMCKey("effgjzb");
                this._qualityMC.visible = true;
            }
            else {
                if (this._qualityMC) {
                    this._qualityMC.stop();
                    this._qualityMC.visible = false;
                }
            }
        };
        /*
         * 设置背景
         */
        BaseItem.prototype.setItemBg = function (picurl) {
            var _this = this;
            RES.getResAsync(picurl, function (texture) {
                if (_this.img_frame) {
                    _this.img_frame.source = texture;
                }
            }, this);
        };
        /**
         * 设置职业
         */
        BaseItem.prototype.setCarrerIcon = function (carrer) {
            var _this = this;
            if (carrer && carrer > 0 && carrer < 4) {
                RES.getResAsync(ConstCareerIcon[carrer], function (texture) {
                    if (_this.img_career) {
                        _this.img_career.source = texture;
                    }
                }, this);
                this.img_career.visible = this._careerVisible;
            }
            else {
                this.img_career.visible = false;
            }
        };
        //设置职业是否显示
        BaseItem.prototype.setCarrerIconVisible = function (b) {
            if (this.img_career) {
                this.img_career.visible = b;
            }
            this._careerVisible = b;
        };
        /**
         * 设置物品名称
         */
        BaseItem.prototype.setItemName = function (data, textColor) {
            if (textColor === void 0) { textColor = ConstTextColor[0]; }
            if (data) {
                if (typeof (data) == "string" || typeof (data) == "number") {
                    this.lb_name.text = String(data);
                }
                else if (typeof (data) == "object") {
                    this.lb_name.textFlow = data;
                }
                this.lb_name.textColor = textColor;
                this.lb_name.visible = this._itemNameVisible;
            }
            else {
                this.lb_name.visible = false;
            }
        };
        //设置物品名称是否显示
        BaseItem.prototype.setItemNameVisible = function (b) {
            this._itemNameVisible = b;
            if (this.lb_name) {
                this.lb_name.visible = b;
            }
        };
        /**
         * 设置物品名称样式
         */
        BaseItem.prototype.setItemNameAtt = function (param) {
            if (param.textColor) {
                this.lb_name.textColor = param.textColor;
            }
            else if (param.top) {
                this.lb_name.top = param.top;
            }
            else if (param.size) {
                this.lb_name.size = param.size;
            }
            else if (param.x) {
                this.lb_name.x = param.x;
            }
            else if (param.y) {
                this.lb_name.y = param.y;
            }
        };
        /**
         * 设置文本提示
         */
        BaseItem.prototype.setTextTips = function (str) {
            if (str && str != "") {
                this.lb_tips.text = str;
                this.lb_tips.visible = this._textTipsVisible;
            }
            else {
                this.lb_tips.visible = false;
            }
        };
        //设置文本提示是否显示
        BaseItem.prototype.setTextTipsVisible = function (b) {
            this._textTipsVisible = b;
            if (this.lb_tips) {
                this.lb_tips.visible = b;
            }
        };
        /**
         * 设置数量
         */
        BaseItem.prototype.setItemNum = function (num) {
            if (num && num > this._itemMiniNum) {
                this.lb_num.text = String(num);
                this.lb_num.visible = this._textNumVisible;
            }
            else {
                this.lb_num.visible = false;
            }
        };
        //设置数量是否显示
        BaseItem.prototype.setItemNumVisible = function (b) {
            this._textNumVisible = b;
            if (this.lb_num) {
                this.lb_num.visible = b;
            }
        };
        BaseItem.prototype.setItemMiniNum = function (v) {
            this._itemMiniNum = v;
        };
        /**
         * 设置物品等级
         */
        BaseItem.prototype.setItemLv = function (lv) {
            if (lv && lv > 0) {
                this.lb_lv.text = "Lv." + lv;
                this.lb_lv.visible = this._textLvVisible;
            }
            else {
                this.lb_lv.visible = false;
            }
        };
        //设置物品等级是否显示
        BaseItem.prototype.setItemLvVisible = function (b) {
            this._textLvVisible = b;
            if (this.lb_lv) {
                this.lb_lv.visible = b;
            }
        };
        /**
         * 设置强化等级
         */
        BaseItem.prototype.setStrengthLv = function (lv) {
            if (lv && lv > 0) {
                this.lb_strength.text = "+" + lv;
                this.lb_strength.visible = this._textStrengthVisible;
            }
            else {
                this.lb_strength.visible = false;
            }
        };
        //设置强化等级是否显示
        BaseItem.prototype.setStrengthLvVisible = function (b) {
            this._textStrengthVisible = b;
            if (this.lb_strength) {
                this.lb_strength.visible = b;
            }
        };
        /**
         * 设置星级
         */
        BaseItem.prototype.setStarLv = function (lv) {
            if (lv && lv > 0) {
                this.lb_star.text = "+" + lv;
                this.lb_star.visible = this._textStarVisible;
            }
            else {
                this.lb_star.visible = false;
            }
        };
        //设置星级是否显示
        BaseItem.prototype.setStarLvVisible = function (b) {
            this._textStarVisible = b;
            if (this.lb_star) {
                this.lb_star.visible = b;
            }
        };
        /**
         * 设置所有显示状态
         */
        BaseItem.prototype.setAllVisible = function (b) {
            this.setStarLvVisible(b);
            this.setStrengthLvVisible(b);
            this.setItemLvVisible(b);
            this.setItemNumVisible(b);
            this.setTextTipsVisible(b);
            this.setItemNameVisible(b);
            this.setCarrerIconVisible(b);
        };
        /**
         * 获取品质框
         */
        BaseItem.prototype.getFrameByQuality = function (quality) {
            if (quality && quality > 0) {
                return "com_frame_item" + quality + "_png";
            }
            return "com_frame_itemDef_png";
        };
        return BaseItem;
    }(eui.Component));
    customui.BaseItem = BaseItem;
    __reflect(BaseItem.prototype, "customui.BaseItem", ["egret.IEventDispatcher"]);
})(customui || (customui = {}));
//# sourceMappingURL=BaseItem.js.map