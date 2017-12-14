/**
 * 全局常量
 */

//性别
const ConstSex = {
	MAN: 1,
	WOMAN: 2
}

//职业类型
/*
 * NOTCAREER:0,
	SOLDIER:1,
	MAGES:2,
	TAOIST:3,
*/
const CareerType = {
	NOTCAREER: 0,
	SOLDIER: 1,
	MAGES: 2,
	TAOIST: 3,
}

//职业
const ConstCareer = {
	0: "通用",
	1: "战士",
	2: "法师",
	3: "道士",
}
/**
 * 英雄类型
 */
const RoleHeroType = {
	MAIN: 1,
	OTHER: 2,
}

const ConstTextColor = {
	0: 0xe0dedf,
	1: 0x22a322,
	2: 0x318ae4,
	3: 0xbb38ff,
	4: 0xd7852e,
	5: 0xc31e1c,
}

const ConstColorName = {
	0: "白色",
	1: "绿色",
	2: "蓝色",
	3: "紫色",
	4: "橙色",
	5: "红色",
}

//品质
const ConstQuality = {
	WHITE: 0,
	GREEN: 1,
	BLUE: 2,
	PUPLE: 3,
	ORANGE: 4,
	RED: 5,
}

const ConstCareerIcon = {
	1: "equipping_zhan",
	2: "equipping_fa",
	3: "equipping_dao",
}

const ConstEquipType = {
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
}

const ConstSpecialEquipType = {
	1: "暗器",
	2: "饰品",
	3: "护盾",
	4: "肩甲",
	5: "麻痹戒指",
	6: "护体戒指",
}

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
const ConstEquipPart = {
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
}

/**
 *  1: "暗器",
	2: "饰品",
	3: "护盾",
	4: "肩甲",
	5: "麻痹戒指",
	6: "护体戒指",
*/
const ConstSpecialEquipPart = {
	KNIF: 1,
	ORNAMENT: 2,
	SHIELD: 3,
	ARMOR: 4,
	PARA_RING: 5,
	BODY_RING: 6,
}

const ConstAttribute = {
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
}

const ConstAttributeArray = [
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
	"skill_add"
]
const PropertyIcon = {
	"1": "common_icon_hunbi_png",//钻石
	"2": "common_icon_jinbi_png",//金币
}

const ConstEquipIcon = [
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
]

const enum BaseTipsStyle {
	COMMON = 0,             //取消、确定
	ONLY_OK = 1,             //只有居中一个确定
}

const enum MainModuleStyle {
	ALL_SHOW = 0,
	ONLY_HEAD = 1,
	ONLY_BOTTOM = 2,
	NOTING = 3,
	BOTTOM_SMALL_HEAD = 4,
}

/**
 * 大类类型
*/
enum ClientType {
	BASE_ITEM = 1,
	EQUIP,
	CURRENCY,

}

//道具类型
enum ItemType {
	NORMAL = 0,
	FUNC,
	BUFF,
	EQUIP,
	RUBY,
	WING,
}

//金钱类型
enum CurrencyType {
	COIN = 1,
	GOLD,
	EXP,
	LEVEL,
	TURN_EXP = 6,
	TURN,
	VIP_LV,
}

enum ShopType {
	MYSTERY = 1,
	LIMIT,
	NORMAL
}

enum JewelType {
	ATTACK = 1,
	LIFE,
	DEFENCE,
	MAGIC,
}

const ConstJewelName = {
	1: "攻击宝石",
	2: "生命宝石",
	3: "物防宝石",
	4: "魔防宝石",
}

const ConstJewelIcon = {
	1: "jewel_l_gongji",
	2: "jewel_l_shengming",
	3: "jewel_l_wufang",
	4: "jewel_l_mofang",
}

enum ChatType {
	ALLCHAT,
	WORLD,
	GUILD,
	SYSTEM,

}

enum WingEquipType {
	ZHENGYU = 1,
	FUYU,
	RONGYU,
	XUYU,
}

const ConstWingName = {
	1: "正羽",
	2: "副羽",
	3: "绒羽",
	4: "须羽",
}

const ConstWingIcon = {
	1: "wing_1_icon_zhengyu",
	2: "wing_2_icon_fuyu",
	3: "wing_3_icon_rongyu",
	4: "wing_4_icon_xuyu",
}

enum ConstSynthesisType {
	JEWEL = 1,
	WING,
	EQUIP,
	ITEM
}

//神器品质背景框
const ConstArtifactQuality = {
	2: "Artifact_bg_blue_png",
	3: "Artifact_bg_purple_png",
	4: "Artifact_bg_orange_png",
}

enum ConstSceneType {
	MAIN = 1, //主城
	FIELD, //野外挂机
	BOSS, //挑战boss
}

enum MustDoType {
	MEDAL = 1,//勋章
	ACTIVITY,//活跃任务
	ACHIEVE,//成就
	TITLE//称号
}

enum ConstRebornExchangeType {
	LEVEL = 1,
	REDUCE,
	SUPER,
}

/**
 * 物品品质框
 */
const QualityFrame = {
	0: "common_frame_white_png",
	1: "common_frame_green_png",
	2: "common_frame_blue_png",
	3: "common_frame_purple_png",
	4: "common_frame_orange_png",
	5: "common_frame_red_png",
}

enum WelfareType {

	Sign = 1,
	Level,
	Note,
	Code,
}
WelfareType.Sign
/**
 * 签到物品状态
 */
const ConstSignItemStatus = {
	hasSigned: "hasSigned",
	canSign: "canSign",
	reSign: "reSign",
	notSign: "notSign"
}

const ConstSignRewardTextColor = [
	0xDDE0DC, 0x07DD21, 0x2C8DEA, 0xB82DDF, 0xBF7B30
]

const ConstMailColor = {
	Y: 0xf1dd00,//
	G: 0x00f00b
}

const ConstRankName = {
	COMBAT:"COMBAT",
	LEVEL:"LEVEL",
	FIGHTER:"FIGHTER",
	MAGIC:"MAGIC",
	TAOIST:"TAOIST",
	KILL:"KILL",
	MEMAL:"MEMAL",
	KING:"KING",
}
enum ConstRankIndex {
	COMBAT =0,
	LEVEL,
	FIGHTER,
	MAGIC,
	TAOIST,
	KILL,
	MEMAL,
	KING,
}
/**
 * 主UI顶部按钮常量
 */
const MainUIBtnType={
	ACTIVITY:1,
	FIRSTCHARGE:2,
	MOUTHCARD:3,
	TREASURE:4,
	WELFARE:5,
	MAIL:6,
	MISSION:7,
	INVEST:8,
	FORTUNE:9,

	ROLE:18,
	BACKPACK:19,
	ACHIEVE:20,
	FORGE:21,

	CHAT:22,
}
/**
 * 顶部按钮配置信息
 */
const MainUITopListConf:Array<any> = [
	{id:MainUIBtnType.ACTIVITY,icon:"main_icon_huodong_png",btnTipType:ConstBtnTipType.NULL,winName:""},//活动
	{id:MainUIBtnType.FIRSTCHARGE,icon:"main_icon_shouchong_png",btnTipType:ConstBtnTipType.NULL,winName:""},//首充
	{id:MainUIBtnType.MOUTHCARD,icon:"main_icon_yueka_png",btnTipType:ConstBtnTipType.MOUTHCARD,winName:WinName.MONTHCARD},//月卡
	{id:MainUIBtnType.TREASURE,icon:"main_icon_xunbao_png",btnTipType:ConstBtnTipType.NULL,winName:WinName.RAIDER},//寻宝
	{id:MainUIBtnType.WELFARE,icon:"main_icon_fuli_png",btnTipType:ConstBtnTipType.WELFARE,winName:WinName.WELFARE},//福利
	{id:MainUIBtnType.MAIL,icon:"main_icon_youjian_png",btnTipType:ConstBtnTipType.MAIL,winName:WinName.MAIL},//邮件
	{id:MainUIBtnType.MISSION,icon:"main_icon_renwu_png",btnTipType:ConstBtnTipType.TASK,winName:WinName.MUSTDO},//任务
	{id:MainUIBtnType.INVEST,icon:"main_icon_touzi_png",btnTipType:ConstBtnTipType.NULL,winName:WinName.INVEST},//投资
	// {id:MainUIBtnType.INVEST,icon:"main_icon_jingji_png",btnTipType:ConstBtnTipType.NULL,winName:WinName.HEGEMONY},//争霸
	{id:MainUIBtnType.FORTUNE,icon:"main_icon_xunbao_png",btnTipType:ConstBtnTipType.NULL,winName:WinName.FORTUNE},//聚宝盘
	
];

/**
 * 底部按钮配置信息
 */
const MainUIBottomListConf:Array<any> = [
	{id:MainUIBtnType.ROLE,icon:"main_icon_juese_png",btnTipType:ConstBtnTipType.ROLE,winName:WinName.HERO},//角色
	{id:MainUIBtnType.BACKPACK,icon:"main_icon_beibao_png",btnTipType:ConstBtnTipType.BACKPACK,winName:WinName.BACKPACK},//背包
	{id:MainUIBtnType.FORGE,icon:"main_icon_duanzao_png",btnTipType:ConstBtnTipType.FORGE,winName:WinName.FORGE},//锻造
	{id:MainUIBtnType.ACHIEVE,icon:"main_icon_yuyi_png",btnTipType:ConstBtnTipType.WING,winName:WinName.WING},//翅膀
];

const ConstArtifactEffect = {
	"boss_coin_rate": "关卡金币加成",
	"boss_exp_rate": "关卡经验加成",
	"all_ac_rate" : "角色攻击加成",
	"all_hp_rate": "角色生命加成",
	"damage_reduction_rate ": "角色伤害减免",
	"all_crit_rate": "角色暴击加成",
	"offline_coin_rate": "挂机金币加成",
	"offline_exp_rate": "挂机经验加成",
}

const ConstSpecialEquipEffect = {
	1:"effanqi",
	2:"effshipin",
	3:"effhudun",
	4:"effjianjia",
	5:"effmabi",
	6:"effjiezhi",
}

/**
 * 转盘角度常量
 */
const ConstFortuneWheel = {
	1:22.5,
	2:67.5,
	3:112.5,
	4:157.5,
	5:202.5,
	6:247.5,
	7:292.5,
	8:337.5,
}

/**
 * 副本类型
 */
enum ConstCopyType {
	Boss=0,
	Material,
	Tower,
}