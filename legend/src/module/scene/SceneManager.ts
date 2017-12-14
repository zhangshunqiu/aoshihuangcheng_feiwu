/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景管理器 2017/06/20
 */
class SceneManager extends BaseClass {
	private _gameScene:GameScene;
	private _eventSystem:EventSystem = EventSystem.getInstance();
	private _sceneModel:SceneModel = SceneModel.getInstance();
	private _globalModel:GlobalModel = GlobalModel.getInstance();

	private static _instance:SceneManager;
	public static getInstance():SceneManager {
        if(this._instance == null){
			this._instance = new SceneManager();
		}
        return this._instance;
    }
	public constructor() {
		super();
	}

	/**
	 * 设置游戏场景
	 */
	public set gameScene(value:GameScene){
		this._gameScene = value;
	}

	/**
	 * 获取游戏场景
	 */
	public get gameScene():GameScene{
		return this._gameScene;
	}

	/**
	 * 搜索使用技能和目标
	 */
	public searchUseSkillAndTarget(objVo:BaseFightObjVo,skillVo:FSkillVo = null,):FSkillTargetVo{
		var vo:FSkillTargetVo = new FSkillTargetVo();
		
		if(objVo.type == SceneObjectType.MONSTER){
			if(skillVo != null){
				vo.skillVo = skillVo;
			}else{
				vo.skillVo = objVo.getUseFSkillVo();
				//vo.skillVo.initSkill(skillList[Math.floor(Math.random()*skillList.length)],0);
			}
			// if(Math.random()*1000 > 200){
			// 	//vo.skillVo.atkEff = "70301";
			// 	vo.skillVo.flyEff = "7061";
			// 	vo.skillVo.hurtEff = "7062";
			// }else{
			// 	vo.skillVo.flyEff = "";
			// 	vo.skillVo.hurtEff = "7091";0
			// 	vo.skillVo.hurtEffType = 3;
			// }
			var targetVoList = this.getNearlyTarget(objVo,vo.skillVo);
			if(targetVoList){
				vo.targetArr = [targetVoList];
			}else{
				vo.targetArr = [];
			}
		}else{
			if(skillVo != null){
				vo.skillVo = skillVo;
			}else{
				vo.skillVo =  objVo.getUseFSkillVo();
			}
			// vo.skillVo.atkActType = 3;
			// vo.skillVo.atkDis = 256;
			// vo.skillVo.atkEffType = 2;//2;
			// if(Math.random()*1000 > 900){
			// 	vo.skillVo.atkEff = "7040";//7050";
			// }else{
			// 	vo.skillVo.atkEff = "7050";//7050";
			// }
			//vo.skillVo.flyEff = "7061";
			//vo.skillVo.hurtEff = "7062";
			var vv:BaseFightObjVo = this.getNearlyTarget(objVo,vo.skillVo);
			//var targetVoList:Array<BaseObjectVo> = [this.getNearlyTarget(objVo,vo.skillVo)];
			if(vv){
				vo.targetArr = [vv];
			}else{
				vo.targetArr = [];
			}
		}
		return vo;
	}


	/**
	 * 获取最近的目标
	 * @param atkVo 攻击者
	 * @param skillVo 技能
	 */
	protected getNearlyTarget(atkVo:BaseFightObjVo,skillVo:FSkillVo):BaseFightObjVo{
		if(skillVo.targetType == SkillTargetType.SELF){//自己
			return atkVo;
		}else if(skillVo.targetType == SkillTargetType.PARTNER){ //队友
			var arr:BaseFightObjVo
			if(atkVo.type == SceneObjectType.MONSTER){
				arr = this._sceneModel.getMonsterNearlyPartner(atkVo);
			}else {
				//arr = this._sceneModel.searchNearlyPartner(atkVo);
				arr = this._sceneModel.getPlayerNearlyPartner(atkVo);
			}
			return arr;
		}else if(skillVo.targetType == SkillTargetType.ENEMY){//敌方
			var arr:BaseFightObjVo
			if(atkVo.type == SceneObjectType.MONSTER){
				arr = this._sceneModel.getMonsterNearlyEnamy(atkVo);
			}else {
				//arr = this._sceneModel.searchNearlyEnamy(atkVo);
				arr = this._sceneModel.getPlayerNearlyEnamy(atkVo);
			}
			return arr;
		}else if(skillVo.targetType == SkillTargetType.EMPTY){ //空放

		}
		return null;
	}

	/**
	 * 获取可以使用的技能   n'n'n'n'nn'n'n'n'n'n'n'n'n'n'n'n'n'n'n'n
	 */
	protected getUseSkill(atkVo:BaseObjectVo,skillVo:FSkillVo = null):FSkillVo{
		var backVo:FSkillVo;
		if(atkVo.type == SceneObjectType.MONSTER){
			if(skillVo != null){
				backVo = skillVo;
			}else{
				backVo = new FSkillVo();
				backVo.initSkill(10100,1);
			}
		}else{
			if(skillVo != null){
				backVo = skillVo;
			}else{
				backVo = new FSkillVo();
				backVo.initSkill(10200,1);
			}
		}
		 return backVo;
	}



	private _showResultHookBoos:Boolean = false;
	public update(){
		if(this._sceneModel.sceneId < 40000 && this._sceneModel.sceneId >20000){
			this._showResultHookBoos = false;
		}else if(this._sceneModel.sceneId >= 40000){
			// var num:number = this._sceneModel.getSceneObjectNumber(SceneObjectType.MONSTER);
			// if(num > 0 ){
			// 	this._showResultHookBoos = false;
			// }else{
			// 	if(this._showResultHookBoos == false){
			// 		App.logzsq("弹出Boss结束面板");
			// 		(game.BossController.getInstance() as game.BossController).challengeBossResult({result:1,hook_id:40001});
			// 		this._showResultHookBoos = true;
			// 	}
			// }
	
		}else if(this._sceneModel.sceneId == 10000){
			this._showResultHookBoos = false;

			var num:number = this._sceneModel.getSceneObjectNumber(SceneObjectType.MONSTER);
			if(num <=0){
				for(let i=0;i<0;i++){
					let vo = new SceneMonsterVo();
					vo.id = i+20000;
					vo.modelId = String(10001+Math.floor(Math.random()*20));
					vo.updateConfig();
					vo.curHp = vo.hp;
					SceneModel.getInstance().addSceneObjectVo(vo);
					(EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo);
				}
			}
			var Role:any = App.RoleManager;
		}
		
		// 更新功能
		// var xxLen:number = this._sceneModel.gridTable.length;
		// var yyLen:number = this._sceneModel.gridYNum;
		// for(let i:number = 0;i<xxLen;i++){
		// 	for(let j:number = 0;j<yyLen;j++){
		// 		if(this._sceneModel.gridTable[i][j]){
		// 			App.logzsq(i+"_"+j);
		// 		}
		// 	}
		// }

		// App.logzsq("END "+Date.now());
	}

	/**
	 * 设置场景其他玩家的显示与否
	 */
	public setOtherPlayerVisible(b:boolean){
		this._gameScene.setOtherPlayerVisible(b);
		
	}

	/**
	 * 销毁
	 */
	public destroy(){
		this._gameScene = null;
	}

	/**
	 * 清理
	 */
	public clear(){
		
	}
}