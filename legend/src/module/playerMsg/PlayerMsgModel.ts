/**
 * Author: yangyipeng                              
 * 查看玩家信息模块模型 2017/06/20.
 */
module game{
     export class PlayerMsgModel extends BaseModel{  //model必须继承BaseModel

        private _heroList:Array<any> = [];
        private _playerVo:PlayerVo = new PlayerVo();
        private _heroNum:number;//英雄数量

        private _curPos:number//当前选中英雄索引
        public constructor() { 
            super();
        }

        public set curPos(cur:number) {
            this._curPos = cur;
        }
        public get curPos() {
            return this._curPos;
        }
        public get heroNum() {
            return this._heroNum;
        }
        public get heroList() {
            return this._heroList;
        }
        public get playVo() {
            return this._playerVo;
        }

        /**
		 * 根据部位获得装备类型
		*/
		public getTypeByPos(pos) {
			let type = 1; //装备类型
			if (pos <= 4) {
				type = pos;
			} else if (pos == 5 || pos == 6) {
				type = 5;
			} else if (pos == 7 || pos == 8) {
				type = 6;
			} else if (pos > 8) {
				type = pos - 2;
			}
			return type;
		}
        
        public updateData(data):void {  
            this._playerVo.updateData(data);
            this._heroNum = data.hero.length-1;//从零开始算
            this._heroList = data.hero;
        }

        public herosHeadPic():Array<string> {
            var arr = [];
            for(var i:number=0;i<this._heroList.length;i++) {
                var job:number;
                var sex:number;
                for(var key in this._heroList[i]) {
                    if(key == "job") {
                        job = this._heroList[i]["job"]
                        break;
                    }
                }
                for(var key in this._heroList[i]) {
                    if(key == "sex") {
                        sex = this._heroList[i]["sex"]
                        break;
                    }
                }
                arr.push({sex:sex,job:job});
            }
            while(arr.length <3) {
                arr.push(null);
            }
            return arr;
        }
        
        //根据属性key去拿属性的值
        public getAtrributeByKey(key,attributesArr) {
            for (let i = 0; i < attributesArr.length; i++) {
                if (key == attributesArr[i].key) {
                    return attributesArr[i];
                }
            }
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
    export class PlayerVo{
        public lv:number;
        public medal_lv:number;
        public name:string;
        public career:number;//职业
        public sex:number;
        public turn:number;
        public player_id:number;
         constructor(){

        }
        public updateData(data):void {
            this.lv = data.lv;
            this.medal_lv = data.medal_lv;
            this.name = data.name;
            this.career = data.career;
            this.sex = data.sex;
            this.turn = data.turn;
            this.player_id = data.player_id;
        }
    }

}