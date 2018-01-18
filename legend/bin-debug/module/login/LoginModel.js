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
 * module : 登录模块数据模型
 * author : zrj
*/
var game;
(function (game) {
    var LoginModel = (function (_super) {
        __extends(LoginModel, _super);
        function LoginModel() {
            var _this = _super.call(this) || this;
            _this._localServerId = 0; //本地保存的服务器ID
            _this._localAccName = ""; //本地保存的账号
            _this.osType = "ios";
            _this.platform = "test";
            _this.nickname = "";
            _this._serverList = [
                new ServerListVo(124, "刘博的服务器", "10.0.20.206", 32750),
                new ServerListVo(125, "甘振志的服务器", "10.0.20.207", 32750),
                new ServerListVo(126, "廖伯祥的服务器", "10.0.20.208", 32750),
                new ServerListVo(123, "默认服务器", "10.0.10.25", 32750)
            ];
            var sid = Number(egret.localStorage.getItem("localServerId"));
            if (sid) {
                _this._localServerId = sid;
            }
            var accName = egret.localStorage.getItem("localAccName");
            if (accName) {
                _this._localAccName = accName;
            }
            return _this;
        }
        /**
         * 是否显示登录公告
         */
        LoginModel.prototype.isShowLoginNotice = function () {
            var clientVer = egret.localStorage.getItem("clientVer");
            if (clientVer == GlobalModel.getInstance().clientVer) {
                return false;
            }
            egret.localStorage.setItem("clientVer", GlobalModel.getInstance().clientVer);
            return true;
        };
        Object.defineProperty(LoginModel.prototype, "localServerId", {
            get: function () {
                return this._localServerId;
            },
            set: function (value) {
                this._localServerId = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginModel.prototype, "localAccName", {
            get: function () {
                return this._localAccName;
            },
            set: function (value) {
                this._localAccName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginModel.prototype, "serverList", {
            get: function () {
                return this._serverList;
            },
            set: function (value) {
                this._serverList = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取通知
         * {"sid":1,"top":"[0099ff]\u4eb2\u7231\u7684\u73a9\u5bb6\u670b\u53cb\u4eec:","word":"[ffd700]\r\n
         */
        LoginModel.prototype.getNotice = function () {
            if (this.noticeList && this.noticeList.length > 0) {
                return this.noticeList[0];
            }
            return { sid: 1, top: "", word: "" };
        };
        LoginModel.prototype.saveLocalInfo = function () {
            egret.localStorage.setItem("localAccName", this._localAccName);
            egret.localStorage.setItem("localServerId", String(this.curSelServer.sId));
        };
        LoginModel.prototype.getInfoByCareerAndSex = function (career, sex) {
            var config = ConfigManager.getInstance().getJobConfig();
            for (var key in config) {
                var info = config[key];
                if (info.career == career && info.sex == sex) {
                    return info;
                }
            }
            return null;
        };
        /**
     * 销毁
     */
        LoginModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        LoginModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return LoginModel;
    }(BaseModel));
    game.LoginModel = LoginModel;
    __reflect(LoginModel.prototype, "game.LoginModel");
    /**
     * 服务器列表VO
     */
    var ServerListVo = (function () {
        function ServerListVo(cId, cName, cIp, cPort, cstatus, chot) {
            if (cstatus === void 0) { cstatus = 1; }
            if (chot === void 0) { chot = 0; }
            this.sId = cId;
            this.sName = cName;
            this.host = cIp;
            this.port = cPort;
            this.status = cstatus;
            this.hot = chot;
        }
        return ServerListVo;
    }());
    game.ServerListVo = ServerListVo;
    __reflect(ServerListVo.prototype, "game.ServerListVo");
})(game || (game = {}));
//# sourceMappingURL=LoginModel.js.map