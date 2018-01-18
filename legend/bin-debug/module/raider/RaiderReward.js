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
* module : 寻宝模块
* author : zrj
*/
var game;
(function (game) {
    var RaiderRewardView = (function (_super) {
        __extends(RaiderRewardView, _super);
        function RaiderRewardView(data) {
            var _this = _super.call(this, data) || this;
            _this._itemArray = [];
            _this.raiderModel = game.RaiderModel.getInstance();
            _this.skinName = "RaiderRewardSkin";
            return _this;
            // this._data = data;
        }
        RaiderRewardView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            // this.initView();
            this.btn_store.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRaider, this);
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRaider, this);
            this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buyRaider, this);
            var layout = new eui.TileLayout();
            layout.requestedColumnCount = 5;
            layout.requestedRowCount = 4;
            layout.verticalGap = 35;
            layout.horizontalGap = 22;
            layout.paddingLeft = 25;
            layout.horizontalAlign = egret.HorizontalAlign.JUSTIFY;
            this.gp_reward.layout = layout;
            if (this.raiderModel.time == 1) {
                this.lb_cost.text = String(App.ConfigManager.getConstConfigByType("TREASURE_GOLD").value);
                RES.getResAsync("raider_txt_1_png", function (texture) {
                    _this.img_time.source = texture;
                }, this);
                RES.getResAsync("raider_txt_xunbao1ci_png", function (texture) {
                    _this.img_btn_time.source = texture;
                }, this);
            }
            else {
                this.lb_cost.text = String(App.ConfigManager.getConstConfigByType("TREASURE_GOLDS").value);
                RES.getResAsync("raider_txt_10_png", function (texture) {
                    _this.img_time.source = texture;
                }, this);
                RES.getResAsync("raider_txt_xunbao10ci_png", function (texture) {
                    _this.img_btn_time.source = texture;
                }, this);
            }
        };
        RaiderRewardView.prototype.initView = function () {
            // this.commonWin.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeRaider, this);
            this.gp_reward.removeChildren();
            for (var key in this._data) {
                var info = this._data[key];
                var item = new customui.BaseItem();
                item.updateBaseItem(info.good_type, info.good_id, info.num);
                item.setItemNameVisible(true);
                this.gp_reward.addChild(item);
            }
        };
        RaiderRewardView.prototype.closeRaider = function () {
            // PopUpManager.removePopUp(this);
            App.WinManager.closeWin(WinName.POP_RAIDER_REWARD);
        };
        RaiderRewardView.prototype.buyRaider = function () {
            if (this.raiderModel.time == 1) {
                App.Socket.send(26003, {});
            }
            else {
                App.Socket.send(26004, {});
            }
        };
        /**
         * 打开窗口
         */
        RaiderRewardView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            this._data = openParam.data;
            this.initView();
        };
        /**
         * 关闭窗口
         */
        RaiderRewardView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        RaiderRewardView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
        };
        /**
         * 销毁
         */
        RaiderRewardView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return RaiderRewardView;
    }(BaseView));
    game.RaiderRewardView = RaiderRewardView;
    __reflect(RaiderRewardView.prototype, "game.RaiderRewardView");
})(game || (game = {}));
//# sourceMappingURL=RaiderReward.js.map