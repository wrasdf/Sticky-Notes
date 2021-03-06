﻿$(function(){
		

		PageNavEffect.addNavBar({title:'Open DataBase',open:function(){	
			Sticky.init("#stage_"+PageNavEffect.getCurrentIndex());
		},close:function(){}});
		PageNavEffect.addNavBar({title:'Canvas',open:function(){
			$("#stage_"+PageNavEffect.getCurrentIndex()).html('No Demo here! Just For Show!');
		}});


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
	
	var domId,randLeftMaxNum,randTopMaxNum;
	
	// for unique sticky 
	var stickyIndex = 1;
		
	var addStickyList = {};	
	
	var searchList = [];
	
	var version = '1.1.0';
	
	var colorList = [
		{c:"red",l:"3",b:"#f00",t:'Urgent'},
		{c:"yellow",l:"2",b:"#ff0",t:'Normal'},			
		{c:"gray",l:"1",b:"#ccc",t:'Low'}
	];		

	function randLeftNum(){
		var m = 0,n = randLeftMaxNum || 180;
		return parseInt(Math.random()*(n-m)+m);
	}

	function randTopNum(){
		var m = 25,n = randTopMaxNum || 300;
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
			
			var str = "<input type='button' id='addBtn' value='Add new note' /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
				str += "<input type='text' id='searchText' value='' /> <input type='button' id='searchBtn' value='Search' />&nbsp;&nbsp;&nbsp;&nbsp;"		
				str += "<input type='button' id='canvasBtn' value='Statistic' />&nbsp;&nbsp;&nbsp;&nbsp;";
				str += "<input type='button' id='deleteAllBtn' value='Delete All' style='display:none' />";
				str += "<div class='shadow'><span></span></div>";			
			//$("<input type='button' id='addBtn' value='Add new note' /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' id='searchText' value='' /> <input type='button' id='searchBtn' value='Search' />&nbsp;&nbsp;&nbsp;&nbsp;       <input type='button' id='canvasBtn' value='Statistic' />&nbsp;&nbsp;&nbsp;&nbsp;  <input type='button' id='deleteAllBtn' value='Delete All' style='display:none' /><div class='shadow'><span></span></div>").appendTo(domId);
			
				str += "<div class='dialog'>";
				str += "<div class='title'><span class='t'></span><a href='javascript:;' class='dialogClose'></a></div><div class='dialogContent'>";
				str += "<p style='display:none;'>There is No note here.</p>";
				str += "</div></div>";				
			
			$(str).appendTo(domId);
				
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
				searchList = [];
				
				hideCanvas();
				
			});	
			
			$('#deleteAllBtn').live('click',function(){
				deleteAllNotes();
			});
			
			$("#searchText").live('focus',function(){
				inputFocus = true;
			}).live('blur',function(){
				inputFocus = null;
			});
			
			$("#canvasBtn").live('click',function(){
				canvasPie();
			});
			
			$('.dialog a.dialogClose').live('click',function(){
				dialoghide();				
			});
			
			$(document).bind('keydown',function(e){
				if(e.keyCode == '13'){
					if($("#addBtn").parent().css('display') != 'none' && $("#searchText").val() != '' && inputFocus){
						searchSticky();		
						try{		
							ODBO.search($("#searchText").val());
						}catch(e){}
						$("#searchText").blur();						
					}
				}
				
				if(e.keyCode == '27'){
					if($('.shadow').css('display') != 'none'){
						$('.shadow').css('display','none');
						searchList = [];
						
						hideCanvas();
						
						if($('#searchText')[0]){
							$('#searchText').focus();
						}
																	
					}					
				}
			})
			
			$(window).bind('resize',function(){
				if($('.shadow').css('display') != 'none'){					
					$('.shadow').css({"width":$('.stage').width(),"height":$('.stage').height()});
				}				
			});
			try{
				ODBO.load(Sticky);
			}catch(e){}
											
			
		}				
	}

	
	function hideCanvas(){
		
		if($('.dialog').css('display') != 'none'){
			$('.dialog').css('display','none').find('canvas').remove();
			canvasIndex ++;							
		}		
		
		$('.dialog p').css('display','none');
		
	}
	
	var canvasIndex = 0;
	
	function dialogShow(options){
		
		/*
		options = {
			title : '',
			cb : cb		
		}
		*/
		
		var stageDom = $("#stage_"+PageNavEffect.getCurrentIndex());
		
		searchSticky();
		
		$('.dialog').css({'display':'block','width':'5px','height':'5px','left':'5px','top':'5px'}).animate(
			{
				"width":"420px",
				"height":"300px",
				"left":parseInt((stageDom.width() - 420)/2) + 'px',
				"top" : parseInt((stageDom.height() - 330)/2) + 'px'
			},300,"linear",function(){				
				$('.dialog .t').html(options.title);	
				options.cb();
				
			});		
		
	}
	
	
	function dialoghide(cb){
		
		
		$('.shadow').css('display','none');		
		hideCanvas();
		
		if(cb){
			cb();
		}
		
		
	}
		
	
	function canvasPie(){
		
		var options = {
			title : 'Sticky Notes Statistics',
			cb : function(){
				$('.dialog p').css('display','block').html('loading...');
				$("<canvas style='position:absolute;display:none;' id='pieDom"+canvasIndex+"' class='pieDom' width='408' height='260' >[No canvas support]</canvas>").appendTo($('.dialog div.dialogContent'));
				try{					
					ODBO.searchLevel(canvasShow);
				}catch(e){}				
			}
		}
		
		dialogShow(options);
				
	}
	
	function canvasShow(json){

        var pie1 = new RGraph.Pie('pieDom'+canvasIndex, json.arr); // Create the pie object
		pie1.Set('chart.labels', json.labels);
        pie1.Set('chart.gutter', 35);
       // pie1.Set('chart.title', "Sticky Notes Statistics");
        pie1.Set('chart.shadow', true);		
        pie1.Set('chart.highlight.style', '3d'); // Defaults to 3d anyway; can be 2d or 3d
		pie1.Set('chart.colors', ['rgb(255,0,0)', '#ff0', '#ccc', 'rgb(0,0,255)', 'rgb(255,255,0)', 'rgb(0,255,255)', '#f00', '#ff0', 'black', 'white']);
        if (!RGraph.isIE8()) {
            pie1.Set('chart.zoom.hdir', 'up');
            pie1.Set('chart.zoom.vdir', 'up');
            pie1.Set('chart.contextmenu', [['Zoom in', RGraph.Zoom]]);
        }
		pie1.Set('chart.value.text',true);
        pie1.Set('chart.linewidth', 3);
        pie1.Set('chart.labels.sticks', true);
        pie1.Set('chart.strokestyle', 'white');
 		

        pie1.Draw();
		$('.dialog p').css('display','none');		
		$('#pieDom'+canvasIndex).css({'display':'block','left':1 + 'px'});		

		
	}
	
	function timeUPdate(id){
		$(id).find('.sfooter').html(modifiedString());
	}
	
	function addColorSetting(id){
				
		var str ='';
		
		$.each(colorList,function(index,value){
			
			str += '<li l="'+value.l+'" class="'+value.c+'" title="'+value.t+'" ></li>'
			
		});
		
		$(id + ' ul').html(str);
		
		$(id + ' ul li').bind('click',function(){
			var color = $(this).attr('l');
			var sLeve = $(this).parent().parent().parent();	
			
			if(sLeve.attr('l') == color){
				return;
			}
			sLeve.attr('l', color);		
			
			$(id).removeClass('urgent').removeClass('normal').removeClass('down');
			if(color == '3'){
				$(id).addClass('urgent');
				$(this).parent().parent().css('background','#f00').parent().css({'background':'#fb5f5f','color':'#fff'}).find('.sfooter').css({'background':'#fd4f4f','color':'#fff'});
				
			}else if(color == '1'){
				$(id).addClass('normal');	
				$(this).parent().parent().css('background','#ccc').parent().css({'background':'#e8e7e7','color':'#000'}).find('.sfooter').css({'background':'#d8d6d6','color':'#000'});
			
			}else if(color == '2'){
				$(id).addClass('down');	
				$(this).parent().parent().css('background','#feea3d').parent().css({'background':'#FEF49C','color':'#000'}).find('.sfooter').css({'background':'#fcee6f','color':'#000'});				
			}
			
			try{
				ODBO.update({
					id : $(id).attr("n"),
					text : $(id).find('.edit').html(),
					timestamp : modifiedString(),
					zIndex : $(id).css("zIndex"),
					left : $(id).css("left"),
					top : $(id).css("top"),
					level : $(id).attr('l'),
					sw : $(id).width(),
					sh : $(id).height(),
					ch : $(id).height() - 10 -18 -20 
				});				
			}catch(e){}
				
		});
		
	}
	
	function showDeleteBtn(){
		
		if(!$('#deleteAllBtn')[0] || $('#deleteAllBtn').css('display') == 'none'){
			$('#deleteAllBtn').show();
		}
		
	}	
		
	function addSticky(options,flag){
		
		var settings = {
			id : stickyIndex,
			text : '',
			zIndex : zIndex,
			left : randLeftNum(),
			top : randTopNum(),
			timestamp : modifiedString(),
			level : 2,
			sw : 180,
			sh : 220,
			ch : 170
		};
		
		if(options && options.id && options.id >= stickyIndex){
			stickyIndex = options.id;
		}
		if(options && options.zIndex && options.zIndex >= zIndex){
			zIndex = options.zIndex;
		}		

		$.extend(settings,options);
		
		if(settings.id >= stickyIndex){
			stickyIndex = settings.id;
		}	
			
		var colorClass = 'normal';
		if(settings.level == 1){
			colorClass = 'down';
		}else if(settings.level == 2){
			colorClass = 'normal';
		}else if(settings.level == 3){
			colorClass = 'urgent';
		}
		
		var str = '<div class="sticky '+colorClass+'" l="'+settings.level+'" n="'+settings.id+'" style="width:5px; height:5px  ;z-index:'+settings.zIndex+';" id="stickyId_'+settings.id+'"><h2><div class="o" title="Set Level" ></div><ul></ul></h2><span class="close"></span><section class="edit" contenteditable="true" style="height:'+settings.ch+'px">'+settings.text+'</section><footer class="sfooter">'+settings.timestamp+'</footer></div>';
		$(domId).append(str);
	
		
		var currentAddId = "#stickyId_"+settings.id;
		
		// add color setting for note	
		addColorSetting(currentAddId);
		
		// show delete all button
		showDeleteBtn();
		
		$(currentAddId).animate({
		    width: settings.sw ,
		    height: settings.sh,
			left : settings.left,
			top : settings.top
		  }, 200, 'linear').draggable({ 
			containment: 'parent',
			handle : 'h2',
			opacity: 0.85,
			start : function(e){
				$(this).css('zIndex',zIndex);
				zIndex ++;
				try{
					ODBO.update({
						id : $(this).attr("n"),
						text : $(this).find('.edit').html(),
						timestamp : modifiedString(),
						zIndex : $(this).css("zIndex"),
						left : $(this).css("left"),
						top : $(this).css("top"),
						level : $(this).attr('l'),
						sw : $(this).width(),
						sh : $(this).height(),
						ch : $(this).height() - 10 -18 -20						
					});					
				}catch(e){}

				timeUPdate(currentAddId);				
			},
			stop:function(e){
				try{
					ODBO.update({
						id : $(this).attr("n"),
						text : $(this).find('.edit').html(),
						timestamp : modifiedString(),
						zIndex : $(this).css("zIndex"),
						left : $(this).css("left"),
						top : $(this).css("top"),
						level : $(this).attr('l'),
						sw : $(this).width(),
						sh : $(this).height(),
						ch : $(this).height() - 10 -18 -20						
					});					
				}catch(e){}
				timeUPdate(currentAddId);				
			}
		}).bind('click',function(){
			$(this).css('zIndex',zIndex);
			zIndex ++;
			try{
				ODBO.update({
					id : $(this).attr("n"),
					text : $(this).find('.edit').html(),
					timestamp : modifiedString(),
					zIndex : $(this).css("zIndex"),
					left : $(this).css("left"),
					top : $(this).css("top"),
					level : $(this).attr('l'),
					sw : $(this).width(),
					sh : $(this).height(),
					ch : $(this).height() - 10 -18 -20					
				});				
			}catch(e){}	
			timeUPdate(currentAddId);
		}).resizable({
			minWidth:"180",
			minHeight:"220",
			start:function(e){
				$(this).css('zIndex',zIndex);
				zIndex ++;	
				try{
					ODBO.update({
						id : $(this).attr("n"),
						text : $(this).find('.edit').html(),
						timestamp : modifiedString(),
						zIndex : $(this).css("zIndex"),
						left : $(this).css("left"),
						top : $(this).css("top"),
						level : $(this).attr('l'),
						sw : $(this).width(),
						sh : $(this).height(),
						ch : $(this).height() - 10 -18 -20					
					});				
				}catch(e){}							
			},
			resize:function(e){
				$(this).find('.edit').height($(this).height() - 10 -18 -20);
				try{
					ODBO.update({
						id : $(this).attr("n"),
						text : $(this).find('.edit').html(),
						timestamp : modifiedString(),
						zIndex : $(this).css("zIndex"),
						left : $(this).css("left"),
						top : $(this).css("top"),
						level : $(this).attr('l'),
						sw : $(this).width(),
						sh : $(this).height(),
						ch : $(this).height() - 10 -18 -20					
					});				
				}catch(e){}				
			},
			stop:function(e){
				$(this).find('.edit').height($(this).height() - 10 -18 -20);
				try{
					ODBO.update({
						id : $(this).attr("n"),
						text : $(this).find('.edit').html(),
						timestamp : modifiedString(),
						zIndex : $(this).css("zIndex"),
						left : $(this).css("left"),
						top : $(this).css("top"),
						level : $(this).attr('l'),
						sw : $(this).width(),
						sh : $(this).height(),
						ch : $(this).height() - 10 -18 -20					
					});				
				}catch(e){}				
			}
		}).find(".edit").bind("keyup",function(){
			// edit bind function
			try{
				ODBO.update({
					id : $(this).parent().attr("n"),
					text : $(this).html(),
					timestamp : modifiedString(),
					zIndex : $(this).parent().css("zIndex"),
					left : $(this).parent().css("left"),
					top : $(this).parent().css("top"),
					level : $(this).parent().attr('l'),
					sw : $(this).parent().width(),
					sh : $(this).parent().height(),
					ch : $(this).parent().height() - 10 -18 -20					
				});				
			}catch(e){}

			timeUPdate(currentAddId);
						
		}).parent().find('.close').bind("click",function(){	
			
			// close sticky notes function	
			deleteNoteById(settings.id)
					
		}).parent().find('.o').bind('click',function(){
			
			var ulDom = $(this).parent().find('ul');
			if(ulDom.css('display') == 'none'){
			
				ulDom.css({"width":"2px","height":"2px","display":"block"}).animate({
					"width":"60px","height":"15px", "left":"15px"
				},300,"linear",function(){
					ulDom.css({'opacity':1,"display": "block"})
				});
				
			}else{
				
				ulDom.animate({
					"width":"2px","height":"2px",'opacity':0 , "left": "0px"
				},300,"linear",function(){
					ulDom.css({'opacity':1,"display": "none"})
				});
								
			}
			
		});	

		addStickyList[settings.id] = settings;

		zIndex ++;
		stickyIndex ++;
		
		if(flag){
			try{
				ODBO.add(settings);
			}catch(e){}					
		}	
	
	}
	
	function deleteNoteById(id){	
		
		$("#stickyId_"+id).hide('slow',function(){
			searchList.pop();
			if(searchList.length <= 0 && $('.shadow').css('display') != 'none'){
				$('.shadow').css('display','none')
			}
			$(this).remove();
			
			try{
				ODBO.del(id);
			}catch(e){}		
				
			delete addStickyList[id];			
			for(var i in addStickyList){
				if(i){
					return;
				}
			}
						
			$('#deleteAllBtn').css('display','none');		
				
		});	

			
	}
	
	function deleteAllNotes(){	
		
		if(window.confirm("Are you sure , you want to delete all notes?")){
		
			for(var i in addStickyList){
				deleteNoteById(i);
			}
		
			$('#deleteAllBtn').css('display','none');
			
		}else{
			return
		}
		
	}
	
	function searchSticky(){	
		$('.shadow').css({'display':'block','width':$('.stage').width(),'height':$('.stage').height(),'zIndex':zIndex});
		zIndex ++;
	}
	
	function searchNoItemShow(){
		
		var options = {
			title : 'Search Notes',
			cb : function(){
				$('.dialog p').css('display','block').html('Sorry,there is no note you want.');			
			}
		}		
		dialogShow(options);		
	
	}
	
	var LSO = (function(){
		
		if(!window.localStorage){
			alert("Your browser didn't support localStorage. Please try another browser.");
			return;
		}
		
		function set(n,v){
			localStorage.setItem(n,v); 
		}
		
		function get(n){
			return localStorage.getItem(n); 
		}
		
		function remove(n){
			localStorage.removeItem(n);  
		}
		
		return {
			
			set : set,
			get : get,
			remove : remove
			
		}
		
	})();
	
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
		

		//dropTable('WebkitTest');
		
		var idIndex = 0;

		function load(cb){
			
			if(!LSO.get('version')){
				LSO.set('version',version);	
			}
			
			if(LSO.get('version') != version){
				dropTable('WebKitTest');
				LSO.set('version',version);
			}
			
			ODB.transaction(function(tx){
				tx.executeSql("SELECT * FROM WebKitTest",[],function(tx,o){
				
					if(o.rows.length == 0){					
						cb.add({},true);
						return;
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
					tx.executeSql("CREATE TABLE WebKitTest (id REAL UNIQUE, text TEXT, timestamp TEXT, zIndex REAL, left REAL, top REAL, level REAL, sw REAL, sh REAL ,ch REAL)" ,[], function(){
						cb.add({},true);
					});
				});
			});	
				
			
		}

		function updateItem (options) {
			ODB.transaction(function(tx){ //id, text, timestamp, zIndex, left, top
				tx.executeSql("UPDATE WebKitTest SET text = ?, timestamp = ?, zIndex = ?, left = ? , top = ? , level = ?, sw = ?, sh = ? , ch = ? WHERE id = ?", [options.text, options.timestamp, options.zIndex, options.left, options.top, options.level, options.sw, options.sh, options.ch, options.id]);
			},function(tx,error){
				alert("Error Update Item!");
			});	
		}

		function addItem(options){
			ODB.transaction(function(tx){
				tx.executeSql("INSERT INTO WebKitTest (id, text, timestamp, zIndex, left, top, level, sw, sh, ch) VALUES (?,?,?,?,?,?,?,?,?,?)",[options.id, options.text, options.timestamp, options.zIndex, options.left, options.top, options.level,options.sw, options.sh, options.ch],function(tx,o){});
			},function(tx,error){
				alert("Error Add Item!");
			});		
		}

		function deleteItemById(id){
			ODB.transaction(function(tx){
				tx.executeSql("DELETE FROM WebKitTest WHERE id = ?",[id]);
			},function(tx,error){
				alert("Error Delete Item!");
			});
		}
		
		function deleteTable(table,callSuccess,callError){
			ODB.transaction(function(tx){
				tx.executeSql("DELETE FROM " + table,[],function(tx,o){
					callSuccess(o);
				});
			},function(tx,error){
				if(callError){
					callError(error);
				}
			});			
		}

		function searchItemByStr(str){
				ODB.transaction(function(tx){
					tx.executeSql("SELECT id, text FROM WebKitTest WHERE text LIKE '%"+str+"%' ",[],function(tx,o){				
						if(o.rows.length == 0){						
							searchNoItemShow();							
							return;
						}
						for(var i=0 ,l = o.rows.length ; i < l; i++){
							var row = o.rows.item(i);							
							$('#stickyId_'+row['id']).css('zIndex',zIndex);
							zIndex++;
							searchList.push(row['id']);
						}						
											
					});					
				});	
		}
		
		function searchLevel(cb){
			ODB.transaction(function(tx){
				tx.executeSql("SELECT id, level FROM WebKitTest",[],function(tx,o){
					
					if(o.rows.length == 0){
						$('.dialog p').css('display','block').html('There is No note here.');
						$('.dialog canvas').css('display','none');
						return;						
					}
					
					var json = {};	
					var l3 = 0,l2 = 0, l1 = 0;
					
					for(var i=0 , l= o.rows.length ; i< l ; i++){
						var row = o.rows.item(i);
						if(row['level'] == 1){
							l1 ++;
						}else if(row['level'] == 2){
							l2 ++;	
						}else if(row['level'] == 3){
							l3 ++;	
						}
					}
					json.arr = [l3,l2,l1];	
					json.labels = ["Urgent "+l3,"Normal "+l2,"Low "+l1];
					json.tooltips = ["Urgent "+l3,"Normal "+l2,"Low "+l1];					
					cb(json);
										
				});
			});
		}

		function dropTable(table){
			ODB.transaction(function(tx){
				tx.executeSql("DROP TABLE "+ table);
			},function(tx,error){
				alert("Error Drop Table!");
			});		
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
			search : searchItemByStr,
			searchLevel : searchLevel,
			deleteTable : deleteTable
		}	
		
	})();
	

	return {
		
		init : init,
		add : addSticky
		
	}
	
	
})();


function extend(target, source) {

	if (!target || !source) {
		return null;
	}

	for (var i in source) {
		target[i] = source[i]
	}

	return target;

}


extend(String.prototype, (function () {

	function encodeHTML() {
		var str = this.valueOf();
		str = str.replace(/\&/g, "&amp;");
		str = str.replace(/\>/g, "&gt;");
		str = str.replace(/\</g, "&lt;");
		str = str.replace(/\"/g, "&quot;");
		str = str.replace(/\'/g, "&#39;");
		return str;
	}

	function decodeHTML() {
		var str = this.valueOf();
		str = str.replace(/&amp;/g, "&");
		str = str.replace(/&gt;/g, ">");
		str = str.replace(/&lt;/g, "<");
		str = str.replace(/&quot;/g, '"');
		str = str.replace(/&#039;/g, "'");
		return str;
	}


	return {
		encodeHTML: encodeHTML,
		decodeHTML: decodeHTML
	}



})());




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
