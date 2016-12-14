/**
 * Created by Administrator on 2015/10/23.
 */
Z={};

Z.Util = L.extend({},L.Util,{
    //如果union为true，将toOptions和fromOptions的属性合并，否则将fromOptions中出excludes以外的属性添加到toOptions中并替换toOptions中的同名属性
    applyOptions: function (toOptions, fromOptions, union, excludes) {
        excludes = excludes || [];
        var excludesObj = {};

        for(var i = 0; i < excludes.length; i++){
            excludesObj[excludes[i]] = 1;
        }

        if (toOptions && fromOptions) {
            var prop;

            if (union) {
                for (prop in fromOptions) {
                    if(!(prop in excludesObj)){
                        toOptions[prop] = fromOptions[prop];
                    }
                }
            } else {
                for (prop in toOptions) {
                    if ((fromOptions[prop] != undefined) && !(prop in excludesObj)) {
                        toOptions[prop] = fromOptions[prop];
                    }
                }
            }
        }

        return toOptions;
    },

    stamp: (function () {
        var lastId = 0,
            key = '_zmap_id';
        return function (obj, suffix) {
            var newKey = suffix ? (key + "_" + suffix) : key;
            obj[newKey] = obj[newKey] || ++lastId;
            return obj[newKey];
        };
    }()),

    /*浅复制数组*/
    ArrayClone: function (srcArray) {
        var distArray = null;

        if(srcArray instanceof Array){
            for(var i = 0; i < srcArray.length; i++){
                distArray[i] = srcArray[i];
            }
        }

        return distArray;
    },

    /*浅复制对象*/
    ObjectClone: function (fromObject, toObject) {
        var newObject = toObject || {};

        for(var i in fromObject){
            newObject[i] = fromObject[i];
        }

        return newObject;
    },

    /*判断对象是否为空*/
    isNull: function (obj) {
        if(typeof obj === "number"){
            return isNaN(obj);
        }else{
            return !obj;
        }
    },

    /*判断对象是否为数字0*/
    isZero: function (obj) {
        return Z.Util.numberEquals(obj, 0);
    },

    /*判断对象是否为数字0*/
    numberEquals: function (num1, num2) {
        if(typeof num1 === "number"
            && typeof num2 === "number"
            && Math.abs(num1 - num2) < 0.00000001){
            return true;
        }else{
            return false;
        }
    },

    /*添加对象到数组数组*/
    addToArray: function (array, obj, index) {
        if(this.isNull(obj) || !(array instanceof Array)){
            return;
        }

        index = this.limitIndexToArray(array, index);
        array.splice(index, 0, obj);
    },

    removeFromArray: function(array, obj){
        if(this.isNull(obj) || !(array instanceof Array)){
            return;
        }

        for(var i = array.length - 1; i >=0; i--){
            if(obj === array[i]){
                array.splice(i, 1);
            }
        }
    },

    /*将索引限制在数组大小范围内*/
    limitIndexToArray: function(array, index){
        if(!(array && array.length !== undefined)){
            return;
        }

        index = (index === undefined) ? array.length : index;
        index = Math.max(0, Math.min(array.length, index));

        return index;
    },

    getVectorBounds: function(vectors){
        vectors = vectors || [];

        if(vectors.length <= 0){
            return null;
        }

        var minx, maxx, miny, maxy, minz, maxz;

        for(var i = 0; i < vectors.length; i++){
            if(!vectors[i]){
                continue;
            }

            if(minx === undefined){
                minx = vectors[i].x,
                maxx = vectors[i].x,
                miny = vectors[i].y,
                maxy = vectors[i].y,
                minz = vectors[i].z,
                maxz = vectors[i].z;
            }else{
                minx = Math.min(vectors[i].x, minx);
                maxx = Math.max(vectors[i].x, maxx);
                miny = Math.min(vectors[i].y, miny);
                maxy = Math.max(vectors[i].y, maxy);
                minz = Math.min(vectors[i].z, minz);
                maxz = Math.max(vectors[i].z, maxz);
            }
        }

        return Z.GLBounds.create(new Z.Point(minx, miny, minz), new Z.Point(maxx, maxy, maxz));
    },

    stringBeginsWith: function(str, sub){
        if (typeof str != "string") {
            return false;
        }

        if (str.length == 0) {
            return false;
        }

        sub = sub || ' ';

        return str.substring(0, sub.length) === sub;
    },

    stringEndsWith: function(str, sub){
        if (typeof str != "string") {
            return false;
        }

        if (str.length == 0) {
            return false;
        }

        sub = sub || ' ';

        return str.substring(str.length - sub.length) === sub;
    },

    stringTrim: function (str, sub) {
        if (typeof str != "string") {
            return;
        }

        if (str.length == 0) {
            return;
        }

        sub = sub || ' '; // Defaults to trimming spaces

        // Trim beginning spaces
        while (Z.Util.stringBeginsWith(str, sub)) {
            str = str.substring(1);
        }

        // Trim ending spaces
        while (Z.Util.stringEndsWith(str, sub)) {
            str = str.substring(0, str.length - 1);
        }

        return str;
    }
});

Z.extend = Z.Util.extend;
/**
 * Created by Administrator on 2015/10/23.
 */
Z.Browser = Z.extend({},L.Browser);
/**
 * Created by Administrator on 2015/10/23.
 */
Z.Class = L.Class;
/**
 * Created by Administrator on 2015/10/23.
 */
Z.DomEvent = Z.extend({},L.DomEvent);
/**
 * Created by Administrator on 2015/10/23.
 */
Z.DomUtil = Z.extend({},L.DomUtil);
/**
 * Created by Administrator on 2015/10/23.
 */
Z.Event = Z.extend({},L.Event);
/**
 * Created by Administrator on 2015/10/23.
 */
Z.EventManager = L.Mixin.Events;
/**
 * Created by Administrator on 2015/10/30.
 */
Z.LeafletUtil = {
    latLngBoundsFromLeaflet: function(leafletBounds){
        return Z.LatLngBounds.create(
            Z.LatLng.create(leafletBounds.getSouthWest().lat, leafletBounds.getSouthWest().lng),
            Z.LatLng.create(leafletBounds.getNorthEast().lat, leafletBounds.getNorthEast().lng));
    },

    latLngBoundsToLeaflet: function(latLngBounds){
        return L.latLngBounds(
            L.latLng(latLngBounds.getSouthWest().lat, latLngBounds.getSouthWest().lng),
            L.latLng(latLngBounds.getNorthEast().lat, latLngBounds.getNorthEast().lng));
    },

    latLngToLeaflet: function(latLng){
        return L.latLng(latLng.lat, latLng.lng);
    }
}
/**
 * Created by Administrator on 2015/10/30.
 */
Z.ThreejsUtil = {
    clearObject3D: function(object3d){
        var children = object3d.children();

        for(var i = 0; i < children.length; i++){
            object3d.remove(children[i]);
        }
    },

    vector2GLPoint: function(vector){
        vector = vector || {};

        if(typeof vector.x !== "number" || typeof vector.y !== "number"){
            return null;
        }else{
            return Z.Point.create(vector.x, vector.y, vector.z);
        }
    }
}
/**
 * Created by Administrator on 2015/10/30.
 */
Z.GeometryUtil = {
    getPathBounds: function(paths, lngStart){     //paths为三维数组，lngStart为true表示坐标顺序为经度在前、维度在后。默认为lngStart为false表示纬度在前、经度在后，例如：[[[80,120], [80,121], [78, 110]], [[98,101], [79,100], [89,110]]]
        if(paths instanceof Array){
            var pathLength = paths.length, subPathLength, i, j, minx, miny, maxx, maxy, minz, maxz;

            for(i = 0; i < pathLength; i++){
                if(paths[i] instanceof Array){
                    subPathLength = paths[i].length;

                    for(j = 0; j < subPathLength; j++){
                        if((paths[i][j] instanceof Array) && paths[i][j].length > 1){
                            if(minx === undefined){
                                minx = maxx = paths[i][j][0];
                                miny = maxy = paths[i][j][1];
                                minz = maxz = paths[i][j][2];
                            }else{
                                minx = Math.min(minx, paths[i][j][0]);
                                maxx = Math.max(maxx, paths[i][j][0]);
                                miny = Math.min(miny, paths[i][j][1]);
                                maxy = Math.max(maxy, paths[i][j][1]);
                                minz = Math.min(minz, paths[i][j][2]);
                                maxz = Math.max(maxz, paths[i][j][2]);
                            }
                        }
                    }
                }
            }

            if(minx !== undefined){
                if(lngStart){
                    return Z.LatLngBounds.create(Z.LatLng.create(miny, minx, minz), Z.LatLng.create(maxy, maxx, maxz));
                }else{
                    return Z.LatLngBounds.create(Z.LatLng.create(minx, miny, minz), Z.LatLng.create(maxx, maxy, maxz));
                }
            }else{
                return null;
            }
        }else{
            return null;
        }
    },

    convertPathToGeometry: function(paths, convertFun, scope){     //paths为三维数组，坐标顺序为纬度在前、经度在后，例如：[[[80,120], [80,121], [78, 110]], [[98,101], [79,100], [89,110]]]
        var geoms = [], geometry;//geometry = new THREE.Geometry();

        if(paths instanceof Array){
            var pathLength = paths.length, subPathLength, i, j, vec;

            for(i = 0; i < pathLength; i++){
                if(paths[i] instanceof Array){
                    subPathLength = paths[i].length;
                    geometry = new THREE.Geometry();

                    for(j = 0; j < subPathLength; j++){
                        if((paths[i][j] instanceof Array) && paths[i][j].length > 1){
                            vec = new THREE.Vector3( paths[i][j][1], paths[i][j][0], paths[i][j][2]);

                            if(convertFun){
                                if(scope){
                                    vec = convertFun.call(scope, vec);
                                }else{
                                    vec = convertFun(vec);
                                }
                            }

                            if(vec instanceof THREE.Vector3){
                                geometry.vertices.push(vec);
                            }
                        }
                    }

                    geoms.push(geometry);
                }
            }
        }

        return geoms;
    },

    convertPathToShapes: function(pathArray, convertFun, scope){     //pathArray为三维数组，坐标顺序为纬度在前、经度在后，例如：[[[80,120], [80,121], [78, 110]], [[98,101], [79,100], [89,110]]]
        var notArray2 = !(pathArray instanceof Array) || !(pathArray[0] instanceof Array),  //判断shape是否为二维数组
            notArray3 = notArray2 || !(pathArray[0][0] instanceof Array),        //判断shape是否为三维数组
            notArray4 = notArray3 || !(pathArray[0][0][0] instanceof Array),     //判断shape是否为四维数组
            coords = [], shapes = [];

        if(!notArray4){     //四维数组
            coords = pathArray;
        }else if(!notArray3){     //三维数组
            coords = [pathArray];
        }else if(!notArray2){     //二维数组
            coords = [[pathArray]];
        }

        for(var pLength = 0; pLength < coords.length; pLength++){
            var bounds = [], holes = [], points, paths = coords[pLength],
                pathLength = paths.length, subPathLength, i, j, vec;

            for(i = 0; i < pathLength; i++){
                subPathLength = paths[i].length;
                points = [];

                for(j = 0; j < subPathLength; j++){
                    if(paths[i][j].length <= 1) {
                        continue;
                    }

                    vec = new THREE.Vector3( paths[i][j][1], paths[i][j][0], paths[i][j][2]);

                    if(convertFun){
                        if(scope){
                            vec = convertFun.call(scope, vec);
                        }else{
                            vec = convertFun(vec);
                        }
                    }

                    if(vec instanceof THREE.Vector3){
                        points.push(vec);
                    }
                }

                if(points.length > 2){
                    if(Z.GeometryUtil.isClockWise(points)){
                        holes.push(new THREE.Path(points));
                    }else{
                        bounds.push(points);
                    }
                }
            }

            if(bounds.length < 1){
                continue;
            }else{
                var geom = new THREE.Shape(bounds[0]);

                for(var i = 0; i < holes.length; i++){
                    geom.holes.push(holes[i]);
                }

                shapes.push(geom);
            }
        }

        return shapes;
    },

    //判断坐标串是否为顺时针
    isClockWise: function(path){
        return Z.GeometryUtil.areaByCoordArray(path) < 0;
    },

    areaByCoordArray: function(path){
        var n = path.length,
            a = 0.0,
            pointA, pointB;

        for ( var p = n - 1, q = 0; q < n; p = q ++ ) {
            if(path[p].x && path[p].y && path[q].x && path[q].y){
                a += path[ p ].x * path[ q ].y - path[ q ].x * path[ p ].y;
            }else if((path[p] instanceof Array) && path[p].length > 0){
                a += path[ p ][1] * path[ q ][0] - path[ q ][1] * path[ p ][0];
            }
        }

        return a * 0.5;
    }
}
Z.WktParser = function () { }

/**将wkt转换为坐标数组，例如：
//POLYGON ((116.993225097656 36.892822265625, 
//    116.993225097656 36.8926391601563, 
//    116.993408203125 36.8926391601563, 
//    116.993408203125 36.892822265625, 
//    116.993225097656 36.892822265625))
//转换为：[[36.892822265625, 116.993225097656], 
//    [36.8926391601563, 116.993225097656], 
//    [36.8926391601563, 116.993408203125], 
//    [36.892822265625, 116.993408203125], 
//    [36.892822265625, 116.993225097656]]
 */
Z.WktParser.wkt2Array = function (wkt) {
    if (!wkt) {
        return;
    }

    wkt = wkt.toLowerCase().replace(/\s+/, " ");  //将多空格替换为单空格
    //var reg = /[\s,\(]([\b\.]+)\s([\b\.])+[\s,\)]/;    //匹配坐标组
    var reg = /([\d\.]+)\s([\d\.])+\s([\d\.])+/g;    //匹配三维坐标组
    wkt = wkt.replace(reg, "[$2, $1, $3]");              //将116.993225097656 36.892822265625 1000转变为[36.892822265625, 116.993225097656, 1000]
    reg = /([\d\.]+)\s+([\d\.]+)/g;    //匹配二维坐标组
    wkt = wkt.replace(reg, "[$2, $1]");              //将116.993225097656 36.892822265625转变为[36.892822265625, 116.993225097656]

    var result = {};

    if (wkt.indexOf("multipoint") >= 0) {
        result.type = "MultiPoint";
    } else if (wkt.indexOf("point") >= 0) {
        result.type = "Point";
    } else if (wkt.indexOf("multipolyline") >= 0) {
        result.type = "MultiPolyline";
    } else if (wkt.indexOf("polyline") >= 0) {
        result.type = "Polyline";
    } else if (wkt.indexOf("multipolygon") >= 0) {
        result.type = "MultiPolygon";
    } else if (wkt.indexOf("polygon") >= 0) {
        result.type = "Polygon";
    }

    if (result.type) {
        result.coords = Z.WktParser._getCoords(wkt.substring(result.type.length));

        //if (result.coords.length == 1) {
        //    result.coords = result.coords[0];
        //}
    } else {
        result = null;
    }

    return result;
}

Z.WktParser._getCoords = function (wkt) {
    wkt = wkt.replace(/\(/g, "[");
    wkt = wkt.replace(/\)/g, "]");
    wkt = Z.Util.stringTrim(wkt);

    return eval('(' + wkt + ')');
}
/**
 * Created by Administrator on 2015/11/19.
 */
Z.Draggable = Z.Class.extend({
    includes: Z.EventManager,

    statics: {
        START: Z.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
        END: {
            mousedown: 'mouseup',
            touchstart: 'touchend',
            pointerdown: 'touchend',
            MSPointerDown: 'touchend'
        },
        MOVE: {
            mousedown: 'mousemove',
            touchstart: 'touchmove',
            pointerdown: 'touchmove',
            MSPointerDown: 'touchmove'
        }
    },

    initialize: function (element, dragStartTarget, moveElement) {
        this._element = element;
        this._dragStartTarget = dragStartTarget || element;
        this._moveElement = moveElement === undefined ? true : moveElement;
    },

    enable: function () {
        if (this._enabled) { return; }

        for (var i = Z.Draggable.START.length - 1; i >= 0; i--) {
            Z.DomEvent.on(this._dragStartTarget, Z.Draggable.START[i], this._onDown, this);
        }

        this._enabled = true;
    },

    disable: function () {
        if (!this._enabled) { return; }

        for (var i = Z.Draggable.START.length - 1; i >= 0; i--) {
            Z.DomEvent.off(this._dragStartTarget, Z.Draggable.START[i], this._onDown, this);
        }

        this._enabled = false;
        this._moved = false;
    },

    _onDown: function (e) {
        this._moved = false;

        if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

        Z.DomEvent.stopPropagation(e);

        if (Z.Draggable._disabled) { return; }

        Z.DomUtil.disableImageDrag();
        Z.DomUtil.disableTextSelection();

        if (this._moving) { return; }

        var first = e.touches ? e.touches[0] : e;

        this._startPoint = new Z.Point(first.clientX, first.clientY);
        this._startPos = this._newPos = this._getElementPosition(this._element);//Z.DomUtil.getPosition(this._element);

        Z.DomEvent
            .on(document, Z.Draggable.MOVE[e.type], this._onMove, this)
            .on(document, Z.Draggable.END[e.type], this._onUp, this);
    },

    _onMove: function (e) {
        if (e.touches && e.touches.length > 1) {
            this._moved = true;
            return;
        }

        var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
            newPoint = new Z.Point(first.clientX, first.clientY),
            offset = newPoint.subtract(this._startPoint);

        if (!offset.x && !offset.y) { return; }
        if (Z.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3) { return; }

        Z.DomEvent.preventDefault(e);

        if (!this._moved) {
            this.fire('dragstart', {startPoint: newPoint.clone()});

            this._moved = true;
            this._startPos = this._getElementPosition(this._element).subtract(offset);//Z.DomUtil.getPosition(this._element).subtract(offset);

            Z.DomUtil.addClass(document.body, 'zmap-dragging');
            this._lastTarget = e.target || e.srcElement;
            //Z.DomUtil.addClass(this._lastTarget, 'leaflet-drag-target');
        }

        this._newPos = this._startPos.add(offset);
        this._newPoint = newPoint;
        this._moving = true;

        Z.Util.cancelAnimFrame(this._animRequest);
        this._animRequest = Z.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
    },

    _updatePosition: function () {
        this.fire('predrag');

        if(this._moveElement){
            Z.DomUtil.setPosition(this._element, this._newPos);
        }

        this.fire('drag', {startPoint: this._startPoint.subtract(this._startPos), newPoint: this._newPoint.subtract(this._startPos)});
    },

    _onUp: function () {
        Z.DomUtil.removeClass(document.body, 'zmap-dragging');

        if (this._lastTarget) {
            //Z.DomUtil.removeClass(this._lastTarget, 'leaflet-drag-target');
            this._lastTarget = null;
        }

        for (var i in Z.Draggable.MOVE) {
            Z.DomEvent
                .off(document, Z.Draggable.MOVE[i], this._onMove)
                .off(document, Z.Draggable.END[i], this._onUp);
        }

        Z.DomUtil.enableImageDrag();
        Z.DomUtil.enableTextSelection();

        if (this._moved && this._moving) {
            // ensure drag is not fired after dragend
            Z.Util.cancelAnimFrame(this._animRequest);

            try{
                this.fire('dragend', {
                    distance: this._newPos.distanceTo(this._startPos),
                    startPoint: this._startPoint.subtract(this._startPos),
                    newPoint: this._newPoint.subtract(this._startPos)
                });
            }catch(e){
                var con = console || {};
                con.log = con.log || opera.postError;
                if(con.log){
                    con.log(e.message);
                }
            }
        }

        this._moving = false;
    },

    _getElementPosition: function(element){
        var position = Z.DomUtil.getPosition(element);

        if(!position || position.x === NaN || position.y === NaN){
            //var left = element.style.left;
            //var top = element.style.top;
            //left = parseInt(left.length > 0 ? left.substring(0,left.length - 2) : 0);
            //top = parseInt(top.length > 0 ? top.substring(0, top.length - 2) : 0);
            var left = element.offsetLeft;
            var top = element.offsetTop;
            position = new Z.Point(left, top);
        }

        return position;
    }
});
/**
 * Created by Administrator on 2015/10/24.
 */
DefaultZMapConfig = {
    center:{x:100, y:30},  //地图中心点坐标
    bounds:{minx:80, miny: 20, maxx:130, maxy:50},      //地图初始显示范围
    maxBounds:{minx:80, miny: 20, maxx:130, maxy:50},      //地图最大可显示范围
    crs:'EPSG4326',              //地图坐标系
    initZoom:6,            //初始显示级别
    minZoom:1,             //最小可显示级别
    maxZoom:18,            //最大可显示级别
    levelDefine:[{ "level": 0, "resolution": 1.40782880508533, "scale": 591658710.9 },
        { "level": 1, "resolution": 0.70312500000011879, "scale": 295497593.05879998 },
        { "level": 2, "resolution": 0.3515625000000594, "scale": 147748796.52939999 },
        { "level": 3, "resolution": 0.1757812500000297, "scale": 73874398.264699996 },
        { "level": 4, "resolution": 0.087890625000014849, "scale": 36937199.132349998 },
        { "level": 5, "resolution": 0.043945312500007425, "scale": 18468599.566174999 },
        { "level": 6, "resolution": 0.021972656250003712, "scale": 9234299.7830874994 },
        { "level": 7, "resolution": 0.010986328125001856, "scale": 4617149.8915437497 },
        { "level": 8, "resolution": 0.0054931640625009281, "scale": 2308574.9457718749 },
        { "level": 9, "resolution": 0.002746582031250464, "scale": 1154287.4728859374 },
        { "level": 10, "resolution": 0.001373291015625232, "scale": 577143.73644296871 },
        { "level": 11, "resolution": 0.00068664550781261601, "scale": 288571.86822148436 },
        { "level": 12, "resolution": 0.000343322753906308, "scale": 144285.934110742183 },
        { "level": 13, "resolution": 0.000171661376953154, "scale": 72142.967055371089 },
        { "level": 14, "resolution": 8.5830688476577001e-005, "scale": 36071.483527685545 },
        { "level": 15, "resolution": 4.2915344238288501e-005, "scale": 18035.741763842772 },
        { "level": 16, "resolution": 2.145767211914425e-005, "scale": 9017.8708819213862 },
        { "level": 17, "resolution": 1.0728836059572125e-005, "scale": 4508.9354409606931 },
        { "level": 18, "resolution": 5.3644180297860626e-006, "scale": 2254.4677204803465 },
        { "level": 19, "resolution": 2.6822090148930313e-006, "scale": 1127.2338602401733 },
        { "level": 20, "resolution": 1.3411045074465156e-006, "scale": 563.61693012008664 },
        { "level": 21, "resolution": 0.6705522537232578e-006, "scale": 281.80846506004332 },
        { "level": 22, "resolution": 0.3352761268616289e-006, "scale": 140.90423253002166 },
        { "level": 23, "resolution": 0.16763806343081445e-006, "scale": 70.45211626501083 }],            //级别定义
    sceneType:'2D',            //场景类型：'2d'、'3d'、'mixed'
    sceneConfig:{            //场景配置
        miniMap:false,                          //是否显示鹰眼
        miniMapLayer:[{type:'TDTVector',url:'',params:{},minZoom:1,maxZoom:18,label:'天地图矢量底图',bounds:{}}],            //鹰眼中显示的地图图层
        baseLayer:[],            //基础底图
        baseOverLayer:[],            //基础叠加图层（显示到基础地图上）
        zoomSlider:'small',            //级别工具条：'small'、'slider'、'false'
        scaleControl:false            //b是否显示比例尺
    }
};
/**
 * Created by Administrator on 2015/12/9.
 */
Z.Globe = {};

Z.Globe.Layer = {
    layerGroupSize: 1000
};
/**
 * Created by Administrator on 2015/10/24.
 */
ZMapConfig = {
    center:{x:100, y:30},  //地图中心点坐标
    bounds:{minx:80, miny: 20, maxx:130, maxy:50},      //地图初始显示范围
    maxBounds:{minx:80, miny: 20, maxx:130, maxy:50},      //地图最大可显示范围
    crs:'EPSG4326',              //地图坐标系
    initZoom:1,            //初始显示级别
    minZoom:6,             //最小可显示级别
    maxZoom:18,            //最大可显示级别
    levelDefine:[{ "level": 0, "resolution": 1.40782880508533, "scale": 591658710.9 },
        { "level": 1, "resolution": 0.70312500000011879, "scale": 295497593.05879998 },
        { "level": 2, "resolution": 0.3515625000000594, "scale": 147748796.52939999 },
        { "level": 3, "resolution": 0.1757812500000297, "scale": 73874398.264699996 },
        { "level": 4, "resolution": 0.087890625000014849, "scale": 36937199.132349998 },
        { "level": 5, "resolution": 0.043945312500007425, "scale": 18468599.566174999 },
        { "level": 6, "resolution": 0.021972656250003712, "scale": 9234299.7830874994 },
        { "level": 7, "resolution": 0.010986328125001856, "scale": 4617149.8915437497 },
        { "level": 8, "resolution": 0.0054931640625009281, "scale": 2308574.9457718749 },
        { "level": 9, "resolution": 0.002746582031250464, "scale": 1154287.4728859374 },
        { "level": 10, "resolution": 0.001373291015625232, "scale": 577143.73644296871 },
        { "level": 11, "resolution": 0.00068664550781261601, "scale": 288571.86822148436 },
        { "level": 12, "resolution": 0.000343322753906308, "scale": 144285.934110742183 },
        { "level": 13, "resolution": 0.000171661376953154, "scale": 72142.967055371089 },
        { "level": 14, "resolution": 8.5830688476577001e-005, "scale": 36071.483527685545 },
        { "level": 15, "resolution": 4.2915344238288501e-005, "scale": 18035.741763842772 },
        { "level": 16, "resolution": 2.145767211914425e-005, "scale": 9017.8708819213862 },
        { "level": 17, "resolution": 1.0728836059572125e-005, "scale": 4508.9354409606931 },
        { "level": 18, "resolution": 5.3644180297860626e-006, "scale": 2254.4677204803465 },
        { "level": 19, "resolution": 2.6822090148930313e-006, "scale": 1127.2338602401733 },
        { "level": 20, "resolution": 1.3411045074465156e-006, "scale": 563.61693012008664 },
        { "level": 21, "resolution": 0.6705522537232578e-006, "scale": 281.80846506004332 },
        { "level": 22, "resolution": 0.3352761268616289e-006, "scale": 140.90423253002166 },
        { "level": 23, "resolution": 0.16763806343081445e-006, "scale": 70.45211626501083 }],            //级别定义
    sceneType:'2D',            //场景类型：'2d'、'3d'、'mixed'
    sceneConfig:{            //场景配置
        miniMap:false,                          //是否显示鹰眼
        miniMapLayer:[{type:'TDTVector',url:'',params:{},minZoom:1,maxZoom:18,label:'天地图矢量底图',bounds:{}}],            //鹰眼中显示的地图图层
        baseLayer:[],            //基础底图
        baseOverLayer:[],            //基础叠加图层（显示到基础地图上）
        zoomSlider:'small',            //级别工具条：'small'、'slider'、'false'
        scaleControl:false            //b是否显示比例尺
    }
};
/**
 * Created by Administrator on 2015/10/25.
 */
Z.Point = function(x, y, z, round){
    this.x = (round ? Math.round(x) : x);
    this.y = (round ? Math.round(y) : y);
    this.z = z?(round ? Math.round(z) : z) : 0;
}

Z.Point.create = function(x, y, z, round){
    if (x instanceof Z.Point) {
        return x;
    }
    if (Z.Util.isArray(x)) {
        return (x.length) < 2 ? null : new Z.Point(x[0], x[1], x[2]);
    }
    if (x === undefined || x === null) {
        return x;
    }
    if (typeof x === 'object' && 'x' in x && 'y' in x) {
        var newX = isNaN(parseFloat(x.x)) ? 0 : parseFloat(x.x),
            newY = isNaN(parseFloat(x.y)) ? 0 : parseFloat(x.y);

        new Z.Point(newX, newY, x.z, round);
    }
    return new Z.Point(x, y, z, round);
}

Z.Point.prototype = {

    clone: function () {
        return new Z.Point(this.x, this.y, this.z);
    },

    // non-destructive, returns a new point
    add: function (point) {
        return this.clone()._add(Z.Point.create(point));
    },

    // destructive, used directly for performance in situations where it's safe to modify existing point
    _add: function (point) {
        this.x += point.x;
        this.y += point.y;
        this.z += point.z;

        return this;
    },

    subtract: function (point) {
        return this.clone()._subtract(Z.Point.create(point));
    },

    _subtract: function (point) {
        this.x -= point.x;
        this.y -= point.y;
        this.z -= point.z;

        return this;
    },

    divideBy: function (num) {
        return this.clone()._divideBy(num);
    },

    _divideBy: function (num) {
        this.x /= num;
        this.y /= num;
        this.z /= num;

        return this;
    },

    multiplyBy: function (num) {
        return this.clone()._multiplyBy(num);
    },

    _multiplyBy: function (num) {
        this.x *= num;
        this.y *= num;
        this.z *= num;

        return this;
    },

    round: function () {
        return this.clone()._round();
    },

    _round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);

        return this;
    },

    floor: function () {
        return this.clone()._floor();
    },

    _floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);

        return this;
    },

    distanceTo: function (point) {
        point = Z.Point.create(point);

        var x = point.x - this.x,
            y = point.y - this.y;
            z = point.z - this.z;

         return Math.sqrt(x * x + y * y + z * z);
    },

    equals: function (point) {
        point = Z.Point.create(point);

        return point.x === this.x &&
            point.y === this.y &&
            point.z === this.z;
    },

    contains: function (point) {
        point = Z.Point.create(point);

        return Math.abs(point.x) <= Math.abs(this.x) &&
            Math.abs(point.y) <= Math.abs(this.y) &&
            Math.abs(point.z) <= Math.abs(this.z);
    },

    toString: function () {
        return 'Point(' +
            L.Util.formatNum(this.x) + ', ' +
            L.Util.formatNum(this.y) + ', ' +
            L.Util.formatNum(this.z) + ')';
    }
};

/**
 * Created by Administrator on 2015/10/26.
 */
Z.LatLng = function (lat, lng, alt) { // (Number, Number, Number)
    lat = parseFloat(lat);
    lng = parseFloat(lng);

    if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
    }

    this.lat = lat;
    this.lng = lng;

    if (alt !== undefined) {
        this.alt = parseFloat(alt);
    }
};

Z.LatLng.create = function (a, b) { // (LatLng) or ([Number, Number]) or (Number, Number)
    if (a instanceof Z.LatLng) {
        return a;
    }
    if (Z.Util.isArray(a)) {
        if (typeof a[0] === 'number' || typeof a[0] === 'string') {
            return new Z.LatLng(a[0], a[1], a[2]);
        } else {
            return null;
        }
    }
    if (a === undefined || a === null) {
        return a;
    }
    if (typeof a === 'object' && 'lat' in a) {
        var newLatLng = new Z.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);

        if(!isNaN(a.alt)){
            newLatLng.alt = a.alt;
        }

        return newLatLng;
    }
    if (b === undefined) {
        return null;
    }
    return new Z.LatLng(a, b);
};

Z.extend(Z.LatLng, {
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,
    MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
});

Z.LatLng.prototype = {
    clone: function () {
        return new Z.LatLng(this.lat, this.lng, this.alt);
    },
    equals: function (obj) { // (LatLng) -> Boolean
        if (!obj) { return false; }

        obj = Z.LatLng.create(obj);

        var margin = Math.max(
            Math.abs(this.lat - obj.lat),
            Math.abs(this.lng - obj.lng));

        if(!isNaN(this.alt) && !isNaN(obj.alt)){
            margin = Math.max(margin,  Math.abs(this.alt - obj.alt));
        }

        return margin <= Z.LatLng.MAX_MARGIN;
    },

    add: function (point) {
        return this.clone()._add(Z.LatLng.create(point));
    },

    // destructive, used directly for performance in situations where it's safe to modify existing point
    _add: function (point) {
        this.lat += point.lat;
        this.lng += point.lng;
        this.alt += point.alt;

        return this;
    },

    subtract: function (point) {
        return this.clone()._subtract(Z.LatLng.create(point));
    },

    _subtract: function (point) {
        this.lat -= point.lat;
        this.lng -= point.lng;
        this.alt -= point.alt;

        return this;
    },

    toString: function (precision) { // (Number) -> String
        return 'LatLng(' +
            Z.Util.formatNum(this.lat, precision) + ', ' +
            Z.Util.formatNum(this.lng, precision) + ', ' +
            Z.Util.formatNum(this.alt, precision) + ')';
    },

    // Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
    // TODO move to projection code, LatLng shouldn't know about Earth
    distanceTo: function (other) { // (LatLng) -> Number
        other = Z.LatLng.create(other);

        var R = 6378137, // earth radius in meters
            d2r = Z.LatLng.DEG_TO_RAD,
            dLat = (other.lat - this.lat) * d2r,
            dLon = (other.lng - this.lng) * d2r,
            lat1 = this.lat * d2r,
            lat2 = other.lat * d2r,
            sin1 = Math.sin(dLat / 2),
            sin2 = Math.sin(dLon / 2);

        var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },

    wrap: function (a, b) { // (Number, Number) -> LatLng
        var lng = this.lng;

        a = a || -180;
        b = b ||  180;

        lng = (lng + b) % (b - a) + (lng < a || lng === b ? b : a);

        return new Z.LatLng(this.lat, lng, this.alt);
    }
};
/**
 * Created by Administrator on 2015/10/25.
 *
 * 正方向为向右向下向外
 */
Z.Bounds = function (a, b) { //(Point, Point) or Point[]
    if (!a) { return; }

    var points = b ? [a, b] : a;

    for (var i = 0, len = points.length; i < len; i++) {
        this.extend(points[i]);
    }
};

Z.Bounds.create = function (a, b) { //(Point, Point) or Point[]
    if (!a || a instanceof Z.Bounds) {
        return a;
    }
    return new Z.Bounds(a, b);
};

Z.Bounds.prototype = {
    // extend the bounds to contain the given point
    extend: function (point) { // (Point)
        point = Z.Point.create(point);

        if (!this.min && !this.max) {
            this.min = point.clone();
            this.max = point.clone();
        } else {
            this.min.x = Math.min(point.x, this.min.x);
            this.max.x = Math.max(point.x, this.max.x);
            this.min.y = Math.min(point.y, this.min.y);
            this.max.y = Math.max(point.y, this.max.y);
            this.min.z = Math.min(point.z, this.min.z);
            this.max.z = Math.max(point.z, this.max.z);
        }
        return this;
    },

    getCenter: function (round) { // (Boolean) -> Point
        return new Z.Point(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            (this.min.z + this.max.z) / 2, round);
    },

    getBottomLeft: function () { // -> Point
        return new Z.Point(this.min.x, this.max.y, this.min.z);
    },

    getTopRight: function () { // -> Point
        return new Z.Point(this.max.x, this.min.y, this.max.z);
    },

    getSize: function () {
        return this.max.subtract(this.min);
    },

    contains: function (obj) { // (Bounds) or (Point) -> Boolean
        var min, max;

        if (typeof obj[0] === 'number' || obj instanceof Z.Point) {
            obj = Z.Point.create(obj);
        } else {
            obj = Z.Bounds.create(obj);
        }

        if (obj instanceof Z.Bounds) {
            min = obj.min;
            max = obj.max;
        } else {
            min = max = obj;
        }

        return (min.x >= this.min.x) &&
            (max.x <= this.max.x) &&
            (min.y >= this.min.y) &&
            (max.y <= this.max.y) &&
            (min.z >= this.min.z) &&
            (max.z <= this.max.z) ;
    },

    intersects: function (bounds) { // (Bounds) -> Boolean
        bounds = Z.Bounds.create(bounds);

        var min = this.min,
            max = this.max,
            min2 = bounds.min,
            max2 = bounds.max,
            xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
            yIntersects = (max2.y >= min.y) && (min2.y <= max.y),
            zIntersects = (max2.z >= min.z) && (min2.z <= max.z);

        return xIntersects && yIntersects && zIntersects;
    },

    isValid: function () {
        return !!(this.min && this.max);
    }
};
/**
 * Created by Administrator on 2015/10/26.
 */
Z.LatLngBounds = function (southWestLower, northEastUpper) { // (LatLng, LatLng) or (LatLng[])
    if (!southWestLower) { return; }

    var latlngs = northEastUpper ? [southWestLower, northEastUpper] : southWestLower;

    for (var i = 0, len = latlngs.length; i < len; i++) {
        this.extend(latlngs[i]);
    }
};

Z.LatLngBounds.create = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
    if (!a || a instanceof Z.LatLngBounds) {
        return a;
    }

    if (Z.Util.isArray(a) && a.length > 1 && !b) {
        return new Z.LatLngBounds(a[0], a[1]);
    }

    return new Z.LatLngBounds(a, b);
};

Z.LatLngBounds.prototype = {
    clone: function () {
        return new Z.LatLngBounds(this._southWestLower, this._northEastUpper);
    },
    // extend the bounds to contain the given point or bounds
    extend: function (obj) { // (LatLng) or (LatLngBounds)
        if (!obj) { return this; }

        var latLng = Z.LatLng.create(obj);
        if (latLng !== null) {
            obj = latLng;
        } else {
            obj = Z.LatLngBounds.create(obj);
        }

        if (obj instanceof Z.LatLng) {
            if (!this._southWestLower && !this._northEastUpper) {
                this._southWestLower = new Z.LatLng(obj.lat, obj.lng, obj.alt);
                this._northEastUpper = new Z.LatLng(obj.lat, obj.lng, obj.alt);
            } else {
                this._southWestLower.lat = Math.min(obj.lat, this._southWestLower.lat);
                this._southWestLower.lng = Math.min(obj.lng, this._southWestLower.lng);

                this._northEastUpper.lat = Math.max(obj.lat, this._northEastUpper.lat);
                this._northEastUpper.lng = Math.max(obj.lng, this._northEastUpper.lng);

                if(!isNaN(obj.alt)){
                    this._southWestLower.alt = isNaN(this._southWestLower.alt) ?
                        obj.alt : Math.min(obj.alt, this._southWestLower.alt);
                    this._northEastUpper.alt = isNaN(this._northEastUpper.alt) ?
                        obj.alt : Math.max(obj.alt, this._northEastUpper.alt);
                }
            }
        } else if (obj instanceof Z.LatLngBounds) {
            this.extend(obj._southWestLower);
            this.extend(obj._northEastUpper);
        }
        //else if (obj instanceof Array && obj.length > 1) {
        //    this.extend(Z.LatLng.create(obj));
        //}

        return this;
    },

    // extend the bounds by a percentage
    pad: function (bufferRatio) { // (Number) -> LatLngBounds
        var sw = this._southWestLower,
            ne = this._northEastUpper,
            latBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
            lngBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio,
            heightBuffer = this.hasAltValue() ?
                Math.abs(sw.alt - ne.alt) * bufferRatio : NaN;

        return new Z.LatLngBounds(
            new Z.LatLng(sw.lat - latBuffer, sw.lng - lngBuffer, isNaN(heightBuffer) ? NaN : (sw.alt - heightBuffer)),
            new Z.LatLng(ne.lat + latBuffer, ne.lng + lngBuffer, isNaN(heightBuffer) ? NaN : (ne.alt + heightBuffer)));
    },

    translate: function (lat, lng, alt) { //平移
        var sw = this._southWestLower,
            ne = this._northEastUpper,
            delta = new Z.LatLng(lat, lng, alt);

        return new Z.LatLngBounds(
            sw.add(delta),
            ne.add(delta));
    },

    getCenter: function () { // -> LatLng
        return new Z.LatLng(
            (this._southWestLower.lat + this._northEastUpper.lat) / 2,
            (this._southWestLower.lng + this._northEastUpper.lng) / 2,
            this.hasAltValue() ? ((this._southWestLower.alt + this._northEastUpper.alt) / 2) : NaN);
    },

    getSouthWest: function () {
        return this._southWestLower;
    },

    getNorthEast: function () {
        return this._northEastUpper;
    },

    getNorthWest: function () {
        return new Z.LatLng(this.getNorth(), this.getWest());
    },

    getSouthEast: function () {
        return new Z.LatLng(this.getSouth(), this.getEast());
    },

    getWest: function () {
        return this._southWestLower.lng;
    },

    getSouth: function () {
        return this._southWestLower.lat;
    },

    getEast: function () {
        return this._northEastUpper.lng;
    },

    getNorth: function () {
        return this._northEastUpper.lat;
    },

    getTop: function () {
        return this._northEastUpper.alt;
    },

    getBottom: function () {
        return this._southWestLower.alt;
    },

    contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
        if (typeof obj[0] === 'number' || obj instanceof Z.LatLng) {
            obj = Z.LatLng.create(obj);
        } else {
            obj = Z.LatLngBounds.create(obj);
        }

        var sw = this._southWestLower,
            ne = this._northEastUpper,
            sw2, ne2;

        if (obj instanceof Z.LatLngBounds) {
            sw2 = obj.getSouthWest();
            ne2 = obj.getNorthEast();
        } else {
            sw2 = ne2 = obj;
        }

        var result = (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
            (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);

        if(result && obj.hasAltValue() && this.hasAltValue()){
            result = result && (sw2.alt >= sw.alt) && (ne2.alt <= ne.alt);
        }

        return result;
    },

    intersects: function (bounds) { // (LatLngBounds)
        bounds = Z.LatLngBounds.create(bounds);

        var sw = this._southWestLower,
            ne = this._northEastUpper,
            sw2 = bounds.getSouthWest(),
            ne2 = bounds.getNorthEast(),

            latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
            lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

        if(bounds.hasAltValue() && this.hasAltValue()){
            var altIntersects = (ne2.alt >= sw.alt) && (sw2.alt <= ne.alt);
        }

        return latIntersects && lngIntersects && altIntersects;
    },

    toBBoxString: function () {
        var bboxArray = [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()];

        if(this.hasAltValue()){
            bboxArray.push(this._southWestLower.alt);
            bboxArray.push(this._northEastUpper.alt);
        }

        return bboxArray.join(',');
    },

    equals: function (bounds) { // (LatLngBounds)
        if (!bounds) { return false; }

        bounds = Z.LatLngBounds.create(bounds);

        return this._southWestLower.equals(bounds.getSouthWest()) &&
            this._northEastUpper.equals(bounds.getNorthEast());
    },

    isValid: function () {
        return !!(this._southWestLower && this._northEastUpper);
    },

    hasAltValue: function(){
        return !isNaN(this._southWestLower.alt) && !isNaN(this._northEastUpper.alt);
    }
};
/**
 * Created by Administrator on 2015/11/12.
 */
Z.GLBounds = function(a, b){
    if (!a) { return; }

    var points = b ? [a, b] : a;

    for (var i = 0, len = points.length; i < len; i++) {
        this.extend(points[i]);
    }
};

Z.GLBounds.prototype = Object.create(Z.Bounds.prototype );
Z.GLBounds.prototype.constructor = Z.Bounds;

Z.GLBounds.prototype.getBottomLeft = function(){
    return new Z.Point(this.min.x, this.min.y, this.min.z);
};

Z.GLBounds.prototype.getTopRight = function () {
    return new Z.Point(this.max.x, this.max.y, this.max.z);
};

Z.GLBounds.prototype.getWidth = function () {
    return this.max.x - this.min.x;
};

Z.GLBounds.prototype.getHeight = function () {
    return this.max.y - this.min.y;
};

Z.GLBounds.prototype.getThickness = function () {
    return this.max.z - this.min.z;
};

Z.GLBounds.create = function (a, b) { //(Point, Point) or Point[]
    if (!a || a instanceof Z.GLBounds) {
        return a;
    }
    return new Z.GLBounds(a, b);
};
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Geometry = Z.Class.extend({
    initialize: function(){
        this.crs = null;
    },

    getBounds: function(){
        throw new error("getBounds方法尚未实现");
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Polyline = Z.Geometry.extend({
    initialize: function(paths, crs){      //paths为三维数组，例如：[[[80,120], [80,121], [78, 110]], [[98,101], [79,100], [89,110]]]
        this.crs = crs;
        this.paths = paths;
    },

    getBounds: function(){
        return Z.GeometryUtil.getPathBounds(this.paths);
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Polygon = Z.Geometry.extend({
    initialize: function(rings, crs){      //rings为三维数组，例如：[[[80,120], [80,121], [78, 110]], [[98,101], [79,100], [89,110]]]
        this.crs = crs;
        this.rings = rings;
    },

    getBounds: function(){
        return Z.GeometryUtil.getPathBounds(this.rings);
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Circle = Z.Geometry.extend({
    /**
     * 几何对象：圆。在三维场景中位于xy平面上，法线方向为左手坐标系的z轴负方向
     * @param center  中心点（空间坐标）
     * @param radius  半径（单位：米）
     * @param crs     坐标系
     */
    initialize: function(crs, center, radius, radiusType){
        this.crs = crs || Z.CRS.EPSG4490;
        this.center = center;
        this.radius = radius;
        this.radiusType = (radiusType === 'meter') ? 'meter' : 'pixel';   //pixel:半径单位为像素；meter：半径单位为米
    },

    getBounds: function(){
        //return Z.GeometryUtil.getPathBounds(this.rings);
        var bounds =null;

        if(this.crs &&  this.center){
            bounds = Z.LatLngBounds.create(this.center, this.center);

            if(typeof this.radius === "number"){
                var radiusLatLngOffset = this.crs.unprojectLatLngOffset(Z.LatLng.create(this.radius, this.radius)),
                    minLatLng = this.center.subtract(radiusLatLngOffset),
                    maxLatLng = this.center.add(radiusLatLngOffset);

                bounds = Z.LatLngBounds.create(minLatLng, maxLatLng);
            }

        }

        return null;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Sphere = Z.Geometry.extend({
    //所有的角度均用度表示而不是弧度
    initialize: function(crs, center, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength){
        this.crs = crs || Z.CRS.EPSG4490;   //默认坐标系
        this.center = center;
        this.radius = radius;
        this.widthSegments = widthSegments || 360;
        this.heightSegments = heightSegments || 180;
        this.phiStart = phiStart || 0;
        this.phiLength = phiLength || 360;
        this.thetaStart = thetaStart || 0;
        this.thetaLength = thetaLength || 180;
    },

    getBounds: function(){
        //return Z.GeometryUtil.getPathBounds(this.rings);
        var bounds =null;

        if(this.crs &&  this.center){
            bounds = Z.LatLngBounds.create(this.center, this.center);

            if(typeof this.radius === "number"){
                var radiusLatLngOffset = this.crs.unprojectLatLngOffset(Z.LatLng.create(this.radius, this.radius, this.radius)),
                    minLatLng = this.center.subtract(radiusLatLngOffset),
                    maxLatLng = this.center.add(radiusLatLngOffset);

                bounds = Z.LatLngBounds.create(minLatLng, maxLatLng);
            }

        }

        return null;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Ring = Z.Geometry.extend({
    /**
     * 几何对象：圆环。在三维场景中位于xy平面上，法线方向为左手坐标系的z轴负方向
     * 所有的角度均用度表示而不是弧度
     * @param crs   坐标系
     * @param center   中心点
     * @param innerRadius   内环半径
     * @param outerRadius   外环半径
     * @param thetaSegments   沿圆周方向被切分的分数
     * @param thetaStart    起始角
     * @param thetaLength   角度跨度
     */
    initialize: function(crs, center, innerRadius, outerRadius){
        this.crs = crs || Z.CRS.EPSG4490;   //默认坐标系
        this.center = center;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
    },

    getBounds: function(){
        //return Z.GeometryUtil.getPathBounds(this.rings);
        var bounds =null;

        if(this.crs &&  this.center){
            bounds = Z.LatLngBounds.create(this.center, this.center);

            if(typeof this.radius === "number"){
                var radiusLatLngOffset = this.crs.unprojectLatLngOffset(Z.LatLng.create(this.outerRadius, this.outerRadius)),
                    minLatLng = this.center.subtract(radiusLatLngOffset),
                    maxLatLng = this.center.add(radiusLatLngOffset);

                bounds = Z.LatLngBounds.create(minLatLng, maxLatLng);
            }

        }

        return null;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Box = Z.Geometry.extend({
    initialize: function(crs, center, width, height, depth){
        this.crs = crs || Z.CRS.EPSG4490;   //默认坐标系
        this.center = center;
        this.width = width;
        this.height = height;
        this.depth = depth;
    },

    getBounds: function(){
        //var bounds =null;
        //
        //if(this.crs &&  this.center){
        //    bounds = Z.LatLngBounds.create(this.center, this.center);
        //
        //    if(typeof this.radius === "number"){
        //        var radiusLatLngOffset = this.crs.unprojectLatLngOffset(Z.LatLng.create(this.outerRadius, this.outerRadius)),
        //            minLatLng = this.center.subtract(radiusLatLngOffset),
        //            maxLatLng = this.center.add(radiusLatLngOffset);
        //
        //        bounds = Z.LatLngBounds.create(minLatLng, maxLatLng);
        //    }
        //
        //}
        //
        //return null;
        throw new Error("方法getBounds未实现");
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Cylinder = Z.Geometry.extend({
    initialize: function(crs, bottomCenter, radiusTop, radiusBottom, height, radiusSegments, thetaStart, thetaLength, openEnded){
        this.crs = crs || Z.CRS.EPSG4490;   //默认坐标系
        this.bottomCenter = bottomCenter;
        this.radiusTop = radiusTop;
        this.radiusBottom = radiusBottom;
        this.height = height;
        this.radiusSegments = radiusSegments;
        this.thetaStart = thetaStart;
        this.thetaLength = thetaLength;
        this.openEnded = openEnded;
    },

    getBounds: function(){
        throw new Error("方法getBounds未实现");
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Extrude = Z.Geometry.extend({
    initialize: function(crs, paths, height, baseHeight){
        this.crs = crs || Z.CRS.EPSG4490;   //默认坐标系
        this.paths = paths;
        this.height = height;
        this.baseHeight = baseHeight || 0;
    },

    getBounds: function(){
        var pathBounds = Z.GeometryUtil.getPathBounds(this.paths),
            southWest = pathBounds.getSouthWest(),
            northEast = pathBounds.getNorthEast();

        southWest.alt = this.baseHeight;
        northEast.alt = this.baseHeight + this.height;

        return Z.LatLngBounds.create(southWest, northEast);
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Feature = Z.Class.extend({
    initialize: function(props, shape, options){
        this.props = props || {};
        this.shape = shape;
        this.options = options || {};
    }
});
/**
 * Created by Administrator on 2015/12/3.
 */
//处理空间坐标值与平面距离(米)的变化
Z.Projection = function(){
    this.DEG_TO_RAD = Math.PI / 180;
    this.RAD_TO_DEG = 180 / Math.PI;
};

//简单投影，不做任何转换。适用于图片浏览等应用
Z.Projection.Simple = Z.extend({}, Z.Projection, {
    project: function (latlng) {
        return new Z.Point(latlng.lng, latlng.lat);
    },

    unproject: function (point) {
        return new Z.LatLng(point.y, point.x);
    },

    //将平面偏移转换为空间坐标的偏移量
    planeOffsetToLatLng: function(planeOffset){
        return new Z.LatLng(planeOffset.y, planeOffset.x);
    },

    //将空间坐标的偏移量转换为平面偏移
    latLngOffsetToPlane: function(latLngOffset){
        return new Z.Point(latlng.lng, latlng.lat);
    }
});

//web墨卡托投影。将地球作为正球体
Z.Projection.SphericalMercator = Z.extend({}, Z.Projection, {
    MAX_LATITUDE: 85.0511287798,
    EarthRadius:6378137,
    Circumference: Math.PI * 6378137,    //半周长

    project: function (latlng) { // (LatLng) -> Point
        var d = this.DEG_TO_RAD, //L.LatLng.DEG_TO_RAD,
            max = this.MAX_LATITUDE,
            lat = Math.max(Math.min(max, latlng.lat), -max),
            x = latlng.lng * d,
            y = lat * d;

        y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));

        return new Z.Point(x, y).multiplyBy(this.EarthRadius);
    },

    unproject: function (point) { // (Point, Boolean) -> LatLng
        var d = this.RAD_TO_DEG, //L.LatLng.RAD_TO_DEG,
            newPoint = point.divideBy(this.EarthRadius);
            lng = newPoint.x * d,
            lat = (2 * Math.atan(Math.exp(newPoint.y)) - (Math.PI / 2)) * d;

        return new Z.LatLng(lat, lng);
    },

    planeOffsetToLatLng: function(planeOffset){
        var latLngOffset = new Z.LatLng(0, 0, 0);
        latLngOffset.lng = 180 * planeOffset.x / this.Circumference;
        latLngOffset.lat = 180 * planeOffset.y / this.Circumference;
        latLngOffset.alt = 180 * planeOffset.z / this.Circumference;

        return latLngOffset;
    },

    latLngOffsetToPlane: function(latLngOffset){
        var planeOffset = new Z.Point(0, 0, 0);
        planeOffset.x = this.Circumference * latLngOffset.lng / 180;
        planeOffset.y = this.Circumference * latLngOffset.lat / 180;
        planeOffset.z = this.Circumference * latLngOffset.alt / 180;

        return planeOffset;
    }
});

//墨卡托投影，将地球作为椭球体（wgs84椭球体）
Z.Projection.Mercator = Z.extend({}, Z.Projection, {
    MAX_LATITUDE: 85.0840591556,

    R_MINOR: 6356752.314245179,
    R_MAJOR: 6378137,
    Circumference: Math.PI * 6378137,

    project: function (latlng) { // (LatLng) -> Point
        var d = this.DEG_TO_RAD, //L.LatLng.DEG_TO_RAD,
            max = this.MAX_LATITUDE,
            lat = Math.max(Math.min(max, latlng.lat), -max),
            r = this.R_MAJOR,
            r2 = this.R_MINOR,
            x = latlng.lng * d * r,
            y = lat * d,
            tmp = r2 / r,
            eccent = Math.sqrt(1.0 - tmp * tmp),
            con = eccent * Math.sin(y);

        con = Math.pow((1 - con) / (1 + con), eccent * 0.5);

        var ts = Math.tan(0.5 * ((Math.PI * 0.5) - y)) / con;
        y = -r * Math.log(ts);

        return new Z.Point(x, y);
    },

    unproject: function (point) { // (Point, Boolean) -> LatLng
        var d = this.RAD_TO_DEG,//L.LatLng.RAD_TO_DEG,
            r = this.R_MAJOR,
            r2 = this.R_MINOR,
            lng = point.x * d / r,
            tmp = r2 / r,
            eccent = Math.sqrt(1 - (tmp * tmp)),
            ts = Math.exp(- point.y / r),
            phi = (Math.PI / 2) - 2 * Math.atan(ts),
            numIter = 15,
            tol = 1e-7,
            i = numIter,
            dphi = 0.1,
            con;

        while ((Math.abs(dphi) > tol) && (--i > 0)) {
            con = eccent * Math.sin(phi);
            dphi = (Math.PI / 2) - 2 * Math.atan(ts *
                    Math.pow((1.0 - con) / (1.0 + con), 0.5 * eccent)) - phi;
            phi += dphi;
        }

        return new Z.LatLng(phi * d, lng);
    },

    //椭球表面两点间距离需要通过微积分处理，为简化计算，此处当做地球是正球体进行近似计算。
    planeOffsetToLatLng: function(planeOffset){
        var latLngOffset = new Z.LatLng(0, 0, 0);
        latLngOffset.lng = 180 * planeOffset.x / this.Circumference;
        latLngOffset.lat = 180 * planeOffset.y / this.Circumference;

        return latLngOffset;
    },

    //椭球表面两点间距离需要通过微积分处理，为简化计算，此处当做地球是正球体进行近似计算。
    latLngOffsetToPlane: function(latLngOffset){
        var planeOffset = new Z.Point(0, 0, 0);
        planeOffset.x = this.Circumference * latLngOffset.x / 180;
        planeOffset.y = this.Circumference * latLngOffset.y / 180;

        return planeOffset;
    }
});
/**
 * Created by Administrator on 2015/11/20.
 */
Z.PyramidModel = function(options){
    if(!options){
        return null;
    }

    this._origin = Z.LatLng.create(options.origin) || new Z.LatLng(90, -180);
    this._tileSize = Z.Point.create(options.tileSize) || new Z.Point(256, 256);
    this._latLngBounds = Z.LatLngBounds.create(options.latLngBounds)
        || Z.LatLngBounds.create([this._origin.lat, this._origin.lng], [-this._origin.lat, -this._origin.lng]);
    //this._dpi = options.dpi || 96;
    this._levelDefine = options.levelDefine || [];

    this._levelDefine.sort(function(a,b){
        return parseInt(a.level) - parseInt(b.level);
    });

    this._levelMapping = {};

    for(var i = 0; i < this._levelDefine.length; i++){
        this._levelMapping[this._levelDefine[i].level + ""] = this._levelDefine[i];
    }
}

Z.PyramidModel.prototype = {
    /*返回指定级别的比例尺*/
    getScale: function(zoom){
        if(this._zoomInvalid(zoom)){
            return NaN;
        }

        return this._levelMapping[zoom + ""].scale;
    },

    /*返回指定级别的总的像素大小*/
    getPixelSize: function(zoom){
        if(this._zoomInvalid(zoom)){
            return NaN;
        }

        var bounds = this._latLngBounds,
            width = bounds.getEast() - bounds.getWest(),
            height = bounds.getNorth() - bounds.getSouth();

        return this._latLngSizeToPixelSize(width, height, zoom);
    },

    /*经纬度坐标转为像素坐标（相对于原点）*/
    latLngToPixelPoint: function(latLng, zoom){
        if(this._zoomInvalid(zoom) || !(latLng instanceof Z.LatLng)){
            return null;
        }

        return this._latLngSizeToPixelSize(latLng.lng - this._origin.lng,
            this._origin.lat - latLng.lat, zoom);
    },

    /*像素坐标（相对于原点）转为经纬度坐标*/
    pixelPointToLatLng: function(point, zoom){
        if(this._zoomInvalid(zoom) || !(point instanceof Z.Point)){
            return null;
        }

        var latLngPoint = this._pixelSizeToLatLngSize(point.x, point.y, zoom);
        latLngPoint.lat = this._origin.lat - latLngPoint.lat;
        latLngPoint.lng = this._origin.lng + latLngPoint.lng;

        return latLngPoint;
    },

    /*返回指定级别和坐标位置所在的瓦片行列号*/
    getTilePoint: function(latLng, zoom){
        var pixelPoint = this.latLngToPixelPoint(latLng, zoom);

        if(pixelPoint){
            var tileX = Math.floor(pixelPoint.x / this._tileSize.x);
            var tileY = Math.floor(pixelPoint.y / this._tileSize.y);

            return new Z.Point(tileX, tileY);
        }

        return null;
    },

    /*返回单张瓦片的经纬度范围*/
    getLatLngBounds: function(tilePoint, zoom){
        if(this._zoomInvalid(zoom) || !(tilePoint instanceof Z.Point)){
            return null;
        }

        var leftUpperPixelPoint = new Z.Point(tilePoint.x * this._tileSize.x, tilePoint.y * this._tileSize.y),
            rightLowerPixelPoint = new Z.Point((tilePoint.x + 1) * this._tileSize.x, (tilePoint.y + 1) * this._tileSize.y);
        var delta_leftUpper = this.pixelPointToLatLng(leftUpperPixelPoint, zoom);
        var delta_rightLower = this.pixelPointToLatLng(rightLowerPixelPoint, zoom);

        return Z.LatLngBounds.create(delta_leftUpper, delta_rightLower);
    },

    /*返回指定空间范围所在的行列号范围*/
    getTileBounds: function(latLngBounds, zoom){
        var leftLower = this.getTilePoint(latLngBounds.getSouthWest(), zoom),
            rightUpper = this.getTilePoint(latLngBounds.getNorthEast(), zoom);

        return new Z.Bounds(leftLower, rightUpper);
    },

    /*返回与指定空间范围最匹配的级别*/
    fitZoomLevel: function(latLngBounds, containerWidth, containerHeight){
        if(!(latLngBounds instanceof Z.LatLngBounds)){
            return null;
        }

        var resolution = Math.abs((latLngBounds.getEast() - latLngBounds.getWest())/containerWidth);
        var levels = this._levelDefine;
        var resoLoop = levels[0].resolution;

        if(resolution > resoLoop){
            return levels[0].level;
        }

        for(var i = 1; i < levels.length; i++){
            resoLoop = levels[i].resolution;

            if(resolution > resoLoop){
                return ((resolution - resoLoop) < (levels[i - 1].resolution - resolution)) ? levels[i].level : levels[i - 1].level;
            }
        }

        return levels[levels.length - 1].level;
    },

    _zoomInvalid: function(zoom){
        return !this._levelMapping[zoom + ""];
    },

    _latLngSizeToPixelSize: function(latLngWidth, latLngHeight, zoom){
        var resolution = this._levelMapping[zoom + ""].resolution,
            width = Math.floor(latLngWidth /  resolution),
            height = Math.floor(latLngHeight / resolution);

        return new Z.Point(width, height);
    },

    _pixelSizeToLatLngSize: function(pixelWidth, pixelHeight, zoom){
        var resolution = this._levelMapping[zoom + ""].resolution,
            width = resolution * pixelWidth,
            height = resolution * pixelHeight;

        return new Z.LatLng(height, width);
    }
}
/**
 * Created by Administrator on 2015/12/3.
 */
Z.CRS = {
    projection: null,
    code:'',

    latLngToMeterPoint: function (latlng) { // (LatLng) -> Point
        return this.projection.project(latlng);
    },

    meterPointToLatLng: function (point) { // (Point) -> LatLng
        return this.projection.unproject(point);
    },

    projectLatLngOffset: function (latLngOffset) { // (LatLng) -> Point
        return this.projection.latLngOffsetToPlane(latLngOffset);
    },

    unprojectLatLngOffset: function (distance) { // (Point) -> LatLng
        return this.projection.planeOffsetToLatLng(distance);
    }
};

Z.CRS.Simple = Z.extend({}, Z.CRS, {
    code:'simple',
    projection: Z.Projection.Simple
});

Z.CRS.EPSG3857 = Z.extend({}, Z.CRS, {
    code: 'EPSG:3857',
    projection: Z.Projection.SphericalMercator
});

Z.CRS.EPSG900913 = Z.extend({}, Z.CRS, {
    code: 'EPSG:900913',
    projection: Z.Projection.SphericalMercator
});

Z.CRS.EPSG4490 = Z.extend({}, Z.CRS, {
    code: 'EPSG:4490',
    projection: Z.Projection.SphericalMercator
});

Z.CRS.CGS2000 = Z.extend({}, Z.CRS.EPSG4490);

Z.CRS.EPSG4326 = Z.extend({}, Z.CRS, {
    code: 'EPSG:4326',
    projection: Z.Projection.Mercator
});
/**
 * Created by Administrator on 2015/10/31.
 */
Z.IGraphicLayerRender = Z.Class.extend({
    includes: Z.EventManager,

    onAdd: function(scene){ },

    onRemove: function(scene){},

    show: function(){},

    hide: function(){},

    setOpacity: function(opacity){},

    getZIndex: function(){},

    setZIndex: function(zIndex){},

    refresh: function(tileOptions){},

    addGraphic: function(graphicLayer, graphic){},

    removeGraphic: function(graphicLayer, graphic){},

    clear: function(){}
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.IGraphicRender = Z.Class.extend({
    includes: Z.EventManager,

    initialize: function(){

    },

    onAdd: function(featureLayer){
        throw new Error("方法onAdd未实现");
    },

    onRemove: function(featureLayer){
        throw new Error("方法onRemove未实现");
    },

    updateGeometry: function(geometry){},

    updateSymbol: function(symbol){}
});
/**
 * Created by Administrator on 2015/10/25.
 */

Z.ILayer = Z.Class.extend({
    includes: Z.EventManager,

    onAdd: function(scene){},

    onRemove: function(scene){},

    show: function(){},

    hide: function(){},

    setOpacity: function(opacity){},

    setZIndex: function(zIndex){},

    setZoomRange: function(minZoom, maxZoom){},

    getContainerPane: function(){},

    refresh: function(){}
});

/**
 * Created by Administrator on 2015/10/26.
 */
Z.IScene = Z.Class.extend({
    includes: Z.EventManager,

    getBounds: function(){ return null;},

    getPixelSceneRatio: function(){return null},

    setZoom: function(zoomLevel){},

    getZoom: function(){},

    getScale: function(zoom){},

    getSize: function(){},

    panTo: function(center, zoomLevel){},

    //getContentSize: function(){return null;},

    latLngToScreenPoint: function(latLng){return null; },

    screenPointToLatLng: function(point){},

    addLayer: function(layer){},

    removeLayer: function(layer){},

    openPopup: function(popup){},

    closePopup: function(popup){},

    addControl: function(control){},

    removeControl: function(control){ },

    refresh: function(){},

    setSunLight: function(angle){},

    setAmbientLight: function(color){},

    rotateByEuler: function(rotate){},

    resetRotate: function(){},

    getRotateByRad: function(){},

    getContentBounds: function(){}

    //on: function(event, func){},
    //
    //off: function(event, func){}
});
/**
 * Created by Administrator on 2015/10/31.
 */
Z.ITileRender = Z.Class.extend({
    includes: Z.EventManager,

    onAdd: function(scene){ },

    onRemove: function(scene){},

    show: function(){},

    hide: function(){},

    setOpacity: function(opacity){},

    setZIndex: function(zIndex){},

    refresh: function(tileOptions){}
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Symbol = Z.Class.extend({
    initialize: function(options){
        options = options || {};
        this.opacity = (typeof options.opacity === 'number') ? options.opacity : 1;
    },

    clone: function(options){
        return new Z.Symbol();
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.MarkerSymbol = Z.Symbol.extend({
    initialize: function(options){
        Z.Symbol.prototype.initialize.call(this, options);
        options = options || {};
        this.width = options.width;     //float，单位为像素
        this.height = options.height;   //float，单位为像素
        this.offset = options.offset;   //Z.Point，相对于中心点的偏移量，x为正时向右偏移，y为正时向上偏移，单位为像素
    },

    clone: function(){
        var symbol = new Z.MarkerSymbol(),
            parentSymbol = Z.Symbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.width = this.width;
        symbol.height = this.height;
        symbol.offset = this.offset;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.FontStyle = {
    Normal: 'normal',         //正体
    Italic: 'italic'          //斜体
};
/**
 * Created by Administrator on 2015/12/2.
 */
Z.FontWeight = {
    Normal: 'normal',         //正常
    Bold: 'bold'            //粗体
};
/**
 * 字体
 */
Z.FontFamily = {
    Helvetiker: 'helvetiker',
    Optimer: 'optimer',
    Gentilis: 'gentilis',
    DroidSans: 'droid sans',
    DroidSerif: 'droid serif'
};
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Font = function(options){
    options = options || {};
    //this.decoration;
    this.family = options.family || Z.FontFamily.Helvetiker;         //字体名称
    this.size = options.size || 5;           //字体大小
    this.style = options.style || Z.FontStyle.Normal;          //字体样式：normal, italics
    //this.variant;
    this.weight = options.weight || Z.FontWeight.Normal;        //normal, bold
};

Z.Font.prototype.clone = function(){
    var font = new Z.Font();
    font.family = this.family;
    font.size = this.size;
    font.style = this.style;
    font.weight = this.weight;

    return font;
};
/**
 * Created by Administrator on 2015/12/2.
 */
Z.SimpleMarkerType = {
    Circle: 1,
    Square: 2,
    Triangle:3,
    Sphere: 4,
    Cube: 5
};
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PolylineStyleType = {
    Dash: 1,
    //DashDot: 2,
    //DashDotDot: 3,
    //Dot: 4,
    //LongDash: 5,
    //LongDashDot: 6,
    //ShortDash: 7,
    //ShortDashDot: 8,
    //ShortDashDotDot: 9,
    //ShortDot: 10,
    Solid: 11,
    Null:12
};
/**
 * Created by Administrator on 2015/12/2.
 */
Z.FillStyleType = {
    Solid: 0,
    Null:1
};
/**
 * Created by Administrator on 2015/12/2.
 */
//默认情况下定位点在图片下边沿的正中间
Z.PictureMarkerSymbol = Z.MarkerSymbol.extend({
    initialize: function(options){   //url=>string
        Z.MarkerSymbol.prototype.initialize.call(this, options);
        this.url = options.url;
    },

    clone: function(){
        var symbol = new Z.PictureMarkerSymbol(),
            parentSymbol = Z.MarkerSymbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.url = this.url;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.SimpleMarkerSymbol = Z.MarkerSymbol.extend({
    initialize: function(options){
        options = options || {};
        Z.MarkerSymbol.prototype.initialize.apply(this, options);
        this.type = options.type || Z.SimpleMarkerType.Square;
        this.borderColor = options.borderColor;
        this.borderWidth = options.borderWidth;
        this.fill = options.fill;
        this.fillColor = options.fillColor;
    },

    clone: function(){
        var symbol = new Z.SimpleMarkerSymbol(),
            parentSymbol = Z.MarkerSymbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.type = this.type;
        symbol.borderColor = this.borderColor;
        symbol.borderWidth = this.borderWidth;
        symbol.fill = this.fill;
        symbol.fillColor = this.fillColor;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.TextSymbol = Z.MarkerSymbol.extend({
    initialize: function(options){
        options = options || {};
        Z.MarkerSymbol.prototype.initialize.call(this, options);
        this.text = options.text;             //string
        this.font = options.font ? new Z.Font(options.font) : new Z.Font();
        this.color= options.color || '#222222';                                                           //文字颜色
        this.fill = (typeof options.fill === "boolean") ? options.fill : true;                           //是否填充文本区域
        this.fillSymbol = (options.fillSymbol instanceof Z.FillSymbol) ? options.fillSymbol : new Z.SimpleFillSymbol(options.fillSymbol);
        this.border = (typeof options.border === "boolean") ? options.border : true;                         //是否显示文本区域边框
        this.borderSymbol = (options.borderSymbol instanceof Z.PolylineSymbol) ? options.borderSymbol : new Z.PolylineSymbol(options.borderSymbol);
        //this.align = options.align;
    },

    clone: function(){
        var symbol = new Z.TextSymbol(),
            parentSymbol = Z.MarkerSymbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.text = this.text;
        symbol.font = this.font.clone();
        symbol.color = this.color;
        symbol.fill = this.fill;
        symbol.fillColor = this.fillColor;
        symbol.fillOpacity = this.fillOpacity;
        symbol.border = this.border;
        symbol.borderColor = this.borderColor;
        symbol.borderOpacity = this.borderOpacity;
        symbol.borderWidth = this.borderWidth;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PolylineSymbol = Z.Symbol.extend({
    initialize: function(options){
        Z.Symbol.prototype.initialize.call(this, options);
        options = options || {};
        this.color = options.color || '#555500';
        this.width = options.width || 1;
        this.style= options.style || Z.PolylineStyleType.Solid;
        this.only2d = true;             //是否只作为二维图形显示，弱为ture则会忽略坐标点本身的z坐标
    },

    clone: function(){
        var symbol = new Z.PolylineSymbol(),
            parentSymbol = Z.Symbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.color = this.color;
        symbol.width = this.width;
        symbol.style = this.style;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.FillSymbol = Z.Symbol.extend({
    initialize: function(options){
        Z.Symbol.prototype.initialize.call(this, options);
        options = options || {};
        this.bgColor = options.bgColor || '#aaaaaa';
    },

    clone: function(){
        var symbol = new Z.FillSymbol(),
            parentSymbol = Z.Symbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.bgColor = this.bgColor;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.SimpleFillSymbol = Z.FillSymbol.extend({
    initialize: function(options){
        options = options || {};
        Z.FillSymbol.prototype.initialize.call(this, options);
        this.color = options.color || '#ffffff';
        this.style = options.style || Z.FillStyleType.Solid;
    },

    clone: function(){
        var symbol = new Z.SimpleFillSymbol(),
            parentSymbol = Z.FillSymbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.color = this.color;
        symbol.style = this.style;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PictureFillSymbol = Z.FillSymbol.extend({
    initialize: function(options){
        options = options || {};
        Z.FillSymbol.prototype.initialize.call(this, options);
        this.url = options.url;
    },

    clone: function(){
        var symbol = new Z.PictureFillSymbol(),
            parentSymbol = Z.FillSymbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.url = this.url;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PolygonSymbol = Z.Symbol.extend({
    initialize: function(options){
        options = options || {};
        Z.Symbol.prototype.initialize.call(this, options);
        this.polylineSymbol = options.polylineSymbol || new Z.PolylineSymbol();
        this.polylineSymbol.opacity = (typeof this.polylineSymbol.opacity === "number") ? this.polylineSymbol.opacity : this.opacity;
        this.fillSymbol = options.fillSymbol || new Z.SimpleFillSymbol();
        this.fillSymbol.opacity = (typeof this.fillSymbol.opacity === "number") ? this.fillSymbol.opacity : this.opacity;
        this.hidePolyline = (typeof options.hidePolyline === "boolean") ? options.hidePolyline : false;
        this.hideFill = (typeof options.hideFill === "boolean") ? options.hidePolyline : false;
        //this.only2d = false;   //是否只作为二维图形显示，弱为ture则会忽略坐标点本身的z坐标
    },

    clone: function(){
        var symbol = new Z.PolygonSymbol(),
            parentSymbol = Z.Symbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.polylineSymbol = this.polylineSymbol.clone();
        symbol.fillSymbol = this.fillSymbol.clone();
        symbol.hidePolyline = this.hidePolyline;
        symbol.hideFill = this.hideFill;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.ExtrudeSymbol = Z.Symbol.extend({
    initialize: function(options){
        Z.Symbol.prototype.initialize.call(this, options);
        options = options || {};
        this.topColor = options.topColor || '#aaaaaa';
        this.topImageUrl = options.topImageUrl;
        this.wallColor = options.wallColor || '#aaaaaa';
        this.wallImageUrl = options.wallImageUrl;
    },

    clone: function(){
        var symbol = new Z.ExtrudeSymbol(),
            parentSymbol = Z.Symbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.topColor = this.topColor;
        symbol.topImageUrl = this.topImageUrl;
        symbol.wallColor = this.wallColor;
        symbol.wallImageUrl = this.wallImageUrl;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.CircleSymbol = Z.Symbol.extend({
    initialize: function(options){
        Z.Symbol.prototype.initialize.call(this, options);
        this.borderSymbol = options.borderSymbol || new Z.PolylineSymbol;
        this.borderSymbol.opacity = (typeof this.borderSymbol.opacity === "number") ? this.borderSymbol.opacity : this.opacity;
        this.fillSymbol = options.fillSymbol || new Z.SimpleFillSymbol;
        this.fillSymbol.opacity = (typeof this.fillSymbol.opacity === "number") ? this.fillSymbol.opacity : this.opacity;
        this.hidePolyline = (typeof options.hideBorder === "boolean") ? options.hideBorder : false;
        this.hideFill = (typeof options.hideFill === "boolean") ? options.hideFill : false;
        this.segments = (typeof options.segments === "number") ? options.segments : 360;
    },

    clone: function(){
        var symbol = new Z.CircleSymbol(),
            parentSymbol = Z.Symbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.borderSymbol = this.borderSymbol.clone();
        symbol.fillSymbol = this.fillSymbol.clone();
        symbol.hideBorder = this.hideBorder;
        symbol.hideFill = this.hideFill;
        symbol.segments = this.segments;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.RingSymbol = Z.CircleSymbol.extend({
    initialize: function(options){
        Z.CircleSymbol.prototype.initialize.call(this, options);
    },

    clone: function(){
        var symbol = new Z.RingSymbol(),
            parentSymbol = Z.Symbol.prototype.clone.apply(this, arguments);
        Z.Util.ObjectClone(parentSymbol, symbol);
        symbol.borderSymbol = this.borderSymbol.clone();
        symbol.fillSymbol = this.fillSymbol.clone();
        symbol.hidePolyline = this.hidePolyline;
        symbol.hideFill = this.hideFill;
        symbol.segments = this.segments;

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.Graphic = Z.Class.extend({
    includes: Z.EventManager,

    initialize: function(feature, symbol, options){
        this.feature = feature;
        this.symbol = symbol;
        this.options = options || {};
        this._layer = null;
        //this._render = null;
        this._titleElement = null;
        this._scene = null;
        this._mainElement = null;
    },

    updateFeature: function(feature){
        if(feature instanceof Z.Feature){
            this.feature = feature;

            //if(this._render){
            //    this._render.updateGeometry(feature.shape);
            //}
            if(this._mainElement){
                this._mainElement.updateFeature(feature);
            }
        }
    },

    updateSymbol: function(symbol){
        if(symbol){
            this.symbol = symbol;

            //if(this._render){
            //    this._render.updateMaterial(symbol);
            //}
            if(this._mainElement){
                this._mainElement.updateSymbol(symbol);
            }
        }
    },

    //onAdd: function(graphicLayer, container, scene, anchor, baseIndex, layerIndex){
    onAdd: function(graphicLayer, container, scene){
        if(!(this.feature instanceof Z.Feature) || !(this.symbol instanceof Z.Symbol)){
            console.info("feature或者symbol属性不合法");
            return;
        }

        if(!this._mainElement){
            this._mainElement = new Z.GraphicElement(this.feature, this.symbol);
            this._mainElement.ownerGraphic = this;
        }

        if(!this.feature.shape.crs){
            this.feature.shape.crs = scene.options.crs;
        }

        //var containerRoot = container.root,
        //    baseIndex = graphicLayer.getContainerPane().index,
        //    layerIndex = graphicLayer.getZIndex();
        //this._mainElement.onAdd(graphicLayer, containerRoot, scene, baseIndex, layerIndex);
        this._mainElement.onAdd(graphicLayer, container, scene);

        this._layer = graphicLayer;
        this._container = container;
        this._scene = scene;
    },

    onRemove: function(graphicLayer){
        if(this._mainElement){
            this._mainElement.onRemove(graphicLayer);
            this._mainElement = null;
        }

        if(this._titleElement){
            this._titleElement.onRemove(graphicLayer);
            this._titleElement = null;
        }

        this._layer = null;
    },

    refresh: function(){
        if(this._mainElement){
            this._mainElement.refresh();
        }

        if(this._titleElement){
            this._titleElement.refresh();
        }
    },

    showTitle: function(){
        var text = this._getTitleText();

        if(text && this._layer){
            var graphic = this._getTitleGraphic();
            var gSymbol = graphic.symbol;
            gSymbol.text = text;

            //if(!this._layer.hasGraphic(graphic)){
            //    this._layer.addGraphic(graphic);
            //}else{
            //    graphic.updateSymbol(gSymbol);
            //}
            if(this._layer.hasGraphic(graphic)){
                this._layer.removeGraphic(graphic);
            }

            this._titleElement.onAdd(this._layer, this._container, this._scene);
        }
    },

    hideTitle: function(){
        if(this._titleElement && this._layer){
            //this._layer.removeGraphic(this._titleElement);
            this._titleElement.onRemove(this._layer);
        }
    },

    showMarker: function(){},

    hideMarker: function(){},

    _getTitleText: function(){
        var text = this.options.titleText,
            prop = this.options.titleProp;

        if(prop && this.feature.props[prop]){
            text = this.feature.props[prop];
        }

        return text + "";
    },

    _getTitleGraphic: function(){
        if(this._titleElement){
            return this._titleElement;
        }else{
            var symbol = this._getTitleSymbol(),
                shape = this._getTitlePos(),
                feature = new Z.Feature({}, shape);

            this._titleElement = new Z.GraphicElement(feature, symbol);
            this._titleElement.ownerGraphic = this;

            return this._titleElement;
        }
    },

    _getTitlePos:function(){
        var shp = this.feature.shape, pos;

        if(shp instanceof Z.LatLng){
            pos = shp.clone();
        }else{
            var bounds = shp.getBounds();
            pos = bounds.getCenter();
            pos.alt = bounds.getNorthEast().alt;
        }

        return pos;
    },

    _getTitleSymbol: function(){
        var symbol = this.options.titleSymbol.clone();

        if(!symbol){
            symbol = new Z.TextSymbol();
        }

        return symbol;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.GraphicElement = Z.Class.extend({
    includes: Z.EventManager,

    initialize: function(feature, symbol, options){
        this.feature = feature;
        this.symbol = symbol;
        this.options = options || {};
        this.ownerGraphic = null;
        this._layer = null;
        this._render = null;
        //this._scene = null;
    },

    updateFeature: function(feature){
        if(feature instanceof Z.Feature){
            this.feature = feature;

            if(this._render){
                this._render.updateGeometry(feature.shape);
            }
        }
    },

    updateSymbol: function(symbol){
        if(symbol){
            this.symbol = symbol;

            if(this._render){
                this._render.updateSymbol(symbol);
            }
        }
    },

    //onAdd: function(graphicLayer, container, scene, baseIndex, layerIndex){
    onAdd: function(graphicLayer, container, scene){
        var graphicRender = this._getGraphicRender(graphicLayer, scene);

        if(!graphicRender){
            return;
        }

        if(this._render !== graphicRender){
            this._render = graphicRender;
            //this._render.onAdd(graphicLayer, container, scene, baseIndex, layerIndex);
            this._render.onAdd(graphicLayer, container, scene);
            //this._scene = scene;
        }

        this._layer = graphicLayer;
    },

    onRemove: function(graphicLayer){
        if(this._render){
            this._render.onRemove(graphicLayer);
            this._render = null;
        }

        this._layer = null;
        this.ownerGraphic = null;
        //this._scene = null;
    },

    refresh: function(){
        //this.updateFeature(this.feature);
        if(this._render){
            this._render.refresh();
        }
    },

    //返回与graphicLayer匹配的render对象。如果已添加到graphicLayer中，直接返回现有render，否则将render从原有graphicLayer中移除并创建新的render对象。
    _getGraphicRender: function(graphicLayer, scene){
        if(this._render){
            if(graphicLayer === this._layer){
                return this._render;
            }else{
                this.onRemove(graphicLayer);
                return this._createGraphicRender(graphicLayer, scene);
            }
        }else{
            return this._createGraphicRender(graphicLayer, scene);
        }
    },

    _createGraphicRender: function(graphicLayer, scene){
        return Z.GraphicRenderFactory.getGraphicRender(this, scene);
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.GraphicRenderFactory = {
    getGraphicRender: function(graphicElement, scene){
        if(!(graphicElement instanceof Z.GraphicElement)|| !(scene instanceof Z.IScene)){
            return null;
        }

        var geometry = graphicElement.feature ? graphicElement.feature.shape : null;

        if(!geometry){
            return null;
        }

        if(scene instanceof Z.Scene2D){
            return this._getGraphicRender2D(graphicElement, geometry);
        }else if(scene instanceof Z.Scene3D){
            return this._getGraphicRender3D(graphicElement, geometry);
        }else{
            throw new Error("不支持的scene类型：" + scene.constructor);
        }
    },

    _getGraphicRender2D: function(graphicElement, geometry){
        if(geometry instanceof Z.Polyline){
            return new Z.PolylineRender2D(graphicElement);
        }else if(geometry instanceof Z.Polygon){
            return new Z.PolygonRender2D(graphicElement);
        }else if(geometry instanceof Z.LatLng && graphicElement.symbol instanceof Z.PictureMarkerSymbol){
            return new Z.PictureMarkerRender2D(graphicElement);
        }else if(geometry instanceof Z.LatLng && graphicElement.symbol instanceof Z.TextSymbol){
            return new Z.TextMarkerRender2D(graphicElement);
        }else if(geometry instanceof Z.Circle){
            return new Z.CircleMarkerRender2D(graphicElement);
        }else{
            console.info("不支持的Geometry类型:" + geometry.constructor);
            return null;
        }
    },

    _getGraphicRender3D: function(graphicElement, geometry){
        if(geometry instanceof Z.Polyline){
            if(graphicElement.symbol.only2d){
                return new Z.CanvasPolylineRender3D(graphicElement);
            }else{
                return new Z.PolylineRender3D(graphicElement);
            }
        }else if(geometry instanceof Z.Polygon){
            return new Z.PolygonRender3D(graphicElement);
        }else if(geometry instanceof Z.LatLng && graphicElement.symbol instanceof Z.PictureMarkerSymbol){
            return new Z.PictureMarkerRender3D(graphicElement);
        }else if(geometry instanceof Z.LatLng && graphicElement.symbol instanceof Z.TextSymbol){
            return new Z.CanvasTextRender3D(graphicElement);
        }else if(geometry instanceof Z.Extrude){
            return new Z.ExtrudeRender3D(graphicElement);
        }else if(geometry instanceof Z.Circle){
            return new Z.CircleMarkerRender3D(graphicElement);
        }else if(geometry instanceof Z.Ring){
            return new Z.RingMarkerRender3D(graphicElement);
        }else{
            //throw new Error("不支持的Geometry类型:" + geometry.constructor);
            console.info("不支持的Geometry类型:" + geometry.constructor);
            return null;
        }
    }
};
/**
 * Created by Administrator on 2015/12/2.
 */
Z.SpriteContainer = Z.Class.extend({
    includes: Z.EventManager,

    initialize: function(sprite, offset){   //sprite=>THREE.Object3D, offset=>Z.Point
        if(!(sprite instanceof THREE.Object3D) && !(sprite instanceof THREE.Geometry)){
            throw new Error("缺少sprite参数");
        }

        this.sprite = sprite;
        var spriteOriginPosition = sprite.position.clone();
        this.sprite.position.set(0, 0, 0);

        this._container = new THREE.Object3D();
        this._container.add(this.sprite);
        this._container.position.set(spriteOriginPosition.x, spriteOriginPosition.y, spriteOriginPosition.z);
        this.setOffset(offset);
    },

    setPosition: function(x, y, z){
        this._container.position.set(x, y, z);
    },

    setOffset: function(offset){
        if(!(offset instanceof Z.Point)){
            return;
        }

        this.sprite.position.set(offset.x, offset.y, offset.z);
    },

    setScale: function(scale){
        if(!(scale instanceof Z.Point)){
            return;
        }

        this.sprite.scale.set(scale.x || 1, scale.y || 1, scale.z || 1);
    },

    onAdd: function(scene){
        this._scene = scene;
        this.refresh();
    },

    refresh: function(){
        if(this._scene){
            var mapRotate = this._scene.getRotateByRad();
            this._container.setRotationFromQuaternion(new THREE.Quaternion(mapRotate.x, mapRotate.y, mapRotate.z, mapRotate.w));
        }
    },

    getThreeObject: function(){
        return this._container;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.MultiGraphic = Z.Class.extend({
    includes: Z.EventManager,

    initialize: function(feature, graphics, options){
        this.feature = feature;
        this.graphics = graphics instanceof Array ? graphics : [];
        this.options = options || {};
        //this._layer = null;
        this._container = null;
        this._graphicRoot = new THREE.Object3D();
        //this._scene = null;
    },

    updateFeature: function(feature){
        for(var i = 0; i < this.graphics.length; i++){
            this.graphics[i].updateFeature(feature);
        }
    },

    updateSymbol: function(symbol){
        for(var i = 0; i < this.graphics.length; i++){
            this.graphics[i].updateSymbol(symbol);
        }
    },

    onAdd: function(graphicLayer, container, scene, baseIndex, layerIndex){
        this._container = container;
        container.add(this._graphicRoot);

        for(var i = 0; i < this.graphics.length; i++){
            this.graphics[i].onAdd(graphicLayer, this._graphicRoot, scene, baseIndex, layerIndex);
        }
    },

    onRemove: function(graphicLayer){
        for(var i = 0; i < this.graphics.length; i++){
            this.graphics[i].onRemove(graphicLayer);
        }

        this._container.remove(this._graphicRoot);
    },

    refresh: function(){
        for(var i = 0; i < this.graphics.length; i++){
            this.graphics[i].refresh();
        }
    }
});
/**
 * Created by Administrator on 2015/12/2.
 * 根据symbol创建对应的材质对象
 */
Z.StyleBuilder3D = function(){};

Z.StyleBuilder3D.createRenderStyle = function(symbol, renderType){
    symbol = symbol || {};
    var style = null,
        opacity = symbol.opacity,
        options = {
            transparent: true,
            opacity: opacity
        };

    if(symbol instanceof Z.FillSymbol){
        if(symbol instanceof Z.PictureFillSymbol){
            var bgColor = symbol.bgColor || 0xffffff;
            options.color = bgColor;
            //style = new THREE.MeshBasicMaterial({color: bgColor, transparent: true, opacity: opacity});
            //fillMaterial.map = texture;
            //this._textureForLoad.push({material:fillMaterial, url: fillSymbol.url});
        }else{
            var fillColor = symbol.color|| symbol.bgColor || 0xffffff;
            options.color = fillColor;

            //style = new THREE.MeshBasicMaterial({
            //    color:fillColor
            //});
        }

        if(renderType === "lambert"){
            style = new THREE.MeshLambertMaterial(options);
        }else if(renderType === "phong"){
            style = new THREE.MeshPhongMaterial(options);
        }else{
            style = new THREE.MeshBasicMaterial(options);
        }
    }else if(symbol instanceof Z.PolylineSymbol){
        var color = symbol.color || 0xffffff,
            width = symbol.width || 1;
        options.color = color;
        options.linewidth = width;

        if(symbol.style === Z.PolylineStyleType.Dash){
            options.dashSize = dashSize;
            options.gapSize = gapSize;
            style = new THREE.LineDashedMaterial(options);
        }else{
            style = new THREE.LineBasicMaterial(options);
        }
    }

    return style;
}

Z.StyleBuilder3D.createDefaultRenderStyle = function(type, options){
    var style = null;
    type = (type + "").toLowerCase();

    if(type === "fillsymbol" || type === "simplefillsymbol"){
        style = Z.StyleBuilder3D.createRenderStyle(new Z.SimpleFillSymbol(options));
    }else if(type === "picturefillsymbol"){
        style = Z.StyleBuilder3D.createRenderStyle(new Z.PictureFillSymbol(options));
    }else if(type === "linesymbol"){
        style = Z.StyleBuilder3D.createRenderStyle(new Z.PolylineSymbol(options));
    }

    return style;
}
/**
 * Created by Administrator on 2015/12/2.
 */
Z.CanvasTexture = Z.Class.extend({
    initialize: function(options){
        this._element = null;
        this._context = null;
        this.options = {
            padding: 5,                //内边距，单位为像素
            width: 100,                //单位为像素
            height:100,                //单位为像素
            autoWidth: true,         //是否根据内容自动计算宽度
            autoHeight: true,        //是否根据内容自动计算高度
            //bgColor: 0xffffff,
            //bgOpacity: 1,            //默认背景不透明
            fill: true,
            fillSymbol: new Z.SimpleFillSymbol(),
            border: true,
            borderSymbol:new Z.PolylineSymbol(),
            opacity: 1
        };

        this.options = Z.Util.applyOptions(this.options, options, false);
    },

    draw: function(content, options){
        var context = this._getContext();
        this.drawContent(context, content, options);
    },

    drawContent: function(context, content, options){
        //textSymbol = textSymbol || new Z.TextSymbol();
        //this._setCanvasFont(context, textSymbol);
        ////根据文字内容的大小设置canvas大小
        //this._setCanvasSize(this._element, context, textSymbol.text);
        ////改变canvas大小后，canvas的所有内容和设置都会被清空，所以此处需重设字体
        //this._setCanvasFont(context, textSymbol);
        //this._fillBackground(this._element, context, textSymbol);
        //this._fillText(this._element, context, textSymbol.text);
    },

    clear: function(){
        if(this._context){
            this._context.clearRect(0, 0, this._element.width, this._element.height);
        }
    },

    dispose: function(){
        this._context = null;
        this._element = null;
    },

    getElement: function(){
        return this._element;
    },

    getsSize: function(){
        if(this._element){
            return new Z.Point(this._element.width, this._element.height);
        }else{
            return new Z.Point(0, 0);
        }
    },

    _getContext: function(){
        if(!this._element){
            this._element = this._createCanvasElement();
        }

        if(!this._context){
            this._context = this._element.getContext( '2d' );
        }

        if(this._context.globalAlpha !== this.options.opacity){
            this._context.globalAlpha === this.options.opacity;
        }

        return this._context;
    },

    _createCanvasElement: function(){
        var canvas = document.createElement( 'canvas'),
            canvasPadding = this.options.padding;
        canvas.style.padding = canvasPadding + "px";

        return canvas;
    },

    //_setCanvasFont: function(canvasContext, symbol){
    //    var fontFamily = symbol.font.family,
    //        fontWeight = symbol.font.weight,
    //        fontStyle = symbol.font.style,
    //        fontSize = symbol.font.size;
    //    canvasContext.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;
    //    canvasContext.fillStyle = symbol.color;//'blue';//symbol.color;
    //},

    //_calculateCanvasSize: function(canvas, canvasContext, text){
    //    var size = canvasContext.measureText(text),
    //        canvasPadding = this.options.padding;
    //    var width = size.width + canvasPadding * 2;
    //    size = canvasContext.measureText("中");
    //    var height = size.width * 1.5 + canvasPadding * 2;     //部分英文字母（g、y等）显示时下底位置比中文低1/3，h等字母上底则与中文持平，因此此处将中文字体算出来的高度乘以1.5，便于同时显示中英文
    //
    //    return {width: width, height: height};
    //},
    //
    //_setCanvasSize: function(canvas, canvasContext, text){
    //    if(this.options.autoWidth || this.options.autoHeight){
    //        var size = this._calculateCanvasSize(canvas, canvasContext, text);
    //        canvas.width = this.options.autoWidth ? size.width : this.options.width;
    //        canvas.height = this.options.autoHeight ? size.height : this.options.height;
    //    }else{
    //        canvas.width = this.options.width;
    //        canvas.height = this.options.height;
    //    }
    //},
    //
    //_fillBackground: function(canvas, canvasContext, symbol){
    //    if(!symbol.fillSymbol && !symbol.borderSymbol){
    //        return;
    //    }
    //
    //
    //    if(symbol.fill){
    //        var oldFillStyle = canvasContext.fillStyle;
    //        canvasContext.fillStyle = this._getStyle(symbol.fillSymbol.color, symbol.fillSymbol.opacity);//symbol.fillColor;
    //        canvasContext.fillRect(0,0,canvas.width,canvas.height);
    //        canvasContext.fillStyle = oldFillStyle;
    //    }
    //
    //    if(symbol.border){
    //        var oldStrokeStyle = canvasContext.strokeStyle;
    //        canvasContext.lineWidth = symbol.borderWidth;
    //        canvasContext.strokeStyle = this._getStyle(symbol.borderSymbol.color, symbol.borderSymbol.opacity);//symbol.borderColor;
    //        canvasContext.strokeRect(0,0,canvas.width, canvas.height);
    //        canvasContext.strokeStyle = oldStrokeStyle;
    //    }
    //},

    //将字符串或16进制形式的颜色值中的rgb值提取出来并加入透明度，重组为rgba(r, g, b, a)格式
    _getStyle: function(color, opacity){
        var result = color;

        if(typeof color === "string"){
            if(color.length >= 7 && color.indexOf("#") >= 0){
                color = color.substring(color.indexOf("#") + 1);
                var r = (this._hex2Int(color.charAt(0))<<4) + this._hex2Int(color.charAt(1)),
                    g = (this._hex2Int(color.charAt(2))<<4) + this._hex2Int(color.charAt(3)),
                    b = (this._hex2Int(color.charAt(4))<<4) + this._hex2Int(color.charAt(5));

                result = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
            }else if(color.length >= 8 && color.indexOf("0x") >= 0){
                color = color.substring(color.indexOf("0x") + 2);
                var r = (this._hex2Int(color.charAt(0))<<4) + this._hex2Int(color.charAt(1)),
                    g = (this._hex2Int(color.charAt(2))<<4) + this._hex2Int(color.charAt(3)),
                    b = (this._hex2Int(color.charAt(4))<<4) + this._hex2Int(color.charAt(5));

                result = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
            }
        }else if(typeof color === "number"){
            var r = (color >> 16) & 0x0000ff,
                g = (color >> 8) & 0x0000ff,
                b = color & 0x0000ff;

            result = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
        }

        return result;
    },

    _hex2Int: function(hex){
        return parseInt("0x" + hex);
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.TextCanvasTexture = Z.CanvasTexture.extend({
    initialize: function(options){
        Z.CanvasTexture.prototype.initialize.call(this, options);
    },

    drawContent: function(context, content, options){
        options = options || {};
        var textSymbol = options.textSymbol || new Z.TextSymbol();
        //var context = this._getContext();
        this._setCanvasFont(context, textSymbol);
        //根据文字内容的大小设置canvas大小
        this._setCanvasSize(this._element, context, content);
        //改变canvas大小后，canvas的所有内容和设置都会被清空，所以此处需重设字体
        this._setCanvasFont(context, textSymbol);
        this._fillBackground(this._element, context, textSymbol);
        this._fillText(this._element, context, content);
    },

    _setCanvasFont: function(canvasContext, symbol){
        var fontFamily = symbol.font.family,
            fontWeight = symbol.font.weight,
            fontStyle = symbol.font.style,
            fontSize = symbol.font.size;
        canvasContext.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;
        canvasContext.fillStyle = symbol.color;//'blue';//symbol.color;
    },

    _calculateCanvasSize: function(canvas, canvasContext, text){
        var size = canvasContext.measureText(text),
            canvasPadding = this.options.padding;
        var width = size.width + canvasPadding * 2;
        size = canvasContext.measureText("中");
        var height = size.width * 1.5 + canvasPadding * 2;     //部分英文字母（g、y等）显示时下底位置比中文低1/3，h等字母上底则与中文持平，因此此处将中文字体算出来的高度乘以1.5，便于同时显示中英文

        return {width: width, height: height};
    },

    _setCanvasSize: function(canvas, canvasContext, text){
        if(this.options.autoWidth || this.options.autoHeight){
            var size = this._calculateCanvasSize(canvas, canvasContext, text);
            canvas.width = this.options.autoWidth ? size.width : this.options.width;
            canvas.height = this.options.autoHeight ? size.height : this.options.height;
        }else{
            canvas.width = this.options.width;
            canvas.height = this.options.height;
        }
    },

    _fillBackground: function(canvas, canvasContext, symbol){
        if(!symbol.fillSymbol && !symbol.borderSymbol){
            return;
        }


        if(symbol.fill){
            var oldFillStyle = canvasContext.fillStyle;
            canvasContext.fillStyle = this._getStyle(symbol.fillSymbol.color, symbol.fillSymbol.opacity);//symbol.fillColor;
            canvasContext.fillRect(0,0,canvas.width,canvas.height);
            canvasContext.fillStyle = oldFillStyle;
        }

        if(symbol.border){
            var oldStrokeStyle = canvasContext.strokeStyle;
            canvasContext.lineWidth = symbol.borderWidth;
            canvasContext.strokeStyle = this._getStyle(symbol.borderSymbol.color, symbol.borderSymbol.opacity);//symbol.borderColor;
            canvasContext.strokeRect(0,0,canvas.width, canvas.height);
            canvasContext.strokeStyle = oldStrokeStyle;
        }
    },

    ////将字符串或16进制形式的颜色值中的rgb值提取出来并加入透明度，重组为rgba(r, g, b, a)格式
    //_getStyle: function(color, opacity){
    //    var result = color;
    //
    //    if(typeof color === "string"){
    //        if(color.length >= 7 && color.indexOf("#") >= 0){
    //            color = color.substring(color.indexOf("#") + 1);
    //            var r = (this._hex2Int(color.charAt(0))<<4) + this._hex2Int(color.charAt(1)),
    //                g = (this._hex2Int(color.charAt(2))<<4) + this._hex2Int(color.charAt(3)),
    //                b = (this._hex2Int(color.charAt(4))<<4) + this._hex2Int(color.charAt(5));
    //
    //            result = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
    //        }else if(color.length >= 8 && color.indexOf("0x") >= 0){
    //            color = color.substring(color.indexOf("0x") + 2);
    //            var r = (this._hex2Int(color.charAt(0))<<4) + this._hex2Int(color.charAt(1)),
    //                g = (this._hex2Int(color.charAt(2))<<4) + this._hex2Int(color.charAt(3)),
    //                b = (this._hex2Int(color.charAt(4))<<4) + this._hex2Int(color.charAt(5));
    //
    //            result = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
    //        }
    //    }else if(typeof color === "number"){
    //        var r = (color >> 16) & 0x0000ff,
    //            g = (color >> 8) & 0x0000ff,
    //            b = color & 0x0000ff;
    //
    //        result = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
    //    }
    //
    //    return result;
    //},
    //
    //_hex2Int: function(hex){
    //    return parseInt("0x" + hex);
    //},

    _fillText: function(canvas, canvasContext, text){
        var canvasPadding = this.options.padding,
            position = this._getTextPosition(canvas);
        canvasContext.fillText(text, position.x, position.y);
        //canvasContext.fillText(text, 0, 35);
    },

    _getTextPosition: function(canvas){
        var canvasPadding = this.options.padding,
            textHeight = canvas.height - canvasPadding * 2;
        var x = canvasPadding,
            y = canvas.height - canvasPadding - textHeight * 1 / 3;

        return {x: x, y: y};
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PolylineCanvasTexture = Z.CanvasTexture.extend({
    initialize: function(options){
        Z.CanvasTexture.prototype.initialize.call(this, options);
    },

    drawContent: function(context, vertices, options){
        var bounds = this._getBounds(vertices);
        this._setCanvasSize(this._element, context, bounds, options.pixelSceneRatio);
        this._fillBackground(this._element, context, this.options);
        this._setDrawStyle(context, options.polylineSymbol);
        this._fillPolyline(this._element, context, vertices, bounds);
    },

    _getBounds: function(vertices){
        var minPoint, maxPoint;

        for(var i = 0; i < vertices.length; i++){
            if(!minPoint){
                minPoint = vertices[i].clone();
                maxPoint = vertices[i].clone();
            }else{
                minPoint.x = Math.min(minPoint.x, vertices[i].x);
                minPoint.y = Math.min(minPoint.y, vertices[i].y);
                minPoint.z = Math.min(minPoint.z, vertices[i].z);

                maxPoint.x = Math.max(maxPoint.x, vertices[i].x);
                maxPoint.y = Math.max(maxPoint.y, vertices[i].y);
                maxPoint.z = Math.max(maxPoint.z, vertices[i].z);
            }
        }

        return {min: minPoint, max: maxPoint};
    },

    _calculateCanvasSize: function(canvas, canvasContext, bounds, pixelSceneRatio){
        var width = (bounds.max.x - bounds.min.x) * pixelSceneRatio.x;
        var height = (bounds.max.y - bounds.min.y) * pixelSceneRatio.y;

        return {width: width, height: height};
    },

    _setCanvasSize: function(canvas, canvasContext, bounds, pixelSceneRatio){
        if(this.options.autoWidth || this.options.autoHeight){
            var size = this._calculateCanvasSize(canvas, canvasContext, bounds, pixelSceneRatio);
            canvas.width = this.options.autoWidth ? size.width : this.options.width;
            canvas.height = this.options.autoHeight ? size.height : this.options.height;
        }else{
            canvas.width = this.options.width;
            canvas.height = this.options.height;
        }
    },

    _fillBackground: function(canvas, canvasContext, symbol){
        if(!symbol.fillSymbol && !symbol.borderSymbol){
            return;
        }


        if(symbol.fill){
            var oldFillStyle = canvasContext.fillStyle;
            canvasContext.fillStyle = this._getStyle(symbol.fillSymbol.color, symbol.fillSymbol.opacity);
            canvasContext.fillRect(0,0,canvas.width,canvas.height);
            canvasContext.fillStyle = oldFillStyle;
        }

        if(symbol.border){
            var oldStrokeStyle = canvasContext.strokeStyle;
            canvasContext.lineWidth = symbol.borderWidth;
            canvasContext.strokeStyle = this._getStyle(symbol.borderSymbol.color, symbol.borderSymbol.opacity);
            canvasContext.strokeRect(0,0,canvas.width, canvas.height);
            canvasContext.strokeStyle = oldStrokeStyle;
        }
    },

    _setDrawStyle: function(canvasContext, symbol){
        canvasContext.strokeStyle = this._getStyle(symbol.color, symbol.opacity);
        canvasContext.lineWidth = symbol.width;
    },

    _fillPolyline: function(canvas, canvasContext, vertices, bounds){
        var min = bounds.min,
            max = bounds.max,
            sceneWidth = max.x - min.x,
            sceneHeight = max.y - min.y,
            pixelWidth = canvas.width,
            pixelHeight = canvas.height,
            x, y;

        if(vertices.length < 2){
            return;
        }

        canvasContext.beginPath();

        for(var i = 0; i < vertices.length; i++){
            x = pixelWidth * (vertices[i].x - min.x) / sceneWidth;
            y = pixelHeight * (max.y - vertices[i].y) / sceneHeight;

            if(i == 0){
                canvasContext.moveTo(x, y);
            }else{
                canvasContext.lineTo(x, y);
            }
        }

        canvasContext.stroke();
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.GraphicRender3D = Z.IGraphicRender.extend({
    initialize: function(graphic){
        this._graphic = graphic;
        this._renderedObject = null;
        this._container = null;
        this._baseIndex = null;
        this._layerIndex = null;
        this._layer = null;
        this._scene = null;
    },

    //onAdd: function(graphicLayer, container, scene, baseIndex, layerIndex){
    onAdd: function(graphicLayer, container, scene){
        this._container = container.root;
        this._baseIndex = graphicLayer.getContainerPane().index;
        this._layerIndex = graphicLayer.getZIndex();
        this._layer = graphicLayer;
        this._scene = scene;

        if(!this._renderedObject){
            this._renderedObject = this.getRenderedObject(this._baseIndex, this._layerIndex);
            this._renderedObject.castShadow = true;
        }

        if(this._renderedObject){
            this._container.add(this._renderedObject);
        }
    },

    onRemove: function(graphicLayer){
        if(this._renderedObject){
            this._container.remove(this._renderedObject);
            this._disposeRenderedObject(this._renderedObject);
        }

        this._renderedObject = null;
        this._container = null;
        this._layer = null;
        this._scene = null;
    },

    getRenderedObject: function(baseIndex, layerIndex){
        if(this._graphic){
            var geometry = this.buildGeometry(this._graphic.feature.shape),
                material = this.buildMaterial(this._graphic.symbol);
            this._enableZIndex(material);

            var  graphicObject = this.buildGraphicObject(geometry, material);

            this._attachGraphic(graphicObject);
            this._enableTransparent(graphicObject);
            //this._setGraphicBaseIndex(graphicObject, baseIndex);
            //this._setGraphicZIndex(graphicObject, baseIndex, layerIndex);
            Z.ZIndexManager.setZIndex(graphicObject, layerIndex, baseIndex);

            return graphicObject;
        }else{
            return null;
        }
    },

    buildGeometry: function(shape){},

    buildMaterial: function(symbol){},

    buildGraphicObject: function(geometry, material){
        return new THREE.Mesh(geometry, material);
    },

    updateGeometry: function(shape){
        if(this._renderedObject){
            var newGeometry = this.buildGeometry(shape);

            if(newGeometry instanceof Array && newGeometry.length === 1){
                if(newGeometry.length <= 0){
                    this._renderedObject.geometry = new THREE.Geometry();
                }else if(newGeometry.length === 1){
                    this._renderedObject.geometry = newGeometry[0];
                }else{
                    this._updateGraphic();
                }
            }else{
                this._renderedObject.geometry = newGeometry;
            }
        }
    },

    updateSymbol: function(symbol){
        this._updateGraphic();
    },

    //showTitle: function(titleSymbol){
    //    dgdg
    //},
    //
    //getTitleAnchorPoint: function(){
    //    mh
    //},

    //getBBoxForScene: function(){
    //    if(this._renderedObject){
    //        this._renderedObject.computeBoundingBox();
    //        var bbox = this._renderedObject.boundingBox;
    //
    //        return Z.GLBounds.create(Z.ThreejsUtil.vector2GLPoint(bbox.min), Z.ThreejsUtil.vector2GLPoint(bbox.max));
    //    }else{
    //        return null;
    //    }
    //},

    refresh: function(){

    },

    _enableZIndex: function(material){
        Z.ZIndexManager.enableZIndex(material);
    },

    _attachGraphic: function(graphicObject){
        if(graphicObject){
            if(graphicObject.children.length > 0){
                for(var i = 0; i < graphicObject.children.length; i++){
                    this._attachGraphic(graphicObject.children[i]);
                }
            }else{
                graphicObject._graphicObj = this._graphic.ownerGraphic;
            }
        }
    },

    _enableTransparent: function(graphicObject){
        if(graphicObject){
            if(graphicObject.material){
                graphicObject.material.transparent = true;
                //graphicObject.material.needsUpdate = true;
            }else if(graphicObject.children.length > 0){
                for(var i = 0; i < graphicObject.children.length; i++){
                    this._enableTransparent(graphicObject.children[i]);
                }
            }
        }
    },

    _setGraphicBaseIndex: function(graphicObject, baseIndex){
        if(graphicObject){
            if(graphicObject.material){
                this._setBaseIndex(graphicObject, baseIndex);
            }else if(graphicObject.children.length > 0){
                for(var i = 0; i < graphicObject.children.length; i++){
                    this._setGraphicBaseIndex(graphicObject.children[i], baseIndex);
                }
            }
        }
    },

    //_setGraphicZIndex: function(graphicObject, baseIndex, zIndex){
    //    if(graphicObject){
    //        //if(graphicObject instanceof THREE.Mesh || graphicObject instanceof THREE.Line
    //        //    || graphicObject instanceof THREE.Sprite || graphicObject instanceof THREE.SkinnedMesh
    //        //    || graphicObject instanceof LineSegments || graphicObject instanceof Points){
    //        //    this._setZIndex(graphicObject, baseIndex * Z.Globe.Layer.layerGroupSize + zIndex);
    //        //}else if(graphicObject.children.length > 0){
    //        //    for(var i = 0; i < graphicObject.children.length; i++){
    //        //        this._setGraphicZIndex(graphicObject[i], zIndex);
    //        //    }
    //        //}
    //
    //        if(graphicObject.children.length > 0){
    //            for(var i = 0; i < graphicObject.children.length; i++){
    //                this._setGraphicZIndex(graphicObject.children[i], baseIndex, zIndex);
    //            }
    //        }else{
    //            this._setZIndex(graphicObject, baseIndex, zIndex);
    //        }
    //    }
    //},
    //
    //_setBaseIndex: function(graphicObject, baseIndex){
    //    graphicObject = graphicObject || {};
    //    var material = graphicObject.material;
    //
    //    if(material){
    //        var factor = 1 - baseIndex, units = 1 - baseIndex;
    //        //material.polygonOffset = true;
    //        material.polygonOffsetFactor = factor * 1000;
    //        material.polygonOffsetUnits = units * 1000;
    //    }
    //
    //},
    //
    //_setZIndex: function(geometry, baseIndex, zIndex){
    //    geometry.renderOrder = baseIndex * Z.Globe.Layer.layerGroupSize + zIndex;
    //    //this._zIndex = zIndex;
    //},

    _latLngPointToScene: function(latLngVector){    //latLngVector=>THREE.Vector3
        var latLng = new Z.LatLng(latLngVector.y, latLngVector.x, latLngVector.z);
        var scenePoint = this._layer.latLngToLayerScenePoint(latLng);

        return new THREE.Vector3(scenePoint.x, scenePoint.y, scenePoint.z);
    },

    _updateGraphic: function(){
        if(this._renderedObject){
            //this.disposeRenderedObject();
            var  graphicObject = this.getRenderedObject(this._baseIndex, this._layerIndex);
            this._container.remove(this._renderedObject);
            var oldObject = this._renderedObject;
            this._renderedObject = graphicObject;
            this._container.add(this._renderedObject);
            this._disposeRenderedObject(oldObject);
        }
    },

    _disposeRenderedObject: function(object){
        if(!object){
            return;
        }

        var childrenLength = object.children.length;

        for(var i = 0; i < childrenLength; i++){
            this._disposeRenderedObject(object.children[i]);
        }

        this._disposeMaterial(object.material);
    },

    _disposeMaterial: function(material){
        if(!material){
            return;
        }

        if(material.materials){
            var materialsLength = material.materials.length;

            for(var i = 0; i < materialsLength; i++){
                this._disposeMaterial(material.materials[i]);
            }
        }else{
            if(material.texture){
                material.texture.dispose();
            }

            if(material.dispose){
                material.dispose();
            }
        }
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PolylineRender3D = Z.GraphicRender3D.extend({
    initialize: function(graphic){
        Z.GraphicRender3D.prototype.initialize.apply(this, arguments);
    },

    buildGeometry: function(shape){
        var geometry, paths = shape ? shape.paths : null;

        if(paths){
            geometry = Z.GeometryUtil.convertPathToGeometry(paths, this._latLngPointToScene, this);
        }

        return geometry;
    },

    buildMaterial: function(symbol){
        var material, dashSize, gapSize;

        if(symbol instanceof Z.PolylineSymbol){
            material = Z.StyleBuilder3D.createRenderStyle(symbol);
        }else{
            material = Z.StyleBuilder3D.createRenderStyle("linesymbol");
        }

        return material;
    },

    buildGraphicObject: function(geometry, material){
        if(geometry instanceof Array){
            var graphic = new THREE.Object3D();

            for(var i = 0; i < geometry.length; i++){
                graphic.add(new THREE.Line(geometry[i], material));
            }

            return graphic;
        }else{
            return new THREE.Line(geometry, material);
        }
    },

    //THREE.Line对象直接替换geometry属性无效，似乎生成后坐标就不能在变动，原因不明。此处对于每次位置的变化都重新生成新的line对象
    updateGeometry: function(shape){
        if(this._renderedObject){
            var  graphicObject = this.getRenderedObject(this._baseIndex, this._layerIndex);
            this._container.remove(this._renderedObject);
            this._renderedObject = graphicObject;
            this._container.add(this._renderedObject);
        }
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PolygonRender3D = Z.GraphicRender3D.extend({
    initialize: function(graphic){
        Z.GraphicRender3D.prototype.initialize.apply(this, arguments);
        this._uvScale;
        this._textureForLoad = [];
        this._textureLoaded = [];
    },

    onAdd: function(graphicLayer, container, scene, baseIndex, layerIndex){
        Z.GraphicRender3D.prototype.onAdd.apply(this, arguments);
    },

    onRemove: function(graphicLayer, container, scene, baseIndex, layerIndex){
        Z.GraphicRender3D.prototype.onAdd.apply(this, arguments);

        this._uvScale = undefined;
        //this._uvScaled = false;
    },

    buildGeometry: function(shape){
        var shapes, rings = shape ? shape.rings : null;

        if(rings){
            shapes = Z.GeometryUtil.convertPathToShapes(rings, this._latLngPointToScene, this);
        }

        var geoms = [];

        for(var i = 0; i < shapes.length; i++){
            var geometry = new THREE.ShapeGeometry(shapes);

            if(this._uvScale && this._textureForLoad.length > 0){
                this._updateUV(geometry, this._uvScale);
                geometry.uvsNeedUpdate = true;
            }

            geoms.push(geometry);
        }

        return geoms;
    },

    buildMaterial: function(symbol){
        symbol = symbol || {};
        this._uvScale = undefined;
        //this._uvScaled = false;

        //多边形边框的显示尚未处理
        var frameMaterial = null,//symbol.hidePolyline ? null : this._getFrameMaterial(symbol.polylineSymbol),
            fillMaterial = symbol.hideFill ? null : this._getFillMaterial(symbol.fillSymbol);

        return [frameMaterial, fillMaterial];
    },

    buildGraphicObject: function(geometry, material){
        var meshs = [], geometrys = (geometry instanceof Array) ? geometry : [geometry];

        for(var geomLength = 0; geomLength < geometrys.length; geomLength++){
            var mesh = null;
            this._loadTexture(geometrys[geomLength]);

            if(material instanceof Array){
                var solidMaterial = [];

                for(var i = 0; i < material.length; i++){
                    if(material[i]){
                        solidMaterial.push(material[i]);
                    }
                }

                if(solidMaterial.length > 1){
                    mesh = new THREE.SceneUtils.createMultiMaterialObject(geometrys[geomLength], solidMaterial);
                    //mesh.children[1].scale.set(0.99, 0.99, 0.99);

                    //return mesh;
                    //return new THREE.Mesh(geometry, solidMaterial[1]);


                }else if(solidMaterial.length === 1){
                    mesh = new THREE.Mesh(geometrys[geomLength], solidMaterial[0]);
                }
            }else{
                mesh = new THREE.Mesh(geometrys[geomLength], material);
            }

            meshs.push(mesh);
        }


        if(meshs.length <= 0){
            return new THREE.Object3D();
        }else if(meshs.length === 1){
            return meshs[0];
        }else{
            var graphic = new THREE.Object3D();

            for(var k = 0; k < meshs.length; k++){
                graphic.add(meshs[k]);
            }

            return graphic;
        }
    },

    getRenderedObject: function(baseIndex, layerIndex){
        this._uvScale = undefined;
        this._textureForLoad = [];

        return Z.GraphicRender3D.prototype.getRenderedObject.apply(this, arguments);
    },

    _getFrameMaterial: function(lineSymbol){
        var frameMaterial = null;

        if(lineSymbol instanceof Z.PolylineSymbol){
            frameMaterial = Z.StyleBuilder3D.createRenderStyle(lineSymbol);
        }else{
            frameMaterial = Z.StyleBuilder3D.createDefaultRenderStyle("linesymbol");
        }

        return frameMaterial;
    },

    _getFillMaterial: function(fillSymbol){
        var thisObj = this, fillMaterial, fillSymbol = fillSymbol || {};

        if(fillSymbol instanceof Z.PictureFillSymbol){
            fillMaterial = Z.StyleBuilder3D.createRenderStyle(fillSymbol);
            //fillMaterial.map = texture;
            this._textureForLoad.push({material:fillMaterial, url: fillSymbol.url});
        }else{
            fillMaterial = Z.StyleBuilder3D.createDefaultRenderStyle("fillsymbol");
        }

        return fillMaterial;
    },

    //计算uv映射的比例，用于修改默认的uv值，确保纹理图片显示为原始大小
    _getUVScale: function(texture){
        var uScale = 1, vScale = 1;

        //if(material.map){
        if(texture){
            var image = texture.image,
                imageWidth = image.width,
                imageHeight = image.height
                pixelSceneRatio = this._scene.getPixelSceneRatio();

            uScale = imageWidth / pixelSceneRatio.x;
            vScale = imageHeight / pixelSceneRatio.y;
        }

        return Z.Point.create(uScale, vScale);
    },

    _updateUV: function(object, uvScale){
        if(object instanceof THREE.Geometry){
            this._updateGeometryUV(object, uvScale);
        }
    },

    _updateGeometryUV: function(geometry, uvScale){
        var uvs = geometry.faceVertexUvs;
        geometry.computeBoundingBox();
        var bbox = geometry.boundingBox;

        for(var i = 0; i < uvs.length; i++){
            for(var j = 0; j < uvs[i].length; j++){
                for(var k = 0; k < uvs[i][j].length; k++){
                    uvs[i][j][k].x = (uvs[i][j][k].x - bbox.min.x)/uvScale.x;
                    uvs[i][j][k].y = (uvs[i][j][k].y - bbox.min.y)/uvScale.y;
                }
            }
        }
    },

    _loadTexture: function(geometry){
        if(this._textureForLoad.length > 0){
            var thisObj = this;

            for(var i = 0; i < this._textureForLoad.length; i++){
                var url = this._textureForLoad[i].url,
                    material = this._textureForLoad[i].material,
                    texture = THREE.ImageUtils.loadTexture(url, {}, function(curTexture){
                        //curTexture.wrapS = THREE.RepeatWrapping;
                        //curTexture.wrapT = THREE.RepeatWrapping;

                        if(!thisObj._uvScale){
                            //debugger;
                            var uvScale = thisObj._getUVScale(curTexture);
                            thisObj._uvScale = uvScale;
                        }

                        thisObj._updateUV(geometry, thisObj._uvScale);
                        geometry.uvsNeedUpdate = true;

                        thisObj._scene.refresh();
                    }, function(){
                        thisObj._scene.refresh();
                    });
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.minFilter = THREE.LinearFilter;
                material.map = texture;
                //this._textureLoaded.push(texture);
            }
        }
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PictureMarkerRender3D = Z.GraphicRender3D.extend({
    initialize: function(graphic){
        Z.GraphicRender3D.prototype.initialize.apply(this, arguments);
        this._spriteContainer = null;
        //this._texture = null;
    },

    buildGeometry: function(shape){
        if(shape instanceof Z.LatLng){
            return this._latLngPointToScene(new THREE.Vector3(shape.lng, shape.lat, shape.alt));
        }else{
            return null;
        }
    },

    buildMaterial: function(symbol){
        var material, dashSize, gapSize, thisObj = this;

        if(symbol instanceof Z.PictureMarkerSymbol){
            material = Z.StyleBuilder3D.createRenderStyle(new Z.PictureFillSymbol({url: symbol.url}));
        }else{
            material = Z.StyleBuilder3D.createDefaultRenderStyle("picturefillsymbol");
        }

        return material;
    },

    buildGraphicObject: function(geometry, material){
        if(!geometry || !material){
            return;
        }

        var sprite = this._createPictureObject(material);
        var spriteContainer = new Z.SpriteContainer(sprite);
        spriteContainer.onAdd(this._scene);
        spriteContainer.setPosition(geometry.x, geometry.y, geometry.z);

        this._applyOffset(spriteContainer);
        this._loadTexture(spriteContainer);
        this._spriteContainer = spriteContainer;

        return spriteContainer.getThreeObject();
    },

    refresh: function(){
        Z.GraphicRender3D.prototype.refresh.apply(this, arguments);
        this._spriteContainer.refresh();
    },

    //默认的updateGeometry直接使用buildGeometry方法的返回结果。不过这里的buildGeometry方法不直接返回THREE.Geometry对象，所以需要重写updateGeometry方法
    updateGeometry: function(shape){
        var geometry = this.buildGeometry(shape);
        this._spriteContainer.setPosition(geometry.x, geometry.y, geometry.z);
    },

    //将定位点移到图片的下底边的中心
    _applyOffset: function(spriteContainer){
        var offset = this._graphic.symbol.offset || Z.Point.create(0, 0, 0),
            pixelSceneRatio = this._scene.getPixelSceneRatio(),
            offsetX = offset.x / pixelSceneRatio.x,
            offsetY = offset.y / pixelSceneRatio.y,
            offsetZ = offset.z / pixelSceneRatio.z;
        spriteContainer.setOffset(new Z.Point(offsetX, offsetY, offsetZ));
    },

    _loadTexture: function(spriteContainer){
        var url = this._graphic.symbol.url,
            thisObj = this,
            symbol = this._graphic.symbol,
            symbolWidth = (typeof symbol.width) === "number" ? symbol.width : undefined,
            symbolHeight = (typeof symbol.height) === "number" ? symbol.height : undefined;

        var texture = THREE.ImageUtils.loadTexture(url, {}, function(curTexture){
            var pixelSceneRatio = thisObj._scene.getPixelSceneRatio(),
                image = curTexture.image,
                imageWidth = symbolWidth || image.width,
                imageHeight = symbolHeight || image.height,
                sceneWidth = imageWidth / pixelSceneRatio.x,
                sceneHeight = imageHeight / pixelSceneRatio.y;

            spriteContainer.setScale(new Z.Point(sceneWidth, sceneHeight, 1));
            thisObj._applyOffset(spriteContainer);

            thisObj._scene.refresh();
        }, function(){
            thisObj._scene.refresh();
        });
        texture.minFilter = THREE.LinearFilter;

        spriteContainer.sprite.material.map = texture;
    },

    _createPictureObject: function(material){
        var geometry = new THREE.PlaneGeometry(1,1);
        var mater = material || Z.StyleBuilder3D.createDefaultRenderStyle("picturefillsymbol");//new THREE.MeshBasicMaterial({color: 0xffffff, fog: true});
        var spriteObject = new THREE.Mesh(geometry, mater);
        spriteObject.castShadow = true;

        return spriteObject;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.CircleMarkerRender3D = Z.GraphicRender3D.extend({
    initialize: function(graphic){
        Z.GraphicRender3D.prototype.initialize.apply(this, arguments);
        //this._spriteContainer = null;
        //this._texture = null;
    },

    buildGeometry: function(shape){
        shape = shape.center;

        if(shape instanceof Z.LatLng){
            return this._latLngPointToScene(new THREE.Vector3(shape.lng, shape.lat, shape.alt));
        }else{
            return null;
        }
    },

    buildMaterial: function(symbol){
        var material;

        if(symbol instanceof Z.CircleSymbol){
            material = Z.StyleBuilder3D.createRenderStyle(symbol.fillSymbol);
        }else{
            material = Z.StyleBuilder3D.createDefaultRenderStyle("fillsymbol");
        }

        return material;
    },

    buildGraphicObject: function(geometry, material){
        if(!geometry || !material){
            return;
        }

        var circle = this._createCircleObject(material);
        circle.position.set(geometry.x, geometry.y, geometry.z);

        return circle;
    },

    //refresh: function(){
    //    Z.GraphicRender3D.prototype.refresh.apply(this, arguments);
    //    this._spriteContainer.refresh();
    //},

    //默认的updateGeometry直接使用buildGeometry方法的返回结果。不过这里的buildGeometry方法不直接返回THREE.Geometry对象，所以需要重写updateGeometry方法
    updateGeometry: function(shape){
        var position = this.buildGeometry(shape);
        this._renderedObject.position.set(position.x, position.y, position.z);

        var circleGeom = this._createCircleGeometry();
        this._renderedObject.geometry = circleGeom;
    },

    ////将定位点移到图片的下底边的中心
    //_applyOffset: function(spriteContainer){
    //    var offset = this._graphic.symbol.offset || Z.Point.create(0, 0, 0),
    //        pixelSceneRatio = this._scene.getPixelSceneRatio(),
    //        offsetX = offset.x / pixelSceneRatio.x,
    //        offsetY = offset.y / pixelSceneRatio.y,
    //        offsetZ = offset.z / pixelSceneRatio.z;
    //    spriteContainer.setOffset(new Z.Point(offsetX, offsetY, offsetZ));
    //},
    //
    //_loadTexture: function(spriteContainer){
    //    var url = this._graphic.symbol.url,
    //        thisObj = this,
    //        symbol = this._graphic.symbol,
    //        symbolWidth = (typeof symbol.width) === "number" ? symbol.width : undefined,
    //        symbolHeight = (typeof symbol.height) === "number" ? symbol.height : undefined;
    //
    //    var texture = THREE.ImageUtils.loadTexture(url, {}, function(curTexture){
    //        var pixelSceneRatio = thisObj._scene.getPixelSceneRatio(),
    //            image = curTexture.image,
    //            imageWidth = symbolWidth || image.width,
    //            imageHeight = symbolHeight || image.height,
    //            sceneWidth = imageWidth / pixelSceneRatio.x,
    //            sceneHeight = imageHeight / pixelSceneRatio.y;
    //
    //        spriteContainer.setScale(new Z.Point(sceneWidth, sceneHeight, 1));
    //        thisObj._applyOffset(spriteContainer);
    //
    //        thisObj._scene.refresh();
    //    }, function(){
    //        thisObj._scene.refresh();
    //    });
    //    texture.minFilter = THREE.LinearFilter;
    //
    //    spriteContainer.sprite.material.map = texture;
    //},

    _createCircleObject: function(material){
        var geometry = this._createCircleGeometry();
        var mater = material || Z.StyleBuilder3D.createRenderStyle("simplefillsymbol");//new THREE.MeshBasicMaterial({color: 0xffffff, fog: true});
        var mesh = new THREE.Mesh(geometry, mater);
        //mesh.castShadow = true;
        //mesh.receiveShadow = true;

        return mesh;
    },

    _createCircleGeometry: function(){
        var shape = this._graphic.feature.shape,
            segments = this._graphic.symbol.segments;
        var radius = this._layer.getSceneHeight(shape.radius);

        if(shape.radiusType === 'pixel'){
            radius = shape.radius / this._scene.getPixelSceneRatio().x;
        }

        var geometry = new THREE.CircleGeometry(radius,segments);

        return geometry;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.ExtrudeRender3D = Z.GraphicRender3D.extend({
    initialize: function(graphic){
        Z.GraphicRender3D.prototype.initialize.apply(this, arguments);
    },

    buildGeometry: function(shape){
        var shapes, paths = shape ? shape.paths : null;

        if(paths){
            shapes = Z.GeometryUtil.convertPathToShapes(paths, this._latLngPointToScene, this);
        }

        var geoms = [],
            extrudeHeight = this._layer.getSceneHeight(this._graphic.feature.shape.height),//this._getSceneHeight(this._graphic.feature.shape.height),//this._getExtrudeHeight(),
            extrudeOptions ={
                amount: extrudeHeight,
                bevelEnabled: false,
                material: 0,
                extrudeMaterial:1
            };

        for(var i = 0; i < shapes.length; i++){
            var geometry = new THREE.ExtrudeGeometry(shapes[i], extrudeOptions);

            geoms.push(geometry);
        }

        return geoms;
    },

    buildMaterial: function(symbol){
        var topMaterial, wallMaterial;

        if(symbol instanceof Z.ExtrudeSymbol){
            topMaterial = Z.StyleBuilder3D.createRenderStyle(new Z.SimpleFillSymbol({color : symbol.topColor}), "lambert");

            if(symbol.topImageUrl){
                this._appendTexture(topMaterial, symbol.topImageUrl);
            }

            wallMaterial = Z.StyleBuilder3D.createRenderStyle(new Z.SimpleFillSymbol({color : symbol.wallColor}), "lambert");

            if(symbol.wallImageUrl){
                this._appendTexture(wallMaterial, symbol.wallImageUrl);
            }
        }else{
            topMaterial = Z.StyleBuilder3D.createRenderStyle(new Z.SimpleFillSymbol(), "lambert");
            wallMaterial = topMaterial.clone();
        }

        return [topMaterial, wallMaterial];
    },

    buildGraphicObject: function(geometry, material){
        if(!geometry || !material){
            return;
        }

        var meshs = [], geometrys = (geometry instanceof Array) ? geometry : [geometry];

        for(var geomLength = 0; geomLength < geometrys.length; geomLength++){
            var mesh = new THREE.Mesh(geometrys[geomLength], new THREE.MeshFaceMaterial(material));
            mesh.castShadow = true;
            this._setBaseHeight(mesh);

            meshs.push(mesh);
        }

        if(meshs.length <= 0){
            return new THREE.Object3D();
        }else if(meshs.length === 1){
            return meshs[0];
        }else{
            var graphic = new THREE.Object3D();

            for(var k = 0; k < meshs.length; k++){
                graphic.add(meshs[k]);
            }

            return graphic;
        }
    },

    ////默认的updateGeometry直接使用buildGeometry方法的返回结果。不过这里的buildGeometry方法不直接返回THREE.Geometry对象，所以需要重写updateGeometry方法
    updateGeometry: function(shape){
        Z.GraphicRender3D.prototype.updateGeometry.apply(this, arguments);
        this._setBaseHeight(this._renderedObject);
    },

    _setBaseHeight: function(mesh){
        var baseHeight = this._layer.getSceneHeight(this._graphic.feature.shape.baseHeight);//this._getSceneHeight(this._graphic.feature.shape.baseHeight),

        if(mesh.children.length > 0){
            for(var i = 0; i < mesh.children.length; i++){
                this._setBaseHeight(mesh.children[i]);
            }
        }else{
            var meshPos = mesh.position;
            mesh.position.set(meshPos.x, meshPos.y, baseHeight);
        }
    },

    _appendTexture: function(material, url){
        if(typeof url !== "string" || url.length <= 0){
            return;
        }

        var thisObj = this,
            texture = THREE.ImageUtils.loadTexture(url, {}, function(curTexture){
                thisObj._scene.refresh();
            }, function(){
                thisObj._scene.refresh();
            });

        material.map = texture;
    },

    //重写父类的_enableZIndex方法，方法体置为空
    _enableZIndex: function(material){},

    //重写父类的_getTitlePos方法
    _getTitlePos: function(){
        var pos = Z.GraphicRender3D.prototype._getTitlePos.apply(this, arguments),
            offset = 0.00001;
        pos.alt = this._layer.getSceneHeight(this._graphic.feature.shape.height) + offset;//通过offset偏移，确保title始终叠加显示在几何对象上面

        return pos;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.ExtrudeTextRender3D = Z.GraphicRender3D.extend({
    initialize: function(graphic){
        Z.GraphicRender3D.prototype.initialize.apply(this, arguments);
        this._spriteContainer = null;
        //this._texture = null;
    },

    buildGeometry: function(shape){
        if(shape instanceof Z.LatLng){
            return this._latLngPointToScene(new THREE.Vector3(shape.lng, shape.lat, shape.alt));
        }else{
            return null;
        }
    },

    buildMaterial: function(symbol){
        var material, thisObj = this;

        if(symbol instanceof Z.TextSymbol){
            material = new THREE.MeshFaceMaterial( [
                Z.StyleMaker3D.createRenderStyle(new Z.SimpleFillSymbol({color : symbol.color})), // front
                Z.StyleMaker3D.createRenderStyle(new Z.SimpleFillSymbol({color : symbol.color}))  // side
                //new THREE.MeshBasicMaterial( { color: symbol.color, shading: THREE.FlatShading } ), // front
                //new THREE.MeshBasicMaterial( { color: symbol.color, shading: THREE.SmoothShading } ) // side
            ] );
        }else{
            material = new THREE.MeshFaceMaterial( [
                Z.StyleMaker3D.createRenderStyle("simplefillsymbol"), // front
                Z.StyleMaker3D.createRenderStyle("simplefillsymbol")  // side
            ] );
        }

        return material;
    },

    buildGraphicObject: function(geometry, material){
        if(!geometry || !material){
            return;
        }

        var sprite = this._createExtrudeText(material);
        var spriteContainer = new Z.SpriteContainer(sprite);
        spriteContainer.onAdd(this._scene);
        spriteContainer.setPosition(geometry.x, geometry.y, geometry.z);

        this._applyOffset(spriteContainer, sprite.geometry);
        //this._loadTexture(spriteContainer);
        this._spriteContainer = spriteContainer;

        return spriteContainer.getThreeObject();
    },

    refresh: function(){
        Z.GraphicRender3D.prototype.refresh.apply(this, arguments);
        this._spriteContainer.refresh();
    },

    //默认的updateGeometry直接使用buildGeometry方法的返回结果。不过这里的buildGeometry方法不直接返回THREE.Geometry对象，所以需要重写updateGeometry方法
    updateGeometry: function(shape){
        var geometry = this.buildGeometry(shape);
        this._spriteContainer.setPosition(geometry.x, geometry.y, geometry.z);
    },

    _createExtrudeText: function(material){
        var geometry = this._createTextGeometry(),
            mesh = new THREE.Mesh(geometry, material);

        return mesh;
    },

    _createTextGeometry: function(){
        var text = this._graphic.symbol.text,
            size = this._graphic.symbol.font.size,
            textGeo = new THREE.TextGeometry( text, {
                size: size,
                height: 0.01,
                curveSegments: 3,

                font: this._graphic.symbol.font.family,
                weight: this._graphic.symbol.font.weight,
                style: this._graphic.symbol.font.style,

                //bevelThickness: bevelThickness,
                //bevelSize: bevelSize,
                bevelEnabled: false,

                material: 0,
                extrudeMaterial: 1
            });

        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();

        return textGeo;
    },

    //将定位点移到图片的下底边的中心
    _applyOffset: function(spriteContainer, textGeometry){
        var offsetY = 0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
        spriteContainer.setOffset(new Z.Point(0, offsetY, 0));
    }

    //_loadTexture: function(spriteContainer){
    //    var url = this._graphic.symbol.url,
    //        thisObj = this,
    //        symbol = this._graphic.symbol,
    //        symbolWidth = (typeof symbol.width) === "number" ? symbol.width : undefined,
    //        symbolHeight = (typeof symbol.height) === "number" ? symbol.height : undefined;
    //
    //    var texture = THREE.ImageUtils.loadTexture(url, {}, function(curTexture){
    //        var pixelSceneRatio = thisObj._scene.getPixelSceneRatio(),
    //            image = curTexture.image,
    //            imageWidth = symbolWidth || image.width,
    //            imageHeight = symbolHeight || image.height,
    //            sceneWidth = imageWidth / pixelSceneRatio.x,
    //            sceneHeight = imageHeight / pixelSceneRatio.y;
    //
    //        spriteContainer.setScale(new Z.Point(sceneWidth, sceneHeight, 1));
    //        thisObj._applyOffset(spriteContainer);
    //
    //        thisObj._scene.refresh();
    //    }, function(){
    //        thisObj._scene.refresh();
    //    });
    //    texture.minFilter = THREE.LinearFilter;
    //
    //    spriteContainer.sprite.material.map = texture;
    //},

    //_createPictureObject: function(material){
    //    var geometry = new THREE.PlaneGeometry(1,1);
    //    var mater = material || new THREE.MeshBasicMaterial({color: 0xffffff, fog: true});
    //    var spriteObject = new THREE.Mesh(geometry, mater);
    //    spriteObject.castShadow = true;
    //
    //    return spriteObject;
    //}
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.RingMarkerRender3D = Z.GraphicRender3D.extend({
    initialize: function(graphic){
        Z.GraphicRender3D.prototype.initialize.apply(this, arguments);
        //this._spriteContainer = null;
        //this._texture = null;
    },

    buildGeometry: function(shape){
        shape = shape.center;

        if(shape instanceof Z.LatLng){
            return this._latLngPointToScene(new THREE.Vector3(shape.lng, shape.lat, shape.alt));
        }else{
            return null;
        }
    },

    buildMaterial: function(symbol){
        var material;

        if(symbol instanceof Z.RingSymbol){
            material = Z.StyleBuilder3D.createRenderStyle(symbol.fillSymbol);
        }else{
            material = Z.StyleBuilder3D.createDefaultRenderStyle("simplefillsymbol");
        }

        return material;
    },

    buildGraphicObject: function(geometry, material){
        if(!geometry || !material){
            return;
        }

        var ring = this._createRingObject(material);
        ring.position.set(geometry.x, geometry.y, geometry.z);

        return ring;
    },

    //refresh: function(){
    //    Z.GraphicRender3D.prototype.refresh.apply(this, arguments);
    //    this._spriteContainer.refresh();
    //},

    //默认的updateGeometry直接使用buildGeometry方法的返回结果。不过这里的buildGeometry方法不直接返回THREE.Geometry对象，所以需要重写updateGeometry方法
    updateGeometry: function(shape){
        var position = this.buildGeometry(shape);
        this._renderedObject.position.set(position.x, position.y, position.z);

        var ringGeom = this._createRingGeometry();
        this._renderedObject.geometry = ringGeom;
    },

    ////将定位点移到图片的下底边的中心
    //_applyOffset: function(spriteContainer){
    //    var offset = this._graphic.symbol.offset || Z.Point.create(0, 0, 0),
    //        pixelSceneRatio = this._scene.getPixelSceneRatio(),
    //        offsetX = offset.x / pixelSceneRatio.x,
    //        offsetY = offset.y / pixelSceneRatio.y,
    //        offsetZ = offset.z / pixelSceneRatio.z;
    //    spriteContainer.setOffset(new Z.Point(offsetX, offsetY, offsetZ));
    //},
    //
    //_loadTexture: function(spriteContainer){
    //    var url = this._graphic.symbol.url,
    //        thisObj = this,
    //        symbol = this._graphic.symbol,
    //        symbolWidth = (typeof symbol.width) === "number" ? symbol.width : undefined,
    //        symbolHeight = (typeof symbol.height) === "number" ? symbol.height : undefined;
    //
    //    var texture = THREE.ImageUtils.loadTexture(url, {}, function(curTexture){
    //        var pixelSceneRatio = thisObj._scene.getPixelSceneRatio(),
    //            image = curTexture.image,
    //            imageWidth = symbolWidth || image.width,
    //            imageHeight = symbolHeight || image.height,
    //            sceneWidth = imageWidth / pixelSceneRatio.x,
    //            sceneHeight = imageHeight / pixelSceneRatio.y;
    //
    //        spriteContainer.setScale(new Z.Point(sceneWidth, sceneHeight, 1));
    //        thisObj._applyOffset(spriteContainer);
    //
    //        thisObj._scene.refresh();
    //    }, function(){
    //        thisObj._scene.refresh();
    //    });
    //    texture.minFilter = THREE.LinearFilter;
    //
    //    spriteContainer.sprite.material.map = texture;
    //},

    _createRingObject: function(material){
        var geometry = this._createRingGeometry();
        var mater = material || Z.StyleBuilder3D.createDefaultRenderStyle("simplefillsymbol");//new THREE.MeshBasicMaterial({color: 0xffffff, fog: true});
        var mesh = new THREE.Mesh(geometry, mater);
        //mesh.castShadow = true;
        //mesh.receiveShadow = true;

        return mesh;
    },

    _createRingGeometry: function(){
        var shape = this._graphic.feature.shape,
            segments = this._graphic.symbol.segments;
        var innerRadius = this._layer.getSceneHeight(shape.innerRadius),
            outerRadius = this._layer.getSceneHeight(shape.outerRadius);

        var geometry = new THREE.RingGeometry(innerRadius,outerRadius, segments);

        return geometry;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.CanvasTextRender3D = Z.GraphicRender3D.extend({
    initialize: function(graphic){
        Z.GraphicRender3D.prototype.initialize.apply(this, arguments);
        this._spriteContainer = null;
        this._markerSize = null;
        this._canvasTexture = null;
    },

    buildGeometry: function(shape){
        if(shape instanceof Z.LatLng){
            return this._latLngPointToScene(new THREE.Vector3(shape.lng, shape.lat, shape.alt));
        }else{
            return null;
        }
    },

    buildMaterial: function(symbol){
        var material;
        material = Z.StyleBuilder3D.createDefaultRenderStyle("fillsymbol", {color: "#ffffff"});    //由于材质的颜色与canvas的颜色会混合，此处将材质本身的颜色设为白色，这样的话最终显示结果完全以canvas为准

        return material;
    },

    buildGraphicObject: function(geometry, material){
        if(!geometry || !material){
            return;
        }

        var sprite = this._createCanvasText(material);
        var spriteContainer = new Z.SpriteContainer(sprite);
        spriteContainer.onAdd(this._scene);
        spriteContainer.setPosition(geometry.x, geometry.y, geometry.z);

        this._applyOffset(spriteContainer);
        //this._loadTexture(spriteContainer);
        this._spriteContainer = spriteContainer;

        return spriteContainer.getThreeObject();
    },

    refresh: function(){
        Z.GraphicRender3D.prototype.refresh.apply(this, arguments);
        this._spriteContainer.refresh();
    },

    //默认的updateGeometry直接使用buildGeometry方法的返回结果。不过这里的buildGeometry方法不直接返回THREE.Geometry对象，所以需要重写updateGeometry方法
    updateGeometry: function(shape){
        var geometry = this.buildGeometry(shape);
        this._spriteContainer.setPosition(geometry.x, geometry.y, geometry.z);
    },

    onRemove: function(graphicLayer){
        Z.GraphicRender3D.prototype.onRemove.apply(this, arguments);
        this._markerSize = null;
    },

    _createCanvasText: function(material){
        this._createCanvas();
        var canvasElement = this._canvasTexture.getElement();
        var texture = new THREE.Texture(canvasElement);
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        material.map = texture;
        var geometrySize = this._getGeometrySize(canvasElement);
        var geometry = new THREE.PlaneBufferGeometry( geometrySize.x, geometrySize.y);
        this._markerSize = geometrySize;
        var mesh = new THREE.Mesh( geometry, material );

        return mesh;
    },

    _createCanvas: function(){
        if(!this._canvasTexture){
            this._canvasTexture = new Z.TextCanvasTexture({
                padding: 5,                //内边距，单位为像素
                autoWidth: true,         //是否根据内容自动计算宽度
                autoHeight: true,        //是否根据内容自动计算高度
                //bgColor: 0xffffff,
                //bgOpacity: 1,            //默认背景不透明
                opacity: 1
            });
        }

        this._canvasTexture.clear();
        this._canvasTexture.draw(this._graphic.symbol.text, {textSymbol: this._graphic.symbol});
    },

    _getGeometrySize: function(canvas){
        var //crs = this._graphic.feature.shape.crs,
            pixelSceneRatio = this._scene.getPixelSceneRatio(),
            //canvasSize = this._canvasTexture.getsSize();
            //canvas = this._canvasTexture.getElement(),
            width = canvas.width / pixelSceneRatio.x,
            height = canvas.height / pixelSceneRatio.y;

        return new Z.Point(width, height);
    },

    //将定位点移到图片的下底边的中心
    _applyOffset: function(spriteContainer){
        var offsetY = 0.5 * this._markerSize.y;
        spriteContainer.setOffset(new Z.Point(0, offsetY, 0));
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.CanvasPolylineRender3D = Z.GraphicRender3D.extend({
    initialize: function(graphic){
        Z.GraphicRender3D.prototype.initialize.apply(this, arguments);
    },

    buildGeometry: function(shape){
        var geometry, paths = shape ? shape.paths : null;

        if(paths){
            geometry = Z.GeometryUtil.convertPathToGeometry(paths, this._latLngPointToScene, this);
        }

        return geometry;
    },

    buildMaterial: function(symbol){
        return Z.StyleBuilder3D.createDefaultRenderStyle("simplefillsymbol", {color: "#ffffff"});
    },

    buildGraphicObject: function(geometry, material){
        if(geometry instanceof Array){
            var graphic = new THREE.Object3D();

            for(var i = 0; i < geometry.length; i++){
                graphic.add(this._buildOneGraphic(geometry[i], material));
            }

            return graphic;
        }else{
            return this._buildOneGraphic(geometry, material);
        }

    },

    //THREE.Line对象直接替换geometry属性无效，似乎生成后坐标就不能在变动，原因不明。此处对于每次位置的变化都重新生成新的line对象
    updateGeometry: function(shape){
        if(this._renderedObject){
            var  graphicObject = this.getRenderedObject(this._baseIndex, this._layerIndex);
            this._container.remove(this._renderedObject);
            this._renderedObject = graphicObject;
            this._container.add(this._renderedObject);
        }
    },

    _createCanvasMaterial: function(vertices, material){
        this._createCanvas(vertices);
        var canvasElement = this._canvasTexture.getElement();
        var texture = new THREE.Texture(canvasElement);
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        material.map = texture;

        return material;
    },

    _createCanvas: function(vertices){
        if(!this._canvasTexture){
            this._canvasTexture = new Z.PolylineCanvasTexture({
                //padding: 5,                //内边距，单位为像素
                autoWidth: true,         //是否根据内容自动计算宽度
                autoHeight: true,        //是否根据内容自动计算高度
                fill: false,
                border: false,
                opacity: 1
            });
        }

        this._canvasTexture.clear();
        this._canvasTexture.draw(vertices, {
            polylineSymbol: this._graphic.symbol,
            pixelSceneRatio: this._scene.getPixelSceneRatio()
        });
    },

    _buildOneGraphic: function(geometry, material){
        geometry.computeBoundingBox();
        var bbox = geometry.boundingBox;
        var newMaterial = this._createCanvasMaterial(geometry.vertices, material);
        var centerX = (bbox.min.x + bbox.max.x) / 2,
            centerY = (bbox.min.y + bbox.max.y) / 2,
            centerZ = (bbox.min.z + bbox.max.z) / 2;

        var geom = new THREE.PlaneGeometry(bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y);
        var graphic = new THREE.Mesh(geom, newMaterial);
        graphic.position.set(centerX, centerY, centerZ);

        return graphic;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.GraphicRender2D = Z.IGraphicRender.extend({
    initialize: function(graphic){
        this._graphic = graphic;
        this._renderedObject = null;
        //this._container = null;
        //this._baseIndex = null;
        //this._layerIndex = null;
        //this._layer = null;
        //this._scene = null;
    },

    //onAdd: function(graphicLayer, container, scene, baseIndex, layerIndex){
    onAdd: function(graphicLayer, container, scene){
        this._container = container;
        this._baseIndex = graphicLayer.getContainerPane().index;
        this._layerIndex = graphicLayer.getZIndex();
        //this._layer = graphicLayer;
        //this._scene = scene;
        //
        if(!this._renderedObject){
            this._renderedObject = this.getRenderedObject(this._baseIndex, this._layerIndex);
        }

        if(this._renderedObject){
            container.addLayer(this._renderedObject);
        }
    },

    onRemove: function(graphicLayer){
        if(this._renderedObject && this._container){
            this._container.removeLayer(this._renderedObject);
        }

        this._renderedObject = null;
        this._container = null;
        //this._layer = null;
        //this._scene = null;
    },

    getRenderedObject: function(baseIndex, layerIndex){
        var  graphicObject = this.buildGraphicObject(baseIndex, layerIndex);
        graphicObject.graphic = this._graphic.ownerGraphic;

        return graphicObject;
    },

    buildGraphicObject: function(){},

    updateGeometry: function(shape){
        //if(this._renderedObject){
        //    var newGeometry = this.buildGeometry(shape);
        //    this._renderedObject.geometry = newGeometry;
        //}
    },

    updateSymbol: function(symbol){
        //if(this._renderedObject){
        //    //this.disposeRenderedObject();
        //    var  graphicObject = this.getRenderedObject(this._baseIndex, this._layerIndex);
        //    this._container.remove(this._renderedObject);
        //    var oldObject = this._renderedObject;
        //    this._renderedObject = graphicObject;
        //    this._container.add(this._renderedObject);
        //    this._disposeRenderedObject(oldObject);
        //}
    },

    refresh: function(){

    }//,
    //
    //_enableZIndex: function(material){
    //    Z.ZIndexManager.enableZIndex(material);
    //},
    //
    //_enableTransparent: function(graphicObject){
    //    if(graphicObject){
    //        if(graphicObject.material){
    //            graphicObject.material.transparent = true;
    //            //graphicObject.material.needsUpdate = true;
    //        }else if(graphicObject.children.length > 0){
    //            for(var i = 0; i < graphicObject.children.length; i++){
    //                this._enableTransparent(graphicObject.children[i]);
    //            }
    //        }
    //    }
    //},
    //
    //_setGraphicBaseIndex: function(graphicObject, baseIndex){
    //    if(graphicObject){
    //        if(graphicObject.material){
    //            this._setBaseIndex(graphicObject, baseIndex);
    //        }else if(graphicObject.children.length > 0){
    //            for(var i = 0; i < graphicObject.children.length; i++){
    //                this._setGraphicBaseIndex(graphicObject.children[i], baseIndex);
    //            }
    //        }
    //    }
    //},
    //
    //_latLngPointToScene: function(latLngVector){    //latLngVector=>THREE.Vector3
    //    var latLng = new Z.LatLng(latLngVector.y, latLngVector.x, latLngVector.z);
    //    var scenePoint = this._layer.latLngToLayerScenePoint(latLng);
    //
    //    return new THREE.Vector3(scenePoint.x, scenePoint.y, scenePoint.z);
    //},
    //
    //_disposeRenderedObject: function(object){
    //    if(!object){
    //        return;
    //    }
    //
    //    var childrenLength = object.children.length;
    //
    //    for(var i = 0; i < childrenLength; i++){
    //        this._disposeRenderedObject(object.children[i]);
    //    }
    //
    //    this._disposeMaterial(object.material);
    //},
    //
    //_disposeMaterial: function(material){
    //    if(!material){
    //        return;
    //    }
    //
    //    if(material.materials){
    //        var materialsLength = material.materials.length;
    //
    //        for(var i = 0; i < materialsLength; i++){
    //            this._disposeMaterial(material.materials[i]);
    //        }
    //    }else{
    //        if(material.texture){
    //            material.texture.dispose();
    //        }
    //
    //        if(material.dispose){
    //            material.dispose();
    //        }
    //    }
    //}
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PolylineRender2D = Z.GraphicRender2D.extend({
    initialize: function(graphic){
        Z.GraphicRender2D.prototype.initialize.apply(this, arguments);
    },

    buildGraphicObject: function(baseIndex, layerIndex){
        var options = this._getLeafletOptions(this._graphic.symbol),
            geom = this._getLeafletGeometry(this._graphic.feature.shape);

        if(geom.length > 1){
            return L.multiPolyline(geom, options);
        }else{
            return L.polyline(geom, options);
        }
    },

    updateGeometry: function(shape){
        if(this._renderedObject){
            this._renderedObject.setLatLngs(this._getLeafletGeometry(shape));
        }
    },

    updateSymbol: function(symbol){
        if(this._renderedObject){
            this._renderedObject.setStyle(this._getLeafletOptions(symbol));
        }
    },

    _getLeafletGeometry: function(shape){
        var geom = [], paths, notArray2, notArray3;

        if(shape){
            paths = shape.paths;
            notArray2 = !(paths instanceof Array) || !(paths[0] instanceof Array);  //判断shape是否为二维数组
            notArray3 = notArray2 || !(paths[0][0] instanceof Array);     //判断shape是否为三维数组

            if(!notArray3){     //三维数组
                geom = paths;
            }else if(!notArray2){     //二维数组
                geom = [paths];
            }
        }

        return geom;
    },

    _getLeafletOptions: function(symbol){
        var options = {
            stroke: true,
            color: symbol.color || '#03f',
            weight: symbol.width || 5,
            opacity: symbol.opacity || 0.5,
            fill:false,
            //fillColor:'',
            //fillOpacity:'',
            //fillRule:'',
            dashArray:(symbol.style ===  Z.PolylineStyleType.Solid) ? null : '2,2',
            lineCap: null,
            lineJoin: null,
            clickable: true
        };

        return options;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PolygonRender2D = Z.GraphicRender2D.extend({
    initialize: function(graphic){
        Z.GraphicRender2D.prototype.initialize.apply(this, arguments);
    },

    buildGraphicObject: function(baseIndex, layerIndex){
        var options = this._getLeafletOptions(this._graphic.symbol),
            geom = this._getLeafletGeometry(this._graphic.feature.shape),
            coords = [];

        for(var i = 0; i < geom.length; i++){
            coords[i] = [];

            if(geom[i].paths.length <= 0){
                continue;
            }

            coords[i].push(geom[i].paths[0]);

            for(var j = 0; j < geom[i].holes.length; j++){
                coords[i].push(geom[i].holes[j]);
            }
        }

        if(coords.length > 1){
            return L.multiPolygon(coords, options);
        }else{
            return L.polygon(coords[0], options);
        }
    },

    updateGeometry: function(shape){
        if(this._renderedObject){
            this._renderedObject.setLatLngs(this._getLeafletGeometry(shape));
        }
    },

    updateSymbol: function(symbol){
        if(this._renderedObject){
            this._renderedObject.setStyle(this._getLeafletOptions(symbol));
        }
    },

    _getLeafletGeometry: function(shape){
        var geom = [], paths, notArray2, notArray3, notArray4, coords;

        if(shape){
            paths = shape.rings;
            notArray2 = !(paths instanceof Array) || !(paths[0] instanceof Array);  //判断shape是否为二维数组
            notArray3 = notArray2 || !(paths[0][0] instanceof Array),        //判断shape是否为三维数组
            notArray4 = notArray3 || !(paths[0][0][0] instanceof Array),     //判断shape是否为四维数组
            coords = [];

            if(!notArray4){     //四维数组
                coords = paths;
            }else if(!notArray3){     //三维数组
                coords = [paths];
            }else if(!notArray2){     //二维数组
                coords = [[paths]];
            }

            for(var i = 0; i < coords.length; i++){
                var currentGeom = {paths:[], holes: []};

                for(var j = 0; j < coords[i].length; j++){
                    if(Z.GeometryUtil.isClockWise(coords[i][j])){
                        currentGeom.holes.push(coords[i][j]);
                    }else{
                        currentGeom.paths.push(coords[i][j]);
                    }
                }

                geom.push(currentGeom);
            }
        }

        return geom;
    },

    _getLeafletOptions: function(symbol){
        var options = {
            stroke: symbol.hidePolyline ? false : true,
            color: symbol.polylineSymbol.color || '#0033ff',
            weight: symbol.polylineSymbol.width || 5,
            opacity: symbol.polylineSymbol.opacity || 0.5,
            fill:symbol.hideFill ? false : true,
            fillColor:symbol.fillSymbol.color || '#002244',
            fillOpacity:symbol.fillSymbol.opacity || 0.5,
            //fillRule:'',
            dashArray:(symbol.polylineSymbol.style ===  Z.PolylineStyleType.Solid) ? null : '2,2',
            lineCap: null,
            lineJoin: null,
            clickable: true
        };

        return options;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.PictureMarkerRender2D = Z.GraphicRender2D.extend({
    initialize: function(graphic){
        Z.GraphicRender2D.prototype.initialize.apply(this, arguments);
    },

    buildGraphicObject: function(baseIndex, layerIndex){
        var options = this._getLeafletOptions(this._graphic.symbol),
            geom = this._getLeafletGeometry(this._graphic.feature.shape);

        return L.marker(geom, options);
    },

    updateGeometry: function(shape){
        if(this._renderedObject){
            this._renderedObject.setLatLng(this._getLeafletGeometry(shape));
        }
    },

    updateSymbol: function(symbol){
        if(this._renderedObject){
            if(symbol.opacity !== this._renderedObject.options.opacity){
                this._renderedObject.setOpacity(symbol.opacity);
            }

            var iconOptions = this._getIconOptions(symbol);
            this._renderedObject.setIcon(L.icon(iconOptions));
        }
    },

    _getLeafletGeometry: function(shape){
        var geom;

        if(shape instanceof Z.LatLng){
            geom = L.latLng(shape.lat, shape.lng, shape.alt);
        }else if(shape instanceof Array){      //坐标顺序为[经度、维度]，如[120, 30]
            if(shape.length >= 3){
                geom = L.latLng([shape[1], shape[0], shape[2]]);
            }else if(shape.length >= 2){
                geom = L.latLng([shape[1], shape[0]]);
            }
        }

        return geom;
    },

    _getLeafletOptions: function(symbol){
        var iconOptions = this._getIconOptions(symbol);
        var options = {
            opacity: symbol.opacity || 1,
            icon: L.icon(iconOptions),
            clickable: true,
            keyboard: false
        };

        return options;
    },

    _getIconOptions: function(symbol){
        var options = {
            iconUrl: symbol.url
        };

        if((typeof symbol.width === 'number') && (typeof symbol.height === 'number')){
            options.iconSize = L.point(symbol.width, symbol.height);
        }

        if(symbol.offset && options.iconSize){
            options.iconAnchor = L.point(options.iconSize.x / 2 - symbol.offset.x, symbol.offset.y + options.iconSize.y / 2);      //leaflet的iconAnchor是相对于图片左上角的偏移，Z.Map则是相对于图片中心点的偏移
        }

        return options;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.CircleMarkerRender2D = Z.GraphicRender2D.extend({
    initialize: function(graphic){
        Z.GraphicRender2D.prototype.initialize.apply(this, arguments);
    },

    buildGraphicObject: function(baseIndex, layerIndex){
        var options = this._getLeafletOptions(this._graphic.symbol),
            radius = this._getRadius(this._graphic.feature.shape),
            geom = this._getLeafletGeometry(this._graphic.feature.shape),
            radiusType = this._graphic.feature.shape.radiusType;

        if(radiusType === 'meter'){
            return L.circle(geom, radius, options);
        }else{
            options.radius = radius;
            return L.circleMarker(geom, options);
        }
    },

    updateGeometry: function(shape){
        if(this._renderedObject){
            this._renderedObject.setLatLng(this._getLeafletGeometry(shape));
        }
    },

    //updateSymbol: function(symbol){
    //    if(this._renderedObject){
    //        if(symbol.opacity !== this._renderedObject.options.opacity){
    //            this._renderedObject.setOpacity(symbol.opacity);
    //        }
    //
    //        var iconOptions = this._getIconOptions(symbol);
    //        this._renderedObject.setIcon(L.icon(iconOptions));
    //    }
    //},

    _getLeafletGeometry: function(shape){
        var geom, center = shape.center;

        if(center instanceof Z.LatLng){
            geom = L.latLng(center.lat, center.lng, center.alt);
        }else if(center instanceof Array){      //坐标顺序为[经度、维度]，如[120, 30]
            if(center.length >= 3){
                geom = L.latLng([center[1], center[0], center[2]]);
            }else if(center.length >= 2){
                geom = L.latLng([center[1], center[0]]);
            }
        }

        return geom;
    },

    _getRadius: function(shape){
        return shape.radius || 100;
    },

    _getLeafletOptions: function(symbol){
        var options = {
            stroke: symbol.hidePolyline ? false : true,
            color: symbol.borderSymbol.color || '#0033ff',
            weight: symbol.borderSymbol.width || 5,
            opacity: symbol.borderSymbol.opacity || 0.5,
            fill:symbol.hideFill ? false : true,
            fillColor:symbol.fillSymbol.color || '#002244',
            fillOpacity:symbol.fillSymbol.opacity || 0.5,
            //fillRule:'',
            dashArray:(symbol.borderSymbol.style ===  Z.PolylineStyleType.Solid) ? null : '2,2',
            lineCap: null,
            lineJoin: null,
            clickable: true
        };

        return options;
    }
});
/**
 * Created by Administrator on 2015/12/2.
 */
Z.TextMarkerRender2D = Z.GraphicRender2D.extend({
    initialize: function(graphic){
        Z.GraphicRender2D.prototype.initialize.apply(this, arguments);
    },

    buildGraphicObject: function(baseIndex, layerIndex){
        var options = this._getLeafletOptions(this._graphic.symbol),
            geom = this._getLeafletGeometry(this._graphic.feature.shape);

        var marker = L.marker(geom, options);

        marker.on('add', function(){
            var icon = marker.options.icon, iconSize;
            iconSize = icon.getSize();
            icon.setAnchor(L.point(iconSize.x / 2, iconSize.y));
        });

        return marker;
    },

    updateGeometry: function(shape){
        if(this._renderedObject){
            this._renderedObject.setLatLng(this._getLeafletGeometry(shape));
        }
    },

    updateSymbol: function(symbol){
        if(this._renderedObject){
            if(symbol.opacity !== this._renderedObject.options.opacity){
                this._renderedObject.setOpacity(symbol.opacity);
            }

            var iconOptions = this._getIconOptions(symbol);
            this._renderedObject.setIcon(L.icon(iconOptions));
        }
    },

    _getLeafletGeometry: function(shape){
        var geom;

        if(shape instanceof Z.LatLng){
            geom = L.latLng(shape.lat, shape.lng, shape.alt);
        }else if(shape instanceof Array){      //坐标顺序为[经度、维度]，如[120, 30]
            if(shape.length >= 3){
                geom = L.latLng([shape[1], shape[0], shape[2]]);
            }else if(shape.length >= 2){
                geom = L.latLng([shape[1], shape[0]]);
            }
        }

        return geom;
    },

    _getLeafletOptions: function(symbol){
        var iconOptions = this._getIconOptions(symbol);
        var options = {
            opacity: symbol.opacity || 1,
            icon: new L.TextIcon(iconOptions),
            clickable: true,
            keyboard: false
        };

        return options;
    },

    _getIconOptions: function(symbol){
        var options = {
            font: {
                family: symbol.font.family,
                size: symbol.font.size,
                style: symbol.font.style,
                weight: symbol.font.weight
            },
            color: symbol.color,
            fill:symbol.fill,
            fillSymbol:{
                opacity: symbol.fillSymbol.opacity,
                bgColor: symbol.fillSymbol.bgColor
            },
            border: symbol.border,
            borderSymbol: {
                opacity: symbol.borderSymbol.opacity,
                color: symbol.borderSymbol.color,
                width: symbol.borderSymbol.width,
                style: this._getCssStyle(symbol.borderSymbol.style)
            },
            iconOpacity: symbol.opacity
        };

        if((typeof symbol.width === 'number') && (typeof symbol.height === 'number')){
            options.iconSize = L.point(symbol.width, symbol.height);
        }

        if(symbol.offset && options.iconSize){
            options.iconAnchor = L.point(options.iconSize.x / 2 - symbol.offset.x, symbol.offset.y + options.iconSize.y / 2);      //leaflet的iconAnchor是相对于图片左上角的偏移，Z.Map则是相对于图片中心点的偏移
        }

        options.text = symbol.text;

        return options;
    },

    _getCssStyle: function(style){
        if(style === Z.PolylineStyleType.Dash){
            return 'dashed';
        }else{
            return 'solid';
        }
    }
});
/**
 * 叠加次序控制分为两个层次：一个是对图层组层面的叠加顺序，包括baseBgPane、baseOverPane、layerPane等，通过设置polygonOffsetFactor实现。每个
 * 图层组内部的各个图层的polygonOffset都相同，他们之间的叠加顺序通过设置renderOrder来实现
 * _setBaseIndex用于控制图层组的叠加顺序，_setZIndex用于控制同一图层组内部各个图层间的叠加顺序，每个图层组内部的叠加顺序都以0开始，值大的叠加在上面
 */
Z.ZIndexManager = function(){}

Z.ZIndexManager.enableZIndex = function(material){
    if(!material){
        return;
    }

    if(material instanceof Array){
        for(var i = 0; i < material.length; i++){
            Z.ZIndexManager.enableZIndex(material[i]);
        }
    }else{
        material.polygonOffset = true;
    }
}

Z.ZIndexManager.setZIndex = function(object3D, zIndex, containerPaneIndex){
    object3D = object3D || {};

    if(!object3D.children){
        return;
    }

    if(object3D.children.length > 0){
        for(var i = 0; i < object3D.children.length; i++){
            Z.ZIndexManager.setZIndex(object3D.children[i], zIndex, containerPaneIndex);
        }
    }else{
        Z.ZIndexManager._setBaseIndex(object3D, containerPaneIndex);
        Z.ZIndexManager._setZIndex(object3D, zIndex, containerPaneIndex);
    }
}

Z.ZIndexManager._setBaseIndex = function(graphicObject, baseIndex){
    graphicObject = graphicObject || {};
    var material = graphicObject.material;

    if(material){
        var factor = 1 - baseIndex, units = 1 - baseIndex;
        //material.polygonOffset = true;
        material.polygonOffsetFactor = factor;
        material.polygonOffsetUnits = units;
    }

}

Z.ZIndexManager._setZIndex = function(geometry, zIndex, baseIndex){
    geometry.renderOrder = baseIndex * Z.Globe.Layer.layerGroupSize + zIndex;
}
/**
 * Created by Administrator on 2015/10/30.
 */
Z.TileLayer = Z.ILayer.extend({
    options:{
        minZoom: 1,
        maxZoom:20,
        zoomOffset: 0,
        extent: Z.LatLngBounds.create(Z.LatLng.create(-90, -180), Z.LatLng.create(90, 180)),
        zIndex: 1,
        opacity: 1,
        errorTileUrl: '',
        attribution:'',
        params:{},
        tileInfo:{
            format:'image/png',
            tileWidth:256,
            tileHeight:256,
            dpi:96,
            origin: Z.LatLng(90, -180),
            levelDefine:[]
        }
    },

    initialize: function(urls, options){
        urls = urls || [];

        if(!(urls instanceof Array)){
            urls = [urls + ""];
        }

        this._urls = urls;
        this._scene = null;
        this._render = null;
        this._containerPane = null;
        this._visible = true;

        options = options || {};
        this.options = Z.Util.applyOptions(this.options, options, false, ['tileInfo']);
        this.options.tileInfo = Z.Util.applyOptions(this.options.tileInfo, options.tileInfo, false);
    },

    onAdd: function(scene, index, containerPane){
        //var allAre2D = (scene instanceof Z.Scene2D) && (this._render instanceof Z.TileRender2D),
        //    allAre3D = (scene instanceof Z.Scene3D) && (this._render instanceof Z.TileRender3D);
        //
        //if(!(allAre2D|| allAre3D)){
            var newRender = this.getTileRender(scene, this._urls, this.options);

            if(this._render){
                this._render.onRemove(this._scene);
            }

            this._render = newRender;
        //}

        this._scene = scene;
        this._containerPane = containerPane;
        return this._render.onAdd(this._scene, index, containerPane);
    },

    getTileRender: function(scene, urls, options){
        var render;

        //if(scene instanceof Z.Scene2D){
        //    render = new Z.TileRender2D(urls, options);
        //}else if(scene instanceof Z.Scene3D){
        //    render = new Z.TileRender3D(urls, options);
        //}

        if(scene instanceof Z.Scene2D){
            render = this.getTileRender2D(urls, options);
        }else if(scene instanceof Z.Scene3D){
            render = this.getTileRender3D(urls, options);
        }

        return render;
    },

    getTileRender2D: function(urls, options){
        return new Z.TileRender2D(urls, options);
    },

    getTileRender3D: function(urls, options){
        return new Z.TileRender3D(urls, options);
    },

    onRemove: function(scene){
        if(this._render){
            this._render.onRemove(this._scene);
            this._render = null;
        }
    },

    show: function(){
        this._render.show();
    },

    hide: function(){
        this._render.hide();
    },

    setOpacity: function(opacity){
        this.options.opacity = opacity;
        this._render.setOpacity(opacity);
    },

    setZIndex: function(zIndex){
        this.options.zIndex = zIndex;
        this._render.setZIndex(zIndex);
    },

    getContainerPane: function(){
        return this._containerPane;
    },

    setZoomRange: function(minZoom, maxZoom){
        this.options.minZoom = ((typeof minZoom) === 'number') ? minZoom : this.options.minZoom;
        this.options.maxZoom = ((typeof maxZoom) === 'number') ? maxZoom : this.options.maxZoom;
        this.refresh();
    },

    refresh: function(){
        this._render.refresh(this.options);
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
Z.WMTSTileLayer = Z.TileLayer.extend({
    initialize: function(urls, options){
        Z.TileLayer.prototype.initialize.apply(this, arguments);    //调用超类的构造函数
    },

    //getTileRender: function(scene, urls, options){
    //    var render;
    //
    //    if(scene instanceof Z.Scene2D){
    //        render = new Z.WMTSTileRender2D(urls, options);
    //    }else if(scene instanceof Z.Scene3D){
    //        render = new Z.WMTSTileRender3D(urls, options);
    //    }
    //
    //    return render;
    //}

    getTileRender2D: function(urls, options){
        return new Z.WMTSTileRender2D(urls, options);
    },

    getTileRender3D: function(urls, options){
        return new Z.WMTSTileRender3D(urls, options);
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
Z.TDTVectorLayer = Z.TileLayer.extend({
    initialize: function(urls, options){
        Z.TileLayer.prototype.initialize.apply(this, arguments);
    },

    //getTileRender: function(scene, urls, options){
    //    var render;
    //
    //    if(scene instanceof Z.Scene2D){
    //        render = new Z.TDTVectorTileRender2D(urls, options);
    //    }else if(scene instanceof Z.Scene3D){
    //        render = new Z.TDTVectorTileRender3D(urls, options);
    //    }
    //
    //    return render;
    //}

    getTileRender2D: function(urls, options){
        return new Z.TDTVectorTileRender2D(urls, options);
    },

    getTileRender3D: function(urls, options){
        return new Z.TDTVectorTileRender3D(urls, options);
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
Z.TDTVectorAnnoLayer = Z.TileLayer.extend({
    initialize: function(urls, options){
        Z.TileLayer.prototype.initialize.apply(this, arguments);
    },

    //getTileRender: function(scene, urls, options){
    //    var render;
    //
    //    if(scene instanceof Z.Scene2D){
    //        render = new Z.TDTVectorAnnoTileRender2D(urls, options);
    //    }else if(scene instanceof Z.Scene3D){
    //        render = new Z.TDTVectorAnnoTileRender3D(urls, options);
    //    }
    //
    //    return render;
    //}

    getTileRender2D: function(urls, options){
        return new Z.TDTVectorAnnoTileRender2D(urls, options);
    },

    getTileRender3D: function(urls, options){
        return new Z.TDTVectorAnnoTileRender3D(urls, options);
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
Z.TDTRasterLayer = Z.TileLayer.extend({
    initialize: function(urls, options){
        Z.TileLayer.prototype.initialize.apply(this, arguments);
    },

    //getTileRender: function(scene, urls, options){
    //    var render;
    //
    //    if(scene instanceof Z.Scene2D){
    //        render = new Z.TDTRasterTileRender2D(urls, options);
    //    }else if(scene instanceof Z.Scene3D){
    //        render = new Z.TDTRasterTileRender3D(urls, options);
    //    }
    //
    //    return render;
    //}

    getTileRender2D: function(urls, options){
        return new Z.TDTRasterTileRender2D(urls, options);
    },

    getTileRender3D: function(urls, options){
        return new Z.TDTRasterTileRender3D(urls, options);
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
Z.TDTRasterAnnoLayer = Z.TileLayer.extend({
    initialize: function(urls, options){
        Z.TileLayer.prototype.initialize.apply(this, arguments);
    },

    //getTileRender: function(scene, urls, options){
    //    var render;
    //
    //    if(scene instanceof Z.Scene2D){
    //        render = new Z.TDTRasterAnnoTileRender2D(urls, options);
    //    }else if(scene instanceof Z.Scene3D){
    //        render = new Z.TDTRasterAnnoTileRender3D(urls, options);
    //    }
    //
    //    return render;
    //}

    getTileRender2D: function(urls, options){
        return new Z.TDTRasterAnnoTileRender2D(urls, options);
    },

    getTileRender3D: function(urls, options){
        return new Z.TDTRasterAnnoTileRender3D(urls, options);
    }
});
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TileRender2D = Z.ITileRender.extend({
    initialize: function(urls, options){
        this._leafletLayer = this.getTileLayer(urls, options);
        this._scene = null;
    },

    getTileLayer: function(urls, options){
        var layerOptions = this._getLeafletOptions(options);
        return new L.TileLayer(urls[0], layerOptions);
    },

    onAdd: function(scene, index, containerPane){
        this._scene = scene;
        scene._leafletMap.addLayer(this._leafletLayer);
    },

    onRemove: function(scene){
        this._scene = undefined;
        scene._leafletMap.removeLayer(this._leafletLayer);
    },

    show: function(){
        this._leafletLayer.getContainer().style.display = "block";
    },

    hide: function(){
        this._leafletLayer.getContainer().style.display = "none";
    },

    setOpacity: function(opacity){
        this._leafletLayer.setOpacity(opacity);
    },

    setZIndex: function(zIndex){
        this._leafletLayer.setZIndex(zIndex);
    },

    refresh: function(tileOptions){
        var leafTileOptions = this._getLeafletOptions(tileOptions);

        for(var opt in leafTileOptions){
            if(leafTileOptions[opt] !== undefined){
                this._leafletLayer[opt] = leafTileOptions[opt];
            }
        }
    },

    /*将options转换成leaflet图层的options参数*/
    _getLeafletOptions: function(options){
        return {
            minZoom:(options.minZoom !== undefined)? options.minZoom : 1,
            maxZoom:(options.maxZoom !== undefined)? options.maxZoom : 20,
            zoomOffset:(options.zoomOffset !== undefined)? options.zoomOffset : undefined,
            tileSize:(options.tileSize !== undefined)? options.tileSize : undefined,
            opacity:(options.opacity !== undefined)? options.opacity : undefined,
            zIndex:(options.zIndex !== undefined)? options.zIndex : undefined,
            bounds:(options.extent !== undefined)?Z.LeafletUtil.latLngBoundsToLeaflet(options.extent) : undefined,
            errorTileUrl:(options.errorTileUrl !== undefined)? options.errorTileUrl : undefined,
            attribution:(options.attribution !== undefined)? options.attribution : undefined
        };
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
Z.WMTSTileRender2D = Z.TileRender2D.extend({
    initialize: function(urls, options){
        Z.TileRender2D.prototype.initialize.apply(this, arguments);
    },

    getTileLayer: function(urls, options){
        //return new L.TileLayer.TDT.Vector();//L.tileLayer();
        var layerOptions = this._getLeafletOptions(options);
        return new L.TileLayer.WMTS(urls, layerOptions);
    },

    /*将options转换成leaflet图层的options参数*/
    _getLeafletOptions: function(options){
        return {
            minZoom:(options.minZoom !== undefined)? options.minZoom : 1,
            maxZoom:(options.maxZoom !== undefined)? options.maxZoom : 20,
            zoomOffset:(options.zoomOffset !== undefined)? options.zoomOffset : undefined,
            tileSize:(options.tileSize !== undefined)? options.tileSize : undefined,
            opacity:(options.opacity !== undefined)? options.opacity : undefined,
            zIndex:(options.zIndex !== undefined)? options.zIndex : undefined,
            bounds:(options.extent !== undefined)?Z.LeafletUtil.latLngBoundsToLeaflet(options.extent) : undefined,
            errorTileUrl:(options.errorTileUrl !== undefined)? options.errorTileUrl : undefined,
            attribution:(options.attribution !== undefined)? options.attribution : undefined,
            layer: (options.params.layer !== undefined)? options.params.layer : '0',
            style: (options.params.style !== undefined)? options.params.style : 'default',
            tilematrixSet: (options.params.tilematrixSet !== undefined)? options.params.tilematrixSet : '',
            format: (options.tileInfo.format !== undefined)? options.tileInfo.format :'image/jpeg'
        };
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TDTVectorTileRender2D = Z.TileRender2D.extend({
    initialize: function(urls, options){
        Z.TileRender2D.prototype.initialize.apply(this, arguments);
    },

    getTileLayer: function(urls, options){
        return new L.TileLayer.TDT.Vector();
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TDTVectorAnnoTileRender2D = Z.TileRender2D.extend({
    initialize: function(urls, options){
        Z.TileRender2D.prototype.initialize.apply(this, arguments);
    },

    getTileLayer: function(urls, options){
        return new L.TileLayer.TDT.VectorAnno();
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TDTRasterTileRender2D = Z.TileRender2D.extend({
    initialize: function(urls, options){
        Z.TileRender2D.prototype.initialize.apply(this, arguments);
    },

    getTileLayer: function(urls, options){
        return new L.TileLayer.TDT.Raster();
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TDTRasterAnnoTileRender2D = Z.TileRender2D.extend({
    initialize: function(urls, options){
        Z.TileRender2D.prototype.initialize.apply(this, arguments);
    },

    getTileLayer: function(urls, options){
        return new L.TileLayer.TDT.RasterAnno();
    }
});
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TileRender3D = Z.ITileRender.extend({
    initialize: function(urls, options){
        this._scene = null;
            //_visible: true,
        this._tiles = {};
        this._options = {};
        this._renderTileSize = null;
        this._containerPane = null;
        this._tileMaterial = null;
        this._pyramidModel = null;
        this._dragStartPoint = null;
        this._zIndex = 0;

        var urlsType = typeof urls;
        this._urls = urlsType === "array" ? urls : (urlsType === "string" ? [urls] : []);
        this._options = Z.Util.applyOptions(this._options, options, true);
        this._tileRoot = new Z.SceneThreePaneItem();
        this._initPyramidModel(this._options);
        this._initTileMaterial();
    },

    getTileUrl: function(level, row, col){
        var url = this._urls[(row + col)%this._urls.length];

        return url + "/" + level + "/" + row + "/" + col;
    },

    onAdd: function(scene, index, containerPane){
        if(!(scene instanceof Z.Scene3D) || !(containerPane instanceof Z.SceneThreePaneItem)){
            return;
        }

        var tileIndex = index;

        if(!(typeof tileIndex === "number")){
            tileIndex = containerPane.getMaxChildIndex() + 1;
        }

        this._scene = scene;

        //if(containerPane instanceof Z.SceneThreePaneItem){
            //containerPane.root.add(this._tileRoot);
            this._tileRoot.index = tileIndex;
            containerPane.addChild(this._tileRoot, tileIndex);
            this._containerPane = containerPane;
        //}

        this._addEvents();
        this._reset();
        this._update();
        //this.setBaseIndex(containerPane.index);
        //this._zIndex = tileIndex;
        //this._setTileZIndex(containerPane.index + tileIndex);
        //this._setTileZIndex(tileIndex);
        this.setZIndex(tileIndex);

        this._scene.refresh();

        //return containerPane.index + tileIndex;
        return tileIndex;
    },

    onRemove: function(scene){
        //this._scene.off({"viewreset": this._reset(),
        //    "moveend": this._update()});
        this._reset();
        this._removeEvents();

        if(this._containerPane){
            //this._containerPane.root.remove(this._tileRoot);
            this._containerPane.removeChild(this._tileRoot);
            this._containerPane = null;
        }

        this._scene.refresh();
        this._scene = undefined;
    },

    show: function(){
        this._tileRoot.show();
    },

    hide: function(){
        this._tileRoot.hide();
    },

    setOpacity: function(opacity){
        if(typeof opacity !== "number"){
            return;
        }

        opacity = Math.min(1, Math.max(opacity, 0));
        this._tileMaterial.opacity = opacity;

        for (var key in this._tiles) {
            this._tiles[key].material.opacity = opacity;
        }
    },

    /*叠加次序控制分为两个层次：一个是对图层组层面的叠加顺序，包括baseBgPane、baseOverPane、layerPane等，通过设置polygonOffsetFactor实现。每个
    * 图层组内部的各个图层的polygonOffset都相同，他们之间的叠加顺序通过设置renderOrder来实现
    * setBaseIndex用于控制图层组的叠加顺序，setZIndex用于控制同一图层组内部各个图层间的叠加顺序，每个图层组内部的叠加顺序都以0开始，值大的叠加在上面*/
    //setBaseIndex: function(baseIndex){
    //    var factor = 1 - baseIndex, units = 1 - baseIndex;
    //    //this._tileMaterial.polygonOffset = true;
    //    this._tileMaterial.polygonOffsetFactor = factor;
    //    this._tileMaterial.polygonOffsetUnits = units;
    //
    //    for (var key in this._tiles) {
    //        //this._tiles[key].material.polygonOffset = true;
    //        this._tiles[key].material.polygonOffsetFactor = factor;
    //        this._tiles[key].material.polygonOffsetUnits = units;
    //    }
    //},

    setZIndex: function(zIndex){
        if(typeof zIndex !== "number" || !this._containerPane){
            return;
        }

        this._zIndex = zIndex;
        this._containerPane.setChildIndex(this._tileRoot, zIndex);

        //this._setTileZIndex(this._containerPane.index + zIndex);
        this._setTileZIndex(zIndex, this._containerPane.index);
    },

    _setTileZIndex: function(zIndex, containerPaneIndex){
        for (var key in this._tiles) {
            //this._tiles[key].renderOrder = this._containerPane.index * Z.Globe.Layer.layerGroupSize + zIndex;
            Z.ZIndexManager.setZIndex(this._tiles[key], zIndex, containerPaneIndex);
        }
    },

    refresh: function(tileOptions){
        //var leafTileOptions = this._getLeafletOptions(tileOptions);
        //
        //for(var opt in leafTileOptions){
        //    if(leafTileOptions[opt] !== undefined){
        //        this._leafletLayer[opt] = leafTileOptions[opt];
        //    }
        //}
    },

    _initPyramidModel: function(options){
        var pyramidOptions = {
            //latLngBounds: this._latLngBounds.clone(),
            origin: options.tileInfo.origin,
            tileSize: Z.Point.create(options.tileInfo.tileWidth, options.tileInfo.tileHeight),
            levelDefine: options.tileInfo.levelDefine
        };

        this._pyramidModel = new Z.PyramidModel(pyramidOptions);
    },

    _initTileMaterial: function(){
        //var mat = new THREE.MeshLambertMaterial({
        var mat = new THREE.MeshBasicMaterial({
            //polygonOffset: true,
            //polygonOffsetFactor: 1,
            //polygonOffsetUnits: 1,
            transparent: true,
            opacity: 1,
            fog: true
        });

        Z.ZIndexManager.enableZIndex(mat);
        this._tileMaterial = mat;
    },

    _addEvents: function(){
        var thisObj = this;
        //this._scene.on({"viewreset": thisObj._reset,
        //    "moveend": thisObj._update});
        this._scene.on("viewreset", thisObj._onViewReset, thisObj);
        this._scene.on("zoomlevelschange", thisObj._onZoomChange, thisObj);
        //this._scene.on("moveend", thisObj._update, thisObj);
        //this._scene.on("rotateend", thisObj._update, thisObj);
        this._scene.on("dragstart", thisObj._onDragStart, thisObj);
        this._scene.on("drag", this._onDrag, thisObj);
        this._scene.on("dragend", thisObj._onDragEnd, thisObj);
    },

    _removeEvents: function(){
        var thisObj = this;
        this._scene.off("viewreset", thisObj._onViewReset, thisObj);
        this._scene.off("zoomlevelschange", thisObj._onZoomChange, thisObj);
        //this._scene.off("moveend", thisObj._update, thisObj);
        //this._scene.off("rotateend", thisObj._update, thisObj);
        this._scene.off("dragstart", thisObj._onDragStart, thisObj);
        this._scene.off("drag", this._onDrag, thisObj);
        this._scene.off("dragend", thisObj._onDragEnd, thisObj);
    },

    _onViewReset: function(e){
        this._update();
        //this._setTileZIndex(this._containerPane.index + this._zIndex);
        //this._setTileZIndex(this._zIndex);
        this.setZIndex(this._zIndex);
        this._scene.refresh();
    },

    _onZoomChange: function(e){
        this._reset();
        this._update();
        //this.setBaseIndex(this._containerPane.index);
        //this._setTileZIndex(this._zIndex);
        this.setZIndex(this._zIndex);
        this._scene.refresh();
    },

    _onDragStart: function(e){
        this._dragStartPoint = this._tileRoot.root.position.clone();
    },

    _onDrag: function(e){
        var sceneObj = this._scene;
        var startPoint = sceneObj.screenPointToScenePoint(e.startPoint);
        var newPoint = sceneObj.screenPointToScenePoint(e.newPoint);
        var delta = newPoint.subtract(startPoint);
        this._tileRoot.root.position.x = this._dragStartPoint.x + delta.x;
        this._tileRoot.root.position.y = this._dragStartPoint.y + delta.y;
        this._tileRoot.root.position.z = this._dragStartPoint.z + delta.z;
        this._scene.refresh();
    },

    _onDragEnd: function(e){
        var sceneObj = this._scene;
        var startPoint = sceneObj.screenPointToScenePoint(e.startPoint);
        var newPoint = sceneObj.screenPointToScenePoint(e.newPoint);
        //var delta = newPoint.subtract(startPoint);
        this._tileRoot.root.position.x = this._dragStartPoint.x;
        this._tileRoot.root.position.y = this._dragStartPoint.y;
        this._tileRoot.root.position.z = this._dragStartPoint.z;
        //var key, tile;
        //
        //for (key in this._tiles) {
        //    tile = this._tiles[key];
        //    tile.position.x += delta.x;
        //    tile.position.y += delta.y;
        //    tile.position.z += delta.z;
        //}
        //this._translateByGL(startPoint, newPoint);

        this._dragStartPoint =null;
        //this._update();
    },

    //_translateByGL: function(startPoint, endPoint){
    //    var delta = endPoint.subtract(startPoint);
    //    var key, tile;
    //
    //    for (key in this._tiles) {
    //        tile = this._tiles[key];
    //        tile.position.x += delta.x;
    //        tile.position.y += delta.y;
    //        tile.position.z += delta.z;
    //    }
    //},

    _disposeTiles: function(){
        for (var key in this._tiles) {
            try{
                if(this._tiles[key].material){
                    if(this._tiles[key].material.map){
                        this._tiles[key].material.map.dispose();
                    }

                    this._tiles[key].material.dispose();
                }

                //delete this._tiles[key];
            }catch(e){}
        }

        this._tiles = {};
    },

    _reset: function (e) {
        for (var key in this._tiles) {
            this.fire('tileunload', { tile: this._tiles[key] });
        }

        //this._tiles = {};
        this._disposeTiles();
        this._renderTileSize = null;
        this._containerPane.removeChild(this._tileRoot);
        this._tileRoot.resetRoot();
        this._containerPane.addChild(this._tileRoot);
        //Z.ThreejsUtil.clearObject3D(this._tileRoot.root);
        //this._tilesToLoad = 0;
        //
        //if (this.options.reuseTiles) {
        //    this._unusedTiles = [];
        //}
        //
        //this._tileContainer.innerHTML = '';
        //
        //if (this._animated && e && e.hard) {
        //    this._clearBgBuffer();
        //}

        //this._initContainer();
        //this._tileRoot.root =this._tileRoot.createRootObject();
        this._initTileMaterial();
    },

    _update: function () {
        if (!this._scene || !this._pyramidModel) { return; }

        var latLngContentBounds = this._scene.getContentBounds(),
            latLngOrthoBounds = this._scene.getBounds(),
            size = this._scene.getSize(),
            sceneScale = this._scene.getScale(),
            zoom = this._pyramidModel.fitZoomLevel(latLngOrthoBounds, size.x, size.y);

        var tileBounds = this._pyramidModel.getTileBounds(latLngContentBounds, zoom);
        this._updateTiles(tileBounds, zoom);

        //if (!this._map) { return; }
        //
        //var map = this._map,
        //    bounds = map.getPixelBounds(),
        //    zoom = map.getZoom(),
        //    tileSize = this._getTileSize();
        //
        //if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
        //    return;
        //}
        //
        //var tileBounds = L.bounds(
        //    bounds.min.divideBy(tileSize)._floor(),
        //    bounds.max.divideBy(tileSize)._floor());
        //
        //this._addTilesFromCenterOut(tileBounds);
        //
        //if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
        //    this._removeOtherTiles(tileBounds);
        //}
    },

    _updateTiles: function(tileBounds, zoom){
        this._updateTilesPos();

        var queue = [];//,
            //center = tileBounds.getCenter(),
            //bottomCenterX = center.x,
            //bottomCenterY = center.y + Math.floor(tileBounds.getSize / 2);

        var j, i, point;

        for (j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                point = new Z.Point(i, j, zoom);

                if (this._tileShouldBeLoaded(point)) {
                    queue.push(point);
                }
            }
        }

        var tilesToLoad = queue.length;

        if (tilesToLoad === 0) { return; }

        // load tiles in order of their distance to center
        queue.sort(function (a, b) {
            return b.y - a.y;
        });

        if(!this._renderTileSize){
            this._renderTileSize = this._getRenderTileSize(queue[0]);
        }

        var tileContainer = this._tileRoot.root;

        //// if its the first batch of tiles to load
        //if (!this._tilesToLoad) {
        //    this.fire('loading');
        //}

        //this._tilesToLoad += tilesToLoad;

        for (i = 0; i < tilesToLoad; i++) {
            this._addTile(queue[i], tileContainer);
        }

        this._removeInvisibleTiles(tileBounds);
    },

    _updateTilesPos: function(){
        //_getTilePos
        var delta = null, key, tile;

        for (key in this._tiles) {
            tile = this._tiles[key];

            if(!delta){
                var kArr = key.split(':'), x, y, newPos, oldPos;
                x = parseInt(kArr[0], 10);
                y = parseInt(kArr[1], 10);
                newPos = this._getTilePos(new Z.Point(x, y));
                oldPos = new Z.Point(tile.position.x, tile.position.y, tile.position.z);
                delta = newPos.subtract(oldPos);
            }

            tile.position.x += delta.x;
            tile.position.y += delta.y;
            tile.position.z += delta.z;
        }
    },

    _tileShouldBeLoaded: function (tilePoint) {
        //瓦片是否已加载
        if ((tilePoint.x + ':' + tilePoint.y) in this._tiles) {
            return false;
        }

        //瓦片是否超出最大地图范围
        var maxTileBounds = this._pyramidModel.getTileBounds(this._scene.options.maxBounds, this._scene.getZoom());

        if(tilePoint.x < maxTileBounds.min.x || tilePoint.x > maxTileBounds.max.x
            || tilePoint.y < maxTileBounds.min.y|| tilePoint.y > maxTileBounds.max.y){
            return false;
        }

        //var options = this.options;
        //
        //if (!options.continuousWorld) {
        //    var limit = this._getWrapTileNum();
        //
        //    // don't load if exceeds world bounds
        //    if ((options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit.x)) ||
        //        tilePoint.y < 0 || tilePoint.y >= limit.y) { return false; }
        //}
        //
        //if (options.bounds) {
        //    var tileSize = options.tileSize,
        //        nwPoint = tilePoint.multiplyBy(tileSize),
        //        sePoint = nwPoint.add([tileSize, tileSize]),
        //        nw = this._map.unproject(nwPoint),
        //        se = this._map.unproject(sePoint);
        //
        //    // TODO temporary hack, will be removed after refactoring projections
        //    // https://github.com/Leaflet/Leaflet/issues/1618
        //    if (!options.continuousWorld && !options.noWrap) {
        //        nw = nw.wrap();
        //        se = se.wrap();
        //    }
        //
        //    if (!options.bounds.intersects([nw, se])) { return false; }
        //}

        return true;
    },

    _getRenderTileSize: function(tilePoint){
        var tileLatLngBounds = this._pyramidModel.getLatLngBounds(tilePoint, this._scene.getZoom()),
            southWest = this._scene._latLngToGLPoint(tileLatLngBounds.getSouthWest()),
            northEast = this._scene._latLngToGLPoint(tileLatLngBounds.getNorthEast());

        return new Z.Point(Math.abs(southWest.x - northEast.x), Math.abs(southWest.y - northEast.y));
    },

    _addTile: function(tilePoint, container){
        var tilePos = this._getTilePos(tilePoint);
        var tile = this._getTile();
        this._setTilePos(tile, tilePos);

        this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;

        this._loadTile(tile, tilePoint);

        if(tile.parent !== container){
            container.add(tile);
        }
    },

    _getTilePos: function(tilePoint){
        var tileLatLngBounds = this._pyramidModel.getLatLngBounds(tilePoint, this._scene.getZoom());
        var tileCenter = tileLatLngBounds.getCenter();

        return this._scene._latLngToGLPoint(tileCenter);
    },

    _getTile: function(){
        var geom = new THREE.PlaneBufferGeometry(this._renderTileSize.x, this._renderTileSize.y, 1, 1);
        var tileObj = new THREE.Mesh(geom, this._tileMaterial.clone());
        tileObj.receiveShadow = true;
        Z.ZIndexManager.setZIndex(tileObj, this._zIndex, this._containerPane.index);

        return tileObj;
    },

    _setTilePos: function(tile, pos){
        tile.position.x = pos.x;
        tile.position.y = pos.y;
        tile.position.z = pos.z;
    },

    _loadTile: function (tile, tilePoint) {
        var level = this._options.zoomOffset ? (tilePoint.z + this._options.zoomOffset) : tilePoint.z;
        var tileUrl = this.getTileUrl(level, tilePoint.y, tilePoint.x);
        var thisObj = this;

        var texture = THREE.ImageUtils.loadTexture(
            tileUrl,
            {},
            function(){
                thisObj._scene.refresh();
            },
            function(){
                thisObj._removeTile(tilePoint.x + ':' + tilePoint.y);
                tile.material.map = THREE.ImageUtils.loadTexture(
                    thisObj._options.errorTileUrl,
                    {},
                    function(){
                        thisObj._scene.refresh();
                    });
            });
        texture.premultiplyAlpha = false;
        texture.anisotropy = this._scene.getMaxAnisotropy();
        //texture.minFilter = THREE.LinearFilter;
        tile.material.map = texture;
        tile._tileUrl = tileUrl;

        this.fire('tileloadstart', {
            tile: tile,
            url: tileUrl
        });
    },

    /*移除不可见瓦片*/
    _removeInvisibleTiles: function(tileBounds){
        var kArr, x, y, key, forMoved = [];

        for (key in this._tiles) {
            kArr = key.split(':');
            x = parseInt(kArr[0], 10);
            y = parseInt(kArr[1], 10);

            // remove tile if it's out of bounds
            if (x < tileBounds.min.x || x > tileBounds.max.x || y < tileBounds.min.y || y > tileBounds.max.y) {
                //this._removeTile(key);
                forMoved.push(key);
            }
        }

        for (key in forMoved) {
            this._removeTile(forMoved[key]);
        }
    },

    _removeTile: function (key) {
        var tile = this._tiles[key];

        if(tile){
            this.fire('tileunload', { tile: tile, url: tile._tileUrl });
            this._tileRoot.root.remove(tile);

            if(tile.material){
                if(tile.material.texture){
                    tile.material.texture.dispose();
                }

                tile.material.dispose();
            }
        }

        delete this._tiles[key];
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
Z.WMTSTileRender3D = Z.TileRender3D.extend({
    initialize: function(urls, options){
        Z.TileRender3D.prototype.initialize.apply(this, arguments);
    },

    getTileUrl: function(level, row, col){
        var url = _urls[(row + col)%_urls.length],
            params = this._getWMTSGetTileParams(level, row, col);

        return url + Z.Util.getParamString(params);
    },

    _getWMTSGetTileParams: function(level, row, col){
        var params = {
            service: 'WMTS',
            request: 'GetTile',
            version: '1.0.0',
            layer: '',
            style: 'default',
            tilematrixSet: '',
            format: 'image/jpeg'
        };

        Z.Util.applyOptions(params, this._options.params, false);

        params.tileMatrix = level;
        params.tileRow = row;
        params.tileCol = col;
        params.format = this._options.tileInfo.format || params.format;

        return params;
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TDTBaseTileRender3D = Z.WMTSTileRender3D.extend({
    //_urlArray: ["http://t0.tianditu.com/vec_c/wmts",
    //    "http://t1.tianditu.com/vec_c/wmts",
    //    "http://t2.tianditu.com/vec_c/wmts",
    //    "http://t3.tianditu.com/vec_c/wmts"],

    _urlArray: [],

    _tdtOptions: {
        layer: '',
        style: 'default',
        format: 'tiles',
        tilematrixSet: ''//,
        //attribution: '天地图'
    },

    _lods:[
        { "level": 0, "resolution": 1.40782880508533, "scale": 591658710.9 },
        { "level": 1, "resolution": 0.70312500000011879, "scale": 295497593.05879998 },
        { "level": 2, "resolution": 0.3515625000000594, "scale": 147748796.52939999 },
        { "level": 3, "resolution": 0.1757812500000297, "scale": 73874398.264699996 },
        { "level": 4, "resolution": 0.087890625000014849, "scale": 36937199.132349998 },
        { "level": 5, "resolution": 0.043945312500007425, "scale": 18468599.566174999 },
        { "level": 6, "resolution": 0.021972656250003712, "scale": 9234299.7830874994 },
        { "level": 7, "resolution": 0.010986328125001856, "scale": 4617149.8915437497 },
        { "level": 8, "resolution": 0.0054931640625009281, "scale": 2308574.9457718749 },
        { "level": 9, "resolution": 0.002746582031250464, "scale": 1154287.4728859374 },
        { "level": 10, "resolution": 0.001373291015625232, "scale": 577143.73644296871 },
        { "level": 11, "resolution": 0.00068664550781261601, "scale": 288571.86822148436 },
        { "level": 12, "resolution": 0.000343322753906308, "scale": 144285.934110742183 },
        { "level": 13, "resolution": 0.000171661376953154, "scale": 72142.967055371089 },
        { "level": 14, "resolution": 8.5830688476577001e-005, "scale": 36071.483527685545 },
        { "level": 15, "resolution": 4.2915344238288501e-005, "scale": 18035.741763842772 },
        { "level": 16, "resolution": 2.145767211914425e-005, "scale": 9017.8708819213862 },
        { "level": 17, "resolution": 1.0728836059572125e-005, "scale": 4508.9354409606931 },
        { "level": 18, "resolution": 5.3644180297860626e-006, "scale": 2254.4677204803465 },
        { "level": 19, "resolution": 2.6822090148930313e-006, "scale": 1127.2338602401733 },
        { "level": 20, "resolution": 1.3411045074465156e-006, "scale": 563.61693012008664 }
    ],

    initialize: function(urls, options){
        options.tileInfo.levelDefine = this._lods;
        Z.WMTSTileRender3D.prototype.initialize.apply(this, arguments);
    },

    getTileUrl: function(level, row, col){
        var url = this._urlArray[(row + col)%this._urlArray.length],
            params = this._getWMTSGetTileParams(level, row, col);
        Z.Util.applyOptions(params, this._tdtOptions, false);

        return url + Z.Util.getParamString(params);
    }
});
/**
 * Created by Administrator on 2015/11/2.
 */
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TDTVectorTileRender3D = Z.TDTBaseTileRender3D.extend({
    //_urlArray: ["http://t0.tianditu.com/vec_c/wmts",
    //    "http://t1.tianditu.com/vec_c/wmts",
    //    "http://t2.tianditu.com/vec_c/wmts",
    //    "http://t3.tianditu.com/vec_c/wmts"],

    _urlArray: ["http://localhost:8080/vec_c/wmts",
        "http://localhost:8080/vec_c/wmts",
        "http://localhost:8080/vec_c/wmts",
        "http://localhost:8080/vec_c/wmts"],

    _tdtOptions: {
        layer: 'vec',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c'//,
        //attribution: '天地图'
    }
    //,
    //
    //initialize: function(urls, options){
    //    Z.TDTBaseTileRender3D.prototype.initialize.apply(this, arguments);
    //}
});
/**
 * Created by Administrator on 2015/11/2.
 */
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TDTVectorAnnoTileRender3D = Z.TDTBaseTileRender3D.extend({
    //_urlArray: ["http://t0.tianditu.com/cva_c/wmts",
    //    "http://t1.tianditu.com/cva_c/wmts",
    //    "http://t2.tianditu.com/cva_c/wmts",
    //    "http://t3.tianditu.com/cva_c/wmts"],

    _urlArray: ["http://localhost:8080/cva_c/wmts",
        "http://localhost:8080/cva_c/wmts",
        "http://localhost:8080/cva_c/wmts",
        "http://localhost:8080/cva_c/wmts"],

    _tdtOptions: {
        layer: 'cva',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c'//,
        //attribution: '天地图'
    }
    //,
    //
    //initialize: function(urls, options){
    //    Z.TDTBaseTileRender3D.prototype.initialize.apply(this, arguments);
    //}
});
/**
 * Created by Administrator on 2015/11/2.
 */
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TDTRasterTileRender3D = Z.TDTBaseTileRender3D.extend({
    //_urlArray: ["http://t0.tianditu.com/vec_c/wmts",
    //    "http://t1.tianditu.com/vec_c/wmts",
    //    "http://t2.tianditu.com/vec_c/wmts",
    //    "http://t3.tianditu.com/vec_c/wmts"],

    _urlArray: ["http://localhost:8080/img_c/wmts",
        "http://localhost:8080/img_c/wmts",
        "http://localhost:8080/img_c/wmts",
        "http://localhost:8080/img_c/wmts"],

    _tdtOptions: {
        layer: 'img',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c'//,
        //attribution: '天地图'
    }
    //,
    //
    //initialize: function(urls, options){
    //    Z.TDTBaseTileRender3D.prototype.initialize.apply(this, arguments);
    //}
});
/**
 * Created by Administrator on 2015/11/2.
 */
/**
 * Created by Administrator on 2015/10/31.
 */
Z.TDTRasterAnnoTileRender3D = Z.TDTBaseTileRender3D.extend({
    //_urlArray: ["http://t0.tianditu.com/vec_c/wmts",
    //    "http://t1.tianditu.com/vec_c/wmts",
    //    "http://t2.tianditu.com/vec_c/wmts",
    //    "http://t3.tianditu.com/vec_c/wmts"],

    _urlArray: ["http://localhost:8080/cia_c/wmts",
        "http://localhost:8080/cia_c/wmts",
        "http://localhost:8080/cia_c/wmts",
        "http://localhost:8080/cia_c/wmts"],

    _tdtOptions: {
        layer: 'cia',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c'//,
        //attribution: '天地图'
    }
    //,
    //
    //initialize: function(urls, options){
    //    Z.TDTBaseTileRender3D.prototype.initialize.apply(this, arguments);
    //}
});
/**
 * Created by Administrator on 2015/10/30.
 */
Z.GraphicLayer = Z.ILayer.extend({
    options:{
        idProp: '',
        nameProp: '',
        opacity: 1,
        zIndex: 0,
        minZoom: null,
        maxZoom: null
    },

    initialize: function(options){
        this._graphics = {};
        this._scene = null;
        this._render = null;
        this._containerPane = null;
        this._visible = true;

        options = options || {};
        this.options = Z.Util.applyOptions(this.options, options, false);
    },

    onAdd: function(scene, index, containerPane){
        this.fire("loading");

        if(this._render){
            this._render.onRemove(this._scene);
        }

        var newRender = this._getGraphicLayerRender(scene, this.options);
        this._render = newRender;
        this._scene = scene;
        this._containerPane = containerPane;
        var layerIndex = this._render.onAdd(this, this._scene, index, containerPane);

        for(var key in this._graphics){
            if(this._graphics[key]){
                this._render.addGraphic(this, this._graphics[key]);
            }
        }

        this._scene.refresh();
        this._applyEvents("on");
        this.fire("load");

        return layerIndex;
    },

    onRemove: function(scene){
        this._render.onRemove(this._scene);
        //this._scene.refresh();
        this._scene = null;
        this._render = null;
        this._applyEvents("off");
    },

    show: function(){
        this._render.show();
    },

    hide: function(){
        this._render.hide();
    },

    setOpacity: function(opacity){
        this.options.opacity = opacity;
        this._render.setOpacity(opacity);
    },

    setZIndex: function(zIndex){
        this.options.zIndex = zIndex;
        this._render.setZIndex(zIndex);
    },

    getZIndex: function(){
        return this._render.getZIndex();
    },

    getContainerPane: function(){
        return this._containerPane;
    },

    setZoomRange: function(minZoom, maxZoom){
        this.options.minZoom = ((typeof minZoom) === 'number') ? minZoom : this.options.minZoom;
        this.options.maxZoom = ((typeof maxZoom) === 'number') ? maxZoom : this.options.maxZoom;
        this.refresh();
    },

    refresh: function(){
        this._render.refresh(this.options);
    },

    addGraphic: function(graphic){
        this._addOneGraphic(graphic);
        this._scene.refresh();
    },

    addGraphics: function(graphics){
        graphics = graphics instanceof Array ? graphics : [graphics];

        for(var i = 0; i < graphics.length; i++){
            this._addOneGraphic(graphics[i]);
        }

        this._scene.refresh();
    },

    getGraphics: function(){
        var graphics = [];

        for(var key in this._graphics){
            graphics.push(this._graphics[key]);
        }

        return graphics;
    },

    hasGraphic: function(graphic){
        if(!graphic){
            return false;
        }

        var stamp = Z.Util.stamp(graphic, 'graphic');

        if(this._graphics[stamp]){
            return true;
        }else{
            return false;
        }
    },

    removeGraphic: function(graphic){
        if(graphic instanceof Z.Graphic || graphic instanceof Z.MultiGraphic) {
            var stamp = Z.Util.stamp(graphic, 'graphic');

            if(!this._graphics[stamp]){
                return;
            }

            if(this._render){
                this._render.removeGraphic(this, graphic);
            }

            delete this._graphics[stamp];
            this._scene.refresh();
        }
    },

    clear: function(){
        this._containerPane.removeChild(this._graphicRoot);
        this._graphicRoot.resetRoot();
        this._containerPane.addChild(this._graphicRoot);

        for(var key in this._graphics){
            if(this._graphics[key]){
                delete this._graphics[key];
            }
        }

        this._graphics = {};
        this._scene.refresh();
    },

    latLngToLayerScenePoint: function(latLng){
        if(this._render){
            return this._render.latLngToLayerScenePoint(latLng);
        }else{
            return null;
        }
    },

    getSceneHeight: function(height){
        return this._scene.getSceneDistance(height);
    },

    _getGraphicLayerRender: function(scene, options){
        var render;

        if(scene instanceof Z.Scene2D){
            render = this._getGraphicLayerRender2D(options);
        }else if(scene instanceof Z.Scene3D){
            render = this._getGraphicLayerRender3D(options);
        }

        return render;
    },

    _getGraphicLayerRender2D: function(options){
        return new Z.GraphicLayerRender2D(options);
    },

    _getGraphicLayerRender3D: function(options){
        return new Z.GraphicLayerRender3D(options);
    },

    _applyEvents: function(onOff){
        if (!Z.DomEvent || !this._render) { return; }

        onOff = onOff || 'on';

        var events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover',
                'mouseout', 'mousemove', 'contextmenu'],
            i, len;

        for (i = 0, len = events.length; i < len; i++) {
            this._render[onOff](events[i], this._fireEvent, this);
        }
    },

    _fireEvent: function(e){//console.info(e.type);
        this.fire(e.type, e);
    },

    //_addEvents: function(){
    //    var thisObj = this;
    //    this._scene.on("viewreset", thisObj._refreshGraphics, thisObj);
    //    this._scene.on("zoomlevelschange", thisObj._refreshGraphics, thisObj);
    //    this._scene.on("dragstart", thisObj._onDragStart, thisObj);
    //    this._scene.on("drag", this._onDrag, thisObj);
    //    this._scene.on("dragend", thisObj._onDragEnd, thisObj);
    //},
    //
    //_removeEvents: function(){
    //    var thisObj = this;
    //    this._scene.off("viewreset", thisObj._refreshGraphics, thisObj);
    //    this._scene.off("zoomlevelschange", thisObj._refreshGraphics, thisObj);
    //    this._scene.off("dragstart", thisObj._onDragStart, thisObj);
    //    this._scene.off("drag", this._onDrag, thisObj);
    //    this._scene.off("dragend", thisObj._onDragEnd, thisObj);
    //},
    //
    //_refreshGraphics: function(){
    //    for(var key in this._graphics){
    //        if(this._graphics[key]){
    //            //this._graphics[key].updateFeature(this._graphics[key].feature);
    //            this._graphics[key].refresh();
    //        }
    //    }
    //
    //    this._scene.refresh();
    //},
    //
    //_onDragStart: function(e){
    //    this._dragStartPoint = this._render._graphicRoot.root.position.clone();
    //},
    //
    //_onDrag: function(e){
    //    var sceneObj = this._scene;
    //    var startPoint = sceneObj.screenPointToScenePoint(e.startPoint);
    //    var newPoint = sceneObj.screenPointToScenePoint(e.newPoint);
    //    var delta = newPoint.subtract(startPoint);
    //    this._render._graphicRoot.root.position.x = this._dragStartPoint.x + delta.x;
    //    this._render._graphicRoot.root.position.y = this._dragStartPoint.y + delta.y;
    //    this._render._graphicRoot.root.position.z = this._dragStartPoint.z + delta.z;
    //    this._scene.refresh();
    //},
    //
    //_onDragEnd: function(e){
    //    var sceneObj = this._scene;
    //    var startPoint = sceneObj.screenPointToScenePoint(e.startPoint);
    //    var newPoint = sceneObj.screenPointToScenePoint(e.newPoint);
    //    //var delta = newPoint.subtract(startPoint);
    //    this._render._graphicRoot.root.position.x = this._dragStartPoint.x;
    //    this._render._graphicRoot.root.position.y = this._dragStartPoint.y;
    //    this._render._graphicRoot.root.position.z = this._dragStartPoint.z;
    //
    //    this._dragStartPoint =null;
    //},

    _addOneGraphic: function(graphic){
        if(graphic instanceof Z.Graphic || graphic instanceof Z.MultiGraphic) {
            var stamp = Z.Util.stamp(graphic, 'graphic');

            if(this._graphics[stamp]){
                return;
            }

            if(this._render){
                this._render.addGraphic(this, graphic);
            }

            this._graphics[stamp] = graphic;
        }
    }
});
/**
 * Created by Administrator on 2015/10/30.
 */
Z.BuildingLayer = Z.GraphicLayer.extend({
    buildingOptions:{
        spatialProp:'SHAPE',
        title:{prop:'', value: '', defaultValue:'', fun:null, symbol:null},
        height: {prop:'', value: '', defaultValue:'', fun:null},       //优先级顺序为：fun、prop、value、defaultValue
        baseHeight: {prop:'', value: '', defaultValue:'', fun:null},   //同上
        //baseFloorProp: '',
        //topFloorProp: '',
        //floorHeight: '',
        topColor: '#000fff',
        wallColor: '#ffaa33'
    },

    initialize: function(options){
        options = options || {};
        Z.GraphicLayer.prototype.initialize.call(this, options);
        this.buildingOptions = Z.Util.applyOptions(this.buildingOptions, options, false);

        //this._graphics = {};
        //this._scene = null;
        //this._render = null;
        //this._visible = true;

    },

    loadBuildingsByWKT: function(objects, options){
        if(!(objects instanceof Array)){
            objects = [objects];
        }

        this.buildingOptions = Z.Util.applyOptions(this.buildingOptions, options, false);
        this.options = Z.Util.applyOptions(this.options, options, false);

        var coords, height, baseHeight, objLength = objects.length, graphics = [],
            graphicOptions = this._getGraphicOptions();
        console.info("objLength:" + objLength);
        for(var i = 0; i < objLength; i++){
            coords = this._getShape(objects[i], this.buildingOptions.spatialProp);
            height = this._getHeight(objects[i], this.buildingOptions.height);
            baseHeight = this._getHeight(objects[i], this.buildingOptions.baseHeight);
            var coordsLength = coords.length;

            for(var j = 0; j < coordsLength; j++){
                var geometry = new Z.Extrude(null, coords[j], height, baseHeight),
                    feature = new Z.Feature(objects[i], geometry),
                    symbol = new Z.ExtrudeSymbol({
                        topColor:this.buildingOptions.topColor,
                        wallColor:this.buildingOptions.wallColor
                    }),
                    graphic = new Z.Graphic(feature, symbol, graphicOptions);

                //this.addGraphic(graphic);
                graphics.push(graphic);
            }
        }
        console.info("graphics:" + graphics.length);
        this.addGraphics(graphics);
    },

    //loadBuildingsByGeoJSON: function(objects){
    //
    //},

    _getShape: function(object, spatialProp){
        var coords = object[spatialProp],
            parseResult = Z.WktParser.wkt2Array(coords),
            shapes = [];

        if(parseResult.type === "MultiPolygon"){
            shapes = parseResult.coords;
        }else if(parseResult.type === "Polygon"){
            shapes = [parseResult.coords];
        }

        return shapes;
    },

    _getHeight: function(object, heightOptions){
        var height = 0;
        heightOptions = heightOptions || {};

        if(heightOptions.fun){
            height = heightOptions.fun(object);
        }else if(heightOptions.prop){
            height = object[heightOptions.prop];
        }else if(heightOptions.value !== undefined){
            height = heightOptions.value;
        }else if(heightOptions.defaultValue !== undefined){
            height = heightOptions.defaultValue;
        }

        if(typeof height === "number"){
            return height;
        }else if(typeof height === "string"){
            return parseFloat(height);
        }else{
            return 0;
        }
    },

    _getGraphicOptions: function(){
        var ops = this.buildingOptions.title;

        if(ops){
            return {
                titleProp: ops.prop,
                titleText: ops.fun ? ops.fun() : (ops.value || ops.defaultValue),
                titleSymbol: ops.symbol
            };
        }else{
            return null;
        }
    }
});
/**
 * Created by Administrator on 2015/10/31.
 */
Z.GraphicLayerRender2D = Z.IGraphicLayerRender.extend({
    initialize: function(options){
        this._leafletLayer = this._getGraphicLayer(options);
        this._scene = null;
        this._containerPane = null;
    },

    onAdd: function(graphicLayer, scene, index, containerPane){
        this._scene = scene
        this._containerPane = containerPane;
        scene._leafletMap.addLayer(this._leafletLayer);
    },

    onRemove: function(scene){
        this._scene = null;
        this._containerPane = null;
        scene._leafletMap.removeLayer(this._leafletLayer);
    },

    show: function(){
        throw new Error("show方法尚未实现");
    },

    hide: function(){
        throw new Error("hide方法尚未实现");
    },

    setOpacity: function(opacity){
        throw new Error("setOpacity方法尚未实现");
    },

    getZIndex: function(){
        //throw new Error("getZIndex方法尚未实现");
        return 0;
    },

    setZIndex: function(zIndex){
        //throw new Error("setZIndex方法尚未实现");
    },

    refresh: function(options){
        throw new Error("refresh方法尚未实现");
    },

    addGraphic: function(graphicLayer, graphic){
        if(graphic instanceof Z.Graphic || graphic instanceof Z.MultiGraphic) {
            graphic.onAdd(graphicLayer, this._leafletLayer, this._scene);

            //添加事件
        }
    },

    removeGraphic: function(graphicLayer, graphic){
        if(graphic instanceof Z.Graphic || graphic instanceof Z.MultiGraphic) {
            graphic.onRemove(graphicLayer, this._leafletLayer, this._scene);

            //移除事件
        }
    },

    clear: function(){
        if(this._leafletLayer){
            this._leafletLayer.clearLayers();
        }
    },

    on: function(event, func, scope){
        if(this._leafletLayer){
            this._leafletLayer.on(event, func, scope);
        }
    },

    off: function(event, func, scope){
        if(this._leafletLayer){
            this._leafletLayer.off(event, func, scope);
        }
    },

    _getGraphicLayer: function(options){
        return new L.FeatureGroup();
    },

    _applyEvents: function(onOff){
        var onOff = onOff || 'on',
            i, len, graphics = this._leafletLayer.getLayers();

        //for (i = 0, len = domEvents.length; i < len; i++) {
        //    for(var j = 0; j < graphics.length; j++){
        //        graphics[j][onOff](domEvents[i], thisObj._onMouseEvent, thisObj);
        //    }
        //}
        for (var j = 0; j < graphics.length; j++) {
            this._applyOneGraphicEvents(onOff, graphics[j]);
        }
    },

    _applyOneGraphicEvents: function(onOff, graphic){
        var thisObj = this,
            domEvents = ['dblclick', 'click', 'mousedown', 'mouseup', 'mouseover',
                'mouseout', 'mousemove', 'contextmenu'];

        for (var i = 0, len = domEvents.length; i < len; i++) {
            graphic[onOff](domEvents[i], thisObj._onMouseEvent, thisObj);
        }
    },

    _onMouseEvent: function(e){
        var target = e.target.graphic;

        ////触发图层事件
        //for(var i = 0; i < objs.length; i++){
        //    stamp = Z.Util.stamp(objs[i].graphic, 'graphic');
        //
        //    //提取出属于此图层的graphic对象
        //    if(this._graphicLayer.hasGraphic(objs[i].graphic)){
        //        if(objectSet[stamp]){
        //            continue;         //在三维中，对于组合对象的每个threejs组成对象，都会统计一次，因此会存在重复的情况
        //        }
        //
        //        objectArray[objectArray.length] = objs[i];    //graphic与e中的顺序保持一致：按距离由近及远排序
        //        objectSet[stamp] = objs[i];
        //    }
        //}

        if(target){
            //触发图层的鼠标事件
            this._fireGraphicLayerMouseEvent(e, target);
            //触发要素的鼠标事件
            this._fireOneGraphicEvent(e, target);
        }
    },

    _fireGraphicLayerMouseEvent: function(sceneEvent, graphic){
        this.fire(sceneEvent.type, {
            latlng: sceneEvent.latlng,
            scenePoint: sceneEvent.layerPoint,
            containerPoint: sceneEvent.containerPoint,
            originalEvent: sceneEvent.originalEvent,
            objects: [graphic]
        });
    },

    _fireOneGraphicEvent: function(sceneEvent, graphicObject){
        if(graphicObject){
            graphicObject.fire(sceneEvent.type, {
                latlng: sceneEvent.latlng,
                scenePoint: sceneEvent.layerPoint,
                containerPoint: sceneEvent.containerPoint,
                originalEvent: sceneEvent.originalEvent,
                object: graphicObject
            });
        }
    }
});
/**
 * Created by Administrator on 2015/10/31.
 */
Z.GraphicLayerRender3D = Z.IGraphicLayerRender.extend({
    initialize: function(options){
        //this.options = options;
        this._graphicRoot = new Z.SceneThreePaneItem();
        this._rootLatLng = null;     //图层根对象（threejs的Geometry3D对象）的中心点对应的空间坐标
        this._containerPane = null;
        this._anchor = {
            latLng1: null,     //锚点，作为graphic场景坐标计算的基准，所有graphic的空间坐标转为场景坐标时，均相对于此锚点进行
            latLng2: null,        //不同于锚点的另一定位点，用于计算缩放系数
            scenePoint1: null,
            scenePoint2: null
        };

        this._zIndex;
        this._graphicLayer;
        this._scene;
        this._intersectedObjects = {};
    },

    onAdd: function(graphicLayer, scene, index, containerPane){
        if(!(scene instanceof Z.Scene3D) || !containerPane){
            return;
        }

        this._graphicLayer = graphicLayer;
        var layerIndex = index;

        if(!(typeof layerIndex === "number")){
            layerIndex = containerPane.getMaxChildIndex() + 1;
        }

        this._scene = scene;

        if(containerPane instanceof Z.SceneThreePaneItem){
            //this._graphicRoot.index = layerIndex;
            //containerPane.addChild(this._graphicRoot, layerIndex);
            this._containerPane = containerPane;
            this.setZIndex(layerIndex);
        }

        this._initAnchor();
        this._addEvents();
        //this._reset();
        //this._update();
        //this.setBaseIndex(containerPane.index);
        //this._zIndex = layerIndex;
        //this._setTileZIndex(layerIndex);
        //this._scene.refresh();

        //return containerPane.index + layerIndex;
        return layerIndex;
    },

    onRemove: function(scene){
        //this._reset();
        this._removeEvents();

        if(this._containerPane){
            //this._containerPane.root.remove(this._tileRoot);
            this._containerPane.removeChild(this._graphicRoot);
            this._containerPane = null;
        }

        //this._scene.refresh();
        this._scene = undefined;
    },

    show: function(){
        this._graphicRoot.show();
    },

    hide: function(){
        this._graphicRoot.hide();
    },

    setOpacity: function(opacity){
        if(typeof opacity !== "number"){
            return;
        }

        opacity = Math.min(1, Math.max(opacity, 0));

        var childObjects = this._graphicRoot.root.children;

        for(var i = 0; i < childObjects.length; i++){
            if(childObjects[i].material){
                childObjects[i].material.opacity = opacity;
            }
        }
    },

    setZIndex: function(zIndex){
        if(typeof zIndex !== "number"){
            return;
        }

        this._zIndex = zIndex;
        //this._containerPane.setChildIndex(this._graphicRoot, this._containerPane.index + zIndex);
        this._containerPane.setChildIndex(this._graphicRoot, zIndex);

        /****************************待完善******************************/
        var childObjects = this._graphicRoot.root.children;

        for(var i = 0; i < childObjects.length; i++){
            childObjects[i].renderOrder = this._containerPane.index + zIndex;
        }
        /****************************************************************/
    },

    getZIndex: function(){
        return this._zIndex;
    },

    refresh: function(options){
        throw new Error("refresh方法尚未实现");
    },

    addGraphic: function(graphicLayer, graphic){
        if(graphic instanceof Z.Graphic || graphic instanceof Z.MultiGraphic) {
            graphic.onAdd(graphicLayer, this._graphicRoot, this._scene);
        }
    },

    removeGraphic: function(graphicLayer, graphic){
        if(graphic instanceof Z.Graphic || graphic instanceof Z.MultiGraphic) {
            graphic.onRemove(graphicLayer, this._graphicRoot.root, this._scene);
        }
    },

    clear: function(){
        this._containerPane.removeChild(this._graphicRoot);
        this._graphicRoot.resetRoot();
        this._containerPane.addChild(this._graphicRoot);
    },

    //经纬度坐标转换为此图层的场景坐标（由于图层本身的平移等处理，图层的场景坐标不一定与地图场景坐标一致）
    latLngToLayerScenePoint: function(latLng){
        var sl = this._anchor.scenePoint1,
            s2 = this._anchor.scenePoint2,
            l1 = this._anchor.latLng1,
            l2 = this._anchor.latLng2,
            sceneLatLngRatio = (s2.x - sl.x) / (l2.lng - l1.lng),
            scenePointX = (latLng.lng - l1.lng) * sceneLatLngRatio,
            scenePointY = (latLng.lat - l1.lat) * sceneLatLngRatio,
            alt = Z.Util.isNull(latLng.alt) ? NaN :
                (Z.Util.isNull(l1.alt) ? latLng.alt : (latLng.alt - l1.alt)),
            scenePointZ = this._scene.getSceneDistance(alt);

        return new Z.Point(scenePointX, scenePointY, scenePointZ);
    },

    _addEvents: function(onOff){
        this._applyEvents("on");
    },

    _removeEvents: function(){
        this._applyEvents("off");
    },

    _applyEvents: function(onOff){
        var thisObj = this,
            onOff = onOff || 'on';
        this._scene[onOff]("viewreset", thisObj._onViewReset, thisObj);
        this._scene[onOff]("zoomlevelschange", thisObj._onZoomLevelsChange, thisObj);
        this._scene[onOff]("dragstart", thisObj._onDragStart, thisObj);
        this._scene[onOff]("drag", this._onDrag, thisObj);
        this._scene[onOff]("dragend", thisObj._onDragEnd, thisObj);

        var domEvents = ['dblclick', 'click', 'mousedown', 'mouseup', 'mouseover',
                'mouseout', 'mousemove', 'contextmenu'],
            i, len;

        for (i = 0, len = domEvents.length; i < len; i++) {
            this._scene[onOff](domEvents[i], thisObj._onMouseEvent, thisObj);
        }
    },

    //对于仅仅是浏览范围变化的情况，不再重新计算每个要素的场景坐标
    _onViewReset: function(){
        var graphics = this._graphicLayer.getGraphics();

        for(var i = 0; i < graphics.length; i++){
            graphics[i].refresh();
        }
    },

    _onZoomLevelsChange: function(){
        /***方案一：刷新每一个graphics，重新计算场景坐标***/
        this._refreshAnchor();
        this._repositionRoot();

        var graphics = this._graphicLayer.getGraphics();

        for(var i = 0; i < graphics.length; i++){
            graphics[i].updateFeature(graphics[i].feature);
        }

        this._scene.refresh();

        ///***方案二：直接设置graphicLayer根对象的缩放系数和位置***/
        //var newScenePoint1 = this._scene.latLngToScenePoint(this._anchor.latLng1),
        //    newScenePoint2 = this._scene.latLngToScenePoint(this._anchor.latLng2),
        //    scale = (newScenePoint2.x - newScenePoint1.x) / (this._anchor.scenePoint2.x - this._anchor.scenePoint1.x);
        //
        //this._graphicRoot.root.scale.set(scale, scale, scale);
        //this._graphicRoot.root.position.set(newScenePoint1.x, newScenePoint1.y, newScenePoint1.z);
        //
        //this._scene.refresh();
    },

    _onDragStart: function(e){
        this._dragStartPoint = this._graphicRoot.root.position.clone();
    },

    _onDrag: function(e){
        var sceneObj = this._scene;
        var startPoint = sceneObj.screenPointToScenePoint(e.startPoint);
        var newPoint = sceneObj.screenPointToScenePoint(e.newPoint);
        var delta = newPoint.subtract(startPoint);
        this._graphicRoot.root.position.x = this._dragStartPoint.x + delta.x;
        this._graphicRoot.root.position.y = this._dragStartPoint.y + delta.y;
        this._graphicRoot.root.position.z = this._dragStartPoint.z + delta.z;
        this._scene.refresh();
    },

    _onDragEnd: function(e){
        //var sceneObj = this._scene;
        //var startPoint = sceneObj.screenPointToScenePoint(e.startPoint);
        //var newPoint = sceneObj.screenPointToScenePoint(e.newPoint);
        ////var delta = newPoint.subtract(startPoint);
        //this._graphicRoot.root.position.x = this._dragStartPoint.x;
        //this._graphicRoot.root.position.y = this._dragStartPoint.y;
        //this._graphicRoot.root.position.z = this._dragStartPoint.z;

        this._dragStartPoint =null;
    },

    _onMouseEvent: function(e){
        var objs = e.objects || [], objectArray = [], objectSet = {}, stamp;

        //触发图层事件
        for(var i = 0; i < objs.length; i++){
            stamp = Z.Util.stamp(objs[i].graphic, 'graphic');

            //提取出属于此图层的graphic对象
            if(this._graphicLayer.hasGraphic(objs[i].graphic)){
                if(objectSet[stamp]){
                    continue;         //在三维中，对于组合对象的每个threejs组成对象，都会统计一次，因此会存在重复的情况
                }

                objectArray[objectArray.length] = objs[i];    //graphic与e中的顺序保持一致：按距离由近及远排序
                objectSet[stamp] = objs[i];
            }
        }

        //触发图层的鼠标事件
        this._fireGraphicLayerMouseEvent(e, objectArray);
        //触发每个要素的鼠标事件
        this._fireGraphicsMouseEvent(e, objectSet);

        this._intersectedObjects = objectSet;
    },

    _fireGraphicLayerMouseEvent: function(sceneEvent, graphicArray){
        this.fire(sceneEvent.type, {
            latlng: sceneEvent.latlng,
            scenePoint: sceneEvent.scenePoint,
            containerPoint: sceneEvent.containerPoint,
            originalEvent: sceneEvent.originalEvent,
            objects: graphicArray
        });
    },

    _fireGraphicsMouseEvent: function(sceneEvent, objectSet){
        //相对于上一次鼠标事件，对于鼠标位置已经离开的要素触发mouseout事件
        for(var key in this._intersectedObjects){
            if(!objectSet[key]){
                this._fireOneGraphicEvent("mouseout", sceneEvent, this._intersectedObjects[key]);
            }
        }

        for(var key in objectSet){
            //对新增的触发mouseover事件
            if(!this._intersectedObjects[key]){
                this._fireOneGraphicEvent("mouseover", sceneEvent, objectSet[key]);
            }

            //对于当前鼠标选中的要素触发正常鼠标事件
            this._fireOneGraphicEvent(sceneEvent.type, sceneEvent, objectSet[key]);
        }
    },

    _fireOneGraphicEvent: function(type, sceneEvent, graphicObject){
        if(graphicObject){
            graphicObject.graphic.fire(type, {
                latlng: sceneEvent.latlng,
                scenePoint: sceneEvent.scenePoint,
                containerPoint: sceneEvent.containerPoint,
                originalEvent: sceneEvent.originalEvent,
                object: graphicObject
            });
        }
    },

    _initAnchor: function(){
        var sceneBounds = this._scene.getBounds();

        this._anchor = {
            latLng1: sceneBounds.getCenter(),
            latLng2: sceneBounds.getNorthEast(),        //不同于锚点的另一定位点，用于计算缩放系数
            scenePoint1: new Z.Point(0, 0, 0),
            scenePoint2: this._scene.latLngToScenePoint(sceneBounds.getNorthEast())
        };

        this._initRootLatLng();
    },

    _refreshAnchor: function(){
        var sceneBounds = this._scene.getBounds();

        this._anchor.scenePoint1 = this._scene.latLngToScenePoint(this._anchor.latLng1);
        this._anchor.scenePoint2 = this._scene.latLngToScenePoint(this._anchor.latLng2);
    },

    _initRootLatLng: function(){
        var rootPos = this._graphicRoot.root.position;
        this._rootLatLng = this._scene.scenePointToLatLng(new Z.Point(rootPos.x, rootPos.y, rootPos.z));
    },

    _repositionRoot: function(){
        var rootPos = this._scene.latLngToScenePoint(this._rootLatLng);
        this._graphicRoot.root.position.x = rootPos.x;
        this._graphicRoot.root.position.y = rootPos.y;
        this._graphicRoot.root.position.z = rootPos.z;
    }
});
/**
 * Created by Administrator on 2015/11/4.
 */
Z.ScenePaneItem = Z.Class.extend({
    initialize: function () {
        this.root = this.createRootObject();
        this._children = [];
        //this.parent = null;
        this.index = 0;
    },

    createRootObject: function(){

    },

    addChild: function(item, index){
        if(!(item instanceof this.constructor)){
            return;
        }

        if(typeof index === "number"){
            item.index = index;
        }

        if(item.parent){

        }

        this.addElementToRoot(item.root, item.index);
        //item.parent = this;
        //Z.Util.addToArray(this._children, item, item.index);
        if(this._children.length <= 0){
            this._children.push(item);
        }else{
            for(var i = 0; i < this._children.length; i++){
                if(item.index < this._children[i].index){
                    this._children.splice(i, 0, item);
                    break;
                }
            }

            if(i >= this._children.length){
                this._children.push(item);
            }
        }
    },

    addElementToRoot: function(element, index){

    },

    removeChild: function(item){
        if(!(item instanceof this.constructor)){
            return;
        }

        this.removeElementFromRoot(item.root);
        //item.parent = null;
        Z.Util.removeFromArray(this._children, item);
    },

    removeElementFromRoot: function(element){

    },

    setChildIndex: function(item, index){
        if(typeof index !== "number"){
            return;
        }

        item.index = index;
        this.setElementIndex(this.root, item.root, item.index);
    },

    setElementIndex: function(parent, element, index){

    },

    show: function(){

    },

    hide: function(){

    },

    resetRoot: function(){
        this.root = this.createRootObject();
    },

    getMaxChildIndex: function(){
        var maxIndex = 0;

        for(var i = 0; i < this._children.length; i++){
            if(maxIndex < this._children[i].index){
                maxIndex = this._children[i].index;
            }
        }

        return maxIndex;
    }
    //,
    //
    //getAbsoluteIndex: function(){
    //    var parentIndex = 0;
    //
    //    if(this.parent){
    //        parentIndex = this.parent.getAbsoluteIndex();
    //    }
    //
    //    return parentIndex * 10 + this.index;        //每个item下面的子元素数量控制为10个
    //}
});
/**
 * Created by Administrator on 2015/11/4.
 */
Z.SceneDivPaneItem = Z.ScenePaneItem.extend({
    createRootObject: function(){
        var element = document.createElement("div");
        //element.style.position = "absolute";
        element.className = "zmap-view-pane";

        return element;
    },

    addElementToRoot: function(element, index){
        if(!element){
            return;
        }

        if(this.root.childNodes.length == 0){
            this.root.appendChild(element);
            index = index || 0;
        }else{
            index = Z.Util.limitIndexToArray(this.root.childNodes, index);

            if(index >= this.root.childNodes.length){
                this.root.appendChild(element);
            }else{
                this.root.insertBefore(element, this.root.childNodes[index]);
            }
        }

        element.style.zIndex = index;
    },

    removeElementFromRoot: function(element){
        if(element){
            try{
                this.root.removeChild(element);
            }catch(e){}
        }
    },

    setElementIndex: function(parent, element, index){
        if(Z.Util.isNull(index) || !element){
            return;
        }

        element.style.zIndex = index;
    },

    show: function(){
        this.root.style.display = "block";
    },

    hide: function(){
        this.root.style.display = "none";
    }
});
/**
 * Created by Administrator on 2015/11/4.
 */
Z.SceneThreePaneItem = Z.ScenePaneItem.extend({
    //_objects: [],
    initialize: function(){
        Z.ScenePaneItem.prototype.initialize.call(this, arguments);
        this._objects = [];
    },

    createRootObject: function(){
        return new THREE.Object3D();
    },

    addElementToRoot: function(element, index){
        this._removeObjects(this._objects);
        //Z.Util.addToArray(this._objects, element, index);

        if(this._objects.length <= 0){
            this._objects.push({element:element, index:index});
        }else{
            for(var i = 0; i < this._objects.length; i++){
                if(index < this._objects[i].index){
                    this._objects.splice(i, 0, {element:element, index:index});
                    break;
                }
            }

            if(i >= this._objects.length){
                this._objects.push({element:element, index:index});
            }
        }

        //element.renderOrder = index;
        this._appendObjects(this._objects);
    },

    removeElementFromRoot: function(element){
        this.root.remove(element);
        //Z.Util.removeFromArray(this._objects, element);
        for(var i = this._objects.length - 1; i >=0; i--){
            if(element === this._objects[i].element){
                this._objects.splice(i, 1);
            }
        }
    },

    setElementIndex: function(parent, element, index){
        this.removeElementFromRoot(element);
        this.addElementToRoot(element, index);
    },

    show: function(){
        this.root.visible = true;
    },

    hide: function(){
        this.root.visible = false;
    },

    _removeObjects: function(objects){
        for(var i = 0; i < objects.length; i++){
            this.root.remove(objects[i].element);
        }
    },

    _appendObjects: function(objects){
        for(var i = 0; i < objects.length; i++){
            this.root.add(objects[i].element);
        }
    }
});
/**
 * Created by Administrator on 2015/11/20.
 */
Z.LayerGroup = {};

Z.LayerGroup.BaseBgLayer = 1;
Z.LayerGroup.BaseOverLayer = 2;
Z.LayerGroup.BusinessLayer = 3;
/**
 * Created by Administrator on 2015/11/4.
 */
Z.MapContentFrame = function(container){
    this.basePane;
    this.layerPane;
    this.defaultGraphicPane;
    this.baseBgPane;
    this.baseOverPane;
    this.rootPane;
    this._container = container;
    this.initialize();
};

Z.MapContentFrame.prototype = {
    initialize: function () {
        this.rootPane = new Z.SceneThreePaneItem();
        this.basePane = new Z.SceneThreePaneItem();
        this.layerPane = new Z.SceneThreePaneItem();
        this.defaultGraphicPane = new Z.SceneThreePaneItem();
        this.baseBgPane = new Z.SceneThreePaneItem();
        this.baseOverPane = new Z.SceneThreePaneItem();

        this._initLayout();

    },

    _initLayout: function(){
        if(this._container){
            this.rootPane.root = this._container;
        }

        //所有的index均为全局绝对index，不支持层层嵌套的相对index计算
        this.rootPane.addChild(this.basePane, 1);
        //this.rootPane.addChild(this.layerPane, 4);
        this.rootPane.addChild(this.defaultGraphicPane, 5);

        this.basePane.addChild(this.baseBgPane, 2);
        this.basePane.addChild(this.baseOverPane, 3);
        this.basePane.addChild(this.layerPane, 4);
    }
}
/**
 * Created by Administrator on 2015/11/4.
 */
Z.SceneViewFrame = function(container){
    this.controlPane;
    this.popupPane;
    this.mapPane;
    this.rootPane;
    this._container = container;
    this.initialize();
};

Z.SceneViewFrame.prototype = {
    initialize: function () {
        this.rootPane = new Z.SceneDivPaneItem();
        this.controlPane = new Z.SceneDivPaneItem();
        this.popupPane = new Z.SceneDivPaneItem();
        this.mapPane = new Z.SceneDivPaneItem();

        this._initLayout();
    },

    _initLayout: function(){
        if(!this._container){
            return;
        }

        this.rootPane.root = this._container;
        this.rootPane.addChild(this.mapPane, 0);
        this.rootPane.addChild(this.popupPane, 1);
        this.rootPane.addChild(this.controlPane, 2);
    }
}
/**
 * Created by Administrator on 2015/11/3.
 */
Z.SceneRender3D = function(container, options){
    this._container = container;

    if(!container){
        throw new error("Z.SceneRender3D对象创建失败：container参数不能为空");
    }

    this._initialized = false;
    this._objects = [];
    this._cameraObject = null;
    this._rawCameraObject = null,
    this._radRotation = null,
    this._ambientLightObject = null;
    this._lightObject = null;
    this._reverseLightObject = null;      //与主光源方向相反的光，使各个阴暗面之间也产生明暗差异，若不加则各个阴暗面为同一颜色，难以区分。光的颜色与环境光保持一致
    this._sceneObject = null;
    this._renderObject = null;
    this._xyPlane = null;            //xy平面（z=0），用于计算地面中哪些部分显示在视域中
    this.options = {
        width:400,
        height:400,
        bgColor: '#000000',
        ambientColor:'#333333',
        lightColor:'#aaaaaa',
        lightIntensity: 1,
        //lightPosition: {x:10, y: 8, z: 6},
        lightAngle: {h:30, v:45},
        //lightDistance: 200,
        fogColor:'#f2f7ff',
        cameraFov: 45,    //相机视场,单位为角度
        cameraNear: 1,  //相机近面
        cameraFar: 100,   //相机远面
        cameraPosition: {x: 0, y: 0, z:50},
        cameraRotation:{x:0, y: 0, z: 0},
        cameraTarget:{x:0, y: 0, z: 0}
    };

    Z.Util.applyOptions(this.options, options, false);
    this.initialize();

};

Z.SceneRender3D.prototype = {
    initialize: function () {
        this._cameraObject = new THREE.PerspectiveCamera(this.options.cameraFov,
            this.options.width/this.options.height, this.options.cameraNear,
            this.options.cameraFar);
        //this._cameraAnchorGroup = new THREE.Group();
        ////this._cameraAnchorGroup.visible = false;
        //this._cameraAnchor = new THREE.Object3D();//new THREE.Mesh(new THREE.SphereGeometry( 1, 32, 32), new THREE.MeshBasicMaterial( {color: 0xffff00} ));
        ////this._cameraAnchor.visible = false;
        //this._cameraAnchorGroup.add(this._cameraObject);
        //this._radRotation = new THREE.Vector3(0,0,0);
        this._initCameraPosition();
        this.rotateByEuler(this.options.cameraRotation);

        this._ambientLightObject = new THREE.AmbientLight(this.options.ambientColor);
        this._lightObject = new THREE.DirectionalLight(this.options.lightColor, this.options.lightIntensity);
        this._reverseLightObject = new THREE.DirectionalLight(this.options.ambientColor, this.options.lightIntensity);
        this.setLightPosition(this.options.lightAngle);
        this.setLightShadow();


        this._sceneObject = new THREE.Scene();
        //this._sceneObject.add(this._cameraAnchorGroup);
        this._sceneObject.add(this._ambientLightObject);
        this._sceneObject.add(this._lightObject);
        this._sceneObject.add(this._reverseLightObject);

        this._xyPlane = this._createXYPlane(this.options.cameraFov,
            this.options.cameraFar, this.options.width/this.options.height);
        this._sceneObject.add(this._xyPlane);

        this._renderObject = new THREE.WebGLRenderer({antialias: true, alpha: true});
        //this._renderObject.fog = new THREE.Fog( this.options.fogColor, this._cameraObject.near, this._cameraObject.far);
        this._renderObject.sortObjects = false;
        this._renderObject.setClearColor(this.options.bgColor);
        //取消双面绘制
        this._renderObject.setFaceCulling(false);

        if(window.devicePixelRatio){
            this._renderObject.setPixelRatio( window.devicePixelRatio);
        }

        this._renderObject.setSize(this.options.width, this.options.height);
        this._renderObject.shadowMapEnabled = true;
        this._container.appendChild(this._renderObject.domElement);
        this._initialized = true;
    },

    render: function () {
        if(!this._initialized){
            this.initialize();
            this._initialized = true;
        }

        //this._renderObject.setClearColor(this.options.bgColor);
        this._renderObject.clear();

        try{
            //requestAnimationFrame()
            this._renderObject.render(this._sceneObject, this._cameraObject);
        }catch(e){
            console.error(e.message);
        }
    },

    resize: function(width, height){
        if(!width || !height){
            width = this._container.clientWidth;
            height = this._container.clientHeight;
        }

        this.options.width = width;
        this.options.height = height;
        this._renderObject.setSize(width, height);
        //this.render();
    },

    getSize: function(){
        return Z.Point.create(this.options.width, this.options.height);
    },

    resetCamera: function(){
        this._cameraObject = this._rawCameraObject.clone();
    },

    /*参数rotate为相对于当前位置的旋转角，单位为弧度*/
    rotateByRad: function(rotate){
        if(rotate && (typeof rotate.x === "number") && (typeof rotate.y === "number") && (typeof rotate.z === "number")){
            var matrix = this._getRotationMatrix(rotate, this.options.cameraRotation),
                translate = new THREE.Vector3(),
                quaternion = new THREE.Quaternion(),
                scale = new THREE.Vector3();
            matrix.decompose(translate, quaternion, scale);
            //this.resetCamera();
            this._cameraObject.position.applyMatrix4(matrix);
            this._cameraObject.up.applyQuaternion(quaternion);
            //this._radRotation.set(rotate.x, rotate.y, rotate.z);
            this._cameraObject.lookAt(new THREE.Vector3(this.options.cameraTarget.x, this.options.cameraTarget.y, this.options.cameraTarget.z));
            //alert("rotation:" + this._cameraObject.rotation.x * 180 / Math.PI + "," + this._cameraObject.rotation.y * 180 / Math.PI + "," + this._cameraObject.rotation.z * 180 / Math.PI
            //    + ";up:" + this._cameraObject.up.x + "," + this._cameraObject.up.y + "," + this._cameraObject.up.z);
        }
    },

    //setRotationByEuler: function(rotate){
    //    if(rotate && (typeof rotate.x === "number") && (typeof rotate.y === "number") && (typeof rotate.z === "number")) {
    //        rotate.x = rotate.x * Math.PI / 180;
    //        rotate.y = rotate.y * Math.PI / 180;
    //        rotate.z = rotate.z * Math.PI / 180;
    //
    //        this.setRotationByRad(rotate);
    //    }
    //},

    /*参数rotate为相对于当前位置的旋转角，单位为度*/
    rotateByEuler: function(rotate){
        if(rotate && (typeof rotate.x === "number") && (typeof rotate.y === "number") && (typeof rotate.z === "number")){
            //rotate.x = this._radRotation.x + rotate.x * Math.PI / 180;
            //rotate.y = this._radRotation.y + rotate.y * Math.PI / 180;
            //rotate.z = this._radRotation.z + rotate.z * Math.PI / 180;

            rotate.x = rotate.x * Math.PI / 180;
            rotate.y = rotate.y * Math.PI / 180;
            rotate.z = rotate.z * Math.PI / 180;

            this.rotateByRad(rotate);
        }
    },

    //translateByGL: function(distance){
    //    if(distance && (typeof distance.x === "number") && (typeof distance.y === "number") && (typeof distance.z === "number")){
    //        var sceneChildrenLength = this._sceneObject.children.length;
    //
    //        for(var i = 0; i < sceneChildrenLength; i++){
    //            if(this._sceneObject.children[i] === this._lightObject ||
    //                this._sceneObject.children[i] === this._ambientLightObject ||
    //                this._sceneObject.children[i] === this._xyPlane){
    //                continue;
    //            }
    //
    //            this._sceneObject.children[i].position.x += distance.x;
    //            this._sceneObject.children[i].position.y += distance.y;
    //            this._sceneObject.children[i].position.z += distance.z;
    //        }
    //    }
    //},
    //
    //translateByPixel: function(src, target){
    //    var srcGLPoint = this.screenPointToWebGL(src);
    //    var targetGLPoint = this.screenPointToWebGL(target);
    //    var distance = new Z.Point(targetGLPoint.x - srcGLPoint.x, targetGLPoint.y - srcGLPoint.y, targetGLPoint.z - srcGLPoint.z);
    //
    //    this.translateByGL(distance);
    //},

    /**
     *
     * @param lightAngle     {h:h, v:v}   h：水平方位角（与x轴正方向夹角，逆时针方向），v：与x、y平面的夹角
     */
    setLightPosition: function(lightAngle){
        if(!lightAngle){
            return;
        }

        var lightDistance = this._getLightDistance();
        var lightPosition = this._getLightPosition(lightAngle, lightDistance);
        //lightPosition = lightPosition || this.options.lightPosition;
        this._lightObject.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
        this._reverseLightObject.position.set(-lightPosition.x, -lightPosition.y, -lightPosition.z);
    },

    setLightShadow: function(){
        var lightDistance = this._getLightDistance() * 2;
        this._lightObject.castShadow = true;
        this._lightObject.shadowCameraNear = 0.1;
        this._lightObject.shadowCameraFar = lightDistance;//500;
        this._lightObject.shadowCameraLeft = -lightDistance;//-500;
        this._lightObject.shadowCameraRight = lightDistance;//500;
        this._lightObject.shadowCameraTop = lightDistance;//500;
        this._lightObject.shadowCameraBottom = -lightDistance;//-500;
        this._lightObject.shadowMapWidth = 5120;
        this._lightObject.shadowMapHeight = 5120;
        //this._lightObject.shadowCameraVisible = true;
    },

    setAmbientColor: function(ambientColor){
        this._sceneObject.remove(this._ambientLightObject);
        this._ambientLightObject = new THREE.AmbientLight(ambientColor);
        this._sceneObject.add(this._ambientLightObject);
        //this.render();
    },

    setLightColor: function(lightColor){
        this._sceneObject.remove(this._lightObject);
        this._lightObject = new THREE.Light(lightColor);
        this._sceneObject.add(this._lightObject);
        //this.render();
    },

    setBgColor: function(bgColor){
        this.options.bgColor = bgColor;
        //this.render();
    },

    /*将三维对象添加到场景中。此处未做重复对象监测，允许同一对象反复添加，每次添加都视为一个不同的对象*/
    addObject: function(object, index){
        this._addObject(object, index);
        //this.render();
    },

    removeObject: function(object){
        this._removeObject(object);
        //this.render();
    },

    reorderObject: function(object, index){
        this._removeObject(object);
        this._addObject(object, index);
        //this.render();
    },

    //屏幕坐标转换为webgl坐标（计算与xy平面的交点）
    screenPointToWebGL: function(screenPoint){
        if(!screenPoint || Z.Util.isNull(screenPoint.x) || Z.Util.isNull(screenPoint.y)){
            return null;
        }

        var halfWidth = this.options.width / 2,
            halfHeight = this.options.height / 2,
            raycaster = new THREE.Raycaster(),
            vector = new THREE.Vector2((screenPoint.x - halfWidth) / halfWidth, (halfHeight - screenPoint.y) / halfHeight);      //视平面的x和y坐标范围都是-1到1，左手系
        var intersetPoint = this._getIntersectPoint(raycaster, this._xyPlane, vector, this._cameraObject);

        if(intersetPoint){
            return Z.Point.create(intersetPoint.x, intersetPoint.y, intersetPoint.z);
        }else{
            return null;
        }
    },

    //WebGL坐标（世界坐标）转换为屏幕坐标
    webGLPointToScreen: function(glPoint){
        if(!glPoint || Z.Util.isNull(glPoint.x) || Z.Util.isNull(glPoint.y) || Z.Util.isNull(glPoint.z)){
            return null;
        }

        var world_vector = new THREE.Vector3(glPoint.x, glPoint.y, glPoint.z);
        var vector = world_vector.project(this._cameraObject);

        var halfWidth = this.options.width / 2;
        var halfHeight = this.options.height / 2;

        return {
            x: Math.round(vector.x * halfWidth + halfWidth),
            y: Math.round(-vector.y * halfHeight + halfHeight)
        };
    },

    /*垂直俯视且无z轴旋转情况下在z=0平面上的正射范围（世界坐标）*/
    getOrthoGLBounds: function(){
        var distance = new THREE.Vector3(this.options.cameraPosition.x,
            this.options.cameraPosition.y,
            this.options.cameraPosition.z).length();

        var halfHeight = distance * Math.tan(Math.PI * this._cameraObject.fov / (2 * 180));
        var halfWidth = halfHeight * this.options.width / this.options.height;
        var topLeft = new Z.Point(this.options.cameraPosition.x - halfWidth, this.options.cameraPosition.y + halfHeight);
        var bottomRight = new Z.Point(this.options.cameraPosition.x + halfWidth, this.options.cameraPosition.y - halfHeight);

        return Z.GLBounds.create(topLeft, bottomRight);
    },

    /*当前z=0平面的可视范围（世界坐标）*/
    getVisibleGLBounds: function(){
        var raycaster = new THREE.Raycaster();

        //_getIntersectPoint: function(raycaster, targetGeometry, viewPoint, camera){
        var leftUp = this._getIntersectPoint(raycaster, this._xyPlane, new THREE.Vector2(-1, 1), this._cameraObject);
        var leftBottom = this._getIntersectPoint(raycaster, this._xyPlane, new THREE.Vector2(-1, -1), this._cameraObject);
        var rightUp = this._getIntersectPoint(raycaster, this._xyPlane, new THREE.Vector2(1, 1), this._cameraObject);
        var rightBottom = this._getIntersectPoint(raycaster, this._xyPlane, new THREE.Vector2(1, -1), this._cameraObject);
        var points = [leftUp, leftBottom, rightBottom, rightUp];

        //xy平面与近面或远面相交
        if(!leftUp || !leftBottom || !rightUp || !rightBottom){
            var planeBsp = new ThreeBSP(this._xyPlane);
            var cameraBoxBsp = new ThreeBSP(this._getCameraBox(this._cameraObject));
            var intersect = planeBsp.intersect(cameraBoxBsp).toGeometry();
            //this._sceneObject.add(new THREE.Mesh(intersect, new THREE.MeshBasicMaterial({color:'#555555'})));
            var intersetVertex = intersect.vertices;

            for(var i = 0; i < intersetVertex.length; i++){
                points.push(intersetVertex[i]);
            }
        }

        return Z.Util.getVectorBounds(points);
    },

    getMaxAnisotropy: function(){
        return this._renderObject.getMaxAnisotropy();
    },

    getRotateByRad: function(){
        var qua = this._cameraObject.quaternion.clone();

        return {
            x: qua.x,
            y: qua.y,
            z: qua.z,
            w: qua.w
        };
    },

    getIntersectObjects: function(screenPoint){
        var halfWidth = this.options.width / 2,
            halfHeight = this.options.height / 2,
            raycaster = new THREE.Raycaster(),
            vector = new THREE.Vector2((screenPoint.x - halfWidth) / halfWidth, (halfHeight - screenPoint.y) / halfHeight);

        raycaster.setFromCamera( vector, this._cameraObject);
        var intersects = raycaster.intersectObjects( this._sceneObject.children, true),
            graphics = [], j = 0;

        for ( var i = 0; i < intersects.length; i++ ) {
            if(intersects[i].object._graphicObj){
                graphics[j] = {
                    graphic: intersects[i].object._graphicObj,
                    details: intersects[i]
                };
                j++;
            }
        }

        return graphics;
    },

    _initCameraPosition: function(){
        this._cameraObject.position.x = this.options.cameraPosition.x;
        this._cameraObject.position.y = this.options.cameraPosition.y;
        this._cameraObject.position.z = this.options.cameraPosition.z;
        this._cameraObject.lookAt(new THREE.Vector3(this.options.cameraTarget.x, this.options.cameraTarget.y, this.options.cameraTarget.z));
        this._rawCameraObject = this._cameraObject.clone();
    },

    _getLightPosition: function(lightAngle, lightDistance){
        if(!lightAngle){
            return null;
        }

        lightDistance = lightDistance || 1;
        var xyProject =   lightDistance * Math.cos(lightAngle.v * Math.PI / 180),
            x = xyProject * Math.cos(lightAngle.h * Math.PI / 180),
            y = xyProject * Math.sin(lightAngle.h * Math.PI / 180),
            z = lightDistance * Math.sin(lightAngle.v * Math.PI / 180);

        return {x:x, y: y, z: z};
    },

    _getLightDistance: function(){
        var halfHeight = this._cameraObject.far * Math.tan(Math.PI * this._cameraObject.fov/(2 * 180));
        var edgeLength = this._cameraObject.far / Math.cos(Math.PI * this._cameraObject.fov/(2 * 180));
        var distance = Math.max(halfHeight * 2, edgeLength) * 1.1;    //适度放大，确保平面大于视域范围

        return distance;
    },

    _getRotationMatrix: function(rotation, rawRotation){
        //var rad = Math.PI / 180,
        //    x_r = rawRotation.x + rotation.x * rad,
        //    y_r = rawRotation.y + rotation.y * rad,
        //    z_r = rawRotation.z + rotation.z * rad;
        var x_r = rawRotation ? (rawRotation.x * Math.PI / 180 + rotation.x) : rotation.x,
            y_r = rawRotation ? (rawRotation.y * Math.PI / 180 + rotation.y) : rotation.y,
            z_r = rawRotation ? (rawRotation.z * Math.PI / 180 + rotation.z) : rotation.z,
            m = new THREE.Matrix4(),
            m1 = new THREE.Matrix4(),
            m2 = new THREE.Matrix4(),
            m3 = new THREE.Matrix4();

        m1.makeRotationX( x_r );
        m2.makeRotationY( y_r );
        m3.makeRotationZ( z_r );

        m.multiplyMatrices( m1, m2 );
        m.multiply( m3 );

        return m;
    },

    _createXYPlane: function(cameraFov, cameraHeight, WHRatio){
        var halfHeight = cameraHeight * Math.tan(Math.PI * cameraFov/(2 * 180));
        var edgeLength = cameraHeight / Math.cos(Math.PI * cameraFov/(2 * 180));
        var height = Math.max(halfHeight * 2, edgeLength) * 2;    //适度放大，确保平面大于视域范围
        var width = height * WHRatio;
        var plane = new THREE.PlaneGeometry(width, height);
        var meterial = new THREE.MeshBasicMaterial({color:'#ffffff'});//var meterial = new THREE.MeshBasicMaterial({color:'#888800'});
        meterial.polygonOffset = true;
        meterial.polygonOffsetFactor = -1;
        meterial.polygonOffsetUnits = -1;
        var mesh = new THREE.Mesh(plane, meterial);
        mesh.visible = false;
        return mesh;
    },

    _addObject: function(object, index){
        this._removeFromScene(this._objects);
        Z.Util.addToArray(this._objects, object, index);
        this._appendToScene(this._objects);
    },

    _removeFromScene: function(objects){
        var length = objects.length;

        for(var i = 0; i < length; i++){
            this._sceneObject.remove(objects[i]);
        }
    },

    _appendToScene: function(objects){
        var length = objects.length;

        for(var i = 0; i < length; i++){
            this._sceneObject.add(objects[i]);
        }
    },

    _removeObject: function(object){
        var _object = (object instanceof Array) ? object: [object];
        this._removeFromScene(_object);
        Z.Util.removeFromArray(this._objects, object);
    },

    _getIntersectPoint: function(raycaster, targetGeometry, viewPoint, camera){
        raycaster.setFromCamera( viewPoint, camera );
        var intersects = raycaster.intersectObjects( this._sceneObject.children );

        for ( var i = 0; i < intersects.length; i++ ) {
            if(intersects[i].object === targetGeometry){
                return intersects[i].point;        //point为世界坐标
            }
        }

        return null;
    },

    //获得相机可视区域的外围框（凌锥形）
    _getCameraBox: function(camera){
        var viewPortVertex = [[-1,1,-1], [-1,-1,-1], [1,-1,-1], [1,1,-1],
            [-1,1,1], [-1,-1,1], [1,-1,1], [1,1,1]],
        //var viewPortVertex = [[-0.5,0.5,-0.5], [-0.5,-0.5,-0.5], [0.5,-0.5,-0.5], [0.5,0.5,-0.5],
        //        [-0.5,0.5,0.5], [-0.5,-0.5,0.5], [0.5,-0.5,0.5], [0.5,0.5,0.5]],
        //var viewPortVertex = [[-1,1,-0.5], [-1,-1,-0.5], [1,-1,-0.5], [1,1,-0.5],
        //    [-1,1,0.5], [-1,-1,0.5], [1,-1,0.5], [1,1,0.5]],
            worldVertex = [],
            vector,
            vertexLength = viewPortVertex.length;

        for(var i = 0; i < vertexLength; i++){
            vector = new THREE.Vector3(viewPortVertex[i][0], viewPortVertex[i][1], viewPortVertex[i][2]);
            worldVertex[i] = vector.unproject(camera);
        }

        return new THREE.ConvexGeometry(worldVertex);
    }
}
/**
 * Created by Administrator on 2015/10/29.
 */
Z.Scene2D = Z.IScene.extend({
    initialize: function(container, options){
        this._leafletMap = this._getLeafletMap(container, options);
        this.options = options;
        this._contentFrame = new Z.MapContentFrame();
    },

    getBounds: function(){
        var leafletBounds = this._leafletMap.getBounds();
        return Z.LeafletUtil.latLngBoundsFromLeaflet(leafletBounds);
    },

    getPixelSceneRatio: function(){
        return new Z.Point.create(1, 1);
    },

    getLatLngSceneRatio: function(){
        var orthoLatLngBounds = this.getBounds(),
            size = this.getSize(),
            widthRatio = (orthoLatLngBounds.getEast() - orthoLatLngBounds.getWest()) / size.x,
            heightRatio = (orthoLatLngBounds.getNorth() - orthoLatLngBounds.getSouth()) / size.y;

        return new Z.Point.create(widthRatio, heightRatio);
    },

    setZoom: function(zoomLevel){
        this._leafletMap.setZoom(zoomLevel);
    },

    getZoom: function(){
        return this._leafletMap.getZoom();
    },

    getScale: function(zoom){
        throw new error("尚未实现");
    },

    getSize: function(){
        var leafletSize = this._leafletMap.getSize();

        return new Z.Point(leafletSize.x, leafletSize.y);
    },

    panTo: function(center, zoomLevel){
        var leafLetCenter = Z.LeafletUtil.latLngToLeaflet(center);
        this._leafletMap.panTo(leafLetCenter, zoomLevel);
    },

    panBy: function(x, y){   //Z.Point
        var offsetX = x === undefined ? 0 : x,
            offsetY = y === undefined ? 0 : y;

        if(x === 0 && y === 0){
            return;
        }

        var panDistance = L.latLng(x, y);
        this._leafletMap.panBy(panDistance);

        this.fire("viewreset");
    },

    getContentBounds: function(){
        return this.getBounds();
    },

    latLngToScreenPoint: function(latLng){
        var mapBounds = this.getBounds(),
            mapWidth = mapBounds.getEast()  -  mapBounds.getWest(),
            mapHeight = mapBounds.getNorth()  -  mapBounds.getSouth(),
            containerSize = this._leafletMap.getSize();
        var x = containerSize.x * (latLng.lng - mapBounds.getWest())/mapWidth;
        var y = containerSize.y * (mapHeight - latLng.lat + mapBounds.getSouth())/mapHeight;

        return Z.Point.create(x, y);
    },

    screenPointToLatLng: function(point){
        var mapBounds = this.getBounds(),
            mapWidth = mapBounds.getEast()  -  mapBounds.getWest(),
            mapHeight = mapBounds.getNorth()  -  mapBounds.getSouth(),
            containerSize = this._leafletMap.getSize();
        var x = mapBounds.getWest() + mapWidth * point.x/containerSize.x;
        var y = mapBounds.getSouth() + mapHeight * (containerSize.y - point.y)/containerSize.y;

        return Z.LatLng.create(y, x);
    },

    addLayer: function(layer, index, layerGroup){
        if(!(layer instanceof Z.ILayer)){
            return;
        }

        var containerPane = null;

        if(layerGroup === Z.LayerGroup.BaseBgLayer){
            containerPane = this._contentFrame.baseBgPane;
        }else if(layerGroup === Z.LayerGroup.BaseOverLayer){
            containerPane = this._contentFrame.baseOverPane;
        }else{
            containerPane = this._contentFrame.layerPane;
        }

        layer.onAdd(this, index, containerPane);

        this.fire('layeradd', { layer: layer });
    },

    removeLayer: function(layer){
        if(!(layer instanceof Z.ILayer)){
            return;
        }

        layer.onRemove(this);

        this.fire('layerremove', { layer: layer });
    },

    openPopup: function(popup){
        popup.openOn(this);
    },

    closePopup: function(popup){
        popup.close();
    },

    addControl: function(control){
        control.onAdd(this);
    },

    removeControl: function(control){
        control.onRemove(this);
    },

    refresh: function(){
        //对dom的更改自动生效，无需手工刷新
    },

    setSunLight: function(color){
        console.info("二维地图不支持设置太阳光照");
    },

    setAmbientLight: function(color){
        console.info("二维地图不支持设置环境光");
    },

    rotateByEuler: function(rotate){
        console.info("二维地图不支持旋转");
    },

    resetRotate: function(){
        console.info("二维地图不支持旋转");
    },

    getRotateByRad: function(){
        console.info("二维地图不支持旋转");
    },

    _getLeafletMap: function(container, sceneOptions){
        var leafletOptions = this._getLeafletOptions(sceneOptions);
        leafletOptions.crs = this._getLeafletCRS(sceneOptions.crs, sceneOptions);
        var zoomCtrlType = null;

        if (sceneOptions.sceneConfig.zoomSlider) {
            zoomCtrlType = sceneOptions.sceneConfig.zoomSlider.toLowerCase();

            if (zoomCtrlType === "small") {
                leafletOptions.zoomControl = true;
            } else {
                leafletOptions.zoomControl = false;
            }
        }

        var map = L.map(container, leafletOptions);

        if (zoomCtrlType == "slider") {
            map.addControl(new L.Control.Zoomslider()) ;
        }

        return map;
    },

    _getLeafletOptions: function(sceneOptions){
        return {
            center: sceneOptions.center ? L.latLng(sceneOptions.center.lat, sceneOptions.center.lng) : L.latLng(118, 32),
            zoom:sceneOptions.initZoom ? sceneOptions.initZoom : undefined,
            layers:undefined,
            minZoom:sceneOptions.minZoom ? sceneOptions.minZoom : undefined,
            maxZoom:sceneOptions.maxZoom ? sceneOptions.maxZoom : maxZoom,
            maxBounds:sceneOptions.maxBounds ?
                L.latLngBounds(
                    L.latLng(sceneOptions.maxBounds.miny, sceneOptions.maxBounds.minx),
                    L.latLng(sceneOptions.maxBounds.maxy, sceneOptions.maxBounds.maxx)) : undefined,
            crs:undefined
        };
    },

    _getLeafletCRS: function(crs, sceneOptions){
        crs = crs ? (crs.code ? crs.code.toLowerCase() : (crs + "").toLowerCase()) : "epsg3857";

        if (crs === "epsg3857") {
            crs = L.CRS.EPSG3857;
        }else if(crs === "epsg4326"){
            crs = L.CRS.EPSG4326;
        }else if(crs === "simple"){
            crs = L.CRS.Simple;
        } else if (crs === "perspective") {
            crs = L.CRS.Perspective.clone();

            if (sceneOptions.levelDefine) {
                crs.origin = new L.LatLng(90, -180);
                crs.levelDefine = sceneOptions.levelDefine;
            }
        } else {
            crs = L.CRS.CustomLevel.clone();

            if (sceneOptions.levelDefine) {
                crs.origin = new L.LatLng(90, -180);
                crs.levelDefine = sceneOptions.levelDefine;
            }
        }

        return crs;
    }
});
/**
 * Created by Administrator on 2015/10/29.
 */
Z.Scene3D = Z.IScene.extend({
    initialize: function(container, options){
        //属性定义
        this._container = container;               //渲染容器
        this._containerWidth = container ? container.clientWidth : 400;
        this._containerHeight = container ? container.clientHeight : 400;
        this._rotation = {x:90, y: 90, z:-180};//初始旋转角
        this._bgColor = '#000000';            //背景颜色
        this._ambientLight = "#333333";      //环境光颜色
        this._sunLight = "#aaaaaa";           //太阳光颜色
        this._sunIntensity = 0.8;              //太阳光强度。取值范围在0-1之间
        this._sunHeight = {h: 30, v: 45};      //太阳高度角,h为水平方向，v为垂直方向
        this._sceneRender = null;              //场景渲染器
        this._viewFrame = null;                //各显示面板框架架构
        this._contentFrame = null;             //地图内容框架结构
        //this._latLngBounds = null;             //正射经纬度范围
        //this._latLngCenter = null;             //正射经纬度中心点
        //this._viewableLatLngBounds = null;   //可见的经纬度范围
        //this._orthoGLBounds = null;           //正射视角时的webgl场景范围
        //this._viewableGLBounds = null;        //可见范围的webgl场景范围
        this._level = null;                     //当前缩放级别
        this._dragger = null;                   //
        this._pyramidModel = null;             //金字塔模型

        //属性初始化
        this.options = options;
        this._latLngBounds = options.bounds.clone();
        this._viewableLatLngBounds = options.bounds.clone();
        this._latLngCenter = options.center.clone();
        this._level = options.initZoom;
        this._viewFrame = new Z.SceneViewFrame(container);
        this._sceneRender = new Z.SceneRender3D(this._viewFrame.mapPane.root, this._getRenderOptions(container, options));
        this._contentFrame = new Z.MapContentFrame();
        this._sceneRender.addObject(this._contentFrame.rootPane.root);

        this._sceneRender.render();
        this._initPyramidModel(options);
        this._initEvents();
        this._enableDrag();

        this._orthoGLBounds = this._sceneRender.getOrthoGLBounds();
        this._viewableGLBounds = this._sceneRender.getVisibleGLBounds();

        this.fire("load");
    },

    getBounds: function(){
        return this._latLngBounds.clone();
    },

    setZoom: function(zoomLevel){
        if(this._level === zoomLevel){
            return;
        }

        var scale = this._pyramidModel.getScale(zoomLevel),
            curScale = this._pyramidModel.getScale(this._level),
            latLngWidth = this._latLngBounds.getEast() - this._latLngBounds.getWest(),
            latLngHeight = this._latLngBounds.getNorth() - this._latLngBounds.getSouth(),
            newLatLngWidth = latLngWidth * scale/curScale,
            newLatLngHeight = latLngHeight * scale/curScale,
            newLatLngBounds = Z.LatLngBounds.create(
                [this._latLngCenter.lat - newLatLngHeight/ 2, this._latLngCenter.lng - newLatLngWidth/ 2],
                [this._latLngCenter.lat + newLatLngHeight/ 2, this._latLngCenter.lng + newLatLngWidth/ 2]);

        this._updateSceneStatus(this._latLngCenter, newLatLngBounds);
        var oldLevel = this._level;
        this._level = zoomLevel;

        this.fire("zoomlevelschange", {oldLevel: oldLevel, newLevel: zoomLevel});
    },

    getZoom: function(){
        return this._level;
    },

    getScale: function(zoom){
        if(zoom === undefined){
            zoom = this._level;
        }

        return this._pyramidModel.getScale(zoom);
    },

    getSize: function(){
        return this._sceneRender.getSize();
    },

    panTo: function(center, zoomLevel){
        if(!(center instanceof Z.LatLng)){
            return;
        }

        var delta = this._latLngBounds.getCenter().subtract(center),
            newLatLngBounds = this._latLngBounds.translate(-delta.lat, -delta.lng, -delta.alt);

        this._updateSceneStatus(center, newLatLngBounds);

        if(this._level === zoomLevel || Z.Util.isNull(zoomLevel)){
            this.fire("viewreset");
        }else{
            this.setZoom(zoomLevel);
        }
    },

    panBy: function(x, y){   //Z.Point
        var offsetX = x === undefined ? 0 : x,
            offsetY = y === undefined ? 0 : y;

        if(x === 0 && y === 0){
            return;
        }

        var contentBounds = this.getContentBounds(),
            widthRatio = offsetX / this._container.clientWidth,
            heightRatio = offsetY / this._container.clientHeight,
            latLngOffsetX = (contentBounds.getEast() - contentBounds.getWest()) * widthRatio,
            latLngOffsetY = (contentBounds.getNorth() - contentBounds.getSouth()) * heightRatio,
            newLatLngCenter = this._latLngCenter.add(new Z.LatLng(latLngOffsetY, latLngOffsetX)),
            newLatLngBounds = this._latLngBounds.translate(latLngOffsetY, latLngOffsetX, 0);

        this._updateSceneStatus(newLatLngCenter, newLatLngBounds);

        this.fire("viewreset");
    },

    /**
     * 将场景旋转指定角度
     * @param rotate: {x,y,z}
     */
    rotateByEuler: function(rotate){
        if(rotate){
            this._sceneRender.rotateByEuler(rotate);
            this._sceneRender.render();
            this._rotation = rotate;

            this._updateSceneStatus();

            this.fire("viewreset");
            //this.fire("rotateend");
        }
    },

    /*重置场景到初始视角*/
    resetRotate: function(){
        this._sceneRender.resetCamera();
        this._updateSceneStatus();

        this.fire("viewreset");
    },

    getRotateByRad: function(){
        return this._sceneRender.getRotateByRad();
    },

    getContentBounds: function(){
        var renderOrthoBounds = this._sceneRender.getOrthoGLBounds();
        var renderContentBounds = this._sceneRender.getVisibleGLBounds();
        var widthRatio = (this._latLngBounds.getEast() - this._latLngBounds.getWest()) / renderOrthoBounds.getWidth();
        var heightRatio = (this._latLngBounds.getNorth() - this._latLngBounds.getSouth()) / renderOrthoBounds.getHeight();
        var latLngWidth = renderContentBounds.getWidth() * widthRatio;
        var latLngHeight = renderContentBounds.getHeight() * heightRatio;
        var west = this._latLngCenter.lng - latLngWidth * (renderOrthoBounds.getCenter().x - renderContentBounds.getBottomLeft().x) / renderContentBounds.getWidth();
        var east = west + latLngWidth;
        var north = this._latLngCenter.lat + latLngHeight * (renderContentBounds.getTopRight().y - renderOrthoBounds.getCenter().y) / renderContentBounds.getHeight();
        var south = north - latLngHeight;

        return new Z.LatLngBounds.create(new Z.LatLng(south, west), new Z.LatLng(north, east));
    },

    getPixelSceneRatio: function(){
        //var renderOrthoBounds = this._sceneRender.getOrthoGLBounds();
        //var widthRatio = this._container.clientWidth / renderOrthoBounds.getWidth();
        //var heightRatio = this._container.clientHeight / renderOrthoBounds.getHeight();
        var renderOrthoBounds = this._orthoGLBounds;
        var widthRatio = this._containerWidth / renderOrthoBounds.getWidth();
        var heightRatio = this._containerHeight / renderOrthoBounds.getHeight();

        return new Z.Point.create(widthRatio, heightRatio);
    },

    getLatLngSceneRatio: function(){
        var orthoLatLngBounds = this._latLngBounds,//this.getBounds(),
            orthoSceneBounds = this._orthoGLBounds;//this._sceneRender.getOrthoGLBounds();
        var widthRatio = (orthoLatLngBounds.getEast() - orthoLatLngBounds.getWest()) / orthoSceneBounds.getWidth();
        var heightRatio = (orthoLatLngBounds.getNorth() - orthoLatLngBounds.getSouth()) / orthoSceneBounds.getHeight();

        return new Z.Point.create(widthRatio, heightRatio);
    },

    latLngToScreenPoint: function(latLng){
        var glPoint = this._latLngToGLPoint(latLng);
        return this._sceneRender.webGLPointToScreen(glPoint);
    },

    latLngToScenePoint: function(latLng){
        return this._latLngToGLPoint(latLng);
    },

    scenePointToLatLng: function(point){
        return this._glPointToLatLng(point);
    },

    screenPointToLatLng: function(point){
        var glPoint = this._sceneRender.screenPointToWebGL(point);

        if(glPoint){
            return this._glPointToLatLng(glPoint);
        }else{
            return null;
        }
    },

    screenPointToScenePoint: function(point){
        var vector = this._sceneRender.screenPointToWebGL(point);

        return Z.Point.create(vector.x, vector.y, vector.z);
    },

    //不同的图层分组：底图、业务图层
    addLayer: function(layer, index, layerGroup){
        if(!(layer instanceof Z.ILayer)){
            return;
        }

        var containerPane = null;

        if(layerGroup === Z.LayerGroup.BaseBgLayer){
            containerPane = this._contentFrame.baseBgPane;
        }else if(layerGroup === Z.LayerGroup.BaseOverLayer){
            containerPane = this._contentFrame.baseOverPane;
        }else{
            containerPane = this._contentFrame.layerPane;
        }

        //var baseIndex = containerPane.index;
        //layer.onAdd(this, baseIndex + index, containerPane);
        layer.onAdd(this, index, containerPane);
        //this.refresh();
        this.fire('layeradd', { layer: layer });
    },

    removeLayer: function(layer){
        if(!(layer instanceof Z.ILayer)){
            return;
        }

        layer.onRemove(this);
        //this.refresh();
        this.fire('layerremove', { layer: layer });
    },

    openPopup: function(popup){
        popup.openOn(this);
    },

    closePopup: function(popup){
        popup.close();
    },

    addControl: function(control){
        control.onAdd(this);
    },

    removeControl: function(control){
        control.onRemove(this);
    },

    //setRotationByEuler: function(rotate){
    //    if(rotate){
    //        this._sceneRender.setRotationByEuler(rotate);
    //        this._sceneRender.render();
    //        this._rotation = rotate;
    //    }
    //},

    setSunLight: function(sunLight){
        if(sunLight){
            this._sceneRender.setLightPosition(sunLight);
            this._sceneRender.render();
            this._sunLight = sunLight;
        }
    },

    setAmbientLight: function(ambientLight){
        if(ambientLight){
            this._sceneRender.setAmbientLight(ambientLight);
            this._sceneRender.render();
            this._ambientLight = ambientLight;
        }
    },

    setBgColor: function(color){
        if(color){
            this._sceneRender.setBgColor(color);
            this._sceneRender.render();
        }
    },

    refresh: function(){
        this._sceneRender.render();
    },

    getMaxAnisotropy: function(){
        return this._sceneRender.getMaxAnisotropy();
    },

    //将空间距离（单位为米）转换为场景距离（场景坐标）
    getSceneDistance: function(distance){
        if(typeof distance === "number" && !Z.Util.isZero(distance) && !isNaN(distance)){
                    var //height = this._graphic.feature.shape.height,
                        crs = this.options.crs,
                        latLngOffset = crs.unprojectLatLngOffset(new Z.Point(0, distance)),
                        latLngSceneRatio = this.getLatLngSceneRatio().y;

                    return Math.abs(latLngOffset.lat / latLngSceneRatio);
                }else{
                    return 0;
                }
    },

    _getRenderOptions: function(container, sceneOptions){
        return {
            width: container.clientWidth,
            height: container.clientHeight,
            bgColor: this._bgColor,
            ambientColor:this._ambientLight,
            lightColor:this._sunLight,
            lightIntensity: this._sunIntensity,
            lightAngle: this._sunHeight,
            rotation: {x:0, y: 0, z:0}
        };
    },

    _initPyramidModel: function(options){
        var pyramidOptions = {
            latLngBounds: this._latLngBounds.clone(),
            levelDefine: options.levelDefine
        };

        this._pyramidModel = new Z.PyramidModel(pyramidOptions);
    },

    _initEvents: function(onOff){
        if (!Z.DomEvent) { return; }

        onOff = onOff || 'on';

        Z.DomEvent[onOff](this._container, 'click', this._onMouseClick, this);

        var domEvents = ['dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mouseenter',
        //var domEvents = ['dblclick', 'mousedown', 'mouseup', 'mouseenter',
                'mouseleave', 'mousemove', 'contextmenu'],
            i, len;

        for (i = 0, len = domEvents.length; i < len; i++) {
            Z.DomEvent[onOff](this._container, domEvents[i], this._fireMouseEvent, this);
        }

        //if (this.options.trackResize) {
        Z.DomEvent[onOff](window, 'resize', this._onResize, this);
        //}
    },

    _onMouseClick: function(e){
        this.fire('preclick');
        this._fireMouseEvent(e);
    },

    _onResize: function(e){
        this._containerWidth = this._container.clientWidth;
        this._containerHeight = this._container.clientHeight;
        this._sceneRender.resize();
        this._sceneRender.render();
        this._fireMouseEvent(e);//alert("resize");
    },

    _fireMouseEvent: function(e){
        var type = e.type;

        type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));

        if (!this.hasEventListeners(type)) { return; }

        if (type === 'contextmenu') {
            L.DomEvent.preventDefault(e);
        }

        if(type === 'resize'){
            this.fire(type);
        }else{
            var containerPoint = Z.DomEvent.getMousePosition(e, this._container);

            if(!containerPoint){
                this.fire(type);
            }else{
                var scenePoint = this._sceneRender.screenPointToWebGL(containerPoint),
                    latlng = this.screenPointToLatLng(containerPoint),
                    intersectObjs = this._sceneRender.getIntersectObjects(containerPoint);

                this.fire(type, {
                    latlng: latlng,
                    scenePoint: scenePoint,
                    containerPoint: containerPoint,
                    originalEvent: e,
                    objects: intersectObjs
                });
            }
        }
    },

    _enableDrag: function(){
        this._dragger = this._dragger || new Z.Scene3D.Drag(this);
        this._dragger.enable();
    },

    _disableDrag: function(){
        if(this._dragger){
            this._dragger.disable();
        }
    },

    /***经纬度坐标转换为webgl坐标***/
    _latLngToGLPoint: function(latLng){
        var renderContentBounds = this._viewableGLBounds;//this._sceneRender.getVisibleGLBounds();
        var latLngBounds = this._viewableLatLngBounds;//this.getContentBounds();
        var x = renderContentBounds.getBottomLeft().x + renderContentBounds.getWidth() * (latLng.lng - latLngBounds.getWest())/(latLngBounds.getEast() - latLngBounds.getWest());
        var y = renderContentBounds.getTopRight().y - renderContentBounds.getHeight() * (latLngBounds.getNorth() - latLng.lat)/(latLngBounds.getNorth() - latLngBounds.getSouth());
        var z = renderContentBounds.getTopRight().z - renderContentBounds.getThickness() * (latLngBounds.getTop() - latLng.alt)/(latLngBounds.getTop() - latLngBounds.getBottom());

        return new Z.Point(x, y, z);
    },

    /***webgl坐标转换为经纬度坐标***/
    _glPointToLatLng: function(glPoint){
        var renderContentBounds = this._viewableGLBounds;//this._sceneRender.getVisibleGLBounds();
        var latLngBounds = this._viewableLatLngBounds;//this.getContentBounds();
        var lng = latLngBounds.getWest() +(latLngBounds.getEast() - latLngBounds.getWest()) * (glPoint.x - renderContentBounds.getBottomLeft().x)/renderContentBounds.getWidth();
        var lat = latLngBounds.getSouth() +(latLngBounds.getNorth() - latLngBounds.getSouth()) * (glPoint.y - renderContentBounds.getBottomLeft().y)/renderContentBounds.getHeight();
        var alt = latLngBounds.getBottom() +(latLngBounds.getTop() - latLngBounds.getBottom()) * (glPoint.z - renderContentBounds.getBottomLeft().z)/renderContentBounds.getThickness();

        return new Z.LatLng(lat, lng, alt);
    },

    _updateSceneStatus: function(newLatLngCenter, newLatLngBounds){
        //newLatLngCenter = newLatLngCenter || this._latLngCenter;
        //newLatLngBounds = newLatLngBounds || this._latLngBounds;

        if(newLatLngCenter !== this._latLngCenter && newLatLngCenter instanceof Z.LatLng){
            this._latLngCenter = newLatLngCenter;
        }

        if(newLatLngBounds !== this._latLngBounds && newLatLngBounds instanceof Z.LatLngBounds){
            this._latLngBounds = newLatLngBounds;
        }

        this._viewableLatLngBounds = this.getContentBounds();
        this._orthoGLBounds = this._sceneRender.getOrthoGLBounds();
        this._viewableGLBounds = this._sceneRender.getVisibleGLBounds();
    }
});
/**
 * Created by Administrator on 2015/11/19.
 */
Z.Scene3D.Drag = Z.Class.extend({
    initialize: function(scene){
        this._scene = scene;
        this._draggable = null;
        this._enabled = false;
    },

    enable: function () {
        if (this._enabled) { return; }

        this._enabled = true;
        this.addHooks();
    },

    disable: function () {
        if (!this._enabled) { return; }

        this._enabled = false;
        this.removeHooks();
    },

    enabled: function () {
        return !!this._enabled;
    },

    addHooks: function () {
        if (!this._draggable) {
            var scene = this._scene;

            this._draggable = new Z.Draggable(scene._viewFrame.mapPane.root, scene._container, false);

            this._draggable.on({
                'dragstart': this._onDragStart,
                'drag': this._onDrag,
                'dragend': this._onDragEnd
            }, this);

            //if (map.options.worldCopyJump) {
            //    this._draggable.on('predrag', this._onPreDrag, this);
            //    map.on('viewreset', this._onViewReset, this);
            //
            //    map.whenReady(this._onViewReset, this);
            //}
        }
        this._draggable.enable();
    },

    removeHooks: function () {
        this._draggable.disable();
    },

    moved: function () {
        return this._draggable && this._draggable._moved;
    },

    _onDragStart: function (e) {
        var scene = this._scene;

        //if (map._panAnim) {
        //    map._panAnim.stop();
        //}

        scene
            .fire('movestart', e)
            .fire('dragstart', e);

        //if (map.options.inertia) {
        //    this._positions = [];
        //    this._times = [];
        //}
    },

    _onDrag: function (e) {
        //if (this._map.options.inertia) {
        //    var time = this._lastTime = +new Date(),
        //        pos = this._lastPos = this._draggable._newPos;
        //
        //    this._positions.push(pos);
        //    this._times.push(time);
        //
        //    if (time - this._times[0] > 200) {
        //        this._positions.shift();
        //        this._times.shift();
        //    }
        //}

        this._scene
            .fire('move', e)
            .fire('drag', e);
    },

    //_onViewReset: function () {
    //    // TODO fix hardcoded Earth values
    //    var pxCenter = this._map.getSize()._divideBy(2),
    //        pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);
    //
    //    this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
    //    this._worldWidth = this._map.project([0, 180]).x;
    //},
    //
    //_onPreDrag: function () {
    //    // TODO refactor to be able to adjust map pane position after zoom
    //    var worldWidth = this._worldWidth,
    //        halfWidth = Math.round(worldWidth / 2),
    //        dx = this._initialWorldOffset,
    //        x = this._draggable._newPos.x,
    //        newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
    //        newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
    //        newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;
    //
    //    this._draggable._newPos.x = newX;
    //},

    _onDragEnd: function (e) {
        var scene = this._scene,
            options = scene.options,
            delay = +new Date() - this._lastTime,
            noInertia = !options.inertia || delay > options.inertiaThreshold || !this._positions[0];



        scene.fire('dragend', e);

        //if (noInertia) {
        scene.fire('moveend', e);

        /******************改变空间范围********************/
        var sceneObj = this._scene;
        var startPoint = sceneObj.screenPointToLatLng(e.startPoint);
        var newPoint = sceneObj.screenPointToLatLng(e.newPoint);
        var delta = newPoint.subtract(startPoint);
        var newCenter =sceneObj.getBounds().getCenter().subtract(delta);
        sceneObj.panTo(newCenter);

        //var //delta = this._latLngBounds.getCenter().subtract(newCenter),
        //    newLatLngBounds = this._latLngBounds.translate(-delta.lat, -delta.lng, -delta.alt);
        //
        //this._updateSceneStatus(newCenter, newLatLngBounds);

        /*************************************************/

        //} else {
        //
        //    var direction = this._lastPos.subtract(this._positions[0]),
        //        duration = (this._lastTime + delay - this._times[0]) / 1000,
        //        ease = options.easeLinearity,
        //
        //        speedVector = direction.multiplyBy(ease / duration),
        //        speed = speedVector.distanceTo([0, 0]),
        //
        //        limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
        //        limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),
        //
        //        decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
        //        offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();
        //
        //    if (!offset.x || !offset.y) {
        //        map.fire('moveend');
        //
        //    } else {
        //        offset = map._limitOffset(offset, map.options.maxBounds);
        //
        //        L.Util.requestAnimFrame(function () {
        //            map.panBy(offset, {
        //                duration: decelerationDuration,
        //                easeLinearity: ease,
        //                noMoveStart: true
        //            });
        //        });
        //    }
        //}
    }
});
/**
 * Created by Administrator on 2015/10/24.
 */
ZMap = Z.Class.extend({
    includes: Z.EventManager,
    options:DefaultZMapConfig,

    /*构造函数*/
    initialize: function(containerId, options){
        this._container = null,                    //地图容器
        this._containerWidth = 0,
        this._containerHeight = 0,
        this._screenTopLeftCorner = null,               //地图容器的左上角相对于整个页面的坐标（单位为像素）
        this._pageOffset = null,                         //页面向下和向右滚动的距离
        this._defaultGraphicLayer = null,               //默认graphic图层
        this._layers = [],               //应用图层
        this._scene = null,               //地图场景
        this._currentSceneType = null,               //当前的地图场景类型
        this._status = {                 //地图的即时状态
            latLngBounds:{},
            center:{},
            zoomLevel: 1
        },

        this._initContainer(containerId);
        this._applyOptions(options);
        this._initScene();
        this._initEvents();
        this._initMapEvent();

        this.fire("load");
    },

    addLayer: function(layer, index, layerGroup){
        if(!this._scene || !(layer instanceof Z.ILayer)){
            return;
        }

        if(index < 0 || index >= 1000){
            console.error("index的值必须在0到999之间");          //将index强制限制在0到999之间。每个图层组里最多允许999个图层
            return;
        }

        if(this.hasLayer(layer)){
            return;
        }

        //var layerArray = this._layers[layerGroup + ""],
        //    layerLength = this._layers.length;
        //var layerIndex = (index === undefined) ? (layerLength > 0 ? this._layers[layerLength - 1].index + 1 : 0) : index;
        ////index = Math.max(0, Math.min(this._layers.length, index));
        //var layerId = Z.Util.stamp(layer);

        var layerIndex = this._scene.addLayer(layer, index, layerGroup);

        this._layers.push({layer: layer, index:layerIndex});
        //if(layerLength <= 0){
        //    this._layers.push({layer: layer, index:layerIndex});
        //}else{
        //    for(var i = 0; i < layerLength; i++){
        //        if(layerIndex < this._layers[i].index){
        //            this._layers.splice(i, 0, {layer: layer, index:layerIndex});
        //            break;
        //        }
        //    }
        //
        //    if(i >= layerLength){
        //        this._layers.push({layer: layer, index:layerIndex});
        //    }
        //}
    },

    removeLayer: function(layer){
        this._scene.removeLayer(layer);

        for(var i = this._layers.length - 1; i >=0; i--){
            if(layer === this._layers[i].layer){
                this._layers.splice(i, 1);
            }
        }
    },

    getLayers: function(){
        return Z.Util.ArrayClone(this._layers);
    },

    /*layer参数可以是图层对象，也可以是图层id*/
    getLayer: function(layer){
        var layerId = "";

        if((typeof layer) === "string"){
            layerId = layer;
        }else if(layer instanceof  Z.ILayer){
            layerId = Z.Util.stamp(layer);
        }else{
            return;
        }

        var targetLayer = null,
            currentLayerId = "";

        for(var i = this._layers.length - 1; i >=0; i--){
            currentLayerId = Z.Util.stamp(this._layers[i].layer);

            if(layerId === currentLayerId){
                targetLayer = this._layers[i];
                break;
            }
        }

        return targetLayer;
    },

    hasLayer: function(layer){
        return !(this.getLayer(layer)) ? false : true;
    },

    panTo: function(latLng, level){
        if(!this._scene){
            return;
        }

        latLng = Z.LatLng.create(latLng);
        level = (typeof  level === 'number') ? Math.floor(level) : level;

        if(!latLng){
            return;
        }

        this._scene.panTo(latLng, level);

        this._updateMapStatus(null, latLng, level);
    },

    panBy: function(x, y){   //Z.Point
        var offsetX = x === undefined ? 0 : x,
            offsetY = y === undefined ? 0 : y;

        if(x === 0 && y === 0){
            return;
        }

        if(this._scene){
            this._scene.panBy(x, y);
        }
    },

    getZoom: function(){
        return this._status.zoomLevel;
    },

    setZoom: function(zoomLevel){
        if(typeof zoomLevel !== "number"){
            return;
        }

        zoomLevel = this._limitZoom(zoomLevel);

        if(zoomLevel === this._status.zoomLevel){
            return;
        }

        this._scene.setZoom(zoomLevel);
        this._updateMapStatus(null, null, zoomLevel);
    },

    zoomIn: function(){
        if(this._status.zoomLevel < this.options.maxZoom){
            var newZoom = this._status.zoomLevel + 1;
            this.setZoom(newZoom);
        }
    },

    zoomOut: function(){
        if(this._status.zoomLevel > this.options.minZoom) {
            var newZoom =this._status.zoomLevel - 1;
            this.setZoom(newZoom);
        }
    },

    setView: function(bounds){
        if(!(bounds instanceof Z.LatLngBounds)) {
            return;
        }

        var level = this._getfitableZoomLevel(bounds);
        var center = bounds.getCenter();
        this._scene.panTo(center, level);
        var newBounds = this._getfitableBounds(center, level);
        this._updateMapStatus(newBounds, center, level);
    },

    fitBounds: function(bounds){
        this.setView(bounds);
    },

    fitFeature: function(feature){
        alert("fitFeature方法尚未实现");
    },

    fitFeatures: function(features){
        alert("fitFeatures方法尚未实现");
    },

    fullMap: function(){
        this.panTo(this.options.center, this.options.levelDefine[this.options.initZoom].level);
    },

    openPopup: function(popup){
        this._scene.openPopup(popup);
    },

    closePopup: function(popup){
        this._scene.closePopup(popup);
    },

    /*切换地图场景*/
    switchScene: function(sceneType){
        if(sceneType === this._currentSceneType){
            return;
        }

        alert("switchScene方法尚未实现");
    },

    //fullMap: function(){
    //    alert("fullMap方法尚未实现");
    //},

    getBounds: function(){
        return this._status.latLngBounds.clone();
    },

    getCenter: function(){
        return this._status.center;
    },

    getZoom: function(){
        return this._status.zoomLevel;
    },

    getScale: function(){
        alert("getScale方法尚未实现");
    },

    getSize: function(){
        return Z.Point.create(this._containerWidth, this._containerHeight);
    },

    /*地图内容实际显示的空间范围。在二维地图中，与地图容器一致，在三维地图中，在非垂直俯视的情况下，由于视角的原因，范围大于地图容器大小。*/
    getContentBounds: function(){
        return this._scene.getContentBounds();
    },

    on: function(event, func){
        this._scene.on(event, func);
    },

    off: function(event, func, context){
        this._scene.off(event, func, context);
    },

    screenPointToLatLng: function(point){
        if(!(point instanceof Z.Point)) {
            if(point && (typeof point.x === "number") && (typeof point.y === "number")){
                point = new Z.Point(point.x, point.y);
            }else{
                return null;
            }
        }

        this.reposition();
        var sceneScreenPoint = point.add(this._pageOffset).subtract(this._screenTopLeftCorner);

        return this._scene.screenPointToLatLng(sceneScreenPoint);
    },

    latLngToScreenPoint: function(latLng){
        latLng = Z.LatLng.create(latLng);

        if(!(latLng instanceof Z.LatLng)) {
            return null;
        }

        var layerPoint = this._scene.latLngToScreenPoint(latLng);
        this.reposition();

        return this._screenTopLeftCorner.add(layerPoint).subtract(this._pageOffset);
    },

    resize: function(){
        if(this._container){
            this._containerWidth = this._container.clientWidth;
            this._containerHeight = this._container.clientHeight;
        }
    },

    reposition: function(){
        if(this._container) {
            var left = this._container.offsetLeft || this._container.clientLeft,
                top = this._container.offsetTop || this._container.clientTop,
                offsetX = window.pageXOffset || document.body.scrollLeft,
                offsetY = window.pageYOffset || document.body.scrollTop;

            if(!this._screenTopLeftCorner){
                this._screenTopLeftCorner = new Z.Point(left, top);
                this._pageOffset = new Z.Point(offsetX, offsetY);
            }else{
                this._screenTopLeftCorner.x = left;
                this._screenTopLeftCorner.y = top;
                this._pageOffset.x = offsetX;
                this._pageOffset.y = offsetY;
            }

        }
    },

    refresh: function(){
        if(this._scene){
            this._scene.refresh();
        }
    },

    setSunLight: function(sunHeight){
        if(this._scene){
            this._scene.setSunLight(sunHeight);
        }
    },

    setAmbientLight: function(color){
        if(this._scene){
            this._scene.setAmbientLight(color);
        }
    },

    rotateByEuler: function(rotate){
        if(this._scene){
            this._scene.rotateByEuler(rotate);
        }
    },

    resetRotate: function(){
        if(this._scene){
            this._scene.resetRotate();
        }
    },

    _initContainer: function(containerId){
        var container = this._container = Z.DomUtil.get(containerId);

        if (!container) {
            throw new Error('地图创建失败，未找到指定的地图容器：'  +　'id＝' + containerId);
        } else if (container._zmap) {
            throw new Error('地图容器已经初始化，请检查是否在同一地图容器中构造了多个地图对象');
        }

        container._zmap = true;
        this.resize();
        this.reposition();
    },

    /*创建地图场景。对于mixed类型，初始显示为2d模式*/
    _initScene: function(){
        var sceneType = (this.options.sceneType || 'mixed').toLowerCase();

        if(this._supportWebGL() && (sceneType === '3d' || sceneType === 'mixed')){
            this._scene = (sceneType === '3d') ?
                (this._currentSceneType = '3d') :
                (this._currentSceneType = '2d');
        }else{
            this.options.sceneType = '2d';
            this._currentSceneType = '2d';
        }

        this._scene = (this._currentSceneType === '3d') ?
            new Z.Scene3D(this._container, this.options) :
            new Z.Scene2D(this._container, this.options);

        this._updateMapStatus();
    },

    _initEvents: function(){
        if(this._scene){
            this._scene.on("viewreset", this._onSceneViewReset, this);
            this._scene.on("zoomlevelchange", this._onSceneZoomChange, this);
        }
    },

    _initMapEvent: function(onOff){
        if (!Z.DomEvent || !this._scene) { return; }

        onOff = onOff || 'on';

        var events = ['preclick', 'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover',
                'mouseout', 'mousemove', 'contextmenu', 'resize', 'movestart', 'move', 'moveend',
                'dragstart', 'drag', 'dragend', 'viewreset', 'zoomlevelchange', 'layeradd', 'layerremove'],
            i, len;

        for (i = 0, len = events.length; i < len; i++) {
            this._scene[onOff](events[i], this._fireMapEvent, this);
        }
    },

    _fireMapEvent: function(e){
        this.fire(e.type, e);
    },

    _onSceneViewReset: function(){
        this._updateMapStatus();
        this.fire("viewreset");
    },

    _onSceneZoomChange: function(){
        this._updateMapStatus();
        this.fire("zoomlevelchange");
    },

    _applyOptions: function(options){
        options = options || {};
        this.options = Z.Util.applyOptions(this.options, options, false, ['sceneConfig']);
        this.options.sceneConfig = Z.Util.applyOptions(this.options.sceneConfig, options.sceneConfig, false);
        this.options.crs = this._getCRS(this.options.crs);
        this.options.center = new Z.LatLng(this.options.center.y, this.options.center.x);
        var bounds = this._getfitableBounds(this.options.center,this.options.initZoom );
        this.options.bounds = bounds;
        this.options.maxBounds = Z.LatLngBounds.create([this.options.maxBounds.miny, this.options.maxBounds.minx],
            [this.options.maxBounds.maxy, this.options.maxBounds.maxx]);
        this._updateMapStatus(bounds, this.options.center, this.options.initZoom);
    },

    _getCRS: function(crsString){
        crsString = crsString || "";
        crsString = crsString.toUpperCase();

        if(crsString === "EPSG4326"){
            return Z.CRS.EPSG4326;
        }else if(crsString === "EPSG4490"){
            return Z.CRS.EPSG4490;
        }else if(crsString === "EPSG900913"){
            return Z.CRS.EPSG900913;
        }else if(crsString === "EPSG3857"){
            return Z.CRS.EPSG3857;
        }else if(crsString === "Simple"){
            return Z.CRS.Simple;
        }else{
            return Z.CRS.EPSG4326;
        }
    },

    _updateMapStatus: function(latLngBounds, center, level){
        this._status.latLngBounds = latLngBounds || this._scene.getBounds();
        this._status.center = center || this._scene.getBounds().getCenter();
        this._status.zoomLevel = level || this._scene.getZoom();
    },

    /*将地图级别限定在指定范围*/
    _limitZoom: function(zoomLevel){
        return Math.min(this.options.maxZoom, Math.max(this.options.minZoom, zoomLevel));
    },

    /*找到与指定地图范围最匹配的地图级别*/
    _getfitableZoomLevel: function(bounds){
        var resolution = (bounds.getWest() - bounds.getEast())/this._containerWidth;
        var levels = this.options.levelDefine;
        var resoLoop = levels[0].resolution;

        if(resolution > resoLoop){
            return levels[0].level;
        }

        for(var i = 1; i < levels.length; i++){
            resoLoop = levels[i].resolution;

            if(resolution > resoLoop){
                return levels[i - 1].level;
            }
        }

        return levels[levels.length - 1].level;
    },

    /*找到指定地图级别的范围*/
    _getfitableBounds: function(center, level){
        var resolution = this.options.levelDefine[level].resolution;
        var spatialWidth = this._containerWidth * resolution;
        var spatialHeight = this._containerHeight * resolution;
        var minx = center.lng - spatialWidth / 2;
        var maxx = center.lng + spatialWidth / 2;
        var miny = center.lat - spatialHeight / 2;
        var maxy = center.lat + spatialHeight / 2;

        return Z.LatLngBounds.create(Z.LatLng.create(miny, minx), Z.LatLng.create(maxy, maxx));
    },

    /*判断浏览器是否支持WebGL*/
    _supportWebGL: function(){
        var cvs = document.createElement('canvas');
        var contextNames = ['webgl','experimental-webgl','moz-webgl','webkit-3d'];
        var ctx;

        for(var i = 0; i < contextNames.length; i++){
            try{
                ctx = cvs.getContext(contextNames[i]);
                if(ctx){
                    break;
                }
            }catch(e){}
        }

        return ctx ? true : false;
    }
});
