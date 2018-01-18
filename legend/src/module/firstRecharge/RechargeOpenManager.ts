module game {
	export class RechargeOpenManager {
		private static _instance: RechargeOpenManager;

		public constructor() {
		}

		public static getInstance(): RechargeOpenManager {
			if (this._instance == null) {
				this._instance = new RechargeOpenManager();
			}
			return this._instance;
		}

		public openRechargeView():void
		{
			var rechargeState:number = RoleManager.getInstance().roleInfo.first_charge; //0未首充 1已充未领奖励 2已领奖励
			switch(rechargeState)
			{
				case 0:
					if(WinManager.getInstance().isOpen(WinName.RECHARGE_FIRST))
					{
						WinManager.getInstance().closeWin(WinName.RECHARGE_FIRST);
					}else {
					 	WinManager.getInstance().openWin(WinName.RECHARGE_FIRST,0);
					}
					break;
				case 1:
					if(WinManager.getInstance().isOpen(WinName.RECHARGE_FIRST))
					{
						WinManager.getInstance().closeWin(WinName.RECHARGE_FIRST);
					}else {
					 	WinManager.getInstance().openWin(WinName.RECHARGE_FIRST,1);
					}
					break;
				case 2:
					if(WinManager.getInstance().isOpen(WinName.RECHARGE))
					{
						WinManager.getInstance().closeWin(WinName.RECHARGE);
					}else {
					 	WinManager.getInstance().openWin(WinName.RECHARGE);
					}
					break;
				default:
					break;
			}
		}
	}
}