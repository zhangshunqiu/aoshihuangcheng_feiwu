/**
 * Author: yangyipeng                                  （必须加上，知道是谁做的）
 * 排行榜模块模型 
 */
module game {
	export class RankModel extends BaseModel{  //model必须继承BaseModel
	
	private _rankObj:any ={
		// "COMBAT":{"rankArr":new eui.ArrayCollection([new RankVo(1),new RankVo(2)]),
		// 			"topRank":new eui.ArrayCollection([new RankVo(1)]),
		// 			"my_rank":99,
		// 			"worship":1
		// 		}
	}

	private _curViewRankType:string;
	private _curRankType:string;

	public constructor() { 
		super();
	}

	public set curViewRankType(type:string)
	{
		this._curViewRankType = type;
	}

	public get curViewRankType():string
	{
		return this._curRankType;
	}

	public get rankObj():any
	{
		return this._rankObj;
	}

	public get curRankType():string
	{
		return this._curRankType;
	}

	public rankCombat(data:any):void
	{	
		this._curRankType = ConstRankName.COMBAT;

		this._rankObj[ConstRankName.COMBAT] = {};
		this._rankObj[ConstRankName.COMBAT]["model"] = [];
		this._rankObj[ConstRankName.COMBAT]["model"].push(data.weapon_id);
		this._rankObj[ConstRankName.COMBAT]["model"].push(data.closth_id);
		this._rankObj[ConstRankName.COMBAT]["model"].push(data.wing_id);
		
		this._rankObj[ConstRankName.COMBAT]["my_rank"] = data.my_rank;
		this._rankObj[ConstRankName.COMBAT]["worShip"] = data.worship;

		var firstTop = (data.list as Array<any>).shift();
		var _rankTopVo:RankVo = new RankVo(firstTop,"战斗力: "+firstTop.combat);
		var rankTop:eui.ArrayCollection = new eui.ArrayCollection([_rankTopVo]);
		this._rankObj[ConstRankName.COMBAT]["topRank"] = rankTop;
		
		var _arr:Array<any> = data.list;
		var rankVoArr:eui.ArrayCollection = new eui.ArrayCollection();
		for(var i:number=0;i<_arr.length;i++)
		{	
			var combat = "战斗力: " +  _arr[i].combat;
			var _rankVo:RankVo = new RankVo(_arr[i],combat);
			rankVoArr.addItem(_rankVo);
		}
		this._rankObj[ConstRankName.COMBAT]["rankArr"] = rankVoArr;
	}

	public rankLevel(data:any):void
	{
		this._curRankType = ConstRankName.LEVEL;

		this._rankObj[ConstRankName.LEVEL] = {};
		this._rankObj[ConstRankName.LEVEL]["model"] = [];
		this._rankObj[ConstRankName.LEVEL]["model"].push(data.weapon_id);
		this._rankObj[ConstRankName.LEVEL]["model"].push(data.closth_id);
		this._rankObj[ConstRankName.LEVEL]["model"].push(data.wing_id);

		this._rankObj[ConstRankName.LEVEL]["my_rank"] = data.my_rank;
		this._rankObj[ConstRankName.LEVEL]["worShip"] = data.worship;

		var firstTop = (data.list as Array<any>).shift();
		var _rankTopVo:RankVo = new RankVo(firstTop);
		var rankTop:eui.ArrayCollection = new eui.ArrayCollection([_rankTopVo]);
		this._rankObj[ConstRankName.LEVEL]["topRank"] = rankTop;
		
		var _arr:Array<any> = data.list;
		var rankVoArr:eui.ArrayCollection = new eui.ArrayCollection();
		for(var i:number=0;i<_arr.length;i++)
		{	
			var _rankVo:RankVo = new RankVo(_arr[i]);
			rankVoArr.addItem(_rankVo);
		}
		this._rankObj[ConstRankName.LEVEL]["rankArr"] = rankVoArr;
	}

	public rankFighter(data:any):void
	{
		this._curRankType = ConstRankName.FIGHTER;

		this._rankObj[ConstRankName.FIGHTER] = {};
		this._rankObj[ConstRankName.FIGHTER]["model"] = [];
		this._rankObj[ConstRankName.FIGHTER]["model"].push(data.weapon_id);
		this._rankObj[ConstRankName.FIGHTER]["model"].push(data.closth_id);
		this._rankObj[ConstRankName.FIGHTER]["model"].push(data.wing_id);

		this._rankObj[ConstRankName.FIGHTER]["my_rank"] = data.my_rank;
		this._rankObj[ConstRankName.FIGHTER]["worShip"] = data.worship;

		var firstTop = (data.list as Array<any>).shift();
		var _rankTopVo:RankVo = new RankVo(firstTop,"战斗力: "+firstTop.combat);
		var rankTop:eui.ArrayCollection = new eui.ArrayCollection([_rankTopVo]);
		this._rankObj[ConstRankName.FIGHTER]["topRank"] = rankTop;
		
		var _arr:Array<any> = data.list;
		var rankVoArr:eui.ArrayCollection = new eui.ArrayCollection();
		for(var i:number=0;i<_arr.length;i++)
		{	
			var combat = "战斗力: " +  _arr[i].combat;
			var _rankVo:RankVo = new RankVo(_arr[i],combat);
			rankVoArr.addItem(_rankVo);
		}
		this._rankObj[ConstRankName.FIGHTER]["rankArr"] = rankVoArr;
	}

	public rankMagic(data):void
	{
		this._curRankType = ConstRankName.MAGIC;

		this._rankObj[ConstRankName.MAGIC] = {};
		this._rankObj[ConstRankName.MAGIC]["model"] = [];
		this._rankObj[ConstRankName.MAGIC]["model"].push(data.weapon_id);
		this._rankObj[ConstRankName.MAGIC]["model"].push(data.closth_id);
		this._rankObj[ConstRankName.MAGIC]["model"].push(data.wing_id);
		this._rankObj[ConstRankName.MAGIC]["my_rank"] = data.my_rank;
		this._rankObj[ConstRankName.MAGIC]["worShip"] = data.worship;

		var firstTop = (data.list as Array<any>).shift();
		var _rankTopVo:RankVo = new RankVo(firstTop,"战斗力: "+firstTop.combat);
		var rankTop:eui.ArrayCollection = new eui.ArrayCollection([_rankTopVo]);
		this._rankObj[ConstRankName.MAGIC]["topRank"] = rankTop;
		
		var _arr:Array<any> = data.list;
		var rankVoArr:eui.ArrayCollection = new eui.ArrayCollection();
		for(var i:number=0;i<_arr.length;i++)
		{	
			var combat = "战斗力: " +  _arr[i].combat;
			var _rankVo:RankVo = new RankVo(_arr[i],combat);
			rankVoArr.addItem(_rankVo);
		}
		this._rankObj[ConstRankName.MAGIC]["rankArr"] = rankVoArr;
	}

	public rankTaoist(data):void
	{
		this._curRankType = ConstRankName.TAOIST;

		this._rankObj[ConstRankName.TAOIST] = {};
		this._rankObj[ConstRankName.TAOIST]["model"] = [];
		this._rankObj[ConstRankName.TAOIST]["model"].push(data.weapon_id);
		this._rankObj[ConstRankName.TAOIST]["model"].push(data.closth_id);
		this._rankObj[ConstRankName.TAOIST]["model"].push(data.wing_id);
		this._rankObj[ConstRankName.TAOIST]["my_rank"] = data.my_rank;
		this._rankObj[ConstRankName.TAOIST]["worShip"] = data.worship;

		var firstTop = (data.list as Array<any>).shift();
		var _rankTopVo:RankVo = new RankVo(firstTop,"战斗力: "+firstTop.combat);
		var rankTop:eui.ArrayCollection = new eui.ArrayCollection([_rankTopVo]);
		this._rankObj[ConstRankName.TAOIST]["topRank"] = rankTop;
		
		var _arr:Array<any> = data.list;
		var rankVoArr:eui.ArrayCollection = new eui.ArrayCollection();
		for(var i:number=0;i<_arr.length;i++)
		{	
			var combat = "战斗力: " +  _arr[i].combat;
			var _rankVo:RankVo = new RankVo(_arr[i],combat);
			rankVoArr.addItem(_rankVo);
		}
		this._rankObj[ConstRankName.TAOIST]["rankArr"] = rankVoArr;
	}

	public rankKill(data):void
	{
		this._curRankType = ConstRankName.KILL;

		this._rankObj[ConstRankName.KILL] = {};
		this._rankObj[ConstRankName.KILL]["model"] = [];
		this._rankObj[ConstRankName.KILL]["model"].push(data.weapon_id);
		this._rankObj[ConstRankName.KILL]["model"].push(data.closth_id);
		this._rankObj[ConstRankName.KILL]["model"].push(data.wing_id);
		this._rankObj[ConstRankName.KILL]["my_rank"] = data.my_rank;
		this._rankObj[ConstRankName.KILL]["worShip"] = data.worship;

		var firstTop = (data.list as Array<any>).shift();
		var _rankTopVo:RankVo = new RankVo(firstTop,"杀戮值: "+firstTop.kill);
		var rankTop:eui.ArrayCollection = new eui.ArrayCollection([_rankTopVo]);
		this._rankObj[ConstRankName.KILL]["topRank"] = rankTop;
		
		var _arr:Array<any> = data.list;
		var rankVoArr:eui.ArrayCollection = new eui.ArrayCollection();
		for(var i:number=0;i<_arr.length;i++)
		{	
			var kill = "杀戮值: " +  _arr[i].kill;
			var _rankVo:RankVo = new RankVo(_arr[i],kill);
			rankVoArr.addItem(_rankVo);
		}
		this._rankObj[ConstRankName.KILL]["rankArr"] = rankVoArr;
	}
	
	public rankMemal(data):void
	{
		this._curRankType = ConstRankName.MEMAL;

		this._rankObj[ConstRankName.MEMAL] = {};
		this._rankObj[ConstRankName.MEMAL]["model"] = [];
		this._rankObj[ConstRankName.MEMAL]["model"].push(data.weapon_id);
		this._rankObj[ConstRankName.MEMAL]["model"].push(data.closth_id);
		this._rankObj[ConstRankName.MEMAL]["model"].push(data.wing_id);
		this._rankObj[ConstRankName.MEMAL]["my_rank"] = data.my_rank;
		this._rankObj[ConstRankName.MEMAL]["worShip"] = data.worship;

		var firstTop = (data.list as Array<any>).shift();
		var _rankTopVo:RankVo = new RankVo(firstTop,"勋章等级: "+firstTop.medal_lv);
		var rankTop:eui.ArrayCollection = new eui.ArrayCollection([_rankTopVo]);
		this._rankObj[ConstRankName.MEMAL]["topRank"] = rankTop;
		
		var _arr:Array<any> = data.list;
		var rankVoArr:eui.ArrayCollection = new eui.ArrayCollection();
		for(var i:number=0;i<_arr.length;i++)
		{	
			var medal = "勋章等级: " +  _arr[i].medal_lv;
			var _rankVo:RankVo = new RankVo(_arr[i],medal);
			rankVoArr.addItem(_rankVo);
		}
		this._rankObj[ConstRankName.MEMAL]["rankArr"] = rankVoArr;
	}

	public rankKing(data):void
	{	
	// 		message pbRankArenaPlayer{
	// 	optional int32 player_id	= 1;
	// 	optional string name		= 2;
	// 	optional int32 month_card	= 3;	// 0无月卡 1有月卡
	// 	optional int32 vip			= 4;
	// 	optional int32 grade		= 5;	// 段
	// 	optional int32 lv			= 6;	// 段位等级
	// 	optional int32 margin		= 7;	// 净胜场
	// 	optional int32 rank			= 8;	// 排名
	// }

	// message pbRankArena{
	// 	optional int32 my_rank		= 1; // 我的排名
	// 	optional int32 worship		= 2; // 膜拜状态 （1可膜拜 2已膜拜）
	// 	repeated pbRankArenaPlayer list	= 3; // 上榜玩家列表
	// 	optional int32 sex			= 4;	// 第一名性别
	// 	optional int32 weapon_id	= 5;	// 第一名武器
	// 	optional int32 wing_id		= 6;	// 第一名翅膀
	// 	optional int32 closth_id	= 7;	// 第一名衣服
	// }
		this._curRankType = ConstRankName.KING;

		this._rankObj[ConstRankName.KING] = {};
		this._rankObj[ConstRankName.KING]["model"] = [];
		this._rankObj[ConstRankName.KING]["model"].push(data.weapon_id);
		this._rankObj[ConstRankName.KING]["model"].push(data.closth_id);
		this._rankObj[ConstRankName.KING]["model"].push(data.wing_id);
		this._rankObj[ConstRankName.KING]["my_rank"] = data.my_rank;
		this._rankObj[ConstRankName.KING]["worShip"] = data.worship;

		var firstTop = (data.list as Array<any>).shift();
		var _rankTopVo:RankVo = new RankVo(firstTop,"净胜场: "+firstTop.margin);
		var rankTop:eui.ArrayCollection = new eui.ArrayCollection([_rankTopVo]);
		this._rankObj[ConstRankName.KING]["topRank"] = rankTop;
		
		var _arr:Array<any> = data.list;
		var rankVoArr:eui.ArrayCollection = new eui.ArrayCollection();
		for(var i:number=0;i<_arr.length;i++)
		{	
			var marginNum = "净胜场: " +  _arr[i].margin;
			var _rankVo:RankVo = new RankVo(_arr[i],marginNum);
			rankVoArr.addItem(_rankVo);
		}
		this._rankObj[ConstRankName.KING]["rankArr"] = rankVoArr;
	}

	public worship(result:number):void
	{	
		var index = result -1 ;
		var rankType:string = ConstRankIndex[index];
		this._rankObj[rankType]["worShip"] = 2;//不能再膜拜了
	}



	/**
	 * 清理
	 */
    public clear() {
        super.clear();
    }

    /**
     * 销毁
     */
    public destroy() {
        super.destroy();
        //销毁处理
    }

}
}