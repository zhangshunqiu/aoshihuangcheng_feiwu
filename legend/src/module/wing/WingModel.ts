/**
 * Author: liuyonggen
 * 翅膀模块数据模型  2017/11/16
 */

module game {
    export class WingModel extends BaseModel {
        public wingInfoObj:any = {};
        public heroInfo:any = {};
        public wingInfo: WingVo;
        public _backpackModel: BackpackModel = BackpackModel.getInstance();
        public zhengyuStep: Boolean = false;
        public fuyuStep: Boolean = false;
        public rongyuStep: Boolean = false;
        public xuyuStep: Boolean = false;
        public replaceWingEquip: Boolean = false;
        
        public constructor() {
            super();
            this.heroInfo = {};
            this.wingInfo = new WingVo();
            this.updateBaseInfo();
        }

        public updateBaseInfo() {
            let baseinfo = App.RoleManager.roleInfo;
            let wealthInfo = App.RoleManager.roleWealthInfo;
            this.heroInfo.lv = baseinfo.lv;   //角色等级
            this.heroInfo.vip_lv = baseinfo.vipLv;  //角色VIP等级
            this.heroInfo.sex = baseinfo.sex;  //角色性别
            this.heroInfo.career = baseinfo.career;   //角色职业 1战士 2法师  3道士
            this.heroInfo.coin = wealthInfo.coin;  //角色金币
            this.heroInfo.gold = wealthInfo.gold;  //角色元宝
            //转生次数
        }

        public updateHeroInfo(data) {
            let heroInfoR = data;
            for(let i=0; i<heroInfoR.length; i++) {
                this.updateWingInfo({wing_info:heroInfoR[i].wing_info, id:heroInfoR[i].id, job:heroInfoR[i].job});
            }
            App.EventSystem.dispatchEvent(PanelNotify.WING_INFO_UPDATE);
        }

        public updateWingInfo(data) {
            let wingInfoR = data.wing_info;
            // let wingInfoR = {wing_id:15,exp:200,score:1000};
            // App.loglyg("翅膀id",data.id);
            // App.loglyg("翅膀数据",wingInfoR);
            this.wingInfo.heroId = data.id;
            this.wingInfoObj[data.id] = wingInfoR;
            this.wingInfo.wingId = wingInfoR.wing_id;
            this.wingInfo.openLv = App.ConfigManager.getConstConfigByType("WING_LEVEL").value;
            if(wingInfoR.wing_id) {  //角色是否开启羽翼, 0为未开启，其余数字为开启 
                this.wingInfo.job = data.job || this.wingInfo.job;
                this.wingInfo.step = Math.floor((this.wingInfo.wingId-1) / 10 + 1);  //翅膀当前阶数
                this.wingInfo.star = (this.wingInfo.wingId-1) % 10;   //当前星数
                this.wingInfo.exp = wingInfoR.exp;  //当前经验
                this.wingInfo.score = wingInfoR.score;   //当前战力
                // wingInfoR.wing_equip = [{pos:1,good_id:201},{pos:2,good_id:301},{pos:3,good_id:401},{pos:4,good_id:501}];
                this.wingInfo.wingEquip = wingInfoR.wing_equip;   //羽翼装备 是一个对象数组 0正羽，1副羽，2绒羽，3须羽
                for(let i:number=0; i<wingInfoR.wing_equip.length; i++) {
                    let wingEquipAttr = App.ConfigManager.getWingAttrById(wingInfoR.wing_equip[i].good_id);
                    for(let k in wingEquipAttr) {
                        if(i!=0) {
                            this.wingInfo.wingEquipAttr[k] += wingEquipAttr[k];
                        } else {
                            this.wingInfo.wingEquipAttr[k] = wingEquipAttr[k];
                        }
                        
                    }
                    switch(wingInfoR.wing_equip[i].pos) {
                        case 1:
                            this.wingInfo.perfectWing = wingInfoR.wing_equip[i].good_id-200;
                            if(wingEquipAttr) {
                                this.wingInfo.wingEquipAttr.zhengyuScore = wingEquipAttr["grade"];
                            }
                            this.wingInfo.WingEquipStep.zhengyuStep = Math.max(0, wingInfoR.wing_equip[i].good_id-200);
                            if(App.ConfigManager.getItemInfoById(wingInfoR.wing_equip[i].good_id)) {
                                this.wingInfo.WingEquipStep.zhengyuQuality = App.ConfigManager.getItemInfoById(wingInfoR.wing_equip[i].good_id).quality;
                            }
                            break;
                        case 2:
                            this.wingInfo.perfectWing = Math.max(0,Math.min(this.wingInfo.perfectWing, wingInfoR.wing_equip[i].good_id-300));
                            if(wingEquipAttr) {
                                this.wingInfo.wingEquipAttr.fuyuScore = wingEquipAttr["grade"];
                            }
                            this.wingInfo.WingEquipStep.fuyuStep = Math.max(0, wingInfoR.wing_equip[i].good_id-300);
                            if(App.ConfigManager.getItemInfoById(wingInfoR.wing_equip[i].good_id)) {
                                this.wingInfo.WingEquipStep.fuyuQuality = App.ConfigManager.getItemInfoById(wingInfoR.wing_equip[i].good_id).quality;
                            }
                            break;
                        case 3:
                            this.wingInfo.perfectWing = Math.max(0,Math.min(this.wingInfo.perfectWing, wingInfoR.wing_equip[i].good_id-400));
                            if(wingEquipAttr) {
                                this.wingInfo.wingEquipAttr.rongyuScore = wingEquipAttr["grade"];
                            }
                            this.wingInfo.WingEquipStep.rongyuStep = Math.max(0, wingInfoR.wing_equip[i].good_id-400);
                            if(App.ConfigManager.getItemInfoById(wingInfoR.wing_equip[i].good_id)) {
                                this.wingInfo.WingEquipStep.rongyuQuality = App.ConfigManager.getItemInfoById(wingInfoR.wing_equip[i].good_id).quality;
                            }
                            break;
                        case 4:
                            this.wingInfo.perfectWing = Math.max(0,Math.min(this.wingInfo.perfectWing, wingInfoR.wing_equip[i].good_id-500));
                            if(wingEquipAttr) {
                                this.wingInfo.wingEquipAttr.xuyuScore = wingEquipAttr["grade"];
                            }
                            this.wingInfo.WingEquipStep.xuyuStep = Math.max(0, wingInfoR.wing_equip[i].good_id-500);
                            if(App.ConfigManager.getItemInfoById(wingInfoR.wing_equip[i].good_id)) {
                                this.wingInfo.WingEquipStep.xuyuQuality = App.ConfigManager.getItemInfoById(wingInfoR.wing_equip[i].good_id).quality;
                            }
                            break;
                    }
                }
                this.wingInfo.WingEquipStep.progress = 0;
                for(let k in this.wingInfo.WingEquipStep) {
                    if(this.wingInfo.WingEquipStep[k] >= (this.wingInfo.perfectWing+1)) {
                        if(k == "zhengyuStep" || k == "fuyuStep" || k == "rongyuStep" || k == "xuyuStep") {
                            this.wingInfo.WingEquipStep.progress++;
                        } 
                    }
                }
                if(this.wingInfo.perfectWing) {
                    this.wingInfo.perfectWingRate = App.ConfigManager.getWingStepById(this.wingInfo.perfectWing+"").attribute_rate / 10000;   //完美神羽万分比
                    if(this.wingInfo.perfectWing != 9) {
                        this.wingInfo.perfectWingNextRate = App.ConfigManager.getWingStepById(this.wingInfo.perfectWing+1+"").attribute_rate / 10000;   //完美神羽万分比
                    }
                }

                let wingAttr = App.ConfigManager.getWingAttrById(this.wingInfo.wingId);  //翅膀属性
                let wingAttr1;
                if(this.wingInfo.wingId == 100) {
                    wingAttr1 = App.ConfigManager.getWingAttrById(this.wingInfo.wingId);  //翅膀下一星属性
                } else {
                    wingAttr1 = App.ConfigManager.getWingAttrById(this.wingInfo.wingId+1);  //翅膀下一星属性
                }
                let wingStarInfo = App.ConfigManager.getWingStarById(this.wingInfo.wingId);  //升星所需信息
                this.wingInfo.expStar = wingStarInfo.exp;   //升星所需经验
                this.wingInfo.liftExp = wingStarInfo.lift_exp;  //使用金币点击一次升星获得经验
                this.wingInfo.wingExp = App.ConfigManager.getConstConfigByType("FEATHER_EXP").value;  //一个羽翼升的经验值
                this.wingInfo.coin = wingStarInfo.gold;  //点击一次消耗金币
                this.wingInfo.needWing = wingStarInfo.number;  //点击一次消耗羽毛
                this.wingInfo.coinStar = (this.wingInfo.expStar - this.wingInfo.exp) / this.wingInfo.liftExp * this.wingInfo.coin;  // 升满当前经验条所需金币
                this.wingInfo.wingStar = (this.wingInfo.expStar - this.wingInfo.exp) / this.wingInfo.wingExp;
                this.wingInfo.attr = wingAttr; //翅膀属性
                this.wingInfo.nextStarAttr = wingAttr1; //翅膀下一星属性
                // let maxEquipStep = App.ConfigManager.getConstConfigByType("WING_EQUIP_LEVEL_MAX");
                // let wingStepInfo = App.ConfigManager.getWingStepById(this.wingInfo.step);  //阶数对应信息
                // this.wingInfo.attrRate = wingStepInfo.attribute_rate;  //完美神翼属性加成
                // this.wingInfo.transform_gold = wingStepInfo.transition_money;  //转换所需元宝
                // this.wingInfo.skill = wingStepInfo.skill;  //阶数对应技能
                this.wingInfo.photo = wingStarInfo.photo;   //阶数对应翅膀图片
                this.wingInfo.model = wingStarInfo.model;   //阶数对应翅膀模型
                this.updateWingStep();
            } else {
                this.wingInfo.model = null;
                this.wingInfo.photo = "4001";
            }
            let wingInfo = new WingVo();
            for(let k in this.wingInfo) { //深拷贝
                wingInfo[k] = this.wingInfo[k];
            }
            let wingEquipAttr = new WingEquipAttrVo();
            for(let k in this.wingInfo.wingEquipAttr) {   //深拷贝
                wingEquipAttr[k] = this.wingInfo.wingEquipAttr[k];
            }
            let wingEquipStep = {};
            for(let k in this.wingInfo.WingEquipStep) {
                wingEquipStep[k] = this.wingInfo.WingEquipStep[k];
            }
            let wingEquipGoStep = {};
            for(let k in this.wingInfo.wingEquipGoStep) {
                wingEquipGoStep[k] = this.wingInfo.wingEquipGoStep[k];
            }
            wingInfo.WingEquipStep = wingEquipStep;
            wingInfo.wingEquipAttr = wingEquipAttr;
            wingInfo.wingEquipGoStep = wingEquipGoStep;
            this.wingInfoObj[data.id] = wingInfo; 
            App.loglyg("wingInfoObj", this.wingInfoObj);
        }

        /**
         * 判断羽翼装备能否升阶；
         */
        private updateWingStep() {
            let wingEquip = this.wingInfo.wingEquip;
            for(let i:number=0; i<wingEquip.length; i++) {
                switch(wingEquip[i].pos) {
                    case 1:
                        this.wingInfo.wingEquipGoStep.zhengyuStep = this.judgeStep(wingEquip[i]);
                        this.judgeReplaceWingEquip(wingEquip[i], 210);
                        break;
                    case 2:
                        this.wingInfo.wingEquipGoStep.fuyuStep = this.judgeStep(wingEquip[i]);
                        this.judgeReplaceWingEquip(wingEquip[i], 310);
                        break;
                    case 3:
                        this.wingInfo.wingEquipGoStep.rongyuStep = this.judgeStep(wingEquip[i]);
                        this.judgeReplaceWingEquip(wingEquip[i], 410);
                        break;
                    case 4:
                        this.wingInfo.wingEquipGoStep.xuyuStep = this.judgeStep(wingEquip[i]);
                        this.judgeReplaceWingEquip(wingEquip[i], 510);
                        break;
                }
            }
        }

        private judgeStep(wingEquip) {
            if(wingEquip.good_id) {
                if(this._backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip.good_id)) {
                    if(this._backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip.good_id).num >= 2) {
                        return true;
                    } 
                }
            }
            return false;
        }

        /**
         * 判断是都否有可替换的羽翼装备
         */
        private judgeReplaceWingEquip(wingEquip, maxGoodId) { 
            let goodId = wingEquip.good_id || maxGoodId-10; 
            while(goodId  < maxGoodId) {
                goodId++;
                if(this._backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, goodId)) {
                    this.wingInfo.replaceWingEquip = true;
                }
            }
        }

        public judgeBtnTip(): Array<any> {
            let _wingModel: WingModel = this;
            let wingInfo:any = {};
            let _backpackModel: BackpackModel = BackpackModel.getInstance();
            let _heroModel: HeroModel = HeroModel.getInstance();
            let btnTip = [];
            for(let index:number=0; index<App.RoleManager.heroList.length; index++) {
                btnTip[index] = {devBool: false, equipBool: false};
                wingInfo = _wingModel.wingInfoObj[_heroModel.heroInfo[index].id];
                if(wingInfo && wingInfo.wingId) {   //如果已开启羽翼
                    let wingStar =  _backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,16) ? 
                    _backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,16).num > wingInfo.wingStar : false;
                    if((_wingModel.heroInfo.coin > wingInfo.coinStar || wingStar ||   //可用金币升星    //可用羽翼升星
                    wingInfo.wingEquipGoStep.zhengyuStep || wingInfo.wingEquipGoStep.fuyuStep ||
                    wingInfo.wingEquipGoStep.rongyuStep || wingInfo.wingEquipGoStep.xuyuStep || //羽翼能否升阶  
                    _backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,17)) && wingInfo.wingId < 100){  //有羽翼直升丹
                        btnTip[index].devBool = true;
                    }
                    if(wingInfo.replaceWingEquip) {  //有可替换的羽翼装备
                        btnTip[index].equipBool = true;
                    }
                } else if(index < App.RoleManager.heroList.length){  //如果角色已开启
                    if(App.RoleManager.roleInfo.lv >= wingInfo.openLv) {  //并且达到开启羽翼条件
                        btnTip[index].devBool = true;
                    }
                }
            }
            return btnTip;
        }

        /**
         * 根据wingId获取翅膀图片
         * @param wingId {number}
         */
        public getWingPhoto(wingId: number) {
            if(wingId) {
                let stepInfo = App.ConfigManager.getWingStarById(wingId); //阶数对应信息
                return stepInfo.photo;
            }
            return null;
        }

        public clear(){
            super.clear();
        }

        public destroy(){
            super.destroy();
        }

    }
}