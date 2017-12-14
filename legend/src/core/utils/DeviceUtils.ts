/**
 * Created by yangsong on 15-1-20.
 */
class DeviceUtils extends BaseClass {
    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 当前是否Html5版本
     * @returns {boolean}
     * @constructor
     */
    public get IsHtml5(): boolean {
        return egret.Capabilities.runtimeType == egret.RuntimeType.WEB;
    }

    /**
     * 当前是否是Native版本
     * @returns {boolean}
     * @constructor
     */
    public get IsNative(): boolean {
        return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
    }

    /**
     * 是否是在手机上
     * @returns {boolean}
     * @constructor
     */
    public get IsMobile(): boolean {
        return egret.Capabilities.isMobile;
    }

    /**
     * 是否是在PC上
     * @returns {boolean}
     * @constructor
     */
    public get IsPC(): boolean {
        return !egret.Capabilities.isMobile;
    }

    /**
     * 是否是QQ浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsQQBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf('MQQBrowser') != -1;
    }

    /**
     * 是否是IE浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsIEBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") != -1;
    }

    /**
     * 是否是Firefox浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsFirefoxBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") != -1;
    }

    /**
     * 是否是Chrome浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsChromeBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") != -1;
    }

    /**
     * 是否是Safari浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsSafariBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Safari") != -1;
    }

    /**
     * 是否是Opera浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsOperaBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
    }

    //当前游戏宽度
    public curWidth(): number {
        return egret.MainContext.instance.stage.stageWidth;
    }

    //当前游戏宽度
    public curHeight(): number {
        return egret.MainContext.instance.stage.stageHeight;
    }

    //适配后多出来的高度（可正可负）
    public additionHeight(): number {
        return egret.MainContext.instance.stage.stageHeight - 1280;
    }

    public additionScale(): number {
        return 1 + (this.additionHeight() / 50 * 0.1);
    }

    public deviceId(): string {
        return "not_unique";
    }
}