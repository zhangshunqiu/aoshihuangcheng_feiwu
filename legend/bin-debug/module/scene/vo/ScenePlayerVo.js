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
 * 场景玩家的VO
 */
var ScenePlayerVo = (function (_super) {
    __extends(ScenePlayerVo, _super);
    function ScenePlayerVo() {
        var _this = _super.call(this) || this;
        _this._bodyId = ""; //身体
        _this.weaponId = ""; //武器ID
        _this.wingId = ""; //翅膀Id
        _this.guildName = ""; //帮派名
        _this.type = SceneObjectType.PLAYER;
        _this.hpBarUrl = "sceneHpBarRole_png";
        //测试数据
        _this.bodyId = "";
        _this.weaponId = "";
        //this.wingId = "4013";
        _this.gridX = SceneModel.getInstance().getRandomGX();
        _this.gridY = SceneModel.getInstance().getRandomGY();
        _this.posX = SceneUtil.gridToPixelX(_this.gridX);
        _this.posY = SceneUtil.gridToPixelY(_this.gridY);
        _this.moveSpeed = 4;
        _this.id = 123;
        _this.name = "角色";
        _this.hp = 1000;
        _this.curHp = 1000;
        _this.pkMode = PKModeType.ALL;
        _this.ownerType = SceneObjectType.PLAYER;
        if (SceneModel.getInstance().sceneType == SCENE_MAP_TYPE.WORLD_BOSS) {
            _this.pkMode = PKModeType.PEACE;
        }
        return _this;
        //设置挂机技能和默认技能
        //var hvo:game.HeroVO = RoleManager.getInstance().getHeroVoById(this.id);
        //this.updateHookSkill(hvo);
        //this.initBuffQueue = [new FBuffVo()];
    }
    /**
     * 从协议里初始化
     */
    // optional	int32 obj_type		= 1;		//对象类型
    // optional	int32 obj_id		= 2;        //对象id
    // optional	string name         = 3;		//对象昵称
    // optional	int32 sex			= 4;		//对象性别
    // optional	int32 career		= 5;        //对象职业
    // optional	int32 lv			= 6;		//对象等级
    // optional	int32 cur_hp		= 7;		//对象当前血量
    // optional	int32 cur_mp		= 8;		//对象当前魔法
    // optional	int32 hp			= 9;		//血量
    // optional	int32 mp			= 10;		//魔法
    // optional 	int32 begin_x 		= 11;       // 起始点x
    // optional 	int32 begin_y 		= 12;		// 起始点y
    // optional	int32 guild_id		= 13;		//帮派id
    // optional	string guild_name   = 14;		//帮派名
    // optional	int32 name_color	= 15;		//名字颜色
    // optional	int32 pet_num		= 16;		// 宠物数量
    // optional	int32 collect_state	= 17;		//玩家场景采集状态0未采集
    ScenePlayerVo.prototype.initProto = function (obj) {
        this.id = obj["obj_id"];
        this.type = obj["obj_type"];
        this.name = obj["name"];
        this.lv = obj["lv"];
        this.curHp = obj["cur_hp"];
        this.curMp = obj["cur_mp"];
        this.hp = obj["hp"];
        this.mp = obj["mp"];
        this.sex = obj["sex"];
        this.career = obj["career"];
        this.guildId = obj["guild_id"];
        this.guildName = obj["guild_name"];
        this.nameColor = obj["name_color"];
        this.petNum = obj["pet_num"];
        this.collectState = obj["collect_state"];
        this.ownerId = obj["obj_owner_id"];
        this.mainOwnerId = this.ownerId;
        this.gridX = obj["begin_x"];
        this.gridY = obj["begin_y"];
        this.posX = SceneUtil.gridToPixelX(this.gridX);
        this.posY = SceneUtil.gridToPixelY(this.gridY);
        this.patrolX = this.posX;
        this.patrolY = this.posY;
        this.hookSkillIndex = 0;
        var idd = obj["clothes_id"];
        if (idd && idd != 0) {
            this.bodyId = String(idd);
        }
        idd = obj["weapon_id"];
        if (idd && idd != 0) {
            this.weaponId = String(idd);
        }
        idd = obj["wing_id"];
        if (idd && idd != 0) {
            this.wingId = String(idd);
        }
        //设置挂机技能和默认技能
        var hvo = RoleManager.getInstance().getHeroVoById(this.id);
        if (hvo) {
            //设置技能
            //设置模型
            var clothModelId = hvo.getClothModelId();
            if (clothModelId) {
                this.bodyId = String(clothModelId);
            }
            else {
                this.bodyId = "";
            }
            var weaponModelId = hvo.getWeaponModelId();
            if (weaponModelId) {
                this.weaponId = String(weaponModelId);
            }
            else {
                this.weaponId = "";
            }
            var wingModelId = hvo.getWingModelId();
            if (wingModelId) {
                this.wingId = String(wingModelId);
            }
            else {
                this.wingId = "";
            }
            //this.mainOwnerId = RoleManager.getInstance().getMainHeroId();
            if (this.id == RoleManager.getInstance().getMainHeroId()) {
                //如果是主角，就赋称号
                this.honorTitleUrl = App.RoleManager.getHonorIcon();
            }
        }
        else {
            //this.mainOwnerId = 
            //非自己的英雄就是机器人,需读表获取
            var robot = App.ConfigManager.getRobotConfByCareerLvSex(this.career, this.lv, this.sex);
            if (this.name == null || this.name == "") {
                this.name = App.ConfigManager.getRandomNameBySex(this.sex);
            }
            this.hookSkill = robot.skill;
            this.bodyId = String(robot.cloth);
            this.weaponId = String(robot.weapon);
            this.wingId = String(robot.wing);
        }
        this.updateHookSkill(hvo);
    };
    /**
     * 更新挂机技能
     */
    ScenePlayerVo.prototype.updateHookSkill = function (hvo) {
        if (hvo === void 0) { hvo = null; }
        //设置技能
        if (hvo) {
            this.hookSkill = [];
            var list = SceneUtil.getAutoSkillList(this.career);
            for (var i = 0; i < list.length; i++) {
                var sid = list[i];
                if (hvo.skillDic[sid] && hvo.skillDic[sid] > 0) {
                    this.hookSkill.push([sid, hvo.skillDic[sid]]);
                }
            }
            //this.hookSkill = [[20400,1],[20400,1],[20400,1],[20400,1],[20400,1]];
        }
        this.defaultSkillId = SceneUtil.getDefaultSkill(this.career);
        this.initUseSkillVO();
    };
    Object.defineProperty(ScenePlayerVo.prototype, "bodyId", {
        get: function () {
            return this._bodyId;
        },
        set: function (value) {
            if (value == "" || value == "0") {
                this._bodyId = "1700";
            }
            else {
                this._bodyId = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    // /**
    //  * 是否是攻击目标
    //  */
    // public isAtkTarget():Boolean{
    // 	return true;
    // }
    /**
     * 清理
     */
    ScenePlayerVo.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    return ScenePlayerVo;
}(ScenePetVo));
__reflect(ScenePlayerVo.prototype, "ScenePlayerVo");
//# sourceMappingURL=ScenePlayerVo.js.map