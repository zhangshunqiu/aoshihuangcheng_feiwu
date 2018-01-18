var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ResUrlUtil = (function () {
    function ResUrlUtil() {
    }
    /**
     * 地图图片
     */
    ResUrlUtil.getMapUrlById = function (id) {
        return "resource/assets/map/" + id + ".jpg" + App.getUrlVersion();
    };
    /**
     * 地图小图片
     */
    ResUrlUtil.getMapMiniUrlById = function (id) {
        return "resource/assets/map/mini/mini" + id + ".jpg" + App.getUrlVersion();
    };
    /**
     * 地图配置
     */
    ResUrlUtil.getMapConfUrlById = function (id) {
        return "resource/assets/map/M" + id + ".json" + App.getUrlVersion();
    };
    /**
     * 背景图地址
     */
    ResUrlUtil.getLoadingBgUrl = function () {
        return "resource/assets/ui/login/login_bg.jpg" + App.getUrlVersion();
    };
    /**
     * 获取logo
     */
    ResUrlUtil.getLogoUrl = function () {
        return "resource/logo.png" + App.getUrlVersion();
    };
    return ResUrlUtil;
}());
__reflect(ResUrlUtil.prototype, "ResUrlUtil");
//# sourceMappingURL=ResUrlUtil.js.map