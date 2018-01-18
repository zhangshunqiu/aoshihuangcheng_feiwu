class ConfigManager extends BaseConfManager {
	private static _instance: ConfigManager;
	public static getInstance(): ConfigManager {
		if (this._instance == null) {
			this._instance = new ConfigManager();
		}
		return this._instance;
	}
	public constructor() {
		super();
	}

	public initConfig() {
		this.skillConfig();
		this.skillKeyConfig();

		this.attributeConfig();//属性表初始化
		this.skillTreeConfig();//技能树配置初始化
		this.equipConfig();//装备
		this.getAllExpConfig();//
		this.achieveConfig();//成就表

		//合并所有场景表
		this.setConfig("all_scene_conf", {});
		var allSceneConf: any = this.getConfig("all_scene_conf");

		var hookScene: any = this.hookSceneConfig();
		if (hookScene) {
			for (let key in hookScene) {
				allSceneConf[key] = hookScene[key];
				allSceneConf[key].scene_type = SCENE_MAP_TYPE.HOOK;
			}
		}
		var hookSceneBoss: any = this.hookSceneBossConfig();
		if (hookSceneBoss) {
			for (let key in hookSceneBoss) {
				allSceneConf[key] = hookSceneBoss[key];
				allSceneConf[key].scene_type = SCENE_MAP_TYPE.HOOK_BOSS;
			}
		}
		var bossCopy: any = this.getBossCopyInfo();
		if (bossCopy) {
			for (let key in bossCopy) {
				allSceneConf[key] = bossCopy[key];
				allSceneConf[key].scene_type = SCENE_MAP_TYPE.BOOS_COPY;
			}
		}
		var materialCopy: any = this.getMaterialCopyInfo();
		if (materialCopy) {
			for (let key in materialCopy) {
				allSceneConf[key] = materialCopy[key];
				allSceneConf[key].scene_type = SCENE_MAP_TYPE.MATERICAL_COPY;
			}
		}
		var challengeCopy: any = this.getChallengeCopyInfo();
		if (challengeCopy) {
			for (let key in challengeCopy) {
				allSceneConf[key] = challengeCopy[key];
				allSceneConf[key].scene_type = SCENE_MAP_TYPE.CHALLENGE_COPY;
			}
		}
		var worldBossCopy: any = this.getWorldBossInfoById();
		if (worldBossCopy) {
			for (let key in worldBossCopy) {
				allSceneConf[key] = worldBossCopy[key];
				allSceneConf[key].scene_type = SCENE_MAP_TYPE.WORLD_BOSS;
			}
		}
		let arean = this.getAreanConfig();
		if (arean) {
			for (let key in arean) {
				allSceneConf[key] = arean[key];
				allSceneConf[key].scene_type = SCENE_MAP_TYPE.ARENA;
			}
		}
	}

	/**
	 * 竞技场
	 */

	public getAreanConfig() {
		return this.getConfig("t_arena_json");

	}
	/**
	 * 挂机场景，主场景表,挂机Boss场景表都合并到这里
	 */
	private hookSceneConfig(): any {
		return this.getConfig("t_hook_scene_json");
	}
	/**
	 * 挑战boss场景
	 */
	private hookSceneBossConfig(): any {
		return this.getConfig("t_hook_scene_boss_json");
	}
	//统一使用 getSceneConfigById
	// private getScenceBossConfigById(sceneId: number): any {
	// 	return this.sceneBossConfig()[sceneId];
	// }
	public getBossCopyInfo() {
		return this.getConfig("t_copy_boss_json");
	}
	public getMaterialCopyInfo() {
		return this.getConfig("t_copy_material_json");
	}
	public getChallengeCopyInfo() {
		return this.getConfig("t_copy_tower_json");
	}
	/**
	 * 世界boss,若不传场景id则获取整个表，传则获取对应场景id信息
	 */
	public getWorldBossInfoById(sceneId = null): any {
		if (sceneId) {
			return this.getConfig("t_world_boss_json")[sceneId];
		}
		return this.getConfig("t_world_boss_json");
	}


	/**
	 * 获取个人boss副本信息
	 * @param sceneId  //场景id
	 */
	public getBossCopyInfoBySceneId(sceneId) {
		return this.getConfig("t_copy_boss_json")[sceneId];
	}
	/**
	 * 获取材料副本信息
	 * @param sceneId  //场景id
	 */
	public getMaterialCopyInfoBySceneId(sceneId) {
		return this.getConfig("t_copy_material_json")[sceneId];
	}
	/**
	 * 获取挑战副本信息
	 * @param sceneId  //场景id
	 */
	public getChallengeCopyInfoBySceneId(sceneId) {
		return this.getConfig("t_copy_tower_json")[sceneId];
	}


	/**
	 * 所有场景表配置
	 * @param sceneId 场景ID
	 */
	public getSceneConfigById(sceneId: number): any {
		var data: any = this.getConfig("all_scene_conf")[sceneId];
		if (data) {
			return data;
		}
		return this.getConfig("all_scene_conf")[10000];
	}

	/**
	 * 根据级别获取场景配置
	 * @param sceneId 场景ID
	 */
	public getHookSceneConfigByLevel(level: number): any {
		var data: any = this.hookSceneConfig();
		if (data) {
			for (let key in data) {
				if (data[key].lv_limit == level) {
					return data[key];
				}
			}
		}
	}

	/**
	 * 获取机器人配置信息
	 */
	public getRobotConfByCareerLvSex(career: number, lv: number, sex: number) {
		var d: any = this.getConfig("t_robot_json");
		for (var key in d) {
			var vo: any = d[key];
			if (vo.sex == sex && vo.career == career && vo.lv == lv) {
				return vo;
			}
		}
		return this.getConfig("t_robot_json")[10001];
	}

	/**
	 * buff表
	*/
	public getBuffConfigById(id: number): any {
		return this.getConfig("t_buff_json")[id];
	}



	/**
	 * 服务端报错表
	*/
	private errConfig(): any {
		return this.getConfig("t_error_code_json");
	}

	public getErrInfoById(id) {
		let config = this.errConfig();
		for (let key in config) {
			if (config[key].key == id) {
				return config[key];
			}
		}
	}

	public getJobConfig(): any {
		return this.getConfig("t_job_json");
	}

	/**
	 * 根据性别和职业拿人物头像
	 */
	public getHeroIconBySexAndJob(sex, job) {
		let config = this.getJobConfig();
		for (let i: number = 1; i < 7; i++) {
			if (config[i].sex == sex && config[i].career == job) {
				return config[i].job_icon;
			}
		}

	}
	/**
	 * 根据性别和职业拿小一号的头像，
	 * @param tyep  1方  2圆，默认为方
	 */
	public getSmallHeroIconBySexAndJob(sex, job, type = 1) {
		let config = this.getJobConfig();
		for (let i: number = 1; i < 7; i++) {
			if (config[i].sex == sex && config[i].career == job) {
				if (type == 1) {
					return config[i].small_job_icon_square;
				} else if (type == 2) {
					return config[i].small_job_icon_circle;
				}
			}
		}
	}


	public getCareerTagByJob() {

	}

	public skillBaseConfig(): any {
		return this.getConfig("t_skill_base_json");
	}

	public skillEffectConfig(): any {
		return this.getConfig("t_skill_effect_json");
	}

	public skillEffectConfig2(): any {
		return this.getConfig("t_skill_effect_json");
	}

	/**
	 * 装备表
	*/
	public equipConfig(): any {
		return this.getConfig("t_equipment_json");
	}

	/**
	 * 根据装备ID获取配置信息
	 * 
	 */
	public getEquipById(id) {
		//几万条数据，用for循环去拿的话，太慢，消耗太大，暂时改成用键值 zrj 2018.01.16
		let config = this.equipConfig();
		// for (let key in config) {
		// 	if (config[key].id == id) {
		// 		return config[key];
		// 	}
		// }
		return config[id];
	}

	/**
	 * 根据装备ID获取配置信息
	 * 
	 */
	public getEquipConfigById(id: number): any {
		return this.getConfig("t_equipment_json")[id];
	}

	/**
	 * 属性表
	*/
	public getAttributeInfoById(id): any {
		let config = this.attributeConfig();
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
	 * 属性表
	*/
	public attributeConfig(): any {
		return this.getConfig("t_attribute_json");
	}

	/**
	 * 道具表
	*/
	public itemConfig(): any {
		return this.getConfig("t_goods_json");
	}

	public achieveConfig(): any {

		return this.getConfig("t_achieve_json");
	}

	public taskConfig():any{
		return this.getConfig("t_task_json");
	}
	/**
	 * 道具表
	*/
	public getItemInfoById(id): any {
		let config = this.getConfig("t_goods_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
	 * 道具表
	*/
	public getItemInfoByTypeAndSubType(type, subType): any {
		let config = this.getConfig("t_goods_json");
		let data = [];
		for (let key in config) {
			if (config[key].type == type && config[key].sub_type == subType) {
				data.push(config[key]);
			}
		}
		return data;
	}


	/**
	 * 技能树
	*/
	public skillTreeConfig(): any {
		return this.getConfig("t_skill_tree_json");
	}

	/**
	 * 战斗技能表
	 */
	public skillConfig(): any {
		return this.getConfig("t_skill_json");
	}
	/**
	 * 战斗技能表
	 */
	public skillKeyConfig(): any {
		if (this.hasConfig("skillKeyConf") == null) {
			var list: Array<any> = this.getConfig("t_skill_json");
			var data: any = {};
			if (list) {
				for (let i: number = 0; i < list.length; i++) {
					var value: any = list[i];
					data[value.skill_id + "_" + value.skill_lv] = value;
				}
			}
			this.setConfig("skillKeyConf", data);
		}
		return this.getConfig("skillKeyConf");
	}
	/**
	 * 获取战斗技能表
	 * @param skillId 技能ID
	 * @param skillLv 技能级别
	 */
	public getSkillConfigById(skillId: number, lv: number): any {
		return this.skillKeyConfig()[skillId + "_" + lv];
	}

	/**
	 * 人物升级经验表
	 * @param lv 人物等级
	 */
	public getExpConfigByLv(lv: number): any {
		return this.getConfig("t_exp_json")[lv]
	}
	
	/**
	 * 怪物表
	 */
	public monsterConfig(): any {
		return this.getConfig("t_monster_json");
	}
	/**
	 * 获取怪物配置
	 * @param id 怪物ID 
	 */
	public getMonsterById(id: string): any {
		return this.getConfig("t_monster_json")[id];
	}

	/**
	 * 强化 升星表
	*/
	public castConfig(): any {
		return this.getConfig("t_cast_json");
	}

	/**
	 * 场景挂机经验表
	 * @param sceneId 场景ID
	*/
	public getAllExpConfigById(sceneId: number): any {
		return this.getConfig("t_all_exp_json")[String(sceneId)];
	}
	/**
	 * 场景挂机经验表
	 * @param sceneId 场景ID
	*/
	private getAllExpConfig(): any {
		return this.getConfig("t_all_exp_json");
	}

	/**
	 * 神秘商店表
	*/
	public mysteryShopConfig(): any {
		return this.getConfig("t_mall_mystery_json");
	}

	/**
	 * 普通商店表
	*/
	public normalShopConfig(): any {
		return this.getConfig("t_mall_json");
	}

	/**
	 * 限购商店表
	*/
	public limitShopConfig(): any {
		return this.getConfig("t_mall_limit_json");
	}

	/**
	 * 翅膀属性表
	 */
	public wingAttrConfig(): any {
		return this.getConfig("t_wing_attribute_json");
	}

	/**
	 * 翅膀升星表
	 */
	public wingStarConfig(): any {
		return this.getConfig("t_wing_json");
	}

	/**
	 * 翅膀升阶表
	 */
	public wingStepConfig(): any {
		return this.getConfig("t_wing_rank_json");
	}

	/**
	 * 获取翅膀属性
	 * @param id 翅膀id,对应星级；
	 */
	public getWingAttrById(id: string): any {
		return this.wingAttrConfig()[id];
	}

	/**
	 * 获取翅膀升星对应信息
	 * @param id 翅膀id,对应星级；
	 */
	public getWingStarById(id: number): any {
		return this.wingStarConfig()[id];
	}

	/**
	 * 获取翅膀升阶对应信息
	 * @param id 翅膀id,对应阶级；
	 */
	public getWingStepById(id: string): any {
		return this.wingStepConfig()[id];
	}

	/**
	 * 获取商店信息
	 * @param type  商店类型  1：神秘 2：限制 3：普通
	 * @param id 商品id 非good_id
	*/
	public getShopInfoByTypeId(type, id): any {
		let shopConfig = undefined;
		if (type == 1) {
			shopConfig = this.mysteryShopConfig();
		} else if (type == 2) {
			shopConfig = this.limitShopConfig();
		} else if (type == 3) {
			shopConfig = this.normalShopConfig();
		} else {
			shopConfig = this.normalShopConfig();
		}
	}
	/**
	 * 获取限购商店批次信息
	 * @param batch 第几批
	*/
	public getLimitShopBatchByBatch(batch): any {
		let shopConfig = this.limitShopConfig();
		let array = [];
		for (let key in shopConfig) {
			if (shopConfig[key].batch == batch) {
				array.push(shopConfig[key]);
			}
		}
		return array;
	}

	/**
	 * 常量表
	*/
	public ConstConfig(): any {
		return this.getConfig("t_const_json");
	}

	/**
	 * 获取常量表数据
	*/
	public getConstConfigByType(type): any {
		let config = this.getConfig("t_const_json");
		for (let key in config) {
			if (config[key].type == type) {
				return config[key];
			}
		}
	}

	/**
	 * 获取伙伴开启限制
	*/
	public getPartnerConfigById(id): any {
		let config = this.getConfig("t_partner_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}
	/**
	 * 宝石属性表
	*/
	public getJewelInfoById(id): any {
		let config = this.getConfig("t_jewel_attribute_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
	 * 宝石全身属性表
	*/
	public getJewelAllInfoById(id): any {
		let config = this.getConfig("t_jewel_all_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	public getJewelAllInfoByLevel(lv): any {
		let config = this.getConfig("t_jewel_all_json");
		for (let key in config) {
			if (config[key].level == lv) {
				return config[key];
			}
		}
	}

	/**
	 * 合成表
	*/
	public getSynthesisInfoById(id): any {
		let config = this.getConfig("t_compound_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
	 * 转生等级兑换表
	*/
	public getRebornInfoByLevel(level): any {
		let config = this.getConfig("t_level_convert_json");
		for (let key in config) {
			if (config[key].level == level) {
				return config[key];
			}
		}
	}

	/**
	 * 转生属性表
	*/
	public getRebornAttrInfoById(id): any {
		let config = this.getConfig("t_transmigration_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
	   * 勋章等级属性表
	  */
	public getMedalAttrInfoByLv(lv): any {
		let config = this.getConfig("t_medal_json");
		for (let key in config) {
			if (config[key].lv == lv) {
				return config[key];
			}
		}
	}

	/**
	 * 熔炼表
	*/
	public getSmeltInfoById(id): any {
		let config = this.getConfig("t_smelt_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}
	/**
	 * 邮件表
	 */
	public getMailInfoById(id): any {
		// return this.getConfig("t_mail_json");
		let config = this.getConfig("t_mail_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}
	/**
	 * vip表
	*/
	public getVipInfoById(id): any {
		return this.getConfig("t_vip_json")[id];
	}

    /**
	 * 等级礼包
	*/
	public getLvPackageInfoById(id): any {
		let config = this.getConfig("t_welfare_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
		 * 寻宝批次
		*/
	public getRaiderInfoByBase(base): any {
		let config = this.getConfig("t_treasures-display_json");
		let tempArr = [];
		for (let key in config) {
			if (config[key].base == base) {
				tempArr.push(config[key]);
			}
		}
		return tempArr;
	}
	public getSignInfoById(id): any {
		let config = this.getSignInfo();
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	public getSignInfo(): any {
		return this.getConfig("t_sign_json");
	}


	public getSensitiveWordCheck(str: string): string {

		let list = this.getConfig("t_sensitive_word_json");
		var value: string;
		for (let i = 0; i < list.length; i++) {
			value = list[i];
			if (str.indexOf(value) >= 0) {
				str = str.replace(value, "*");
			}
		}
		//let config = this.getConfig("t_sensitive_word_json");
		// for (let key in config) {

		// 	if (str.indexOf(config[key].word) >= 0)
		// 		str = str.replace(config[key].word, "*");
		// }
		return str;
	}

	/**
	 * 是否包含有敏感字
	*/
	public isContainSensitiveWord(str: string) {
		let config = this.getConfig("t_sensitive_word_json");
		for (let key in config) {
			if (str.indexOf(config[key].w) >= 0) {
				return true;
			}
		}
		return false;
	}

	/**
		 * 根据开服时间去拿寻宝批次
		*/
	public getRaiderInfoByDay(day): any {
		let config = this.getConfig("t_treasures_display_json");
		let tempArr = [];
		for (let key in config) {
			if (config[key].servicetime[0] <= day && (config[key].servicetime[1] >= day || config[key].servicetime[1] == 0)) {
				tempArr.push(config[key]);
			}
		}
		return tempArr;
	}

	/**
	 * 月卡
	 */
	public getMonthCardInfoById(id) {
		return this.getConfig("t_month_card_json")[id];
	}

	/**
	 * 特殊装备配置表
	*/
	public getEquipSpecialById(id) {
		let config = this.getConfig("t_special_equipment_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
	 * 新手引导配置表
	 * @param id 
	 * @param step
	*/
	public getGuideInfoByIdAndStep(id, step) {
		let config = this.getConfig("t_guide_json");
		for (let key in config) {
			if (config[key].id == id && config[key].step == step) {
				return config[key];
			}
		}
	}

	/**
	 * 新手引导配置表，根据任务id获得引导信息
	 * @param id 
	*/
	public getGuideInfoByTaskId(id) {
		let config = this.getConfig("t_guide_json");
		for (let key in config) {
			if (config[key].task_id == id && config[key].step == 1) {
				return config[key];
			}
		}
	}

	/**
	 * 新手引导配置表，获取所有任务
	 * @param id 
	*/
	public getGuideAllTask() {
		let arr = [];
		let config = this.getConfig("t_guide_json");
		for (let key in config) {
			if (config[key].step == 1) {
				arr.push(config[key]);
			}
		}
		return arr;
	}

	/**
		 * 获取男性名字
		*/
	public getRandomManName() {
		let lastConfig: Array<any> = this.getConfig("t_name_last_json");
		let tempArr = lastConfig["man"];
		// for (let key in lastConfig) {
		// 	if (lastConfig[key].gender == 0) {
		// 		tempArr.push(lastConfig[key].name);
		// 	}
		// }
		let random = Math.floor(Math.random() * tempArr.length);
		return tempArr[random];

	}
	/**
	 * 获取女性名字
	*/
	public getRandomWomanName() {
		let lastConfig: Array<any> = this.getConfig("t_name_last_json");
		let tempArr = lastConfig["woman"];
		// for (let key in lastConfig) {
		// 	if (lastConfig[key].gender == 1) {
		// 		tempArr.push(lastConfig[key].name);
		// 	}
		// }
		let random = Math.floor(Math.random() * tempArr.length);
		return tempArr[random];
	}
	/**
	 * 获取随机名字
	*/
	public getRandomNameBySex(sex?: number) {
		let fistConfig = this.getConfig("t_name_first_json");
		let random = Math.floor(Math.random() * fistConfig.length);
		if (sex == ConstSex.WOMAN) {
			return fistConfig[random] + "" + this.getRandomWomanName();
		} else {
			return fistConfig[random] + "" + this.getRandomManName();
		}

	}

	/**
	 * 根据part和等级去拿特殊装备
	*/
	public getEquipSpecialByPartLevel(part, level) {
		let config = this.getConfig("t_special_equipment_json");
		for (let key in config) {
			if (config[key].type == part && config[key].level == level) {
				return config[key];
			}
		}
	}


	/**
	 * 特殊装备碎片配置表
	*/
	public getEquipSpecialFragmentById(id) {
		let config = this.getConfig("t_ring_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
		 * 神器配置表
		*/
	public getArtifactInfoById(id) {
		let config = this.getConfig("t_artifact_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
		 * 所有神器集合
		*/
	public getArtifactArray() {
		let config = this.getConfig("t_artifact_json");
		let arr = [];
		for (let key in config) {
			let exist = false;
			for (let i in arr) {
				if (config[key].type == arr[i].type) {
					exist = true;
					break;
				}
			}
			if (!exist) {
				arr.push(config[key]);
			}
		}
		return arr;
	}

	/**
	 * 活动基础配置表
	*/
	public getActivityInfoById(id) {
		let config = this.getConfig("t_open_activity_control_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
	 * 每日竞技配置表
	*/
	public getDaliyRankInfoById(id) {
		let config = this.getConfig("t_open_activity_daily_rank_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}


	/**
	 * 限购礼包配置表
	*/
	public getLimitGiftInfoById(id) {
		let config = this.getConfig("t_open_activity_limit_gift_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
	 * 充值礼包配置表
	*/
	public getRechargeGiftInfoById(id) {
		let config = this.getConfig("t_open_activitiy_charge_gift_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}


	/**
	 * 充值礼包配置表
	 * 根据活动id去拿礼包信息
	*/
	public getRechargeGiftInfoByType(type) {
		let config = this.getConfig("t_open_activitiy_charge_gift_json");
		let giftArr = [];
		for (let key in config) {
			if (config[key].type == type) {
				giftArr.push(config[key]);
			}
		}
		return giftArr;
	}


	/**
	 * 膜拜表
	 */
	public getWorShipByIv(arr: Array<any>) {
		var level: number = arr[0];
		var turn: number = arr[1];
		let config = this.getConfig("t_worship_json");
		for (let key in config) {
			if (turn >= 1) {
				if (config[key].level[1] == turn) {
					return config[key];
				}
			} else {
				if (level >= 80) {
					if (config[key].level[0] == 80) {
						return config[key];
					}
				} else {
					if (config[key].level[0] == level) {
						return config[key];
					}
				}

			}
		}
	}

	/**
	 * 根据模块名称拿解锁信息
	*/
	public getModuleOpenInfoByName(name) {
		let config = this.getConfig("t_system_open_json");
		for (let key in config) {
			if (config[key].client_name == name) {
				return config[key];
			}
		}
	}

	/**
	 * 根据模块id拿解锁信息
	*/
	public getModuleOpenInfoById(id) {
		let config = this.getConfig("t_system_open_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}


	/**
	 * 称号信息表
	*/
	public getTitleInfo() {
		return this.getConfig("t_title_json");

	}

	public getTitleInfoById(id) {
		let config = this.getConfig("t_title_json");
		for (let key in config) {
			if (config[key].title_id == id) {
				return config[key];
			}
		}
	}

	public getLightenPropertyByNum(num) {
		let config = this.getConfig("t_title_plus_json");
		for (let key in config) {
			if (config[key].title_total == num) {
				return config[key];
			}
		}

	}

	public getTitleAttByAttId(attid) {
		let config = this.getConfig("t_title_att_json");
		for (let key in config) {
			if (config[key].id == attid) {
				return config[key];
			}
		}
	}

	public getTaskDailyInfoById(id) {
		let config = this.getConfig("t_task_daily_json");
		for (let key in config) {
			if (config[key].task_id == id) {
				return config[key];
			}
		}
	}

	public getAchieveInfoById(id) {
		let config = this.getConfig("t_achieve_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}

	/**
	*主线任务配表 
		*/
	public getMainLineTaskInfoById(id) {

		let config = this.getConfig("t_task_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
	}


	/**
	 * 获取投资表
	 */
	public getInvestInfo(): any {
		return this.getConfig("t_invest_json");
	}

	/**
	 * 首冲奖励表
	 */
	public getFirstChargeInfo(): any {
		return this.getConfig("t_charge_first_json");
	}

	/**
	 * 常规充值表
	 */
	public getChargeInfo(): any {
		return this.getConfig("t_charge_json");
	}


	/**
	 * 获取争霸奖励
	 * 
	 */
	public getLabberTierRewardInfo(): any {
		let config = this.getConfig("t_arena_gift_json");
		let tier_reward_list: Array<any> = [];

		for (let key in config) {
			if (config[key].type == 1) {
				// let rewardlist: Array<any> = [];
				// rewardlist = config[key].reward;
				tier_reward_list.push(config[key].reward[0])
			}
		}
		return tier_reward_list;
	}

	public getLabberRankRewardInfo(): any {

		let config = this.getConfig("t_arena_gift_json");
		let rank_reward_list: Array<any> = [];

		for (let key in config) {
			if (config[key].type == 2) {
				rank_reward_list.push(config[key].reward[0])
			}
		}
		return rank_reward_list;
	}

	public getLabberBuyTimeInfo() {

		let config = this.getConfig("t_arena_json");
		for (let key in config) {
			return config[key];
		}

	}
	/**
	 * 聚宝盘次数表
	 */
	public getFortuneTimesInfoById(id): any {
		let config = this.getConfig("t_dial_time_json");
		for (let key in config) {
			if (config[key].times == id) {
				return config[key];
			}
		}
		return null;
	}

	/**
	 * 聚宝盘奖池奖励
	 */
	public getFortuneRewardByMaxgold(gold): number {
		let config = this.getConfig("t_dial_luck_json");
		for (let key in config) {
			if (config[key].number == gold) {
				return config[key];
			}
		}
		return null;
	}

	//天梯争霸奖励列表
	public getLabberMatchReward(type, tier) {

		let config = this.getConfig("t_arena_reward_json");
		for (let key in config) {
			if (config[key].grading == tier && config[key].type == type) {
				return config[key].reward[0];
			}
		}

	}

	/**
	 * 根据输赢和等级和转数获取遭遇战奖励，默认拿type =1,就是拿赢得奖励
	 */
	public getEncounterRewardByLvAndTurn(lv, turn, type = 1) {
		let config = this.getConfig("t_encounter_reward_json");
		if (type == 1) { //遭遇战赢了
			if (lv) {  //按级数取奖励
				for (let i: number = 1; i < 9; i++) {
					if (config[i].level >= lv) {
						return config[i].reward;
					}
				}
				return false;
			} else if (turn) {  //按转数取奖励
				for (let i: number = 9; i < 19; i++) {
					if (config[i].transmigration == turn) {
						return config[i].reward;
					}
				}
				return false;
			}
		}
		if (type == 2) {  //遭遇战输了
			if (lv) {  //按级数取奖励
				for (let i: number = 19; i < 27; i++) {
					if (config[i].level >= lv) {
						return config[i].reward;
					}
				}
				return false;
			} else if (turn) {  //按转数取奖励
				for (let i: number = 27; i < 37; i++) {
					if (config[i].transmigration == turn) {
						return config[i].reward;
					}
				}
				return false;
			}
		}
	}

	/**
	 *遭遇战排名奖励
	 */
	public getEncounterRankReward(): any {
		return this.getConfig("t_encounter_gift_json");
	}

	/**
	 * 根据机器人id获取机器人信息
	 */
	public getRobotInfoById(id) {
		return this.getConfig("t_robot_json")[id];
	}

	/**
	*聊天系统事件奖励
	*/
	public getSystemChatByID(id) {
		let config = this.getConfig("t_chat_json");
		for (let key in config) {
			if (config[key].id == id) {
				return config[key];
			}
		}
		return null;
	}
}