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
 * 基础战斗对象VO
 */
var BaseFightObjVo = (function (_super) {
    __extends(BaseFightObjVo, _super);
    function BaseFightObjVo() {
        var _this = _super.call(this) || this;
        _this.moveSpeed = 4;
        _this.actState = ActState.STAND; //动作状态
        _this.dire = new DireScale(5, 1, 5);
        _this.hookSkill = []; //挂机技能列表；
        _this.hookSkillVOList = []; //挂机技能VO列表；
        _this.hookSkillIndex = 0; //挂机技能索引；
        _this.defaultSkillId = 10000;
        _this.isInvisible = false; //是否隐形
        _this.pkMode = PKModeType.PEACE; //pk模式
        _this.teamId = 0; //队伍ID
        _this.guildId = 0; //帮派id
        _this.ownerType = 3; // 对象主人类型
        _this.ownerId = 3; // 对象主人id，英雄的主人ID是主英雄，宠物的主人ID是当前英雄
        _this.mainOwnerId = 0; //对应的主英雄ID，英雄和宠物都适用
        _this.buffDic = {}; //buffVO字典
        _this.isUseSkill = true; //是否使用技能
        _this.isUseSkill = (SceneUtil.isMainScene(SceneModel.getInstance().sceneId) == false);
        return _this;
    }
    /**
     * 更新挂机技能(子类用)
     */
    BaseFightObjVo.prototype.updateHookSkill = function (hVo) {
        if (hVo === void 0) { hVo = null; }
    };
    /**
     * 获取使用技能VO
     */
    BaseFightObjVo.prototype.getUseFSkillVo = function () {
        var vo;
        if (this.hookSkillVOList.length == 1) {
            vo = this.hookSkillVOList[0];
            if (vo.useEnable(this.mp) && this.checkSkillCanUse(vo)) {
                vo.setUseTime();
                return vo;
            }
        }
        else if (this.hookSkillVOList.length > 1) {
            for (var i = this.hookSkillIndex; i < this.hookSkillVOList.length; i++) {
                vo = this.hookSkillVOList[i];
                if (vo.useEnable(this.mp) && this.checkSkillCanUse(vo)) {
                    vo.setUseTime();
                    this.setNextHookSkillIndex();
                    return vo;
                }
            }
            for (var k = 0; k < this.hookSkillIndex; k++) {
                vo = this.hookSkillVOList[k];
                if (vo.useEnable(this.mp) && this.checkSkillCanUse(vo)) {
                    vo.setUseTime();
                    this.setNextHookSkillIndex();
                    return vo;
                }
            }
        }
        this.defaultSkillVo.setUseTime();
        return this.defaultSkillVo;
    };
    /**
     * 检测该技能是否可以使用
     * @param vo 技能Vo
     */
    BaseFightObjVo.prototype.checkSkillCanUse = function (vo) {
        if (vo.skillId == SKILL_ZHS_ID && this.getPetNum() >= vo.maxPetNum) {
            return false;
        }
        else if (vo.skillId == SKILL_MFD_ID && this.hasBuffEffType(BuffEffType.SHIELD)) {
            return false;
        }
        return true;
    };
    /**
     * 设置下一技能
     */
    BaseFightObjVo.prototype.setNextHookSkillIndex = function () {
        this.hookSkillIndex++;
        if (this.hookSkillIndex >= this.hookSkillVOList.length) {
            this.hookSkillIndex = 0;
        }
    };
    /**
     * 初始化使用技能Vo
     */
    BaseFightObjVo.prototype.initUseSkillVO = function () {
        this.hookSkillVOList = [];
        var vo;
        for (var i = 0; i < this.hookSkill.length; i++) {
            vo = new FSkillVo();
            vo.initSkill(this.hookSkill[i][0], this.hookSkill[i][1]);
            this.hookSkillVOList.push(vo);
        }
        if (this.defaultSkillVo == null) {
            this.defaultSkillVo = new FSkillVo();
        }
        this.defaultSkillVo.initSkill(this.defaultSkillId, 1);
        if (this.hookSkillIndex > this.hookSkillVOList.length) {
            this.hookSkillIndex = 0;
        }
    };
    /**
     * 添加 初始化Buff队列
     * @param vo FBuffVo
     */
    BaseFightObjVo.prototype.addInitBuffQueue = function (vo) {
        if (this.initBuffQueue == null) {
            this.initBuffQueue = [];
        }
        this.initBuffQueue.push(vo);
    };
    /**
     * 是否存在该类型的buff效果
     * @param btype buff效果类型
     */
    BaseFightObjVo.prototype.hasBuffEffType = function (btype) {
        if (this.buffEffkeyDic) {
            return this.buffEffkeyDic[btype];
        }
        return false;
    };
    /**
     * 添加Buff
     * @param vo FBuffVo
     */
    BaseFightObjVo.prototype.addBuff = function (vo) {
        this.buffDic[vo.id] = vo;
        if (this.buffEffkeyDic == null) {
            this.buffEffkeyDic = {};
        }
        this.buffEffkeyDic[vo.effType] = true;
    };
    /**
     * 移除Buff
     * @param vo:FBuffVo
     */
    BaseFightObjVo.prototype.removeBuff = function (vo) {
        if (this.buffEffkeyDic) {
            this.buffEffkeyDic[vo.effType] = false;
        }
        this.buffDic[vo.id] = null;
        delete this.buffDic[vo.id];
    };
    /**
     * 添加宠物ID
     * @param petId
     */
    BaseFightObjVo.prototype.addPetID = function (petId) {
        if (this.petIdList == null) {
            this.petIdList = [];
        }
        this.petIdList.push(petId);
    };
    /**
     * 移除宠物ID
     */
    BaseFightObjVo.prototype.removePetID = function (petId) {
        if (this.petIdList) {
            var index = this.petIdList.indexOf(petId);
            if (index >= 0) {
                this.petIdList.splice(index, 1);
            }
        }
    };
    /**
     * 获取宠物数量
     */
    BaseFightObjVo.prototype.getPetNum = function () {
        if (this.petIdList == null) {
            return 0;
        }
        return this.petIdList.length;
    };
    /**
     * 是否可以移动
     */
    BaseFightObjVo.prototype.enableMove = function () {
        if (this.hasBuffEffType(BuffEffType.STONE) || this.hasBuffEffType(BuffEffType.DIZZY)) {
            return false;
        }
        return true;
    };
    /**
     * 是否可以释放技能
     */
    BaseFightObjVo.prototype.enableUseSkill = function () {
        if (this.isUseSkill == false || this.hasBuffEffType(BuffEffType.STONE) || this.hasBuffEffType(BuffEffType.DIZZY) || this.hasBuffEffType(BuffEffType.SILENT)) {
            return false;
        }
        return true;
    };
    /**
     * 清理
     */
    BaseFightObjVo.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    return BaseFightObjVo;
}(BaseObjectVo));
__reflect(BaseFightObjVo.prototype, "BaseFightObjVo");
//# sourceMappingURL=BaseFightObjVo.js.map