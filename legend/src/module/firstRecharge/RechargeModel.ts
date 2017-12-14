/**
 * Author: yangyipeng         （必须加上，知道是谁做的）
 * 充值模块模型 2017/06/20.
 */
module game {
export class RechargeModel extends BaseModel{  
	

    private _rechargeViewData:RechargeVo;

	public constructor() { 
		super();
	}

    public get rechargeViewData():RechargeVo
    {
        return this._rechargeViewData;
    }
    
    /**
     * 常规充值页面数据
     */
    public updateRechargeViewData(data):void
    {   
        var rechargeVo:RechargeVo = new RechargeVo();
        rechargeVo.gold = data.up_gold;
        rechargeVo.vip = data.vip;

        var chargeConfig = ConfigManager.getInstance().getChargeInfo();
        var chargeList:Array<any> = data.list;
        //首冲多少人民币对应奖励元宝
        var chargeArr:Array<any> = [];
        for(var key in chargeConfig)
        {   
            var flag:boolean = true;
            var rmb = chargeConfig[key]["rmb"];
            for(var i:number=0;i<chargeList.length;i++)
            {
                if(rmb == chargeList[i]["rmb"] && chargeList[i]["ext_gold"] != 0)
                {
                    chargeArr.push([chargeConfig[key],true]);//充值可以赠送元宝
                    flag = false
                    break;
                }
            }
            if(flag)
            {
                chargeArr.push([chargeConfig[key],false]);//充值不可以再赠送元宝
            }
        }
        var rechargeDataArr:eui.ArrayCollection = new eui.ArrayCollection(chargeArr);
        rechargeVo.rechargeList = rechargeDataArr;
        this._rechargeViewData = rechargeVo;
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