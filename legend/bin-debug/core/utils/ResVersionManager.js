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
 * Created by yangsong on 15-4-21.
 * 单一资源通过版本号加载管理类
 */
var ResVersionManager = (function (_super) {
    __extends(ResVersionManager, _super);
    /**
     * 构造函数
     */
    function ResVersionManager() {
        return _super.call(this) || this;
    }
    ResVersionManager.prototype.init = function () {
        this.res_loadByVersion();
    };
    /**
     * Res加载使用版本号的形式
     */
    ResVersionManager.prototype.res_loadByVersion = function () {
        RES.web.Html5VersionController.prototype.getVirtualUrl = function (url) {
            var version = "";
            var resVersion = ResVersionManager.resVersionData;
            var urlTemp = url.substring(9);
            if (resVersion && resVersion[urlTemp]) {
                version = resVersion[urlTemp];
            }
            if (version.length == 0) {
                // 强行给每个链接加上随机数
                version = Math.random() + "";
            }
            if (url.indexOf("?") == -1) {
                url += "?v=" + version;
            }
            else {
                url += "&v=" + version;
            }
            return url;
        };
    };
    /**
     * 加载资源版本号配置文件
     * @param url 配置文件路径
     * @param complateFunc 加载完成执行函数
     * @param complateFuncTarget 加载完成执行函数所属对象
     */
    ResVersionManager.prototype.loadConfig = function (url, complateFunc, complateFuncTarget) {
        this.complateFunc = complateFunc;
        this.complateFuncTarget = complateFuncTarget;
        RES.getResByUrl(url, this.loadResVersionComplate, this);
    };
    /**
     * 配置文件加载完成
     * @param data
     */
    ResVersionManager.prototype.loadResVersionComplate = function (data) {
        ResVersionManager.resVersionData = data;
        this.complateFunc.call(this.complateFuncTarget);
    };
    return ResVersionManager;
}(BaseClass));
__reflect(ResVersionManager.prototype, "ResVersionManager");
//# sourceMappingURL=ResVersionManager.js.map