/**
 * 主控制器（放游戏相关的
 */
class MainController extends BaseController {
	public globalModel: GlobalModel;
	public sceneController: SceneController;

	private _root: GameRootLay;//游戏根容器

	public constructor() {
		super();
		//初始化所有controller
		this.globalModel = GlobalModel.getInstance();
		this.sceneController = SceneController.getInstance();
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
		game.ArtifactController.getInstance();		//初始化异常协议
		this.registerProtocal(9001, this.handleException, this);
		game.InvestController.getInstance();
		game.RechargeController.getInstance();
		game.FortuneController.getInstance();
		game.LabberHegemonyController.getInstance();
		game.WorldBossController.getInstance();
		game.EncounterController.getInstance();
		game.RankGuanqiaController.getInstance();
		game.PlayerMsgController.getInstance();
	}

	/**
	 * 游戏开始
	 */
	public gameStart(root: GameRootLay) {
		this._root = root;
		App.ConfigManager.initConfig();
		console.log("GAME START");
		window["removeBg"]();
		if (App.agentConfig.OffLineTest) {
			App.WinManager.openWin(WinName.MAIN)
		} else {
			App.WinManager.openWin(WinName.LOGIN);
		}
	}

	/**
	 * 处理异常
	 * @param data 数据
	 */
	public handleException(data: any) {
		switch (data.error_code) {
			case 10001: { //区服角色不存在，去创建
				App.EventSystem.dispatchEvent(PanelNotify.LOGIN_OPEN_MAKE_ROLE);
				break;
			}
			case 16002: { //背包满
				App.EventSystem.dispatchEvent(PanelNotify.HERO_BAG_NOT_ENOUGH);
				return;
				// break;
			}
			case 2: { //金币不足
				App.EventSystem.dispatchEvent(PanelNotify.HERO_COIN_NOT_ENOUGH);
				return;
				// break;
			}
			case 3: { //元宝不足
				App.EventSystem.dispatchEvent(PanelNotify.HERO_MONEY_NOT_ENOUGH);
				return;
				// break;
			}
			case 5: { //网络超时
				//App.Socket.close();
				App.logzsq("SOCKET 网络超时handleException");
				(MainController.getInstance() as MainController).clear();
				App.Socket.reconnect();
				return;
			}
			case 6: { //系统错误
				//App.Socket.close();
				App.logzsq("SOCKET 系统错误handleException");
				(MainController.getInstance() as MainController).clear();
				App.Socket.reconnect();
				return;
			}

			case 15014 : {  //强化转生等级不够
				App.GlobalTips.showTips("强化等级达到上限，请先提升转生等级到"+(App.RoleManager.roleInfo.turn+1)+"转");
				return;
			}
		}
		App.GlobalTips.showErrCodeTips(data.error_code);
	}

	/**
	 * 销毁
	 */
	public destroy() {
		super.destroy();
	}

	/**
	 * 清理
	 */
	public clear() {
		super.clear();
		if (this._root) {
			this._root.clear();
		}
	}
}