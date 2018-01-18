/**
 * Created by yangsong on 2014/11/22.
 */
class App {
    /**
     * 请求服务器使用的用户标识
     * @type {string}
     */
    public static ProxyUserFlag: string = "";
    /**
     * 全局配置数据
     * @type {null}
     */
    public static agentConfig: any = null;
    /**
     * 全局配置数据
     * @type {null}
     */
    public static GlobalData: any = null;
    /**
     * ProtoFile
     * @type {null}
     */
    public static ProtoFile: any = null;
    /**
     * ProtoConfig
     * @type {null}
     */
    public static ProtoConfig: any = null;

    /**
     * 地址版本后缀
     * @type {null}
     */
    private static _urlVersion: string = null;

    /**
    * debug状态
    * @type {null}
    */
    public static Debug: Boolean = false;


    /**
     * 舞台宽
     */
    public static get stageWidth(): number {
        return egret.MainContext.instance.stage.stageWidth;
    }
    /**
     * 舞台高
     */
    public static get stageHeight(): number {
        return egret.MainContext.instance.stage.stageHeight;
    }

    /**
     * Http请求
     * @type {Http}
     */
    public static get Http(): Http {
        return Http.getInstance();
    }

    /**
     * Socket请求
     * @type {null}
     */
    public static get Socket(): Socket {
        return Socket.getInstance();
    }

    /**
     * 大数字处理类
     * @type {BigNumber}
     */
    public static get BigNumber(): BigNumber {
        return BigNumber.getInstance();
    }
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
    public static get DebugUtils(): DebugUtils {
        return DebugUtils.getInstance();
    }

    /**
      * 配置管理
      * @type {WinManager}
      */
    public static get ConfigManager(): ConfigManager {
        return ConfigManager.getInstance();
    }

    /**
     * 窗口管理
     * @type {WinManager}
     */
    public static get WinManager(): WinManager {
        return WinManager.getInstance();
    }

    /**
     * 事件管理系统
     * @type {EventSystem}
     */
    public static get EventSystem(): EventSystem {
        return EventSystem.getInstance();
    }

    /**
     * 计时器(不要用TimerManager)
     * @type {GlobalTimer}
     */
    public static get GlobalTimer(): GlobalTimer {
        return GlobalTimer.getInstance();
    }

    /**
     * 角色管理器
     * @type {RoleManager}
     */
    public static get RoleManager(): RoleManager {
        return RoleManager.getInstance();
    }

    /**
     * 全局通用提示管理器
     * @type {GlobalTips}
     */
    public static get GlobalTips(): GlobalTips {
        return GlobalTips.getInstance();
    }

    /**
     * 按钮提示管理器
     */
    public static get BtnTipManager(): BtnTipManager {
        return BtnTipManager.getInstance();
    }

    /**
     * 新手引导管理器
     */
    public static get GuideManager(): GuideManager {
        return GuideManager.getInstance();
    }
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
    public static get StageUtils(): StageUtils {
        return StageUtils.getInstance();
    }

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
    public static get SoundManager(): SoundManager {
        return SoundManager.getInstance();
    }

    /**
     * 设备工具类
     */
    public static get DeviceUtils(): DeviceUtils {
        return DeviceUtils.getInstance();
    }

    /**
     * 引擎扩展类
     */
    public static get EgretExpandUtils(): EgretExpandUtils {
        return EgretExpandUtils.getInstance();
    }

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
    public static get ResourceUtils(): ResourceUtils {
        return ResourceUtils.getInstance();
    }

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
    public static logzsq(message?: any, ...optionalParams: any[]): void {
        if (App.Debug) {
            //   console.log("zsq____",message,...optionalParams);
        }
    }
    /**
     * zrj 调试打印
     */
    public static logzrj(message?: any, ...optionalParams: any[]): void {
        if (App.Debug) {
            console.log("zrj------->  ", message, ...optionalParams);
        }
    }
    /**
     * lyg 调试打印
     */
    public static loglyg(message?: any, ...optionalParams: any[]): void {
        if (App.Debug) {
            //    console.log("lyg____",message,...optionalParams);
        }
    }
    /**
      * lh调试打印
      */
    public static loglh(message?: any, ...optionalParams: any[]): void {
        if (App.Debug) {
            //console.log("lh____", message, ...optionalParams);
        }
    }

    public static getUrlVersion(): string {
        if (this._urlVersion == null) {
            this._urlVersion = "?v=" + GlobalModel.getInstance().clientVer;
        }
        return this._urlVersion;
    }

    /**
     * 初始化函数
     * @constructor
     */
    public static Init(): void {
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
    }
}
