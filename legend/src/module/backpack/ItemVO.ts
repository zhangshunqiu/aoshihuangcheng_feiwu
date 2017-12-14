/**
 * module : 道具数据模型VO
 * author : zrj
*/
module game {
    export class ItemVO {
        public type : number; //类型 clientType
        public id : number; //唯一id
        public good_id : number; //物品id
        public num : number; //数量
        public equip : any; //装备属性

        public constructor(data) {
            this.updateInfo(data);
        }

        public updateInfo(info) {
            this.type = info.type;
            this.id = info.id;
            this.good_id = info.good_id;
            this.num = info.num;
            this.equip = info.equip;
        }
    }
}