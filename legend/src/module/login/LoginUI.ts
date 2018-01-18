/**
 * 登录界面
 * author :zrj
 */
module game {

    export class LoginUI extends BaseView {
        public gp_main: eui.Group;
        public img_notice: eui.Image;
        public btn_server: eui.Button;
        public btn_start: eui.Button;
        public lb_server: eui.Label;
        public lb_server_select: eui.Label;

        public input: eui.TextInput;

        private _serverListEventId:number = 0;
        private _setServerEventId:number = 0;
        private _setNoticeEventId:number = 0;
        private _loginModel:LoginModel;

        public constructor(viewConf: WinManagerVO = null) {
            super(viewConf);
            this._loginModel = LoginModel.getInstance();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.initView();
        }

        private initView() {
            this.lb_server_select.textFlow = [{ text: "点击选区", style: { underline: true, textColor: 0x00c32e } }]
            this.lb_server_select.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                if(this._loginModel.serverList.length >0){
                    // let view = new LoginServer();
                    // PopUpManager.addPopUp({ obj: view, effectType: 0 });
                    App.WinManager.openWin(WinName.POP_LOGIN_SERVER);
                }else{
                   App.GlobalTips.showTips("服务器列表加载中,请稍后！");
                }
            }, this);

            this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
                if (this.input.text != "") {
                    if (/^[a-zA-Z0-9]*$/g.test(this.input.text)) {
                        if(this._loginModel.curSelServer){
                            this._loginModel.localAccName = this.input.text;
                            this._loginModel.localServerId = this._loginModel.curSelServer.sId;
                            LoginController.getInstance().connectToServer();
                            this._loginModel.saveLocalInfo();
                        }else{
                             App.GlobalTips.showTips("请选择服务器！");
                        }
                    } else {
                        App.GlobalTips.showTips("账号非法！");
                    }
                }
            }, this);

            //设置账号
            this.input.text = this._loginModel.localAccName;

              this.img_notice.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {    //公告
                App.WinManager.openWin(WinName.LOGIN_NOTICE);
            }, this);  

           
        }

        /**
         * 更新选中的服务器
         */
        public updateServer() {
            if(this._loginModel.curSelServer){
                this.lb_server.text = this._loginModel.curSelServer.sName;
            }
        }

        /**
         * 服务器列表更新
         */
        public onUpdateServerList(){
            var localServerId = this._loginModel.localServerId;
            var curSelServer:ServerListVo;
            if(localServerId == 0){
                if(this._loginModel.serverList.length >0){
                    curSelServer = this._loginModel.serverList[this._loginModel.serverList.length-1];
                }
            }else{
                for(var i:number = 0;i<this._loginModel.serverList.length;i++){
                    var vo:ServerListVo = this._loginModel.serverList[i];
                    if(vo.sId == localServerId){
                        curSelServer = vo;
                    }
                }
                if(curSelServer==null){
                    if(this._loginModel.serverList.length >0){
                        curSelServer = this._loginModel.serverList[this._loginModel.serverList.length-1];
                    }
                }
            }
            this._loginModel.curSelServer = curSelServer;
            this.updateServer();
        }
        
        /**
         * 游戏更新显示公告
         */
        public onUpdateNoticeShow(){
             //更新后显示公告
             //App.logzsq(this._loginModel.isShowLoginNotice);
            if(this._loginModel.isShowLoginNotice()){
                App.WinManager.openWin(WinName.LOGIN_NOTICE);
            }
        }

        public openWin(openParam) {
            super.openWin(openParam);
            if(this._setServerEventId == 0){
                 App.EventSystem.addEventListener(PanelNotify.LOGIN_SERVER_SELECT,this.updateServer,this);
            }
            if(this._serverListEventId == 0){
                 App.EventSystem.addEventListener(PanelNotify.LOGIN_UPDATE_SERVER_LIST,this.onUpdateServerList,this);
            }
            
             if(this._setNoticeEventId == 0){
               this._setNoticeEventId =App.EventSystem.addEventListener(PanelNotify.LOGIN_NOTICE_LIST,this.onUpdateNoticeShow,this);
            }
            //设置服务器
            this.onUpdateServerList();
            
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
            if(this._setServerEventId != 0){
                 App.EventSystem.removeEventListener(PanelNotify.LOGIN_SERVER_SELECT,this._setServerEventId);
                 this._setServerEventId = 0;
            }
            if(this._serverListEventId != 0){
                 App.EventSystem.removeEventListener(PanelNotify.LOGIN_UPDATE_SERVER_LIST,this._serverListEventId);
                 this._serverListEventId = 0;
            }
             if(this._setNoticeEventId != 0){
                 App.EventSystem.removeEventListener(PanelNotify.LOGIN_NOTICE_LIST,this._setNoticeEventId);
                 this._setNoticeEventId = 0;
            }
            
        }
    }
}