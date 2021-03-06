/**
* Author: liuyonggen
* 副本系统数据模型 2017/11/27
*/
module game {
    export class CopyModel extends BaseModel {
        public bossCopyInfo: any;
        public bossCopyInfoArr: Array<any> = [];
        public materialCopyInfo: any;
        public materialCopyInfoArr: Array<any> = [];
        public challengeCopyInfo0: any;
        public challengeCopyInfo1: any;
        public challengeCopyInfo2: any;
        public challengeInfo: any = {};  //挑战次数信息
        public topId: number = 0; //爬塔的最高关卡
        public bossInfo: any;  //爬塔副本boss数据
        public bossLimitTimes = {};  //boss副本挑战次数限制
        public materialLimitTimes = {};  //boss副本挑战次数限制
        public canChallenge = { bossBool: 0, materialBool: 0 };

        public constructor() {
            super();
            this.getInfo();
        }

        private getInfo() {
            this.bossCopyInfo = App.ConfigManager.getBossCopyInfo();
            for (let k in this.bossCopyInfo) {
                this.bossLimitTimes[k] = this.bossCopyInfo[k].times_limit;
            }
            this.bossCopyInfoArr = this.sortChallengeArr(this.bossCopyInfo, ConstCopyType.Boss);

            this.materialCopyInfo = App.ConfigManager.getMaterialCopyInfo();
            this.materialCopyInfoArr = this.sortChallengeArr(this.materialCopyInfo, ConstCopyType.Material);
            for (let k in this.materialCopyInfo) {
                this.materialLimitTimes[k] = this.materialCopyInfo[k].times_limit;
            }
        }

        public updateInfo(data) {
            this.challengeInfo[data.type] = data.list;
            if (data.type == 1) {
                if (data.list.length) {
                    for (let i: number = 0; i < data.list.length; i++) {
                        this.bossCopyInfo[data.list[i].id].times_limit = this.bossLimitTimes[data.list[i].id];
                        this.bossCopyInfo[data.list[i].id].times_limit -= data.list[i].times;
                    }
                    this.bossCopyInfoArr = this.sortChallengeArr(this.bossCopyInfo, ConstCopyType.Boss);
                }
            } else if (data.type == 2) {
                if (data.list.length) {
                    for (let i: number = 0; i < data.list.length; i++) {
                        this.materialCopyInfo[data.list[i].id].times_limit = this.materialLimitTimes[data.list[i].id];
                        this.materialCopyInfo[data.list[i].id].times_limit -= data.list[i].times;
                        let sweep = App.ConfigManager.getConstConfigByType("MATERIAL_SWEEP_NUM").value;
                        let vipSweep = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv).transcript;
                        this.materialCopyInfo[data.list[i].id].sweep = sweep + vipSweep - data.list[i].sweep_times;
                    }
                    this.materialCopyInfoArr = this.sortChallengeArr(this.materialCopyInfo, ConstCopyType.Material);
                }
            } else {
                data.top_id = data.top_id || 30199;
                data.top_id++;
                this.topId = data.top_id;
                this.challengeCopyInfo0 = App.ConfigManager.getChallengeCopyInfoBySceneId(data.top_id);
                this.challengeCopyInfo1 = App.ConfigManager.getChallengeCopyInfoBySceneId(data.top_id + 1);
                this.challengeCopyInfo2 = App.ConfigManager.getChallengeCopyInfoBySceneId(data.top_id + 2);
                let bossId = this.challengeCopyInfo0.monster_list[0][2];
                this.bossInfo = App.ConfigManager.getMonsterById(bossId);
            }
        }

        private sortChallengeArr(obj, type) {
            let _canChallengeBoss = [];
            let _alreadyChallengeBoss = [];
            let _cannotChallengeBoss = [];
            let materialBool = 0;
            for (let k in obj) {
                let judge;
                if (type == ConstCopyType.Boss) {
                    judge = (App.RoleManager.roleInfo.lv >= obj[k].lv_limit) && obj[k].lv_limit != 0 ||
                        (App.RoleManager.roleInfo.turn >= obj[k].transmigration && obj[k].transmigration)
                } else if (type == ConstCopyType.Material) {
                    judge = App.RoleManager.roleInfo.lv >= obj[k].lv_limit;
                }
                if (judge) {
                    if (obj[k].times_limit > 0) {
                        _canChallengeBoss.push(obj[k]);
                        materialBool = _canChallengeBoss.length;
                    } else if (type == ConstCopyType.Material && obj[k].sweep > 0) {
                        _canChallengeBoss.push(obj[k]);
                    } else {
                        _alreadyChallengeBoss.push(obj[k]);
                    }
                } else {
                    _cannotChallengeBoss.push(obj[k]);
                }
            }
            if (type == ConstCopyType.Boss) {
                this.canChallenge.bossBool = _canChallengeBoss.length;
            } else if (type == ConstCopyType.Material) {
                this.canChallenge.materialBool = materialBool;
            }
            let Arr = [];
            Arr = _canChallengeBoss.concat(_alreadyChallengeBoss, _cannotChallengeBoss);
            return Arr;
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