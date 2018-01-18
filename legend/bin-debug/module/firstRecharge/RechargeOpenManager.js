var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var RechargeOpenManager = (function () {
        function RechargeOpenManager() {
        }
        RechargeOpenManager.getInstance = function () {
            if (this._instance == null) {
                this._instance = new RechargeOpenManager();
            }
            return this._instance;
        };
        RechargeOpenManager.prototype.openRechargeView = function () {
            var rechargeState = RoleManager.getInstance().roleInfo.first_charge; //0未首充 1已充未领奖励 2已领奖励
            switch (rechargeState) {
                case 0:
                    if (WinManager.getInstance().isOpen(WinName.RECHARGE_FIRST)) {
                        WinManager.getInstance().closeWin(WinName.RECHARGE_FIRST);
                    }
                    else {
                        WinManager.getInstance().openWin(WinName.RECHARGE_FIRST, 0);
                    }
                    break;
                case 1:
                    if (WinManager.getInstance().isOpen(WinName.RECHARGE_FIRST)) {
                        WinManager.getInstance().closeWin(WinName.RECHARGE_FIRST);
                    }
                    else {
                        WinManager.getInstance().openWin(WinName.RECHARGE_FIRST, 1);
                    }
                    break;
                case 2:
                    if (WinManager.getInstance().isOpen(WinName.RECHARGE)) {
                        WinManager.getInstance().closeWin(WinName.RECHARGE);
                    }
                    else {
                        WinManager.getInstance().openWin(WinName.RECHARGE);
                    }
                    break;
                default:
                    break;
            }
        };
        return RechargeOpenManager;
    }());
    game.RechargeOpenManager = RechargeOpenManager;
    __reflect(RechargeOpenManager.prototype, "game.RechargeOpenManager");
})(game || (game = {}));
//# sourceMappingURL=RechargeOpenManager.js.map