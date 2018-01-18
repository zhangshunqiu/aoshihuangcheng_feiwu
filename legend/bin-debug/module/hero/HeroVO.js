var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 英雄数据VO
 * author : zrj
*/
var game;
(function (game) {
    //英雄装备部位信息 非战斗使用
    var HeroVO = (function () {
        function HeroVO(data) {
            this.equip_info = []; //装备信息
            this.wing_info = {}; //翅膀信息
            this.attributeInfo = []; //英雄属性信息 
            this.specialEquip = []; //特殊装备信息
            this.name = "zsq"; //
            this.nameColor = 0; //
            this.combat = 0; //战力
            this.lv = 0; //等级
            this.exp = 0; //经验
            this.weapon = ""; //武器外观
            this.clothes = ""; //衣服外观
            this.wing = ""; //翅膀外观
            this.skillDic = null; //技能字典
            this.jewelDic = null; //宝石字典
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
            this.updateInfo(data);
        }
        HeroVO.prototype.updateInfo = function (info) {
            this.id = info.id;
            this.type = info.type;
            if (this.type == RoleHeroType.MAIN) {
                RoleManager.getInstance().mainHeroVo = this;
            }
            this.job = info.job;
            this.sex = info.sex;
            this.score = info.score;
            this.equip_info = info.equip_info;
            this.wing_info = info.wing_info;
            this.updateAttributeInfo(info.attribute);
            this.updateSpecialEquipInfo(info.sp_equip);
            this.jewelDic = info.stone_info;
            this.updateSkill(info.skill_list);
            var tweapon = this.getWeaponModelId();
            var tclothes = this.getClothModelId();
            var twing = this.getWingModelId();
            var changModel = false;
            if (this.weapon != tweapon) {
                this.weapon = tweapon;
                changModel = true;
            }
            if (this.clothes != tclothes) {
                this.clothes = tclothes;
                changModel = true;
            }
            if (changModel) {
                SceneController.getInstance().updateclothesModel(tweapon, tclothes, this.id);
            }
        };
        HeroVO.prototype.updateSkill = function (data) {
            var _this = this;
            if (!this.skillDic) {
                this.skillDic = {};
                var info = game.SkillModel.getInstance().getSkillByCareer(this.job);
                var result = [];
                info.forEach(function (v, i, a) {
                    _this.skillDic[v.id] = 0;
                }, this);
            }
            for (var key in data) {
                this.skillDic[data[key].skill_id] = data[key].skill_lv;
            }
            SceneModel.getInstance().updateObjHookSkill(this.id, SceneObjectType.PLAYER);
        };
        HeroVO.prototype.updateAttributeInfo = function (info) {
            for (var i = 0; i < info.length; i++) {
                if (this.attributeInfo.length < i + 1) {
                    this.attributeInfo.push(new game.HeroAttributeVO(info[i]));
                }
                else {
                    this.attributeInfo[i].updateInfo(info[i]);
                }
            }
        };
        HeroVO.prototype.updateSpecialEquipInfo = function (info) {
            for (var i = 0; i < info.length; i++) {
                if (this.specialEquip.length < i + 1) {
                    this.specialEquip.push(new game.EquipSpecialVO(info[i]));
                }
                else {
                    this.specialEquip[i].updateInfo(info[i]);
                }
            }
        };
        //部位是否装备了装备，返回位置，没有返回-1
        HeroVO.prototype.equipExist = function (part) {
            for (var i = 0; i < this.equip_info.length; i++) {
                if (part == this.equip_info[i].part && this.equip_info[i].equip) {
                    return i;
                }
            }
            return -1;
        };
        //返回装备
        HeroVO.prototype.getEquipByPart = function (part) {
            var pos = this.equipExist(part);
            if (pos >= 0) {
                return this.equip_info[pos];
            }
            // return this.equip_info[part-1];
        };
        //返回特殊装备
        HeroVO.prototype.getEquipSpecialByPart = function (part) {
            for (var i = 0; i < this.specialEquip.length; i++) {
                if (this.specialEquip[i].pos == part) {
                    return this.specialEquip[i];
                }
            }
        };
        //返回位置信息
        HeroVO.prototype.getPartInfoByPart = function (part) {
            for (var i = 0; i < this.equip_info.length; i++) {
                if (part == this.equip_info[i].part) {
                    return this.equip_info[i];
                }
            }
        };
        //返回位置宝石信息
        HeroVO.prototype.getJewelInfoByPart = function (part) {
            for (var i = 0; i < this.jewelDic.length; i++) {
                if (part == this.jewelDic[i].part) {
                    return this.jewelDic[i].sotne_list;
                }
            }
        };
        //返回武器的模型的id，没有返回null
        HeroVO.prototype.getWeaponModelId = function () {
            var info = this.getEquipByPart(ConstEquipPart.WEAPON);
            if (info) {
                var itemInfo = App.ConfigManager.getEquipConfigById(info.good_id);
                return itemInfo.model;
            }
            return null;
        };
        //返回羽翼模型id，没有返回null
        HeroVO.prototype.getWingModelId = function () {
            var wingModel = game.WingModel.getInstance();
            if (wingModel.wingInfoObj[this.id]) {
                return wingModel.wingInfoObj[this.id].model;
            }
            return null;
        };
        //返回衣服的模型的id，没有返回null
        HeroVO.prototype.getClothModelId = function () {
            var info = this.getEquipByPart(ConstEquipPart.CLOTH);
            if (info) {
                var itemInfo = App.ConfigManager.getEquipConfigById(info.good_id);
                return itemInfo.model;
            }
            //返回默认衣服
            if (this.sex == ConstSex.MAN) {
                return "1700";
            }
            else if (this.sex == ConstSex.WOMAN) {
                return "1800";
            }
            return null;
        };
        //根据属性key去拿属性的值
        HeroVO.prototype.getAtrributeByKey = function (key) {
            for (var i = 0; i < this.attributeInfo.length; i++) {
                if (key == this.attributeInfo[i].key) {
                    return this.attributeInfo[i];
                }
            }
        };
        return HeroVO;
    }());
    game.HeroVO = HeroVO;
    __reflect(HeroVO.prototype, "game.HeroVO");
})(game || (game = {}));
//# sourceMappingURL=HeroVO.js.map