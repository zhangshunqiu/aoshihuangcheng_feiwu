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
 * 登录界面
 * author :zrj
 */
var game;
(function (game) {
    var LoginUI = (function (_super) {
        __extends(LoginUI, _super);
        function LoginUI(viewConf) {
            if (viewConf === void 0) { viewConf = null; }
            var _this = _super.call(this, viewConf) || this;
            _this._serverListEventId = 0;
            _this._setServerEventId = 0;
            _this._setNoticeEventId = 0;
            _this._loginModel = game.LoginModel.getInstance();
            return _this;
        }
        LoginUI.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        LoginUI.prototype.initView = function () {
            var _this = this;
            this.lb_server_select.textFlow = [{ text: "点击选区", style: { underline: true, textColor: 0x00c32e } }];
            this.lb_server_select.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                if (_this._loginModel.serverList.length > 0) {
                    // let view = new LoginServer();
                    // PopUpManager.addPopUp({ obj: view, effectType: 0 });
                    App.WinManager.openWin(WinName.POP_LOGIN_SERVER);
                }
                else {
                    App.GlobalTips.showTips("服务器列表加载中,请稍后！");
                }
            }, this);
            this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                if (_this.input.text != "") {
                    if (/^[a-zA-Z0-9]*$/g.test(_this.input.text)) {
                        if (_this._loginModel.curSelServer) {
                            _this._loginModel.localAccName = _this.input.text;
                            _this._loginModel.localServerId = _this._loginModel.curSelServer.sId;
                            game.LoginController.getInstance().connectToServer();
                            _this._loginModel.saveLocalInfo();
                        }
                        else {
                            App.GlobalTips.showTips("请选择服务器！");
                        }
                    }
                    else {
                        App.GlobalTips.showTips("账号非法！");
                    }
                }
            }, this);
            //设置账号
            this.input.text = this._loginModel.localAccName;
            this.img_notice.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                App.WinManager.openWin(WinName.LOGIN_NOTICE);
            }, this);
        };
        /**
         * 更新选中的服务器
         */
        LoginUI.prototype.updateServer = function () {
            if (this._loginModel.curSelServer) {
                this.lb_server.text = this._loginModel.curSelServer.sName;
            }
        };
        /**
         * 服务器列表更新
         */
        LoginUI.prototype.onUpdateServerList = function () {
            var localServerId = this._loginModel.localServerId;
            var curSelServer;
            if (localServerId == 0) {
                if (this._loginModel.serverList.length > 0) {
                    curSelServer = this._loginModel.serverList[this._loginModel.serverList.length - 1];
                }
            }
            else {
                for (var i = 0; i < this._loginModel.serverList.length; i++) {
                    var vo = this._loginModel.serverList[i];
                    if (vo.sId == localServerId) {
                        curSelServer = vo;
                    }
                }
                if (curSelServer == null) {
                    if (this._loginModel.serverList.length > 0) {
                        curSelServer = this._loginModel.serverList[this._loginModel.serverList.length - 1];
                    }
                }
            }
            this._loginModel.curSelServer = curSelServer;
            this.updateServer();
        };
        /**
         * 游戏更新显示公告
         */
        LoginUI.prototype.onUpdateNoticeShow = function () {
            //更新后显示公告
            //App.logzsq(this._loginModel.isShowLoginNotice);
            if (this._loginModel.isShowLoginNotice()) {
                App.WinManager.openWin(WinName.LOGIN_NOTICE);
            }
        };
        LoginUI.prototype.openWin = function (openParam) {
            _super.prototype.openWin.call(this, openParam);
            if (this._setServerEventId == 0) {
                App.EventSystem.addEventListener(PanelNotify.LOGIN_SERVER_SELECT, this.updateServer, this);
            }
            if (this._serverListEventId == 0) {
                App.EventSystem.addEventListener(PanelNotify.LOGIN_UPDATE_SERVER_LIST, this.onUpdateServerList, this);
            }
            if (this._setNoticeEventId == 0) {
                this._setNoticeEventId = App.EventSystem.addEventListener(PanelNotify.LOGIN_NOTICE_LIST, this.onUpdateNoticeShow, this);
            }
            //设置服务器
            this.onUpdateServerList();
        };
        LoginUI.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 销毁
         */
        LoginUI.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        LoginUI.prototype.clear = function () {
            _super.prototype.clear.call(this);
            if (this._setServerEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.LOGIN_SERVER_SELECT, this._setServerEventId);
                this._setServerEventId = 0;
            }
            if (this._serverListEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.LOGIN_UPDATE_SERVER_LIST, this._serverListEventId);
                this._serverListEventId = 0;
            }
            if (this._setNoticeEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.LOGIN_NOTICE_LIST, this._setNoticeEventId);
                this._setNoticeEventId = 0;
            }
        };
        return LoginUI;
    }(BaseView));
    game.LoginUI = LoginUI;
    __reflect(LoginUI.prototype, "game.LoginUI");
})(game || (game = {}));
//# sourceMappingURL=LoginUI.js.map