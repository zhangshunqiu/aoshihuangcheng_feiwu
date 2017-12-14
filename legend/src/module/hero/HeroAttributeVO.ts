module game {
    //英雄详细属性信息
    export class HeroAttributeVO {
        public key : string; //属性名
        public value : number; //固定值
        public addValue : number; //浮动值
        public constructor(data) {
            this.updateInfo(data);
        }

        public updateInfo(info) {
            this.key = ConstAttributeArray[info.key];
            this.value = info.value;
            this.addValue = info.add_value;
        }
        
    }
}