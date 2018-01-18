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
 * module : 登录模块控制器
 * author ： zrj
*/
var game;
(function (game) {
    var LoginController = (function (_super) {
        __extends(LoginController, _super);
        function LoginController() {
            var _this = _super.call(this) || this;
            _this._heartTimeId = 0;
            _this._serverHeartTime = 0;
            _this._scoketConnectEventId = 0;
            _this._scoketReConnectEventId = 0;
            _this._socketStartReconnectEventId = 0;
            _this._socketCloseEventId = 0;
            _this._socketNoConnectEventId = 0;
            _this._send10000Time = 0;
            _this._creatRoleEventId = 0;
            _this._isFirstLogin = true;
            _this.initProtocol();
            _this.initEventListener();
            _this._loginModel = game.LoginModel.getInstance();
            _this._btnTipsManager = BtnTipManager.getInstance();
            return _this;
        }
        LoginController.prototype.initProtocol = function () {
            _super.prototype.initProtocol.call(this);
            this.registerProtocal(9002, this.handlerBasePlayerInfo, this); //玩家数据,角色登录后返回玩家数据，英雄列表，进入场景数据
            this.registerProtocal(9010, this.handlerBtnTipsList, this); //红点提示列表
            this.registerProtocal(9011, this.handlerUpdateBtnTips, this); //红点提示更新
            this.registerProtocal(10000, this.handlerAccountLogin, this); //角色登录
            this.registerProtocal(10001, this.handlerCreateRoleComplete, this); //创建角色
            this.registerProtocal(10002, this.handlerHeartSchedule, this); //心跳
        };
        LoginController.prototype.initEventListener = function () {
            _super.prototype.initEventListener.call(this);
            if (this._creatRoleEventId == 0) {
                this._creatRoleEventId = this.addEventListener(PanelNotify.LOGIN_OPEN_MAKE_ROLE, this.onShowCreateRole, this);
            }
            egret.setTimeout(function () {
                this.requestServerList();
                this.requestNoticeList();
            }, this, 200);
        };
        /**
         * 打开创建角色VIew
         */
        LoginController.prototype.onShowCreateRole = function () {
            App.WinManager.openWin(WinName.POP_LOGIN_CREATE);
            // if (this.loginCreateRoleView == null){
            //      let view = new LoginCreateRole();
            //     this.loginCreateRoleView = view;
            //     PopUpManager.addPopUp({obj:view,effectType:0});
            // }
        };
        /**
         * 关闭创建角色VIew
         */
        LoginController.prototype.onCloseCreateRole = function () {
            App.WinManager.closeWin(WinName.POP_LOGIN_CREATE);
            // if (this.loginCreateRoleView) {
            //     PopUpManager.removePopUp(this.loginCreateRoleView);
            //     this.loginCreateRoleView = null;
            // }
        };
        /**
         * 获取登录通告
         */
        LoginController.prototype.requestNoticeList = function () {
            new HttpRequest(GlobalModel.getInstance().serverNoticeUrl, "", this, this.onGetNoticeList);
        };
        //获取登录通告
        LoginController.prototype.onGetNoticeList = function (data) {
            var list = data.pl;
            this._loginModel.noticeList = list;
            App.EventSystem.dispatchEvent(PanelNotify.LOGIN_NOTICE_LIST);
        };
        /**
         * 获取服务器列表
         */
        LoginController.prototype.requestServerList = function () {
            new HttpRequest(GlobalModel.getInstance().serverListUrl, "", this, this.onGetServerList);
        };
        LoginController.prototype.onGetServerList = function (data) {
            var list = data.DEV;
            var serverList = [];
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                serverList.push(new game.ServerListVo(obj.sid, obj.sname, obj.host, obj.port, obj.status, obj.hot));
            }
            this._loginModel.serverList = serverList;
            this.dispatchEvent(PanelNotify.LOGIN_UPDATE_SERVER_LIST);
            //App.logzsq(data);
        };
        /**
         * 链接socket
         */
        LoginController.prototype.connectToServer = function () {
            App.Socket.initServer(this._loginModel.curSelServer.host, this._loginModel.curSelServer.port, new ByteArrayMsgByProtobuf());
            if (this._scoketConnectEventId == 0) {
                this._scoketConnectEventId = this.addEventListener(SocketConst.SOCKET_CONNECT, this.onSocketConnect, this); //连接成功
            }
            if (this._scoketReConnectEventId == 0) {
                this._scoketReConnectEventId = this.addEventListener(SocketConst.SOCKET_RECONNECT, this.onSocketReconnect, this); //重连成功
            }
            if (this._socketStartReconnectEventId == 0) {
                this._socketStartReconnectEventId = this.addEventListener(SocketConst.SOCKET_START_RECONNECT, this.onStartReConnect, this); // 开始重连
            }
            if (this._socketCloseEventId == 0) {
                this._socketCloseEventId = this.addEventListener(SocketConst.SOCKET_CLOSE, this.onSocketClose, this); //连接关闭
            }
            if (this._socketNoConnectEventId == 0) {
                this._socketNoConnectEventId = this.addEventListener(SocketConst.SOCKET_NOCONNECT, this.onSocketNoConnect, this); //没有或不能连接
            }
            App.Socket.connect();
            App.logzsq("链接SOCKET" + "_" + Date.now());
        };
        /**
         * 请求重连Socket
         */
        LoginController.prototype.requestReConnect = function () {
            MainController.getInstance().clear();
            App.Socket.reconnect();
        };
        /**
         * socket 链接成功
         */
        LoginController.prototype.onSocketConnect = function () {
            App.logzsq("SOCKET 链接成功 CONNECT" + "_" + Date.now());
            this.sendRequestRoleInfo();
            this.startHeartSchedule();
        };
        /**
         * socket重连成功
         */
        LoginController.prototype.onSocketReconnect = function () {
            //重连成功后发送登录协议
            App.logzsq("SOCKET 重连成功_RECONNECT");
            this.sendRequestRoleInfo();
            this.startHeartSchedule();
        };
        /**
         * 开始重连
         */
        LoginController.prototype.onStartReConnect = function () {
            App.logzsq("SOCKET 开始重连 onStartReConnect");
            this.stopHeartSchedule();
        };
        /**
         * 链接断开
         */
        LoginController.prototype.onSocketClose = function () {
            App.logzsq("SOCKET 链接断开 onSocketClose");
            this.stopHeartSchedule();
            this.requestReConnect();
        };
        /**
         * socket重连后都没有链接成功，直接跳转到登录页面
         */
        LoginController.prototype.onSocketNoConnect = function () {
            App.logzsq("SOCKET 链接失败放弃onSocketNoConnect");
            this.stopHeartSchedule();
            MainController.getInstance().clear();
            this.onCloseCreateRole();
            App.WinManager.closeWin(WinName.LOGIN);
            App.WinManager.closeWin(WinName.MAIN);
            App.WinManager.openWin(WinName.LOGIN);
            App.EventSystem.dispatchEvent(GameEvent.SHOW_LOADINGVIEW, false);
        };
        /**
        * 请求角色信息
        */
        LoginController.prototype.sendRequestRoleInfo = function () {
            if (Date.now() - this._send10000Time > 1500) {
                var data = { acc_name: this._loginModel._localAccName, server_id: this._loginModel.curSelServer.sId, platform: this._loginModel.platform, os_type: this._loginModel.osType };
                App.Socket.send(10000, data);
                this._send10000Time = Date.now();
            }
        };
        /**
         * 开始心跳
         */
        LoginController.prototype.startHeartSchedule = function () {
            this._serverHeartTime = Date.now();
            if (this._heartTimeId == 0) {
                this._heartTimeId = App.GlobalTimer.addSchedule(3000, 0, this.onHeartSchedule, this);
            }
            egret.setTimeout(function () {
                this.onHeartSchedule(); //必须加上
            }, this, 60);
        };
        /**
         * 停止心跳
         */
        LoginController.prototype.stopHeartSchedule = function () {
            if (this._heartTimeId != 0) {
                App.GlobalTimer.remove(this._heartTimeId);
                this._heartTimeId = 0;
            }
        };
        /**
         * 心跳
         */
        LoginController.prototype.onHeartSchedule = function () {
            if (Date.now() - this._serverHeartTime < 10000) {
                App.Socket.send(10002, {});
            }
            else {
                this.requestReConnect();
            }
        };
        /**
         * 心跳返回
         */
        LoginController.prototype.handlerHeartSchedule = function (data) {
            this._serverHeartTime = Date.now();
            //App.logzsq(Date.now(),Number(data.result)*1000);
            GlobalModel.getInstance().serverTime = Number(data.result) * 1000;
        };
        /**
         * 账号登录返回
         */
        LoginController.prototype.handlerAccountLogin = function (data) {
            if (data.result == 1) {
                this.onCloseCreateRole();
                App.EventSystem.dispatchEvent(GameEvent.SHOW_LOADINGVIEW, this._isFirstLogin);
                this._isFirstLogin = false;
                App.WinManager.closeWin(WinName.LOGIN);
                if (App.WinManager.isOpen(WinName.MAIN)) {
                    App.WinManager.closeWin(WinName.MAIN);
                }
                App.WinManager.openWin(WinName.MAIN);
            }
        };
        /**
         * 创建角色
         */
        LoginController.prototype.handlerCreateRoleComplete = function (data) {
            this.onCloseCreateRole();
            App.EventSystem.dispatchEvent(GameEvent.SHOW_LOADINGVIEW, this._isFirstLogin);
            this._isFirstLogin = false;
            App.WinManager.closeWin(WinName.LOGIN);
            if (App.WinManager.isOpen(WinName.MAIN)) {
                App.WinManager.closeWin(WinName.MAIN);
            }
            App.WinManager.openWin(WinName.MAIN);
        };
        /**
         * 获取玩家基础信息
         */
        LoginController.prototype.handlerBasePlayerInfo = function (data) {
            game.HeroModel.getInstance().updateBaseInfo(data);
            RoleManager.getInstance().roleInfo.updateFrom9002(data);
            RoleManager.getInstance().roleWealthInfo.updateFrom9002(data);
            // SkillModel.getInstance().checkSkillCanUpgradeAll();
            App.GuideManager.setFinishGuideId(data.guide_id);
            this.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO);
            this.dispatchEvent(PanelNotify.MAIN_LINE_TASK_GET_INFO);
            App.Socket.send(9010, {});
        };
        /**
         * 按钮提示列表返回
         */
        LoginController.prototype.handlerBtnTipsList = function (data) {
            if (data.list) {
                for (var i = 0; i < data.list.length; i++) {
                    var d = data.list[i];
                    this.updateBtnTipsValue(d);
                }
            }
        };
        /**
        * 更新按钮提示列表返回
        *  //     optional int32 id		= 1;	// 红点id
        *  // optional int32 state	= 2;	// 红点状态（0没有， 1有）
        */
        LoginController.prototype.handlerUpdateBtnTips = function (data) {
            if (data.list) {
                for (var i = 0; i < data.list.length; i++) {
                    var d = data.list[i];
                    this.updateBtnTipsValue(d);
                    //this._btnTipsManager.setTypeValue(d.id,(d.state == 1));
                }
            }
        };
        LoginController.prototype.updateBtnTipsValue = function (d) {
            if (d.id == ConstBtnTipType.ROLE_REBORN_CULTURE) {
                if (d.state != 0) {
                    this._btnTipsManager.setTypeValue(d.id, d.state);
                }
                else {
                    this._btnTipsManager.setTypeValue(d.id, false);
                }
            }
            else {
                this._btnTipsManager.setTypeValue(d.id, (d.state == 1));
            }
        };
        /**
         * 清理
         */
        LoginController.prototype.clear = function () {
            _super.prototype.clear.call(this);
            if (this._scoketConnectEventId != 0) {
                this.removeEventListener(SocketConst.SOCKET_CONNECT, this._scoketConnectEventId);
                this._scoketConnectEventId = 0;
            }
            if (this._scoketReConnectEventId != 0) {
                this.removeEventListener(SocketConst.SOCKET_RECONNECT, this._scoketReConnectEventId);
                this._scoketReConnectEventId = 0;
            }
            if (this._socketStartReconnectEventId != 0) {
                this.removeEventListener(SocketConst.SOCKET_START_RECONNECT, this._socketStartReconnectEventId);
                this._socketStartReconnectEventId = 0;
            }
            if (this._socketCloseEventId != 0) {
                this.removeEventListener(SocketConst.SOCKET_CLOSE, this._socketCloseEventId);
                this._socketCloseEventId = 0;
            }
            if (this._socketNoConnectEventId != 0) {
                this.removeEventListener(SocketConst.SOCKET_NOCONNECT, this._socketNoConnectEventId);
                this._socketNoConnectEventId = 0;
            }
            if (this._creatRoleEventId != 0) {
                this.removeEventListener(PanelNotify.LOGIN_OPEN_MAKE_ROLE, this._creatRoleEventId);
                this._creatRoleEventId = 0;
            }
            this.stopHeartSchedule();
        };
        /**
         * 销毁
         */
        LoginController.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return LoginController;
    }(BaseController));
    game.LoginController = LoginController;
    __reflect(LoginController.prototype, "game.LoginController");
})(game || (game = {}));
//# sourceMappingURL=LoginController.js.map