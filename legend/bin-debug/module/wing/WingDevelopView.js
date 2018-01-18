var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var game;
(function (game) {
    var WingDevelopView = (function (_super) {
        __extends(WingDevelopView, _super);
        function WingDevelopView(skinName) {
            var _this = _super.call(this, "WingDevelopSkin") || this;
            _this.wingModel = game.WingModel.getInstance();
            _this.backpackModel = game.BackpackModel.getInstance();
            _this.timer = 0; //用于打断自动升星
            _this._eventId = 0; //事件id
            _this._eventId1 = 0; //事件id
            _this._changeHeroEventId = 0; //事件id
            _this._transformEventId = 0;
            _this._wingStepEventId = 0;
            _this._isAutostar = false;
            return _this;
        }
        WingDevelopView.prototype.childrenCreated = function () {
            var _this = this;
            _super.prototype.childrenCreated.call(this);
            this.btn_freeActivate.addEventListener(egret.TouchEvent.TOUCH_TAP, this.freeActivate, this); //免费激活
            this.img_goStep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goStep, this); //升阶
            this.btn_arrowLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toLeft, this); // 向左预览翅膀
            this.btn_arrowRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toRight, this); // 向右预览翅膀
            this.btn_addExp.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this._isAutostar == false) {
                    _this.addExp();
                }
                else {
                    var text = [{ text: "自动升星中", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                    App.GlobalTips.showTips(text);
                }
            }, this);
            this.btn_autoAddExp.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this.btn_autoAddExp.label === "自动升星") {
                    _this.autoAddExp();
                }
                else {
                    _this.stopAutoAddExp();
                }
            }, this); // 自动升星
        };
        /**
         * 红点
         */
        WingDevelopView.prototype.btnTip = function () {
            if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, 17)) {
                if (this._goStepTip == null) {
                    this._goStepTip = App.BtnTipManager.creatBtnTip(true, this.gp_goStep);
                }
                this._goStepTip.show(true);
            }
            else {
                if (this._goStepTip) {
                    this._goStepTip.hide();
                }
            }
        };
        /**
         * 初始化页面
         */
        WingDevelopView.prototype.initView = function () {
            //先判断角色是否已开启羽翼
            if (this.wingModel.wingInfo.wingId) {
                if (!this.isStep()) {
                    this.developWing();
                }
                else {
                    this.stepWing();
                }
            }
            else {
                this.openWing();
            }
        };
        /**
         * 切换英雄
         */
        WingDevelopView.prototype.changeHero = function (curPos) {
            this.wingModel.wingInfo = this.wingModel.wingInfoObj[game.HeroModel.getInstance().heroInfo[curPos].id];
            this.wingModel.wingInfo.currentStar = this.wingModel.wingInfo.star || 0;
            this.wingModel.wingInfo.currentWingId = this.wingModel.wingInfo.wingId;
            this.wingModel.wingInfo.currentWingExp = this.wingModel.wingInfo.exp;
            this.wingModel.wingInfo.currentWingEquip = this.wingModel.wingInfo.wingEquip;
            this.updateView();
            this.initStar(this.wingModel.wingInfo.star);
            // this.heroBtnTip();
            if (this.wingModel.wingInfo.exp < this.wingModel.wingInfo.expStar) {
                if (this._pbMc) {
                    this.removePbMc();
                }
            }
            this.stopAutoAddExp();
        };
        /**
         * 免费激活
         */
        WingDevelopView.prototype.freeActivate = function () {
            if (App.RoleManager.roleInfo.lv >= this.wingModel.wingInfo.openLv) {
                App.Socket.send(15021, { id: this.wingModel.wingInfo.heroId });
                App.loglyg({ id: this.wingModel.wingInfo.heroId });
                this.developWing(); //打开羽翼培养界面
                this.initStar(0);
            }
            else {
                //弹出提示框
                App.GlobalTips.showAlert({ style: 1 /* ONLY_OK */, content: "角色等级不足" + this.wingModel.wingInfo.openLv + "，暂不能开启羽翼" });
            }
        };
        // /**
        //  * 用金币增加翅膀经验
        //  */
        // private addExpByCoin() {
        //     // this.joinEffect(220, -160,"effyysj");
        //     if (this.wingModel.heroInfo.coin > this.wingModel.wingInfo.coin) {
        //         App.Socket.send(15022, { id: this.wingModel.wingInfo.heroId, type: 1 });
        //         if (this.wingModel.wingInfo.exp < this.wingModel.wingInfo.liftExp) {
        //             this.stopAutoAddExp();
        //         }
        //         let text = [{ text: "获得羽翼经验：" + this.wingModel.wingInfo.liftExp, style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
        //         App.GlobalTips.showTips(text);
        //         return true;
        //     } else {
        //         let text = [{ text: "金币不足", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
        //         App.GlobalTips.showTips(text);
        //         return false;
        //     }
        // }
        // /**
        //  * 用羽毛增加翅膀经验
        //  */
        // private addExpByWing() {
        //     if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, 16)) {  //如果羽毛数量大于0
        //         App.Socket.send(15022, { id: this.wingModel.wingInfo.heroId, type: 2 });
        //         if (this.wingModel.wingInfo.exp < this.wingModel.wingInfo.wingExp) {
        //             this.stopAutoAddExp();
        //         }
        //         let text = [{ text: "获得羽翼经验：" + this.wingModel.wingInfo.wingExp, style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
        //         App.GlobalTips.showTips(text);
        //         return true;
        //     } else {
        //         let text = [{ text: "羽毛不足", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
        //         App.GlobalTips.showTips(text);
        //         return false;
        //     }
        // }
        /**
         * 升星
         */
        WingDevelopView.prototype.addExp = function () {
            if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, 16) && this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, 16).num > this.wingModel.wingInfo.needWing) {
                if (this.wingModel.wingInfo.exp < this.wingModel.wingInfo.wingExp) {
                    this.stopAutoAddExp();
                }
                App.Socket.send(15022, { id: this.wingModel.wingInfo.heroId, type: 2 });
                // let text = [{ text: "获得羽翼经验：" + this.wingModel.wingInfo.wingExp, style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
                // App.GlobalTips.showTips(text);
            }
            else if (this.wingModel.heroInfo.coin > this.wingModel.wingInfo.coin) {
                if (this.wingModel.wingInfo.exp < this.wingModel.wingInfo.liftExp) {
                    this.stopAutoAddExp();
                }
                App.Socket.send(15022, { id: this.wingModel.wingInfo.heroId, type: 1 });
                // let text = [{ text: "获得羽翼经验：" + this.wingModel.wingInfo.liftExp, style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
                // App.GlobalTips.showTips(text);
            }
            else if (this._isAutostar && this.cb_autoBuy.selected == true) {
                if (this.wingModel.wingInfo.exp < this.wingModel.wingInfo.liftExp) {
                    this.stopAutoAddExp();
                }
                if (App.ConfigManager.getConstConfigByType("REPLACE_PROPS").value < App.RoleManager.roleWealthInfo.gold) {
                    App.Socket.send(15022, { id: this.wingModel.wingInfo.heroId, type: 3 });
                    // let text = [{ text: "获得羽翼经验：" + this.wingModel.wingInfo.liftExp, style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }]
                    // App.GlobalTips.showTips(text);
                }
                else {
                    var text = [{ text: "元宝不足" + this.wingModel.wingInfo.liftExp, style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                    App.GlobalTips.showTips(text);
                    this.stopAutoAddExp();
                }
            }
            else {
                var text = [{ text: "羽毛和金币不足", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                App.GlobalTips.showTips(text);
                this.stopAutoAddExp();
            }
        };
        /**
         * 点击自动升星按钮后的自动增加经验
         */
        WingDevelopView.prototype.autoAddExp = function () {
            var _this = this;
            this.btn_autoAddExp.label = "停止";
            this.wingModel.wingInfo.exp += this.wingModel.wingInfo.liftExp;
            this._isAutostar = true;
            if (this.timer == 0) {
                this.timer = App.GlobalTimer.addSchedule(300, 0, function () {
                    if (_this.wingModel.wingInfo.exp == _this.wingModel.wingInfo.expStar) {
                        _this.stopAutoAddExp();
                        return;
                    }
                    else {
                        _this.addExp();
                    }
                }, this);
            }
            this.wingModel.wingInfo.exp -= this.wingModel.wingInfo.liftExp;
        };
        /**
         * 停止自动升阶
         */
        WingDevelopView.prototype.stopAutoAddExp = function () {
            if (this.timer != 0) {
                App.GlobalTimer.remove(this.timer);
                this.timer = 0;
                this.btn_autoAddExp.label = "自动升星";
                this._isAutostar = false;
            }
        };
        /**
         * 使用羽翼直升丹
         */
        WingDevelopView.prototype.goStep = function () {
            this.stopAutoAddExp();
            var textFlow = [{ text: "   确定使用", style: { textColor: 0xf10000 } }, { text: "羽翼直升丹", style: { textColor: 0xffea00 } }, { text: "提升羽翼吗？", style: { textColor: 0xf10000 } }, { text: "\n\n\n         使用直升丹羽翼直升一阶", style: { textColor: 0xf87500, textAlign: "center" } }];
            App.GlobalTips.showAlert({ style: 1 /* ONLY_OK */, textFlow: textFlow, okCB: this.onOk, cbThisObject: this, contentStyle: 2 });
            // App.WinManager.openWin(WinName.WING_STEP_TIP);
        };
        WingDevelopView.prototype.onOk = function () {
            if (this.wingModel.wingInfo.exp == this.wingModel.wingInfo.expStar) {
                var text = [{ text: "羽翼经验已满，请先羽翼升阶", style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                App.GlobalTips.showTips(text);
            }
            else if (game.BackpackModel.getInstance().getItemByTypeIdUuid(ClientType.BASE_ITEM, 17)) {
                App.Socket.send(15024, { id: this.wingModel.wingInfo.heroId });
            }
            else {
                App.GlobalTips.showItemWayTips(ClientType.BASE_ITEM, 17);
            }
        };
        /**
         * 用于判断是否升阶
         */
        WingDevelopView.prototype.isStep = function () {
            if (this.wingModel.wingInfo.star == 9 && this.wingModel.wingInfo.exp == this.wingModel.wingInfo.expStar) {
                if (this.wingModel.wingInfo.wingId == 100) {
                    this.maxStep();
                    return;
                }
                this.stepWing();
                this.btn_developStep.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerStep, this);
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * 点击升阶后的处理函数
         */
        WingDevelopView.prototype.handlerStep = function () {
            App.Socket.send(15023, { id: this.wingModel.wingInfo.heroId });
            this.joinStepMc();
            this.removePbMc();
            this.initStar(0);
            // this.joinEffect(220, -160,"effyysj");
            this.btn_developStep.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.handlerStep, this);
            this.wingModel.wingInfo.step += 1;
            this.wingModel.wingInfo.star = 0;
            this.wingModel.wingInfo.exp = 0;
        };
        WingDevelopView.prototype.joinStepMc = function () {
            var _this = this;
            if (this._stepMc == null) {
                this._stepMc = new AMovieClip();
            }
            this._stepMc.visible = true;
            this.gp_star.addChild(this._stepMc);
            this._stepMc.x = 240;
            this._stepMc.y = -142;
            this._stepMc.playMCKey("effyysj", "", 1, null, function () {
                _this._stepMc.frameRate = 15;
            }, this);
            if (this._stepMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this._stepMc.addEventListener(egret.Event.COMPLETE, this.removeStepEffect, this);
            }
        };
        WingDevelopView.prototype.removeStepEffect = function () {
            var _this = this;
            this._stepMc.visible = false;
            egret.setTimeout(function () {
                _this.developWing();
            }, this, 500);
        };
        /**
         * 更新页面的函数
         */
        WingDevelopView.prototype.updateView = function () {
            this.initView();
            this.isStep();
            this.img_wing.source = this.wingModel.wingInfo.photo + "_png"; //更新羽翼图片
            if (this.wingModel.wingInfo.wingId) {
                this.lb_step.text = this.wingModel.wingInfo.step + '阶羽翼'; //更新页面阶数
                //更新星数
                this.updateStar();
                this.isFullStar();
                //更新经验条
                this.pb_exp.maximum = this.wingModel.wingInfo.expStar;
                this.pb_exp.value = this.wingModel.wingInfo.exp;
                this.pb_exp0.maximum = this.wingModel.wingInfo.expStar;
                this.pb_exp0.value = this.wingModel.wingInfo.exp;
                this._pbGoMc.x = -480 + this.pb_exp.value / this.pb_exp.maximum * 490;
                this.updateWingAttr(); //更新羽翼属性
                //更新金币
                this.lb_coin.text = this.wingModel.wingInfo.coin + '';
                //更新羽毛
                if (this.backpackModel.getItemByTypeIdUuid(ClientType.BASE_ITEM, 16)) {
                    this.lb_wingNum.text = this.backpackModel.getItemByTypeIdUuid(1, 16).num + "";
                    if (this.backpackModel.getItemByTypeIdUuid(1, 16).num > this.wingModel.wingInfo.needWing) {
                        this.lb_wingNum.textColor = 0x10F600;
                    }
                    else {
                        this.lb_wingNum.textColor = 0xF50000;
                    }
                }
                else {
                    this.lb_wingNum.text = "0";
                    this.lb_wingNum.textColor = 0xF50000;
                }
                this.lb_needWing.text = "/" + this.wingModel.wingInfo.needWing;
                // this.lb_needWing.x = this.lb_wingNum.x + this.lb_wingNum.width;
                this.lb_wingNum.parent.validateNow();
                this.img_wingIcon.x = this.lb_wingNum.x - this.img_wingIcon.width;
                this.lb_gold.text = App.ConfigManager.getConstConfigByType("REPLACE_PROPS").value;
                //更新评分
                this.btlb_score.text = this.wingModel.wingInfo.score + "";
                //获得羽翼经验的飘字
                this.showWingExpChange();
            }
        };
        WingDevelopView.prototype.showWingExpChange = function () {
            if (this.wingModel.wingInfo.currentWingId) {
                var wingStarInfo = App.ConfigManager.getWingStarById(this.wingModel.wingInfo.currentWingId);
                var changeExp = (this.wingModel.wingInfo.wingId - this.wingModel.wingInfo.currentWingId) * wingStarInfo.exp +
                    this.wingModel.wingInfo.exp - this.wingModel.wingInfo.currentWingExp;
                if (changeExp != 0) {
                    var text = [{ text: "获得羽翼经验：" + changeExp, style: { textColor: 0xffffff, size: 24, fontFamily: "SimHei" } }];
                    App.GlobalTips.showTips(text);
                }
            }
            this.wingModel.wingInfo.currentWingId = this.wingModel.wingInfo.wingId;
            this.wingModel.wingInfo.currentWingExp = this.wingModel.wingInfo.exp;
        };
        WingDevelopView.prototype.toLeft = function () {
        };
        WingDevelopView.prototype.toRight = function () {
        };
        /**
         * 更新翅膀星数
         */
        WingDevelopView.prototype.updateStar = function () {
            var star = this.wingModel.wingInfo.star;
            if (this.wingModel.wingInfo.currentStar + 1 === star) {
                this.progressEffectFull(1, 15);
                this.joinEffect(this["img_star" + star].x, this["img_star" + star].y, "effxxxq");
                if (star == 9) {
                    this.wingModel.wingInfo.currentStar = 0;
                }
                else {
                    this.wingModel.wingInfo.currentStar = star;
                }
                this.initStar(star);
            }
        };
        /**
         * 10星特殊处理
         */
        WingDevelopView.prototype.isFullStar = function () {
            if (this.wingModel.wingInfo.exp >= this.wingModel.wingInfo.expStar) {
                if (this.wingModel.wingInfo.currentStar != 9) {
                    this.joinEffect(this["img_star10"].x, this["img_star10"].y, "effxxxq");
                }
                this.progressEffectFull(-1);
                this.img_star10.visible = true;
            }
            else {
                this.img_star10.visible = false;
            }
        };
        WingDevelopView.prototype.initStar = function (star) {
            for (var i = 1; i <= 9; i++) {
                if (i <= star) {
                    this["img_star" + i].visible = true;
                    // App.loglyg("img_star1111111111",i , this["img_star"+i].visible)
                }
                else {
                    this["img_star" + i].visible = false;
                    // App.loglyg("img_star1111111111",i , this["img_star"+i].visible)
                }
            }
        };
        /**
         * 更新翅膀属性
         */
        WingDevelopView.prototype.updateWingAttr = function () {
            var attackType = this.judgeAttackType();
            var wingAttr = this.wingModel.wingInfo.attr;
            var wingNextStarAttr = this.wingModel.wingInfo.nextStarAttr;
            this.lb_hp.text = ConstAttribute.hp + "+" + wingAttr.hp;
            this.lb_attack.text = attackType[0] + "+" + wingAttr[attackType[1]];
            this.lb_physicsDefense.text = ConstAttribute.def + "+" + wingAttr.def;
            this.lb_magicDefense.text = ConstAttribute.sdef + "+" + wingAttr.sdef;
            this.lb_hp1.text = ConstAttribute.hp + "+" + wingNextStarAttr.hp;
            this.lb_attack1.text = attackType[0] + "+" + wingNextStarAttr[attackType[1]];
            this.lb_physicsDefense1.text = ConstAttribute.def + "+" + wingNextStarAttr.def;
            this.lb_magicDefense1.text = ConstAttribute.sdef + "+" + wingNextStarAttr.sdef;
        };
        /**
         * 判断攻击类型，物理、法术、道术
         */
        WingDevelopView.prototype.judgeAttackType = function () {
            var attackName;
            var attackType;
            switch (game.HeroModel.getInstance().heroInfo[game.HeroModel.getInstance().curPos].job) {
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
        };
        /**
         * 战斗力特效
         */
        WingDevelopView.prototype.joinCombatEff = function () {
            var _this = this;
            if (this._combatEff == null) {
                this._combatEff = new EffectMovieClip();
            }
            this._combatEff.x = 190;
            this._combatEff.y = 40;
            this.gp_combat.addChild(this._combatEff);
            this._combatEff.playMCKey("effjspf", "", -1, null, function () {
                _this._combatEff.frameRate = 10;
            }, null, this);
        };
        /**
         * 加入星星特效
         */
        WingDevelopView.prototype.joinEffect = function (x, y, key) {
            if (this._starMc == null) {
                this._starMc = new AMovieClip();
            }
            this._starMc.visible = true;
            this.gp_star.addChild(this._starMc);
            this._starMc.x = x + 20;
            this._starMc.y = y + 18;
            this._starMc.playMCKey(key, "", 1);
            if (this._starMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this._starMc.addEventListener(egret.Event.COMPLETE, this.removeStarEffect, this);
            }
        };
        /**
         * 进度条满特效
         */
        WingDevelopView.prototype.progressEffectFull = function (times, frameRate) {
            var _this = this;
            if (times === void 0) { times = 1; }
            if (frameRate === void 0) { frameRate = 8; }
            if (this._pbMc == null) {
                this._pbMc = new AMovieClip();
            }
            this._pbMc.visible = true;
            this._pbMc.scaleX = 1.42;
            this._pbMc.playMCKey("jdtm", "", times, null, function () {
                _this._pbMc.frameRate = frameRate;
            }, this);
            this.gp_progress.addChild(this._pbMc);
            this.gp_progress.x = 303;
            this.gp_progress.y = 543;
            this._pbMc.play();
            if (this._pbMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this._pbMc.addEventListener(egret.Event.COMPLETE, this.removePbMc, this);
            }
        };
        /**
         * 进度条进行中特效
         */
        WingDevelopView.prototype.progressEffect = function () {
            var _this = this;
            if (this._pbGoMc == null) {
                this._pbGoMc = new AMovieClip();
            }
            this._pbGoMc.visible = true;
            this._pbGoMc.scaleX = 1;
            this._pbGoMc.x = -480;
            this._pbGoMc.y = 3;
            this._pbGoMc.mask = this.re_mask;
            this._pbGoMc.playMCKey("effkjdt", "", -1, null, function () {
                _this._pbGoMc.frameRate = 8;
            }, this);
            this.gp_progress.addChild(this._pbGoMc);
            this.gp_progress.x = 303;
            this.gp_progress.y = 543;
            this._pbGoMc.play();
        };
        WingDevelopView.prototype.removePbMc = function () {
            this._pbMc.stop();
            this._pbMc.visible = false;
            this._pbMc.removeEventListener(egret.Event.COMPLETE, this.removePbMc, this);
        };
        WingDevelopView.prototype.removeStarEffect = function () {
            this._starMc.visible = false;
        };
        /**
         * 打开开启羽翼界面
         */
        WingDevelopView.prototype.openWing = function () {
            this.gp_openWing.visible = true;
            this.gp_developWing.visible = false;
            this.lb_openLevel.text = this.wingModel.wingInfo.openLv + "";
            this.img_wing.source = "4001_png";
            this.img_maxStep.visible = false;
        };
        /**
         * 打开羽翼培养界面
         */
        WingDevelopView.prototype.developWing = function () {
            this.gp_openWing.visible = false;
            this.gp_developWing.visible = true;
            this.gp_developStar.visible = true;
            this.btn_developStep.visible = false;
            this.img_maxStep.visible = false;
            this.gp_goStep.visible = true;
            this.changeAttrPos(false);
        };
        /**
         * 打开羽翼升阶界面
         */
        WingDevelopView.prototype.stepWing = function () {
            this.gp_openWing.visible = false;
            this.gp_developWing.visible = true;
            this.gp_developStar.visible = false;
            this.btn_developStep.visible = true;
            this.img_maxStep.visible = false;
            this.gp_goStep.visible = true;
            this.changeAttrPos(false);
        };
        /**
         * 打开阶数已满界面
         */
        WingDevelopView.prototype.maxStep = function () {
            this.gp_openWing.visible = false;
            this.gp_developWing.visible = true;
            this.gp_developStar.visible = false;
            this.btn_developStep.visible = false;
            this.img_maxStep.visible = true;
            this.gp_goStep.visible = false;
            this.changeAttrPos(true);
        };
        WingDevelopView.prototype.changeAttrPos = function (bool) {
            if (bool) {
                this.gp_nowAttr.visible = false;
                this.img_twoArrow.visible = false;
                this.gp_nextAttr.x = 210;
            }
            else {
                this.gp_nowAttr.visible = true;
                this.img_twoArrow.visible = true;
                this.gp_nextAttr.x = 333;
            }
        };
        /**
         * 打开窗口
         */
        WingDevelopView.prototype.open = function (openParam) {
            if (openParam === void 0) { openParam = null; }
            _super.prototype.open.call(this, openParam);
            this.joinCombatEff();
            this.progressEffect();
            this.changeHero(game.HeroModel.getInstance().curPos);
            this.btnTip();
            if (this._changeHeroEventId == 0) {
                this._changeHeroEventId = App.EventSystem.addEventListener(PanelNotify.HERO_CHANGE, this.changeHero, this);
            }
            if (this._eventId == 0) {
                this._eventId = App.EventSystem.addEventListener(PanelNotify.WING_INFO_UPDATE, this.updateView, this); //翅膀数据变化就刷新界面
            }
            if (this._wingStepEventId == 0) {
                this._wingStepEventId = App.EventSystem.addEventListener(PanelNotify.WING_STEP_SUCCESS, this.btnTip, this);
            }
        };
        /**
         * 清理
         */
        WingDevelopView.prototype.clear = function (data) {
            if (data === void 0) { data = null; }
            _super.prototype.clear.call(this, data);
            if (this._eventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_INFO_UPDATE, this._eventId);
                this._eventId = 0;
            }
            if (this._changeHeroEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.HERO_CHANGE, this._changeHeroEventId);
                this._changeHeroEventId = 0;
            }
            if (this._starMc) {
                if (this._starMc.hasEventListener(egret.Event.COMPLETE)) {
                    this._starMc.removeEventListener(egret.Event.COMPLETE, this.removeStarEffect, this);
                }
                this._starMc.destroy();
                if (this._starMc.parent) {
                    this._starMc.parent.removeChild(this._starMc);
                }
                this._starMc = null;
            }
            if (this._stepMc) {
                if (this._stepMc.hasEventListener(egret.Event.COMPLETE)) {
                    this._stepMc.removeEventListener(egret.Event.COMPLETE, this.removeStepEffect, this);
                }
                this._stepMc.destroy();
                if (this._stepMc.parent) {
                    this._stepMc.parent.removeChild(this._stepMc);
                }
                this._stepMc = null;
            }
            if (this._pbMc) {
                if (this._pbMc.hasEventListener(egret.Event.COMPLETE)) {
                    this._pbMc.removeEventListener(egret.Event.COMPLETE, this.removeStepEffect, this);
                }
                this._pbMc.destroy();
                if (this._pbMc.parent) {
                    this._pbMc.parent.removeChild(this._pbMc);
                }
                this._pbMc = null;
            }
            if (this._pbGoMc) {
                this._pbGoMc.destroy();
                if (this._pbGoMc.parent) {
                    this._pbGoMc.parent.removeChild(this._pbGoMc);
                }
                this._pbGoMc = null;
            }
            if (this._wingStepEventId != 0) {
                App.EventSystem.removeEventListener(PanelNotify.WING_STEP_SUCCESS, this._wingStepEventId);
                this._wingStepEventId = 0;
            }
            if (this._combatEff) {
                this._combatEff.destroy();
                if (this._combatEff.parent) {
                    this._combatEff.parent.removeChild(this._combatEff);
                }
                this._combatEff = null;
            }
            this.stopAutoAddExp();
        };
        /**
         * 销毁
         */
        WingDevelopView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return WingDevelopView;
    }(BaseChildView));
    game.WingDevelopView = WingDevelopView;
    __reflect(WingDevelopView.prototype, "game.WingDevelopView");
})(game || (game = {}));
//# sourceMappingURL=WingDevelopView.js.map