/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 游戏主模型 2017/09/20.
 */
class GlobalModel {
	public clientVer:string = "1.0.0";//客户端版本
	public serverVer:string = "1.0.0";//服务端版本

	public imei:string = "";//设备唯一标示
	public isForeground:boolean = true;//是否进入前台
	public os_type:number = 0;//操作系统类型 1表示安卓，2表示ios

	public platform:number = 0; //平台名称 渠道编号
	public platOpenId:number = 0;// 平台账户id
	public platUserID:number = 12345; //平台玩家账号ID
	public platUserName:string = "username";//平台玩家账号名


	public curServerId:number = 0;//服务器ID
	public curServerInfo:any = {};//当前服务器信息
	public loginServerList:any=[];//当前登录过的服务器列表
	public curServerRoleArr:any = [];//当前服务器角色列表
	public serverList:Array<any> = [];//服务器列表数据
	
	public ip:string = "";
	public host:string = "";
	public port:number = 0;
	
	private _serverTime:number = 0;//服务器时间
	private _localTime:number = 0;//本地时间（配合serverTime计算正确时间）
	private _timeSpace:number = 0;//服务器时间和本地时间间隔

	public serverListUrl:string = "http://10.0.10.25:8700/server_list.php?ac=query";//服务器列表获取地址
    public serverNoticeUrl:string = "http://10.0.10.25:8700/get_placard.php?ac=query";//服务器公告地址

	public isDebug:Boolean = false;

	private static _instance:GlobalModel;
	public static getInstance():GlobalModel {
        if(this._instance == null){
			this._instance = new GlobalModel();
		}
        return this._instance;
    }

	public constructor() {
	
	}
	/**
	 * 设置服务器时间
	 */
	public set serverTime(value:number){
		this._serverTime = value;
		this._timeSpace = value - Date.now();
	}
	/**
	 * 获取当前时间戳
	 */
	public getTimer(){
		return Date.now()+this._timeSpace;
	}

	public clear(){

	}

	public destroy(){
	
	}
}