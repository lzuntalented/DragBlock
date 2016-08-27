/**
 * layout
 * by lz
 */
var HelloWorldLayer = cc.Layer.extend({
    map : [],//存放网格状态的数组
    map_sprite : [],//存放网格放置的精灵数组
    
   	array_bottom : [],//底部三个可供拖拽的精灵
   	drag_index : 0,//标记当前拖拽的底部方块序号
   	
   	score : 0,//当前分数
   	score_label : null,//分数显示label
   	
    ctor:function () {
        this._super();

        var size = cc.winSize;

		/*添加分数显示*/
		var label = cc.LabelTTF.create("当前积分:0","Aria",32);
		label.x = size.width / 2;
		label.y = size.height - 40;
		label.color = cc.color(255,255,255);
		this.addChild(label);
		this.score_label = label;
		
		this.createGridView();
		this.createBottom();

		var self = this;
		
		/*添加单点触摸*/
		cc.eventManager.addListener({
        	event:cc.EventListener.TOUCH_ONE_BY_ONE,//单点触摸事件
        	swallowTouches: true,
        	onTouchBegan:  function(touch, event){
        		var point  = touch.getLocation();
        		var y_offset = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2;
        		
        		if(point.y > point){//判断当前点击的是否是底部，
        			return ;
        		}
        		
        		var x = Math.floor(point.x / (cc.winSize.width / 3));//获取当前点击底部哪一块

				self.drag_index = x;//记录当前拖拽的方块
				self.array_bottom[x].zIndex = 2;//设置拖拽的方块在最顶层绘制，防止拖动时被遮住
				self.array_bottom[x].scale = 1;
	        	return true;
	    	},
	    	onTouchMoved : function(touch, event){
	            var endTouch  = touch.getLocation();

	            var offsetX = endTouch.x;
	            var offsetY = endTouch.y ;

	            /*将拖动的方块置位，定位在手指的正上方，并且不被手指遮住*/
	            var x = offsetX - self.array_bottom[self.drag_index].width / 2;
	            var y = offsetY + PublicData.item_height;

	            self.array_bottom[self.drag_index].setPosition(cc.p(x,y));

	    	},
	    	onTouchEnded : function(touch, event){
				var endTouch  = touch.getLocation();

	            var offsetX = endTouch.x;
	            var offsetY = endTouch.y ;
	            var point = {
	            	x : offsetX - self.array_bottom[self.drag_index].width / 2,
	            	y : offsetY + PublicData.item_height + self.array_bottom[self.drag_index].height
	            }
	            var ret = self.getTouchPoint(point);//将当前方块所在的位置转换为网格序列
	            
	            if(ret.col >= PublicData.gridview_col || ret.col < 0
	            	|| ret.row >= PublicData.gridview_row || ret.row < 0
	            ){
	            	self.setBottomBack(self);
	            	return ;
	            }
	            
				/*检查当前所在点的网格序列是否符合规范*/
				var list = self.array_bottom[self.drag_index].vector;
				for(var i = 0 ; i < list.length ; ++i){
					var map_row = list[i][0] + ret.row;
					var map_col = list[i][1]  + ret.col;
					if(map_row < 0 || map_row >= PublicData.gridview_row){
						self.setBottomBack(self);
						return;
					}
					if(map_col < 0 || map_col >= PublicData.gridview_col){
						self.setBottomBack(self);
						return;
					}
					if(self.map[map_row][map_col] == 1){//检查该网格点状态
						self.setBottomBack(self);
						return;
					}
				}
	            
	            for(var i = 0 ; i < list.length ; ++i){
	            	self.map[list[i][0] + ret.row][list[i][1]  + ret.col] = 1;
	            	self.createGridViewItem(list[i][0] + ret.row,list[i][1]  + ret.col,self.array_bottom[self.drag_index].type);
	            }

	            self.removeChild(self.array_bottom[self.drag_index]);
	            self.array_bottom[self.drag_index] = null;
				self.createBottomByIndex(self,self.drag_index);

				self.clearLine();//清理行
				
				/*检测游戏是否结束*/
				if(!self.checkGameOver()){
					alert("Game Over");
				}
	    	}
        },this);
        
        return true;
   	},
   	
   	/*清理满行*/
   	clearLine : function(){
   		for(var i = 0;i < PublicData.gridview_row ; ++i) {
   			var tag = true;
   			
   			for(var j = 0; j < PublicData.gridview_col ; ++j){
   				if(this.map[i][j] != 1 ){
   					tag = false;
   					break;
   				}
   			}
   			
   			if(tag){
   				for(var j = 0; j < PublicData.gridview_col ; ++j){
   					var self = this;
   					this.map_sprite[i][j].runAction(cc.sequence(cc.delayTime(0.005*j),cc.scaleTo(0,0.1),cc.callFunc(self.clearAction,self,[i,j])));
	   				this.map[i][j] = 0 ;
	   			}
   				this.addScore();
   			}
   		}
   	},
   	
   	clearAction : function(self,data){
   		var i = data[0];
   		var j = data[1];
   		this.removeChild(this.map_sprite[i][j]);
		this.map_sprite[i][j] = null ;
		
   	},
   	
   	/*增加当前得分*/
   	addScore : function(){
   		this.score ++ ;
   		this.score_label.string = "当前得分:" + this.score;
   	},
   	
   	/*游戏结束检测*/
   	checkGameOver : function(){
   		
		for(var i = 0;i < PublicData.gridview_row ; ++i) {
   			for(var j = 0; j < PublicData.gridview_col ; ++j){
   				if(this.map[i][j] == 1 ){
   					continue;
   				}
   				
   				for(var k = 0; k < this.array_bottom.length ; ++ k){
   					var list = this.array_bottom[k].vector;
   					var tag = 1;
   					for(var l = 0 ; l < list.length ; ++l){
   						var row = i + list[l][0];
   						var col = j + list[l][1];
   						
   						if(row < 0 || row >= PublicData.gridview_row){
   							tag = 3;
   							break;
		            	}
		            	if(col < 0 || col >= PublicData.gridview_col){
		            		tag = 3;
		            		break;
		            	}
		            	
   						if(this.map[row][col] == 1){
   							tag = 2;
   							break;
   						}
   					}
   					if(tag == 1) return true;
   				}
   			}
		}
		
		return false;
   	},
   	
   	
   	/**
   	 * 创建网格背景
   	 * */
   	createGridView : function(){
   		
		var x_offset = (cc.winSize.width - PublicData.item_width * PublicData.gridview_col) / 2;
		var y_offset = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2 + PublicData.item_height;
		
   		for(var i = 0 ; i < PublicData.gridview_row ; i++){
   			var tmp = [];
			var map_tmp = [];
   			for(var j = 0  ; j < PublicData.gridview_col ; j++){
				tmp.push(0);//填充状态0网格未被覆盖 1该网格已被覆盖
				map_tmp.push(null);
				
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
			this.map_sprite.push(map_tmp);
   		}
   	},
   	
   	/*创建底部三个可供拖动的精灵*/
   	createBottom : function(){
		var y_offset = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2;

   		for(var i = 0 ; i < 3 ; i++){
   			var type = Math.floor(Math.random() * PublicData.dialmond_type) + 1;

			var sprite = new DiamondSprite(type);

			sprite.attr({
				x : (cc.winSize.width / 3 * i) + (cc.winSize.width / 3 - sprite.width * 0.8) / 2,
				y : y_offset / 2 - sprite.height / 2 - sprite.height * 0.1,
			});

			sprite.scale = 0.8;

			this.array_bottom.push(sprite);
			this.addChild(sprite);
   		}
   	},
 
	/**
	 * 返回当前触摸点对应的网格序列
	 * @param {Object} point {x:x点坐标,y:y点坐标}
	 * @return {Object} {row:网格行数,col:网格列数}
	 * */
   	getTouchPoint : function(point){

   		var result = {
   			col : 0,
   			row : 0
   		};
   		var start_x = (cc.winSize.width - PublicData.item_width * PublicData.gridview_col) / 2;
   		var start_y = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2;

   		var col = Math.floor((point.x - start_x) / PublicData.item_width);

   		var col_increa = (point.x - start_x) % PublicData.item_width;
   		
   		var row = Math.floor((point.y - start_y) / PublicData.item_height);

   		var row_increa = (point.y - start_y) % PublicData.item_height;
   		row_increa = Math.abs(row_increa);

   		if(col_increa < 0 ){//左侧超出网格处理，模拟落在第一格
   			if(Math.abs(col_increa) < PublicData.item_width / 2){
   				col_increa = PublicData.item_width - Math.abs(col_increa);
   			}
   		}
   		if(row_increa < PublicData.item_height / 2 && col_increa > PublicData.item_width / 2){
   			--row;
   			++col;
   		}else if(row_increa > PublicData.item_height / 4 && col_increa > PublicData.item_width / 2){
   			++col;
   		}else if(row_increa < PublicData.item_height / 4 && col_increa < PublicData.item_width / 2){
   			--row;
   		}
   		

   		result.col = col;
   		result.row = row;
   		
   		return result;
   	},
   	
   	/*通过给定序列创建一个网格精灵*/
   	createGridViewItem : function(row,col,type){
   		var x_offset = (cc.winSize.width - PublicData.item_width * PublicData.gridview_col) / 2;
		var y_offset = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2 + PublicData.item_height;
		var sprite = new cc.Sprite('res/color_'+type+'.png');
		sprite.attr({
			x : PublicData.item_width * col + x_offset,
			y : PublicData.item_height * row + y_offset,
			anchorX: 0,
			anchorY: 1
		});
		this.addChild(sprite);
		this.map_sprite[row][col] = sprite;//将添加的精灵暂存，以便后面消除
   	},
   	
   	/*当前拖拽不合规范，重置拖拽精灵到底部*/
   	setBottomBack : function(self){
   		var y_offset = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2;
		
		self.array_bottom[self.drag_index].attr({
			x : (cc.winSize.width / 3 * self.drag_index) + (cc.winSize.width / 3 - self.array_bottom[self.drag_index].width) / 2,
			y : y_offset / 2 - self.array_bottom[self.drag_index].height / 2 - self.array_bottom[self.drag_index].height * 0.1,
		});	

   	},
   	
	/*创建指定序列的底部精灵*/
   	createBottomByIndex : function(self,idx){
   		var y_offset = (cc.winSize.height - PublicData.item_height * PublicData.gridview_row) / 2;
		
		var type = Math.floor(Math.random() * PublicData.dialmond_type) + 1;
		var sprite = new DiamondSprite(type);
		sprite.attr({
			x : (cc.winSize.width / 3 * idx) + (cc.winSize.width / 6) - sprite.width / 2,
			y : y_offset / 2 - sprite.height / 2 - sprite.height * 0.1,
		});	
		
		sprite.scale = 0.8;
			
		self.addChild(sprite);
		self.array_bottom[idx] = sprite;
   	},
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

