class BigNumber extends BaseClass {
	private thresholds = [100000000, 10000];				//阈值
	private thresholdsNames = ["Y", "W"];			//阈值
	private digits = 1;						//精度

	public constructor() {
		super();
	}

	public convert(input: number | string) {
		let out: number = undefined;
		if (typeof input === "string") {
			out = Number(input);
		} else {
			out = input;
		}

		let thresholdsName = undefined;
		for (let index in this.thresholds) {
			if (out >= this.thresholds[index]) {
				out = Number((out / this.thresholds[index]).toFixed(this.digits));
				thresholdsName = [this.thresholdsNames[index]];
				break;
			}
		}

		return thresholdsName ? out + thresholdsName : out.toString();
	}
}