/**
 * Author: lihe
 * Email： hersletter@qq.com
 * 福利数据层逻辑 2017/06/20.
 */
module game {
    export class WelfareModel extends BaseModel {

        public lvList: Array<WelfareLvVo> = [];  //      
        public hasRedPoint:boolean = false;

        public constructor() {
            super();

        }

        public clear() {
            super.clear();
        }

        public destroy() {
            super.destroy();
        }

        public updateLvList(data) {
            if (this.lvList && this.lvList.length) {
                this.lvList.splice(0);
                for (let i = 0; i < data.list.length; i++) {
                    let wlo: WelfareLvVo = new WelfareLvVo();
                    wlo.lv = data.list[i].lv;
                    wlo.state = data.list[i].state;
                    wlo.left_num = data.list[i].left_num;
                    this.lvList.push(wlo);
                }
                this.lvList.sort((a, b) => {
                    if (a.state == 1 && b.state != 1)
                        return -1;
                    else if (a.state != 1 && b.state == 1)
                        return 1;
                    return 0;
                });
            } else {
                for (let i = 0; i < data.list.length; i++) {
                    var d: any = data.list[i];
                    var isFind: boolean = false;
                    for (var j: number = 0; j < this.lvList.length; j++) {
                        var vo: WelfareLvVo = this.lvList[j];
                        if (vo.lv == d.lv) {
                            isFind = true;
                            vo.state = d.state;
                            vo.left_num = d.left_num;
                        }
                    }
                    if (isFind == false) {
                        let wlo: WelfareLvVo = new WelfareLvVo();
                        wlo.lv = d.lv;
                        wlo.state = d.state;
                        wlo.left_num = d.left_num;
                        this.lvList.push(wlo);
                    }
                }


            }
        }

        public updateRewardLeftNum(data) {

            for (let i = 0; i < this.lvList.length; i++) {

                if (this.lvList[i].lv = data.lv) {

                    this.lvList[i].left_num = data.left_num;
                     if(this.lvList[i].state==1&& this.lvList[i].left_num>0)
                       this.hasRedPoint = true;
                }
            }

            App.BtnTipManager.setTypeValue(ConstBtnTipType.WELFARE_LEVEN, this.hasRedPoint);
        }

        public getWelfareLvList(data) {
         
            this.hasRedPoint = false;
            this.lvList.splice(0);
            for (let i = 0; i < data.list.length; i++) {

                let wlo: WelfareLvVo = new WelfareLvVo();
                wlo.lv = data.list[i].lv;
                wlo.state = data.list[i].state;
                wlo.left_num = data.list[i].left_num;
                 if(wlo.state==1&& (wlo.left_num>0||wlo.left_num==-1))
                this.hasRedPoint = true;
                this.lvList.push(wlo);

            }
  
             App.BtnTipManager.setTypeValue(ConstBtnTipType.WELFARE_LEVEN, this.hasRedPoint);

            this.lvList.sort((a, b) => {
               
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
    }
}