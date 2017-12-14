/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 福利Vo 2017/06/20.
 */

module game {



    export class LabberRewardVo {

        public rank: number;
        public reward_id: number;
        public reward_num:number;
        public tier: number;
        public lv: number;
        public player_id: number;
        public margin: number;
        public name: string;
    }

    export class LabberMatchVo {

        public career: number;
        public tier: number;
        public name: string;
        public lv: number;
        public sex: number;
        public p_win: number;

        public getCareerIcon() {
 
            return GlobalUtil.getCareerPic(this.sex,this.career);
           
        }

        public getTierName() {
           return GlobalUtil.getTierName(this.tier)
        }

        public getWiningRateText(){
               
               return  this.p_win+"%";

        }
    }






}