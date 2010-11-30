﻿$(function(){
		

		PageNavEffect.addNavBar({title:'Open DataBase',open:function(){			
			Sticky.init("#stage_"+PageNavEffect.getCurrentIndex());
		},close:function(){}});
		PageNavEffect.addNavBar({title:'Canvas'});

		
		/*
		var navList = new NavEffect(effectStage);
		
		navList.addNavbar({title:'Css Image Albums',open:function(){
			var test = new ImageEffect();
			test.add('images/image1.jpg');
			test.add('images/spice.jpg');
			test.add('images/image1.jpg');
			test.add('images/image1.jpg');
			test.add('images/image1.jpg');
			test.add('images/spice.jpg');
			test.add('images/image1.jpg');
			test.add('images/spice.jpg');
			test.add('images/image1.jpg');
			test.add('images/spice.jpg');		
			//test.init();
		},close:function(){}});
		navList.addNavbar({title:'Open DataBase',open:function(){},close:function(){alert('1 close')}});
		navList.addNavbar({title:'Canvas'});
		navList.addNavbar();
		navList.addNavbar();	
		navList.addNavbar();		
		*/
});


var EffectStage = function(){
	
	// for header offset height
	var contentHeight = 90;
	
	// for left nav offset width
	var contentNavWidth = 295;
	
	var resizeEnable = true;
	
	// cache current window widht,height
	var cache = {		
		windowWidth : $(window).width(),
		windowHeight : $(window).height()		
	}
	
	function init(){
		
		$(window).bind('resize',resize)
		
	}

	function resize(){

		if(resizeEnable){

			// resize window width,height
			cache = {
				windowWidth : $(window).width(),
				windowHeight : $(window).height()
			};
											
			$('div.stage').width((cache.windowWidth - contentNavWidth) + 'px').height((cache.windowHeight - contentHeight) + 'px');
		}		
	}
	
	function show(cb){
		
		cb = cb || function(){};

		$('.stage').css('display','block').animate({
			height:(cache.windowHeight - contentHeight),
			width:(cache.windowWidth - contentNavWidth)		
		},500,'linear',function(){
			resizeEnable = true;
			cb();
		});		
		
	}
	
	function hide(cb){
		
		cb = cb || function(){};
				
		$('.stage').animate({
			height:20,
			width:20		
		},200,'linear',function(){
			resizeEnable = false;
			cb();
		});
		
	}
	
	init();
	
	return {
		show : show,
		hide : hide
	}
		
}();


var PageNavEffect = function(){

	// current index
	var navIndex = 0 ;
	
	var currentIndex = null;
	
	// remember add Nav settings
	var optionsList = [];
	
	var ConstentPadding = 20;
	
	function init(){
		
		$(window).bind('resize',resize);		
				
		$('.nav li').live('click',function(){
			
			var index = $(this).attr('n');
			
			currentIndex = index;
						
			if($('.start').css('display') != 'none'){
				
				$('.start').css('display','none');
				
				$(this).addClass('select');
				
				EffectStage.show(function(){
					
					$('#stage_'+index).css('display','block')
					.width($('.stage').width() -ConstentPadding + 'px')
					.height($('.stage').height() -ConstentPadding + 'px')
					.css({'left':'10px','top':'10px'});			
					
					$('ul.nav').attr('current',index);
					optionsList[index].open();
					
				})
				
				
			}else{
				
				var oldNavIndex = $('ul.nav').attr('current');
				if(oldNavIndex == index){			
					return;
				}				

				
				$('#nav_'+oldNavIndex).removeClass('select');
				$('#stage_'+oldNavIndex).css('display','none');	
					
				$(this).addClass('select');
				
				optionsList[oldNavIndex].close();
				
				if(optionsList[oldNavIndex].clear){
					$('#stage_'+oldNavIndex).html('');
				}				
				
				EffectStage.hide(function(){					
					EffectStage.show(function(){

						$('#stage_'+index).css('display','block')
						.width($('.stage').width() -ConstentPadding + 'px')
						.height($('.stage').height() -ConstentPadding + 'px')
						.css({'left':'10px','top':'10px'});	

						$('ul.nav').attr('current',index);
						
						optionsList[index].open();
							
					});				
				});				
	
			}		
		});		
		
	}
	
	function resize(){
		
		$('#stage_'+currentIndex).width($('.stage')
			.width() -ConstentPadding + 'px')
			.height($('.stage').height() -ConstentPadding + 'px')
			.css({'left':'10px','top':'10px'});	
		
	}
	
	function addStageDom(options){
		$('ul.nav').append('<li id="nav_'+navIndex+'" n="'+navIndex+'">'+options.title+'</li>');
		$('div.stage').append('<div class="demo" id="stage_'+navIndex+'" n="'+navIndex+'" ></div>');				
	}
	
	function addNavBar(options){
		var settings = {
			"title":"Navigation Bar title",
			"open":function(){},
			"close":function(){},
			// clear demo dom when this stage closed
			"clear":false
		};
		options = options || {};
		$.extend(settings,options);				
		addStageDom(settings);
		optionsList[navIndex] = settings;
		navIndex ++;		
		
	}
	
	function getCurrentIndex(){
		return currentIndex;
	}

	
	init();
	
		
	return {
		addNavBar : addNavBar,
		getCurrentIndex : getCurrentIndex
	}
	
}();


var Sticky = (function(){
	
	// zindex for different sticky		
	var zIndex = 1;
	
	var StickyBuild = true;
	
	var domId,randLeftMaxNum,randTopMaxNum;
	
	// for unique sticky 
	var stickyIndex = 1;
		
	var addStickyList = {};	
	
	var searchList = [];	

	function randLeftNum(){
		var m = 0,n = randLeftMaxNum || 180;
		return parseInt(Math.random()*(n-m)+m);
	}

	function randTopNum(){
		var m = 0,n = randTopMaxNum || 300;
		return parseInt(Math.random()*(n-m)+m);		
	}

	function modifiedString(date)
	{
		if(!date){
			date = new Date(); 
		}
	    return 'Last Modified: ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	}
	
	var inputFocus = null;
	
	function init(ID){
		
	
		if(!$("#addBtn")[0]){
			
			domId = ID;
			randLeftMaxNum = $(domId).width() - 180;
			randTopMaxNum = $(domId).height() - 220;			
			
			$("<input type='button' id='addBtn' value='Add new sticky' /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' id='searchText' value='' /> <input type='button' id='searchBtn' value='search' /><div class='shadow'><span></span></div>").appendTo(domId);
			
			$("#addBtn").live('click',function(){				
				addSticky({},true)
			});
			
			$("#searchBtn").live('click',function(){
				if($("#searchText").val() != ''){
					searchSticky();				
					ODBO.search($("#searchText").val());
				}
			});
			
			$('.shadow span').live('click',function(){
				$(this).parent().css('display','none');
			});	
			
			$("#searchText").live('focus',function(){
				inputFocus = true;
			}).live('blur',function(){
				inputFocus = null;
			});
			
			$(document).bind('keydown',function(e){
				if(e.keyCode == '13'){
					if($("#addBtn").parent().css('display') != 'none' && $("#searchText").val() != '' && inputFocus){
						searchSticky();				
						ODBO.search($("#searchText").val());
						$("#searchText").blur();						
					}
				}
				
				if(e.keyCode == '27'){
					if($('.shadow').css('display') != 'none'){
						$('.shadow').css('display','none')
					}					
				}
			}).bind('resize',function(){
				
				if($('.shadow').css('display') == 'none'){
					
					
				}
				
			});
			
			StickyBuild = false;
			
			ODBO.load(Sticky);								
			
		}		

	
				
	}

	
	function timeUPdate(id){
		$(id).find('.sfooter').html(modifiedString());
	}
	
	function addSticky(options,flag){
		
		var settings = {
			id : stickyIndex,
			text : '',
			zIndex : zIndex,
			left : randLeftNum() + 'px',
			top : randTopNum() + 'px',
			timestamp : modifiedString()
		};
		
		if(options.id >= stickyIndex){
			stickyIndex = options.id;
		}
		if(options.zIndex >= zIndex){
			zIndex = options.zIndex;
		}		

		$.extend(settings,options);
		
		if(settings.id >= stickyIndex){
			stickyIndex = settings.id;
		}		
		
		var str = '<div class="sticky" n="'+settings.id+'" style="z-index:'+settings.zIndex+'; left:'+settings.left+'; top:'+settings.top+'" id="stickyId_'+settings.id+'"><h2></h2><span class="close"></span><section class="edit" contenteditable="true">'+settings.text+'</section><footer class="sfooter">'+settings.timestamp+'</footer></div>';
		$(domId).append(str);	
		
		var currentAddId = "#stickyId_"+settings.id;	

		$(currentAddId).draggable({ 
			containment: 'parent',
			handle : 'h2',
			opacity: 0.85,
			start : function(e){
				$(this).css('zIndex',zIndex);
				zIndex ++;
				ODBO.update({
					id : $(this).attr("n"),
					text : $(this).find('.edit').html(),
					timestamp : modifiedString(),
					zIndex : $(this).css("zIndex"),
					left : $(this).css("left"),
					top : $(this).css("top")
				});
				timeUPdate(currentAddId);				
			},
			stop:function(e){
				ODBO.update({
					id : $(this).attr("n"),
					text : $(this).find('.edit').html(),
					timestamp : modifiedString(),
					zIndex : $(this).css("zIndex"),
					left : $(this).css("left"),
					top : $(this).css("top")
				});
				timeUPdate(currentAddId);
				
			}
		}).bind('click',function(){
			$(this).css('zIndex',zIndex);
			zIndex ++;	
			ODBO.update({
				id : $(this).attr("n"),
				text : $(this).find('.edit').html(),
				timestamp : modifiedString(),
				zIndex : $(this).css("zIndex"),
				left : $(this).css("left"),
				top : $(this).css("top")
			});
			timeUPdate(currentAddId);
		}).find(".edit").bind("keyup",function(){
			ODBO.update({
				id : $(this).parent().attr("n"),
				text : $(this).html(),
				timestamp : modifiedString(),
				zIndex : $(this).parent().css("zIndex"),
				left : $(this).parent().css("left"),
				top : $(this).parent().css("top")
			});
			timeUPdate(currentAddId);			
		}).parent().find('.close').bind("click",function(){		
			$(this).parent().hide('slow',function(){
				searchList.pop();
				console.log(searchList)
				if(searchList.length <= 0 && $('.shadow').css('display') != 'none'){
					$('.shadow').css('display','none')
				}
				$(this).remove();
				ODBO.del(settings.id);
			});			
		});	

		addStickyList[settings.id] = settings;

		zIndex ++;
		stickyIndex ++;
		
		if(flag){	
			ODBO.add(settings);	
		}		
		
	}
	
	
	function searchSticky(){
		
		
		$('.shadow').css({'display':'block','width':$('.stage').width(),'height':$('.stage').height(),'zIndex':zIndex});
		
		zIndex ++;		
		
	}


	
	var ODBO = (function(){
		
		var ODB = null;
		try{
			if(window.openDatabase){
				//1.database name 2.database version 3.display name 4.estimated size
				ODB = openDatabase("Html5Notes","1.0","Html5DataBase",50000);
				if(!ODB){
					alert("Failed to open the database.");
				}
			}else{
				alert("Couldn't open the database. Please try another browser.");
			}
		}catch(e){}
		
		var idIndex = 0;

		function load(cb){

			ODB.transaction(function(tx){
				tx.executeSql("SELECT * FROM WebKitTest",[],function(tx,o){
					
					if(o.rows.length == 0){					
						cb.add();
					}
					
					for(var i=0 ,l = o.rows.length ; i < l; i++){

						var row = o.rows.item(i);
						if(row["id"] > idIndex){
							idIndex = row["id"];
							idIndex ++;
						}	
						cb.add(row)										
					}					

				},function(tx,e){
					tx.executeSql("CREATE TABLE WebKitTest (id REAL UNIQUE, text TEXT, timestamp TEXT, zIndex REAL, left REAL, top REAL)",function(){
						alert(234)
					});
				});
			});

		}

		function updateItem (options) {
			console.log(options);
			ODB.transaction(function(tx){ //id, text, timestamp, zIndex, left, top
				tx.executeSql("UPDATE WebKitTest SET text = ?, timestamp = ?, zIndex = ?, left = ? , top = ? WHERE id = ?", [options.text, options.timestamp, options.zIndex, options.left, options.top, options.id],function(tx,o){
					console.log([tx,o]);
				});
			},function(tx,error){
				alert("Error Update Item!");
				console.log(error);
			});	
		}

		function addItem(options){
			ODB.transaction(function(tx){
				tx.executeSql("INSERT INTO WebKitTest (id, text, timestamp, zIndex, left, top) VALUES (?,?,?,?,?,?)",[options.id, options.text, options.timestamp, options.zIndex, options.left, options.top],function(tx,o){});
			},function(tx,error){
				alert("Error Add Item!");
				console.log([error,'add Error']);
			});		
		}

		function deleteItemById(id){
			ODB.transaction(function(tx){
				tx.executeSql("DELETE FROM WebKitTest WHERE id = ?",[id]);
			},function(tx,error){
				alert("Error Delete Item!");
				console.log(error);
			});
		}

		function searchItemByStr(str){
				ODB.transaction(function(tx){
					tx.executeSql("SELECT id, text FROM WebKitTest WHERE text LIKE '%"+str+"%' ",[],function(tx,o){				
						for(var i=0 ,l = o.rows.length ; i < l; i++){
							var row = o.rows.item(i);
							zIndex++;
							$('#stickyId_'+row['id']).css('zIndex',zIndex);
							searchList.push(row['id']);
						}						
											
					});					
				},function(tx,error){
					console.log([error,'search Error']);
				});	
		}

		function dropTable(table){
			ODB.transaction(function(tx){
				tx.executeSql("DROP TABLE "+table);
			},function(tx,error){
				alert("Error Drop Table!");
				console.log(error);
			});		
		}

		function showTable(json){
			console.log(json)
			var str = "<table>";		
			for(var i=0 , l= json.length; i<l; i++){
				str += "<tr><td>"+json[i].id+"</td><td>"+json[i].text+"</td><td>"+json[i].timestamp+"</td><td>"+json[i].zIndex+"</td><td>"+json[i].left+"</td><td>"+json[i].top+"</td></tr>";
			}
			str += "</table>";
			$('div.test').html(str);		
		}

		function getIdIndex(){
			return idIndex;
		}
		


		return {
			getIdIndex : getIdIndex,
			load : load,
			update : updateItem,
			add : addItem,
			del : deleteItemById,
			drop : dropTable,
			search : searchItemByStr
		}	
		
	})();
	

	return {
		
		init : init,
		add : addSticky
		
	}
	
	
})();



var ImageEffect = function(){
	
	var _self = this;
	
	var list = []
	
	var moveEffectEvent = '';

	
	function getRandom(flag){
		
		switch(flag){
			case 1 :
				// -30 ~ 30
				return Math.floor(Math.random()*60) - 30;
			break;
			case 2 :
				// -10 ~ 10
				return Math.floor(Math.random()*20) - 10;				
			break
		}
	}
	

	
	function UIReset(){				
		$('.imageContent').width($('.demo').width() - 20 + 'px').height($('.demo').height());
	};
	
	function bind(){
		
		var defIndex = 100;
		
		$('.imageContent ul').bind('mouseover',function(){
			if(moveEffectEvent){
				window.clearInterval(moveEffectEvent)	
			}
		}).bind('mouseout',function(){
			if($('.shadow').css('display') == 'none'){
				effect();
			}				
		});
		
		$(window).bind('resize',function(){
			UIReset();
		});
		
		/*
		
		$('.imageContent li').bind('click',function(){	
			
			if(moveEffectEvent){
				window.clearInterval(moveEffectEvent)	
			}						
			
			var parentUL = $(this).parent();
			
			if(parentUL.attr('current') != ''){
				var oldImg = $('.imageContent li[n='+parentUL.attr('current')+']');
				oldImg.css({
					'-moz-transform':'rotate('+oldImg.attr("rad1")+'deg) skew('+oldImg.attr("rad2")+'deg, '+oldImg.attr("rad3")+'deg)',
					'-webkit-transform':'rotate('+oldImg.attr("rad1")+'deg) skew('+oldImg.attr("rad2")+'deg, '+oldImg.attr("rad3")+'deg)',
					'-o-transform':'rotate('+oldImg.attr("rad1")+'deg) skew('+oldImg.attr("rad2")+'deg, '+oldImg.attr("rad3")+'deg)',
					'width':'240px',
					'height':'150px',						
				}).find('img').css({
					'width':'240px',
					'height':'150px'
				});
			
			}
			defIndex ++ ;
			parentUL.attr('current',$(this).attr('n'));
			$(this).css({
				'-webkit-transform':'rotate(0deg) skew(0deg, 0deg)',
				'-moz-transform':'rotate(0deg) skew(0deg, 0deg)',
				'-o-transform':'rotate(0deg) skew(0deg, 0deg)',
				'width':'480px',
				'height':'300px',
				'z-index':defIndex
			}).find('img').css({
				'width':'480px',
				'height':'300px'
			});
			
			$('.shadow').css({'display':'block','width':$('.stage').width(),'height':$('.stage').height()});
											
		});
		*/
		
	}

	function effect(){
		
		moveEffectEvent = window.setInterval(
			
			function(){
				
				var currentScrollLeft = $('.imageContent').scrollLeft();
									
				if( currentScrollLeft >= ($('.imageContent ul').width() - $('.imageContent').width()*2 + 120)){						
					$('.imageContent').scrollLeft(0);
					return;
				}
				
				$('.imageContent').scrollLeft(currentScrollLeft + 2);

				
			},1
		);

		
	}			


	this.add = function(s){
		list.push({"l":s});
	};
				
	this.init = function(){
		
		UIReset();
		
		var str ='<ul>';
		for(var i=0; i< list.length; i++){
			var rad1 = getRandom(1);
			var rad2 = getRandom(2);
			var rad3 = getRandom(2);					
			str += '<li style="left:'+(i*150)+'px; top:50px; -moz-transform:rotate('+rad1+'deg) skew('+rad2+'deg, '+rad3+'deg); -webkit-transform:rotate('+rad1+'deg) skew('+rad2+'deg, '+rad3+'deg); -o-transform:rotate('+rad1+'deg) skew('+rad2+'deg, '+rad3+'deg); " n="'+i+'" rad1="'+rad1+'" rad2="'+rad2+'" rad3="'+rad3+'" left="'+(i*150)+'" ><img src="'+list[i].l+'"  width="240" height="150" /></li>';	
		}
		str += '</ul>';
		str += str;
		$('.imageContent').html(str);
		$('.imageContent ul').width(240*list.length + 'px');
		
		$('.imageContent ul li').draggable();
		
		bind();				
		//effect();				
	}
	

}
/*
var test = new ImageEffect();
test.add('images/image1.jpg');
test.add('images/spice.jpg');
test.add('images/image1.jpg');
test.add('images/image1.jpg');
test.add('images/image1.jpg');
test.add('images/image1.jpg');
test.add('images/image1.jpg');
test.add('images/spice.jpg');
test.add('images/image1.jpg');
test.add('images/spice.jpg');
test.add('images/image1.jpg');
test.add('images/image1.jpg');
test.add('images/image1.jpg');
test.add('images/image1.jpg');
test.add('images/image1.jpg');
test.add('images/spice.jpg');		
test.init();
*/
