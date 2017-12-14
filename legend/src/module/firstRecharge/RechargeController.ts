/**
 * Author: yangyipeng                 （必须加上，知道是谁做的）
 * 充值模块控制器 2017/06/20.
 */

module game {
export class RechargeController extends BaseController {                       //控制器必须继承BaseController
    private _rechargeModel:RechargeModel;
    public constructor() {
        super();
        this._rechargeModel = RechargeModel.getInstance();
        this.initProtocol();
		this.initEventListener();
    }

    /**
     * 初始化事件监听                                           
     */
    protected initEventListener() {
        super.initEventListener();
    }


    /**
     * 初始化协议
     */
    protected initProtocol() {
        super.initProtocol();
        this.registerProtocal(28001, this.handlerFirstRecharge, this);//领取首充奖励 成功返回1 失败错误提示 
        this.registerProtocal(28002, this.handlerRechargeViewData, this);//常规充值界面 (vip等级 再充x元宝升级vip  充值列表)
        this.registerProtocal(28003, this.handlerFirstRechargeState, this);//获取首充状态  0未首充 1已充未领奖励 2已领奖励
    }

    /**
     * 领取首充奖励 成功返回1 失败错误提示
     */
    private handlerFirstRecharge(data):void
    {   
        if(data.result)
        {
            App.Socket.send(28003,{});
            if(WinManager.getInstance().isOpen(WinName.RECHARGE_FIRST))
            {
                WinManager.getInstance().closeWin(WinName.RECHARGE_FIRST);
            }
        }
    }

    /**
     * 常规充值界面
     */
    private handlerRechargeViewData(data):void
    {
        this._rechargeModel.updateRechargeViewData(data);
        this.dispatchEvent(PanelNotify.RECHARGE_INFO_UPDATE);
    }

    /**
     * 获取首充状态
     */
    private handlerFirstRechargeState(data):void
    {
        RoleManager.getInstance().roleInfo.first_charge = data.result;//0未首充 1已充未领奖励 2已领奖励
        if(data.result == 2)
        {
            App.EventSystem.dispatchEvent(PanelNotify.REMOVE_TOP_BTN, MainUIBtnType.FIRSTCHARGE);
        }
    }

	/**
	 * 清理
	 */
    public clear() {
        super.clear();
       
    }

    /**
     * 销毁
     */
    public destroy() {
        super.destroy();
        //销毁处理
    }

}
}