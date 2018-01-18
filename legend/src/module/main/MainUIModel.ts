/**
 * 主界面数据模型
 * author : zrj
*/
module game {
    export class MainUIModel extends BaseModel {
        public _hookRewardInfo : any = undefined; //挂机收益信息
        public showOffline : boolean = false; //是否弹出离线收益
        public fastFightTime : number = undefined; //快速战斗的次数
        public fastFightInfo : any = undefined; //快速战斗的收益信息
        set hookRewardInfo(info) {
            this._hookRewardInfo = info;
            this._hookRewardInfo.exp = info.exp.toNumber();
            // this._hookRewardInfo.time = info.time.toNumber();
            this._hookRewardInfo.coin = info.coin.toNumber();
            // console.log(this._hookRewardInfo);
            this.showOffline = this._hookRewardInfo.type == 0 ? true : false;
        }

        get hookRewardInfo() {
            return this._hookRewardInfo;
        }
        
        public taskId:number = 0;//主线任务
        public taskState:number = 0;
        public totalTask:number = 0;
        public curTaskIndex:number = 0;
        public isMainTaskShow:boolean = true;

        

        public constructor () {
            super();
            // this.hookRewardInfo = {
            //     time:3666,
            //     scene_id :1,
            //     exp:99999999,
            //     coin:1111111,
            //     list:[{id:1,num:3},{id:32,num:5},{id:4,num:2},{id:12,num:1}]
            // }
        }


    

          public getMainLineTaskInfo(data)
          {
            this.taskId = data.id;
            this.taskState = data.state;
            this.curTaskIndex = data.num;
            this.totalTask = data.total_num;
            //..............................
          }
    }
}