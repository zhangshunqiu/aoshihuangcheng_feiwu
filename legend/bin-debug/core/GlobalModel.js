var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 游戏主模型 2017/09/20.
 */
var GlobalModel = (function () {
    function GlobalModel() {
        this.clientVer = "1.0.0"; //客户端版本
        this.serverVer = "1.0.0"; //服务端版本
        this.imei = ""; //设备唯一标示
        this.isForeground = true; //是否进入前台
        this.os_type = 0; //操作系统类型 1表示安卓，2表示ios
        this.platform = 0; //平台名称 渠道编号
        this.platOpenId = 0; // 平台账户id
        this.platUserID = 12345; //平台玩家账号ID
        this.platUserName = "username"; //平台玩家账号名
        this.curServerId = 0; //服务器ID
        this.curServerInfo = {}; //当前服务器信息
        this.loginServerList = []; //当前登录过的服务器列表
        this.curServerRoleArr = []; //当前服务器角色列表
        this.serverList = []; //服务器列表数据
        this.ip = "";
        this.host = "";
        this.port = 0;
        this._serverTime = 0; //服务器时间
        this._localTime = 0; //本地时间（配合serverTime计算正确时间）
        this._timeSpace = 0; //服务器时间和本地时间间隔
        this.serverListUrl = "http://10.0.10.25:8700/server_list.php?ac=query"; //服务器列表获取地址
        this.serverNoticeUrl = "http://10.0.10.25:8700/get_placard.php?ac=query"; //服务器公告地址
        this.isDebug = false;
    }
    GlobalModel.getInstance = function () {
        if (this._instance == null) {
            this._instance = new GlobalModel();
        }
        return this._instance;
    };
    Object.defineProperty(GlobalModel.prototype, "serverTime", {
        /**
         * 设置服务器时间
         */
        set: function (value) {
            this._serverTime = value;
            this._timeSpace = value - Date.now();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取当前时间戳
     */
    GlobalModel.prototype.getTimer = function () {
        return Date.now() + this._timeSpace;
    };
    GlobalModel.prototype.clear = function () {
    };
    GlobalModel.prototype.destroy = function () {
    };
    return GlobalModel;
}());
__reflect(GlobalModel.prototype, "GlobalModel");
//# sourceMappingURL=GlobalModel.js.map