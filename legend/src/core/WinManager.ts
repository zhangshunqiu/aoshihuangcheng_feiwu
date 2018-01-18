/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 窗口管理 2017/09/20.
 */
const WinName = {
	TEST: "TEST",   //debug
	LOGIN: "LOGIN", //登录
	MAIN: "MAIN",  //主界面
	MAIL: "MAIL", //邮件窗口
	MAIN_BOTTOM: "MAIN_BOTTOM", //主界面下方按钮
	FIGHT: "FIGHT",
	EQUIP: "EQUIP",   //装备
	HERO: "HERO",     //英雄
	BACKPACK: "BACKPACK", //背包
	BROADCAST: "BROADCAST",  //广播
	// SMELT: "SMELT",     //熔炼
	// SMELT_ORANGE: "SMELT_ORANGE",  //熔炼橙装
	FORGE: "FORGE",     //锻造
	SHOP: "SHOP",     //商城
	BOSS: "BOSS",    //boss模块
	BOSS_WIN: "BOSS_WIN",   //挑战boss胜利窗口
	BOSS_LOSE: "BOSS_LOSE",  //挑战boss失败窗口
	BOSS_COMING: "BOSS_COMING",   //boss来袭特效窗口
	INCOME_PROMOTE: "INCOME_PROMOTE",  //关卡收益提升
	WING: "WING",  //翅膀模块
	CHAT: "CHAT",  //聊天窗口
	CHAT_ICON_TIP:"CHAT_ICON_TIP",//聊天的查看屏蔽小窗
	WING_STEP_TIP: "WING_STEP_TIP",  //羽翼直升丹提示窗口
	WING_EQUIP_TIP: "WING_EQUIP_TIP",  //羽翼装备提示窗口
	JEWEL: "JEWEL",       //宝石
	SYNTHESIS: "SYNTHESIS",  //合成
	WING_PERFECT_TIP: "WING_PERFECT_TIP",  //完美羽翼提示窗口
	WING_SKILL: "WING_SKILL",  //羽翼技能提示窗口
	MUSTDO: "MUSTDO",         //任务窗口
	MUSTDO_UNTAKE: "MUSTDO_UNTAKE",//领取未完成成就窗口
	MUSTDO_LIGHTEN: "MUSTDO_LIFHTEN",//称号点亮细节窗口
	MUSTDO_TITLEDETAIL: "MUSTDO_TITLEDETAIL",//称号详细信息窗口
	// FORGE_ORANGE: "FORGE_ORANGE",  //橙装升级
	VIP: "VIP",  //Vip窗口
	WELFARE: "WELFARE",//福利窗口
	RAIDER: "RAIDER",  //夺宝
	LOGIN_NOTICE: "LOGIN_NOTICE",  //公告
	MONTHCARD: "MONTHCARD",  //月卡
	MONTHCARD_INFO_TIP: "MONTHCARD_INFO_TIP",  //月卡详情
	MONTHCARD_DAILY_REWARD: "MONTHCARD_DAILY_REWARD",  //月卡每日奖励弹窗
	MONTHCARD_BUY_REWARD: "MONTHCARD_BUY_REWARD",  //月卡购买奖励
	EQUIP_SPECIAL: "EQUIP_SPECIAL",    //特殊装备
	RANK: "RANK",//排行榜界面
	BOSS_MEET: "BOSS_MEET",   //随机遭遇boss
	ARTIFACT: "ARTIFACT",     //神器
	ACTIVITY: "ACTIVITY",  //开服活动
	COPY: "COPY",  //副本系统
	INVEST: "INVEST",//投资窗口	
	RECHARGE_FIRST: "RECHARGE_FIRST",//首次冲值页面
	RECHARGE: "RECHARGE",//充值页面
	FORTUNE: "FORTUNE",//幸运转盘
	HEGEMONY: "HEGEMONY", //天梯争霸（竞技场）
	HEGEMONY_LABBER_TIPS: "HEGEMONY_LABBER_TIPS",//天梯玩法提示（竞技场）
	HEGEMONY_LABBER_REWARD: "HEGEMONY_LABBER_REWARD",//天梯奖励（竞技场）
	HEGEMONY_LABBER_RESULT: "HEGEMONY_LABBER_RESULT",//战斗结果		
	WORLDBOSS: "WORLDBOSS",  //世界boss主界面
	WORLDBOSS_KILL_RECORD: "WORLDBOSS_KILL_RECORD",  //世界boss击杀记录弹窗
	WORLDBOSS_REWARD: "WORLDBOSS_REWARD",  //世界boss奖励介绍	 
	WORLDBOSS_FIGHT: "WORLDBOSS_FIGHT",   //挑战世界boss时
	WORLDBOSS_CHEER: "WORLDBOSS_CHEER",   //挑战世界boss时助威
	WORLDBOSS_BUY_TIMES: "WORLDBOSS_BUY_TIMES",  //世界boss购买次数
	// ENCOUNTER_REWARD:"ENCOUNTER_REWARD",//遭遇战每日奖励界面
	WORLDBOSS_REVIVE: "WORLDBOSS_REVIVE",  //世界boss复活
	ENCOUNTER_REWARD: "ENCOUNTER_REWARD",//遭遇战每日奖励界面
	ENCOUNTER_LOGS: "ENCOUNTER_LOGS",//遭遇战战斗记录
	COUNTERDOWN: "COUNTERDOWN",
	METAL: "METAL",//勋章
	RankGuanqia: "RankGuanqia",//关卡榜界面


	POP_MAILDETAIL: "POP_MAILDETAIL",//邮件弹窗
	POP_RANK_QUESTION: "POP_RANK_QUESTION",//排行榜提示框弹窗
	POP_SIGN_VIP: "POP_SIGN_VIP",//签到VIP充值提示弹窗
	CHATPORT: "CHATPORT",//主界面聊天窗口

	ITEMTIPS: "ITEMTIPS",   //物品弹窗
	ITEMWAYS: "ITEMWAYS",   //获取物品途径弹窗
	ALERTTIPS: "ALERTTIPS",   //通用提示弹框

	POP_SYNTHESISSUCCESS: "POP_SYNTHESISSUCCESS",  //合成成功弹窗
	POP_SHOP_BUY: "POP_SHOP_BUY",  //商城购买数量选择弹窗
	POP_REBORN_POINT: "POP_REBORN_POINT",  //转生获取修为弹窗
	POP_RAIDER_REWARD: "POP_RAIDER_REWARD",  //寻宝奖励弹窗
	POP_EQUIPSPECIAL_TIP: "POP_EQUIPSPECIAL_TIP",  //特殊装备提示弹窗
	POP_FAST_FIGHT: "POP_FAST_FIGHT",  //快速战斗提示弹窗
	POP_FAST_FIGHT_RESULT: "POP_FAST_FIGHT_RESULT",  //快速战斗结算弹窗
	POP_Encounter_Reward:"POP_Encounter_Reward",//遭遇战每日奖励界面
	POP_PLAYER_MSG:"POP_PLAYER_MSG",//查看玩家信息界面
	POP_PLAYER_HERO_ATTR:"POP_PLAYER_HERO_ATTR",//查看玩家信息英雄属性界面
	POP_OFFLINE_RESULT: "POP_OFFLINE_RESULT",  //离线战斗结算弹窗
	POP_FORGE_STAR: "POP_FORGE_STAR",  //锻造星级弹窗
	POP_FORGE_EQUIP: "POP_FORGE_EQUIP",  //锻造装备信息弹窗
	POP_EQUIP_SELECT: "POP_EQUIP_SELECT",  //装备选择弹窗
	POP_JEWEL_TIP: "POP_JEWEL_TIP",  //宝石信息弹窗
	POP_JEWEL_MASTER: "POP_JEWEL_MASTER",  //宝石大师弹窗
	POP_JEWEL_SUPER: "POP_JEWEL_SUPER",  //宝石超级属性弹窗
	POP_LOGIN_SERVER: "POP_LOGIN_SERVER",  //登录服务器弹窗
	POP_LOGIN_CREATE: "POP_LOGIN_CREATE",  //登录创角弹窗
	POP_INVEST_TIPS:"POP_INVEST_TIPS",//投资提示弹窗
	POP_FORTUNE_RESULT:"POP_FORTUNE_RESULT",//转盘结果弹窗
	POP_SMELT:"POP_SMELT",//熔炼弹窗
	POP_SMELT_ORANGE: "POP_SMELT_ORANGE",  //熔炼橙装
	POP_SHOP_PREVIEW:"POP_SHOP_PREVIEW",//商店极品预览
}

class WinManager {
	private _winDic: any = {};//窗口字典
	private _winConfig: any = {};//窗口配置文件
	private _winPopConfig: any = {};
	private _eventSystem: EventSystem;
	private _moduleArray: Array<any> = []; //全屏窗口显示队列


	private static _instance: WinManager;
	public static getInstance(): WinManager {
		if (this._instance == null) {
			this._instance = new WinManager();
		}
		return this._instance;
	}
	public constructor() {
		this._eventSystem = EventSystem.getInstance();
		this._winConfig = {
			[WinName.TEST]: new WinManagerVO(WinName.TEST, "game.TestView", WinLay.PANEL_LAY, "TestSkin", []),
			[WinName.LOGIN]: new WinManagerVO(WinName.LOGIN, "game.LoginUI", WinLay.MODULE_LAY, "LoginSkin", ["login"]),
			[WinName.MAIN]: new WinManagerVO(WinName.MAIN, "game.MainUI", WinLay.MAIN_UI_LAY, "MainUISkin", [], "", null, true),
			[WinName.MAIN_BOTTOM]: new WinManagerVO(WinName.MAIN_BOTTOM, "game.MainBottom", WinLay.BOTTOM_LAY, "MainBottomSkin", []),
			[WinName.EQUIP]: new WinManagerVO(WinName.EQUIP, "game.EquipView", WinLay.PANEL_LAY, "EquipSkin", [], "", null, true, false, false, 1, 1),
			[WinName.HERO]: new WinManagerVO(WinName.HERO, "game.HeroView", WinLay.MODULE_LAY, "HeroSkin", [], "equipping_juese_title_png", null, true, true, false, 0, 0),
			[WinName.BACKPACK]: new WinManagerVO(WinName.BACKPACK, "game.BackpackView", WinLay.MODULE_LAY, "BackpackSkin", [], "bag_pic_bb_png", null, true,true, false, 0, 0),
			[WinName.FIGHT]: new WinManagerVO(WinName.FIGHT, "game.FightScene", WinLay.SCENE_LAY, "FightSkin", []),
			[WinName.BROADCAST]: new WinManagerVO(WinName.BROADCAST, "game.BroadcastView", WinLay.SCENE_UI_LAY, "BroadcastSkin", [], "", null, false),
			// [WinName.SMELT]: new WinManagerVO(WinName.SMELT, "game.SmeltView", WinLay.MODULE_LAY, "SmeltSkin", [], "", { y: 64 }, false),
			[WinName.FORGE]: new WinManagerVO(WinName.FORGE, "game.ForgeView", WinLay.MODULE_LAY, "ForgeSkin", [], "forge_qianghua_title_png", { y: 0 }, false),
			[WinName.SHOP]: new WinManagerVO(WinName.SHOP, "game.ShopView", WinLay.MODULE_LAY, "ShopSkin", [],"shop_shangcheng_title_png", { y: 0 }, false),
			[WinName.BOSS]: new WinManagerVO(WinName.BOSS, "game.BossView", WinLay.MODULE_LAY, "BossSkin", []),
			[WinName.BOSS_WIN]: new WinManagerVO(WinName.BOSS_WIN, "game.BossWin", WinLay.PANEL_LAY, "BossWin", []),
			[WinName.BOSS_LOSE]: new WinManagerVO(WinName.BOSS_LOSE, "game.BossLose", WinLay.PANEL_LAY, "BossLose", []),
			[WinName.INCOME_PROMOTE]: new WinManagerVO(WinName.INCOME_PROMOTE, "game.incomePromote", WinLay.MODULE_LAY, "incomePromote", []),
			[WinName.WING]: new WinManagerVO(WinName.WING, "game.WingAllView", WinLay.MODULE_LAY, "WingAllSkin", [], "wing_pic_title_png", null, true, true),
			[WinName.WING_STEP_TIP]: new WinManagerVO(WinName.WING_STEP_TIP, "game.goStepTip", WinLay.PANEL_LAY, "goStepTip", [], "", {}, true, false, false, 1),
			[WinName.CHAT]: new WinManagerVO(WinName.CHAT, "game.ChatView", WinLay.MODULE_LAY, "ChatSkin", [], "", { y: 64 }, false),
			[WinName.CHAT_ICON_TIP]: new WinManagerVO(WinName.CHAT_ICON_TIP, "game.ChatIconTipsView", WinLay.BOTTOM_LAY, "ChatIconTipsSkin", []),
			[WinName.JEWEL]: new WinManagerVO(WinName.JEWEL, "game.JewelView", WinLay.MODULE_LAY, "JewelSkin", [], "jewel_sign_title_png", null, true,true),
			[WinName.WING_EQUIP_TIP]: new WinManagerVO(WinName.WING_EQUIP_TIP, "game.WingEquipTip", WinLay.BOTTOM_LAY, "WingEquipTip", []),
			[WinName.SYNTHESIS]: new WinManagerVO(WinName.SYNTHESIS, "game.SynthesisView", WinLay.MODULE_LAY, "SynthesisSkin", [], "", { y: 64 }, true),
			[WinName.WING_PERFECT_TIP]: new WinManagerVO(WinName.WING_PERFECT_TIP, "game.WingPerfectTip", WinLay.BOTTOM_LAY, "WingPerfect", []),
			[WinName.WING_SKILL]: new WinManagerVO(WinName.WING_SKILL, "game.WingEquipSkill", WinLay.BOTTOM_LAY, "WingEquipSkill", []),
			[WinName.MUSTDO]: new WinManagerVO(WinName.MUSTDO, "game.MustDoView", WinLay.MODULE_LAY, "MustDoSkin", []),
			[WinName.MUSTDO_UNTAKE]: new WinManagerVO(WinName.MUSTDO_UNTAKE, "game.MustDoUnTakeView", WinLay.BOTTOM_LAY, "UnTakeAchieveSkin", []),
			[WinName.MUSTDO_LIGHTEN]: new WinManagerVO(WinName.MUSTDO_LIGHTEN, "game.MustDoLightenView", WinLay.BOTTOM_LAY, "MustDoLightenSkin", []),
			[WinName.MUSTDO_TITLEDETAIL]: new WinManagerVO(WinName.MUSTDO_TITLEDETAIL, "game.MustDoTitleDetailView", WinLay.BOTTOM_LAY, "MustDoTitleDetailSkin", []),
			[WinName.MAIL]: new WinManagerVO(WinName.MAIL, "game.MailView", WinLay.MODULE_LAY, "MailViewSkin", [], "", { y: 64 }),
			// [WinName.FORGE_ORANGE]: new WinManagerVO(WinName.FORGE_ORANGE, "game.ForgeOrangeView", WinLay.MODULE_LAY, "ForgeOrangeEquipSkin", [], "", { y: 64 }),
			[WinName.VIP]: new WinManagerVO(WinName.VIP, "game.VipView", WinLay.MODULE_LAY, "VipSkin", [], "", { y: 5 }),
			[WinName.WELFARE]: new WinManagerVO(WinName.WELFARE, "game.WelfareView", WinLay.MODULE_LAY, "WelfareSkin", []),
			[WinName.RAIDER]: new WinManagerVO(WinName.RAIDER, "game.RaiderView", WinLay.MODULE_LAY, "RaiderSkin", [], "", { y: 64 }),
			[WinName.LOGIN_NOTICE]: new WinManagerVO(WinName.LOGIN_NOTICE, "game.LoginNoticeView", WinLay.BOTTOM_LAY, "LoginNoticeSkin", []),
			[WinName.MONTHCARD]: new WinManagerVO(WinName.MONTHCARD, "game.MonthCardView", WinLay.MODULE_LAY, "MonthCardSkin", []),
			[WinName.MONTHCARD_INFO_TIP]: new WinManagerVO(WinName.MONTHCARD_INFO_TIP, "game.MonthCardInfoTip", WinLay.BOTTOM_LAY, "MonthCardInfoTip", []),
			[WinName.MONTHCARD_DAILY_REWARD]: new WinManagerVO(WinName.MONTHCARD_DAILY_REWARD, "game.MonthCardDailyReward", WinLay.BOTTOM_LAY, "MonthCardDailyReward", []),
			[WinName.MONTHCARD_BUY_REWARD]: new WinManagerVO(WinName.MONTHCARD_BUY_REWARD, "game.MonthCardReward", WinLay.BOTTOM_LAY, "MonthCardReward", [], "", {}, true, false, false, 1),
			[WinName.EQUIP_SPECIAL]: new WinManagerVO(WinName.EQUIP_SPECIAL, "game.EquipSpecialView", WinLay.MODULE_LAY, "EquipSpecialSkin", [], "", { y: 64 }),
			[WinName.RANK]: new WinManagerVO(WinName.RANK, "game.RankView", WinLay.MODULE_LAY, "RankViewSkin", [], "", { y: 64 }),
			[WinName.BOSS_MEET]: new WinManagerVO(WinName.BOSS_MEET, "game.BossMeet", WinLay.MODULE_LAY, "BossMeet", []),
			[WinName.COPY]: new WinManagerVO(WinName.COPY, "game.CopyView", WinLay.MODULE_LAY, "CopySkin", []),
			[WinName.ARTIFACT]: new WinManagerVO(WinName.ARTIFACT, "game.ArtifactView", WinLay.MODULE_LAY, "ArtifactSkin", [], "", { y: 64 }),
			[WinName.INVEST]: new WinManagerVO(WinName.INVEST, "game.InvestView", WinLay.MODULE_LAY, "InvestViewSkin", [], "", { y: 64 }),
			[WinName.ACTIVITY]: new WinManagerVO(WinName.ACTIVITY, "game.ActivityMainView", WinLay.MODULE_LAY, "ActivityMainViewSkin", [], "", { y: 64 }),
			[WinName.RECHARGE_FIRST]: new WinManagerVO(WinName.RECHARGE_FIRST, "game.FirstRechargeView", WinLay.MODULE_LAY, "FirstRechargeSkin", [], "", { y: 64 }),
			[WinName.RECHARGE]: new WinManagerVO(WinName.RECHARGE, "game.RechargeView", WinLay.MODULE_LAY, "RechargeViewSkin", [], "", { y: 64 }),
			[WinName.FORTUNE]: new WinManagerVO(WinName.FORTUNE, "game.FortuneView", WinLay.MODULE_LAY, "FortuneWheelViewSkin", [], "", { y: 64 }),
			[WinName.HEGEMONY]: new WinManagerVO(WinName.HEGEMONY, "game.LabberHegemonyWin", WinLay.MODULE_LAY, "LabberHegemonySkin", []),
			[WinName.HEGEMONY_LABBER_TIPS]: new WinManagerVO(WinName.HEGEMONY_LABBER_TIPS, "game.LabberTipsView", WinLay.BOTTOM_LAY, "LabberTipsSkin", []),
			[WinName.HEGEMONY_LABBER_REWARD]: new WinManagerVO(WinName.HEGEMONY_LABBER_REWARD, "game.LabberRewardView", WinLay.BOTTOM_LAY, "LabberRewardSkin", []),
			[WinName.HEGEMONY_LABBER_RESULT]: new WinManagerVO(WinName.HEGEMONY_LABBER_RESULT, "game.LabberResultView", WinLay.BOTTOM_LAY, "LabberResultSkin", []),
			[WinName.WORLDBOSS]: new WinManagerVO(WinName.WORLDBOSS, "game.WorldBossView", WinLay.MODULE_LAY, "WorldBossSkin", []),
			[WinName.WORLDBOSS_KILL_RECORD]: new WinManagerVO(WinName.WORLDBOSS_KILL_RECORD, "game.WorldBossKillRecord", WinLay.PANEL_LAY, "WorldBossKillRecord", [], "", {}, true, false, false, 1),
			[WinName.WORLDBOSS_REWARD]: new WinManagerVO(WinName.WORLDBOSS_REWARD, "game.WorldBossReward", WinLay.PANEL_LAY, "WorldBossReward", [], "", {}, true, false, false, 1),
			[WinName.WORLDBOSS_FIGHT]: new WinManagerVO(WinName.WORLDBOSS_FIGHT, "game.WorldBossFight", WinLay.MAIN_UI_LAY, "WorldBossFight", []),
			[WinName.WORLDBOSS_CHEER]: new WinManagerVO(WinName.WORLDBOSS_CHEER, "game.WorldBossCheer", WinLay.PANEL_LAY, "WorldBossCheer", [], "", {}, true, false, false, 1),
			[WinName.WORLDBOSS_BUY_TIMES]: new WinManagerVO(WinName.WORLDBOSS_BUY_TIMES, "game.WorldBossBuyTimes", WinLay.PANEL_LAY, "WorldBossBuyTimes", [], "", {}, true, false, false, 1),
			[WinName.ENCOUNTER_LOGS]: new WinManagerVO(WinName.ENCOUNTER_LOGS, "game.EncounterLogView", WinLay.BOTTOM_LAY, "EncounterLogSkin", []),
			// [WinName.ENCOUNTER_REWARD]: new WinManagerVO(WinName.ENCOUNTER_REWARD, "game.EncounterRewardView", WinLay.PANEL_LAY, "EncounterRewardViewSkin", []),
			[WinName.WORLDBOSS_REVIVE]: new WinManagerVO(WinName.WORLDBOSS_REVIVE, "game.WorldBossRevive", WinLay.MAIN_UI_LAY, "WorldBossRevive", [], "", { y: 510, x: 258 }),
			[WinName.COUNTERDOWN]: new WinManagerVO(WinName.COUNTERDOWN, "game.CountDownView", WinLay.BOTTOM_LAY, "CountDownSkin", [], "", null, false),
			[WinName.METAL]: new WinManagerVO(WinName.METAL, "game.MetalView", WinLay.MODULE_LAY, "MetalSkin", []),
			[WinName.RankGuanqia]: new WinManagerVO(WinName.RankGuanqia, "game.RankGuanqiaView", WinLay.MODULE_LAY, "RankGuanqiaViewSkin", [], "", { y: 64 }),
			[WinName.CHATPORT]: new WinManagerVO(WinName.CHATPORT, "game.ChatPortView", WinLay.SCENE_UI_LAY, "ChatPortSkin", [], "", null, false),
			[WinName.ITEMTIPS]: new WinManagerVO(WinName.ITEMTIPS, "game.ItemTips", WinLay.PANEL_LAY, "ItemTipSkin", [], "", {}, true, false, false, 1, 1),
			[WinName.ITEMWAYS]: new WinManagerVO(WinName.ITEMWAYS, "ItemWays", WinLay.PANEL_LAY, "ItemWaySkin", [], "", {}, true, false, false, 1, 1),
			[WinName.ALERTTIPS]: new WinManagerVO(WinName.ALERTTIPS, "AlertTips", WinLay.PANEL_LAY, "AlertTipsSkin", [], "", {}, true, false, false, 1, 1),
			[WinName.BOSS_COMING]: new WinManagerVO(WinName.BOSS_COMING, "game.BossComing", WinLay.MAIN_UI_LAY, "BossComing"),
		}

		this._winPopConfig = {
			[WinName.POP_MAILDETAIL]: new WinManagerVO(WinName.POP_MAILDETAIL, "game.MailDetail", WinLay.PANEL_LAY, "MailDetailSkin", [], "", { y: 64 }, true, false, true, 1),
			[WinName.POP_RANK_QUESTION]: new WinManagerVO(WinName.POP_RANK_QUESTION, "game.RankTipsView", WinLay.PANEL_LAY, "RankTipsSkin", [], "", { y: 64 }, true, false, true, 1),
			[WinName.POP_SIGN_VIP]: new WinManagerVO(WinName.POP_SIGN_VIP, "game.SignVipPrompt", WinLay.PANEL_LAY, "SignVipPromptSkin", [], "", { y: 64 }, true, false, true, 1),
			[WinName.POP_SIGN_VIP]: new WinManagerVO(WinName.POP_SIGN_VIP, "game.SignVipPrompt", WinLay.PANEL_LAY, "SignVipPromptSkin", [], "", { y: 64 }, true, false, true, 1),
			[WinName.POP_SYNTHESISSUCCESS]: new WinManagerVO(WinName.POP_SYNTHESISSUCCESS, "game.SynthesisSuccessView", WinLay.PANEL_LAY, "SynthesisSuccessSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_SHOP_BUY]: new WinManagerVO(WinName.POP_SHOP_BUY, "game.ShopBuyWinView", WinLay.PANEL_LAY, "ShopBuyWinSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_REBORN_POINT]: new WinManagerVO(WinName.POP_REBORN_POINT, "game.RebornPointView", WinLay.PANEL_LAY, "RebornPointSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_RAIDER_REWARD]: new WinManagerVO(WinName.POP_RAIDER_REWARD, "game.RaiderRewardView", WinLay.PANEL_LAY, "RaiderRewardSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_EQUIPSPECIAL_TIP]: new WinManagerVO(WinName.POP_EQUIPSPECIAL_TIP, "game.EquipSpecialTipView", WinLay.PANEL_LAY, "EquipSpecialTipSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_FAST_FIGHT]: new WinManagerVO(WinName.POP_FAST_FIGHT, "game.FastFightView", WinLay.PANEL_LAY, "FastFightSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_FAST_FIGHT_RESULT]: new WinManagerVO(WinName.POP_FAST_FIGHT_RESULT, "game.FastFightResultView", WinLay.PANEL_LAY, "FastFightResultSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_Encounter_Reward]: new WinManagerVO(WinName.POP_Encounter_Reward, "game.EncounterRewardView", WinLay.PANEL_LAY, "EncounterRewardViewSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_PLAYER_MSG]: new WinManagerVO(WinName.POP_PLAYER_MSG, "game.PlayerMsgWin", WinLay.PANEL_LAY, "PlayerMsgSkin", [], "", { y: 64 }, true, false, true, 1),
			[WinName.POP_PLAYER_HERO_ATTR]: new WinManagerVO(WinName.POP_PLAYER_HERO_ATTR, "game.PlayerHeroAttr", WinLay.PANEL_LAY, "PlayerHeroAttrSkin", [], "", { y: 64 }, true, false, true, 1),
			[WinName.POP_OFFLINE_RESULT]: new WinManagerVO(WinName.POP_OFFLINE_RESULT, "game.MainOffline", WinLay.PANEL_LAY, "MainOfflineSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_FORGE_STAR]: new WinManagerVO(WinName.POP_FORGE_STAR, "game.ForgeStarInfo", WinLay.PANEL_LAY, "ForgeStarInfoSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_FORGE_EQUIP]: new WinManagerVO(WinName.POP_FORGE_EQUIP, "game.ForgeEquipInfo", WinLay.PANEL_LAY, "ForgeEquipSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_EQUIP_SELECT]: new WinManagerVO(WinName.POP_EQUIP_SELECT, "game.EquipSelect", WinLay.PANEL_LAY, "EquipSelectSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_JEWEL_TIP]: new WinManagerVO(WinName.POP_JEWEL_TIP, "game.JewelTipView", WinLay.PANEL_LAY, "JewelTipSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_JEWEL_MASTER]: new WinManagerVO(WinName.POP_JEWEL_MASTER, "game.JewelMasterView", WinLay.PANEL_LAY, "JewelMasterSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_JEWEL_SUPER]: new WinManagerVO(WinName.POP_JEWEL_SUPER, "game.JewelSuperView", WinLay.PANEL_LAY, "JewelSuperSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_LOGIN_SERVER]: new WinManagerVO(WinName.POP_LOGIN_SERVER, "game.LoginServer", WinLay.PANEL_LAY, "LoginServer", [], "", {}, true, false, true, 1),
			[WinName.POP_LOGIN_CREATE]: new WinManagerVO(WinName.POP_LOGIN_CREATE, "game.LoginCreateRole", WinLay.PANEL_LAY, "LoginCreateRoleSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_INVEST_TIPS]: new WinManagerVO(WinName.POP_INVEST_TIPS, "game.InvestTipsView", WinLay.PANEL_LAY, "InvestTipsSkin", [], "", { y: 64 }, true, false, true, 1),
			[WinName.POP_FORTUNE_RESULT]: new WinManagerVO(WinName.POP_FORTUNE_RESULT, "game.FortuneResultView", WinLay.PANEL_LAY, "FortuneResultSkin", [], "", { y: 64 }, true, false, true, 1),
			[WinName.POP_SMELT]: new WinManagerVO(WinName.POP_SMELT, "game.SmeltView", WinLay.PANEL_LAY, "SmeltSkin",[], "", {}, true, false, true, 1),
			[WinName.POP_SMELT_ORANGE]: new WinManagerVO(WinName.POP_SMELT_ORANGE, "game.SmeltOrangeView", WinLay.PANEL_LAY, "SmeltOrangeSkin", [], "", {}, true, false, true, 1),
			[WinName.POP_SHOP_PREVIEW]: new WinManagerVO(WinName.POP_SHOP_PREVIEW, "game.ShopPreviewView", WinLay.PANEL_LAY, "ShopPreviewSkin", [], "", {}, true, false, true, 1),

	}

	}

	/**
	 * 显示窗口
	 * @param winName 窗口名称
	 * @param openParam 开启传入参数
	 */
	public openWin(winName: string, openParam: any = null) {
		App.logzsq("WinManager.openWin " + winName);
		//通用模块打开规则，这里统一入口，暂时放这，以后看下如何抽取出来
		if (!App.GuideManager.isModuleOpen(winName)) {
			App.GuideManager.moduleNotOpenTip(winName);
			return false;
		}
		let vo: WinManagerVO = this._winConfig[winName];
		if (!vo) {
			vo = this._winPopConfig[winName];
		}
		if (vo) {
			if (vo.layer == WinLay.MODULE_LAY) {
				for (let k in this._moduleArray) {
					let view = this._winDic[this._moduleArray[k]];
					if (view && this._moduleArray[k] != vo.winName) { //关掉其他
						this.closeWin(this._moduleArray[k]);
						// view.visible = false;
					} else if (view && view.visible && this._moduleArray[k] == vo.winName) { //又点了自己
						// this.closeWin(this._moduleArray[k]);
						// return;
					}
				}
			}
			if (this._winDic[vo.winName]) {
				let view: BaseView = this._winDic[vo.winName];
				if (vo.preLoadRes && (vo.preLoadRes as Array<string>).length > 0) {
					view.preloadRes(vo.preLoadRes, openParam);
				} else {
					view.visible = true;
					view.readyOpenWin(openParam);
				}
				//view.readyOpenWin(openParam);                     
			} else {
				let winClass: any = egret.getDefinitionByName(vo.winClass)
				let view: BaseView = new winClass(vo);
				if (vo.preLoadRes && (vo.preLoadRes as Array<string>).length > 0) {
					view.preloadRes(vo.preLoadRes, openParam);
				} else {
					view.visible = true;
					view.readyOpenWin(openParam);
				}
				this._winDic[vo.winName] = view;
				this._eventSystem.dispatchEvent(WinManagerEvent.WIN_ADD, new WinManagerEvent(vo, view));
			}
			if (vo.layer == WinLay.MODULE_LAY) {
				this._moduleArray.push(vo.winName);
			}
			this._eventSystem.dispatchEvent(WinManagerEvent.WIN_OPEN, vo);
		} else {
			App.logzsq("显示的窗口名未配置");
		}
	}

	/**
	 * 关闭窗口
	 * @param winName 窗口名称
	 */
	public closeWin(winName: string) {
		App.logzsq("WinManager.closeWin " + winName);
		let vo: WinManagerVO = this._winConfig[winName];
		if (!vo) {
			vo = this._winPopConfig[winName];
		}
		if (vo) {
			let view: BaseView = this._winDic[vo.winName];
			if (view) {
				let callback = () => {
					view.clear();
					view.visible = false;

					//打开上一个窗口
					if (vo.layer == WinLay.MODULE_LAY) {
						this._moduleArray.splice(this._moduleArray.length - 1, 1);
					}
					// let myView = this._winDic[this._moduleArray[this._moduleArray.length - 1]];
					// if (myView && myView != view && !myView.visible) {
					// 	myView.visible = true;
					// }

					if (vo.closeDestroy) {
						view.destroy();
						this._eventSystem.dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(vo, view))
						this._winDic[winName] = null;
						delete this._winDic[winName];
					} else {

					}
				}
				callback();
				// callback.bind(this);
				// view.closeWin(callback);
			} else {
				//this._winDic[winName] = null;
				delete this._winDic[winName];
			}
			this._eventSystem.dispatchEvent(WinManagerEvent.WIN_CLOSE, vo);
		} else {
			App.logzsq("关闭的窗口名未配置");
		}
	}
	/**
 * 显示弹窗窗口
 * @param winName 窗口名称
 * @param openParam 开启传入参数
 */
	public openPopWin(winName: string, openParam: any = null) {
		App.logzsq("WinManager.openPopWin " + winName);
		//通用模块打开规则，这里统一入口，暂时放这，以后看下如何抽取出来
		if (!App.GuideManager.isModuleOpen(winName)) {
			App.GuideManager.moduleNotOpenTip(winName);
			return false;
		}
		let vo: WinManagerVO = this._winPopConfig[winName];
		if (!vo) {
			vo = this._winConfig[winName];
		}
		if (vo) {
			if (vo.layer == WinLay.MODULE_LAY) {
				for (let k in this._moduleArray) {
					let view = this._winDic[this._moduleArray[k]];
					if (view && this._moduleArray[k] != vo.winName) { //关掉其他
						this.closeWin(this._moduleArray[k]);
						// view.visible = false;
					} else if (view && view.visible && this._moduleArray[k] == vo.winName) { //又点了自己
						// this.closeWin(this._moduleArray[k]);
						// return;
					}
				}
			}
			if (this._winDic[vo.winName]) {
				let view: BaseView = this._winDic[vo.winName];
				if (vo.preLoadRes && (vo.preLoadRes as Array<string>).length > 0) {
					view.preloadRes(vo.preLoadRes, openParam);
				} else {
					view.visible = true;
					view.readyOpenWin(openParam);
				}
				//view.readyOpenWin(openParam);                     
			} else {
				let winClass: any = egret.getDefinitionByName(vo.winClass)
				let view: BaseView = new winClass(vo);
				if (vo.preLoadRes && (vo.preLoadRes as Array<string>).length > 0) {
					view.preloadRes(vo.preLoadRes, openParam);
				} else {
					view.visible = true;
					view.readyOpenWin(openParam);
				}
				this._winDic[vo.winName] = view;
				this._eventSystem.dispatchEvent(WinManagerEvent.WIN_ADD, new WinManagerEvent(vo, view));
			}
			if (vo.layer == WinLay.MODULE_LAY) {
				this._moduleArray.push(vo.winName);
			}
		} else {
			App.logzsq("显示的窗口名未配置");
		}
	}

	/**
	 * 关闭弹窗窗口
	 * @param winName 窗口名称
	 */
	public closePopWin(winName: string) {
		App.logzsq("WinManager.closeWin " + winName);
		let vo: WinManagerVO = this._winPopConfig[winName];
		if (!vo) {
			vo = this._winConfig[winName];
		}
		if (vo) {
			let view: BaseView = this._winDic[vo.winName];
			if (view) {
				let callback = () => {
					view.clear();
					view.visible = false;

					//打开上一个窗口
					if (vo.layer == WinLay.MODULE_LAY) {
						this._moduleArray.splice(this._moduleArray.length - 1, 1);
					}
					// let myView = this._winDic[this._moduleArray[this._moduleArray.length - 1]];
					// if (myView && myView != view && !myView.visible) {
					// 	myView.visible = true;
					// }

					if (vo.closeDestroy) {
						view.destroy();
						this._eventSystem.dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(vo, view))
						this._winDic[winName] = null;
						delete this._winDic[winName];
					} else {

					}
				}
				callback();
				// callback.bind(this);
				// view.closeWin(callback);
			} else {
				//this._winDic[winName] = null;
				delete this._winDic[winName];
			}
		} else {
			App.logzsq("关闭的窗口名未配置");
		}
	}
	/**
	 * 获取窗口
	 * @param winName 窗口名称
	 */
	public getWin(winName: string): BaseView {
		return this._winDic[winName];
	}

	/**
	 * 获取窗口是否打开
	 * @param winName 窗口名称
	 */
	public isOpen(winName: string): boolean {
		if (this._winDic[winName] && this._winDic[winName].visible) {
			return true;
		}
		return false;
	}

	/**
	 * 关闭所有窗口
	 * 
	 */
	public closeAllWindow() {
		for (let winName in this._winDic) {
			this.closeWin(winName);
		}
	}

}

/**
 * 窗口管理事件
 */
class WinManagerEvent {
	public static WIN_ADD = "WIN_ADD_SCENE";
	public static WIN_REMOVE = "WIN_REMOVE_SCENE";
	public static WIN_OPEN = "WIN_OPEN";
	public static WIN_CLOSE = "WIN_CLOSE";

	public vo: WinManagerVO;//窗口VO
	public view: egret.DisplayObject;//窗口显示对象

	public constructor(vo: WinManagerVO, view: egret.DisplayObject) {
		this.vo = vo;
		this.view = view;
	}
	public setView(v: egret.DisplayObject) {
		this.view = v;
	}
}

/**
 * 窗口管理VO
 */
class WinManagerVO {
	public winName: string;//窗口名称
	public winClass: string;//窗口显示类
	public layer: number;//窗口显示层次
	public skinName: any;//皮肤名称
	public preLoadRes: Array<string> = [];//预加载资源列表
	public title: string = "";//标题
	public param: any;//参数
	public closeDestroy: boolean = true;//关闭是否销毁
	public useCloseBtn: boolean = false;//是否使用关闭按钮
	public useBg: boolean = false;//是否使用背景
	public openModel: number = 0;//打开动画模式
	public closeModel: number = 0;//关闭动作模式
	/**
	 * 初始化
	 * @param winName  string 窗口名称
	 * @param winClass  string 窗口显示类名
	 * @param layer  number 窗口显示层次
	 * @param skinName any 皮肤名称
	 * @param preLoadRes Array<string> 预加载资源组
	 * @param title string 窗口标题
	 * @param param any初始化传入参数
	 * @param closeDestroy boolean关闭后是否销毁 true表示销毁
	 * @param useCloseBtn boolean 是否使用关闭按钮
	 * @param useBg boolean 是否使用背景
	 * @param openModel number 打开动画模式 0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
	 * @param closeModel number 关闭动作模式 0：没有动画 1:从中间缩小消失 2：从中间缩小消失  3：从左向右 4：从右向左 5、从上到下 6、从下到上
	 */
	public constructor(winName: string, winClass: string, layer: number, skinName: any = "", preLoadRes: Array<string> = null, title: string = "", param: any = null, closeDestroy: boolean = true, useCloseBtn: boolean = false, useBg: boolean = false, openModel: number = 0, closeModel: number = 0) {
		this.winName = winName;
		this.winClass = winClass;
		this.layer = layer;
		this.skinName = skinName;
		this.preLoadRes = preLoadRes;
		this.title = title;
		this.param = param;
		this.closeDestroy = closeDestroy;
		this.useCloseBtn = useCloseBtn;
		this.useBg = useBg;
		this.openModel = openModel;
		this.closeModel = closeModel;
	}
}

enum WinLay {
	SCENE_LAY = 1,//场景层
	SCENE_UI_LAY = 2,//场景UI层
	MAIN_UI_LAY = 3,//主UI层
	MODULE_LAY = 4,//模块View UI层
	BOTTOM_LAY = 5,
	PANEL_LAY = 6,//
	EFFECT_LAY = 7,//
	MASK_LAY = 8,//
	LOAD_LAY = 9,//
	GUIDE_LAY = 10,
}
