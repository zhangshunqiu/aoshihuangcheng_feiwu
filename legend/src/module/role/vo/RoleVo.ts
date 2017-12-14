/**
 * 主角信息
 */ 
class RoleVo {
	public playerId:number= 1000;//玩家ID
	public account:string= "" ;//账号ID
	public name:string= "zsq" ;//
	public nameColor:number= 0 ;//
	public sex:number= 1 ;//性别
	public career:number= 1000 ; //职业
	public combat:number= 0 ;//战力
	public vipLv:number= 0 ;//vip等级
	public lv:number= 0 ;//等级
	public exp:number= 0 ;//经验
	public hookSceneId:number = 0;//挂机场景ID
	public turn : number = 0; //转生等级
	public lifeExp : number = 0; //修为值
	public first_charge:number = 0; //0未首充 1已充未领奖励 2已领奖励
	public guideId : number = 0; //引导id

	public updateFrom9002(data:any) {
		this.playerId = data.player_id;
		this.account = data.account;
		this.name = data.name;
		this.sex = data.sex;
		this.career = data.career;
		this.combat = data.combat;
		this.vipLv = data.vip_lv;
		this.lv = data.lv;
		this.exp = data.exp;
		this.hookSceneId = data.hook_scene_id;
		this.turn = data.turn ? data.turn : 0;
		this.lifeExp = data.life_exp ? data.life_exp : 0;
		this.guideId = data.guide_id;
	}



	public constructor() {

	}
}