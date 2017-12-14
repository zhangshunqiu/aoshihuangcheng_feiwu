/**
 * module : 登录模块子视图
 * author : zrj
*/
module game {
    export class LoginServer extends BaseView {
        public gp_main: eui.Group;
        public gp_server: eui.Group;
        public img_close: eui.Group;
        public scroller_left: eui.Scroller;
        public list_server: eui.List;
        public pre_btn: ServerItem = null;

        private _loginModel: LoginModel;
        private _serverGroupNum: number = 0;//服务器组数
        private _oneGroupNum: number = 10;//每组服务器数
        private _curSelGroupNum: number = 0;//当前选择组数1，2，3，
        private _rightItemList: Array<eui.Component> = [];
        public constructor() {
            super();
            this.skinName = "LoginServer";
            this._loginModel = LoginModel.getInstance();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
        }

        private initView() {
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                PopUpManager.removePopUp(this, 0);
            }, this);
            this.list_server = new eui.List();
            this.list_server.itemRenderer = ServerItem;
            this.scroller_left.viewport = this.list_server;
            this.list_server.addEventListener(eui.ItemTapEvent.ITEM_TAP, (e: eui.ItemTapEvent) => {
                if (this.pre_btn == <ServerItem>e.itemRenderer) {
                    return;
                }
                this.pre_btn.img_server.source = RES.getRes("Login_btn_2_png");
                this.pre_btn = <ServerItem>e.itemRenderer;
                this.pre_btn.img_server.source = RES.getRes("Login_btn_xuanz_png");
                this.changeList(e.itemIndex);
            }, this);

            this.initRightList();
        }
        private initRightList() {
            this.gp_server.removeChildren();
            for (let i = 1; i <= 10; i++) {
                let item = new eui.Component();
                item.skinName = `<?xml version="1.0" encoding="utf-8"?>
                                    <e:Skin class="TestSkin" width="209" height="58" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
                                        <e:Image id="img_server" scaleX="1" scaleY="1" source="Login_btn_1_png" x="0" y="0"/>
                                        <e:Label id="lb_name" text="" fontFamily="Microsoft YaHei" textAlign="center" scaleX="1" scaleY="1" horizontalCenter="0" y="13"/>
                                    </e:Skin>`;
                item.once(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                    //(this._curSelGroupNum -1)*this._oneGroupNum
                    this._loginModel.curSelServer = this._loginModel.serverList[(this._curSelGroupNum - 1) * this._oneGroupNum + i - 1];
                    App.EventSystem.dispatchEvent(PanelNotify.LOGIN_SERVER_SELECT);
                    PopUpManager.removePopUp(this, 0);
                }, this);
                // (<eui.Label>item.getChildAt(1)).text = this._loginModel.serverList[i - 1].sName;
                item.x = 13;
                item.y = 10 + (i - 1) * 68;//正排
                this.gp_server.addChild(item);
                this._rightItemList.push(item);
            }

            this.openWin(null);
        }

        private changeList(index: number) {
            this._curSelGroupNum = this._serverGroupNum - index;
            var maxIndex: number = Math.min(this._curSelGroupNum * this._oneGroupNum, this._loginModel.serverList.length);
            var minIndex: number = (this._curSelGroupNum - 1) * this._oneGroupNum + 1;
            for (let j = 0; j < 10; j++) {
                var view: any = this._rightItemList[j];
                view.visible = false;
            }
            var index: number = 0;
            for (var i: number = minIndex - 1; i < maxIndex; i++) {
                var vo: ServerListVo = this._loginModel.serverList[i];
                var view: any = this._rightItemList[index];
                view.visible = true;
                view.lb_name.text = vo.sName;
                index++;
            }
        }

        public openWin(openParam) {
            super.openWin(openParam);
            this._serverGroupNum = Math.ceil(this._loginModel.serverList.length / this._oneGroupNum);
            var arr: Array<string> = [];
            for (var i: number = this._serverGroupNum; i > 0; i--) {
                var str: string = ((i - 1) * this._oneGroupNum + 1) + "-" + Math.min(i * this._oneGroupNum, this._loginModel.serverList.length) + " 服";
                arr.push(str);
            }

            this.list_server.dataProvider = new eui.ArrayCollection(arr);
            this.list_server.selectedIndex = 0;
            this.list_server.validateNow();
            this.pre_btn = <ServerItem>this.list_server.getChildAt(0);
            this.pre_btn.img_server.source = RES.getRes("Login_btn_xuanz_png");
            this.changeList(0);
        }

        public closeWin() {
            super.closeWin();
        }

        /**
	 * 销毁
	 */
        public destroy() {
            super.destroy();
        }

        /**
         * 清理
         */
        public clear() {
            super.clear();
        }

    }

    export class ServerItem extends eui.ItemRenderer {
        public lb_name: eui.Label;
        public img_server: eui.Image;
        public constructor() {
            super();
            this.skinName = `<?xml version="1.0" encoding="utf-8"?>
                                <e:Skin class="serverItemSkin" width="207" height="69" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
                                    <e:Group id="gp_main" left="0" right="0" top="0" bottom="0">
                                        <e:Image id="img_server" source="Login_btn_2_png" x="0" y="0" scaleX="1" scaleY="1"/>
                                        <e:Label id="lb_name" text="" fontFamily="Microsoft YaHei" textAlign="center" y="20" horizontalCenter="0" x="104" scaleX="1" scaleY="1"/>
                                    </e:Group>
                                </e:Skin>`;
        }

        protected dataChanged() {
            this.lb_name.text = this.data;
            this.img_server.source = RES.getRes("Login_btn_2_png");
            if (this.data == (<eui.List>this.parent).selectedItem) {
                this.img_server.source = RES.getRes("Login_btn_xuanz_png");
            }
        }
    }

    export class LoginCreateRole extends BaseView {
        public lb_desc: eui.Label;
        public btn_warrior: eui.Button;
        public btn_magic: eui.Button;
        public btn_pastor: eui.Button;
        public img_career: eui.Image;
        public btn_male: eui.Button;
        public btn_female: eui.Button;
        public gp_middle: eui.Group;
        // public img_role_male : eui.Image;
        // public img_role_female : eui.Image;
        public btn_create: eui.Button;
        public textInput: eui.TextInput;
        public img_selected: eui.Image;
        public img_rand: eui.Image;

        private career: number;
        private sex: number;
        private roleName: string = "";
        private mc: AMovieClip;
        private img_role: eui.Image;

        public constructor() {
            super();
            this.skinName = "LoginCreateRoleSkin";
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
            this.career = Math.ceil(Math.random() * 3);
            this.sex = Math.ceil(Math.random() * 2);
            this.updateView();
            // (ProtocalManager.getInstance() as ProtocalManager).registerProtocal(10001,this.createRoleCallback,this) ;  
        }

        private initView() {
            this.textInput.textDisplay.prompt = "玩家名字6字";
            this.textInput.textColor = 0xFFFC00;
            (<eui.Label>this.btn_male.labelDisplay).textColor = 0xFFFC00;
            (<eui.Label>this.btn_female.labelDisplay).textColor = 0xFFFC00;
            this.btn_create.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                if (App.ConfigManager.isContainSensitiveWord(this.textInput.text)) {
                    App.GlobalTips.showTips("名字含有非法字符");
                    return;
                } else if (this.textInput.text.length > 6) {
                     App.GlobalTips.showTips("名字长度不能超过6个");
                    return;
                }
                this.roleName = this.textInput.text;
                if (this.roleName !== "") {
                    // PopUpManager.removePopUp(this,0);
                    // App.WinManager.closeWin(WinName.LOGIN);
                    // App.WinManager.openWin(WinName.MAIN);
                    var loginModel: LoginModel = LoginModel.getInstance() as LoginModel;
                    loginModel.nickname = this.roleName;
                    App.Socket.send(10001, { acc_name: loginModel._localAccName, server_id: loginModel.curSelServer.sId, platform: loginModel.platform, os_type: loginModel.osType, nickname: this.roleName, sex: this.sex, career: this.career });
                }
            }, this);
            this.btn_male.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.sex = ConstSex.MAN;
                this.updateView();
                this.textInput.text = App.ConfigManager.getRandomNameBySex(this.sex);
            }, this);
            this.btn_female.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.sex = ConstSex.WOMAN;
                this.updateView();
                this.textInput.text = App.ConfigManager.getRandomNameBySex(this.sex);
            }, this);
            this.btn_warrior.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.career = CareerType.SOLDIER;
                this.updateView();
            }, this);
            this.btn_magic.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.career = CareerType.MAGES;
                this.updateView();
            }, this);
            this.btn_pastor.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.career = CareerType.TAOIST;
                this.updateView();
            }, this);
            this.img_rand.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                this.textInput.text = App.ConfigManager.getRandomNameBySex(this.sex);
            }, this);
            this.textInput.text = App.ConfigManager.getRandomNameBySex(this.sex);

            // this.mc = new AMovieClip();
            // this.mc.scaleX = this.mc.scaleY = 1.65;
            // this.gp_middle.addChild(this.mc);
            this.img_role = new eui.Image;
            this.img_role.y = -120;
            this.gp_middle.addChild(this.img_role);
        }

        private updateView() {

            let info = LoginModel.getInstance().getInfoByCareerAndSex(this.career, this.sex); //拿配置信息
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
        }

        private updateDesc(desc) {
            this.lb_desc.text = desc;

            let key = this.career + "000" + this.sex;

            RES.getResAsync(key + "_png", (texture) => {
                this.img_role.source = texture;
            }, this);

        }

        //计算长度
        private calcuteLength(str: string) {
            let len = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                    len ++;
                } else {
                    len++;
                }
            }
            return len;
        }

        private createRoleCallback(data) {
            // console.log(data);
            // if (data.result === 1) {
            //     // this.visible = false;
            //     PopUpManager.removePopUp(this,0);
            //     App.WinManager.openWin(WinName.MAIN);
            //     App.WinManager.closeWin(WinName.LOGIN);
            //     // game.AppFacade.getInstance().sendNotification(PanelNotify.INIT_FIGHT_VIEW);
            //     // game.AppFacade.getInstance().sendNotification(MainNotify.OPEN_MAIN);
            // }
        }

        public openWin(openParam) {
            super.openWin(openParam);
        }

        public closeWin() {
            super.closeWin();
        }

        /**
         * 销毁
         */
        public destroy() {
            super.destroy();
        }

        /**
         * 清理
         */
        public clear() {
            super.clear();
        }

    }
}