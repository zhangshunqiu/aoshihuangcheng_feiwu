/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 福利数据层逻辑 2017/06/20.
 */
module game {
    export class LabberHegemonyModel extends BaseModel {

        //hegemony info
        public hegemony_name: string;
        public is_winingstreak: boolean;
        public tier: number;
        public lv: number;
        public star: number;
        public win_match: number;
        public my_rank: number;
        public wining_rate: number;
        public left_num: number;
        public left_total: number;
        public left_buy_times: number;
        //match enemy
        public match_list: Array<LabberMatchVo> = [];
        public match_enemy: LabberMatchVo;
        //labber reward
        public my_tier: number;
        public my_lv: number;
        public my_margin: number;
        public reward_list: Array<LabberRewardVo> = [];
        public tier_reward_list: Array<any> = [];
        public rank_reward_List: Array<any> = [];
        //result
        public result: number;
        public old_tier: number;
        public old_lv: number;
        public old_star: number;
        public new_tier: number;
        public new_lv: number;
        public new_star: number;
        public star_res: number;
        public surprise_list: Array<any>;

        public constructor() {
            super();

        }

        public clear() {
            super.clear();
        }

        public destroy() {
            super.destroy();
        }

        public updateLabberHegemonyInfo(data) {

            this.hegemony_name = RoleManager.getInstance().roleInfo.name;
            this.is_winingstreak = (data.win_streak >= 2);
            this.tier = data.grade;
            this.lv = data.lv;
            this.star = data.star;
            this.win_match = data.margin;
            this.my_rank = data.rank;
            this.wining_rate = data.p_win;
            this.left_num = data.left_times;
            this.left_total = data.max_times;
            this.left_buy_times = data.left_buy_times;
            App.BtnTipManager.setTypeValue(ConstBtnTipType.AREAN_LABBER, this.left_num>0);


        }

        public getMatchEnemyInfo(data) {

            this.match_enemy = new LabberMatchVo();
            this.match_list.splice(0);

            let enemy = data.enemy;
            this.match_enemy.name = enemy.name;
            this.match_enemy.career = enemy.career;
            this.match_enemy.sex = enemy.sex;
            this.match_enemy.p_win = enemy.p_win;
            this.match_enemy.tier = enemy.grade;
            this.match_enemy.lv = enemy.lv;

            for (let i = 0; i < data.list.length; i++) {
                let info = new LabberMatchVo();
                info.name = data.list[i].name;
                info.career = data.list[i].career;
                info.sex = data.list[i].sex;
                info.p_win = data.list[i].p_win;
                info.tier = data.list[i].grade;
                info.lv = data.list[i].lv;
                this.match_list.push(info);

            }

        }

        public getLabberRewardInfo(data) {
              
            this.tier_reward_list = App.ConfigManager.getLabberTierRewardInfo();
            this.rank_reward_List = App.ConfigManager.getLabberRankRewardInfo();
            //this.tier_reward_list = App.ConfigManager.getLabberRankRewardInfo();
            this.reward_list.splice(0);
            this.my_tier = data.myGrade;
            this.my_lv = data.myLv;
            this.my_margin = data.myMargin;

            for (let i = 0; i < this.rank_reward_List.length; i++) {

                let info = new LabberRewardVo();
                if (i < data.list.length) {

                    info.name = data.list[i].name;
                    info.player_id = data.list[i].player_id;
                    info.rank = data.list[i].rank;
                    info.tier = data.list[i].grade;
                    info.lv = data.list[i].lv;
                    info.margin = data.list[i].margin;
                } 
                else {
                    info.player_id = -1;
                    info.rank = i+1;
                }

                info.reward_id = this.rank_reward_List[i][1];
                info.reward_num = this.rank_reward_List[i][2];

                this.reward_list.push(info);
            }
        }

        public getHegemonyResultInfo(data) {

            this.result = data.res;
            this.old_tier = data.old_grade;
            this.old_lv = data.old_lv;
            this.old_star = data.old_star;
            this.new_tier = data.new_grade;
            this.new_lv = data.new_lv;
            this.new_star = data.new_star;
            this.star_res = data.star_res;
            this.surprise_list = data.surprise_list;

            let info = App.ConfigManager.getLabberMatchReward(this.result + 1, this.new_tier);
            this.surprise_list.unshift({ type: info[0], id: info[1], num: info[2] });
        }



    }
}