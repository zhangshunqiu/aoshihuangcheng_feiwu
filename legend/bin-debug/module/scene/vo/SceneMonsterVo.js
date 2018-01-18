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
 * 场景怪物Vo
 */
var SceneMonsterVo = (function (_super) {
    __extends(SceneMonsterVo, _super);
    function SceneMonsterVo() {
        var _this = _super.call(this) || this;
        _this.patrolX = 0; //巡逻点
        _this.patrolY = 0; //巡逻点
        _this.monsterType = 1; //怪物类型,1=小怪,2=关卡BOSS,3=普通boss,4=世界boss
        _this.attackType = 1; //攻击类型：1:主动攻击,2=被动攻击,3=不主动攻击不反击
        _this.hpBarUrl = "sceneHpBar_png"; //血条样式
        _this.honorTitleUrl = ""; //称号样式
        _this.immuneCZ = false; //是否免疫冲撞
        _this.immuneKJHH = false; //是否免疫抗拒火环
        _this.type = SceneObjectType.MONSTER;
        _this.moveSpeed = 4;
        //测试数据
        _this.gridX = SceneModel.getInstance().getRandomGX();
        _this.gridY = SceneModel.getInstance().getRandomGY();
        _this.posX = SceneUtil.gridToPixelX(_this.gridX);
        _this.posY = SceneUtil.gridToPixelY(_this.gridY);
        _this.patrolX = _this.posX;
        _this.patrolY = _this.posY;
        return _this;
    }
    /**
     * 从协议里初始化
     */
    // optional	int32 obj_type		= 1;		//对象类型
    // optional	int32 obj_id		= 2;        //对象id
    // optional	int32 obj_owner_type = 3;		// 对象主人类型
    // optional	int32 obj_owner_id	= 4;		// 对象主人id
    // optional	int32 mon_id		= 5;		// 怪物模板id
    // optional	int32 cur_hp		= 6;		//对象当前血量
    // optional	int32 cur_mp		= 7;		//对象当前魔法
    // optional	int32 hp			= 8;		//血量
    // optional	int32 mp			= 9;		//魔法
    // optional 	int32 begin_x 		= 10;       // 起始点x
    // optional 	int32 begin_y 		= 11;		// 起始点y
    SceneMonsterVo.prototype.initProto = function (obj) {
        this.id = obj["obj_id"];
        this.type = obj["obj_type"];
        this.ownerType = obj["obj_owner_type"];
        this.ownerId = obj["obj_owner_id"];
        this.modelId = obj["mon_id"];
        this.monsterType = 1;
        this.attackType = 3;
        this.updateConfig();
        this.curHp = obj["cur_hp"];
        this.curMp = obj["cur_mp"];
        this.hp = obj["hp"];
        this.mp = obj["mp"];
        this.gridX = obj["begin_x"];
        this.gridY = obj["begin_y"];
        this.posX = SceneUtil.gridToPixelX(this.gridX);
        this.posY = SceneUtil.gridToPixelY(this.gridY);
        this.patrolX = this.posX;
        this.patrolY = this.posY;
        this.hookSkillIndex = 0;
    };
    SceneMonsterVo.prototype.updateConfig = function () {
        var config = App.ConfigManager.getMonsterById(this.modelId);
        if (config) {
            this.objConf = config;
            this.bodyId = config.resId;
            this.monsterType = config.type;
            this.hp = config.hp;
            this.mp = config.mp;
            this.lv = config.lv;
            this.name = config.name + "lv." + this.lv;
            this.attackType = config.attack_type;
            if (config.immune_cz && config.immune_cz == 1) {
                this.immuneCZ = true;
            }
            else {
                this.immuneCZ = false;
            }
            if (config.immune_kjhh && config.immune_kjhh == 1) {
                this.immuneKJHH = true;
            }
            else {
                this.immuneKJHH = false;
            }
            this.updateHookSkill();
        }
    };
    /**
     * 更新挂机技能
     */
    SceneMonsterVo.prototype.updateHookSkill = function (hVo) {
        if (hVo === void 0) { hVo = null; }
        if (this.objConf) {
            this.hookSkill = [];
            for (var i = 0; i < this.objConf.hookSkill.length; i++) {
                this.hookSkill.push([this.objConf.hookSkill[i], 1]);
            }
        }
        this.defaultSkillId = SceneUtil.getDefaultSkill(0);
        this.initUseSkillVO();
    };
    // public get lv():number {
    // 	// if()
    // 	return 1;
    // }
    /**
     * 清理
     */
    SceneMonsterVo.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.nextFSkillVo = null;
        this.fSkillTargetVo = null;
        this.monsterType = 1;
        this.attackType = 3;
        this.hookSkillIndex = 0;
    };
    return SceneMonsterVo;
}(BaseFightObjVo));
__reflect(SceneMonsterVo.prototype, "SceneMonsterVo");
//# sourceMappingURL=SceneMonsterVo.js.map