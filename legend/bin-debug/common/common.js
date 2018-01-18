var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 自动加载图片动画播放器 2017/09/20.
 */
var AMovieClip = (function (_super) {
    __extends(AMovieClip, _super);
    function AMovieClip() {
        var _this = _super.call(this) || this;
        _this._mcKey = ""; //影片Key
        _this._actName = ""; //动作名称
        _this._clearKey = ""; //影片清理Key
        _this._loadEventId = 0;
        _this._playtimes = -1;
        _this._sourceCache = McSourceCache.getInstance();
        _this._eventSystem = EventSystem.getInstance();
        return _this;
    }
    /**
     * 获取资源Key
     * return string
     */
    AMovieClip.prototype.getMCKey = function () {
        return this._mcKey;
    };
    /**
     * 获取动作名称
     * return string
     */
    AMovieClip.prototype.actName = function () {
        return this._actName;
    };
    /**
     * 根据资源Key和动作名称播放资源帧序列
     * @param mcKey 资源Key
     * @param actName 动作名称
     * @param times 播放次数
     * @param callBackFun 资源加载完成回掉
     * @param thisBackObject 回掉函数对象
     */
    AMovieClip.prototype.playMCKey = function (mcKey, actName, times, defaultmc, callBackFun, thisBackObject) {
        if (actName === void 0) { actName = ""; }
        if (times === void 0) { times = -1; }
        if (defaultmc === void 0) { defaultmc = null; }
        if (callBackFun === void 0) { callBackFun = null; }
        if (thisBackObject === void 0) { thisBackObject = null; }
        if (this._mcKey == mcKey) {
            if (this.movieClipData && this.movieClipData.frames.length > 0) {
                this._playtimes = times;
                if (times == -1) {
                    this.play(this._playtimes);
                }
                else {
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
        }
        else {
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
                }
                else {
                    this.gotoAndPlay(1, this._playtimes);
                }
            }
            if (callBackFun && thisBackObject) {
                callBackFun.call(thisBackObject);
            }
        }
        else {
            this._callBackFun = callBackFun;
            this._thisBackObject = thisBackObject;
            if (this._loadEventId == 0) {
                //this._eventSystem.removeEventListener(MCSourceCacheEventType.COMPLETE,this._loadEventId);
                this._loadEventId = this._sourceCache.addEventListener(MCSourceCacheEventType.COMPLETE, this.mcLoadComplete, this);
            }
            if (defaultmc != null) {
                this.movieClipData = this._sourceCache.getObject(defaultmc, defaultmc);
                this.gotoAndPlay(1, this._playtimes);
            }
            else {
                this.stop();
            }
            this._sourceCache.load(this._mcKey);
            //this._sourceCache.load(this._mcKey);
            //this.stop();
            //使用默认图片
            //this.movieClipData = (McSourceCache.getInstance() as McSourceCache).getObject(this._mcKey).generateMovieClipData(this._mcKey);
            // this.play(this._playtimes);
        }
    };
    AMovieClip.prototype.mcLoadComplete = function (mcKey) {
        if (this._mcKey == mcKey) {
            //console.log(mcKey);
            if (this._clearKey != "") {
                this._sourceCache.removeObject(this._clearKey);
                this._clearKey = "";
            }
            var mcData = this._sourceCache.getObject(this._mcKey, this._actName);
            this._clearKey = this._mcKey;
            if (mcData && mcData.frames.length > 0) {
                this.movieClipData = mcData;
            }
            else {
                this.movieClipData = this._sourceCache.getObject("defaultmc", "defaultmc");
                App.logzsq("res load Error id=" + mcKey);
            }
            if (this._playtimes == -1) {
                this.play(this._playtimes);
            }
            else {
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
    };
    /**
     * 销毁,必须调用
     */
    AMovieClip.prototype.destroy = function () {
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
    };
    return AMovieClip;
}(egret.MovieClip));
__reflect(AMovieClip.prototype, "AMovieClip");
var aStar;
(function (aStar) {
    var AStar = (function (_super) {
        __extends(AStar, _super);
        function AStar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AStar.find = function (startRow, startCol, endRow, endCol) {
            startRow = Math.floor(startRow);
            startCol = Math.floor(startCol);
            endRow = Math.floor(endRow);
            endCol = Math.floor(endCol);
            AStar._startRow = startRow;
            AStar._startCol = startCol;
            AStar._endRow = endRow;
            AStar._endCol = endCol;
            if (!AStar.canWalk(endRow, endCol))
                return null;
            AStar.initLists();
            AStar._openCount = 0;
            AStar._openId = -1;
            AStar.openNote(AStar._startRow, AStar._startCol, 0, 0, 0);
            var currId = 0;
            var currNoteX = 0;
            var currNoteY = 0;
            var aroundNotes;
            var checkingId = 0;
            var fcore = 0;
            var gcore = 0;
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
                    var note = aroundNotes[note_key_a];
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
        };
        AStar.openNote = function (row, col, fScore, gScore, fatherId) {
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
        };
        AStar.closeNote = function (id) {
            id = id;
            AStar._openCount--;
            var noteX = AStar._rows[id];
            var noteY = AStar._cols[id];
            AStar._mapStatusArray[noteX][noteY][AStar._NOTE_OPEN] = false;
            AStar._mapStatusArray[noteX][noteY][AStar._NOTE_CLOSED] = true;
            if (AStar._openCount <= 0) {
                AStar._openCount = 0;
                AStar._openArray = [];
                return;
            }
            AStar._openArray[0] = AStar._openArray.pop();
            AStar.delSort();
        };
        AStar.addSort = function (index) {
            index = index;
            var father = 0;
            var change = 0;
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
        };
        AStar.delSort = function () {
            var nowIndex = 1;
            var temp = 0;
            var change = 0;
            var temp2 = 0;
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
        };
        AStar.initData = function (mapArray) {
            AStar._mapArray = mapArray;
            AStar._rowCount = AStar._mapArray.length;
            AStar._colCount = AStar._mapArray[0].length;
        };
        AStar.getArounds = function (row, col) {
            row = row;
            col = col;
            var arr = [];
            var checkRow = 0;
            var checkCol = 0;
            var canDiagonal;
            checkRow = row + 1;
            checkCol = col;
            var canRight = AStar.canWalk(checkRow, checkCol);
            if (canRight && !AStar.isClosed(checkRow, checkCol)) {
                arr.push([checkRow, checkCol]);
            }
            checkRow = row;
            checkCol = col + 1;
            var canDown = AStar.canWalk(checkRow, checkCol);
            if (canDown && !AStar.isClosed(checkRow, checkCol)) {
                arr.push([checkRow, checkCol]);
            }
            checkRow = row - 1;
            checkCol = col;
            var canLeft = AStar.canWalk(checkRow, checkCol);
            if (canLeft && !AStar.isClosed(checkRow, checkCol)) {
                arr.push([checkRow, checkCol]);
            }
            checkRow = row;
            checkCol = col - 1;
            var canUp = AStar.canWalk(checkRow, checkCol);
            if (canUp && !AStar.isClosed(checkRow, checkCol)) {
                arr.push([checkRow, checkCol]);
            }
            checkRow = row + 1;
            checkCol = col + 1;
            canDiagonal = AStar.canWalk(checkRow, checkCol);
            if (canDiagonal && (canRight || canDown) && !AStar.isClosed(checkRow, checkCol)) {
                arr.push([checkRow, checkCol]);
            }
            checkRow = row - 1;
            checkCol = col + 1;
            canDiagonal = AStar.canWalk(checkRow, checkCol);
            if (canDiagonal && (canLeft || canDown) && !AStar.isClosed(checkRow, checkCol)) {
                arr.push([checkRow, checkCol]);
            }
            checkRow = row - 1;
            checkCol = col - 1;
            canDiagonal = AStar.canWalk(checkRow, checkCol);
            if (canDiagonal && (canLeft || canUp) && !AStar.isClosed(checkRow, checkCol)) {
                arr.push([checkRow, checkCol]);
            }
            checkRow = row + 1;
            checkCol = col - 1;
            canDiagonal = AStar.canWalk(checkRow, checkCol);
            if (canDiagonal && (canRight || canUp) && !AStar.isClosed(checkRow, checkCol)) {
                arr.push([checkRow, checkCol]);
            }
            return arr;
        };
        AStar.getPath = function (startRow, startCol, id) {
            startRow = startRow;
            startCol = startCol;
            id = id;
            var arr = [];
            var nowRow = AStar._rows[id];
            var nowCol = AStar._cols[id];
            while (nowRow != startRow || nowCol != startCol) {
                arr.unshift(nowCol);
                arr.unshift(nowRow);
                id = AStar._fatherArray[id];
                nowRow = AStar._rows[id];
                nowCol = AStar._cols[id];
            }
            AStar.destroyLists();
            return arr;
        };
        AStar.isOpen = function (row, col) {
            row = row;
            col = col;
            if (AStar._mapStatusArray[row] == null)
                return false;
            if (AStar._mapStatusArray[row][col] == null)
                return false;
            return AStar._mapStatusArray[row][col][AStar._NOTE_OPEN];
        };
        AStar.isClosed = function (row, col) {
            row = row;
            col = col;
            if (AStar._mapStatusArray[row] == null)
                return false;
            if (AStar._mapStatusArray[row][col] == null)
                return false;
            return AStar._mapStatusArray[row][col][AStar._NOTE_CLOSED];
        };
        AStar.canWalk = function (row, col) {
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
        };
        AStar.getFScore = function (index) {
            index = index;
            return AStar._fScoreArray[AStar._openArray[index - 1]];
        };
        AStar.getIndex = function (p_id) {
            p_id = p_id;
            var i = 1;
            for (var id_key_a in AStar._openArray) {
                var id = AStar._openArray[id_key_a];
                if (id == p_id) {
                    return i;
                }
                i++;
            }
            return -1;
        };
        AStar.getRow = function (mouseY) {
            return Math.floor(mouseY / AStar._GridHeigh);
        };
        AStar.getCol = function (mouseX) {
            return Math.floor(mouseX / AStar._GridWidth);
        };
        AStar.myAbs = function (value) {
            value = value;
            return value < 0 ? -value : value;
        };
        AStar.initLists = function () {
            AStar._openArray = [];
            AStar._rows = [];
            AStar._cols = [];
            AStar._fScoreArray = [];
            AStar._gScoreArray = [];
            AStar._fatherArray = [];
            AStar._mapStatusArray = [];
        };
        AStar.destroyLists = function () {
            AStar._openArray = null;
            AStar._rows = null;
            AStar._cols = null;
            AStar._fScoreArray = null;
            AStar._gScoreArray = null;
            AStar._fatherArray = null;
            AStar._mapStatusArray = null;
        };
        AStar.canStrightWark = function (startRow, startCol, endRow, endCol) {
            startRow = startRow;
            startCol = startCol;
            endRow = endRow;
            endCol = endCol;
            if (startRow == endRow && startCol == endCol)
                return false;
            var point1 = new egret.Point(startCol + 0.5, startRow + 0.5);
            var point2 = new egret.Point(endCol + 0.5, endRow + 0.5);
            var distX = Math.abs(startCol - endCol);
            var distY = Math.abs(startRow - endRow);
            var loopDirection = distX > distY ? true : false;
            var lineFuction;
            var i = 0;
            var loopStart = 0;
            var loopEnd = 0;
            var passedNodeList;
            var passedNode;
            if (loopDirection) {
                lineFuction = aStar.MathUtil.getLineFunc(point1, point2, 0);
                loopStart = Math.min(startCol, endCol);
                loopEnd = Math.max(startCol, endCol);
                for (i = loopStart; i <= loopEnd; i++) {
                    if (i == loopStart)
                        i += .5;
                    var yPos = lineFuction(i);
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
                lineFuction = aStar.MathUtil.getLineFunc(point1, point2, 1);
                loopStart = Math.min(startRow, endRow);
                loopEnd = Math.max(startRow, endRow);
                for (i = loopStart; i <= loopEnd; i++) {
                    if (i == loopStart)
                        i += .5;
                    var xPos = lineFuction(i);
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
        };
        AStar.getNodesUnderPoint = function (xPos, yPos, exception) {
            if (exception === void 0) { exception = null; }
            var result = [];
            var xIsInt = xPos % 1 == 0;
            var yIsInt = yPos % 1 == 0;
            if (xIsInt && yIsInt) {
                result[0] = new egret.Point(xPos - 1, yPos - 1);
                result[1] = new egret.Point(xPos, yPos - 1);
                result[2] = new egret.Point(xPos - 1, yPos);
                result[3] = new egret.Point(xPos, yPos);
            }
            else if (xIsInt && !yIsInt) {
                result[0] = new egret.Point(xPos - 1, Math.floor(yPos));
                result[1] = new egret.Point(xPos, Math.floor(yPos));
            }
            else if (!xIsInt && yIsInt) {
                result[0] = new egret.Point(Math.floor(xPos), yPos - 1);
                result[1] = new egret.Point(Math.floor(xPos), yPos);
            }
            else {
                result[0] = new egret.Point(Math.floor(xPos), Math.floor(yPos));
            }
            if (exception && exception.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    if (exception.indexOf(result[i]) != -1) {
                        result.splice(i, 1);
                        i--;
                    }
                }
            }
            return result;
        };
        AStar._rowCount = 0;
        AStar._colCount = 0;
        AStar._startX = 0;
        AStar._startY = 0;
        AStar._endX = 0;
        AStar._endY = 0;
        AStar._startRow = 0;
        AStar._startCol = 0;
        AStar._endRow = 0;
        AStar._endCol = 0;
        AStar._mapArray = [];
        AStar._openId = 0;
        AStar._openCount = 0;
        AStar._NOTE_ID = 0;
        AStar._NOTE_OPEN = 1;
        AStar._NOTE_CLOSED = 2;
        AStar._COST_STRAIGHT = 10;
        AStar._COST_DIAGONAL = 14;
        AStar._GridWidth = 64;
        AStar._GridHeigh = 64;
        return AStar;
    }(egret.HashObject));
    aStar.AStar = AStar;
    __reflect(AStar.prototype, "aStar.AStar");
})(aStar || (aStar = {}));
var BaseChildView = (function (_super) {
    __extends(BaseChildView, _super);
    function BaseChildView(_skinName) {
        var _this = _super.call(this) || this;
        _this.__isCreatComplete = false;
        _this.__isReadyOpenWin = false;
        if (_skinName && _skinName != "") {
            _this.skinName = _skinName;
        }
        _this.addEventListener(eui.UIEvent.CREATION_COMPLETE, _this._onCreatComplete, _this);
        return _this;
    }
    BaseChildView.prototype._onCreatComplete = function () {
        this.__isCreatComplete = true;
        if (this.__isReadyOpenWin) {
            this.open(this.openData);
        }
    };
    BaseChildView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        //this.isCreated = true;
    };
    /**
     * 外面调用
     */
    BaseChildView.prototype.readyOpen = function (openParam) {
        if (openParam === void 0) { openParam = null; }
        this.openData = openParam;
        this.__isReadyOpenWin = true;
        if (this.__isCreatComplete) {
            this.open(openParam);
        }
    };
    /**
     * 打开窗口
     */
    BaseChildView.prototype.open = function (openParam) {
        if (openParam === void 0) { openParam = null; }
        this.visible = true;
    };
    /**
     * 清理
     */
    BaseChildView.prototype.clear = function (data) {
        if (data === void 0) { data = null; }
        this.openData = null;
        this.visible = false;
    };
    /**
     * 销毁
     */
    BaseChildView.prototype.destroy = function () {
        this.__isCreatComplete = false;
        this.__isReadyOpenWin = false;
    };
    return BaseChildView;
}(eui.Component));
__reflect(BaseChildView.prototype, "BaseChildView");
/**
 * Created by yangsong on 14/12/18.
 * 基类
 */
var BaseClass = (function () {
    function BaseClass() {
    }
    /**
     * 获取一个单例
     * @returns {any}
     */
    BaseClass.getInstance = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var Class = this;
        if (!Class._instance) {
            var argsLen = args.length;
            if (argsLen == 0) {
                Class._instance = new Class();
            }
            else if (argsLen == 1) {
                Class._instance = new Class(args[0]);
            }
            else if (argsLen == 2) {
                Class._instance = new Class(args[0], args[1]);
            }
            else if (argsLen == 3) {
                Class._instance = new Class(args[0], args[1], args[2]);
            }
            else if (argsLen == 4) {
                Class._instance = new Class(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen == 5) {
                Class._instance = new Class(args[0], args[1], args[2], args[3], args[4]);
            }
        }
        return Class._instance;
    };
    return BaseClass;
}());
__reflect(BaseClass.prototype, "BaseClass");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 配置基类 2017/09/20.
 */
var BaseConfManager = (function () {
    function BaseConfManager() {
        this._confDic = {};
        this._confDic = {};
    }
    /**
     * 获取配置文件
     * @param name 配置文件名称
     * @return any 返回配置
     */
    BaseConfManager.prototype.getConfig = function (name) {
        if (this._confDic[name] == null) {
            var data = RES.getRes(name);
            if (data._type && data._type > 0) {
                var curT = Date.now();
                if (data._type == 1) {
                    var arrfiled = data._fields;
                    var dataList;
                    var object = data._datas;
                    var ndata;
                    for (var key in object) {
                        dataList = object[key];
                        ndata = {};
                        for (var j = 0; j < arrfiled.length; j++) {
                            ndata[arrfiled[j]] = dataList[j];
                        }
                        object[key] = ndata;
                    }
                    data._type = 0;
                    data._datas = object;
                }
                else if (data._type == 2) {
                    var arrfiled = data._fields;
                    var arr = data._datas;
                    var dataList;
                    var ndata;
                    for (var i = 0; i < arr.length; i++) {
                        dataList = arr[i];
                        ndata = {};
                        for (var j = 0; j < arrfiled.length; j++) {
                            ndata[arrfiled[j]] = dataList[j];
                        }
                        arr[i] = ndata;
                    }
                    data._type = 0;
                    data._datas = arr;
                }
                this._confDic[name] = data._datas;
            }
            else {
                this._confDic[name] = data;
            }
        }
        return this._confDic[name];
    };
    /**
     * 设置配置文件
     * @param name 配置文件名称
     * @param data 返回配置
     */
    BaseConfManager.prototype.setConfig = function (name, data) {
        this._confDic[name] = data;
    };
    /**
     * 是否存在配置文件
     * @param name 配置文件名称
     * @return boolean 返回Boolen
     */
    BaseConfManager.prototype.hasConfig = function (name) {
        return this._confDic[name];
    };
    /**
     * 清理配置
     * @param key 配置文件名称，为""清理所有
     */
    BaseConfManager.prototype.clear = function (key) {
        if (key === void 0) { key = ""; }
        if (key != "") {
            this._confDic[key] = null;
            delete this._confDic[key];
        }
        else {
            this._confDic = {};
        }
    };
    return BaseConfManager;
}());
__reflect(BaseConfManager.prototype, "BaseConfManager");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 控制器基类 2017/09/20.
 */
var BaseController = (function (_super) {
    __extends(BaseController, _super);
    function BaseController() {
        var _this = _super.call(this) || this;
        _this._protocalManager = ProtocalManager.getInstance();
        _this._EventSystem = EventSystem.getInstance();
        return _this;
        // this.initProtocol();  //不能放这里，this指向有问题
        // this.initEventListener();
    }
    /**
     * 初始化协议
     */
    BaseController.prototype.initProtocol = function () {
    };
    /**
     * 初始化事件监听
     */
    BaseController.prototype.initEventListener = function () {
    };
    /**
     * 销毁
     */
    BaseController.prototype.destroy = function () {
    };
    /**
     * 清理
     */
    BaseController.prototype.clear = function () {
    };
    /**
     * 注册协议
     * @param pId 协议ID
     * @param backFun 回掉函数
     */
    BaseController.prototype.registerProtocal = function (pId, callFun, thisObject) {
        this._protocalManager.registerProtocal(pId, callFun, thisObject);
    };
    /**
     * 清除协议注册
     * @param pId 协议ID
     * @param backFun 回掉函数
     */
    BaseController.prototype.unRegisterProtocal = function (pId) {
        this._protocalManager.unRegisterProtocal(pId);
    };
    /**
     * 发送协议
     * @param pId 协议ID
     * @param data 数据
     */
    BaseController.prototype.sendProtocal = function (pId, data) {
        this._protocalManager.sendProtocal(pId, data);
    };
    /**
     * 事件监听
     * @param eventName 事件名称
     * @param callFun 回掉函数
     * @param thisObject 执行函数对象
     * @return number 事件ID
     */
    BaseController.prototype.addEventListener = function (eventName, callFun, thisObject) {
        return this._EventSystem.addEventListener(eventName, callFun, thisObject);
    };
    /**
     * 事件派发
     * @param eventName 事件名称
     * @param data 回掉函数数据
     * @param delay 延迟时间
     */
    BaseController.prototype.dispatchEvent = function (eventName, data, delay) {
        if (data === void 0) { data = null; }
        if (delay === void 0) { delay = 0; }
        this._EventSystem.dispatchEvent(eventName, data, delay);
    };
    /**
     * 移除事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有移除所有改事件名事件
     */
    BaseController.prototype.removeEventListener = function (eventName, eventId) {
        if (eventId === void 0) { eventId = 0; }
        this._EventSystem.removeEventListener(eventName, eventId);
    };
    /**
     * 是否存在事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有返回是否有该事件名事件
     */
    BaseController.prototype.hasEventListener = function (eventName, eventId) {
        if (eventId === void 0) { eventId = 0; }
        return this._EventSystem.hasEventListener(eventName, eventId);
    };
    return BaseController;
}(BaseClass));
__reflect(BaseController.prototype, "BaseController");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * model基类 2017/09/20.
 */
var BaseModel = (function (_super) {
    __extends(BaseModel, _super);
    function BaseModel() {
        return _super.call(this) || this;
    }
    BaseModel.prototype.clear = function () {
    };
    BaseModel.prototype.destroy = function () {
    };
    return BaseModel;
}(BaseClass));
__reflect(BaseModel.prototype, "BaseModel");
/**
 * Created by yangsong on 15-1-14.
 * Sound基类
 */
var BaseSound = (function () {
    /**
     * 构造函数
     */
    function BaseSound() {
        this._cache = {};
        this._loadingCache = new Array();
    }
    /**
     * 处理音乐文件的清理
     */
    BaseSound.prototype.dealSoundTimer = function () {
        var currTime = egret.getTimer();
        var keys = Object.keys(this._cache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (!this.checkCanClear(key))
                continue;
            if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
                //console.log(key + "已clear")
                delete this._cache[key];
                RES.destroyRes(key);
            }
        }
    };
    /**
     * 获取Sound
     * @param key
     * @returns {egret.Sound}
     */
    BaseSound.prototype.getSound = function (key) {
        var sound = RES.getRes(key);
        if (sound) {
            if (this._cache[key]) {
                this._cache[key] = egret.getTimer();
            }
        }
        else {
            if (this._loadingCache.indexOf(key) != -1) {
                return null;
            }
            this._loadingCache.push(key);
            RES.getResAsync(key, this.onResourceLoadComplete, this);
        }
        return sound;
    };
    /**
     * 资源加载完成
     * @param event
     */
    BaseSound.prototype.onResourceLoadComplete = function (data, key) {
        var index = this._loadingCache.indexOf(key);
        if (index != -1) {
            this._loadingCache.splice(index, 1);
            this._cache[key] = egret.getTimer();
            this.loadedPlay(key);
        }
    };
    /**
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
    BaseSound.prototype.loadedPlay = function (key) {
    };
    /**
     * 检测一个文件是否要清除，子类重写
     * @param key
     * @returns {boolean}
     */
    BaseSound.prototype.checkCanClear = function (key) {
        return true;
    };
    return BaseSound;
}());
__reflect(BaseSound.prototype, "BaseSound");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 窗口基类 2017/09/20.
 */
var BaseView = (function (_super) {
    __extends(BaseView, _super);
    //private resDoneCB:Function;
    function BaseView(viewConf) {
        if (viewConf === void 0) { viewConf = null; }
        var _this = _super.call(this) || this;
        _this.__viewIsOpen = false;
        _this.isCreated = false;
        _this.__isCreatComplete = false;
        _this.__isReadyOpenWin = false;
        _this.__isShowCloseBtn = false;
        _this.winVo = viewConf;
        if (_this.winVo && _this.winVo.skinName != "" && _this.winVo.skinName != null) {
            _this.skinName = _this.winVo.skinName;
            //this.x = (App.stageWidth - this.width)/2;
            //this.y = (App.stageHeight - this.height)/2;
        }
        if (_this.winVo && _this.winVo.param) {
            if (_this.winVo.param.y) {
                _this.y = _this.winVo.param.y;
            }
            if (_this.winVo.param.x) {
                _this.x = _this.winVo.param.x;
            }
        }
        _this.once(egret.Event.REMOVED_FROM_STAGE, function () {
            _this.clear();
            _this.destroy();
        }, _this);
        _this.addEventListener(eui.UIEvent.CREATION_COMPLETE, _this._onCreatComplete, _this);
        return _this;
    }
    BaseView.prototype._onCreatComplete = function () {
        this.__isCreatComplete = true;
        if (this.__isReadyOpenWin) {
            this.openWin(this.openData);
        }
    };
    BaseView.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.isCreated = true;
        if (this.winVo) {
            this.showWinCloseBtn(this.winVo.useCloseBtn);
        }
        //this.showWinCloseBtn(this.__isShowCloseBtn);
    };
    BaseView.prototype.preloadRes = function (groupNames, openParam) {
        if (openParam === void 0) { openParam = null; }
        var groupName = groupNames[0];
        this.openData = openParam;
        if (!RES.isGroupLoaded(groupName)) {
            this.__resGroupName = groupName;
            RES.loadGroup(groupName);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            //this.facade.sendNotification(PanelNotify.SHOW_LOADING, groupName);
        }
        else {
            this.visible = true;
            this.readyOpenWin(openParam);
        }
    };
    BaseView.prototype.onResourceLoadComplete = function (event) {
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
    };
    /**
     * 窗口准备打开
     */
    BaseView.prototype.readyOpenWin = function (openParam) {
        if (openParam === void 0) { openParam = null; }
        this.openData = openParam;
        this.__isReadyOpenWin = true;
        if (this.__isCreatComplete) {
            this.openWin(openParam);
        }
    };
    /**
     * 打开窗口
     */
    BaseView.prototype.openWin = function (openParam) {
        var _this = this;
        if (openParam === void 0) { openParam = null; }
        if (this.__viewIsOpen == false) {
            this.__viewIsOpen = true;
            //this.openWinAnimation();
            //将动画放到当前帧最后面执行 确保不影响子类的openWin
            //zrj  18.01.08
            egret.callLater(function () {
                _this.openWinAnimation();
            }, this);
        }
    };
    /**
     * 关闭窗口
     */
    BaseView.prototype.closeWin = function (callback) {
        if (callback === void 0) { callback = null; }
        this.closeWinAnimation(callback);
        // if (this.winVo) {
        // 	(WinManager.getInstance() as WinManager).closeWin(this.winVo.winName);
        // }
    };
    /**
     * 显示关闭按钮
     */
    BaseView.prototype.showWinCloseBtn = function (b) {
        var _this = this;
        this.__isShowCloseBtn = b;
        if (this.__winCloseBtn == undefined && this.__isShowCloseBtn) {
            this.__winCloseBtn = new eui.Button();
            this.__winCloseBtn.skinName = "skins.ComBtnClose1Skin";
            this.addChildAt(this.__winCloseBtn, 10000);
            this.__winCloseBtn.x = App.stageWidth - 56;
            this.__winCloseBtn.y = 46;
            this.__winCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
                if (_this.winVo) {
                    App.WinManager.closeWin(_this.winVo.winName);
                }
            }, this);
        }
        else {
            if (this.__winCloseBtn) {
                this.__winCloseBtn.visible = false;
            }
        }
    };
    BaseView.prototype.getCloseBtn = function () {
        return this.__winCloseBtn;
    };
    /**
     * 添加黑低背景
     */
    BaseView.prototype.showBlackBg = function (isClickClose) {
        if (isClickClose === void 0) { isClickClose = true; }
        if (this.__blackBg == null) {
            this.__blackBg = new egret.Sprite();
            this.__blackBg.graphics.clear();
            this.__blackBg.graphics.beginFill(0x000000, 0.8);
            this.__blackBg.graphics.drawRect(0, 0, App.stageWidth * 2, App.stageHeight * 2);
            this.__blackBg.graphics.endFill();
            this.__blackBg.width = App.stageWidth * 2;
            this.__blackBg.height = App.stageHeight * 2;
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
        }
        else {
            this.__blackBg.touchEnabled = false;
            // if(this.__blackBg.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
            // 	this.__blackBg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.closeWin,this);
            // }
        }
        this.__blackBg.visible = true;
    };
    /**
     * 打开动画
    */
    BaseView.prototype.openWinAnimation = function () {
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
    };
    /**
     * 关闭动画
    */
    BaseView.prototype.closeWinAnimation = function (callback) {
        if (this.winVo && this.winVo.closeModel != 0) {
            UIActionManager.playUIAction(this, this.winVo.closeModel, function () {
                if (callback) {
                    callback();
                }
                else {
                    WinManager.getInstance().closeWin(this.winVo.winName);
                }
            }, this, true);
        }
        else {
            if (callback) {
                callback();
            }
            else {
                WinManager.getInstance().closeWin(this.winVo.winName);
            }
        }
    };
    /**
     * 清理
     */
    BaseView.prototype.clear = function (data) {
        if (data === void 0) { data = null; }
        this.__resGroupName = null;
        this.openData = null;
        this.__viewIsOpen = false;
    };
    /**
     * 销毁
     */
    BaseView.prototype.destroy = function () {
        this.__isCreatComplete = false;
        this.__isReadyOpenWin = false;
    };
    return BaseView;
}(eui.Component));
__reflect(BaseView.prototype, "BaseView");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 批量资源加载器 2017/09/20.
 */
var BatchResLoad = (function () {
    function BatchResLoad() {
        this._len = 0;
        this._curIndex = 0;
    }
    /**
     * 批量加载资源加载
     * @param arr Array<Array<string>> url列表
     * @param completeBackFun  Function 完成回掉函数 com(obj:any)
     * @param thisObject any 回掉函数对象
     * @param progressBackFun Function 进度回掉函数 如pro(_curlen,_len))
     */
    BatchResLoad.prototype.loadUrl = function (arr, completeBackFun, thisObject, progressBackFun) {
        if (progressBackFun === void 0) { progressBackFun = null; }
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
        for (var k = 0; k < arr.length; k++) {
            //RES.getResByUrl("resource/splash.jpg",this.logoLoadComplete,this)
            RES.getResByUrl(arr[k][0], this.oneComplete, this, arr[k][1]);
            this._backObj[arr[k][0]] = 0;
        }
    };
    BatchResLoad.prototype.oneComplete = function (data, url) {
        if (this._backObj[url] == 0) {
            this._curIndex = this._curIndex + 1;
            if (data) {
                this._backObj[url] = data;
            }
            else {
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
    };
    BatchResLoad.prototype.destory = function () {
        this._completeFun = null;
        this._progressFun = null;
        this._thisObject = null;
    };
    return BatchResLoad;
}());
__reflect(BatchResLoad.prototype, "BatchResLoad");
/**
 * Created by yangsong on 15-2-11.
 */
var ByteArrayMsg = (function () {
    /**
     * 构造函数
     */
    function ByteArrayMsg() {
        this._msgBuffer = new egret.ByteArray();
    }
    /**
     * 接收消息处理
     * @param msg
     */
    ByteArrayMsg.prototype.receive = function (socket) {
        socket.readBytes(this._msgBuffer);
        var obj = this.decode(this._msgBuffer);
        if (obj) {
            //(EventSystem.getInstance() as EventSystem).dispatchEvent(obj.key, obj.body);
        }
        //TODO double bytearray clear
        if (this._msgBuffer.bytesAvailable == 0) {
            this._msgBuffer.clear();
        }
    };
    /**
     * 发送消息处理
     * @param msg
     */
    ByteArrayMsg.prototype.send = function (socket, msg) {
        var obj = this.encode(msg);
        if (obj) {
            obj.position = 0;
            socket.writeBytes(obj, 0, obj.bytesAvailable);
        }
    };
    /**
     * 消息解析
     * @param msg
     */
    ByteArrayMsg.prototype.decode = function (msg) {
        console.log("decode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    /**
     * 消息封装
     * @param msg
     */
    ByteArrayMsg.prototype.encode = function (msg) {
        console.log("encode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    return ByteArrayMsg;
}());
__reflect(ByteArrayMsg.prototype, "ByteArrayMsg", ["BaseMsg"]);
var ByteArrayMsgByProtobuf = (function (_super) {
    __extends(ByteArrayMsgByProtobuf, _super);
    /**
     * 构造函数
     */
    function ByteArrayMsgByProtobuf() {
        var _this = _super.call(this) || this;
        _this.protoClsFile = null; //协议解析器
        _this.msgClass = {}; //协议类
        _this.protoConfig = null; //协议和Key配置
        _this.msgClass = {};
        _this.protoManager = ProtocalManager.getInstance();
        _this.protoClsFile = dcodeIO.ProtoBuf.loadProto(RES.getRes("game_proto")); //加载协议配置
        _this.protoConfig = RES.getRes("t_proto_json");
        return _this;
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
    ByteArrayMsgByProtobuf.prototype.getMsgClass = function (key) {
        var cls = this.msgClass[key];
        if (cls == null) {
            cls = this.protoClsFile.build(key);
            this.msgClass[key] = cls;
        }
        return cls;
    };
    /**
     * 消息解析 解析包
     * @param msg
     */
    ByteArrayMsgByProtobuf.prototype.decode = function (msg) {
        var len = msg.length;
        msg.position = 0;
        var size = msg.readShort();
        if (msg.bytesAvailable >= size - 2) {
            var protoId = msg.readUnsignedShort();
            var bytes = new egret.ByteArray();
            msg.readBytes(bytes, 0, size - 4);
            var decoder = this.getMsgClass(this.getS2CByProtoId(protoId));
            if (decoder && decoder.decode) {
                var magBody = decoder.decode(bytes.buffer);
                this.protoManager.runProtocal(protoId, magBody);
                return magBody;
            }
            else {
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
    };
    /**
     * 消息封装
     * @param msg
     */
    ByteArrayMsgByProtobuf.prototype.encode = function (msg) {
        var pId = msg.id;
        // let packByteArr: egret.ByteArray = new egret.ByteArray();
        //  //let sendData ={acc_id:12,acc_name:"ZHANG",timestamp:123456,server_id:123,login_ticket:"shun",suid:"shunqiu"};//数据对象
        //  console.log(this.getC2SByProtoId(10000));
        var clazz = this.getMsgClass(this.getC2SByProtoId(pId));
        if (clazz) {
            var msgBody = new clazz(msg.body);
            var bodyBytes = new egret.ByteArray(msgBody.toArrayBuffer());
            var sendMsg = new egret.ByteArray();
            var size = bodyBytes.length;
            sendMsg.writeShort(size);
            sendMsg.writeUnsignedShort(pId);
            sendMsg.writeBytes(bodyBytes);
        }
        else {
            //协议为空只发协议号
            var sendMsg = new egret.ByteArray();
            var size = 0;
            sendMsg.writeShort(size);
            sendMsg.writeUnsignedShort(pId);
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
    };
    /**
     * 获取发送协议结构体
     * @param id 协议号
     */
    ByteArrayMsgByProtobuf.prototype.getC2SByProtoId = function (id) {
        if (this.protoConfig[id]) {
            return this.protoConfig[id].c2s;
        }
        return null;
    };
    /**
     * 获取接收协议结构体
     * @param id 协议号
     */
    ByteArrayMsgByProtobuf.prototype.getS2CByProtoId = function (id) {
        if (this.protoConfig[id]) {
            return this.protoConfig[id].s2c;
        }
        return null;
    };
    return ByteArrayMsgByProtobuf;
}(ByteArrayMsg));
__reflect(ByteArrayMsgByProtobuf.prototype, "ByteArrayMsgByProtobuf");
/**
 * Created by yangsong on 2014/11/22.
 * Http数据缓存类
 */
var DynamicChange = (function () {
    function DynamicChange() {
        this._dataCache = [];
        this._pUpdate = new ProxyUpdate(this._dataCache);
    }
    Object.defineProperty(DynamicChange.prototype, "pUpdate", {
        get: function () {
            return this._pUpdate;
        },
        enumerable: true,
        configurable: true
    });
    DynamicChange.prototype.getCacheData = function (key) {
        if (this._dataCache[key]) {
            return this._dataCache[key];
        }
        return null;
    };
    DynamicChange.prototype.clearCache = function () {
        var keys = Object.keys(this._dataCache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            this._dataCache[key] = null;
            delete this._dataCache[key];
        }
    };
    DynamicChange.prototype.getCacheKeyInfos = function () {
        var results = [];
        var keys = Object.keys(this._dataCache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var k = this._dataCache[key];
            results.push(k);
        }
        return results;
    };
    DynamicChange.prototype.isCache = function (key) {
        return this._dataCache[key];
    };
    return DynamicChange;
}());
__reflect(DynamicChange.prototype, "DynamicChange");
/**
 * Created by yangsong on 2014/11/22.
 * Http数据更新类
 */
var ProxyUpdate = (function () {
    function ProxyUpdate(cache) {
        this._cache = cache;
    }
    ProxyUpdate.prototype.isArray = function (key) {
        return key instanceof Array;
    };
    ProxyUpdate.prototype.isObject = function (key) {
        return key.indexOf("object") > -1;
    };
    ProxyUpdate.prototype.isNormal = function (key) {
        var isAt = key.indexOf("@") > -1;
        var isDot = key.indexOf(".") > -1;
        var isUnderline = key.indexOf("_") > -1;
        return (!isAt && !isDot && !isUnderline);
    };
    ProxyUpdate.prototype.isAddToArray = function (key) {
        return (key == "@a");
    };
    ProxyUpdate.prototype.isRemoveToArray = function (key) {
        var arr = key.split("_");
        return (arr.length <= 3 && arr[0] == "@d");
    };
    ProxyUpdate.prototype.isFilter = function (key) {
        var arr = key.split("_");
        return (arr[0] == "@f");
    };
    ProxyUpdate.prototype.isNumeric = function (v) {
        return parseFloat(v).toString() == v.toString();
    };
    ProxyUpdate.prototype._updateObject = function (name, value, cacheData) {
        var arr = name.split(".");
        if (arr[0] == "@a" || arr[0] == "@s") {
            cacheData[arr[1]] = value;
        }
        else if (arr[0] == "@d") {
            delete cacheData[arr[1]];
        }
    };
    ProxyUpdate.prototype._getFilterObject = function (filter, cacheData) {
        if (cacheData) {
            var arr = filter.split("_");
            if (arr.length == 3 && arr[0] == "@f" && this.isArray(cacheData)) {
                var key = arr[1];
                var value = arr[2];
                for (var i = 0; i < cacheData.length; i++) {
                    var v = cacheData[i];
                    if (arr.length == 3 && this.isObject(v.toString())) {
                        var cacheValue = v[key];
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
    };
    ProxyUpdate.prototype._addObjectToArray = function (cacheData, changeValue) {
        if (this.isArray(changeValue)) {
            for (var i = 0; i < changeValue.length; i++) {
                cacheData.push(changeValue[i]);
            }
        }
        else {
            cacheData.push(changeValue);
        }
    };
    ProxyUpdate.prototype._removeObjectFromArray = function (cacheData, key, changeValue) {
        var arr = key.split("_");
        if (arr.length <= 3 && arr[0] == "@d") {
            if (this.isArray(cacheData)) {
                var count = cacheData.length;
                for (var i = count - 1; i >= 0; i--) {
                    var cacheDataItem = cacheData[i];
                    if (arr.length == 3) {
                        if (cacheDataItem.hasOwnProperty(arr[1])) {
                            var val = arr[2];
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
    };
    ProxyUpdate.prototype.update = function (key, data) {
        this._cache[key] = data;
        if (data.hasOwnProperty("c")) {
            var cdata = data["c"];
            var keys = Object.keys(cdata);
            for (var i = 0, len = keys.length; i < len; i++) {
                var k1 = keys[i];
                if (this._cache[k1]) {
                    this._update(this._cache[k1], cdata[k1]);
                    EventSystem.getInstance().dispatchEvent(k1 + "_HttpUpdate");
                }
            }
        }
    };
    ProxyUpdate.prototype._update = function (cacheData, changeData) {
        if (cacheData && changeData && this.isObject(changeData.toString())) {
            var keys = Object.keys(changeData);
            for (var i = 0, len = keys.length; i < len; i++) {
                var k = keys[i];
                var v = changeData[k];
                if (this.isNormal(k) && this.isObject(v.toString())) {
                    if (cacheData.hasOwnProperty(k)) {
                        this._update(cacheData[k], v);
                    }
                }
                else if (this.isNormal(k) && this.isNumeric(v)) {
                    var cv = cacheData[k];
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
                    var subCacheData = this._getFilterObject(k, cacheData);
                    if (subCacheData) {
                        this._update(subCacheData, v);
                    }
                }
                else {
                    this._updateObject(k, v, cacheData);
                }
            }
        }
    };
    return ProxyUpdate;
}());
__reflect(ProxyUpdate.prototype, "ProxyUpdate");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * A*寻路 2017/09/20.
 */
(function (aStar) {
    var Diagonal = (function (_super) {
        __extends(Diagonal, _super);
        function Diagonal() {
            return _super.call(this) || this;
        }
        Diagonal.each = function (start_point, end_point) {
            var w = 0;
            var h = 0;
            var __ox = 0;
            var __oy = 0;
            var __value = [];
            var __r = 0;
            var __n1 = 0;
            var __n2 = 0;
            var __b1;
            var __b2;
            var __m = 0;
            var __n = 0;
            var __d = (start_point.x < end_point.x) == (start_point.y < end_point.y);
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
                        if (!__b2) {
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
                        if (!__b2) {
                            __n++;
                            __d ? __value.push(new egret.Point(__ox + __n, __oy + __m)) : __value.push(new egret.Point(__ox + __n, __oy - __m));
                        }
                    }
                }
            }
            return __value;
        };
        return Diagonal;
    }(egret.HashObject));
    aStar.Diagonal = Diagonal;
    __reflect(Diagonal.prototype, "aStar.Diagonal");
})(aStar || (aStar = {}));
var Dictionary = (function () {
    function Dictionary(init) {
        this.$keys = [];
        this.$values = [];
        if (undefined != init) {
            var len = init.length;
            for (var i = 0; i < len; i++) {
                this[init[i].key] = init[i].value;
                this.$keys.push(init[i].key);
                this.$values.push(init[i].value);
            }
        }
    }
    Dictionary.prototype.Add = function (key, value) {
        this[key] = value;
        this.$keys.push(key);
        this.$values.push(value);
    };
    Dictionary.prototype.Remove = function (key) {
        var index = this.$keys.indexOf(key, 0);
        this.$keys.splice(index, 1);
        this.$values.splice(index, 1);
        delete this[key];
    };
    Dictionary.prototype.ContainsKey = function (key) {
        if (typeof this[key] === "undefined")
            return false;
        return true;
    };
    Dictionary.prototype.Clear = function () {
        var len = this.$keys.length;
        for (var i = 0; i < len; i++)
            delete this[this.$keys[i]];
        this.$keys = [];
        this.$values = [];
    };
    Dictionary.prototype.Keys = function () {
        return this.$keys;
    };
    Dictionary.prototype.Values = function () {
        return this.$values;
    };
    Dictionary.prototype.ToLookUp = function () {
        return this;
    };
    return Dictionary;
}());
__reflect(Dictionary.prototype, "Dictionary", ["IDictionary"]);
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 自动加载图片动画播放器 2017/09/20.
 */
var EffectMovieClip = (function (_super) {
    __extends(EffectMovieClip, _super);
    function EffectMovieClip() {
        return _super.call(this) || this;
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
    EffectMovieClip.prototype.playMCKey = function (mcKey, actName, times, defaultmc, callBackFun, callFun, thisBackObject) {
        if (actName === void 0) { actName = ""; }
        if (times === void 0) { times = 1; }
        if (defaultmc === void 0) { defaultmc = null; }
        if (callBackFun === void 0) { callBackFun = null; }
        if (callFun === void 0) { callFun = null; }
        if (thisBackObject === void 0) { thisBackObject = null; }
        _super.prototype.playMCKey.call(this, mcKey, actName, times, defaultmc, callBackFun, thisBackObject);
        this._callBack = callFun;
        this._thisEffectBackObject = thisBackObject;
        this.addEventListener(egret.Event.COMPLETE, this.effctComplete, this);
    };
    EffectMovieClip.prototype.effctComplete = function (e) {
        if (this._callBack && this._thisEffectBackObject) {
            this._callBack.call(this._thisEffectBackObject);
        }
        this.destroy();
    };
    EffectMovieClip.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this._thisEffectBackObject = null;
        this.removeEventListener(egret.Event.COMPLETE, this.effctComplete, this);
    };
    return EffectMovieClip;
}(AMovieClip));
__reflect(EffectMovieClip.prototype, "EffectMovieClip");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 事件系统 2017/09/20.
 */
var EventSystem = (function () {
    function EventSystem() {
        this._eventIDIndex = 0;
        this._eventlisteners = {};
        //egret.EventDispatcher
    }
    EventSystem.getInstance = function () {
        if (this._instance == null) {
            this._instance = new EventSystem();
        }
        return this._instance;
    };
    /**
    * 事件监听
    * @param eventName 事件名称
    * @param callFun 回掉函数
    * @param thisObject 执行函数对象
    * @return number 事件ID
    */
    EventSystem.prototype.addEventListener = function (eventName, callFun, thisObject) {
        this._eventIDIndex++;
        if (!this._eventlisteners[eventName]) {
            this._eventlisteners[eventName] = {};
        }
        var vo = new EventSyslistenerVO();
        vo.eId = this._eventIDIndex;
        vo.eName = eventName;
        vo.method = callFun;
        vo.thisObject = thisObject;
        this._eventlisteners[eventName][this._eventIDIndex] = vo;
        return this._eventIDIndex;
    };
    /**
    * 事件派发
    * @param eventName 事件名称
    * @param data 回掉函数数据
    * @param delay 延迟时间
    */
    EventSystem.prototype.dispatchEvent = function (eventName, data, delay) {
        if (data === void 0) { data = null; }
        if (delay === void 0) { delay = 0; }
        var obj = this._eventlisteners[eventName];
        if (delay > 0) {
            egret.setTimeout(function () {
                if (obj) {
                    var vo = void 0;
                    for (var key in obj) {
                        vo = obj[key];
                        if (vo.method && vo.thisObject) {
                            vo.method.call(vo.thisObject, data);
                        }
                    }
                }
            }, this, delay);
        }
        else {
            if (obj) {
                var vo = void 0;
                for (var key in obj) {
                    vo = obj[key];
                    if (vo.method && vo.thisObject) {
                        vo.method.call(vo.thisObject, data);
                    }
                }
            }
        }
    };
    /**
     * 移除事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有移除所有改事件名事件
     */
    EventSystem.prototype.removeEventListener = function (eventName, eventId) {
        if (eventId === void 0) { eventId = 0; }
        var obj = this._eventlisteners[eventName];
        if (obj) {
            if (eventId == 0) {
                for (var key in obj) {
                    var vo = obj[key];
                    vo.clear();
                }
                this._eventlisteners[eventName] = null;
                delete this._eventlisteners[eventName];
            }
            else if (obj[eventId]) {
                obj[eventId].clear();
                obj[eventId] = null;
                delete obj[eventId];
            }
        }
    };
    /**
     * 是否存在事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有返回是否有该事件名事件
     */
    EventSystem.prototype.hasEventListener = function (eventName, eventId) {
        if (eventId === void 0) { eventId = 0; }
        var obj = this._eventlisteners[eventName];
        if (obj) {
            if (eventId == 0) {
                return true;
            }
            else {
                if (obj[eventId]) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return false;
    };
    EventSystem.prototype.log = function () {
        console.log(this._eventlisteners);
    };
    return EventSystem;
}());
__reflect(EventSystem.prototype, "EventSystem");
var EventSyslistenerVO = (function () {
    function EventSyslistenerVO() {
        this.eId = 0;
        this.eName = "";
        this.delay = 0;
    }
    /**清理*/
    EventSyslistenerVO.prototype.clear = function () {
        this.eId = 0;
        this.eName = "";
        this.delay = 0;
        this.method = null;
        this.thisObject = null;
    };
    return EventSyslistenerVO;
}());
__reflect(EventSyslistenerVO.prototype, "EventSyslistenerVO");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 计时器 2017/09/20.
 */
var GlobalTimer = (function () {
    function GlobalTimer() {
        this._timerId = 0;
        this._hashObject = {};
        this._count = 0;
    }
    GlobalTimer.getInstance = function () {
        if (this._instance == null) {
            this._instance = new GlobalTimer();
        }
        return this._instance;
    };
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
    GlobalTimer.prototype.addSchedule = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this._timerId++;
        this._count++;
        //创建
        var vo = ObjectPool.pop("GlobalTimerVO"); //new GlobalTimerVO();
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
    };
    /**
     * 添加帧调度
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @return number 计时器ID
     */
    GlobalTimer.prototype.addFrameSchedule = function (method, methodObj) {
        this._timerId++;
        this._count++;
        //创建
        var vo = ObjectPool.pop("GlobalTimerVO"); //new GlobalTimerVO();
        vo.tType = 2;
        vo.tId = this._timerId;
        vo.method2 = method;
        vo.methodObj = methodObj;
        this._hashObject[this._timerId] = vo;
        egret.startTick(method, methodObj);
        return this._timerId;
    };
    /**
     * 移除计时器
     * @param timerId 计时器ID
     */
    GlobalTimer.prototype.remove = function (timerId) {
        if (this._hashObject[timerId]) {
            this._count--;
            var vo = this._hashObject[timerId];
            if (vo.tType == 1) {
                if (vo.curTimer) {
                    vo.curTimer.stop();
                    if (vo.method && vo.methodObj) {
                        vo.curTimer.removeEventListener(egret.TimerEvent.TIMER, vo.method, vo.methodObj);
                    }
                    if (vo.completeMethod && vo.completeMethodObj) {
                        vo.curTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, vo.timeComplete, vo);
                    }
                }
            }
            else if (vo.tType == 2) {
                if (vo.method2) {
                    egret.stopTick(vo.method2, vo.methodObj);
                }
            }
            vo.clear();
            ObjectPool.push(this._hashObject[timerId]);
            this._hashObject[timerId] = null;
            delete this._hashObject[timerId];
        }
    };
    /**
     * 移除所有计时器
     */
    GlobalTimer.prototype.removeAll = function () {
        for (var key in this._hashObject) {
            var vo = this._hashObject[key];
            if (vo.tType == 1) {
                if (vo.curTimer) {
                    if (vo.method && vo.methodObj) {
                        vo.curTimer.removeEventListener(egret.TimerEvent.TIMER, vo.method, vo.methodObj);
                    }
                    if (vo.completeMethod && vo.completeMethodObj) {
                        vo.curTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, vo.timeComplete, vo);
                    }
                    vo.curTimer.stop();
                }
            }
            else if (vo.tType == 2) {
                if (vo.method2) {
                    egret.stopTick(vo.method2, vo.methodObj);
                }
            }
            vo.clear();
        }
        this._hashObject = {};
        this._count = 0;
    };
    /**
     * 计时器是否存在
     * @param timerId 计时器ID
     * @return boolean
     */
    GlobalTimer.prototype.isExists = function (timerId) {
        if (this._hashObject[timerId]) {
            return true;
        }
        return false;
    };
    /**
     * 计时器是否存在
     * @param method 调度函数
     * @return boolean
     */
    GlobalTimer.prototype.isExistsByFun = function (method) {
        for (var key in this._hashObject) {
            var vo = this._hashObject[key];
            if (vo.method == method) {
                return true;
            }
        }
        return false;
    };
    /**
     * 帧调度计时器是否存在
     * @param method 帧调度函数
     * @return boolean
     */
    GlobalTimer.prototype.isExistsFrameByFun = function (method) {
        for (var key in this._hashObject) {
            var vo = this._hashObject[key];
            if (vo.method2 == method) {
                return true;
            }
        }
        return false;
    };
    GlobalTimer.prototype.printLog = function () {
        for (var key in this._hashObject) {
            var vo = this._hashObject[key];
            console.log("timerId = " + vo.tId);
        }
    };
    return GlobalTimer;
}());
__reflect(GlobalTimer.prototype, "GlobalTimer");
var GlobalTimerVO = (function () {
    function GlobalTimerVO() {
        /*类型*/
        this.tType = 0;
        this.tId = 0;
        this.repeatCount = 0;
        this.delay = 0;
    }
    /**清理*/
    GlobalTimerVO.prototype.clear = function () {
        this.tType = 0;
        this.tId = 0;
        this.curTimer = null;
        this.method = null;
        this.method2 = null;
        this.methodObj = null;
        this.completeMethod = null;
        this.completeMethodObj = null;
    };
    GlobalTimerVO.prototype.timeComplete = function () {
        if (this.completeMethodObj && this.completeMethod) {
            this.completeMethod.call(this.completeMethodObj);
        }
        if (GlobalTimer.getInstance().isExists(this.tId)) {
            GlobalTimer.getInstance().remove(this.tId);
        }
    };
    return GlobalTimerVO;
}());
__reflect(GlobalTimerVO.prototype, "GlobalTimerVO");
/**
 * Created by yangsong on 2014/11/22.
 * Http请求处理
 */
var Http = (function () {
    /**
     * 构造函数
     */
    function Http() {
        this.loginKey = "507310f58a0ac8e3d8ad8f60c8b85b46h5mt";
        this._data = new DynamicChange();
        this._cache = [];
        this._request = new egret.URLRequest();
        this._request.method = egret.URLRequestMethod.POST;
        this._urlLoader = new egret.URLLoader();
        this._urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
    }
    Http.getInstance = function () {
        if (this._instance == null) {
            this._instance = new Http();
        }
        return this._instance;
    };
    /**
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
    Http.prototype.initServer = function (serverUrl) {
        this._serverUrl = serverUrl;
    };
    Object.defineProperty(Http.prototype, "Data", {
        /**
         * 数据缓存
         * @returns {DynamicChange}
         * @constructor
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Http错误处理函数
     * @param e
     */
    Http.prototype.onError = function (e) {
        this.nextPost();
    };
    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    Http.prototype.send = function (type, urlVariables) {
        this._cache.push([type, urlVariables]);
        this.post();
    };
    /**
     * 请求服务器
     */
    Http.prototype.post = function () {
        if (this._isRequesting) {
            return;
        }
        if (this._cache.length == 0) {
            return;
        }
        var arr = this._cache.shift();
        var type = arr[0];
        var urlVariables = arr[1];
        this._type = type;
        this._request.url = this._serverUrl;
        this._request.data = urlVariables;
        this._urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        this._urlLoader.load(this._request);
        this._isRequesting = true;
    };
    /**
     * 数据返回
     * @param event
     */
    Http.prototype.onLoaderComplete = function (event) {
        this._urlLoader.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        var t_obj = JSON.parse(this._urlLoader.data);
        if (!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
            this._data.pUpdate.update(this._type, t_obj);
            EventSystem.getInstance().dispatchEvent(this._type, t_obj);
        }
        else {
            //Log.trace("Http错误:" + t_obj["s"]);
        }
        this.nextPost();
    };
    /**
     * 开始下一个请求
     */
    Http.prototype.nextPost = function () {
        this._isRequesting = false;
        this.post();
    };
    return Http;
}());
__reflect(Http.prototype, "Http");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * Http请求
 */
var HttpRequest = (function (_super) {
    __extends(HttpRequest, _super);
    function HttpRequest(url, param, thisObject, backFun, errorbackFun, httpMethod) {
        if (errorbackFun === void 0) { errorbackFun = null; }
        if (httpMethod === void 0) { httpMethod = egret.HttpMethod.GET; }
        var _this = _super.call(this) || this;
        _this._url = url;
        _this._httpMethod = httpMethod;
        _this._errorBack = errorbackFun;
        _this._completeBack = backFun;
        _this._param = param;
        _this._thisObject = thisObject;
        _this.requestUrl();
        return _this;
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
    HttpRequest.prototype.requestUrl = function () {
        if (this._httpMethod == egret.HttpMethod.GET) {
            this.responseType = egret.HttpResponseType.TEXT;
            // 参数格式 "?p1=getP1&p2=getP2";
            this.open(this._url + this._param, egret.HttpMethod.GET);
            this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            //this.setRequestHeader("Access-Control-Allow-Origin", "*");
            this.send();
        }
        else {
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
    };
    HttpRequest.prototype.onGetComplete = function (event) {
        var request = event.currentTarget;
        //console.log("get data : ",request.response);
        if (this._errorBack) {
            this._errorBack = null;
        }
        if (this._completeBack) {
            this._completeBack.call(this._thisObject, JSON.parse(request.response));
            this._completeBack = null;
        }
        this._thisObject = null;
    };
    HttpRequest.prototype.onGetIOError = function (event) {
        if (this._errorBack) {
            this._errorBack.call(this._thisObject);
            this._errorBack = null;
        }
        if (this._completeBack) {
            this._completeBack = null;
        }
        this._thisObject = null;
    };
    return HttpRequest;
}(egret.HttpRequest));
__reflect(HttpRequest.prototype, "HttpRequest");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * A*寻路 2017/09/20.
 */
(function (aStar) {
    var MathUtil = (function (_super) {
        __extends(MathUtil, _super);
        function MathUtil() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MathUtil.getLineFunc = function (ponit1, point2, type) {
            if (type === void 0) { type = 0; }
            var resultFuc;
            if (ponit1.x == point2.x) {
                if (type == 0) {
                    //throw new flash.Error("两点所确定直线垂直于y轴，不能根据x值得到y值").message;
                }
                else if (type == 1) {
                    resultFuc = function (y) {
                        return ponit1.x;
                    };
                }
                return resultFuc;
            }
            else if (ponit1.y == point2.y) {
                if (type == 0) {
                    resultFuc = function (x) {
                        return ponit1.y;
                    };
                }
                else if (type == 1) {
                    //throw new flash.Error("两点所确定直线垂直于y轴，不能根据x值得到y值").message;
                }
                return resultFuc;
            }
            var a = 0;
            a = (ponit1.y - point2.y) / (ponit1.x - point2.x);
            var b = 0;
            b = ponit1.y - a * ponit1.x;
            if (type == 0) {
                resultFuc = function (x) {
                    return a * x + b;
                };
            }
            else if (type == 1) {
                resultFuc = function (y) {
                    return (y - b) / a;
                };
            }
            return resultFuc;
        };
        MathUtil.getSlope = function (ponit1, point2) {
            return (point2.y - ponit1.y) / (point2.x - ponit1.x);
        };
        return MathUtil;
    }(egret.HashObject));
    aStar.MathUtil = MathUtil;
    __reflect(MathUtil.prototype, "aStar.MathUtil");
})(aStar || (aStar = {}));
/**
 * Mc资源加载缓存器
 */
//场景事件
var MCSourceCacheEventType = {
    COMPLETE: "mcloadcomEvt",
};
var McSourceCache = (function () {
    function McSourceCache() {
        this.mcdFactoryDic = {};
        this.isLoadDic = {};
        this.isInitDefaultmc = false;
        this._eventSystem = EventSystem.getInstance();
    }
    McSourceCache.getInstance = function () {
        if (this._instance == null) {
            this._instance = new McSourceCache();
        }
        return this._instance;
    };
    McSourceCache.prototype.initDefaultMc = function () {
        if (this.isInitDefaultmc == false) {
            this.isInitDefaultmc = true;
            var mcdFactory = new egret.MovieClipDataFactory(RES.getRes("defaultmc_json"), RES.getRes("defaultmc_png"));
            this.mcdFactoryDic["defaultmc"] = new McSourceCacheVo("defaultmc", mcdFactory);
        }
    };
    /**
     * 按时更新
     */
    McSourceCache.prototype.update = function () {
        this.gc();
    };
    /**
     * 按时间和引用次数清理无用资源
     */
    McSourceCache.prototype.gc = function () {
        var vo;
        var curtime = Date.now();
        var bigtime = 60 * 2;
        for (var key in this.mcdFactoryDic) {
            vo = this.mcdFactoryDic[key];
            if (vo.regNum <= 0 && curtime - vo.useTime > bigtime) {
                vo.dataFactory.clearCache();
                this.mcdFactoryDic[key] = null;
                delete this.mcdFactoryDic[key];
                RES.destroyRes(key + "_json");
                RES.destroyRes(key + "_png");
            }
        }
    };
    /**
     * 销毁所有资源
     */
    McSourceCache.prototype.destroy = function () {
        var vo;
        //var curtime:number = Date.now();
        //var bigtime:number = 60*2;
        for (var key in this.mcdFactoryDic) {
            vo = this.mcdFactoryDic[key];
            //if(vo.regNum <= 0 && curtime - vo.useTime > bigtime){
            vo.dataFactory.clearCache();
            this.mcdFactoryDic[key] = null;
            delete this.mcdFactoryDic[key];
            RES.destroyRes(key + "_json");
            //}
        }
    };
    /**
     * 是否加载
     * @param key 资源Key
     * @return boolean
     */
    McSourceCache.prototype.isLoading = function (key) {
        return this.isLoadDic[key];
    };
    /**
     * 获取序列帧数据MovieClipData
     * @param key 资源Key
     * @param mcName 动作名称
     * @return any MovieClipData
     */
    McSourceCache.prototype.getObject = function (key, actName) {
        if (actName === void 0) { actName = ""; }
        var vo = this.mcdFactoryDic[key];
        if (vo) {
            vo.regNum++;
            vo.useTime = Date.now();
            if (actName == "") {
                actName = key;
            }
            return vo.dataFactory.generateMovieClipData(actName);
        }
        return null;
    };
    /**
     * 移除序列帧数据使用
     * @param key 资源Key
     */
    McSourceCache.prototype.removeObject = function (key) {
        var vo = this.mcdFactoryDic[key];
        if (vo) {
            vo.regNum--;
            if (vo.regNum < 0) {
                vo.regNum = 0;
            }
            vo.useTime = Date.now();
        }
    };
    /**
     * 是否存在资源缓存
     * @param key 资源Key
     * @return boolean
     */
    McSourceCache.prototype.has = function (key) {
        return this.mcdFactoryDic[key] != undefined;
    };
    /**
     * 加载资源
     * @param key 资源Key
     */
    McSourceCache.prototype.load = function (key) {
        if (this.mcdFactoryDic[key] != undefined) {
            this._eventSystem.dispatchEvent(MCSourceCacheEventType.COMPLETE, key);
            return;
        }
        if (this.isLoadDic[key]) {
            return;
        }
        var textureData;
        var texture;
        function onLoadTextureDataComplete(data) {
            textureData = data;
            RES.getResAsync(key + "_png", onLoadTextureComplete, this);
        }
        function onLoadTextureComplete(data) {
            texture = data;
            // if(textureData && texture){
            // 	let mcdFactory = new egret.MovieClipDataFactory(textureData, texture);
            // 	this.mcdFactoryDic[key] = new McSourceCacheVo(key,mcdFactory);
            // }
            var mcdFactory = new egret.MovieClipDataFactory(textureData, texture);
            this.mcdFactoryDic[key] = new McSourceCacheVo(key, mcdFactory);
            this._eventSystem.dispatchEvent(MCSourceCacheEventType.COMPLETE, key);
            this.isLoadDic[key] = false;
        }
        this.isLoadDic[key] = true;
        RES.getResAsync(key + "_json", onLoadTextureDataComplete, this);
    };
    /**
    * 事件监听
    * @param eventName 事件名称
    * @param callFun 回掉函数
    * @param thisObject 执行函数对象
    * @return number 事件ID
    */
    McSourceCache.prototype.addEventListener = function (eventName, callFun, thisObject) {
        return this._eventSystem.addEventListener(eventName, callFun, thisObject);
    };
    /**
     * 移除事件
     * @param eventName 事件名称
     * @param eventId 事件ID，没有移除所有改事件名事件
     */
    McSourceCache.prototype.removeEventListener = function (eventName, eventId) {
        if (eventId === void 0) { eventId = 0; }
        this._eventSystem.removeEventListener(eventName, eventId);
    };
    return McSourceCache;
}());
__reflect(McSourceCache.prototype, "McSourceCache");
/**
 * mc资源缓存VO
 */
var McSourceCacheVo = (function () {
    function McSourceCacheVo(key, dataFactory, tType) {
        if (tType === void 0) { tType = 0; }
        /*类型*/
        this.tType = 0;
        this.key = ""; //资源Key
        this.regNum = 0; //注册数
        this.useTime = 0; //使用时间
        this.tType = tType;
        this.key = key;
        this.dataFactory = dataFactory;
        this.regNum = 0;
        this.useTime = Date.now();
    }
    return McSourceCacheVo;
}());
__reflect(McSourceCacheVo.prototype, "McSourceCacheVo");
/**
 * Created by yangsong on 2014/11/22.
 * 对象池类
 */
var ObjectPool = (function () {
    /**
     * 构造函数
     */
    function ObjectPool() {
        this._objs = new Array();
    }
    /**
     * 放回一个对象
     * @param obj
     */
    ObjectPool.prototype.pushObj = function (obj) {
        this._objs.push(obj);
    };
    /**
     * 取出一个对象
     * @returns {*}
     */
    ObjectPool.prototype.popObj = function () {
        if (this._objs.length > 0) {
            return this._objs.pop();
        }
        else {
            return null;
        }
    };
    /**
     * 清除所有缓存对象
     */
    ObjectPool.prototype.clear = function () {
        while (this._objs.length > 0) {
            this._objs.pop();
        }
    };
    /**
     * 取出一个对象
     * @param classZ Class
     * @return Object
     *
     */
    ObjectPool.pop = function (refKey) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!ObjectPool._content[refKey]) {
            ObjectPool._content[refKey] = [];
        }
        var list = ObjectPool._content[refKey];
        if (list.length) {
            return list.pop();
        }
        else {
            var classZ = egret.getDefinitionByName(refKey);
            var argsLen = args.length;
            var obj;
            if (argsLen == 0) {
                obj = new classZ();
            }
            else if (argsLen == 1) {
                obj = new classZ(args[0]);
            }
            else if (argsLen == 2) {
                obj = new classZ(args[0], args[1]);
            }
            else if (argsLen == 3) {
                obj = new classZ(args[0], args[1], args[2]);
            }
            else if (argsLen == 4) {
                obj = new classZ(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen == 5) {
                obj = new classZ(args[0], args[1], args[2], args[3], args[4]);
            }
            obj.ObjectPoolKey = refKey;
            return obj;
        }
    };
    /**
     * 取出一个对象
     * @param refKey Class
     * @param extraKey 标识值
     * @returns {any}
     */
    ObjectPool.popWithExtraKey = function (refKey, extraKey) {
        if (!ObjectPool._content[refKey]) {
            ObjectPool._content[refKey] = [];
        }
        var obj;
        var list = ObjectPool._content[refKey];
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
            var classZ = egret.getDefinitionByName(refKey);
            obj = new classZ(extraKey);
            obj.extraKey = extraKey;
            obj.ObjectPoolKey = refKey;
        }
        return obj;
    };
    /**
     * 放入一个对象
     * @param obj
     *
     */
    ObjectPool.push = function (obj) {
        if (obj == null) {
            return false;
        }
        var refKey = obj.ObjectPoolKey;
        //保证只有pop出来的对象可以放进来，或者是已经清除的无法放入
        if (!ObjectPool._content[refKey]) {
            return false;
        }
        ObjectPool._content[refKey].push(obj);
        return true;
    };
    /**
     * 清除所有对象
     */
    ObjectPool.clear = function () {
        ObjectPool._content = {};
    };
    /**
     * 清除某一类对象
     * @param classZ Class
     * @param clearFuncName 清除对象需要执行的函数
     */
    ObjectPool.clearClass = function (refKey, clearFuncName) {
        if (clearFuncName === void 0) { clearFuncName = null; }
        var list = ObjectPool._content[refKey];
        while (list && list.length) {
            var obj = list.pop();
            if (clearFuncName) {
                obj[clearFuncName]();
            }
            obj = null;
        }
        ObjectPool._content[refKey] = null;
        delete ObjectPool._content[refKey];
    };
    /**
     * 缓存中对象统一执行一个函数
     * @param classZ Class
     * @param dealFuncName 要执行的函数名称
     */
    ObjectPool.dealFunc = function (refKey, dealFuncName) {
        var list = ObjectPool._content[refKey];
        if (list == null) {
            return;
        }
        var i = 0;
        var len = list.length;
        for (i; i < len; i++) {
            list[i][dealFuncName]();
        }
    };
    ObjectPool._content = {};
    return ObjectPool;
}());
__reflect(ObjectPool.prototype, "ObjectPool");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 协议管理 2017/09/20.
 */
var ProtocalManager = (function () {
    function ProtocalManager() {
        this._protocalDic = {};
    }
    ProtocalManager.getInstance = function () {
        if (this._instance == null) {
            this._instance = new ProtocalManager();
        }
        return this._instance;
    };
    /**
     * 注册协议
     * @param pId 协议ID
     * @param backFun 回掉函数
     */
    ProtocalManager.prototype.registerProtocal = function (pId, callFun, thisObject) {
        var vo = new ProtocalManagerVO();
        vo.pId = pId;
        vo.method = callFun;
        vo.thisObject = thisObject;
        this._protocalDic[pId] = vo;
    };
    /**
     * 清除协议注册
     * @param pId 协议ID
     * @param backFun 回掉函数
     */
    ProtocalManager.prototype.unRegisterProtocal = function (pId) {
        if (this._protocalDic[pId]) {
            this._protocalDic[pId] = null;
            delete this._protocalDic[pId];
        }
    };
    /**
     * 执行协议
     * @param pId 协议ID
     * @param data 数据
     */
    ProtocalManager.prototype.runProtocal = function (pId, data) {
        if (this._protocalDic[pId]) {
            var vo = this._protocalDic[pId];
            if (vo.method && vo.thisObject) {
                vo.method.call(vo.thisObject, data);
            }
        }
    };
    /**
     * 发送协议
     * @param pId 协议ID
     * @param data 数据
     */
    ProtocalManager.prototype.sendProtocal = function (pId, data) {
        Socket.getInstance().send(pId, data);
    };
    return ProtocalManager;
}());
__reflect(ProtocalManager.prototype, "ProtocalManager");
var ProtocalManagerVO = (function () {
    function ProtocalManagerVO() {
        /*协议ID*/
        this.pId = 0;
    }
    /**清理*/
    ProtocalManagerVO.prototype.clear = function () {
        this.pId = 0;
        this.method = null;
        this.thisObject = null;
    };
    return ProtocalManagerVO;
}());
__reflect(ProtocalManagerVO.prototype, "ProtocalManagerVO");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 富文本 2017/12/26.
 * 使用容器预留表情功能
 */
var RichTextField = (function (_super) {
    __extends(RichTextField, _super);
    function RichTextField(w) {
        if (w === void 0) { w = 200; }
        var _this = _super.call(this) || this;
        _this._textField = new egret.TextField();
        _this.addChild(_this._textField);
        //this._textField.width = this.width; 
        _this._textField.touchEnabled = true;
        _this._textField.addEventListener(egret.TextEvent.LINK, function (evt) {
            EventSystem.getInstance().dispatchEvent(RichTextField.LINK_EVENT, evt.text);
        }, _this);
        _this.touchEnabled = false;
        _this.width = w;
        return _this;
    }
    Object.defineProperty(RichTextField.prototype, "textFlow", {
        /**
         * 设置样式文本
         *  var arr:any = new Array<egret.ITextElement>(
         *     { text:"这段文字有链接", style: { "href" : "event:text event win_role_89" } },
         *     { text:"这段文字没链接", style: {} }
         *   );
         */
        set: function (arr) {
            if (this._textField && arr) {
                this._textField.textFlow = arr;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RichTextField.prototype, "textHtml", {
        /**
         * 设置html标签文本
         * 列如：'没有任何格式初始文本，<font fontfamily="Verdana" href="event:item_12345_21">Verdana blue large</font><font color="#ff7f50" size="10">珊瑚色<b>局部加粗</b>小字体</font><i>斜体</i>'
         */
        set: function (str) {
            if (this._textField && str) {
                this._textField.textFlow = (new egret.HtmlTextParser).parser(str);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RichTextField.prototype, "lineSpacing", {
        set: function (v) {
            if (this._textField) {
                this._textField.lineSpacing = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RichTextField.prototype, "size", {
        set: function (v) {
            if (this._textField) {
                this._textField.size = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RichTextField.prototype, "width", {
        get: function () {
            if (this._textField) {
                return this._textField.width;
            }
            return _super.prototype.$getWidth.call(this);
        },
        set: function (v) {
            if (this._textField) {
                this._textField.width = v;
            }
            _super.prototype.$setWidth.call(this, v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RichTextField.prototype, "height", {
        get: function () {
            if (this._textField) {
                return this._textField.height;
            }
            return _super.prototype.$getHeight.call(this);
        },
        set: function (v) {
            if (this._textField) {
                this._textField.height = v;
            }
            _super.prototype.$setHeight.call(this, v);
        },
        enumerable: true,
        configurable: true
    });
    RichTextField.LINK_EVENT = "LINK_EVENT";
    return RichTextField;
}(egret.DisplayObjectContainer));
__reflect(RichTextField.prototype, "RichTextField");
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
var Socket = (function () {
    /**
     * 构造函数
     */
    function Socket() {
        this._needReconnect = true;
        this._maxReconnectCount = 3;
        this._reconnectCount = 0;
        this._timeOutId = 0;
    }
    Socket.getInstance = function () {
        if (this._instance == null) {
            this._instance = new Socket();
        }
        return this._instance;
    };
    Socket.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log("Socket", args.toString());
    };
    /**
     * 添加事件监听
     */
    Socket.prototype.addEvents = function () {
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
    };
    /**
     * 移除事件监听
     */
    Socket.prototype.removeEvents = function () {
        if (this._socket) {
            this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this._socket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this._socket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        }
    };
    /**
     * 服务器连接成功
     */
    Socket.prototype.onSocketOpen = function () {
        //this._reconnectCount = 0;
        this._isConnecting = true;
        if (this._connectFlag) {
            EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_RECONNECT);
        }
        else {
            EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_CONNECT);
        }
        this._connectFlag = true;
    };
    /**
     * 服务器断开连接
     */
    Socket.prototype.onSocketClose = function () {
        this._isConnecting = false;
        EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_CLOSE);
    };
    /**
     * 服务器连接错误
     */
    Socket.prototype.onSocketError = function () {
        this._isConnecting = false;
        EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_NOCONNECT);
    };
    /**
     * 收到服务器消息
     * @param e
     */
    Socket.prototype.onReceiveMessage = function (e) {
        this._msg.receive(this._socket);
    };
    /**
     * 初始化服务区地址
     * @param host IP
     * @param port 端口
     * @param msg 消息发送接受处理类
     */
    Socket.prototype.initServer = function (host, port, msg) {
        this._host = host;
        this._port = port;
        this._msg = msg;
    };
    /**
     * 开始Socket连接
     */
    Socket.prototype.connect = function () {
        this._reconnectCount = 0;
        this.connectSocket();
    };
    /**
     * 开始Socket连接
     */
    Socket.prototype.connectSocket = function () {
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
    };
    /**
     * 重新连接
     */
    Socket.prototype.reconnect = function () {
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
    };
    /**
     * 重连socket
     */
    Socket.prototype.reconnectSocket = function () {
        this._timeOutId = 0;
        App.logzsq("SOCKET 重新连接 reconnectSocket");
        this.closeCurrentSocket();
        this._reconnectCount++;
        if (this._reconnectCount < this._maxReconnectCount) {
            EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_START_RECONNECT);
            this.connectSocket();
        }
        else {
            EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_NOCONNECT);
        }
    };
    /**
     * 发送消息到服务器
     * @param msg
     */
    Socket.prototype.send = function (protoId, msg) {
        if (this._isConnecting) {
            var newMsg = {};
            newMsg.id = protoId;
            newMsg.body = msg;
            this._msg.send(this._socket, newMsg);
        }
        else {
            //Utils.MsgUtils.addMidMsg("连接已断开，请刷新界面");
            if (this._needReconnect) {
                App.logzsq("SOCKET 发送发现断线");
                // this.reconnect();
            }
        }
    };
    /**
     * 关闭Socket连接
     */
    Socket.prototype.close = function () {
        this._connectFlag = false;
        this.closeCurrentSocket();
    };
    /**
     * 清理当前的Socket连接
     */
    Socket.prototype.closeCurrentSocket = function () {
        this.removeEvents();
        if (this._socket) {
            this._socket.close();
            this._socket = null;
        }
        this._isConnecting = false;
    };
    /**
     * Socket是否在连接中
     * @returns {boolean}
     */
    Socket.prototype.isConnecting = function () {
        return this._isConnecting;
    };
    /**
     * Debug信息
     * @param str
     */
    Socket.prototype.debugInfo = function (str) {
        EventSystem.getInstance().dispatchEvent(SocketConst.SOCKET_DEBUG_INFO, str);
    };
    return Socket;
}());
__reflect(Socket.prototype, "Socket");
/**
 * Created by yangsong on 2014/11/25.
 * Socket使用常量
 */
var SocketConst = (function () {
    function SocketConst() {
    }
    /**
     * Socket已经连接上
     * @type {string}
     */
    SocketConst.SOCKET_CONNECT = "SOCKET_CONNECT";
    /**
     * Socket重新连接上
     * @type {string}
     */
    SocketConst.SOCKET_RECONNECT = "SOCKET_RECONNECT";
    /**
     * Socket开始重新连接上
     * @type {string}
     */
    SocketConst.SOCKET_START_RECONNECT = "SOCKET_START_RECONNECT";
    /**
     * Socket已关闭
     * @type {string}
     */
    SocketConst.SOCKET_CLOSE = "SOCKET_CLOSE";
    /*
     * socket收到消息
     * */
    SocketConst.SOCKET_DATA = "SOCKET_DATA";
    /**
     * Socket不能连接上
     * @type {string}
     */
    SocketConst.SOCKET_NOCONNECT = "SOCKET_NOCONNECT";
    /**
     * Socketdebug的消息
     * @type {string}
     */
    SocketConst.SOCKET_DEBUG_INFO = "SOCKET_DEBUG_INFO";
    return SocketConst;
}());
__reflect(SocketConst.prototype, "SocketConst");
/**
 * Created by yangsong on 15-1-14.
 * 背景音乐类
 */
var SoundBg = (function (_super) {
    __extends(SoundBg, _super);
    /**
     * 构造函数
     */
    function SoundBg() {
        var _this = _super.call(this) || this;
        _this._currBg = "";
        return _this;
    }
    /**
     * 停止当前音乐
     */
    SoundBg.prototype.stop = function () {
        if (this._currSoundChannel) {
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
        this._currSound = null;
        this._currBg = "";
    };
    /**
     * 播放某个音乐
     * @param effectName
     */
    SoundBg.prototype.play = function (effectName) {
        if (this._currBg == effectName)
            return;
        this.stop();
        this._currBg = effectName;
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    };
    /**
     * 播放
     * @param sound
     */
    SoundBg.prototype.playSound = function (sound) {
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play(0, 1);
        this._currSoundChannel.volume = this._volume;
    };
    /**
     * 设置音量
     * @param volume
     */
    SoundBg.prototype.setVolume = function (volume) {
        this._volume = volume;
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    };
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    SoundBg.prototype.loadedPlay = function (key) {
        if (this._currBg == key) {
            this.playSound(RES.getRes(key));
        }
    };
    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    SoundBg.prototype.checkCanClear = function (key) {
        return this._currBg != key;
    };
    return SoundBg;
}(BaseSound));
__reflect(SoundBg.prototype, "SoundBg");
/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
var SoundEffects = (function (_super) {
    __extends(SoundEffects, _super);
    /**
     * 构造函数
     */
    function SoundEffects() {
        return _super.call(this) || this;
    }
    /**
     * 播放一个音效
     * @param effectName
     */
    SoundEffects.prototype.play = function (effectName) {
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    };
    /**
     * 播放
     * @param sound
     */
    SoundEffects.prototype.playSound = function (sound) {
        var channel = sound.play(0, 1);
        channel.volume = this._volume;
    };
    /**
     * 设置音量
     * @param volume
     */
    SoundEffects.prototype.setVolume = function (volume) {
        this._volume = volume;
    };
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    SoundEffects.prototype.loadedPlay = function (key) {
        this.playSound(RES.getRes(key));
    };
    return SoundEffects;
}(BaseSound));
__reflect(SoundEffects.prototype, "SoundEffects");
/**
 * Created by yangsong on 15-1-14.
 * Sound管理类
 */
var SoundManager = (function (_super) {
    __extends(SoundManager, _super);
    /**
     * 构造函数
     */
    function SoundManager() {
        var _this = _super.call(this) || this;
        _this.bgOn = true;
        _this.effectOn = true;
        _this.bgVolume = 0.5;
        _this.effectVolume = 0.5;
        _this.bg = new SoundBg();
        _this.bg.setVolume(_this.bgVolume);
        _this.effect = new SoundEffects();
        _this.effect.setVolume(_this.effectVolume);
        return _this;
    }
    /**
     * 播放音效
     * @param effectName
     */
    SoundManager.prototype.playEffect = function (effectName) {
        if (!this.effectOn)
            return;
        this.effect.play(effectName);
    };
    /**
     * 播放背景音乐
     * @param key
     */
    SoundManager.prototype.playBg = function (bgName) {
        this.currBg = bgName;
        if (!this.bgOn)
            return;
        this.bg.play(bgName);
    };
    /**
     * 停止背景音乐
     */
    SoundManager.prototype.stopBg = function () {
        this.bg.stop();
    };
    /**
     * 设置音效是否开启
     * @param $isOn
     */
    SoundManager.prototype.setEffectOn = function ($isOn) {
        this.effectOn = $isOn;
    };
    /**
     * 设置背景音乐是否开启
     * @param $isOn
     */
    SoundManager.prototype.setBgOn = function ($isOn) {
        this.bgOn = $isOn;
        if (!this.bgOn) {
            this.stopBg();
        }
        else {
            if (this.currBg) {
                this.playBg(this.currBg);
            }
        }
    };
    /**
     * 设置背景音乐音量
     * @param volume
     */
    SoundManager.prototype.setBgVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.bgVolume = volume;
        this.bg.setVolume(this.bgVolume);
    };
    /**
     * 获取背景音乐音量
     * @returns {number}
     */
    SoundManager.prototype.getBgVolume = function () {
        return this.bgVolume;
    };
    /**
     * 设置音效音量
     * @param volume
     */
    SoundManager.prototype.setEffectVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.effectVolume = volume;
        this.effect.setVolume(this.effectVolume);
    };
    /**
     * 获取音效音量
     * @returns {number}
     */
    SoundManager.prototype.getEffectVolume = function () {
        return this.effectVolume;
    };
    /**
     * 音乐文件清理时间
     * @type {number}
     */
    SoundManager.CLEAR_TIME = 3 * 60 * 1000;
    return SoundManager;
}(BaseClass));
__reflect(SoundManager.prototype, "SoundManager");
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * A*寻路 2017/09/20.
 */
(function (aStar) {
    var TileUtil = (function () {
        function TileUtil() {
        }
        TileUtil.changeXToTile = function (num) {
            return Math.round(num / TileUtil.tileWidth);
        };
        TileUtil.changeYToTile = function (num) {
            return Math.round(num / TileUtil.tileHeight);
        };
        TileUtil.changeXToPixs = function (num) {
            return num * TileUtil.tileWidth + TileUtil.tileWidth / 2;
        };
        TileUtil.changeYToPixs = function (num) {
            return num * TileUtil.tileHeight + TileUtil.tileHeight / 2;
        };
        TileUtil.picWidth = 300;
        TileUtil.picHeight = 300;
        TileUtil.tileWidth = 64;
        TileUtil.tileHeight = 64;
        TileUtil.tileRows = 300;
        TileUtil.tileCols = 400;
        TileUtil.sqrt2 = Math.sqrt(2);
        TileUtil.slantLen = 28;
        TileUtil.slantRate = 1.4;
        return TileUtil;
    }());
    aStar.TileUtil = TileUtil;
    __reflect(TileUtil.prototype, "aStar.TileUtil");
})(aStar || (aStar = {}));
/**
 * Created by yangsong on 15-2-11.
 */
var UTFMsg = (function () {
    /**
     * 构造函数
     */
    function UTFMsg() {
    }
    /**
     * 接收消息处理
     * @param msg
     */
    UTFMsg.prototype.receive = function (socket) {
        var msg = socket.readUTF();
        var obj = this.decode(msg);
        if (obj) {
            EventSystem.getInstance().dispatchEvent(obj.key, obj.body);
        }
    };
    /**
     * 发送消息处理
     * @param msg
     */
    UTFMsg.prototype.send = function (socket, msg) {
        var obj = this.encode(msg);
        if (obj) {
            socket.type = egret.WebSocket.TYPE_STRING;
            socket.writeUTF(obj);
        }
    };
    /**
     * 消息解析
     * @param msg
     */
    UTFMsg.prototype.decode = function (msg) {
        console.log("decode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    /**
     * 消息封装
     * @param msg
     */
    UTFMsg.prototype.encode = function (msg) {
        console.log("encode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    return UTFMsg;
}());
__reflect(UTFMsg.prototype, "UTFMsg", ["BaseMsg"]);
/**
 * Created by yangsong on 15-3-20.
 */
var UTFMsgByJson = (function (_super) {
    __extends(UTFMsgByJson, _super);
    /**
     * 构造函数
     */
    function UTFMsgByJson() {
        return _super.call(this) || this;
    }
    /**
     * 消息解析
     * @param msg
     */
    UTFMsgByJson.prototype.decode = function (msg) {
        return JSON.parse(msg);
    };
    /**
     * 消息封装
     * @param msg
     */
    UTFMsgByJson.prototype.encode = function (msg) {
        return JSON.stringify(msg);
    };
    return UTFMsgByJson;
}(UTFMsg));
__reflect(UTFMsgByJson.prototype, "UTFMsgByJson");
//# sourceMappingURL=common.js.map