var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 主角财富信息
 */
var RoleWealthVo = (function () {
    function RoleWealthVo() {
        this.energy = 20; //体力上限
        this.curEnergy = 20; //当前体力
        this.coin = 0; //金币
        this.gold = 0; //元宝
        this.gift = 0; //礼券
        this.smelt = 0; //熔炼值
        this.feats = 0; //功勋值
    }
    RoleWealthVo.prototype.updateFrom9002 = function (data) {
        this.coin = data.coin;
        this.gold = data.gold;
    };
    return RoleWealthVo;
}());
__reflect(RoleWealthVo.prototype, "RoleWealthVo");
//# sourceMappingURL=RoleWealthVo.js.map