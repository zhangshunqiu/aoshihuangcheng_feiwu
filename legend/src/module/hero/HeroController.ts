/**
 * module : 英雄模块控制器
 * author : zrj
*/
module game{
	export class HeroController extends BaseController{
		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(15001,this.heroInfoR,this);
			this.registerProtocal(15002,this.putonEquipR,this);
			this.registerProtocal(15003,this.takeoffEquipR,this);
			this.registerProtocal(15011,this.handleNewPartnerR,this);
			this.registerProtocal(15012,this.handleSpecialEquipActive,this);
			this.registerProtocal(15013,this.handleSpecialEquipLevelUp,this);
			this.registerProtocal(15014,this.handleSpecialEquipFragment,this);
			this.registerProtocal(15015,this.handleAkeychange,this);
			this.registerProtocal(12001,this.handleSkillListR,this);
			this.registerProtocal(12003,this.handleSkillAllUp,this);
			this.registerProtocal(12004,this.handleSkillUpgrageR,this);
		}

		public heroInfoR(data) {
			this.dispatchEvent(PanelNotify.PLAYER_COMBAT_UPDATE,data);
			(HeroModel.getInstance() as HeroModel).updateHeroInfo(data.hero);
			(WingModel.getInstance() as WingModel).updateHeroInfo(data.hero);
			App.logzrj("data.hero= ",data.hero);
			if (HeroModel.getInstance().isEquipPuton) {
				HeroModel.getInstance().isEquipPuton = false;
				HeroModel.getInstance().checkBetterEquipRedDotAll();
			}
			if (HeroModel.getInstance().isSpecialEquip) {
				HeroModel.getInstance().isSpecialEquip = false;
				HeroModel.getInstance().checkSpecialEquipRedDotAll();
			}

			this.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT,HeroModel.getInstance().curPos);
			this.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO);
		}

		public putonEquipR() {
			// this.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT,HeroModel.getInstance().curPos);
				HeroModel.getInstance().isEquipPuton = true;
		}

		public takeoffEquipR() {
				// this.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT,HeroModel.getInstance().curPos);
		}

		/**
		 * 新伙伴返回
		*/
		public handleNewPartnerR(data) {
			(HeroModel.getInstance() as HeroModel).addNewHero(data.hero);
			(WingModel.getInstance() as WingModel).updateHeroInfo((HeroModel.getInstance() as HeroModel).heroInfo);
			HeroModel.getInstance().checkBetterEquipRedDotAll();
			SkillModel.getInstance().checkSkillCanUpgradeAll();
			this.dispatchEvent(PanelNotify.HERO_NEW_PARTNER);
			this.dispatchEvent(PanelNotify.HERO_ON_HERO_SELECT,HeroModel.getInstance().curPos);
			this.dispatchEvent(PanelNotify.PLAYER_UPDATE_PLAYER_INFO);
		}

		/**
		 * 特殊装备激活
		*/
		public handleSpecialEquipActive(data) {
			App.logzrj("data:",data);
			// HeroModel.getInstance().checkSpecialEquipRedDotAll();
			HeroModel.getInstance().isSpecialEquip = true;
			this.dispatchEvent(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE);
			this.dispatchEvent(PanelNotify.HERO_ACTIVE_SPECIAL);
		}

		/**
		 * 特殊装备升级
		*/
		public handleSpecialEquipLevelUp(data) {
			App.logzrj("data:",data);
			// HeroModel.getInstance().checkSpecialEquipRedDotAll();
			HeroModel.getInstance().isSpecialEquip = true;
			this.dispatchEvent(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE);
		}

		/**
		 * 特殊装备碎片激活
		*/
		public handleSpecialEquipFragment(data) {
			App.logzrj("data:",data);
			// HeroModel.getInstance().checkSpecialEquipRedDotAll();
			HeroModel.getInstance().isSpecialEquip = true;
			this.dispatchEvent(PanelNotify.HERO_SPECIAL_EQUIP_UPDATE);
		}

        /**
		 * 一键换装
		 */
        public handleAkeychange(data){
			App.logzsq();
			HeroModel.getInstance().isEquipPuton = true;
		} 

		/**
		 * 一键升级技能
		 */
        public handleSkillAllUp(data){
            SkillModel.getInstance().updateSkillInfo(data);
			this.dispatchEvent(PanelNotify.HERO_UPDATE_SKILL_PANEL);
		} 

		/**
		 * 技能列表
		*/
		public handleSkillListR(data) {
			SkillModel.getInstance().updateSkillInfo(data);
			this.dispatchEvent(PanelNotify.HERO_UPDATE_SKILL_PANEL);
		}

		/**
		 * 升级技能返回
		*/
		public handleSkillUpgrageR(data) {
			SkillModel.getInstance().upgradeSkillByData(data);
			this.dispatchEvent(PanelNotify.HERO_UPDATE_SKILL_PANEL);
			SkillModel.getInstance().checkSkillCanUpgradeAll();
			// App.Socket.send(12001,HeroModel.getInstance().heroInfo[HeroModel.getInstance().curPos].id);
		}

		/**
		 * 销毁
		 */
		public destroy(){
			super.destroy();
		}

		/**
		 * 清理
		 */
		public clear(){
			super.clear();
		}
	}
}