/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 基础战斗对象VO
 */
class BaseFightObjVo extends BaseObjectVo {
	public lv:number;       //对象等级
	public curHp:number;   //对象当前血量
	public curMp:number;   //对象当前魔法
	public hp:number;   	//血量
	public mp:number;   	//魔法
	public moveSpeed:number = 4;
	public actState:number = ActState.STAND;//动作状态
	public dire:DireScale = new DireScale(5,1,5);

	public hookSkill:Array<Array<number>> = [];//挂机技能列表；
	public hookSkillVOList:Array<FSkillVo> = [];//挂机技能VO列表；
	public hookSkillIndex:number = 0;//挂机技能索引；
	public defaultSkillId:number = 10000;
	public defaultSkillVo:FSkillVo;//默认技能Vo

	public isInvisible:Boolean = false;//是否隐形

	public pkMode:number = PKModeType.PEACE;//pk模式
	public teamId:number = 0; //队伍ID
	public guildId:number = 0; //帮派id
	public nameColor:number; //名字颜色

	public ownerType:number = 3; 	// 对象主人类型
	public ownerId:number = 3; 	// 对象主人id，英雄的主人ID是主英雄，宠物的主人ID是当前英雄

	public mainOwnerId:number = 0;//对应的主英雄ID，英雄和宠物都适用

	public buffDic:any = {};//buffVO字典
	protected buffEffkeyDic:any;//buff效果Key字典 BuffEffType
	public initBuffQueue:Array<FBuffVo>;//协议返回的需要初始化的buffVO队列
	
	//buff

		//buff效果相关
	// self.buffPoison = nil --中毒
	// self.buffShield = nil --魔法盾
	// self.buffDizzy = nil --眩晕
	// self.buffFire = nil --烈火
	// self.buffStone = nil --石化
	// self.buffInvisible = nil --隐身
	// self.buffAttAdd = nil --属性加成如防御等
	// self.buffCure = nil --治疗
	// self.silent = nil  --沉默

// 	const BuffEffType={
// 	NULL: 0,//空
// 	/**沉默 */
// 	SILENT: 9,//沉默
// 	CURE: 1,//治疗
// 	ATTADD: 2,//属性加成
// 	/**隐身 */
// 	INVISIBLE: 3,//隐身
// 	/**石化 */
// 	STONE: 4,//石化
// 	/**烈火 */
// 	FIRE: 5,//烈火
// 	/**眩晕 */
// 	DIZZY: 6,//眩晕
// 	/**魔法盾 */
// 	SHIELD: 7,//魔法盾
// 	/** 中毒*/
// 	POISON: 8,//中毒
// }
	//buff END

	protected petIdList:Array<number>;//宠物ID列表

	protected isUseSkill:boolean = true;//是否使用技能

	public constructor() {
		super();

		this.isUseSkill = (SceneUtil.isMainScene(SceneModel.getInstance().sceneId) ==false);
	}

	/**
	 * 更新挂机技能(子类用)
	 */
	public updateHookSkill(hVo:game.HeroVO = null){

	}

	/**
	 * 获取使用技能VO
	 */
	public getUseFSkillVo():FSkillVo{
		var vo:FSkillVo;
		if(this.hookSkillVOList.length == 1){
			vo = this.hookSkillVOList[0];
			if(vo.useEnable(this.mp) && this.checkSkillCanUse(vo)){
				vo.setUseTime();
				return vo;
			}
		}else if(this.hookSkillVOList.length > 1){
			for(var i:number = this.hookSkillIndex;i<this.hookSkillVOList.length;i++){
				vo = this.hookSkillVOList[i];
				if(vo.useEnable(this.mp) && this.checkSkillCanUse(vo)){
					vo.setUseTime();
					this.setNextHookSkillIndex();
					return vo;
				}
			}
			for(var k:number = 0;k<this.hookSkillIndex;k++){
				vo = this.hookSkillVOList[k];
				if(vo.useEnable(this.mp) && this.checkSkillCanUse(vo)){
					vo.setUseTime();
					this.setNextHookSkillIndex();
					return vo;
				}
			}
		}
		this.defaultSkillVo.setUseTime();
		return this.defaultSkillVo;
	}


	/**
	 * 检测该技能是否可以使用
	 * @param vo 技能Vo
	 */
	public checkSkillCanUse(vo:FSkillVo):boolean{
		if(vo.skillId == SKILL_ZHS_ID && this.getPetNum() >= vo.maxPetNum){
			return false;
		}else if(vo.skillId == SKILL_MFD_ID && this.hasBuffEffType(BuffEffType.SHIELD)){
			return false;
		}
		return true;
	}

	/**
	 * 设置下一技能
	 */
	protected setNextHookSkillIndex(){
		this.hookSkillIndex++;
		if(this.hookSkillIndex >= this.hookSkillVOList.length){
			this.hookSkillIndex = 0;
		}
	}

	/**
	 * 初始化使用技能Vo
	 */
	protected initUseSkillVO(){
		this.hookSkillVOList = [];
		let vo:FSkillVo
		for(var i:number =0;i<this.hookSkill.length;i++){
			vo = new FSkillVo();
			vo.initSkill(this.hookSkill[i][0],this.hookSkill[i][1]);
			this.hookSkillVOList.push(vo);
		}
		if(this.defaultSkillVo == null){
			this.defaultSkillVo = new FSkillVo();
		}
		this.defaultSkillVo.initSkill(this.defaultSkillId,1);
		if(this.hookSkillIndex > this.hookSkillVOList.length){
			this.hookSkillIndex = 0;
		}
	}


	/**
	 * 添加 初始化Buff队列
	 * @param vo FBuffVo
	 */
	public addInitBuffQueue(vo:FBuffVo){
		if(this.initBuffQueue == null){
			this.initBuffQueue = [];
		}
		this.initBuffQueue.push(vo);
	}

	/**
	 * 是否存在该类型的buff效果
	 * @param btype buff效果类型
	 */
	public hasBuffEffType(btype:number):Boolean{
		if(this.buffEffkeyDic){
			return this.buffEffkeyDic[btype];
		}
		return false;
	}

	/**
	 * 添加Buff
	 * @param vo FBuffVo
	 */
	public addBuff(vo:FBuffVo){
		this.buffDic[vo.id] = vo;
		if(this.buffEffkeyDic == null){
			this.buffEffkeyDic = {};
		}
		this.buffEffkeyDic[vo.effType] = true;
	}
	/**
	 * 移除Buff
	 * @param vo:FBuffVo
	 */
	public removeBuff(vo:FBuffVo){
		if(this.buffEffkeyDic){
			this.buffEffkeyDic[vo.effType] = false;
		}
		this.buffDic[vo.id] = null;
		delete this.buffDic[vo.id];
	}
	/**
	 * 添加宠物ID
	 * @param petId
	 */
	public addPetID(petId:number){
		if(this.petIdList == null){
			this.petIdList = [];
		}
		this.petIdList.push(petId);
	}
	/**
	 * 移除宠物ID
	 */
	public removePetID(petId:number){
		if(this.petIdList){
			var index = this.petIdList.indexOf(petId);
			if(index >=0){
				this.petIdList.splice(index,1);
			}
		}
	}
	/**
	 * 获取宠物数量
	 */
	public getPetNum():number{
		if(this.petIdList == null){
			return 0;
		}
		return this.petIdList.length;
	}

	/**
	 * 是否可以移动
	 */
	public enableMove():boolean{
		if( this.hasBuffEffType(BuffEffType.STONE) || this.hasBuffEffType(BuffEffType.DIZZY)){
			return false;
		}
		return true;
	}
	/**
	 * 是否可以释放技能
	 */
	public enableUseSkill():boolean{
		if(this.isUseSkill == false || this.hasBuffEffType(BuffEffType.STONE) || this.hasBuffEffType(BuffEffType.DIZZY) || this.hasBuffEffType(BuffEffType.SILENT)){
			return false;
		}
		return true;
	}
	
	/**
	 * 清理
	 */
	public clear() {
		super.clear();	
	}
}