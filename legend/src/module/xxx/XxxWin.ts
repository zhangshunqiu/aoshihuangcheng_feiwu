/**
 * Author: zhangshunqiu                                      （必须加上，知道是谁做的）
 * Xxx模块视图窗口 2017/06/20.
 */
class XxxWin extends BaseView {
	private _xxxModel:XxxModel = XxxModel.getInstance();
    private _xxxController: XxxController = XxxController.getInstance();

	private _eventId:number = 0;

	private _time1Id:number = 0;
	private _time2Id:number = 0;

	private _buttn1:IconButton = new IconButton({});
	private _buttn2:IconButton = new IconButton({});
	private _view1:XxxView1;
	private _view2:XxxView2;
	private _curSelView:BaseChildView;
	private _curSelIndex:number = 0;

	private _effMc:AMovieClip;//动画
	public constructor(viewConf:WinManagerVO = null) {
        super(viewConf);

		//窗口使用示范
		//1.去WinManager配置窗口名称和对应的WinManagerVO
		//2.打开窗口
		App.WinManager.openWin(WinName.BACKPACK);
		//3.关闭窗口
		App.WinManager.closeWin(this.winVo.winName);

		//计时器使用
		//1.每帧执行
		if (this._time1Id == 0){
			this._time1Id = App.GlobalTimer.addFrameSchedule(this.onTimeHandler,this);
		}
		//2.时间执行执行 1000 是一秒  0是无限次，也可以填次数
		if (this._time2Id == 0){
			App.GlobalTimer.addSchedule(1000,0,this.onTimeHandler2,this);
		}
		//3.清理
		if (this._time1Id != 0){
			App.GlobalTimer.remove(this._time1Id);
			this._time1Id = 0;
		}
		if (this._time2Id != 0){
			App.GlobalTimer.remove(this._time2Id);
			this._time2Id = 0;
		}



		//配置都在ConfigManager
		//获取配置使用,不能拿所有的配置再来处理，只能拿在ConfigManager中处理好的配置
		var confData:any = App.ConfigManager.getSceneConfigById(100);

		//常量和枚举定义在 GlobalConst.ts中
		//类型必须定义常量，不能写if(a==1)这样的

		//事件定义在GlobalEvent.ts中

		//通用函数放到GlobalUtil
		//如 GlobalUtil.getInfoByTypeId(11,22)
		

		//通过地址加载的地址必须放到 ResUrlUtil中
		//如：ResUrlUtil.getLogoUrl();

		//所有的数据结构都要定义VO；

		 this._buttn1.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                        this.updateView(1);
                }, this);
		 this._buttn2.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                        this.updateView(2);
                }, this);
    }

	private updateView(index:number):void{
		if(this._curSelIndex == index){
			return;
		}
		if(this._curSelView){
			this._curSelView.clear();
		} 
		if(index == 1){
			if(this._view1 == null){
				this._view1 = new XxxView1("skinName1")
			}
			this._view1.readyOpen({data:{}});
			this._curSelView = this._view1;
		}else if(index == 2){
			if(this._view2== null){
				this._view2 = new XxxView2("skinName2")
			}
			this._view2.readyOpen({data:{}});
			this._curSelView = this._view2;
		}
	}


	/**
	 * 事件监听函数2
	 */
	private onTimeHandler2(){
		//处理事件
	}

	/**
	 * 事件监听函数
	 */
	private onTimeHandler(data:number):boolean{
		//处理事件

		return true;
	}

	/**
	 * 创建皮肤（初始化调用一次）
	 */
	public childrenCreated() {
        super.childrenCreated();
		//帧动画播放演示
		if(this._effMc == null){
			this._effMc = new AMovieClip();
			this.addChild(this._effMc);
		}
		//播放动画，其中-1表示无限次
		this._effMc.playMCKey("动画Id","",-1);
		//播放一次
		this._effMc.playMCKey("动画Id","",1);
		//停止
		this._effMc.stop();

		//在destory里面销毁 
		// this._effMc.destroy();
		// this.removeChild(this._effMc);
		// this._effMc = null;
		

	}

	/**
	 * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
	 */
	public openWin(openParam: any = null): void {
		super.openWin(openParam);
		//事件监听示范
		if(this._eventId == 0){
			this._eventId = App.EventSystem.addEventListener("事件名称",this.onHandler,this);
		}
		//事件派发示范
		App.EventSystem.dispatchEvent("事件名称",{})


		//协议发送示范
        //App.Socket.send(10000,{});

		if(this._effMc){
			this._effMc.playMCKey("动画Id","",1);
		}

		this.updateView(1);
	}

	/**
	 * 事件监听函数
	 */
	private onHandler(data:any){
		//处理事件
	}

	/**
	 * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
	 */
	public clear(data: any = null): void {
		super.clear(data);

		//事件清理示范
		if(this._eventId != 0){
			App.EventSystem.removeEventListener("事件名称",this._eventId);
			this._eventId = 0;
		}
		if(this._effMc){
			this._effMc.destroy();
		}

		if(this._curSelView){
			this._curSelView.clear();
		}
		this._curSelIndex = 0;
	}
	/**
	 * 销毁
	 */
	public destroy(): void {
		super.destroy();
		if(this._effMc){
			this._effMc.destroy();
			this.removeChild(this._effMc);
			this._effMc = null;
		}

		if(this._view1){
			this._view1.destroy();
		}
		if(this._view2){
			this._view2.destroy();
		}
		this._curSelView = null;
	}


}