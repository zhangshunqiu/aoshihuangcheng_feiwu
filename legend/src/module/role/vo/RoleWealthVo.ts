/**
 * 主角财富信息
 */
class RoleWealthVo {
	public energy:number = 20; //体力上限
	public curEnergy:number = 20; //当前体力

	public coin:number = 0; //金币
	public gold:number = 0;//元宝
	public gift:number = 0;//礼券

	public smelt:number = 0; //熔炼值
	public feats:number = 0; //功勋值
	
	public constructor() {
	}

	public updateFrom9002(data:any) {
		this.coin = data.coin;
		this.gold = data.gold;
	}

}