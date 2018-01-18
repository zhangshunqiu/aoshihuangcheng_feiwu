/**
 * 模块间跳转类
 * author：zrj
*/
class MainModuleJump {

    /**
     * 模块跳转函数，判断能否跳转后自动跳转
     * @param id 模块id，在t_system_open表里，对于某些未配置模块在此函数特殊处理
     * @param callback 模块成功跳转后的callback回调函数
     * @param thisObject 回调函数绑定的this对象
    */
    public static jumpToModule(id: number,callback: Function = null,thisObject: any = null) {
        let info = App.ConfigManager.getModuleOpenInfoById(id);
        let isOpen = false; //最终结果是否正确开启了模块
        if (!info) { //不存在此模块，找策划配置
            return;
        }
        if (App.GuideManager.isModuleOpen(info.client_name)) { //判断模块是否开启
            if (WinName[info.client_name]) {  //有此配置
                isOpen = App.WinManager.openWin(info.client_name);
            } else {
                //此处开始特殊处理
                if ("FORGE_STAR" == info.client_name) { //升星
                    isOpen = App.WinManager.openWin(WinName.FORGE, { type: 2 });
                } else if ("FORGE_ORANGE" == info.client_name) { //橙装升级
                    isOpen = App.WinManager.openWin(WinName.RAIDER, { index: 1 });
                } else if ("TRANSMIGRARION" == info.client_name) {  //转生
                    isOpen = App.WinManager.openWin(WinName.HERO, { type: 4 });
                } else if ("SKILL" == info.client_name) {  //技能
                    isOpen = App.WinManager.openWin(WinName.HERO, { type: 2 });
                } else if ("EQUIP_SPECIAL_SHIELD" == info.client_name) {  //特殊装备
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.SHIELD });
                } else if ("EQUIP_SPECIAL_SCAPULA" == info.client_name) {  //特殊装备
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.ARMOR });
                } else if ("EQUIP_SPECIAL_ORNAMENTS" == info.client_name) {  //特殊装备
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.ORNAMENT });
                } else if ("EQUIP_SPECIAL_HIDDEN" == info.client_name) {  //特殊装备
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.KNIF });
                } else if ("RING_PARALYSIS" == info.client_name) {  //特殊装备
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.PARA_RING });
                } else if ("RING_DEFEND" == info.client_name) {  //特殊装备
                    isOpen = App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.BODY_RING });
                } else if ("COPY_MATERIAL" == info.client_name) {  //材料副本
                    isOpen = App.WinManager.openWin(WinName.COPY, {type: ConstCopyType.Material});
                } else if ("COPY_TOWER" == info.client_name) {  //挑战副本
                    isOpen = App.WinManager.openWin(WinName.COPY, {type: ConstCopyType.Tower})
                } else if ("SHOP_MATERIALS" == info.client_name) {  //道具商店
                    isOpen = App.WinManager.openWin(WinName.SHOP, {type: ShopType.NORMAL});
                } else if ("SHOP_LIMIT" == info.client_name) {  //限购商店
                    isOpen = App.WinManager.openWin(WinName.SHOP, {type: ShopType.LIMIT});
                }
            }
            if (isOpen == undefined) {  //开启了 undefined代表打开了没有返回
                if (callback && thisObject) {  //回调
                    callback.call(thisObject);
                }
            }
        } else {
            App.GuideManager.moduleNotOpenTip(info.client_name);
        }
    }
}