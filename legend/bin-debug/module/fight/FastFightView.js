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
 * module : 快速战斗提示框
 * author : zrj
*/
var game;
(function (game) {
    var FastFightView = (function (_super) {
        __extends(FastFightView, _super);
        function FastFightView(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this.skinName = "FastFightSkin";
            return _this;
            // this.readyOpenWin();
        }
        FastFightView.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
            this.validateNow();
            App.Socket.send(13009, {});
        };
        FastFightView.prototype.initView = function () {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                // PopUpManager.removePopUp(this);
                App.WinManager.closeWin(WinName.POP_FAST_FIGHT);
            }, this);
            this.img_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                var okCB = function (selected) {
                    console.log("okkkk", selected);
                    App.Socket.send(13010, {});
                    // PopUpManager.removePopUp(this);
                    App.WinManager.closeWin(WinName.POP_FAST_FIGHT);
                };
                var cancelCB = function () {
                    console.log("cancellll");
                };
                var textFlow = [{ text: "你将获得" }, { text: "30", style: { textColor: 0x00f828 } }, { text: "分钟的收益，确定进行快速战斗？" }];
                App.GlobalTips.showAlert({ style: 0 /* COMMON */, textFlow: textFlow, okCB: okCB, cancelCB: cancelCB, context: this, needCheckBox: false });
                // PopUpManager.removePopUp(this);
                App.WinManager.closeWin(WinName.POP_FAST_FIGHT);
            }, this);
            this.lb_cost.text = App.ConfigManager.getConstConfigByType("HOOK_RAID_ICON").value;
            this.lb_time.textFlow = [{ text: "当天剩余次数" }, { text: "1次", style: { textColor: 0x00f828 } }];
        };
        FastFightView.prototype.updateView = function () {
            var vipInfo = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv);
            var constTime = App.ConfigManager.getConstConfigByType("HOOK_RAID_TIMES").value;
            this.lb_content.textFlow = [{ text: "可获得" }, { text: "30", style: { textColor: 0x00f828 } }, { text: "分钟野外挂机收益\n每天可免费快速战斗" },
                { text: String(App.ConfigManager.getConstConfigByType("QUICK_COMBAT").value), style: { textColor: 0x00f828 } }, { text: "次\n5分钟内" }, { text: "伤害倍率+20%\n", style: { textColor: 0x00f828 } }, { text: "每天凌晨4点重置次数\n" },
                { text: "每天有" }, { text: constTime + "次快速战斗次数" }, { text: "(当前VIP等级加成" + vipInfo.quick_fight + "次)", style: { textColor: 0x00f828 } }];
            this.lb_time.textFlow = [{ text: "当天剩余次数" }, { text: game.MainUIModel.getInstance().fastFightTime + "次", style: { textColor: 0x00f828 } }];
            if (constTime + vipInfo.quick_fight == game.MainUIModel.getInstance().fastFightTime) {
                this.img_cost.visible = false;
                this.lb_cost.visible = false;
            }
            else {
                this.img_cost.visible = true;
                this.lb_cost.visible = true;
            }
        };
        /**
         * 打开窗口
         */
        FastFightView.prototype.openWin = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.openWin.call(this, openParam);
            App.EventSystem.addEventListener(PanelNotify.PLAYER_FASTFIGHT_INFO, this.updateView, this);
        };
        /**
         * 关闭窗口
         */
        FastFightView.prototype.closeWin = function (callback) {
            _super.prototype.closeWin.call(this, callback);
        };
        /**
         * 清理
         */
        FastFightView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this);
            App.EventSystem.removeEventListener(PanelNotify.PLAYER_FASTFIGHT_INFO);
        };
        /**
         * 销毁
         */
        FastFightView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return FastFightView;
    }(BaseView));
    game.FastFightView = FastFightView;
    __reflect(FastFightView.prototype, "game.FastFightView");
})(game || (game = {}));
//# sourceMappingURL=FastFightView.js.map