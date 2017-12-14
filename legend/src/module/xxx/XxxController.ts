/**
 * Author: zhangshunqiu                                      （必须加上，知道是谁做的）
 * Xxx模块控制器 2017/06/20.
 */

//使用方法
//XxxController必须在	MainController里初始化
//如 XxxController.getInstance();
class XxxController extends BaseController {                       //控制器必须继承BaseController
    private _xxxModel:XxxModel;
    private _broadEventId:number = 0;
    private _broadEventName:string = "zzz";
    public constructor() {
        super();
        this._xxxModel = XxxModel.getInstance();
        this.initProtocol();
		this.initEventListener();
    }

    /**
     * 初始化事件监听                                           
     */
    protected initEventListener() {
        super.initEventListener();
        if(this._broadEventId == 0){
           // this._broadEventId = this.addEventListener(PanelNotify.BROADCAST_PLAY,this.onBroadCastPlay,this);
        }
    }

    /**
     * 接收的派发事件
     */
    private onBroadCastPlay() {
        //处理相应事件
    }

    /**
     * 初始化协议
     */
    protected initProtocol() {
        super.initProtocol();
        //协议监听示范 ,唯一，只能再一个地方监听
        //this.registerProtocal(150214, this.handlerWingInfo, this);
        //协议发送示范
        //this.sendProtocal(1000,{})
    }

    /**
     * 翅膀信息返回
     * @param data any 返回数据
     */
    private handlerWingInfo(data) {
        //处理协议相关功能
        var info:any = data;
        //派发事件
        this.dispatchEvent(PanelNotify.WING_INFO_UPDATE,info);
    }



	/**
	 * 清理
	 */
    public clear() {
        super.clear();
        //清理处理
        if(this._broadEventId != 0){
            //this.removeEventListener(PanelNotify.BROADCAST_PLAY,this._broadEventId);
            this._broadEventId = 0;
        }
    }

    /**
     * 销毁
     */
    public destroy() {
        super.destroy();
        //销毁处理
    }

}