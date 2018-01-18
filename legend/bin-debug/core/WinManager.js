var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 窗口管理 2017/09/20.
 */
var WinName = {
    TEST: "TEST",
    LOGIN: "LOGIN",
    MAIN: "MAIN",
    MAIL: "MAIL",
    MAIN_BOTTOM: "MAIN_BOTTOM",
    FIGHT: "FIGHT",
    EQUIP: "EQUIP",
    HERO: "HERO",
    BACKPACK: "BACKPACK",
    BROADCAST: "BROADCAST",
    // SMELT: "SMELT",     //熔炼
    // SMELT_ORANGE: "SMELT_ORANGE",  //熔炼橙装
    FORGE: "FORGE",
    SHOP: "SHOP",
    BOSS: "BOSS",
    BOSS_WIN: "BOSS_WIN",
    BOSS_LOSE: "BOSS_LOSE",
    BOSS_COMING: "BOSS_COMING",
    INCOME_PROMOTE: "INCOME_PROMOTE",
    WING: "WING",
    CHAT: "CHAT",
    CHAT_ICON_TIP: "CHAT_ICON_TIP",
    WING_STEP_TIP: "WING_STEP_TIP",
    WING_EQUIP_TIP: "WING_EQUIP_TIP",
    JEWEL: "JEWEL",
    SYNTHESIS: "SYNTHESIS",
    WING_PERFECT_TIP: "WING_PERFECT_TIP",
    WING_SKILL: "WING_SKILL",
    MUSTDO: "MUSTDO",
    MUSTDO_UNTAKE: "MUSTDO_UNTAKE",
    MUSTDO_LIGHTEN: "MUSTDO_LIFHTEN",
    MUSTDO_TITLEDETAIL: "MUSTDO_TITLEDETAIL",
    // FORGE_ORANGE: "FORGE_ORANGE",  //橙装升级
    VIP: "VIP",
    WELFARE: "WELFARE",
    RAIDER: "RAIDER",
    LOGIN_NOTICE: "LOGIN_NOTICE",
    MONTHCARD: "MONTHCARD",
    MONTHCARD_INFO_TIP: "MONTHCARD_INFO_TIP",
    MONTHCARD_DAILY_REWARD: "MONTHCARD_DAILY_REWARD",
    MONTHCARD_BUY_REWARD: "MONTHCARD_BUY_REWARD",
    EQUIP_SPECIAL: "EQUIP_SPECIAL",
    RANK: "RANK",
    BOSS_MEET: "BOSS_MEET",
    ARTIFACT: "ARTIFACT",
    ACTIVITY: "ACTIVITY",
    COPY: "COPY",
    INVEST: "INVEST",
    RECHARGE_FIRST: "RECHARGE_FIRST",
    RECHARGE: "RECHARGE",
    FORTUNE: "FORTUNE",
    HEGEMONY: "HEGEMONY",
    HEGEMONY_LABBER_TIPS: "HEGEMONY_LABBER_TIPS",
    HEGEMONY_LABBER_REWARD: "HEGEMONY_LABBER_REWARD",
    HEGEMONY_LABBER_RESULT: "HEGEMONY_LABBER_RESULT",
    WORLDBOSS: "WORLDBOSS",
    WORLDBOSS_KILL_RECORD: "WORLDBOSS_KILL_RECORD",
    WORLDBOSS_REWARD: "WORLDBOSS_REWARD",
    WORLDBOSS_FIGHT: "WORLDBOSS_FIGHT",
    WORLDBOSS_CHEER: "WORLDBOSS_CHEER",
    WORLDBOSS_BUY_TIMES: "WORLDBOSS_BUY_TIMES",
    // ENCOUNTER_REWARD:"ENCOUNTER_REWARD",//遭遇战每日奖励界面
    WORLDBOSS_REVIVE: "WORLDBOSS_REVIVE",
    ENCOUNTER_REWARD: "ENCOUNTER_REWARD",
    ENCOUNTER_LOGS: "ENCOUNTER_LOGS",
    COUNTERDOWN: "COUNTERDOWN",
    METAL: "METAL",
    RankGuanqia: "RankGuanqia",
    POP_MAILDETAIL: "POP_MAILDETAIL",
    POP_RANK_QUESTION: "POP_RANK_QUESTION",
    POP_SIGN_VIP: "POP_SIGN_VIP",
    CHATPORT: "CHATPORT",
    ITEMTIPS: "ITEMTIPS",
    ITEMWAYS: "ITEMWAYS",
    ALERTTIPS: "ALERTTIPS",
    POP_SYNTHESISSUCCESS: "POP_SYNTHESISSUCCESS",
    POP_SHOP_BUY: "POP_SHOP_BUY",
    POP_REBORN_POINT: "POP_REBORN_POINT",
    POP_RAIDER_REWARD: "POP_RAIDER_REWARD",
    POP_EQUIPSPECIAL_TIP: "POP_EQUIPSPECIAL_TIP",
    POP_FAST_FIGHT: "POP_FAST_FIGHT",
    POP_FAST_FIGHT_RESULT: "POP_FAST_FIGHT_RESULT",
    POP_Encounter_Reward: "POP_Encounter_Reward",
    POP_PLAYER_MSG: "POP_PLAYER_MSG",
    POP_PLAYER_HERO_ATTR: "POP_PLAYER_HERO_ATTR",
    POP_OFFLINE_RESULT: "POP_OFFLINE_RESULT",
    POP_FORGE_STAR: "POP_FORGE_STAR",
    POP_FORGE_EQUIP: "POP_FORGE_EQUIP",
    POP_EQUIP_SELECT: "POP_EQUIP_SELECT",
    POP_JEWEL_TIP: "POP_JEWEL_TIP",
    POP_JEWEL_MASTER: "POP_JEWEL_MASTER",
    POP_JEWEL_SUPER: "POP_JEWEL_SUPER",
    POP_LOGIN_SERVER: "POP_LOGIN_SERVER",
    POP_LOGIN_CREATE: "POP_LOGIN_CREATE",
    POP_INVEST_TIPS: "POP_INVEST_TIPS",
    POP_FORTUNE_RESULT: "POP_FORTUNE_RESULT",
    POP_SMELT: "POP_SMELT",
    POP_SMELT_ORANGE: "POP_SMELT_ORANGE",
    POP_SHOP_PREVIEW: "POP_SHOP_PREVIEW",
};
var WinManager = (function () {
    function WinManager() {
        this._winDic = {}; //窗口字典
        this._winConfig = {}; //窗口配置文件
        this._winPopConfig = {};
        this._moduleArray = []; //全屏窗口显示队列
        this._eventSystem = EventSystem.getInstance();
        this._winConfig = (_a = {},
            _a[WinName.TEST] = new WinManagerVO(WinName.TEST, "game.TestView", WinLay.PANEL_LAY, "TestSkin", []),
            _a[WinName.LOGIN] = new WinManagerVO(WinName.LOGIN, "game.LoginUI", WinLay.MODULE_LAY, "LoginSkin", ["login"]),
            _a[WinName.MAIN] = new WinManagerVO(WinName.MAIN, "game.MainUI", WinLay.MAIN_UI_LAY, "MainUISkin", [], "", null, true),
            _a[WinName.MAIN_BOTTOM] = new WinManagerVO(WinName.MAIN_BOTTOM, "game.MainBottom", WinLay.BOTTOM_LAY, "MainBottomSkin", []),
            _a[WinName.EQUIP] = new WinManagerVO(WinName.EQUIP, "game.EquipView", WinLay.PANEL_LAY, "EquipSkin", [], "", null, true, false, false, 1, 1),
            _a[WinName.HERO] = new WinManagerVO(WinName.HERO, "game.HeroView", WinLay.MODULE_LAY, "HeroSkin", [], "equipping_juese_title_png", null, true, true, false, 0, 0),
            _a[WinName.BACKPACK] = new WinManagerVO(WinName.BACKPACK, "game.BackpackView", WinLay.MODULE_LAY, "BackpackSkin", [], "bag_pic_bb_png", null, true, true, false, 0, 0),
            _a[WinName.FIGHT] = new WinManagerVO(WinName.FIGHT, "game.FightScene", WinLay.SCENE_LAY, "FightSkin", []),
            _a[WinName.BROADCAST] = new WinManagerVO(WinName.BROADCAST, "game.BroadcastView", WinLay.SCENE_UI_LAY, "BroadcastSkin", [], "", null, false),
            // [WinName.SMELT]: new WinManagerVO(WinName.SMELT, "game.SmeltView", WinLay.MODULE_LAY, "SmeltSkin", [], "", { y: 64 }, false),
            _a[WinName.FORGE] = new WinManagerVO(WinName.FORGE, "game.ForgeView", WinLay.MODULE_LAY, "ForgeSkin", [], "forge_qianghua_title_png", { y: 0 }, false),
            _a[WinName.SHOP] = new WinManagerVO(WinName.SHOP, "game.ShopView", WinLay.MODULE_LAY, "ShopSkin", [], "shop_shangcheng_title_png", { y: 0 }, false),
            _a[WinName.BOSS] = new WinManagerVO(WinName.BOSS, "game.BossView", WinLay.MODULE_LAY, "BossSkin", []),
            _a[WinName.BOSS_WIN] = new WinManagerVO(WinName.BOSS_WIN, "game.BossWin", WinLay.PANEL_LAY, "BossWin", []),
            _a[WinName.BOSS_LOSE] = new WinManagerVO(WinName.BOSS_LOSE, "game.BossLose", WinLay.PANEL_LAY, "BossLose", []),
            _a[WinName.INCOME_PROMOTE] = new WinManagerVO(WinName.INCOME_PROMOTE, "game.incomePromote", WinLay.MODULE_LAY, "incomePromote", []),
            _a[WinName.WING] = new WinManagerVO(WinName.WING, "game.WingAllView", WinLay.MODULE_LAY, "WingAllSkin", [], "wing_pic_title_png", null, true, true),
            _a[WinName.WING_STEP_TIP] = new WinManagerVO(WinName.WING_STEP_TIP, "game.goStepTip", WinLay.PANEL_LAY, "goStepTip", [], "", {}, true, false, false, 1),
            _a[WinName.CHAT] = new WinManagerVO(WinName.CHAT, "game.ChatView", WinLay.MODULE_LAY, "ChatSkin", [], "", { y: 64 }, false),
            _a[WinName.CHAT_ICON_TIP] = new WinManagerVO(WinName.CHAT_ICON_TIP, "game.ChatIconTipsView", WinLay.BOTTOM_LAY, "ChatIconTipsSkin", []),
            _a[WinName.JEWEL] = new WinManagerVO(WinName.JEWEL, "game.JewelView", WinLay.MODULE_LAY, "JewelSkin", [], "jewel_sign_title_png", null, true, true),
            _a[WinName.WING_EQUIP_TIP] = new WinManagerVO(WinName.WING_EQUIP_TIP, "game.WingEquipTip", WinLay.BOTTOM_LAY, "WingEquipTip", []),
            _a[WinName.SYNTHESIS] = new WinManagerVO(WinName.SYNTHESIS, "game.SynthesisView", WinLay.MODULE_LAY, "SynthesisSkin", [], "", { y: 64 }, true),
            _a[WinName.WING_PERFECT_TIP] = new WinManagerVO(WinName.WING_PERFECT_TIP, "game.WingPerfectTip", WinLay.BOTTOM_LAY, "WingPerfect", []),
            _a[WinName.WING_SKILL] = new WinManagerVO(WinName.WING_SKILL, "game.WingEquipSkill", WinLay.BOTTOM_LAY, "WingEquipSkill", []),
            _a[WinName.MUSTDO] = new WinManagerVO(WinName.MUSTDO, "game.MustDoView", WinLay.MODULE_LAY, "MustDoSkin", []),
            _a[WinName.MUSTDO_UNTAKE] = new WinManagerVO(WinName.MUSTDO_UNTAKE, "game.MustDoUnTakeView", WinLay.BOTTOM_LAY, "UnTakeAchieveSkin", []),
            _a[WinName.MUSTDO_LIGHTEN] = new WinManagerVO(WinName.MUSTDO_LIGHTEN, "game.MustDoLightenView", WinLay.BOTTOM_LAY, "MustDoLightenSkin", []),
            _a[WinName.MUSTDO_TITLEDETAIL] = new WinManagerVO(WinName.MUSTDO_TITLEDETAIL, "game.MustDoTitleDetailView", WinLay.BOTTOM_LAY, "MustDoTitleDetailSkin", []),
            _a[WinName.MAIL] = new WinManagerVO(WinName.MAIL, "game.MailView", WinLay.MODULE_LAY, "MailViewSkin", [], "", { y: 64 }),
            // [WinName.FORGE_ORANGE]: new WinManagerVO(WinName.FORGE_ORANGE, "game.ForgeOrangeView", WinLay.MODULE_LAY, "ForgeOrangeEquipSkin", [], "", { y: 64 }),
            _a[WinName.VIP] = new WinManagerVO(WinName.VIP, "game.VipView", WinLay.MODULE_LAY, "VipSkin", [], "", { y: 5 }),
            _a[WinName.WELFARE] = new WinManagerVO(WinName.WELFARE, "game.WelfareView", WinLay.MODULE_LAY, "WelfareSkin", []),
            _a[WinName.RAIDER] = new WinManagerVO(WinName.RAIDER, "game.RaiderView", WinLay.MODULE_LAY, "RaiderSkin", [], "", { y: 64 }),
            _a[WinName.LOGIN_NOTICE] = new WinManagerVO(WinName.LOGIN_NOTICE, "game.LoginNoticeView", WinLay.BOTTOM_LAY, "LoginNoticeSkin", []),
            _a[WinName.MONTHCARD] = new WinManagerVO(WinName.MONTHCARD, "game.MonthCardView", WinLay.MODULE_LAY, "MonthCardSkin", []),
            _a[WinName.MONTHCARD_INFO_TIP] = new WinManagerVO(WinName.MONTHCARD_INFO_TIP, "game.MonthCardInfoTip", WinLay.BOTTOM_LAY, "MonthCardInfoTip", []),
            _a[WinName.MONTHCARD_DAILY_REWARD] = new WinManagerVO(WinName.MONTHCARD_DAILY_REWARD, "game.MonthCardDailyReward", WinLay.BOTTOM_LAY, "MonthCardDailyReward", []),
            _a[WinName.MONTHCARD_BUY_REWARD] = new WinManagerVO(WinName.MONTHCARD_BUY_REWARD, "game.MonthCardReward", WinLay.BOTTOM_LAY, "MonthCardReward", [], "", {}, true, false, false, 1),
            _a[WinName.EQUIP_SPECIAL] = new WinManagerVO(WinName.EQUIP_SPECIAL, "game.EquipSpecialView", WinLay.MODULE_LAY, "EquipSpecialSkin", [], "", { y: 64 }),
            _a[WinName.RANK] = new WinManagerVO(WinName.RANK, "game.RankView", WinLay.MODULE_LAY, "RankViewSkin", [], "", { y: 64 }),
            _a[WinName.BOSS_MEET] = new WinManagerVO(WinName.BOSS_MEET, "game.BossMeet", WinLay.MODULE_LAY, "BossMeet", []),
            _a[WinName.COPY] = new WinManagerVO(WinName.COPY, "game.CopyView", WinLay.MODULE_LAY, "CopySkin", []),
            _a[WinName.ARTIFACT] = new WinManagerVO(WinName.ARTIFACT, "game.ArtifactView", WinLay.MODULE_LAY, "ArtifactSkin", [], "", { y: 64 }),
            _a[WinName.INVEST] = new WinManagerVO(WinName.INVEST, "game.InvestView", WinLay.MODULE_LAY, "InvestViewSkin", [], "", { y: 64 }),
            _a[WinName.ACTIVITY] = new WinManagerVO(WinName.ACTIVITY, "game.ActivityMainView", WinLay.MODULE_LAY, "ActivityMainViewSkin", [], "", { y: 64 }),
            _a[WinName.RECHARGE_FIRST] = new WinManagerVO(WinName.RECHARGE_FIRST, "game.FirstRechargeView", WinLay.MODULE_LAY, "FirstRechargeSkin", [], "", { y: 64 }),
            _a[WinName.RECHARGE] = new WinManagerVO(WinName.RECHARGE, "game.RechargeView", WinLay.MODULE_LAY, "RechargeViewSkin", [], "", { y: 64 }),
            _a[WinName.FORTUNE] = new WinManagerVO(WinName.FORTUNE, "game.FortuneView", WinLay.MODULE_LAY, "FortuneWheelViewSkin", [], "", { y: 64 }),
            _a[WinName.HEGEMONY] = new WinManagerVO(WinName.HEGEMONY, "game.LabberHegemonyWin", WinLay.MODULE_LAY, "LabberHegemonySkin", []),
            _a[WinName.HEGEMONY_LABBER_TIPS] = new WinManagerVO(WinName.HEGEMONY_LABBER_TIPS, "game.LabberTipsView", WinLay.BOTTOM_LAY, "LabberTipsSkin", []),
            _a[WinName.HEGEMONY_LABBER_REWARD] = new WinManagerVO(WinName.HEGEMONY_LABBER_REWARD, "game.LabberRewardView", WinLay.BOTTOM_LAY, "LabberRewardSkin", []),
            _a[WinName.HEGEMONY_LABBER_RESULT] = new WinManagerVO(WinName.HEGEMONY_LABBER_RESULT, "game.LabberResultView", WinLay.BOTTOM_LAY, "LabberResultSkin", []),
            _a[WinName.WORLDBOSS] = new WinManagerVO(WinName.WORLDBOSS, "game.WorldBossView", WinLay.MODULE_LAY, "WorldBossSkin", []),
            _a[WinName.WORLDBOSS_KILL_RECORD] = new WinManagerVO(WinName.WORLDBOSS_KILL_RECORD, "game.WorldBossKillRecord", WinLay.PANEL_LAY, "WorldBossKillRecord", [], "", {}, true, false, false, 1),
            _a[WinName.WORLDBOSS_REWARD] = new WinManagerVO(WinName.WORLDBOSS_REWARD, "game.WorldBossReward", WinLay.PANEL_LAY, "WorldBossReward", [], "", {}, true, false, false, 1),
            _a[WinName.WORLDBOSS_FIGHT] = new WinManagerVO(WinName.WORLDBOSS_FIGHT, "game.WorldBossFight", WinLay.MAIN_UI_LAY, "WorldBossFight", []),
            _a[WinName.WORLDBOSS_CHEER] = new WinManagerVO(WinName.WORLDBOSS_CHEER, "game.WorldBossCheer", WinLay.PANEL_LAY, "WorldBossCheer", [], "", {}, true, false, false, 1),
            _a[WinName.WORLDBOSS_BUY_TIMES] = new WinManagerVO(WinName.WORLDBOSS_BUY_TIMES, "game.WorldBossBuyTimes", WinLay.PANEL_LAY, "WorldBossBuyTimes", [], "", {}, true, false, false, 1),
            _a[WinName.ENCOUNTER_LOGS] = new WinManagerVO(WinName.ENCOUNTER_LOGS, "game.EncounterLogView", WinLay.BOTTOM_LAY, "EncounterLogSkin", []),
            // [WinName.ENCOUNTER_REWARD]: new WinManagerVO(WinName.ENCOUNTER_REWARD, "game.EncounterRewardView", WinLay.PANEL_LAY, "EncounterRewardViewSkin", []),
            _a[WinName.WORLDBOSS_REVIVE] = new WinManagerVO(WinName.WORLDBOSS_REVIVE, "game.WorldBossRevive", WinLay.MAIN_UI_LAY, "WorldBossRevive", [], "", { y: 510, x: 258 }),
            _a[WinName.COUNTERDOWN] = new WinManagerVO(WinName.COUNTERDOWN, "game.CountDownView", WinLay.BOTTOM_LAY, "CountDownSkin", [], "", null, false),
            _a[WinName.METAL] = new WinManagerVO(WinName.METAL, "game.MetalView", WinLay.MODULE_LAY, "MetalSkin", []),
            _a[WinName.RankGuanqia] = new WinManagerVO(WinName.RankGuanqia, "game.RankGuanqiaView", WinLay.MODULE_LAY, "RankGuanqiaViewSkin", [], "", { y: 64 }),
            _a[WinName.CHATPORT] = new WinManagerVO(WinName.CHATPORT, "game.ChatPortView", WinLay.SCENE_UI_LAY, "ChatPortSkin", [], "", null, false),
            _a[WinName.ITEMTIPS] = new WinManagerVO(WinName.ITEMTIPS, "game.ItemTips", WinLay.PANEL_LAY, "ItemTipSkin", [], "", {}, true, false, false, 1, 1),
            _a[WinName.ITEMWAYS] = new WinManagerVO(WinName.ITEMWAYS, "ItemWays", WinLay.PANEL_LAY, "ItemWaySkin", [], "", {}, true, false, false, 1, 1),
            _a[WinName.ALERTTIPS] = new WinManagerVO(WinName.ALERTTIPS, "AlertTips", WinLay.PANEL_LAY, "AlertTipsSkin", [], "", {}, true, false, false, 1, 1),
            _a[WinName.BOSS_COMING] = new WinManagerVO(WinName.BOSS_COMING, "game.BossComing", WinLay.MAIN_UI_LAY, "BossComing"),
            _a);
        this._winPopConfig = (_b = {},
            _b[WinName.POP_MAILDETAIL] = new WinManagerVO(WinName.POP_MAILDETAIL, "game.MailDetail", WinLay.PANEL_LAY, "MailDetailSkin", [], "", { y: 64 }, true, false, true, 1),
            _b[WinName.POP_RANK_QUESTION] = new WinManagerVO(WinName.POP_RANK_QUESTION, "game.RankTipsView", WinLay.PANEL_LAY, "RankTipsSkin", [], "", { y: 64 }, true, false, true, 1),
            _b[WinName.POP_SIGN_VIP] = new WinManagerVO(WinName.POP_SIGN_VIP, "game.SignVipPrompt", WinLay.PANEL_LAY, "SignVipPromptSkin", [], "", { y: 64 }, true, false, true, 1),
            _b[WinName.POP_SIGN_VIP] = new WinManagerVO(WinName.POP_SIGN_VIP, "game.SignVipPrompt", WinLay.PANEL_LAY, "SignVipPromptSkin", [], "", { y: 64 }, true, false, true, 1),
            _b[WinName.POP_SYNTHESISSUCCESS] = new WinManagerVO(WinName.POP_SYNTHESISSUCCESS, "game.SynthesisSuccessView", WinLay.PANEL_LAY, "SynthesisSuccessSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_SHOP_BUY] = new WinManagerVO(WinName.POP_SHOP_BUY, "game.ShopBuyWinView", WinLay.PANEL_LAY, "ShopBuyWinSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_REBORN_POINT] = new WinManagerVO(WinName.POP_REBORN_POINT, "game.RebornPointView", WinLay.PANEL_LAY, "RebornPointSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_RAIDER_REWARD] = new WinManagerVO(WinName.POP_RAIDER_REWARD, "game.RaiderRewardView", WinLay.PANEL_LAY, "RaiderRewardSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_EQUIPSPECIAL_TIP] = new WinManagerVO(WinName.POP_EQUIPSPECIAL_TIP, "game.EquipSpecialTipView", WinLay.PANEL_LAY, "EquipSpecialTipSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_FAST_FIGHT] = new WinManagerVO(WinName.POP_FAST_FIGHT, "game.FastFightView", WinLay.PANEL_LAY, "FastFightSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_FAST_FIGHT_RESULT] = new WinManagerVO(WinName.POP_FAST_FIGHT_RESULT, "game.FastFightResultView", WinLay.PANEL_LAY, "FastFightResultSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_Encounter_Reward] = new WinManagerVO(WinName.POP_Encounter_Reward, "game.EncounterRewardView", WinLay.PANEL_LAY, "EncounterRewardViewSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_PLAYER_MSG] = new WinManagerVO(WinName.POP_PLAYER_MSG, "game.PlayerMsgWin", WinLay.PANEL_LAY, "PlayerMsgSkin", [], "", { y: 64 }, true, false, true, 1),
            _b[WinName.POP_PLAYER_HERO_ATTR] = new WinManagerVO(WinName.POP_PLAYER_HERO_ATTR, "game.PlayerHeroAttr", WinLay.PANEL_LAY, "PlayerHeroAttrSkin", [], "", { y: 64 }, true, false, true, 1),
            _b[WinName.POP_OFFLINE_RESULT] = new WinManagerVO(WinName.POP_OFFLINE_RESULT, "game.MainOffline", WinLay.PANEL_LAY, "MainOfflineSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_FORGE_STAR] = new WinManagerVO(WinName.POP_FORGE_STAR, "game.ForgeStarInfo", WinLay.PANEL_LAY, "ForgeStarInfoSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_FORGE_EQUIP] = new WinManagerVO(WinName.POP_FORGE_EQUIP, "game.ForgeEquipInfo", WinLay.PANEL_LAY, "ForgeEquipSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_EQUIP_SELECT] = new WinManagerVO(WinName.POP_EQUIP_SELECT, "game.EquipSelect", WinLay.PANEL_LAY, "EquipSelectSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_JEWEL_TIP] = new WinManagerVO(WinName.POP_JEWEL_TIP, "game.JewelTipView", WinLay.PANEL_LAY, "JewelTipSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_JEWEL_MASTER] = new WinManagerVO(WinName.POP_JEWEL_MASTER, "game.JewelMasterView", WinLay.PANEL_LAY, "JewelMasterSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_JEWEL_SUPER] = new WinManagerVO(WinName.POP_JEWEL_SUPER, "game.JewelSuperView", WinLay.PANEL_LAY, "JewelSuperSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_LOGIN_SERVER] = new WinManagerVO(WinName.POP_LOGIN_SERVER, "game.LoginServer", WinLay.PANEL_LAY, "LoginServer", [], "", {}, true, false, true, 1),
            _b[WinName.POP_LOGIN_CREATE] = new WinManagerVO(WinName.POP_LOGIN_CREATE, "game.LoginCreateRole", WinLay.PANEL_LAY, "LoginCreateRoleSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_INVEST_TIPS] = new WinManagerVO(WinName.POP_INVEST_TIPS, "game.InvestTipsView", WinLay.PANEL_LAY, "InvestTipsSkin", [], "", { y: 64 }, true, false, true, 1),
            _b[WinName.POP_FORTUNE_RESULT] = new WinManagerVO(WinName.POP_FORTUNE_RESULT, "game.FortuneResultView", WinLay.PANEL_LAY, "FortuneResultSkin", [], "", { y: 64 }, true, false, true, 1),
            _b[WinName.POP_SMELT] = new WinManagerVO(WinName.POP_SMELT, "game.SmeltView", WinLay.PANEL_LAY, "SmeltSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_SMELT_ORANGE] = new WinManagerVO(WinName.POP_SMELT_ORANGE, "game.SmeltOrangeView", WinLay.PANEL_LAY, "SmeltOrangeSkin", [], "", {}, true, false, true, 1),
            _b[WinName.POP_SHOP_PREVIEW] = new WinManagerVO(WinName.POP_SHOP_PREVIEW, "game.ShopPreviewView", WinLay.PANEL_LAY, "ShopPreviewSkin", [], "", {}, true, false, true, 1),
            _b);
        var _a, _b;
    }
    WinManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new WinManager();
        }
        return this._instance;
    };
    /**
     * 显示窗口
     * @param winName 窗口名称
     * @param openParam 开启传入参数
     */
    WinManager.prototype.openWin = function (winName, openParam) {
        if (openParam === void 0) { openParam = null; }
        App.logzsq("WinManager.openWin " + winName);
        //通用模块打开规则，这里统一入口，暂时放这，以后看下如何抽取出来
        if (!App.GuideManager.isModuleOpen(winName)) {
            App.GuideManager.moduleNotOpenTip(winName);
            return false;
        }
        var vo = this._winConfig[winName];
        if (!vo) {
            vo = this._winPopConfig[winName];
        }
        if (vo) {
            if (vo.layer == WinLay.MODULE_LAY) {
                for (var k in this._moduleArray) {
                    var view = this._winDic[this._moduleArray[k]];
                    if (view && this._moduleArray[k] != vo.winName) {
                        this.closeWin(this._moduleArray[k]);
                        // view.visible = false;
                    }
                    else if (view && view.visible && this._moduleArray[k] == vo.winName) {
                        // this.closeWin(this._moduleArray[k]);
                        // return;
                    }
                }
            }
            if (this._winDic[vo.winName]) {
                var view = this._winDic[vo.winName];
                if (vo.preLoadRes && vo.preLoadRes.length > 0) {
                    view.preloadRes(vo.preLoadRes, openParam);
                }
                else {
                    view.visible = true;
                    view.readyOpenWin(openParam);
                }
                //view.readyOpenWin(openParam);                     
            }
            else {
                var winClass = egret.getDefinitionByName(vo.winClass);
                var view = new winClass(vo);
                if (vo.preLoadRes && vo.preLoadRes.length > 0) {
                    view.preloadRes(vo.preLoadRes, openParam);
                }
                else {
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
        }
        else {
            App.logzsq("显示的窗口名未配置");
        }
    };
    /**
     * 关闭窗口
     * @param winName 窗口名称
     */
    WinManager.prototype.closeWin = function (winName) {
        var _this = this;
        App.logzsq("WinManager.closeWin " + winName);
        var vo = this._winConfig[winName];
        if (!vo) {
            vo = this._winPopConfig[winName];
        }
        if (vo) {
            var view_1 = this._winDic[vo.winName];
            if (view_1) {
                var callback = function () {
                    view_1.clear();
                    view_1.visible = false;
                    //打开上一个窗口
                    if (vo.layer == WinLay.MODULE_LAY) {
                        _this._moduleArray.splice(_this._moduleArray.length - 1, 1);
                    }
                    // let myView = this._winDic[this._moduleArray[this._moduleArray.length - 1]];
                    // if (myView && myView != view && !myView.visible) {
                    // 	myView.visible = true;
                    // }
                    if (vo.closeDestroy) {
                        view_1.destroy();
                        _this._eventSystem.dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(vo, view_1));
                        _this._winDic[winName] = null;
                        delete _this._winDic[winName];
                    }
                    else {
                    }
                };
                callback();
                // callback.bind(this);
                // view.closeWin(callback);
            }
            else {
                //this._winDic[winName] = null;
                delete this._winDic[winName];
            }
            this._eventSystem.dispatchEvent(WinManagerEvent.WIN_CLOSE, vo);
        }
        else {
            App.logzsq("关闭的窗口名未配置");
        }
    };
    /**
 * 显示弹窗窗口
 * @param winName 窗口名称
 * @param openParam 开启传入参数
 */
    WinManager.prototype.openPopWin = function (winName, openParam) {
        if (openParam === void 0) { openParam = null; }
        App.logzsq("WinManager.openPopWin " + winName);
        //通用模块打开规则，这里统一入口，暂时放这，以后看下如何抽取出来
        if (!App.GuideManager.isModuleOpen(winName)) {
            App.GuideManager.moduleNotOpenTip(winName);
            return false;
        }
        var vo = this._winPopConfig[winName];
        if (!vo) {
            vo = this._winConfig[winName];
        }
        if (vo) {
            if (vo.layer == WinLay.MODULE_LAY) {
                for (var k in this._moduleArray) {
                    var view = this._winDic[this._moduleArray[k]];
                    if (view && this._moduleArray[k] != vo.winName) {
                        this.closeWin(this._moduleArray[k]);
                        // view.visible = false;
                    }
                    else if (view && view.visible && this._moduleArray[k] == vo.winName) {
                        // this.closeWin(this._moduleArray[k]);
                        // return;
                    }
                }
            }
            if (this._winDic[vo.winName]) {
                var view = this._winDic[vo.winName];
                if (vo.preLoadRes && vo.preLoadRes.length > 0) {
                    view.preloadRes(vo.preLoadRes, openParam);
                }
                else {
                    view.visible = true;
                    view.readyOpenWin(openParam);
                }
                //view.readyOpenWin(openParam);                     
            }
            else {
                var winClass = egret.getDefinitionByName(vo.winClass);
                var view = new winClass(vo);
                if (vo.preLoadRes && vo.preLoadRes.length > 0) {
                    view.preloadRes(vo.preLoadRes, openParam);
                }
                else {
                    view.visible = true;
                    view.readyOpenWin(openParam);
                }
                this._winDic[vo.winName] = view;
                this._eventSystem.dispatchEvent(WinManagerEvent.WIN_ADD, new WinManagerEvent(vo, view));
            }
            if (vo.layer == WinLay.MODULE_LAY) {
                this._moduleArray.push(vo.winName);
            }
        }
        else {
            App.logzsq("显示的窗口名未配置");
        }
    };
    /**
     * 关闭弹窗窗口
     * @param winName 窗口名称
     */
    WinManager.prototype.closePopWin = function (winName) {
        var _this = this;
        App.logzsq("WinManager.closeWin " + winName);
        var vo = this._winPopConfig[winName];
        if (!vo) {
            vo = this._winConfig[winName];
        }
        if (vo) {
            var view_2 = this._winDic[vo.winName];
            if (view_2) {
                var callback = function () {
                    view_2.clear();
                    view_2.visible = false;
                    //打开上一个窗口
                    if (vo.layer == WinLay.MODULE_LAY) {
                        _this._moduleArray.splice(_this._moduleArray.length - 1, 1);
                    }
                    // let myView = this._winDic[this._moduleArray[this._moduleArray.length - 1]];
                    // if (myView && myView != view && !myView.visible) {
                    // 	myView.visible = true;
                    // }
                    if (vo.closeDestroy) {
                        view_2.destroy();
                        _this._eventSystem.dispatchEvent(WinManagerEvent.WIN_REMOVE, new WinManagerEvent(vo, view_2));
                        _this._winDic[winName] = null;
                        delete _this._winDic[winName];
                    }
                    else {
                    }
                };
                callback();
                // callback.bind(this);
                // view.closeWin(callback);
            }
            else {
                //this._winDic[winName] = null;
                delete this._winDic[winName];
            }
        }
        else {
            App.logzsq("关闭的窗口名未配置");
        }
    };
    /**
     * 获取窗口
     * @param winName 窗口名称
     */
    WinManager.prototype.getWin = function (winName) {
        return this._winDic[winName];
    };
    /**
     * 获取窗口是否打开
     * @param winName 窗口名称
     */
    WinManager.prototype.isOpen = function (winName) {
        if (this._winDic[winName] && this._winDic[winName].visible) {
            return true;
        }
        return false;
    };
    /**
     * 关闭所有窗口
     *
     */
    WinManager.prototype.closeAllWindow = function () {
        for (var winName in this._winDic) {
            this.closeWin(winName);
        }
    };
    return WinManager;
}());
__reflect(WinManager.prototype, "WinManager");
/**
 * 窗口管理事件
 */
var WinManagerEvent = (function () {
    function WinManagerEvent(vo, view) {
        this.vo = vo;
        this.view = view;
    }
    WinManagerEvent.prototype.setView = function (v) {
        this.view = v;
    };
    WinManagerEvent.WIN_ADD = "WIN_ADD_SCENE";
    WinManagerEvent.WIN_REMOVE = "WIN_REMOVE_SCENE";
    WinManagerEvent.WIN_OPEN = "WIN_OPEN";
    WinManagerEvent.WIN_CLOSE = "WIN_CLOSE";
    return WinManagerEvent;
}());
__reflect(WinManagerEvent.prototype, "WinManagerEvent");
/**
 * 窗口管理VO
 */
var WinManagerVO = (function () {
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
    function WinManagerVO(winName, winClass, layer, skinName, preLoadRes, title, param, closeDestroy, useCloseBtn, useBg, openModel, closeModel) {
        if (skinName === void 0) { skinName = ""; }
        if (preLoadRes === void 0) { preLoadRes = null; }
        if (title === void 0) { title = ""; }
        if (param === void 0) { param = null; }
        if (closeDestroy === void 0) { closeDestroy = true; }
        if (useCloseBtn === void 0) { useCloseBtn = false; }
        if (useBg === void 0) { useBg = false; }
        if (openModel === void 0) { openModel = 0; }
        if (closeModel === void 0) { closeModel = 0; }
        this.preLoadRes = []; //预加载资源列表
        this.title = ""; //标题
        this.closeDestroy = true; //关闭是否销毁
        this.useCloseBtn = false; //是否使用关闭按钮
        this.useBg = false; //是否使用背景
        this.openModel = 0; //打开动画模式
        this.closeModel = 0; //关闭动作模式
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
    return WinManagerVO;
}());
__reflect(WinManagerVO.prototype, "WinManagerVO");
var WinLay;
(function (WinLay) {
    WinLay[WinLay["SCENE_LAY"] = 1] = "SCENE_LAY";
    WinLay[WinLay["SCENE_UI_LAY"] = 2] = "SCENE_UI_LAY";
    WinLay[WinLay["MAIN_UI_LAY"] = 3] = "MAIN_UI_LAY";
    WinLay[WinLay["MODULE_LAY"] = 4] = "MODULE_LAY";
    WinLay[WinLay["BOTTOM_LAY"] = 5] = "BOTTOM_LAY";
    WinLay[WinLay["PANEL_LAY"] = 6] = "PANEL_LAY";
    WinLay[WinLay["EFFECT_LAY"] = 7] = "EFFECT_LAY";
    WinLay[WinLay["MASK_LAY"] = 8] = "MASK_LAY";
    WinLay[WinLay["LOAD_LAY"] = 9] = "LOAD_LAY";
    WinLay[WinLay["GUIDE_LAY"] = 10] = "GUIDE_LAY";
})(WinLay || (WinLay = {}));
//# sourceMappingURL=WinManager.js.map