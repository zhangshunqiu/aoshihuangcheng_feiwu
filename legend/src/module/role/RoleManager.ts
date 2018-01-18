/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 角色管理器
 */
class RoleManager {
	public roleInfo: RoleVo = null;//主角信息
	public roleWealthInfo: RoleWealthVo = null;//主角财富信息 
	public heroList: Array<game.HeroVO> = [];//英雄列表
	private _mainHeroVo: game.HeroVO;//主英雄VO
	public heroModel: game.HeroModel;

	private static _instance: RoleManager;
	public static getInstance(): RoleManager {
		if (this._instance == null) {
			this._instance = new RoleManager();
		}
		return this._instance;
	}

	public constructor() {
		this.roleInfo = new RoleVo();
		this.roleWealthInfo = new RoleWealthVo();
	}

	/**
	 * 根据英雄ID获取英雄Vo
	 */
	public getHeroVoById(id: number) {
		this.heroList = (game.HeroModel.getInstance() as game.HeroModel).heroInfo;
		for (var i: number = 0; i < this.heroList.length; i++) {
			var vo: game.HeroVO = this.heroList[i];
			if (vo.id == id) {
				return vo;
			}
		}
		return null;
	}

	/**
	 * 获取战力
	*/
	public getHeroFightcap() {
		let cap = 0;
		this.heroList = (game.HeroModel.getInstance() as game.HeroModel).heroInfo;
		for (var i: number = 0; i < this.heroList.length; i++) {
			var vo: game.HeroVO = this.heroList[i];
			cap += vo.score;
		}
		return cap;
	}

	/**
	 * 设置主英雄VO
	 */
	public set mainHeroVo(value: game.HeroVO) {
		this._mainHeroVo = value;
	}
	/**
	 * 获取主英雄VO
	 */
	public get mainHeroVo(): game.HeroVO {
		return this._mainHeroVo;
	}
	/**
	 * 获取角色ID
	 */
	public getMainHeroId(): number {
		if (this._mainHeroVo) {
			return this._mainHeroVo.id;
		}
		return null;
	}
	/**
	 * 获取英雄列表
	 */
	public getHeroList() {
		this.heroList = (game.HeroModel.getInstance() as game.HeroModel).heroInfo;
		return this.heroList;
	}
	/**
	 * 获取称号图标
    */
	public getHonorIcon() {

		let info = App.ConfigManager.getTitleInfoById(this.roleInfo.titleId);

		if (info && info.icon)
			return info.icon + "_png";
		else
			return "";
	}

}