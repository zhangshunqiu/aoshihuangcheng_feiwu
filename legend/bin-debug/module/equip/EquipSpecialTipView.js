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
* module : 特殊装备模块
* author : zrj
*/
var game;
(function (game) {
    var EquipSpecialTipView = (function (_super) {
        __extends(EquipSpecialTipView, _super);
        function EquipSpecialTipView(data) {
            var _this = _super.call(this, data) || this;
            _this.heroModel = game.HeroModel.getInstance();
            _this.skinName = "EquipSpecialTipSkin";
            return _this;
            // this._data = data;
        }
        EquipSpecialTipView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            // this.initView();
        };
        EquipSpecialTipView.prototype.initView = function () {
            this.btn_active.addEventListener(egret.TouchEvent.TOUCH_TAP, this.activeFragment, this);
            var specialInfo = this.heroModel.heroInfo[this._data.pos].getEquipSpecialByPart(this._data.part);
            var ringInfo = App.ConfigManager.getEquipSpecialById(specialInfo.id);
            var singleRingInfo = App.ConfigManager.getEquipSpecialFragmentById(ringInfo.ring_id[this._data.num - 1]);
            if (game.BossModel.getInstance().level >= singleRingInfo.condition) {
                this.lb_condition.visible = false;
                this.btn_active.visible = true;
                this.img_txt.visible = true;
            }
            else {
                this.lb_condition.visible = true;
                this.btn_active.visible = false;
                this.img_txt.visible = false;
            }
            this.lb_name.text = singleRingInfo.name;
            this.lb_condition.text = "通关第" + singleRingInfo.condition + "个关卡可获得";
            var attribute = App.ConfigManager.getAttributeInfoById(singleRingInfo.add_id);
            var attrBase = game.EquipModel.getInstance().attributeFilter(attribute);
            var textArray = [];
            for (var key in attrBase) {
                if (this.heroModel.heroInfo[this._data.pos].job == CareerType.SOLDIER) {
                    if (key != "mac" && key != "sc") {
                        textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0x00f829 } }, { text: attrBase[key], style: { textColor: 0x00f829 } });
                        var Label = new eui.Label();
                        Label.size = 24;
                        Label.fontFamily = "SimHei";
                        Label.textFlow = textArray;
                        this.gp_attr.addChild(Label);
                    }
                }
                else if (this.heroModel.heroInfo[this._data.pos].job == CareerType.MAGES) {
                    if (key != "ac" && key != "sc") {
                        textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0x00f829 } }, { text: attrBase[key], style: { textColor: 0x00f829 } });
                        var Label = new eui.Label();
                        Label.size = 24;
                        Label.fontFamily = "SimHei";
                        Label.textFlow = textArray;
                        this.gp_attr.addChild(Label);
                    }
                }
                else if (this.heroModel.heroInfo[this._data.pos].job == CareerType.TAOIST) {
                    if (key != "mac" && key != "ac") {
                        textArray.push({ text: ConstAttribute[key] + ": ", style: { textColor: 0x00f829 } }, { text: attrBase[key], style: { textColor: 0x00f829 } });
                        var Label = new eui.Label();
                        Label.size = 24;
                        Label.fontFamily = "SimHei";
                        Label.textFlow = textArray;
                        this.gp_attr.addChild(Label);
                    }
                }
            }
            ;
            var layout = new eui.TileLayout();
            layout.requestedRowCount = 2;
            layout.requestedColumnCount = 2;
            layout.horizontalAlign = egret.HorizontalAlign.CENTER;
            layout.verticalAlign = egret.VerticalAlign.MIDDLE;
            layout.horizontalGap = 50;
            this.gp_attr.layout = layout;
            this.lb_tip.textFlow = [{ text: "点击空白区域可关闭窗口", style: { underline: true } }];
            this.validateNow();
        };
        //激活碎片
        EquipSpecialTipView.prototype.activeFragment = function () {
            App.Socket.send(15014, { id: this._data.id, pos: this._data.part, num: this._data.num });
        };
        EquipSpecialTipView.prototype.closeView = function () {
            // PopUpManager.removePopUp(this);
            App.WinManager.closeWin(WinName.POP_EQUIPSPECIAL_TIP);
        };
        EquipSpecialTipView.prototype.checkGuide = function () {
            // App.GuideManager.bindClickBtn(this.btn_active,1015,4);
            // App.GuideManager.checkGuide(1015);
        };
        EquipSpecialTipView.prototype.removeGuide = function () {
            // App.GuideManager.removeClickBtn(1015,4);
        };
        /**
         * 打开窗口
         * openParam参数  part : 特殊装备部位  isActive ：是否已经激活
         *
         */
        EquipSpecialTipView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._data = openParam.data;
            this.initView();
            if (!this._updateHandleId) {
                this._updateHandleId = App.EventSystem.addEventListener(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE, this.closeView, this);
            }
            this.checkGuide();
        };
        /**
         * 关闭窗口
         */
        EquipSpecialTipView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        EquipSpecialTipView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._updateHandleId) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE, this._updateHandleId);
                this._updateHandleId = undefined;
            }
            this.removeGuide();
        };
        /**
         * 销毁
         */
        EquipSpecialTipView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return EquipSpecialTipView;
    }(BaseView));
    game.EquipSpecialTipView = EquipSpecialTipView;
    __reflect(EquipSpecialTipView.prototype, "game.EquipSpecialTipView");
})(game || (game = {}));
//# sourceMappingURL=EquipSpecialTipView.js.map