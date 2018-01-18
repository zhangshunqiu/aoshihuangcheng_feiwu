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
 * module : 登录模块子视图
 * author : zrj
*/
var game;
(function (game) {
    var LoginServer = (function (_super) {
        __extends(LoginServer, _super);
        function LoginServer() {
            var _this = _super.call(this) || this;
            _this.pre_btn = null;
            _this._serverGroupNum = 0; //服务器组数
            _this._oneGroupNum = 10; //每组服务器数
            _this._curSelGroupNum = 0; //当前选择组数1，2，3，
            _this._rightItemList = [];
            _this.skinName = "LoginServer";
            _this._loginModel = game.LoginModel.getInstance();
            return _this;
        }
        LoginServer.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
        };
        LoginServer.prototype.initView = function () {
            var _this = this;
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                // PopUpManager.removePopUp(this, 0);
                App.WinManager.closeWin(WinName.POP_LOGIN_SERVER);
            }, this);
            this.list_server = new eui.List();
            this.list_server.itemRenderer = ServerItem;
            this.scroller_left.viewport = this.list_server;
            this.list_server.addEventListener(eui.ItemTapEvent.ITEM_TAP, function (e) {
                if (_this.pre_btn == e.itemRenderer) {
                    return;
                }
                _this.pre_btn.img_server.source = RES.getRes("Login_btn_2_png");
                _this.pre_btn = e.itemRenderer;
                _this.pre_btn.img_server.source = RES.getRes("Login_btn_xuanz_png");
                _this.changeList(e.itemIndex);
            }, this);
            this.initRightList();
        };
        LoginServer.prototype.initRightList = function () {
            var _this = this;
            this.gp_server.removeChildren();
            var _loop_1 = function (i) {
                var item = new eui.Component();
                item.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n                                    <e:Skin class=\"TestSkin\" width=\"209\" height=\"58\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\">\n                                        <e:Image id=\"img_server\" scaleX=\"1\" scaleY=\"1\" source=\"Login_btn_1_png\" x=\"0\" y=\"0\"/>\n                                        <e:Label id=\"lb_name\" text=\"\" fontFamily=\"Microsoft YaHei\" textAlign=\"center\" scaleX=\"1\" scaleY=\"1\" horizontalCenter=\"0\" y=\"13\"/>\n                                    </e:Skin>";
                item.once(egret.TouchEvent.TOUCH_TAP, function (e) {
                    //(this._curSelGroupNum -1)*this._oneGroupNum
                    _this._loginModel.curSelServer = _this._loginModel.serverList[(_this._curSelGroupNum - 1) * _this._oneGroupNum + i - 1];
                    App.EventSystem.dispatchEvent(PanelNotify.LOGIN_SERVER_SELECT);
                    // PopUpManager.removePopUp(this, 0);
                    App.WinManager.closeWin(WinName.POP_LOGIN_SERVER);
                }, this_1);
                // (<eui.Label>item.getChildAt(1)).text = this._loginModel.serverList[i - 1].sName;
                item.x = 13;
                item.y = 10 + (i - 1) * 68; //正排
                this_1.gp_server.addChild(item);
                this_1._rightItemList.push(item);
            };
            var this_1 = this;
            for (var i = 1; i <= 10; i++) {
                _loop_1(i);
            }
            this.openWin(null);
        };
        LoginServer.prototype.changeList = function (index) {
            this._curSelGroupNum = this._serverGroupNum - index;
            var maxIndex = Math.min(this._curSelGroupNum * this._oneGroupNum, this._loginModel.serverList.length);
            var minIndex = (this._curSelGroupNum - 1) * this._oneGroupNum + 1;
            for (var j = 0; j < 10; j++) {
                var view = this._rightItemList[j];
                view.visible = false;
            }
            var index = 0;
            for (var i = minIndex - 1; i < maxIndex; i++) {
                var vo = this._loginModel.serverList[i];
                var view = this._rightItemList[index];
                view.visible = true;
                view.lb_name.text = vo.sName;
                index++;
            }
        };
        LoginServer.prototype.openWin = function (openParam) {
            _super.prototype.openWin.call(this, openParam);
            this._serverGroupNum = Math.ceil(this._loginModel.serverList.length / this._oneGroupNum);
            var arr = [];
            for (var i = this._serverGroupNum; i > 0; i--) {
                var str = ((i - 1) * this._oneGroupNum + 1) + "-" + Math.min(i * this._oneGroupNum, this._loginModel.serverList.length) + " 服";
                arr.push(str);
            }
            this.list_server.dataProvider = new eui.ArrayCollection(arr);
            this.list_server.selectedIndex = 0;
            this.list_server.validateNow();
            this.pre_btn = this.list_server.getChildAt(0);
            this.pre_btn.img_server.source = RES.getRes("Login_btn_xuanz_png");
            this.changeList(0);
        };
        LoginServer.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
     * 销毁
     */
        LoginServer.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        LoginServer.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        return LoginServer;
    }(BaseView));
    game.LoginServer = LoginServer;
    __reflect(LoginServer.prototype, "game.LoginServer");
    var ServerItem = (function (_super) {
        __extends(ServerItem, _super);
        function ServerItem() {
            var _this = _super.call(this) || this;
            _this.skinName = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n                                <e:Skin class=\"serverItemSkin\" width=\"207\" height=\"69\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\">\n                                    <e:Group id=\"gp_main\" left=\"0\" right=\"0\" top=\"0\" bottom=\"0\">\n                                        <e:Image id=\"img_server\" source=\"Login_btn_2_png\" x=\"0\" y=\"0\" scaleX=\"1\" scaleY=\"1\"/>\n                                        <e:Label id=\"lb_name\" text=\"\" fontFamily=\"Microsoft YaHei\" textAlign=\"center\" y=\"20\" horizontalCenter=\"0\" x=\"104\" scaleX=\"1\" scaleY=\"1\"/>\n                                    </e:Group>\n                                </e:Skin>";
            return _this;
        }
        ServerItem.prototype.dataChanged = function () {
            this.lb_name.text = this.data;
            this.img_server.source = RES.getRes("Login_btn_2_png");
            if (this.data == this.parent.selectedItem) {
                this.img_server.source = RES.getRes("Login_btn_xuanz_png");
            }
        };
        return ServerItem;
    }(eui.ItemRenderer));
    game.ServerItem = ServerItem;
    __reflect(ServerItem.prototype, "game.ServerItem");
    var LoginCreateRole = (function (_super) {
        __extends(LoginCreateRole, _super);
        function LoginCreateRole() {
            var _this = _super.call(this) || this;
            _this.roleName = "";
            _this.skinName = "LoginCreateRoleSkin";
            return _this;
        }
        LoginCreateRole.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.initView();
            this.career = Math.ceil(Math.random() * 3);
            this.sex = Math.ceil(Math.random() * 2);
            this.updateView();
            // (ProtocalManager.getInstance() as ProtocalManager).registerProtocal(10001,this.createRoleCallback,this) ;  
        };
        LoginCreateRole.prototype.initView = function () {
            var _this = this;
            this.mc_role = new AMovieClip();
            this.mc_role.x = 360;
            this.mc_role.y = 300;
            this.gp_middle.addChild(this.mc_role);
            this.textInput.textDisplay.prompt = "玩家名字6字";
            this.textInput.textColor = 0xFFFC00;
            this.btn_male.labelDisplay.textColor = 0xFFFC00;
            this.btn_female.labelDisplay.textColor = 0xFFFC00;
            this.btn_create.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                if (App.ConfigManager.isContainSensitiveWord(_this.textInput.text) || _this.textInput.text.indexOf(" ") >= 0) {
                    App.GlobalTips.showTips("名字含有非法字符");
                    return;
                }
                else if (_this.textInput.text.length > 6) {
                    App.GlobalTips.showTips("名字长度不能超过6个");
                    return;
                }
                _this.roleName = _this.textInput.text;
                if (_this.roleName !== "") {
                    // PopUpManager.removePopUp(this,0);
                    // App.WinManager.closeWin(WinName.LOGIN);
                    // App.WinManager.openWin(WinName.MAIN);
                    var loginModel = game.LoginModel.getInstance();
                    loginModel.nickname = _this.roleName;
                    App.Socket.send(10001, { acc_name: loginModel._localAccName, server_id: loginModel.curSelServer.sId, platform: loginModel.platform, os_type: loginModel.osType, nickname: _this.roleName, sex: _this.sex, career: _this.career });
                }
            }, this);
            this.btn_male.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.sex = ConstSex.MAN;
                _this.updateView();
                _this.textInput.text = App.ConfigManager.getRandomNameBySex(_this.sex);
            }, this);
            this.btn_female.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.sex = ConstSex.WOMAN;
                _this.updateView();
                _this.textInput.text = App.ConfigManager.getRandomNameBySex(_this.sex);
            }, this);
            this.btn_warrior.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.career = CareerType.SOLDIER;
                _this.updateView();
            }, this);
            this.btn_magic.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.career = CareerType.MAGES;
                _this.updateView();
            }, this);
            this.btn_pastor.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.career = CareerType.TAOIST;
                _this.updateView();
            }, this);
            this.img_rand.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                _this.textInput.text = App.ConfigManager.getRandomNameBySex(_this.sex);
            }, this);
            this.textInput.text = App.ConfigManager.getRandomNameBySex(this.sex);
            // this.mc = new AMovieClip();
            // this.mc.scaleX = this.mc.scaleY = 1.65;
            // this.gp_middle.addChild(this.mc);
            this.img_role = new eui.Image;
            this.img_role.y = -120;
            this.gp_middle.addChild(this.img_role);
        };
        LoginCreateRole.prototype.updateView = function () {
            var info = game.LoginModel.getInstance().getInfoByCareerAndSex(this.career, this.sex); //拿配置信息
            this.sex == ConstSex.WOMAN ? this.btn_warrior.currentState = "down" : this.btn_warrior.currentState = "up";
            this.sex == ConstSex.WOMAN ? this.btn_magic.currentState = "down" : this.btn_magic.currentState = "up";
            this.sex == ConstSex.WOMAN ? this.btn_pastor.currentState = "down" : this.btn_pastor.currentState = "up";
            switch (this.career) {
                case CareerType.SOLDIER: {
                    this.img_selected.y = this.btn_warrior.y - 19;
                    this.img_career.source = RES.getRes("role_zhan_png");
                    break;
                }
                case CareerType.MAGES: {
                    this.img_selected.y = this.btn_magic.y - 19;
                    this.img_career.source = RES.getRes("role_fa_png");
                    break;
                }
                case CareerType.TAOIST: {
                    this.img_selected.y = this.btn_pastor.y - 19;
                    this.img_career.source = RES.getRes("role_dao_png");
                    break;
                }
            }
            this.sex == ConstSex.MAN ? this.btn_male.currentState = "down" : this.btn_male.currentState = "up";
            this.sex == ConstSex.WOMAN ? this.btn_female.currentState = "down" : this.btn_female.currentState = "up";
            // this.textInput.text = "玩家名字"+Math.floor(Math.random()*10000);
            this.updateDesc(info.description);
        };
        LoginCreateRole.prototype.updateDesc = function (desc) {
            var _this = this;
            this.lb_desc.text = desc;
            var key = this.career + "000" + this.sex;
            RES.getResAsync(key + "_png", function (texture) {
                _this.img_role.source = texture;
            }, this);
            //Test 
            this.img_role.visible = false;
            this.mc_role.playMCKey("effxj" + this.sex + this.career, "", -1, null, function () {
                _this.mc_role.frameRate = 7;
            }, this);
        };
        //计算长度
        LoginCreateRole.prototype.calcuteLength = function (str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                    len++;
                }
                else {
                    len++;
                }
            }
            return len;
        };
        LoginCreateRole.prototype.createRoleCallback = function (data) {
            // console.log(data);
            // if (data.result === 1) {
            //     // this.visible = false;
            //     PopUpManager.removePopUp(this,0);
            //     App.WinManager.openWin(WinName.MAIN);
            //     App.WinManager.closeWin(WinName.LOGIN);
            //     // game.AppFacade.getInstance().sendNotification(PanelNotify.INIT_FIGHT_VIEW);
            //     // game.AppFacade.getInstance().sendNotification(MainNotify.OPEN_MAIN);
            // }
        };
        LoginCreateRole.prototype.openWin = function (openParam) {
            _super.prototype.openWin.call(this, openParam);
        };
        LoginCreateRole.prototype.closeWin = function () {
            _super.prototype.closeWin.call(this);
        };
        /**
         * 销毁
         */
        LoginCreateRole.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        /**
         * 清理
         */
        LoginCreateRole.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.mc_role.destroy();
        };
        return LoginCreateRole;
    }(BaseView));
    game.LoginCreateRole = LoginCreateRole;
    __reflect(LoginCreateRole.prototype, "game.LoginCreateRole");
})(game || (game = {}));
//# sourceMappingURL=LoginSubView.js.map