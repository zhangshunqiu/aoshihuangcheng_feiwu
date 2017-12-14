/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 战斗buffVO
 */
class FBuffVo {
	public static BUFFIDADD:number = 1; 
	public id:string = "0";//唯一ID
	public buffId:number = 0;//buffId
	public bufftype:number = 0;//buff类型
	public objId:number = 0;//目标对象ID
	public objType:number = 0;//目标对象类型

	public beginTime:number = 0;//开始时间
	public endTime:number = 0;//结束时间

	public effType:number = 7;//buff效果类型 见BuffEffType
	public mcResId:string = "7160";//效果资源ID

	public constructor() {
		FBuffVo.BUFFIDADD++;
		this.id = String(FBuffVo.BUFFIDADD);

		this.beginTime = GlobalModel.getInstance().getTimer();
		this.endTime = GlobalModel.getInstance().getTimer()+100000;
	}

	/**
	 * 初始化协议
	 */
	public initProto(data:any){
		this.buffId = data.buff_id;
		var config:any = App.ConfigManager.getBuffConfigById(this.buffId);
		if(config){
			this.mcResId = config.effectbuffid;
			this.effType = config.effectid;
		}else{
			this.mcResId = "";
		}
	}

		// message pbHookBuff{
		// 		optional	int32	obj_type	=1;//对象类型
		// 		optional	int32	obj_id      =2;//对象id
		// 		optional    int32	buff_op		=3;//buff操作:1 添加,2 更新,3 删除
		// 		optional    int32   buff_id		=4;//buff_id
		// 		optional	int32   buff_time   =5;//倒计时
		// }

	/**
	 * 是否移除
	 */
	public isRemove(curTime:number = 0):boolean{
		if(GlobalModel.getInstance().getTimer() <= this.endTime){
			return false;
		}
		return true;
	}
}