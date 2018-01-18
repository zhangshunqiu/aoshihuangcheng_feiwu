var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by yangsong on 2014/11/22.
 */
var App = (function () {
    function App() {
    }
    Object.defineProperty(App, "stageWidth", {
        /**
         * 舞台宽
         */
        get: function () {
            return egret.MainContext.instance.stage.stageWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "stageHeight", {
        /**
         * 舞台高
         */
        get: function () {
            return egret.MainContext.instance.stage.stageHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "Http", {
        /**
         * Http请求
         * @type {Http}
         */
        get: function () {
            return Http.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "Socket", {
        /**
         * Socket请求
         * @type {null}
         */
        get: function () {
            return Socket.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "BigNumber", {
        /**
         * 大数字处理类
         * @type {BigNumber}
         */
        get: function () {
            return BigNumber.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DebugUtils", {
        // /**
        //  * 模块管理类
        //  * @type {ControllerManager}
        //  */
        // public static get ControllerManager():ControllerManager {
        //     return ControllerManager.getInstance();
        // }
        // /**
        //  * View管理类
        //  * @type {ViewManager}
        //  */
        // public static get ViewManager():ViewManager {
        //     return ViewManager.getInstance();
        // }
        // /**
        //  * 场景管理类
        //  * @type {SceneManager}
        //  */
        // public static get SceneManager():SceneManager {
        //     return SceneManager.getInstance();
        // }
        /**
         * 调试工具
         * @type {DebugUtils}
         */
        get: function () {
            return DebugUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ConfigManager", {
        /**
          * 配置管理
          * @type {WinManager}
          */
        get: function () {
            return ConfigManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "WinManager", {
        /**
         * 窗口管理
         * @type {WinManager}
         */
        get: function () {
            return WinManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "EventSystem", {
        /**
         * 事件管理系统
         * @type {EventSystem}
         */
        get: function () {
            return EventSystem.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "GlobalTimer", {
        /**
         * 计时器(不要用TimerManager)
         * @type {GlobalTimer}
         */
        get: function () {
            return GlobalTimer.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "RoleManager", {
        /**
         * 角色管理器
         * @type {RoleManager}
         */
        get: function () {
            return RoleManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "GlobalTips", {
        /**
         * 全局通用提示管理器
         * @type {GlobalTips}
         */
        get: function () {
            return GlobalTips.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "BtnTipManager", {
        /**
         * 按钮提示管理器
         */
        get: function () {
            return BtnTipManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "GuideManager", {
        /**
         * 新手引导管理器
         */
        get: function () {
            return GuideManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StageUtils", {
        // /**
        //  * 日期工具类
        //  * @type {DateUtils}
        //  */
        // public static get DateUtils():DateUtils {
        //     return DateUtils.getInstance();
        // }
        // /**
        //  * 数学计算工具类
        //  * @type {MathUtils}
        //  */
        // public static get MathUtils():MathUtils {
        //     return MathUtils.getInstance();
        // }
        // /**
        //  * 随机数工具类
        //  * @type {RandomUtils}
        //  */
        // public static get RandomUtils():RandomUtils {
        //     return RandomUtils.getInstance();
        // }
        // /**
        //  * 显示对象工具类
        //  * @type {DisplayUtils}
        //  */
        // public static get DisplayUtils():DisplayUtils {
        //     return DisplayUtils.getInstance();
        // }
        // /*
        //  * 图片合成数字工具类
        //  * */
        // public static get BitmapNumber():BitmapNumber {
        //     return BitmapNumber.getInstance();
        // }
        // /**
        //  * 引导工具类
        //  */
        // public static get GuideUtils():GuideUtils {
        //     return GuideUtils.getInstance();
        // }
        /**
         * Stage操作相关工具类
         */
        get: function () {
            return StageUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "SoundManager", {
        // /**
        //  * Effect工具类
        //  */
        // public static get EffectUtils():EffectUtils {
        //     return EffectUtils.getInstance();
        // }
        // /**
        //  * 字符串工具类
        //  */
        // public static get StringUtils():StringUtils {
        //     return StringUtils.getInstance();
        // }
        // /**
        //  * 通过工具类
        //  */
        // public static get CommonUtils():CommonUtils {
        //     return CommonUtils.getInstance();
        // }
        /**
         * 音乐管理类
         */
        get: function () {
            return SoundManager.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DeviceUtils", {
        /**
         * 设备工具类
         */
        get: function () {
            return DeviceUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "EgretExpandUtils", {
        /**
         * 引擎扩展类
         */
        get: function () {
            return EgretExpandUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ResourceUtils", {
        // /**
        //  * 键盘操作工具类
        //  */
        // public static get KeyboardUtils():KeyboardUtils {
        //     return KeyboardUtils.getInstance();
        // }
        // /**
        //  * 摇杆操作工具类
        //  */
        // public static get RockerUtils():RockerUtils {
        //     return RockerUtils.getInstance();
        // }
        // /**
        //  * 震动类
        //  */
        // public static get ShockUtils():ShockUtils {
        //     return ShockUtils.getInstance();
        // }
        /**
         * 资源加载工具类
         */
        get: function () {
            return ResourceUtils.getInstance();
        },
        enumerable: true,
        configurable: true
    });
    // /**
    //  * RenderTextureManager
    //  */
    // public static get RenderTextureManager():RenderTextureManager {
    //     return RenderTextureManager.getInstance();
    // }
    // /**
    //  * TextFlow
    //  */
    // public static get TextFlowMaker():TextFlowMaker {
    //     return TextFlowMaker.getInstance();
    // }
    // /**
    //  * 消息通知中心
    //  */
    // private static _notificationCenter:MessageCenter;
    // public static get NotificationCenter():MessageCenter {
    //     if (App._notificationCenter == null) {
    //         App._notificationCenter = new MessageCenter(1);
    //     }
    //     return App._notificationCenter;
    // }
    // /**
    //  * 分帧处理类
    //  * @returns {any}
    //  * @constructor
    //  */
    // public static get DelayOptManager():DelayOptManager {
    //     return DelayOptManager.getInstance();
    // }
    // /**
    //  * 数组工具类
    //  * @returns {any}
    //  * @constructor
    //  */
    // public static get ArrayUtils():ArrayUtils {
    //     return ArrayUtils.getInstance();
    // }
    // /**
    //  * 通用Loading动画
    //  * @returns {any}
    //  * @constructor
    //  */
    // public static get EasyLoading():EasyLoading {
    //     return EasyLoading.getInstance();
    // }
    // /**
    //  * 单一资源通过版本号加载管理类
    //  */
    // public static get ResVersionManager():ResVersionManager {
    //     return ResVersionManager.getInstance();
    // }
    // /**
    //  * DragonBones工厂类
    //  * @returns {any}
    //  * @constructor
    //  */
    // public static get DragonBonesFactory():DragonBonesFactory {
    //     return DragonBonesFactory.getInstance();
    // }
    // /**
    //  * StarlingSwf工厂类
    //  * @returns {StarlingSwfFactory}
    //  * @constructor
    //  */
    // public static get StarlingSwfFactory():StarlingSwfFactory {
    //     return StarlingSwfFactory.getInstance();
    // }
    /**
     * zsq 调试打印
     */
    App.logzsq = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (App.Debug) {
            //   console.log("zsq____",message,...optionalParams);
        }
    };
    /**
     * zrj 调试打印
     */
    App.logzrj = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (App.Debug) {
            console.log.apply(console, ["zrj------->  ", message].concat(optionalParams));
        }
    };
    /**
     * lyg 调试打印
     */
    App.loglyg = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (App.Debug) {
            //    console.log("lyg____",message,...optionalParams);
        }
    };
    /**
      * lh调试打印
      */
    App.loglh = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (App.Debug) {
            //console.log("lh____", message, ...optionalParams);
        }
    };
    App.getUrlVersion = function () {
        if (this._urlVersion == null) {
            this._urlVersion = "?v=" + GlobalModel.getInstance().clientVer;
        }
        return this._urlVersion;
    };
    /**
     * 初始化函数
     * @constructor
     */
    App.Init = function () {
        // //全局配置数据
        // App.GlobalData = RES.getRes("global");
        // //开启调试
        // // App.DebugUtils.isOpen(App.GlobalData.IsDebug);
        // App.DebugUtils.setThreshold(5);
        // //扩展功能初始化
        // App.EgretExpandUtils.init();
        // //实例化Http请求
        // App.Http.initServer(App.GlobalData.HttpSerever);
        this.Debug = true;
        //开启调试
        App.DebugUtils.setDebug(App.agentConfig.IsDebug);
        // Utils.DebugUtils.setThreshold(5);
        //扩展功能初始化
        // Utils.EgretExpandUtils.init();
        App.Http.initServer(App.agentConfig.HttpSerever);
        egret.Ticker.getInstance().register(function (advancedTime) {
            //dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
        // App.Socket.initServer(App.GlobalData.SocketServer, App.GlobalData.SocketPort, new ByteArrayMsgByProtobuf());
    };
    /**
     * 请求服务器使用的用户标识
     * @type {string}
     */
    App.ProxyUserFlag = "";
    /**
     * 全局配置数据
     * @type {null}
     */
    App.agentConfig = null;
    /**
     * 全局配置数据
     * @type {null}
     */
    App.GlobalData = null;
    /**
     * ProtoFile
     * @type {null}
     */
    App.ProtoFile = null;
    /**
     * ProtoConfig
     * @type {null}
     */
    App.ProtoConfig = null;
    /**
     * 地址版本后缀
     * @type {null}
     */
    App._urlVersion = null;
    /**
    * debug状态
    * @type {null}
    */
    App.Debug = false;
    return App;
}());
__reflect(App.prototype, "App");
//# sourceMappingURL=App.js.map