var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 排行榜rankVo
 * author : 杨艺鹏
*/
var game;
(function (game) {
    var RankVo = (function () {
        function RankVo(data, rankData) {
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
        return RankVo;
    }());
    game.RankVo = RankVo;
    __reflect(RankVo.prototype, "game.RankVo");
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
})(game || (game = {}));
//# sourceMappingURL=RankVo.js.map