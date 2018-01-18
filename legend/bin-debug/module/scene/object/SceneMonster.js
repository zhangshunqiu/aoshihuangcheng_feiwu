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
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景怪物对象
 */
var SceneMonster = (function (_super) {
    __extends(SceneMonster, _super);
    //buff效果相关
    // self.buffPoison = nil --中毒
    // self.buffShield = nil --魔法盾
    // self.buffDizzy = nil --眩晕
    // self.buffFire = nil --烈火
    // self.buffStone = nil --石化
    // self.buffInvisible = nil --隐身
    // self.buffAttAdd = nil --属性加成如防御等
    // self.buffCure = nil --治疗
    // self.silent = nil  --沉默
    function SceneMonster(objectVo) {
        var _this = _super.call(this, objectVo) || this;
        _this.bodyUrl = "";
        _this.pathList = []; //移动路径
        _this.moveSpeed = 12;
        _this._action = 0; //动作类型
        _this.curActState = 0; //当前动作状态
        _this.nextAtkTime = 0;
        _this.actionTime = 1500; //技能动作时间毫秒，攻击开始后只有过了这个时间才能执行下一动作
        _this.showNameAndHpBar = true;
        _this.isCollision = false; //是否碰撞中
        _this._deadAlpha = 2;
        _this.buffEffNum = 0; //buff效果zidian
        _this.showShadow();
        _this.bottomLay = new egret.DisplayObjectContainer();
        _this.addChild(_this.bottomLay);
        _this.modelLay = new egret.DisplayObjectContainer();
        _this.addChild(_this.modelLay);
        _this.headLay = new egret.DisplayObjectContainer();
        _this.addChild(_this.headLay);
        _this.topLay = new egret.DisplayObjectContainer();
        _this.addChild(_this.topLay);
        return _this;
    }
    /**
     * 初始化
     */
    SceneMonster.prototype.init = function () {
        if (this.vo.dire == null) {
            this.vo.dire = new DireScale(5, 1, 5); //方向信息
        }
        this.isCollision = false;
        this.moveSpeed = this.vo.moveSpeed;
        this.nextAtkTime = GlobalModel.getInstance().getTimer() + 500;
        this.playStand();
        this.x = this.vo.posX;
        this.y = this.vo.posY;
        this.setGridPosition(this.vo.gridX, this.vo.gridY);
        this.curActState = 0;
        this._action = 0;
        if (this.pathList == null || this.pathList.length > 0) {
            this.pathList = [];
        }
        this.clearMoveCallBack();
        if (this.endPoint) {
            this.endPoint = null;
        }
        if (this.modelLay.alpha < 1) {
            this.modelLay.alpha = 1;
        }
        this.setShadowVisible(true);
        if (this.showNameAndHpBar) {
            this.updateName();
            this.updateHp();
            this.updateHonorTitle();
        }
        else {
            //判断是否死亡
            if (this.vo.curHp <= 0) {
                this.setDeadState();
            }
        }
        if (this.vo.type == SceneObjectType.PET) {
            this.playBornEff("eff7240");
        }
    };
    /**
      * 更新名称
      */
    SceneMonster.prototype.updateName = function () {
        if (this.nameText == null) {
            this.nameText = new egret.TextField();
            this.headLay.addChild(this.nameText);
            // this.nameText.width = 270;
            // this.nameText.height = 70;
            this.nameText.textColor = 0xffffff;
            //this.nameText.textAlign = egret.HorizontalAlign.CENTER;
            // this.nameText.verticalAlign = egret.VerticalAlign.MIDDLE;
            // this.nameText.strokeColor = 0x000000;
            // this.nameText.stroke = 0.5;
            //this.nameText.italic = true;
            this.nameText.size = 19;
            this.nameText.cacheAsBitmap = true;
        }
        if (this.headLay.visible == false) {
            this.headLay.visible = true;
        }
        if (this.nameText.text != this.vo.name) {
            this.nameText.text = this.vo.name;
            this.nameText.x = 0 - this.nameText.textWidth / 2;
            this.nameText.y = 0 - this.nameText.textHeight / 2 - 162;
        }
    };
    /**
      * 更新名称
      */
    SceneMonster.prototype.updateHonorTitle = function () {
        if (this.vo.honorTitleUrl && this.vo.honorTitleUrl != "") {
            if (this.honorTitle == null) {
                this.honorTitle = new egret.Bitmap();
                this.headLay.addChild(this.honorTitle);
                this.honorTitle.cacheAsBitmap = true;
                this.honorTitle.x = -30;
                this.honorTitle.y = -200;
            }
            RES.getResAsync(this.vo.honorTitleUrl, this.honorLoadComplete, this);
        }
    };
    SceneMonster.prototype.honorLoadComplete = function (event) {
        var img = event;
        if (img) {
            this.honorTitle.texture = img;
            this.honorTitle.x = 0 - this.honorTitle.width / 2;
            this.honorTitle.y = -200 - this.honorTitle.height / 2;
        }
    };
    /**
      * 更新气血
      */
    SceneMonster.prototype.updateHp = function () {
        if (this.hpBar == null) {
            this.hpBar = new SceneHpBar(60, this.vo.hpBarUrl);
            this.headLay.addChild(this.hpBar);
            this.hpBar.y = -116;
        }
        if (this.vo.monsterType == MONSTER_TYPE.WORLD_BOSS) {
            App.EventSystem.dispatchEvent(SceneEventType.BOSS_INFO, this.vo);
        }
        this.hpBar.setValue(this.vo.curHp, this.vo.hp);
        if (this.vo.curHp <= 0) {
            if (this.isCollision == false) {
                this.setDeadState();
            }
            //this.playDead();
        }
        else {
            if (this.nameText == null) {
                this.updateName();
            }
        }
    };
    /**
     * 更新VO
     */
    SceneMonster.prototype.updateVo = function (vo) {
        if (vo) {
            this.vo = vo;
            this.init();
        }
    };
    /**
     * 站立
     */
    SceneMonster.prototype.playStand = function () {
        if (this.vo.actState == ActState.DEAD) {
            return;
        }
        if (this.curActState != ActState.STAND) {
            this.curActState = ActState.STAND;
            this.updateActState(ActState.STAND, this.vo.dire);
        }
        else {
            var curt = GlobalModel.getInstance().getTimer();
            if (curt > this.nextAtkTime && Math.random() * 1000 > 500) {
                //根据怪物攻击类型实行攻击效果
                if (this.vo.enableUseSkill() && this.vo.attackType == MonsterAtkType.AUTO || (this.vo.attackType == MonsterAtkType.PASSIVE && this.vo.curHp < this.vo.hp)) {
                    var skillTargetVo = SceneManager.getInstance().searchUseSkillAndTarget(this.vo, this.vo.nextFSkillVo);
                    if (skillTargetVo.targetArr && skillTargetVo.targetArr.length > 0) {
                        this.nextAtkTime = GlobalModel.getInstance().getTimer() + 1500;
                        var target = skillTargetVo.targetArr[0];
                        var diss = SceneUtil.getDistance(this.x, this.y, target.posX, target.posY);
                        if (diss > skillTargetVo.skillVo.atkDis) {
                            //移动1/3
                            // var npx:number=this.x + (target.posX-this.x)/3;
                            // var npy:number=this.y + (target.posY-this.y)/3;
                            // this.moveToPoint([npx,npy]);
                            this.moveOneGridToPointNearly(this.vo.gridX, this.vo.gridY, target.gridX, target.gridY);
                            if (this.vo.nextFSkillVo == null) {
                                this.vo.nextFSkillVo = skillTargetVo.skillVo;
                            }
                        }
                        else {
                            //当前格有东西则执行跑出一格
                            //距离够就攻击 
                            //更新攻击范围目标列表
                            if (skillTargetVo.targetArr.length > 0) {
                                skillTargetVo = this._sceneModel.updateMonsterHurtListByRange(this.vo, skillTargetVo);
                            }
                            skillTargetVo.atkVo = this.vo;
                            //App.Socket.send(13005,skillTargetVo.creatHookTriggerData(this.vo));
                            this.playAttack(skillTargetVo);
                            this.vo.nextFSkillVo = null;
                        }
                    }
                    else {
                        this.nextAtkTime = GlobalModel.getInstance().getTimer() + 4000;
                        this.gotoWander();
                    }
                }
                else {
                    //if(this.vo.attackType == MonsterAtkType.AVOID)
                    //3=不主动攻击不反击 只逃跑 或别人不惹他的时候闲逛
                    if (this.vo.ownerId && this.vo.ownerId > 0 && this.moveFollowMaster(this.vo.ownerId)) {
                        //跟随主人
                        this.nextAtkTime = GlobalModel.getInstance().getTimer() + 2000;
                    }
                    else if (Math.random() * 1000 > 500) {
                        this.gotoWander();
                        this.nextAtkTime = GlobalModel.getInstance().getTimer() + 4000;
                    }
                }
            }
        }
    };
    /**
     * 游荡或闲逛，离巡逻点远的时候自动返回
     */
    SceneMonster.prototype.gotoWander = function () {
        //没有目标继续游荡
        if (SceneUtil.getDistance(this.vo.patrolX, this.vo.patrolY, this.x, this.y) > 384) {
            //太远，返回巡逻点
            this.moveOneGridToPointNearly(this.vo.gridX, this.vo.gridY, SceneUtil.pixelToGridX(this.vo.patrolX), SceneUtil.pixelToGridY(this.vo.patrolY));
        }
        else {
            var nx = Math.floor(this._sceneModel.gridXNum * Math.random());
            var ny = Math.floor(this._sceneModel.gridYNum * Math.random());
            this.moveOneGridToPointNearly(this.vo.gridX, this.vo.gridY, nx, ny);
            // this.moveToPoint(newPos);
        }
    };
    /**
     * 当前点向目标点按最近移动一格
     */
    SceneMonster.prototype.moveOneGridToPointNearly = function (curGX, curGY, tarGridX, tarGridY) {
        var newPos = SceneUtil.getRoundWalkGridToTarget(curGX, curGY, tarGridX, tarGridY);
        if (newPos) {
            newPos[0] = SceneUtil.gridToPixelX(newPos[0]);
            newPos[1] = SceneUtil.gridToPixelY(newPos[1]);
            this.moveToPoint(newPos);
            return true;
        }
        return false;
    };
    /**
     * 移出当前格子
     */
    SceneMonster.prototype.moveOutCurGrid = function (curGX, curGY, dire8) {
        //当站在同格的时候跑出一格
        var nPos = SceneUtil.getRoundWalkGrid(curGX, curGY, dire8);
        if (nPos) {
            nPos[0] = SceneUtil.gridToPixelX(nPos[0]);
            nPos[1] = SceneUtil.gridToPixelY(nPos[1]);
            this.moveToPoint([nPos[0], nPos[1]]);
            return true;
        }
        return false;
    };
    /**
     * 跟随主人
     * @param ownerId
     */
    SceneMonster.prototype.moveFollowMaster = function (ownerId) {
        var mainPlayerVo = this._sceneModel.getPlayerVo(ownerId);
        if (mainPlayerVo) {
            var dis2 = SceneUtil.getDistance(this.x, this.y, mainPlayerVo.posX, mainPlayerVo.posY);
            if (dis2 > 64 * 3) {
                var nPos = SceneUtil.getNearMoveGridByGridNum(mainPlayerVo.gridX, mainPlayerVo.gridY, this.vo.gridX, this.vo.gridY, 2);
                if (nPos) {
                    nPos[0] = SceneUtil.gridToPixelX(nPos[0]);
                    nPos[1] = SceneUtil.gridToPixelY(nPos[1]);
                    this.moveToPoint([nPos[0], nPos[1]]);
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * 移动
     * @param pathArr 路径数组
     */
    SceneMonster.prototype.playMove = function (pathArr, callBackparam, callBackFun, callBackThisObj) {
        if (callBackparam === void 0) { callBackparam = null; }
        if (callBackFun === void 0) { callBackFun = null; }
        if (callBackThisObj === void 0) { callBackThisObj = null; }
        if (this.vo.actState == ActState.DEAD) {
            return;
        }
        if (this.vo.actState == ActState.STAND || this.vo.actState == ActState.RUN) {
            this.pathList = pathArr;
            if (this.pathList && this.pathList.length > 0) {
                this.clearMoveCallBack();
                if (callBackFun && callBackThisObj) {
                    this.moveCallBackFun = callBackFun;
                    this.moveCallBackThisObj = callBackThisObj;
                    this.moveCallBackParam = callBackparam;
                }
                this.moveToPoint(this.pathList.shift());
            }
            else if (callBackFun && callBackThisObj) {
                callBackFun.call(callBackThisObj, callBackparam);
            }
        }
    };
    /**
     * 把路径加到原来的后面
     * @param path 路径数组
     */
    SceneMonster.prototype.addMovePath = function (path) {
        if (this.vo.actState == ActState.DEAD) {
            return;
        }
        this.pathList = this.pathList.concat(path);
        //App.logzsq(this.pathList.length,path.length);
        if (this.curActState != ActState.RUN) {
            this.playMove(this.pathList);
        }
    };
    /**
     * 清理移动路径
     */
    SceneMonster.prototype.clearMovePath = function () {
        if (this.pathList && this.pathList.length > 0) {
            this.pathList = [];
        }
        this.clearMoveCallBack();
    };
    /**
     * 清理移动回调
     */
    SceneMonster.prototype.clearMoveCallBack = function () {
        this.moveCallBackFun = null;
        this.moveCallBackThisObj = null;
        this.moveCallBackParam = null;
    };
    /**
     * 移动完成
     */
    SceneMonster.prototype.moveComplete = function () {
        this.endPoint = null;
        if (this.pathList && this.pathList.length > 0) {
            this.moveToPoint(this.pathList.shift());
        }
        else {
            if (this.vo.actState == ActState.RUN) {
                this.vo.actState = ActState.STAND;
                if (this.moveCallBackFun && this.moveCallBackThisObj) {
                    this.moveCallBackFun.call(this.moveCallBackThisObj, this.moveCallBackParam);
                }
                this.clearMoveCallBack();
                this.isCollision = false;
                //判断是否死亡
                if (this.vo.curHp <= 0) {
                    this.setDeadState();
                }
            }
        }
    };
    /**
     * 移动到某一点
     */
    SceneMonster.prototype.moveToPoint = function (pos) {
        if (this.vo.actState == ActState.DEAD || (this.vo.actState != ActState.STAND && this.vo.actState != ActState.RUN)) {
            return;
        }
        if (this.vo.enableMove() == false) {
            //麻痹或石化的时候不可走动
            this.pathList = [];
            this.vo.actState = ActState.STAND;
            this.clearMoveCallBack();
            this.isCollision = false;
            //判断是否死亡
            if (this.vo.curHp <= 0) {
                this.setDeadState();
            }
            return;
        }
        pos[0] = Math.floor(pos[0]);
        pos[1] = Math.floor(pos[1]);
        var dis = SceneUtil.getDistance(this.x, this.y, pos[0], pos[1]);
        if (dis < this.moveSpeed) {
            this.moveComplete();
            return;
        }
        var times = Math.round(dis / this.moveSpeed);
        var dire = SceneUtil.getDirectByPoint(pos[0], pos[1], this.x, this.y);
        this.updateMoveStepTimes(pos, times, dire);
    };
    //更新移动次数和步长
    SceneMonster.prototype.updateMoveStepTimes = function (pos, times, dire) {
        this.endPoint = pos;
        this.stepX = (pos[0] - this.x) / times;
        this.stepY = (pos[1] - this.y) / times;
        this.stepTimes = times;
        this.vo.actState = ActState.RUN;
        this.curActState = ActState.RUN;
        this.updateActState(ActState.RUN, dire);
    };
    /**
     * 移动到下一位置
     */
    SceneMonster.prototype.nextPosition = function () {
        if (this.stepTimes <= 1) {
            this.updatePosition(this.endPoint[0], this.endPoint[1]);
            this.stepTimes = 0;
            this.moveComplete();
        }
        else {
            this.stepTimes = this.stepTimes - 1;
            this.updatePosition(this.x + this.stepX, this.y + this.stepY);
        }
    };
    /**
     * 设置格子位置
     */
    SceneMonster.prototype.setGridPosition = function (gx, gy) {
        this._sceneModel.removeGridTablePos(this.vo);
        _super.prototype.setGridPosition.call(this, gx, gy);
        this._sceneModel.addGridTablePos(this.vo);
    };
    /**
     * 攻击
     */
    SceneMonster.prototype.playAttack = function (fstVo) {
        if (this.vo.actState == ActState.DEAD) {
            return;
        }
        this.vo.actState = ActState.ATTACK;
        if (this.curActState != ActState.ATTACK) {
            this.curActState = ActState.ATTACK;
            if (fstVo == null) {
                this.nextAtkTime = GlobalModel.getInstance().getTimer() + 400;
                this.vo.actState = ActState.STAND;
            }
            else {
                this.vo.fSkillTargetVo = fstVo;
                var dire = this.vo.dire;
                var tarVo = fstVo.targetArr[0];
                if (tarVo) {
                    if (tarVo.gridX != this.vo.gridX || tarVo.gridY != this.vo.gridY) {
                        dire = SceneUtil.getDirectByPoint(tarVo.posX, tarVo.posY, this.x, this.y);
                    }
                }
                else if (fstVo.targetPoint) {
                    dire = SceneUtil.getDirectByPoint(fstVo.targetPoint.x, fstVo.targetPoint.y, this.x, this.y);
                }
                this.updateActState(ActState.ATTACK, dire, fstVo.skillVo.atkActType);
                this.playAttackEff(fstVo.skillVo.atkEff, fstVo.skillVo.atkEffType);
            }
            this.nextAtkTime = GlobalModel.getInstance().getTimer() + 3000; //等待3秒加载
        }
    };
    //攻击动作播放完成
    SceneMonster.prototype.playAtkActComplete = function (e) {
        if (this.vo.actState == ActState.ATTACK) {
            this.nextAtkTime = GlobalModel.getInstance().getTimer() + this.vo.fSkillTargetVo.skillVo.actionTime;
            //if(this.vo.actState != ActState.DEAD){
            this.vo.actState = ActState.STAND;
            this.playFlyEff(this.vo.fSkillTargetVo);
            this.vo.fSkillTargetVo = null;
            //}
        }
    };
    /**
     * 播放攻击效果
     */
    SceneMonster.prototype.playAttackEff = function (atkEff, atkEffType) {
        if (atkEff === void 0) { atkEff = ""; }
        if (atkEffType === void 0) { atkEffType = 1; }
        if (atkEff == "") {
            return;
        }
        ;
        if (this.atkEffMc == null) {
            this.atkEffMc = new AMovieClip();
            this.topLay.addChild(this.atkEffMc);
        }
        //App.logzsq("playAttackEff")
        if (atkEffType == 1) {
            this.atkEffUrl = atkEff;
            this.atkEffMc.scaleX = 1;
        }
        else {
            this.atkEffUrl = atkEff + this.vo.dire.dire;
            this.atkEffMc.scaleX = this.vo.dire.scale;
        }
        this.atkEffMc.playMCKey(this.atkEffUrl, "", 1);
        this.atkEffMc.scaleX = this.vo.dire.scale;
        // this.atkEffMc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
        // 	}, this);
        if (this.atkEffMc.hasEventListener(egret.Event.COMPLETE) == false) {
            this.atkEffMc.addEventListener(egret.Event.COMPLETE, this.playAttackEffComplete, this);
        }
    };
    //攻击效果播放完成
    SceneMonster.prototype.playAttackEffComplete = function (e) {
        if (this.atkEffMc) {
            this.atkEffMc.removeEventListener(egret.Event.COMPLETE, this.playAttackEffComplete, this);
            this.atkEffMc.destroy();
            if (this.atkEffMc.parent) {
                this.atkEffMc.parent.removeChild(this.atkEffMc);
            }
            this.atkEffMc = null;
        }
    };
    /**
     * 播放飞行效果
     */
    SceneMonster.prototype.playFlyEff = function (fSkillTarget) {
        if (fSkillTarget && fSkillTarget.skillVo.flyEff != "") {
            var ang = SceneUtil.getAngByDirect(this.vo.dire.dire8);
            var atkPos = new point(this.x, this.y);
            var targetPos = void 0;
            if (fSkillTarget.targetArr && fSkillTarget.targetArr.length > 0) {
                var targetVo = fSkillTarget.targetArr[0];
                targetPos = new point(targetVo.posX, targetVo.posY);
            }
            else if (fSkillTarget.targetPoint) {
                targetPos = fSkillTarget.targetPoint;
            }
            else {
                targetPos = new point(this.x - Math.cos(ang) * 300, this.y - 60 - Math.sin(ang) * 300);
            }
            if (Math.abs(targetPos.x - atkPos.x) < 80 && Math.abs(targetPos.y - atkPos.y) < 80) {
                //效果离目标太近，直接跳过飞行
                this.playGetHit(fSkillTarget);
            }
            else {
                atkPos.x = Math.floor(atkPos.x - Math.cos(ang) * 40);
                atkPos.y = Math.floor(atkPos.y - Math.sin(ang) * 40);
                var effVo = new EffByPosVo();
                effVo.atkPos = atkPos;
                effVo.targetPos = targetPos;
                effVo.effKey = fSkillTarget.skillVo.flyEff;
                effVo.dire = this.vo.dire;
                effVo.thisObject = this;
                effVo.backFun = this.playGetHit;
                effVo.param = fSkillTarget;
                App.EventSystem.dispatchEvent(SceneEventType.SHOW_FLY_EFF, effVo);
            }
        }
        else {
            this.playGetHit(fSkillTarget);
        }
    };
    /**
     * 受击
     */
    SceneMonster.prototype.playGetHit = function (fSkillTarget) {
        if (this.vo.actState == ActState.DEAD) {
            return;
        }
        this.vo.actState = ActState.HITED;
        if (this.curActState != ActState.HITED) {
            this.curActState = ActState.HITED;
            if (fSkillTarget.skillVo.hurtEff != "") {
                //this.updateActState(ActState.HITED,this.vo.dire);
                var hurtEffType = fSkillTarget.skillVo.hurtEffType;
                //1.单体（单个人上）2.多人（分别放多人）3.单体或者多人身上地表(在脚点) 4.群体空中 效果在人上 5.火墙
                if (hurtEffType == SkillHurtEffType.BODY_MIDDLE || hurtEffType == SkillHurtEffType.BODY_MULTI_MIDDLE || hurtEffType == SkillHurtEffType.BODY_SURFACE) {
                    if (fSkillTarget.targetArr && fSkillTarget.targetArr.length > 0) {
                        App.EventSystem.dispatchEvent(SceneEventType.SHOW_BODY_EFF, fSkillTarget);
                    }
                    else {
                        var pos = SceneUtil.getRoleLengthenPos(this.vo.dire, this.x, this.y, 300);
                        var vo = new EffByTimeVo();
                        //vo.atkPos = pos;
                        vo.targetPos = pos;
                        vo.effKey = fSkillTarget.skillVo.hurtEff;
                        App.EventSystem.dispatchEvent(SceneEventType.SHOW_GROUP_EFF, vo);
                    }
                }
                else if (hurtEffType == SkillHurtEffType.GROUP_SKY || hurtEffType == SkillHurtEffType.GROUP_SURFACE) {
                    var pos;
                    if (fSkillTarget.targetArr && fSkillTarget.targetArr.length > 0) {
                        var target = fSkillTarget.targetArr[0];
                        pos = new point(target.posX, target.posY); //群体效果必须上移一点
                    }
                    else {
                        pos = SceneUtil.getRoleLengthenPos(this.vo.dire, this.x, this.y, 300);
                    }
                    var vo = new EffByTimeVo();
                    //vo.atkPos = pos;
                    vo.targetPos = pos;
                    vo.effKey = fSkillTarget.skillVo.hurtEff;
                    App.EventSystem.dispatchEvent(SceneEventType.SHOW_GROUP_EFF, vo);
                }
            }
            //App.EventSystem.dispatchEvent(SceneEventType.UPDATE_HP,fSkillTarget);
            this.vo.actState = ActState.STAND;
            App.logzsq("使用技能", fSkillTarget.skillVo.skillId);
            App.Socket.send(13005, fSkillTarget.creatHookTriggerData(this.vo));
            //后端返回
            // if(fSkillTarget.skillVo.skillId == 10300){
            // 	this.playCollision();
            // 	App.EventSystem.dispatchEvent(SceneEventType.PLAY_COLLISION,fSkillTarget);
            // }
            // else if(fSkillTarget.skillVo.skillId == 10000){
            // 	this.playTransfer();
            // }
        }
    };
    /**
     * 播放受击效果
     */
    SceneMonster.prototype.playGetHitEff = function (skillVo) {
        if (skillVo.hurtEff == "") {
            return;
        }
        if (this.getHitEffMc == null) {
            this.getHitEffMc = new AMovieClip();
            this.topLay.addChild(this.getHitEffMc);
        }
        if (skillVo.hurtEffType == SkillHurtEffType.BODY_SURFACE) {
            this.getHitEffMc.y = 0;
        }
        else {
            this.getHitEffMc.y = -60;
        }
        this.getHitEffUrl = skillVo.hurtEff;
        this.getHitEffMc.playMCKey(this.getHitEffUrl, "", 1);
        this.getHitEffMc.scaleX = this.vo.dire.scale;
        // this.atkEffMc.addEventListener(egret.Event.COMPLETE, (e:egret.Event)=>{
        // 	}, this);
        if (this.getHitEffMc.hasEventListener(egret.Event.COMPLETE) == false) {
            this.getHitEffMc.addEventListener(egret.Event.COMPLETE, this.playGetHitEffComplete, this);
        }
    };
    SceneMonster.prototype.playGetHitEffComplete = function (e) {
        //App.logzsq("playGetHitEffComplete" ,this.vo.actState)
        if (this.getHitEffMc) {
            this.getHitEffMc.removeEventListener(egret.Event.COMPLETE, this.playGetHitEffComplete, this);
            this.getHitEffMc.destroy();
            if (this.getHitEffMc.parent) {
                this.getHitEffMc.parent.removeChild(this.getHitEffMc);
            }
            this.getHitEffMc = null;
        }
    };
    /**
     * 死亡
     */
    SceneMonster.prototype.playDead = function () {
        //this.vo.actState = ActState.DEAD;
        if (this.curActState != ActState.DEAD) {
            this.curActState = ActState.DEAD;
            this.updateActState(ActState.DEAD, this.vo.dire);
            this.headLay.visible = false;
            this.setShadowVisible(false);
            this.clearAllBuffEff();
            this.pathList = [];
            this.clearMoveCallBack();
            // //tese zhangshunqiu 测试掉落物品 
            // var vo = new SceneItemVo();
            // vo.posX = SceneUtil.gridToPixelX(this.vo.gridX);
            // vo.posY = SceneUtil.gridToPixelX(this.vo.gridY);
            // SceneModel.getInstance().addSceneObjectVo(vo);
            // (EventSystem.getInstance() as EventSystem).dispatchEvent(SceneEventType.ADD_SCENE_OBJECT,vo);
            // //tese zhangshunqiu 测试掉落物品 end
            this._deadAlpha = 4;
        }
        else if (this._deadAlpha > -20) {
            this._deadAlpha = Math.max(this._deadAlpha - 0.1, 0);
            this.modelLay.alpha = Math.min(this._deadAlpha, 1);
            if (this._deadAlpha <= 0.1 && this.getHitEffMc == null) {
                SceneModel.getInstance().removeSceneObjectVo(this.vo);
                EventSystem.getInstance().dispatchEvent(SceneEventType.REMOVE_SCENE_OBJECT, this.vo);
            }
        }
        else {
            SceneModel.getInstance().removeSceneObjectVo(this.vo);
            EventSystem.getInstance().dispatchEvent(SceneEventType.REMOVE_SCENE_OBJECT, this.vo);
        }
    };
    /**
     * 设置死亡状态
     */
    SceneMonster.prototype.setDeadState = function () {
        this.vo.actState = ActState.DEAD;
        //死亡后需要清理body完成事件
        if (this.bodyMc && this.bodyMc.hasEventListener(egret.Event.COMPLETE)) {
            this.bodyMc.removeEventListener(egret.Event.COMPLETE, this.playAtkActComplete, this);
        }
    };
    /**
     * 更新模型
     */
    SceneMonster.prototype.updateBody = function (bodyUrl, action, scaleX, times, defaultmc) {
        if (bodyUrl === void 0) { bodyUrl = ""; }
        if (action === void 0) { action = ""; }
        if (scaleX === void 0) { scaleX = 1; }
        if (times === void 0) { times = -1; }
        if (defaultmc === void 0) { defaultmc = null; }
        if (this.bodyMc == null) {
            this.bodyMc = new AMovieClip();
            this.modelLay.addChild(this.bodyMc);
            //this.bodyMc.x = App.stageWidth/2;
            //this.bodyMc.y = App.stageHeight/2
        }
        this.bodyUrl = bodyUrl;
        this.bodyMc.playMCKey(bodyUrl, action, times, defaultmc);
        this.bodyMc.scaleX = scaleX;
    };
    /**
     * 更新动作状态
     * @param  actState 动作状态 ActState
     * @param dire 方向
     * @param  atkActType 播放动作类型
     * @param isForce 是否强制更新
     */
    SceneMonster.prototype.updateActState = function (actState, dire, atkActType, isForce) {
        if (atkActType === void 0) { atkActType = 3; }
        if (isForce === void 0) { isForce = false; }
        if (this.vo.dire.dire == dire.dire && this.vo.dire.scale == dire.scale && this._action == actState && isForce == false) {
            return;
        }
        this._action = actState;
        this.vo.dire = dire;
        if (actState == ActState.STAND || actState == ActState.DEAD) {
            this.updateBody(this.vo.bodyId + "1" + dire.dire, "", dire.scale); //run
        }
        else if (actState == ActState.RUN) {
            this.updateBody(this.vo.bodyId + "2" + dire.dire, "", dire.scale); //run
        }
        else if (actState == ActState.ATTACK) {
            var atkAckType = String(atkActType);
            this.updateBody(this.vo.bodyId + atkAckType + dire.dire, "", dire.scale, 1); //run
            // this.bodyMc.addEventListener(egret.MovieClipEvent.FRAME_LABEL,(e:egret.MovieClipEvent)=>{
            // 	App.logzsq("FRAME_LABEL:"+e.type,e.frameLabel, this.bodyMc.currentFrame);//frame_label @fall 6
            // },this);
            // this.bodyMc.addEventListener(egret.Event.LOOP_COMPLETE, (e:egret.Event)=>{
            // 	App.logzsq("LOOP_COMPLETE:"+e.type,this.vo.actState);//输出3次
            // 	this.vo.actState = ActState.STAND;
            // }, this);
            if (this.bodyMc.hasEventListener(egret.Event.COMPLETE) == false) {
                this.bodyMc.addEventListener(egret.Event.COMPLETE, this.playAtkActComplete, this);
            }
        }
    };
    /**
     * 更新模型
     */
    SceneMonster.prototype.updateAllModel = function () {
        if (this.vo.actState == ActState.ATTACK || this.vo.actState == ActState.DEAD) {
            return;
        }
        this.updateActState(this.vo.actState, this.vo.dire, 3, true);
    };
    /**
     * 碰撞检测
     */
    SceneMonster.prototype.ishitTest = function (xx, yy) {
        return this.bodyMc.hitTestPoint(xx, yy);
    };
    /**
     * 冲撞
     */
    SceneMonster.prototype.playCollision = function (gridDis, moveSpeed) {
        if (gridDis === void 0) { gridDis = 2; }
        if (moveSpeed === void 0) { moveSpeed = 30; }
        if (this.vo.actState == ActState.DEAD) {
            return;
        }
        this.pathList = [];
        this.clearMoveCallBack();
        var gridList = BumpFrontGrids[gridDis][this.vo.dire.dire8];
        var tgx;
        var tgy;
        var ngx = this.vo.gridX;
        var ngy = this.vo.gridY;
        for (var k = 0; k < gridList.length; k++) {
            var offset = gridList[k];
            tgx = this.vo.gridX + offset[0];
            tgy = this.vo.gridY + offset[1];
            if (this._sceneModel.curGridIsOpen(tgx, tgy) && this._sceneModel.getGridTableHasObj(tgx, tgy) == false) {
                ngx = tgx;
                ngy = tgy;
            }
        }
        if (ngx != this.vo.gridX || ngy != this.vo.gridY) {
            var pos = [SceneUtil.gridToPixelX(ngx), SceneUtil.gridToPixelY(ngy)];
            var dis = SceneUtil.getDistance(this.x, this.y, pos[0], pos[1]);
            var times = Math.round(dis / moveSpeed);
            this.updateMoveStepTimes(pos, times, this.vo.dire);
        }
        // //old
        // let pos:Array<number>;
        // if(nextPos == null){
        // 	nextPos = SceneUtil.getRoleLengthenPos(this.vo.dire,this.x,this.y,320);
        // }
        // pos = [Math.min(SceneModel.getInstance().sceneWidth,Math.max(0,nextPos.x)),Math.min(SceneModel.getInstance().sceneHeight,Math.max(0,nextPos.y))];
        // var dis:number = SceneUtil.getDistance(this.x,this.y,pos[0],pos[1]);
        // var times:number = Math.round(dis/moveSpeed);
        // this.updateMoveStepTimes(pos, times ,this.vo.dire);
    };
    /**
     * 被冲撞,被振开也可以用，速度调低点
     */
    SceneMonster.prototype.playBeCollision = function (gridDis, dire, moveSpeed) {
        if (gridDis === void 0) { gridDis = 2; }
        if (dire === void 0) { dire = 0; }
        if (moveSpeed === void 0) { moveSpeed = 30; }
        if (this.vo.actState == ActState.DEAD) {
            return;
        }
        this.pathList = [];
        this.clearMoveCallBack();
        if (dire == 0) {
            dire = SceneUtil.getReversedDireScale(this.vo.dire.dire8).dire8;
        }
        var gridList = BumpFrontGrids[gridDis][dire];
        var tgx;
        var tgy;
        var ngx = this.vo.gridX;
        var ngy = this.vo.gridY;
        for (var k = 0; k < gridList.length; k++) {
            var offset = gridList[k];
            tgx = this.vo.gridX + offset[0];
            tgy = this.vo.gridY + offset[1];
            if (this._sceneModel.curGridIsOpen(tgx, tgy) && this._sceneModel.getGridTableHasObj(tgx, tgy) == false) {
                ngx = tgx;
                ngy = tgy;
            }
        }
        if (ngx != this.vo.gridX || ngy != this.vo.gridY) {
            var pos = [SceneUtil.gridToPixelX(ngx), SceneUtil.gridToPixelY(ngy)];
            var dis = SceneUtil.getDistance(this.x, this.y, pos[0], pos[1]);
            var times = Math.round(dis / moveSpeed);
            this.updateMoveStepTimes(pos, times, this.vo.dire);
            this.isCollision = true;
            //跑完后才让他死亡
        }
        // let pos:Array<number>;
        // if(nextPos == null){
        // 	nextPos = SceneUtil.getRoleLengthenPos(SceneUtil.getReversedDireScale(this.vo.dire.dire8),this.x,this.y,320);
        // }
        // pos = [Math.min(SceneModel.getInstance().sceneWidth,Math.max(0,nextPos.x)),Math.min(SceneModel.getInstance().sceneHeight,Math.max(0,nextPos.y))];
        // var dis:number = SceneUtil.getDistance(this.x,this.y,pos[0],pos[1]);
        // var times:number = Math.round(dis/moveSpeed);
        // this.updateMoveStepTimes(pos, times ,this.vo.dire);
    };
    /**
     * 传送，从一个地方调到另外一个地方
     */
    SceneMonster.prototype.playTransfer = function (nextPos, dire) {
        if (nextPos === void 0) { nextPos = null; }
        if (dire === void 0) { dire = 0; }
        if (this.vo.actState == ActState.DEAD) {
            return;
        }
        this.pathList = [];
        this.clearMoveCallBack();
        if (dire == 0) {
            dire = this.vo.dire.dire8;
        }
        if (nextPos == null) {
            var nx = Math.floor(this._sceneModel.gridXNum * Math.random());
            var ny = Math.floor(this._sceneModel.gridYNum * Math.random());
            nextPos = new point(SceneUtil.gridToPixelX(nx), SceneUtil.gridToPixelY(ny));
        }
        this.updatePosition(nextPos.x, nextPos.y);
    };
    /**
     * 更新
     */
    SceneMonster.prototype.update = function () {
        //super.update();
        if (this.vo.actState == ActState.RUN) {
            this.nextPosition();
        }
        else if (this.vo.actState == ActState.STAND) {
            this.playStand();
        }
        else if (this.vo.actState == ActState.DEAD) {
            this.playDead();
        }
        if (this.vo.initBuffQueue && this.vo.initBuffQueue.length > 0) {
            var v = this.vo.initBuffQueue.pop();
            if (v.isRemove() == false) {
                this.vo.addBuff(v);
                this.addBuff(v);
            }
        }
        else {
            var buffDic = this.vo.buffDic;
            var v;
            for (var k in buffDic) {
                v = buffDic[k];
                if (v.isRemove()) {
                    this.vo.removeBuff(v);
                    this.removeBuff(v);
                }
            }
        }
        //App.logzsq(this.curActState);
    };
    /**
     * 暂停
     */
    SceneMonster.prototype.pause = function () {
        _super.prototype.pause.call(this);
    };
    /**
     * 恢复暂停
     */
    SceneMonster.prototype.resume = function () {
        _super.prototype.resume.call(this);
    };
    /**
     * 销毁
     */
    SceneMonster.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.bodyMc) {
            this.bodyMc.removeEventListener(egret.Event.COMPLETE, this.playAtkActComplete, this);
            this.bodyMc.destroy();
            this.bodyMc.parent.removeChild(this.bodyMc);
            this.bodyMc = null;
            this.bodyUrl = "";
        }
        if (this.getHitEffMc) {
            this.getHitEffMc.removeEventListener(egret.Event.COMPLETE, this.playGetHitEffComplete, this);
            this.getHitEffMc.destroy();
            if (this.getHitEffMc.parent) {
                this.getHitEffMc.parent.removeChild(this.getHitEffMc);
            }
            this.getHitEffMc = null;
        }
        if (this.atkEffMc) {
            this.atkEffMc.removeEventListener(egret.Event.COMPLETE, this.playAttackEffComplete, this);
            this.atkEffMc.destroy();
            if (this.atkEffMc.parent) {
                this.atkEffMc.parent.removeChild(this.atkEffMc);
            }
            this.atkEffMc = null;
        }
        this.clearShadow();
        this.clearAllBuffEff();
        this.pathList = [];
        this.clearMoveCallBack();
        this.endPoint = null;
        this.curActState = 0;
        this._action = 0;
        this.vo.clear();
        this.isCollision = false;
    };
    SceneMonster.prototype.showShadow = function (isSel) {
        if (isSel === void 0) { isSel = false; }
        var picUrl;
        if (this.vo.monsterType > 1) {
            this.setPicShadow();
            if (isSel) {
                picUrl = "effbosszb";
            }
            else {
                picUrl = "effbosszb";
            }
            this.setMCShadow(picUrl);
        }
        else {
            this.setMCShadow();
            _super.prototype.showShadow.call(this, isSel);
        }
    };
    //设置动画阴影
    SceneMonster.prototype.setMCShadow = function (picUrl) {
        if (picUrl === void 0) { picUrl = null; }
        if (picUrl && picUrl != "") {
            if (this.shadowMc == null) {
                this.shadowMc = new AMovieClip();
                this.addChild(this.shadowMc);
            }
            this.shadowMc.playMCKey(picUrl, "", -1);
            //this.shadowMc.x = 0-this.shadow.width/2;
            //this.shadowMc.y = 0-this.shadow.height/2;
        }
        else {
            if (this.shadowMc) {
                this.shadowMc.destroy();
                if (this.shadowMc.parent) {
                    this.shadowMc.parent.removeChild(this.shadowMc);
                }
                this.shadowMc = null;
            }
        }
    };
    //清理阴影
    SceneMonster.prototype.clearShadow = function () {
        _super.prototype.clearShadow.call(this);
        this.setMCShadow();
    };
    //设置阴影显示
    SceneMonster.prototype.setShadowVisible = function (b) {
        _super.prototype.setShadowVisible.call(this, b);
        if (this.shadowMc) {
            this.shadowMc.visible = b;
        }
    };
    /**
     * 播放buff效果
     */
    SceneMonster.prototype.showBuffEff = function (buffEff) {
        if (buffEff == "" || this.vo.actState == ActState.DEAD) {
            return;
        }
        if (this.buffEffDic == null) {
            this.buffEffDic = {};
        }
        else if (this.buffEffDic[buffEff]) {
            return;
        }
        var buffMc = new AMovieClip();
        this.buffEffDic[buffEff] = buffMc;
        this.topLay.addChild(buffMc);
        this.buffEffNum++;
        buffMc.playMCKey(buffEff, "", -1);
    };
    /**
     * 清理buff效果
     */
    SceneMonster.prototype.clearBuffEff = function (buffEff) {
        if (this.buffEffDic && this.buffEffDic[buffEff]) {
            var mc = this.buffEffDic[buffEff];
            mc.destroy();
            if (mc.parent) {
                mc.parent.removeChild(mc);
            }
            this.buffEffNum--;
            this.buffEffDic[buffEff] = null;
            delete this.buffEffDic[buffEff];
        }
    };
    /**
     * 清理buff效果
     */
    SceneMonster.prototype.clearAllBuffEff = function () {
        if (this.buffEffDic) {
            for (var k in this.buffEffDic) {
                var disObj = this.buffEffDic[k];
                if (disObj) {
                    disObj.destroy();
                    if (disObj.parent) {
                        disObj.parent.removeChild(disObj);
                    }
                }
                this.buffEffDic[k] = null;
            }
        }
        this.buffEffNum = 0;
        this.buffEffDic = {};
    };
    SceneMonster.prototype.addBuff = function (vo) {
        switch (vo.effType) {
            case BuffEffType.STONE:
                this.setModelfilters(SceneFiltersType.GRAY);
                break;
            case BuffEffType.DIZZY:
                this.setModelfilters(SceneFiltersType.WHITE);
                break;
            case BuffEffType.INVISIBLE:
                this.setModelInvisible(true);
                break;
            case BuffEffType.POISON:
                this.setModelfilters(SceneFiltersType.GREEN);
                break;
            case BuffEffType.SHIELD:
                break;
            case BuffEffType.SILENT:
                break;
            default:
        }
        if (vo.mcResId && vo.mcResId != "") {
            this.showBuffEff(vo.mcResId);
        }
    };
    SceneMonster.prototype.removeBuff = function (vo) {
        switch (vo.effType) {
            case BuffEffType.STONE:
                this.setModelfilters(SceneFiltersType.NULL);
                break;
            case BuffEffType.DIZZY:
                this.setModelfilters(SceneFiltersType.NULL);
                break;
            case BuffEffType.INVISIBLE:
                this.setModelInvisible(false);
                break;
            case BuffEffType.POISON:
                this.setModelfilters(SceneFiltersType.NULL);
                break;
            case BuffEffType.SHIELD:
                break;
            case BuffEffType.SILENT:
                break;
            default:
        }
        if (vo.mcResId && vo.mcResId != "") {
            this.clearBuffEff(vo.mcResId);
        }
    };
    /**
     * 设置滤镜
     * @param type 滤镜类型SceneFiltersType
     */
    SceneMonster.prototype.setModelfilters = function (type) {
        if (type === void 0) { type = 0; }
        //SceneFiltersType
        var filters = SceneFilters[type];
        if (this.bodyMc) {
            this.bodyMc.filters = filters;
        }
    };
    /**
     *  设置隐身
     */
    SceneMonster.prototype.setModelInvisible = function (b) {
        if (b === void 0) { b = true; }
        //SceneFiltersType
        if (b) {
            if (this.modelLay.alpha != 0.5) {
                this.modelLay.alpha = 0.5;
            }
        }
        else {
            if (this.modelLay.alpha != 1) {
                this.modelLay.alpha = 1;
            }
        }
    };
    Object.defineProperty(SceneMonster.prototype, "vo", {
        /**
         * 获取VO
         */
        get: function () {
            return this._objVo;
        },
        //BUFF 相关END
        /**
         * 设置VO
         */
        set: function (value) {
            this._objVo = value;
        },
        enumerable: true,
        configurable: true
    });
    return SceneMonster;
}(SceneBaseObj));
__reflect(SceneMonster.prototype, "SceneMonster");
//# sourceMappingURL=SceneMonster.js.map