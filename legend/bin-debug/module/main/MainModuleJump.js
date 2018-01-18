var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 模块间跳转类
 * author：zrj
*/
var MainModuleJump = (function () {
    function MainModuleJump() {
    }
    /**
     * 模块跳转函数，判断能否跳转后自动跳转
     * @param id 模块id，在t_system_open表里，对于某些未配置模块在此函数特殊处理
     * @param callback 模块成功跳转后的callback回调函数
     * @param thisObject 回调函数绑定的this对象
    */
    MainModuleJump.jumpToModule = function (id, callback, thisObject) {
        if (callback === void 0) { callback = null; }
        if (thisObject === void 0) { thisObject = null; }
        var info = App.ConfigManager.getModuleOpenInfoById(id);
        var isOpen = false; //最终结果是否正确开启了模块
        if (!info) {
            return;
        }
        if (App.GuideManager.isModuleOpen(info.client_name)) {
            if (WinName[info.client_name]) {
                isOpen = App.WinManager.openWin(info.client_name);
            }
            else {
                //此处开始特殊处理
                if ("FORGE_STAR" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.FORGE, { type: 2 });
                }
                else if ("FORGE_ORANGE" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.RAIDER, { index: 1 });
                }
                else if ("TRANSMIGRARION" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.HERO, { type: 4 });
                }
                else if ("SKILL" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.HERO, { type: 2 });
                }
                else if ("EQUIP_SPECIAL_SHIELD" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.SHIELD });
                }
                else if ("EQUIP_SPECIAL_SCAPULA" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.ARMOR });
                }
                else if ("EQUIP_SPECIAL_ORNAMENTS" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.ORNAMENT });
                }
                else if ("EQUIP_SPECIAL_HIDDEN" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.KNIF });
                }
                else if ("RING_PARALYSIS" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.PARA_RING });
                }
                else if ("RING_DEFEND" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.BODY_RING });
                }
                else if ("COPY_MATERIAL" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.COPY, { type: ConstCopyType.Material });
                }
                else if ("COPY_TOWER" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.COPY, { type: ConstCopyType.Tower });
                }
                else if ("SHOP_MATERIALS" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.SHOP, { type: ShopType.NORMAL });
                }
                else if ("SHOP_LIMIT" == info.client_name) {
                    isOpen = App.WinManager.openWin(WinName.SHOP, { type: ShopType.LIMIT });
                }
            }
            if (isOpen == undefined) {
                if (callback && thisObject) {
                    callback.call(thisObject);
                }
            }
        }
        else {
            App.GuideManager.moduleNotOpenTip(info.client_name);
        }
    };
    return MainModuleJump;
}());
__reflect(MainModuleJump.prototype, "MainModuleJump");
//# sourceMappingURL=MainModuleJump.js.map