/**
 * 夺宝数据模型
*/
module game {
	export class RaiderModel extends BaseModel {
		public storageRecord: Array<any> = []; //寻宝展示记录
		public curDay: number = 1; //当前开服时间
		public storageItem: Array<any> = []; //仓库内物品
		public storageCapacity: number; //仓库当前容量
		public time: number = 1; //一次还是10次
		public constructor() {
			super();
		}

		public updateStorageInfo(data) {
			this.storageItem = data;;
			this.storageCapacity = data.length;
		}

		public updatestorageRecord(data) {
			this.storageRecord = [];
			//最多5条
			for (let k in data) {
				this.storageRecord.push(data[k]);
				if (this.storageRecord.length > 5) {
					this.storageRecord.shift();
				}
			}
		}

		public clear() {
			super.clear();
		}

		public destroy() {
			super.destroy();
		}
	}
}