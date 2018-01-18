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
 * Author: zhangshunqiu                                      （必须加上，知道是谁做的）
 * Xxx模块视图窗口 2017/06/20.
 */
var XxxWin = (function (_super) {
    __extends(XxxWin, _super);
    function XxxWin(viewConf) {
        if (viewConf === void 0) { viewConf = null; }
        var _this = _super.call(this, viewConf) || this;
        _this._xxxModel = XxxModel.getInstance();
        _this._xxxController = XxxController.getInstance();
        _this._eventId = 0;
        _this._time1Id = 0;
        _this._time2Id = 0;
        _this._buttn1 = new IconButton({});
        _this._buttn2 = new IconButton({});
        _this._curSelIndex = 0;
        //窗口使用示范
        //1.去WinManager配置窗口名称和对应的WinManagerVO
        //2.打开窗口
        App.WinManager.openWin(WinName.BACKPACK);
        //3.关闭窗口
        App.WinManager.closeWin(_this.winVo.winName);
        //计时器使用
        //1.每帧执行
        if (_this._time1Id == 0) {
            _this._time1Id = App.GlobalTimer.addFrameSchedule(_this.onTimeHandler, _this);
        }
        //2.时间执行执行 1000 是一秒  0是无限次，也可以填次数
        if (_this._time2Id == 0) {
            App.GlobalTimer.addSchedule(1000, 0, _this.onTimeHandler2, _this);
        }
        //3.清理
        if (_this._time1Id != 0) {
            App.GlobalTimer.remove(_this._time1Id);
            _this._time1Id = 0;
        }
        if (_this._time2Id != 0) {
            App.GlobalTimer.remove(_this._time2Id);
            _this._time2Id = 0;
        }
        //配置都在ConfigManager
        //获取配置使用,不能拿所有的配置再来处理，只能拿在ConfigManager中处理好的配置
        var confData = App.ConfigManager.getSceneConfigById(100);
        //常量和枚举定义在 GlobalConst.ts中
        //类型必须定义常量，不能写if(a==1)这样的
        //事件定义在GlobalEvent.ts中
        //通用函数放到GlobalUtil
        //如 GlobalUtil.getInfoByTypeId(11,22)
        //通过地址加载的地址必须放到 ResUrlUtil中
        //如：ResUrlUtil.getLogoUrl();
        //所有的数据结构都要定义VO；
        _this._buttn1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.updateView(1);
        }, _this);
        _this._buttn2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.updateView(2);
        }, _this);
        return _this;
    }
    XxxWin.prototype.updateView = function (index) {
        if (this._curSelIndex == index) {
            return;
        }
        if (this._curSelView) {
            this._curSelView.clear();
        }
        if (index == 1) {
            if (this._view1 == null) {
                this._view1 = new XxxView1("skinName1");
            }
            this._view1.readyOpen({ data: {} });
            this._curSelView = this._view1;
        }
        else if (index == 2) {
            if (this._view2 == null) {
                this._view2 = new XxxView2("skinName2");
            }
            this._view2.readyOpen({ data: {} });
            this._curSelView = this._view2;
        }
    };
    /**
     * 事件监听函数2
     */
    XxxWin.prototype.onTimeHandler2 = function () {
        //处理事件
    };
    /**
     * 事件监听函数
     */
    XxxWin.prototype.onTimeHandler = function (data) {
        //处理事件
        return true;
    };
    /**
     * 创建皮肤（初始化调用一次）
     */
    XxxWin.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        //帧动画播放演示
        if (this._effMc == null) {
            this._effMc = new AMovieClip();
            this.addChild(this._effMc);
        }
        //播放动画，其中-1表示无限次
        this._effMc.playMCKey("动画Id", "", -1);
        //播放一次
        this._effMc.playMCKey("动画Id", "", 1);
        //停止
        this._effMc.stop();
        //在destory里面销毁 
        // this._effMc.destroy();
        // this.removeChild(this._effMc);
        // this._effMc = null;
    };
    /**
     * 打开窗口(每次打开App.WinManager.openWin(WinName.BACKPACK);都会调用)
     */
    XxxWin.prototype.openWin = function (openParam) {
        if (openParam === void 0) { openParam = null; }
        _super.prototype.openWin.call(this, openParam);
        //事件监听示范
        if (this._eventId == 0) {
            this._eventId = App.EventSystem.addEventListener("事件名称", this.onHandler, this);
        }
        //事件派发示范
        App.EventSystem.dispatchEvent("事件名称", {});
        //协议发送示范
        //App.Socket.send(10000,{});
        if (this._effMc) {
            this._effMc.playMCKey("动画Id", "", 1);
        }
        this.updateView(1);
    };
    /**
     * 事件监听函数
     */
    XxxWin.prototype.onHandler = function (data) {
        //处理事件
    };
    /**
     * 清理(每次关闭App.WinManager.closeWin(WinName.BACKPACK);都会调用)
     */
    XxxWin.prototype.clear = function (data) {
        if (data === void 0) { data = null; }
        _super.prototype.clear.call(this, data);
        //事件清理示范
        if (this._eventId != 0) {
            App.EventSystem.removeEventListener("事件名称", this._eventId);
            this._eventId = 0;
        }
        if (this._effMc) {
            this._effMc.destroy();
        }
        if (this._curSelView) {
            this._curSelView.clear();
        }
        this._curSelIndex = 0;
    };
    /**
     * 销毁
     */
    XxxWin.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this._effMc) {
            this._effMc.destroy();
            this.removeChild(this._effMc);
            this._effMc = null;
        }
        if (this._view1) {
            this._view1.destroy();
        }
        if (this._view2) {
            this._view2.destroy();
        }
        this._curSelView = null;
    };
    return XxxWin;
}(BaseView));
__reflect(XxxWin.prototype, "XxxWin");
//# sourceMappingURL=XxxWin.js.map