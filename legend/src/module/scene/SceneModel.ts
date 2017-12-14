/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 游戏场景模型 2017/06/20.
 * 场景战斗流程 
 * 1.搜索可以使用的技能
 * 2.根据技能搜索最近的目标，以及目标周围是否还有怪，如果有怪改成群体攻击
 * 3.是否可以攻击，是执行4攻击，否移动到目标再执行1
 * 4.计算攻击范围选择攻击目标，执行攻击	
 */
class SceneModel extends BaseModel {
	public debugMonsterNum:number= 0;

	public sceneStageW:number = 0;//场景舞台宽
	public sceneStageH:number = 0;//场景舞台高

	public static GRIDW:number = 64;//场景格子宽
	public static GRIDH:number = 64;//场景格子高

	public mapX:number;//地图X位置根据主角位置来定
	public mapY:number;//地图Y位置

	private _sceneId:number;//地图ID
	private _sceneType:number;//地图类型
	public sceneName:string;//地图名称
	public sceneWidth:number;
	public sceneHeight:number;
	private _mapResId:number;//地图资源ID
	private _bossSceneId:number;//地图副本bossID

	private _sceneConfig:any;//地图配置表返回

	public sceneGridConfig : any;//地图场景配置信息，地图编辑器返回的
	public mapGrid:Array<Array<number>>;//地图格子信息

	private _gridVoPool:Array<SceneGridVo>;//格子Vo对象池
    public gridTable :Array<Array<any>>; //地图上每个格子占位信息
	public gridXNum:number = 0;//x轴格子数量
	public gridYNum:number = 0;//y轴格子数量

	private _guildUnionDic:any = {};//行会联盟，记录联盟的行会ID
	private _enemyIdDic:any = {};//仇人列表，记录仇人的ID字典

	private _sceneNpcVoDic:egret.HashObject;//场景npcVO
	private _sceneMonsterVoDic:any = {};//场景怪VO
	private _scenePetVoDic:any = {};//宠物VO
	private _scenePartnerVoDic:any = {};//伙伴VO
	private _scenePlayerVoDic:any = {};//玩家VO
	private _scenePlayerCopyVoDic:any = {};//玩家镜像VO
	private _sceneItemVoDic:any = {};//物品VO
	private _sceneCollectVoDic:any = {};//采集物 VO
	private _sceneSkillEffVoDic:any = {};//技能效果，像火墙VO

	public isUseRocker:Boolean = false;//是否使用摇杆

	private _AStar:aStar.AStar;

	private static _instance:SceneModel;
	public static getInstance():SceneModel {
        if(this._instance == null){
			this._instance = new SceneModel();
		}
        return this._instance;
    }

	public constructor() {
		super();
		this._gridVoPool = [];
		this.sceneStageW = App.stageWidth;
		this.sceneStageH = App.stageHeight -64 - 96;

		this._AStar = new aStar.AStar();
	}

	/**
	 * 获取寻路格子路径列表
	 * @param bx
	 * @param by
	 * @param ex
	 * @param ey
	 */
	public getAStarGridPath(bx:number,by:number,ex:number,ey:number):Array<Array<number>>{
		var list:Array<any> = aStar.AStar.find(bx,by,ex,ey);
		if(list){
			var newList:Array<Array<number>> = [];
			for(var i:number = 0;i<list.length-1;i = i+2){
				newList.push([list[i],list[i+1]]);
			}
			return newList;
		}
		return null;
	}

	/**
	 * 获取寻路像素路径列表
	 * @param bx
	 * @param by
	 * @param ex
	 * @param ey
	 */
	public getAStarPixelPath(bx:number,by:number,ex:number,ey:number):Array<Array<number>>{
		var list:Array<any> = aStar.AStar.find(bx,by,ex,ey);
		if(list){
			var newList:Array<Array<number>> = [];
			for(var i:number = 0;i<list.length-1;i = i+2){
				newList.push([SceneUtil.gridToPixelX(list[i]),SceneUtil.gridToPixelY(list[i+1])]);
			}
			return newList;
		}
		return null;
	}

	/**获取随机X轴格子*/
	public getRandomGX():number{
		return Math.floor(Math.random()*this.gridXNum);
	}
	/**获取随机Y轴格子*/
	public getRandomGY():number{
		return Math.floor(Math.random()*this.gridYNum);
	}

	/**
	 * 场景模型初始化
	 */
	public initSceneData(data:any){
		if(data){
			this.clear();
			this._sceneConfig = App.ConfigManager.getSceneConfigById(data.sceneId);
			this.mapX = 0;
			this.mapY = 0;
			this.sceneWidth = 640;
			this.sceneHeight = 640;
			this._sceneId = this._sceneConfig.scene_id;
			this._sceneType = this._sceneConfig.scene_type;
			this.sceneName = this._sceneConfig.name;
			this._mapResId = this._sceneConfig.map_id;
			this._bossSceneId = this._sceneConfig.copy_id;
			// this.gridXNum = Math.ceil(this.sceneWidth/SceneModel.GRIDH);
			// this.gridYNum = Math.ceil(this.sceneHeight/SceneModel.GRIDW);
			// this.gridTable = [];
			// for(let i:number = 0;i<this.gridXNum;i++){
			// 	this.gridTable[i] = [];
			// 	// for(let j:number = 0;j<this.gridYNum;j++){
			// 	// 	this.gridTable[i][j] = [];
			// 	// }
			// }
		}
	}
	/**
	 * 更新场景对象挂机技能
	 */
	public updateObjHookSkill(id:number,type:number){
		var vo:ScenePlayerVo = this.getSceneObjectVo(id,type);
		if(vo){
			vo.updateHookSkill(RoleManager.getInstance().getHeroVoById(id));
		}
	} 
	/**
	 * 更新场景配置信息
	 */
	public updateSceneConfig(data:any){
		this.sceneGridConfig = data;
		this.mapGrid = data.grids;
		this.sceneWidth = this.sceneGridConfig.width-this.sceneGridConfig.width%64;
		this.sceneHeight = this.sceneGridConfig.height-this.sceneGridConfig.height%64;
		this.gridXNum = Math.floor(this.sceneWidth/SceneModel.GRIDH);
		this.gridYNum = Math.floor(this.sceneHeight/SceneModel.GRIDW);
		this.gridTable = [];
		aStar.AStar.initData(this.mapGrid);
		for(let i:number = 0;i<this.gridXNum;i++){
			this.gridTable[i] = [];
			// for(let j:number = 0;j<this.gridYNum;j++){
			// 	this.gridTable[i][j] = [];
			// }
		}
	}
		
	/**
	 * 添加场景位置信息
	 */
	public addGridTablePos(vo:BaseObjectVo):void{
		//App.logzsq("ADD "+xx+"_"+yy);
		if(vo.gridX == null || vo.gridY == null || this.gridTable[vo.gridX] == null){
			return
		}
		var gVo:SceneGridVo = this.gridTable[vo.gridX][vo.gridY];
		if(gVo == null){
			gVo = this.getGridVo();
			this.gridTable[vo.gridX][vo.gridY] = gVo;
		}
		gVo.add(vo);
	}
	/**
	 * 移除场景位置信息
	 */
	public removeGridTablePos(vo:BaseObjectVo):void{
		//App.logzsq("REMOVE "+xx+"_"+yy);
		if(this.gridTable && this.gridTable[vo.gridX]){
			var gVo:SceneGridVo = this.gridTable[vo.gridX][vo.gridY];
			if(gVo){
				gVo.remove(vo);
				if(gVo.length <=0){
					gVo.clear();
					this.gridTable[vo.gridX][vo.gridY] = null;
					this.addGridVo(gVo);
				}
			}
		}
	}
	/**
	 * 获取场景位置信息
	 */
	private getGridTablePosObj(xx:number,yy:number):any{
		if(xx >=0 && xx < this.gridXNum && yy >= 0 && yy < this.gridYNum){
			if(this.gridTable[xx][yy]){
				return (this.gridTable[xx][yy] as SceneGridVo).gridObj;
			}
		}
		return null;
	}
	/**
	 * 获取场景位置信息2
	 */
	public getGridTablePosObjByVo(vo:BaseObjectVo):void{
		if(this.gridTable[vo.gridX][vo.gridY]){
			return (this.gridTable[vo.gridX][vo.gridY] as SceneGridVo).gridObj;
		}
		return null;
	}

	/**
	 * 获取场景位置信息2
	 */
	public getGridTableHasObj(xx:number,yy:number):boolean{
		if(this.gridTable[xx][yy] && (this.gridTable[xx][yy] as SceneGridVo).length > 0){
			return true;
		}
		return false;
	}

	/**
	 * 获取场景位置信息2
	 */
	public getGridTableHasTwoObj(xx:number,yy:number):boolean{
		if(this.gridTable[xx][yy] && (this.gridTable[xx][yy] as SceneGridVo).length > 1){
			return true;
		}
		return false;
	}

	/**
	 * 清理
	 */
	public clear(){
		super.clear();
		this._sceneNpcVoDic = new egret.HashObject();
		this._sceneMonsterVoDic = {};
		this._scenePetVoDic = {};
		this._scenePartnerVoDic = {};
		this._scenePlayerVoDic = {};
		this._scenePlayerCopyVoDic = {};
		this._sceneItemVoDic = {};
		this._sceneCollectVoDic = {};
		this._sceneSkillEffVoDic = {};
		this.gridTable = null;
	}

	public destroy(){
		super.destroy();
		this.clear();
	}
	

	// /**
	//  * 获取宠物最近的敌人
	//  * @param objVo 怪物Vo
	//  */
	// public getPetNearlyEnamy(objVo:BaseFightObjVo):BaseFightObjVo{
	// 	var target:BaseFightObjVo;
	// 	var dis:number = 10000;
	// 	var tdis:number;
	// 	for(let key in this._scenePlayerVoDic){
	// 		let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
	// 		if(vo.actState != ActState.DEAD){
	// 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
	// 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
	// 				dis = tdis;
	// 				target = vo;
	// 			}
	// 		}
	// 	}
	// 	for(let key in this._scenePartnerVoDic){
	// 		let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
	// 		if(vo.actState != ActState.DEAD){
	// 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
	// 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
	// 				dis = tdis;
	// 				target = vo;
	// 			}
	// 		}
	// 	}
	// 	for(let key in this._scenePetVoDic){
	// 		let vo:BaseFightObjVo= this._scenePetVoDic[key];
	// 		if(vo.actState != ActState.DEAD && vo.objectId != objVo.objectId){
	// 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
	// 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
	// 				dis = tdis;
	// 				target = vo;
	// 			}
	// 		}
	// 	}
	// 	for(let key in this._sceneMonsterVoDic){
	// 		let vo:BaseFightObjVo= this._sceneMonsterVoDic[key];
	// 		if(vo.actState != ActState.DEAD){
	// 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
	// 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
	// 				dis = tdis;
	// 				target = vo;
	// 			}
	// 		}
	// 	}
	// 	if(target){return target;}
	// 	return null;
	// }
	// /**
	//  * 获取宠物最近的搭档
	//  * @param objVo 怪物Vo
	//  */
	// public getPetNearlyPartner(objVo:BaseFightObjVo):BaseFightObjVo{
	// 	var target:BaseFightObjVo;
	// 	let dis:number = 10000;
	// 	let tdis:number;
	// 	for(let key in this._scenePlayerVoDic){
	// 		let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
	// 		if(vo.actState != ActState.DEAD){
	// 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
	// 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
	// 				dis = tdis;
	// 				target = vo;
	// 			}
	// 		}
	// 	}
	// 	for(let key in this._scenePartnerVoDic){
	// 		let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
	// 		if(vo.actState != ActState.DEAD){
	// 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
	// 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
	// 				dis = tdis;
	// 				target = vo;
	// 			}
	// 		}
	// 	}
	// 	for(let key in this._scenePetVoDic){
	// 		let vo:BaseFightObjVo= this._scenePetVoDic[key];
	// 		if(vo.actState != ActState.DEAD && vo.objectId != objVo.objectId){
	// 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
	// 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
	// 				dis = tdis;
	// 				target = vo;
	// 			}
	// 		}
	// 	}
	// 	if(target){return target;}
	// 	return null;
	// }


	/**
	 * 根据技能范围更新技能伤害列表   n'n'n'n'n'n'n'n'n'n'n'n'n'n
	 * @param atkVo 攻击者
	 * @param skillTargetVo 技能目标VO
	 */
	public updateHurtTarListByRange(atkVo:BaseFightObjVo,skillTargetVo:FSkillTargetVo):FSkillTargetVo{
		if(skillTargetVo.targetArr == null || skillTargetVo.targetArr.length <= 0){	
			return skillTargetVo;
		}
		var skillVo:FSkillVo = skillTargetVo.skillVo;
		if(skillVo.targetType == SkillTargetType.SELF){//自己
			return skillTargetVo;
		}else if(skillVo.atkRangeType == SkillAtkRangeType.R_SINGLE){ //单体
			return skillTargetVo;
		}else{//近身群体和远程群体
			var rangeList:Array<Array<number>> = SceneUtil.getSkillRangeGrids(skillVo.atkRangeId,atkVo.dire.dire8);
			if(rangeList){
				var atkGridX:number = atkVo.gridX;
				var atkGridY:number = atkVo.gridY;
				var nx:number;
				var ny:number;
				var rangValue:Array<number>;
				var gridDic:any;

				var firstTargetid:number = (skillTargetVo.targetArr[0] as BaseFightObjVo).objectId;
				var vo:BaseFightObjVo;
				if(skillVo.targetType == SkillTargetType.ENEMY){
					for(let i:number = 0;i<rangeList.length;i++){
						rangValue = rangeList[i];
						nx = atkGridX +rangValue[0];
						ny = atkGridY +rangValue[1];
						gridDic = this.getGridTablePosObj(nx,ny);
						if(gridDic){
							for(let k in gridDic){
								vo = gridDic[k];
								if(vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid && this.isSelectTarget(skillVo.targetType,atkVo,vo)){
								//if(skillVo.targetType == SkillTargetType.ENEMY && (vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER) && vo.actState != ActState.DEAD &&  vo.objectId != firstTargetid){
									skillTargetVo.targetArr.push(vo);
									if(skillTargetVo.targetArr.length > 8){
										break;
									}
								}
							}
						}
					}
				}else if(skillVo.targetType == SkillTargetType.PARTNER){ 	
					for(let i:number = 0;i<rangeList.length;i++){
						rangValue = rangeList[i];
						nx = atkGridX +rangValue[0];
						ny = atkGridY +rangValue[1];
						gridDic = this.getGridTablePosObj(nx,ny);
						if(gridDic){
							for(let k in gridDic){
								vo = gridDic[k];
								if(vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid && this.isSelectTarget(skillVo.targetType,atkVo,vo)){
								//if(skillVo.targetType == SkillTargetType.PARTNER && vo.type == SceneObjectType.MONSTER && vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid){
									skillTargetVo.targetArr.push(vo);
									if(skillTargetVo.targetArr.length > 8){
										break;
									}
								}
							}
						}
					}
				}
			}
		}
	
		return skillTargetVo;
	}

	/**
	 * 是否是选中的目标
	 * @param targetType 攻击类型 
	 * @param atkVo 攻击者VO
	 * @param targetVo 目标VO
	 */
	public isSelectTarget(targetType:number,atkVo:BaseFightObjVo,targetVo:BaseFightObjVo):Boolean{
		if(targetType == SkillTargetType.ENEMY){ //敌方
			if(atkVo.type == SceneObjectType.MONSTER ){
				if(targetVo.type != SceneObjectType.MONSTER){
					return true;
				}else{
					return false;
				}
			}else{
				if(targetVo.type == SceneObjectType.MONSTER){
					return true;
				}else{
					return false;
				}
			}
		}else if(targetType == SkillTargetType.PARTNER){//队友
			if(atkVo.type == SceneObjectType.MONSTER ){
				if(targetVo.type == SceneObjectType.MONSTER){
					return true;
				}else{
					return false;
				}
			}else{
				if(targetVo.type != SceneObjectType.MONSTER){
					return true;
				}else{
					return false;
				}
			}
		}else if(targetType == SkillTargetType.SELF){//自己
			if(atkVo.objectId == targetVo.objectId){
				return true;
			}else{
				return false;
			}
		}else if(targetType == SkillTargetType.EMPTY){ //空放

		}
		return false;
	}

	/**
	 * 搜索最近的敌人  nnnnnnnnnn
	 */
	public searchNearlyEnamy(objVo:BaseFightObjVo):BaseFightObjVo{
		let target:BaseFightObjVo;
		if(objVo.type == SceneObjectType.MONSTER){
			let dis:number = 10000;
			let tdis:number;
			for(let key in this._scenePlayerVoDic){
				let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
				if(vo.actState != ActState.DEAD){
					tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
					if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
						dis = tdis;
						target = vo;
					}
				}
			}
			for(let key in this._scenePartnerVoDic){
				let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
				if(vo.actState != ActState.DEAD){
					tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
					if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
						dis = tdis;
						target = vo;
					}
				}
			}
			for(let key in this._scenePetVoDic){
				let vo:BaseFightObjVo= this._scenePetVoDic[key];
				if(vo.actState != ActState.DEAD){
					tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
					if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
						dis = tdis;
						target = vo;
					}
				}
			}
		}else if(objVo.type == SceneObjectType.PLAYER || objVo.type == SceneObjectType.PLAYERCOPY || objVo.type == SceneObjectType.PARTNER || objVo.type == SceneObjectType.PET){
			let dis:number = 10000;
			let tdis:number;
			for(let key in this._sceneMonsterVoDic){
				let vo:BaseFightObjVo= this._sceneMonsterVoDic[key];
				if(vo.actState != ActState.DEAD){
					tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
					if(tdis < dis && tdis < 1024){
						dis = tdis;
						target = vo;
					}
				}
			}
		}
		if(target){
			return target;
		}
		return null;
	}


	/**
	 * 搜索最近的搭档   nnnnnnnnnnnnnnnnn
	 */
	public searchNearlyPartner(objVo:BaseFightObjVo):BaseFightObjVo{
		let target:BaseFightObjVo;
		if(objVo.type == SceneObjectType.PLAYER || objVo.type == SceneObjectType.PLAYERCOPY || objVo.type == SceneObjectType.PARTNER || objVo.type == SceneObjectType.PET){
			let dis:number = 10000;
			let tdis:number;
			for(let key in this._scenePlayerVoDic){
				let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
				if(vo.actState != ActState.DEAD && vo.objectId != objVo.objectId){
					tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
					if(tdis < dis && tdis < 1024){
						dis = tdis;
						target = vo;
					}
				}
			}
			for(let key in this._scenePartnerVoDic){
				let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
				if(vo.actState != ActState.DEAD && vo.objectId != objVo.objectId){
					tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
					if(tdis < dis && tdis < 1024){
						dis = tdis;
						target = vo;
					}
				}
			}
			for(let key in this._scenePetVoDic){
				let vo:BaseFightObjVo= this._scenePetVoDic[key];
				if(vo.actState != ActState.DEAD && vo.objectId != objVo.objectId){
					tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
					if(tdis < dis && tdis < 1024){
						dis = tdis;
						target = vo;
					}
				}
			}
		}else if(objVo.type == SceneObjectType.MONSTER){
			let dis:number = 10000;
			let tdis:number;
			for(let key in this._sceneMonsterVoDic){
				let vo:BaseFightObjVo= this._sceneMonsterVoDic[key];
				if(vo.actState != ActState.DEAD && vo.objectId != objVo.objectId){
					tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
					if(tdis < dis && tdis < 1024){
						dis = tdis;
						target = vo;
					}
				}
			}
		}
		if(target){
			return target;
		}
		return null;
	}






	//------------------------怪物技能目标相关---------
	/**
	 * 更新怪物技能伤害范围内目标
	 * @param atkVo 攻击者
	 * @param skillTargetVo 技能目标VO
	 */
	public updateMonsterHurtListByRange(atkVo:BaseFightObjVo,skillTargetVo:FSkillTargetVo):FSkillTargetVo{
		if(skillTargetVo.targetArr == null || skillTargetVo.targetArr.length <= 0){	
			return skillTargetVo;
		}
		var skillVo:FSkillVo = skillTargetVo.skillVo;
		//if(skillVo.targetType == SkillTargetType.SELF || skillVo.targetType == SkillTargetType.ENEMY){//自己或空放  自己的如果是群体也要使用群体功能
		if(skillVo.targetType == SkillTargetType.EMPTY){//空放
			return skillTargetVo;
		}else if(skillVo.atkRangeType == SkillAtkRangeType.R_SINGLE){//单体
			return skillTargetVo;
		}else{//近身群体（以自己为参照坐标）和远程群体（以第一个目标为参照坐标）
			var rangeList:Array<Array<number>> = SceneUtil.getSkillRangeGrids(skillVo.atkRangeId,atkVo.dire.dire8);
			if(rangeList){
				var atkGridX:number;
				var atkGridY:number;
				var nx:number;
				var ny:number;
				var rangValue:Array<number>;
				var gridDic:any;

				var tarVo:BaseFightObjVo = skillTargetVo.targetArr[0];
				if(skillVo.atkRangeType == SkillAtkRangeType.R_N_GROUP){
					atkGridX = atkVo.gridX;
					atkGridY = atkVo.gridY
				}else{
					atkGridX = tarVo.gridX;
					atkGridY = tarVo.gridY
				}
				var firstTargetid:number = tarVo.objectId;
				var vo:BaseFightObjVo;
				if(skillVo.targetType == SkillTargetType.ENEMY){ 	//怪物的敌人是所有玩家，伙伴，宠物
					for(let i:number = 0;i<rangeList.length;i++){
						rangValue = rangeList[i];
						nx = atkGridX +rangValue[0];
						ny = atkGridY +rangValue[1];
						gridDic = this.getGridTablePosObj(nx,ny);
						if(gridDic){
							for(let k in gridDic){
								vo = gridDic[k];
								//怪物的敌人是所有玩家，伙伴，宠物 //(vo.objectId != atkVo.objectId && 不需要，不是同一场景类型)
								if( (vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER || vo.type == SceneObjectType.PLAYERCOPY) && vo.actState != ActState.DEAD &&  vo.objectId != firstTargetid){
									skillTargetVo.targetArr.push(vo);
									if(skillTargetVo.targetArr.length > 8){
										break;
									}
								}
							}
						}
					}
				}else if(skillVo.targetType == SkillTargetType.PARTNER || skillVo.targetType == SkillTargetType.SELF){ 	//怪物的伙伴是怪物
					for(let i:number = 0;i<rangeList.length;i++){
						rangValue = rangeList[i];
						nx = atkGridX +rangValue[0];
						ny = atkGridY +rangValue[1];
						gridDic = this.getGridTablePosObj(nx,ny);
						if(gridDic){
							for(let k in gridDic){
								vo = gridDic[k];
								//if( vo.type == SceneObjectType.MONSTER && vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid){
								if( vo.type == SceneObjectType.MONSTER && vo.actState != ActState.DEAD  && vo.objectId != firstTargetid){ //搭档类型也包括自己，自己类型也包括搭档
									skillTargetVo.targetArr.push(vo);
									if(skillTargetVo.targetArr.length > 8){
										break;
									}
								}
							}
						}
					}
				}
			}
		} 
		return skillTargetVo;
	}
	/**
	 * 获取怪物最近的敌人
	 * @param objVo 怪物Vo
	 */
	public getMonsterNearlyEnamy(objVo:BaseFightObjVo):BaseFightObjVo{
		var target:BaseFightObjVo;
		var dis:number = 10000;
		var tdis:number;
		for(let key in this._scenePlayerVoDic){
			let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE)){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		for(let key in this._scenePartnerVoDic){
			let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE)){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		for(let key in this._scenePetVoDic){
			let vo:BaseFightObjVo= this._scenePetVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE)){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		if(target){return target;}
		return null;
	}
	/**
	 * 获取怪物最近的搭档
	 * @param objVo 怪物Vo
	 */
	public getMonsterNearlyPartner(objVo:BaseFightObjVo):BaseFightObjVo{
		var target:BaseFightObjVo;
		let dis:number = 10000;
		let tdis:number;
		for(let key in this._sceneMonsterVoDic){
			let vo:BaseFightObjVo= this._sceneMonsterVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && vo.objectId != objVo.objectId){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < 1024){
					dis = tdis;
					target = vo;
				}
			}
		}
		if(target){return target;}
		return null;
	}
	//------------------------怪物技能目标相关---------END------
	
	/**RPG用
	 * 更新玩家技能伤害范围内目标
	 * @param atkVo 攻击者
	 * @param skillTargetVo 技能目标VO
	 */
	public updatePlayerHurtListByRange(atkVo:BaseFightObjVo,skillTargetVo:FSkillTargetVo):FSkillTargetVo{
		if(skillTargetVo.targetArr == null || skillTargetVo.targetArr.length <= 0){	
			return skillTargetVo;
		}
		var skillVo:FSkillVo = skillTargetVo.skillVo;
		//if(skillVo.targetType == SkillTargetType.SELF || skillVo.targetType == SkillTargetType.ENEMY){//自己或空放  自己的如果是群体也要使用群体功能
		if(skillVo.targetType == SkillTargetType.EMPTY){//空放
			return skillTargetVo;
		}else if(skillVo.atkRangeType == SkillAtkRangeType.R_SINGLE){//单体
			if(atkVo.type == SceneObjectType.PLAYER){
				var pp:ScenePlayerVo = atkVo as ScenePlayerVo;
				if(pp.id == RoleManager.getInstance().getMainHeroId()){
					var tar:BaseFightObjVo = skillTargetVo.targetArr[0];
					App.EventSystem.dispatchEvent(SceneEventType.SHOW_SKILL_RANG_GRIDS,[[tar.gridX,tar.gridY]]);
				}
			}
			return skillTargetVo;
		}else{//近身群体（以自己为参照坐标）和远程群体（以第一个目标为参照坐标）
			var tarVo:BaseFightObjVo = skillTargetVo.targetArr[0];
			var dire8:number = SceneUtil.getDirectByPoint(tarVo.posX,tarVo.posY,atkVo.posX,atkVo.posY).dire8;
			var rangeList:Array<Array<number>> = SceneUtil.getSkillRangeGrids(skillVo.atkRangeId,dire8);
			if(rangeList){
				var testRang:Array<Array<number>> = [];
				var atkGridX:number;
				var atkGridY:number;
				var nx:number;
				var ny:number;
				var rangValue:Array<number>;
				var gridDic:any;
			
				if(skillVo.atkRangeType == SkillAtkRangeType.R_N_GROUP){
					atkGridX = atkVo.gridX;
					atkGridY = atkVo.gridY
				}else{
					atkGridX = tarVo.gridX;
					atkGridY = tarVo.gridY
				}
				var firstTargetid:number = tarVo.objectId;
				var vo:BaseFightObjVo;
				if(skillVo.targetType == SkillTargetType.ENEMY){ 	//玩家的敌人是怪物和pk模式过滤的玩家，伙伴，宠物
					for(let i:number = 0;i<rangeList.length;i++){
						rangValue = rangeList[i];
						nx = atkGridX +rangValue[0];
						ny = atkGridY +rangValue[1];
						gridDic = this.getGridTablePosObj(nx,ny);
						testRang.push([nx,ny]);
						if(gridDic){
							for(let k in gridDic){
								vo = gridDic[k];
								if(vo.objectId != atkVo.objectId && vo.actState != ActState.DEAD &&  vo.objectId != firstTargetid && atkVo.mainOwnerId != vo.mainOwnerId){
									//玩家的敌人是所有玩家，伙伴，宠物 //(vo.objectId != atkVo.objectId && 不需要，不是同一场景类型)
									if(vo.type == SceneObjectType.MONSTER){
										skillTargetVo.targetArr.push(vo);
									}else if((vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER || vo.type == SceneObjectType.PLAYERCOPY) && this.isPkTarget(atkVo,vo,SkillTargetType.ENEMY)){
										skillTargetVo.targetArr.push(vo);
									}
									if(skillTargetVo.targetArr.length > 8){
										break;
									}
								}
							}
						}
					}
				}else if(skillVo.targetType == SkillTargetType.PARTNER){ 	//玩家的伙伴是pk模式过滤的玩家，伙伴，宠物 //搭档类型也包括自己，自己类型也包括搭档
					for(let i:number = 0;i<rangeList.length;i++){
						rangValue = rangeList[i];
						nx = atkGridX +rangValue[0];
						ny = atkGridY +rangValue[1];
						gridDic = this.getGridTablePosObj(nx,ny);
						testRang.push([nx,ny]);
						if(gridDic){
							for(let k in gridDic){
								vo = gridDic[k];
								//if((vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER) && vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid && this.isPkTarget(atkVo,vo,SkillTargetType.PARTNER)){
								if((vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER || vo.type == SceneObjectType.PLAYERCOPY) && vo.actState != ActState.DEAD  && vo.objectId != firstTargetid && this.isPkTarget(atkVo,vo,SkillTargetType.PARTNER)){
									skillTargetVo.targetArr.push(vo);
									if(skillTargetVo.targetArr.length > 8){
										break;
									}
								}
							}
						}
					}
				}
				if(atkVo.type == SceneObjectType.PLAYER){
					var pp:ScenePlayerVo = atkVo as ScenePlayerVo;
					if(pp.id == RoleManager.getInstance().getMainHeroId()){
						App.EventSystem.dispatchEvent(SceneEventType.SHOW_SKILL_RANG_GRIDS,testRang);
					}
				}
			}
		} 
		return skillTargetVo;
	}

	/**
	 * RPG用
	 * 是否是该对象Pk目标
	 * @param targetType 攻击目标类型 搭档和敌方
 	 */
	public isPkTarget(atkVo:BaseFightObjVo,targetVo:BaseFightObjVo,targetType:number):boolean{
		if(targetType == SkillTargetType.ENEMY){ //敌方
			if(atkVo.type == SceneObjectType.MONSTER ){
				//怪物敌人
				if(targetVo.type != SceneObjectType.MONSTER){return true;}else{return false;}
			}else{
				//玩家，伙伴，宠物的 敌人
				if(targetVo.type == SceneObjectType.MONSTER){
					return true;//怪绝对是 玩家，伙伴，宠物的敌人
				}else{
					//玩家伙伴宠物通过pk模式来判断是否是攻击对象
					return this.curPkModeIsTarget(atkVo,targetVo,true);
				}
			}
		}else if(targetType == SkillTargetType.PARTNER){//队友
			if(atkVo.type == SceneObjectType.MONSTER ){
				//怪物队友
				if(targetVo.type == SceneObjectType.MONSTER){return true;}else{return false;}
			}else{
				//玩家，伙伴，宠物的 搭档
				if(targetVo.type == SceneObjectType.MONSTER){
					return false;//玩家，伙伴，宠物的队友不会是怪
				}else{
					//玩家伙伴宠物通过pk模式来判断是否是攻击对象
					return (this.curPkModeIsTarget(atkVo,targetVo,false) == false);
				}
			}
		}
		return false;
	}

	/**RPG用
	 * 获取玩家最近的敌人
	 */
	public getPlayerNearlyEnamy(objVo:BaseFightObjVo):BaseFightObjVo{
		var target:BaseFightObjVo;
		var dis:number = 10000;
		var maxDis:number = 2560;
		var tdis:number;
		if(objVo.type == SceneObjectType.PLAYER){
			maxDis = 100000;
		}
		for(let key in this._sceneMonsterVoDic){
			let vo:BaseFightObjVo= this._sceneMonsterVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < maxDis){
					dis = tdis;
					target = vo;
				}
			}
		}
		if(objVo.pkMode == PKModeType.PEACE){
			//如果是和平模式
			return target;
		}
		maxDis = 2560;
		for(let key in this._scenePlayerVoDic){
			let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) &&  objVo.objectId != vo.objectId && objVo.mainOwnerId != vo.mainOwnerId && this.curPkModeIsTarget(objVo,vo,true)){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < maxDis){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		for(let key in this._scenePartnerVoDic){
			let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && objVo.mainOwnerId != vo.mainOwnerId && this.curPkModeIsTarget(objVo,vo,true)){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < maxDis){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		for(let key in this._scenePetVoDic){
			let vo:BaseFightObjVo= this._scenePetVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && objVo.mainOwnerId != vo.mainOwnerId && this.curPkModeIsTarget(objVo,vo,true)){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < maxDis){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		for(let key in this._scenePlayerCopyVoDic){
			let vo:BaseFightObjVo= this._scenePlayerCopyVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && objVo.mainOwnerId != vo.mainOwnerId && this.curPkModeIsTarget(objVo,vo,true)){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < maxDis){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		return target;
	}

	/**RPG用
	 * 获取玩家最近的搭档
	 */
	public getPlayerNearlyPartner(objVo:BaseFightObjVo):BaseFightObjVo{
		var target:BaseFightObjVo;
		var dis:number = 10000;
		var maxDis:number = 2560;
		var tdis:number;
		for(let key in this._scenePlayerVoDic){
			let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && this.curPkModeIsTarget(objVo,vo,false)==false){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < maxDis){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		for(let key in this._scenePartnerVoDic){
			let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId  && this.curPkModeIsTarget(objVo,vo,false)==false){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < maxDis){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		for(let key in this._scenePetVoDic){
			let vo:BaseFightObjVo= this._scenePetVoDic[key];
			if(vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId  && this.curPkModeIsTarget(objVo,vo,false)==false){
				tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
				if(tdis < dis && tdis < maxDis){//怪物要判断巡逻距离
					dis = tdis;
					target = vo;
				}
			}
		}
		if(target){return target;}
		return null;
	}

	/**
	 * RPG用
	 * 当前pk模式下玩家，伙伴和宠物之间是否是攻击目标，能攻击是敌人，不能攻击是伙伴
	 */
	private curPkModeIsTarget(atkVo:BaseFightObjVo,tarVo:BaseFightObjVo,isEnemy:boolean):boolean{
		if(atkVo.pkMode == PKModeType.PEACE){//和平模式不能攻击
			return false;
		}else if(atkVo.pkMode == PKModeType.GOODEVIL){//善恶
			return tarVo.nameColor > 2; 
		}else if(atkVo.pkMode == PKModeType.ALL){//全体 ,全体攻击选择伙伴时只有自己的才是伙伴，其他的都是敌人
			if(isEnemy){
				return true; 
			}else{
				if(atkVo.mainOwnerId == tarVo.mainOwnerId){
					return true;
				}else{
					return false;
				}
			}
		}else if(atkVo.pkMode == PKModeType.TEAM){//组队
			if(atkVo.teamId == 0){
				return true;
			}
			return atkVo.teamId != tarVo.teamId; 
		}else if(atkVo.pkMode == PKModeType.GUILD){//行会
			if(atkVo.guildId == 0){
				return true;
			}
			return atkVo.guildId != tarVo.guildId; 
		}else if(atkVo.pkMode == PKModeType.UNION){//行会联盟
			if(atkVo.guildId == 0){
				return true;
			}
			//这个需要注意一下，挂机不能用
			return (atkVo.guildId != tarVo.guildId && this.isGuildUnion(tarVo.guildId)); 
		}else if(atkVo.pkMode == PKModeType.ENEMY){//仇人模式
			 if(this.isInEnemyList(tarVo.id) || this.isInEnemyList(tarVo.ownerId)){
				 return true;
			 }
            return false
		}
		return false;
	}

	/**
	 * 获取自身玩家Vo
	 */
	public getSelfPlayerVo():any{
		return this._scenePlayerVoDic[RoleManager.getInstance().getMainHeroId()];
	}

	/**
	 * 获取当前格子值
	 */
	public curGridValue(gx:number,gy:number):number{
		return this.mapGrid[gy][gx];
	}
	/**
	 * 获取当前格可移动
	 */
	public curGridIsOpen(gx:number,gy:number):boolean{
		if(gx>=0 && gx< this.gridXNum && gy >=0 && gy< this.gridYNum){
			//return true;
			return (this.mapGrid[gy][gx] != 1) ;
		}
		return false;
	}
	/**
	 * 获取当前格半透明
	 */
	public curGridAlpha(gx:number,gy:number):boolean{
		return (this.mapGrid[gy] && this.mapGrid[gy][gx] > 0) ;
	}
	

	public get sceneNpcVoDic():any{
		return this._sceneNpcVoDic;
	}
	public get sceneMonsterVoDic():any{
		return this._sceneMonsterVoDic;
	}
	public get scenePetVoDic():any{
		return this._scenePetVoDic;
	}
	public get scenePartnerVoDic():any{
		return this._scenePartnerVoDic;
	}
	public get scenePlayerVoDic():any{
		return this._scenePlayerVoDic;
	}
	public get scenePlayerCopyVoDic():any{
		return this._scenePlayerCopyVoDic;
	}
	public get sceneItemVoDic():any{
		return this._sceneItemVoDic;
	}
	public get sceneCollectVoDic():any{
		return this._sceneCollectVoDic;
	}
	public get sceneSkillEffVoDic():any{
		return this._sceneSkillEffVoDic;
	}
	/**
	 * 获取场景对象Vo
	 * @param objId 场景对象Id
	 * @param objType 场景对象类型
	 */
	public getSceneObjectVo(objId:number,objType:number):any{
		if(objType == SceneObjectType.NPC){
			return this._sceneNpcVoDic[objId];
		}else if(objType == SceneObjectType.MONSTER){
			return this._sceneMonsterVoDic[objId];
		}else if(objType == SceneObjectType.PET){
			return this._scenePetVoDic[objId];
		}else if(objType == SceneObjectType.PLAYER){
			return this._scenePlayerVoDic[objId];
		}else if(objType == SceneObjectType.PLAYERCOPY){
			return this._scenePlayerCopyVoDic[objId];
		}else if(objType == SceneObjectType.PARTNER){
			return this._scenePartnerVoDic[objId];
		}else if(objType == SceneObjectType.ITEM){
			return this._sceneItemVoDic[objId];
		}else if(objType == SceneObjectType.SKILLEFF){
			return this._sceneSkillEffVoDic[objId];
		}else if(objType == SceneObjectType.COLLECT){
			return this._sceneCollectVoDic[objId];
		}
		return null;
	}
	/**
	 * 获取玩家VO
	 * objId 对象ID
	 */
	public getPlayerVo(objId:number):ScenePlayerVo{
		return this._scenePlayerVoDic[objId];
	}

	/**
	 * 添加场景对象Vo
	 * @param event 场景对象VO
	 */
	public addSceneObjectVo(event:any):void{
		let vo:BaseObjectVo = event as BaseObjectVo;
		if(vo.type == SceneObjectType.NPC){
			this._sceneNpcVoDic[vo.id] = vo;
		}else if(vo.type == SceneObjectType.MONSTER){
			this._sceneMonsterVoDic[vo.id] = vo;
		}else if(vo.type == SceneObjectType.PET){
			if(this._scenePetVoDic[vo.id] == null){
				//宠物ID添加到玩家上
				var ownerId:number = (vo as BaseFightObjVo).ownerId;
				if(ownerId && ownerId > 0 ){
					var ownerVo:BaseFightObjVo = this._scenePlayerVoDic[ownerId];
					if(ownerVo){
						ownerVo.addPetID(vo.id);
					}
				}
			}
			this._scenePetVoDic[vo.id] = vo;
		}else if(vo.type == SceneObjectType.PLAYER){
			this._scenePlayerVoDic[vo.id] = vo;
		}else if(vo.type == SceneObjectType.PLAYERCOPY){
			this._scenePlayerCopyVoDic[vo.id] = vo;
		}else if(vo.type == SceneObjectType.PARTNER){
			this._scenePartnerVoDic[vo.id] = vo;
		}else if(vo.type == SceneObjectType.ITEM){
			this._sceneItemVoDic[vo.id] = vo;
		}else if(vo.type == SceneObjectType.SKILLEFF){
			this._sceneSkillEffVoDic[vo.id] = vo;
		}else if(vo.type == SceneObjectType.COLLECT){
			this._sceneCollectVoDic[vo.id] = vo;
		}
	}
	/**
	 * 移除场景对象Vo
	 * @param event 场景对象VO
	 */
	public removeSceneObjectVo(event:any):void{
		let vo:BaseObjectVo = event as BaseObjectVo;
		if(vo.type == SceneObjectType.NPC){
			this.removeGridTablePos(vo);
			this._sceneNpcVoDic[vo.id] = null;
			delete this._sceneNpcVoDic[vo.id];
		}else if(vo.type == SceneObjectType.MONSTER){
			this.removeGridTablePos(vo);
			this._sceneMonsterVoDic[vo.id] = null;
			delete this._sceneMonsterVoDic[vo.id];
		}else if(vo.type == SceneObjectType.PET){
			this.removeGridTablePos(vo);

			if(this._scenePetVoDic[vo.id]){
				//删除宠物ID在玩家上
				var ownerId:number = (vo as BaseFightObjVo).ownerId;
				if(ownerId && ownerId > 0 ){
					var ownerVo:BaseFightObjVo = this._scenePlayerVoDic[ownerId];
					if(ownerVo){
						ownerVo.removePetID(vo.id);
					}
				}
			}

			this._scenePetVoDic[vo.id] = null;
			delete this._scenePetVoDic[vo.id];
		}else if(vo.type == SceneObjectType.PLAYER){
			this.removeGridTablePos(vo);
			this._scenePlayerVoDic[vo.id] = null;
			delete this._scenePlayerVoDic[vo.id];
		}else if(vo.type == SceneObjectType.PLAYERCOPY){
			this.removeGridTablePos(vo);
			this._scenePlayerCopyVoDic[vo.id] = null;
			delete this._scenePlayerCopyVoDic[vo.id];
		}else if(vo.type == SceneObjectType.PARTNER){
			this.removeGridTablePos(vo);
			this._scenePartnerVoDic[vo.id] = null;
			delete this._scenePartnerVoDic[vo.id];
		}else if(vo.type == SceneObjectType.ITEM){
			this._sceneItemVoDic[vo.id] = null;
			delete this._sceneItemVoDic[vo.id];
		}else if(vo.type == SceneObjectType.SKILLEFF){
			this._sceneSkillEffVoDic[vo.id] = null;
			delete this._sceneSkillEffVoDic[vo.id];
		}else if(vo.type == SceneObjectType.COLLECT){
			this.removeGridTablePos(vo);
			this._sceneCollectVoDic[vo.id] = null;
			delete this._sceneCollectVoDic[vo.id];
		}
	}
	/**
	 * 移除场景对象Vo
	 * @param objId 场景对象Id
	 * @param objType 场景对象类型
	 */
	public removeSceneObjectVoById(objId:number,objType:number):any{
		if(objType == SceneObjectType.NPC){
			let vo:BaseObjectVo = this._sceneNpcVoDic[objId];
			this.removeGridTablePos(vo);
			this._sceneNpcVoDic[vo.id] = null;
			delete this._sceneNpcVoDic[vo.id];
		}else if(objType == SceneObjectType.MONSTER){
			let vo:BaseObjectVo = this._sceneMonsterVoDic[objId];
			this.removeGridTablePos(vo);
			this._sceneMonsterVoDic[vo.id] = null;
			delete this._sceneMonsterVoDic[vo.id];
		}else if(objType == SceneObjectType.PET){
			let vo:BaseObjectVo = this._scenePetVoDic[objId];
			this.removeGridTablePos(vo);
			this._scenePetVoDic[vo.id] = null;
			delete this._scenePetVoDic[vo.id];
		}else if(objType == SceneObjectType.PLAYER){
			let vo:BaseObjectVo = this._scenePlayerVoDic[objId];
			this.removeGridTablePos(vo);
			this._scenePlayerVoDic[vo.id] = null;
			delete this._scenePlayerVoDic[vo.id];
		}else if(objType == SceneObjectType.PLAYERCOPY){
			let vo:BaseObjectVo = this._scenePlayerCopyVoDic[objId];
			this.removeGridTablePos(vo);
			this._scenePlayerCopyVoDic[vo.id] = null;
			delete this._scenePlayerCopyVoDic[vo.id];
		}else if(objType == SceneObjectType.PARTNER){
			let vo:BaseObjectVo = this._scenePartnerVoDic[objId];
			this.removeGridTablePos(vo);
			this._scenePartnerVoDic[vo.id] = null;
			delete this._scenePartnerVoDic[vo.id];
		}else if(objType == SceneObjectType.ITEM){
			let vo:BaseObjectVo = this._sceneItemVoDic[objId];
			this._sceneItemVoDic[vo.id] = null;
			delete this._sceneItemVoDic[vo.id];
		}else if(objType == SceneObjectType.SKILLEFF){
			let vo:BaseObjectVo = this._sceneSkillEffVoDic[objId];
			this._sceneSkillEffVoDic[vo.id] = null;
			delete this._sceneSkillEffVoDic[vo.id];
		}else if(objType == SceneObjectType.COLLECT){
			let vo:BaseObjectVo = this._sceneCollectVoDic[objId];
			this.removeGridTablePos(vo);
			this._sceneCollectVoDic[vo.id] = null;
			delete this._sceneCollectVoDic[vo.id];
		}
	}

	/**
	 * 获取该类型场景对象数量
	 * @param objType 对象类型
	 */
	public getSceneObjectNumber(objType:number):number{
		let objDic:any;
		if(objType == SceneObjectType.NPC){
			objDic =  this._sceneNpcVoDic;
		}else if(objType == SceneObjectType.MONSTER){
			objDic = this._sceneMonsterVoDic;
		}else if(objType == SceneObjectType.PET){
			objDic = this._scenePetVoDic;
		}else if(objType == SceneObjectType.PLAYER){
			objDic = this._scenePlayerVoDic;
		}else if(objType == SceneObjectType.PLAYERCOPY){
			objDic = this._scenePlayerCopyVoDic;
		}else if(objType == SceneObjectType.PARTNER){
			objDic = this._scenePartnerVoDic;
		}else if(objType == SceneObjectType.ITEM){
			objDic = this._sceneItemVoDic;
		}else if(objType == SceneObjectType.SKILLEFF){
			objDic = this._sceneSkillEffVoDic;
		}else if(objType == SceneObjectType.COLLECT){
			objDic = this._sceneCollectVoDic;
		}
		let num:number = 0;
		if(objDic){
			for(let key in objDic){
				num++;
			}
		}
		return num;
	}

	/**格子Vo */
	private getGridVo():SceneGridVo{
		if(this._gridVoPool.length >0){
			return this._gridVoPool.pop();
		}
		var vo:SceneGridVo = new SceneGridVo();
		return vo;
	}
	/**格子Vo */
	private addGridVo(vo:SceneGridVo){
		this._gridVoPool.push(vo);
	}


	/**
	 * 场景副本BossID
	 */
	public get bossSceneId():number{
		return this._bossSceneId;
	}
	/**
	 * 地图资源ID
	 */
	public get mapResId():number{
		return this._mapResId;
	}
	/**
	 * 场景Id
	 */
	public get sceneId():number{
		return this._sceneId;
	}

	/**
	 * 场景类型 
	 */
	public get sceneType():number{
		return this._sceneType;
	}

	/**
	 * 帮会联盟字典
	 */
	public set guildUnionDic(value:any){
		this._guildUnionDic = value;
	}
	/**
	 * 是否帮会联盟
	 */
	public isGuildUnion(guildId:number):boolean{
		if(this._guildUnionDic[guildId]){
			return true;
		}
		return false;
	}

	/**
	 * 仇人列表字典
	 */
	public set enemyIdDic(value:any){
		this._enemyIdDic = value;
	}
	/**
	 * 是否帮会联盟
	 */
	public isInEnemyList(id:number):boolean{
		if(this._enemyIdDic[id]){
			return true;
		}
		return false;
	}
}


class SceneGridVo {
	public length:number = 0;
	private _dic:any = {};

	public add(vo:BaseObjectVo){
		if(this._dic[vo.objectId] == null){
			this._dic[vo.objectId] = vo;
			this.length = this.length +1;
		}
	}
	public remove(vo:BaseObjectVo){
		if(this._dic[vo.objectId]){
			this._dic[vo.objectId] = null;
			delete this._dic[vo.objectId]
			this.length = this.length -1;
		}
	}
	public removeById(objectId:number){
		if(this._dic[objectId]){
			this._dic[objectId] = null;
			delete this._dic[objectId]
			this.length = this.length -1;
		}
	}

	public get gridObj():any{
		return this._dic;
	}

    /**清理*/
    public clear(): void {
		this.length = 0;
		this._dic = {};
    }
}