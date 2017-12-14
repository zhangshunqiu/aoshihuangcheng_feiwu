module game {
	export class LoadingUI extends eui.Component {
		public pb: eui.ProgressBar;

		public constructor() {
			super();
			this.skinName = "LoadingSkin";
		}

		public partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}
	}
}