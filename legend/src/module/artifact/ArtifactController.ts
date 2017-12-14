/**
 * 神器模块控制器
 * author ：zrj
*/
module game{
	export class ArtifactController extends BaseController{
		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}

		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(33001,this.handleInfo,this);
			this.registerProtocal(33002,this.handleActive,this);
			this.registerProtocal(33003,this.handleUpgrade,this);

		}

		/**
		 * 神器信息返回
		 */
		protected handleInfo(data) {
			App.logzrj("data:",data);
			ArtifactModel.getInstance().updateArtifactList(data.weapons);
			this.dispatchEvent(PanelNotify.ARTIFACT_UPDATE_VIEW);
		}

		/**
		 * 神器激活返回
		 */
		protected handleActive(data) {
			App.logzrj("data:",data);
			ArtifactModel.getInstance().updateArtifactList([data]);
			this.dispatchEvent(PanelNotify.ARTIFACT_UPGRADE_BACK);
		}

		/**
		 * 神器升级返回
		 */
		protected handleUpgrade(data) {
			App.logzrj("data:",data);
			ArtifactModel.getInstance().updateArtifactList([data]);
			this.dispatchEvent(PanelNotify.ARTIFACT_UPGRADE_BACK);
		}


		/**
		 * 销毁
		 */
		public destroy(){
			super.destroy();
		}

		/**
		 * 清理
		 */
		public clear(){
			super.clear();
		}
	}
}