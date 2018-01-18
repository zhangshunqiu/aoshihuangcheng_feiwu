var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 英雄VO
 *
 */
var HeroVo = (function () {
    function HeroVo() {
        this.heroId = 1000; //玩家ID
        this.name = "zsq"; //
        this.nameColor = 0; //
        this.sex = 1; //性别
        this.career = 1000; //职业
        this.combat = 0; //战力
        this.lv = 0; //等级
        this.exp = 0; //经验
        this.weapon = 0; //武器外观
        this.clothes = 0; //衣服外观
        this.wing = 0; //翅膀外观
        this.equip = null; //装备信息
        this.skillDic = null; //技能字典
        this.autoSkill = null; //自动释放技能
        this.singleSkill = null; //单攻
        this.groupSkill = null; //群攻
        this.defaultSkill = null; //默认技能
        this.buff = {}; //buff信息
        //属性相关
        this.curHp = 0;
        this.hp = 0; // 气血
        this.hp_rate = 0; // 基础血量百分比加成基础值
        this.curMp = 0;
        this.mp = 0; //魔法
        this.mp_rate = 0; //基础魔法百分比加成评分基础值
        this.ac = 0; //物理攻击
        this.ac_rate = 0; //物理攻击百分比加成评分基础值
        this.mac = 0; //魔法攻击
        this.mac_rate = 0; //魔法攻击百分比加成评分基础值
        this.sc = 0; //道术攻击评分基础值
        this.def = 0; //物理防御评分基础值
        this.def_rate = 0; //物理防御百分比加成评分基础值
        this.sdef = 0; //法术防御评分基础值
        this.sdef_rate = 0; //法术防御百分比加成评分基础值
        this.hit = 0; //命中评分基础值
        this.hit_rate = 0; //命中百分比加成评分基础值
        this.dodge = 0; //闪避评分基础值
        this.dodge_rate = 0; //闪避百分比加成评分基础值
        this.holy = 0; //神圣
        this.paralysis = 0; //麻痹评分基础值
        this.damage_reduction_rate = 0; //伤害减免百分比加成评分基础值
        this.damage_offset_rate = 0; //魔法抵消伤害评分基础值
        this.damage_deepen = 0; //伤害输出百分比倍率评分基础值
        this.damage_reduction = 0; //固定值减少所受攻击力评分基础值
        this.attack_add = 0; //固定值增加输出攻击力评分基础值
        this.hp_recover_rate = 0; //生命恢复百分比加成评分基础值
        this.mp_recover_rate = 0; //魔法恢复百分比加成评分基础值
        this.crit = 0; //暴击
        this.crit_rate = 0; //击百分比加成评分基础值
        this.crit_add = 0; //暴击伤害增加评分基础值
        this.crit_reduction = 0; //暴击伤害固定值减少评分基础值
        this.rcrit = 0; //抗暴
        this.rcrit_rate = 0; //抗暴率
    }
    return HeroVo;
}());
__reflect(HeroVo.prototype, "HeroVo");
//# sourceMappingURL=HeroVo.js.map