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
 * module : 技能模块视图
 * author : zrj
*/
var game;
(function (game) {
    var SkillPanel = (function (_super) {
        __extends(SkillPanel, _super);
        function SkillPanel() {
            var _this = _super.call(this) || this;
            _this.offset = 0;
            _this.heroModel = game.HeroModel.getInstance();
            _this._handleId = 0;
            _this.skinName = "SkillSkin";
            return _this;
        }
        SkillPanel.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this._handleId = App.EventSystem.addEventListener(PanelNotify.HERO_UPDATE_SKILL_PANEL, this.updateView, this);
            // App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT,this.changeList,this);
            this.initView();
            this.validateNow();
        };
        SkillPanel.prototype.initView = function () {
            var _this = this;
            // this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
            //     // this.parent.visible = false;
            //     App.EventSystem.dispatchEvent(PanelNotify.HERO_CLOSE_SKILL_PANEL);
            // }, this);
            this.btn_career.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.btn_career.currentState = "down";
                _this.btn_reborn.currentState = "up";
            }, this);
            this.btn_reborn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                // this.btn_career.currentState = "up";
                // this.btn_reborn.currentState = "down";
            }, this);
            this.btn_career.currentState = "down";
            this.list = new eui.List();
            this.list.itemRenderer = SkillItem;
            this.scroller.viewport = this.list;
            this.scroller.addEventListener(eui.UIEvent.CHANGE, function (e) {
                _this.offset = _this.scroller.viewport.scrollV;
                // console.log(this.offset,this.scroller.height,this.list.height,this.scroller.viewport.contentHeight);
            }, this);
            // this.updateView();
            // this.changeList();
            // 全部升级
            this.btn_allup.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var skillInfo = _this.heroModel.heroInfo[_this.heroModel.curPos].skillDic;
                var canUp = true;
                for (var key in skillInfo) {
                    if (skillInfo[key] >= App.RoleManager.roleInfo.lv) {
                        canUp = false;
                        break;
                    }
                }
                if (canUp) {
                    App.Socket.send(12003, _this.heroModel.heroInfo[_this.heroModel.curPos].id);
                }
                else {
                    App.GlobalTips.showTips("等级不能超过人物等级");
                }
            }, this);
        };
        SkillPanel.prototype.updateView = function () {
            this.changeList();
            // this.scroller.viewport.scrollV = this.offset;
            console.log("upadate skill");
        };
        SkillPanel.prototype.changeList = function () {
            var index = this.heroModel.curPos;
            this.offset = 0;
            var skillInfo = this.heroModel.heroInfo[this.heroModel.curPos].skillDic;
            var temp = [];
            for (var key in skillInfo) {
                temp.push({ id: Number(key), level: skillInfo[key] });
            }
            var data = new eui.ArrayCollection(temp);
            this.offset = this.list.scrollV;
            this.list.dataProvider = data;
            this.list.selectedIndex = 0;
            this.list.validateNow();
            this.list.scrollV = this.offset;
            this.checkGuide();
        };
        SkillPanel.prototype.checkGuide = function () {
            var gp_cost = (this.list.getElementAt(0).getChildAt(0)).getChildByName("gp_cost");
            App.GuideManager.bindClickBtn(gp_cost.getChildByName("btn_active"), 1004, 2);
            App.GuideManager.checkGuide(1004);
        };
        SkillPanel.prototype.removeGuide = function () {
            App.GuideManager.removeClickBtn(1004, 2);
        };
        /**
         * 打开窗口
         */
        SkillPanel.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this.changeList();
        };
        SkillPanel.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        SkillPanel.prototype.clear = function (data) {
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        SkillPanel.prototype.destroy = function () {
            this.removeGuide();
            App.EventSystem.removeEventListener(PanelNotify.HERO_UPDATE_SKILL_PANEL, this._handleId);
        };
        return SkillPanel;
    }(BaseView));
    game.SkillPanel = SkillPanel;
    __reflect(SkillPanel.prototype, "game.SkillPanel");
    var SkillItem = (function (_super) {
        __extends(SkillItem, _super);
        function SkillItem() {
            var _this = _super.call(this) || this;
            _this.skillModel = game.SkillModel.getInstance();
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "SkillItemSkin";
            _this.gp_cost.name = "gp_cost";
            _this.btn_active.name = "btn_active";
            _this.btn_active.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // this.skillModel.curData = this.data;
                App.Socket.send(12004, { hero_id: _this.heroModel.heroInfo[_this.heroModel.curPos].id, skill_id: _this.data.id });
            }, _this);
            return _this;
        }
        SkillItem.prototype.dataChanged = function () {
            // if (this.data.level == 0) {
            //     this.data.level =1;
            // }
            var info = this.skillModel.getSkillUpgrageByIdLevel(this.data.id, this.data.level);
            var nextInfo = this.skillModel.getSkillUpgrageByIdLevel(this.data.id, this.data.level + 1);
            if (!info) {
                info = nextInfo;
            }
            this.lb_name.text = info.name;
            this.lb_desc.text = info.desc;
            this.lb_cost.text = nextInfo ? nextInfo.cost_coin : 0;
            // this.baseItem.updateBaseItem(3,this.data.skill_id);
            this.baseItem.setItemNameVisible(false);
            this.baseItem.setItemNameAtt({ textColor: 0x1ba4d1 });
            this.baseItem.setItemNameAtt({ size: 22 });
            this.baseItem.setItemName("等级：" + this.data.level);
            this.lb_level.text = "等级：" + this.data.level;
            // RES.getResAsync(info.id + "_png", (texture) => {
            this.baseItem.setItemIcon(info.id);
            // }, this);
            // this.lb_tip.text = ;
            if (info.open_lv <= App.RoleManager.roleInfo.lv) {
                if (this.data.level == App.RoleManager.roleInfo.lv) {
                    this.gp_cost.visible = false;
                    this.lb_tip.visible = true;
                    this.lb_tip.text = "\u7B49\u7EA7\u4E0D\u80FD\u8D85\u8FC7\u4EBA\u7269\u7B49\u7EA7";
                }
                else {
                    this.gp_cost.visible = true;
                    this.lb_tip.visible = false;
                }
            }
            else {
                this.gp_cost.visible = false;
                this.lb_tip.visible = true;
                this.lb_tip.text = "\u5230\u8FBE" + info.open_lv + "\u7EA7\u5F00\u542F";
            }
            if (!nextInfo) {
                this.gp_cost.visible = false;
                this.lb_tip.visible = true;
                this.lb_tip.text = "\u5DF2\u6EE1\u7EA7";
            }
            else {
                // this.gp_cost.visible = true;
                // this.lb_tip.visible = false;
            }
        };
        SkillItem.prototype.updateView = function (data) {
        };
        return SkillItem;
    }(eui.ItemRenderer));
    game.SkillItem = SkillItem;
    __reflect(SkillItem.prototype, "game.SkillItem");
})(game || (game = {}));
//# sourceMappingURL=SkillPanel.js.map