/**
 * Author: yangyipeng                 （必须加上，知道是谁做的）
 * 幸运转盘模块控制器 2017/06/20.
 */

module game {
export class FortuneController extends BaseController {                       //控制器必须继承BaseController
    private _fortuneModel:FortuneModel;
    public constructor() {
        super();
        this._fortuneModel = FortuneModel.getInstance();
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
        this.registerProtocal(35001, this.handlerFortuneViewData, this);//转盘界面数据
        this.registerProtocal(35002, this.handlerFortunePoolData, this);//转盘元宝池 
        this.registerProtocal(35003, this.handlerFortuneStart, this);//转盘开始转动 
        this.registerProtocal(35004, this.handlerFortuneStop, this);//转盘转动结束 
    }

    /**
     * 转盘界面数据
     */
    private handlerFortuneViewData(data):void
    {   
          // ====转盘界面===
        // message pbDialInterface{
        // 	optional int32 left_time	= 1; // 剩余时间
        // 	optional int32 use_times	= 2; // 已使用次数 
        // }
        this._fortuneModel.fortuneViewData(data);
        if(data.left_time <=0)
        {
            App.EventSystem.dispatchEvent(PanelNotify.REMOVE_TOP_BTN, MainUIBtnType.FORTUNE);
        }else
        {
            this.dispatchEvent(PanelNotify.FORTUNE_VIEW_INFO_UPDATE);
        }
    }

    /**
     * 转盘元宝池
     */
    private handlerFortunePoolData(data):void
    {   
        // message pbDialPool{
        // 	optional int32 gold		= 1;	// 充值数
        // 	optional int32 max_gold	= 2;	// 满值数
        // 	optional string name	= 3;	// 上次幸运玩家名
        // }
        this._fortuneModel.fortunePoolData(data);
        this.dispatchEvent(PanelNotify.FORTUNE_POOL_INFO_UPDATE);
    }

    /**
     * 转盘开始转动
     */
    private handlerFortuneStart(data):void
    {   
        //pbResult	// 成功返回id, 失败错误提示
        // this._fortuneModel.setFortuneResult(data);
        if(data.result)
        {
            this.dispatchEvent(PanelNotify.FORTUNE_WHEEL_START,data.result);
        }
    }

    /**
     * 转盘转动结束
     */
     private handlerFortuneStop(data):void
     {
         this.dispatchEvent(PanelNotify.FORTUNE_WHEEL_STOP,data.gold);
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