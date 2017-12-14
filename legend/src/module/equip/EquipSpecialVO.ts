/**
 * module : 特殊装备数据VO
 * author : zrj
*/
module game {
    export class EquipSpecialVO{
        public pos : number; //位置
        public id : number; //装备id
        public piece : Array<any>; //碎片激活列表
        public constructor(data) {
            this.updateInfo(data);
        }

        public updateInfo(info) {
            this.pos = info.pos;
            this.id = info.id;
            this.piece = info.peaces;
        }

        public getpieceByKey(key) {
            for(let k in this.piece) {
                if(this.piece[k] == key) {
                    return this.piece[k];
                }
            }
        }

    }
}