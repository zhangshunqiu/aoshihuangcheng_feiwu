/**
 * Author: liuyonggen
 * 翅膀模块数据Vo  2017/11/16
 */
module game {
    export class WingVo {
        public heroId: number;  //翅膀对应的唯一伙伴id
        public job: number;  //翅膀对应职业 
        public wingId: any; //翅膀id
        public openLv: number; // 羽翼开启等级
        public step: any; //翅膀当前阶数
        public star: any;   //星数
        public currentWingId: number;
        public currentWingExp: number;
        public currentStar: number; //当前星数
        public currentWingEquip: any[];  //当前羽翼装备
        public exp: number;   //当前经验
        public score: number;   //当前战力
        public wingEquip: Array<any>=[];   //羽翼装备 是一个对象数组 0正羽，1副羽，2绒羽，3须羽
        public wingEquipAttr: WingEquipAttrVo = new WingEquipAttrVo();   //羽翼装备属性之和
        public WingEquipStep: any = {};   //羽翼各部分装备阶数
        public wingEquipGoStep: any = {}; //羽翼装备能否升阶
        public replaceWingEquip: boolean = false;  //是否有可替换的羽翼装备
        public perfectWing: number = 0;  //完美羽翼阶数
        public perfectWingRate: number; //完美羽翼比率
        public perfectWingNextRate: number;  //下一阶完美羽翼比率
        public expStar: number; //升星所需经验
        public liftExp: number; //点击一次升星获得经验
        public wingExp: number; //羽毛一次获得经验
        public coinStar: number;  //升满当前经验条所需金币
        public wingStar: number;  //升满经验条所需羽毛
        public coin: number;  //点击一次消耗金币
        public needWing: number;  //点击一次消耗羽毛
        public attr: Object;  //翅膀属性
        public nextStarAttr: Object;  //翅膀下一星属性
        public attrRate: number;   //完美神翼属性加成
        public transform_gold: number;  //转换所需元宝
        public skill: Object;   //阶数对应技能
        public photo: string;    //阶数对应翅膀图片
        public model: string; //阶数对应翅膀模型

    }
}