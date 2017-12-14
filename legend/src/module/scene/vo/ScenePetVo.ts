/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景宠物Vo
 */
class ScenePetVo extends SceneMonsterVo {
	public constructor() {
		super();
		this.type = SceneObjectType.PET;
	}

	public initProto(obj:any) {
		super.initProto(obj);
		if(this.ownerId){
			var owerVo:BaseFightObjVo = SceneModel.getInstance().getSceneObjectVo(this.ownerId,this.ownerType);	
			//宠物需要通过所属英雄赋主英雄的值
			if(owerVo){
				this.mainOwnerId = owerVo.ownerId;
				this.pkMode = owerVo.pkMode;
				var arr:Array<number> = SceneUtil.getRoundWalkGrid(owerVo.gridX,owerVo.gridY,1);
				if(arr){
					this.gridX = arr[0];
					this.gridY = arr[1];
				}else{
					this.gridX = owerVo.gridX;
					this.gridY = owerVo.gridY;
				}
				this.posX = SceneUtil.gridToPixelX(this.gridX);
				this.posY =  SceneUtil.gridToPixelY(this.gridY);

			}
		}
	}
}