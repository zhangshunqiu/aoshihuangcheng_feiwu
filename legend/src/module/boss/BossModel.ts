/**
 * Author: liuyonggen
 * Boss模块数据模型  2017/11/13
 */
module game {
    export class BossModel extends BaseModel {
        public ranking: Array<Object> = [];  //关卡排名
        public dropOutItem: Array<any> = []; //掉落物品
        public level: number = 0;  //当前关卡
        public challengeTime: number = 0; //挑战次数
        public award: string = '';  //通关奖励

        private _backpackModel: BackpackModel = BackpackModel.getInstance();
        private _heroModel: HeroModel = HeroModel.getInstance();
        public exp: number = App.RoleManager.roleInfo.exp;  //人物当前经验
        public lv: number = App.RoleManager.roleInfo.lv;   //人物当前等级 
        public upLevelExp: number = 999999;
        public bossInfo: any;  //boss信息
        public meetBossInfo: any;  //偶遇boss信息
        public wave: number = 0; //小怪波数
        public waveAll: number = 3;  //小怪总波数
        public sceneId: number = 20001;  //场景id
        public sceneInfo: any;  //挂机副本场景信息
        public sceneBossInfo: any;  //挑战boss场景信息
        public showDrop: Array<any> = [];  //展示的掉落物品
        public passReward: any ;  //通关奖励
        public currentPassReward: any;  //下一个通关奖励
        public dropGroup;  //掉落物品组
        public dropItemGroup;
        public dropItem: Array<any> = [];
        public result: number; //挑战结果 1为成功，0为失败，未返回为undefined;
        public lastIncomePromote: any;  //上一关卡收益提升；
        public incomePromote: any;  //关卡收益提升；
        public upLevelTime: number = 0 ; //挂机升级所需时间；
        public bossRewardLevel: number = 0;  //领取到10关boss奖励最高关卡
        public getBossRewardNum: number = 0;  //可领取通关奖励的次数；
        public hookId: number =0; //挂机场景id
        public rank: number = 0; //挑战世界boss时的排名

    

        public constructor() {
            super();
            this.dropOutItem = [];
        }


        public challengeBossResult(data) {
            this.result = Number(data.result);
            if(data.list.length) {
                this.dropItem = data.list;
                this.bossInfo.exp = data.list[data.list.length-1].num;
            }
            this.hookId = data.hook_id;
        }

        public updateSceneInfo() {
            if(App.RoleManager.roleInfo.hookSceneId < 40000 && App.RoleManager.roleInfo.hookSceneId > 30000) {
                return;
            }
            this.sceneInfo = App.ConfigManager.getSceneConfigById(App.RoleManager.roleInfo.hookSceneId);
            this.level = this.sceneInfo.lv_limit;
            this.waveAll = this.sceneInfo.monster_list.length;
            this.getInfo();
        }

        public updateBossRewardInfo(data) {
            this.bossRewardLevel = data;
            this.getBossRewardNum = Math.floor((this.sceneInfo.lv_limit - 1 - this.bossRewardLevel) / 10);
            this.getPassReward();
        }

        public getPassReward() {
            this.bossRewardLevel += 10;
            if(this.getBossRewardNum > 0) {
                let tenReward = App.ConfigManager.getSceneConfigById(40000 + this.bossRewardLevel).ten_reward[0];
                if (tenReward) {
                    let passRewardId = tenReward[1];
                    this.passReward = App.ConfigManager.getItemInfoById(passRewardId);
                }
                
            }
        }

        public getInfo() { //根据关卡读配置表获取场景和Boss信息
            this.showDrop = [];
            this.sceneBossInfo = App.ConfigManager.getSceneConfigById(40000 + this.sceneInfo.lv_limit); //获取场景信息
            let bossID = this.sceneBossInfo.monster_list[0][2];
            if(this.sceneInfo.scene_id < 40000) {
                if(this.sceneInfo.event_boss_list[0]) {
                    let meetBossId = this.sceneInfo.event_boss_list[0][2];
                    this.meetBossInfo = App.ConfigManager.getMonsterById(meetBossId); 
                }
                
            }
            this.bossInfo = App.ConfigManager.getMonsterById(bossID); //获取boss信息
            for (let i: number = 1; i < 6; i++) {
                let showItem = App.ConfigManager.getConstConfigByType("BOSS_SHOW_REWARD" + i);
                let dropItem = { type: ClientType.BASE_ITEM, good_id: showItem.value };
                this.showDrop.push(dropItem);
            }
            let tenReward = App.ConfigManager.getSceneConfigById(40000 + Math.ceil(this.sceneInfo.lv_limit / 10) * 10).ten_reward[0];
            let currentPassRewardId = tenReward ? tenReward[1] : 1;
            this.currentPassReward = App.ConfigManager.getItemInfoById(currentPassRewardId);
            this.lastIncomePromote = App.ConfigManager.getAllExpConfigById(20000 + this.sceneInfo.lv_limit);
            if(this.sceneInfo.lv_limit == App.ConfigManager.getConstConfigByType("BOSS_MAX").value){
                this.incomePromote = App.ConfigManager.getAllExpConfigById(20000 + this.sceneInfo.lv_limit);
            } else {
                this.incomePromote = App.ConfigManager.getAllExpConfigById(20000 + this.sceneInfo.lv_limit + 1);
            }
            let upLevel = App.ConfigManager.getExpConfigByLv(Number(App.RoleManager.roleInfo.lv)+1);
            if(upLevel) {
                this.upLevelExp = upLevel.exp;
            } 
            this.upLevelTime = Math.floor( (this.upLevelExp - this.exp) / (this.incomePromote.offline_exp / 30) );
        }
        public updateRanking() {

        }
    }
}
