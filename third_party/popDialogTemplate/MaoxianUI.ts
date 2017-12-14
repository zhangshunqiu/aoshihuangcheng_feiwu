module game {
	export class MaoxianUI extends eui.Component {
		public cuDialogHead2Btn:customui.DialogHead2Btn;

		public constructor() {
			super();
			this.skinName = "src/module/maoxian/MaoxianSkin.exml";
		}

		public partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}
	}
}