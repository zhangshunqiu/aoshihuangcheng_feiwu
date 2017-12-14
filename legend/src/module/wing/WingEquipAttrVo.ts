/**
 * Author: liuyonggen
 * 翅膀装备属性数据结构 2017/11/16
 */
module game {
    export class WingEquipAttrVo {
        public id: number;   //羽翼装备id
        public hp: number = 0;   //生命值
		public ac: number = 0;   //物理攻击
		public mac: number = 0;   //魔法攻击
		public sc: number = 0;    //道术攻击
		public def: number = 0;    //物理防御
		public sdef: number = 0;   //魔法防御
		public type: number;   //类型
	    public grade: number = 0;  //评分
        public zhengyuScore: number = 0;   //正羽评分
        public fuyuScore: number = 0;   //副羽评分
        public rongyuScore: number = 0;   //绒羽评分
        public xuyuScore: number = 0;   //须羽评分
    }
}