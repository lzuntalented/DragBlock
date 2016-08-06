/**
 * layout
 * by lz
 */
var HelloWorldLayer = cc.Layer.extend({
    map : [],//存放网格状态的数组
    
   	array_bottom : [],//底部三个可供拖拽的精灵
   	
    ctor:function () {
        this._super();

        var size = cc.winSize;

		this.createGridView();
		this.createBottom();

        return true;
   	},
   	
   	/**
   	 * 创建网格背景
   	 * */
   	createGridView : function(){
   		
		var x_offset = (cc.winSize.width - PublicData.item_width * PublicData.gridview_col) / 2;
		var y_offset = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2 + PublicData.item_height;
		
   		for(var i = 0 ; i < PublicData.gridview_row ; i++){
   			var tmp = [];

   			for(var j = 0  ; j < PublicData.gridview_col ; j++){
				tmp.push(0);//填充状态0网格未被覆盖 1该网格已被覆盖
				
				var sprite = new cc.Sprite(res.Color_0_png);
				sprite.attr({
					x : PublicData.item_width * j + x_offset,
					y : PublicData.item_height * i + y_offset,
					anchorX : 0,
					anchorY : 1
				});
				this.addChild(sprite);
   			}
   			
   			this.map.push(tmp);//填充状态数组

   		}
   	},
   	
   	/*创建底部三个可供拖动的精灵*/
   	createBottom : function(){
		var y_offset = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2;

   		for(var i = 0 ; i < 3 ; i++){
   			var type = Math.floor(Math.random() * PublicData.dialmond_type) + 1;

			var sprite = new DiamondSprite(type);
			sprite.attr({
				x : (cc.winSize.width / 3 * i) + (cc.winSize.width / 3 - sprite.width) / 2,
				y : y_offset / 2 + sprite.height / 2,
			});
			
			this.array_bottom.push(sprite);
			this.addChild(sprite);
   		}
   	},
 
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

