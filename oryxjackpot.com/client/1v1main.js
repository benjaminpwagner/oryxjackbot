$(document).ready(function(){
	var winnerSfx = {
		sound:new Audio(),
		pauseTimeout:setTimeout(function(){})
	}
	var coinflipSfx = new Audio("/client/sfx/coinflip.mp3");
	var coins = [
		["#127","#003","Wizard_0"],
		["#127","#003","Priest_1"],
		["#127","#003","Archer_0"],
		["#127","#003","Rogue"],
		["#127","#003","Warrior_1"],
		["#127","#003","Paladin"],
		["#127","#003","Knight_1"],
		["#127","#003","Necromancer"],
		["#127","#003","assassin_0"],
		["#127","#003","Huntress"],
		["#127","#003","Trickster_0"],
		["#127","#003","Sorcerer_0"],
		["#127","#003","ninja_3"],
		["#127","#003","Mystic_0"],
		["#127","#003","Samurai"],
		["#400","#200","Beholder"],
		["#400","#200","Djinn"],
		["#400","#200","Ent God"],
		["#400","#200","Flying Brain"],
		["#400","#200","Ghost God"],
		["#400","#200","gship"],
		["#400","#200","Lord of the Lost Lands"],
		["#400","#200","Medusa"],
		["#400","#200","Oryx the Mad God 1"],
		["#400","#200","Slime God"],
		["#400","#200","Sprite God"],
		["#400","#200","levi"],
		["#400","#200","White Demon"],
		["#400","#200","hermit"],
		["#400","#200","sphinx"]
	];
	var stateCodes = ["Open","In Progress","Closed","Cancelled"];
	var countdownAnimation;
	function copyInv1v1(parent){
		parent.css('display','block');
		parent.children(".c1v1-wager-info").html("100 items left<span style='float:right;color:#ff7700;'>0F</span>");
		parent.children(".c1v1-select-inv").html($("#sidebar_inv").html());
		parent.children(".c1v1-wager-info").attr('stock',100);
		parent.children(".c1v1-wager-info").attr('Fval',0);
		parent.children(".c1v1-select-inv").children().remove(".zero-stock");
		parent.children(".c1v1-select-inv").children().toggleClass("cf-unchosen",true);
		parent.children(".c1v1-select-inv").children().toggleClass("inv-i",false);
		parent.children(".c1v1-select-inv").children().css('font-size','inherit');
		parent.children(".c1v1-next-stage").css('display','none');
		parent.children(".c1v1-chosen-inv").html("");
	}
	function move_item_inv_1v1(masterParent,parent,item,itemid,itemq,remq,amountLeft,moveTo,addClass,multi){
		var sfx = new Audio("client/sfx/Inventory_move_item.oga");sfx.volume = window.handleWindowMute(0.4);sfx.play();
		if(itemq == remq)item.remove();
		else setItemQuant(item,itemq-remq);
		var newFVAL = parseInt(masterParent.attr('Fval')) + remq*window.items[window.id_to_pos(itemid)].val*multi;
		masterParent.attr('Fval',newFVAL);
		masterParent.attr('stock',amountLeft - remq*multi);
		masterParent.html(masterParent.attr('stock') + " items left<span style='float:right;color:#ff7700;'>" + masterParent.attr('Fval')+"F</span>");
		var foundItem = moveTo.children("[itemid='"+itemid+"']");
		if(foundItem.length == 0)create1v1item(itemid,remq,moveTo,addClass);
		else setItemQuant(foundItem,parseInt(foundItem.attr('stock')) + remq);
		if(masterParent.attr('Ftarget')!==undefined){
			var target = parseInt(masterParent.attr('Ftarget'));
			parent.parent().children(".c1v1-next-stage").css('display',(Math.ceil(target*0.95) <= newFVAL&&newFVAL <= Math.floor(target*1.05))?"block":"none");
		}else{
			parent.parent().children(".c1v1-next-stage").css('display',(20 <= newFVAL)?"block":"none");
		}
		
	}
	function setItemQuant(item,newQuant){
		item.attr("stock",newQuant);
		item.children(".inv-i-quant").html(newQuant);
	}
	function create1v1item(id,q,moveTo,addclass){
		var block = "<div class='item "+addclass+"' stock='"+q+"' itemid='"+ id +"' style='background-image:url("+ window.items[window.id_to_pos(id)].image.src +");'><div class='inv-i-quant'>"+q+"</div><div class='inv-i-val'>"+(window.items[window.id_to_pos(id)].val)+"F</div></div>";
		moveTo.html(moveTo.html() + block);
	}
	function undisableChooseCoins(){
		$(".c1v1-cf-choose-coin").each(function(){
			if(!$(this).hasClass('disabled-choose-coin')){
				$(this).prop('disabled',false);
				$(this).removeClass('selected-coin-button');
			}
		})
	}

	$(document).on('click', '.1v1-choose-gm', function() {
		$(this).parent().css('display','none');
		copyInv1v1($("#"+$(this).attr('goto')));
	})

	$(document).on('click', '.cf-unchosen', function() {
		var masterParent = $(this).parent().parent().children('.c1v1-wager-info');
		var amountLeft = parseInt(masterParent.attr('stock'));
		if(amountLeft > 0){
			var itemID = parseInt($(this).attr('itemid'));
			var itemQ = parseInt($(this).attr('stock'));
			var bigQ = keyDown[16]?Math.min(itemQ,amountLeft):1;
			move_item_inv_1v1(masterParent,$(this).parent(),$(this),itemID,itemQ,bigQ,amountLeft,$(this).parent().parent().children(".c1v1-chosen-inv"),"cf-chosen",1);
		}
	})
	$(document).on('click', '.cf-chosen', function() {
		var masterParent = $(this).parent().parent().children('.c1v1-wager-info');
		var amountLeft = parseInt(masterParent.attr('stock'));
		var itemID = parseInt($(this).attr('itemid'));
		var itemQ = parseInt($(this).attr('stock'));
		var bigQ = keyDown[16]?itemQ:1;
		move_item_inv_1v1(masterParent,$(this).parent(),$(this),itemID,itemQ,bigQ,amountLeft,$(this).parent().parent().children(".c1v1-select-inv"),"cf-unchosen",-1);
	})
	$(document).on('click', '.c1v1-next-stage', function() {
		$(this).parent().css('display','none');
		var gotoWindow = $("#" + $(this).attr('goto'));
		gotoWindow.css('display','block');
		var coinInv = gotoWindow.children(".c1v1-choose-coin");
		gotoWindow.children(".c1v1-coin-error").css('visibility','hidden');
		gotoWindow.children(".c1v1-coin-error").children(".cf-coin-error").html("");
		undisableChooseCoins();
		coinInv.html("");
		for(var i = 0; i < coins.length; i++){
			coinInv.html(coinInv.html() + "<div class='cf-coin-container "+(i < coins.length/2?"coin-player":"coin-enemy")+"'><div class='cf-coin' coinid='"+i+"' style='border-color:"+coins[i][1]+";background-color:"+coins[i][0]+";background-image:url(\"/client/resources/coin/"+coins[i][2]+".png\")'></div></div>");
		}
	});
	$(document).on('click', '.c1v1-back-to-main', function() {
		$(this).parent().css('display','none');
		$("#1v1-choose-gm-menu").css('display','block');
	});
	$(document).on('click', '.c1v1-back-to-inv', function() {
		$(this).parent().css('display','none');
		$("#" + $(this).attr('goto')).css('display','block');
	});
	$(document).on('click', '.c1v1-complete-cf', function() {
		if($(this).attr('gamemode') == 0){
			var grabItems = [];
			var selectedCoin = 0;
			$("#"+$(this).attr('inv')).children().each(function(){
				for(var x = 0; x < parseInt($(this).attr('stock')); x++){
					grabItems.push(parseInt($(this).attr('itemid')));
				}
			})
			$(".selected-coin").each(function(){selectedCoin = parseInt($(this).attr('coinid'))})
			$(this).prop('disabled',true);
			window.socket.emit("1V1make",grabItems,parseInt($(this).attr('gamemode')),selectedCoin);
		}
	});
	$(document).on('click', '.c1v1-play-cf', function() {
		if($(this).attr('gamemode') == 0){
			var grabItems = [];
			var selectedCoin = 0;
			$("#"+$(this).attr('inv')).children().each(function(){
				for(var x = 0; x < parseInt($(this).attr('stock')); x++){
					grabItems.push(parseInt($(this).attr('itemid')));
				}
			})
			$(".selected-coin").each(function(){selectedCoin = parseInt($(this).attr('coinid'))})
			$(this).prop('disabled',true);
			window.socket.emit("1V1join",grabItems,$(this).attr('roomid'),selectedCoin);
		}
	});
	$(document).on('click', '.c1v1-cf-choose-coin', function() {
		undisableChooseCoins();
		$(this).prop('disabled',true);
		$(this).addClass('selected-coin-button');
		$(".cf-coin-container").css('display','none');
		if($(this).attr('startat') == "0"){ //player coins
			$(".coin-player").css('display','inline-block');
		}else{
			$(".coin-enemy").css('display','inline-block');
		}
	});
	$(document).on('click', '.cf-coin-container', function() {
		$('.selected-coin').removeClass('selected-coin');
		$(this).children().addClass('selected-coin');
		var coinerror = $(this).parent().parent().children(".c1v1-coin-error");
		coinerror.css('visibility','visible');
		if($(this).hasClass('coin-player')) coinerror.children(".cf-coin-info").html("You will win if the hash lands on the first half");
		else coinerror.children(".cf-coin-info").html("You will win if the hash lands on the second half");
	});
	$(document).on('click', '.room1v1spectateme', function() {
		handleSpectate($(this));
		var whowon = $(this).parent().attr('whowon');
		$("#game-submit").html("Join");
		countdownAnimation = setInterval(function(){
			var secs = parseInt($(".lobby1v1room[roomid='"+ $("#watch1v1game").attr('roomid') +"']").attr('countdown'));
			window.onresize();
			if(secs > 0) $("#game1v1countdown").html(secs);
			else clearInterval(countdownAnimation);
			
			if(secs == 0){
				coinflipSfx.currentTime = 0;
				coinflipSfx.volume = window.handleWindowMute(1);
				coinflipSfx.play();
				$("#game1v1countdown").html("");
				$("#bigger-coin-container").css('animation','ease-big-coin 3s linear forwards');
				$("#bigger-coin-container").css('-webkit-animation','ease-big-coin 3s linear forwards');
				$("#bigger-coin-container").css('-o-animation','ease-big-coin 3s linear forwards');
				$("#bigger-coin-container").css('-ms-animation','ease-big-coin 3s linear forwards');
				$("#bigger-coin-container").css('-moz-animation','ease-big-coin 3s linear forwards');
				if($("#watch1v1game").attr('whowon') == '0'){
					$("#bigger-coin-container-flip").css('animation','flip-to-owner 3s linear forwards');
					$("#bigger-coin-container-flip").css('-webkit-animation','flip-to-owner 3s linear forwards');
					$("#bigger-coin-container-flip").css('-o-animation','flip-to-owner 3s linear forwards');
					$("#bigger-coin-container-flip").css('-moz-animation','flip-to-owner 3s linear forwards');
					$("#bigger-coin-container-flip").css('-ms-animation','flip-to-owner 3s linear forwards');
				}else if($("#watch1v1game").attr('whowon') == '1'){
					$("#bigger-coin-container-flip").css('animation','flip-to-attacker 3s linear forwards');
					$("#bigger-coin-container-flip").css('-webkit-animation','flip-to-attacker 3s linear forwards');
					$("#bigger-coin-container-flip").css('-o-animation','flip-to-attacker 3s linear forwards');
					$("#bigger-coin-container-flip").css('-ms-animation','flip-to-attacker 3s linear forwards');
					$("#bigger-coin-container-flip").css('-moz-animation','flip-to-attacker 3s linear forwards');
				}
			}
		},500)
		window.onresize();
	});
	$(document).on('click', '.room1v1viewme', function() {
		handleSpectate($(this))
		whowon = parseInt($(this).parent().attr('whowon'));
		$("#bigger-coin-container-flip").css('transform','rotateY('+(whowon*180)+'deg)');
		var winnertext = $("<div class='game1v1winnertext'></div>");
		winnertext.css('transform','rotateY('+(whowon*180)+'deg)');
		winnertext.html($(this).parent().children(".room1v1gamblerinfo").children(".lobby1v1playercontainer").eq(whowon).attr('name') + " Won<br/><span class='game1v1hash'>Hash: "+$(this).parent().attr('hash')+"</span>");
		$("#bigger-coin-container-flip").append(winnertext);
	});
	function handleSpectate(par){
		$("#lobbymenu1v1").css('visibility','hidden');
		$("#watch1v1game").css('visibility','visible');
		$("#bigger-coin-container").children().empty();
		$("#game1v1inv").empty();
		$(".game1v1coin").empty();
		$("#bigger-coin-container").css('animation','none');
		$("#bigger-coin-container-flip").css('transform','rotateY(0deg)');
		$("#bigger-coin-container-flip").css('animation','none');
		$("#watch1v1game").attr('whowon',par.parent().attr('whowon'));
		var parentRoom = par.parent();
		var index = 0;
		var potitems = {};
		parentRoom.children(".room1v1gamblerinfo").children(".lobby1v1playercontainer").each(function(){
			var copycoin = $(this).children(".room1v1gamblercoin").clone();
			var iis = eval("["+$(this).attr('items')+"]");
			for(var x in iis){
				if(!(iis[x] in potitems))potitems[iis[x]] = 1;
				else potitems[iis[x]]++;
			}
			copycoin2 = copycoin.clone();
			copycoin.removeClass('room1v1gamblercoin').addClass('bigger-coin').css('z-index',"1");
			copycoin2.removeClass('room1v1gamblercoin');
			$("#bigger-coin-container").children().append(copycoin);
			var copyimg =  $(this).children(".room1v1gamblerpic").clone();
			var avatar = $(".game1v1avatarcontainer").eq(index).children();
			avatar.css("background-image","url('"+copyimg.attr('src')+"')");
			avatar.children(".game1v1percent").html( (100* parseInt(copyimg.attr('worth'))/parseInt(parentRoom.attr('pot'))).toFixed(2) +"%"  );
			avatar.children(".game1v1name").html($(this).attr('name'));
			avatar.children(".game1v1coin").append(copycoin2);
			index++;
		});
		parentRoom.children(".room1v1gamblerinfo").children(".room1v1gamblerNone").each(function(){
			var avatar = $(".game1v1avatarcontainer").eq(index).children();
			avatar.css("background-image","url('/client/resources/MysteryGuy.png')");
			avatar.children(".game1v1percent").html("Waiting");
			avatar.children(".game1v1name").html("");
			index++;
		});
		for(var x in potitems){
			var iitem = $("<div class='i1v1 item'><div class='inv-i-quant'></div></div>");
			iitem.css('background-image','url("'+window.items[id_to_pos(x)].image.src +'")');
			setItemQuant(iitem,potitems[x]);
			$("#game1v1inv").append(iitem);
		}
		$("#game1v1invpotF").html(parentRoom.attr('pot') + 'F');
		$("#watch1v1game").attr('roomid',parentRoom.attr('roomid'));
		$("#bigger-coin-container").children().children(":nth-child(2)").css({"z-index":"0","transform":"rotateY(180deg)"});
	}

	$(document).on('click', '.game1v1backbutton', function() {
		$("#lobbymenu1v1").css('visibility','visible');
		$("#watch1v1game").css('visibility','hidden');
		winnerSfx.sound.pause();
		coinflipSfx.pause();
		clearTimeout(winnerSfx.pauseTimeout);
		clearInterval(countdownAnimation);
		$("#game-submit").html("Create");
	});
	$(document).on('click', '.room1v1joinroom', function() {
		var coinMenu = $("#1v1-join-coin-menu");
		coinMenu.children(".c1v1-wager-info").attr('Ftarget',$(this).parent().attr('pot'));
		var target = parseInt($(this).parent().attr('pot'));
		$("#j1v1-coinflip-targetinfo").html("Your wager must be between " + Math.ceil(target*0.95) + "F to " + Math.floor(target*1.05) + "F");
		copyInv1v1(coinMenu);
		coinMenu.children(".c1v1-back-to-inv").css('display','none');
		var choosecoins = coinMenu.parent().children(':nth-child(3)').children('.c1v1-cf-choose-coin');
		choosecoins.prop('disabled',false);
		choosecoins.removeClass('disabled-choose-coin');
		var disableThis = choosecoins.eq(parseInt($(this).parent().attr("coinchosen")));
		disableThis.prop('disabled',true);
		disableThis.addClass('disabled-choose-coin');
		$("#join-1v1-room").css('display','block');
		$("#jcf-selected-coin-menu").children('.c1v1-play-cf').attr('roomid',$(this).parent().attr('roomid'));
		$("#game1v1countdown").html("");
		window.onresize();
	});
	$(document).on('click', ".close-1v1-menu", function() {
		var mainwindow = $(this).parent().parent();
		mainwindow.parent().css('display','none'); //close
		mainwindow.children().css('display','none'); //initialize it like normal
		mainwindow.children(":nth-child(1)").css('display','block'); //show title
		mainwindow.children(":nth-child(2)").css('display','block'); //show the first window
	});
	$(document).on('click', ".room1v1cancelroom", function() {
		socket.emit('1V1cancel');
	});
	window.socket.on('1v1makeReply',function(g,allGood,msg){
		if(g==0){
			$("#cf-selected-coin-menu").children(".c1v1-complete-cf").prop('disabled',false);
			if(allGood){
				$("#create-1v1-room").children().children(":nth-child(1)").children(".close-1v1-menu").click();
				$(".lobby1v1room[roomid='"+msg+"']").children(".room1v1spectateme").click();
			}else{
				$("#cf-selected-coin-menu").children(".cf-coin-error").html(msg);
			}
		}
	})
	window.socket.on('1v1joinReply',function(allGood,msg){
		$("#jcf-selected-coin-menu").children(".c1v1-play-cf").prop('disabled',false);
		if(allGood){
			$("#join-1v1-room").children().children(":nth-child(1)").children(".close-1v1-menu").click();
			$(".lobby1v1room[roomid='"+msg+"']").children(".room1v1spectateme").click();
		}else{
			$("#jcf-selected-coin-menu").children(".cf-coin-error").html(msg);
		}
	})
	window.socket.on('1v1rooms',function(rooms){
		// console.log(rooms)
		$("#lobby1v1games").empty();
		for(var i in rooms)$("#lobby1v1games").append(createRoomSnippet(rooms[i]));
		window.onresize();
		sortLobbyRooms();
	})
	window.socket.on('1v1roomUPDATE',function(room){
		$(".lobby1v1room[roomid='"+room.id+"']").replaceWith(createRoomSnippet(room));
		var roomFound = $(".lobby1v1room[roomid='"+room.id+"']");
		if(room.state == 1){
			roomFound.attr('countdown','9');
			countDown(roomFound);
		}
		if($("#watch1v1game").css('visibility') == 'visible' && room.id == $("#watch1v1game").attr('roomid')){
			var rstate = roomFound.attr('state');
			if(rstate == 0 || rstate == 1){
				roomFound.children(".room1v1spectateme").click();
			}else if(rstate == 2){
				roomFound.children(".room1v1viewme").click();
				var winr = roomFound.children('.room1v1gamblerinfo').children('.lobby1v1playercontainer').eq(room.whowon);
				winnerSfx.sound = new Audio(winr.attr('sfx'));
				winnerSfx.sound.volume = window.handleWindowMute(Number(winr.attr('sfxvol')));
				winnerSfx.sound.play();
				winnerSfx.pauseTimeout = setTimeout(function(){winnerSfx.sound.pause();},12000);
			}else if(rstate == 3){
				//kick spectator out
				$("#watch1v1game").children(".game1v1backbutton").click();
				$("#join-1v1-room").children().children(":nth-child(1)").children(".close-1v1-menu").click();
				//do some sort of notification
			}
			
		}
		window.onresize();
		sortLobbyRooms();
	})
	window.socket.on('1v1roomDELETE',function(rid){
		$(".lobby1v1room[roomid='"+rid+"']").remove();
	})
	window.socket.on('1v1roomADD',function(room){
		$("#lobby1v1games").append(createRoomSnippet(room));
		window.onresize();
		sortLobbyRooms();
	})
	function createRoomSnippet(room){
		var block = "<div class='lobby1v1room' hash='"+room.hash+"' endtime='"+room.endTime+"' state='"+room.state+"' whowon='"+room.whowon+"' countdown='-1' pot='"+room.pot+"' roomid='"+room.id+"' coinchosen='"+Math.floor(2*room.owner.choice/coins.length)+"' ><div class='room1v1F' texttype='F'>"+room.pot+"F<div class='hover-for-info kk-pack-hoverinfo' >?<div class='hover-for-info-content' style='bottom:unset;top:225%;transform: translateX(-12.5%);max-width: 32em;'>"+grabRoomItems(room)+"</div></div></div><div class='room1v1state'>"+stateCodes[room.state]+"</div><div class='room1v1gamblerinfo'>"+constructGamblerInfo(room.owner,true)+"<div class='room1v1gamblerversus'>vs</div>"+constructGamblerInfo(room.attacker,false)+"</div>";
		if(room.state==0)block += "<button class='new-menu-button room1v1spectateme'>Spectate</button>" + ((room.owner.name == window.round.name)?"<button class='new-menu-button room1v1cancelroom'>Cancel</button>":"<button class='new-menu-button room1v1joinroom'>Join</button>");
		else if(room.state==1)block += "<button class='new-menu-button room1v1spectateme'>Watch</button>"
		else if(room.state==2)block += "<button class='new-menu-button room1v1viewme'>Recap</button>"
		block += "</div>";
		return block;
		//TO DO LATER: IF YOUR OWN ROOM, REPLACE JOIN BUTTON WITH CANCEL BUTTON
	}
	function constructGamblerInfo(p,t){
		if(Object.keys(p).length == 0){
			return "<div class='room1v1gamblerNone'>None</div>";
		}else{
			var part1 = "<img worth='"+p.worth+"' class='room1v1gamblerpic' src='"+p.img+"'></img>";
			var part2 = "<div class='cf-coin room1v1gamblercoin' style='border-color:"+coins[p.choice][1]+";background-color:"+coins[p.choice][0]+";background-image:url(\"/client/resources/coin/"+coins[p.choice][2]+".png\");' ></div>"
			return "<div sfx='"+p.sfx+"' sfxvol='"+p.sfxvol+"' items='"+p.items+"' name='"+p.name+"' class='lobby1v1playercontainer' "+(t===false?"style='transform: rotateY(-180deg);'":"")+" >" + part1+part2 + "</div>";
		}
	}
	function grabRoomItems(rm){
		var i = [];
		var i2 = {};
		if(Object.keys(rm.owner).length > 0)i = i.concat(rm.owner.items);
		if(Object.keys(rm.attacker).length > 0)i = i.concat(rm.attacker.items);
		for(var x in i){
			if(i[x] in i2)i2[i[x]]++;
			else i2[i[x]] = 1;
		}
		var b = "";
		for(var y in i2){
			b += "<div class='i1v1 item' style='background-image:url(\""+window.items[id_to_pos(y)].image.src +"\")'><div class='inv-i-quant'>"+i2[y]+"</div></div>";
		}
		return b;
	}
	function countDown(room){
		var secs = parseInt(room.attr('countdown'));
		if(secs > 0){
			room.attr('countdown',"" + (secs-1) + "")
			setTimeout(function(){countDown(room)},1000);
		}
	}
	function sortLobbyRooms(){
		var stateorder = [1,0,2,3];
		$("#lobby1v1games").find(".lobby1v1room").sort(function(a,b){ //by state first
			var astate = parseInt($(a).attr('state'));
			var bstate = parseInt($(b).attr('state'));
			return stateorder.indexOf(astate) - stateorder.indexOf(bstate);
		}).appendTo($("#lobby1v1games"));
		/*
		$("#lobby1v1games").find(".lobby1v1room[state='1'], .lobby1v1room[state='0']").sort(function(a,b){ //by pot F then
			var apot = parseInt($(a).attr('pot'));
			var bpot = parseInt($(b).attr('pot'));
			return stateorder.indexOf(apot) - stateorder.indexOf(bpot);
		}).appendTo($("#lobby1v1games"));*/
	}
	var keyDown = [];
	window.addEventListener('keydown', function(evt){
		keyDown[evt.keyCode] = true;
	});
	window.addEventListener('keyup', function(evt){
		keyDown[evt.keyCode] = false;
	});
});