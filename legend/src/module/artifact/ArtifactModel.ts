/**
 * 神器数据模型
*/
module game{
	export class ArtifactModel extends BaseModel{
		public artifactList : Array<any> = [];
		public constructor(){
			super();
			this.initList();
		}

		private initList() {
			let arr =  App.ConfigManager.getArtifactArray();
			for (let i=0;i<arr.length;i++) {
				this.artifactList.push(0);
			}
		}

		public updateArtifactList(data) {
			// this.artifactList = [];
			let arr =  App.ConfigManager.getArtifactArray();
			for (let i=0;i<arr.length;i++) {
				let exist = undefined;
				for (let k=0;k<data.length;k++) {
					let info = App.ConfigManager.getArtifactInfoById(data[k].id);
					if (info.type == arr[i].type) {
						exist = data[k].id;
						break
					}
				}
				if (exist) { //这类神器已经激活
					this.artifactList[i] = exist;
				} else {
					// this.artifactList[i] = 0;
				}
			}
		}

		public clear(){
			super.clear();
		}

		public destroy(){
			super.destroy();
		}
	}
}