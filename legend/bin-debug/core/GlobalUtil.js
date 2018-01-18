var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GlobalUtil = (function () {
    function GlobalUtil() {
    }
    /**
     * 获取当前时间戳
     */
    GlobalUtil.getTimer = function () {
        return GlobalModel.getInstance().getTimer();
    };
    GlobalUtil.fixNum = function (num) {
        if (num / 100000000 >= 1) {
            var _num = num / 100000000;
            var _str = _num.toFixed(2);
            return _str.substring(0, _str.lastIndexOf(".") + 2) + "亿"; //之所以这样做是为了小数点位不要四舍五入
        }
        else if (num / 100000 >= 1) {
            var _num = num / 10000;
            var _str = _num.toFixed(2);
            return _str.substring(0, _str.lastIndexOf(".") + 2) + "万"; //之所以这样做是为了小数点位不要四舍五入
        }
        else {
            return num + "";
        }
    };
    //3: 传入秒数，返回00:00格式的字符串
    GlobalUtil.getFormatBySecond1 = function (t) {
        if (t === void 0) { t = 0; }
        var hourst = Math.floor(t / 3600);
        var minst = Math.floor((t - hourst * 3600) / 60);
        var secondt = Math.floor((t - hourst * 3600) % 60);
        var hors;
        var mins;
        var sens;
        if (hourst == 0) {
            hors = "00";
        }
        else if (hourst < 10) {
            hors = "0" + hourst;
        }
        else {
            hors = "" + hourst;
        }
        if (minst == 0) {
            mins = "00";
        }
        else if (minst < 10) {
            mins = "0" + minst;
        }
        else {
            mins = "" + minst;
        }
        if (secondt == 0) {
            sens = "00";
        }
        else if (secondt < 10) {
            sens = "0" + secondt;
        }
        else {
            sens = "" + secondt;
        }
        return hors + ":" + mins + ":" + sens;
    };
    /**
     * @param 传入秒数
     * XX天XX小时XX分钟 时间格式
     */
    GlobalUtil.getFormatBySecond2 = function (t) {
        if (t === void 0) { t = 0; }
        var days = Math.floor(t / 60 / 60 / 24); //计算剩余的天数 
        var hours = Math.floor(t / 60 / 60 % 24); //计算剩余的小时 
        var minst = Math.floor(t / 60 % 60); //计算剩余的分钟 
        var dys;
        var hors;
        var mins;
        if (days == 0) {
            dys = "00";
        }
        else if (days < 10) {
            dys = "0" + days;
        }
        else {
            dys = "" + days;
        }
        if (hours == 0) {
            hors = "00";
        }
        else if (hours < 10) {
            hors = "0" + hours;
        }
        else {
            hors = "" + hours;
        }
        if (minst == 0) {
            mins = "00";
        }
        else if (minst < 10) {
            mins = "0" + minst;
        }
        else {
            mins = "" + minst;
        }
        return dys + "天" + hors + "小时" + mins + "分钟";
    };
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    GlobalUtil.forEach = function (arr, func, funcObj) {
        for (var i = 0, len = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    };
    /**
     * 根据type id 获取配置基本信息
    */
    GlobalUtil.getInfoByTypeId = function (type, id) {
        var info = undefined;
        switch (type) {
            case 0: {
                info = App.ConfigManager.itemConfig()[id];
                break;
            }
            case 1: {
                info = App.ConfigManager.itemConfig()[id];
                break;
            }
            case 2: {
                info = App.ConfigManager.itemConfig()[id];
                break;
            }
            case 3: {
                info = App.ConfigManager.equipConfig()[id];
                break;
            }
        }
        return info;
    };
    //天梯争霸
    GlobalUtil.getTierIcon = function (tier) {
        switch (tier) {
            case 1:
                return "labber_huizhang_qingtong_png";
            case 2:
                return "labber_huizhang_baiyin_png";
            case 3:
                return "labber_huizhang_huangjin_png";
            case 4:
                return "labber_huizhang_zuanshi_png";
        }
        return "";
    };
    GlobalUtil.getTierLvName = function (lv) {
        var str = "";
        switch (lv) {
            case 1:
                str = "一阶";
                break;
            case 2:
                str = "二阶";
                break;
            case 3:
                str = "三阶";
                break;
            case 4:
                str = "四阶";
                break;
            case 5:
                str = "五阶";
                break;
        }
        return str;
    };
    GlobalUtil.getTierName = function (tier) {
        var str = "";
        switch (tier) {
            case 1:
                str = "倔强青铜";
                break;
            case 2:
                str = "秩序白银";
                break;
            case 3:
                str = "荣耀黄金";
                break;
            case 4:
                str = "永恒钻石";
                break;
        }
        return str;
    };
    GlobalUtil.getCareerPic = function (sex, career) {
        switch (career) {
            case CareerType.SOLDIER:
                if (sex == ConstSex.MAN)
                    return "10001_png";
                else
                    return "10002_png";
            case CareerType.MAGES:
                if (sex == ConstSex.MAN)
                    return "20001_png";
                else
                    return "20002_png";
            case CareerType.TAOIST:
                if (sex == ConstSex.MAN)
                    return "30001_png";
                else
                    return "30001_png";
        }
    };
    /**
     * 挑战boss前检查背包容量是否小于20，小于则弹出熔炼提示框，并返回true
     * @return {boolean}
     */
    GlobalUtil.checkBagCapacity = function () {
        if (game.BackpackModel.getInstance().getRemindCapacity() < 20) {
            var textFlow = [{ text: "背包空间不足", style: { textColor: 0xffffff } }, { text: "20", style: { textColor: 0xf10000 } }, { text: "，请先清理", style: { textColor: 0xffffff } }, { text: "背包", style: { textColor: 0xf10000 } }];
            App.GlobalTips.showAlert({ style: 1 /* ONLY_OK */, textFlow: textFlow, okCB: function () { App.WinManager.openPopWin(WinName.POP_SMELT); }, cbThisObject: this, okLab: "熔 炼", okCdTime: 20 });
            return true;
        }
        return false;
    };
    return GlobalUtil;
}());
__reflect(GlobalUtil.prototype, "GlobalUtil");
//# sourceMappingURL=GlobalUtil.js.map