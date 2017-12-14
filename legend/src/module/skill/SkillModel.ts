/**
 * 技能数据模型
 * author : zrj
*/
module game {
    export class SkillModel extends BaseModel {
        // public skillInfo : Array<Array<any>> = [[],[],[]]; //按照英雄顺序存储
        // public curData: any = {}; //当前升级技能data

        public heroModel: HeroModel = HeroModel.getInstance();
        public heroHeadRedDot  = [false,false,false]; //英雄头部红点
        public constructor() {
            super();
        }

        //技能数据
        public updateSkillInfo(data) {
            //初始化
            this.heroModel.heroInfo.forEach((value, index, array) => {
                if (value.id == data.hero_id) {
                    if (!value.skillDic) { //没数据，但是有英雄在
                        value.skillDic = {};
                        let info = this.getSkillByCareer(value.job);
                        let result = [];
                        info.forEach((v, i, a) => {
                            value.skillDic[v.id] = 0;
                        }, this);
                    }
                    for (let key in data.list) {
                        value.skillDic[data.list[key].skill_id] = data.list[key].skill_lv;
                    }
                    // console.log(value)
                }
            }, this)

        }

        //升级技能
        public upgradeSkillByData(data) {
            this.heroModel.heroInfo.forEach((value, index, array) => {
                if (value.id == data.hero_id) {
                    value.skillDic[data.skill_id] = data.skill_lv;
                }
            }, this)
        }

        public getSkillByCareer(career) {
            let info = App.ConfigManager.skillTreeConfig();
            let existKey = {};
            let result = [];
            for (let key in info) {
                if (info[key].career == career) {
                    if (!existKey[info[key].id]) {
                        result.push(info[key]);
                        existKey[info[key].id] = true;
                    }
                }
            }
            return result;
        }

        public getSkillUpgrageByIdLevel(id, level) {
            let info = App.ConfigManager.skillTreeConfig();
            for (let key in info) {
                if (info[key].id == id && info[key].lv == level) {
                    return info[key];
                }
            }
        }
        //拿skill表的数据，战斗用
        public getSkillInfoByIdLevel(id, level) {
            let info = App.ConfigManager.skillConfig();
            for (let key in info) {
                if (info[key].skill_id == id && info[key].skill_lv == level) {
                    return info[key];
                }
            }
        }

        //技能升级红点
        public checkSkillCanUpgradeRedDot(pos) {
            let heroModel = HeroModel.getInstance() as HeroModel;
            this.heroHeadRedDot[pos] = false;
            for (let key in this.heroModel.heroInfo[pos].skillDic) {
                let info = this.getSkillUpgrageByIdLevel(key, this.heroModel.heroInfo[pos].skillDic[key]);
                let nextInfo = this.getSkillUpgrageByIdLevel(key, this.heroModel.heroInfo[pos].skillDic[key] + 1)
                if (!info) { //未激活

                }
                if (!nextInfo) {  //满级

                } else {
                    if (App.RoleManager.roleInfo.lv > nextInfo.open_lv && App.RoleManager.roleInfo.lv >= nextInfo.lv && App.RoleManager.roleWealthInfo.coin >= nextInfo.cost_coin) { //可以升级
                        this.heroHeadRedDot[pos] = true;
                    } else {

                    }
                }
            }

        }

        //技能升级红点
        public checkSkillCanUpgradeAll() {
            let heroModel = HeroModel.getInstance() as HeroModel;
            heroModel.heroInfo.forEach((value,index,array)=>{
                this.checkSkillCanUpgradeRedDot(index);
            },this)
            
            App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_SKILL,false);
            this.heroHeadRedDot.forEach((value,index,array)=>{
                if (value) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_SKILL,true);
                }
            },this);
        }

        public clear() {
            super.clear();
        }

        public destroy() {
            super.destroy();
        }
    }
}