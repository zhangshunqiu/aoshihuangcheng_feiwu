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
 * Created by yangsong on 15-1-20.
 */
var DeviceUtils = (function (_super) {
    __extends(DeviceUtils, _super);
    /**
     * 构造函数
     */
    function DeviceUtils() {
        return _super.call(this) || this;
    }
    Object.defineProperty(DeviceUtils.prototype, "IsHtml5", {
        /**
         * 当前是否Html5版本
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.runtimeType == egret.RuntimeType.WEB;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsNative", {
        /**
         * 当前是否是Native版本
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsMobile", {
        /**
         * 是否是在手机上
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.isMobile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsPC", {
        /**
         * 是否是在PC上
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return !egret.Capabilities.isMobile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsQQBrowser", {
        /**
         * 是否是QQ浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf('MQQBrowser') != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsIEBrowser", {
        /**
         * 是否是IE浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsFirefoxBrowser", {
        /**
         * 是否是Firefox浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsChromeBrowser", {
        /**
         * 是否是Chrome浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsSafariBrowser", {
        /**
         * 是否是Safari浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Safari") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsOperaBrowser", {
        /**
         * 是否是Opera浏览器
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
        },
        enumerable: true,
        configurable: true
    });
    //当前游戏宽度
    DeviceUtils.prototype.curWidth = function () {
        return egret.MainContext.instance.stage.stageWidth;
    };
    //当前游戏宽度
    DeviceUtils.prototype.curHeight = function () {
        return egret.MainContext.instance.stage.stageHeight;
    };
    //适配后多出来的高度（可正可负）
    DeviceUtils.prototype.additionHeight = function () {
        return egret.MainContext.instance.stage.stageHeight - 1280;
    };
    DeviceUtils.prototype.additionScale = function () {
        return 1 + (this.additionHeight() / 50 * 0.1);
    };
    DeviceUtils.prototype.deviceId = function () {
        return "not_unique";
    };
    return DeviceUtils;
}(BaseClass));
__reflect(DeviceUtils.prototype, "DeviceUtils");
//# sourceMappingURL=DeviceUtils.js.map