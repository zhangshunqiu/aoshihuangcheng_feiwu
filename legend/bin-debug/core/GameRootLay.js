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
  * 游戏容器类
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved.
  * EgerPro显示对象层级
  * Main-GameScene（sceneLayer、mainLayer、popLayer、effectLayer、maskLayer、loadLayer）
  *
  */
var GameRootLay = (function (_super) {
    __extends(GameRootLay, _super);
    //构造方法
    function GameRootLay() {
        var _this = _super.call(this) || this;
        // 场景层 如 战场、主城、副本战场之类的
        _this._sceneLay = new GameScene(); //GameScene
        //场景UI层,如当前场景的统计信息
        _this._sceneUILay = new egret.DisplayObjectContainer();
        // 主UI层 如
        _this._mainUILay = new eui.UILayer();
        // 模块层 如 设置、背包、装备之类的，模块里的小型view加在模块UI里，是弹窗话，就用通用弹窗管理弹出
        _this._moduleLay = new eui.UILayer();
        //底部功能栏
        _this._bottomLay = new eui.UILayer();
        // 通用弹窗专用层
        _this._panelLay = new eui.UILayer();
        // 特效层 如 闪烁、飘字之类的
        _this._effectLay = new eui.UILayer();
        // 通讯遮罩层 和服务器通讯UI
        _this._maskLay = new eui.UILayer();
        // 加载遮罩层 场景切换的时候加载资源UI
        _this._loadLay = new eui.UILayer();
        // 引导层
        _this._guideLay = new eui.UILayer();
        _this._sockConnectEventId = 0;
        _this._sockReConnectEventId = 0;
        _this._sockStartConnectEventId = 0;
        _this._WinKeyLayDic = (_a = {},
            _a[WinLay.SCENE_LAY] = _this._sceneLay,
            _a[WinLay.SCENE_UI_LAY] = _this._sceneUILay,
            _a[WinLay.MAIN_UI_LAY] = _this._mainUILay,
            _a[WinLay.MODULE_LAY] = _this._moduleLay,
            _a[WinLay.BOTTOM_LAY] = _this._bottomLay,
            _a[WinLay.PANEL_LAY] = _this._panelLay,
            _a[WinLay.EFFECT_LAY] = _this._effectLay,
            _a[WinLay.MASK_LAY] = _this._maskLay,
            _a[WinLay.LOAD_LAY] = _this._loadLay,
            _a[WinLay.GUIDE_LAY] = _this._guideLay,
            _a);
        GameRootLay._instance = _this;
        _this._eventSystem = EventSystem.getInstance();
        _this.touchThrough = true;
        //this._sceneLay.touchThrough = true;
        //this._sceneUILay.touchThrough = true;
        // this._mainUILay.touchThrough = true;
        // this._bottomLay.touchThrough = true;
        // this._moduleLay.touchThrough = true;
        // this._panelLay.touchThrough = true;
        // this._effectLay.touchThrough = true;
        // this._maskLay.touchThrough = true;
        // this._loadLay.touchThrough = true;
        _this._guideLay.touchThrough = true;
        _this._mainUILay.touchEnabled = false;
        _this._bottomLay.touchEnabled = false;
        _this._moduleLay.touchEnabled = false;
        _this._panelLay.touchEnabled = false;
        _this._effectLay.touchEnabled = false;
        _this._maskLay.touchEnabled = false;
        _this._loadLay.touchEnabled = false;
        _this._guideLay.touchEnabled = false;
        _this.addChild(_this._sceneLay);
        _this.addChild(_this._sceneUILay);
        _this.addChild(_this._mainUILay);
        _this.addChild(_this._moduleLay);
        _this.addChild(_this._bottomLay);
        _this.addChild(_this._panelLay);
        _this.addChild(_this._effectLay);
        _this.addChild(_this._maskLay);
        _this.addChild(_this._loadLay);
        _this.addChild(_this._guideLay);
        if (_this._sceneLoading == null) {
            _this._sceneLoading = new SceneLoading();
            _this.addChild(_this._sceneLoading);
        }
        _this._sceneLay.sceneLoading = _this._sceneLoading;
        _this._sceneLoading.visible = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStageView, _this);
        _this._eventSystem.addEventListener(WinManagerEvent.WIN_ADD, _this.addWinToScene, _this);
        _this._eventSystem.addEventListener(WinManagerEvent.WIN_REMOVE, _this.removeWinToScene, _this);
        _this._eventSystem.addEventListener(GameEvent.SHOW_LOADINGVIEW, _this.onShowLoadingView, _this);
        if (_this._sockConnectEventId == 0) {
            _this._sockConnectEventId = _this._eventSystem.addEventListener(SocketConst.SOCKET_CONNECT, _this.closeLoading, _this);
        }
        if (_this._sockReConnectEventId == 0) {
            _this._sockReConnectEventId = _this._eventSystem.addEventListener(SocketConst.SOCKET_RECONNECT, _this.closeLoading, _this);
        }
        if (_this._sockStartConnectEventId == 0) {
            _this._sockStartConnectEventId = _this._eventSystem.addEventListener(SocketConst.SOCKET_START_RECONNECT, _this.showLoading, _this);
        }
        _this.init();
        _this._sceneLay.y = 64;
        _this._sceneLay.x = 0;
        return _this;
        var _a;
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
    GameRootLay.gameLayer = function () {
        if (!this._instance)
            this._instance = new GameRootLay();
        return this._instance;
    };
    /**
     * 添加到舞台
     */
    GameRootLay.prototype.onAddToStageView = function () {
    };
    /**
     * 添加窗口视图到场景
     */
    GameRootLay.prototype.addWinToScene = function (event) {
        var vo = event.vo;
        var view = event.view;
        var parent = this._WinKeyLayDic[vo.layer];
        if (parent == null) {
            parent = this._moduleLay;
        }
        if (parent.contains(view)) {
        }
        else {
            parent.addChild(view);
        }
    };
    /**
     * 从场景移除窗口视图
     */
    GameRootLay.prototype.removeWinToScene = function (event) {
        var vo = event.vo;
        var view = event.view;
        var parent = this._WinKeyLayDic[vo.layer];
        if (parent == null) {
            parent = this._moduleLay;
        }
        if (parent.contains(view)) {
            parent.removeChild(view);
        }
    };
    //初始化游戏根容器
    GameRootLay.prototype.init = function () {
    };
    /**
     * 打开
     */
    GameRootLay.prototype.open = function () {
    };
    /**
     * 清理
     *
     */
    GameRootLay.prototype.clear = function () {
        this.closeLoading();
        if (this._sceneLay) {
            this._sceneLay.clear();
        }
    };
    /**
     * 清理
     */
    GameRootLay.prototype.destroy = function () {
        this._eventSystem.removeEventListener(WinManagerEvent.WIN_ADD);
        this._eventSystem.removeEventListener(WinManagerEvent.WIN_REMOVE);
        this._eventSystem.removeEventListener(GameEvent.SHOW_LOADINGVIEW);
        if (this._sockConnectEventId != 0) {
            this._eventSystem.removeEventListener(SocketConst.SOCKET_CONNECT, this._sockConnectEventId);
            this._sockConnectEventId = 0;
        }
        if (this._sockReConnectEventId != 0) {
            this._eventSystem.removeEventListener(SocketConst.SOCKET_RECONNECT, this._sockReConnectEventId);
            this._sockReConnectEventId = 0;
        }
        if (this._sockStartConnectEventId != 0) {
            this._eventSystem.removeEventListener(SocketConst.SOCKET_START_RECONNECT, this._sockStartConnectEventId);
            this._sockStartConnectEventId = 0;
        }
        this.closeLoading();
    };
    /**
     * 触摸层
     */
    GameRootLay.prototype.makeTouchLayer = function (cb, context) {
        // 点击屏幕继续
        var touchLayer = new eui.Group();
        touchLayer.percentWidth = 100;
        touchLayer.percentHeight = 100;
        this._effectLay.addChild(touchLayer);
        var lb_tips = new eui.Label();
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
    };
    GameRootLay.prototype.setTouch = function (enable) {
        this._loadLay.touchThrough = enable;
    };
    GameRootLay.prototype.onShowLoadingView = function (data) {
        if (this._sceneLoading) {
            this._sceneLoading.visible = Boolean(data);
        }
    };
    /**
     * 显示加载中（圈圈在转)
     */
    GameRootLay.prototype.showLoading = function () {
        if (this._loadingMc == null) {
            this._loadingMc = new LoginLoading();
            this.addChild(this._loadingMc);
        }
    };
    /**
     * 隐藏加载中
     */
    GameRootLay.prototype.closeLoading = function () {
        var _this = this;
        egret.setTimeout(function () {
            if (_this._loadingMc) {
                _this._loadingMc.destroy();
                if (_this._loadingMc.parent) {
                    _this._loadingMc.parent.removeChild(_this._loadingMc);
                }
                _this._loadingMc = null;
            }
        }, this, 400);
    };
    return GameRootLay;
}(eui.UILayer));
__reflect(GameRootLay.prototype, "GameRootLay");
//# sourceMappingURL=GameRootLay.js.map