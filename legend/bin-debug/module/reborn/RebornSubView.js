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
 * 转生模块子视图
 * author ：zrj
*/
var game;
(function (game) {
    //转生获取修为界面
    var RebornPointView = (function (_super) {
        __extends(RebornPointView, _super);
        function RebornPointView(viewConfig) {
            var _this = _super.call(this, viewConfig) || this;
            //public rect_bg: eui.Rect;
            _this.list = new eui.List();
            _this._array = [];
            _this.skinName = "RebornPointSkin";
            return _this;
        }
        RebornPointView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.readyOpenWin();
            this.initView();
            App.Socket.send(20002, {});
        };
        RebornPointView.prototype.initView = function () {
            // this.rect_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            //     // PopUpManager.removePopUp(this);
            //     App.WinManager.closeWin(WinName.POP_REBORN_POINT);
            // }, this);
            this.gp_main.addChild(this.list);
            this.list.horizontalCenter = 0;
            this.list.top = 70;
            this.list.itemRenderer = RebornPointItem;
            // this.updateView();
            var id = [100, 19, 20];
            for (var i = 0; i < id.length; i++) {
                var item = new RebornPointItem(id[i]);
                this.gp_main.addChild(item);
                item.y = 30 + i * 120;
                item.horizontalCenter = 0;
                this._array.push(item);
            }
        };
        RebornPointView.prototype.updateView = function () {
            // this.list.dataProvider = new eui.ArrayCollection([100, 19, 20]);
            var id = [100, 19, 20];
            this._array.forEach(function (value, index, array) {
                value.update({ id: id[index], index: index });
            }, this);
        };
        /**
         * 打开窗口
         */
        RebornPointView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            if (!this._infoHandle) {
                this._infoHandle = App.EventSystem.addEventListener(PanelNotify.REBORN_UPDATE_INFO_VIEW, this.updateView, this);
            }
        };
        /**
         * 关闭窗口
         */
        RebornPointView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        RebornPointView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._infoHandle) {
                App.EventSystem.removeEventListener(PanelNotify.REBORN_UPDATE_INFO_VIEW, this._infoHandle);
                this._infoHandle = undefined;
            }
        };
        /**
         * 销毁
         */
        RebornPointView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return RebornPointView;
    }(BaseView));
    game.RebornPointView = RebornPointView;
    __reflect(RebornPointView.prototype, "game.RebornPointView");
    var RebornPointItem = (function (_super) {
        __extends(RebornPointItem, _super);
        function RebornPointItem(data) {
            var _this = _super.call(this) || this;
            //public img_change: eui.Image;
            _this.rebornModel = game.RebornModel.getInstance();
            _this._index = 0;
            _this.skinName = "RebornPointItemSkin";
            _this.btn_use.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(20003, { type: _this._index + 1 });
            }, _this);
            _this.baseItem.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // let view = new game.ItemTip(this.data,null);
                // PopUpManager.addPopUp({ obj: view, effectType: 0, opacity:0 });
                App.GlobalTips.showItemTips(ClientType.BASE_ITEM, _this.data, null);
            }, _this);
            // this._index = this.itemIndex;
            _this.redDot = App.BtnTipManager.creatBtnTip("", _this);
            _this.redDot.x = 510;
            _this.redDot.y = 50;
            return _this;
        }
        RebornPointItem.prototype.dataChanged = function () {
            this.baseItem.updateBaseItem(ClientType.BASE_ITEM, this.data);
            this.baseItem.setItemNameVisible(false);
            if (this._index + 1 == ConstRebornExchangeType.LEVEL) {
                var lvInfo = App.ConfigManager.getRebornInfoByLevel(App.RoleManager.roleInfo.lv);
                if (!lvInfo) {
                    lvInfo = { number: 0 };
                }
                this.btn_use.label = "兑换";
                // RES.getResAsync("reborn_txt_duihuan_png", (texture) => {
                //     this.img_change.source = texture;
                // }, this)
                this.img_gold.visible = false;
                var remind = App.ConfigManager.getConstConfigByType("TRANSMI_CONVERT_NUM").value - this.rebornModel.getExchangeInfoByType(ConstRebornExchangeType.LEVEL).used_times;
                this.lb_time.textFlow = [{ text: "今天还可兑换" }, { text: String(remind), style: { textColor: 0x59ff10 } }, { text: "次" }];
                this.lb_name.textFlow = [{ text: "增加" }, { text: String(lvInfo.number), style: { textColor: 0x59ff10 } }, { text: "修为" }];
                this.lb_cost.text = "等级兑换：降" + App.ConfigManager.getConstConfigByType("TRANSMI_REDUCE_LEVEL").value + "级";
                if (this.rebornModel.checkCanExchangeLevel()) {
                    this.redDot.show();
                }
                else {
                    this.redDot.hide();
                }
            }
            else if (this._index + 1 == ConstRebornExchangeType.REDUCE) {
                var info = App.ConfigManager.getItemInfoById(this.data);
                var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, this.data);
                if (!itemInfo) {
                    this.lb_cost.text = info.name + "\t\t\t\t\t" + App.ConfigManager.getConstConfigByType("TRANSMI_EXPERP_GOLD").value;
                    this.img_gold.visible = true;
                    this.btn_use.label = "购买并使用";
                    // RES.getResAsync("reborn_goumaibingshiyong_png", (texture) => {
                    //     this.img_change.source = texture;
                    // }, this)
                }
                else {
                    this.lb_cost.text = "背包剩余" + itemInfo.num + "个";
                    this.img_gold.visible = false;
                    this.btn_use.label = "使用";
                    // RES.getResAsync("reborn_txt_shiyong_png", (texture) => {
                    //     this.img_change.source = texture;
                    // }, this)
                }
                var remind = App.ConfigManager.getConstConfigByType("TRANSMI_EXPERP_NUM").value - this.rebornModel.getExchangeInfoByType(ConstRebornExchangeType.REDUCE).used_times;
                this.lb_time.textFlow = [{ text: "今天还可兑换" }, { text: String(remind), style: { textColor: 0x59ff10 } }, { text: "次" }];
                this.lb_name.textFlow = [{ text: "增加" }, { text: String(App.ConfigManager.getConstConfigByType("TRANSMI_EXPERP_LIFT").value), style: { textColor: 0x59ff10 } }, { text: "修为" }];
                if (this.rebornModel.checkCanExchangeExpert()) {
                    this.redDot.show();
                }
                else {
                    this.redDot.hide();
                }
            }
            else {
                var info = App.ConfigManager.getItemInfoById(this.data);
                var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, this.data);
                if (!itemInfo) {
                    this.lb_cost.text = info.name + "\t\t\t\t\t" + App.ConfigManager.getConstConfigByType("TRANSMI_SUPER_GOLD").value;
                    this.img_gold.visible = true;
                    this.btn_use.label = "购买并使用";
                    // RES.getResAsync("reborn_goumaibingshiyong_png", (texture) => {
                    //     this.img_change.source = texture;
                    // }, this)
                }
                else {
                    this.lb_cost.text = "背包剩余" + itemInfo.num + "个";
                    this.img_gold.visible = false;
                    this.btn_use.label = "购买并使用";
                    // RES.getResAsync("reborn_txt_shiyong_png", (texture) => {
                    //     this.img_change.source = texture;
                    // }, this)
                }
                var remind = App.ConfigManager.getConstConfigByType("TRANSMI_SUPER_NUM").value - this.rebornModel.getExchangeInfoByType(ConstRebornExchangeType.SUPER).used_times;
                this.lb_time.textFlow = [{ text: "今天还可兑换" }, { text: String(remind), style: { textColor: 0x59ff10 } }, { text: "次" }];
                this.lb_name.textFlow = [{ text: "增加" }, { text: String(App.ConfigManager.getConstConfigByType("TRANSMI_SUPER_LIFT").value), style: { textColor: 0x59ff10 } }, { text: "修为" }];
                if (this.rebornModel.checkCanExchangeSuper()) {
                    this.redDot.show();
                }
                else {
                    this.redDot.hide();
                }
            }
        };
        RebornPointItem.prototype.update = function (data) {
            this._index = data.index;
            this.data = data.id;
            // this.dataChanged();
        };
        return RebornPointItem;
    }(eui.ItemRenderer));
    __reflect(RebornPointItem.prototype, "RebornPointItem");
})(game || (game = {}));
//# sourceMappingURL=RebornSubView.js.map