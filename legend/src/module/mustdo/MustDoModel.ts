/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 每日必做数据层逻辑 2017/06/20.
 */
module game {
    export class MustDoModel extends BaseModel {

        public taskList: Array<any> = [];  //
        public chestList: Array<any> = [];  //
        public achievelist: Array<any> = [];
        public achieveranklist: Array<any> = [];
        public titleList: Array<TitleVo> = [];
        public totalactivity: number;
        public livenessNum: number;
        public achievepercent: number;
        public achievevalue: number;
        public achieve_power: number;
        public achieve_not_get: number;
        public month_card: number;
        public achieve_lv: number;
        public achieve_own: number;
        public achieve_upgrade: number;
        public has_can_get: boolean;//判断成就是否能一键领取
        public selectTitleId: number;
        public selectTitileVo:TitleVo;
        public activetitlenum: number;
        public has_activity_can_get:boolean;


        public constructor() {
            super();

        }

        public clear() {
            super.clear();
        }

        public destroy() {
            super.destroy();
        }

        public getTitleInfo(data) {

            this.titleList.splice(0);
            this.totalactivity = data.total_liveness;
            this.activetitlenum = data.titles.length;
            let config = App.ConfigManager.getTitleInfo();

            for (let key in config) {

                let tivo: TitleVo = new TitleVo();
                tivo.active = config[key].active;
                tivo.icon = config[key].icon;
                tivo.is_alive = false;
                tivo.title_id = config[key].title_id;
                tivo.att_id = config[key].att_id;
                tivo.type = config[key].type;
                tivo.time = config[key].time
                tivo.des = config[key].des;
                for (let i = 0; i < data.titles.length; i++) {
                    if (config[key].title_id == data.titles[i].id) {
                        tivo.is_alive = true;
                        tivo.title_id = data.titles[i].id;
                        tivo.is_show = data.titles[i].show == 1;
                        tivo.is_use = data.titles[i].use == 1;
                    }
                }

                this.titleList.push(tivo);
            }


        }

    //    public getCurShowTitle(){
    //        for(let i = 0 ;i<this.titleList.length;i++){
    //          if(this.titleList[i].is_show)
    //           return this.titleList[i].icon;
    //        }
    //        return "";
    //    }

        public getMedalInfo(data) {

            this.achieveranklist.splice(0);
            this.achieve_power = data.power;
            this.achieve_not_get = data.achieve_not_get;
            this.achieve_lv = data.lv;
            this.achieve_own = data.achieve_own;
            this.achieve_upgrade = data.achieve_upgrade;
            this.month_card = data.month_card;

            for (let i = 0; i < data.rank_list.length; i++) {
                let rv: MedalRankVo = new MedalRankVo();
                rv.rank_num = data.rank_list[i].rank;
                rv.player_id = data.rank_list[i].player_id;
                rv.name = data.rank_list[i].name;
                rv.lv = data.rank_list[i].lv;
                this.achieveranklist.push(rv);

            }
            
            
            if (this.achieve_own >= this.achieve_upgrade&&this.achieve_upgrade>0) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_MEDAL, true);
            }
            else if (this.month_card == 1 && this.achieve_not_get > 0) {
                App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_MEDAL, true);
            }
            else{
                 App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_MEDAL, false);
            }
        }


        public getAchieveInfo(data) {

            this.achievelist.splice(0);
            this.has_can_get = false;
            this.achievepercent = data.p_complete;
            this.achievevalue = data.total_achieve;
            
            for (let i = 0; i < data.achieve_list.length; i++) {
                let tv: TaskVo = new TaskVo();
                tv.task_id = data.achieve_list[i].id;
                tv.task_name = data.achieve_list[i].name;
                tv.finish_num = data.achieve_list[i].finish_num;
                tv.need_num = data.achieve_list[i].need_num;
                tv.state = data.achieve_list[i].state;
                if (tv.state == 1)
                    this.has_can_get = true;
                tv.reward_list = data.achieve_list[i].reward_list;
                tv.type = MustDoType.ACHIEVE;
                this.achievelist.push(tv);
            }

            App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_ACHIEVE, this.has_can_get);

            this.achievelist.sort((a, b) => {
                if (a.state == 1) {
                    if (b.state != 1)
                        return -1;
                    else
                        return 0;
                }
                if (a.state == 0) {
                    if (b.state == 0)
                        return 0;
                    if (b.state == 1)
                        return 1;
                    if (b.state == 2)
                        return -1;
                }
                if (a.state == 2) {
                    if (b.state != 2)
                        return 1;
                    else
                        return 0;
                }
                return 0;
            });
        }
        public getActivityInfo(data) {

            this.taskList.splice(0);
            this.chestList.splice(0);
            this.livenessNum = data.liveness_num;
             this.has_activity_can_get = false;

            for (let i = 0; i < data.task_list.length; i++) {
                let tv: TaskVo = new TaskVo();
                tv.task_id = data.task_list[i].task_id;
                tv.task_name = data.task_list[i].task_name;
                tv.finish_num = data.task_list[i].finish_num;
                tv.need_num = data.task_list[i].need_num;
                tv.state = data.task_list[i].state;
                if(tv.state==1)
                this.has_activity_can_get = true;
                tv.reward_list = data.task_list[i].reward_list;
                tv.type = MustDoType.ACTIVITY;
                this.taskList.push(tv);
            }

            this.taskList.sort((a, b) => {
                if (a.state == 1) {
                    if (b.state != 1)
                        return -1;
                    else
                        return 0;
                }
                if (a.state == 0) {
                    if (b.state == 0)
                        return 0;
                    if (b.state == 1)
                        return 1;
                    if (b.state == 2)
                        return -1;
                }
                if (a.state == 2) {
                    if (b.state != 2)
                        return 1;
                    else
                        return 0;
                }
                return 0;
            });

            for (let i = 0; i < data.liveness_reward_list.length; i++) {
                let cv: ChestVo = new ChestVo();
                cv.liveness = data.liveness_reward_list[i].liveness;
                cv.reward_id = data.liveness_reward_list[i].reward_id;
                cv.reward_num = data.liveness_reward_list[i].reward_num;
                cv.state = data.liveness_reward_list[i].state;
                if(cv.state == 1){
                    this.has_activity_can_get = true;
                }
                this.chestList.push(cv);
            }

            App.BtnTipManager.setTypeValue(ConstBtnTipType.TASK_DAILY, this.has_activity_can_get);

        }
    }
}