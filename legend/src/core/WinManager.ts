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
	SMELT: "SMELT",     //熔炼
	SMELT_ORANGE: "SMELT_ORANGE",  //熔炼橙装
	FORGE: "FORGE",     //锻造
	SHOP: "SHOP",     //商城
	BOSS: "BOSS",    //boss模块
	BOSS_WIN: "BOSS_WIN",   //挑战boss胜利窗口
	BOSS_LOSE: "BOSS_LOSE",  //挑战boss失败窗口
	BOSS_BAG_TIP: "BOSS_BAG_TIP",  //背包容量不足
	INCOME_PROMOTE: "INCOME_PROMOTE",  //关卡收益提升
	WING: "WING",  //翅膀模块
	CHAT: "CHAT",  //聊天窗口
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
	FORGE_ORANGE: "FORGE_ORANGE",  //橙装升级
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
	HEGEMONY: "HEGEMONY", //天梯争霸
	HEGEMONY_LABBER_TIPS: "HEGEMONY_LABBER_TIPS",//天梯玩法提示
	HEGEMONY_LABBER_REWARD: "HEGEMONY_LABBER_REWARD",//天梯奖励
	HEGEMONY_LABBER_RESULT: "HEGEMONY_LABBER_RESULT",//战斗结果		
	WORLDBOSS: "WORLDBOSS",  //世界boss主界面
	WORLDBOSS_KILL_RECORD: "WORLDBOSS_KILL_RECORD",  //世界boss击杀记录弹窗
	WORLDBOSS_REWARD: "WORLDBOSS_REWARD",  //世界boss奖励介绍	 
	WORLDBOSS_FIGHT: "WORLDBOSS_FIGHT",   //挑战世界boss时
	WORLDBOSS_CHEER: "WORLDBOSS_CHEER",   //挑战世界boss时助威
	WORLDBOSS_BUY_TIMES: "WORLDBOSS_BUY_TIMES",  //世界boss购买次数
	// ENCOUNTER_REWARD:"ENCOUNTER_REWARD",//遭遇战每日奖励界面
	WORLDBOSS_REVIVE: "WORLDBOSS_REVIVE",  //世界boss复活
	ENCOUNTER_REWARD:"ENCOUNTER_REWARD",//遭遇战每日奖励界面
	ENCOUNTER_LOGS: "ENCOUNTER_LOGS",//遭遇战战斗记录
	COUNTERDOWN:"COUNTERDOWN",
	METAL:"METAL",
}
class WinManager {
	private _winDic: Object = {};//窗口字典
	private _winConfig: Object = {};//窗口配置文件
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
			[WinName.HERO]: new WinManagerVO(WinName.HERO, "game.HeroView", WinLay.MODULE_LAY, "HeroSkin", [], "", { y: 64 }),
			[WinName.BACKPACK]: new WinManagerVO(WinName.BACKPACK, "game.BackpackView", WinLay.MODULE_LAY, "BackpackSkin", [], "", { y: 64 }, true, false, false, 0, 0),
			[WinName.FIGHT]: new WinManagerVO(WinName.FIGHT, "game.FightScene", WinLay.SCENE_LAY, "FightSkin", []),
			[WinName.BROADCAST]: new WinManagerVO(WinName.BROADCAST, "game.BroadcastView", WinLay.SCENE_UI_LAY, "BroadcastSkin", [], "", null, false),
			[WinName.SMELT]: new WinManagerVO(WinName.SMELT, "game.SmeltView", WinLay.MODULE_LAY, "SmeltSkin", [], "", { y: 64 }, false),
			[WinName.SMELT_ORANGE]: new WinManagerVO(WinName.SMELT_ORANGE, "game.SmeltOrangeView", WinLay.MODULE_LAY, "SmeltOrangeSkin", [], "", { y: 64 }, true),
			[WinName.FORGE]: new WinManagerVO(WinName.FORGE, "game.ForgeView", WinLay.MODULE_LAY, "ForgeSkin", [], "", { y: 64 }, false),
			[WinName.SHOP]: new WinManagerVO(WinName.SHOP, "game.ShopView", WinLay.MODULE_LAY, "ShopSkin", [], "", { y: 64 }, false),
			[WinName.BOSS]: new WinManagerVO(WinName.BOSS, "game.BossView", WinLay.MODULE_LAY, "BossSkin", []),
			[WinName.BOSS_WIN]: new WinManagerVO(WinName.BOSS_WIN, "game.BossWin", WinLay.MODULE_LAY, "BossWin", []),
			[WinName.BOSS_LOSE]: new WinManagerVO(WinName.BOSS_LOSE, "game.BossLose", WinLay.MODULE_LAY, "BossLose", []),
			[WinName.BOSS_BAG_TIP]: new WinManagerVO(WinName.BOSS_BAG_TIP, "game.BagCapacityTip", WinLay.PANEL_LAY, "BagCapacityTipSkin", []),
			[WinName.INCOME_PROMOTE]: new WinManagerVO(WinName.INCOME_PROMOTE, "game.incomePromote", WinLay.MODULE_LAY, "incomePromote", []),
			[WinName.WING]: new WinManagerVO(WinName.WING, "game.WingView", WinLay.MODULE_LAY, "WingSkin", []),
			[WinName.WING_STEP_TIP]: new WinManagerVO(WinName.WING_STEP_TIP, "game.goStepTip", WinLay.PANEL_LAY, "goStepTip", [], "", {}, true, false, false, 1),
			[WinName.CHAT]: new WinManagerVO(WinName.CHAT, "game.ChatView", WinLay.MODULE_LAY, "ChatSkin", [], "", { y: 64 }, false),
			[WinName.JEWEL]: new WinManagerVO(WinName.JEWEL, "game.JewelView", WinLay.MODULE_LAY, "JewelSkin", [], "", { y: 64 }, true),
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
			[WinName.ARTIFACT]:new WinManagerVO(WinName.ARTIFACT,"game.ArtifactView",WinLay.MODULE_LAY,"ArtifactSkin",[],"",{y:64}),
			[WinName.INVEST]:new WinManagerVO(WinName.INVEST,"game.InvestView",WinLay.MODULE_LAY,"InvestViewSkin",[],"",{y:64}),
			[WinName.ACTIVITY]:new WinManagerVO(WinName.ACTIVITY,"game.ActivityMainView",WinLay.MODULE_LAY,"ActivityMainViewSkin",[],"",{y:64}),
			[WinName.RECHARGE_FIRST]:new WinManagerVO(WinName.RECHARGE_FIRST,"game.FirstRechargeView",WinLay.MODULE_LAY,"FirstRechargeSkin",[],"",{y:64}),
			[WinName.RECHARGE]:new WinManagerVO(WinName.RECHARGE,"game.RechargeView",WinLay.MODULE_LAY,"RechargeViewSkin",[],"",{y:64}),
			[WinName.FORTUNE]:new WinManagerVO(WinName.FORTUNE,"game.FortuneView",WinLay.MODULE_LAY,"FortuneWheelViewSkin",[],"",{y:64}),
		    [WinName.HEGEMONY]: new WinManagerVO(WinName.HEGEMONY, "game.LabberHegemonyWin", WinLay.MODULE_LAY, "LabberHegemonySkin", []),
            [WinName.HEGEMONY_LABBER_TIPS]: new WinManagerVO(WinName.HEGEMONY_LABBER_TIPS, "game.LabberTipsView", WinLay.BOTTOM_LAY, "LabberTipsSkin", []),
			[WinName.HEGEMONY_LABBER_REWARD]: new WinManagerVO(WinName.HEGEMONY_LABBER_REWARD, "game.LabberRewardView",WinLay.BOTTOM_LAY, "LabberRewardSkin", []),
            [WinName.HEGEMONY_LABBER_RESULT]: new WinManagerVO(WinName.HEGEMONY_LABBER_RESULT, "game.LabberResultView",WinLay.BOTTOM_LAY, "LabberResultSkin", []),
			[WinName.WORLDBOSS]: new WinManagerVO(WinName.WORLDBOSS, "game.WorldBossView", WinLay.MODULE_LAY, "WorldBossSkin", []),
			[WinName.WORLDBOSS_KILL_RECORD]: new WinManagerVO(WinName.WORLDBOSS_KILL_RECORD, "game.WorldBossKillRecord", WinLay.PANEL_LAY, "WorldBossKillRecord", [], "", {}, true, false, false, 1),
			[WinName.WORLDBOSS_REWARD]: new WinManagerVO(WinName.WORLDBOSS_REWARD, "game.WorldBossReward", WinLay.PANEL_LAY, "WorldBossReward", [], "", {}, true, false, false, 1),
			[WinName.WORLDBOSS_FIGHT]: new WinManagerVO(WinName.WORLDBOSS_FIGHT, "game.WorldBossFight", WinLay.MAIN_UI_LAY, "WorldBossFight", []),
			[WinName.WORLDBOSS_CHEER]: new WinManagerVO(WinName.WORLDBOSS_CHEER, "game.WorldBossCheer", WinLay.PANEL_LAY, "WorldBossCheer", [], "", {}, true, false, false, 1),
			[WinName.WORLDBOSS_BUY_TIMES]: new WinManagerVO(WinName.WORLDBOSS_BUY_TIMES, "game.WorldBossBuyTimes", WinLay.PANEL_LAY, "WorldBossBuyTimes", [], "", {}, true, false, false, 1),
			[WinName.ENCOUNTER_LOGS]: new WinManagerVO(WinName.ENCOUNTER_LOGS, "game.EncounterLogView", WinLay.BOTTOM_LAY, "EncounterLogSkin", []),
			// [WinName.ENCOUNTER_REWARD]: new WinManagerVO(WinName.ENCOUNTER_REWARD, "game.EncounterRewardView", WinLay.PANEL_LAY, "EncounterRewardViewSkin", []),
			[WinName.WORLDBOSS_REVIVE]: new WinManagerVO(WinName.WORLDBOSS_REVIVE, "game.WorldBossRevive", WinLay.PANEL_LAY, "WorldBossRevive",  [], "", {}, true, false, false, 1),
			[WinName.COUNTERDOWN]: new WinManagerVO(WinName.COUNTERDOWN, "game.CountDownView", WinLay.BOTTOM_LAY, "CountDownSkin", [], "", null, false),
			[WinName.METAL]:new WinManagerVO(WinName.METAL,"game.MetalView",WinLay.MODULE_LAY, "MetalSkin", []),
		}

	}

	/**
	 * 显示窗口
	 * @param winName 窗口名称
	 * @param openParam 开启传入参数
	 */
	public openWin(winName: string, openParam: any = null) {
		App.logzsq("WinManager.openWin " + winName);
		let vo: WinManagerVO = this._winConfig[winName];
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
	 * 关闭窗口
	 * @param winName 窗口名称
	 */
	public closeWin(winName: string) {
		App.logzsq("WinManager.closeWin " + winName);
		let vo: WinManagerVO = this._winConfig[winName];
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
	 * 显示弹窗窗口
	 * @param winName 窗口名称
	 * @param openParam 开启传入参数
	 */
	public openPanel(winName: string, openParam: any = null) {
		let vo: WinManagerVO = this._winConfig[winName];
		if (this._winDic[vo.winName]) {
			let view: BaseView = this._winDic[vo.winName];
			if (vo.preLoadRes && (vo.preLoadRes as Array<string>).length > 0) {
				view.preloadRes(vo.preLoadRes, openParam);
				// PopUpManager.addPopUp({ obj: view, effectType: vo.openModel });
			} else {
				view.visible = true;
				view.readyOpenWin(openParam);
				// PopUpManager.addPopUp({ obj: view, effectType: 0 })
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
				//PopUpManager.addPopUp({ obj: view, effectType: vo.openModel });
			}
			this._winDic[vo.winName] = view;
		}
	}
	/**
	 * 关闭弹窗窗口
	 * @param winName 窗口名称
	 */
	public closePanel(winName: string) {
		let vo: WinManagerVO = this._winConfig[winName];
		if (vo) {
			let view: BaseView = this._winDic[vo.winName];
			if (view) {
				view.clear();
				if (vo.closeDestroy) {
					view.destroy();
					// PopUpManager.removePopUp(view, vo.closeModel);
					this._winDic[winName] = null;
					delete this._winDic[winName];
				}
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
	public isDrag: boolean = false;//是否允许拖拽
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
	 * @param isDrag boolean 是否允许拖拽
	 * @param useBg boolean 是否使用背景
	 * @param openModel number 打开动画模式 0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
	 * @param closeModel number 关闭动作模式 0：没有动画 1:从中间缩小消失 2：从中间缩小消失  3：从左向右 4：从右向左 5、从上到下 6、从下到上
	 */
	public constructor(winName: string, winClass: string, layer: number, skinName: any = "", preLoadRes: Array<string> = [], title: string = "", param: any = null, closeDestroy: boolean = true, isDrag: boolean = false, useBg: boolean = false, openModel: number = 0, closeModel: number = 0) {
		this.winName = winName;
		this.winClass = winClass;
		this.layer = layer;
		this.skinName = skinName;
		this.preLoadRes = preLoadRes;
		this.title = title;
		this.param = param;
		this.closeDestroy = closeDestroy;
		this.isDrag = isDrag;
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
