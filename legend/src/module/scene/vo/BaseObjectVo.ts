/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景对象VO基类 2017/09/20.
 */
class BaseObjectVo {
	protected static OBJECT_ID:number = 0;
	private _objectId:number = 0;//实例对象唯一ID，关联这个对象的场景管理中用，其他不要使用；
	public id:number;//对象ID
	public type:number;//场景类型
	public name:string;////对象昵称

	public modelId:string;//模型ID 对应配置表ID
	public bodyId:string;//身体资源ID

	private _posX:number;//X位置
	private _posY:number;//Y位置
	public gridX:number = 0;//X位置格子
	public gridY:number = 0;//Y位置格子

	public scaleParam:number = 1;//缩放大小参数

	public constructor() {
		BaseObjectVo.OBJECT_ID = BaseObjectVo.OBJECT_ID +1;
		this._objectId = BaseObjectVo.OBJECT_ID;
	}

	/**
	 * 实例对象唯一ID，关联这个对象的场景管理中用，其他不要使用，只能获取，不能外部改变
	 */
	public get objectId():number{
		return this._objectId;
	}

	public set posX(value:number){
		this._posX = value;
		//this.gridX = Math.floor(value/64);
	}
	public get posX():number{
		return this._posX;
	}
	public set posY(value:number){
		this._posY = value;
		//this.gridY = Math.floor(value/64);
	}
	public get posY():number{
		return this._posY;
	}

	// public updatePos(xx:number,yy:number){
	// 	this._posX = xx;
	// 	this._posY = yy;
	// 	var xg:number = Math.floor(xx/64);
	// 	var yg:number = Math.floor(yy/64);
	// 	if(xg != this.gridX || yg != this.gridY){
	// 		this.gridX = xg;
	// 		this.gridY = yg;
	// 	}
	// }

	/**
	 * 清理
	 */
	public clear() {
		
	}
}