/**
 * 提示类型
 */
const ConstBtnTipType = {
	NULL:0,
	TEST:1,

	FORGE:11,//锻造系统
	FORGE_STRENGTH:111,//锻造强化
	FORGE_STAR:112,//锻造升星


	ROLE:12,//角色系统（1类）
	ROLE_EQUIP:121, //角色装备
	// ROLE_WING:121,//角色翅膀
	// ROLE_WING_TRAIN:1211,//角色翅膀培养
	// ROLE_WING_EQUIP:1212,//角色翅膀装备
	ROLE_SKILL:122,//角色技能
	ROLE_RUBY:123,//角色宝石\
	ROLE_RUBY_COMNINE:1231,//角色宝石合成

	ROLE_RUBY_COMNINE_GEMSTONE:12311,//角色宝石合成宝石
	ROLE_RUBY_COMNINE_WING:12312,//角色宝石合成 羽翼

	ROLE_RUBY_EMBED:1232,//角色宝石镶嵌

	ROLE_REBORN:124,//角色重生
	ROLE_REBORN_UP:1241,//角色重生提升
	ROLE_REBORN_CULTURE:1242,//角色重生获取修为

	ROLE_ORANGEEQUIP:125,//角色橙装

	BACKPACK:13,//背包
	BACKPACK_SMELT:131,//背包熔炼装备
	BACKPACK_SMELTORANGE:132,//背包熔炼装备

	BOSS:14,//BOSS模块
	BOSS_CHALLENGE:141,//boss挑战
	
	CHAT:15,//聊天

	MAIL:16,//邮件

	TASK:17,//每日必做，任务
	TASK_MEDAL:171,//每日必做，任务 勋章
	TASK_ACHIEVE:172,//每日必做，任务成就
	TASK_ACHIEVETITLE:174,//每日必做，任务成就称号   111
	TASK_DAILY:173,//每日必做，任务 每日必做

	MOUTHCARD:18,//月卡

	WELFARE:19,//福利
	WELFARE_SIGN:191,//福利 签到
	WELFARE_LEVEN:192,//福利 等级

	WING :20,//翅膀
	WING_TRAIN:201,//角色翅膀培养
	WING_EQUIP:202,//角色翅膀装备

	COPY:21,//副本  111
	COPY_PERSONAL:211,//个人boss 111
	COPY_MATERIAL:212,//材料boss 111
	COPY_CHALLENGE:214,//挑战Boss副本 111

	ACTIVITY:22,//活动   111
	ACTIVITY_AllRECHARGE:221,//累计充值  111
	ACTIVITY_DAILYRECHARGE:222,//每日充值  111

	VIPGIFT:23,//vip礼包  111、

	AREAN:24,//竞技场 111
	AREAN_ENCOUNTER:241,//竞技场遭遇 111
	AREAN_LABBER:242,//竞技场争霸 111

	METAL:25, //勋章

	RAIDER:26, //寻宝
	
}

const ConstBtnTipTypeParent = {
	[ConstBtnTipType.FORGE_STRENGTH]:ConstBtnTipType.FORGE,
	[ConstBtnTipType.FORGE_STAR]:ConstBtnTipType.FORGE,

	// [ConstBtnTipType.ROLE_WING]:ConstBtnTipType.ROLE,
	[ConstBtnTipType.ROLE_EQUIP]:ConstBtnTipType.ROLE,
	[ConstBtnTipType.ROLE_SKILL]:ConstBtnTipType.ROLE,
	[ConstBtnTipType.ROLE_RUBY]:ConstBtnTipType.ROLE,
	[ConstBtnTipType.ROLE_REBORN]:ConstBtnTipType.ROLE,
	[ConstBtnTipType.ROLE_RUBY_COMNINE]:ConstBtnTipType.ROLE_RUBY,
	[ConstBtnTipType.ROLE_RUBY_EMBED]:ConstBtnTipType.ROLE_RUBY,
	[ConstBtnTipType.WING_TRAIN]:ConstBtnTipType.WING,
	[ConstBtnTipType.WING_EQUIP]:ConstBtnTipType.WING,
	[ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE]:ConstBtnTipType.ROLE_RUBY_COMNINE,
	[ConstBtnTipType.ROLE_RUBY_COMNINE_WING]:ConstBtnTipType.ROLE_RUBY_COMNINE,
	[ConstBtnTipType.ROLE_REBORN_UP]:ConstBtnTipType.ROLE_REBORN,
	[ConstBtnTipType.ROLE_REBORN_CULTURE]:ConstBtnTipType.ROLE_REBORN,
	[ConstBtnTipType.BACKPACK_SMELT]:ConstBtnTipType.BACKPACK,
	[ConstBtnTipType.BACKPACK_SMELTORANGE]:ConstBtnTipType.BACKPACK,
	[ConstBtnTipType.BOSS_CHALLENGE]:ConstBtnTipType.BOSS,
	[ConstBtnTipType.TASK_MEDAL]:ConstBtnTipType.TASK,
	[ConstBtnTipType.TASK_ACHIEVE]:ConstBtnTipType.TASK,
	[ConstBtnTipType.TASK_ACHIEVETITLE]:ConstBtnTipType.TASK,
	[ConstBtnTipType.TASK_DAILY]:ConstBtnTipType.TASK,
	[ConstBtnTipType.WELFARE_SIGN]:ConstBtnTipType.WELFARE,
	[ConstBtnTipType.WELFARE_LEVEN]:ConstBtnTipType.WELFARE,

	[ConstBtnTipType.COPY_PERSONAL]:ConstBtnTipType.COPY,
	[ConstBtnTipType.COPY_MATERIAL]:ConstBtnTipType.COPY,
	[ConstBtnTipType.COPY_CHALLENGE]:ConstBtnTipType.COPY,

	[ConstBtnTipType.ACTIVITY_AllRECHARGE]:ConstBtnTipType.ACTIVITY,
	[ConstBtnTipType.ACTIVITY_DAILYRECHARGE]:ConstBtnTipType.ACTIVITY,

	[ConstBtnTipType.AREAN_ENCOUNTER]:ConstBtnTipType.AREAN,
	[ConstBtnTipType.AREAN_LABBER]:ConstBtnTipType.AREAN,
}
const ConstBtnTipTypeChild = {
	[ConstBtnTipType.FORGE]:[ConstBtnTipType.FORGE_STRENGTH,ConstBtnTipType.FORGE_STAR],
	[ConstBtnTipType.ROLE]:[ConstBtnTipType.ROLE_EQUIP,ConstBtnTipType.ROLE_SKILL,ConstBtnTipType.ROLE_RUBY,ConstBtnTipType.ROLE_REBORN,ConstBtnTipType.ROLE_ORANGEEQUIP],
	// [ConstBtnTipType.ROLE]:[ConstBtnTipType.ROLE_WING,ConstBtnTipType.ROLE_SKILL,ConstBtnTipType.ROLE_RUBY,ConstBtnTipType.ROLE_REBORN,ConstBtnTipType.ROLE_ORANGEEQUIP],
	// [ConstBtnTipType.ROLE_WING]:[ConstBtnTipType.ROLE_WING_TRAIN,ConstBtnTipType.ROLE_WING_EQUIP],
	[ConstBtnTipType.WING]:[ConstBtnTipType.WING_TRAIN,ConstBtnTipType.WING_EQUIP],
	[ConstBtnTipType.ROLE_RUBY]:[ConstBtnTipType.ROLE_RUBY_COMNINE,ConstBtnTipType.ROLE_RUBY_EMBED],
	[ConstBtnTipType.ROLE_RUBY_COMNINE]:[ConstBtnTipType.ROLE_RUBY_COMNINE_GEMSTONE,ConstBtnTipType.ROLE_RUBY_COMNINE_WING],
	[ConstBtnTipType.ROLE_REBORN]:[ConstBtnTipType.ROLE_REBORN_UP,ConstBtnTipType.ROLE_REBORN_CULTURE],
	[ConstBtnTipType.BACKPACK]:[ConstBtnTipType.BACKPACK_SMELT,ConstBtnTipType.BACKPACK_SMELTORANGE],
	[ConstBtnTipType.BOSS]:[ConstBtnTipType.BOSS_CHALLENGE],
	[ConstBtnTipType.TASK]:[ConstBtnTipType.TASK_MEDAL,ConstBtnTipType.TASK_ACHIEVE,ConstBtnTipType.TASK_ACHIEVETITLE,ConstBtnTipType.TASK_DAILY],
	[ConstBtnTipType.WELFARE]:[ConstBtnTipType.WELFARE_SIGN,ConstBtnTipType.WELFARE_LEVEN],

	[ConstBtnTipType.COPY]:[ConstBtnTipType.COPY_PERSONAL,ConstBtnTipType.COPY_MATERIAL,ConstBtnTipType.COPY_CHALLENGE],
	[ConstBtnTipType.ACTIVITY]:[ConstBtnTipType.ACTIVITY_AllRECHARGE,ConstBtnTipType.ACTIVITY_DAILYRECHARGE],
	[ConstBtnTipType.AREAN]:[ConstBtnTipType.AREAN_ENCOUNTER,ConstBtnTipType.AREAN_LABBER],
}

/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 按钮提示管理器（代码不能乱改)
 * 使用方法：
 * App.BtnTipManager.addBtnTipItem(ConstBtnTipType.TESt,item,19,-12) 统一管理使用方法
 *  App.BtnTipManager.creatBtnTip("升",item,19,-12) 模块自己管理方法，只是创建红点，需要自己去更新显示
 */
class BtnTipManager {
	private _btnTipsTypeDic:any = {};//按钮提示类型字典
	private _btnTipsItemDic:any = {};//按钮提示显示对象字典 key为btnTipsType

	private _BtnTipsTypeParent:any = {};//提示类型父子关系
	private static _instance:BtnTipManager;
	public static getInstance():BtnTipManager {
        if(this._instance == null){
			this._instance = new BtnTipManager();
		}
        return this._instance;
    }
	public constructor() {
		
	}
	public init(){
		this._btnTipsTypeDic = {};
		this._btnTipsItemDic = {};
	}
	/**
	 * 获取类型值
	 */
	public getTypeValue(type:number){
		return this._btnTipsTypeDic[type];
	}

	/**
	 *  设置类型值
	 */
	public setTypeValue(type:number,data:any){
		if(this._btnTipsTypeDic[type] == data){return;}
		this._btnTipsTypeDic[type] = data;
		if(data && data !=0){
			if(this._btnTipsItemDic[type]){
				(this._btnTipsItemDic[type] as BaseBtnTips).show(data);
			}
			var parentType:number = ConstBtnTipTypeParent[type];
			if(parentType){
				this.updateParentTypeValue(parentType,data);
			}
		}else{
			if(this._btnTipsItemDic[type]){
				(this._btnTipsItemDic[type] as BaseBtnTips).hide();
			}
			var parentType:number = ConstBtnTipTypeParent[type];
			if(parentType){
				this.updateParentTypeValue(parentType,false);
			}
		}
	}
	//更新父级
	private updateParentTypeValue(type:number,data:any){
		var childs:Array<number> = ConstBtnTipTypeChild[type];
		var newValue:any = false;
		for(var i:number = 0;i<childs.length;i++){
			var value:any = this._btnTipsTypeDic[childs[i]];
			if(value){
				newValue = value;
				break;
			}
		}
		this.setTypeValue(type,newValue);
	}
	private deleteTypeValue(type:number){
		this._btnTipsItemDic[type] = null;
		delete this._btnTipsItemDic[type];
	}

	/**
	 * 创建按钮提示(单独外部使用)
	 */
	public creatBtnTip(str:any,parent:egret.DisplayObjectContainer,xx?:number,yy?:number):BtnTips{
		return new BtnTips(str,parent,xx,yy);
	}

	/**
	 * 添加按钮提示(管理器添加)
	 */
	public addBtnTipItem(type:number,parent:egret.DisplayObjectContainer,xx?:number,yy?:number){
		if(this._btnTipsItemDic[type]){
		}else{
			var item:BaseBtnTips = new BaseBtnTips(type,parent,xx,yy);
		}
	}
	/**
	 * 设置类型对应的Item（外部不要用）
	 */
	public setTypeItem(type:number,item:BaseBtnTips){
		if(item){
			this._btnTipsItemDic[type] = item;
			var data:any = this._btnTipsTypeDic[type];
			if(data && data !=0){
				item.show(data);
			}else{
				item.hide();
			}
		}
	}

	/**
	 * 删除类型对应的Item（外部不要用）
	 */
	public deleteTypeItem(type:number){
		var item:BaseBtnTips = this._btnTipsItemDic[type];
		if(item){
			item.hide();
			this._btnTipsItemDic[type] = null;
			delete this._btnTipsItemDic[type];
		}
	}
	/**
	 * 销毁
	 */
	public destroy(){
		this._btnTipsTypeDic = {};
		this._btnTipsItemDic = {};
	}
}