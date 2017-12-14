/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 游戏场景控制器 2017/06/20.
 */
class SceneController extends BaseController {
	private _sceneModel:SceneModel = SceneModel.getInstance();
	private static _instance:SceneController;
	public static getInstance():SceneController {
        if(this._instance == null){
			this._instance = new SceneController();
		}
        return this._instance;
    }
	public constructor() {
		super();
		this._sceneModel = SceneModel.getInstance();
		this.initProtocol();
		this.initEventListener();
	}

	/**
	 * 初始化监听
	 */
	protected initEventListener(){
		super.initEventListener();
		
	}

	/**
	 * 初始化协议
	 */
	protected  initProtocol(){
		super.initProtocol();
		// this.registerProtocal(11005,this.handlerInitScene,this);
		// this.registerProtocal(12,this.handlerObjectMove,this);
		// this.registerProtocal(13,this.handlerAddObject,this);
		// this.registerProtocal(14,this.handlerRemoveObject,this);
		this.registerProtocal(11001,this.handlerInitScene,this);//handlerInitScene
		this.registerProtocal(11002,this.handlerObjectMove,this);
		//11003回主城 App.Socket.send(11003,{});
		this.registerProtocal(11004,this.handlerRemoveObject,this);
		this.registerProtocal(11005,this.handlerAddObject,this);
		this.registerProtocal(11020,this.handlerObjectOftenUpdate,this);//场景数据更新

		this.registerProtocal(12002,this.handlerUseSkill,this);//释放技能
		this.registerProtocal(12010,this.handlerSkillTrigger,this);//释放效果触发

		//this.registerProtocal(13001,this.handlerEnterHookScene,this);
		this.registerProtocal(13001,this.handlerChangeScene, this); //进入挂机副本
		this.registerProtocal(13002,this.handlerChallengeBoss, this);//挑战挂机boss
		this.registerProtocal(13003,this.handlerUpdateWave, this);//挂机副本波数更新
		this.registerProtocal(13004,this.handlerChallengeBossResult, this);//挂机副本挑战结果
		this.registerProtocal(13005,this.handlerHookSkillTrigger,this);

		this.registerProtocal(13007,this.handlerSpecialSkillTrigger,this);
	}


	/**
	 * 切换场景
	 */
	protected handlerChangeScene(data) {

	}
	/**
	 * 挑战boss
	 */
	protected handlerChallengeBoss(data) {
		this.dispatchEvent(PanelNotify.BOSS_CHALLENGE);
	}
	/**
	 * 更新怪物波数
	 */
	protected handlerUpdateWave(data) {
		(game.BossModel.getInstance() as game.BossModel).wave++;
		App.EventSystem.dispatchEvent(PanelNotify.BOSS_WAVE_UPDATE);
	}

	/**
	 * 获取挑战boss结果
	 */
	public handlerChallengeBossResult(data) {
		(game.BossModel.getInstance() as game.BossModel).challengeBossResult(data);
		App.EventSystem.dispatchEvent(PanelNotify.SHOW_BOSS_RESULT, data.result);
		if(data.result === 1) {
			if(App.WinManager.isOpen(WinName.BOSS_WIN)== false && (SceneUtil.isBossScene(this._sceneModel.sceneId)) ){  //&& GameRootLay.gameLayer()._moduleLay.numChildren == 0
				App.WinManager.openWin(WinName.BOSS_WIN);
			}else if(SceneUtil.isActivityScene(this._sceneModel.sceneId)){
				App.WinManager.openWin(WinName.BOSS_WIN, this._sceneModel.sceneId);
			} else {
				App.Socket.send(13001, {});
			}
		} else if(data.result === 0) {
			if(App.WinManager.isOpen(WinName.BOSS_LOSE)== false && (SceneUtil.isBossScene(this._sceneModel.sceneId) || SceneUtil.isActivityScene(this._sceneModel.sceneId))){  //&& GameRootLay.gameLayer()._moduleLay.numChildren == 0
				App.WinManager.openWin(WinName.BOSS_LOSE);
			}else{
				if(SceneUtil.isHookScene(this._sceneModel.sceneId)){
					//挂机副本回主城
					 App.Socket.send(11003, {});
				}else{
					//boss副本回挂机
					App.Socket.send(13001, {});
				}
			}
		}
	}

	/**
	 * 接收挂机特殊技能行为
	 */
	private handlerSpecialSkillTrigger(data:any){
		this.dispatchEvent(SceneEventType.HOOK_SPECIAL_SKILL_TRIGGER,data);
	}

	/**
	 * 接收挂机释放技能
	 */
	private handlerHookSkillTrigger(data:any){
		this.dispatchEvent(SceneEventType.HOOK_SKILL_TRIGGER,data);
	}

	/**
	 * 释放效果触发
	 */
	private handlerSkillTrigger(data:any){
		//this.dispatchEvent(SceneEventType.SKILL_TRIGGER,data);
		//data.id
		// repeated	pbSkillObj obj_list = 1; //目标列表
		// repeated    pbSkillBuff buff_list=2; //buff列表
		// repeated    pbSkillMove move_list=3; //移动列表
		// repeated	pbSkillMove Konck_list=4;//击退列表


		// 		message pbSkillObj{
		// 		optional	int32	obj_type	=1;//对象类型
		// 		optional	int32	obj_id      =2;//对象id
		// }

		// message pbSkillBuff{
		// 		optional	int32	obj_type	=1;//对象类型
		// 		optional	int32	obj_id      =2;//对象id
		// 		optional    int32	buff_op		=3;//buff操作:1 添加,2 更新,3 删除
		// 		optional    int32   buff_id		=4;//buff_id
		// 		optional	int32   buff_time   =5;//倒计时
		// }

		// message pbSkillMove{
		// 		optional	int32	obj_type	=1;//对象类型
		// 		optional	int32	obj_id      =2;//对象id
		// 		optional	int32	begin_x		=3;//起始坐标x
		// 		optional	int32	begin_y		=4;//起始坐标y
		// 		optional	int32	end_x		=5;//结束坐标x
		// 		optional	int32	end_y		=6;//结束坐标y
		// }
	}

	/**
	 * 进入挂机副本返回
	 */
	private handlerEnterHookScene(data:any){
		
	}

	/**
	 * 对象进屏或更新 进入场景也用这个
	 */
	private handlerUpdateScene(data:any){
		if(this._sceneModel.sceneId != data.map_id){
			//进入新场景
			this.handlerInitScene(data);
		}else{
			//场景对象更新
			this.handlerAddObject(data);
		}
	}

		/**
	 * 场景对象移动
	 */
	private handlerObjectMove(data:any){
		this.dispatchEvent(SceneEventType.SCENE_OBJECT_MOVE,data);
	}


	/**
	 * 测试进入场景事件
	 */
	public testHandlerInitScene(mapId:number){
		var data:any = {player_list:[],mon_list:[],drop_list:[],map_id:mapId};
		this.handlerInitScene(data)
		if(mapId >= 40000){//Boss场景
			var vo:SceneMonsterVo = new SceneMonsterVo();
			vo.gridX = 10;
			vo.gridY = 15;
			vo.posX = SceneUtil.gridToPixelX(vo.gridX);
			vo.posY =  SceneUtil.gridToPixelY(vo.gridY);
			vo.patrolX = vo.posX;
			vo.patrolY = vo.posY;
			vo.id = 20000+Math.floor(Math.random()*10000);
			vo.modelId = String(10011+Math.floor(Math.random()*10));
			vo.updateConfig();
			vo.curHp = vo.hp;
			this._sceneModel.addSceneObjectVo(vo);

			let vo2:ScenePlayerVo = new ScenePlayerVo();
			vo2.id = RoleManager.getInstance().getMainHeroId();
			vo2.name= "主角";

			vo2.gridX = 10;
			vo2.gridY = 13;
			vo2.posX = SceneUtil.gridToPixelX(vo2.gridX);
			vo2.posY =  SceneUtil.gridToPixelY(vo2.gridY);
			vo2.patrolX = vo.posX;
			vo2.patrolY = vo.posY;
			vo2.hp = 100000;
			vo2.curHp = 100000;
		    SceneModel.getInstance().addSceneObjectVo(vo2);

		}else if(mapId >= 20000){//副本场景
			for(let i=0;i<0;i++){
				let vo = new SceneMonsterVo();
				vo.id = i+20000;
				vo.modelId = String(10000+Math.floor(Math.random()*20));
				vo.updateConfig();
				vo.curHp = vo.hp;
				SceneModel.getInstance().addSceneObjectVo(vo);
			}
		}
	}


	/**
	 * 初始化场景
	 */
	private handlerInitScene(data:any = null){
		App.logzsq("HANDLER INIT SCENE  id =",data.map_id);
		if(data == null){
			this._sceneModel.initSceneData({sceneId:10000});
			this.dispatchEvent(SceneEventType.INIT_SCENE,data,100);//GameScene开始工作
		}else{
			if(SceneUtil.isHookScene(data.map_id)){
				App.RoleManager.roleInfo.hookSceneId = data.map_id;
			}
			this._sceneModel.initSceneData({sceneId:data.map_id});
			//this.handlerAddObject(data);
			//玩家，伙伴，机器人
			for(let i:number = 0;i<data.player_list.length;i++){
				var pvo:ScenePlayerVo = new ScenePlayerVo();
				pvo.initProto(data.player_list[i]);
				this._sceneModel.addSceneObjectVo(pvo);
				//this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,pvo);
			}

			//怪物和宠物
			for(let j:number = 0;j<data.mon_list.length;j++){
				var mobj:any = data.mon_list[j];
				if(mobj.obj_type == SceneObjectType.MONSTER){
					var mvo:SceneMonsterVo = new SceneMonsterVo();
					mvo.initProto(mobj);
					this._sceneModel.addSceneObjectVo(mvo);
					//this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,mvo);
				}else if(mobj.obj_type == SceneObjectType.PET){
					var petvo:ScenePetVo = new ScenePetVo();
					petvo.initProto(mobj);
					this._sceneModel.addSceneObjectVo(petvo);
					//this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,petvo);
				}else if(mobj.obj_type == SceneObjectType.COLLECT){
					var collvo:SceneCollectVo = new SceneCollectVo();
					collvo.initProto(mobj);
					this._sceneModel.addSceneObjectVo(collvo);
					//this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,collvo);
				}
			}
			for(let k:number = 0;k<data.drop_list.length;k++){
				var ivo:SceneItemVo = new SceneItemVo();
				ivo.initProto(data.player_list[k]);
				this._sceneModel.addSceneObjectVo(ivo);
				//this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,ivo);
			}
			this.dispatchEvent(SceneEventType.INIT_SCENE,data);//GameScene开始工作
		}
	}


	/**
	 * 场景对象进入
	 */
	private handlerAddObject(data:any){
		for(let i:number = 0;i<data.player_list.length;i++){
			var pvo:ScenePlayerVo = new ScenePlayerVo();
			pvo.initProto(data.player_list[i]);
			this._sceneModel.addSceneObjectVo(pvo);
			this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,pvo);
		}
		for(let j:number = 0;j<data.mon_list.length;j++){
			var mobj:any = data.mon_list[j];
			if(mobj.obj_type == SceneObjectType.MONSTER){
				var mvo:SceneMonsterVo = new SceneMonsterVo();
				mvo.initProto(mobj);
				this._sceneModel.addSceneObjectVo(mvo);
				this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,mvo);
			}else if(mobj.obj_type == SceneObjectType.PET){
				var petvo:ScenePetVo = new ScenePetVo();
				petvo.initProto(mobj);
				this._sceneModel.addSceneObjectVo(petvo);
				this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,petvo);
			}else if(mobj.obj_type == SceneObjectType.COLLECT){
				var collvo:SceneCollectVo = new SceneCollectVo();
				collvo.initProto(mobj);
				this._sceneModel.addSceneObjectVo(collvo);
				this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,collvo);
			}
		}
		for(let k:number = 0;k<data.drop_list.length;k++){
			var ivo:SceneItemVo = new SceneItemVo();
			ivo.initProto(data.drop_list[k]);
			this._sceneModel.addSceneObjectVo(ivo);
			this.dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,ivo);
		}
	}

	/**
	 * 场景对象移除
	 */
	private handlerRemoveObject(data:any){
		for(let i:number = 0;i<data.list.length;i++){
			var obj:any = data.list[i];
			var vo:BaseObjectVo  = this._sceneModel.getSceneObjectVo(obj.obj_id,obj.obj_type);
			this._sceneModel.removeSceneObjectVo(vo);
			this.dispatchEvent(SceneEventType.REMOVE_SCENE_OBJECT,vo);
		}
	}

	/**
	 * 场景对象更新11020
	 */
	private handlerObjectOftenUpdate(data:any){

	}

	/**
	 * 场景使用技能
	 */
	private handlerUseSkill(data:any){
		// App.Socket.send(12002,{})
		// var data:any = {
		// 	skill_id:10100,
		// 	skill_lv:1,
		// 	direction:1,
		// 	target_type:1,
		// 	cast_type:1,
		// 	cast_id:1,
		// 	obj_type:1,
		// 	obj_id:1,
		// 	x:1,
		// 	y:1,
		// }
		// App.Socket.send(12002,data)

		// optional	int32	skill_id	= 1;  // 技能id
		// optional	int32	skill_lv	= 2;  // 技能等级
		// optional	int32 	direction	= 3;  // 朝向
		// optional	int32	target_type	= 4;  // 目标类型: 1 对象, 2 地面坐标
		// optional	int32	cast_type	= 5;  // 施法者类型
		// optional	int32	cast_id		= 6;  // 施法者id
		// optional	int32	obj_type	= 7;  //  对象类型
		// optional	int32	obj_id		= 8;  // 对象唯一id
		// optional	int32	x			= 9;  // 坐标x
		// optional	int32	y			= 10; // 坐标y
	}


	/**
	 * 更新场景对象翅膀模型
	 */
	public updateWingModel(wingId:string,objId:number,ObjType:number = SceneObjectType.PLAYER){
		var vo:ScenePlayerVo = this._sceneModel.getSceneObjectVo(objId,ObjType);
		var conf:any = App.ConfigManager.getWingStepById(wingId);
		if(conf){
			if(vo.wingId != String(conf.model)){
				vo.wingId = String(conf.model);
				this.dispatchEvent(SceneEventType.UPDATE_OBJ_MODEL,vo);
			}
		}
	}

	/**
	 * 更新场景对象翅膀模型 var tweapon = this.getWeaponModelId();
            var tclothes = this.getClothModelId();
	 */
	public updateclothesModel(weaponId:string,clothesId:string,objId:number,ObjType:number = SceneObjectType.PLAYER){
		var vo:ScenePlayerVo = this._sceneModel.getSceneObjectVo(objId,ObjType);
		if(vo){
			vo.weaponId = weaponId;
			vo.bodyId = clothesId;
			this.dispatchEvent(SceneEventType.UPDATE_OBJ_MODEL,vo);
		}
	}


	/**
	 * 销毁destroy
	 */
	public destroy(){
		super.destroy();
	}

	/**
	 * 清理
	 */
	public clear(){
		super.clear();
	}

	
}