/**
 * Author: liuyonggen
 * 翅膀模块视图窗口  2017/11/16
 */
module game {
    export class WingView extends BaseView {
        public btn_develop: eui.Button;
        public btn_equip: eui.Button;
        public btn_transform: eui.Button;
        public img_developSelector: eui.Image;
        public img_equipSelector: eui.Image;
        public img_transformSelector: eui.Image;
        public img_close: eui.Image;
        public img_back: eui.Image;
        public lb_step: eui.Label;
        public pb_exp: eui.ProgressBar;
        public lb_coin: eui.Label;
        public img_wing: eui.Image;
        public img_goStep: eui.Image;
        public gp_goStep: eui.Group;
        public gp_wing: eui.Group;
        public gp_freeActivate: eui.Group;
        public gp_autoAddExp: eui.Group;
        public gp_autoAddExpStop: eui.Group;
        public gp_addExpByCoin: eui.Group;
        public gp_addExpByWing: eui.Group;
        public btlb_score: eui.BitmapLabel;
        public lb_wingNum: eui.Label;
        private _starMc: AMovieClip;
        private _stepMc: AMovieClip;
        public mc1: AMovieClip;
        public wingTransform: WingTransform;
        public gp_progress: eui.Group;
        public heroHead: HeroHeadComponentView;

        /**
         * 羽翼装备部分
         */
        public gp_wingEquip: eui.Group;
        public img_zhengyu: eui.Image;
        public img_zhengyuframe: eui.Image;
        public img_fuyu: eui.Image;
        public img_fuyuframe: eui.Image;
        public img_rongyu: eui.Image;
        public img_rongyuframe: eui.Image;
        public img_xuyu: eui.Image;
        public img_xuyuframe: eui.Image;
        public img_zhengyu_bg: eui.Image;
        public img_fuyu_bg: eui.Image;
        public img_rongyu_bg: eui.Image;
        public img_xuyu_bg: eui.Image;
        public img_perfectWing: eui.Image;
        public img_wingSkill: eui.Image;
        public btlb_equipScore: eui.BitmapLabel;
        public lb_zhengyu: eui.Label;
        public lb_fuyu: eui.Label;
        public lb_rongyu: eui.Label;
        public lb_xuyu: eui.Label;
        public img_zhengyuStepText: eui.Image;
        public img_fuyuStepText: eui.Image;
        public img_rongyuStepText: eui.Image;
        public img_xuyuStepText: eui.Image;
        public lb_hpEquip: eui.Label;
        public lb_attackEquip: eui.Label;
        public lb_physicsDefenseEquip: eui.Label;
        public lb_magicDefenseEquip: eui.Label;
        public gp_compose: eui.Group;
        public gp_wear: eui.Group;
        public gp_zhengyuStep: eui.Group;
        public gp_fuyuStep: eui.Group;
        public gp_rongyuStep: eui.Group;
        public gp_xuyuStep: eui.Group;

        /**
         * 10颗星星
         */
        public gp_star: eui.Group;
        public img_star1: eui.Image;
        public img_star2: eui.Image;
        public img_star3: eui.Image;
        public img_star4: eui.Image;
        public img_star5: eui.Image;
        public img_star6: eui.Image;
        public img_star7: eui.Image;
        public img_star8: eui.Image;
        public img_star9: eui.Image;
        public img_star10: eui.Image;

        /**
         * 翅膀属性
         */
        public lb_hp: eui.Label;
        public lb_attack: eui.Label;
        public lb_physicsDefense: eui.Label;
        public lb_magicDefense: eui.Label;
        public lb_hp1: eui.Label;
        public lb_attack1: eui.Label;
        public lb_physicsDefense1: eui.Label;
        public lb_magicDefense1: eui.Label;

        public gp_openWing: eui.Group;
        public gp_developWing: eui.Group;
        public gp_developStar: eui.Group;
        public gp_developStep: eui.Group;

        public wingModel: WingModel = WingModel.getInstance() as WingModel;
        public backpackModel: BackpackModel = BackpackModel.getInstance() as BackpackModel;
        public timer:number = -1; //用于打断自动升星
        private _eventId:number = 0;  //事件id
        private _eventId1:number = 0;  //事件id
        private _changeHeroEventId = 0;  //事件id
        private _transformEventId: number = 0;
        private _wingStepEventId: number = 0;

        /**
         * 红点
         */
        private _goStepTip: any;

        public constructor(viewConf:WinManagerVO = null) {
            super(viewConf);
            this._stepMc = new AMovieClip();
            this._starMc = new AMovieClip();
        }

        public childrenCreated() {
            super.childrenCreated();
            this.btn_develop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowDevelop, this);  //打开羽翼培养界面
            this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowEquip, this);    //打开羽翼装备界面
            this.btn_transform.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowTransform, this);   // 打开羽翼转换界面
            this.img_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);  //关闭窗口
            this.img_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWin, this);  //关闭窗口
            this.gp_freeActivate.addEventListener(egret.TouchEvent.TOUCH_TAP, this.freeActivate, this);   //免费激活
            this.img_goStep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goStep, this);   //升阶
            this.gp_addExpByCoin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addExpByCoin, this);   //通过金币增加经验
            this.gp_autoAddExp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.autoAddExp, this);      // 自动升星
            this.gp_addExpByWing.addEventListener(egret.TouchEvent.TOUCH_TAP, this.addExpByWing, this);   //通过羽毛升星
            this.gp_autoAddExpStop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stopAutoAddExp, this);   //停止自动升星
            this.gp_wear.addEventListener(egret.TouchEvent.TOUCH_TAP, this.wearEquip, this);   //一键穿戴羽翼装备
            this.img_zhengyu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openZhengyuTip, this);  //打开正羽提示框
            this.img_fuyu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openFuyuTip, this);  //打开副羽提示框
            this.img_rongyu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRongyuTip, this);   //打开绒羽提示框
            this.img_xuyu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openXuyuTip, this);    //打开须羽提示框
            this.img_perfectWing.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openWingPerfectTip, this);  //打开完美神羽提示框
            this.img_wingSkill.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openWingEquipSkill, this);  //打开羽翼技能
            this.gp_compose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.wingEquipCompose, this);
            this.img_zhengyu_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                this.getWingEquipWay(201);
            }, this);
            this.img_fuyu_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                this.getWingEquipWay(301);
            }, this);
            this.img_rongyu_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                this.getWingEquipWay(401);
            }, this);
            this.img_xuyu_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                this.getWingEquipWay(501);
            }, this);
            this.initView();
            // this.updateWingEquip();
            this.changeHero((HeroModel.getInstance() as HeroModel).curPos);
            // SceneController.getInstance().updateWingModel();

            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WING_TRAIN,this.btn_develop);
            App.BtnTipManager.addBtnTipItem(ConstBtnTipType.WING_EQUIP,this.btn_equip);
        }

        /**
         * 红点
         */
        private btnTip() {
            if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,17)) { //如果有直升丹
                if(this._goStepTip == null) {
                    this._goStepTip = App.BtnTipManager.creatBtnTip(true, this.gp_goStep);
                }
                this._goStepTip.show(true);
                
            } else {
                if(this._goStepTip) {
                    this._goStepTip.hide();
                }
            }
        }

        private heroBtnTip() {
            let _wingModel: WingModel = WingModel.getInstance();
            // let _backpackModel: BackpackModel = BackpackModel.getInstance();
            // for(let index:number=0; index<3; index++) {
            //     _wingModel.wingInfo = _wingModel.wingInfoObj[(HeroModel.getInstance() as HeroModel).heroInfo[index].id];
            //     let wingStar =  _backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,16) ? 
            //     _backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,16).num > _wingModel.wingInfo.wingStar : false;
            //     if((_wingModel.heroInfo.coin > _wingModel.wingInfo.coinStar || wingStar ||   //可用金币升星    //可用羽翼升星
            //     _wingModel.wingInfo.wingEquipGoStep.zhengyuStep || _wingModel.wingInfo.wingEquipGoStep.fuyuStep ||
            //     _wingModel.wingInfo.wingEquipGoStep.rongyuStep || _wingModel.wingInfo.wingEquipGoStep.xuyuStep || //羽翼能否升阶  
            //     _backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,17)) &&   //有羽翼直升丹
            //     App.RoleManager.roleInfo.lv >= _wingModel.wingInfo.openLv){  //并且角色等级大于15
            //         this.heroHead.showRedTips(index, true);
            //     } else if(_wingModel.wingInfo.replaceWingEquip){ //有可替换的羽翼装备
            //         this.heroHead.showRedTips(index, true);
            //     } else {
            //         this.heroHead.hideRedTips(index);
            //     }
            // }
            let btnTip = _wingModel.judgeBtnTip();
            for(let i:number=0; i<btnTip.length; i++) {
                if(btnTip[i].bool) {
                    this.heroHead.showRedTips(i, true);
                } else {
                    this.heroHead.showRedTips(i, false);
                }
            }
            
			
        }

        

        /**
         * 初始化页面
         */
        private initView() {
            //先判断角色是否已开启羽翼
            if(this.wingModel.wingInfo.wingId) { //如果已开启  未开启时wing_id等于0；
                this.updateView();
                // this.progressEffectFull();
                if(!this.isStep()) {
                    this.developWing();
                }  else {
                    this.stepWing();
                }
            } else {
                this.openWing();
            }
            this.initStar(this.wingModel.wingInfo.star);
            
        }

        /**
         * 切换英雄
         */
        private changeHero(curPos) {
            this.wingModel.wingInfo = this.wingModel.wingInfoObj[(HeroModel.getInstance() as HeroModel).heroInfo[curPos].id];
            if(this.wingModel.wingInfo.wingId) {
                if(this.img_developSelector.visible) {
                    this.developWing();
                } else if(this.img_equipSelector.visible){
                    this.equipWing();
                } else {
                    
                }
                this.updateView();
                this.updateWingEquip();
            } else {
                this.initView();
            }
            this.wingModel.wingInfo.currentStar = this.wingModel.wingInfo.star;

            this.heroBtnTip();
        }
        /**
         * 免费激活
         */
        private freeActivate() {
            if(App.RoleManager.roleInfo.lv >= this.wingModel.wingInfo.openLv) { //如果角色的等级达到15
                App.Socket.send(15021, { id:this.wingModel.wingInfo.heroId });
                App.loglyg({ id:this.wingModel.wingInfo.heroId });
                this.developWing();  //打开羽翼培养界面
            } else {
                //弹出提示框
                App.GlobalTips.showAlert({ style: BaseTipsStyle.ONLY_OK, content: "角色等级不足15，暂不能开启羽翼" });
            }
        }

        /**
         * 用金币增加翅膀经验
         */
        private addExpByCoin() {
            // this.joinEffect(220, -160,"effyysj");
            if(this.wingModel.heroInfo.coin > this.wingModel.wingInfo.coin) {
                App.Socket.send(15022,{ id:this.wingModel.wingInfo.heroId, type:1});
                if(this.wingModel.wingInfo.exp <= this.wingModel.wingInfo.liftExp) {
                    this.stopAutoAddExp();
                }
                let text = [{text:"获得羽翼经验："+this.wingModel.wingInfo.liftExp, style:{textColor:0xffffff,size:24,fontFamily:"SimHei"}}]
                App.GlobalTips.showTips(text);
                return true;
            } else {
                let text = [{text:"金币不足", style:{textColor:0xffffff,size:24,fontFamily:"SimHei"}}]
                App.GlobalTips.showTips(text);
                return false;
            }
            
        }

        /**
         * 用羽毛增加翅膀经验
         */
        private addExpByWing() {
            if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,16)) {  //如果羽毛数量大于0
                App.Socket.send(15022,{ id:this.wingModel.wingInfo.heroId, type:2});
                if(this.wingModel.wingInfo.exp <= this.wingModel.wingInfo.liftExp) {
                    this.stopAutoAddExp();
                }
                let text = [{text:"获得羽翼经验："+this.wingModel.wingInfo.liftExp, style:{textColor:0xffffff,size:24,fontFamily:"SimHei"}}]
                App.GlobalTips.showTips(text);
                return true;
            } else {
                let text = [{text:"羽毛不足", style:{textColor:0xffffff,size:24,fontFamily:"SimHei"}}]
                App.GlobalTips.showTips(text);
                return false;
            }  
        }

        /**
         * 点击自动升星按钮后的自动增加经验
         */
        private autoAddExp() {
            this.gp_autoAddExp.visible = false;
            this.timer = App.GlobalTimer.addSchedule(300, 0, ()=>{
                if(this.wingModel.wingInfo.exp == this.wingModel.wingInfo.expStar) {  //如果经验已满，打断自动升星
                    this.stopAutoAddExp();
                    return;
                } else {
                    if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,16)) {   //如果羽毛足够
                        this.addExpByWing();  //用羽毛升星
                    } else if(this.wingModel.heroInfo.coin > this.wingModel.wingInfo.coin){  //用金币足够
                        this.addExpByCoin(); //用金币升星
                    } else {
                        this.stopAutoAddExp();
                        return;
                    }                 
                }
            },this);
        }

        /**
         * 停止自动升阶
         */
        private stopAutoAddExp() {
            App.GlobalTimer.remove(this.timer);
            this.gp_autoAddExp.visible = true; 
        }

        /**
         * 使用羽翼直升丹
         */
        private goStep() {
            this.stopAutoAddExp();
            App.WinManager.openWin(WinName.WING_STEP_TIP);
        }

        /**
         * 用于判断是否升阶
         */
        private isStep() {
            if(this.wingModel.wingInfo.star == 9 && this.wingModel.wingInfo.exp == this.wingModel.wingInfo.expStar) {
                this.stepWing();
                this.gp_developStep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerStep, this);
                return true;
            } else {
                return false;
            }
        }
        
        /**
         * 点击升阶后的处理函数
         */
        private handlerStep() {
            App.Socket.send(15023,{ id:this.wingModel.wingInfo.heroId});
            if(this._stepMc == null) {
                this._stepMc = new AMovieClip();
            } else {
                this._stepMc.visible = true;
            }
            this.gp_star.addChild(this._stepMc);
            this._stepMc.x = 240;
            this._stepMc.y = -142;
                  
            this._stepMc.playMCKey("effyysj", "", 1, null, ()=>{
                this._stepMc.frameRate = 12;
            }, this);
            if(this._stepMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this._stepMc.addEventListener(egret.Event.COMPLETE, this.removeStepEffect, this);
            }
            this.initStar(0);
            // this.joinEffect(220, -160,"effyysj");
            this.gp_developStep.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerStep, this);
            this.wingModel.wingInfo.step += 1;
            this.wingModel.wingInfo.star = 0;
            this.wingModel.wingInfo.exp = 0;
        }

        private removeStepEffect() {
            this._stepMc.visible = false;
            this.developWing();
        }

        /**
         * 更新页面的函数
         */
        private updateView() {
            this.isStep();
            this.lb_step.text = this.wingModel.wingInfo.step + '阶';  //更新页面阶数
            this.img_wing.source = this.wingModel.wingInfo.photo + "_png";  //更新羽翼图片
            //更新星数
            this.updateStar();
            
            //更新经验条
            this.pb_exp.maximum = this.wingModel.wingInfo.expStar;
            this.pb_exp.value = this.wingModel.wingInfo.exp;
            //更新羽翼属性
            this.updateWingAttr();
            //更新金币
            this.lb_coin.text = this.wingModel.wingInfo.coin + '';
            //更新羽毛
            if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM,16)) {
                this.lb_wingNum.text = this.backpackModel.getItemByTypeIdUuid(1,16).num + "";
                this.lb_wingNum.textColor = 0x10F600;
            } else {
                this.lb_wingNum.text = "0";
                this.lb_wingNum.textColor = 0xF50000;
            }
            //更新评分
            this.btlb_score.text = this.wingModel.wingInfo.score + "";

        }

        /**让经验条缓慢增加 */
        private addExp() {
            this.pb_exp.value += (this.wingModel.wingInfo.exp-this.pb_exp.value) / 10;
        }

        /**
         * 更新翅膀星数
         */
        private updateStar() {
            let star = this.wingModel.wingInfo.star;
            if(this.wingModel.wingInfo.exp >= this.wingModel.wingInfo.expStar) { //如果经验条满，星数加1
                star++;
            }
            if(this.wingModel.wingInfo.currentStar+1 === star) {
                this.joinEffect(this["img_star"+star].x, this["img_star"+star].y, "effxxxq");
                this.wingModel.wingInfo.currentStar = star!=10 ? star : 0;
                this.wingModel.wingInfo.currentStar = star;
                this.initStar(star);
            }
        }

        private initStar(star) {
            for(let i=1; i<=10; i++) {
                if(i<=star) {
                    this["img_star"+i].visible = true;
                } else {
                    this["img_star"+i].visible = false;
                }
            }
        }

        /**
         * 更新翅膀属性
         */
        private updateWingAttr() {
            let attackType = this.judgeAttackType();
            let wingAttr:any = this.wingModel.wingInfo.attr;
            let wingNextStarAttr:any = this.wingModel.wingInfo.nextStarAttr;
            this.lb_hp.text = ConstAttribute.hp +"：" + wingAttr.hp;
            this.lb_attack.text = attackType[0] + "：" + wingAttr[attackType[1]];
            this.lb_physicsDefense.text = ConstAttribute.def+ "：" + wingAttr.def;
            this.lb_magicDefense.text = ConstAttribute.sdef + "：" + wingAttr.sdef;
            this.lb_hp1.text = ConstAttribute.hp +"：" + wingNextStarAttr.hp;
            this.lb_attack1.text = attackType[0] + "：" + wingNextStarAttr[attackType[1]];
            this.lb_physicsDefense1.text = ConstAttribute.def + "：" + wingNextStarAttr.def;
            this.lb_magicDefense1.text = ConstAttribute.sdef + "：" + wingNextStarAttr.sdef;
        }

        /**
         * 判断攻击类型，物理、法术、道术
         */
        private judgeAttackType(): Array<any> {
            let attackName:string;
            let attackType:string;
            switch((HeroModel.getInstance() as HeroModel).heroInfo[0].job) {
                case 1:
                    attackName = ConstAttribute.ac;
                    attackType = "ac";
                    break;
                case 2:
                    attackName = ConstAttribute.mac;
                    attackType = "mac";
                    break;
                case 3:
                    attackName = ConstAttribute.sc;
                    attackType = "sc";
                    break;
            }
            return [attackName, attackType];
        }

        /**
         * 加入特效
         */
        private joinEffect(x:number, y:number, key:string) {
            if(this._starMc == null) {
                this._starMc = new AMovieClip();
            } else {
                this._starMc.visible =true;
            }
            this.gp_star.addChild(this._starMc);
            this._starMc.x = x + 20;
            this._starMc.y = y + 18;
            this._starMc.playMCKey(key, "", 1);
            if(this._starMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this._starMc.addEventListener(egret.Event.COMPLETE, this.removeStarEffect, this);
            } 
        }

        private progressEffectFull() {
            this.mc1 = new AMovieClip();
            this.mc1.scaleX = 1.4;
            this.mc1.frameRate = 5;
            this.mc1.playMCKey("jdtm","", -1);
            this.gp_progress.addChild(this.mc1);
        }

        private removeStarEffect() {
           this._starMc.visible = false;
        }

        /**
         * 打开开启羽翼界面
         */
        private openWing() {
            this.gp_openWing.visible = true;
            this.gp_developWing.visible = false;
            this.gp_wingEquip.visible =false;
            this.wingTransform.visible = false;
        }

        /**
         * **********************************************************
         * 羽翼装备部分
         */
        private updateWingEquip() {
            // this.btlb_equipScore.text = //羽翼装备评分
            let wingEquip = this.wingModel.wingInfo.wingEquip;
            for(let i:number=0; i<wingEquip.length; i++) {
                switch(wingEquip[i].pos) {
                    case 1:
                        if(wingEquip[i].good_id) {
                            this.img_zhengyu.visible = true;
                            this.img_zhengyu_bg.visible = false;
                            this.img_zhengyuframe.source = QualityFrame[this.wingModel.wingInfo.WingEquipStep.zhengyuQuality];
                            this.lb_zhengyu.text = this.wingModel.wingInfo.WingEquipStep.zhengyuStep + "阶";
                            this.img_zhengyuStepText.source = "wing_"+(wingEquip[i].good_id-200)+"_png";
                            if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id)) {
                                if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id).num >= 2) {
                                    this.gp_zhengyuStep.visible = true;
                                } else {
                                    this.gp_zhengyuStep.visible = false;
                                }
                            } else {
                                this.gp_zhengyuStep.visible = false;
                            }
                        } else {
                            this.img_zhengyu.visible = false;
                            this.img_zhengyu_bg.visible = true;
                            this.img_zhengyuframe.source = "common_default_png";
                            this.img_zhengyuStepText.source = "";
                            this.lb_zhengyu.text = "";
                            this.gp_zhengyuStep.visible = false;
                        }
                        break;
                     case 2:
                        if(wingEquip[i].good_id) {
                            this.img_fuyu.visible = true;
                            this.img_fuyu_bg.visible = false;
                            this.img_fuyuframe.source = QualityFrame[this.wingModel.wingInfo.WingEquipStep.fuyuQuality];
                            this.img_fuyuStepText.source = "wing_"+(wingEquip[i].good_id-300)+"_png";
                            this.lb_fuyu.text = this.wingModel.wingInfo.WingEquipStep.fuyuStep + "阶";
                            if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id)) {
                                if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id).num >= 2) {
                                    this.gp_fuyuStep.visible = true;
                                } else {
                                    this.gp_fuyuStep.visible = false;
                                }
                            } else {
                                this.gp_fuyuStep.visible = false;
                            }
                        } else {
                            this.img_fuyu.visible = false;
                            this.img_fuyu_bg.visible = true;
                            this.img_fuyuframe.source = "common_default_png";
                            this.img_fuyuStepText.source = "";
                            this.lb_fuyu.text = "";
                            this.gp_fuyuStep.visible = false;
                        }
                        break;
                    case 3:
                        if(wingEquip[i].good_id) {
                            this.img_rongyu.visible = true;
                            this.img_rongyu_bg.visible = false;
                            this.img_rongyuframe.source = QualityFrame[this.wingModel.wingInfo.WingEquipStep.rongyuQuality];
                            this.img_rongyuStepText.source = "wing_"+(wingEquip[i].good_id-400)+"_png";
                            this.lb_rongyu.text = this.wingModel.wingInfo.WingEquipStep.rongyuStep + "阶";
                            if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id)) {
                                if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id).num >= 2) {
                                    this.gp_rongyuStep.visible = true;
                                } else {
                                    this.gp_rongyuStep.visible = false;
                                }
                            } else {
                                this.gp_rongyuStep.visible = false;
                            }
                            
                        } else {
                            this.img_rongyu.visible = false;
                            this.img_rongyu_bg.visible = true;
                            this.img_rongyuframe.source = "common_default_png";
                            this.img_rongyuStepText.source = "";
                            this.lb_rongyu.text = "";
                            this.gp_rongyuStep.visible = false;
                        }
                        break;
                    case 4:
                        if(wingEquip[i].good_id) {
                            this.img_xuyu.visible = true;
                            this.img_xuyu_bg.visible = false;
                            this.img_xuyuframe.source = QualityFrame[this.wingModel.wingInfo.WingEquipStep.xuyuQuality];
                            this.img_xuyuStepText.source = "wing_"+(wingEquip[i].good_id-500)+"_png";
                            this.lb_xuyu.text = this.wingModel.wingInfo.WingEquipStep.xuyuStep + "阶";
                            if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id)) {
                                if(this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, wingEquip[i].good_id).num >= 2) {
                                    this.gp_xuyuStep.visible = true;
                                } else {
                                    this.gp_xuyuStep.visible = false;
                                }
                            }else {
                                this.gp_xuyuStep.visible = false;
                            }
                        } else {
                            this.img_xuyu.visible = false;
                            this.img_xuyu_bg.visible = true;
                            this.img_xuyuframe.source = "common_default_png";
                            this.img_xuyuStepText.source = "";
                            this.lb_xuyu.text = "";
                            this.gp_xuyuStep.visible = false;
                        }
                        break;
                }
            }
            this.updateWingEquipAttr();

        }

        private getWingEquipWay(goodId) {
            let view = new ItemWay(ClientType.BASE_ITEM, goodId);
			PopUpManager.addPopUp({ obj: view });
        }

        public updateWingEquipAttr() {
            let attackType = this.judgeAttackType();
            let wingAttr:any = this.wingModel.wingInfo.wingEquipAttr;
            if(this.wingModel.wingInfo.perfectWing) {
                this.lb_hpEquip.text = ConstAttribute.hp + "：" + wingAttr.hp + "+" + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr.hp);
                this.lb_attackEquip.text = attackType[0] + "：" + wingAttr[attackType[1]] + "+" + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr[attackType[1]]);
                this.lb_physicsDefenseEquip.text = ConstAttribute.def + "：" + wingAttr.def + "+" + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr.def);
                this.lb_magicDefenseEquip.text = ConstAttribute.sdef + "：" + wingAttr.sdef + "+" + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr.sdef);
                this.btlb_equipScore.text = wingAttr.grade + Math.ceil(this.wingModel.wingInfo.perfectWingRate * wingAttr.grade);
            } else {
                this.lb_hpEquip.text = ConstAttribute.hp + "：" + wingAttr.hp;
                this.lb_attackEquip.text = attackType[0] + "：" + wingAttr[attackType[1]];
                this.lb_physicsDefenseEquip.text =  ConstAttribute.def + "：" + wingAttr.def;
                this.lb_magicDefenseEquip.text = ConstAttribute.sdef + "：" + wingAttr.sdef;
                this.btlb_equipScore.text = wingAttr.grade;
            } 
        }

        private openZhengyuTip() {
            let attackType = this.judgeAttackType();
            App.WinManager.openWin(WinName.WING_EQUIP_TIP);
            let obj = {pos:1, name:ConstWingName[1], step:this.wingModel.wingInfo.WingEquipStep.zhengyuStep, goStep:this.gp_zhengyuStep.visible, attack:attackType[0] + "：" + this.wingModel.wingInfo.wingEquipAttr[attackType[1]], score: this.wingModel.wingInfo.wingEquipAttr.zhengyuScore, source:ConstWingIcon[1], frameSource:QualityFrame[this.wingModel.wingInfo.WingEquipStep.zhengyuQuality]};
            App.EventSystem.dispatchEvent(PanelNotify.WING_EQUIP_TIP, obj);
        }

        private openFuyuTip() {
            App.WinManager.openWin(WinName.WING_EQUIP_TIP);
            let obj = {pos:2, name:ConstWingName[2], step:this.wingModel.wingInfo.WingEquipStep.fuyuStep, goStep:this.gp_fuyuStep.visible, attack:ConstAttribute.hp + "：" + this.wingModel.wingInfo.wingEquipAttr.hp, score: this.wingModel.wingInfo.wingEquipAttr.fuyuScore, source:ConstWingIcon[2],frameSource:QualityFrame[this.wingModel.wingInfo.WingEquipStep.fuyuQuality]};
            App.EventSystem.dispatchEvent(PanelNotify.WING_EQUIP_TIP, obj);
            
        }

        private openRongyuTip() {
            App.WinManager.openWin(WinName.WING_EQUIP_TIP);
            let obj = {pos:3, name:ConstWingName[3], step:this.wingModel.wingInfo.WingEquipStep.rongyuStep, goStep:this.gp_rongyuStep.visible, attack:ConstAttribute.def + "：" + this.wingModel.wingInfo.wingEquipAttr.def, score: this.wingModel.wingInfo.wingEquipAttr.rongyuScore, source:ConstWingIcon[3],frameSource:QualityFrame[this.wingModel.wingInfo.WingEquipStep.rongyuQuality]};
            App.EventSystem.dispatchEvent(PanelNotify.WING_EQUIP_TIP, obj);
        }

        private openXuyuTip() {
            App.WinManager.openWin(WinName.WING_EQUIP_TIP);
            let obj = {pos:4, name:ConstWingName[4], step:this.wingModel.wingInfo.WingEquipStep.xuyuStep, goStep:this.gp_xuyuStep.visible, attack:ConstAttribute.sdef + "：" + this.wingModel.wingInfo.wingEquipAttr.sdef, score: this.wingModel.wingInfo.wingEquipAttr.xuyuScore, source:ConstWingIcon[4],frameSource:QualityFrame[this.wingModel.wingInfo.WingEquipStep.xuyuQuality]};
            App.EventSystem.dispatchEvent(PanelNotify.WING_EQUIP_TIP, obj);
        }

        private openWingPerfectTip() {
            App.WinManager.openWin(WinName.WING_PERFECT_TIP);
        }

        private openWingEquipSkill() {
            App.WinManager.openWin(WinName.WING_SKILL);
        }

        private wingEquipCompose() {
            App.WinManager.openWin(WinName.SYNTHESIS,{type:ConstSynthesisType.WING,lastModule:WinName.WING});
        }
        /**
         * 穿戴羽翼装备
         */
        public wearEquip() {
            App.Socket.send(15025, {id:this.wingModel.wingInfo.heroId});
            this.wingModel.replaceWingEquip = false;
        }

        private transformResult(data) {
            this.wingTransform.transformResult(data);
            if(data.result) {
                this.wingTransform.getWingEquip();
            }
        }

        /**
         * 打开羽翼培养界面
         */
        private developWing() {
            this.gp_openWing.visible = false;
            this.gp_developWing.visible = true;
            this.gp_developStar.visible = true;
            this.gp_developStep.visible = false;
            this.gp_wingEquip.visible =false;
            this.wingTransform.visible = false;
        }

        /**
         * 打开羽翼升阶界面
         */
        private stepWing() {
            this.gp_openWing.visible = false;
            this.gp_developWing.visible = true;
            this.gp_developStar.visible = false;
            this.gp_developStep.visible = true;
            this.gp_wingEquip.visible =false;
            this.wingTransform.visible = false;
        }

        /**
         * 打开羽翼装备界面
         */
        private equipWing() {
            this.gp_openWing.visible = false;
            this.gp_developWing.visible = false;
            this.gp_wingEquip.visible =true;
            this.wingTransform.visible = false;
        }

        /**
         * 打开羽翼转换界面
         */
        private transformWing() {
            this.wingTransform.visible = true;
        }

        /**
         * 切换到培养羽翼界面 
         */
        private onShowDevelop() {
            this.btn_develop.currentState = "down";
            this.btn_equip.currentState = "up";
            this.btn_transform.currentState = "up";
            this.img_developSelector.visible = true;
            this.img_equipSelector.visible = false;
            this.img_transformSelector.visible = false;
            this.initView();
        }

        /**
         * 切换到羽翼装备界面
         */
        private onShowEquip() {
            this.btn_develop.currentState = "up";
            this.btn_equip.currentState = "down";
            this.btn_transform.currentState = "up";
            this.img_developSelector.visible = false;
            this.img_equipSelector.visible = true;
            this.img_transformSelector.visible = false;
            this.equipWing();
            this.stopAutoAddExp();
        }

        /**
         * 切换到羽翼转换界面
         */
        private onShowTransform() {
            this.btn_develop.currentState = "up";
            this.btn_equip.currentState = "up";
            this.btn_transform.currentState = "down";
            this.img_developSelector.visible = false;
            this.img_equipSelector.visible = false;
            this.img_transformSelector.visible = true;
            this.transformWing();
            this.stopAutoAddExp();
        }

        /**
		 * 打开窗口
		 */
		public openWin(openParam: any = null): void {
			super.openWin(openParam);
            this.btnTip();
            if(this._changeHeroEventId == 0) {
                App.EventSystem.addEventListener(PanelNotify.HERO_ON_HERO_SELECT, this.changeHero, this);
            }
            if(this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.WING_INFO_UPDATE, this.updateView, this);  //翅膀数据变化就刷新界面
            }
            if(this._eventId1 == 0) {
                this._eventId1 = App.EventSystem.addEventListener(PanelNotify.WING_INFO_UPDATE, this.updateWingEquip, this);  //翅膀数据变化就刷新界面 
            }
            if(this._transformEventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.WING_TRANSFORM_RESULT, this.transformResult, this);
            }
            if(this._wingStepEventId == 0) {
                this._wingStepEventId = App.EventSystem.addEventListener(PanelNotify.WING_STEP_SUCCESS, this.btnTip, this);
            }
		}

		/**
		 * 关闭窗口
		 */
		public closeWin(): void {
			super.closeWin();
		}

		/**
		 * 清理
		 */
		public clear(data: any = null): void {
            super.clear(data);
            if(this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_INFO_UPDATE, this._eventId);
                this._eventId = 0;
            }
            if(this._eventId1 != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_INFO_UPDATE, this._eventId1);
                this._eventId1 = 0;
            }
            if(this._changeHeroEventId != 0){
                App.EventSystem.removeEventListener(PanelNotify.HERO_ON_HERO_SELECT, this._changeHeroEventId);
                this._changeHeroEventId = 0;
            }
            if(this._transformEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_TRANSFORM_RESULT, this._transformEventId);
                this._transformEventId = 0;
            } 
            if(this._starMc) {
                if(this._starMc.hasEventListener(egret.Event.COMPLETE)) {
                    this._starMc.removeEventListener(egret.Event.COMPLETE, this.removeStarEffect, this);
                }
                this._starMc.destroy();
                if(this._starMc.parent) {
                    this._starMc.parent.removeChild(this._starMc);
                }
                this._starMc = null;
            }
            if(this._stepMc) {
                if(this._stepMc.hasEventListener(egret.Event.COMPLETE)) {
                    this._stepMc.removeEventListener(egret.Event.COMPLETE, this.removeStarEffect, this);
                }
                this._stepMc.destroy();
                if(this._stepMc.parent) {
                    this._stepMc.parent.removeChild(this._stepMc);
                }
                this._stepMc = null;
            }
            if(this._wingStepEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_STEP_SUCCESS, this._wingStepEventId);
                this._wingStepEventId = 0;
            }
		}
		/**
		 * 销毁
		 */
		public destroy(): void {
            super.destroy();
		}
    }
}