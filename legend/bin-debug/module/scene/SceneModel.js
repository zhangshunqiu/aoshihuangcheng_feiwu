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
 * 游戏场景模型 2017/06/20.
 * 场景战斗流程
 * 1.搜索可以使用的技能
 * 2.根据技能搜索最近的目标，以及目标周围是否还有怪，如果有怪改成群体攻击
 * 3.是否可以攻击，是执行4攻击，否移动到目标再执行1
 * 4.计算攻击范围选择攻击目标，执行攻击
 */
var SceneModel = (function (_super) {
    __extends(SceneModel, _super);
    function SceneModel() {
        var _this = _super.call(this) || this;
        _this.debugMonsterNum = 0;
        _this.sceneStageW = 0; //场景舞台宽
        _this.sceneStageH = 0; //场景舞台高
        _this.curSceneItemNum = 0;
        _this.gridXNum = 0; //x轴格子数量
        _this.gridYNum = 0; //y轴格子数量
        _this._guildUnionDic = {}; //行会联盟，记录联盟的行会ID
        _this._enemyIdDic = {}; //仇人列表，记录仇人的ID字典
        _this._sceneMonsterVoDic = {}; //场景怪VO
        _this._scenePetVoDic = {}; //宠物VO
        _this._scenePartnerVoDic = {}; //伙伴VO
        _this._scenePlayerVoDic = {}; //玩家VO
        _this._scenePlayerCopyVoDic = {}; //玩家镜像VO
        _this._sceneItemVoDic = {}; //物品VO
        _this._sceneCollectVoDic = {}; //采集物 VO
        _this._sceneSkillEffVoDic = {}; //技能效果，像火墙VO
        _this.isUseRocker = false; //是否使用摇杆
        _this.pickItemType = PICK_ITEM_TYPE.get_by_fly; //拾取物品类型
        _this.pickItemHeroId = 0; //拾取物品英雄ID
        _this._gridVoPool = [];
        _this.sceneStageW = App.stageWidth;
        _this.sceneStageH = App.stageHeight - 64 - 96;
        _this._AStar = new aStar.AStar();
        return _this;
    }
    SceneModel.getInstance = function () {
        if (this._instance == null) {
            this._instance = new SceneModel();
        }
        return this._instance;
    };
    /**
     * 拾取物品英雄ID
     */
    SceneModel.prototype.updatePickItemHeroId = function () {
        var heroList = game.HeroModel.getInstance().heroInfo;
        this.pickItemHeroId = 0;
        for (var i = 0; i < heroList.length; i++) {
            var vo = heroList[i];
            var playerVo = this._scenePlayerVoDic[vo.id];
            if (playerVo && playerVo.actState != ActState.DEAD) {
                this.pickItemHeroId = vo.id;
                return;
            }
        }
    };
    /**
     * 获取寻路格子路径列表
     * @param bx
     * @param by
     * @param ex
     * @param ey
     */
    SceneModel.prototype.getAStarGridPath = function (bx, by, ex, ey) {
        var list = aStar.AStar.find(bx, by, ex, ey);
        if (list) {
            var newList = [];
            for (var i = 0; i < list.length - 1; i = i + 2) {
                newList.push([list[i], list[i + 1]]);
            }
            return newList;
        }
        return null;
    };
    /**
     * 获取寻路像素路径列表
     * @param bx
     * @param by
     * @param ex
     * @param ey
     */
    SceneModel.prototype.getAStarPixelPath = function (bx, by, ex, ey) {
        var list = aStar.AStar.find(bx, by, ex, ey);
        if (list) {
            var newList = [];
            for (var i = 0; i < list.length - 1; i = i + 2) {
                newList.push([SceneUtil.gridToPixelX(list[i]), SceneUtil.gridToPixelY(list[i + 1])]);
            }
            return newList;
        }
        return null;
    };
    /**获取随机X轴格子*/
    SceneModel.prototype.getRandomGX = function () {
        return Math.floor(Math.random() * this.gridXNum);
    };
    /**获取随机Y轴格子*/
    SceneModel.prototype.getRandomGY = function () {
        return Math.floor(Math.random() * this.gridYNum);
    };
    /**
     * 场景模型初始化
     */
    SceneModel.prototype.initSceneData = function (data) {
        if (data) {
            this.clear();
            this._sceneConfig = App.ConfigManager.getSceneConfigById(data.sceneId);
            //this.mapX = 0;
            //this.mapY = 0;
            //this.sceneWidth = 0;
            //this.sceneHeight = 0;
            this._sceneId = this._sceneConfig.scene_id;
            this._sceneType = this._sceneConfig.scene_type;
            this.sceneName = this._sceneConfig.name;
            this._mapResId = this._sceneConfig.map_id;
            this._bossSceneId = this._sceneConfig.copy_id;
            //根据配置来获取场景拾取方式
            if (this._sceneConfig.pickup && this._sceneConfig.pickup == 1) {
                this.pickItemType = PICK_ITEM_TYPE.get_by_move;
            }
            else {
                this.pickItemType = PICK_ITEM_TYPE.get_by_fly;
            }
            // this.gridXNum = Math.ceil(this.sceneWidth/SceneModel.GRIDH);
            // this.gridYNum = Math.ceil(this.sceneHeight/SceneModel.GRIDW);
            // this.gridTable = [];
            // for(let i:number = 0;i<this.gridXNum;i++){
            // 	this.gridTable[i] = [];
            // 	// for(let j:number = 0;j<this.gridYNum;j++){
            // 	// 	this.gridTable[i][j] = [];
            // 	// }
            // }
        }
    };
    /**
     * 更新场景对象挂机技能
     */
    SceneModel.prototype.updateObjHookSkill = function (id, type) {
        var vo = this.getSceneObjectVo(id, type);
        if (vo) {
            vo.updateHookSkill(RoleManager.getInstance().getHeroVoById(id));
        }
    };
    /**
     * 更新场景配置信息
     */
    SceneModel.prototype.updateSceneConfig = function (data) {
        this.sceneGridConfig = data;
        this.mapGrid = data.grids;
        this.sceneWidth = this.sceneGridConfig.width - this.sceneGridConfig.width % 64;
        this.sceneHeight = this.sceneGridConfig.height - this.sceneGridConfig.height % 64;
        this.gridXNum = Math.floor(this.sceneWidth / SceneModel.GRIDH);
        this.gridYNum = Math.floor(this.sceneHeight / SceneModel.GRIDW);
        if (this._gridTable == null || this._gridTable.length > 0) {
            this._gridTable = [];
        }
        aStar.AStar.initData(this.mapGrid);
        for (var i = 0; i < this.gridXNum; i++) {
            this._gridTable[i] = [];
            // for(let j:number = 0;j<this.gridYNum;j++){
            // 	this.gridTable[i][j] = [];
            // }
        }
        if (this._itemGridTable == null || this._itemGridTable.length > 0) {
            this._itemGridTable = [];
        }
        for (var i = 0; i < this.gridXNum; i++) {
            this._itemGridTable[i] = [];
        }
    };
    /**
     * 添加场景位置信息
     */
    SceneModel.prototype.addGridTablePos = function (vo) {
        //App.logzsq("ADD "+xx+"_"+yy);
        if (vo.gridX == null || vo.gridY == null || this._gridTable[vo.gridX] == null) {
            return;
        }
        var gVo = this._gridTable[vo.gridX][vo.gridY];
        if (gVo == null) {
            gVo = this.getGridVo();
            this._gridTable[vo.gridX][vo.gridY] = gVo;
        }
        gVo.add(vo);
    };
    /**
     * 移除场景位置信息
     */
    SceneModel.prototype.removeGridTablePos = function (vo) {
        //App.logzsq("REMOVE "+xx+"_"+yy);
        if (this._gridTable[vo.gridX]) {
            var gVo = this._gridTable[vo.gridX][vo.gridY];
            if (gVo) {
                gVo.remove(vo);
                if (gVo.length <= 0) {
                    gVo.clear();
                    this._gridTable[vo.gridX][vo.gridY] = null;
                    this.addGridVo(gVo);
                }
            }
        }
    };
    /**
     * 获取场景位置信息
     */
    SceneModel.prototype.getGridTablePosObj = function (xx, yy) {
        if (xx >= 0 && xx < this.gridXNum && yy >= 0 && yy < this.gridYNum) {
            if (this._gridTable[xx][yy]) {
                return this._gridTable[xx][yy].gridObj;
            }
        }
        return null;
    };
    /**
     * 获取场景位置信息2
     */
    SceneModel.prototype.getGridTablePosObjByVo = function (vo) {
        if (this._gridTable[vo.gridX][vo.gridY]) {
            return this._gridTable[vo.gridX][vo.gridY].gridObj;
        }
        return null;
    };
    /**
     * 获取场景位置信息2
     */
    SceneModel.prototype.getGridTableHasObj = function (xx, yy) {
        if (this._gridTable[xx][yy] && this._gridTable[xx][yy].length > 0) {
            return true;
        }
        return false;
    };
    /**
     * 获取场景位置信息2
     */
    SceneModel.prototype.getGridTableHasTwoObj = function (xx, yy) {
        if (this._gridTable[xx][yy] && this._gridTable[xx][yy].length > 1) {
            return true;
        }
        return false;
    };
    //掉落物品相关
    /**
     * 添加场景位置信息
     */
    SceneModel.prototype.addItemGridTablePos = function (vo) {
        //App.logzsq("ADD "+xx+"_"+yy);
        if (vo.gridX == null || vo.gridY == null || this._itemGridTable[vo.gridX] == null) {
            return;
        }
        this._itemGridTable[vo.gridX][vo.gridY] = true;
    };
    /**
     * 移除场景位置信息
     */
    SceneModel.prototype.removeItemGridTablePos = function (vo) {
        //App.logzsq("REMOVE "+xx+"_"+yy);
        if (this._itemGridTable[vo.gridX]) {
            this._itemGridTable[vo.gridX][vo.gridY] = null;
        }
    };
    /**
     * 获取场景位置信息
     */
    SceneModel.prototype.getItemGridTableHasObj = function (xx, yy) {
        if (this._itemGridTable[xx]) {
            return this._itemGridTable[xx][yy];
        }
        return false;
    };
    //掉落物品相关 END
    /**
     * 清理
     */
    SceneModel.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this._sceneNpcVoDic = new egret.HashObject();
        this._sceneMonsterVoDic = {};
        this._scenePetVoDic = {};
        this._scenePartnerVoDic = {};
        this._scenePlayerVoDic = {};
        this._scenePlayerCopyVoDic = {};
        this._sceneItemVoDic = {};
        this._sceneCollectVoDic = {};
        this._sceneSkillEffVoDic = {};
        this._gridTable = [];
    };
    SceneModel.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.clear();
    };
    // /**
    //  * 获取宠物最近的敌人
    //  * @param objVo 怪物Vo
    //  */
    // public getPetNearlyEnamy(objVo:BaseFightObjVo):BaseFightObjVo{
    // 	var target:BaseFightObjVo;
    // 	var dis:number = 10000;
    // 	var tdis:number;
    // 	for(let key in this._scenePlayerVoDic){
    // 		let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
    // 		if(vo.actState != ActState.DEAD){
    // 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
    // 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
    // 				dis = tdis;
    // 				target = vo;
    // 			}
    // 		}
    // 	}
    // 	for(let key in this._scenePartnerVoDic){
    // 		let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
    // 		if(vo.actState != ActState.DEAD){
    // 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
    // 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
    // 				dis = tdis;
    // 				target = vo;
    // 			}
    // 		}
    // 	}
    // 	for(let key in this._scenePetVoDic){
    // 		let vo:BaseFightObjVo= this._scenePetVoDic[key];
    // 		if(vo.actState != ActState.DEAD && vo.objectId != objVo.objectId){
    // 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
    // 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
    // 				dis = tdis;
    // 				target = vo;
    // 			}
    // 		}
    // 	}
    // 	for(let key in this._sceneMonsterVoDic){
    // 		let vo:BaseFightObjVo= this._sceneMonsterVoDic[key];
    // 		if(vo.actState != ActState.DEAD){
    // 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
    // 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
    // 				dis = tdis;
    // 				target = vo;
    // 			}
    // 		}
    // 	}
    // 	if(target){return target;}
    // 	return null;
    // }
    // /**
    //  * 获取宠物最近的搭档
    //  * @param objVo 怪物Vo
    //  */
    // public getPetNearlyPartner(objVo:BaseFightObjVo):BaseFightObjVo{
    // 	var target:BaseFightObjVo;
    // 	let dis:number = 10000;
    // 	let tdis:number;
    // 	for(let key in this._scenePlayerVoDic){
    // 		let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
    // 		if(vo.actState != ActState.DEAD){
    // 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
    // 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
    // 				dis = tdis;
    // 				target = vo;
    // 			}
    // 		}
    // 	}
    // 	for(let key in this._scenePartnerVoDic){
    // 		let vo:BaseFightObjVo= this._scenePlayerVoDic[key];
    // 		if(vo.actState != ActState.DEAD){
    // 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
    // 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
    // 				dis = tdis;
    // 				target = vo;
    // 			}
    // 		}
    // 	}
    // 	for(let key in this._scenePetVoDic){
    // 		let vo:BaseFightObjVo= this._scenePetVoDic[key];
    // 		if(vo.actState != ActState.DEAD && vo.objectId != objVo.objectId){
    // 			tdis = SceneUtil.getDistance(objVo.posX,objVo.posY,vo.posX,vo.posY);
    // 			if(tdis < dis && tdis < 612){//怪物要判断巡逻距离
    // 				dis = tdis;
    // 				target = vo;
    // 			}
    // 		}
    // 	}
    // 	if(target){return target;}
    // 	return null;
    // }
    /**
     * 根据技能范围更新技能伤害列表   n'n'n'n'n'n'n'n'n'n'n'n'n'n
     * @param atkVo 攻击者
     * @param skillTargetVo 技能目标VO
     */
    SceneModel.prototype.updateHurtTarListByRange = function (atkVo, skillTargetVo) {
        if (skillTargetVo.targetArr == null || skillTargetVo.targetArr.length <= 0) {
            return skillTargetVo;
        }
        var skillVo = skillTargetVo.skillVo;
        if (skillVo.targetType == SkillTargetType.SELF) {
            return skillTargetVo;
        }
        else if (skillVo.atkRangeType == SkillAtkRangeType.R_SINGLE) {
            return skillTargetVo;
        }
        else {
            var rangeList = SceneUtil.getSkillRangeGrids(skillVo.atkRangeId, atkVo.dire.dire8);
            if (rangeList) {
                var atkGridX = atkVo.gridX;
                var atkGridY = atkVo.gridY;
                var nx;
                var ny;
                var rangValue;
                var gridDic;
                var firstTargetid = skillTargetVo.targetArr[0].objectId;
                var vo;
                if (skillVo.targetType == SkillTargetType.ENEMY) {
                    for (var i = 0; i < rangeList.length; i++) {
                        rangValue = rangeList[i];
                        nx = atkGridX + rangValue[0];
                        ny = atkGridY + rangValue[1];
                        gridDic = this.getGridTablePosObj(nx, ny);
                        if (gridDic) {
                            for (var k in gridDic) {
                                vo = gridDic[k];
                                if (vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid && this.isSelectTarget(skillVo.targetType, atkVo, vo)) {
                                    //if(skillVo.targetType == SkillTargetType.ENEMY && (vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER) && vo.actState != ActState.DEAD &&  vo.objectId != firstTargetid){
                                    skillTargetVo.targetArr.push(vo);
                                    if (skillTargetVo.targetArr.length > 8) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (skillVo.targetType == SkillTargetType.PARTNER) {
                    for (var i = 0; i < rangeList.length; i++) {
                        rangValue = rangeList[i];
                        nx = atkGridX + rangValue[0];
                        ny = atkGridY + rangValue[1];
                        gridDic = this.getGridTablePosObj(nx, ny);
                        if (gridDic) {
                            for (var k in gridDic) {
                                vo = gridDic[k];
                                if (vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid && this.isSelectTarget(skillVo.targetType, atkVo, vo)) {
                                    //if(skillVo.targetType == SkillTargetType.PARTNER && vo.type == SceneObjectType.MONSTER && vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid){
                                    skillTargetVo.targetArr.push(vo);
                                    if (skillTargetVo.targetArr.length > 8) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return skillTargetVo;
    };
    /**
     * 是否是选中的目标
     * @param targetType 攻击类型
     * @param atkVo 攻击者VO
     * @param targetVo 目标VO
     */
    SceneModel.prototype.isSelectTarget = function (targetType, atkVo, targetVo) {
        if (targetType == SkillTargetType.ENEMY) {
            if (atkVo.type == SceneObjectType.MONSTER) {
                if (targetVo.type != SceneObjectType.MONSTER) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (targetVo.type == SceneObjectType.MONSTER) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else if (targetType == SkillTargetType.PARTNER) {
            if (atkVo.type == SceneObjectType.MONSTER) {
                if (targetVo.type == SceneObjectType.MONSTER) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (targetVo.type != SceneObjectType.MONSTER) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else if (targetType == SkillTargetType.SELF) {
            if (atkVo.objectId == targetVo.objectId) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (targetType == SkillTargetType.EMPTY) {
        }
        return false;
    };
    /**
     * 搜索最近的敌人  nnnnnnnnnn
     */
    SceneModel.prototype.searchNearlyEnamy = function (objVo) {
        var target;
        if (objVo.type == SceneObjectType.MONSTER) {
            var dis = 10000;
            var tdis = void 0;
            for (var key in this._scenePlayerVoDic) {
                var vo = this._scenePlayerVoDic[key];
                if (vo.actState != ActState.DEAD) {
                    tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                    if (tdis < dis && tdis < 612) {
                        dis = tdis;
                        target = vo;
                    }
                }
            }
            for (var key in this._scenePartnerVoDic) {
                var vo = this._scenePlayerVoDic[key];
                if (vo.actState != ActState.DEAD) {
                    tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                    if (tdis < dis && tdis < 612) {
                        dis = tdis;
                        target = vo;
                    }
                }
            }
            for (var key in this._scenePetVoDic) {
                var vo = this._scenePetVoDic[key];
                if (vo.actState != ActState.DEAD) {
                    tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                    if (tdis < dis && tdis < 612) {
                        dis = tdis;
                        target = vo;
                    }
                }
            }
        }
        else if (objVo.type == SceneObjectType.PLAYER || objVo.type == SceneObjectType.PLAYERCOPY || objVo.type == SceneObjectType.PARTNER || objVo.type == SceneObjectType.PET) {
            var dis = 10000;
            var tdis = void 0;
            for (var key in this._sceneMonsterVoDic) {
                var vo = this._sceneMonsterVoDic[key];
                if (vo.actState != ActState.DEAD) {
                    tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                    if (tdis < dis && tdis < 1024) {
                        dis = tdis;
                        target = vo;
                    }
                }
            }
        }
        if (target) {
            return target;
        }
        return null;
    };
    /**
     * 搜索最近的搭档   nnnnnnnnnnnnnnnnn
     */
    SceneModel.prototype.searchNearlyPartner = function (objVo) {
        var target;
        if (objVo.type == SceneObjectType.PLAYER || objVo.type == SceneObjectType.PLAYERCOPY || objVo.type == SceneObjectType.PARTNER || objVo.type == SceneObjectType.PET) {
            var dis = 10000;
            var tdis = void 0;
            for (var key in this._scenePlayerVoDic) {
                var vo = this._scenePlayerVoDic[key];
                if (vo.actState != ActState.DEAD && vo.objectId != objVo.objectId) {
                    tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                    if (tdis < dis && tdis < 1024) {
                        dis = tdis;
                        target = vo;
                    }
                }
            }
            for (var key in this._scenePartnerVoDic) {
                var vo = this._scenePlayerVoDic[key];
                if (vo.actState != ActState.DEAD && vo.objectId != objVo.objectId) {
                    tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                    if (tdis < dis && tdis < 1024) {
                        dis = tdis;
                        target = vo;
                    }
                }
            }
            for (var key in this._scenePetVoDic) {
                var vo = this._scenePetVoDic[key];
                if (vo.actState != ActState.DEAD && vo.objectId != objVo.objectId) {
                    tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                    if (tdis < dis && tdis < 1024) {
                        dis = tdis;
                        target = vo;
                    }
                }
            }
        }
        else if (objVo.type == SceneObjectType.MONSTER) {
            var dis = 10000;
            var tdis = void 0;
            for (var key in this._sceneMonsterVoDic) {
                var vo = this._sceneMonsterVoDic[key];
                if (vo.actState != ActState.DEAD && vo.objectId != objVo.objectId) {
                    tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                    if (tdis < dis && tdis < 1024) {
                        dis = tdis;
                        target = vo;
                    }
                }
            }
        }
        if (target) {
            return target;
        }
        return null;
    };
    //------------------------怪物技能目标相关---------
    /**
     * 更新怪物技能伤害范围内目标
     * @param atkVo 攻击者
     * @param skillTargetVo 技能目标VO
     */
    SceneModel.prototype.updateMonsterHurtListByRange = function (atkVo, skillTargetVo) {
        if (skillTargetVo.targetArr == null || skillTargetVo.targetArr.length <= 0) {
            return skillTargetVo;
        }
        var skillVo = skillTargetVo.skillVo;
        //if(skillVo.targetType == SkillTargetType.SELF || skillVo.targetType == SkillTargetType.ENEMY){//自己或空放  自己的如果是群体也要使用群体功能
        if (skillVo.targetType == SkillTargetType.EMPTY) {
            return skillTargetVo;
        }
        else if (skillVo.atkRangeType == SkillAtkRangeType.R_SINGLE) {
            return skillTargetVo;
        }
        else {
            var rangeList = SceneUtil.getSkillRangeGrids(skillVo.atkRangeId, atkVo.dire.dire8);
            if (rangeList) {
                var atkGridX;
                var atkGridY;
                var nx;
                var ny;
                var rangValue;
                var gridDic;
                var tarVo = skillTargetVo.targetArr[0];
                if (skillVo.atkRangeType == SkillAtkRangeType.R_N_GROUP) {
                    atkGridX = atkVo.gridX;
                    atkGridY = atkVo.gridY;
                }
                else {
                    atkGridX = tarVo.gridX;
                    atkGridY = tarVo.gridY;
                }
                var firstTargetid = tarVo.objectId;
                var vo;
                if (skillVo.targetType == SkillTargetType.ENEMY) {
                    for (var i = 0; i < rangeList.length; i++) {
                        rangValue = rangeList[i];
                        nx = atkGridX + rangValue[0];
                        ny = atkGridY + rangValue[1];
                        gridDic = this.getGridTablePosObj(nx, ny);
                        if (gridDic) {
                            for (var k in gridDic) {
                                vo = gridDic[k];
                                //怪物的敌人是所有玩家，伙伴，宠物 //(vo.objectId != atkVo.objectId && 不需要，不是同一场景类型)
                                if ((vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER || vo.type == SceneObjectType.PLAYERCOPY) && vo.actState != ActState.DEAD && vo.objectId != firstTargetid) {
                                    skillTargetVo.targetArr.push(vo);
                                    if (skillTargetVo.targetArr.length > 8) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (skillVo.targetType == SkillTargetType.PARTNER || skillVo.targetType == SkillTargetType.SELF) {
                    for (var i = 0; i < rangeList.length; i++) {
                        rangValue = rangeList[i];
                        nx = atkGridX + rangValue[0];
                        ny = atkGridY + rangValue[1];
                        gridDic = this.getGridTablePosObj(nx, ny);
                        if (gridDic) {
                            for (var k in gridDic) {
                                vo = gridDic[k];
                                //if( vo.type == SceneObjectType.MONSTER && vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid){
                                if (vo.type == SceneObjectType.MONSTER && vo.actState != ActState.DEAD && vo.objectId != firstTargetid) {
                                    skillTargetVo.targetArr.push(vo);
                                    if (skillTargetVo.targetArr.length > 8) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return skillTargetVo;
    };
    /**
     * 获取怪物最近的敌人
     * @param objVo 怪物Vo
     */
    SceneModel.prototype.getMonsterNearlyEnamy = function (objVo) {
        var target;
        var dis = 10000;
        var tdis;
        for (var key in this._scenePlayerVoDic) {
            var vo = this._scenePlayerVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE)) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < 612) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        for (var key in this._scenePartnerVoDic) {
            var vo = this._scenePlayerVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE)) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < 612) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        for (var key in this._scenePetVoDic) {
            var vo = this._scenePetVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE)) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < 612) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        if (target) {
            return target;
        }
        return null;
    };
    /**
     * 获取怪物最近的搭档
     * @param objVo 怪物Vo
     */
    SceneModel.prototype.getMonsterNearlyPartner = function (objVo) {
        var target;
        var dis = 10000;
        var tdis;
        for (var key in this._sceneMonsterVoDic) {
            var vo = this._sceneMonsterVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && vo.objectId != objVo.objectId) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < 1024) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        if (target) {
            return target;
        }
        return null;
    };
    //------------------------怪物技能目标相关---------END------
    /**RPG用
     * 更新玩家技能伤害范围内目标
     * @param atkVo 攻击者
     * @param skillTargetVo 技能目标VO
     */
    SceneModel.prototype.updatePlayerHurtListByRange = function (atkVo, skillTargetVo) {
        if (skillTargetVo.targetArr == null || skillTargetVo.targetArr.length <= 0) {
            return skillTargetVo;
        }
        var skillVo = skillTargetVo.skillVo;
        //if(skillVo.targetType == SkillTargetType.SELF || skillVo.targetType == SkillTargetType.ENEMY){//自己或空放  自己的如果是群体也要使用群体功能
        if (skillVo.targetType == SkillTargetType.EMPTY) {
            return skillTargetVo;
        }
        else if (skillVo.atkRangeType == SkillAtkRangeType.R_SINGLE) {
            if (atkVo.type == SceneObjectType.PLAYER) {
                var pp = atkVo;
                if (pp.id == RoleManager.getInstance().getMainHeroId()) {
                    var tar = skillTargetVo.targetArr[0];
                    App.EventSystem.dispatchEvent(SceneEventType.SHOW_SKILL_RANG_GRIDS, [[tar.gridX, tar.gridY]]);
                }
            }
            return skillTargetVo;
        }
        else {
            var tarVo = skillTargetVo.targetArr[0];
            var dire8 = SceneUtil.getDirectByPoint(tarVo.posX, tarVo.posY, atkVo.posX, atkVo.posY).dire8;
            var rangeList = SceneUtil.getSkillRangeGrids(skillVo.atkRangeId, dire8);
            if (rangeList) {
                var testRang = [];
                var atkGridX;
                var atkGridY;
                var nx;
                var ny;
                var rangValue;
                var gridDic;
                if (skillVo.atkRangeType == SkillAtkRangeType.R_N_GROUP) {
                    atkGridX = atkVo.gridX;
                    atkGridY = atkVo.gridY;
                }
                else {
                    atkGridX = tarVo.gridX;
                    atkGridY = tarVo.gridY;
                }
                var firstTargetid = tarVo.objectId;
                var vo;
                if (skillVo.targetType == SkillTargetType.ENEMY) {
                    for (var i = 0; i < rangeList.length; i++) {
                        rangValue = rangeList[i];
                        nx = atkGridX + rangValue[0];
                        ny = atkGridY + rangValue[1];
                        gridDic = this.getGridTablePosObj(nx, ny);
                        testRang.push([nx, ny]);
                        if (gridDic) {
                            for (var k in gridDic) {
                                vo = gridDic[k];
                                if (vo.objectId != atkVo.objectId && vo.actState != ActState.DEAD && vo.objectId != firstTargetid && atkVo.mainOwnerId != vo.mainOwnerId) {
                                    //玩家的敌人是所有玩家，伙伴，宠物 //(vo.objectId != atkVo.objectId && 不需要，不是同一场景类型)
                                    if (vo.type == SceneObjectType.MONSTER) {
                                        skillTargetVo.targetArr.push(vo);
                                    }
                                    else if ((vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER || vo.type == SceneObjectType.PLAYERCOPY) && this.isPkTarget(atkVo, vo, SkillTargetType.ENEMY)) {
                                        skillTargetVo.targetArr.push(vo);
                                    }
                                    if (skillTargetVo.targetArr.length > 8) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (skillVo.targetType == SkillTargetType.PARTNER) {
                    for (var i = 0; i < rangeList.length; i++) {
                        rangValue = rangeList[i];
                        nx = atkGridX + rangValue[0];
                        ny = atkGridY + rangValue[1];
                        gridDic = this.getGridTablePosObj(nx, ny);
                        testRang.push([nx, ny]);
                        if (gridDic) {
                            for (var k in gridDic) {
                                vo = gridDic[k];
                                //if((vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER) && vo.actState != ActState.DEAD && vo.objectId != atkVo.objectId && vo.objectId != firstTargetid && this.isPkTarget(atkVo,vo,SkillTargetType.PARTNER)){
                                if ((vo.type == SceneObjectType.PARTNER || vo.type == SceneObjectType.PET || vo.type == SceneObjectType.PLAYER || vo.type == SceneObjectType.PLAYERCOPY) && vo.actState != ActState.DEAD && vo.objectId != firstTargetid && this.isPkTarget(atkVo, vo, SkillTargetType.PARTNER)) {
                                    skillTargetVo.targetArr.push(vo);
                                    if (skillTargetVo.targetArr.length > 8) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (atkVo.type == SceneObjectType.PLAYER) {
                    var pp = atkVo;
                    if (pp.id == RoleManager.getInstance().getMainHeroId()) {
                        App.EventSystem.dispatchEvent(SceneEventType.SHOW_SKILL_RANG_GRIDS, testRang);
                    }
                }
            }
        }
        return skillTargetVo;
    };
    /**
     * RPG用
     * 是否是该对象Pk目标
     * @param targetType 攻击目标类型 搭档和敌方
     */
    SceneModel.prototype.isPkTarget = function (atkVo, targetVo, targetType) {
        if (targetType == SkillTargetType.ENEMY) {
            if (atkVo.type == SceneObjectType.MONSTER) {
                //怪物敌人
                if (targetVo.type != SceneObjectType.MONSTER) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                //玩家，伙伴，宠物的 敌人
                if (targetVo.type == SceneObjectType.MONSTER) {
                    return true; //怪绝对是 玩家，伙伴，宠物的敌人
                }
                else {
                    //玩家伙伴宠物通过pk模式来判断是否是攻击对象
                    return this.curPkModeIsTarget(atkVo, targetVo, true);
                }
            }
        }
        else if (targetType == SkillTargetType.PARTNER) {
            if (atkVo.type == SceneObjectType.MONSTER) {
                //怪物队友
                if (targetVo.type == SceneObjectType.MONSTER) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                //玩家，伙伴，宠物的 搭档
                if (targetVo.type == SceneObjectType.MONSTER) {
                    return false; //玩家，伙伴，宠物的队友不会是怪
                }
                else {
                    //玩家伙伴宠物通过pk模式来判断是否是攻击对象
                    return (this.curPkModeIsTarget(atkVo, targetVo, false) == false);
                }
            }
        }
        return false;
    };
    /**RPG用
     * 获取玩家最近的敌人
     */
    SceneModel.prototype.getPlayerNearlyEnamy = function (objVo) {
        var target;
        var dis = 10000;
        var maxDis = 2560;
        var tdis;
        if (objVo.type == SceneObjectType.PLAYER) {
            maxDis = 100000;
        }
        for (var key in this._sceneMonsterVoDic) {
            var vo = this._sceneMonsterVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < maxDis) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        if (objVo.pkMode == PKModeType.PEACE) {
            //如果是和平模式
            return target;
        }
        maxDis = 2560;
        for (var key in this._scenePlayerVoDic) {
            var vo = this._scenePlayerVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && objVo.mainOwnerId != vo.mainOwnerId && this.curPkModeIsTarget(objVo, vo, true)) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < maxDis) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        for (var key in this._scenePartnerVoDic) {
            var vo = this._scenePlayerVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && objVo.mainOwnerId != vo.mainOwnerId && this.curPkModeIsTarget(objVo, vo, true)) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < maxDis) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        for (var key in this._scenePetVoDic) {
            var vo = this._scenePetVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && objVo.mainOwnerId != vo.mainOwnerId && this.curPkModeIsTarget(objVo, vo, true)) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < maxDis) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        for (var key in this._scenePlayerCopyVoDic) {
            var vo = this._scenePlayerCopyVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && objVo.mainOwnerId != vo.mainOwnerId && this.curPkModeIsTarget(objVo, vo, true)) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < maxDis) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        return target;
    };
    /**RPG用
     * 获取玩家最近的搭档
     */
    SceneModel.prototype.getPlayerNearlyPartner = function (objVo) {
        var target;
        var dis = 10000;
        var maxDis = 2560;
        var tdis;
        for (var key in this._scenePlayerVoDic) {
            var vo = this._scenePlayerVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && this.curPkModeIsTarget(objVo, vo, false) == false) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < maxDis) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        for (var key in this._scenePartnerVoDic) {
            var vo = this._scenePlayerVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && this.curPkModeIsTarget(objVo, vo, false) == false) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < maxDis) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        for (var key in this._scenePetVoDic) {
            var vo = this._scenePetVoDic[key];
            if (vo.actState != ActState.DEAD && !vo.hasBuffEffType(BuffEffType.INVISIBLE) && objVo.objectId != vo.objectId && this.curPkModeIsTarget(objVo, vo, false) == false) {
                tdis = SceneUtil.getDistance(objVo.posX, objVo.posY, vo.posX, vo.posY);
                if (tdis < dis && tdis < maxDis) {
                    dis = tdis;
                    target = vo;
                }
            }
        }
        if (target) {
            return target;
        }
        return null;
    };
    /**
     * RPG用
     * 当前pk模式下玩家，伙伴和宠物之间是否是攻击目标，能攻击是敌人，不能攻击是伙伴
     */
    SceneModel.prototype.curPkModeIsTarget = function (atkVo, tarVo, isEnemy) {
        if (atkVo.pkMode == PKModeType.PEACE) {
            return false;
        }
        else if (atkVo.pkMode == PKModeType.GOODEVIL) {
            return tarVo.nameColor > 2;
        }
        else if (atkVo.pkMode == PKModeType.ALL) {
            if (isEnemy) {
                return true;
            }
            else {
                if (atkVo.mainOwnerId == tarVo.mainOwnerId) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else if (atkVo.pkMode == PKModeType.TEAM) {
            if (atkVo.teamId == 0) {
                return true;
            }
            return atkVo.teamId != tarVo.teamId;
        }
        else if (atkVo.pkMode == PKModeType.GUILD) {
            if (atkVo.guildId == 0) {
                return true;
            }
            return atkVo.guildId != tarVo.guildId;
        }
        else if (atkVo.pkMode == PKModeType.UNION) {
            if (atkVo.guildId == 0) {
                return true;
            }
            //这个需要注意一下，挂机不能用
            return (atkVo.guildId != tarVo.guildId && this.isGuildUnion(tarVo.guildId));
        }
        else if (atkVo.pkMode == PKModeType.ENEMY) {
            if (this.isInEnemyList(tarVo.id) || this.isInEnemyList(tarVo.ownerId)) {
                return true;
            }
            return false;
        }
        return false;
    };
    /**
     * 获取自身玩家Vo
     */
    SceneModel.prototype.getSelfPlayerVo = function () {
        return this._scenePlayerVoDic[RoleManager.getInstance().getMainHeroId()];
    };
    /**
     * 获取当前格子值
     */
    SceneModel.prototype.curGridValue = function (gx, gy) {
        return this.mapGrid[gy][gx];
    };
    /**
     * 获取当前格可移动
     */
    SceneModel.prototype.curGridIsOpen = function (gx, gy) {
        if (gx >= 0 && gx < this.gridXNum && gy >= 0 && gy < this.gridYNum) {
            return true;
            //return (this.mapGrid[gy][gx] != 1) ;
        }
        return false;
    };
    /**
     * 获取当前格半透明
     */
    SceneModel.prototype.curGridAlpha = function (gx, gy) {
        return (this.mapGrid[gy] && this.mapGrid[gy][gx] > 0);
    };
    Object.defineProperty(SceneModel.prototype, "sceneNpcVoDic", {
        get: function () {
            return this._sceneNpcVoDic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "sceneMonsterVoDic", {
        get: function () {
            return this._sceneMonsterVoDic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "scenePetVoDic", {
        get: function () {
            return this._scenePetVoDic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "scenePartnerVoDic", {
        get: function () {
            return this._scenePartnerVoDic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "scenePlayerVoDic", {
        get: function () {
            return this._scenePlayerVoDic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "scenePlayerCopyVoDic", {
        get: function () {
            return this._scenePlayerCopyVoDic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "sceneItemVoDic", {
        get: function () {
            return this._sceneItemVoDic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "sceneCollectVoDic", {
        get: function () {
            return this._sceneCollectVoDic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "sceneSkillEffVoDic", {
        get: function () {
            return this._sceneSkillEffVoDic;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取场景对象Vo
     * @param objId 场景对象Id
     * @param objType 场景对象类型
     */
    SceneModel.prototype.getSceneObjectVo = function (objId, objType) {
        if (objType == SceneObjectType.NPC) {
            return this._sceneNpcVoDic[objId];
        }
        else if (objType == SceneObjectType.MONSTER) {
            return this._sceneMonsterVoDic[objId];
        }
        else if (objType == SceneObjectType.PET) {
            return this._scenePetVoDic[objId];
        }
        else if (objType == SceneObjectType.PLAYER) {
            return this._scenePlayerVoDic[objId];
        }
        else if (objType == SceneObjectType.PLAYERCOPY) {
            return this._scenePlayerCopyVoDic[objId];
        }
        else if (objType == SceneObjectType.PARTNER) {
            return this._scenePartnerVoDic[objId];
        }
        else if (objType == SceneObjectType.ITEM) {
            return this._sceneItemVoDic[objId];
        }
        else if (objType == SceneObjectType.SKILLEFF) {
            return this._sceneSkillEffVoDic[objId];
        }
        else if (objType == SceneObjectType.COLLECT) {
            return this._sceneCollectVoDic[objId];
        }
        return null;
    };
    /**
     * 获取玩家VO
     * objId 对象ID
     */
    SceneModel.prototype.getPlayerVo = function (objId) {
        return this._scenePlayerVoDic[objId];
    };
    /**
     * 获取怪物VO
     * objId 对象ID
     */
    SceneModel.prototype.getMonsterVo = function (objId) {
        return this._sceneMonsterVoDic[objId];
    };
    /**
     * 添加场景对象Vo
     * @param event 场景对象VO
     */
    SceneModel.prototype.addSceneObjectVo = function (event) {
        var vo = event;
        if (vo.type == SceneObjectType.NPC) {
            this._sceneNpcVoDic[vo.id] = vo;
        }
        else if (vo.type == SceneObjectType.MONSTER) {
            this._sceneMonsterVoDic[vo.id] = vo;
        }
        else if (vo.type == SceneObjectType.PET) {
            if (this._scenePetVoDic[vo.id] == null) {
                //宠物ID添加到玩家上
                var ownerId = vo.ownerId;
                if (ownerId && ownerId > 0) {
                    var ownerVo = this._scenePlayerVoDic[ownerId];
                    if (ownerVo) {
                        ownerVo.addPetID(vo.id);
                    }
                }
            }
            this._scenePetVoDic[vo.id] = vo;
        }
        else if (vo.type == SceneObjectType.PLAYER) {
            this._scenePlayerVoDic[vo.id] = vo;
        }
        else if (vo.type == SceneObjectType.PLAYERCOPY) {
            this._scenePlayerCopyVoDic[vo.id] = vo;
        }
        else if (vo.type == SceneObjectType.PARTNER) {
            this._scenePartnerVoDic[vo.id] = vo;
        }
        else if (vo.type == SceneObjectType.ITEM) {
            this._sceneItemVoDic[vo.id] = vo;
        }
        else if (vo.type == SceneObjectType.SKILLEFF) {
            this._sceneSkillEffVoDic[vo.id] = vo;
        }
        else if (vo.type == SceneObjectType.COLLECT) {
            this._sceneCollectVoDic[vo.id] = vo;
        }
    };
    /**
     * 移除场景对象Vo
     * @param event 场景对象VO
     */
    SceneModel.prototype.removeSceneObjectVo = function (event) {
        var vo = event;
        if (vo.type == SceneObjectType.NPC) {
            this.removeGridTablePos(vo);
            this._sceneNpcVoDic[vo.id] = null;
            delete this._sceneNpcVoDic[vo.id];
        }
        else if (vo.type == SceneObjectType.MONSTER) {
            this.removeGridTablePos(vo);
            this._sceneMonsterVoDic[vo.id] = null;
            delete this._sceneMonsterVoDic[vo.id];
        }
        else if (vo.type == SceneObjectType.PET) {
            this.removeGridTablePos(vo);
            if (this._scenePetVoDic[vo.id]) {
                //删除宠物ID在玩家上
                var ownerId = vo.ownerId;
                if (ownerId && ownerId > 0) {
                    var ownerVo = this._scenePlayerVoDic[ownerId];
                    if (ownerVo) {
                        ownerVo.removePetID(vo.id);
                    }
                }
            }
            this._scenePetVoDic[vo.id] = null;
            delete this._scenePetVoDic[vo.id];
        }
        else if (vo.type == SceneObjectType.PLAYER) {
            this.removeGridTablePos(vo);
            this._scenePlayerVoDic[vo.id] = null;
            delete this._scenePlayerVoDic[vo.id];
        }
        else if (vo.type == SceneObjectType.PLAYERCOPY) {
            this.removeGridTablePos(vo);
            this._scenePlayerCopyVoDic[vo.id] = null;
            delete this._scenePlayerCopyVoDic[vo.id];
        }
        else if (vo.type == SceneObjectType.PARTNER) {
            this.removeGridTablePos(vo);
            this._scenePartnerVoDic[vo.id] = null;
            delete this._scenePartnerVoDic[vo.id];
        }
        else if (vo.type == SceneObjectType.ITEM) {
            this.removeItemGridTablePos(vo);
            this._sceneItemVoDic[vo.id] = null;
            delete this._sceneItemVoDic[vo.id];
        }
        else if (vo.type == SceneObjectType.SKILLEFF) {
            this._sceneSkillEffVoDic[vo.id] = null;
            delete this._sceneSkillEffVoDic[vo.id];
        }
        else if (vo.type == SceneObjectType.COLLECT) {
            this.removeGridTablePos(vo);
            this._sceneCollectVoDic[vo.id] = null;
            delete this._sceneCollectVoDic[vo.id];
        }
    };
    /**
     * 移除场景对象Vo
     * @param objId 场景对象Id
     * @param objType 场景对象类型
     */
    SceneModel.prototype.removeSceneObjectVoById = function (objId, objType) {
        if (objType == SceneObjectType.NPC) {
            var vo = this._sceneNpcVoDic[objId];
            this.removeGridTablePos(vo);
            this._sceneNpcVoDic[vo.id] = null;
            delete this._sceneNpcVoDic[vo.id];
        }
        else if (objType == SceneObjectType.MONSTER) {
            var vo = this._sceneMonsterVoDic[objId];
            this.removeGridTablePos(vo);
            this._sceneMonsterVoDic[vo.id] = null;
            delete this._sceneMonsterVoDic[vo.id];
        }
        else if (objType == SceneObjectType.PET) {
            var vo = this._scenePetVoDic[objId];
            this.removeGridTablePos(vo);
            this._scenePetVoDic[vo.id] = null;
            delete this._scenePetVoDic[vo.id];
        }
        else if (objType == SceneObjectType.PLAYER) {
            var vo = this._scenePlayerVoDic[objId];
            this.removeGridTablePos(vo);
            this._scenePlayerVoDic[vo.id] = null;
            delete this._scenePlayerVoDic[vo.id];
        }
        else if (objType == SceneObjectType.PLAYERCOPY) {
            var vo = this._scenePlayerCopyVoDic[objId];
            this.removeGridTablePos(vo);
            this._scenePlayerCopyVoDic[vo.id] = null;
            delete this._scenePlayerCopyVoDic[vo.id];
        }
        else if (objType == SceneObjectType.PARTNER) {
            var vo = this._scenePartnerVoDic[objId];
            this.removeGridTablePos(vo);
            this._scenePartnerVoDic[vo.id] = null;
            delete this._scenePartnerVoDic[vo.id];
        }
        else if (objType == SceneObjectType.ITEM) {
            var vo = this._sceneItemVoDic[objId];
            this._sceneItemVoDic[vo.id] = null;
            delete this._sceneItemVoDic[vo.id];
        }
        else if (objType == SceneObjectType.SKILLEFF) {
            var vo = this._sceneSkillEffVoDic[objId];
            this._sceneSkillEffVoDic[vo.id] = null;
            delete this._sceneSkillEffVoDic[vo.id];
        }
        else if (objType == SceneObjectType.COLLECT) {
            var vo = this._sceneCollectVoDic[objId];
            this.removeGridTablePos(vo);
            this._sceneCollectVoDic[vo.id] = null;
            delete this._sceneCollectVoDic[vo.id];
        }
    };
    /**
     * 获取该类型场景对象数量
     * @param objType 对象类型
     */
    SceneModel.prototype.getSceneObjectNumber = function (objType) {
        var objDic;
        if (objType == SceneObjectType.NPC) {
            objDic = this._sceneNpcVoDic;
        }
        else if (objType == SceneObjectType.MONSTER) {
            objDic = this._sceneMonsterVoDic;
        }
        else if (objType == SceneObjectType.PET) {
            objDic = this._scenePetVoDic;
        }
        else if (objType == SceneObjectType.PLAYER) {
            objDic = this._scenePlayerVoDic;
        }
        else if (objType == SceneObjectType.PLAYERCOPY) {
            objDic = this._scenePlayerCopyVoDic;
        }
        else if (objType == SceneObjectType.PARTNER) {
            objDic = this._scenePartnerVoDic;
        }
        else if (objType == SceneObjectType.ITEM) {
            objDic = this._sceneItemVoDic;
        }
        else if (objType == SceneObjectType.SKILLEFF) {
            objDic = this._sceneSkillEffVoDic;
        }
        else if (objType == SceneObjectType.COLLECT) {
            objDic = this._sceneCollectVoDic;
        }
        var num = 0;
        if (objDic) {
            for (var key in objDic) {
                num++;
            }
        }
        return num;
    };
    /**格子Vo */
    SceneModel.prototype.getGridVo = function () {
        if (this._gridVoPool.length > 0) {
            return this._gridVoPool.pop();
        }
        var vo = new SceneGridVo();
        return vo;
    };
    /**格子Vo */
    SceneModel.prototype.addGridVo = function (vo) {
        this._gridVoPool.push(vo);
    };
    Object.defineProperty(SceneModel.prototype, "bossSceneId", {
        /**
         * 场景副本BossID
         */
        get: function () {
            return this._bossSceneId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "mapResId", {
        /**
         * 地图资源ID
         */
        get: function () {
            return this._mapResId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "sceneId", {
        /**
         * 场景Id
         */
        get: function () {
            return this._sceneId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "sceneType", {
        /**
         * 场景类型
         */
        get: function () {
            return this._sceneType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneModel.prototype, "guildUnionDic", {
        /**
         * 帮会联盟字典
         */
        set: function (value) {
            this._guildUnionDic = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 是否帮会联盟
     */
    SceneModel.prototype.isGuildUnion = function (guildId) {
        if (this._guildUnionDic[guildId]) {
            return true;
        }
        return false;
    };
    Object.defineProperty(SceneModel.prototype, "enemyIdDic", {
        /**
         * 仇人列表字典
         */
        set: function (value) {
            this._enemyIdDic = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 是否帮会联盟
     */
    SceneModel.prototype.isInEnemyList = function (id) {
        if (this._enemyIdDic[id]) {
            return true;
        }
        return false;
    };
    SceneModel.GRIDW = 64; //场景格子宽
    SceneModel.GRIDH = 64; //场景格子高
    return SceneModel;
}(BaseModel));
__reflect(SceneModel.prototype, "SceneModel");
var SceneGridVo = (function () {
    function SceneGridVo() {
        this.length = 0;
        this._dic = {};
    }
    SceneGridVo.prototype.add = function (vo) {
        if (this._dic[vo.objectId] == null) {
            this._dic[vo.objectId] = vo;
            this.length = this.length + 1;
        }
    };
    SceneGridVo.prototype.remove = function (vo) {
        if (this._dic[vo.objectId]) {
            this._dic[vo.objectId] = null;
            delete this._dic[vo.objectId];
            this.length = this.length - 1;
        }
    };
    SceneGridVo.prototype.removeById = function (objectId) {
        if (this._dic[objectId]) {
            this._dic[objectId] = null;
            delete this._dic[objectId];
            this.length = this.length - 1;
        }
    };
    Object.defineProperty(SceneGridVo.prototype, "gridObj", {
        get: function () {
            return this._dic;
        },
        enumerable: true,
        configurable: true
    });
    /**清理*/
    SceneGridVo.prototype.clear = function () {
        this.length = 0;
        this._dic = {};
    };
    return SceneGridVo;
}());
__reflect(SceneGridVo.prototype, "SceneGridVo");
//# sourceMappingURL=SceneModel.js.map