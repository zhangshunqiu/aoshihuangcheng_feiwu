var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 提示类型
 */
var ConstBtnTipType = {
    NULL: 0,
    TEST: 1,
    FORGE: 11,
    FORGE_STRENGTH: 111,
    FORGE_STAR: 112,
    ROLE: 12,
    ROLE_EQUIP: 121,
    // ROLE_WING:121,//角色翅膀
    // ROLE_WING_TRAIN:1211,//角色翅膀培养
    // ROLE_WING_EQUIP:1212,//角色翅膀装备
    ROLE_SKILL: 122,
    ROLE_RUBY: 123,
    ROLE_RUBY_COMNINE: 1231,
    ROLE_RUBY_COMNINE_GEMSTONE: 12311,
    ROLE_RUBY_COMNINE_WING: 12312,
    ROLE_RUBY_EMBED: 1232,
    ROLE_REBORN: 124,
    ROLE_REBORN_UP: 1241,
    ROLE_REBORN_CULTURE: 1242,
    ROLE_ORANGEEQUIP: 125,
    BACKPACK: 13,
    BACKPACK_SMELT: 131,
    BACKPACK_SMELTORANGE: 132,
    BOSS: 14,
    BOSS_CHALLENGE: 141,
    CHAT: 15,
    MAIL: 16,
    TASK: 17,
    TASK_MEDAL: 171,
    TASK_ACHIEVE: 172,
    TASK_ACHIEVETITLE: 174,
    TASK_DAILY: 173,
    MOUTHCARD: 18,
    WELFARE: 19,
    WELFARE_SIGN: 191,
    WELFARE_LEVEN: 192,
    WING: 20,
    WING_TRAIN: 201,
    WING_EQUIP: 202,
    COPY: 21,
    COPY_PERSONAL: 211,
    COPY_MATERIAL: 212,
    COPY_CHALLENGE: 214,
    ACTIVITY: 22,
    ACTIVITY_AllRECHARGE: 221,
    ACTIVITY_DAILYRECHARGE: 222,
    VIPGIFT: 23,
    AREAN: 24,
    AREAN_ENCOUNTER: 241,
    AREAN_LABBER: 242,
    METAL: 25,
    RAIDER: 26,
};
var ConstBtnTipTypeParent = (_a = {},
    _a[ConstBtnTipType.FORGE_STRENGTH] = ConstBtnTipType.FORGE,
    _a[ConstBtnTipType.FORGE_STAR] = ConstBtnTipType.FORGE,
    // [ConstBtnTipType.ROLE_WING]:ConstBtnTipType.ROLE,
    _a[ConstBtnTipType.ROLE_EQUIP] = ConstBtnTipType.ROLE,
    _a[ConstBtnTipType.ROLE_SKILL] = ConstBtnTipType.ROLE,
    _a[ConstBtnTipType.ROLE_RUBY] = ConstBtnTipType.ROLE,
    _a[ConstBtnTipType.ROLE_REBORN] = ConstBtnTipType.ROLE,
    _a[ConstBtnTipType.ROLE_RUBY_COMNINE] = ConstBtnTipType.ROLE_RUBY,
    _a[ConstBtnTipType.ROLE_RUBY_EMBED] = ConstBtnTipType.ROLE_RUBY,
    _a[ConstBtnTipType.WING_TRAIN] = ConstBtnTipType.WING,
    _a[ConstBtnTipType.WING_EQUIP] = ConstBtnTipType.WING,
    _a[ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE] = ConstBtnTipType.ROLE_RUBY_COMNINE,
    _a[ConstBtnTipType.ROLE_RUBY_COMNINE_WING] = ConstBtnTipType.ROLE_RUBY_COMNINE,
    _a[ConstBtnTipType.ROLE_REBORN_UP] = ConstBtnTipType.ROLE_REBORN,
    _a[ConstBtnTipType.ROLE_REBORN_CULTURE] = ConstBtnTipType.ROLE_REBORN,
    _a[ConstBtnTipType.BACKPACK_SMELT] = ConstBtnTipType.BACKPACK,
    _a[ConstBtnTipType.BACKPACK_SMELTORANGE] = ConstBtnTipType.BACKPACK,
    _a[ConstBtnTipType.BOSS_CHALLENGE] = ConstBtnTipType.BOSS,
    _a[ConstBtnTipType.TASK_MEDAL] = ConstBtnTipType.TASK,
    _a[ConstBtnTipType.TASK_ACHIEVE] = ConstBtnTipType.TASK,
    _a[ConstBtnTipType.TASK_ACHIEVETITLE] = ConstBtnTipType.TASK,
    _a[ConstBtnTipType.TASK_DAILY] = ConstBtnTipType.TASK,
    _a[ConstBtnTipType.WELFARE_SIGN] = ConstBtnTipType.WELFARE,
    _a[ConstBtnTipType.WELFARE_LEVEN] = ConstBtnTipType.WELFARE,
    _a[ConstBtnTipType.COPY_PERSONAL] = ConstBtnTipType.COPY,
    _a[ConstBtnTipType.COPY_MATERIAL] = ConstBtnTipType.COPY,
    _a[ConstBtnTipType.COPY_CHALLENGE] = ConstBtnTipType.COPY,
    _a[ConstBtnTipType.ACTIVITY_AllRECHARGE] = ConstBtnTipType.ACTIVITY,
    _a[ConstBtnTipType.ACTIVITY_DAILYRECHARGE] = ConstBtnTipType.ACTIVITY,
    _a[ConstBtnTipType.AREAN_ENCOUNTER] = ConstBtnTipType.AREAN,
    _a[ConstBtnTipType.AREAN_LABBER] = ConstBtnTipType.AREAN,
    _a);
var ConstBtnTipTypeChild = (_b = {},
    _b[ConstBtnTipType.FORGE] = [ConstBtnTipType.FORGE_STRENGTH, ConstBtnTipType.FORGE_STAR],
    _b[ConstBtnTipType.ROLE] = [ConstBtnTipType.ROLE_EQUIP, ConstBtnTipType.ROLE_SKILL, ConstBtnTipType.ROLE_RUBY, ConstBtnTipType.ROLE_REBORN, ConstBtnTipType.ROLE_ORANGEEQUIP],
    // [ConstBtnTipType.ROLE]:[ConstBtnTipType.ROLE_WING,ConstBtnTipType.ROLE_SKILL,ConstBtnTipType.ROLE_RUBY,ConstBtnTipType.ROLE_REBORN,ConstBtnTipType.ROLE_ORANGEEQUIP],
    // [ConstBtnTipType.ROLE_WING]:[ConstBtnTipType.ROLE_WING_TRAIN,ConstBtnTipType.ROLE_WING_EQUIP],
    _b[ConstBtnTipType.WING] = [ConstBtnTipType.WING_TRAIN, ConstBtnTipType.WING_EQUIP],
    _b[ConstBtnTipType.ROLE_RUBY] = [ConstBtnTipType.ROLE_RUBY_COMNINE, ConstBtnTipType.ROLE_RUBY_EMBED],
    _b[ConstBtnTipType.ROLE_RUBY_COMNINE] = [ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE, ConstBtnTipType.ROLE_RUBY_COMNINE_WING],
    _b[ConstBtnTipType.ROLE_REBORN] = [ConstBtnTipType.ROLE_REBORN_UP, ConstBtnTipType.ROLE_REBORN_CULTURE],
    _b[ConstBtnTipType.BACKPACK] = [ConstBtnTipType.BACKPACK_SMELT, ConstBtnTipType.BACKPACK_SMELTORANGE],
    _b[ConstBtnTipType.BOSS] = [ConstBtnTipType.BOSS_CHALLENGE],
    _b[ConstBtnTipType.TASK] = [ConstBtnTipType.TASK_MEDAL, ConstBtnTipType.TASK_ACHIEVE, ConstBtnTipType.TASK_ACHIEVETITLE, ConstBtnTipType.TASK_DAILY],
    _b[ConstBtnTipType.WELFARE] = [ConstBtnTipType.WELFARE_SIGN, ConstBtnTipType.WELFARE_LEVEN],
    _b[ConstBtnTipType.COPY] = [ConstBtnTipType.COPY_PERSONAL, ConstBtnTipType.COPY_MATERIAL, ConstBtnTipType.COPY_CHALLENGE],
    _b[ConstBtnTipType.ACTIVITY] = [ConstBtnTipType.ACTIVITY_AllRECHARGE, ConstBtnTipType.ACTIVITY_DAILYRECHARGE],
    _b[ConstBtnTipType.AREAN] = [ConstBtnTipType.AREAN_ENCOUNTER, ConstBtnTipType.AREAN_LABBER],
    _b);
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 按钮提示管理器（代码不能乱改)
 * 使用方法：
 * App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TESt,item,19,-12) 统一管理使用方法
 *  App.BtnTipManager.creatBtnTip("升",item,19,-12) 模块自己管理方法，只是创建红点，需要自己去更新显示
 */
var BtnTipManager = (function () {
    function BtnTipManager() {
        this._btnTipsTypeDic = {}; //按钮提示类型字典
        this._btnTipsItemDic = {}; //按钮提示显示对象字典 key为btnTipsType
        this._BtnTipsTypeParent = {}; //提示类型父子关系
    }
    BtnTipManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new BtnTipManager();
        }
        return this._instance;
    };
    BtnTipManager.prototype.init = function () {
        this._btnTipsTypeDic = {};
        this._btnTipsItemDic = {};
    };
    /**
     * 获取类型值
     */
    BtnTipManager.prototype.getTypeValue = function (type) {
        return this._btnTipsTypeDic[type];
    };
    /**
     *  设置类型值
     */
    BtnTipManager.prototype.setTypeValue = function (type, data) {
        if (this._btnTipsTypeDic[type] == data) {
            return;
        }
        this._btnTipsTypeDic[type] = data;
        if (data && data != 0) {
            if (this._btnTipsItemDic[type]) {
                this._btnTipsItemDic[type].show(data);
            }
            var parentType = ConstBtnTipTypeParent[type];
            if (parentType) {
                this.updateParentTypeValue(parentType, data);
            }
        }
        else {
            if (this._btnTipsItemDic[type]) {
                this._btnTipsItemDic[type].hide();
            }
            var parentType = ConstBtnTipTypeParent[type];
            if (parentType) {
                this.updateParentTypeValue(parentType, false);
            }
        }
    };
    //更新父级
    BtnTipManager.prototype.updateParentTypeValue = function (type, data) {
        var childs = ConstBtnTipTypeChild[type];
        var newValue = false;
        for (var i = 0; i < childs.length; i++) {
            var value = this._btnTipsTypeDic[childs[i]];
            if (value) {
                newValue = value;
                break;
            }
        }
        this.setTypeValue(type, newValue);
    };
    BtnTipManager.prototype.deleteTypeValue = function (type) {
        this._btnTipsItemDic[type] = null;
        delete this._btnTipsItemDic[type];
    };
    /**
     * 创建按钮提示(单独外部使用)
     */
    BtnTipManager.prototype.creatBtnTip = function (str, parent, xx, yy) {
        return new BtnTips(str, parent, xx, yy);
    };
    /**
     * 添加按钮提示(管理器添加)
     */
    BtnTipManager.prototype.addBtnTipItem = function (type, parent, xx, yy) {
        if (this._btnTipsItemDic[type]) {
        }
        else {
            var item = new BaseBtnTips(type, parent, xx, yy);
        }
    };
    /**
     * 设置类型对应的Item（外部不要用）
     */
    BtnTipManager.prototype.setTypeItem = function (type, item) {
        if (item) {
            this._btnTipsItemDic[type] = item;
            var data = this._btnTipsTypeDic[type];
            if (data && data != 0) {
                item.show(data);
            }
            else {
                item.hide();
            }
        }
    };
    /**
     * 删除类型对应的Item（外部不要用）
     */
    BtnTipManager.prototype.deleteTypeItem = function (type) {
        var item = this._btnTipsItemDic[type];
        if (item) {
            item.hide();
            this._btnTipsItemDic[type] = null;
            delete this._btnTipsItemDic[type];
        }
    };
    /**
     * 销毁
     */
    BtnTipManager.prototype.destroy = function () {
        this._btnTipsTypeDic = {};
        this._btnTipsItemDic = {};
    };
    return BtnTipManager;
}());
__reflect(BtnTipManager.prototype, "BtnTipManager");
var _a, _b;
//# sourceMappingURL=BtnTipManager.js.map