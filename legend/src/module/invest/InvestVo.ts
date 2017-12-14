module game {
	export class InvestVo {
		public id:number;
		public gold:number;
		public level:number;
		public turn:number;//等级几多转
		public get:boolean;//是否已领取
		public constructor(config,data:boolean = false) {
			this.id = config.id;
			this.gold = config.gold;
			this.level =config.level;
			this.turn = config.transmigration;
			this.get = data;
		}
	}
}