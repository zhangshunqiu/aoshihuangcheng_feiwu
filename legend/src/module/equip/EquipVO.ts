/**
 * module : 装备数据VO
 * author : zrj
*/
module game {
    export class EquipVO extends ItemVO {
        public score : number; //评分
        public base : any; //基础
        public strength : any; //强化
        public special : any; //极品 （升星）
        public wash : any; //神装
        public ruby : any; //宝石
        public constructor(data) {
            super(data);
        }

        public updateInfo(info) {
            super.updateInfo(info);
            this.score = this.equip.score;
            this.base = this.equip.base;
            this.special = this.equip.special;
            this.wash = this.equip.wash;
        }

        public getBaseByKey(key) {
            for(let k in this.base) {
                if(this.base[k].key == key) {
                    return this.base[k];
                }
            }
        }
        public getSpecialByKey(key) {
            for(let k in this.special) {
                if(this.special[k].key == key) {
                    return this.special[k];
                }
            }
        }
        public getWashByKey(key) {
            for(let k in this.wash) {
                if(this.wash[k].key == key) {
                    return this.wash[k];
                }
            }
        }

    }
}