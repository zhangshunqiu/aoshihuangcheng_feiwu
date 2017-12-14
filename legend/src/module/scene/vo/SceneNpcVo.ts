/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景Npc的VO
 */
class SceneNpcVo extends BaseObjectVo {
	public constructor() {
		super();
		this.type = SceneObjectType.NPC;

		//测试数据
		this.bodyId = "110315";
		this.gridX = SceneModel.getInstance().getRandomGX();
		this.gridY = SceneModel.getInstance().getRandomGY();
		this.posX = SceneUtil.gridToPixelX(this.gridX);
		this.posY =  SceneUtil.gridToPixelY(this.gridY);
		this.id = 1266;
		this.name = "我是NPC";
	}

	public initProto(obj:any) {
		this.id = obj["obj_id"];
		this.type = obj["obj_type"];
		this.modelId = obj["mon_id"];

		this.gridX = Math.min(SceneModel.getInstance().gridXNum,obj["begin_x"]);//SceneUtil.pixelToGridX(obj["begin_x"]);
		this.gridY = Math.min(SceneModel.getInstance().gridYNum,obj["begin_y"]);//SceneUtil.pixelToGridY(obj["begin_y"]);
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