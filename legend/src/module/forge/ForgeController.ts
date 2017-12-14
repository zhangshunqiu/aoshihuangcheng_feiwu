/**
 * module : 锻造模块控制器
 * author : zrj
*/
module game{
	export class ForgeController extends BaseController{
		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(15004,this.handleForgeR,this);
			this.registerProtocal(15005,this.handleFastForgeR,this);
			this.registerProtocal(15006,this.handleForgeStarR,this);
		}
		/**
		 * 强化武器部位
		*/
		public handleForgeR(data) {
			App.logzrj("handleForgeR",data);
			ForgeModel.getInstance().updateStrengthPart(data);
			this.dispatchEvent(PanelNotify.FORGE_STRENGTH_EQUIP);
		}
		/**
		 * 一件强化武器部位
		*/
		public handleFastForgeR(data) {
			App.logzrj("handleFastForgeR",data);
			ForgeModel.getInstance().updateStrengthPart(data);
			this.dispatchEvent(PanelNotify.FORGE_STRENGTH_EQUIP);
		}
		/**
		 * 武器部位升星
		*/
		public handleForgeStarR(data) {
			App.logzrj("handleForgeStarR",data);
			ForgeModel.getInstance().updateStarPart(data);
			this.dispatchEvent(PanelNotify.FORGE_STAR_EQUIP);
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