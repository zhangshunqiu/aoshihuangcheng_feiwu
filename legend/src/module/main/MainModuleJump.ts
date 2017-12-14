/**
 * 模块间跳转类
 * author：zrj
*/
class MainModuleJump {

    /**
     * 模块跳转函数，判断能否跳转后自动跳转
     * @param id 模块id，在t_system_open表里，对于某些未配置模块在此函数特殊处理
    */
    public static jumpToModule(id: number) {
        let info = App.ConfigManager.getModuleOpenInfoById(id);
        if (!info) { //不存在此模块，找策划配置
            return;
        }
        if (App.GuideManager.isModuleOpen(info.client_name)) { //判断模块是否开启
            if (WinName[info.client_name]) {  //有此配置
                App.WinManager.openWin(info.client_name);
            } else {
                //此处开始特殊处理
                if ("FORGE_STAR" == info.client_name) { //升星
                    App.WinManager.openWin(WinName.FORGE, { type: 2 });
                } else if ("TRANSMIGRARION" == info.client_name) {  //转生
                    App.WinManager.openWin(WinName.HERO, { type: 4 });
                } else if ("SKILL" == info.client_name) {  //技能
                    App.WinManager.openWin(WinName.HERO, { type: 2 });
                } else if ("EQUIP_SPECIAL_SHIELD" == info.client_name) {  //特殊装备
                    App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.SHIELD });
                } else if ("EQUIP_SPECIAL_SCAPULA" == info.client_name) {  //特殊装备
                    App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.ARMOR });
                } else if ("EQUIP_SPECIAL_ORNAMENTS" == info.client_name) {  //特殊装备
                    App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.ORNAMENT });
                } else if ("EQUIP_SPECIAL_HIDDEN" == info.client_name) {  //特殊装备
                    App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.KNIF });
                } else if ("RING_PARALYSIS" == info.client_name) {  //特殊装备
                    App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.PARA_RING });
                } else if ("RING_DEFEND" == info.client_name) {  //特殊装备
                    App.WinManager.openWin(WinName.EQUIP_SPECIAL, { part: ConstSpecialEquipPart.BODY_RING });
                } else if ("COPY_MATERIAL" == info.client_name) {  //材料副本
                    App.WinManager.openWin(WinName.COPY, {type: ConstCopyType.Material});
                }
            }
        } else {
            App.GuideManager.moduleNotOpenTip(info.client_name);
        }
    }
}