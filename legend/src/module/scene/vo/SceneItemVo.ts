/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景掉落物品的VO
 */
class SceneItemVo extends BaseObjectVo {
	public num:number = 0;//物品数量
	public ownerId:number = 0;//归属玩家id
	public timeOut:number = 0;//归属失效时间
	public constructor() {
		super();
		this.type = SceneObjectType.ITEM;

		//测试数据
		this.bodyId = "gold_png";
		this.gridX = SceneModel.getInstance().getRandomGX();
		this.gridY = SceneModel.getInstance().getRandomGY();
		this.posX = SceneUtil.gridToPixelX(this.gridX);
		this.posY =  SceneUtil.gridToPixelY(this.gridY);
		this.id = this.objectId;
		this.name = "金币"+this.id;
	}
	
	/**
	 * 从协议里初始化
	 */
	// optional	int32 obj_type		= 1;		//对象类型
	// optional	int32 obj_id		= 2;        //对象id
	// optional int32 goods_id		= 3;		//道具id
	// optional	int32  x			= 4;		//坐标x
	// optional	int32  y			= 5;		//坐标y
	// optional	int32 goods_num		= 6;		//物品数量
	// optional	int32 own_id		= 7;		//归属玩家id
	// optional	int32 time_out		= 8;		//归属失效时间
	public initProto(obj:any) {
		this.id = obj["obj_id"];
		this.type = obj["obj_type"];
		this.modelId = obj["goods_id"];
		this.num = obj["goods_num"];
		this.ownerId = obj["own_id"];
		this.timeOut = obj["time_out"];

		var selfVo:BaseFightObjVo = SceneModel.getInstance().getSelfPlayerVo();
		if(selfVo){
			var nPos:Array<number> = SceneUtil.getRoundWalkGrid(selfVo.gridX,selfVo.gridY,selfVo.dire.dire8);
			if(nPos){
				this.gridX = nPos[0];
				this.gridY = nPos[1];
			}else{
				this.gridX = selfVo.gridX;
				this.gridY = selfVo.gridY;
			}
		}else{
			this.gridX = SceneModel.getInstance().getRandomGX(); 
			this.gridY = SceneModel.getInstance().getRandomGY();
		}

		// this.gridX = obj["x"]; 
		// this.gridY = obj["y"];//SceneUtil.pixelToGridY(obj["y"]);
		this.posX = SceneUtil.gridToPixelX(this.gridX);
		this.posY =  SceneUtil.gridToPixelY(this.gridY);
	}

	/**
	 * 清理
	 */
	public clear() {
		super.clear();
	}
}