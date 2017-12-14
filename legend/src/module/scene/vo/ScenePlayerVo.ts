/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 场景玩家的VO
 */
class ScenePlayerVo extends ScenePetVo {
	private _bodyId:string = "";//身体
	public weaponId:string = "";//武器ID
	public wingId:string = "";//翅膀Id

	public sex:number;      //对象性别
	public career:number;   //对象职业

	public guildName:String= ""; //帮派名

	public petNum:number; // 宠物数量
	public collectState:number; //玩家场景采集状态0未采集

	public constructor() {
		super();
		this.type = SceneObjectType.PLAYER;

		this.hpBarUrl = "sceneHpBarRole_png";
		//测试数据
		this.bodyId = "1101";
		this.weaponId = "3505";
		//this.wingId = "4013";
		this.gridX = SceneModel.getInstance().getRandomGX();
		this.gridY = SceneModel.getInstance().getRandomGY();
		this.posX = SceneUtil.gridToPixelX(this.gridX);
		this.posY =  SceneUtil.gridToPixelY(this.gridY);
		this.moveSpeed = 4;
		this.id = 123;
		this.name = "角色";
		this.hp = 1000;
		this.curHp = 1000;
		this.pkMode = PKModeType.ALL;
		this.ownerType = SceneObjectType.PLAYER;

		if(SceneModel.getInstance().sceneType == SCENE_MAP_TYPE.WORLD_BOSS){
			this.pkMode = PKModeType.PEACE;
		}

		//设置挂机技能和默认技能
		//var hvo:game.HeroVO = RoleManager.getInstance().getHeroVoById(this.id);
		//this.updateHookSkill(hvo);
		//this.initBuffQueue = [new FBuffVo()];
	}

	/**
	 * 从协议里初始化
	 */
	// optional	int32 obj_type		= 1;		//对象类型
	// optional	int32 obj_id		= 2;        //对象id
	// optional	string name         = 3;		//对象昵称
	// optional	int32 sex			= 4;		//对象性别
	// optional	int32 career		= 5;        //对象职业
	// optional	int32 lv			= 6;		//对象等级
	// optional	int32 cur_hp		= 7;		//对象当前血量
	// optional	int32 cur_mp		= 8;		//对象当前魔法
	// optional	int32 hp			= 9;		//血量
	// optional	int32 mp			= 10;		//魔法
	// optional 	int32 begin_x 		= 11;       // 起始点x
	// optional 	int32 begin_y 		= 12;		// 起始点y
	// optional	int32 guild_id		= 13;		//帮派id
	// optional	string guild_name   = 14;		//帮派名
	// optional	int32 name_color	= 15;		//名字颜色
	// optional	int32 pet_num		= 16;		// 宠物数量
	// optional	int32 collect_state	= 17;		//玩家场景采集状态0未采集
	public initProto(obj:any) {
		this.id = obj["obj_id"];
		this.type = obj["obj_type"];
		this.name = obj["name"];
		this.lv = obj["lv"];
		this.curHp = obj["cur_hp"];
		this.curMp = obj["cur_mp"];
		this.hp = obj["hp"];
		this.mp = obj["mp"];

		this.sex = obj["sex"];
		this.career = obj["career"];
		this.guildId = obj["guild_id"];
		this.guildName = obj["guild_name"];
		this.nameColor = obj["name_color"];
		this.petNum = obj["pet_num"];
		this.collectState = obj["collect_state"];

		this.ownerId = obj["obj_owner_id"];
		this.mainOwnerId = this.ownerId;
		
		this.gridX = obj["begin_x"];
		this.gridY = obj["begin_y"];
		this.posX = SceneUtil.gridToPixelX(this.gridX);
		this.posY =  SceneUtil.gridToPixelY(this.gridY);
		this.patrolX = this.posX;
		this.patrolY = this.posY;
		this.hookSkillIndex = 0;

		var idd:Number = obj["clothes_id"];
		if(idd && idd != 0){
			this.bodyId = String(idd);
		}
		idd = obj["weapon_id"];
		if(idd && idd != 0){
			this.weaponId = String(idd);
		}
		idd = obj["wing_id"];
		if(idd && idd != 0){
			this.wingId = String(idd);
		}
		//设置挂机技能和默认技能
		var hvo:game.HeroVO = RoleManager.getInstance().getHeroVoById(this.id);
		if(hvo){
			//设置技能
			//设置模型
			var clothModelId:any = hvo.getClothModelId()
			if(clothModelId){
				this.bodyId = String(clothModelId);
			}else{
				this.bodyId = "";
			}
			var weaponModelId:any = hvo.getWeaponModelId();
			if(weaponModelId){
				this.weaponId = String(weaponModelId);
			}else{
				this.weaponId = "";
			}
			var wingModelId:any = hvo.getWingModelId();
			if(wingModelId){
				this.wingId = String(wingModelId);
			}else{
				this.wingId = "";
			}
			this.mainOwnerId = RoleManager.getInstance().getMainHeroId();
		}else{
			//this.mainOwnerId = 
			//非自己的英雄就是机器人,需读表获取
			var robot:any = App.ConfigManager.getRobotConfByCareerLvSex(this.career,this.lv,this.sex);
			if(this.name == null || this.name == ""){
				this.name = App.ConfigManager.getRandomNameBySex(this.sex);
			}
			this.hookSkill = robot.skill;
			this.bodyId = String(robot.cloth);
			this.weaponId = String(robot.weapon);
			this.wingId = String(robot.wing);
		}
		this.updateHookSkill(hvo);

		
	}

	/**
	 * 更新挂机技能
	 */
	public updateHookSkill(hvo:game.HeroVO = null){
		//设置技能
		if(hvo){
			this.hookSkill = [];
			var list = SceneUtil.getAutoSkillList(this.career);
			for(var i:number = 0;i<list.length;i++){
				var sid:number = list[i];
				if(hvo.skillDic[sid] && hvo.skillDic[sid] >0){
					this.hookSkill.push([sid,hvo.skillDic[sid]]);
				}
			}
			//this.hookSkill = [[20400,1],[20400,1],[20400,1],[20400,1],[20400,1]];
		}
		this.defaultSkillId = SceneUtil.getDefaultSkill(this.career);
		this.initUseSkillVO();
	}

	public set bodyId(value:string) {
		if(value == "" || value =="0")
		{
			this._bodyId =  "1101";
		}else{
			this._bodyId = value;
		}
	}

	public get bodyId():string {
		return this._bodyId;
	}
	// /**
	//  * 是否是攻击目标
	//  */
	// public isAtkTarget():Boolean{

	// 	return true;
	// }

	/**
	 * 清理
	 */
	public clear() {
		super.clear();
	}
}