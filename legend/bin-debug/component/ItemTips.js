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
 * module : 道具提示弹窗
 * author : lyg
*/
var game;
(function (game) {
    var ItemTips = (function (_super) {
        __extends(ItemTips, _super);
        function ItemTips(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._updateHandle = 0; //更新界面
            return _this;
        }
        ItemTips.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
        };
        ItemTips.prototype.initView = function () {
            var _this = this;
            this.btn_use.labelDisplay.textColor = 0xe4cea9;
            this.btn_sell.labelDisplay.textColor = 0xe4cea9;
            this.btn_goto.labelDisplay.textColor = 0xe4cea9;
            this.btn_use.labelDisplay.size = 24;
            this.btn_sell.labelDisplay.size = 24;
            this.btn_goto.labelDisplay.size = 24;
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);
            this.btn_use.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.Socket.send(14003, { id: _this._uuid, num: 1 });
            }, this);
            this.btn_sell.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.Socket.send(14004, { id: _this._uuid, num: 1 });
            }, this);
            this.btn_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                var info = App.ConfigManager.getItemInfoById(_this._id);
                MainModuleJump.jumpToModule(info.open);
                _this.closeWin();
            }, this);
            var info = App.ConfigManager.itemConfig()[this._id];
            this.lb_name.text = info.name;
            this.lb_desc.text = info.des;
            this.lb_way.textFlow = [{ text: "获取途径：" }, { text: info.out_path }];
            this.lb_sell.textFlow = [{ text: "出售价格：" + info.sale }];
            this.baseItem.updateBaseItem(1, this._id);
            if (this._id == 101 || this._id == 102 || this._id == 100) {
                if (this._id == 101) {
                    var coin = RoleManager.getInstance().roleWealthInfo.coin;
                    this.lb_num.textFlow = [{ text: "拥有数量：" }, { text: String(coin) }];
                }
                else if (this._id == 102) {
                    var gold = RoleManager.getInstance().roleWealthInfo.gold;
                    this.lb_num.textFlow = [{ text: "拥有数量：" }, { text: String(gold) }];
                }
                else if (this._id == 100) {
                    var exp = RoleManager.getInstance().roleInfo.exp;
                    this.lb_num.textFlow = [{ text: "拥有数量：" }, { text: String(exp) }];
                }
            }
            else {
                var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, this._id, this._uuid);
                this.lb_num.textFlow = [{ text: "拥有数量：" }, { text: itemInfo ? String(itemInfo.num) : "0" }];
            }
            if (info.type == 0) {
                this.btn_use.visible = false;
            }
            else if (info.type == 1 || info.type == 2) {
                this.btn_goto.visible = false;
            }
            if (!this._uuid) {
                this.btn_sell.visible = false;
                this.btn_use.visible = false;
                this.btn_goto.visible = false;
                // this.x += 75;
            }
        };
        ItemTips.prototype.updateView = function () {
            var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, this._id, this._uuid);
            this.lb_num.textFlow = [{ text: "拥有数量：" }, { text: itemInfo ? String(itemInfo.num) : "0" }];
            if (!itemInfo) {
                this.closeWin();
            }
        };
        /**
         * 打开窗口
         */
        ItemTips.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._id = openParam.id;
            this._uuid = openParam.uuid;
            if (this._updateHandle == 0 && this._uuid) {
                this._updateHandle = App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_BAG_UPDATE, this.updateView, this);
            }
            this.initView();
        };
        /**
         * 关闭窗口
         */
        ItemTips.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 清理
         */
        ItemTips.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._updateHandle != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_BAG_UPDATE, this._updateHandle);
                this._updateHandle = 0;
            }
        };
        /**
         * 销毁
         */
        ItemTips.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return ItemTips;
    }(BaseView));
    game.ItemTips = ItemTips;
    __reflect(ItemTips.prototype, "game.ItemTips");
})(game || (game = {}));
//# sourceMappingURL=ItemTips.js.map