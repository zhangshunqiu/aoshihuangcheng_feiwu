var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Author: zhangshunqiu
 * Email： 21102585@qq.com
 * 场景通用函数 2017/06/20
 */
var SceneUtil = (function () {
    function SceneUtil() {
    }
    /**
     * 获取是否boss场景
     */
    SceneUtil.isBossScene = function (sceneId) {
        if (sceneId > 40000) {
            return true;
        }
        return false;
    };
    /**
     * 获取是否是活动场景
     */
    SceneUtil.isActivityScene = function (sceneId) {
        if (sceneId < 40000 && sceneId >= 30000) {
            return true;
        }
        return false;
    };
    /**
     * 获取是否是挂机场景
     */
    SceneUtil.isHookScene = function (sceneId) {
        if (sceneId < 30000 && sceneId >= 20000) {
            return true;
        }
        return false;
    };
    /**
     * 是否是主场景
     * SceneUtil.isMainScene(SceneModel.getInstance().sceneId)
     */
    SceneUtil.isMainScene = function (sceneId) {
        if (sceneId == MAIN_CITY_SCENE_ID) {
            return true;
        }
        return false;
    };
    /**
     * 是否是世界boss场景
     */
    SceneUtil.isWorldBossScene = function (sceneId) {
        if (sceneId < 30600 && sceneId >= 30500) {
            return true;
        }
        return false;
    };
    /**
     * 是否是世界boss场景
     */
    SceneUtil.isArenaScene = function (sceneId) {
        if (sceneId == 30601) {
            return true;
        }
        return false;
    };
    /**
     * 获取自动技能顺序列表
     */
    SceneUtil.getAutoSkillList = function (carrer) {
        switch (carrer) {
            case CareerType.SOLDIER:
                return AutoSkillConfig[1];
            case CareerType.MAGES:
                return AutoSkillConfig[2];
            case CareerType.TAOIST:
                return AutoSkillConfig[3];
        }
        return AutoSkillConfig[0];
    };
    /**
     * 获取默认技能
     */
    SceneUtil.getDefaultSkill = function (carrer) {
        switch (carrer) {
            case CareerType.SOLDIER:
                return 10000; //10300;
            case CareerType.MAGES:
                return 20000; //20400;
            case CareerType.TAOIST:
                return 30000;
            default: return 50000;
        }
        //return 50000;
    };
    /**
     * 根据两点计算他们的方向
     */
    SceneUtil.getDirectByPoint = function (ex1, ey1, bx2, by2) {
        var hudu = Math.atan2(by2 - ey1, bx2 - ex1);
        var jd = 180 * hudu / Math.PI;
        if (jd <= -157.5 || (jd <= 180 && jd > 157.5)) {
            return DireScaleType3; //new DireScale(3,1,3);//{dire:3,scale:1};
        }
        else if (jd <= 157.5 && jd > 112.5) {
            return DireScaleType2; //new DireScale(2,1,2);//{dire:2,scale:1};
        }
        else if (jd <= 112.5 && jd > 67.5) {
            return DireScaleType1; //new DireScale(1,1,1);//{dire:1,scale:1};
        }
        else if (jd <= 67.5 && jd > 22.5) {
            return DireScaleType8; //new DireScale(2,-1,8);//{dire:2,scale:-1};//8;
        }
        else if ((jd <= 22.5 && jd >= 0) || (jd <= 0 && jd > -22.5)) {
            return DireScaleType7; //new DireScale(3,-1,7);//{dire:3,scale:-1};//7;
        }
        else if (jd <= -22.5 && jd > -67.5) {
            return DireScaleType6; //new DireScale(4,-1,6);//{dire:4,scale:-1};//6;
        }
        else if (jd <= -67.5 && jd > -112.5) {
            return DireScaleType5; //new DireScale(5,1,5);//{dire:5,scale:1};
        }
        else if (jd <= -112.5 && jd > -157.5) {
            return DireScaleType4; //new DireScale(4,1,4);//{dire:4,scale:1};
        }
        return DireScaleType1; //new DireScale(1,1,1);
    };
    /**
     * 根据方向获取度
     */
    SceneUtil.getAngByDirect = function (dire8) {
        return DireAngleType[dire8];
    };
    /**
     * 角色反方向
     */
    SceneUtil.getReversedDireScale = function (dire8) {
        return DireScaleReverseType[dire8];
    };
    /**
     * 根据方向返回Xcale值
     */
    SceneUtil.getModelXCale = function (direct) {
        if (direct == 6 || direct == 7 || direct == 8) {
            return -1;
        }
        return 1;
    };
    /**
    * 获取两点间距离
    * @param p1X
    * @param p1Y
    * @param p2X
    * @param p2Y
    * @returns {number}
    */
    SceneUtil.getDistance = function (p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };
    /**
    * 获取两点间附近的点（只有上下左右）
    * @param p1X
    * @param p1Y
    * @param p2X
    * @param p2Y
    * @returns {number}
    */
    SceneUtil.getNearbyPoint = function (bX, bY, eX, eY, offset) {
        if (offset === void 0) { offset = 64; }
        var minX = eX;
        var minY = eY;
        var tempdis = 0;
        //左方
        var nX = eX - offset;
        var nY = eY;
        minX = nX;
        minY = nY;
        var dis = this.getDistance(bX, bY, nX, nY);
        //右方
        nX = eX + offset;
        tempdis = this.getDistance(bX, bY, nX, nY);
        if (tempdis < dis) {
            dis = tempdis;
            minX = nX;
            minY = nY;
        }
        //下方
        nX = eX;
        nY = eY + offset;
        tempdis = this.getDistance(bX, bY, nX, nY);
        if (tempdis < dis) {
            dis = tempdis;
            minX = nX;
            minY = nY;
        }
        //上方
        nX = eX;
        nY = eY - offset;
        tempdis = this.getDistance(bX, bY, nX, nY);
        if (tempdis < dis) {
            dis = tempdis;
            minX = nX;
            minY = nY;
        }
        return new point(nX, nY);
    };
    /**
     * 获取两点连线上的点，从起点到结束点上的偏移量计算
     */
    SceneUtil.getLinePoint = function (bX, bY, eX, eY, offset) {
        if (offset === void 0) { offset = 64; }
        var ang = Math.atan2(eY - bY, eX - bX);
        var ang = Math.atan2(bY - eY, bX - eX);
        return new point(bX - Math.cos(ang) * offset, bY - Math.sin(ang) * offset);
    };
    /**
     * 角色方向向前延伸点
     */
    SceneUtil.getRoleLengthenPos = function (direScale, xx, yy, offset) {
        if (offset === void 0) { offset = 300; }
        var ang = this.getAngByDirect(direScale.dire8);
        return new point(xx - Math.cos(ang) * offset, yy - Math.sin(ang) * offset);
    };
    /**
     * X轴像素点转格子
     */
    SceneUtil.pixelToGridX = function (value) {
        return Math.floor(value / SceneModel.GRIDW);
    };
    /**
     * Y轴像素点转格子
     */
    SceneUtil.pixelToGridY = function (value) {
        return Math.floor(value / SceneModel.GRIDH);
    };
    /**
     * X轴格子转像素点
     */
    SceneUtil.gridToPixelX = function (value) {
        return (value * SceneModel.GRIDW + SceneModel.GRIDW / 2);
    };
    /**
     * Y轴格子转像素点
     */
    SceneUtil.gridToPixelY = function (value) {
        return (value * SceneModel.GRIDH + SceneModel.GRIDH / 2);
    };
    /**
     *  获取当前格子偏移格子数后后离目标格子最近的可行走格子
     * @param curGX 当前格子X
     * @param curGY 当前格子Y
     * @param tarGridX 目标格子X
     * @param tarGridY 目标格子Y
     * @param return Array<number>
     */
    SceneUtil.getNearMoveGridByGridNum = function (curGX, curGY, tarGridX, tarGridY, GridNum) {
        if (GridNum <= 1) {
            var offsetList = EightDireGridOffSet1;
        }
        else if (GridNum == 2) {
            var offsetList = EightDireGridOffSet2;
        }
        else if (GridNum == 3) {
            var offsetList = EightDireGridOffSet3;
        }
        else if (GridNum >= 4) {
            var offsetList = EightDireGridOffSet4;
        }
        var sceneModel = SceneModel.getInstance();
        var dis = 10000;
        var tgx;
        var tgy;
        var tdis;
        var ngx;
        var ngy;
        for (var k = 1; k < offsetList.length; k++) {
            var offset = offsetList[k];
            tgx = curGX + offset[0];
            tgy = curGY + offset[1];
            if (sceneModel.curGridIsOpen(tgx, tgy) && sceneModel.getGridTableHasObj(tgx, tgy) == false) {
                tdis = SceneUtil.getDistance(tgx, tgy, tarGridX, tarGridY);
                if (tdis < dis) {
                    dis = tdis;
                    ngx = tgx;
                    ngy = tgy;
                }
            }
        }
        if (ngx != null && ngy != null) {
            return [ngx, ngy];
        }
        else if (ngx == null && ngy == null && GridNum > 2) {
            return this.getNearMoveGridByGridNum(curGX, curGY, tarGridX, tarGridY, GridNum - 1);
        }
        return null;
    };
    /**
     *  获取当前格子周围8格离目标格子最近的可行走格子
     * @param curGX 当前格子X
     * @param curGY 当前格子Y
     * @param tarGridX 目标格子X
     * @param tarGridY 目标格子Y
     * @param return Array<number>
     */
    SceneUtil.getRoundWalkGridToTarget = function (curGX, curGY, tarGridX, tarGridY) {
        var sceneModel = SceneModel.getInstance();
        var dire8;
        if (tarGridX > curGX) {
            if (tarGridY < curGY) {
                dire8 = 2;
            }
            else if (tarGridY > curGY) {
                dire8 = 4;
            }
            else {
                dire8 = 3;
            }
        }
        else if (tarGridX < curGX) {
            if (tarGridY < curGY) {
                dire8 = 8;
            }
            else if (tarGridY > curGY) {
                dire8 = 6;
            }
            else {
                dire8 = 7;
            }
        }
        else {
            if (tarGridY < curGY) {
                dire8 = 1;
            }
            else if (tarGridY > curGY) {
                dire8 = 5;
            }
            else {
                dire8 = 0;
            }
        }
        ;
        var offset = EightDireGridOffSet1[dire8];
        var tgx = curGX + offset[0];
        var tgy = curGY + offset[1];
        if (sceneModel.curGridIsOpen(tgx, tgy) && sceneModel.getGridTableHasObj(tgx, tgy) == false) {
            return [tgx, tgy];
        }
        else {
            var dis = 10000;
            var tdis;
            var ngx;
            var ngy;
            for (var k = 1; k < EightDireGridOffSet1.length; k++) {
                var offset = EightDireGridOffSet1[k];
                tgx = curGX + offset[0];
                tgy = curGY + offset[1];
                if (k != dire8 && sceneModel.curGridIsOpen(tgx, tgy) && sceneModel.getGridTableHasObj(tgx, tgy) == false) {
                    tdis = SceneUtil.getDistance(tgx, tgy, tarGridX, tarGridY);
                    if (tdis < dis) {
                        dis = tdis;
                        ngx = tgx;
                        ngy = tgy;
                    }
                }
            }
            if (ngx != null && ngy != null) {
                return [ngx, ngy];
            }
        }
        return null;
    };
    /**
     *  获取周围可移动的一格
     * @param curGX 当前格子X
     * @param curGY 当前格子Y
     * @param dire8 方向 ,优先取该方向的格子
     * @param return Array<number>
     */
    SceneUtil.getRoundWalkGrid = function (curGX, curGY, dire8) {
        if (dire8 === void 0) { dire8 = 0; }
        var sceneModel = SceneModel.getInstance();
        var offset = EightDireGridOffSet1[dire8];
        var tgx = curGX + offset[0];
        ;
        var tgy = curGY + offset[1];
        if (dire8 > 0 && sceneModel.curGridIsOpen(tgx, tgy) && sceneModel.getGridTableHasObj(tgx, tgy) == false) {
            return [tgx, tgy];
        }
        else {
            for (var k = 1; k < EightDireGridOffSet1.length; k++) {
                var offset = EightDireGridOffSet1[k];
                tgx = curGX + offset[0];
                tgy = curGY + offset[1];
                if (k != dire8 && sceneModel.curGridIsOpen(tgx, tgy) && sceneModel.getGridTableHasObj(tgx, tgy) == false) {
                    return [tgx, tgy];
                }
            }
        }
        return null;
    };
    /**
     * 获取技能伤害范围
     * @param rangeId 范围ID
     * @param dire 方向
     */
    SceneUtil.getSkillRangeGrids = function (rangeId, dire) {
        var rang = SkillAtkRange[String("range" + rangeId)];
        if (rang) {
            if (rang.length > 1) {
                return rang[dire];
            }
            else {
                return rang[0];
            }
        }
        return null;
        // if(atkRangeType == SkillAtkRangeType.R_N_GROUP){ //近身群体
        // }else if(atkRangeType == SkillAtkRangeType.R_N_GROUP){//远程群体
        // }
        // return null;
    };
    return SceneUtil;
}());
__reflect(SceneUtil.prototype, "SceneUtil");
var DireScale = (function () {
    function DireScale(d, s, d8) {
        this._dire = d;
        this._scale = s;
        this._dire8 = d8;
    }
    Object.defineProperty(DireScale.prototype, "dire8", {
        get: function () {
            return this._dire8;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DireScale.prototype, "dire", {
        get: function () {
            return this._dire;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DireScale.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        enumerable: true,
        configurable: true
    });
    return DireScale;
}());
__reflect(DireScale.prototype, "DireScale");
var point = (function () {
    function point(xx, yy) {
        this.x = xx;
        this.y = yy;
    }
    return point;
}());
__reflect(point.prototype, "point");
//# sourceMappingURL=SceneUtil.js.map