/**
 * 全局常量
 */
//性别
var ConstSex = {
    MAN: 1,
    WOMAN: 2
};
//职业类型
/*
 * NOTCAREER:0,
    SOLDIER:1,
    MAGES:2,
    TAOIST:3,
*/
var CareerType = {
    NOTCAREER: 0,
    SOLDIER: 1,
    MAGES: 2,
    TAOIST: 3,
};
//职业
var ConstCareer = {
    0: "通用",
    1: "战士",
    2: "法师",
    3: "道士",
};
/**
 * 英雄类型
 */
var RoleHeroType = {
    MAIN: 1,
    OTHER: 2,
};
var ConstTextColor = {
    0: 0xe0dedf,
    1: 0x22a322,
    2: 0x318ae4,
    3: 0xbb38ff,
    4: 0xd7852e,
    5: 0xc31e1c,
};
var ConstColorName = {
    0: "白色",
    1: "绿色",
    2: "蓝色",
    3: "紫色",
    4: "橙色",
    5: "红色",
};
//品质
var ConstQuality = {
    WHITE: 0,
    GREEN: 1,
    BLUE: 2,
    PUPLE: 3,
    ORANGE: 4,
    RED: 5,
};
var ConstCareerIcon = {
    1: "com_sign_1_png",
    2: "com_sign_2_png",
    3: "com_sign_3_png",
};
var ConstEquipType = {
    1: "武器",
    2: "衣服",
    3: "头盔",
    4: "项链",
    5: "手镯",
    6: "戒指",
    7: "腰带",
    8: "鞋子",
    9: "麻痹戒指",
    10: "护体戒指",
    11: "",
    12: "",
};
var ConstSpecialEquipType = {
    1: "暗器",
    2: "饰品",
    3: "护盾",
    4: "肩甲",
    5: "麻痹戒指",
    6: "护体戒指",
};
/**
 * 1:"武器",
    2:"衣服",
    3:"头盔",
    4:"项链",
    5:"手镯",
    6:"手镯",
    7:"戒指",
    8:"戒指",
    9:"腰带",
    10:"鞋子",
*/
var ConstEquipPart = {
    WEAPON: 1,
    CLOTH: 2,
    HEAD: 3,
    NECK: 4,
    HAND1: 5,
    HAND2: 6,
    RING1: 7,
    RING2: 8,
    BELT: 9,
    SHOE: 10,
};
/**
 *  1: "暗器",
    2: "饰品",
    3: "护盾",
    4: "肩甲",
    5: "麻痹戒指",
    6: "护体戒指",
*/
var ConstSpecialEquipPart = {
    KNIF: 1,
    ORNAMENT: 2,
    SHIELD: 3,
    ARMOR: 4,
    PARA_RING: 5,
    BODY_RING: 6,
};
var ConstAttribute = {
    hp: "生命",
    hp_rate: "生命",
    mp: "魔法",
    mp_rate: "魔法",
    ac: "物攻",
    ac_rate: "物攻",
    mac: "魔攻",
    mac_rate: "魔攻",
    sc: "道攻",
    sc_rate: "道攻",
    def: "物防",
    def_rate: "物防",
    sdef: "魔防",
    sdef_rate: "魔防",
    hit: "命中",
    hit_rate: "命中",
    dodge: "闪避",
    dodge_rate: "闪避",
    holy: "神圣",
    paralysis: "麻痹",
    damage_reduction_rate: "伤害减免",
    damage_offset_rate: "魔法值抵消伤害",
    relive: "复活",
    damage_deepen: "伤害倍率",
    damage_reduction: "固定值伤害减免",
    attack_add: "固定值伤害增加",
    hp_recover_rate: "生命恢复",
    mp_recover_rate: "魔法恢复",
    crit: "暴击",
    crit_rate: "暴击",
    crit_add: "暴击伤害增加",
    crit_reduction: "暴击伤害减免",
    rcrit: "抗暴",
    rcrit_rate: "抗暴率",
    hp_lv_rate: "生命加成",
    mp_lv_rate: "魔法加成",
    skill_add: "技能伤害加成",
};
var ConstAttributeTwo = {
    hp: "固定血量",
    hp_rate: "固定血量",
    mp: "魔法",
    mp_rate: "魔法",
    ac: "物理攻击",
    ac_rate: "物理攻击",
    mac: "魔法攻击",
    mac_rate: "魔法攻击",
    sc: "道攻",
    sc_rate: "道攻",
    def: "物理防御",
    def_rate: "物理防御",
    sdef: "魔法防御",
    sdef_rate: "魔法防御",
    hit: "命  中",
    hit_rate: "命  中",
    dodge: "闪避",
    dodge_rate: "闪避",
    holy: "神圣",
    paralysis: "麻痹",
    damage_reduction_rate: "伤害减免",
    damage_offset_rate: "魔法值抵消伤害",
    relive: "复活",
    damage_deepen: "伤害倍率",
    damage_reduction: "固定值伤害减免",
    attack_add: "固定值伤害增加",
    hp_recover_rate: "生命恢复",
    mp_recover_rate: "魔法恢复",
    crit: "暴击值",
    crit_rate: "暴击值",
    crit_add: "暴击伤害增加",
    crit_reduction: "暴击伤害减免",
    rcrit: "抗暴",
    rcrit_rate: "抗暴率",
    hp_lv_rate: "生命加成",
    mp_lv_rate: "魔法加成",
    skill_add: "技能伤害加成",
};
var ConstAttributeArray = [
    "占位",
    "hp",
    "hp_rate",
    "mp",
    "mp_rate",
    "ac",
    "ac_rate",
    "mac",
    "mac_rate",
    "sc",
    "sc_rate",
    "def",
    "def_rate",
    "sdef",
    "hit",
    "hit_rate",
    "dodge",
    "dodge_rate",
    "holy",
    "paralysis",
    "damage_reduction_rate",
    "damage_offset_rate",
    "relive",
    "damage_deepen",
    "damage_reduction",
    "attack_add ",
    "hp_recover_rate",
    "mp_recover_rate",
    "crit",
    "crit_rate",
    "crit_add",
    "crit_reduction ",
    "rcrit",
    "rcrit_rate",
    "hp_lv_rate",
    "mp_lv_rate",
    "skill_add",
    "sdef_rate"
];
var PropertyIcon = {
    "1": "common_icon_hunbi_png",
    "2": "common_icon_jinbi_png",
};
var ConstEquipIcon = [
    "占位",
    "forge_equip_wuqi",
    "forge_equip_yifu",
    "forge_equip_toukui",
    "forge_equip_xianglian",
    "forge_equip_shouzhuo",
    "forge_equip_shouzhuo_2",
    "forge_equip_jiezhi",
    "forge_equip_jiezhi_2",
    "forge_equip_yaodai",
    "forge_equip_xiezi",
];
/**
 * 大类类型
*/
var ClientType;
(function (ClientType) {
    ClientType[ClientType["BASE_ITEM"] = 1] = "BASE_ITEM";
    ClientType[ClientType["EQUIP"] = 2] = "EQUIP";
    ClientType[ClientType["CURRENCY"] = 3] = "CURRENCY";
})(ClientType || (ClientType = {}));
//道具类型
var ItemType;
(function (ItemType) {
    ItemType[ItemType["NORMAL"] = 0] = "NORMAL";
    ItemType[ItemType["FUNC"] = 1] = "FUNC";
    ItemType[ItemType["BUFF"] = 2] = "BUFF";
    ItemType[ItemType["EQUIP"] = 3] = "EQUIP";
    ItemType[ItemType["RUBY"] = 4] = "RUBY";
    ItemType[ItemType["WING"] = 5] = "WING";
})(ItemType || (ItemType = {}));
//金钱类型
var CurrencyType;
(function (CurrencyType) {
    CurrencyType[CurrencyType["COIN"] = 1] = "COIN";
    CurrencyType[CurrencyType["GOLD"] = 2] = "GOLD";
    CurrencyType[CurrencyType["EXP"] = 3] = "EXP";
    CurrencyType[CurrencyType["LEVEL"] = 4] = "LEVEL";
    CurrencyType[CurrencyType["TURN_EXP"] = 6] = "TURN_EXP";
    CurrencyType[CurrencyType["TURN"] = 7] = "TURN";
    CurrencyType[CurrencyType["VIP_LV"] = 8] = "VIP_LV";
    CurrencyType[CurrencyType["TITLE"] = 9] = "TITLE";
})(CurrencyType || (CurrencyType = {}));
var ShopType;
(function (ShopType) {
    ShopType[ShopType["MYSTERY"] = 1] = "MYSTERY";
    ShopType[ShopType["LIMIT"] = 2] = "LIMIT";
    ShopType[ShopType["NORMAL"] = 3] = "NORMAL";
})(ShopType || (ShopType = {}));
var JewelType;
(function (JewelType) {
    JewelType[JewelType["ATTACK"] = 1] = "ATTACK";
    JewelType[JewelType["LIFE"] = 2] = "LIFE";
    JewelType[JewelType["DEFENCE"] = 3] = "DEFENCE";
    JewelType[JewelType["MAGIC"] = 4] = "MAGIC";
})(JewelType || (JewelType = {}));
var ConstJewelName = {
    1: "攻击宝石",
    2: "生命宝石",
    3: "物防宝石",
    4: "魔防宝石",
};
var ConstJewelIcon = {
    1: "jewel_icon_red",
    2: "jewel_icon_green",
    3: "jewel_icon_yellow",
    4: "jewel_icon_blue",
};
var ChatType;
(function (ChatType) {
    ChatType[ChatType["ALLCHAT"] = 0] = "ALLCHAT";
    ChatType[ChatType["WORLD"] = 1] = "WORLD";
    ChatType[ChatType["GUILD"] = 2] = "GUILD";
    ChatType[ChatType["SYSTEM"] = 3] = "SYSTEM";
})(ChatType || (ChatType = {}));
var WingEquipType;
(function (WingEquipType) {
    WingEquipType[WingEquipType["ZHENGYU"] = 1] = "ZHENGYU";
    WingEquipType[WingEquipType["FUYU"] = 2] = "FUYU";
    WingEquipType[WingEquipType["RONGYU"] = 3] = "RONGYU";
    WingEquipType[WingEquipType["XUYU"] = 4] = "XUYU";
})(WingEquipType || (WingEquipType = {}));
var ConstWingName = {
    1: "正羽",
    2: "副羽",
    3: "绒羽",
    4: "须羽",
};
var ConstWingIcon = {
    1: "wing_1_icon_zhengyu",
    2: "wing_2_icon_fuyu",
    3: "wing_3_icon_rongyu",
    4: "wing_4_icon_xuyu",
};
var ConstSynthesisType;
(function (ConstSynthesisType) {
    ConstSynthesisType[ConstSynthesisType["JEWEL"] = 1] = "JEWEL";
    ConstSynthesisType[ConstSynthesisType["WING"] = 2] = "WING";
    ConstSynthesisType[ConstSynthesisType["EQUIP"] = 3] = "EQUIP";
    ConstSynthesisType[ConstSynthesisType["ITEM"] = 4] = "ITEM";
})(ConstSynthesisType || (ConstSynthesisType = {}));
//神器品质背景框
var ConstArtifactQuality = {
    2: "Artifact_bg_blue_png",
    3: "Artifact_bg_purple_png",
    4: "Artifact_bg_orange_png",
};
var ConstSceneType;
(function (ConstSceneType) {
    ConstSceneType[ConstSceneType["MAIN"] = 1] = "MAIN";
    ConstSceneType[ConstSceneType["FIELD"] = 2] = "FIELD";
    ConstSceneType[ConstSceneType["BOSS"] = 3] = "BOSS";
})(ConstSceneType || (ConstSceneType = {}));
var MustDoType;
(function (MustDoType) {
    MustDoType[MustDoType["MEDAL"] = 1] = "MEDAL";
    MustDoType[MustDoType["ACTIVITY"] = 2] = "ACTIVITY";
    MustDoType[MustDoType["ACHIEVE"] = 3] = "ACHIEVE";
    MustDoType[MustDoType["TITLE"] = 4] = "TITLE"; //称号
})(MustDoType || (MustDoType = {}));
var ConstRebornExchangeType;
(function (ConstRebornExchangeType) {
    ConstRebornExchangeType[ConstRebornExchangeType["LEVEL"] = 1] = "LEVEL";
    ConstRebornExchangeType[ConstRebornExchangeType["REDUCE"] = 2] = "REDUCE";
    ConstRebornExchangeType[ConstRebornExchangeType["SUPER"] = 3] = "SUPER";
})(ConstRebornExchangeType || (ConstRebornExchangeType = {}));
/**
 * 物品品质框
 */
var QualityFrame = {
    0: "common_frame_white_png",
    1: "common_frame_green_png",
    2: "common_frame_blue_png",
    3: "common_frame_purple_png",
    4: "common_frame_orange_png",
    5: "common_frame_red_png",
};
var WelfareType;
(function (WelfareType) {
    WelfareType[WelfareType["Sign"] = 1] = "Sign";
    WelfareType[WelfareType["Level"] = 2] = "Level";
    WelfareType[WelfareType["Note"] = 3] = "Note";
    WelfareType[WelfareType["Code"] = 4] = "Code";
})(WelfareType || (WelfareType = {}));
WelfareType.Sign;
/**
 * 签到物品状态
 */
var ConstSignItemStatus = {
    hasSigned: "hasSigned",
    canSign: "canSign",
    reSign: "reSign",
    notSign: "notSign"
};
var ConstSignRewardTextColor = [
    0xDDE0DC, 0x07DD21, 0x2C8DEA, 0xB82DDF, 0xBF7B30
];
var ConstMailColor = {
    Y: 0xf1dd00,
    G: 0x00f00b
};
var ConstRankName = {
    COMBAT: "COMBAT",
    LEVEL: "LEVEL",
    FIGHTER: "FIGHTER",
    MAGIC: "MAGIC",
    TAOIST: "TAOIST",
    KILL: "KILL",
    MEMAL: "MEMAL",
    KING: "KING",
};
var ConstRankIndex;
(function (ConstRankIndex) {
    ConstRankIndex[ConstRankIndex["COMBAT"] = 0] = "COMBAT";
    ConstRankIndex[ConstRankIndex["LEVEL"] = 1] = "LEVEL";
    ConstRankIndex[ConstRankIndex["FIGHTER"] = 2] = "FIGHTER";
    ConstRankIndex[ConstRankIndex["MAGIC"] = 3] = "MAGIC";
    ConstRankIndex[ConstRankIndex["TAOIST"] = 4] = "TAOIST";
    ConstRankIndex[ConstRankIndex["KILL"] = 5] = "KILL";
    ConstRankIndex[ConstRankIndex["MEMAL"] = 6] = "MEMAL";
    ConstRankIndex[ConstRankIndex["KING"] = 7] = "KING";
})(ConstRankIndex || (ConstRankIndex = {}));
//const 
/**
 * 主UI顶部按钮常量
 */
var MainUIBtnType = {
    ACTIVITY: 1,
    FIRSTCHARGE: 2,
    MOUTHCARD: 3,
    TREASURE: 4,
    WELFARE: 5,
    MAIL: 6,
    MISSION: 7,
    INVEST: 8,
    FORTUNE: 9,
    WORLDBOSS: 10,
    FASTFIGHT: 11,
    ARENA: 12,
    DALIY: 13,
    METAL: 14,
    COPY: 15,
    WING: 17,
    ROLE: 18,
    BACKPACK: 19,
    ACHIEVE: 20,
    FORGE: 21,
    CHAT: 22,
};
/**
 * 顶部按钮配置信息
 */
var MainUITopListConf = [
    { id: MainUIBtnType.ACTIVITY, icon: "main_icon_huodong_png", btnTipType: ConstBtnTipType.ACTIVITY, winName: "" },
    { id: MainUIBtnType.WELFARE, icon: "main_icon_fuli_png", btnTipType: ConstBtnTipType.WELFARE, winName: WinName.WELFARE },
    { id: MainUIBtnType.WELFARE, icon: "main_icon_gonghui_png", btnTipType: ConstBtnTipType.WELFARE, winName: WinName.WELFARE },
    { id: MainUIBtnType.FORTUNE, icon: "main_icon_xingyunzhuanpan_png", btnTipType: ConstBtnTipType.NULL, winName: WinName.FORTUNE },
    { id: MainUIBtnType.TREASURE, icon: "main_icon_paihangbang_png", btnTipType: ConstBtnTipType.RAIDER, winName: WinName.RANK },
    { id: MainUIBtnType.TREASURE, icon: "main_icon_xunbao_png", btnTipType: ConstBtnTipType.RAIDER, winName: WinName.RAIDER },
];
/**
 * 底部按钮配置信息
 */
var MainUIBottomListConf = [
    { id: MainUIBtnType.ROLE, icon: "main_icon_juese_png", btnTipType: ConstBtnTipType.ROLE, winName: WinName.HERO },
    { id: MainUIBtnType.BACKPACK, icon: "main_icon_beibao_png", btnTipType: ConstBtnTipType.BACKPACK, winName: WinName.BACKPACK },
    { id: MainUIBtnType.FORGE, icon: "main_icon_duanzao_png", btnTipType: ConstBtnTipType.FORGE, winName: WinName.FORGE },
    { id: MainUIBtnType.WING, icon: "main_icon_yuyi_png", btnTipType: ConstBtnTipType.WING, winName: WinName.WING },
    { id: MainUIBtnType.ACHIEVE, icon: "main_icon_chengjiu_png", btnTipType: ConstBtnTipType.WING, winName: WinName.METAL },
];
/**
 * 顶部第二层按钮配置信息
 */
var MainUIMiddleListConf = [
    { id: MainUIBtnType.INVEST, icon: "main_icon_touzi_png", btnTipType: ConstBtnTipType.NULL, winName: WinName.INVEST },
    { id: MainUIBtnType.FIRSTCHARGE, icon: "main_icon_shouchong_png", btnTipType: ConstBtnTipType.NULL, winName: "" },
    { id: MainUIBtnType.MOUTHCARD, icon: "main_icon_yueka_png", btnTipType: ConstBtnTipType.MOUTHCARD, winName: WinName.MONTHCARD },
];
/**
 * 右边按钮配置信息
 */
var MainUIRightListConf = [
    { id: MainUIBtnType.DALIY, icon: "main_icon_richang_png", btnTipType: 0, winName: WinName.MUSTDO },
    { id: MainUIBtnType.COPY, icon: "main_icon_fuben_png", btnTipType: ConstBtnTipType.COPY, winName: WinName.COPY },
];
var ConstArtifactEffect = {
    "boss_coin_rate": "关卡金币加成",
    "boss_exp_rate": "关卡经验加成",
    "all_ac_rate": "角色攻击加成",
    "all_hp_rate": "角色生命加成",
    "damage_reduction_rate ": "角色伤害减免",
    "all_crit_rate": "角色暴击加成",
    "offline_coin_rate": "挂机金币加成",
    "offline_exp_rate": "挂机经验加成",
};
var ConstSpecialEquipEffect = {
    1: "effanqi",
    2: "effshipin",
    3: "effhudun",
    4: "effjianjia",
    5: "effmabi",
    6: "effjiezhi",
};
/**
 * 转盘角度常量
 */
var ConstFortuneWheel = {
    1: 22.5,
    2: 67.5,
    3: 112.5,
    4: 157.5,
    5: 202.5,
    6: 247.5,
    7: 292.5,
    8: 337.5,
};
/**
 * 副本类型
 */
var ConstCopyType;
(function (ConstCopyType) {
    ConstCopyType[ConstCopyType["Boss"] = 0] = "Boss";
    ConstCopyType[ConstCopyType["Material"] = 1] = "Material";
    ConstCopyType[ConstCopyType["Tower"] = 2] = "Tower";
})(ConstCopyType || (ConstCopyType = {}));
//# sourceMappingURL=GlobalConst.js.map