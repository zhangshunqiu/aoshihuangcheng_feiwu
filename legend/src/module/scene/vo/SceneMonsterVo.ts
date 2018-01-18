/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景怪物Vo
 */
class SceneMonsterVo extends BaseFightObjVo {
	public objConf:any;//怪物对象配置信息

	public patrolX:number = 0;//巡逻点
	public patrolY:number = 0;//巡逻点

	public fSkillTargetVo:FSkillTargetVo;//战斗中使用的技能对应目标Vo
	public nextFSkillVo:FSkillVo;//下一局使用的技能VO

	public monsterType:number = 1;//怪物类型,1=小怪,2=关卡BOSS,3=普通boss,4=世界boss
	public attackType:number = 1;//攻击类型：1:主动攻击,2=被动攻击,3=不主动攻击不反击

	public hpBarUrl:string = "sceneHpBar_png";//血条样式

	public honorTitleUrl:string = "";//称号样式

	public immuneCZ:boolean = false;//是否免疫冲撞
	public immuneKJHH:boolean = false;//是否免疫抗拒火环

	public constructor() {
		super();
		this.type = SceneObjectType.MONSTER;
		this.moveSpeed = 4;
		//测试数据
		this.gridX = SceneModel.getInstance().getRandomGX();
		this.gridY = SceneModel.getInstance().getRandomGY();
		this.posX = SceneUtil.gridToPixelX(this.gridX);
		this.posY =  SceneUtil.gridToPixelY(this.gridY);
		this.patrolX = this.posX;
		this.patrolY = this.posY;
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
		this.monsterType = 1;
		this.attackType = 3;
		this.updateConfig();
		this.curHp = obj["cur_hp"];
		this.curMp = obj["cur_mp"];
		this.hp = obj["hp"];
		this.mp = obj["mp"];
		this.gridX = obj["begin_x"];
		this.gridY = obj["begin_y"];
		this.posX = SceneUtil.gridToPixelX(this.gridX);
		this.posY =  SceneUtil.gridToPixelY(this.gridY);
		this.patrolX = this.posX;
		this.patrolY = this.posY;
		this.hookSkillIndex = 0;
	}

	public updateConfig() {
		var config:any = App.ConfigManager.getMonsterById(this.modelId);
		if(config){
			this.objConf = config;
			this.bodyId = config.resId;
			this.monsterType = config.type;
			this.hp = config.hp;
			this.mp = config.mp;
			this.lv = config.lv;
			this.name = config.name+"lv."+this.lv;
			this.attackType = config.attack_type;
			if(config.immune_cz && config.immune_cz == 1){
				this.immuneCZ = true;
			}else{
				this.immuneCZ = false;
			}
			if(config.immune_kjhh && config.immune_kjhh == 1){
				this.immuneKJHH = true;
			}else{
				this.immuneKJHH = false;
			}
			this.updateHookSkill();
		}
	}

	/**
	 * 更新挂机技能
	 */
	public updateHookSkill(hVo:game.HeroVO = null){
		if(this.objConf){
			this.hookSkill = [];
			for(var i:number = 0;i<this.objConf.hookSkill.length;i++){
				this.hookSkill.push([this.objConf.hookSkill[i],1]);
			}
		}
		this.defaultSkillId = SceneUtil.getDefaultSkill(0);
		this.initUseSkillVO();
	}
	
	// public get lv():number {
	// 	// if()
	// 	return 1;
	// }

	/**
	 * 清理
	 */
	public clear() {
		super.clear();
		this.nextFSkillVo = null;
		this.fSkillTargetVo = null;
		this.monsterType = 1;
		this.attackType = 3;
		this.hookSkillIndex = 0;
	}
}