class ResUrlUtil {
	public constructor() {
	}
	/**
	 * 地图图片
	 */
	public static getMapUrlById(id:number):string {
		return "resource/assets/map/"+id+".jpg"+App.getUrlVersion();
    }
	/**
	 * 地图小图片
	 */
	public static getMapMiniUrlById(id:number):string {
		return "resource/assets/map/mini/mini"+id+".jpg"+App.getUrlVersion();
    }
	/**
	 * 地图配置
	 */
	public static getMapConfUrlById(id:number):string {
        return "resource/assets/map/M"+id+".json"+App.getUrlVersion();
    }
	/**
	 * 背景图地址
	 */
	public static getLoadingBgUrl():string {
        return "resource/assets/ui/login/login_bg.jpg"+App.getUrlVersion();
    }
	/**
	 * 获取logo
	 */
	public static getLogoUrl():string {
        return "resource/logo.png"+App.getUrlVersion();
    }
}