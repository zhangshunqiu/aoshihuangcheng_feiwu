var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 角色管理器
 */
var RoleManager = (function () {
    function RoleManager() {
        this.roleInfo = null; //主角信息
        this.roleWealthInfo = null; //主角财富信息 
        this.heroList = []; //英雄列表
        this.roleInfo = new RoleVo();
        this.roleWealthInfo = new RoleWealthVo();
    }
    RoleManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new RoleManager();
        }
        return this._instance;
    };
    /**
     * 根据英雄ID获取英雄Vo
     */
    RoleManager.prototype.getHeroVoById = function (id) {
        this.heroList = game.HeroModel.getInstance().heroInfo;
        for (var i = 0; i < this.heroList.length; i++) {
            var vo = this.heroList[i];
            if (vo.id == id) {
                return vo;
            }
        }
        return null;
    };
    /**
     * 获取战力
    */
    RoleManager.prototype.getHeroFightcap = function () {
        var cap = 0;
        this.heroList = game.HeroModel.getInstance().heroInfo;
        for (var i = 0; i < this.heroList.length; i++) {
            var vo = this.heroList[i];
            cap += vo.score;
        }
        return cap;
    };
    Object.defineProperty(RoleManager.prototype, "mainHeroVo", {
        /**
         * 获取主英雄VO
         */
        get: function () {
            return this._mainHeroVo;
        },
        /**
         * 设置主英雄VO
         */
        set: function (value) {
            this._mainHeroVo = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取角色ID
     */
    RoleManager.prototype.getMainHeroId = function () {
        if (this._mainHeroVo) {
            return this._mainHeroVo.id;
        }
        return null;
    };
    /**
     * 获取英雄列表
     */
    RoleManager.prototype.getHeroList = function () {
        this.heroList = game.HeroModel.getInstance().heroInfo;
        return this.heroList;
    };
    /**
     * 获取称号图标
    */
    RoleManager.prototype.getHonorIcon = function () {
        var info = App.ConfigManager.getTitleInfoById(this.roleInfo.titleId);
        if (info && info.icon)
            return info.icon + "_png";
        else
            return "";
    };
    return RoleManager;
}());
__reflect(RoleManager.prototype, "RoleManager");
//# sourceMappingURL=RoleManager.js.map