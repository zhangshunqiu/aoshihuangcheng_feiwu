/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 每日必做Vo 2017/06/20.
 */

module game {

    export class TaskVo {

        public task_id: number;
        public task_name: string;
        public finish_num:number;
        public need_num:number;
        public state:number;//任务状态（0未完成，1未领取奖励，2已领取奖励）
        public reward_list:Array<any>;//1 id  2 num
        public type:MustDoType ;
    }


 export class ChestVo {
        public liveness: number;
        public reward_id:number;
        public reward_num:number;
        public state: number;//状态（0未完成，1未领取奖励，2已领取奖励）
      
    }


export class AchieveVo {
        public id: number;
        public name: string;
        public finish_num:number;
        public need_num:number;
        public state:number;//任务状态（0未完成，1未领取奖励，2已领取奖励）
        public reward_list:Array<any>;//1 id  2 num
      
    }
    
    export class MedalRankVo {
        public rank_num: number;
        public player_id:number;
        public name:string;
        public lv: number;//状态（0未完成，1未领取奖励，2已领取奖励）
      
    }

    export class TitleVo {
        public is_use: boolean;
        public is_show:boolean;
        public is_alive:boolean;
        public active:number;
        public icon:string;
        public condition:string;
        public title_id: number;
        public att_id:number;

       
      
    }
}