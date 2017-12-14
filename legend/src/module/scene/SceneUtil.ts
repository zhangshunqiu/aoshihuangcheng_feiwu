/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景通用函数 2017/06/20
 */
class SceneUtil {
	public constructor() {
	}

	/**
	 * 获取是否boss场景
	 */
	public static isBossScene(sceneId:number):boolean {
		if(sceneId > 40000){
			return true;
		}
		return false;
	}

	/**
	 * 获取是否是活动场景
	 */
	public static isActivityScene(sceneId:number):boolean {
		if(sceneId < 40000 && sceneId >= 30000){
			return true;
		}
		return false;
	}
	/**
	 * 获取是否是挂机场景
	 */
	public static isHookScene(sceneId:number):boolean {
		if(sceneId < 30000 && sceneId >= 20000){
			return true;
		}
		return false;
	}
	/**
	 * 是否是主场景
	 * SceneUtil.isMainScene(SceneModel.getInstance().sceneId)
	 */
	public static isMainScene(sceneId:number):boolean{
		if(sceneId == MAIN_CITY_SCENE_ID){
			return true;
		}
		return false;
	}
	/**
	 * 是否是世界boss场景
	 */
	public static isWorldBossScene(sceneId:number):boolean{
		if(sceneId < 30600 && sceneId >=30500) {
			return true;
		}
		return false;
	}
	/**
	 * 获取自动技能顺序列表
	 */
	public static getAutoSkillList(carrer:number):Array<number> {
		switch(carrer){
			case CareerType.SOLDIER:
				return AutoSkillConfig[1];
			case CareerType.MAGES:
				return AutoSkillConfig[2];
			case CareerType.TAOIST:
				return AutoSkillConfig[3];
			//default:return 50000;
		}
		return AutoSkillConfig[0];
	}
	/**
	 * 获取默认技能
	 */
	public static getDefaultSkill(carrer:number):number {
		switch(carrer){
			case CareerType.SOLDIER:
				return 10000 ;//10300;
			case CareerType.MAGES:
				return 20000;//20400;
			case CareerType.TAOIST:
				return 30000;
			default:return 50000;
		}
		//return 50000;
	}

	/**
	 * 根据两点计算他们的方向
	 */
	public static getDirectByPoint(ex1:number,ey1:number,bx2:number,by2:number):DireScale {
		var hudu:number = Math.atan2(by2-ey1,bx2-ex1);
        var jd:number = 180 * hudu / Math.PI;
		if(jd <= -157.5 ||(jd <= 180 && jd > 157.5)){//右
			return DireScaleType3;//new DireScale(3,1,3);//{dire:3,scale:1};
		}else if(jd <= 157.5 && jd > 112.5){//右上
			return DireScaleType2;//new DireScale(2,1,2);//{dire:2,scale:1};
		}else if(jd <= 112.5 && jd > 67.5){ //上
			return DireScaleType1;//new DireScale(1,1,1);//{dire:1,scale:1};
		}else if(jd <= 67.5 && jd > 22.5){//左上
			return DireScaleType8;//new DireScale(2,-1,8);//{dire:2,scale:-1};//8;
		}else if((jd <= 22.5 && jd >= 0) || (jd <= 0 && jd > -22.5)){//左
			return DireScaleType7;//new DireScale(3,-1,7);//{dire:3,scale:-1};//7;
		}else if(jd <= -22.5 && jd > -67.5){//左下
			return DireScaleType6;//new DireScale(4,-1,6);//{dire:4,scale:-1};//6;
		}else if(jd <= -67.5 && jd > -112.5){//下
			return DireScaleType5;//new DireScale(5,1,5);//{dire:5,scale:1};
		}else if(jd <= -112.5 && jd > -157.5){//右下
			return DireScaleType4;//new DireScale(4,1,4);//{dire:4,scale:1};
		}
        return DireScaleType1;//new DireScale(1,1,1);
    }
	/**
	 * 根据方向获取度
	 */
	public static getAngByDirect(dire8:number):number {
		return DireAngleType[dire8];
    }
	/**
	 * 角色反方向
	 */
	public static getReversedDireScale(dire8:number):DireScale {
		return DireScaleReverseType[dire8];
	}


	/**
	 * 根据方向返回Xcale值
	 */
	public static getModelXCale(direct:number):number {
		if(direct == 6 || direct == 7 || direct == 8){
			return -1;
		}
        return 1;
    }

	 /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getDistance(p1X:number, p1Y:number, p2X:number, p2Y:number):number {
        var disX:number = p2X - p1X;
        var disY:number = p2Y - p1Y;
        var disQ:number = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    }

	 /**
     * 获取两点间附近的点（只有上下左右）
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getNearbyPoint(bX:number, bY:number, eX:number, eY:number,offset:number = 64):point {
		var minX:number = eX;
		var minY:number = eY;
		var tempdis:number = 0;
		//左方
		var nX:number = eX - offset;
		var nY:number = eY;
		minX = nX;
		minY = nY;
		var dis:number = this.getDistance(bX,bY,nX,nY);
		//右方
		nX = eX +offset;
		tempdis = this.getDistance(bX,bY,nX,nY);
		if(tempdis < dis){
			dis = tempdis;
			minX = nX;
			minY = nY;
		}

		//下方
		nX = eX;
		nY = eY+offset;
		tempdis = this.getDistance(bX,bY,nX,nY);
		if(tempdis < dis){
			dis = tempdis;
			minX = nX;
			minY = nY;
		}
		//上方
		nX = eX;
		nY = eY - offset;
		tempdis = this.getDistance(bX,bY,nX,nY);
		if(tempdis < dis){
			dis = tempdis;
			minX = nX;
			minY = nY;
		}
		return new point(nX,nY);
    }

	/**
	 * 获取两点连线上的点，从起点到结束点上的偏移量计算
	 */
	public static getLinePoint(bX:number, bY:number, eX:number, eY:number,offset:number = 64):point {
		var ang:number = Math.atan2(eY-bY,eX-bX);
		var ang:number = Math.atan2(bY - eY,bX - eX);
		return new point(bX-Math.cos(ang)*offset,bY-Math.sin(ang)*offset);
	}

	/**
	 * 角色方向向前延伸点
	 */
	public static getRoleLengthenPos(direScale:DireScale, xx:number, yy:number,offset:number = 300):point {
		var ang:number = this.getAngByDirect(direScale.dire8);
		return new point(xx-Math.cos(ang)*offset,yy-Math.sin(ang)*offset);
	}

	/**
	 * X轴像素点转格子
	 */
	public static pixelToGridX(value:number):number{
		return Math.floor(value/SceneModel.GRIDW);
	}
	/**
	 * Y轴像素点转格子
	 */
	public static pixelToGridY(value:number):number{
		return Math.floor(value/SceneModel.GRIDH);
	}

	/**
	 * X轴格子转像素点
	 */
	public static gridToPixelX(value:number):number{
		return (value*SceneModel.GRIDW + SceneModel.GRIDW/2);
	}
	/**
	 * Y轴格子转像素点
	 */
	public static gridToPixelY(value:number):number{
		return (value*SceneModel.GRIDH + SceneModel.GRIDH/2);
	}


	/**
	 *  获取当前格子偏移格子数后后离目标格子最近的可行走格子
	 * @param curGX 当前格子X
	 * @param curGY 当前格子Y
	 * @param tarGridX 目标格子X
	 * @param tarGridY 目标格子Y
	 * @param return Array<number>
	 */
	public static getNearMoveGridByGridNum(curGX:number,curGY:number,tarGridX:number,tarGridY:number,GridNum:number):Array<number>
	{
		if(GridNum <= 1){
			var offsetList:Array<Array<number>> = EightDireGridOffSet1;
		}else if(GridNum == 2){
			var offsetList:Array<Array<number>> = EightDireGridOffSet2;
		}else if(GridNum ==3){
			var offsetList:Array<Array<number>> = EightDireGridOffSet3;
		}else if(GridNum >=4){
			var offsetList:Array<Array<number>> = EightDireGridOffSet4;
		}
		var sceneModel:SceneModel = SceneModel.getInstance();
		var dis:number = 10000;
		var tgx:number;
		var tgy:number; 
		var tdis:number;
		var ngx:number;
		var ngy:number; 
		for(let k:number = 1;k<offsetList.length;k++){
			var offset:Array<number> = offsetList[k];
			tgx = curGX +offset[0];
			tgy = curGY +offset[1];
			if(sceneModel.curGridIsOpen(tgx,tgy) && sceneModel.getGridTableHasObj(tgx,tgy) == false){
				tdis = SceneUtil.getDistance(tgx,tgy,tarGridX,tarGridY);
				if(tdis < dis){
					dis = tdis;
					ngx = tgx;
					ngy = tgy;
				}
			}
		}
		if(ngx != null && ngy != null){
			return [ngx,ngy];
		}else if(ngx == null && ngy == null && GridNum > 2){
			return this.getNearMoveGridByGridNum(curGX,curGY,tarGridX,tarGridY,GridNum - 1);
		}
		return null;
	}

	/**
	 *  获取当前格子周围8格离目标格子最近的可行走格子
	 * @param curGX 当前格子X
	 * @param curGY 当前格子Y
	 * @param tarGridX 目标格子X
	 * @param tarGridY 目标格子Y
	 * @param return Array<number>
	 */
	public static getRoundWalkGridToTarget(curGX:number,curGY:number,tarGridX:number,tarGridY:number):Array<number>
	{
		var sceneModel:SceneModel = SceneModel.getInstance();
		var dire8:number;
		if(tarGridX > curGX){
			if(tarGridY < curGY){
				dire8 = 2;
			}else if(tarGridY > curGY){
				dire8 = 4;
			}else{
				dire8 = 3;
			}
		}else if(tarGridX < curGX){
			if(tarGridY < curGY){
				dire8 = 8;
			}else if(tarGridY > curGY){
				dire8 = 6;
			}else{
				dire8 = 7;
			}
		}else{
			if(tarGridY < curGY){
				dire8 = 1;
			}else if(tarGridY > curGY){
				dire8 = 5;
			}else{
				dire8 = 0;
			}
		};
		var offset:Array<number> = EightDireGridOffSet1[dire8];
		var tgx:number = curGX +offset[0];
		var tgy:number = curGY +offset[1];
		if(sceneModel.curGridIsOpen(tgx,tgy) && sceneModel.getGridTableHasObj(tgx,tgy) == false){
			return [tgx,tgy];
		}else{
			var dis:number = 10000;
			var tdis:number;
			var ngx:number;
			var ngy:number; 
			for(let k:number = 1;k<EightDireGridOffSet1.length;k++){
				var offset:Array<number> = EightDireGridOffSet1[k];
				tgx = curGX +offset[0];
				tgy = curGY +offset[1];
				if( k != dire8 && sceneModel.curGridIsOpen(tgx,tgy) && sceneModel.getGridTableHasObj(tgx,tgy) == false){
					tdis = SceneUtil.getDistance(tgx,tgy,tarGridX,tarGridY);
					if(tdis < dis){
						dis = tdis;
						ngx = tgx;
						ngy = tgy;
					}
				}
			}
			if(ngx != null && ngy != null){
				return [ngx,ngy];
			}
		}
		return null;
	}
	
	/**
	 *  获取周围可移动的一格
	 * @param curGX 当前格子X
	 * @param curGY 当前格子Y
	 * @param dire8 方向 ,优先取该方向的格子
	 * @param return Array<number>
	 */
	public static getRoundWalkGrid(curGX:number,curGY:number,dire8:number=0):Array<number>
	{
		var sceneModel:SceneModel = SceneModel.getInstance();
		var offset:Array<number> = EightDireGridOffSet1[dire8];
		var tgx:number = curGX +offset[0];;
		var tgy:number = curGY +offset[1];
		if(dire8 > 0 && sceneModel.curGridIsOpen(tgx,tgy) && sceneModel.getGridTableHasObj(tgx,tgy) == false){
			return [tgx,tgy];
		}else{
			for(let k:number = 1;k<EightDireGridOffSet1.length;k++){
				var offset:Array<number> = EightDireGridOffSet1[k];
				tgx = curGX +offset[0];
				tgy = curGY +offset[1];
				if( k != dire8 && sceneModel.curGridIsOpen(tgx,tgy) && sceneModel.getGridTableHasObj(tgx,tgy) == false){
					return [tgx,tgy];
				}
			}
		}
		return null;
	}

	/**
	 * 获取技能伤害范围
	 * @param rangeId 范围ID
	 * @param dire 方向 
	 */
	public static getSkillRangeGrids(rangeId:number,dire:number):Array<Array<number>>{
		var rang:Array<Array<Array<number>>> = SkillAtkRange[String("range"+rangeId)];
		if(rang){
			if(rang.length > 1){
				return rang[dire];
			}else{
				return rang[0];
			}
		}
		return null ;
		// if(atkRangeType == SkillAtkRangeType.R_N_GROUP){ //近身群体
		// }else if(atkRangeType == SkillAtkRangeType.R_N_GROUP){//远程群体
		// }
		// return null;
	}
}


class DireScale{
	private _dire8:number;
	private _dire:number;
	private _scale:number;

	public get dire8():number{
		return this._dire8;
	}
	public get dire():number{
		return this._dire;
	}
	public get scale():number{
		return this._scale;
	}
	public constructor(d:number,s:number,d8:number) {
		this._dire = d;
		this._scale = s;
		this._dire8 = d8;
	}
}

class point{
	public x:number;
	public y:number;
	public constructor(xx:number,yy:number) {
		this.x = xx;
		this.y = yy;
	}
}