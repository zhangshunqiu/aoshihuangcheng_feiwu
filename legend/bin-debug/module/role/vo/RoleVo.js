var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 主角信息
 */
var RoleVo = (function () {
    function RoleVo() {
        this.playerId = 1000; //玩家ID
        this.account = ""; //账号ID
        this.name = "zsq"; //
        this.nameColor = 0; //
        this.sex = 1; //性别
        this.career = 1000; //职业
        this.combat = 0; //战力
        this.vipLv = 0; //vip等级
        this.lv = 0; //等级
        this.exp = 0; //经验
        this.hookSceneId = 0; //挂机场景ID
        this.turn = 0; //转生等级
        this.lifeExp = 0; //修为值
        this.first_charge = 0; //0未首充 1已充未领奖励 2已领奖励
        this.guideId = 0; //引导id
        this.titleId = 0;
    }
    RoleVo.prototype.updateFrom9002 = function (data) {
        this.playerId = data.player_id;
        this.account = data.account;
        this.name = data.name;
        this.sex = data.sex;
        this.career = data.career;
        this.combat = data.combat;
        this.vipLv = data.vip_lv;
        this.lv = data.lv;
        this.exp = data.exp;
        this.hookSceneId = data.hook_scene_id;
        this.turn = data.turn ? data.turn : 0;
        this.lifeExp = data.life_exp ? data.life_exp : 0;
        this.guideId = data.guide_id;
        this.titleId = data.title_id;
    };
    return RoleVo;
}());
__reflect(RoleVo.prototype, "RoleVo");
//# sourceMappingURL=RoleVo.js.map