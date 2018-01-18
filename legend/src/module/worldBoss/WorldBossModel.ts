/**
 * Author: liuyonggen
 * 世界boss系统数据模型 2017/12/4
 */
module game {
    export class WorldBossModel extends BaseModel {
        public worldBossInfo: any = {};
        public worldBossItemGroup: any = {};
        public pbWorldBossInfo: any;  //服务器返回的boss数据
        public maxTimesLimit: number = 0;  //最大挑战次数
        public killRecord: any[] = [];  //击杀记录
        public killReward: Array<any> = [];
        public joinReward: Array<any> = [];
        public revive: any;  //存储boss复活数据

        public constructor() { 
		    super();
            this.getInfo();
        }

        public getInfo() {
            this.worldBossInfo = App.ConfigManager.getWorldBossInfoById();
            this.maxTimesLimit = App.ConfigManager.getConstConfigByType("WORLD_BOSS_NUM").value;
            
        }

        public updateWorldBossInfo(data) {
            if(data.bosses.length < 3) {  //复活
                if(this.pbWorldBossInfo) {
                    for(let i:number=0; i<this.pbWorldBossInfo.bosses.length; i++) {  //更新boss列表数据
                        for(let j:number=0; j<data.bosses.length; j++) {
                            if(data.bosses[j].scene_id == this.pbWorldBossInfo.bosses[i].scene_id) {
                                this.pbWorldBossInfo.bosses[i] = data.bosses[j];
                                break;
                            }
                        }
                        break;
                    }
                } else {
                    this.pbWorldBossInfo = data;
                }               
                this.judgeFitBoss(data.bosses);
            } else {
                this.pbWorldBossInfo = data;
            }
        }

        /**
         * 判断哪个boss适合推荐给玩家
         */
        public judgeFitBoss(bosses) {
            let maxLimitLv;
            let maxLimitTurn;
            if(this.revive) {
                let nowBossInfo = App.ConfigManager.getWorldBossInfoById(this.revive.scene_id);
                maxLimitLv = nowBossInfo.lv_limit;
                maxLimitTurn = nowBossInfo.transmigration;
            } else {
                maxLimitLv = 10;
                maxLimitTurn = 1;
            }
            for(let i:number=0; i<bosses.length; i++) {
                if(bosses[i].notice == 1) {
                    let bossInfo = App.ConfigManager.getWorldBossInfoById(bosses[i].scene_id);
                    if(bossInfo.lv_limit) {  //级数存在按级数
                        if(bossInfo.lv_limit <= App.RoleManager.roleInfo.lv) {
                            if(bossInfo.lv_limit >= maxLimitLv) {
                                maxLimitLv = bossInfo.lv_limit;
                                this.revive = bosses[i];
                            }
                        }
                    } else {  //否则按转数
                        if(bossInfo.transmigration <= App.RoleManager.roleInfo.turn) {
                            if(bossInfo.transmigration >= maxLimitTurn) {
                                maxLimitTurn = bossInfo.transmigration;
                                this.revive = bosses[i];
                            }
                        }
                    } 
                }
            }
        }

        /**
         * boss复活是否推送给玩家
         * @return {boolean} true为推送
         */
        public showBossRevive() {
            let times = App.ConfigManager.getConstConfigByType("WORLD_BOSS_BAY_NUM").value;
            let vipTimes = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv).bay_boss; 
            let allTimes = times - this.pbWorldBossInfo.buy_times + vipTimes;
            if(!this.revive) {
                return false;
            } else if(this.pbWorldBossInfo.left_times <= 0 && allTimes <= 0) {  //当玩家没有挑战次数并且没有剩余购买次数时不需要弹出
                return false;
            } else if (SceneUtil.isBossScene(SceneModel.getInstance().sceneId) || SceneUtil.isActivityScene(SceneModel.getInstance().sceneId)) {
                return false;
            } else {
                return true;
            }
        }

        public changeToPage(obj) {
            let killReward: Array<any> = [];
            let joinReward: Array<any> = [];
            let count = Math.floor(obj.reward1.length / 8);
            for(let i:number=0; i<count; i++) {
                killReward.push(obj.reward1.slice(i*8, (i+1)*8));
            }
            if(count*8 != obj.reward1.length) {
                killReward.push(obj.reward1.slice(count*8, obj.reward1.length))
            }
            let count1 = Math.floor(obj.reward2.length / 8);
            for(let i:number=0; i<count1; i++) {
                joinReward.push(obj.reward2.slice(i*8, (i+1)*8));
            }
            if(count1*8 != obj.reward2.length) {
                joinReward.push(obj.reward2.slice(count1*8, obj.reward2.length))
            }
            obj.killReward = killReward;
            obj.joinReward = joinReward;
            return obj;
        }
        /**
         * 清理
         */
        public clear() {
            super.clear();
        }

        /**
         * 销毁
         */
        public destroy() {
            super.destroy();
            //销毁处理
        }
    }
}