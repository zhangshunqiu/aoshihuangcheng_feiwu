/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景采集物的VO
 */
class SceneCollectVo extends SceneItemVo {
	public ownerType:number = 3; 	// 对象主人类型
	public ownerId:number = 3; 	// 对象主人id
	public curHp:number;   //对象当前血量
	public curMp:number;   //对象当前魔法
	public hp:number;   	//血量
	public mp:number;   	//魔法
	public constructor() {
		super();
		this.type = SceneObjectType.COLLECT;

		//测试数据
		this.bodyId = "testCollect_png";
		this.gridX = SceneModel.getInstance().getRandomGX();
		this.gridY = SceneModel.getInstance().getRandomGY();
		this.posX = SceneUtil.gridToPixelX(this.gridX);
		this.posY =  SceneUtil.gridToPixelY(this.gridY);
		this.id = 1243;
		this.name = "采集物";
	}

	/**
	 * 从协议里初始化
	 */
	// optional	int32 obj_type		= 1;		//对象类型
		// optional	int32 obj_id		= 2;        //对象id
		// optional	int32 obj_owner_type = 3;		// 对象主人类型
		// optional	int32 obj_owner_id	= 4;		// 对象主人id
		// optional	int32 mon_id		= 5;		// 怪物模板id
		// optional	int32 cur_hp		= 6;		//对象当前血量
		// optional	int32 cur_mp		= 7;		//对象当前魔法
		// optional	int32 hp			= 8;		//血量
		// optional	int32 mp			= 9;		//魔法
		// optional 	int32 begin_x 		= 10;       // 起始点x
		// optional 	int32 begin_y 		= 11;		// 起始点y
	public initProto(obj:any) {
		this.id = obj["obj_id"];
		this.type = obj["obj_type"];
		this.ownerType = obj["obj_owner_type"];
		this.ownerId = obj["obj_owner_id"];
		this.modelId = obj["mon_id"];

		this.gridX = obj["begin_x"];//SceneUtil.pixelToGridX(obj["begin_x"]);
		this.gridY = obj["begin_y"];//SceneUtil.pixelToGridY(obj["begin_y"]);
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