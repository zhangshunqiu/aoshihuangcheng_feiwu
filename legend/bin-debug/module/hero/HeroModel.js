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
 * module : 英雄数据模型
 * author : zrj
*/
var game;
(function (game) {
    var HeroModel = (function (_super) {
        __extends(HeroModel, _super);
        function HeroModel() {
            var _this = _super.call(this) || this;
            _this.curPos = 0; //当前选中第几位英雄
            _this.curPart = 1; //当前选中装备位置
            _this.heroHeadFrame = [false, false]; //新英雄解锁特效
            _this.heroHeadRedDot = [false, false, false]; //英雄头部红点
            _this.heroHeadRedDot2 = [false, false, false]; //英雄头部红点2 特殊装备用
            _this.heroEquipPartRedDot = [
                [false, false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false, false],
                [false, false, false, false, false, false, false, false, false, false]
            ]; //英雄部位红点
            _this.heroSpecialEquipPartRedDot = [
                [false, false, false, false, false, false],
                [false, false, false, false, false, false],
                [false, false, false, false, false, false]
            ]; //英雄特殊装备红点
            _this.isEquipPuton = false; //穿戴装备的阈值，每次穿戴完成为true，在英雄信息里置为false
            _this.isSpecialEquip = false; //特殊装备的阈值，每次特殊装备有改变为true，在英雄信息里置为false
            _this.baseInfo = {};
            _this.heroInfo = [];
            return _this;
        }
        HeroModel.prototype.updateBaseInfo = function (info) {
            this.baseInfo = {};
            this.baseInfo = info;
            this.baseInfo.exp = info.exp.toNumber();
        };
        /**更新英雄信息
         *
         */
        HeroModel.prototype.updateHeroInfo = function (info) {
            // this.heroInfo = [];
            for (var k in info) {
                var findId = false;
                for (var i = 0; i < this.heroInfo.length; i++) {
                    var vo = this.heroInfo[i];
                    if (vo.id == info[k].id) {
                        this.heroInfo[i].updateInfo(info[k]);
                        findId = true;
                    }
                }
                if (findId == false) {
                    this.heroInfo.push(new game.HeroVO(info[k]));
                }
            }
            this.heroInfo.sort(function (a, b) {
                if (a.id < b.id) {
                    return -1;
                }
                return 1;
            });
            // App.logzrj(this.heroInfo);
        };
        //增加伙伴
        HeroModel.prototype.addNewHero = function (info) {
            for (var k in info) {
                this.heroInfo.push(new game.HeroVO(info[k]));
            }
            this.heroInfo.sort(function (a, b) {
                if (a.id < b.id) {
                    return -1;
                }
                return 1;
            });
        };
        //获取普通装备信息
        HeroModel.prototype.getHeroEquipByPosPart = function (pos, part) {
            if (pos >= this.heroInfo.length || this.heroInfo.length == 0) {
                return null;
            }
            var info = this.heroInfo[pos].equip_info;
            for (var j in info) {
                if (Number(info[j].part) === part && info[j].equip) {
                    return info[j];
                }
            }
        };
        //获取特殊装备信息
        HeroModel.prototype.getHeroSpecialEquipByPosPart = function (pos, part) {
            if (pos >= this.heroInfo.length || this.heroInfo.length == 0) {
                return null;
            }
            var info = this.heroInfo[pos].specialEquip;
            for (var j in info) {
                if (Number(info[j].pos) === part && info[j].id) {
                    return info[j];
                }
            }
        };
        HeroModel.prototype.getHeroVoById = function (id) {
            var vo;
            for (var i = 0; i < this.heroInfo.length; i++) {
                vo = this.heroInfo[i];
                if (vo.id == id) {
                    return vo;
                }
            }
            return null;
        };
        //获得当前选择的伙伴
        HeroModel.prototype.getCurHero = function () {
            return this.heroInfo[this.curPos];
        };
        //检测是否有可穿戴的更好的装备 对应单个位置
        HeroModel.prototype.checkBetterEquipRedDot = function (curEquipInfo) {
            var _this = this;
            var myBaseInfo = App.ConfigManager.equipConfig()[curEquipInfo.good_id];
            var pos = game.EquipModel.getInstance().getPosByType(myBaseInfo.sub_type); //对应英雄身上部位
            var _loop_1 = function (k) {
                if (this_1.heroInfo[k].job == myBaseInfo.limit_career) {
                    if (typeof pos == "number") {
                        this_1.heroEquipPartRedDot[k][pos - 1] = false;
                    }
                    else {
                        pos.forEach(function (v, idx, a) {
                            _this.heroEquipPartRedDot[k][v - 1] = false;
                        }, this_1);
                    }
                    return "break";
                }
            };
            var this_1 = this;
            //先将相关部位红点干掉
            for (var k = 0; k < this.heroInfo.length; k++) {
                var state_1 = _loop_1(k);
                if (state_1 === "break")
                    break;
            }
            var _loop_2 = function (i) {
                var equipInfo = game.BackpackModel.getInstance().equipBackpack[i];
                var baseInfo = App.ConfigManager.equipConfig()[equipInfo.good_id];
                var _loop_3 = function (k) {
                    var value = this_2.heroInfo[k];
                    var index = k;
                    if (baseInfo.limit_career != value.job || baseInfo.sub_type != myBaseInfo.sub_type || (baseInfo.sex != value.sex && baseInfo.sex != 0) || baseInfo.limit_lv > App.RoleManager.roleInfo.lv) {
                        return "continue";
                    }
                    if (typeof pos == "number") {
                        var myEquipInfo = this_2.getHeroEquipByPosPart(index, pos);
                        if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                            this_2.heroHeadRedDot[index] = true;
                            this_2.heroEquipPartRedDot[index][pos - 1] = true;
                        }
                        else if (myEquipInfo) {
                            if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                                this_2.heroHeadRedDot[index] = true;
                                this_2.heroEquipPartRedDot[index][pos - 1] = true;
                            }
                            else {
                            }
                        }
                    }
                    else {
                        pos.forEach(function (v, idx, a) {
                            var myEquipInfo = _this.getHeroEquipByPosPart(index, v);
                            if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                                _this.heroHeadRedDot[index] = true;
                                _this.heroEquipPartRedDot[index][v - 1] = true;
                            }
                            else if (myEquipInfo) {
                                if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                                    _this.heroHeadRedDot[index] = true;
                                    _this.heroEquipPartRedDot[index][v - 1] = true;
                                }
                                else {
                                }
                            }
                        }, this_2);
                    }
                };
                for (var k = 0; k < this_2.heroInfo.length; k++) {
                    _loop_3(k);
                }
                ;
            };
            var this_2 = this;
            //开始检索
            for (var i = 0; i < game.BackpackModel.getInstance().equipBackpack.length; i++) {
                _loop_2(i);
            }
            App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, false);
            for (var i = 0; i < this.heroHeadRedDot.length; i++) {
                if (this.heroHeadRedDot[i]) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
                }
            }
            for (var i = 0; i < this.heroHeadRedDot2.length; i++) {
                if (this.heroHeadRedDot2[i]) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
                }
            }
        };
        //检测是否有可穿戴的更好的装备
        HeroModel.prototype.checkBetterEquipRedDotAll = function () {
            var _this = this;
            this.resetRedDot();
            var _loop_4 = function (i) {
                var equipInfo = game.BackpackModel.getInstance().equipBackpack[i];
                var baseInfo = App.ConfigManager.equipConfig()[equipInfo.good_id];
                var _loop_5 = function (k) {
                    var value = this_3.heroInfo[k];
                    var index = k;
                    if (baseInfo.limit_career != value.job || (baseInfo.sex != value.sex && baseInfo.sex != 0) || baseInfo.limit_lv > App.RoleManager.roleInfo.lv) {
                        return "continue";
                    }
                    var pos = game.EquipModel.getInstance().getPosByType(baseInfo.sub_type); //对应英雄身上部位
                    if (typeof pos == "number") {
                        var myEquipInfo = this_3.getHeroEquipByPosPart(index, pos);
                        if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                            // return true;
                            this_3.heroHeadRedDot[index] = true;
                            this_3.heroEquipPartRedDot[index][pos - 1] = true;
                        }
                        else if (myEquipInfo) {
                            if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                                // return true;
                                this_3.heroHeadRedDot[index] = true;
                                this_3.heroEquipPartRedDot[index][pos - 1] = true;
                            }
                            else {
                                // return false;
                                // this.heroHeadRedDot[index] = false;
                                // this.heroEquipPartRedDot[index][pos - 1] = false;
                            }
                        }
                    }
                    else {
                        pos.forEach(function (v, idx, a) {
                            var myEquipInfo = _this.getHeroEquipByPosPart(index, v);
                            if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                                // return true;
                                _this.heroHeadRedDot[index] = true;
                                _this.heroEquipPartRedDot[index][v - 1] = true;
                            }
                            else if (myEquipInfo) {
                                if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                                    // return true;
                                    _this.heroHeadRedDot[index] = true;
                                    _this.heroEquipPartRedDot[index][v - 1] = true;
                                }
                                else {
                                    // return false;
                                    // this.heroHeadRedDot[index] = false;
                                    // this.heroEquipPartRedDot[index][v - 1] = false;
                                }
                            }
                        }, this_3);
                    }
                };
                for (var k = 0; k < this_3.heroInfo.length; k++) {
                    _loop_5(k);
                }
                ;
            };
            var this_3 = this;
            for (var i = 0; i < game.BackpackModel.getInstance().equipBackpack.length; i++) {
                _loop_4(i);
            }
            for (var i = 0; i < this.heroHeadRedDot.length; i++) {
                if (this.heroHeadRedDot[i]) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
                }
            }
            for (var i = 0; i < this.heroHeadRedDot2.length; i++) {
                if (this.heroHeadRedDot2[i]) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
                }
            }
        };
        //重置装备红点
        HeroModel.prototype.resetRedDot = function () {
            var _this = this;
            this.heroInfo.forEach(function (value, index, array) {
                _this.heroHeadRedDot[index] = false;
                for (var i = 0; i < 10; i++) {
                    _this.heroEquipPartRedDot[index][i] = false;
                }
                // for (let i = 0; i < 6; i++) {
                // 	this.heroSpecialEquipPartRedDot[index][i] = false;
                // }
            }, this);
            App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, false);
        };
        //检测是否可以添加新伙伴
        HeroModel.prototype.checkNewPartner = function () {
            var info1 = App.ConfigManager.getPartnerConfigById(1); //第二个
            var info2 = App.ConfigManager.getPartnerConfigById(2); //第三个
            //第二个条件
            if (this.heroInfo.length == 1 && (App.RoleManager.roleInfo.lv >= info1.level || App.RoleManager.roleInfo.vipLv >= info1.vip)) {
                this.heroHeadFrame[0] = true;
            }
            else {
                this.heroHeadFrame[0] = false;
            }
            //第三个条件
            if (this.heroInfo.length < 3 && (App.RoleManager.roleInfo.turn >= info2.transmigration || App.RoleManager.roleInfo.vipLv >= info2.vip)) {
                this.heroHeadFrame[1] = true;
            }
            else {
                this.heroHeadFrame[1] = false;
            }
        };
        //一键换装
        HeroModel.prototype.changeBestEquip = function (pos) {
            var equipDic = {};
            var equipMark = {}; //装备标记，标记哪几个装备已经被选中
            var value = this.heroInfo[pos];
            //开始检索
            for (var k = 1; k <= this.heroEquipPartRedDot[pos].length; k++) {
                if (!this.heroEquipPartRedDot[pos][k - 1]) {
                    continue;
                }
                for (var i = 0; i < game.BackpackModel.getInstance().equipBackpack.length; i++) {
                    if (equipMark[k] == i || (k == ConstEquipPart.HAND2 && equipMark[k - 1] == i) || (k == ConstEquipPart.RING2 && equipMark[k - 1] == i)) {
                        continue;
                    }
                    var equipInfo = game.BackpackModel.getInstance().equipBackpack[i];
                    var baseInfo = App.ConfigManager.equipConfig()[equipInfo.good_id];
                    var subType = game.EquipModel.getInstance().getTypeByPos(k); //装备子类型
                    if (baseInfo.limit_career != value.job || baseInfo.sub_type != subType || (baseInfo.sex != value.sex && baseInfo.sex != 0) || baseInfo.limit_lv > App.RoleManager.roleInfo.lv) {
                        continue;
                    }
                    var myEquipInfo = this.getHeroEquipByPosPart(pos, k);
                    var temp = undefined;
                    if (!myEquipInfo && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                        temp = equipInfo;
                    }
                    else if (myEquipInfo) {
                        if (equipInfo.equip.score > myEquipInfo.equip.score && ((App.RoleManager.roleInfo.turn >= baseInfo.reincarnation && baseInfo.reincarnation != 0) || (App.RoleManager.roleInfo.lv >= baseInfo.limit_lvl && baseInfo.reincarnation == 0)) && (baseInfo.sex == value.sex || baseInfo.sex == 0)) {
                            temp = equipInfo;
                        }
                    }
                    if (!equipDic[k]) {
                        if (temp) {
                            equipDic[k] = temp;
                            equipMark[k] = i;
                        }
                    }
                    else {
                        if (temp && temp.equip.score > equipDic[k].equip.score) {
                            equipDic[k] = temp;
                            equipMark[k] = i;
                        }
                    }
                }
            }
            //pos5 pos7战力肯定大于等于 pos6 pos8
            if (equipDic[ConstEquipPart.HAND2]) {
                var myEquipInfo = this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND1);
                if (myEquipInfo && equipDic[ConstEquipPart.HAND1] && myEquipInfo.equip.score > equipDic[ConstEquipPart.HAND1].equip.score) {
                    equipDic[ConstEquipPart.HAND2] = equipDic[ConstEquipPart.HAND1];
                    equipDic[ConstEquipPart.HAND1] = undefined;
                }
            }
            else if (this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND2)) {
                var myEquipInfo1 = this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND1);
                var myEquipInfo2 = this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND2);
                if (myEquipInfo1 && myEquipInfo2 && myEquipInfo1.equip.score > myEquipInfo2.equip.score) {
                    equipDic[ConstEquipPart.HAND2] = equipDic[ConstEquipPart.HAND1];
                    equipDic[ConstEquipPart.HAND1] = undefined;
                }
            }
            else if (this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND1)) {
                if (!this.getHeroEquipByPosPart(pos, ConstEquipPart.HAND2)) {
                    equipDic[ConstEquipPart.HAND2] = equipDic[ConstEquipPart.HAND1];
                    equipDic[ConstEquipPart.HAND1] = undefined;
                }
            }
            if (equipDic[ConstEquipPart.RING2]) {
                var myEquipInfo = this.getHeroEquipByPosPart(pos, ConstEquipPart.RING1);
                if (myEquipInfo && equipDic[ConstEquipPart.RING1] && myEquipInfo.equip.score > equipDic[ConstEquipPart.RING1].equip.score) {
                    equipDic[ConstEquipPart.RING2] = equipDic[ConstEquipPart.RING1];
                    equipDic[ConstEquipPart.RING1] = undefined;
                }
            }
            else if (this.getHeroEquipByPosPart(pos, ConstEquipPart.RING2)) {
                var myEquipInfo1 = this.getHeroEquipByPosPart(pos, ConstEquipPart.RING1);
                var myEquipInfo2 = this.getHeroEquipByPosPart(pos, ConstEquipPart.RING2);
                if (myEquipInfo1 && myEquipInfo2 && myEquipInfo1.equip.score > myEquipInfo2.equip.score) {
                    equipDic[ConstEquipPart.RING2] = equipDic[ConstEquipPart.RING1];
                    equipDic[ConstEquipPart.RING1] = undefined;
                }
            }
            else if (this.getHeroEquipByPosPart(pos, ConstEquipPart.RING1)) {
                if (!this.getHeroEquipByPosPart(pos, ConstEquipPart.RING2)) {
                    equipDic[ConstEquipPart.RING2] = equipDic[ConstEquipPart.RING1];
                    equipDic[ConstEquipPart.RING1] = undefined;
                }
            }
            App.logzrj("dict", equipDic);
            return equipDic;
        };
        //检测特殊装备是否可以升级 对应单个位置
        HeroModel.prototype.checkSpecialEquipRedDot = function (part) {
            for (var i = 0; i < this.heroInfo.length; i++) {
                var specialInfo = this.heroInfo[i].getEquipSpecialByPart(part);
                if (specialInfo.id) {
                    var info = App.ConfigManager.getEquipSpecialById(specialInfo.id); //特殊装备信息
                    var canActive = false; //能否激活
                    if (part == ConstSpecialEquipPart.PARA_RING || part == ConstSpecialEquipPart.BODY_RING) {
                        var ringInfo = App.ConfigManager.getEquipSpecialById(specialInfo.id);
                        for (var i_1 = 0; i_1 < 4; i_1++) {
                            var singleRingInfo = App.ConfigManager.getEquipSpecialFragmentById(ringInfo.ring_id[i_1]); //单个戒指部位信息
                            if (specialInfo.getpieceByKey(ringInfo.ring_id[i_1])) {
                                //
                            }
                            else if (game.BossModel.getInstance().level >= singleRingInfo.condition && ringInfo.next_id) {
                                canActive = true;
                            }
                        }
                        if (canActive) {
                            this.heroSpecialEquipPartRedDot[i][part - 1] = true;
                        }
                        else {
                            this.heroSpecialEquipPartRedDot[i][part - 1] = false;
                        }
                    }
                    else {
                        if (info.next_id) {
                            var nextInfo = App.ConfigManager.getEquipSpecialById(info.next_id);
                            var cost = nextInfo.item[0]; //消耗
                            var itemInfo = game.BackpackModel.getInstance().getItemByTypeIdUuid(cost[1], cost[0]);
                            if (!itemInfo) {
                                itemInfo = { num: 0 };
                            }
                            if (itemInfo.num >= cost[2]) {
                                this.heroSpecialEquipPartRedDot[i][part - 1] = true;
                            }
                            else {
                                this.heroSpecialEquipPartRedDot[i][part - 1] = false;
                            }
                        }
                        else {
                            this.heroSpecialEquipPartRedDot[i][part - 1] = false;
                        }
                    }
                }
                else {
                    var info = App.ConfigManager.getEquipSpecialByPartLevel(part, 0);
                    if (info.condition && typeof info.condition == "number") {
                        if (info.condition_level) {
                            if (game.BossModel.getInstance().level >= info.condition && App.RoleManager.roleInfo.lv >= info.condition_level) {
                                this.heroSpecialEquipPartRedDot[i][part - 1] = true;
                            }
                            else {
                                this.heroSpecialEquipPartRedDot[i][part - 1] = false;
                            }
                        }
                        else {
                            if (game.BossModel.getInstance().level >= info.condition) {
                                this.heroSpecialEquipPartRedDot[i][part - 1] = true;
                            }
                            else {
                                this.heroSpecialEquipPartRedDot[i][part - 1] = false;
                            }
                        }
                    }
                    else if (info.condition_level) {
                        if (App.RoleManager.roleInfo.lv >= info.condition_level) {
                            this.heroSpecialEquipPartRedDot[i][part - 1] = true;
                        }
                        else {
                            this.heroSpecialEquipPartRedDot[i][part - 1] = false;
                        }
                    }
                }
            }
        };
        //检测特殊装备是否可以升级 所有
        HeroModel.prototype.checkSpecialEquipRedDotAll = function () {
            //初始化
            if (!this.heroSpecialEquipPartRedDot[0]) {
                this.heroSpecialEquipPartRedDot = [
                    [false, false, false, false, false, false],
                    [false, false, false, false, false, false],
                    [false, false, false, false, false, false]
                ];
            }
            for (var i = 1; i <= 6; i++) {
                this.checkSpecialEquipRedDot(i);
            }
            for (var i = 0; i < this.heroSpecialEquipPartRedDot.length; i++) {
                var exist = false;
                for (var k in this.heroSpecialEquipPartRedDot[i]) {
                    if (this.heroSpecialEquipPartRedDot[i][k]) {
                        exist = true;
                        break;
                    }
                }
                if (exist) {
                    this.heroHeadRedDot2[i] = true;
                }
                else {
                    this.heroHeadRedDot2[i] = false;
                }
            }
            App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, false);
            for (var i = 0; i < this.heroHeadRedDot.length; i++) {
                if (this.heroHeadRedDot[i]) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
                }
            }
            for (var i = 0; i < this.heroHeadRedDot2.length; i++) {
                if (this.heroHeadRedDot2[i]) {
                    App.BtnTipManager.setTypeValue(ConstBtnTipType.ROLE_EQUIP, true);
                }
            }
        };
        HeroModel.prototype.clear = function () {
            _super.prototype.clear.call(this);
        };
        HeroModel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return HeroModel;
    }(BaseModel));
    game.HeroModel = HeroModel;
    __reflect(HeroModel.prototype, "game.HeroModel");
})(game || (game = {}));
//# sourceMappingURL=HeroModel.js.map