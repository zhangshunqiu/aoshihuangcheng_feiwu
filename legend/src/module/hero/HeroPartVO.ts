module game {
    //英雄装备部位信息
    export class HeroPartVO extends EquipVO {
        public part : number; //部位
        public lv : any; //强化等级
        public star : number; //升星等级
        public constructor(data) {
            super(data);
        }

        public updateInfo(info) {
            super.updateInfo(info);
            this.lv = info.lv;
            this.part = info.part;
            this.star = info.star;
        }
        
    }
}