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
var ItemWays = (function (_super) {
    __extends(ItemWays, _super);
    /**
     * id: 物品id
     */
    function ItemWays(viewConf) {
        if (viewConf === void 0) { viewConf = null; }
        return _super.call(this, viewConf) || this;
    }
    ItemWays.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
    };
    ItemWays.prototype.initView = function () {
        var _this = this;
        this.baseItem.updateBaseItem(this._type, this._id);
        this.baseItem.setItemNameVisible(true);
        this.baseItem.setItemName({ textColor: 0x974e22 });
        this.baseItem.setItemNumVisible(false);
        var layout = new eui.VerticalLayout();
        layout.gap = 10;
        layout.horizontalAlign = egret.HorizontalAlign.CENTER;
        layout.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.gp_way.layout = layout;
        var info = App.ConfigManager.getItemInfoById(this._id);
        var _loop_1 = function (i) {
            if (info.acquiring_way[i] == 0) {
                return "continue";
            }
            var item = new itemWayItem(info.acquiring_way[i]);
            this_1.gp_way.addChild(item);
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.jump(info.acquiring_way[i]);
            }, this_1);
        };
        var this_1 = this;
        for (var i = 0; i < info.acquiring_way.length; i++) {
            _loop_1(i);
        }
        if (info.acquiring_way.length >= 2) {
            this.y -= 30 * (info.acquiring_way.length - 2);
            this.height += (info.acquiring_way.length - 1) * 80;
        }
        var baseInfo = App.ConfigManager.getItemInfoById(this._id);
        if (baseInfo) {
            this.lb_name.text = baseInfo.name;
            this.lb_name.textColor = ConstTextColor[baseInfo.quality];
        }
    };
    ItemWays.prototype.jump = function (id) {
        var info = App.ConfigManager.getModuleOpenInfoById(id);
        if (App.GuideManager.isModuleOpen(info.client_name)) {
            this.closeWin();
            MainModuleJump.jumpToModule(id);
        }
        else {
            App.GuideManager.moduleNotOpenTip(info.client_name);
        }
    };
    ItemWays.prototype.openWin = function (openParam) {
        if (openParam === void 0) { openParam = null; }
        _super.prototype.openWin.call(this, openParam);
        this._type = openParam.type;
        this._id = openParam.id;
        this.initView();
    };
    ItemWays.prototype.closeWin = function () {
        _super.prototype.closeWin.call(this);
    };
    /**
     * 清理
     */
    ItemWays.prototype.clear = function (data) {
        if (data === void 0) { data = null; }
        _super.prototype.clear.call(this, data);
    };
    /**
     * 销毁
     */
    ItemWays.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return ItemWays;
}(BaseView));
__reflect(ItemWays.prototype, "ItemWays");
var itemWayItem = (function (_super) {
    __extends(itemWayItem, _super);
    function itemWayItem(id) {
        var _this = _super.call(this) || this;
        _this.skinName = "ItemWayItemSkin";
        _this._id = id;
        return _this;
    }
    itemWayItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        var info = App.ConfigManager.getModuleOpenInfoById(this._id);
        if (info) {
            this.lb_name.text = info.name;
        }
    };
    return itemWayItem;
}(eui.Component));
__reflect(itemWayItem.prototype, "itemWayItem");
//# sourceMappingURL=ItemWays.js.map