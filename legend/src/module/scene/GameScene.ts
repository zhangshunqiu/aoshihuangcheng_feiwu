/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 游戏场景 2017/06/20.
 */
class GameScene extends egret.DisplayObjectContainer {
	private _centerHalfW:number = 64;
	private _centerHalfH:number = 96;
	private _playerId:number = 0;
	private _updateTimes:number = 0;
	private _sceneManager:SceneManager = SceneManager.getInstance();
	private _eventSystem:EventSystem = EventSystem.getInstance();
	private _sceneModel:SceneModel = SceneModel.getInstance();
	private _globalModel:GlobalModel = GlobalModel.getInstance();

	private _loadReslist:Array<Array<string>>;//加载资源列表
	private _batchResLoad:BatchResLoad;//场景批量资源加载器

	private _stageHalfWidth:number = this._sceneModel.sceneStageW/2;//App.stageWidth/2;
	private _stageHalfHeight:number = this._sceneModel.sceneStageH/2;//App.stageHeight/2;
	private _scheduleId:number = 0;//调度ID

	private _sceneInitEventId:number = 0;

	//游戏层次
	private _miniMapLayer: eui.Image;  //地图背景
	//private _mapLayer: map.SceneMap; //地图层
	private _elementLayer : egret.DisplayObjectContainer; //元素层
	private _bottomEffLayer: egret.DisplayObjectContainer; //效果层
	private _objectLayer: egret.DisplayObjectContainer; //角色层
	private _objectUILayer: egret.DisplayObjectContainer; //角色UI层
	private _hpTipsLay: egret.DisplayObjectContainer; //角色气血提示
	private _topEffLayer: egret.DisplayObjectContainer; //效果层

	private _sceneLoading:SceneLoading;//场景加载条
	//游戏层次END

	//游戏对象字典
	private _sceneNpcDic:any = {};//场景npc
	private _sceneMonsterDic:any = {};//场景怪
	private _scenePetDic:any = {};//场景怪
	private _scenePartnerDic:any = {};//伙伴
	private _scenePlayerDic:any = {};//玩家
	private _scenePlayerCopyDic:any = {};//玩家镜像
	private _sceneItemDic:any = {};//物品
	private _sceneCollectDic:any = {};//采集物 
	private _sceneSkillEffDic:any = {};//技能效果，像火墙

	//场景效果
	private _skillEffDic:any = {};//场景技能效果，飞行，群体技能效果等
	//气血提示
	private _hpTipsDic:any = {};

	//场景位置初始化
	private _scenePosInit:Boolean = false;
	//点击动画
	private _clickMc:AMovieClip = null;

	private _delayExecutionQueue:Array<any> = [];

	public constructor() {
		super();
		this._miniMapLayer = new eui.Image();
		//this._mapLayer = new map.SceneMap();
		this._elementLayer = new egret.DisplayObjectContainer();
		this._bottomEffLayer = new egret.DisplayObjectContainer();
		this._objectLayer = new egret.DisplayObjectContainer();
		this._hpTipsLay = new egret.DisplayObjectContainer();
		this._objectUILayer = new egret.DisplayObjectContainer();
		this._topEffLayer = new egret.DisplayObjectContainer();
		this.addChild(this._miniMapLayer);
		//this.addChild(this._mapLayer);
		this.addChild(this._elementLayer);
		this.addChild(this._bottomEffLayer);
		this.addChild(this._objectLayer);
		this.addChild(this._hpTipsLay);
		this.addChild(this._objectUILayer);
		this.addChild(this._topEffLayer);
		this.initListener();
		this._sceneManager.gameScene = this;
	}

	/**
	 * 初始化监听
	 */
	public initListener(){
		if(this._eventSystem.hasEventListener(SceneEventType.INIT_SCENE) == false && this._sceneInitEventId == 0){
			this._sceneInitEventId = this._eventSystem.addEventListener(SceneEventType.INIT_SCENE,this.initScene,this);
		}
		if(this._eventSystem.hasEventListener(SceneEventType.UPDATE_HONOR_TITLE) == false){
			this._eventSystem.addEventListener(SceneEventType.UPDATE_HONOR_TITLE,this.updateHonorTitle,this);
		}
		if(this._eventSystem.hasEventListener(SceneEventType.ADD_SCENE_OBJECT) == false){
			this._eventSystem.addEventListener(SceneEventType.ADD_SCENE_OBJECT,this.addSceneObject,this);
		}
		if(this._eventSystem.hasEventListener(SceneEventType.REMOVE_SCENE_OBJECT) == false){
			this._eventSystem.addEventListener(SceneEventType.REMOVE_SCENE_OBJECT,this.removeSceneObject,this);
		}
		if(this._eventSystem.hasEventListener(SceneEventType.SCENE_OBJECT_MOVE) == false){
			this._eventSystem.addEventListener(SceneEventType.SCENE_OBJECT_MOVE,this.sceneObjectMove,this);
		}
		if(this._eventSystem.hasEventListener(SceneEventType.UPDATE_SCENE_POS) == false){
			this._eventSystem.addEventListener(SceneEventType.UPDATE_SCENE_POS,this.updateScenePos,this);
		}
		// if(this._eventSystem.hasEventListener(SceneEventType.UPDATE_HP) == false){
		// 	this._eventSystem.addEventListener(SceneEventType.UPDATE_HP,this.onUpdateHp,this);
		// }
		if(this._eventSystem.hasEventListener(SceneEventType.SHOW_BODY_EFF) == false){
			this._eventSystem.addEventListener(SceneEventType.SHOW_BODY_EFF,this.showBodyEff,this);
		}
		if(this._eventSystem.hasEventListener(SceneEventType.SHOW_FLY_EFF) == false){
			this._eventSystem.addEventListener(SceneEventType.SHOW_FLY_EFF,this.showFlyEff,this);
		}
		if(this._eventSystem.hasEventListener(SceneEventType.SHOW_GROUP_EFF) == false){
			this._eventSystem.addEventListener(SceneEventType.SHOW_GROUP_EFF,this.showGroupEff,this);
		}

		if(this._eventSystem.hasEventListener(SceneEventType.PLAY_COLLISION) == false){
			this._eventSystem.addEventListener(SceneEventType.PLAY_COLLISION,this.playRoleCollision,this);
		}
		if(this._eventSystem.hasEventListener(SceneEventType.HOOK_SKILL_TRIGGER) == false){
			this._eventSystem.addEventListener(SceneEventType.HOOK_SKILL_TRIGGER,this.onHookSkillTrigger,this);
		}
		// if(this._eventSystem.hasEventListener(SceneEventType.SKILL_TRIGGER) == false){
		// 	this._eventSystem.addEventListener(SceneEventType.SKILL_TRIGGER,this.onSkillTrigger,this);
		// }
		if(this._eventSystem.hasEventListener(SceneEventType.UPDATE_OBJ_MODEL) == false){
			this._eventSystem.addEventListener(SceneEventType.UPDATE_OBJ_MODEL,this.updateObjModel,this);
		}
		if(this._eventSystem.hasEventListener(SceneEventType.HOOK_SPECIAL_SKILL_TRIGGER) == false){
			this._eventSystem.addEventListener(SceneEventType.HOOK_SPECIAL_SKILL_TRIGGER,this.onHookSpecialSkillTrigger,this);
		}

		if(this._eventSystem.hasEventListener(SceneEventType.SHOW_SKILL_RANG_GRIDS) == false){
			this._eventSystem.addEventListener(SceneEventType.SHOW_SKILL_RANG_GRIDS,this.showSkillRangeGrids,this);
		}
		this._stageHalfWidth = this._sceneModel.sceneStageW/2;//App.stageWidth/2;
		this._stageHalfHeight = this._sceneModel.sceneStageH/2;//App.stageHeight/2;
		this._playerId = RoleManager.getInstance().getMainHeroId();
	}

	
	/**
	 * 更新气血
	 */
	private onUpdateHp(vo:FSkillTargetVo){
		if(vo.targetArr){
			for(let i:number = 0;i<vo.targetArr.length;i++){
				let tvo:BaseFightObjVo = vo.targetArr[i];

				let hurtValue:number = Math.round((Math.random()-0.9)*200); 
				let hurtType:number = Math.round(Math.random()*4);
				if(hurtType == HpTipsType.CRIT){
					hurtValue = 0-Math.round(Math.random()*50+290)
				}else if(hurtType == HpTipsType.DODGE){
					hurtValue = 0
				}else if(hurtType == HpTipsType.REBOUND){
					hurtValue = Math.round(0-Math.random()*50)
				}
				tvo.curHp = tvo.curHp +hurtValue;
				let obj:SceneMonster = this.getSceneObject(tvo) as SceneMonster;
				if(obj){
					obj.updateHp();
					if(tvo.curHp >0){
						this.showHpTips(tvo.posX,tvo.posY,hurtValue,hurtType);
					}
				}
			}
		}
	}

	/**
	 * 显示气血提示
	 */
	private showHpTips(xx:number,yy:number,hp:number,hurtType:number=0){
		var tips:SceneTipsHp = ObjectPool.pop("SceneTipsHp");//new SceneTipsHp();//
		tips.setText(hp,hurtType);
		tips.moveTo(xx,yy);
		this._hpTipsDic[tips.id] = tips;
		this._hpTipsLay.addChild(tips);
	}

	/**
	 * 显示身上效果
	 */
	private showBodyEff(vo:FSkillTargetVo){
		for(let i:number = 0;i<vo.targetArr.length;i++){
			var obj:SceneMonster = this.getSceneObject(vo.targetArr[i]) as SceneMonster ;
			if(obj){
				obj.playGetHitEff(vo.skillVo);
			}
		}
	}
	/**
	 * 播放冲撞效果
	 */
	private playRoleCollision(vo:FSkillTargetVo){
		for(let i:number = 0;i<vo.targetArr.length;i++){
			var obj:SceneMonster = this.getSceneObject(vo.targetArr[i]) as SceneMonster;
			if(obj){
				obj.playBeCollision(2,vo.atkVo.dire.dire8);
			}
		}
	}

	/**
	 * 显示飞行效果
	 */
	private showFlyEff(vo:EffByPosVo){
		var view:SceneFlyEff = new SceneFlyEff(vo);
		this._objectLayer.addChild(view);
		this._skillEffDic[vo.id] = view;
	}
	/**
	 * 显示群体效果
	 */
	private showGroupEff(vo:EffByTimeVo){
		var view:SceneGroupEff = new SceneGroupEff(vo);
		this._topEffLayer.addChild(view);
		this._skillEffDic[vo.id] = view;
	}

	/**
	 * 初始化
	 */
	public initScene(data:any){
		if(data == null){
			this._sceneModel.debugMonsterNum = 25
		}
		this._playerId = RoleManager.getInstance().getMainHeroId();
		this.stopSchedule();
		this.showSceneLoading();
		this.clear();
		//this._mapLayer.clear();

		if(this._batchResLoad == null){
			this._batchResLoad = new BatchResLoad();
		}
		this._loadReslist = [[ResUrlUtil.getMapUrlById(this._sceneModel.mapResId),RES.ResourceItem.TYPE_IMAGE],[ResUrlUtil.getMapConfUrlById(this._sceneModel.mapResId),RES.ResourceItem.TYPE_JSON]];
		this._batchResLoad.loadUrl(this._loadReslist,this.loadResComplete,this,this.loadProgress)
		//处理好场景相关的东西后就this.startScene();
		//this.startScene();
	}

	/**
	 * 进度函数
	 */
	private loadProgress(cur:number,all:number){
		if(this._sceneLoading){
			this._sceneLoading.setProgress(cur,all);
		}
	}
	/**
	 * 资源加载成功
	 */
	private loadResComplete(data:any){
		var mapConf:any = data[ResUrlUtil.getMapConfUrlById(this._sceneModel.mapResId)];
		if(mapConf){
			this._sceneModel.updateSceneConfig(mapConf);
			App.logzsq("SCENE WIDTH = ", this._sceneModel.sceneWidth, this._sceneModel.sceneHeight);
			//this._mapLayer.init(this._sceneModel.mapResId,this._sceneModel.sceneWidth,this._sceneModel.sceneHeight);
		}
		var res:any = data[ResUrlUtil.getMapUrlById(this._sceneModel.mapResId)];
		if(res){
			this._miniMapLayer.source = res;
			//this._mapLayer.setMiniMap(res);
		}
		this._scenePosInit = false;
		this.startScene();
		
    //    for(let i=0;i<0;i++){
	// 	    let vo = new ScenePlayerVo();
	// 		vo.id = i+1000;
	// 		vo.name= "角色"+i;

	// 		vo.gridX = SceneModel.getInstance().getRandomGX();
	// 		vo.gridY = SceneModel.getInstance().getRandomGY();
	// 		vo.posX = SceneUtil.gridToPixelX(vo.gridX);
	// 		vo.posY =  SceneUtil.gridToPixelY(vo.gridY);
	// 		vo.patrolX = vo.posX;
	// 		vo.patrolY = vo.posY;
	// 		vo.pkMode = PKModeType.ALL;
	// 		if(i ==0){
	// 			vo.hp = 1000;
	// 			vo.curHp = 1000;
	// 		}
	// 	    SceneModel.getInstance().addSceneObjectVo(vo);
	// 		//(EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo);
	//    }


		for(let k in this._sceneModel.scenePlayerVoDic){
			this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,this._sceneModel.scenePlayerVoDic[k]);
		}
		for(let k in this._sceneModel.scenePlayerCopyVoDic){
			this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,this._sceneModel.scenePlayerCopyVoDic[k]);
		}
		for(let k in this._sceneModel.sceneNpcVoDic){
			this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,this._sceneModel.sceneNpcVoDic[k]);
		}
		for(let k in this._sceneModel.sceneMonsterVoDic){
			this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,this._sceneModel.sceneMonsterVoDic[k]);
		}
		for(let k in this._sceneModel.scenePetVoDic){
			this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,this._sceneModel.scenePetVoDic[k]);
		}
		for(let k in this._sceneModel.sceneItemVoDic){
			this._eventSystem.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,this._sceneModel.sceneItemVoDic[k]);
		}
		this._eventSystem.dispatchEvent(SceneEventType.SCENE_INIT_COMPLETE);
		//this._sceneModel.sceneId;
	
		  //zhanagshunqiu test Mc
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseTouch,this);

	   //Math.random()*SceneModel.getInstance().sceneWidth,Math.random()*SceneModel.getInstance().sceneHeight

		// var vo = new SceneItemVo();
		// SceneModel.getInstance().addSceneObjectVo(vo);
		// (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo);

		// var vo4 = new SceneCollectVo();
		// SceneModel.getInstance().addSceneObjectVo(vo4);
		// (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo4);
		
		// var vo3 = new SceneNpcVo();
		// SceneModel.getInstance().addSceneObjectVo(vo3);
		// (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo3);

		// var vo2 = new SceneSkillEffVo();
		// SceneModel.getInstance().addSceneObjectVo(vo2);
		// (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo2);
		 //zhanagshunqiu test Mc end

		 egret.setTimeout(function () {
                 this.closeSceneLoading();
            }, this, 500)
	}

	private ff:boolean = true;
    private mouseTouch(event:egret.TouchEvent){
        // var middleX:number = App.stageWidth/2;
        //var middleY:number = App.stageHeight/2;
        //var dire :any = SceneUtil.getDirectByPoint(event.localX,event.localY,middleX,middleY);
        //this._sceneNpcDic[1000].updateDirect(dire);
		//this._sceneNpcDic[1000].moveToPoint([event.localX,event.localY])
		var gx = SceneUtil.pixelToGridX(event.localX);
		var gy = SceneUtil.pixelToGridY(event.localY);
		var px:number = SceneUtil.gridToPixelX(gx);
		var py:number = SceneUtil.gridToPixelY(gy);
		var player:ScenePlayer = this._scenePlayerDic[this._playerId];
		if(player){
			var vo:BaseFightObjVo = player.vo;
			// var list:Array<any> = SceneModel.getInstance().getAStarGridPath(vo.gridX,vo.gridY,gx,gy);
			// if(list){
			// 	for(var i:number = 0;i<list.length;i++){
			// 		list[i][0] = SceneUtil.gridToPixelX(list[i][0]);
			// 		list[i][1] = SceneUtil.gridToPixelX(list[i][1]);
			// 	}
			// 	player.addMovePath(list);
			// }
			//this.showClickMc(px,py,(list == null));

			player.addMovePath([[px,py]]);
			this.showClickMc(px,py,true);
			
			App.logzsq("mouseTouch ",vo.getPetNum());
		}
		// if(this.ff){
		// 	App.EventSystem.dispatchEvent(PanelNotify.REMOVE_TOP_BTN, MainUIBtnType.FIRSTCHARGE);
		// 	this.ff = false;
		// }else{
		// 	App.EventSystem.dispatchEvent(PanelNotify.ADD_TOP_BTN, {id:MainUIBtnType.FIRSTCHARGE,index:1});
		// 	this.ff = true;
		// }
    }
	

	/**
	 * 场景开始
	 */
	private startScene(){
		this.stopSchedule();
		this._scheduleId = App.GlobalTimer.addFrameSchedule(this.update,this);
	}

	/**
	 * 场景停止
	 */
	private stopScene(){
		this.stopSchedule();
	}

	
	/**
	 * 场景更新
	 */
	private update(t:number):boolean{

		this._updateTimes++; 
		if(this._updateTimes%2==0){
			for(let key in this._hpTipsDic){
				var hptip:SceneTipsHp = this._hpTipsDic[key];
				if(hptip.update()){
				}else{
					hptip.destroy();
					this._hpTipsDic[key]= null;
					delete this._hpTipsDic[key];
				}
			}
		}
		var t:number = Date.now();
		if(this._updateTimes%2>=0){
		for(let key in this._sceneNpcDic){
			this._sceneNpcDic[key].update();
		}
		for(let key in this._sceneMonsterDic){
			this._sceneMonsterDic[key].update();
		}
		for(let key in this._scenePetDic){
			this._scenePetDic[key].update();
		}
		for(let key in this._scenePartnerDic){
			this._scenePartnerDic[key].update();
		}
		for(let key in this._scenePlayerDic){
			this._scenePlayerDic[key].update();
		}
		for(let key in this._scenePlayerCopyDic){
			this._scenePlayerCopyDic[key].update();
		}
		for(let key in this._sceneItemDic){
			this._sceneItemDic[key].update();
		}
		for(let key in this._sceneCollectDic){
			this._sceneCollectDic[key].update();
		}
		for(let key in this._sceneSkillEffDic){
			this._sceneSkillEffDic[key].update();
		}
		}
		// if(this._updateTimes%200>=0){
		// 		App.logzsq(Date.now()-t)
		// }

		let effobj:BaseEff;
		for(let key in this._skillEffDic){
			effobj = this._skillEffDic[key];
			if(effobj.update() == false){
				effobj.destroy();
				if(effobj.parent){
					effobj.parent.removeChild(effobj);
				}
				this._skillEffDic[key] = null;
				delete this._skillEffDic[key];
			}
		}

		if(this._updateTimes%40==1){
			var childList = this._objectLayer.$children;
			childList.sort((a,b)=>{
				if (a.y > b.y) {
					return 1;
				}
				return -1;
			});
			// var len:number = childList.length;
			// for(var i:number = 0; i< len;i++){
			// 	//this._objectLayer.setChildIndex(childList[i],999);
			// }
			// this._objectLayer.$children.forEach((value,index)=> {
			// 	this._objectLayer.setChildIndex(value,999);
			// },this);
		}

		if(this._updateTimes%250==1){
			this._sceneManager.update();
		}
		if(this._delayExecutionQueue.length >0){
			var f:any = this._delayExecutionQueue.shift();
			// this._delayExecutionQueue.push();
		}
		return true;
	}

	 /**
	  * 清理
	  */
	public clear(){
		this.stopSchedule();
		//this.closeSceneLoading();
		this._scenePosInit == false;
		this._delayExecutionQueue = [];
		if(this._batchResLoad){
			this._batchResLoad.destory();
			this._batchResLoad = null;
		}
		for(let key in this._sceneNpcDic){
			this.removeSceneObject(this._sceneNpcDic[key].vo);
		}
		for(let key in this._sceneMonsterDic){
			this.removeSceneObject(this._sceneMonsterDic[key].vo);
		}
		for(let key in this._scenePetDic){
			this.removeSceneObject(this._scenePetDic[key].vo);
		}
		for(let key in this._scenePartnerDic){
			this.removeSceneObject(this._scenePartnerDic[key].vo);
		}
		for(let key in this._scenePlayerDic){
			this.removeSceneObject(this._scenePlayerDic[key].vo);
		}
		for(let key in this._scenePlayerCopyDic){
			this.removeSceneObject(this._scenePlayerCopyDic[key].vo);
		}
		for(let key in this._sceneItemDic){
			this.removeSceneObject(this._sceneItemDic[key].vo);
		}
		for(let key in this._sceneCollectDic){
			this.removeSceneObject(this._sceneCollectDic[key].vo);
		}
		for(let key in this._sceneSkillEffDic){
			this.removeSceneObject(this._sceneSkillEffDic[key].vo);
		}

		var hptip:SceneTipsHp
		for(let key in this._hpTipsDic){
			hptip = this._hpTipsDic[key];
			hptip.destroy();
			this._hpTipsDic[key]= null;
		}
		this._hpTipsDic = {};
			
		var effobj:BaseEff;
		for(let key in this._skillEffDic){
			effobj = this._skillEffDic[key];
			effobj.destroy();
			if(effobj.parent){
				effobj.parent.removeChild(effobj);
			}
			delete this._skillEffDic[key];
		}
		this._skillEffDic = {};

		this._sceneManager.clear();

		if(this._loadReslist && this._loadReslist.length >0){
			for(let k:number = 0;k<this._loadReslist.length;k++){
				var url:string = this._loadReslist[k][0];
				RES.destroyRes(url);
			}

			this._loadReslist = [];
		}
	}

	/**
	 * 销毁
	 */
	public destroy(){
		this._eventSystem.removeEventListener(SceneEventType.UPDATE_HONOR_TITLE);
		this._eventSystem.removeEventListener(SceneEventType.ADD_SCENE_OBJECT);
		this._eventSystem.removeEventListener(SceneEventType.REMOVE_SCENE_OBJECT);
		this._eventSystem.removeEventListener(SceneEventType.SCENE_OBJECT_MOVE);
		if(this._sceneInitEventId != 0){
			this._eventSystem.removeEventListener(SceneEventType.INIT_SCENE,this._sceneInitEventId);
			this._sceneInitEventId = 0;
		}
		this._eventSystem.removeEventListener(SceneEventType.UPDATE_SCENE_POS);
		this._eventSystem.removeEventListener(SceneEventType.UPDATE_HP);
		this._eventSystem.removeEventListener(SceneEventType.SHOW_BODY_EFF);
		this._eventSystem.removeEventListener(SceneEventType.SHOW_FLY_EFF);
		this._eventSystem.removeEventListener(SceneEventType.SHOW_GROUP_EFF);
		this._eventSystem.removeEventListener(SceneEventType.PLAY_COLLISION);
		this._eventSystem.removeEventListener(SceneEventType.HOOK_SKILL_TRIGGER);
		this._eventSystem.removeEventListener(SceneEventType.UPDATE_OBJ_MODEL);
		this._eventSystem.removeEventListener(SceneEventType.HOOK_SPECIAL_SKILL_TRIGGER);
		this._eventSystem.removeEventListener(SceneEventType.SHOW_SKILL_RANG_GRIDS);
		this.clear();
		//this._mapLayer.clear();
	}

	/**
	 * 更新场景对象模型
	 * @param BaseObjectVo 对象VO
	 */
	private updateObjModel(vo:BaseObjectVo){
		if(vo){
			var obj:SceneBaseObj = this.getSceneObject(vo);
			if(obj){
				obj.updateAllModel();
			}
		}
	}
	/**
	 * 更新称号
	 * data = {objId=123,honorId=123}
	 */
	private updateHonorTitle(data:any){
		var vo:ScenePlayerVo = this._sceneModel.getPlayerVo(data.objId);
		if(vo){
			vo.honorTitleUrl = data.honorId+"_png";
			var obj:ScenePlayer = this.getSceneObject(vo);
			obj.updateHonorTitle();
		}
	}


	// optional	int32	skill_id	= 1;  // 技能id
	// 	optional	int32	cast_type	= 2;  // 施法者类型
	// 	optional	int32	cast_id		= 3;  // 施法者id
	// 	repeated	pbHookObj target_list = 4;// 受击者列表
	// 	optional	int32	x			= 5;  // 目标坐标x
	// 	optional	int32	y			= 6; // 目标坐标y

	// 	optional	int32	obj_type	=1;//对象类型
	// 	optional	int32	obj_id      =2;//对象id

	/**
	 * 挂机特殊技能动作，如野蛮冲撞，火环
	 */
	private onHookSpecialSkillTrigger(data:any){
		if(data.skill_id == SKILL_YMCZ_ID){//野蛮冲撞
			var atk:SceneMonster = this.getSceneObjectById(data.cast_id,data.cast_type);
			if(atk){
				atk.playCollision(2);
			}
			for(let i:number = 0;i<data.target_list.length;i++){
				var v:any = data.target_list[i];
				var obj:SceneMonster = this.getSceneObjectById(v.obj_id,v.obj_type);	
				if(obj){
					if(atk){
						obj.playBeCollision(2,atk.vo.dire.dire8);
					}else{
						obj.playBeCollision(2,SceneUtil.getReversedDireScale(obj.vo.dire.dire8).dire8);
					}
				}
			}
		}else if(data.skill_id == SKILL_KJHH_ID){//抗拒火环
			var atk:SceneMonster = this.getSceneObjectById(data.cast_id,data.cast_type);
			for(let i:number = 0;i<data.target_list.length;i++){
				var v:any = data.target_list[i];
				var obj:SceneMonster = this.getSceneObjectById(v.obj_id,v.obj_type);
				if(obj){
					if(atk){
						var dire:DireScale = SceneUtil.getDirectByPoint(obj.vo.posX,obj.vo.posY,atk.vo.posX,atk.vo.posY);
						obj.playBeCollision(2,dire.dire8);
					}else{
						obj.playBeCollision(2,SceneUtil.getReversedDireScale(obj.vo.dire.dire8).dire8);
					}
				}
			}
		}
	}

// 	message pbHookUseSkill{
// 		optional	int32	skill_id	= 1;  // 技能id
// 		optional	int32	cast_type	= 2;  // 施法者类型
// 		optional	int32	cast_id		= 3;  // 施法者id
// 		repeated	pbHookObj target_list = 4;// 受击者列表
// 		optional	int32	x			= 5;  // 目标坐标x
// 		optional	int32	y			= 6; // 目标坐标y
// }

	/**
	 * 挂机技能伤害
	 */
	private onHookSkillTrigger(data:any){
		var harm_list:Array<any> = data.harm_list;//伤害列表
		var d:any;
		var obj:SceneMonster;
		for(var i:number = 0;i<harm_list.length;i++){
			var d:any= harm_list[i];
			obj = this.getSceneObjectById(d.obj_id,d.obj_type);
			if(obj){
				let hurtType:number = d.harm_status;
				obj.vo.curHp = d.cur_hp;
				obj.vo.curMp = d.cur_mp;
				obj.updateHp();
				if(obj.vo.curHp >=0){
					this.showHpTips(obj.vo.posX,obj.vo.posY,0-d.harm_value,hurtType);
				}
			}
		}
		var buff_list:Array<any> = data.buff_list;//buff列表
		for(var i:number = 0;i<buff_list.length;i++){
			var d:any= buff_list[i];
			obj = this.getSceneObjectById(d.obj_id,d.obj_type);
			if(obj){
				var bvo:FBuffVo = new FBuffVo();
				bvo.initProto(d);
				if(d.buff_op == 1){//添加
					obj.vo.addBuff(bvo);
					obj.addBuff(bvo);
				}else if(d.buff_op == 2){//更新
					
				}else if(d.buff_op == 3){//删除
					obj.vo.removeBuff(bvo);
					obj.removeBuff(bvo);
				}
			}
		}
		var Cur_list:Array<any> = data.Cur_list; //回血列表
		for(var i:number = 0;i<Cur_list.length;i++){
			var d:any= Cur_list[i];
			obj = this.getSceneObjectById(d.obj_id,d.obj_type);
			if(obj){
				let hurtType:number = HpTipsType.ONLYHP;
				obj.vo.curHp = d.cur_hp;
				obj.vo.curMp = d.cur_mp;
				obj.updateHp();
				if(obj.vo.curHp >0){
					this.showHpTips(obj.vo.posX,obj.vo.posY,d.add_hp,hurtType);
				}
			}
		}
	}

	/**
	 * 设置玩家副本是否显示
	 */
	public setOtherPlayerVisible(b:boolean):void{
		for(var key in this._scenePlayerCopyDic){
			(this._scenePlayerCopyDic[key] as SceneBaseObj).visible = b;
		}
	}
	// /**
	//  * 释放技能返回rpg
	//  */
	// private onSkillTrigger(data){
	// 	//if(data.)
	// }

	// if(data.buff_list){
			
	// 	}
	// 	// repeated	pbSkillObj obj_list = 1; //目标列表
	// 	// repeated    pbSkillBuff buff_list=2; //buff列表
	// 	// repeated    pbSkillMove move_list=3; //移动列表
	// 	// repeated	pbSkillMove Konck_list=4;//击退列表 

	// 	optional	int32	obj_type	=1;//对象类型
	// 	optional	int32	obj_id      =2;//对象id
	// 	optional    int32	buff_op		=3;//buff操作:1 添加,2 更新,3 删除
	// 	optional    int32   buff_id		=4;//buff_id
	// 	optional	int32   buff_time   =5;//倒计时
	
	/**
	 * 场景对象移动
	 */
	private sceneObjectMove(data:any){
		var vo:BaseObjectVo = this._sceneModel.getSceneObjectVo(data.obj_id,data.obj_type);
		if(vo && vo.id != this._playerId){
			var obj:SceneMonster = this.getSceneObject(vo);
			if(obj){
				if(SceneUtil.getDistance(vo.posX,vo.posY,data.begin_x,data.begin_y) > 96){
					obj.updatePosition(data.begin_x,data.begin_y);
				}
				obj.playMove([[data.end_x,data.end_y]]);
			}
		}
	}


	public getSelfPlayer():ScenePlayer{
		return this._scenePlayerDic[RoleManager.getInstance().getMainHeroId()];
	}

	/**
	 * 获取场景对象
	 */
	public getSceneObject(vo:BaseObjectVo):any{
		if(vo.type == SceneObjectType.NPC){
			return this._sceneNpcDic[vo.id];
		}else if(vo.type == SceneObjectType.MONSTER){
			return this._sceneMonsterDic[vo.id];
		}else if(vo.type == SceneObjectType.PET){
			return this._scenePetDic[vo.id];
		}else if(vo.type == SceneObjectType.PLAYER){
			return this._scenePlayerDic[vo.id];
		}else if(vo.type == SceneObjectType.PLAYERCOPY){
			return this._scenePlayerCopyDic[vo.id];
		}else if(vo.type == SceneObjectType.PARTNER){
			return this._scenePartnerDic[vo.id];
		}else if(vo.type == SceneObjectType.ITEM){
			return this._sceneItemDic[vo.id];
		}else if(vo.type == SceneObjectType.SKILLEFF){
			return this._sceneSkillEffDic[vo.id];
		}else if(vo.type == SceneObjectType.COLLECT){
			return this._sceneCollectDic[vo.id];
		}
		return null;
	}
	/**
	 * 根据场景ID和类型获取场景对象
	 * @param id 场景对象ID
	 * @param HpTipsType 场景对象Type
	 */
	public getSceneObjectById(id:number,type:number):any{
		if(type == SceneObjectType.NPC){
			return this._sceneNpcDic[id];
		}else if(type == SceneObjectType.MONSTER){
			return this._sceneMonsterDic[id];
		}else if(type == SceneObjectType.PET){
			return this._scenePetDic[id];
		}else if(type == SceneObjectType.PLAYER){
			return this._scenePlayerDic[id];
		}else if(type == SceneObjectType.PLAYERCOPY){
			return this._scenePlayerCopyDic[id];
		}else if(type == SceneObjectType.PARTNER){
			return this._scenePartnerDic[id];
		}else if(type == SceneObjectType.ITEM){
			return this._sceneItemDic[id];
		}else if(type == SceneObjectType.SKILLEFF){
			return this._sceneSkillEffDic[id];
		}else if(type == SceneObjectType.COLLECT){
			return this._sceneCollectDic[id];
		}
		return null;
	}

	/**
	 * 添加场景对象
	 */
	public addSceneObject(event:any):void{
		let vo:BaseObjectVo = event as BaseObjectVo;
		if(vo.type == SceneObjectType.NPC){
			this.addSceneNpc(event);
		}else if(vo.type == SceneObjectType.MONSTER){
			this.addSceneMonster(event);
		}else if(vo.type == SceneObjectType.PLAYER){
			this.addScenePlayer(event);
		}else if(vo.type == SceneObjectType.PLAYERCOPY){
			this.addScenePlayerCopy(event);
		}else if(vo.type == SceneObjectType.PET){
			this.addScenePet(event);
		}else if(vo.type == SceneObjectType.PARTNER){
			this.addScenePartner(event);
		}else if(vo.type == SceneObjectType.ITEM){
			this.addSceneItem(event);
		}else if(vo.type == SceneObjectType.SKILLEFF){
			this.addSceneSkillEff(event);
		}else if(vo.type == SceneObjectType.COLLECT){
			this.addSceneCollect(event);
		}
	}
	/**
	 * 移除场景对象
	 */
	public removeSceneObject(event:any):void{
		let vo:BaseObjectVo = event as BaseObjectVo;
		if(vo.type == SceneObjectType.NPC){
			this.removeSceneNpc(event);
		}else if(vo.type == SceneObjectType.MONSTER){
			this.removeSceneMonster(event);
		}else if(vo.type == SceneObjectType.PLAYER){
			this.removeScenePlayer(event);
		}else if(vo.type == SceneObjectType.PLAYERCOPY){
			this.removeScenePlayerCopy(event);
		}else if(vo.type == SceneObjectType.PET){
			this.removeScenePet(event);
		}else if(vo.type == SceneObjectType.PARTNER){
			this.removeScenePartner(event);
		}else if(vo.type == SceneObjectType.ITEM){
			this.removeSceneItem(event);
		}else if(vo.type == SceneObjectType.SKILLEFF){
			this.removeSceneSkillEff(event);
		}else if(vo.type == SceneObjectType.COLLECT){
			this.removeSceneCollect(event);
		}
	}
	
	/**
	 * 添加玩家
	 */
	public addScenePlayer(vo:ScenePlayerVo):void{
		if(this._scenePlayerDic[vo.id]){
			(this._scenePlayerDic[vo.id] as ScenePlayer).vo = vo;
		}else{
			var displayObj:ScenePlayer = new ScenePlayer(vo);
			displayObj.init();
			this._scenePlayerDic[vo.id] = displayObj;
			this._objectLayer.addChild(displayObj);
		}
	}
	/**
	 * 移除玩家
	 */
	public removeScenePlayer(vo:ScenePlayerVo):void{
		var displayObj:ScenePlayer = this._scenePlayerDic[vo.id] as ScenePlayer;
		if(displayObj){
			displayObj.destroy();
			if(displayObj.parent){
				displayObj.parent.removeChild(displayObj);
			}
			// if(this._objectLayer.contains(displayObj)){
			// 	this._objectLayer.removeChild(displayObj);
			// }
			this._scenePlayerDic[vo.id] = null;
			delete this._scenePlayerDic[vo.id];
		}
	}

	/**
	 * 添加玩家副本
	 */
	public addScenePlayerCopy(vo:ScenePlayerVo):void{
		if(this._scenePlayerCopyDic[vo.id]){
			(this._scenePlayerCopyDic[vo.id] as ScenePlayer).vo = vo;
		}else{
			var displayObj:ScenePlayer = new ScenePlayer(vo);
			displayObj.init();
			this._scenePlayerCopyDic[vo.id] = displayObj;
			this._objectLayer.addChild(displayObj);
		}
	}
	/**
	 * 移除玩家副本
	 */
	public removeScenePlayerCopy(vo:ScenePlayerVo):void{
		var displayObj:ScenePlayer = this._scenePlayerCopyDic[vo.id] as ScenePlayer;
		if(displayObj){
			displayObj.destroy();
			if(displayObj.parent){
				displayObj.parent.removeChild(displayObj);
			}
			// if(this._objectLayer.contains(displayObj)){
			// 	this._objectLayer.removeChild(displayObj);
			// }
			this._scenePlayerCopyDic[vo.id] = null;
			delete this._scenePlayerCopyDic[vo.id];
		}
	}

	/**
	 * 添加伙伴
	 */
	public addScenePartner(vo:ScenePartnerVo):void{
		if(this._scenePartnerDic[vo.id]){
			(this._scenePartnerDic[vo.id] as ScenePartner).vo = vo;
		}else{
			var displayObj:ScenePartner = new ScenePartner(vo);
			displayObj.init();
			this._scenePartnerDic[vo.id] = displayObj;
			this._objectLayer.addChild(displayObj);
		}
	}
	/**
	 * 移除伙伴
	 */
	public removeScenePartner(vo:ScenePartnerVo):void{
		var displayObj:ScenePartner = this._scenePartnerDic[vo.id] as ScenePartner;
		if(displayObj){
			displayObj.destroy();
			if(displayObj.parent){
				displayObj.parent.removeChild(displayObj);
			}
			// if(this._objectLayer.contains(displayObj)){
			// 	this._objectLayer.removeChild(displayObj);
			// }
			this._scenePartnerDic[vo.id] = null;
			delete this._scenePartnerDic[vo.id];
		}
	}

	/**
	 * 添加宠物
	 */
	public addScenePet(vo:ScenePetVo):void{
		if(this._scenePetDic[vo.id]){
			(this._scenePetDic[vo.id] as ScenePet).vo = vo;
		}else{
			var displayObj:ScenePet = new ScenePet(vo);
			displayObj.init();
			this._scenePetDic[vo.id] = displayObj;
			this._objectLayer.addChild(displayObj);
		}
	}
	/**
	 * 移除宠物
	 */
	public removeScenePet(vo:ScenePetVo):void{
		var displayObj:ScenePet = this._scenePetDic[vo.id] as ScenePet;
		if(displayObj){
			displayObj.destroy();
			if(displayObj.parent){
				displayObj.parent.removeChild(displayObj);
			}
			// if(this._objectLayer.contains(displayObj)){
			// 	this._objectLayer.removeChild(displayObj);
			// }
			this._scenePetDic[vo.id] = null;
			delete this._scenePetDic[vo.id];
		}
	}

	/**
	 * 添加怪物
	 */
	public addSceneMonster(vo:SceneMonsterVo):void{
		if(this._sceneMonsterDic[vo.id]){
			(this._sceneMonsterDic[vo.id] as SceneMonster).vo = vo;
		}else{
			var displayObj:SceneMonster = new SceneMonster(vo);
			displayObj.init();
			this._sceneMonsterDic[vo.id] = displayObj;
			this._objectLayer.addChild(displayObj);
		}
	}
	/**
	 * 移除怪物
	 */
	public removeSceneMonster(vo:SceneMonsterVo):void{
		var displayObj:SceneMonster = this._sceneMonsterDic[vo.id] as SceneMonster;
		if(displayObj){
			displayObj.destroy();
			if(displayObj.parent){
				displayObj.parent.removeChild(displayObj);
			}
			// if(this._objectLayer.contains(displayObj)){
			// 	this._objectLayer.removeChild(displayObj);
			// }
			this._sceneMonsterDic[vo.id] = null;
			delete this._sceneMonsterDic[vo.id];
		}
	}
	/**
	 * 添加Npc
	 */
	public addSceneNpc(vo:SceneNpcVo):void{
		if(this._sceneNpcDic[vo.id]){
			(this._sceneNpcDic[vo.id] as SceneNpc).vo = vo;
		}else{
			var displayObj:SceneNpc = new SceneNpc(vo);
			displayObj.init();
			this._sceneNpcDic[vo.id] = displayObj;
			this._objectLayer.addChild(displayObj);
		}
	}
	/**
	 * 移除Npc
	 */
	public removeSceneNpc(vo:SceneNpcVo):void{
		var displayObj:SceneNpc = this._sceneNpcDic[vo.id] as SceneNpc;
		if(displayObj){
			displayObj.destroy();
			if(displayObj.parent){
				displayObj.parent.removeChild(displayObj);
			}
			// if(this._objectLayer.contains(displayObj)){
			// 	this._objectLayer.removeChild(displayObj);
			// }
			this._sceneNpcDic[vo.id] = null;
			delete this._sceneNpcDic[vo.id];
		}
	}

	/**
	 * 添加Item
	 */
	public addSceneItem(vo:SceneItemVo):void{
		if(this._sceneItemDic[vo.id]){
			(this._sceneItemDic[vo.id] as SceneItem).vo = vo;
		}else{
			var displayObj:SceneItem = new SceneItem(vo);
			displayObj.init();
			this._sceneItemDic[vo.id] = displayObj;
			this._elementLayer.addChild(displayObj);
		}
	}
	/**
	 * 移除Item
	 */
	public removeSceneItem(vo:SceneItemVo):void{
		var displayObj:SceneItem = this._sceneItemDic[vo.id] as SceneItem;
		if(displayObj){
			displayObj.destroy();
			if(displayObj.parent){
				displayObj.parent.removeChild(displayObj);
			}
			// if(this._elementLayer.contains(displayObj)){
			// 	this._elementLayer.removeChild(displayObj);
			// }
			this._sceneItemDic[vo.id] = null;
			delete this._sceneItemDic[vo.id];
		}
	}

	/**
	 * 添加技能场景效果
	 */
	public addSceneSkillEff(vo:SceneSkillEffVo):void{
		if(this._sceneSkillEffDic[vo.id]){
			(this._sceneSkillEffDic[vo.id] as SceneSkillEff).vo = vo;
		}else{
			var displayObj:SceneSkillEff = new SceneSkillEff(vo);
			displayObj.init();
			this._sceneSkillEffDic[vo.id] = displayObj;
			this._objectLayer.addChild(displayObj);
		}
	}
	/**
	 * 移除技能场景效果
	 */
	public removeSceneSkillEff(vo:SceneSkillEffVo):void{
		var displayObj:SceneSkillEff = this._sceneSkillEffDic[vo.id] as SceneSkillEff;
		if(displayObj){
			displayObj.destroy();
			if(displayObj.parent){
				displayObj.parent.removeChild(displayObj);
			}
			// if(this._objectLayer.contains(displayObj)){
			// 	this._objectLayer.removeChild(displayObj);
			// }
			this._sceneSkillEffDic[vo.id] = null;
			delete this._sceneSkillEffDic[vo.id];
		}
	}

	/**
	 * 添加采集物
	 */
	public addSceneCollect(vo:SceneCollectVo):void{
		if(this._sceneCollectDic[vo.id]){
			(this._sceneCollectDic[vo.id] as SceneCollect).vo = vo;
		}else{
			var displayObj:SceneCollect = new SceneCollect(vo);
			displayObj.init();
			this._sceneCollectDic[vo.id] = displayObj;
			this._objectLayer.addChild(displayObj);
		}
	}
	/**
	 * 移除采集物
	 */
	public removeSceneCollect(vo:SceneCollectVo):void{
		var displayObj:SceneCollect = this._sceneCollectDic[vo.id] as SceneCollect;
		if(displayObj){
			displayObj.destroy();
			if(displayObj.parent){
				displayObj.parent.removeChild(displayObj);
			}
			// if(this._objectLayer.contains(displayObj)){
			// 	this._objectLayer.removeChild(displayObj);
			// }
			this._sceneCollectDic[vo.id] = null;
			delete this._sceneCollectDic[vo.id];
		}
	}


	/**
	 * 更新场景坐标位置
	 */
	private updateScenePos(pos:Array<number>){
		if (this._scenePosInit == false){
			this.initScenePos(pos);
			this._scenePosInit = true;
			return;
		}
		var xx:number = pos[0];
		var yy:number = pos[1];
		//矩形移动
		//中心点周围超过多少才移动
		var mapX:number = this._stageHalfWidth-xx;
		var mapY:number = this._stageHalfHeight-yy;
		var xDis:number = mapX - this._sceneModel.mapX;
		var isChang:boolean = false;
		if(Math.abs(xDis) < this._centerHalfW){
			//在矩形中,不做处理
		}else{
			isChang = true;
			if(xDis < 0){
				this._sceneModel.mapX = mapX + this._centerHalfW;
			}else{
				this._sceneModel.mapX = mapX - this._centerHalfW;
			}
		}
		var yDis:number = mapY - this._sceneModel.mapY;
		if(Math.abs(yDis) < this._centerHalfH){
			//在矩形中
		}else{
			isChang = true;
			if(yDis < 0){
				this._sceneModel.mapY = mapY + this._centerHalfH;
			}else{
				this._sceneModel.mapY = mapY - this._centerHalfH;
			}
		}
		if(isChang){
			if(xx+this._centerHalfW < this._stageHalfWidth){
				this._sceneModel.mapX = 0;
			}else if(xx-this._centerHalfW > this._sceneModel.sceneWidth -  this._stageHalfWidth){
				this._sceneModel.mapX = this._sceneModel.sceneStageW - this._sceneModel.sceneWidth;
			}
			if(yy+this._centerHalfH < this._stageHalfHeight){
				this._sceneModel.mapY = 0;
			}else if(yy-this._centerHalfH > this._sceneModel.sceneHeight -  this._stageHalfHeight){
				this._sceneModel.mapY = this._sceneModel.sceneStageH -  this._sceneModel.sceneHeight;
			}
			this.x = this._sceneModel.mapX;
			this.y = this._sceneModel.mapY+64;
			this.setBgMapPos(this.x,this.y);
		}
	}
	//初始化场景位置
	private initScenePos(pos:Array<number>){
		// //中心点移动
		var xx:number = pos[0];
		var yy:number = pos[1];
		this._sceneModel.mapX = this._stageHalfWidth-xx;
		this._sceneModel.mapY = this._stageHalfHeight-yy;
		if(xx < this._stageHalfWidth){
			this._sceneModel.mapX = 0;
		}else if(xx > this._sceneModel.sceneWidth -  this._stageHalfWidth){
			this._sceneModel.mapX = this._sceneModel.sceneStageW - this._sceneModel.sceneWidth;
		}
		if(yy < this._stageHalfHeight){
			this._sceneModel.mapY = 0;
		}else if(yy > this._sceneModel.sceneHeight -  this._stageHalfHeight){
			this._sceneModel.mapY = this._sceneModel.sceneStageH -  this._sceneModel.sceneHeight;
		}
		this.x = this._sceneModel.mapX;
		this.y = this._sceneModel.mapY+64;
		this.setBgMapPos(this.x,this.y);
	}

	private setBgMapPos(xx:number,yy:number){
		//this._mapLayer.setPos(0-xx,0-yy)
	}

	/**
	 * 显示点击动画
	 */
	private showClickMc(xx:number,yy:number,notOpen:boolean){
		if(this._clickMc == null){
			this._clickMc = new AMovieClip();
			this._objectLayer.addChild(this._clickMc);
			if(this._clickMc.hasEventListener(egret.Event.COMPLETE)== false){
				this._clickMc.addEventListener(egret.Event.COMPLETE, this.playClickMcEffComplete, this);
			}
		}
		this._clickMc.playMCKey("efflubiao","",1);
		this._clickMc.visible = true;
		this._clickMc.x = xx;
		this._clickMc.y = yy;
		if(notOpen){
			this._clickMc.alpha = 0.5;
		}else{
			this._clickMc.alpha = 1;
		}
	}
	/**
	 * 播放点击效果完成事件
	 */
	private playClickMcEffComplete(e:egret.Event){
		if(this._clickMc){
			this._clickMc.visible = false;
		}
	}
	/**
	 * 显示点击动画
	 */
	private clearClickMc(){
		if(this._clickMc){
			this._clickMc.destroy();
			if(this._clickMc.parent){
				this._clickMc.parent.removeChild(this._clickMc);
			}
			this._clickMc.removeEventListener(egret.Event.COMPLETE, this.playClickMcEffComplete,this);
			this._clickMc = null;
		}
	}
	


	/**
	 * 显示进度条
	 */
	private showSceneLoading(){
		if(this._sceneLoading){
			this._sceneLoading.visible = true;
		}
	}
	/**
	 * 关闭进度条
	 */
	private closeSceneLoading(){
		if(this._sceneLoading){
			this._sceneLoading.visible = false;
		}
	}
	/**
	 * 设置进度条
	 */
	public set sceneLoading(value:SceneLoading){
		this._sceneLoading = value;
	}
	/**
	 * 停止计时器
	 */
	private stopSchedule(){
		if(this._scheduleId != 0){
			GlobalTimer.getInstance().remove(this._scheduleId);
			this._scheduleId = 0;
		}
	}

	private gridsItemList:Array<GridsItem> = [];
	/**测试用 显示技能范围格子 */
	private showSkillRangeGrids(arr:Array<Array<number>>){
		var item:GridsItem;
		for(var i:number = 0;i<arr.length;i++){
			var pp:Array<number> = arr[i];
			item = this.gridsItemList[i];
			if(item){
				item.show();
			}else{
				item = new GridsItem();
				item.show();
				this.gridsItemList.push(item);
				this._elementLayer.addChild(item);
			}
			item.x = pp[0]*64;
			item.y = pp[1]*64; 
		}
	}
}

class GridsItem extends egret.Bitmap{
	public constructor() {
		super();
		this.texture = RES.getRes("com_scene_grids_bg_png");
	}

	public show(){
		this.visible = true;
		this.alpha = 0;
		egret.Tween.get(this).to({ alpha: 1 }, 20).wait(200).to({ alpha: 0 }, 200).call(this.close,this);
	}
	public close(){
		this.visible = false;
		egret.Tween.removeTweens(this);
	}
}