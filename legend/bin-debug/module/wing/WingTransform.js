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
 * Author: liuyonggen
 * 翅膀转换视图模块  2017/11/20
 */
var game;
(function (game) {
    var WingTransform = (function (_super) {
        __extends(WingTransform, _super);
        function WingTransform() {
            var _this = _super.call(this) || this;
            _this._backpackModel = game.BackpackModel.getInstance();
            _this.itemType = {};
            _this._eventId = 0;
            _this.skinName = "WingTransformSkin";
            return _this;
        }
        WingTransform.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        WingTransform.prototype.initView = function () {
            var _this = this;
            this.btn_transform.addEventListener(egret.TouchEvent.TOUCH_TAP, this.transform, this);
            var _loop_1 = function (i) {
                this_1["img_otherIcon" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    _this.currentType = _this.itemType[i];
                    for (var j = 0; j < 3; j++) {
                        if (i === j) {
                            _this["img_selectorBg" + j].visible = true;
                        }
                        else {
                            _this["img_selectorBg" + j].visible = false;
                        }
                    }
                }, this_1);
            };
            var this_1 = this;
            for (var i = 0; i < 3; i++) {
                _loop_1(i);
            }
            this.list = new eui.List();
            this.list.itemRenderer = getItem;
            var layout = new eui.TileLayout();
            layout.requestedRowCount = 1;
            layout.verticalGap = 10;
            layout.horizontalGap = 18;
            layout.horizontalAlign = egret.HorizontalAlign.LEFT;
            this.list.layout = layout;
            this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemTap, this); //点击物品弹出对应物品信息
            this.scroller.viewport = this.list;
            this.scroller.scrollPolicyH = eui.ScrollPolicy.ON;
            this.scroller.scrollPolicyV = eui.ScrollPolicy.OFF;
            this.scroller.verticalScrollBar.autoVisibility = false;
            this.scroller.verticalScrollBar.visible = false;
            this.list.dataProvider = new eui.ArrayCollection([]);
            this.getWingEquip();
        };
        /**
         * 转换
         */
        WingTransform.prototype.transform = function () {
            if (!this.currentType) {
                var text = [{ text: "请选择要转换的羽翼装备类型", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                App.GlobalTips.showTips(text);
                return;
            }
            else {
                App.Socket.send(14012, { good_id: this.currentId, to_type: this.currentType });
                // this.gp_content.visible = false;
            }
        };
        /**
         * 从背包的里把翅膀装备拿出来
         */
        WingTransform.prototype.getWingEquip = function () {
            if (this.list) {
                var data = this._backpackModel.chestBackpack;
                var wingEquip = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].good_id > 200 && data[i].good_id < 600) {
                        wingEquip.push(data[i]);
                    }
                }
                if (wingEquip.length == 0) {
                    this.gp_noWingQuipe.visible = true;
                }
                else {
                    this.gp_noWingQuipe.visible = false;
                    this.list.dataProvider = new eui.ArrayCollection(wingEquip);
                }
            }
        };
        /**
         * 选中羽翼装备后的处理函数
         */
        WingTransform.prototype.itemTap = function (event) {
            App.loglyg("event", event);
            var itemData = event.item;
            var data = App.ConfigManager.getItemInfoById(itemData.good_id);
            this.currentId = itemData.good_id;
            this.gp_content.visible = true;
            this.btn_transform.currentState = "up";
            this.btn_transform.touchEnabled = true;
            this.img_selectorIcon.visible = true;
            this.img_selectorIcon.source = data.icon + "_png";
            this.img_selectorFrame.source = QualityFrame[data.quality];
            this.lb_selectorName.text = data.name;
            var wingStepInfo = App.ConfigManager.getWingStepById(data.limit_lv); //阶数对应信息
            this.lb_gold.text = wingStepInfo.transition_money;
            var data1;
            var data2;
            var data3;
            switch (data.sub_type) {
                case 1:
                    data1 = App.ConfigManager.getItemInfoById(itemData.good_id + 100);
                    data2 = App.ConfigManager.getItemInfoById(itemData.good_id + 200);
                    data3 = App.ConfigManager.getItemInfoById(itemData.good_id + 300);
                    break;
                case 2:
                    data1 = App.ConfigManager.getItemInfoById(itemData.good_id - 100);
                    data2 = App.ConfigManager.getItemInfoById(itemData.good_id + 100);
                    data3 = App.ConfigManager.getItemInfoById(itemData.good_id + 200);
                    break;
                case 3:
                    data1 = App.ConfigManager.getItemInfoById(itemData.good_id - 100);
                    data2 = App.ConfigManager.getItemInfoById(itemData.good_id - 200);
                    data3 = App.ConfigManager.getItemInfoById(itemData.good_id + 100);
                    break;
                case 4:
                    data1 = App.ConfigManager.getItemInfoById(itemData.good_id - 100);
                    data2 = App.ConfigManager.getItemInfoById(itemData.good_id - 200);
                    data3 = App.ConfigManager.getItemInfoById(itemData.good_id - 300);
                    break;
            }
            this.otherWingEquip(data1, 0);
            this.otherWingEquip(data2, 1);
            this.otherWingEquip(data3, 2);
        };
        WingTransform.prototype.otherWingEquip = function (data, pos) {
            this.itemType[pos] = data.sub_type;
            this["img_otherIcon" + pos].visible = true;
            this["img_otherFrame" + pos].source = QualityFrame[data.quality];
            this["img_otherIcon" + pos].source = data.icon + "_png";
            this["lb_otherName" + pos].text = data.name;
        };
        WingTransform.prototype.transformResult = function (data) {
            if (data.result) {
                this.gp_content.visible = false;
                this.btn_transform.currentState = "down";
                this.btn_transform.touchEnabled = false;
            }
        };
        /**
        * 打开窗口
        */
        WingTransform.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.WING_TRANSFORM_RESULT, this.transformResult, this);
            }
        };
        /**
         * 关闭窗口
         */
        WingTransform.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        WingTransform.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            if (this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_TRANSFORM_RESULT, this._eventId);
                this._eventId = 0;
            }
        };
        /**
         * 销毁
         */
        WingTransform.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WingTransform;
    }(BaseView));
    game.WingTransform = WingTransform;
    __reflect(WingTransform.prototype, "game.WingTransform");
    var getItem = (function (_super) {
        __extends(getItem, _super);
        function getItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\t\t\t\t<e:Skin class=\"getItemSkin\" width=\"100\" height=\"125\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\" xmlns:customui=\"customui.*\">\n\t\t\t\t\t<e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n\t\t\t\t\t\t<customui:BaseItem id=\"baseItem\" width=\"100\" height=\"100\" horizontalCenter=\"0\" top=\"0\" anchorOffsetX=\"0\" anchorOffsetY=\"0\"/>\n\t\t\t\t\t</e:Group>\n\t\t\t\t</e:Skin>";
            _this.baseItem.setItemNameVisible(true);
            return _this;
        }
        getItem.prototype.dataChanged = function () {
            this.baseItem.updateBaseItem(this.data.type, this.data.good_id, this.data.num);
        };
        return getItem;
    }(eui.ItemRenderer));
    __reflect(getItem.prototype, "getItem");
})(game || (game = {}));
//# sourceMappingURL=WingTransform.js.map