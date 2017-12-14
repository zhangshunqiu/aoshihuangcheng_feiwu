/**
* Author: liuyonggen
* 遭遇战系统数据模型 2017/12/7
*/
module game {
    export class EncounterModel extends BaseModel {
        public killNum: number = 0;  //杀戮值
        public rank: number = 0; //排名
        public refreshTime: number = 0;  //刷新时间
        public pkNum: number = 0;  //pk值
        public playerList: any[] = [];  //玩家列表
        
       public log_list:Array<EncounterLogVo> = [];
       
       public curType:number;
       public curId:number;
        public constructor() {
            super();
            
        }

        public updateInfo(data) {
            this.killNum = data.killing_num;
            this.rank = data.rank;
            this.refreshTime = data.refresh_time;
            this.pkNum = data.pk;
            this.playerList = data.pk_player;
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

        public getEncounterLogInfo(data) {

            for (let i = 0; i < data.pk_log.length; i++) {
                let info = new EncounterLogVo();
                info.name = data.pk_log[i].nick;
                info.res = data.pk_log[i].result;
                info.time = data.pk_log[i].time;
                info.reward_list = data.pk_log[i].reward;
                 this.log_list.push(info);
            }
            


        }
    }
}