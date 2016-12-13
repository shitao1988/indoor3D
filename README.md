indoor3D
========

This is a javascript lib based on three.js to show an indoor map

构造函数
var map = new IndoorMap(params)
constructor(params)

params参数说明
参数名	参数类型	参数说明
mapDiv	string	地图的容器div的id。如果未设置则会默认在html的body元素下创建一个新的div作为地图容器
size	[number, number]	在未指定mapDiv的情况下，设置默认创建的地图容器的大小，格式为[width, height]。若为空则默认设置为全屏
dim	string	地图显示的纬度。目前只支持三维，值固定为’3d’

方法
方法名	参数类型	返回值	方法说明
setTheme(theme)	Theme	无	设置地图样式
theme	无	Theme	获得当前地图样式。格式见附件Theme
getSize	无	[number, number]	获得当前地图大小，格式为[width，height]
parse(json)	string		解析json，生成建筑并显示，格式见附件BuildingJson
setDefaultView	无	无	显示默认视图
setTopView			显示俯视视图
changeViewAngle( hAngle, vAngle)	hAngle: number
vAngle：number	无	旋转视图。hAngle表示水平旋转角，vAngle表示垂直旋转角。单位为度
zoomIn	无	无	放大
zoomOut	无	无	缩小
showFloor(floorId)	floorid：string	无	显示指定图层。floorId表示待显示楼层id
showAllFloors(scale)	scale: number	无	显示所有楼层的详细的户的信息。scale表示楼层间的间距的缩放比例，默认为1。允许的最小值为0.5，无最大值限制
showFloorWalls	无	无	显示所有楼层，但只显示楼层的外墙，不显示户的信息
setSelectable(selectable)	selectable:boolean	无	是否允许楼层和户响应鼠标选中事件
getSelectedId	无	string	获得当前选中的楼层或户的id
setSelectionListener(callback)	callback:Function	无	设置鼠标选中楼层或户后的响应函数。响应函数接收三个参数：
Id：选中的楼层或户的id
dataInfo：选中的楼层或户的属性信息
event：原始鼠标事件
selectById(floorId, cellId)	floorId：string
cellId：string	无	选中指定的户。floorId和cellId分别表示楼层的id和户的id

IndoorMapLoader
构造函数
var loader = new IndoorMapLoader(true, {sceneSize: indoorMap.getSize()});
constructor(is3d, options)
Is3d: 是否为3d地图。目前只支持3d，固定为true

options参数说明
参数名	参数类型	参数说明
sceneSize	{width:number, height:number]	指定地图容器的大小。若为空则默认为全屏

方法
方法名	参数类型	返回值	方法说明
load (url, callback)	url:string
callback:Function	无	加载建筑物。url表示访问的url地址，callback为解析建筑物数据成功后的回调



