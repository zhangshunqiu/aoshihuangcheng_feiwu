/**
 * 英雄数据VO
 * author : zrj
*/
module game {
    //英雄装备部位信息 非战斗使用
    export class HeroVO {
        public id: number;               //伙伴唯一id
        public type: number;             //1主角,2其他 RoleHeroType
        public job: number;              //伙伴职业
        public sex: number;              //伙伴性别
        public score: number;
        public equip_info: Array<HeroPartVO> = [];        //装备信息
        public wing_info: any = {};   //翅膀信息
        public attributeInfo: Array<HeroAttributeVO> =[];  //英雄属性信息 
        public specialEquip : Array<EquipSpecialVO> = [];  //特殊装备信息

        public name: string = "zsq";//
        public nameColor: number = 0;//
        public combat: number = 0;//战力
        public lv: number = 0;//等级
        public exp: number = 0;//经验

        public weapon: string = "";//武器外观
        public clothes: string = "";//衣服外观
        public wing: string = "";//翅膀外观

        public skillDic: any = null;//技能字典
        public jewelDic: Array<any> = null;//宝石字典
        public autoSkill: any = null;//自动释放技能
        public singleSkill: any = null;//单攻
        public groupSkill: any = null;//群攻
        public defaultSkill: any = null;//默认技能

        public buff: any = {};//buff信息

        //属性相关
        public curHp: number = 0;
        public hp: number = 0;  // 气血
        public hp_rate: number = 0;  // 基础血量百分比加成基础值
        public curMp: number = 0;
        public mp: number = 0; //魔法
        public mp_rate: number = 0;//基础魔法百分比加成评分基础值
        public ac: number = 0;//物理攻击
        public ac_rate: number = 0;//物理攻击百分比加成评分基础值

        public mac: number = 0;//魔法攻击
        public mac_rate: number = 0;//魔法攻击百分比加成评分基础值
        public sc: number = 0;//道术攻击评分基础值

        public def: number = 0;//物理防御评分基础值
        public def_rate: number = 0;//物理防御百分比加成评分基础值
        public sdef: number = 0;//法术防御评分基础值
        public sdef_rate: number = 0;//法术防御百分比加成评分基础值
        public hit: number = 0;//命中评分基础值
        public hit_rate: number = 0;//命中百分比加成评分基础值

        public dodge: number = 0;//闪避评分基础值
        public dodge_rate: number = 0;//闪避百分比加成评分基础值

        public holy: number = 0;//神圣

        public paralysis: number = 0;//麻痹评分基础值
        public damage_reduction_rate: number = 0;//伤害减免百分比加成评分基础值
        public damage_offset_rate: number = 0;//魔法抵消伤害评分基础值
        public damage_deepen: number = 0;//伤害输出百分比倍率评分基础值
        public damage_reduction: number = 0;//固定值减少所受攻击力评分基础值
        public attack_add: number = 0;//固定值增加输出攻击力评分基础值
        public hp_recover_rate: number = 0;//生命恢复百分比加成评分基础值
        public mp_recover_rate: number = 0;//魔法恢复百分比加成评分基础值

        public crit: number = 0;//暴击
        public crit_rate: number = 0;//击百分比加成评分基础值
        public crit_add: number = 0;//暴击伤害增加评分基础值
        public crit_reduction: number = 0;//暴击伤害固定值减少评分基础值

        public rcrit: number = 0;//抗暴
        public rcrit_rate: number = 0;//抗暴率

        public constructor(data) {
            this.updateInfo(data);
        }

        public updateInfo(info) {
            this.id = info.id;
            this.type = info.type;
            if (this.type == RoleHeroType.MAIN) {
                RoleManager.getInstance().mainHeroVo = this;
            }
            this.job = info.job;
            this.sex = info.sex;
            this.score = info.score;
            this.equip_info = info.equip_info;
            this.updateAttributeInfo(info.attribute);
            this.updateSpecialEquipInfo(info.sp_equip);
            this.jewelDic = info.stone_info;
            this.updateSkill(info.skill_list)

            var tweapon = this.getWeaponModelId();
            var tclothes = this.getClothModelId();
            var twing = this.getWingModelId();
            var changModel: Boolean = false;
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
        }

        public updateSkill(data) {
            if (!this.skillDic) { //没数据，但是有英雄在
                this.skillDic = {};
                let info = SkillModel.getInstance().getSkillByCareer(this.job);
                let result = [];
                info.forEach((v, i, a) => {
                    this.skillDic[v.id] = 0;
                }, this);
            }
            for (let key in data) {
                this.skillDic[data[key].skill_id] = data[key].skill_lv;
            }
            SceneModel.getInstance().updateObjHookSkill(this.id,SceneObjectType.PLAYER);
        }

        public updateAttributeInfo(info) {
            for(let i=0;i<info.length;i++) {
                if (this.attributeInfo.length< i+1){
                    this.attributeInfo.push(new HeroAttributeVO(info[i]));
                } else {
                    this.attributeInfo[i].updateInfo(info[i]);
                }
            }
        }

        public updateSpecialEquipInfo(info) {
            for(let i=0;i<info.length;i++) {
                if (this.specialEquip.length< i+1){
                    this.specialEquip.push(new EquipSpecialVO(info[i]));
                } else {
                    this.specialEquip[i].updateInfo(info[i]);
                }
            }
        }


        //部位是否装备了装备，返回位置，没有返回-1
        public equipExist(part) {
            for (let i = 0; i < this.equip_info.length; i++) {
                if (part == this.equip_info[i].part && this.equip_info[i].equip) {
                    return i;
                }
            }
            return -1;
        }

        //返回装备
        public getEquipByPart(part) {
            let pos = this.equipExist(part);
            if (pos >= 0) {
                return this.equip_info[pos];
            }
            // return this.equip_info[part-1];
        }

        //返回特殊装备
        public getEquipSpecialByPart(part) {
            for (let i=0;i<this.specialEquip.length;i++) {
                if (this.specialEquip[i].pos == part) {
                    return this.specialEquip[i];
                }
            }
        }


        //返回位置信息
        public getPartInfoByPart(part) {
            for (let i = 0; i < this.equip_info.length; i++) {
                if (part == this.equip_info[i].part) {
                    return this.equip_info[i];
                }
            }
        }

        //返回位置宝石信息
        public getJewelInfoByPart(part) {
            for (let i = 0; i < this.jewelDic.length; i++) {
                if (part == this.jewelDic[i].part) {
                    return this.jewelDic[i].sotne_list;
                }
            }
        }

        //返回武器的模型的id，没有返回null
        public getWeaponModelId() {
            let info = this.getEquipByPart(ConstEquipPart.WEAPON);
            if (info) { //装备了
                let itemInfo = App.ConfigManager.getEquipConfigById(info.good_id);
                return itemInfo.model;
            }
            return "";
        }
        //返回羽翼模型id，没有返回null
        public getWingModelId() {
            let wingModel = (WingModel.getInstance() as WingModel);
            if (wingModel.wingInfoObj[this.id]) {
                return wingModel.wingInfoObj[this.id].model;
            }
            return "";
        }

        //返回衣服的模型的id，没有返回null
        public getClothModelId() {
            let info = this.getEquipByPart(ConstEquipPart.CLOTH);
            if (info) { //装备了
                let itemInfo = App.ConfigManager.getEquipConfigById(info.good_id);
                return itemInfo.model;
            }
            //返回默认衣服
            if (this.sex == ConstSex.MAN) {
                return "1101";
            } else if (this.sex == ConstSex.WOMAN) {
                return "1201";
            }
            return "";
        }

        //根据属性key去拿属性的值
        public getAtrributeByKey(key) {
            for (let i = 0; i < this.attributeInfo.length; i++) {
                if (key == this.attributeInfo[i].key) {
                    return this.attributeInfo[i];
                }
            }
        }

    }
}