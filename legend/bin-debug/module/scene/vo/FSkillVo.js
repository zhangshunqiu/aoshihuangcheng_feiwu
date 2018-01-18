var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com  2017/6/20
 * 战斗技能VO
 */
var FSkillVo = (function () {
    function FSkillVo() {
        this._skillConfig = {}; //技能配置信息
        this._id = 0; //技能ID
        this._lv = -1; //技能级别
        this._skillId = 1000; //技能模板ID
        this._cdTime = 1000; //技能cd,只有过了这个时间才能执行这个技能
        this._type = 1; //技能类型 1=主动,2=被动
        //private _mp:number=1000;//技能需要的魔法
        this._startTime = 1000; //技能开始时间
        this._endTime = 1000; //技能结束时间
        this._isLock = false; //是否锁定
        //private _atkType:number = 0;//攻击类型，法术攻击还是物理攻击
        this._actionTime = 800; //技能动作时间毫秒，攻击开始后只有过了这个时间才能执行下一动作
        this._atkDis = 328; //攻击距离
        this._targetType = 1; //目标类型 AtkTargetType SELF:1,//自己 PARTNER:2,//队友 ENEMY:3,//敌方 EMPTY:4,//空放
        this._atkRange = null; //攻击范围 如 {circle, 1}
        this._atkRangeId = 1; //攻击范围Id 如 1，2，3 对应 SkillAtkRange
        this._atkRangeType = 0; //攻击范围类型ID 如 1.单攻 2.3*3格群攻 3.周围5格攻击（半月） 4.前方2格 5，前方5格 6.前方4格
        this._atkActType = 3; //攻击动作类型 3普攻，4法术攻击 ......
        this._atkEff = ""; //攻击效果Id
        this._atkEffType = 1; //攻击效果类型 1表示一个方向 大于1表示8个方向
        this._flyEff = ""; //飞行效果ID
        this._hurtEff = ""; //伤害效果
        this._hurtEffType = 1; //伤害效果类型 如：1.单体（单个人上）2.多人（分别放多人）3.单体或者多人身上地表(在脚点) 4.群体空中 效果在人上 5.火墙
        this._atkSound = "";
        this._hurtSound = "";
        this._costMp = 0; //消耗魔法
        this.maxPetNum = 1; //最大宠物数
        //	this._skillConfig
    }
    FSkillVo.prototype.initSkill = function (skillId, lv, skillConfig) {
        if (skillConfig === void 0) { skillConfig = null; }
        if (this._skillId == skillId && this._lv == lv) {
            return;
        }
        if (skillConfig == null) {
            this._skillConfig = ConfigManager.getInstance().getSkillConfigById(skillId, lv);
        }
        else {
            this._skillConfig = skillConfig;
        }
        this._id = skillId + lv;
        this._lv = lv;
        this._skillId = skillId;
        //this._cdTime = this._skillConfig.skill_cd;
        this._type = this._skillConfig.type;
        this._targetType = this._skillConfig.target;
        this._atkRange = this._skillConfig.range;
        this._atkRangeId = this._skillConfig.rangeId;
        this._atkRangeType = this._skillConfig.range_type;
        this._atkEffType = this._skillConfig.atkEffType;
        this._atkEff = String(this._skillConfig.atkEff);
        this._atkActType = this._skillConfig.atkAct;
        this._atkSound = this._skillConfig.atkSound;
        this._hurtSound = this._skillConfig.hurtSound;
        this._flyEff = String(this._skillConfig.flyEff);
        this._hurtEff = String(this._skillConfig.hurtEff);
        this._hurtEffType = this._skillConfig.hurtEffType;
        this._cdTime = this._skillConfig.skill_cd;
        this._atkDis = Math.max(this._skillConfig.atk_dis * 64 + 32, 96); //必须超过两格
        this._costMp = this._skillConfig.costMp;
        this._actionTime = this._skillConfig.actionTime;
    };
    /**
     * 设置使用时间
     */
    FSkillVo.prototype.setUseTime = function () {
        this._startTime = Date.now();
        this._endTime = this._startTime + this._cdTime;
    };
    /**
     * 是否可以使用
     */
    FSkillVo.prototype.useEnable = function (mp) {
        if (mp === void 0) { mp = 100000; }
        if (Date.now() > this._endTime && this._isLock == false && mp > this._costMp) {
            return true;
        }
        return false;
    };
    Object.defineProperty(FSkillVo.prototype, "hurtEffType", {
        get: function () {
            return this._hurtEffType;
        },
        set: function (value) {
            this._hurtEffType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "hurtEff", {
        get: function () {
            return this._hurtEff;
        },
        set: function (value) {
            this._hurtEff = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "flyEff", {
        get: function () {
            return this._flyEff;
        },
        set: function (value) {
            this._flyEff = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "atkEffType", {
        get: function () {
            return this._atkEffType;
        },
        set: function (value) {
            this._atkEffType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "atkEff", {
        get: function () {
            return this._atkEff;
        },
        set: function (value) {
            this._atkEff = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "actionTime", {
        get: function () {
            return this._actionTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "atkActType", {
        get: function () {
            return this._atkActType;
        },
        set: function (value) {
            this._atkActType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "atkRangeType", {
        get: function () {
            return this._atkRangeType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "atkRangeId", {
        get: function () {
            return this._atkRangeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "atkRange", {
        get: function () {
            return this._atkRange;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "targetType", {
        get: function () {
            return this._targetType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "atkDis", {
        get: function () {
            return this._atkDis;
        },
        set: function (value) {
            this._atkDis = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "isLock", {
        get: function () {
            return this._isLock;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "endTime", {
        get: function () {
            return this._endTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "costMp", {
        get: function () {
            return this._costMp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "cdTime", {
        get: function () {
            return this._cdTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "skillId", {
        get: function () {
            return this._skillId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "lv", {
        get: function () {
            return this._lv;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSkillVo.prototype, "skillConfig", {
        get: function () {
            return this._skillConfig;
        },
        enumerable: true,
        configurable: true
    });
    return FSkillVo;
}());
__reflect(FSkillVo.prototype, "FSkillVo");
/**
 * 战斗中技能对应目标VO
 */
var FSkillTargetVo = (function () {
    function FSkillTargetVo() {
    }
    //协议pbHookUseSkill
    FSkillTargetVo.prototype.creatHookTriggerData = function (atkVo) {
        var obj = {};
        obj.skill_id = this.skillVo.skillId;
        obj.cast_type = atkVo.type;
        obj.cast_id = atkVo.id;
        if (this.targetPoint) {
            obj.x = this.targetPoint.x;
            obj.y = this.targetPoint.y;
        }
        var targetArr = [];
        if (this.targetArr && this.targetArr.length > 0) {
            for (var i = 0; i < this.targetArr.length; i++) {
                var vo = this.targetArr[i];
                targetArr.push({ obj_type: vo.type, obj_id: vo.id });
            }
        }
        obj.target_list = targetArr;
        return obj;
    };
    return FSkillTargetVo;
}());
__reflect(FSkillTargetVo.prototype, "FSkillTargetVo");
//# sourceMappingURL=FSkillVo.js.map