/**
 * module : 登录模块控制器
 * author ： zrj
*/
module game {
    export class LoginController extends BaseController {
        private _btnTipsManager:BtnTipManager;
        private _loginModel:LoginModel
        public loginCreateRoleView : LoginCreateRole;
        private _heartTimeId:number = 0;
        private _serverHeartTime:number = 0;

        private _scoketConnectEventId:number = 0;
        private _scoketReConnectEventId:number = 0;
        private _socketStartReconnectEventId:number = 0;
        private _socketCloseEventId:number = 0;
        private _socketNoConnectEventId:number = 0;

        private _send10000Time:number = 0;

        private _creatRoleEventId:number = 0;

        private _isFirstLogin:Boolean = true;
        public constructor() {
            super();
            this.initProtocol();
		    this.initEventListener();
            this._loginModel = LoginModel.getInstance();
            this._btnTipsManager = BtnTipManager.getInstance();
        }

        protected initProtocol() {
            super.initProtocol();
            this.registerProtocal(9002,this.handlerBasePlayerInfo,this);//玩家数据,角色登录后返回玩家数据，英雄列表，进入场景数据
            this.registerProtocal(9010,this.handlerBtnTipsList,this);//红点提示列表
            this.registerProtocal(9011,this.handlerUpdateBtnTips,this)//红点提示更新
            this.registerProtocal(10000,this.handlerAccountLogin,this);//角色登录
            this.registerProtocal(10001,this.handlerCreateRoleComplete,this);//创建角色
            this.registerProtocal(10002,this.handlerHeartSchedule,this);//心跳

            
        }

        protected initEventListener() {
            super.initEventListener();
            if(this._creatRoleEventId == 0){
                this._creatRoleEventId = this.addEventListener(PanelNotify.LOGIN_OPEN_MAKE_ROLE,this.onShowCreateRole,this);
            }

            egret.setTimeout(function () {
                this.requestServerList();
                this.requestNoticeList();
            }, this, 200)
        }

        /**
         * 打开创建角色VIew
         */
        private onShowCreateRole() {
            App.WinManager.openWin(WinName.POP_LOGIN_CREATE);
            // if (this.loginCreateRoleView == null){
            //      let view = new LoginCreateRole();
            //     this.loginCreateRoleView = view;
            //     PopUpManager.addPopUp({obj:view,effectType:0});
            // }
        }
        /**
         * 关闭创建角色VIew
         */
        private onCloseCreateRole() {
            App.WinManager.closeWin(WinName.POP_LOGIN_CREATE);
            // if (this.loginCreateRoleView) {
            //     PopUpManager.removePopUp(this.loginCreateRoleView);
            //     this.loginCreateRoleView = null;
            // }
        }

        /**
         * 获取登录通告
         */
        public requestNoticeList(){
            new HttpRequest(GlobalModel.getInstance().serverNoticeUrl,"",this,this.onGetNoticeList);
        }
        //获取登录通告
        private onGetNoticeList(data:any) {
            var list:Array<any> = data.pl;
            this._loginModel.noticeList = list;
            App.EventSystem.dispatchEvent(PanelNotify.LOGIN_NOTICE_LIST);
        }

        /**
         * 获取服务器列表
         */
        public requestServerList(){
            new HttpRequest(GlobalModel.getInstance().serverListUrl,"",this,this.onGetServerList);
        }
        private onGetServerList(data:any) {
            var list:Array<any> = data.DEV;
            var serverList:Array<ServerListVo> = [];
            for(var i:number = 0;i<list.length;i++){
                var obj:any = list[i];
                serverList.push(new ServerListVo(obj.sid,obj.sname,obj.host,obj.port,obj.status,obj.hot));
            }
            this._loginModel.serverList = serverList;
            this.dispatchEvent(PanelNotify.LOGIN_UPDATE_SERVER_LIST);
            //App.logzsq(data);
        }

        /**
         * 链接socket
         */
        public connectToServer() {
            App.Socket.initServer(this._loginModel.curSelServer.host,this._loginModel.curSelServer.port,new ByteArrayMsgByProtobuf());
            if( this._scoketConnectEventId == 0){
                this._scoketConnectEventId = this.addEventListener(SocketConst.SOCKET_CONNECT,this.onSocketConnect,this);           //连接成功
            }
            if(this._scoketReConnectEventId == 0){
                this._scoketReConnectEventId = this.addEventListener(SocketConst.SOCKET_RECONNECT,this.onSocketReconnect,this);       //重连成功
            }
            if(this._socketStartReconnectEventId == 0){
                this._socketStartReconnectEventId = this.addEventListener(SocketConst.SOCKET_START_RECONNECT,this.onStartReConnect,this);// 开始重连
            }
            if(this._socketCloseEventId == 0){
                this._socketCloseEventId = this.addEventListener(SocketConst.SOCKET_CLOSE,this.onSocketClose,this);             //连接关闭
            }
            if(this._socketNoConnectEventId == 0){
                this._socketNoConnectEventId = this.addEventListener(SocketConst.SOCKET_NOCONNECT,this.onSocketNoConnect,this);     //没有或不能连接
            }
            App.Socket.connect();
            App.logzsq("链接SOCKET"+"_"+Date.now());
        }
       
        /**
         * 请求重连Socket
         */
        public requestReConnect(){
            (MainController.getInstance() as MainController).clear();
		    App.Socket.reconnect();

        }
        /**
         * socket 链接成功
         */
        private onSocketConnect() {
            App.logzsq("SOCKET 链接成功 CONNECT"+"_"+Date.now());
            this.sendRequestRoleInfo();
            this.startHeartSchedule();
        }
        /**
         * socket重连成功
         */
        private onSocketReconnect() {
            //重连成功后发送登录协议
            App.logzsq("SOCKET 重连成功_RECONNECT");
            this.sendRequestRoleInfo();
            this.startHeartSchedule();
        }
        /**
         * 开始重连
         */
        private onStartReConnect(){
            App.logzsq("SOCKET 开始重连 onStartReConnect");
            this.stopHeartSchedule();
        }
        /**
         * 链接断开
         */
        private onSocketClose(){
            App.logzsq("SOCKET 链接断开 onSocketClose");
            this.stopHeartSchedule();
            this.requestReConnect();
        }
        /**
         * socket重连后都没有链接成功，直接跳转到登录页面
         */
        private onSocketNoConnect(){
            App.logzsq("SOCKET 链接失败放弃onSocketNoConnect");
            this.stopHeartSchedule();
            (MainController.getInstance() as MainController).clear();
            this.onCloseCreateRole();
            App.WinManager.closeWin(WinName.LOGIN);
            App.WinManager.closeWin(WinName.MAIN);
            App.WinManager.openWin(WinName.LOGIN);
            App.EventSystem.dispatchEvent(GameEvent.SHOW_LOADINGVIEW,false);
        }

         /**
         * 请求角色信息
         */
        public sendRequestRoleInfo(){
            if(Date.now() - this._send10000Time >1500){
                let data = {acc_name:this._loginModel._localAccName,server_id:this._loginModel.curSelServer.sId,platform:this._loginModel.platform,os_type:this._loginModel.osType};
                App.Socket.send(10000,data);
                this._send10000Time = Date.now();
            }
        }
        /**
         * 开始心跳
         */
        private startHeartSchedule(){
            this._serverHeartTime = Date.now();
            if(this._heartTimeId == 0){
                this._heartTimeId = App.GlobalTimer.addSchedule(3000,0,this.onHeartSchedule,this);
            }
            egret.setTimeout(function () {
                this.onHeartSchedule();//必须加上
            }, this, 60)
        }
        /**
         * 停止心跳
         */
        private stopHeartSchedule(){
            if(this._heartTimeId != 0){
                App.GlobalTimer.remove(this._heartTimeId);
                this._heartTimeId = 0;
            }
        }
        /**
         * 心跳
         */
        private onHeartSchedule() {
            if(Date.now() - this._serverHeartTime < 10000){
                 App.Socket.send(10002,{});
            }else{
                 this.requestReConnect();
            }
        }
        /**
         * 心跳返回
         */
        private handlerHeartSchedule(data) {
            this._serverHeartTime = Date.now();
            //App.logzsq(Date.now(),Number(data.result)*1000);
            GlobalModel.getInstance().serverTime = Number(data.result)*1000;
        }
        /**
         * 账号登录返回
         */
        private handlerAccountLogin(data) {
            if(data.result == 1){
                this.onCloseCreateRole();
                App.EventSystem.dispatchEvent(GameEvent.SHOW_LOADINGVIEW,this._isFirstLogin);
                this._isFirstLogin = false;
                App.WinManager.closeWin(WinName.LOGIN);
                if(App.WinManager.isOpen(WinName.MAIN)){
                    App.WinManager.closeWin(WinName.MAIN);
                }
                App.WinManager.openWin(WinName.MAIN);
            }
        }
    
        /**
         * 创建角色
         */
        public handlerCreateRoleComplete(data) {
            this.onCloseCreateRole();
            App.EventSystem.dispatchEvent(GameEvent.SHOW_LOADINGVIEW,this._isFirstLogin);
            this._isFirstLogin = false;
            App.WinManager.closeWin(WinName.LOGIN);
            if(App.WinManager.isOpen(WinName.MAIN)){
                 App.WinManager.closeWin(WinName.MAIN);
            }
            App.WinManager.openWin(WinName.MAIN);
        }

        /**
         * 获取玩家基础信息
         */
        public handlerBasePlayerInfo(data) {
            HeroModel.getInstance().updateBaseInfo(data);
            RoleManager.getInstance().roleInfo.updateFrom9002(data);
            RoleManager.getInstance().roleWealthInfo.updateFrom9002(data);
            // SkillModel.getInstance().checkSkillCanUpgradeAll();
            App.GuideManager.setFinishGuideId(data.guide_id);
            this.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO);
            this.dispatchEvent(PanelNotify.MAIN_LINE_TASK_GET_INFO);
            App.Socket.send(9010,{});
        }

        /**
         * 按钮提示列表返回
         */
        private handlerBtnTipsList(data:any){
             if(data.list){
                for(var i:number = 0;i<data.list.length;i++){
                    var d:any = data.list[i];
                    this.updateBtnTipsValue(d);
                }
            }
        }

         /**
         * 更新按钮提示列表返回
         *  //     optional int32 id		= 1;	// 红点id
	     *  // optional int32 state	= 2;	// 红点状态（0没有， 1有）
         */
        private handlerUpdateBtnTips(data:any){
            if(data.list){
                for(var i:number = 0;i<data.list.length;i++){
                    var d:any = data.list[i];
                    this.updateBtnTipsValue(d);
                    //this._btnTipsManager.setTypeValue(d.id,(d.state == 1));
                }
            }
        }
        private updateBtnTipsValue(d:any):void{
            if(d.id == ConstBtnTipType.ROLE_REBORN_CULTURE){
                if(d.state != 0){
                        this._btnTipsManager.setTypeValue(d.id,d.state);
                }else{
                        this._btnTipsManager.setTypeValue(d.id,false);
                }
            }else{
                    this._btnTipsManager.setTypeValue(d.id,(d.state == 1));
            }
        }

        /**
         * 清理
         */
        public clear(){
            super.clear();
            if( this._scoketConnectEventId != 0){
                this.removeEventListener(SocketConst.SOCKET_CONNECT,this._scoketConnectEventId); 
                this._scoketConnectEventId = 0;
            }
            if( this._scoketReConnectEventId != 0){
                this.removeEventListener(SocketConst.SOCKET_RECONNECT,this._scoketReConnectEventId);
                this._scoketReConnectEventId = 0;
            }
            if( this._socketStartReconnectEventId != 0){
                this.removeEventListener(SocketConst.SOCKET_START_RECONNECT,this._socketStartReconnectEventId);
                this._socketStartReconnectEventId = 0;
            }
            if( this._socketCloseEventId != 0){
                this.removeEventListener(SocketConst.SOCKET_CLOSE,this._socketCloseEventId); 
                this._socketCloseEventId = 0;
            }
            if( this._socketNoConnectEventId != 0){
                this.removeEventListener(SocketConst.SOCKET_NOCONNECT,this._socketNoConnectEventId);
                this._socketNoConnectEventId = 0;
            }
            if(this._creatRoleEventId != 0){
                this.removeEventListener(PanelNotify.LOGIN_OPEN_MAKE_ROLE,this._creatRoleEventId);
                this._creatRoleEventId = 0;
            }
            this.stopHeartSchedule();
        }
        /**
         * 销毁
         */
        public destroy(){
            super.destroy();
        }
    }
}