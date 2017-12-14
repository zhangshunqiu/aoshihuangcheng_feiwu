/**
 * Author: yangyipeng         （必须加上，知道是谁做的）
 * 幸运转盘模块模型 2017/06/20.
 */
module game {
export class FortuneModel extends BaseModel{  
	
    private _leftTime:number;
    private _useTimes:number;
    private _gold:number;
    private _maxGold:number;
    private _name:string;

    // private _result:number;
    public get leftTime():number
    {
        return this._leftTime;
    }
    public get useTimes():number
    {
        return this._useTimes;
    }
    public get gold():number
    {
        return this._gold;
    }
    public get maxGold():number
    {
        return this._maxGold;
    }
    public get name():string
    {
        return this._name;
    }
    public set leftTime(time:number)
    {
        this._leftTime = time;
    }
	public constructor() { 
		super();
	}

    public fortuneViewData(data):void
    {
        this._leftTime = data.left_time;
        this._useTimes = data.use_times;
    }

    public fortunePoolData(data):void
    {
        // 	optional int32 gold		= 1;	// 充值数
        // 	optional int32 max_gold	= 2;	// 满值数
        // 	optional string name	= 3;	// 上次幸运玩家名
        this._gold = data.gold;
        this._maxGold = data.max_gold;
        this._name = data.name;
    }

    // public setFortuneResult(data):void
    // {   
    //     if(data){
    //         this._result = data;
    //     }
    // }

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