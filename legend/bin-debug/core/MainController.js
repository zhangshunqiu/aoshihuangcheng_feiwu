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
 * 主控制器（放游戏相关的
 */
var MainController = (function (_super) {
    __extends(MainController, _super);
    function MainController() {
        var _this = _super.call(this) || this;
        //初始化所有controller
        _this.globalModel = GlobalModel.getInstance();
        _this.sceneController = SceneController.getInstance();
        game.LoginController.getInstance();
        game.MainUIController.getInstance();
        game.HeroController.getInstance();
        game.EquipController.getInstance();
        game.BackpackController.getInstance();
        game.SmeltController.getInstance();
        game.ForgeController.getInstance();
        game.ShopController.getInstance();
        game.ChatController.getInstance();
        game.JewelController.getInstance();
        game.BossController.getInstance();
        game.WingController.getInstance();
        game.SynthesisController.getInstance();
        game.RebornController.getInstance();
        game.MustDoController.getInstance();
        game.MailController.getInstance();
        game.VipController.getInstance();
        game.SignController.getInstance();
        game.WelfareController.getInstance();
        game.RaiderController.getInstance();
        game.RankController.getInstance();
        game.MonthCardController.getInstance();
        game.ActivityController.getInstance();
        game.CopyController.getInstance();
        game.ArtifactController.getInstance(); //初始化异常协议
        _this.registerProtocal(9001, _this.handleException, _this);
        game.InvestController.getInstance();
        game.RechargeController.getInstance();
        game.FortuneController.getInstance();
        game.LabberHegemonyController.getInstance();
        game.WorldBossController.getInstance();
        game.EncounterController.getInstance();
        game.RankGuanqiaController.getInstance();
        game.PlayerMsgController.getInstance();
        return _this;
    }
    /**
     * 游戏开始
     */
    MainController.prototype.gameStart = function (root) {
        this._root = root;
        App.ConfigManager.initConfig();
        console.log("GAME START");
        window["removeBg"]();
        if (App.agentConfig.OffLineTest) {
            App.WinManager.openWin(WinName.MAIN);
        }
        else {
            App.WinManager.openWin(WinName.LOGIN);
        }
    };
    /**
     * 处理异常
     * @param data 数据
     */
    MainController.prototype.handleException = function (data) {
        switch (data.error_code) {
            case 10001: {
                App.EventSystem.dispatchEvent(PanelNotify.LOGIN_OPEN_MAKE_ROLE);
                break;
            }
            case 16002: {
                App.EventSystem.dispatchEvent(PanelNotify.HERO_BAG_NOT_ENOUGH);
                return;
                // break;
            }
            case 2: {
                App.EventSystem.dispatchEvent(PanelNotify.HERO_COIN_NOT_ENOUGH);
                return;
                // break;
            }
            case 3: {
                App.EventSystem.dispatchEvent(PanelNotify.HERO_MONEY_NOT_ENOUGH);
                return;
                // break;
            }
            case 5: {
                //App.Socket.close();
                App.logzsq("SOCKET 网络超时handleException");
                MainController.getInstance().clear();
                App.Socket.reconnect();
                return;
            }
            case 6: {
                //App.Socket.close();
                App.logzsq("SOCKET 系统错误handleException");
                MainController.getInstance().clear();
                App.Socket.reconnect();
                return;
            }
            case 15014: {
                App.GlobalTips.showTips("强化等级达到上限，请先提升转生等级到" + (App.RoleManager.roleInfo.turn + 1) + "转");
                return;
            }
        }
        App.GlobalTips.showErrCodeTips(data.error_code);
    };
    /**
     * 销毁
     */
    MainController.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    /**
     * 清理
     */
    MainController.prototype.clear = function () {
        _super.prototype.clear.call(this);
        if (this._root) {
            this._root.clear();
        }
    };
    return MainController;
}(BaseController));
__reflect(MainController.prototype, "MainController");
//# sourceMappingURL=MainController.js.map