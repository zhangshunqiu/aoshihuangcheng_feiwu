/**
 * module : 登录模块数据模型
 * author : zrj
*/
module game {
    export class LoginModel extends BaseModel {
        public noticeList: Array<any>;//通告列表

        private _serverList: Array<ServerListVo>;//服务器列表
        public curSelServer:ServerListVo;//当前选中服务器列表
        private _localServerId:number = 0; //本地保存的服务器ID
        public _localAccName:string = "";//本地保存的账号

        public osType: string = "ios";
        public platform: string = "test";
        public nickname: string = "";

        public career: number;
        public sex: number;

        public constructor() {
            super();
            this._serverList = [
                new ServerListVo(124,"刘博的服务器","10.0.10.157",32750),
                new ServerListVo(125,"甘振志的服务器","10.0.10.44",32750),
                new ServerListVo(126,"廖伯祥的服务器","10.0.10.79",32750),
                new ServerListVo(123,"默认服务器","10.0.10.25",32750)
                ]
            let sid:number = Number(egret.localStorage.getItem("localServerId"));
            if(sid){
                this._localServerId = sid; 
            }
            let accName:string = egret.localStorage.getItem("localAccName");
            if(accName){
                this._localAccName = accName;
            }
        }
        /**
         * 是否显示登录公告
         */
        public isShowLoginNotice():boolean{
            let clientVer:string = egret.localStorage.getItem("clientVer");
            if(clientVer == GlobalModel.getInstance().clientVer){
                return false;
            }
            egret.localStorage.setItem("clientVer",GlobalModel.getInstance().clientVer);
            return true;
        }
        public set localServerId(value:number){
            this._localServerId = value;
        }
        public get localServerId():number{
            return this._localServerId;
        }

        public get localAccName():string{
            return this._localAccName;
        }
        public set localAccName(value:string){
            this._localAccName = value;
        }

        public get serverList():Array<ServerListVo>{
            return this._serverList;
        }
        public set serverList(value:Array<ServerListVo>){
            this._serverList = value;
        }

        /**
         * 获取通知
         * {"sid":1,"top":"[0099ff]\u4eb2\u7231\u7684\u73a9\u5bb6\u670b\u53cb\u4eec:","word":"[ffd700]\r\n 
         */
        public getNotice():any{
            if(this.noticeList && this.noticeList.length>0){
                return this.noticeList[0]
            }
            return {sid:1,top:"",word:""};
        }

        public saveLocalInfo(){
            egret.localStorage.setItem("localAccName",this._localAccName);
            egret.localStorage.setItem("localServerId",String(this.curSelServer.sId));
        }

        public getInfoByCareerAndSex(career: number, sex: number): any {
            let config = ConfigManager.getInstance().getJobConfig();
            for (let key in config) {
                let info = config[key];
                if (info.career == career && info.sex == sex) {
                    return info;
                }
            }
            return null;
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

    /**
     * 服务器列表VO
     */
    export class ServerListVo {
        public sId:number;
        public sName:string;
        public host:string;
        public port:number;
        public status:number;
        public hot:number;
        public constructor(cId:number,cName:string,cIp:string,cPort:number,cstatus:number = 1,chot:number = 0) {
            this.sId = cId;
            this.sName = cName;
            this.host = cIp;
            this.port = cPort;
            this.status = cstatus;
            this.hot = chot;
        }
    }
}