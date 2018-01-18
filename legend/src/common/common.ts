
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 自动加载图片动画播放器 2017/09/20.
 */
class AMovieClip extends egret.MovieClip {
	private _eventSystem: EventSystem;
	private _sourceCache: McSourceCache;
	private _mcKey: string = "";//影片Key
	private _actName: string = "";//动作名称
	private _clearKey: string = "";//影片清理Key
	private _loadEventId: number = 0;
	private _playtimes: number = -1;
	private _callBackFun: Function;
	protected _thisBackObject: any;

	public constructor() {
		super();
		this._sourceCache = McSourceCache.getInstance();
		this._eventSystem = EventSystem.getInstance();
	}
	/**
	 * 获取资源Key
	 * return string
	 */
	public getMCKey(): string {
		return this._mcKey;
	}

	/**
	 * 获取动作名称
	 * return string
	 */
	public actName(): string {
		return this._actName;
	}

	/**
	 * 根据资源Key和动作名称播放资源帧序列
	 * @param mcKey 资源Key
	 * @param actName 动作名称
	 * @param times 播放次数
	 * @param callBackFun 资源加载完成回掉
	 * @param thisBackObject 回掉函数对象
	 */
	public playMCKey(mcKey: string, actName: string = "", times: number = -1, defaultmc: string = null, callBackFun: Function = null, thisBackObject: any = null) {
		if (this._mcKey == mcKey) {
			if (this.movieClipData && this.movieClipData.frames.length > 0) {
				this._playtimes = times;
				if (times == -1) {
					this.play(this._playtimes);
				} else {
					this.gotoAndPlay(1, this._playtimes);
				}
				if (callBackFun && thisBackObject) {
					callBackFun.call(thisBackObject);
				}
			}
			return;
		}
		//this._clearKey = this._mcKey; 
		this._playtimes = times;
		this._mcKey = mcKey;
		if (actName == "") {
			this._actName = this._mcKey;
		} else {
			this._actName = actName;
		}
		if (this._sourceCache.has(this._mcKey)) {
			if (this._clearKey != "") {
				this._sourceCache.removeObject(this._clearKey);
				this._clearKey = "";
			}
			//var mcData:egret.MovieClipData = this._sourceCache.getObject(this._mcKey,this._actName);
			this._clearKey = this._mcKey;
			this.movieClipData = this._sourceCache.getObject(this._mcKey, this._actName);
			//if(mcData && mcData.frames.length>0){
			//	this.movieClipData  = mcData 
			//}else{
			//	this.movieClipData = this._sourceCache.getObject("defaultmc","defaultmc");
			//}
			if (this.movieClipData.frames.length > 0) {
				if (this._playtimes == -1) {
					this.play(this._playtimes);
				} else {
					this.gotoAndPlay(1, this._playtimes);
				}
			}
			if (callBackFun && thisBackObject) {
				callBackFun.call(thisBackObject);
			}
		} else {
			this._callBackFun = callBackFun;
			this._thisBackObject = thisBackObject;

			if (this._loadEventId == 0) {
				//this._eventSystem.removeEventListener(MCSourceCacheEventType.COMPLETE,this._loadEventId);
				this._loadEventId = this._sourceCache.addEventListener(MCSourceCacheEventType.COMPLETE, this.mcLoadComplete, this);
			}
			if (defaultmc != null) {
				this.movieClipData = this._sourceCache.getObject(defaultmc, defaultmc);
				this.gotoAndPlay(1, this._playtimes);
			} else {
				this.stop();
			}
			this._sourceCache.load(this._mcKey);
			//this._sourceCache.load(this._mcKey);
			//this.stop();
			//使用默认图片
			//this.movieClipData = (McSourceCache.getInstance() as McSourceCache).getObject(this._mcKey).generateMovieClipData(this._mcKey);
			// this.play(this._playtimes);
		}
	}


	private mcLoadComplete(mcKey: string) {
		if (this._mcKey == mcKey) {
			//console.log(mcKey);
			if (this._clearKey != "") {
				this._sourceCache.removeObject(this._clearKey);
				this._clearKey = "";
			}
			var mcData: egret.MovieClipData = this._sourceCache.getObject(this._mcKey, this._actName);
			this._clearKey = this._mcKey;
			if (mcData && mcData.frames.length > 0) {
				this.movieClipData = mcData
			} else {
				this.movieClipData = this._sourceCache.getObject("defaultmc", "defaultmc");
				App.logzsq("res load Error id=" + mcKey);
			}
			if (this._playtimes == -1) {
				this.play(this._playtimes);
			} else {
				this.gotoAndPlay(1, this._playtimes);
			}
			if (this._loadEventId != 0) {
				this._eventSystem.removeEventListener(MCSourceCacheEventType.COMPLETE, this._loadEventId);
				this._loadEventId = 0;
			}
			if (this._callBackFun && this._thisBackObject) {
				this._callBackFun.call(this._thisBackObject);
				this._callBackFun = null;
				this._thisBackObject = null;
			}
		}
	}

	/**
	 * 销毁,必须调用
	 */
	public destroy() {
		this._thisBackObject = null;
		this._callBackFun = null;
		this.stop();
		if (this._loadEventId != 0) {
			this._eventSystem.removeEventListener(MCSourceCacheEventType.COMPLETE, this._loadEventId);
			this._loadEventId = 0;
		}
		// if(this._mcKey != ""){
		// 	this._sourceCache.removeObject(this._mcKey);
		// 	this._mcKey = ""
		// }
		if (this._clearKey != "") {
			this._sourceCache.removeObject(this._clearKey);
			this._clearKey = "";
		}
	}

}
module aStar {
	export class AStar extends egret.HashObject {
		public static _rowCount: number = 0;
		public static _colCount: number = 0;
		public static _startX: number = 0;
		public static _startY: number = 0;
		public static _endX: number = 0;
		public static _endY: number = 0;
		public static _startRow: number = 0;
		public static _startCol: number = 0;
		public static _endRow: number = 0;
		public static _endCol: number = 0;
		public static _mapArray: Array<any> = [];
		public static _mapStatusArray: Array<any>;
		public static _fatherArray: Array<any>;
		public static _rows: Array<any>;
		public static _cols: Array<any>;
		public static _gScoreArray: Array<any>;
		public static _fScoreArray: Array<any>;
		public static _openArray: Array<any>;
		public static _openId: number = 0;
		public static _openCount: number = 0;
		public static _NOTE_ID: number = 0;
		public static _NOTE_OPEN: number = 1;
		public static _NOTE_CLOSED: number = 2;
		public static _COST_STRAIGHT: number = 10;
		public static _COST_DIAGONAL: number = 14;
		public static _GridWidth: number = 64;
		public static _GridHeigh: number = 64;



		public static find(startRow: number, startCol: number, endRow: number, endCol: number): Array<any> {
			startRow = Math.floor(startRow);
			startCol = Math.floor(startCol);
			endRow = Math.floor(endRow);
			endCol = Math.floor(endCol);
			AStar._startRow = startRow;
			AStar._startCol = startCol;
			AStar._endRow = endRow;
			AStar._endCol = endCol;
			if (<any>!AStar.canWalk(endRow, endCol))
				return null;
			AStar.initLists();
			AStar._openCount = 0;
			AStar._openId = -1;
			AStar.openNote(AStar._startRow, AStar._startCol, 0, 0, 0);
			var currId: number = 0;
			var currNoteX: number = 0;
			var currNoteY: number = 0;
			var aroundNotes: Array<any>;
			var checkingId: number = 0;
			var fcore: number = 0;
			var gcore: number = 0;
			while (AStar._openCount > 0) {
				currId = AStar._openArray[0];
				AStar.closeNote(currId);
				currNoteX = AStar._rows[currId];
				currNoteY = AStar._cols[currId];
				if (currNoteX == AStar._endRow && currNoteY == AStar._endCol) {
					return AStar.getPath(AStar._startRow, AStar._startCol, currId);
				}
				aroundNotes = AStar.getArounds(currNoteX, currNoteY);
				for (var note_key_a in aroundNotes) {
					var note: Array<any> = aroundNotes[note_key_a];
					gcore = AStar._gScoreArray[currId] + ((note[0] == currNoteX || note[1] == currNoteY) ? AStar._COST_STRAIGHT : AStar._COST_DIAGONAL);
					fcore = gcore + (AStar.myAbs(endRow - note[0]) + AStar.myAbs(endCol - note[1])) * AStar._COST_STRAIGHT;
					if (AStar.isOpen(note[0], note[1])) {
						checkingId = AStar._mapStatusArray[note[0]][note[1]][AStar._NOTE_ID];
						if (gcore < AStar._gScoreArray[checkingId]) {
							AStar._gScoreArray[checkingId] = gcore;
							AStar._fScoreArray[checkingId] = fcore;
							AStar._fatherArray[checkingId] = currId;
							AStar.addSort(AStar.getIndex(checkingId));
						}
					}
					else {
						AStar.openNote(note[0], note[1], fcore, gcore, currId);
					}
				}
			}
			AStar.destroyLists();
			return null;
		}

		private static openNote(row: number, col: number, fScore: number, gScore: number, fatherId: number) {
			row = row;
			col = col;
			fScore = fScore;
			gScore = gScore;
			fatherId = fatherId;
			AStar._openCount++;
			AStar._openId++;
			if (AStar._mapStatusArray[row] == null) {
				AStar._mapStatusArray[row] = [];
			}
			AStar._mapStatusArray[row][col] = [];
			AStar._mapStatusArray[row][col][AStar._NOTE_OPEN] = true;
			AStar._mapStatusArray[row][col][AStar._NOTE_ID] = AStar._openId;
			AStar._rows.push(row);
			AStar._cols.push(col);
			AStar._fScoreArray.push(fScore);
			AStar._gScoreArray.push(gScore);
			AStar._fatherArray.push(fatherId);
			AStar._openArray.push(AStar._openId);
			AStar.addSort(AStar._openCount);
		}

		private static closeNote(id: number) {
			id = id;
			AStar._openCount--;
			var noteX: number = AStar._rows[id];
			var noteY: number = AStar._cols[id];
			AStar._mapStatusArray[noteX][noteY][AStar._NOTE_OPEN] = false;
			AStar._mapStatusArray[noteX][noteY][AStar._NOTE_CLOSED] = true;
			if (AStar._openCount <= 0) {
				AStar._openCount = 0;
				AStar._openArray = [];
				return;
			}
			AStar._openArray[0] = AStar._openArray.pop();
			AStar.delSort();
		}

		private static addSort(index: number) {
			index = index;
			var father: number = 0;
			var change: number = 0;
			while (index > 1) {
				father = Math.floor(index >> 1);
				if (AStar.getFScore(index) < AStar.getFScore(father)) {
					change = AStar._openArray[index - 1];
					AStar._openArray[index - 1] = AStar._openArray[father - 1];
					AStar._openArray[father - 1] = change;
					index = father;
				}
				else {
					break;
				}
			}
		}

		private static delSort() {
			var nowIndex: number = 1;
			var temp: number = 0;
			var change: number = 0;
			var temp2: number = 0;
			while (true) {
				temp = nowIndex;
				temp2 = temp << 1;
				if (temp2 <= AStar._openCount) {
					if (AStar.getFScore(nowIndex) > AStar.getFScore(temp2)) {
						nowIndex = temp2;
					}
					if (temp2 + 1 <= AStar._openCount) {
						if (AStar.getFScore(nowIndex) > AStar.getFScore(temp2 + 1)) {
							nowIndex = temp2 + 1;
						}
					}
				}
				if (temp == nowIndex) {
					break;
				}
				else {
					change = AStar._openArray[temp - 1];
					AStar._openArray[temp - 1] = AStar._openArray[nowIndex - 1];
					AStar._openArray[nowIndex - 1] = change;
				}
			}
		}

		public static initData(mapArray: Array<any>) {
			AStar._mapArray = mapArray;
			AStar._rowCount = AStar._mapArray.length;
			AStar._colCount = AStar._mapArray[0].length;
		}

		private static getArounds(row: number, col: number): Array<any> {
			row = row;
			col = col;
			var arr: Array<any> = [];
			var checkRow: number = 0;
			var checkCol: number = 0;
			var canDiagonal: boolean;
			checkRow = row + 1;
			checkCol = col;
			var canRight: boolean = AStar.canWalk(checkRow, checkCol);
			if (canRight && <any>!AStar.isClosed(checkRow, checkCol)) {
				arr.push([checkRow, checkCol]);
			}
			checkRow = row;
			checkCol = col + 1;
			var canDown: boolean = AStar.canWalk(checkRow, checkCol);
			if (canDown && <any>!AStar.isClosed(checkRow, checkCol)) {
				arr.push([checkRow, checkCol]);
			}
			checkRow = row - 1;
			checkCol = col;
			var canLeft: boolean = AStar.canWalk(checkRow, checkCol);
			if (canLeft && <any>!AStar.isClosed(checkRow, checkCol)) {
				arr.push([checkRow, checkCol]);
			}
			checkRow = row;
			checkCol = col - 1;
			var canUp: boolean = AStar.canWalk(checkRow, checkCol);
			if (canUp && <any>!AStar.isClosed(checkRow, checkCol)) {
				arr.push([checkRow, checkCol]);
			}
			checkRow = row + 1;
			checkCol = col + 1;
			canDiagonal = AStar.canWalk(checkRow, checkCol);
			if (canDiagonal && (canRight || canDown) && <any>!AStar.isClosed(checkRow, checkCol)) {
				arr.push([checkRow, checkCol]);
			}
			checkRow = row - 1;
			checkCol = col + 1;
			canDiagonal = AStar.canWalk(checkRow, checkCol);
			if (canDiagonal && (canLeft || canDown) && <any>!AStar.isClosed(checkRow, checkCol)) {
				arr.push([checkRow, checkCol]);
			}
			checkRow = row - 1;
			checkCol = col - 1;
			canDiagonal = AStar.canWalk(checkRow, checkCol);
			if (canDiagonal && (canLeft || canUp) && <any>!AStar.isClosed(checkRow, checkCol)) {
				arr.push([checkRow, checkCol]);
			}
			checkRow = row + 1;
			checkCol = col - 1;
			canDiagonal = AStar.canWalk(checkRow, checkCol);
			if (canDiagonal && (canRight || canUp) && <any>!AStar.isClosed(checkRow, checkCol)) {
				arr.push([checkRow, checkCol]);
			}
			return arr;
		}

		private static getPath(startRow: number, startCol: number, id: number): Array<any> {
			startRow = startRow;
			startCol = startCol;
			id = id;
			var arr: Array<any> = [];
			var nowRow: number = AStar._rows[id];
			var nowCol: number = AStar._cols[id];
			while (nowRow != startRow || nowCol != startCol) {
				arr.unshift(nowCol);
				arr.unshift(nowRow);
				id = AStar._fatherArray[id];
				nowRow = AStar._rows[id];
				nowCol = AStar._cols[id];
			}
			AStar.destroyLists();
			return arr;
		}

		private static isOpen(row: number, col: number): boolean {
			row = row;
			col = col;
			if (AStar._mapStatusArray[row] == null)
				return false;
			if (AStar._mapStatusArray[row][col] == null)
				return false;
			return AStar._mapStatusArray[row][col][AStar._NOTE_OPEN];
		}

		private static isClosed(row: number, col: number): boolean {
			row = row;
			col = col;
			if (AStar._mapStatusArray[row] == null)
				return false;
			if (AStar._mapStatusArray[row][col] == null)
				return false;
			return AStar._mapStatusArray[row][col][AStar._NOTE_CLOSED];
		}

		private static canWalk(row: number, col: number): boolean {
			row = row;
			col = col;
			if (row >= AStar._rowCount || row < 0 || col >= AStar._colCount || col < 0)
				return false;
			if (AStar._mapArray[row][col] == 1)
				return false;
			else if (AStar._mapArray[AStar._endRow][AStar._endCol] == 3 || AStar._mapArray[AStar._startRow][AStar._startCol] == 3)
				return true;
			else if (AStar._mapArray[row][col] == 3)
				return false;
			else
				return true;
		}

		private static getFScore(index: number): number {
			index = index;
			return AStar._fScoreArray[AStar._openArray[index - 1]];
		}

		private static getIndex(p_id: number): number {
			p_id = p_id;
			var i: number = 1;
			for (var id_key_a in AStar._openArray) {
				var id: number = AStar._openArray[id_key_a];
				if (id == p_id) {
					return i;
				}
				i++;
			}
			return -1;
		}

		private static getRow(mouseY: number): number {
			return Math.floor(mouseY / AStar._GridHeigh);
		}

		private static getCol(mouseX: number): number {
			return Math.floor(mouseX / AStar._GridWidth);
		}

		private static myAbs(value: number): number {
			value = value;
			return value < 0 ? -value : value;
		}

		private static initLists() {
			AStar._openArray = [];
			AStar._rows = [];
			AStar._cols = [];
			AStar._fScoreArray = [];
			AStar._gScoreArray = [];
			AStar._fatherArray = [];
			AStar._mapStatusArray = [];
		}

		private static destroyLists() {
			AStar._openArray = null;
			AStar._rows = null;
			AStar._cols = null;
			AStar._fScoreArray = null;
			AStar._gScoreArray = null;
			AStar._fatherArray = null;
			AStar._mapStatusArray = null;
		}

		public static canStrightWark(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
			startRow = startRow;
			startCol = startCol;
			endRow = endRow;
			endCol = endCol;
			if (startRow == endRow && startCol == endCol)
				return false;
			var point1: egret.Point = new egret.Point(startCol + 0.5, startRow + 0.5);
			var point2: egret.Point = new egret.Point(endCol + 0.5, endRow + 0.5);
			var distX: number = Math.abs(startCol - endCol);
			var distY: number = Math.abs(startRow - endRow);
			var loopDirection: boolean = distX > distY ? true : false;
			var lineFuction: Function;
			var i: number = 0;
			var loopStart: number = 0;
			var loopEnd: number = 0;
			var passedNodeList: Array<any>;
			var passedNode: egret.Point;
			if (loopDirection) {
				lineFuction = MathUtil.getLineFunc(point1, point2, 0);
				loopStart = Math.min(startCol, endCol);
				loopEnd = Math.max(startCol, endCol);
				for (i = loopStart; i <= loopEnd; i++) {
					if (i == loopStart)
						i += .5;
					var yPos: number = <any>lineFuction(i);
					passedNodeList = AStar.getNodesUnderPoint(i, yPos);
					var passedNode_key_a;
					for (passedNode_key_a in passedNodeList) {
						passedNode = passedNodeList[passedNode_key_a];
						if (AStar._mapArray[passedNode.y][passedNode.x] == 1)
							return false;
					}
					if (i == loopStart + .5)
						i -= .5;
				}
			}
			else {
				lineFuction = MathUtil.getLineFunc(point1, point2, 1);
				loopStart = Math.min(startRow, endRow);
				loopEnd = Math.max(startRow, endRow);
				for (i = loopStart; i <= loopEnd; i++) {
					if (i == loopStart)
						i += .5;
					var xPos: number = <any>lineFuction(i);
					passedNodeList = AStar.getNodesUnderPoint(xPos, i);
					var passedNode_key_a;
					for (passedNode_key_a in passedNodeList) {
						passedNode = passedNodeList[passedNode_key_a];
						if (AStar._mapArray[passedNode.y][passedNode.x] == 1)
							return false;
					}
					if (i == loopStart + .5)
						i -= .5;
				}
			}
			return true;
		}

		public static getNodesUnderPoint(xPos: number, yPos: number, exception: Array<any> = null): Array<any> {
			var result: Array<any> = [];
			var xIsInt: boolean = xPos % 1 == 0;
			var yIsInt: boolean = yPos % 1 == 0;
			if (xIsInt && yIsInt) {
				result[0] = new egret.Point(xPos - 1, yPos - 1);
				result[1] = new egret.Point(xPos, yPos - 1);
				result[2] = new egret.Point(xPos - 1, yPos);
				result[3] = new egret.Point(xPos, yPos);
			}
			else if (xIsInt && <any>!yIsInt) {
				result[0] = new egret.Point(xPos - 1, Math.floor(yPos));
				result[1] = new egret.Point(xPos, Math.floor(yPos));
			}
			else if (<any>!xIsInt && yIsInt) {
				result[0] = new egret.Point(Math.floor(xPos), yPos - 1);
				result[1] = new egret.Point(Math.floor(xPos), yPos);
			}
			else {
				result[0] = new egret.Point(Math.floor(xPos), Math.floor(yPos));
			}
			if (exception && exception.length > 0) {
				for (var i: number = 0; i < result.length; i++) {
					if (exception.indexOf(result[i]) != -1) {
						result.splice(i, 1);
						i--;
					}
				}
			}
			return result;
		}

	}
}


class BaseChildView extends eui.Component {
	private __isCreatComplete: Boolean = false;
	private __isReadyOpenWin: Boolean = false;
	public openData: any;
	public constructor(_skinName: string) {
		super();
		if (_skinName && _skinName != "") {
			this.skinName = _skinName;
		}
		this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this._onCreatComplete, this)
	}

	protected _onCreatComplete() {
		this.__isCreatComplete = true;
		if (this.__isReadyOpenWin) {
			this.open(this.openData);
		}
	}

	protected childrenCreated() {
		super.childrenCreated();
		//this.isCreated = true;
	}

	/**
	 * 外面调用
	 */
	public readyOpen(openParam: any = null) {
		this.openData = openParam;
		this.__isReadyOpenWin = true;
		if (this.__isCreatComplete) {
			this.open(openParam);
		}
	}

	/**
	 * 打开窗口
	 */
	public open(openParam: any = null): void {
		this.visible = true;
	}

	/**
	 * 清理
	 */
	public clear(data: any = null): void {
		this.openData = null;
		this.visible = false;
	}
	/**
	 * 销毁
	 */
	public destroy(): void {
		this.__isCreatComplete = false;
		this.__isReadyOpenWin = false;
	}
}
/**
 * Created by yangsong on 14/12/18.
 * 基类
 */
class BaseClass {
	public constructor() {

	}

    /**
     * 获取一个单例
     * @returns {any}
     */
	public static getInstance(...args: any[]): any {
		var Class: any = this;
		if (!Class._instance) {
			var argsLen: number = args.length;
			if (argsLen == 0) {
				Class._instance = new Class();
			} else if (argsLen == 1) {
				Class._instance = new Class(args[0]);
			} else if (argsLen == 2) {
				Class._instance = new Class(args[0], args[1]);
			} else if (argsLen == 3) {
				Class._instance = new Class(args[0], args[1], args[2]);
			} else if (argsLen == 4) {
				Class._instance = new Class(args[0], args[1], args[2], args[3]);
			} else if (argsLen == 5) {
				Class._instance = new Class(args[0], args[1], args[2], args[3], args[4]);
			}
		}
		return Class._instance;
	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 配置基类 2017/09/20.
 */
class BaseConfManager {
	private _confDic: Object = {};

	public constructor() {
		this._confDic = {}
	}

	/**
	 * 获取配置文件
	 * @param name 配置文件名称
	 * @return any 返回配置
	 */
	public getConfig(name: string): any {
		if (this._confDic[name] == null) {
			var data = RES.getRes(name);
			if (data._type && data._type > 0) {
				var curT: number = Date.now();
				if (data._type == 1) {
					var arrfiled: Array<any> = data._fields;
					var dataList: Array<any>;
					var object: any = data._datas;
					var ndata: any;
					for (let key in object) {
						dataList = object[key];
						ndata = {};
						for (var j: number = 0; j < arrfiled.length; j++) {
							ndata[arrfiled[j]] = dataList[j];
						}
						object[key] = ndata;
					}
					data._type = 0;
					data._datas = object;
				} else if (data._type == 2) {
					var arrfiled: Array<any> = data._fields;
					var arr: Array<any> = data._datas;
					var dataList: Array<any>;
					var ndata: any;
					for (var i: number = 0; i < arr.length; i++) {
						dataList = arr[i];
						ndata = {};
						for (var j: number = 0; j < arrfiled.length; j++) {
							ndata[arrfiled[j]] = dataList[j];
						}
						arr[i] = ndata;
					}
					data._type = 0;
					data._datas = arr;
				}
				this._confDic[name] = data._datas;
			} else {
				this._confDic[name] = data;
			}
		}
		return this._confDic[name];
	}

	/**
	 * 设置配置文件
	 * @param name 配置文件名称
	 * @param data 返回配置
	 */
	public setConfig(name: string, data: any) {
		this._confDic[name] = data;
	}

	/**
	 * 是否存在配置文件
	 * @param name 配置文件名称
	 * @return boolean 返回Boolen
	 */
	public hasConfig(name: string): boolean {
		return this._confDic[name];
	}


	/**
	 * 清理配置
	 * @param key 配置文件名称，为""清理所有
	 */
	public clear(key: string = "") {
		if (key != "") {
			this._confDic[key] = null;
			delete this._confDic[key];
		} else {
			this._confDic = {};
		}
	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 控制器基类 2017/09/20.
 */
class BaseController extends BaseClass {
	private _protocalManager: ProtocalManager;
	private _EventSystem: EventSystem;

	public constructor() {
		super();
		this._protocalManager = ProtocalManager.getInstance();
		this._EventSystem = EventSystem.getInstance();
		// this.initProtocol();  //不能放这里，this指向有问题
		// this.initEventListener();
	}
	/**
	 * 初始化协议
	 */
	protected initProtocol() {

	}

	/**
	 * 初始化事件监听
	 */
	protected initEventListener() {

	}

	/**
	 * 销毁
	 */
	public destroy() {

	}

	/**
	 * 清理
	 */
	public clear() {

	}

	/**
	 * 注册协议
	 * @param pId 协议ID
	 * @param backFun 回掉函数
	 */
	public registerProtocal(pId: number, callFun: (data: any) => void, thisObject: any) {
		this._protocalManager.registerProtocal(pId, callFun, thisObject);
	}

	/**
	 * 清除协议注册
	 * @param pId 协议ID
	 * @param backFun 回掉函数
	 */
	public unRegisterProtocal(pId: number) {
		this._protocalManager.unRegisterProtocal(pId);
	}

	/**
	 * 发送协议
	 * @param pId 协议ID
	 * @param data 数据
	 */
	public sendProtocal(pId: number, data: any) {
		this._protocalManager.sendProtocal(pId, data)
	}

	/**
     * 事件监听
     * @param eventName 事件名称
     * @param callFun 回掉函数
     * @param thisObject 执行函数对象
	 * @return number 事件ID
     */
	public addEventListener(eventName: string, callFun: (event: any) => any, thisObject: any): number {
		return this._EventSystem.addEventListener(eventName, callFun, thisObject);
	}

	/**
     * 事件派发
     * @param eventName 事件名称
     * @param data 回掉函数数据
     * @param delay 延迟时间
     */
	public dispatchEvent(eventName: string, data: any = null, delay: number = 0) {
		this._EventSystem.dispatchEvent(eventName, data, delay);
	}

	/**
     * 移除事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有移除所有改事件名事件
     */
	public removeEventListener(eventName: string, eventId: number = 0) {
		this._EventSystem.removeEventListener(eventName, eventId);
	}

	/**
     * 是否存在事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有返回是否有该事件名事件
     */
	public hasEventListener(eventName: string, eventId: number = 0): boolean {
		return this._EventSystem.hasEventListener(eventName, eventId);
	}

}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * model基类 2017/09/20.
 */
class BaseModel extends BaseClass {

	public constructor() {
		super();
	}

	public clear() {

	}

	public destroy() {

	}
}
/**
 * Created by yangsong on 2014/11/25.
 * 服务端消息解析
 */
interface BaseMsg {
    /**
     * 接收消息处理
     * @param msg
     */
	receive(socket: egret.WebSocket): void;

    /**
     * 发送消息处理
     * @param msg
     */
	send(socket: egret.WebSocket, msg: any): void;

    /**
     * 消息解析,返回格式{key:XX, body:XX}
     * @param msg
     */
	decode(msg: any): any;

    /**
     * 消息封装
     * @param msg
     */
	encode(msg: any): any;
}

/**
 * Created by yangsong on 15-1-14.
 * Sound基类
 */
class BaseSound {
	public _cache: any;
	public _loadingCache: Array<string>;

    /**
     * 构造函数
     */
	public constructor() {
		this._cache = {};
		this._loadingCache = new Array<string>();
	}

    /**
     * 处理音乐文件的清理
     */
	private dealSoundTimer(): void {
		var currTime: number = egret.getTimer();
		var keys = Object.keys(this._cache);
		for (var i: number = 0, len = keys.length; i < len; i++) {
			var key = keys[i];
			if (!this.checkCanClear(key))
				continue;
			if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
				//console.log(key + "已clear")
				delete this._cache[key];
				RES.destroyRes(key);
			}
		}
	}

    /**
     * 获取Sound
     * @param key
     * @returns {egret.Sound}
     */
	public getSound(key: string): egret.Sound {
		var sound: egret.Sound = RES.getRes(key);
		if (sound) {
			if (this._cache[key]) {
				this._cache[key] = egret.getTimer();
			}
		} else {
			if (this._loadingCache.indexOf(key) != -1) {
				return null;
			}

			this._loadingCache.push(key);
			RES.getResAsync(key, this.onResourceLoadComplete, this);
		}
		return sound;
	}

    /**
     * 资源加载完成
     * @param event
     */
	private onResourceLoadComplete(data: any, key: string): void {
		var index: number = this._loadingCache.indexOf(key);
		if (index != -1) {
			this._loadingCache.splice(index, 1);
			this._cache[key] = egret.getTimer();
			this.loadedPlay(key);
		}
	}

    /**
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
	public loadedPlay(key: string): void {

	}

    /**
     * 检测一个文件是否要清除，子类重写
     * @param key
     * @returns {boolean}
     */
	public checkCanClear(key: string): boolean {
		return true;
	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 窗口基类 2017/09/20.
 */
class BaseView extends eui.Component {
	private __viewIsOpen: Boolean = false;
	public winVo: WinManagerVO;//窗口VO
	private __resGroupName: string;
	public openData: any;
	protected isCreated: Boolean = false;

	private __isCreatComplete: Boolean = false;
	private __isReadyOpenWin: Boolean = false;

	private __winCloseBtn: eui.Button;
	private __isShowCloseBtn: boolean = false;

	protected __blackBg: egret.Sprite;//黑色背景
	//private resDoneCB:Function;
	public constructor(viewConf: WinManagerVO = null) {
		super();
		this.winVo = viewConf;
		if (this.winVo && this.winVo.skinName != "" && this.winVo.skinName != null) {
			this.skinName = this.winVo.skinName;
			//this.x = (App.stageWidth - this.width)/2;
			//this.y = (App.stageHeight - this.height)/2;
		}
		if (this.winVo && this.winVo.param) {
			if (this.winVo.param.y) {
				this.y = this.winVo.param.y;
			}
			if (this.winVo.param.x) {
				this.x = this.winVo.param.x;
			}
		}
		this.once(egret.Event.REMOVED_FROM_STAGE, () => {
			this.clear();
			this.destroy();
		}, this);
		this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this._onCreatComplete, this)
	}

	protected _onCreatComplete() {
		this.__isCreatComplete = true;
		if (this.__isReadyOpenWin) {
			this.openWin(this.openData);
		}
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.isCreated = true;
		if (this.winVo) {
			this.showWinCloseBtn(this.winVo.useCloseBtn);
		}
		//this.showWinCloseBtn(this.__isShowCloseBtn);
	}

	public preloadRes(groupNames: Array<string>, openParam: any = null): void {
		var groupName = groupNames[0];
		this.openData = openParam;
		if (!RES.isGroupLoaded(groupName)) {
			this.__resGroupName = groupName;
			RES.loadGroup(groupName);
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			//this.facade.sendNotification(PanelNotify.SHOW_LOADING, groupName);
		} else {
			this.visible = true;
			this.readyOpenWin(openParam);
		}
	}

	private onResourceLoadComplete(event: RES.ResourceEvent): void {
		if (event.groupName == this.__resGroupName) {
			RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			// if (this.resDoneCB) {
			//     this.resDoneCB.call(this);
			//     this.resDoneCB = null;
			// }
			this.__resGroupName = null;
			this.visible = true;
			this.readyOpenWin(this.openData);
		}
	}

	/**
	 * 窗口准备打开
	 */
	public readyOpenWin(openParam: any = null): void {
		this.openData = openParam;
		this.__isReadyOpenWin = true;
		if (this.__isCreatComplete) {
			this.openWin(openParam);
		}
	}
	/**
	 * 打开窗口
	 */
	public openWin(openParam: any = null): void {
		if (this.__viewIsOpen == false) {
			this.__viewIsOpen = true;
			//this.openWinAnimation();
			//将动画放到当前帧最后面执行 确保不影响子类的openWin
			//zrj  18.01.08
			egret.callLater(() => {
				this.openWinAnimation();
			}, this);
		}
	}

	/**
	 * 关闭窗口
	 */
	public closeWin(callback = null): void {
		this.closeWinAnimation(callback);
		// if (this.winVo) {
		// 	(WinManager.getInstance() as WinManager).closeWin(this.winVo.winName);
		// }
	}

	/**
	 * 显示关闭按钮
	 */
	protected showWinCloseBtn(b: boolean) {
		this.__isShowCloseBtn = b;
		if (this.__winCloseBtn == undefined && this.__isShowCloseBtn) {
			this.__winCloseBtn = new eui.Button();
			this.__winCloseBtn.skinName = "skins.ComBtnClose1Skin";
			this.addChildAt(this.__winCloseBtn, 10000);
			this.__winCloseBtn.x = App.stageWidth - 56;
			this.__winCloseBtn.y = 46;
			this.__winCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: Event) => {
				if (this.winVo) {
					App.WinManager.closeWin(this.winVo.winName);
				}
			}, this);
		} else {
			if (this.__winCloseBtn) {
				this.__winCloseBtn.visible = false;
			}
		}
	}
	public getCloseBtn(): eui.Button {
		return this.__winCloseBtn;
	}


	/**
	 * 添加黑低背景
	 */
	protected showBlackBg(isClickClose: Boolean = true): void {
		if (this.__blackBg == null) {
			this.__blackBg = new egret.Sprite();
			this.__blackBg.graphics.clear();
			this.__blackBg.graphics.beginFill(0x000000, 0.8);
			this.__blackBg.graphics.drawRect(0, 0, App.stageWidth*2, App.stageHeight*2);
			this.__blackBg.graphics.endFill();
			this.__blackBg.width = App.stageWidth*2;
			this.__blackBg.height = App.stageHeight*2;
			this.__blackBg.x = (this.width - this.__blackBg.width) / 2;
			this.__blackBg.y = (this.height - this.__blackBg.height) / 2;
			if (!this.contains(this.__blackBg)) {
				this.addChild(this.__blackBg);
				this.setChildIndex(this.__blackBg, 0);
			}
		}
		if (isClickClose) {
			this.__blackBg.touchEnabled = true;
			if (this.__blackBg.hasEventListener(egret.TouchEvent.TOUCH_TAP) == false) {
				this.__blackBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
					this.closeWin();
				}, this);
			}
		} else {
			this.__blackBg.touchEnabled = false;
			// if(this.__blackBg.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
			// 	this.__blackBg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
			// }
		}
		this.__blackBg.visible = true;
	}

	/**
	 * 打开动画
	*/
	private openWinAnimation() {
		if (this.winVo && this.winVo.openModel != 0) {

			this.scaleX = 1;
			this.scaleY = 1;
			this.x = (App.stageWidth - this.width) / 2;
			this.y = (App.stageHeight - this.height) / 2;
			this.alpha = 1;

			this.showBlackBg(true);
			if (this.__blackBg) {
				egret.Tween.get(this.__blackBg).to({ alpha: 1 }, 50);
			}
			UIActionManager.playUIAction(this, this.winVo.openModel);
		}
	}

	/**
	 * 关闭动画
	*/
	private closeWinAnimation(callback) {
		if (this.winVo && this.winVo.closeModel != 0) {
			UIActionManager.playUIAction(this, this.winVo.closeModel, function () {
				if (callback) {
					callback();
				} else {
					(WinManager.getInstance() as WinManager).closeWin(this.winVo.winName);
				}
			}, this, true);
		} else {
			if (callback) {
				callback();
			} else {
				(WinManager.getInstance() as WinManager).closeWin(this.winVo.winName);
			}
		}
	}

	/**
	 * 清理
	 */
	public clear(data: any = null): void {
		this.__resGroupName = null;
		this.openData = null;
		this.__viewIsOpen = false;
	}
	/**
	 * 销毁
	 */
	public destroy(): void {
		this.__isCreatComplete = false;
		this.__isReadyOpenWin = false;
	}

}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 批量资源加载器 2017/09/20.
 */
class BatchResLoad {
	private _resList: Array<Array<string>>;
	private _completeFun: Function;
	private _thisObject: any;
	private _progressFun: Function;

	private _len: number = 0;
	private _curIndex: number = 0;
	private _backObj: egret.HashObject;
	public constructor() {

	}
	/**
	 * 批量加载资源加载
	 * @param arr Array<Array<string>> url列表
	 * @param completeBackFun  Function 完成回掉函数 com(obj:any)
	 * @param thisObject any 回掉函数对象
	 * @param progressBackFun Function 进度回掉函数 如pro(_curlen,_len)) 
	 */
	public loadUrl(arr: Array<Array<string>>, completeBackFun: Function, thisObject: any, progressBackFun: Function = null) {
		this._resList = arr;
		if (arr.length <= 0) {
			if (thisObject && completeBackFun) {
				completeBackFun.call(thisObject, arr);
			}
		}
		this._completeFun = completeBackFun;
		this._progressFun = progressBackFun;
		this._thisObject = thisObject;
		this._backObj = new egret.HashObject();
		this._len = arr.length;
		this._curIndex = 0;
		for (let k: number = 0; k < arr.length; k++) {
			//RES.getResByUrl("resource/splash.jpg",this.logoLoadComplete,this)
			RES.getResByUrl(arr[k][0], this.oneComplete, this, arr[k][1]);
			this._backObj[arr[k][0]] = 0;
		}

	}
	public oneComplete(data: any, url: string) {
		if (this._backObj[url] == 0) {
			this._curIndex = this._curIndex + 1;
			if (data) {
				this._backObj[url] = data;
			} else {
				this._backObj[url] = null;
			}
			if (this._thisObject && this._progressFun) {
				this._progressFun.call(this._thisObject, this._curIndex, this._len);
			}
			if (this._curIndex == this._len) {
				if (this._thisObject && this._completeFun) {
					this._completeFun.call(this._thisObject, this._backObj);
				}
				this._completeFun = null;
				this._progressFun = null;
				this._thisObject = null;
			}
		}
	}

	public destory() {
		this._completeFun = null;
		this._progressFun = null;
		this._thisObject = null;
	}
}
/**
 * Created by yangsong on 15-2-11.
 */
class ByteArrayMsg implements BaseMsg {
	private _msgBuffer: egret.ByteArray;

    /**
     * 构造函数
     */
	public constructor() {
		this._msgBuffer = new egret.ByteArray();
	}

    /**
     * 接收消息处理
     * @param msg
     */
	public receive(socket: egret.WebSocket): void {
		socket.readBytes(this._msgBuffer);

		var obj: any = this.decode(this._msgBuffer);
		if (obj) {
			//(EventSystem.getInstance() as EventSystem).dispatchEvent(obj.key, obj.body);
		}

		//TODO double bytearray clear
		if (this._msgBuffer.bytesAvailable == 0) {
			this._msgBuffer.clear();
		}
	}

    /**
     * 发送消息处理
     * @param msg
     */
	public send(socket: egret.WebSocket, msg: any): void {
		var obj: any = this.encode(msg);
		if (obj) {
			obj.position = 0;
			socket.writeBytes(obj, 0, obj.bytesAvailable);
		}
	}

    /**
     * 消息解析
     * @param msg
     */
	public decode(msg: any): any {
		console.log("decode需要子类重写，根据项目的协议结构解析");
		return null;
	}

    /**
     * 消息封装
     * @param msg
     */
	public encode(msg: any): any {
		console.log("encode需要子类重写，根据项目的协议结构解析");
		return null;
	}
}

class ByteArrayMsgByProtobuf extends ByteArrayMsg {
	private protoClsFile = null;//协议解析器
	private msgClass: any = {};//协议类
	private protoConfig: any = null;//协议和Key配置
	private protoManager: ProtocalManager;

    /**
     * 构造函数
     */
	public constructor() {
		super();
		this.msgClass = {};
		this.protoManager = ProtocalManager.getInstance();
		this.protoClsFile = dcodeIO.ProtoBuf.loadProto(RES.getRes("game_proto"));//加载协议配置
		this.protoConfig = RES.getRes("t_proto_json");
		// var keys = Object.keys(this.protoConfig);
		// for (var i:number = 0, len = keys.length; i < len; i++) {
		//     var key = keys[i];
		//     var value = this.protoConfig[key];
		//     //this.protoConfigSymmetry[value] = key;
		// }
	}

    /**
     * 获取msgID对应的类
     * @param key
     * @returns {any}
     */
	private getMsgClass(key: string): any {
		var cls: any = this.msgClass[key];
		if (cls == null) {
			cls = this.protoClsFile.build(key);
			this.msgClass[key] = cls;
		}
		return cls;
	}

    /**
     * 消息解析 解析包
     * @param msg
     */
	public decode(msg: egret.ByteArray): any {
		var len = msg.length;
		msg.position = 0;
		var size = msg.readShort();
		if (msg.bytesAvailable >= size - 2) {
			var protoId = msg.readUnsignedShort();
			var bytes: egret.ByteArray = new egret.ByteArray();
			msg.readBytes(bytes, 0, size - 4);
			var decoder = this.getMsgClass(this.getS2CByProtoId(protoId));
			if (decoder && decoder.decode) {
				var magBody = decoder.decode(bytes.buffer);
				this.protoManager.runProtocal(protoId, magBody);
				return magBody;
			} else {
				this.protoManager.runProtocal(protoId, null);
			}
		}

		// let objBytes:egret.ByteArray = new egret.ByteArray();objBytes.readBytes
		// msg.readBytes(objBytes);
		// let decoder = this.getMsgClass(this.getS2CByProtoId(protoId));
		// let backMsgObj = decoder.decode(objBytes.buffer);

		// (ProtocalManager.getInstance() as ProtocalManager).runProtocal(protoId,backMsgObj);
		// return backMsgObj;

		// var msgID = msg.readShort();
		// var len = msg.readShort();
		// if (msg.bytesAvailable >= len) {
		//     var bytes:egret.ByteArray = new egret.ByteArray();
		//     msg.readBytes(bytes, 0, len);

		//     var obj:any = {};
		//     obj.key = this.getMsgKey(msgID);
		//     App.DebugUtils.start("Protobuf Decode");
		//     obj.body = this.getMsgClass(obj.key).decode(bytes.buffer);
		//     App.DebugUtils.stop("Protobuf Decode");
		//     Log.trace("收到数据：", "[" + msgID + " " + obj.key + "]", obj.body);
		//     return obj;
		// }
		// return null;
	}

    /**
     * 消息封装
     * @param msg
     */
	public encode(msg: any): any {
		var pId = msg.id;
		// let packByteArr: egret.ByteArray = new egret.ByteArray();
		//  //let sendData ={acc_id:12,acc_name:"ZHANG",timestamp:123456,server_id:123,login_ticket:"shun",suid:"shunqiu"};//数据对象
		//  console.log(this.getC2SByProtoId(10000));
		var clazz = this.getMsgClass(this.getC2SByProtoId(pId));
		if (clazz) {
			var msgBody = new clazz(msg.body)
			var bodyBytes: egret.ByteArray = new egret.ByteArray(msgBody.toArrayBuffer());
			var sendMsg: egret.ByteArray = new egret.ByteArray();
			var size = bodyBytes.length;
			sendMsg.writeShort(size)
			sendMsg.writeUnsignedShort(pId)
			sendMsg.writeBytes(bodyBytes);
		} else {
			//协议为空只发协议号
			var sendMsg: egret.ByteArray = new egret.ByteArray();
			var size = 0;
			sendMsg.writeShort(size)
			sendMsg.writeUnsignedShort(pId)
		}
		return sendMsg;


		// var sendCls = this.getMsgClass(this.getC2SByProtoId(pId));
		// var sendMsgObj = new sendCls(msg.body);//生成解析类
		// var sendBytes: egret.ByteArray = new egret.ByteArray(sendMsgObj.toArrayBuffer());

		// var sendMsg: egret.ByteArray = new egret.ByteArray();
		// var size = sendBytes.length;
		// sendMsg.writeShort(size)
		// sendMsg.writeShort(pId)
		// sendMsg.writeBytes(sendBytes);
		// // sendMsg.position = 0;
		// // this.webSocket.writeBytes(sendMsg,0,sendMsg.bytesAvailable);
		// return sendMsg;


		// var msgID = this.getMsgID(msg.key);
		// var msgBody = new (this.getMsgClass(msg.key))(msg.body);

		// App.DebugUtils.start("Protobuf Encode");
		// var bodyBytes:egret.ByteArray = new egret.ByteArray(msgBody.toArrayBuffer());
		// App.DebugUtils.stop("Protobuf Encode");
		// Log.trace("发送数据：", "[" + msgID + " " + msg.key + "]", msg.body);

		// var sendMsg:egret.ByteArray = new egret.ByteArray();
		// sendMsg.writeShort(msgID);
		// sendMsg.writeBytes(bodyBytes);
		// return sendMsg;
	}

    /**
	 * 获取发送协议结构体
	 * @param id 协议号
	 */
	public getC2SByProtoId(id: number): any {
		if (this.protoConfig[id]) {
			return this.protoConfig[id].c2s;
		}
		return null;
	}
	/**
	 * 获取接收协议结构体
	 * @param id 协议号
	 */
	public getS2CByProtoId(id: number): any {
		if (this.protoConfig[id]) {
			return this.protoConfig[id].s2c;
		}
		return null;
	}
}
/**
 * Created by yangsong on 2014/11/22.
 * Http数据缓存类
 */
class DynamicChange {
	private _dataCache: any;

	private _pUpdate: ProxyUpdate;

	public constructor() {
		this._dataCache = [];
		this._pUpdate = new ProxyUpdate(this._dataCache);
	}

	public get pUpdate(): ProxyUpdate {
		return this._pUpdate;
	}

	public getCacheData(key: string): any {
		if (this._dataCache[key]) {
			return this._dataCache[key];
		}
		return null;
	}

	public clearCache(): void {
		var keys = Object.keys(this._dataCache);
		for (var i: number = 0, len = keys.length; i < len; i++) {
			var key = keys[i];
			this._dataCache[key] = null;
			delete this._dataCache[key];
		}
	}

	public getCacheKeyInfos(): Array<any> {
		var results: Array<any> = [];
		var keys = Object.keys(this._dataCache);
		for (var i: number = 0, len = keys.length; i < len; i++) {
			var key = keys[i];
			var k: any = this._dataCache[key];
			results.push(k);
		}
		return results;
	}

	public isCache(key: string): boolean {
		return this._dataCache[key];
	}
}

/**
 * Created by yangsong on 2014/11/22.
 * Http数据更新类
 */
class ProxyUpdate {
	private _cache: any;

	public constructor(cache: any) {
		this._cache = cache;
	}

	public isArray(key: any): boolean {
		return key instanceof Array;
	}

	public isObject(key: string): boolean {
		return key.indexOf("object") > -1;
	}

	public isNormal(key: string): boolean {
		var isAt: boolean = key.indexOf("@") > -1;
		var isDot: boolean = key.indexOf(".") > -1;
		var isUnderline: boolean = key.indexOf("_") > -1;

		return (!isAt && !isDot && !isUnderline);
	}

	public isAddToArray(key: string): boolean {
		return (key == "@a");
	}

	public isRemoveToArray(key: string): boolean {
		var arr: Array<any> = key.split("_");
		return (arr.length <= 3 && arr[0] == "@d");
	}

	public isFilter(key: string): boolean {
		var arr: Array<any> = key.split("_");
		return (arr[0] == "@f");
	}

	public isNumeric(v: string): boolean {
		return parseFloat(v).toString() == v.toString();
	}

	private _updateObject(name: string, value: any, cacheData: any): void {
		var arr: Array<any> = name.split(".");
		if (arr[0] == "@a" || arr[0] == "@s") {
			cacheData[arr[1]] = value;
		}
		else if (arr[0] == "@d") {
			delete cacheData[arr[1]];
		}
	}

	private _getFilterObject(filter: string, cacheData: any): any {
		if (cacheData) {
			var arr: Array<any> = filter.split("_");
			if (arr.length == 3 && arr[0] == "@f" && this.isArray(cacheData)) {
				var key: any = arr[1];
				var value: any = arr[2];

				for (var i: number = 0; i < cacheData.length; i++) {
					var v: any = cacheData[i];
					if (arr.length == 3 && this.isObject(v.toString())) {
						var cacheValue: any = v[key];
						if (cacheValue) {
							if (value[0] == "@") {
								value = value.replace("@", "");
							}
							if (value == cacheValue) {
								return v;
							}
						}
					}
				}

			}
		}
		return null;

	}

	private _addObjectToArray(cacheData: any, changeValue: any): void {
		if (this.isArray(changeValue)) {
			for (var i: number = 0; i < changeValue.length; i++) {
				cacheData.push(changeValue[i]);
			}
		}
		else {
			cacheData.push(changeValue);
		}
	}

	private _removeObjectFromArray(cacheData: any, key: string, changeValue: any): void {
		var arr: Array<any> = key.split("_");
		if (arr.length <= 3 && arr[0] == "@d") {
			if (this.isArray(cacheData)) {
				var count: number = cacheData.length;
				for (var i: number = count - 1; i >= 0; i--) {
					var cacheDataItem: any = cacheData[i];
					if (arr.length == 3) {
						if (cacheDataItem.hasOwnProperty(arr[1])) {
							var val: any = arr[2];
							if (val[0] == "@") {
								val = val.replace("@", "");
							}
							if (val == cacheDataItem[arr[1]]) {
								cacheData.splice(i, 1);
							}
						}
					}
					else if (arr.length == 2 && cacheDataItem.hasOwnProperty(arr[1])) {
						if (changeValue == cacheDataItem[arr[1]]) {
							cacheData.splice(i, 1);
						}
					}
					else if (arr.length == 1) {
						if (changeValue == cacheDataItem) {
							cacheData.splice(i, 1);
						}
					}
				}
			}
		}
	}

	public update(key: string, data: any): void {
		this._cache[key] = data;

		if (data.hasOwnProperty("c")) {
			var cdata: any = data["c"];
			var keys = Object.keys(cdata);
			for (var i: number = 0, len = keys.length; i < len; i++) {
				var k1 = keys[i];
				if (this._cache[k1]) {
					this._update(this._cache[k1], cdata[k1]);
					(EventSystem.getInstance() as EventSystem).dispatchEvent(k1 + "_HttpUpdate");
				}
			}
		}
	}

	private _update(cacheData: any, changeData: any): void {
		if (cacheData && changeData && this.isObject(changeData.toString())) {
			var keys = Object.keys(changeData);
			for (var i: number = 0, len = keys.length; i < len; i++) {
				var k = keys[i];
				var v: any = changeData[k];
				if (this.isNormal(k) && this.isObject(v.toString())) {
					if (cacheData.hasOwnProperty(k)) {
						this._update(cacheData[k], v);
					}
				}
				else if (this.isNormal(k) && this.isNumeric(v)) {
					var cv: any = cacheData[k];
					cacheData[k] = cv + v;
				}
				else if (this.isNormal(k)) {
					cacheData[k] = v;
				}
				else if (this.isAddToArray(k)) {
					this._addObjectToArray(cacheData, v);
				}
				else if (this.isRemoveToArray(k)) {
					this._removeObjectFromArray(cacheData, k, v);
				}
				else if (this.isFilter(k)) {
					var subCacheData: any = this._getFilterObject(k, cacheData);
					if (subCacheData) {
						this._update(subCacheData, v);
					}
				}
				else {
					this._updateObject(k, v, cacheData);
				}
			}
		}
	}

}

/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * A*寻路 2017/09/20.
 */
module aStar {
	export class Diagonal extends egret.HashObject {

		public constructor() {
			super();
		}

		public static each(start_point: egret.Point, end_point: egret.Point): Array<any> {
			var w: number = 0;
			var h: number = 0;
			var __ox: number = 0;
			var __oy: number = 0;
			var __value: Array<any> = [];
			var __r: number = 0;
			var __n1: number = 0;
			var __n2: number = 0;
			var __b1: boolean;
			var __b2: boolean;
			var __m: number = 0;
			var __n: number = 0;
			var __d: boolean = (start_point.x < end_point.x) == (start_point.y < end_point.y);
			if (start_point.x < end_point.x) {
				__ox = start_point.x;
				__oy = start_point.y;
				w = end_point.x - __ox;
				h = Math.abs(end_point.y - __oy);
			}
			else {
				__ox = end_point.x;
				__oy = end_point.y;
				w = start_point.x - __ox;
				h = Math.abs(start_point.y - __oy);
			}
			if (w == h) {
				for (__m = 0; __m <= w; __m++) {
					__d ? __value.push(new egret.Point(__ox + __m, __oy + __m)) : __value.push(new egret.Point(__ox + __m, __oy - __m));
					if (__m > 0) {
						__d ? __value.push(new egret.Point(__ox + __m - 1, __oy + __m)) : __value.push(new egret.Point(__ox + __m - 1, __oy - __m));
					}
					if (__m < w) {
						__d ? __value.push(new egret.Point(__ox + __m + 1, __oy + __m)) : __value.push(new egret.Point(__ox + __m + 1, __oy - __m));
					}
				}
			}
			else if (w > h) {
				__r = h / w;
				__value.push(new egret.Point(__ox, __oy));
				for (__m = 1; __m <= w; __m++) {
					__n1 = (__m - .5) * __r;
					__n2 = (__m + .5) * __r;
					__b1 = __n1 > __n - .5 && __n1 < __n + .5;
					__b2 = __n2 > __n - .5 && __n2 < __n + .5;
					if (__b1 || __b2) {
						__d ? __value.push(new egret.Point(__ox + __m, __oy + __n)) : __value.push(new egret.Point(__ox + __m, __oy - __n));
						if (<any>!__b2) {
							__n++;
							__d ? __value.push(new egret.Point(__ox + __m, __oy + __n)) : __value.push(new egret.Point(__ox + __m, __oy - __n));
						}
					}
				}
			}
			else if (w < h) {
				__r = w / h;
				__value.push(new egret.Point(__ox, __oy));
				for (__m = 1; __m <= h; __m++) {
					__n1 = (__m - .5) * __r;
					__n2 = (__m + .5) * __r;
					__b1 = __n1 > __n - .5 && __n1 < __n + .5;
					__b2 = __n2 > __n - .5 && __n2 < __n + .5;
					if (__b1 || __b2) {
						__d ? __value.push(new egret.Point(__ox + __n, __oy + __m)) : __value.push(new egret.Point(__ox + __n, __oy - __m));
						if (<any>!__b2) {
							__n++;
							__d ? __value.push(new egret.Point(__ox + __n, __oy + __m)) : __value.push(new egret.Point(__ox + __n, __oy - __m));
						}
					}
				}
			}
			return __value;
		}
	}
}

/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 字典 2017/09/20.
 */
interface IDictionary<T> {
	Add(key: string, value: any): void;
	Remove(key: string): void;
	ContainsKey(key: string): Boolean;
	Keys(): string[];
	Values(): T[];
}


class Dictionary<T> implements IDictionary<T>{
	$keys: string[] = [];
	$values: T[] = [];

	constructor(init?: { key: string, value: T }[]) {
		if (undefined != init) {
			let len = init.length;
			for (let i = 0; i < len; i++) {
				this[init[i].key] = init[i].value;
				this.$keys.push(init[i].key);
				this.$values.push(init[i].value);
			}
		}
	}

	public Add(key: string, value: T): void {
		this[key] = value;
		this.$keys.push(key);
		this.$values.push(value);
	}

	public Remove(key: string): void {
		var index = this.$keys.indexOf(key, 0);
		this.$keys.splice(index, 1);
		this.$values.splice(index, 1);

		delete this[key];
	}

	public ContainsKey(key: string): boolean {
		if (typeof this[key] === "undefined") return false;
		return true;
	}

	public Clear(): void {
		let len = this.$keys.length;
		for (let i = 0; i < len; i++)
			delete this[this.$keys[i]];

		this.$keys = [];
		this.$values = [];
	}

	public Keys(): string[] {
		return this.$keys;
	}

	public Values(): T[] {
		return this.$values;
	}

	public ToLookUp(): IDictionary<T> {
		return this;
	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 自动加载图片动画播放器 2017/09/20.
 */
class EffectMovieClip extends AMovieClip {
	private _callBack: Function;
	private _thisEffectBackObject: any;
	public constructor() {
		super();
	}

	/**
	 * 根据资源Key和动作名称播放资源帧序列
	 * @param mcKey 资源Key
	 * @param actName 动作名称
	 * @param times 播放次数
	 * @param callBackFun 资源加载完成回掉
	 * @param callFun 播放完成回调
	 * @param thisBackObject 回掉函数对象
	 */
	public playMCKey(mcKey: string, actName: string = "", times: number = 1, defaultmc: string = null, callBackFun: Function = null, callFun: Function = null, thisBackObject: any = null) {
		super.playMCKey(mcKey, actName, times, defaultmc, callBackFun, thisBackObject);
		this._callBack = callFun;
		this._thisEffectBackObject = thisBackObject;
		this.addEventListener(egret.Event.COMPLETE, this.effctComplete, this);
	}
	private effctComplete(e: egret.Event) {
		if (this._callBack && this._thisEffectBackObject) {
			this._callBack.call(this._thisEffectBackObject);
		}
		this.destroy();

	}

	public destroy() {
		super.destroy();
		this._thisEffectBackObject = null;
		this.removeEventListener(egret.Event.COMPLETE, this.effctComplete, this);

	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 事件系统 2017/09/20.
 */
class EventSystem {
	private _eventIDIndex: number = 0;
	private _eventlisteners: Object = {};

	private static _instance: EventSystem;
	public static getInstance(): EventSystem {
		if (this._instance == null) {
			this._instance = new EventSystem();
		}
		return this._instance;
	}

	public constructor() {
		//egret.EventDispatcher
	}

	/**
	* 事件监听
	* @param eventName 事件名称
	* @param callFun 回掉函数
	* @param thisObject 执行函数对象
	* @return number 事件ID
	*/
	public addEventListener(eventName: string, callFun: (event: any) => any, thisObject: any): number {
		this._eventIDIndex++;
		if (!this._eventlisteners[eventName]) {
			this._eventlisteners[eventName] = {};
		}

		let vo: EventSyslistenerVO = new EventSyslistenerVO();
		vo.eId = this._eventIDIndex;
		vo.eName = eventName;
		vo.method = callFun;
		vo.thisObject = thisObject;
		this._eventlisteners[eventName][this._eventIDIndex] = vo;
		return this._eventIDIndex;
	}

	/**
	* 事件派发
	* @param eventName 事件名称
	* @param data 回掉函数数据
	* @param delay 延迟时间
	*/
	public dispatchEvent(eventName: string, data: any = null, delay: number = 0) {
		let obj: Object = this._eventlisteners[eventName]
		if (delay > 0) {
			egret.setTimeout(function () {
				if (obj) {
					let vo: EventSyslistenerVO;
					for (let key in obj) {
						vo = obj[key] as EventSyslistenerVO;
						if (vo.method && vo.thisObject) {
							vo.method.call(vo.thisObject, data);
						}
					}
				}
			}, this, delay)
		} else {
			if (obj) {
				let vo: EventSyslistenerVO;
				for (let key in obj) {
					vo = obj[key] as EventSyslistenerVO;
					if (vo.method && vo.thisObject) {
						vo.method.call(vo.thisObject, data);
					}
				}
			}
		}
	}

	/**
     * 移除事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有移除所有改事件名事件
     */
	public removeEventListener(eventName: string, eventId: number = 0) {
		let obj = this._eventlisteners[eventName];
		if (obj) {
			if (eventId == 0) {
				for (let key in obj) {
					let vo = obj[key] as EventSyslistenerVO;
					vo.clear();
				}
				this._eventlisteners[eventName] = null;
				delete this._eventlisteners[eventName];
			} else if (obj[eventId]) {
				(obj[eventId] as EventSyslistenerVO).clear();
				obj[eventId] = null;
				delete obj[eventId];
			}
		}
	}

	/**
     * 是否存在事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有返回是否有该事件名事件
     */
	public hasEventListener(eventName: string, eventId: number = 0): boolean {
		let obj: Object = this._eventlisteners[eventName]
		if (obj) {
			if (eventId == 0) {
				return true;
			} else {
				if (obj[eventId]) {
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	}

	public log(): void {
		console.log(this._eventlisteners);
	}

}

class EventSyslistenerVO {
	public eId: number = 0;
	public eName: string = "";
	public delay: number = 0;
	public method: (event: any) => any;
	/**处理函数所属对象*/
	public thisObject: any;
	/**清理*/
	public clear(): void {
		this.eId = 0;
		this.eName = "";
		this.delay = 0;
		this.method = null;
		this.thisObject = null;
	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 计时器 2017/09/20.
 */
class GlobalTimer {
	private _timerId: number = 0;
	private _hashObject: Object = {};
	private _count: number = 0;

	private static _instance: GlobalTimer;
	public static getInstance(): GlobalTimer {
		if (this._instance == null) {
			this._instance = new GlobalTimer();
		}
		return this._instance;
	}

	public constructor() {

	}

	/**
	* 添加定时调度
	* @param delay 执行间隔:毫秒
	* @param repeatCount 执行次数, 0为无限次
	* @param method 执行函数
	* @param methodObj 执行函数所属对象
	* @param complateMethod 完成执行函数
	* @param complateMethodObj 完成执行函数所属对象
	* @return number 计时器ID
	*/
	public addSchedule(delay: number, repeatCount: number, method: Function, methodObj: any, complateMethod: Function = null, complateMethodObj: any = null): number {
		this._timerId++;
		this._count++;
		//创建
		var vo: GlobalTimerVO = ObjectPool.pop("GlobalTimerVO");//new GlobalTimerVO();
		vo.tId = this._timerId;
		vo.tType = 1;
		vo.delay = delay;
		vo.repeatCount = repeatCount;
		vo.method = method;
		vo.methodObj = methodObj;
		vo.completeMethod = complateMethod;
		vo.completeMethodObj = complateMethodObj;

		var cTimer = new egret.Timer(delay, repeatCount);
		cTimer.addEventListener(egret.TimerEvent.TIMER, method, methodObj);
		if (repeatCount != 0 && complateMethod && complateMethodObj) {
			cTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, vo.timeComplete, vo);
		}
		cTimer.start();
		vo.curTimer = cTimer;
		this._hashObject[this._timerId] = vo;
		return this._timerId;
	}

	/**
     * 添加帧调度
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
	 * @return number 计时器ID
     */
	public addFrameSchedule(method: (timeStamp: number) => boolean, methodObj: any): number {
		this._timerId++;
		this._count++;
		//创建
		var vo: GlobalTimerVO = ObjectPool.pop("GlobalTimerVO")//new GlobalTimerVO();
		vo.tType = 2;
		vo.tId = this._timerId;
		vo.method2 = method;
		vo.methodObj = methodObj;
		this._hashObject[this._timerId] = vo;
		egret.startTick(method, methodObj);
		return this._timerId;
	}


	/**
     * 移除计时器
     * @param timerId 计时器ID
     */
	public remove(timerId: number): void {
		if (this._hashObject[timerId]) {
			this._count--;
			var vo: GlobalTimerVO = this._hashObject[timerId] as GlobalTimerVO;
			if (vo.tType == 1) {
				if (vo.curTimer) {
					vo.curTimer.stop()
					if (vo.method && vo.methodObj) {
						vo.curTimer.removeEventListener(egret.TimerEvent.TIMER, vo.method, vo.methodObj)
					}
					if (vo.completeMethod && vo.completeMethodObj) {
						vo.curTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, vo.timeComplete, vo);
					}
				}
			} else if (vo.tType == 2) {
				if (vo.method2) {
					egret.stopTick(vo.method2, vo.methodObj);
				}
			}
			vo.clear();
			ObjectPool.push(this._hashObject[timerId]);
			this._hashObject[timerId] = null;
			delete this._hashObject[timerId];
		}

	}

	/**
     * 移除所有计时器
     */
	public removeAll(): void {
		for (let key in this._hashObject) {
			var vo: GlobalTimerVO = this._hashObject[key] as GlobalTimerVO;
			if (vo.tType == 1) {
				if (vo.curTimer) {
					if (vo.method && vo.methodObj) {
						vo.curTimer.removeEventListener(egret.TimerEvent.TIMER, vo.method, vo.methodObj)
					}
					if (vo.completeMethod && vo.completeMethodObj) {
						vo.curTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, vo.timeComplete, vo);
					}
					vo.curTimer.stop()
				}
			} else if (vo.tType == 2) {
				if (vo.method2) {
					egret.stopTick(vo.method2, vo.methodObj);
				}
			}
			vo.clear();
		}
		this._hashObject = {};
		this._count = 0
	}

	/**
     * 计时器是否存在
     * @param timerId 计时器ID
	 * @return boolean
     */
	public isExists(timerId: number): boolean {
		if (this._hashObject[timerId]) {
			return true;
		}
		return false;
	}

	/**
     * 计时器是否存在
     * @param method 调度函数
	 * @return boolean
     */
	public isExistsByFun(method: Function): boolean {
		for (let key in this._hashObject) {
			var vo: GlobalTimerVO = this._hashObject[key] as GlobalTimerVO;
			if (vo.method == method) {
				return true;
			}
		}
		return false;
	}

	/**
     * 帧调度计时器是否存在
     * @param method 帧调度函数
	 * @return boolean
     */
	public isExistsFrameByFun(method: (timeStamp: number) => boolean): boolean {
		for (let key in this._hashObject) {
			var vo: GlobalTimerVO = this._hashObject[key] as GlobalTimerVO;
			if (vo.method2 == method) {
				return true;
			}
		}
		return false;
	}


	public printLog() {
		for (let key in this._hashObject) {
			var vo: GlobalTimerVO = this._hashObject[key] as GlobalTimerVO;
			console.log("timerId = " + vo.tId);
		}
	}


}

class GlobalTimerVO {
	/*类型*/
	public tType: number = 0;
	public tId: number = 0;
	public repeatCount: number = 0;
	public delay: number = 0;
	/*timer*/
	public curTimer: egret.Timer;
	/**处理函数*/
	public method: Function;
	/**处理函数 用于帧*/
	public method2: (timeStamp: number) => boolean;
	/**处理函数所属对象*/
	public methodObj: any;
	/**完成处理函数*/
	public completeMethod: Function;
	/**完成处理函数所属对象*/
	public completeMethodObj: any;
	/**清理*/
	public clear(): void {
		this.tType = 0;
		this.tId = 0;
		this.curTimer = null;
		this.method = null;
		this.method2 = null;
		this.methodObj = null;
		this.completeMethod = null;
		this.completeMethodObj = null;
	}

	public timeComplete(): void {
		if (this.completeMethodObj && this.completeMethod) {
			this.completeMethod.call(this.completeMethodObj);
		}
		if (GlobalTimer.getInstance().isExists(this.tId)) {
			GlobalTimer.getInstance().remove(this.tId);
		}
	}
}
/**
 * Created by yangsong on 2014/11/22.
 * Http请求处理
 */
class Http {
	private _serverUrl: string;
	private _urlLoader: egret.URLLoader;
	private _request: egret.URLRequest;
	private _cache: Array<any>;
	private _isRequesting: boolean;
	private _data: DynamicChange;
	private _type: string;
	private loginKey = "507310f58a0ac8e3d8ad8f60c8b85b46h5mt";

	private static _instance: Http;
	public static getInstance(): Http {
		if (this._instance == null) {
			this._instance = new Http();
		}
		return this._instance;
	}

    /**
     * 构造函数
     */
	public constructor() {
		this._data = new DynamicChange();

		this._cache = [];

		this._request = new egret.URLRequest();
		this._request.method = egret.URLRequestMethod.POST;

		this._urlLoader = new egret.URLLoader();
		this._urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
	}

    /**
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
	public initServer(serverUrl: string): void {
		this._serverUrl = serverUrl;
	}

    /**
     * 数据缓存
     * @returns {DynamicChange}
     * @constructor
     */
	public get Data(): DynamicChange {
		return this._data;
	}

    /**
     * Http错误处理函数
     * @param e
     */
	private onError(e: egret.Event): void {
		this.nextPost();
	}

    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
	public send(type: string, urlVariables: egret.URLVariables): void {
		this._cache.push([type, urlVariables]);
		this.post();
	}

    /**
     * 请求服务器
     */
	private post(): void {
		if (this._isRequesting) {
			return;
		}

		if (this._cache.length == 0) {
			return;
		}

		var arr: Array<any> = this._cache.shift();
		var type: string = arr[0];
		var urlVariables: egret.URLVariables = arr[1];
		this._type = type;
		this._request.url = this._serverUrl;
		this._request.data = urlVariables;

		this._urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
		this._urlLoader.load(this._request);
		this._isRequesting = true;
	}

    /**
     * 数据返回
     * @param event
     */
	private onLoaderComplete(event: egret.Event): void {
		this._urlLoader.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
		var t_obj: any = JSON.parse(this._urlLoader.data);
		if (!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
			this._data.pUpdate.update(this._type, t_obj);
			(EventSystem.getInstance() as EventSystem).dispatchEvent(this._type, t_obj);
		}
		else {
			//Log.trace("Http错误:" + t_obj["s"]);
		}
		this.nextPost();
	}

    /**
     * 开始下一个请求
     */
	private nextPost(): void {
		this._isRequesting = false;
		this.post();
	}
}

/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * Http请求
 */
class HttpRequest extends egret.HttpRequest {
	private _errorBack: Function;
	private _completeBack: Function;
	private _httpMethod: string;
	private _thisObject: any;
	private _url: string;
	private _param: string;//?p1=getP1&p2=getP2

	private _request: egret.URLRequest;
	private _urlLoader: egret.URLLoader;
	public constructor(url: string, param: any, thisObject: any, backFun: Function, errorbackFun: Function = null, httpMethod: string = egret.HttpMethod.GET) {
		super();
		this._url = url;
		this._httpMethod = httpMethod;
		this._errorBack = errorbackFun;
		this._completeBack = backFun;
		this._param = param;
		this._thisObject = thisObject;
		this.requestUrl();
	}

	// 	private requestUrl2(){
	// 		this._request = new egret.URLRequest();
	//     	this._request.method = egret.URLRequestMethod.GET;

	//     	this._urlLoader = new egret.URLLoader();
	//     	this._urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);

	// 		// var urlVariables:egret.URLVariables = arr[1];

	// 		this._request.url = this._url;
	// 		//this._request.data = urlVariables;

	// 		this._urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
	// 		//this._request.requestHeaders()
	// 		this._request.requestHeaders = [new egret.URLRequestHeader("Access-Control-Allow-Origin","*")];
	// 		this._urlLoader.load(this._request);
	// 	}


	// 	 /**
	//  * 数据返回
	//  * @param event
	//  */
	// private onLoaderComplete(event:egret.Event):void {
	//     this._urlLoader.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
	//     //var t_obj:any = JSON.parse(this._urlLoader.data);
	//    console.log(this._urlLoader.data)
	// }

	private requestUrl() {
		if (this._httpMethod == egret.HttpMethod.GET) {
			this.responseType = egret.HttpResponseType.TEXT;
			// 参数格式 "?p1=getP1&p2=getP2";
			this.open(this._url + this._param, egret.HttpMethod.GET);
			this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			//this.setRequestHeader("Access-Control-Allow-Origin", "*");
			this.send();
		} else {
			this.responseType = egret.HttpResponseType.TEXT;
			//设置为 POST 请求
			this.open(this._url, egret.HttpMethod.POST);
			this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			// 参数格式 "p1=getP1&p2=getP2";
			this.send(this._param);
		}
		this.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
		this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
		//this.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
	}

	private onGetComplete(event: egret.Event): void {
		var request = <egret.HttpRequest>event.currentTarget;
		//console.log("get data : ",request.response);
		if (this._errorBack) {
			this._errorBack = null;
		}
		if (this._completeBack) {
			this._completeBack.call(this._thisObject, JSON.parse(request.response));
			this._completeBack = null;
		}
		this._thisObject = null;
	}
	private onGetIOError(event: egret.IOErrorEvent): void {
		if (this._errorBack) {
			this._errorBack.call(this._thisObject);
			this._errorBack = null;
		}
		if (this._completeBack) {
			this._completeBack = null;
		}
		this._thisObject = null;
	}
	// private onGetProgress(event:egret.ProgressEvent):void {
	// 	//console.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
	// }
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * A*寻路 2017/09/20.
 */
module aStar {
	export class MathUtil extends egret.HashObject {
		public static getLineFunc(ponit1: egret.Point, point2: egret.Point, type: number = 0): Function {
			var resultFuc: Function;
			if (ponit1.x == point2.x) {
				if (type == 0) {
					//throw new flash.Error("两点所确定直线垂直于y轴，不能根据x值得到y值").message;
				}
				else if (type == 1) {
					resultFuc = function (y: number): number {
						return ponit1.x;
					};
				}
				return resultFuc;
			}
			else if (ponit1.y == point2.y) {
				if (type == 0) {
					resultFuc = function (x: number): number {
						return ponit1.y;
					};
				}
				else if (type == 1) {
					//throw new flash.Error("两点所确定直线垂直于y轴，不能根据x值得到y值").message;
				}
				return resultFuc;
			}
			var a: number = 0;
			a = (ponit1.y - point2.y) / (ponit1.x - point2.x);
			var b: number = 0;
			b = ponit1.y - a * ponit1.x;
			if (type == 0) {
				resultFuc = function (x: number): number {
					return a * x + b;
				};
			}
			else if (type == 1) {
				resultFuc = function (y: number): number {
					return (y - b) / a;
				};
			}
			return resultFuc;
		}

		public static getSlope(ponit1: egret.Point, point2: egret.Point): number {
			return (point2.y - ponit1.y) / (point2.x - ponit1.x);
		}

	}
}

/**
 * Mc资源加载缓存器
 */
//场景事件
const MCSourceCacheEventType = {
	COMPLETE: "mcloadcomEvt",
}
class McSourceCache {
	private _eventSystem: EventSystem;
	private mcdFactoryDic: Object = {};
	private isLoadDic: Object = {};
	public isInitDefaultmc = false;

	private static _instance: McSourceCache;
	public static getInstance(): McSourceCache {
		if (this._instance == null) {
			this._instance = new McSourceCache();
		}
		return this._instance;
	}

	public constructor() {
		this._eventSystem = EventSystem.getInstance();
	}

	public initDefaultMc() {
		if (this.isInitDefaultmc == false) {
			this.isInitDefaultmc = true;
			let mcdFactory = new egret.MovieClipDataFactory(RES.getRes("defaultmc_json"), RES.getRes("defaultmc_png"));
			this.mcdFactoryDic["defaultmc"] = new McSourceCacheVo("defaultmc", mcdFactory);
		}
	}

	/**
	 * 按时更新
	 */
	public update(): void {
		this.gc();
	}


	/**
	 * 按时间和引用次数清理无用资源
	 */
	public gc(): void {
		var vo: McSourceCacheVo;
		var curtime: number = Date.now();
		var bigtime: number = 60 * 2;
		for (let key in this.mcdFactoryDic) {
			vo = this.mcdFactoryDic[key];
			if (vo.regNum <= 0 && curtime - vo.useTime > bigtime) {
				vo.dataFactory.clearCache();
				this.mcdFactoryDic[key] = null;
				delete this.mcdFactoryDic[key];
				RES.destroyRes(`${key}_json`);
				RES.destroyRes(`${key}_png`);
			}
		}
	}

	/**
	 * 销毁所有资源
	 */
	public destroy(): void {
		var vo: McSourceCacheVo;
		//var curtime:number = Date.now();
		//var bigtime:number = 60*2;
		for (let key in this.mcdFactoryDic) {
			vo = this.mcdFactoryDic[key];
			//if(vo.regNum <= 0 && curtime - vo.useTime > bigtime){
			vo.dataFactory.clearCache();
			this.mcdFactoryDic[key] = null;
			delete this.mcdFactoryDic[key];
			RES.destroyRes(`${key}_json`);
			//}
		}
	}

	/**
	 * 是否加载
	 * @param key 资源Key
	 * @return boolean
	 */
	public isLoading(key: string): boolean {
		return this.isLoadDic[key];
	}
	/**
	 * 获取序列帧数据MovieClipData
	 * @param key 资源Key
	 * @param mcName 动作名称
	 * @return any MovieClipData
	 */
	public getObject(key: string, actName: string = ""): egret.MovieClipData {
		var vo: McSourceCacheVo = this.mcdFactoryDic[key];
		if (vo) {
			vo.regNum++;
			vo.useTime = Date.now();
			if (actName == "") {
				actName = key;
			}
			return vo.dataFactory.generateMovieClipData(actName);
		}
		return null;
	}

	/**
	 * 移除序列帧数据使用
	 * @param key 资源Key
	 */
	public removeObject(key: string): void {
		var vo: McSourceCacheVo = this.mcdFactoryDic[key];
		if (vo) {
			vo.regNum--;
			if (vo.regNum < 0) {
				vo.regNum = 0
			}
			vo.useTime = Date.now();
		}
	}

	/**
	 * 是否存在资源缓存
	 * @param key 资源Key
	 * @return boolean
	 */
	public has(key: string): boolean {
		return this.mcdFactoryDic[key] != undefined
	}

	/**
	 * 加载资源
	 * @param key 资源Key
	 */
	public load(key: string): void {
		if (this.mcdFactoryDic[key] != undefined) {
			this._eventSystem.dispatchEvent(MCSourceCacheEventType.COMPLETE, key);
			return;
		}
		if (this.isLoadDic[key]) {
			return;
		}
		let textureData: any;
		let texture: any;
		function onLoadTextureDataComplete(data: any): void {
			textureData = data;
			RES.getResAsync(`${key}_png`, onLoadTextureComplete, this);
		}

		function onLoadTextureComplete(data: any): void {
			texture = data;
			// if(textureData && texture){
			// 	let mcdFactory = new egret.MovieClipDataFactory(textureData, texture);
			// 	this.mcdFactoryDic[key] = new McSourceCacheVo(key,mcdFactory);
			// }
			let mcdFactory = new egret.MovieClipDataFactory(textureData, texture);
			this.mcdFactoryDic[key] = new McSourceCacheVo(key, mcdFactory);
			this._eventSystem.dispatchEvent(MCSourceCacheEventType.COMPLETE, key);
			this.isLoadDic[key] = false;
		}
		this.isLoadDic[key] = true;
		RES.getResAsync(`${key}_json`, onLoadTextureDataComplete, this);
	}

	/**
	* 事件监听
	* @param eventName 事件名称
	* @param callFun 回掉函数
	* @param thisObject 执行函数对象
	* @return number 事件ID
	*/
	public addEventListener(eventName: string, callFun: (event: any) => any, thisObject: any): number {
		return this._eventSystem.addEventListener(eventName, callFun, thisObject);
	}
	/**
     * 移除事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有移除所有改事件名事件
     */
	public removeEventListener(eventName: string, eventId: number = 0) {
		this._eventSystem.removeEventListener(eventName, eventId);
	}

}

/**
 * mc资源缓存VO
 */
class McSourceCacheVo {
	/*类型*/
	public tType: number = 0;
	public key: string = "";//资源Key
	public regNum: number = 0;//注册数
	public dataFactory: egret.MovieClipDataFactory;// mc数据工厂
	public useTime: number = 0;//使用时间

	public constructor(key: string, dataFactory: egret.MovieClipDataFactory, tType: number = 0) {
		this.tType = tType;
		this.key = key;
		this.dataFactory = dataFactory;
		this.regNum = 0;
		this.useTime = Date.now();
	}
}
/**
 * Created by yangsong on 2014/11/22.
 * 对象池类
 */
class ObjectPool {
	private static _content: any = {};
	private _objs: Array<any>;

    /**
     * 构造函数
     */
	public constructor() {
		this._objs = new Array<any>();
	}

    /**
     * 放回一个对象
     * @param obj
     */
	public pushObj(obj: any): void {
		this._objs.push(obj);
	}

    /**
     * 取出一个对象
     * @returns {*}
     */
	public popObj(): any {
		if (this._objs.length > 0) {
			return this._objs.pop();
		} else {
			return null;
		}
	}

    /**
     * 清除所有缓存对象
     */
	public clear(): void {
		while (this._objs.length > 0) {
			this._objs.pop();
		}
	}

    /**
     * 取出一个对象
     * @param classZ Class
     * @return Object
     *
     */
	public static pop(refKey: string, ...args: any[]): any {
		if (!ObjectPool._content[refKey]) {
			ObjectPool._content[refKey] = [];
		}

		var list: Array<any> = ObjectPool._content[refKey];
		if (list.length) {
			return list.pop();
		} else {
			var classZ: any = egret.getDefinitionByName(refKey);
			var argsLen: number = args.length;
			var obj: any;
			if (argsLen == 0) {
				obj = new classZ();
			} else if (argsLen == 1) {
				obj = new classZ(args[0]);
			} else if (argsLen == 2) {
				obj = new classZ(args[0], args[1]);
			} else if (argsLen == 3) {
				obj = new classZ(args[0], args[1], args[2]);
			} else if (argsLen == 4) {
				obj = new classZ(args[0], args[1], args[2], args[3]);
			} else if (argsLen == 5) {
				obj = new classZ(args[0], args[1], args[2], args[3], args[4]);
			}
			obj.ObjectPoolKey = refKey;
			return obj;
		}
	}

    /**
     * 取出一个对象
     * @param refKey Class
     * @param extraKey 标识值
     * @returns {any}
     */
	public static popWithExtraKey(refKey: string, extraKey: any): any {
		if (!ObjectPool._content[refKey]) {
			ObjectPool._content[refKey] = [];
		}

		var obj: any;
		var list: Array<any> = ObjectPool._content[refKey];
		if (list.length) {
			for (var i = 0; i < list.length; i++) {
				if (list[i].extraKey == extraKey) {
					obj = list[i];
					list.splice(i, 1);
					break;
				}
			}
		}
		if (!obj) {
			var classZ: any = egret.getDefinitionByName(refKey);
			obj = new classZ(extraKey);
			obj.extraKey = extraKey;
			obj.ObjectPoolKey = refKey;
		}
		return obj;
	}

    /**
     * 放入一个对象
     * @param obj
     *
     */
	public static push(obj: any): boolean {
		if (obj == null) {
			return false;
		}

		var refKey: any = obj.ObjectPoolKey;
		//保证只有pop出来的对象可以放进来，或者是已经清除的无法放入
		if (!ObjectPool._content[refKey]) {
			return false;
		}

		ObjectPool._content[refKey].push(obj);
		return true;
	}

    /**
     * 清除所有对象
     */
	public static clear(): void {
		ObjectPool._content = {};
	}

    /**
     * 清除某一类对象
     * @param classZ Class
     * @param clearFuncName 清除对象需要执行的函数
     */
	public static clearClass(refKey: string, clearFuncName: string = null): void {
		var list: Array<any> = ObjectPool._content[refKey];
		while (list && list.length) {
			var obj: any = list.pop();
			if (clearFuncName) {
				obj[clearFuncName]();
			}
			obj = null;
		}
		ObjectPool._content[refKey] = null;
		delete ObjectPool._content[refKey];
	}

    /**
     * 缓存中对象统一执行一个函数
     * @param classZ Class
     * @param dealFuncName 要执行的函数名称
     */
	public static dealFunc(refKey: string, dealFuncName: string): void {
		var list: Array<any> = ObjectPool._content[refKey];
		if (list == null) {
			return;
		}

		var i: number = 0;
		var len: number = list.length;
		for (i; i < len; i++) {
			list[i][dealFuncName]();
		}
	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 协议管理 2017/09/20.
 */
class ProtocalManager {
	private _protocalDic: Object = {};

	private static _instance: ProtocalManager;
	public static getInstance(): ProtocalManager {
		if (this._instance == null) {
			this._instance = new ProtocalManager();
		}
		return this._instance;
	}
	public constructor() {

	}

	/**
	 * 注册协议
	 * @param pId 协议ID
	 * @param backFun 回掉函数
	 */
	public registerProtocal(pId: number, callFun: (data: any) => void, thisObject: any) {
		let vo = new ProtocalManagerVO();
		vo.pId = pId;
		vo.method = callFun;
		vo.thisObject = thisObject;
		this._protocalDic[pId] = vo;
	}

	/**
	 * 清除协议注册
	 * @param pId 协议ID
	 * @param backFun 回掉函数
	 */
	public unRegisterProtocal(pId: number) {
		if (this._protocalDic[pId]) {
			this._protocalDic[pId] = null;
			delete this._protocalDic[pId];
		}
	}

	/**
	 * 执行协议
	 * @param pId 协议ID
	 * @param data 数据
	 */
	public runProtocal(pId: number, data: any) {
		if (this._protocalDic[pId]) {
			let vo = this._protocalDic[pId] as ProtocalManagerVO;
			if (vo.method && vo.thisObject) {
				vo.method.call(vo.thisObject, data);
			}
		}
	}

	/**
	 * 发送协议
	 * @param pId 协议ID
	 * @param data 数据
	 */
	public sendProtocal(pId: number, data: any) {
		(Socket.getInstance() as Socket).send(pId, data)
	}
}


class ProtocalManagerVO {
	/*协议ID*/
	public pId: number = 0;
	/*协议回掉方法*/
	public method: (data: any) => void;
	public thisObject: any;

	/**清理*/
	public clear(): void {
		this.pId = 0;
		this.method = null;
		this.thisObject = null;
	}
}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 富文本 2017/12/26.
 * 使用容器预留表情功能
 */

class RichTextField extends egret.DisplayObjectContainer {
	public static LINK_EVENT: string = "LINK_EVENT";
	private _textField: egret.TextField;//文本类
	public constructor(w: number = 200) {
		super();
		this._textField = new egret.TextField();
		this.addChild(this._textField);
		//this._textField.width = this.width; 
		this._textField.touchEnabled = true;
		this._textField.addEventListener(egret.TextEvent.LINK, function (evt: egret.TextEvent) {
			EventSystem.getInstance().dispatchEvent(RichTextField.LINK_EVENT, evt.text);
		}, this);
		this.touchEnabled = false;
		this.width = w;
	}

	/**
	 * 设置样式文本
	 *  var arr:any = new Array<egret.ITextElement>(
     *     { text:"这段文字有链接", style: { "href" : "event:text event win_role_89" } },
     *     { text:"这段文字没链接", style: {} }
     *   );
	 */
	public set textFlow(arr: Array<egret.ITextElement>) {
		if (this._textField && arr) {
			this._textField.textFlow = arr;
		}
	}

	/**
	 * 设置html标签文本
	 * 列如：'没有任何格式初始文本，<font fontfamily="Verdana" href="event:item_12345_21">Verdana blue large</font><font color="#ff7f50" size="10">珊瑚色<b>局部加粗</b>小字体</font><i>斜体</i>'
	 */
	public set textHtml(str: string) {
		if (this._textField && str) {
			this._textField.textFlow = (new egret.HtmlTextParser).parser(str);
		}
	}

	public set lineSpacing(v: number) {
		if (this._textField) {
			this._textField.lineSpacing = v;
		}
	}

	public set size(v: number) {
		if (this._textField) {
			this._textField.size = v;
		}
	}

	public set width(v: number) {
		if (this._textField) {
			this._textField.width = v;
		}
		super.$setWidth(v);
	}

	public get width(): number {
		if (this._textField) {
			return this._textField.width;
		}
		return super.$getWidth();
	}

	public set height(v: number) {
		if (this._textField) {
			this._textField.height = v;
		}
		super.$setHeight(v);
	}
	public get height(): number {
		if (this._textField) {
			return this._textField.height;
		}
		return super.$getHeight();
	}
}
/**
 * Author: zsq整理
 * Email： 21102585@qq.com
 * socket 2017/09/20.
 */
//用法
// (Socket.getInstance() as Socket).initServer("10.0.30.113", 32750, "/ws", new ByteArrayMsgByProtobuf());
// (Socket.getInstance() as Socket).connect();
// (EventSystem.getInstance() as EventSystem).addEventListener(SocketConst.SOCKET_CONNECT,this.socketConnect,this);
// (EventSystem.getInstance() as EventSystem).addEventListener(SocketConst.SOCKET_RECONNECT,this.socketConnect,this);
// (ProtocalManager.getInstance() as ProtocalManager).registerProtocal(10000,this.handler10000,this) ;  
// public socketConnect(data:any = null):void{
//     let sendData ={platform:"12",acc_name:"ZHANG",os_type:"2",server_id:123};//数据对象
//     Utils.Socket.send(10000,sendData);
// }
// private handler10000(data:any){
//         console.log(data);  
//     // (EventSystem.getInstance() as EventSystem).dispatchEvent()
// }
class Socket {
	private _needReconnect: boolean = true;
	private _maxReconnectCount = 3;

	private _reconnectCount: number = 0;
	private _connectFlag: boolean;
	private _host: string;
	private _port: any;
	private _suffix: any;
	private _socket: egret.WebSocket;
	private _msg: BaseMsg;
	private _isConnecting: boolean;

	private _timeOutId: number = 0;


	private static _instance: Socket;
	public static getInstance(): Socket {
		if (this._instance == null) {
			this._instance = new Socket();
		}
		return this._instance;
	}
    /**
     * 构造函数
     */
	public constructor() {

	}

	private log(...args: any[]) {
		console.log("Socket", args.toString());
	}

    /**
     * 添加事件监听
     */
	private addEvents() {
		if (this._socket.hasEventListener(egret.ProgressEvent.SOCKET_DATA) == false) {
			this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
		}
		if (this._socket.hasEventListener(egret.Event.CONNECT) == false) {
			this._socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
		}
		if (this._socket.hasEventListener(egret.Event.CLOSE) == false) {
			this._socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
		}
		if (this._socket.hasEventListener(egret.IOErrorEvent.IO_ERROR) == false) {
			this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
		}
	}

    /**
     * 移除事件监听
     */
	private removeEvents(): void {
		if (this._socket) {
			this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
			this._socket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
			this._socket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
			this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
		}
	}

    /**
     * 服务器连接成功
     */
	private onSocketOpen(): void {
		//this._reconnectCount = 0;
		this._isConnecting = true;
		if (this._connectFlag) {
			EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_RECONNECT);
		} else {
			EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_CONNECT);
		}
		this._connectFlag = true;
	}

    /**
     * 服务器断开连接
     */
	private onSocketClose(): void {
		this._isConnecting = false;
		EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_CLOSE);
	}

    /**
     * 服务器连接错误
     */
	private onSocketError(): void {
		this._isConnecting = false;
		EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_NOCONNECT);
	}

    /**
     * 收到服务器消息
     * @param e
     */
	private onReceiveMessage(e: egret.Event): void {
		this._msg.receive(this._socket);
	}

    /**
     * 初始化服务区地址
     * @param host IP
     * @param port 端口
     * @param msg 消息发送接受处理类
     */
	public initServer(host: string, port: any, msg: BaseMsg): void {
		this._host = host;
		this._port = port;
		this._msg = msg;
	}

    /**
     * 开始Socket连接
     */
	public connect(): void {
		this._reconnectCount = 0;
		this.connectSocket();
	}

	/**
     * 开始Socket连接
     */
	private connectSocket(): void {
		if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
			if (!window["WebSocket"]) {
				this.log("不支持WebSocket");
				return;
			}
		}
		if (this._socket == null) {
			this._socket = new egret.WebSocket();
		}
		if (this._msg instanceof ByteArrayMsg) {
			this._socket.type = egret.WebSocket.TYPE_BINARY;
		}
		this.log("connect WebSocket: " + this._host + ":" + this._port);
		this.addEvents();
		this._socket.connect(this._host, this._port);
	}


    /**
     * 重新连接
     */
	public reconnect(): void {
		App.logzsq("SOCKET 重新连接 reconnect");
		if (this._timeOutId != 0) {
			egret.clearTimeout(this._timeOutId);
			this._timeOutId = 0;
		}
		if (this._timeOutId == 0) {
			this._timeOutId = egret.setTimeout(function () {
				this.reconnectSocket();
			}, this, 1500);
		}
	}
	/**
	 * 重连socket
	 */
	private reconnectSocket(): void {
		this._timeOutId = 0;
		App.logzsq("SOCKET 重新连接 reconnectSocket");
		this.closeCurrentSocket();
		this._reconnectCount++;
		if (this._reconnectCount < this._maxReconnectCount) {
			EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_START_RECONNECT);
			this.connectSocket();
		} else {
			EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_NOCONNECT);
		}
	}

    /**
     * 发送消息到服务器
     * @param msg
     */
	public send(protoId: number, msg: any): void {
		if (this._isConnecting) {
			let newMsg: any = {};
			newMsg.id = protoId;
			newMsg.body = msg;
			this._msg.send(this._socket, newMsg);
		} else {
			//Utils.MsgUtils.addMidMsg("连接已断开，请刷新界面");
			if (this._needReconnect) {
				App.logzsq("SOCKET 发送发现断线");
				// this.reconnect();
			}
		}
	}

    /**
     * 关闭Socket连接
     */
	public close(): void {
		this._connectFlag = false;
		this.closeCurrentSocket();
	}

    /**
     * 清理当前的Socket连接
     */
	private closeCurrentSocket() {
		this.removeEvents();
		if (this._socket) {
			this._socket.close();
			this._socket = null;
		}
		this._isConnecting = false;
	}

    /**
     * Socket是否在连接中
     * @returns {boolean}
     */
	public isConnecting(): boolean {
		return this._isConnecting;
	}

    /**
     * Debug信息
     * @param str
     */
	private debugInfo(str: String): void {
		EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_DEBUG_INFO, str);
	}
}
/**
 * Created by yangsong on 2014/11/25.
 * Socket使用常量
 */
class SocketConst {
    /**
     * Socket已经连接上
     * @type {string}
     */
	public static SOCKET_CONNECT: string = "SOCKET_CONNECT";
    /**
     * Socket重新连接上
     * @type {string}
     */
	public static SOCKET_RECONNECT: string = "SOCKET_RECONNECT";
    /**
     * Socket开始重新连接上
     * @type {string}
     */
	public static SOCKET_START_RECONNECT: string = "SOCKET_START_RECONNECT";
    /**
     * Socket已关闭
     * @type {string}
     */
	public static SOCKET_CLOSE: string = "SOCKET_CLOSE";
    /*
     * socket收到消息
     * */
	public static SOCKET_DATA: string = "SOCKET_DATA";
    /**
     * Socket不能连接上
     * @type {string}
     */
	public static SOCKET_NOCONNECT: string = "SOCKET_NOCONNECT";
    /**
     * Socketdebug的消息
     * @type {string}
     */
	public static SOCKET_DEBUG_INFO: string = "SOCKET_DEBUG_INFO";
}

/**
 * Created by yangsong on 15-1-14.
 * 背景音乐类
 */
class SoundBg extends BaseSound {
	private _currBg: string;
	private _currSound: egret.Sound;
	private _currSoundChannel: egret.SoundChannel;
	private _volume: number;

    /**
     * 构造函数
     */
	public constructor() {
		super();
		this._currBg = "";
	}

    /**
     * 停止当前音乐
     */
	public stop(): void {
		if (this._currSoundChannel) {
			this._currSoundChannel.stop();
		}
		this._currSoundChannel = null;
		this._currSound = null;
		this._currBg = "";
	}

    /**
     * 播放某个音乐
     * @param effectName
     */
	public play(effectName: string): void {
		if (this._currBg == effectName)
			return;
		this.stop();
		this._currBg = effectName;
		var sound: egret.Sound = this.getSound(effectName);
		if (sound) {
			this.playSound(sound);
		}
	}

    /**
     * 播放
     * @param sound
     */
	private playSound(sound: egret.Sound): void {
		this._currSound = sound;
		this._currSoundChannel = this._currSound.play(0, 1);
		this._currSoundChannel.volume = this._volume;
	}

    /**
     * 设置音量
     * @param volume
     */
	public setVolume(volume: number): void {
		this._volume = volume;
		if (this._currSoundChannel) {
			this._currSoundChannel.volume = this._volume;
		}
	}

    /**
     * 资源加载完成后处理播放
     * @param key
     */
	public loadedPlay(key: string): void {
		if (this._currBg == key) {
			this.playSound(RES.getRes(key));
		}
	}

    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
	public checkCanClear(key: string): boolean {
		return this._currBg != key;
	}
}
/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
class SoundEffects extends BaseSound {
	private _volume: number;

    /**
     * 构造函数
     */
	public constructor() {
		super();
	}

    /**
     * 播放一个音效
     * @param effectName
     */
	public play(effectName: string): void {
		var sound: egret.Sound = this.getSound(effectName);
		if (sound) {
			this.playSound(sound);
		}
	}

    /**
     * 播放
     * @param sound
     */
	private playSound(sound: egret.Sound): void {
		var channel: egret.SoundChannel = sound.play(0, 1);
		channel.volume = this._volume;
	}

    /**
     * 设置音量
     * @param volume
     */
	public setVolume(volume: number): void {
		this._volume = volume;
	}


    /**
     * 资源加载完成后处理播放
     * @param key
     */
	public loadedPlay(key: string): void {
		this.playSound(RES.getRes(key));
	}
}
/**
 * Created by yangsong on 15-1-14.
 * Sound管理类
 */
class SoundManager extends BaseClass {
    /**
     * 音乐文件清理时间
     * @type {number}
     */
	public static CLEAR_TIME: number = 3 * 60 * 1000;

	private effect: SoundEffects;
	private bg: SoundBg;
	private effectOn: boolean;
	private bgOn: boolean;
	private currBg: string;
	private bgVolume: number;
	private effectVolume: number;

    /**
     * 构造函数
     */
	public constructor() {
		super();

		this.bgOn = true;
		this.effectOn = true;

		this.bgVolume = 0.5;
		this.effectVolume = 0.5;

		this.bg = new SoundBg();
		this.bg.setVolume(this.bgVolume);

		this.effect = new SoundEffects();
		this.effect.setVolume(this.effectVolume);
	}

    /**
     * 播放音效
     * @param effectName
     */
	public playEffect(effectName: string): void {
		if (!this.effectOn)
			return;

		this.effect.play(effectName);
	}

    /**
     * 播放背景音乐
     * @param key
     */
	public playBg(bgName: string): void {
		this.currBg = bgName;
		if (!this.bgOn)
			return;

		this.bg.play(bgName);
	}

    /**
     * 停止背景音乐
     */
	public stopBg(): void {
		this.bg.stop();
	}

    /**
     * 设置音效是否开启
     * @param $isOn
     */
	public setEffectOn($isOn: boolean): void {
		this.effectOn = $isOn;
	}

    /**
     * 设置背景音乐是否开启
     * @param $isOn
     */
	public setBgOn($isOn: boolean): void {
		this.bgOn = $isOn;
		if (!this.bgOn) {
			this.stopBg();
		} else {
			if (this.currBg) {
				this.playBg(this.currBg);
			}
		}
	}

    /**
     * 设置背景音乐音量
     * @param volume
     */
	public setBgVolume(volume: number): void {
		volume = Math.min(volume, 1);
		volume = Math.max(volume, 0);
		this.bgVolume = volume;
		this.bg.setVolume(this.bgVolume);
	}

    /**
     * 获取背景音乐音量
     * @returns {number}
     */
	public getBgVolume(): number {
		return this.bgVolume;
	}

    /**
     * 设置音效音量
     * @param volume
     */
	public setEffectVolume(volume: number): void {
		volume = Math.min(volume, 1);
		volume = Math.max(volume, 0);
		this.effectVolume = volume;
		this.effect.setVolume(this.effectVolume);
	}

    /**
     * 获取音效音量
     * @returns {number}
     */
	public getEffectVolume(): number {
		return this.effectVolume;
	}

}
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * A*寻路 2017/09/20.
 */
module aStar {
	export class TileUtil {
		public static picWidth: number = 300;
		public static picHeight: number = 300;
		public static tileWidth: number = 64;
		public static tileHeight: number = 64;
		public static tileRows: number = 300;
		public static tileCols: number = 400;
		public static sqrt2: number = Math.sqrt(2);
		public static slantLen: number = 28;
		public static slantRate: number = 1.4;
		public static changeXToTile(num: number): number {
			return Math.round(num / TileUtil.tileWidth);
		}

		public static changeYToTile(num: number): number {
			return Math.round(num / TileUtil.tileHeight);
		}

		public static changeXToPixs(num: number): number {
			return num * TileUtil.tileWidth + TileUtil.tileWidth / 2;
		}

		public static changeYToPixs(num: number): number {
			return num * TileUtil.tileHeight + TileUtil.tileHeight / 2;
		}

	}
}


/**
 * Created by yangsong on 15-2-11.
 */
class UTFMsg implements BaseMsg {
    /**
     * 构造函数
     */
	public constructor() {

	}

    /**
     * 接收消息处理
     * @param msg
     */
	public receive(socket: egret.WebSocket): void {
		var msg: string = socket.readUTF();
		var obj: any = this.decode(msg);
		if (obj) {
			(EventSystem.getInstance() as EventSystem).dispatchEvent(obj.key, obj.body);
		}
	}

    /**
     * 发送消息处理
     * @param msg
     */
	public send(socket: egret.WebSocket, msg: any): void {
		var obj: any = this.encode(msg);
		if (obj) {
			socket.type = egret.WebSocket.TYPE_STRING;
			socket.writeUTF(obj);
		}
	}

    /**
     * 消息解析
     * @param msg
     */
	public decode(msg: any): any {
		console.log("decode需要子类重写，根据项目的协议结构解析");
		return null;
	}

    /**
     * 消息封装
     * @param msg
     */
	public encode(msg: any): any {
		console.log("encode需要子类重写，根据项目的协议结构解析");
		return null;
	}
}
/**
 * Created by yangsong on 15-3-20.
 */
class UTFMsgByJson extends UTFMsg {
    /**
     * 构造函数
     */
	public constructor() {
		super();
	}

    /**
     * 消息解析
     * @param msg
     */
	public decode(msg: any): any {
		return JSON.parse(msg);
	}

    /**
     * 消息封装
     * @param msg
     */
	public encode(msg: any): any {
		return JSON.stringify(msg);
	}
}