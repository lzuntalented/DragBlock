/**
 * 方块精灵
 * 数据结构：以左上角为原点 , 用坐标系的第四象限表示
 * by lz
 */
var DiamondSprite = cc.Layer.extend({
	type : null,//精灵类型

	vector : [],//存储精灵数据结构
	
	direction : 0,//方向 0 向上 1向右 2向下 3向左
	
	/**
	 * 构造函数
	 * @param {int} type 精灵类型
	 * */
	ctor : function(type){
		this._super();
		
		this.direction = Math.floor(Math.random() * 4); //随机方向
		
		this.type = type;
		this.vector = [];
		this.drawItem(type);
		
		this.anchorX = 0;
		this.anchorY = 1;
				
	},
	
	/**
	 * 绘制一个精灵网格点
	 * @param {int} type 类型
	 * */
	drawItem : function(type){

		switch (type){
			case 1:
				this.drawPoint(cc.p(0,0),true);
				break;
			case 2:
				this.drawTian();
				break;
			default:
				break;
		}
	},
	
	/**
	 * 绘制方块或点
	 * #
	 * @param {point} orgin 该点的坐标
	 * @param {boolean} tag true为点方块 or点
	 * */
	drawPoint : function(orgin,tag){
		var orgin = orgin || cc.p(0,0);
		var sprite = new cc.Sprite('res/color_'+this.type+'.png');
		sprite.attr({
			anchorX : 0,
			anchorY : 1,
			x : orgin.x,
			y : orgin.y,
		})
		this.addChild(sprite);
		
		/*调用该方法的为绘制点方块*/
		if(tag){
			this.width = PublicData.item_width;//定义该方块宽度
			this.height = PublicData.item_height;//定义该方块高度
			
			/*定义该方块的数据结构*/
			this.vector.push([0,0]);
		}

	},
	
	/**
	 * 绘制方块
	 * ##
	 * ##
	 */
	drawTian : function(){
		/*绘制田方块的各个点*/
		this.drawPoint();
		this.drawPoint(
			cc.p(PublicData.item_width,0)
		);
		this.drawPoint(
			cc.p(0,-PublicData.item_height)
		);
		this.drawPoint(
			cc.p(PublicData.item_width , -PublicData.item_height)
		);
		
		this.width = PublicData.item_width * 2;//定义该方块宽度
		this.height = PublicData.item_height * 2;//定义该方块高度
		
		/*定义该方块的数据结构*/
		this.vector.push([0,0]);
		this.vector.push([0,1]);
		this.vector.push([-1,0]);
		this.vector.push([-1,1]);
	},
	
});
