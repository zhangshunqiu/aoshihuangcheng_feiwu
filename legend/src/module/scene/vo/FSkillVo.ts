/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 战斗技能VO
 */
class FSkillVo {
	private _skillConfig:any = {};//技能配置信息
	private _id:number = 0;//技能ID
	private _lv:number = -1;//技能级别
	private _skillId:number = 1000;//技能模板ID
	private _cdTime:number=1000;//技能cd,只有过了这个时间才能执行这个技能
	private _type:number=1;//技能类型 1=主动,2=被动
	//private _mp:number=1000;//技能需要的魔法
	private _startTime:number=1000;//技能开始时间
	private _endTime:number=1000;//技能结束时间
	private _isLock:boolean = false;//是否锁定
	

	//private _atkType:number = 0;//攻击类型，法术攻击还是物理攻击
	private _actionTime:number = 800;//技能动作时间毫秒，攻击开始后只有过了这个时间才能执行下一动作
	private _atkDis:number =328;//攻击距离
	private _targetType:number = 1;//目标类型 AtkTargetType SELF:1,//自己 PARTNER:2,//队友 ENEMY:3,//敌方 EMPTY:4,//空放
	private _atkRange:any = null;//攻击范围 如 {circle, 1}
	private _atkRangeId:number = 1;//攻击范围Id 如 1，2，3 对应 SkillAtkRange
	private _atkRangeType:number = 0;//攻击范围类型ID 如 1.单攻 2.3*3格群攻 3.周围5格攻击（半月） 4.前方2格 5，前方5格 6.前方4格
	
	private _atkActType:number = 3;//攻击动作类型 3普攻，4法术攻击 ......
	private _atkEff:string = "";//攻击效果Id
	private _atkEffType:number = 1;//攻击效果类型 1表示一个方向 大于1表示8个方向
	private _flyEff:string = "";//飞行效果ID
	private _hurtEff:string = "";//伤害效果
	private _hurtEffType:number = 1;//伤害效果类型 如：1.单体（单个人上）2.多人（分别放多人）3.单体或者多人身上地表(在脚点) 4.群体空中 效果在人上 5.火墙

	private _atkSound:string = "";
	private _hurtSound:string = "";
	private _costMp:number = 0;//消耗魔法

	public maxPetNum:number = 1;//最大宠物数
	public constructor() {
		//	this._skillConfig
	}

	public initSkill(skillId:number,lv:number,skillConfig:any = null) {
		if(this._skillId == skillId && this._lv == lv){return;}
		if(skillConfig == null){
			this._skillConfig = ConfigManager.getInstance().getSkillConfigById(skillId,lv);
		}else{
			this._skillConfig = skillConfig;
		}
		this._id = skillId+lv;
		this._lv = lv;
		this._skillId = skillId;
		//this._cdTime = this._skillConfig.skill_cd;
		this._type = this._skillConfig.type;
		this._targetType = this._skillConfig.target;
		this._atkRange = this._skillConfig.range;
		this._atkRangeId = this._skillConfig.rangeId
		this._atkRangeType = this._skillConfig.range_type;
		this._atkEffType = this._skillConfig.atkEffType;
		this._atkEff =  String(this._skillConfig.atkEff);
		this._atkActType = this._skillConfig.atkAct;
		this._atkSound = this._skillConfig.atkSound;
		this._hurtSound = this._skillConfig.hurtSound;
		this._flyEff = String(this._skillConfig.flyEff);
		this._hurtEff =  String(this._skillConfig.hurtEff);
		this._hurtEffType = this._skillConfig.hurtEffType;
		this._cdTime = this._skillConfig.skill_cd;
		this._atkDis = Math.max(this._skillConfig.atk_dis*64+32,96);//必须超过两格
		this._costMp = this._skillConfig.costMp;
		this._actionTime = this._skillConfig.actionTime;
	}

	/**
	 * 设置使用时间
	 */
	public setUseTime() {
		this._startTime = Date.now();
		this._endTime = this._startTime +this._cdTime;
	}

	/**
	 * 是否可以使用
	 */
	public useEnable(mp:number = 100000) {
		if(Date.now() > this._endTime && this._isLock == false && mp > this._costMp){
			return true;
		}
		return false;
	}

	public set hurtEffType(value:number){
		this._hurtEffType = value;
	}
	public get hurtEffType():number{
		return this._hurtEffType;
	}

	public set hurtEff(value:string){
		this._hurtEff = value;
	}
	public get hurtEff():string{
		return this._hurtEff;
	}
	public set flyEff(value:string){
		this._flyEff = value;
	}
	public get flyEff():string{
		return this._flyEff;
	}
	public set atkEffType(value:number){
		this._atkEffType = value;
	}
	public get atkEffType():number{
		return this._atkEffType;
	}
	public set atkEff(value:string){
		this._atkEff = value;
	}
	public get atkEff():string{
		return this._atkEff;
	}
	public get actionTime():number{
		return this._actionTime;
	}

	public set atkActType(value:number){
		this._atkActType = value;
	}
	public get atkActType():number{
		return this._atkActType;
	}

	public get atkRangeType():number{
		return this._atkRangeType;
	}
	public get atkRangeId():number{
		return this._atkRangeId;
	}
	public get atkRange():any{
		return this._atkRange;
	}
	public get targetType():number{
		return this._targetType;
	}
	public set atkDis(value:number){
		this._atkDis = value;
	}
	public get atkDis():number{
		return this._atkDis;
	}
	public get isLock():any{
		return this._isLock;
	}
	public get endTime():number{
		return this._endTime;
	}
	public get startTime():number{
		return this._startTime;
	}
	public get costMp():number{
		return this._costMp;
	}
	public get cdTime():number{
		return this._cdTime;
	}
	public get skillId():number{
		return this._skillId;
	}
	public get lv():number{
		return this._lv;
	}
	public get id():number{
		return this._id;
	}
	public get skillConfig():any{
		return this._skillConfig;
	}
}

/**
 * 战斗中技能对应目标VO
 */
class FSkillTargetVo {
	public skillId:number;//技能Id
	public skillVo:FSkillVo;//技能Vo
	public targetArr:Array<any>;//目标列表
	public targetPoint:point;//目标点
	public atkVo:BaseFightObjVo;//攻击者VO 
	
	//协议pbHookUseSkill
	public creatHookTriggerData(atkVo:BaseFightObjVo):any{
		var obj:any = {};
		obj.skill_id = this.skillVo.skillId;
		obj.cast_type = atkVo.type;
		obj.cast_id = atkVo.id;
		if(this.targetPoint){
			obj.x = this.targetPoint.x;
			obj.y = this.targetPoint.y;
		}

		var targetArr:Array<any> = [];
		if(this.targetArr && this.targetArr.length > 0 ){
			for(var i:number = 0;i<this.targetArr.length;i++){
				var vo:BaseObjectVo = this.targetArr[i];
				targetArr.push({obj_type:vo.type,obj_id:vo.id})
			}
		}
		obj.target_list = targetArr;
		return obj;
	}
}