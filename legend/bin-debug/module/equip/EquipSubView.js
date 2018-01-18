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
/*
 * module : 装备子视图
 * author : zrj
*/
var game;
(function (game) {
    var EquipSelect = (function (_super) {
        __extends(EquipSelect, _super);
        function EquipSelect(config) {
            var _this = _super.call(this, config) || this;
            _this._part = 1;
            _this._career = 1;
            _this._sex = 1;
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "EquipSelectSkin";
            return _this;
            // this._part = type;  //装备部位
            // this._career = career;
            // this._sex = sex ? sex : 0;
            // this.readyOpenWin();
        }
        EquipSelect.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            App.EventSystem.addEventListener(PanelNotify.HERO_CLOSE_EQUIP_SELECT, function () {
                // PopUpManager.removePopUp(this);
                App.WinManager.closeWin(WinName.POP_EQUIP_SELECT);
            }, this);
            // this.gp_tip.visible = false;
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                // PopUpManager.removePopUp(this, 0);
                App.WinManager.closeWin(WinName.POP_EQUIP_SELECT);
            }, this);
            this.list = new eui.List();
            this.list.itemRenderer = EquipSelectItem;
            this.scroller.viewport = this.list;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, function (e) {
                // console.log("gggg");
            }, this);
            this.initView();
        };
        EquipSelect.prototype.initView = function () {
            // this.updateView();
        };
        EquipSelect.prototype.updateView = function () {
            var temp = game.BackpackModel.getInstance().getEquipByCareerPart(this._career, this._part);
            // temp.part = this._part;
            var finalArr = [];
            var temp1 = [];
            var temp2 = [];
            for (var i = 0; i < temp.length; i++) {
                var info = App.ConfigManager.equipConfig()[temp[i].good_id];
                if (info.sex == 0 || info.sex == this.heroModel.heroInfo[this.heroModel.curPos].sex) {
                    if (App.RoleManager.roleInfo.turn < info.reincarnation || info.limit_lvl > App.RoleManager.roleInfo.lv) {
                        temp2.push(temp[i]);
                    }
                    else {
                        temp1.push(temp[i]);
                    }
                    // finalArr.push(temp[i]);
                }
            }
            //改动，不符合不显示
            // finalArr = temp1.concat(temp2);
            finalArr = temp1;
            if (finalArr.length == 0) {
                App.WinManager.closeWin(WinName.POP_EQUIP_SELECT);
                App.GlobalTips.showTips("没有可穿戴装备");
            }
            else {
                // this.gp_tip.visible = false;
                this.gp_main.visible = true;
                game.EquipModel.getInstance().sortEquipByCap(finalArr);
                //装备在身上的也要展示
                var equip = this.heroModel.heroInfo[this.heroModel.curPos].getEquipByPart(this._part);
                if (equip) {
                    finalArr.splice(0, 0, new game.EquipVO(equip));
                }
                var data = new eui.ArrayCollection(finalArr);
                this.list.dataProvider = data;
                this.list.selectedIndex = 0;
                this.list.validateNow();
                this.changeList(0);
            }
        };
        EquipSelect.prototype.changeList = function (index) {
        };
        EquipSelect.prototype.checkGuide = function () {
            if (this.list.numElements) {
                App.GuideManager.bindClickBtn(this.list.getElementAt(0).getChildAt(0).getChildByName("btn_select"), 1000, 3);
                App.GuideManager.bindClickBtn(this.list.getElementAt(0).getChildAt(0).getChildByName("btn_select"), 1002, 3);
                App.GuideManager.checkGuide(1000);
                App.GuideManager.checkGuide(1002);
            }
        };
        EquipSelect.prototype.removeGuide = function () {
            App.GuideManager.removeClickBtn(1000, 3);
            App.GuideManager.removeClickBtn(1002, 3);
        };
        /**
        * 打开窗口
        */
        EquipSelect.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._part = openParam.type; //装备部位
            this._career = openParam.career;
            this._sex = openParam.sex ? openParam.sex : 0;
            this.updateView();
            this.validateNow();
            this.checkGuide();
        };
        /**
         * 关闭窗口
         */
        EquipSelect.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
          * 清理
          */
        EquipSelect.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            this.removeGuide();
        };
        /**
         * 销毁
         */
        EquipSelect.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            App.EventSystem.removeEventListener(PanelNotify.HERO_CLOSE_EQUIP_SELECT);
        };
        return EquipSelect;
    }(BaseView));
    game.EquipSelect = EquipSelect;
    __reflect(EquipSelect.prototype, "game.EquipSelect");
    var EquipSelectItem = (function (_super) {
        __extends(EquipSelectItem, _super);
        function EquipSelectItem() {
            var _this = _super.call(this) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "EquipSelectItem";
            _this.btn_select.name = "btn_select";
            var equipInfo = _this.heroModel.heroInfo[_this.heroModel.curPos].getEquipByPart(_this.heroModel.curPart);
            if (equipInfo) {
                _this.equipedId = equipInfo.id;
            }
            _this.btn_select.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var heroModel = game.HeroModel.getInstance();
                var heroInfo = heroModel.heroInfo[heroModel.curPos];
                var baseInfo = App.ConfigManager.equipConfig()[_this.data.good_id];
                if (App.RoleManager.roleInfo.turn < baseInfo.reincarnation) {
                    App.GlobalTips.showTips("转生达到" + baseInfo.reincarnation + "转可穿戴");
                    return;
                }
                else if (baseInfo.limit_lvl > App.RoleManager.roleInfo.lv) {
                    App.GlobalTips.showTips("等级达到" + baseInfo.limit_lvl + "级可穿戴");
                    return;
                }
                App.Socket.send(15002, { id: heroInfo.id, part: heroModel.curPart, player_good_id: _this.data.id });
                App.EventSystem.dispatchEvent(PanelNotify.HERO_CLOSE_EQUIP_SELECT);
            }, _this);
            return _this;
        }
        EquipSelectItem.prototype.dataChanged = function () {
            var baseInfo = App.ConfigManager.equipConfig()[this.data.good_id];
            this.lb_name.text = baseInfo.name;
            this.lb_name.textColor = ConstTextColor[baseInfo.quality];
            this.lb_level.text = "Lv." + baseInfo.limit_lvl;
            this.lb_attr.lineSpacing = 4;
            // this.lb_cap.text = "评分：";
            this.bmlb_fightcap.text = this.data.score;
            this.bmlb_cap.text = this.data.score;
            this.baseItem.updateBaseItem(2, this.data.good_id);
            this.baseItem.setStopShowTips(true);
            var textArray = [];
            textArray.push({ text: "【基础属性】\n", style: { textColor: 0xffa200, size: 24 } });
            var attribute = App.ConfigManager.attributeConfig()[baseInfo.base_att];
            // let attrBase = EquipModel.getInstance().attributeFilter(attribute);
            var attrBase = this.data.base;
            var count = 0;
            var colorArray = [0xc98f12, 0x2f66a9, 0x149a21, 0x8d1b1b];
            for (var key in attrBase) {
                var myKey = ConstAttributeArray[attrBase[key].key];
                textArray.push({ text: "\t" + ConstAttributeTwo[myKey] + "：", style: { textColor: 0xffa200, size: 24 } }, { text: attrBase[key].value, style: { textColor: 0xbfb294, size: 24 } }, { text: "+" + attrBase[key].add_value, style: { textColor: 0xbfb294, size: 24 } });
                count++;
                if (count % 2 == 0) {
                    textArray.push({ text: "\n" });
                }
            }
            ;
            this.lb_attr.textFlow = textArray;
            if (this.data.id == this.equipedId) {
                this.img_equiped.visible = true;
                this.btn_select.visible = false;
            }
            else {
                this.img_equiped.visible = false;
                this.btn_select.visible = true;
            }
            if (App.RoleManager.roleInfo.turn < baseInfo.reincarnation || baseInfo.limit_lvl > App.RoleManager.roleInfo.lv) {
                this.lb_level.textColor = 0xf63527;
            }
            else {
                this.lb_level.textColor = 0xbfb294;
            }
            if (baseInfo.reincarnation) {
                //转生
                this.lb_level.text = baseInfo.reincarnation + "转";
            }
        };
        return EquipSelectItem;
    }(eui.ItemRenderer));
    game.EquipSelectItem = EquipSelectItem;
    __reflect(EquipSelectItem.prototype, "game.EquipSelectItem");
})(game || (game = {}));
//# sourceMappingURL=EquipSubView.js.map