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
 * module : 橙装熔炼视图
 * author : zrj
*/
var game;
(function (game) {
    var SmeltOrangeView = (function (_super) {
        __extends(SmeltOrangeView, _super);
        function SmeltOrangeView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.smeltModel = game.SmeltModel.getInstance();
            _this.backpackModel = game.BackpackModel.getInstance();
            return _this;
        }
        SmeltOrangeView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.initView();
            this.updateView();
        };
        SmeltOrangeView.prototype.initView = function () {
            var _this = this;
            this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.WinManager.closeWin(WinName.POP_SMELT_ORANGE);
            }, this);
            this.btn_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.jumpTo(20);
            }, this);
            this.lb_way1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.jumpTo(44);
            }, this);
            this.lb_way2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                _this.jumpTo(38);
            }, this);
            this.lb_way1.textFlow = [{ text: "获得橙装：寻宝", style: { underline: true } }];
            this.lb_way2.textFlow = [{ text: "获得橙装：全民BOSS", style: { underline: true } }];
            this.list = new eui.List();
            this.list.itemRenderer = SmeltOrangeItem;
            this.scroller.viewport = this.list;
            // this.list.dataProvider = new eui.ArrayCollection([1,2,3,4,5]);
        };
        SmeltOrangeView.prototype.updateView = function () {
            var data = this.backpackModel.getEquipByQuality(ConstQuality.ORANGE);
            this.list.dataProvider = new eui.ArrayCollection(data);
            if (this.list.dataProvider.length == 0) {
                this.lb_tips.visible = true;
            }
            else {
                this.lb_tips.visible = false;
            }
        };
        SmeltOrangeView.prototype.jumpCallback = function () {
            App.WinManager.closeWin(WinName.POP_SMELT_ORANGE);
        };
        SmeltOrangeView.prototype.jumpTo = function (moduleId) {
            this.jumpCallback.bind(this);
            MainModuleJump.jumpToModule(moduleId, this.jumpCallback, this);
        };
        /**
         * 打开窗口
         */
        SmeltOrangeView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.EventSystem.addEventListener(PanelNotify.SMELT_ORANGE_EQUIP, this.updateView, this);
        };
        /**
         * 关闭窗口
         */
        SmeltOrangeView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        SmeltOrangeView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            App.EventSystem.removeEventListener(PanelNotify.SMELT_ORANGE_EQUIP);
        };
        /**
         * 销毁
         */
        SmeltOrangeView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return SmeltOrangeView;
    }(BaseView));
    game.SmeltOrangeView = SmeltOrangeView;
    __reflect(SmeltOrangeView.prototype, "game.SmeltOrangeView");
    var SmeltOrangeItem = (function (_super) {
        __extends(SmeltOrangeItem, _super);
        function SmeltOrangeItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "SmeltOrangeItemSkin";
            _this.btn_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                App.Socket.send(14015, { id: _this.data.id });
            }, _this);
            return _this;
        }
        SmeltOrangeItem.prototype.dataChanged = function () {
            var itemInfo = App.ConfigManager.getEquipById(this.data.good_id);
            var smeltInfo = App.ConfigManager.getSmeltInfoById(itemInfo.smelt);
            var getInfo = App.ConfigManager.getItemInfoById(smeltInfo.goods_id);
            this.baseItem.updateBaseItem(ClientType.EQUIP, this.data.good_id, null, this.data);
            this.lb_level.text = "装备等级：" + itemInfo.limit_lvl + "级";
            this.lb_get.text = "熔炼后可获得：" + smeltInfo.stone + "个" + getInfo.name;
        };
        return SmeltOrangeItem;
    }(eui.ItemRenderer));
    game.SmeltOrangeItem = SmeltOrangeItem;
    __reflect(SmeltOrangeItem.prototype, "game.SmeltOrangeItem");
})(game || (game = {}));
//# sourceMappingURL=SmeltOrangeView.js.map