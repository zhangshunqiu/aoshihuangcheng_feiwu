/**
 * 合成模块控制器
 * author : zrj
*/
module game{
	export class SynthesisController extends BaseController{
		public constructor(){
			super();
			this.initProtocol();
			this.initEventListener();
		}
		/**
		 * 初始化协议
		 */
		protected initProtocol() {
			this.registerProtocal(14013,this.handleCompoundR,this);
			this.registerProtocal(14014,this.handleOneCompoundR,this);
		}

		/**
		 * 合成
		 */
		public handleCompoundR(data){
			App.logzrj("data: ",data);
			this.dispatchEvent(PanelNotify.SYNTHESIS_VIEW,data);
			// if(data.type == ConstSynthesisType.JEWEL){
			// 	this.dispatchEvent(PanelNotify.SYNTHESIS_JEWEL_VIEW,ConstSynthesisType.JEWEL);
			// } else if(data.type == ConstSynthesisType.WING) {
			// 	this.dispatchEvent(PanelNotify.SYNTHESIS_WING_VIEW,ConstSynthesisType.WING);
			// } else if (data.type == ConstSynthesisType.EQUIP) {
			// 	this.dispatchEvent(PanelNotify.SYNTHESIS_EQUIP_VIEW,ConstSynthesisType.EQUIP);
			// }
		}

		/**
		 * 一键合成
		 */
		public handleOneCompoundR(data){
			App.logzrj("data: ",data);
			this.dispatchEvent(PanelNotify.SYNTHESIS_ALL_VIEW,data);
			// if(data.type == ConstSynthesisType.JEWEL){
			// 	this.dispatchEvent(PanelNotify.SYNTHESIS_JEWEL_VIEW,ConstSynthesisType.JEWEL);
			// } else if(data.type == ConstSynthesisType.WING) {
			// 	this.dispatchEvent(PanelNotify.SYNTHESIS_WING_VIEW,ConstSynthesisType.WING);
			// } else if (data.type == ConstSynthesisType.EQUIP) {
			// 	this.dispatchEvent(PanelNotify.SYNTHESIS_EQUIP_VIEW,ConstSynthesisType.EQUIP);
			// }
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