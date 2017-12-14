/**
 * Author: liuyonggen
 * 月卡系统数据模型 2017/11/24
 */
module game {
    export class MonthCardModel extends BaseModel {
        public leftTime: number = 0;  //月卡剩余时间
        public leftTimeDay: number = 0;
        public leftTimeHour: number = 0;
        public day: number = 0;  //月卡领取当前天数
        public rewardNum: number = 0; //未领取的奖励数
        public buyNum: number = 0; // 购买次数
        public monthCardInfo: any;   //月卡配置信息
        public rewardList: Array<Object> = [];  //购买奖励数组

        public constructor() { 
		    super();
            this.initInfo();
        }

        public updateInfo(data) {
            this.leftTime = data.left_time;
            this.day = data.day;
            this.rewardNum = data.reward_num;
            this.leftTimeDay = Math.floor(this.leftTime / (3600 * 24));
            this.leftTimeHour = Math.floor((this.leftTime / 3600) % 24); 
        }

        public updateBuyNum(data) {
            this.buyNum = data;
            this.rewardList = [];
            if(data == 1) { //购买月卡
                this.rewardList.push(this.monthCardInfo.reward[0]);
                this.rewardList.push([1,102,1000]);
            } else if(data == 2) {
                this.rewardList.push(this.monthCardInfo.reward[0]);
            }
        }

        public initInfo() {
            this.monthCardInfo = App.ConfigManager.getMonthCardInfoById(1);
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