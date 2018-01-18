/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 福利Vo 2017/06/20.
 */

module game {

    export class WelfareLvVo {

        public id:number;
        public state:number;//任务状态（0不可领，1可领取，2已领取）
        public left_num:number;// 剩余数量（-1未不限数量）

    }

export class WelfareRewardVo {

        public type:number;
        public id: number;
        public num:number;
    }

 


}