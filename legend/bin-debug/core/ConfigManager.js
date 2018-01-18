var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ConfigManager = (function (_super) {
    __extends(ConfigManager, _super);
    function ConfigManager() {
        return _super.call(this) || this;
    }
    ConfigManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new ConfigManager();
        }
        return this._instance;
    };
    ConfigManager.prototype.initConfig = function () {
        this.skillConfig();
        this.skillKeyConfig();
        this.attributeConfig(); //属性表初始化
        this.skillTreeConfig(); //技能树配置初始化
        this.equipConfig(); //装备
        this.getAllExpConfig(); //
        this.achieveConfig(); //成就表
        //合并所有场景表
        this.setConfig("all_scene_conf", {});
        var allSceneConf = this.getConfig("all_scene_conf");
        var hookScene = this.hookSceneConfig();
        if (hookScene) {
            for (var key in hookScene) {
                allSceneConf[key] = hookScene[key];
                allSceneConf[key].scene_type = SCENE_MAP_TYPE.HOOK;
            }
        }
        var hookSceneBoss = this.hookSceneBossConfig();
        if (hookSceneBoss) {
            for (var key in hookSceneBoss) {
                allSceneConf[key] = hookSceneBoss[key];
                allSceneConf[key].scene_type = SCENE_MAP_TYPE.HOOK_BOSS;
            }
        }
        var bossCopy = this.getBossCopyInfo();
        if (bossCopy) {
            for (var key in bossCopy) {
                allSceneConf[key] = bossCopy[key];
                allSceneConf[key].scene_type = SCENE_MAP_TYPE.BOOS_COPY;
            }
        }
        var materialCopy = this.getMaterialCopyInfo();
        if (materialCopy) {
            for (var key in materialCopy) {
                allSceneConf[key] = materialCopy[key];
                allSceneConf[key].scene_type = SCENE_MAP_TYPE.MATERICAL_COPY;
            }
        }
        var challengeCopy = this.getChallengeCopyInfo();
        if (challengeCopy) {
            for (var key in challengeCopy) {
                allSceneConf[key] = challengeCopy[key];
                allSceneConf[key].scene_type = SCENE_MAP_TYPE.CHALLENGE_COPY;
            }
        }
        var worldBossCopy = this.getWorldBossInfoById();
        if (worldBossCopy) {
            for (var key in worldBossCopy) {
                allSceneConf[key] = worldBossCopy[key];
                allSceneConf[key].scene_type = SCENE_MAP_TYPE.WORLD_BOSS;
            }
        }
        var arean = this.getAreanConfig();
        if (arean) {
            for (var key in arean) {
                allSceneConf[key] = arean[key];
                allSceneConf[key].scene_type = SCENE_MAP_TYPE.ARENA;
            }
        }
    };
    /**
     * 竞技场
     */
    ConfigManager.prototype.getAreanConfig = function () {
        return this.getConfig("t_arena_json");
    };
    /**
     * 挂机场景，主场景表,挂机Boss场景表都合并到这里
     */
    ConfigManager.prototype.hookSceneConfig = function () {
        return this.getConfig("t_hook_scene_json");
    };
    /**
     * 挑战boss场景
     */
    ConfigManager.prototype.hookSceneBossConfig = function () {
        return this.getConfig("t_hook_scene_boss_json");
    };
    //统一使用 getSceneConfigById
    // private getScenceBossConfigById(sceneId: number): any {
    // 	return this.sceneBossConfig()[sceneId];
    // }
    ConfigManager.prototype.getBossCopyInfo = function () {
        return this.getConfig("t_copy_boss_json");
    };
    ConfigManager.prototype.getMaterialCopyInfo = function () {
        return this.getConfig("t_copy_material_json");
    };
    ConfigManager.prototype.getChallengeCopyInfo = function () {
        return this.getConfig("t_copy_tower_json");
    };
    /**
     * 世界boss,若不传场景id则获取整个表，传则获取对应场景id信息
     */
    ConfigManager.prototype.getWorldBossInfoById = function (sceneId) {
        if (sceneId === void 0) { sceneId = null; }
        if (sceneId) {
            return this.getConfig("t_world_boss_json")[sceneId];
        }
        return this.getConfig("t_world_boss_json");
    };
    /**
     * 获取个人boss副本信息
     * @param sceneId  //场景id
     */
    ConfigManager.prototype.getBossCopyInfoBySceneId = function (sceneId) {
        return this.getConfig("t_copy_boss_json")[sceneId];
    };
    /**
     * 获取材料副本信息
     * @param sceneId  //场景id
     */
    ConfigManager.prototype.getMaterialCopyInfoBySceneId = function (sceneId) {
        return this.getConfig("t_copy_material_json")[sceneId];
    };
    /**
     * 获取挑战副本信息
     * @param sceneId  //场景id
     */
    ConfigManager.prototype.getChallengeCopyInfoBySceneId = function (sceneId) {
        return this.getConfig("t_copy_tower_json")[sceneId];
    };
    /**
     * 所有场景表配置
     * @param sceneId 场景ID
     */
    ConfigManager.prototype.getSceneConfigById = function (sceneId) {
        var data = this.getConfig("all_scene_conf")[sceneId];
        if (data) {
            return data;
        }
        return this.getConfig("all_scene_conf")[10000];
    };
    /**
     * 根据级别获取场景配置
     * @param sceneId 场景ID
     */
    ConfigManager.prototype.getHookSceneConfigByLevel = function (level) {
        var data = this.hookSceneConfig();
        if (data) {
            for (var key in data) {
                if (data[key].lv_limit == level) {
                    return data[key];
                }
            }
        }
    };
    /**
     * 获取机器人配置信息
     */
    ConfigManager.prototype.getRobotConfByCareerLvSex = function (career, lv, sex) {
        var d = this.getConfig("t_robot_json");
        for (var key in d) {
            var vo = d[key];
            if (vo.sex == sex && vo.career == career && vo.lv == lv) {
                return vo;
            }
        }
        return this.getConfig("t_robot_json")[10001];
    };
    /**
     * buff表
    */
    ConfigManager.prototype.getBuffConfigById = function (id) {
        return this.getConfig("t_buff_json")[id];
    };
    /**
     * 服务端报错表
    */
    ConfigManager.prototype.errConfig = function () {
        return this.getConfig("t_error_code_json");
    };
    ConfigManager.prototype.getErrInfoById = function (id) {
        var config = this.errConfig();
        for (var key in config) {
            if (config[key].key == id) {
                return config[key];
            }
        }
    };
    ConfigManager.prototype.getJobConfig = function () {
        return this.getConfig("t_job_json");
    };
    /**
     * 根据性别和职业拿人物头像
     */
    ConfigManager.prototype.getHeroIconBySexAndJob = function (sex, job) {
        var config = this.getJobConfig();
        for (var i = 1; i < 7; i++) {
            if (config[i].sex == sex && config[i].career == job) {
                return config[i].job_icon;
            }
        }
    };
    /**
     * 根据性别和职业拿小一号的头像，
     * @param tyep  1方  2圆，默认为方
     */
    ConfigManager.prototype.getSmallHeroIconBySexAndJob = function (sex, job, type) {
        if (type === void 0) { type = 1; }
        var config = this.getJobConfig();
        for (var i = 1; i < 7; i++) {
            if (config[i].sex == sex && config[i].career == job) {
                if (type == 1) {
                    return config[i].small_job_icon_square;
                }
                else if (type == 2) {
                    return config[i].small_job_icon_circle;
                }
            }
        }
    };
    ConfigManager.prototype.getCareerTagByJob = function () {
    };
    ConfigManager.prototype.skillBaseConfig = function () {
        return this.getConfig("t_skill_base_json");
    };
    ConfigManager.prototype.skillEffectConfig = function () {
        return this.getConfig("t_skill_effect_json");
    };
    ConfigManager.prototype.skillEffectConfig2 = function () {
        return this.getConfig("t_skill_effect_json");
    };
    /**
     * 装备表
    */
    ConfigManager.prototype.equipConfig = function () {
        return this.getConfig("t_equipment_json");
    };
    /**
     * 根据装备ID获取配置信息
     *
     */
    ConfigManager.prototype.getEquipById = function (id) {
        //几万条数据，用for循环去拿的话，太慢，消耗太大，暂时改成用键值 zrj 2018.01.16
        var config = this.equipConfig();
        // for (let key in config) {
        // 	if (config[key].id == id) {
        // 		return config[key];
        // 	}
        // }
        return config[id];
    };
    /**
     * 根据装备ID获取配置信息
     *
     */
    ConfigManager.prototype.getEquipConfigById = function (id) {
        return this.getConfig("t_equipment_json")[id];
    };
    /**
     * 属性表
    */
    ConfigManager.prototype.getAttributeInfoById = function (id) {
        var config = this.attributeConfig();
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 属性表
    */
    ConfigManager.prototype.attributeConfig = function () {
        return this.getConfig("t_attribute_json");
    };
    /**
     * 道具表
    */
    ConfigManager.prototype.itemConfig = function () {
        return this.getConfig("t_goods_json");
    };
    ConfigManager.prototype.achieveConfig = function () {
        return this.getConfig("t_achieve_json");
    };
    ConfigManager.prototype.taskConfig = function () {
        return this.getConfig("t_task_json");
    };
    /**
     * 道具表
    */
    ConfigManager.prototype.getItemInfoById = function (id) {
        var config = this.getConfig("t_goods_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 道具表
    */
    ConfigManager.prototype.getItemInfoByTypeAndSubType = function (type, subType) {
        var config = this.getConfig("t_goods_json");
        var data = [];
        for (var key in config) {
            if (config[key].type == type && config[key].sub_type == subType) {
                data.push(config[key]);
            }
        }
        return data;
    };
    /**
     * 技能树
    */
    ConfigManager.prototype.skillTreeConfig = function () {
        return this.getConfig("t_skill_tree_json");
    };
    /**
     * 战斗技能表
     */
    ConfigManager.prototype.skillConfig = function () {
        return this.getConfig("t_skill_json");
    };
    /**
     * 战斗技能表
     */
    ConfigManager.prototype.skillKeyConfig = function () {
        if (this.hasConfig("skillKeyConf") == null) {
            var list = this.getConfig("t_skill_json");
            var data = {};
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    var value = list[i];
                    data[value.skill_id + "_" + value.skill_lv] = value;
                }
            }
            this.setConfig("skillKeyConf", data);
        }
        return this.getConfig("skillKeyConf");
    };
    /**
     * 获取战斗技能表
     * @param skillId 技能ID
     * @param skillLv 技能级别
     */
    ConfigManager.prototype.getSkillConfigById = function (skillId, lv) {
        return this.skillKeyConfig()[skillId + "_" + lv];
    };
    /**
     * 人物升级经验表
     * @param lv 人物等级
     */
    ConfigManager.prototype.getExpConfigByLv = function (lv) {
        return this.getConfig("t_exp_json")[lv];
    };
    /**
     * 怪物表
     */
    ConfigManager.prototype.monsterConfig = function () {
        return this.getConfig("t_monster_json");
    };
    /**
     * 获取怪物配置
     * @param id 怪物ID
     */
    ConfigManager.prototype.getMonsterById = function (id) {
        return this.getConfig("t_monster_json")[id];
    };
    /**
     * 强化 升星表
    */
    ConfigManager.prototype.castConfig = function () {
        return this.getConfig("t_cast_json");
    };
    /**
     * 场景挂机经验表
     * @param sceneId 场景ID
    */
    ConfigManager.prototype.getAllExpConfigById = function (sceneId) {
        return this.getConfig("t_all_exp_json")[String(sceneId)];
    };
    /**
     * 场景挂机经验表
     * @param sceneId 场景ID
    */
    ConfigManager.prototype.getAllExpConfig = function () {
        return this.getConfig("t_all_exp_json");
    };
    /**
     * 神秘商店表
    */
    ConfigManager.prototype.mysteryShopConfig = function () {
        return this.getConfig("t_mall_mystery_json");
    };
    /**
     * 普通商店表
    */
    ConfigManager.prototype.normalShopConfig = function () {
        return this.getConfig("t_mall_json");
    };
    /**
     * 限购商店表
    */
    ConfigManager.prototype.limitShopConfig = function () {
        return this.getConfig("t_mall_limit_json");
    };
    /**
     * 翅膀属性表
     */
    ConfigManager.prototype.wingAttrConfig = function () {
        return this.getConfig("t_wing_attribute_json");
    };
    /**
     * 翅膀升星表
     */
    ConfigManager.prototype.wingStarConfig = function () {
        return this.getConfig("t_wing_json");
    };
    /**
     * 翅膀升阶表
     */
    ConfigManager.prototype.wingStepConfig = function () {
        return this.getConfig("t_wing_rank_json");
    };
    /**
     * 获取翅膀属性
     * @param id 翅膀id,对应星级；
     */
    ConfigManager.prototype.getWingAttrById = function (id) {
        return this.wingAttrConfig()[id];
    };
    /**
     * 获取翅膀升星对应信息
     * @param id 翅膀id,对应星级；
     */
    ConfigManager.prototype.getWingStarById = function (id) {
        return this.wingStarConfig()[id];
    };
    /**
     * 获取翅膀升阶对应信息
     * @param id 翅膀id,对应阶级；
     */
    ConfigManager.prototype.getWingStepById = function (id) {
        return this.wingStepConfig()[id];
    };
    /**
     * 获取商店信息
     * @param type  商店类型  1：神秘 2：限制 3：普通
     * @param id 商品id 非good_id
    */
    ConfigManager.prototype.getShopInfoByTypeId = function (type, id) {
        var shopConfig = undefined;
        if (type == 1) {
            shopConfig = this.mysteryShopConfig();
        }
        else if (type == 2) {
            shopConfig = this.limitShopConfig();
        }
        else if (type == 3) {
            shopConfig = this.normalShopConfig();
        }
        else {
            shopConfig = this.normalShopConfig();
        }
    };
    /**
     * 获取限购商店批次信息
     * @param batch 第几批
    */
    ConfigManager.prototype.getLimitShopBatchByBatch = function (batch) {
        var shopConfig = this.limitShopConfig();
        var array = [];
        for (var key in shopConfig) {
            if (shopConfig[key].batch == batch) {
                array.push(shopConfig[key]);
            }
        }
        return array;
    };
    /**
     * 常量表
    */
    ConfigManager.prototype.ConstConfig = function () {
        return this.getConfig("t_const_json");
    };
    /**
     * 获取常量表数据
    */
    ConfigManager.prototype.getConstConfigByType = function (type) {
        var config = this.getConfig("t_const_json");
        for (var key in config) {
            if (config[key].type == type) {
                return config[key];
            }
        }
    };
    /**
     * 获取伙伴开启限制
    */
    ConfigManager.prototype.getPartnerConfigById = function (id) {
        var config = this.getConfig("t_partner_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 宝石属性表
    */
    ConfigManager.prototype.getJewelInfoById = function (id) {
        var config = this.getConfig("t_jewel_attribute_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 宝石全身属性表
    */
    ConfigManager.prototype.getJewelAllInfoById = function (id) {
        var config = this.getConfig("t_jewel_all_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    ConfigManager.prototype.getJewelAllInfoByLevel = function (lv) {
        var config = this.getConfig("t_jewel_all_json");
        for (var key in config) {
            if (config[key].level == lv) {
                return config[key];
            }
        }
    };
    /**
     * 合成表
    */
    ConfigManager.prototype.getSynthesisInfoById = function (id) {
        var config = this.getConfig("t_compound_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 转生等级兑换表
    */
    ConfigManager.prototype.getRebornInfoByLevel = function (level) {
        var config = this.getConfig("t_level_convert_json");
        for (var key in config) {
            if (config[key].level == level) {
                return config[key];
            }
        }
    };
    /**
     * 转生属性表
    */
    ConfigManager.prototype.getRebornAttrInfoById = function (id) {
        var config = this.getConfig("t_transmigration_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
       * 勋章等级属性表
      */
    ConfigManager.prototype.getMedalAttrInfoByLv = function (lv) {
        var config = this.getConfig("t_medal_json");
        for (var key in config) {
            if (config[key].lv == lv) {
                return config[key];
            }
        }
    };
    /**
     * 熔炼表
    */
    ConfigManager.prototype.getSmeltInfoById = function (id) {
        var config = this.getConfig("t_smelt_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 邮件表
     */
    ConfigManager.prototype.getMailInfoById = function (id) {
        // return this.getConfig("t_mail_json");
        var config = this.getConfig("t_mail_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * vip表
    */
    ConfigManager.prototype.getVipInfoById = function (id) {
        return this.getConfig("t_vip_json")[id];
    };
    /**
     * 等级礼包
    */
    ConfigManager.prototype.getLvPackageInfoById = function (id) {
        var config = this.getConfig("t_welfare_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
         * 寻宝批次
        */
    ConfigManager.prototype.getRaiderInfoByBase = function (base) {
        var config = this.getConfig("t_treasures-display_json");
        var tempArr = [];
        for (var key in config) {
            if (config[key].base == base) {
                tempArr.push(config[key]);
            }
        }
        return tempArr;
    };
    ConfigManager.prototype.getSignInfoById = function (id) {
        var config = this.getSignInfo();
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    ConfigManager.prototype.getSignInfo = function () {
        return this.getConfig("t_sign_json");
    };
    ConfigManager.prototype.getSensitiveWordCheck = function (str) {
        var list = this.getConfig("t_sensitive_word_json");
        var value;
        for (var i = 0; i < list.length; i++) {
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
    };
    /**
     * 是否包含有敏感字
    */
    ConfigManager.prototype.isContainSensitiveWord = function (str) {
        var config = this.getConfig("t_sensitive_word_json");
        for (var key in config) {
            if (str.indexOf(config[key].w) >= 0) {
                return true;
            }
        }
        return false;
    };
    /**
         * 根据开服时间去拿寻宝批次
        */
    ConfigManager.prototype.getRaiderInfoByDay = function (day) {
        var config = this.getConfig("t_treasures_display_json");
        var tempArr = [];
        for (var key in config) {
            if (config[key].servicetime[0] <= day && (config[key].servicetime[1] >= day || config[key].servicetime[1] == 0)) {
                tempArr.push(config[key]);
            }
        }
        return tempArr;
    };
    /**
     * 月卡
     */
    ConfigManager.prototype.getMonthCardInfoById = function (id) {
        return this.getConfig("t_month_card_json")[id];
    };
    /**
     * 特殊装备配置表
    */
    ConfigManager.prototype.getEquipSpecialById = function (id) {
        var config = this.getConfig("t_special_equipment_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 新手引导配置表
     * @param id
     * @param step
    */
    ConfigManager.prototype.getGuideInfoByIdAndStep = function (id, step) {
        var config = this.getConfig("t_guide_json");
        for (var key in config) {
            if (config[key].id == id && config[key].step == step) {
                return config[key];
            }
        }
    };
    /**
     * 新手引导配置表，根据任务id获得引导信息
     * @param id
    */
    ConfigManager.prototype.getGuideInfoByTaskId = function (id) {
        var config = this.getConfig("t_guide_json");
        for (var key in config) {
            if (config[key].task_id == id && config[key].step == 1) {
                return config[key];
            }
        }
    };
    /**
     * 新手引导配置表，获取所有任务
     * @param id
    */
    ConfigManager.prototype.getGuideAllTask = function () {
        var arr = [];
        var config = this.getConfig("t_guide_json");
        for (var key in config) {
            if (config[key].step == 1) {
                arr.push(config[key]);
            }
        }
        return arr;
    };
    /**
         * 获取男性名字
        */
    ConfigManager.prototype.getRandomManName = function () {
        var lastConfig = this.getConfig("t_name_last_json");
        var tempArr = lastConfig["man"];
        // for (let key in lastConfig) {
        // 	if (lastConfig[key].gender == 0) {
        // 		tempArr.push(lastConfig[key].name);
        // 	}
        // }
        var random = Math.floor(Math.random() * tempArr.length);
        return tempArr[random];
    };
    /**
     * 获取女性名字
    */
    ConfigManager.prototype.getRandomWomanName = function () {
        var lastConfig = this.getConfig("t_name_last_json");
        var tempArr = lastConfig["woman"];
        // for (let key in lastConfig) {
        // 	if (lastConfig[key].gender == 1) {
        // 		tempArr.push(lastConfig[key].name);
        // 	}
        // }
        var random = Math.floor(Math.random() * tempArr.length);
        return tempArr[random];
    };
    /**
     * 获取随机名字
    */
    ConfigManager.prototype.getRandomNameBySex = function (sex) {
        var fistConfig = this.getConfig("t_name_first_json");
        var random = Math.floor(Math.random() * fistConfig.length);
        if (sex == ConstSex.WOMAN) {
            return fistConfig[random] + "" + this.getRandomWomanName();
        }
        else {
            return fistConfig[random] + "" + this.getRandomManName();
        }
    };
    /**
     * 根据part和等级去拿特殊装备
    */
    ConfigManager.prototype.getEquipSpecialByPartLevel = function (part, level) {
        var config = this.getConfig("t_special_equipment_json");
        for (var key in config) {
            if (config[key].type == part && config[key].level == level) {
                return config[key];
            }
        }
    };
    /**
     * 特殊装备碎片配置表
    */
    ConfigManager.prototype.getEquipSpecialFragmentById = function (id) {
        var config = this.getConfig("t_ring_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
         * 神器配置表
        */
    ConfigManager.prototype.getArtifactInfoById = function (id) {
        var config = this.getConfig("t_artifact_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
         * 所有神器集合
        */
    ConfigManager.prototype.getArtifactArray = function () {
        var config = this.getConfig("t_artifact_json");
        var arr = [];
        for (var key in config) {
            var exist = false;
            for (var i in arr) {
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
    };
    /**
     * 活动基础配置表
    */
    ConfigManager.prototype.getActivityInfoById = function (id) {
        var config = this.getConfig("t_open_activity_control_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 每日竞技配置表
    */
    ConfigManager.prototype.getDaliyRankInfoById = function (id) {
        var config = this.getConfig("t_open_activity_daily_rank_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 限购礼包配置表
    */
    ConfigManager.prototype.getLimitGiftInfoById = function (id) {
        var config = this.getConfig("t_open_activity_limit_gift_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 充值礼包配置表
    */
    ConfigManager.prototype.getRechargeGiftInfoById = function (id) {
        var config = this.getConfig("t_open_activitiy_charge_gift_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 充值礼包配置表
     * 根据活动id去拿礼包信息
    */
    ConfigManager.prototype.getRechargeGiftInfoByType = function (type) {
        var config = this.getConfig("t_open_activitiy_charge_gift_json");
        var giftArr = [];
        for (var key in config) {
            if (config[key].type == type) {
                giftArr.push(config[key]);
            }
        }
        return giftArr;
    };
    /**
     * 膜拜表
     */
    ConfigManager.prototype.getWorShipByIv = function (arr) {
        var level = arr[0];
        var turn = arr[1];
        var config = this.getConfig("t_worship_json");
        for (var key in config) {
            if (turn >= 1) {
                if (config[key].level[1] == turn) {
                    return config[key];
                }
            }
            else {
                if (level >= 80) {
                    if (config[key].level[0] == 80) {
                        return config[key];
                    }
                }
                else {
                    if (config[key].level[0] == level) {
                        return config[key];
                    }
                }
            }
        }
    };
    /**
     * 根据模块名称拿解锁信息
    */
    ConfigManager.prototype.getModuleOpenInfoByName = function (name) {
        var config = this.getConfig("t_system_open_json");
        for (var key in config) {
            if (config[key].client_name == name) {
                return config[key];
            }
        }
    };
    /**
     * 根据模块id拿解锁信息
    */
    ConfigManager.prototype.getModuleOpenInfoById = function (id) {
        var config = this.getConfig("t_system_open_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 称号信息表
    */
    ConfigManager.prototype.getTitleInfo = function () {
        return this.getConfig("t_title_json");
    };
    ConfigManager.prototype.getTitleInfoById = function (id) {
        var config = this.getConfig("t_title_json");
        for (var key in config) {
            if (config[key].title_id == id) {
                return config[key];
            }
        }
    };
    ConfigManager.prototype.getLightenPropertyByNum = function (num) {
        var config = this.getConfig("t_title_plus_json");
        for (var key in config) {
            if (config[key].title_total == num) {
                return config[key];
            }
        }
    };
    ConfigManager.prototype.getTitleAttByAttId = function (attid) {
        var config = this.getConfig("t_title_att_json");
        for (var key in config) {
            if (config[key].id == attid) {
                return config[key];
            }
        }
    };
    ConfigManager.prototype.getTaskDailyInfoById = function (id) {
        var config = this.getConfig("t_task_daily_json");
        for (var key in config) {
            if (config[key].task_id == id) {
                return config[key];
            }
        }
    };
    ConfigManager.prototype.getAchieveInfoById = function (id) {
        var config = this.getConfig("t_achieve_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
    *主线任务配表
        */
    ConfigManager.prototype.getMainLineTaskInfoById = function (id) {
        var config = this.getConfig("t_task_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
    };
    /**
     * 获取投资表
     */
    ConfigManager.prototype.getInvestInfo = function () {
        return this.getConfig("t_invest_json");
    };
    /**
     * 首冲奖励表
     */
    ConfigManager.prototype.getFirstChargeInfo = function () {
        return this.getConfig("t_charge_first_json");
    };
    /**
     * 常规充值表
     */
    ConfigManager.prototype.getChargeInfo = function () {
        return this.getConfig("t_charge_json");
    };
    /**
     * 获取争霸奖励
     *
     */
    ConfigManager.prototype.getLabberTierRewardInfo = function () {
        var config = this.getConfig("t_arena_gift_json");
        var tier_reward_list = [];
        for (var key in config) {
            if (config[key].type == 1) {
                // let rewardlist: Array<any> = [];
                // rewardlist = config[key].reward;
                tier_reward_list.push(config[key].reward[0]);
            }
        }
        return tier_reward_list;
    };
    ConfigManager.prototype.getLabberRankRewardInfo = function () {
        var config = this.getConfig("t_arena_gift_json");
        var rank_reward_list = [];
        for (var key in config) {
            if (config[key].type == 2) {
                rank_reward_list.push(config[key].reward[0]);
            }
        }
        return rank_reward_list;
    };
    ConfigManager.prototype.getLabberBuyTimeInfo = function () {
        var config = this.getConfig("t_arena_json");
        for (var key in config) {
            return config[key];
        }
    };
    /**
     * 聚宝盘次数表
     */
    ConfigManager.prototype.getFortuneTimesInfoById = function (id) {
        var config = this.getConfig("t_dial_time_json");
        for (var key in config) {
            if (config[key].times == id) {
                return config[key];
            }
        }
        return null;
    };
    /**
     * 聚宝盘奖池奖励
     */
    ConfigManager.prototype.getFortuneRewardByMaxgold = function (gold) {
        var config = this.getConfig("t_dial_luck_json");
        for (var key in config) {
            if (config[key].number == gold) {
                return config[key];
            }
        }
        return null;
    };
    //天梯争霸奖励列表
    ConfigManager.prototype.getLabberMatchReward = function (type, tier) {
        var config = this.getConfig("t_arena_reward_json");
        for (var key in config) {
            if (config[key].grading == tier && config[key].type == type) {
                return config[key].reward[0];
            }
        }
    };
    /**
     * 根据输赢和等级和转数获取遭遇战奖励，默认拿type =1,就是拿赢得奖励
     */
    ConfigManager.prototype.getEncounterRewardByLvAndTurn = function (lv, turn, type) {
        if (type === void 0) { type = 1; }
        var config = this.getConfig("t_encounter_reward_json");
        if (type == 1) {
            if (lv) {
                for (var i = 1; i < 9; i++) {
                    if (config[i].level >= lv) {
                        return config[i].reward;
                    }
                }
                return false;
            }
            else if (turn) {
                for (var i = 9; i < 19; i++) {
                    if (config[i].transmigration == turn) {
                        return config[i].reward;
                    }
                }
                return false;
            }
        }
        if (type == 2) {
            if (lv) {
                for (var i = 19; i < 27; i++) {
                    if (config[i].level >= lv) {
                        return config[i].reward;
                    }
                }
                return false;
            }
            else if (turn) {
                for (var i = 27; i < 37; i++) {
                    if (config[i].transmigration == turn) {
                        return config[i].reward;
                    }
                }
                return false;
            }
        }
    };
    /**
     *遭遇战排名奖励
     */
    ConfigManager.prototype.getEncounterRankReward = function () {
        return this.getConfig("t_encounter_gift_json");
    };
    /**
     * 根据机器人id获取机器人信息
     */
    ConfigManager.prototype.getRobotInfoById = function (id) {
        return this.getConfig("t_robot_json")[id];
    };
    /**
    *聊天系统事件奖励
    */
    ConfigManager.prototype.getSystemChatByID = function (id) {
        var config = this.getConfig("t_chat_json");
        for (var key in config) {
            if (config[key].id == id) {
                return config[key];
            }
        }
        return null;
    };
    return ConfigManager;
}(BaseConfManager));
__reflect(ConfigManager.prototype, "ConfigManager");
//# sourceMappingURL=ConfigManager.js.map