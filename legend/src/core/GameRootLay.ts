/**
  * 游戏容器类
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  * EgerPro显示对象层级
  * Main-GameScene（sceneLayer、mainLayer、popLayer、effectLayer、maskLayer、loadLayer）
  * 
  */
class GameRootLay extends eui.UILayer {
    private _eventSystem:EventSystem;//事件系统

    // 场景层 如 战场、主城、副本战场之类的
    public _sceneLay: GameScene = new GameScene();//GameScene
    //public _sceneLay: eui.UILayer = new eui.UILayer();//GameScene
    private _sceneLoading:SceneLoading;//
    //加载中光圈
    private _loadingMc:LoginLoading;//
    //场景UI层,如当前场景的统计信息
    public _sceneUILay:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    // 主UI层 如
    public _mainUILay: eui.UILayer = new eui.UILayer();
    // 模块层 如 设置、背包、装备之类的，模块里的小型view加在模块UI里，是弹窗话，就用通用弹窗管理弹出
    public _moduleLay: eui.UILayer = new eui.UILayer();
    //底部功能栏
    public _bottomLay: eui.UILayer = new eui.UILayer();
    // 通用弹窗专用层
    public _panelLay: eui.UILayer = new eui.UILayer();
    // 特效层 如 闪烁、飘字之类的
    public _effectLay: eui.UILayer = new eui.UILayer();
    // 通讯遮罩层 和服务器通讯UI
    public _maskLay: eui.UILayer = new eui.UILayer();
    // 加载遮罩层 场景切换的时候加载资源UI
    public _loadLay: eui.UILayer = new eui.UILayer();
     // 引导层
    public _guideLay: eui.UILayer = new eui.UILayer();

    private _sockConnectEventId:number = 0;
    private _sockReConnectEventId:number = 0;
    private _sockStartConnectEventId:number = 0;

    private _WinKeyLayDic:Object = {
        [WinLay.SCENE_LAY]: this._sceneLay,//场景层
        [WinLay.SCENE_UI_LAY]:this._sceneUILay,//场景UI层
        [WinLay.MAIN_UI_LAY]:this._mainUILay,//主UI层
        [WinLay.MODULE_LAY]:this._moduleLay,//模块View UI层
        [WinLay.BOTTOM_LAY]:this._bottomLay,
        [WinLay.PANEL_LAY]:this._panelLay,//
        [WinLay.EFFECT_LAY]:this._effectLay,//
        [WinLay.MASK_LAY]:this._maskLay,//
        [WinLay.LOAD_LAY]:this._loadLay,//
        [WinLay.GUIDE_LAY]:this._guideLay,//
    };
    private static _instance: GameRootLay;


    //构造方法
    public constructor() {
        super();
        GameRootLay._instance = this;
        this._eventSystem = EventSystem.getInstance();
        this.touchThrough = true;
        //this._sceneLay.touchThrough = true;
        //this._sceneUILay.touchThrough = true;
        // this._mainUILay.touchThrough = true;
        // this._bottomLay.touchThrough = true;
        // this._moduleLay.touchThrough = true;
        // this._panelLay.touchThrough = true;
        // this._effectLay.touchThrough = true;
        // this._maskLay.touchThrough = true;
        // this._loadLay.touchThrough = true;
        this._guideLay.touchThrough = true;
        this._mainUILay.touchEnabled = false;
        this._bottomLay.touchEnabled = false;
        this._moduleLay.touchEnabled = false;
        this._panelLay.touchEnabled = false;
        this._effectLay.touchEnabled = false;
        this._maskLay.touchEnabled = false;
        this._loadLay.touchEnabled = false;
        this._guideLay.touchEnabled = false;
        this.addChild(this._sceneLay);
        this.addChild(this._sceneUILay);
        this.addChild(this._mainUILay);
        this.addChild(this._moduleLay);
        this.addChild(this._bottomLay);
        this.addChild(this._panelLay);
        this.addChild(this._effectLay);
        this.addChild(this._maskLay);
        this.addChild(this._loadLay);
        this.addChild(this._guideLay);

        if(this._sceneLoading == null){
			this._sceneLoading = new SceneLoading();
			this.addChild(this._sceneLoading);
		}
        this._sceneLay.sceneLoading = this._sceneLoading;
        this._sceneLoading.visible = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageView, this);
        this._eventSystem.addEventListener(WinManagerEvent.WIN_ADD,this.addWinToScene,this)
		this._eventSystem.addEventListener(WinManagerEvent.WIN_REMOVE,this.removeWinToScene,this)
        this._eventSystem.addEventListener(GameEvent.SHOW_LOADING,this.onShowLoading,this)

        if(this._sockConnectEventId == 0){
            this._sockConnectEventId = this._eventSystem.addEventListener(SocketConst.SOCKET_CONNECT,this.closeLoading,this);
        }
        if(this._sockReConnectEventId == 0){
            this._sockReConnectEventId = this._eventSystem.addEventListener(SocketConst.SOCKET_RECONNECT,this.closeLoading,this);
        }
        if(this._sockStartConnectEventId == 0){
            this._sockStartConnectEventId = this._eventSystem.addEventListener(SocketConst.SOCKET_START_RECONNECT,this.showLoading,this);
        }
        
        this.init();
        this._sceneLay.y = 64;
        this._sceneLay.x = 0;


       // this.addChild(new SceneRocker(this._sceneLay));


        // let bg = new egret.Sprite();
        // bg.graphics.clear();
        // bg.graphics.beginFill(0x000000, 0.2);
        // bg.graphics.drawRect(0, 0, SceneModel.getInstance().sceneStageW, SceneModel.getInstance().sceneStageH);
        // bg.graphics.endFill();
        // this.addChild(bg);
        // bg.x = 0;
        // bg.y = 64;
    }

    //游戏容器管理器单例（要删除）
    public static gameLayer(): GameRootLay {
        if (!this._instance)
            this._instance = new GameRootLay();
        return this._instance;
    }
    /**
     * 添加到舞台
     */
    private onAddToStageView() {
       
    }

    /**
	 * 添加窗口视图到场景
	 */
	private addWinToScene(event:WinManagerEvent) {
		let vo:WinManagerVO = event.vo;
		let view:egret.DisplayObject = event.view as egret.DisplayObject;
        let parent:egret.DisplayObjectContainer = this._WinKeyLayDic[vo.layer];
        if(parent == null){
            parent = this._moduleLay;
        }
        if(parent.contains(view)){

        }else{
            parent.addChild(view);
        }
	}

	/**
	 * 从场景移除窗口视图
	 */
	private removeWinToScene(event:WinManagerEvent) {
		let vo:WinManagerVO = event.vo;
		let view:egret.DisplayObject = event.view;
        let parent:egret.DisplayObjectContainer = this._WinKeyLayDic[vo.layer];
        if(parent == null){
            parent = this._moduleLay;
        }
        if(parent.contains(view)){
            parent.removeChild(view);
        }
	}

    //初始化游戏根容器
    public init(): void {
        
    }

    /**
	 * 打开
	 */
	public open() {
		
	}
	/**
	 * 清理
	 * 
	 */
	public clear() {
		this.closeLoading();
        if(this._sceneLay){
            this._sceneLay.clear();
        }
	}
	/**
	 * 清理
	 */
	public destroy() {
        this._eventSystem.removeEventListener(WinManagerEvent.WIN_ADD);
		this._eventSystem.removeEventListener(WinManagerEvent.WIN_REMOVE);
        this._eventSystem.removeEventListener(GameEvent.SHOW_LOADING);

        if(this._sockConnectEventId != 0){
              this._eventSystem.removeEventListener(SocketConst.SOCKET_CONNECT,this._sockConnectEventId);
              this._sockConnectEventId = 0;
        }
        if(this._sockReConnectEventId != 0){
              this._eventSystem.removeEventListener(SocketConst.SOCKET_RECONNECT,this._sockReConnectEventId);
              this._sockReConnectEventId = 0;
        }
        if(this._sockStartConnectEventId != 0){
              this._eventSystem.removeEventListener(SocketConst.SOCKET_START_RECONNECT,this._sockStartConnectEventId);
              this._sockStartConnectEventId = 0;
        }
        this.closeLoading();
	}

    /**
     * 触摸层
     */
    public makeTouchLayer(cb, context) {
        // 点击屏幕继续
        let touchLayer = new eui.Group();
        touchLayer.percentWidth = 100;
        touchLayer.percentHeight = 100;
        this._effectLay.addChild(touchLayer);
        let lb_tips = new eui.Label();
        lb_tips.text = "点击屏幕继续";
        lb_tips.horizontalCenter = 0;
        lb_tips.bottom = 100;
        touchLayer.addChild(lb_tips);
        touchLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this._effectLay.removeChild(touchLayer);
            if (cb) {
                cb.call(context);
            }
        }, this);
    }

    public setTouch(enable) {
        this._loadLay.touchThrough = enable;
    }

    public onShowLoading(data:any):void{
        if(data){
            this.showLoading();
        }else{
            this.closeLoading();
        }
    }

    /**
     * 显示加载中（圈圈在转)
     */
    private showLoading() {
        if(this._loadingMc == null){
            this._loadingMc = new LoginLoading();
            this.addChild(this._loadingMc);
        }
    }
    /**
     * 隐藏加载中
     */
    private closeLoading() {
         egret.setTimeout(()=>{
                if(this._loadingMc){
                    this._loadingMc.destroy();
                    if(this._loadingMc.parent){
                        this._loadingMc.parent.removeChild(this._loadingMc);
                    }
                    this._loadingMc = null;
                }
            }, this, 400)
    }
}