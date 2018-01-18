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
 * Email： 21102585@qq.com  2017/6/20
 * 场景玩家对象
 */
var ScenePlayer = (function (_super) {
    __extends(ScenePlayer, _super);
    function ScenePlayer(objectVo) {
        var _this = _super.call(this, objectVo) || this;
        _this.wingUrl = "";
        _this.weaponUrl = "";
        _this.isMainRole = false; //是否是主玩家
        _this._zorderDire = 0;
        _this._curTargetId = 0;
        _this._curTargetType = 0;
        return _this;
    }
    /**
     * 初始化
     */
    ScenePlayer.prototype.init = function () {
        if (this.vo.id == RoleManager.getInstance().getMainHeroId()) {
            this.isMainRole = true;
        }
        else {
            this.isMainRole = false;
        }
        this.isCollision = false;
        this.moveSpeed = this.vo.moveSpeed;
        this.playStand();
        //有时玩家的位置不对，要矫正玩家位置
        if (this.vo.posX >= this._sceneModel.sceneWidth || this.vo.posY >= this._sceneModel.sceneHeight) {
            this.vo.posX = this._sceneModel.sceneWidth - 32;
            this.vo.posY = this._sceneModel.sceneHeight - 32;
            this.vo.gridX = SceneUtil.pixelToGridX(this.vo.posX);
            this.vo.gridY = SceneUtil.pixelToGridY(this.vo.posY);
        }
        this.x = this.vo.posX;
        this.y = this.vo.posY;
        this.setGridPosition(this.vo.gridX, this.vo.gridY);
        this.curActState = 0;
        this._action = 0;
        this.pathList = [];
        this.clearMoveCallBack();
        this.endPoint = null;
        this._zorderDire = 0;
        this.actionTime = 500;
        this.nextAtkTime = GlobalModel.getInstance().getTimer() + 500;
        if (this.modelLay.alpha < 1) {
            this.modelLay.alpha = 1;
        }
        this.setShadowVisible(true);
        this.showNameAndHpBar = true;
        this.updateName();
        this.updateHp();
        this.updateHonorTitle();
        if (this.isMainRole) {
            this.dispatchMainRolePos([this.vo.posX, this.vo.posY]);
        }
        // if(this.isMainRole){
        // 	this.showNameAndHpBar = true;
        // 	this.updateName();
        // 	this.updateHp();
        // }else{
        // 	//判断是否死亡
        // 	if(this.vo.curHp <= 0){
        // 		this.setDeadState();
        // 	}
        // }
    };
    /**
      * 更新气血
      */
    ScenePlayer.prototype.updateHp = function () {
        _super.prototype.updateHp.call(this);
    };
    /**
     * 更新VO
     */
    ScenePlayer.prototype.updateVo = function (vo) {
        if (vo) {
            this.vo = vo;
            this.init();
        }
    };
    /**
     * 站立
     */
    ScenePlayer.prototype.playStand = function () {
        if (this.vo.actState == ActState.DEAD) {
            return;
        }
        if (this.curActState != ActState.STAND) {
            this.curActState = ActState.STAND;
            this.updateActState(ActState.STAND, this.vo.dire);
        }
        else {
            var nn = Math.random() * 1000;
            if (GlobalModel.getInstance().getTimer() > this.nextAtkTime && nn > 500) {
                //优先查找可以拾取的物品
                if ((this.isMainRole || (this.isMainRole == false && this._sceneModel.pickItemHeroId == this.vo.id && this.vo.type == SceneObjectType.PLAYER)) && this._sceneModel.pickItemType == PICK_ITEM_TYPE.get_by_move) {
                    var model = SceneModel.getInstance();
                    var itemDic = model.sceneItemVoDic;
                    var dis = 100000;
                    var dVo;
                    for (var key in itemDic) {
                        var vo = itemDic[key];
                        var tdis = SceneUtil.getDistance(this.x, this.y, vo.posX, vo.posY);
                        if (tdis < dis && tdis < 640) {
                            dis = tdis;
                            dVo = vo;
                        }
                    }
                    if (dVo) {
                        this.moveToPickup(dVo);
                        return;
                    }
                    //优先查找可以拾取的物品 end
                }
                this.nextAtkTime = GlobalModel.getInstance().getTimer() + 1000;
                if (this.vo.enableUseSkill() && this.visible) {
                    var skillTargetVo = SceneManager.getInstance().searchUseSkillAndTarget(this.vo, this.vo.nextFSkillVo);
                    if (skillTargetVo.targetArr && skillTargetVo.targetArr.length > 0) {
                        var target = skillTargetVo.targetArr[0];
                        var diss = SceneUtil.getDistance(this.x, this.y, target.posX, target.posY);
                        if (diss > skillTargetVo.skillVo.atkDis) {
                            var nPos = SceneUtil.getNearMoveGridByGridNum(target.gridX, target.gridY, this.vo.gridX, this.vo.gridY, Math.floor(skillTargetVo.skillVo.atkDis / 64));
                            if (nPos) {
                                nPos[0] = SceneUtil.gridToPixelX(nPos[0]);
                                nPos[1] = SceneUtil.gridToPixelY(nPos[1]);
                                this.moveToPoint([nPos[0], nPos[1]]);
                                // var pathList:Array<Array<number>> = this._sceneModel.getAStarPixelPath(this.vo.gridX,this.vo.gridY,nPos[0],nPos[1]);
                                // if(pathList){
                                // 	this.addMovePath(pathList);
                                // }
                            }
                            if (this.vo.nextFSkillVo == null) {
                                this.vo.nextFSkillVo = skillTargetVo.skillVo;
                            }
                            return;
                        }
                        else {
                            if (diss < 32 && target && target.id != this.vo.id && (skillTargetVo.skillVo.targetType == SkillTargetType.ENEMY || skillTargetVo.skillVo.targetType == SkillTargetType.PARTNER)) {
                                //当站在同格的时候跑出一格
                                if (this.moveOutCurGrid(this.vo.gridX, this.vo.gridY, this.vo.dire.dire8)) {
                                    return;
                                }
                            }
                            //当前格有东西则执行跑出一格
                            //距离够就攻击
                            //更新攻击范围目标列表
                            if (skillTargetVo.targetArr.length > 0) {
                                skillTargetVo = this._sceneModel.updatePlayerHurtListByRange(this.vo, skillTargetVo);
                            }
                            skillTargetVo.atkVo = this.vo;
                            this.playAttack(skillTargetVo);
                            this.vo.nextFSkillVo = null;
                            return;
                        }
                    }
                    else {
                        //没有攻击目标
                    }
                }
                else {
                    //不能放技能
                }
                if (this.isMainRole == false && this.vo.ownerId && this.vo.ownerId > 0 && this.moveFollowMaster(this.vo.ownerId)) {
                    //跟随主人
                }
                else if (this._sceneModel.getGridTableHasTwoObj(this.vo.gridX, this.vo.gridY) && this.moveOutCurGrid(this.vo.gridX, this.vo.gridY, this.vo.dire.dire8)) {
                    //当站在同格的时候跑出一格
                }
            }
        }
    };
    /**
     * 走去拾取物品
     */
    ScenePlayer.prototype.moveToPickup = function (itemVO) {
        if (this.moveToPickupCallback(itemVO) == false) {
            this.playMove([[itemVO.posX, itemVO.posY]], itemVO, this.moveToPickupCallback, this);
        }
    };
    /**
     * 拾取物品
     */
    ScenePlayer.prototype.moveToPickupCallback = function (itemVO) {
        if (SceneUtil.getDistance(this.x, this.y, itemVO.posX, itemVO.posY) < 64) {
            //test zhangshunqiu 拾取物品测试
            App.Socket.send(11006, { id: itemVO.id });
            SceneModel.getInstance().removeSceneObjectVo(itemVO);
            EventSystem.getInstance().dispatchEvent(SceneEventType.REMOVE_SCENE_OBJECT, itemVO);
            return true;
        }
        return false;
    };
    //更新移动次数和步长
    ScenePlayer.prototype.updateMoveStepTimes = function (pos, times, dire) {
        _super.prototype.updateMoveStepTimes.call(this, pos, times, dire);
        if (this.isMainRole) {
            var sendData = { obj_type: this.vo.type, obj_id: this.vo.id, begin_x: this.vo.gridX, begin_y: this.vo.gridY, end_x: SceneUtil.pixelToGridX(this.endPoint[0]), end_y: SceneUtil.pixelToGridY(this.endPoint[1]), direction: this.vo.dire.dire8 };
            App.Socket.send(11002, sendData);
        }
    };
    /**
     * 移动完成
     */
    ScenePlayer.prototype.moveComplete = function () {
        _super.prototype.moveComplete.call(this);
        //玩家还要处理完成后功能
    };
    /**
     * 更新位置
     */
    ScenePlayer.prototype.updatePosition = function (xx, yy) {
        //xx == Math.floor(xx);
        //yy == Math.floor(yy);
        _super.prototype.updatePosition.call(this, xx, yy);
        //App.logzsq("updatePosition = ",this.vo.gridX,this.vo.gridY)
        this.dispatchMainRolePos([xx, yy]);
    };
    /**
     * 派发主角位置信息
     */
    ScenePlayer.prototype.dispatchMainRolePos = function (pos) {
        if (this.isMainRole) {
            App.EventSystem.dispatchEvent(SceneEventType.UPDATE_SCENE_POS, pos);
        }
    };
    /**
     * 播放摇杆移动功能
     */
    ScenePlayer.prototype.playRocker = function (xx, yy) {
    };
    /**
     * 停止摇杆移动功能
     */
    ScenePlayer.prototype.stopRocker = function () {
    };
    /**
     * 死亡
     */
    ScenePlayer.prototype.playDead = function () {
        //this.vo.actState = ActState.DEAD;
        if (this.curActState != ActState.DEAD) {
            this.curActState = ActState.DEAD;
            this.updateActState(ActState.DEAD, this.vo.dire);
            this.modelLay.alpha = 0.8;
            //this.headLay.visible = false;
            if (this.weaponMc) {
                this.weaponMc.visible = false;
            }
            if (this.wingMc) {
                this.wingMc.visible = false;
            }
            this.setShadowVisible(false);
            this.clearAllBuffEff();
            this.pathList = [];
            this.clearMoveCallBack();
            if (this.isMainRole || this.vo.type == SceneObjectType.PLAYER) {
                this._sceneModel.updatePickItemHeroId();
            }
        }
    };
    /**
     * 更新翅膀
     */
    ScenePlayer.prototype.updateWing = function (wingUrl, action, scaleX, times) {
        if (wingUrl === void 0) { wingUrl = ""; }
        if (action === void 0) { action = ""; }
        if (scaleX === void 0) { scaleX = 1; }
        if (times === void 0) { times = -1; }
        if (this.wingMc == null) {
            this.wingMc = new AMovieClip();
            this.modelLay.addChild(this.wingMc);
        }
        if (this.wingMc.visible == false) {
            this.wingMc.visible = true;
        }
        this.wingUrl = wingUrl;
        this.wingMc.playMCKey(wingUrl, action, times);
        this.wingMc.scaleX = scaleX;
    };
    /**
     * 更新武器
     */
    ScenePlayer.prototype.updateWeapon = function (weaponUrl, action, scaleX, times) {
        if (weaponUrl === void 0) { weaponUrl = ""; }
        if (action === void 0) { action = ""; }
        if (scaleX === void 0) { scaleX = 1; }
        if (times === void 0) { times = -1; }
        if (this.weaponMc == null) {
            this.weaponMc = new AMovieClip();
            this.modelLay.addChild(this.weaponMc);
        }
        if (this.weaponMc.visible == false) {
            this.weaponMc.visible = true;
        }
        this.weaponUrl = weaponUrl;
        this.weaponMc.playMCKey(weaponUrl, action, times);
        this.weaponMc.scaleX = scaleX;
    };
    /**
     * 更新动作状态
     * @param  actState 动作状态 ActState
     * @param dire 方向
     * @param  atkActType 播放动作类型
     * @param isForce 是否强制更新
     */
    ScenePlayer.prototype.updateActState = function (actState, dire, atkActType, isForce) {
        if (atkActType === void 0) { atkActType = 3; }
        if (isForce === void 0) { isForce = false; }
        if (this.vo.dire.dire == dire.dire && this.vo.dire.scale == dire.scale && this._action == actState && isForce == false) {
            return;
        }
        //App.logzsq("updateActState",actState,actState)
        this._action = actState;
        this.vo.dire = dire;
        if (actState == ActState.STAND) {
            this.updateBody(this.vo.bodyId + "1" + dire.dire, "", dire.scale); //run
            if (this.vo.wingId != "") {
                this.updateWing(this.vo.wingId + "1" + dire.dire, "", dire.scale);
            } //run
            if (this.vo.weaponId != "") {
                this.updateWeapon(this.vo.weaponId + "1" + dire.dire, "", dire.scale);
            } //run
        }
        else if (actState == ActState.DEAD) {
            this.updateBody(this.vo.bodyId + "5" + dire.dire, "", dire.scale, 1); //run
            //this.updateWing("40011"+dire.dire,"",dire.scale);//run
            //this.updateWeapon("30011"+dire.dire,"",dire.scale);//run
        }
        else if (actState == ActState.RUN) {
            this.updateBody(this.vo.bodyId + "2" + dire.dire, "", dire.scale); //run
            if (this.vo.wingId != "") {
                this.updateWing(this.vo.wingId + "2" + dire.dire, "", dire.scale);
            } //run
            if (this.vo.weaponId != "") {
                this.updateWeapon(this.vo.weaponId + "2" + dire.dire, "", dire.scale);
            } //run
            //this.updateBody("body000_1_"+(dire.dire-1)+"r","",dire.scale);//run
        }
        else if (actState == ActState.ATTACK) {
            var atkAckType = String(atkActType);
            this.updateBody(this.vo.bodyId + atkAckType + dire.dire, "", dire.scale, 1, "defaultmc"); //run
            if (this.vo.wingId != "") {
                this.updateWing(this.vo.wingId + atkAckType + dire.dire, "", dire.scale, 1);
            } //run
            if (this.vo.weaponId != "") {
                this.updateWeapon(this.vo.weaponId + atkAckType + dire.dire, "", dire.scale, 1);
            } //run
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
        if (this.weaponMc || this.wingMc) {
            this.updateZorder(dire.dire);
        }
    };
    //攻击动作播放完成
    ScenePlayer.prototype.playAtkActComplete = function (e) {
        _super.prototype.playAtkActComplete.call(this, e);
        //	App.logzsq("playAtkActComplete _ "+this.vo.actState);
    };
    /**
     * 更新显示对象深度
     */
    ScenePlayer.prototype.updateZorder = function (dire) {
        if (dire == 1 && this._zorderDire != 1) {
            this._zorderDire = 1;
            if (this.weaponMc) {
                this.modelLay.setChildIndex(this.weaponMc, 9);
            }
            this.modelLay.setChildIndex(this.bodyMc, 9);
            if (this.wingMc) {
                this.modelLay.setChildIndex(this.wingMc, 9);
            }
        }
        else if ((dire == 3 || dire == 2) && this._zorderDire != 2) {
            this._zorderDire = 2;
            this.modelLay.setChildIndex(this.bodyMc, 9);
            if (this.weaponMc) {
                this.modelLay.setChildIndex(this.weaponMc, 9);
            }
            if (this.wingMc) {
                this.modelLay.setChildIndex(this.wingMc, 9);
            }
        }
        else if ((dire == 4 || dire == 5) && this._zorderDire != 3) {
            this._zorderDire = 3;
            if (this.wingMc) {
                this.modelLay.setChildIndex(this.wingMc, 9);
            }
            this.modelLay.setChildIndex(this.bodyMc, 9);
            if (this.weaponMc) {
                this.modelLay.setChildIndex(this.weaponMc, 9);
            }
        }
        // this.modelLay
        // App.logzsq("dire = "+dire,this.modelLay.getChildIndex(this.weaponMc),this.modelLay.getChildIndex(this.bodyMc),this.modelLay.getChildIndex(this.wingMc));
        // App.logzsq(this.modelLay.$children,this.wingMc.hashCode,this.modelLay.getChildAt(0).hashCode,this.modelLay.getChildAt(2).hashCode);
    };
    /**
     * 更新
     */
    ScenePlayer.prototype.update = function () {
        _super.prototype.update.call(this);
        // if(this.vo.actState == ActState.RUN){
        // 	this.nextPosition();
        // }else if(this.vo.actState == ActState.STAND){
        // 	this.playStand();
        // }else if(this.vo.actState == ActState.DEAD){
        // 	this.playDead();
        // }
    };
    //BUFF 相关
    /**
     * 设置身体
     * @param type 滤镜类型SceneFiltersType
     */
    ScenePlayer.prototype.setModelfilters = function (type) {
        if (type === void 0) { type = 0; }
        //SceneFiltersType
        var filters = SceneFilters[type];
        if (this.bodyMc) {
            this.bodyMc.filters = filters;
        }
        if (this.weaponMc) {
            this.weaponMc.filters = filters;
        }
        if (this.wingMc) {
            this.wingMc.filters = filters;
        }
    };
    //BUFF 相关END
    /**
     * 暂停
     */
    ScenePlayer.prototype.pause = function () {
        _super.prototype.pause.call(this);
    };
    /**
     * 恢复暂停
     */
    ScenePlayer.prototype.resume = function () {
        _super.prototype.resume.call(this);
    };
    /**
     * 销毁
     */
    ScenePlayer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this._zorderDire = 0;
        if (this.wingMc) {
            this.wingMc.destroy();
            this.wingMc.parent.removeChild(this.wingMc);
            this.wingMc = null;
            this.wingUrl = "";
        }
        if (this.weaponMc) {
            this.weaponMc.destroy();
            this.weaponMc.parent.removeChild(this.weaponMc);
            this.weaponMc = null;
            this.weaponUrl = "";
        }
    };
    Object.defineProperty(ScenePlayer.prototype, "vo", {
        /**
         * 获取VO
         */
        get: function () {
            return this._objVo;
        },
        /**
         * 设置VO
         */
        set: function (value) {
            this._objVo = value;
        },
        enumerable: true,
        configurable: true
    });
    return ScenePlayer;
}(SceneMonster));
__reflect(ScenePlayer.prototype, "ScenePlayer");
//# sourceMappingURL=ScenePlayer.js.map