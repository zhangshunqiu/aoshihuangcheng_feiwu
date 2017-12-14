/**
 * 排行榜rankVo	
 * author : 杨艺鹏
*/
module game {
	export class RankVo {
		public playerId:number;
		public name:string;
		public month_card:boolean;
		public vip:number;
		public turn:number;
		public lv:number;
		public rank:number;

		public grade:number;//王者榜段位
		public gradeLv:number;//王者榜段位等级
		
		public rankData:string;//描述 战斗力or杀戮值or。。。
		public constructor(data,rankData?:string) {
			this.playerId = data.player_id;
			this.name = data.name;
			this.month_card = data.month_card;
			this.vip = data.vip;
			this.turn = data.turn;
			this.lv = data.lv;
			this.rank = data.rank;
			
			this.grade = data.grade;
			this.gradeLv = data.gradeLv;

			this.rankData = rankData;
			
		}
	}
	
	// export class RankTopVo extends RankVo{
	// 	public _worShip:boolean;
	// 	public constructor(data,rankData?:number){
	// 		super(data,rankData);
	// 	}
	// 	public set worShip(canWorShip:boolean)
	// 	{
	// 		this._worShip = canWorShip;
	// 	}
	// }

	// export class RankFighterVo extends RankVo{
	// 	public constructor(data){
	// 		super(data);
	// 	}
	// }
	// export class RankMagicVo extends RankVo{
	// 	public constructor(data){
	// 		super(data);
	// 	}
	// }
	// export class RankFighterVo extends RankVo{
	// 	public constructor(data){
	// 		super(data);
	// 	}
	// }

}