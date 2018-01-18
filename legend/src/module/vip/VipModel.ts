/**
 * Author: liuyonggen
 * Vip系统数据模型 2017/11/21
 */
module game {
    export class VipModel extends BaseModel {
        public vipInfo:any = {};
        public nextVipInfo:any = {};
        public vipArr: Array<any> = [];
        public upGold: number = 0;
        public currentIndex: number = 0;
        public hasReward: boolean = false;
        public constructor() { 
		    super();
            this.getVipInfo();
        }

        public getVipInfo() {
            this.vipArr = [];
            this.vipInfo = App.ConfigManager.getVipInfoById(App.RoleManager.roleInfo.vipLv);
            if(this.vipInfo.vip != 10) {
                this.nextVipInfo = App.ConfigManager.getVipInfoById(this.vipInfo.vip + 1);
                this.currentIndex = this.vipInfo.vip + 1;
            } else {
                this.currentIndex = this.vipInfo.vip;
            }
            for(let i:number=0; i<=10; i++) {
                let vipInfo = App.ConfigManager.getVipInfoById(i);
                this.vipArr.push(vipInfo);
            }
        }

        public updateInterfaceInfo(data) {
            this.upGold = data.up_gold;
            let rewardList = data.reward_list;
            for(let i:number=0; i<rewardList.length; i++) {
                this.vipArr[i].rewardList = rewardList[i];
            }
            for(let i:number=0; i<rewardList.length; i++) {
                if(rewardList[i].state == 1) {
                    this.currentIndex = rewardList[i].lv;
                    this.hasReward = true;
                    break;
                }
            }
        }

        public btnRedTip() {
            for(let i:number=0; i<this.vipArr.length; i++) {
                if(this.vipArr[i].rewardList.state == 1) {
                    this.hasReward = true;
                    return;
                }
            }
            this.hasReward = false;
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