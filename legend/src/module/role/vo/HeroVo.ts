/**
 * 英雄VO
 * 
 */
class HeroVo {
	public heroId:number= 1000;//玩家ID
	public name:string= "zsq" ;//
	public nameColor:number= 0 ;//
	public sex:number= 1 ;//性别
	public career:number= 1000 ; //职业
	public combat:number= 0 ;//战力
	public lv:number= 0 ;//等级
	public exp:number= 0 ;//经验

	public weapon:number= 0 ;//武器外观
	public clothes:number= 0 ;//衣服外观
	public wing:number= 0 ;//翅膀外观

	public equip:any= null;//装备信息

	public skillDic:any= null;//技能字典
	
	public autoSkill:any= null;//自动释放技能
	public singleSkill:any= null;//单攻
	public groupSkill:any= null;//群攻
	public defaultSkill:any= null;//默认技能

	public buff:any = {};//buff信息

	//属性相关
	public curHp:number = 0;
	public hp:number = 0;  // 气血
	public hp_rate:number = 0;  // 基础血量百分比加成基础值
	public curMp:number = 0;
	public mp:number = 0; //魔法
	public mp_rate:number = 0;//基础魔法百分比加成评分基础值
	public ac:number = 0;//物理攻击
	public ac_rate:number = 0;//物理攻击百分比加成评分基础值

	public mac:number = 0;//魔法攻击
	public mac_rate:number = 0;//魔法攻击百分比加成评分基础值
	public sc:number = 0;//道术攻击评分基础值

	public def:number = 0;//物理防御评分基础值
	public def_rate:number = 0;//物理防御百分比加成评分基础值
	public sdef:number = 0;//法术防御评分基础值
	public sdef_rate:number = 0;//法术防御百分比加成评分基础值
	public hit:number = 0;//命中评分基础值
	public hit_rate:number = 0;//命中百分比加成评分基础值

	public dodge:number = 0;//闪避评分基础值
	public dodge_rate:number = 0;//闪避百分比加成评分基础值

	public holy:number = 0;//神圣

	public paralysis:number = 0;//麻痹评分基础值
	public damage_reduction_rate:number = 0;//伤害减免百分比加成评分基础值
	public damage_offset_rate:number = 0;//魔法抵消伤害评分基础值
	public damage_deepen:number = 0;//伤害输出百分比倍率评分基础值
	public damage_reduction:number = 0;//固定值减少所受攻击力评分基础值
	public attack_add:number = 0;//固定值增加输出攻击力评分基础值
	public hp_recover_rate:number = 0;//生命恢复百分比加成评分基础值
	public mp_recover_rate:number = 0;//魔法恢复百分比加成评分基础值

	public crit:number = 0;//暴击
	public crit_rate:number = 0;//击百分比加成评分基础值
	public crit_add:number = 0;//暴击伤害增加评分基础值
	public crit_reduction:number = 0;//暴击伤害固定值减少评分基础值

	public rcrit:number = 0;//抗暴
	public rcrit_rate:number = 0;//抗暴率


	public constructor() {

	}
}