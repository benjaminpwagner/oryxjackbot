$(document).ready(function(){

	// var __inventory = document.getElementById('sidebar_inv')
	// var __items = Array.from($(__inventory).children())
	// var __printItems = function() { console.log('items: ',__items) }
	// __printItems()

	var socket = window.socket = io();

	var __bot = {
		running: false,
		timeLeft: null,
		totalWorth: 0,
		wagers: {},
		hasWagered: false,

		login(username, password){
			this.username = username
			console.log(`logging in as '${username}'`)
			socket.emit("signin",{username, password})
		},

		print(prop=false){console.log(prop?`${prop}: ${JSON.stringify(this[prop])}`:`game state: ${this}`)},

		wager(items){
			if (!this.hasWagered) {
				console.log(`tried to bet [${items}] with ${this.timeLeft}ms left`)
				socket.emit('wager',items)
			}
			this.hasWagered = true
		},

		trackTimeLeft(){
			this.timeLeft -= 100
			this.timeLeft > 0 
				? setTimeout(()=>this.trackTimeLeft(), 100)
				: this.timeLeft = 0

			if (this.timeLeft === 0) {

			}
			// this.print('timeLeft')
		},

		start(){
			__bot.login('many_decas', 'IloveOryx1337')
			setTimeout(()=>{
				console.log('starting bot')	
				this.running = true
				this.loop()
			}, 2000)
		},

		loop(){ 
			if (this.running) setTimeout(()=>this.loop(),100)
			
			if (this.timeLeft < 10000 && this.timeLeft !== null) {
				this.wager([5])
			}
		},

		incomingWage(wage, user){
			this.wagers[user] = wage
			this.totalWorth += wage.worth
			console.log(`${user} bet ${wage.items.length} items worth ${wage.worth}F`)
		},

		roundwinner(name) {
			var chance = this.wagers[name]
				? ((this.wagers[name].worth/this.totalWorth)*100).toFixed(2)+'%'
				: 'an unknown'
			console.log(`${name} won ${this.totalWorth}F with ${chance} probability`)
		},

		reset() {
			console.log('round reset')
			this.hasWagered = false
			this.timeLeft = null
			this.wagers = {}
			this.totalWorth = 0
		},

		stop(){
			console.log('bot stopped')
			this.running = false
		}
		
	}

	window.bot = __bot
	__bot.start()

















document.getElementById('canvas').onmousedown = function() { return false; } //so page is unselectable

var canvas = $("canvas")[0];
var chatWindow = document.getElementById('chat-window');
var sitechatWindow = document.getElementById('chat-window-2');
var chatText = document.getElementById('chat-message-text');
var chatInput = document.getElementById('message');
var ctx = document.getElementById("canvas").getContext("2d");
var w,h,mx, my;
var gamemode = 0;
var gamemodeLists = ["canvas","gamemode1","gamemode2"];
var keepTrackScroll = 0;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
ctx.imageSmoothingEnabled= false
var canvasSettings = function(){
	var useWidth = (checkMobile())?screen.width:window.innerWidth;
	var useHeight = (checkMobile())?screen.height:window.innerHeight;
	canvas.width = $("#canvas").width();
	canvas.height = $("#canvas").height();
	w = canvas.width;
	h = canvas.height;
}
document.getElementById("emojilist").addEventListener("click", function() {
	$(function() {
        $(".menu").slideToggle(1);
	});
})
canvasSettings();
function escapeHtml(unsafe) {
	return unsafe
	.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;")
	.replace(/"/g, "&quot;")
	.replace(/'/g, "&#039;");
}
window.handleWindowMute = function(v){
	return Math.min(sfxMute?0:1,v);
}

function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

if("referral" in getJsonFromUrl()){
	$("#signup-ref").val(getJsonFromUrl()["referral"]);
	$("#signup-ref").prop('disabled', true);
}
if("r" in getJsonFromUrl()){
	$("#signup-ref").val(getJsonFromUrl()["r"]);
	$("#signup-ref").prop('disabled', true);
}

document.getElementById('login-submit').addEventListener("click", function(evt){
	var loo = {username:document.getElementById('login-user').value,password:document.getElementById('login-pw').value};
	socket.emit("signin",loo);
	document.getElementById('login-submit').style.display = 'none';
});

document.getElementById('withdraw-submit').addEventListener("click", function(evt){
	socket.emit("checkMule",document.getElementById('withdraw-user').value,document.getElementById('withdraw-pw').value);
	document.getElementById('withdraw-prompt').style.display = 'none';
	document.getElementById('withdraw-wait').style.display = 'block';
});

document.getElementById('cancel_withdrawal').addEventListener("click", function(evt){
	socket.emit("cancel_withdrawal");
	document.getElementById('remove-withdrawal').style.display = 'none';
});

document.getElementById('whubtoins').addEventListener("click", function(evt){
	socket.emit("getPossibleMules");
	document.getElementById('withdraw_mules_listed').innerHTML = iwpage(0);
	window.onlyOpenOneWindow('withdraw_mules');
});

document.getElementById('whubtoreg').addEventListener("click", function(evt){
	window.onlyOpenOneWindow("withdraw-window");
});

document.getElementById('signup-submit').addEventListener("click", function(evt){
	socket.emit("signup",document.getElementById('signup-user').value,document.getElementById('signup-pw').value,document.getElementById('signup-ref').value);
});

document.getElementById('verify-code-button').addEventListener("click", function(evt){
	if(document.getElementById('verify-IGN').value.length==0){
		document.getElementById('verify-error').style.color = "#ff9999";
		document.getElementById('verify-error').innerHTML = "Please enter an IGN.";
	}else{
		socket.emit('verificationCode',document.getElementById('verify-IGN').value);
	}
});
document.getElementById('verify-code-button-recover').addEventListener("click", function(evt){
	if(document.getElementById('verify-IGN-recover').value.length==0){
		document.getElementById('verify-error-recover').style.color = "#ff9999";
		document.getElementById('verify-error-recover').innerHTML = "Please enter an IGN.";
	}else{
		socket.emit('verificationCodeRECOVER',document.getElementById('verify-IGN-recover').value);
	}
});

document.getElementById('verify-acc-button').addEventListener("click", function(evt){socket.emit('verifyCode');document.getElementById("verification-error").innerHTML=""});
document.getElementById('verify-acc-button-recover').addEventListener("click", function(evt){
	if(document.getElementById('recover-pw').value != document.getElementById('recover-pw-confirm').value){
		document.getElementById('verification-error-recover').style.color = "#ff9999";
		document.getElementById('verification-error-recover').innerHTML = "The passwords do not match!";
	}else{
		document.getElementById('verification-error-recover').innerHTML = "";
		socket.emit('verifyCodeRECOVER',document.getElementById('verify-IGN-recover').value,document.getElementById('recover-pw').value);
	}
}
);
document.getElementById('redeem-code-button').addEventListener("click", function(evt){socket.emit('redeemCode',document.getElementById('redeemable-code').value);});
document.getElementById('login-from-signup').addEventListener("click", function(evt){window.onlyOpenOneWindow("login-prompt");});
document.getElementById('signup-from-login').addEventListener("click", function(evt){window.onlyOpenOneWindow("signup-prompt");});
document.getElementById('recover-account-from-login').addEventListener("click", function(evt){window.onlyOpenOneWindow("verify-code-recover");});

document.getElementById('changepw-button').addEventListener("click", function(evt){
	if(document.getElementById('change-pw').value == document.getElementById('change-pw2').value && document.getElementById('change-pw').value.length >= 8){
		socket.emit('change_password',document.getElementById('current-pw').value,document.getElementById('change-pw').value);
		document.getElementById('changepw-button').style.display = 'none';
	}else{
		document.getElementById('changepw-error').style.color = '#ff0000';
		document.getElementById('changepw-error').innerHTML = 'Please check your passwords again.';
	}
});

document.getElementById('make-mule-button').addEventListener("click", function(evt){
	socket.emit('makemule');
	document.getElementById("make-mule-button").style.display = 'none';
	document.getElementById("freekk-reply").innerHTML = 'Hold on... Making a new captcha for you.';
});

document.getElementById('submit-mule-button').addEventListener("click", function(evt){
	socket.emit('submitmule');
	document.getElementById("submit-mule-button").style.display = 'none';
	document.getElementById("freekk-reply2").innerHTML = 'Hold on... Verifying it.';
});

document.getElementById('make-deposit-button').addEventListener("click", function(evt){
	socket.emit('deposit_get');
	document.getElementById("make-deposit-button").style.display = 'none';
	document.getElementById("deposit-waiter").style.display = 'none';
	document.getElementById("deposit_creds").style.display = 'block';
	document.getElementById("deposit_creds").innerHTML = 'We are getting you a mule... you must complete your deposit!';
});

document.getElementById('submit-deposit-button').addEventListener("click", function(evt){
	socket.emit('deposit_submit');
	document.getElementById("submit-deposit-button").style.display = 'none';
	document.getElementById("report-deposit-button").style.display = 'none';
	document.getElementById("deposit-waiter").style.display = 'none';
	document.getElementById("deposit_creds").style.display = "none";
	document.getElementById("deposit-reply").style.display = 'block';
	document.getElementById("deposit-reply").style.color = '#ffffff';
	document.getElementById("deposit-reply").innerHTML = 'We are checking the mule... if this takes longer than a minute, refresh the browser and try again.';
});

document.getElementById('report-deposit-button').addEventListener("click", function(evt){
	socket.emit('deposit_report');
	document.getElementById("submit-deposit-button").style.display = 'none';
	document.getElementById("report-deposit-button").style.display = 'none';
	document.getElementById("deposit-waiter").style.display = 'none';
	document.getElementById("deposit_creds").style.display = "none";
	document.getElementById("deposit-reply").style.display = 'block';
	document.getElementById("deposit-reply").style.color = '#ffffff';
	document.getElementById("deposit-reply").innerHTML = 'We are checking if the mule is broken...';
});

document.getElementById('game-submit').addEventListener("click", function(evt){
	if(gamemode == 2){
		if(round.loggedin){
			if($("#lobbymenu1v1").css('visibility') == 'visible'){
				$("#create-1v1-room").css('display','block');
				window.onresize();
			}else if($("#watch1v1game").css('visibility') == 'visible'){
				$(".lobby1v1room[roomid='"+ $("#watch1v1game").attr('roomid') +"']").children(".room1v1joinroom").click();
				window.onresize();
			}
		}
	}else{
		var itemsToBet = [];
		$( '.offer-i' ).each(function(){
			itemsToBet.push(parseInt($(this).attr('itemid')));
			// console.log(parseInt($(this)))
			$(this).remove();
		});

		$("#offer_inv_worth").attr('val',0);
		$("#offer_inv_worth").html("<span>WAGER</span><span style='float: right;color:#f70;'>0F</span>")
		$("#game-submit").addClass('ending');
		$("#game-submit").removeClass('has-items');
		
		if (__bot.running) {
			console.log('you cannot bet while you are botting')
			console.log('try `window.bot.stop()`')
		} else {
			if(gamemode == 0)socket.emit('wager',itemsToBet);
			else if(gamemode == 1)socket.emit('wager2',itemsToBet);
		}

	}
	
});

document.getElementById('Tos-accept').addEventListener("click", function(evt){
	window.onlyOpenOneWindow('information-signup-window');
});

window.acceptTOS = function(){
	document.getElementById('Tos-accept').style.display='none';
	document.getElementById('signup-submit').style.display='block';
	if("username" in localStorage)document.getElementById("signup-error").outerHTML = "<div class='signup-warning'>WARNING: It looks like you already have an OryxJackpot account, Making another account will get you permanently banned! You have been warned.</div>" + document.getElementById("signup-error").outerHTML;
	window.onlyOpenOneWindow('signup-prompt');
}

document.getElementById('new-settings').addEventListener("click", function(evt){window.onlyOpenOneWindow("new-settings-menu");});
document.getElementById('settings_deposit').addEventListener("click", function(evt){window.onlyOpenOneWindow("new-deposit");});
document.getElementById('settings_withdraw').addEventListener("click", function(evt){window.onlyOpenOneWindow("whub");});
document.getElementById('settings_redeem_code').addEventListener("click", function(evt){window.onlyOpenOneWindow("redeem-code");});
document.getElementById('settings_free').addEventListener("click", function(evt){window.onlyOpenOneWindow("get-free-kk");});
document.getElementById('sidebar_KK_SHOP').addEventListener("click", function(evt){
	window.onlyOpenOneWindow('test-kk-shop');
	socket.emit('getPackages');
});

document.getElementById('chat-to-player').addEventListener("click", function(evt){
	chatWindow.style.display = "block";
	sitechatWindow.style.display = "none";
});
document.getElementById('chat-to-site').addEventListener("click", function(evt){
	chatWindow.style.display = "none";
	sitechatWindow.style.display = "block";
	sitechatWindow.scrollTop = sitechatWindow.scrollHeight;
});
document.getElementById('switch-gamemodes').addEventListener("click", function(evt){
	gamemode++;
	if(gamemode==3)gamemode=0;
	wagerscroll.offsety = 0;
	document.getElementById('switch-gamemodes-notif').style.display = "none";
	for(var x in gamemodeLists){
		if(x == gamemode) $("#"+gamemodeLists[x]).css('visibility','visible');
		else $("#"+gamemodeLists[x]).css('visibility','hidden');
	}
	if((gamemode==0 && !round.rollwin)||(gamemode==1 && !round2.rollwin))$("#game-submit").removeClass('ending');
	if(gamemode!=2){
		$("#game-submit").addClass('ending');
		$("#offer_inv").css('display','block');
		$("#offer_inv_worth").css('display','block');
		$("#game-submit").html('Wager');
		$("#watch1v1game").css('visibility','hidden');
		$("#lobbymenu1v1").removeAttr('style');
	}else{
		$("#offer_inv").css('display','none');
		$("#offer_inv_worth").css('display','none');
		$("#game-submit").html('Create');
	}
});

var sfxMute = false;
if(!localStorage.getItem("mute")){
	localStorage.setItem("mute",false)
}else{
	sfxMute = localStorage.getItem("mute")=='true';
	document.getElementById('settings_mute').style.backgroundImage = sfxMute?"url(client/resources/buttons/sfxOff.png)":"url(client/resources/buttons/sfxOn.png)";
}
document.getElementById('settings_mute').addEventListener("click", function(evt){
	sfxMute = !sfxMute;
	localStorage.setItem("mute",sfxMute)
	document.getElementById('settings_mute').style.backgroundImage = sfxMute?"url(client/resources/buttons/sfxOff.png)":"url(client/resources/buttons/sfxOn.png)";
});
document.getElementById('settings_challenges').addEventListener("click", function(evt){
	window.onlyOpenOneWindow('giveaway_window');
});

document.getElementById('settings_profile').addEventListener("click", function(evt){
	socket.emit('stats_get');
	socket.emit('refer_get');
	window.onlyOpenOneWindow("profile_overview");
});

socket.on('stats_reply',function(stats){
	var prepareHTML = ""
	prepareHTML += "Total Wagered: <span style='color:#ff8800'>" + stats.total_wagered + "F</span> over <span style='color:#11ffff'>" + stats.total_wagers + "</span> rounds.<br>"
	prepareHTML += "Total Won: <span style='color:#ff8800'>" + stats.total_won + "F</span> over <span style='color:#11ffff'>" + stats.total_wins+"</span> wins.<br>"
	prepareHTML += "Luckiest win: <span style='color:#ff8800'>" + stats.luckiest_win[0] + "F</span> with <span style='color:#ffff22'>" + stats.luckiest_win[1].toFixed(2) + "%</span> chance.<br>"
	prepareHTML += "Biggest win: <span style='color:#ff8800'>" + stats.biggest_won + "F</span><br><br>"

	var netprofit = stats.total_won - stats.total_wagered;
	prepareHTML += "Net Profit:  <span style='color:" + (netprofit>0?"#22ff22":"#ff2222") + "'>" + netprofit + "F</span><br>"
	
	if(stats.total_wagers == 0){
		prepareHTML += "Win rate: <span style='color:#ffffff'> You have not played yet.</span>"
	}else{
		var winrate = (stats.total_wins/stats.total_wagers * 100).toFixed(2);
		prepareHTML += "Win rate: <span style='color:#ffffff'>" + winrate + "%</span>"
	}
	document.getElementById('gambling_info').innerHTML = prepareHTML;
	document.getElementById('information-referred-KK').innerHTML = "Earned so far: " + stats.referredKK + "KK"
})

socket.on('rank_reply',function(curr_rank,curr_rank_time,future_ranks){
	future_ranks.unshift({rank:curr_rank,ranktimer:curr_rank_time});
	document.getElementById('rank_info').innerHTML = ""
	if(future_ranks.length == 1 && future_ranks[0].rank == 0){
		document.getElementById('rank_info').innerHTML = "<div class='profile_header'>You have no ranks.<br><div style='font-size:20px'>You can buy one by clicking KK shop on the sidebar.</div></div>"
	}else{
		display_ranks(future_ranks)
		if(future_ranks.length > 0)document.getElementById('order_ranks').style.display = 'block';
	}
})

function display_ranks(rankQ){
	for(var i = 0; i < rankQ.length; i++){
		var prepareHTML = "<div class='prof-overview-rankcontain'>"
		prepareHTML += "<div class='prof-overview-rankcontainL1'>"
		prepareHTML += '<span style="color:'+siteranks[rankQ[i].rank].namecolor+'">' + siteranks[rankQ[i].rank].title  + ' Rank</span><br>'
		prepareHTML += '<img class="prof-overview-rankpic" src="'+ escapeHtml( siteranks[rankQ[i].rank].name ) +'">'
		prepareHTML += "</div>"
		prepareHTML += "<div class='prof-overview-rankcontainL2'>"
		if(i == 0){
			prepareHTML += 'Current Rank<br>Time left: ' + (minutesToMsg(rankQ[i].ranktimer - Date.now()) == "now"?'Expires on logout!':minutesToMsg(rankQ[i].ranktimer - Date.now()) + ".");
		}else{
			prepareHTML += 'Next Rank<br>Duration: ' + minutesToMsg(rankQ[i].ranktimer) + "."
		}
		prepareHTML += "</div>"
		prepareHTML += "</div>"
		document.getElementById('rank_info').innerHTML += prepareHTML;
	}
}

document.getElementById('order_ranks').addEventListener("click", function(evt){
	document.getElementById('order_ranks').style.display = 'none';
	socket.emit("orderRanks");
});

socket.on('rank_update',function(ranksQ){
	ranksQ[0].ranktimer += Date.now()
	document.getElementById('rank_info').innerHTML = "";
	display_ranks(ranksQ)
});

document.getElementById('new-logout').addEventListener("click", function(evt){
	socket.emit("logout");
	document.getElementById('withdraw-submit').style.display = 'block';
});

function imagePrepare(){
	var selectedOpt = document.getElementById('choose_image_ranks').options[document.getElementById('choose_image_ranks').selectedIndex].value;
	document.getElementById('image_cost').innerHTML = selectedOpt<=round.rank?("Cost: " + (20 - (round.rank-selectedOpt)*5) + "KK"):"You cannot buy this!";
}
document.getElementById('choose_image_ranks').addEventListener("click", function(){imagePrepare();});
document.getElementById('image_reroller').addEventListener("click", function(){
	var selectedOpt = document.getElementById('choose_image_ranks').options[document.getElementById('choose_image_ranks').selectedIndex].value;
	socket.emit('changeImage',selectedOpt);
});
socket.on('image_reply',function(msg,error){
	document.getElementById('image_reply').style.color = error?"#00ff00":"#ff0000";
	document.getElementById('image_reply').innerHTML = "<br><br>"+msg;
});
$('#iw-sort-by').change(function(){ 
	sortCachedMules();
	$('#withdraw_mules_listed').html(iwpage(1));
});

function sortCachedMules(){
	var selectedOpt = parseInt(document.getElementById('iw-sort-by').options[document.getElementById('iw-sort-by').selectedIndex].value);
	if(selectedOpt > 0){
		if(selectedOpt==1)cachedMules.filtered.sort(function(a,b){return b.sortby.il - a.sortby.il});
		else if(selectedOpt==2)cachedMules.filtered.sort(function(a,b){return a.sortby.il - b.sortby.il});
		else if(selectedOpt==3)cachedMules.filtered.sort(function(a,b){return b.sortby.F - a.sortby.F});
		else if(selectedOpt==4)cachedMules.filtered.sort(function(a,b){return a.sortby.F - b.sortby.F});
	}
}
function filterCachedMules(){
	Wfilter = document.getElementById('withdrawSearch').value.toUpperCase().split(",");
	cachedMules.filtered = [];
	for(var x in cachedMules.cache){
		var count = 0;
		for(var name in Wfilter){
			for(var y in cachedMules.cache[x].items){
				if(items[window.id_to_pos(cachedMules.cache[x].items[y])].name.toUpperCase().indexOf($.trim(Wfilter[name])) != -1){
					count++;
					break;
				}
			}
		}
		if(count == Wfilter.length){
			cachedMules.filtered.push(cachedMules.cache[x]);
		}
	}
}

document.getElementById('new-login').addEventListener("click", function(evt){
	$("#login-error").html("");
	window.onlyOpenOneWindow("login-prompt");
	document.getElementById('LoginAvatar').src = $("#sidebar_img").attr('src');
});

document.getElementById('verify-code-go-back').addEventListener("click", function(evt){
	document.getElementById('verifyStep2').style.display='none';
	document.getElementById('verifyStep1').style.display='block';
	document.getElementById('verify-code-go-back').style.display='none';
	window.onresize();
});
document.getElementById('verify-recover-code-go-back').addEventListener("click", function(evt){
	document.getElementById('verifyStep2-recover').style.display='none';
	document.getElementById('verifyStep1-recover').style.display='block';
	document.getElementById('verify-recover-code-go-back').style.display='none';
	window.onresize();
});

document.getElementById('inv-filter').addEventListener("click", function(evt){
	myInv.filtered = !myInv.filtered;
	document.getElementById('inv-filter').src = myInv.filtered?"/client/resources/buttons/dontfilter.png":"/client/resources/buttons/filter.png";
	myInv.offseth = 0;

	if(myInv.filtered){
		$( '.zero-stock' ).each(function(){
			$(this).css('display','none');
		});
	}else{
		$( '.zero-stock' ).each(function(){
			$(this).css('display','inline-block');
		});
	}
	keepTrackScroll = 0;
});

document.getElementById('inv-resize').addEventListener("click", function(evt){
	var oldResize = myInv.resize;

	myInv.resize = (myInv.resize%3)+1
	items_config.row = 2*(myInv.resize+1);
	items_config.col = 1 + myInv.resize;

	//experimental
	keepTrackScroll = Math.round(keepTrackScroll*(2*(oldResize+1))/(2*(myInv.resize+1)));
	$(".inv-i").css('width',100/(2*(myInv.resize+1)) + "%");
	$(".inv-i").css('height',100/(1 + myInv.resize) + "%");
	if(window.innerHeight >= window.innerWidth){
		$(".inv-i").css('font-size',5*(1/(1 + myInv.resize)) + "vw");
		$('#sidebar_inv').scrollTop(keepTrackScroll*window.innerWidth*0.14/(1 + myInv.resize))
	}else{
		$(".inv-i").css('font-size',5*(1/(1 + myInv.resize)) + "vh");
		$('#sidebar_inv').scrollTop(keepTrackScroll*window.innerHeight*0.135/(1 + myInv.resize))
	}
})

 $('button').on('click',function(e){
	 $(this).blur()
 });
 $('input').on('click',function(e){
 	if($(this).attr("type") == "image")$(this).blur()
 });
$('#profile-overview-right').on('click',function(e){
	var iterateTemp = document.getElementsByClassName('profile_overview-main-container');
	for(var i = 0; i < iterateTemp.length; i++){
		if(iterateTemp[i].style.left == "0%"){
			var getThisID = iterateTemp[i].getAttribute('id');
			var targetID = iterateTemp[(i+1)%iterateTemp.length].getAttribute('id');
			$("#"+targetID).css({left:"100%"});
			$("#"+targetID).animate({left:"0%"},400);
			$("#"+getThisID).animate({left:"-100%"},400);
			break;
		}
	}
})
$('#profile-overview-left').on('click',function(e){
	var iterateTemp = document.getElementsByClassName('profile_overview-main-container');
	for(var i = 0; i < iterateTemp.length; i++){
		if(iterateTemp[i].style.left == "0%"){
			var getThisID = iterateTemp[i].getAttribute('id');
			var targetID = iterateTemp[((i-1) + iterateTemp.length)%iterateTemp.length].getAttribute('id');
			$("#"+targetID).css({left:"-100%"});
			$("#"+targetID).animate({left:"0%"},400);
			$("#"+getThisID).animate({left:"100%"},400);
			break;
		}
	}
})

socket.on('verificationCode',function(msg,code){
	if(code === null){
		document.getElementById('verify-error').style.color = "#ff9999";
		document.getElementById('verify-error').innerHTML = msg;
	}else{
		document.getElementById('verifyStep1').style.display = "none";
		document.getElementById('verifyStep2').style.display = "block";
		document.getElementById('verification-pretense').innerHTML = "Your RealmEye code is<br><input type='text' readonly='readonly' class='copy-paste-field' value='"+code+"'/>";
		document.getElementById('verify-error').style.color = "#99ff99";
		document.getElementById('verify-error').innerHTML = "Code successfully generated.";
		document.getElementById('verify-code-go-back').style.display = 'block';
		window.onresize();
	}
	
});
socket.on('verificationResponse',function(msg,doneBool){
	document.getElementById('verification-error').style.color = "#ff9999";
	document.getElementById('verification-error').innerHTML = msg;
});



socket.on('verificationCodeRECOVER',function(msg,doneBool){
	if(!doneBool){
		document.getElementById('verify-error-recover').style.color = "#ff9999";
		document.getElementById('verify-error-recover').innerHTML = msg;
	}else{
		document.getElementById('verifyStep1-recover').style.display = "none";
		document.getElementById('verifyStep2-recover').style.display = "block";
		document.getElementById('verification-pretense-recover').innerHTML = "Your RealmEye code is<br><input type='text' readonly='readonly' class='copy-paste-field' value='"+msg+"'/>";
		document.getElementById('verify-error-recover').style.color = "#99ff99";
		document.getElementById('verify-error-recover').innerHTML = "Code successfully generated.";
		document.getElementById('verify-recover-code-go-back').style.display='block';
		window.onresize();
	}
});
socket.on('verificationResponseRECOVER',function(msg,doneBool){
	document.getElementById('verification-error-recover').style.color = doneBool?"#99ff99":"#ff9999";
	document.getElementById('verification-error-recover').innerHTML = msg;
});

$( 'div' ).on("click",".copy-paste-field",function(){
	$(this).focus();
	$(this).select();
});


	var EDITBOXES = [];
	window.items = items = [];
	var items_config = {row:4,col:2};
	var wageroptions = {worth:0,x:0,y:0,w:0,h:0}

	socket.on('you',function(xx){
		if(round.name != xx.username)socket.emit("1V1getRooms"); //username change

		round.name = xx.username;
		$("#sidebar_name").html(xx.username);
		var tsize = Math.min(6.6,22/(xx.username.length-1) + 0.2)
		$("#sidebar_name_contain").css('font-size', tsize + "vh");
		$("#sidebar_name_contain").css('line-height',tsize*0.75 + "vh");
		round.rank = xx.rank;
		round.rotmg = xx.rotmg;
		$("#sidebar_img").attr('src',xx.img);
		round.loggedin = xx.log;
		if(round.loggedin == true){
			localStorage.username = xx.username;
		}else{
			$( '.offer-i' ).each(function(){
				$(this).remove();
			});
			$("#offer_inv_worth").attr('val',0);
			$("#offer_inv_worth").html("<span>WAGER</span><span style='float: right;color:#f70;'>0F</span>");
			$("#game-submit").removeClass('has-items');
		}
		round.isAdmin = xx.isAdmin;
		myInv.KK = xx.KK;
		myInv.referred = xx.referred;
		if(!round.loggedin){
			chatInput.placeholder = "Login to chat";
			chatInput.disabled = "disabled";
		}else if(round.loggedin){
			chatInput.maxlength = "130";
			chatInput.placeholder= "Chat here (English)"
			chatInput.removeAttribute("disabled");	
		}
		document.getElementById("new-login").style.display = (round.loggedin) ? 'none':'block';
		document.getElementById("new-logout").style.display = (!round.loggedin) ? 'none':'block';
		//document.getElementById("new-kk-shop").style.display = (!round.loggedin) ? 'none':'block';
		document.getElementById("new-settings").style.display = (!round.loggedin) ? 'none':'block';
		document.getElementById("settings_challenges").style.display = (!round.loggedin) ? 'none':'block';
		document.getElementById("sidebar_KK").style.display = (!round.loggedin) ? 'none':'block';
		document.getElementById("sidebar_KK_SHOP").style.display = (!round.loggedin) ? 'none':'block';
		document.getElementById("test-kk-shop-kk").innerHTML = myInv.KK + "KK";
		document.getElementById("sidebar_KK").innerHTML = myInv.KK + "KK";
		document.getElementById('test-kk-shop-stage2-KK-msg').innerHTML = "You have " + myInv.KK + "KK to spend."
		imagePrepare();

		var prepareHTML = "<div id='profile-overview-pic' style='background-image:url(\""+xx.img+"\")'></div>"
		prepareHTML += '<button type="button" class="new-menu-button quint-invis" id="go_to_images">Change Picture</button>'
		if(xx.rotmg != "guest")prepareHTML += "<div>Username: " + escapeHtml(xx.username) +"<br>"
		else prepareHTML += "<div>You are a guest<br>"
		if(xx.rotmg == "unverified")prepareHTML += "RotMG IGN:  <button type='button' class='new-menu-button quint-invis' id='click_to_verify'>Unverified! Click to verify!</button><br>";
		else if(xx.rotmg != "guest")prepareHTML += "RotMG IGN:  <span id='rotmg_reveal'><button type='button' class='new-menu-button quint-invis' id='click_to_reveal'>Click to Reveal</button></span><br>"
		prepareHTML += "<span style='color:#ffff00'>KK: " + xx.KK + "</span><br><br></div>"
		prepareHTML += "<button type='button' class='new-menu-button quint-invis' id='go_to_change_pw'>Change Password</button>"
		
		document.getElementById("quint_info").innerHTML = prepareHTML

		document.getElementById('go_to_images').addEventListener("click", function(evt){window.onlyOpenOneWindow("change-picture");});
		document.getElementById('go_to_change_pw').addEventListener("click", function(evt){window.onlyOpenOneWindow("change-password");});

		if(document.getElementById('click_to_reveal'))document.getElementById('click_to_reveal').addEventListener("click", function(evt){document.getElementById('rotmg_reveal').innerHTML = xx.rotmg;});
		if(document.getElementById('click_to_verify'))document.getElementById('click_to_verify').addEventListener("click", function(evt){window.onlyOpenOneWindow('verify-code');});

		process_inv(xx.inv);
		
	});


	socket.on('verify_this',function(url,errorBool){
		if(errorBool){
			document.getElementById("the_url").href = url;
			document.getElementById("freeKKs1").style.display = 'none';
			document.getElementById("freeKKs2").style.display = 'block';
		}else{
			document.getElementById("freekk-reply").innerHTML = url;
		}
		document.getElementById("make-mule-button").style.display = 'block';
	})

	socket.on('do_deposit',function(){
		document.getElementById("do_deposit").style.display = 'block';
	})
	socket.on('finished_withdrawal',function(){
		document.getElementById("accepted_withdrawal").style.display = 'block';
		document.getElementById('remove-withdrawal').style.display = 'none';
		document.getElementById('withdrawal_hide_if_current').style.display = 'block';
		document.getElementById('withdraw-error').style.color = '#00ff00';
		document.getElementById('withdraw-error').innerHTML = "Your withdrawal is complete! Do another one?";
	})

	socket.on('rejected_withdrawal',function(){
		document.getElementById("rejected_withdrawal").style.display = 'block';
		document.getElementById('remove-withdrawal').style.display = 'none';
		document.getElementById('withdrawal_hide_if_current').style.display = 'block';
		document.getElementById('withdraw-error').style.color = '#ff0000';
		document.getElementById('withdraw-error').innerHTML = "Your withdrawal has been rejected, try again?";
	})

	socket.on('pending_withdrawal',function(){
		document.getElementById('remove-withdrawal').style.display = 'block';
		document.getElementById('withdrawal_hide_if_current').style.display = 'none';
		document.getElementById('withdraw-error').style.color = '#ff0000';
		document.getElementById('withdraw-error').innerHTML = "You currently have a pending withdrawal, you must wait until it is complete.";
	})

	socket.on('verify_confirm',function(message,errorBool){
		if(errorBool){
			document.getElementById("freekk-reply").innerHTML = message;
			document.getElementById("freekk-reply2").innerHTML = "";
			document.getElementById("freeKKs2").style.display = 'none';
			document.getElementById("freeKKs1").style.display = 'block';
		}else{
			document.getElementById("freekk-reply2").innerHTML = message;
		}
		document.getElementById("submit-mule-button").style.display = 'block';
	})

	socket.on('deposit_mule',function(message,errorBool){
		if(errorBool){
			document.getElementById("deposit_creds").style.color = "#ffffff";
			document.getElementById("deposit_creds").innerHTML = "The mule account you have been granted (in email/password form) is:<br><div style='font-size: 2em;'>"+ message.email + "<br>"+ message.password + "</div>Please copy and paste this! Do not manually type it.";
			document.getElementById("deposit-timer").style.display = 'block';
			document.getElementById("deposit-timer").time = message.time;
		}else{
			document.getElementById("deposit-timer").style.display = 'none';
			document.getElementById("deposit_creds").style.color = "#ff0000";
			document.getElementById("deposit_creds").innerHTML = message;
		}
		document.getElementById("make-deposit-button").style.display = errorBool?'none':'block';
		document.getElementById("deposit-waiter").style.display = errorBool?'none':'block';
		document.getElementById("submit-deposit-button").style.display = errorBool?'block':'none';
		document.getElementById("report-deposit-button").style.display = errorBool?'block':'none';
		document.getElementById("deposit_creds").style.display = 'block';
		document.getElementById("deposit-reply").style.display = 'none';
	})

	socket.on('deposit_reply',function(message,errorBool,newpw){
		if(errorBool){
			document.getElementById("deposit-timer").style.display = 'none';
			document.getElementById("deposit_creds").style.display = 'none';
			document.getElementById("deposit_creds").innerHTML = "";
			document.getElementById("make-deposit-button").style.display = 'block';
			document.getElementById("deposit-reply").style.color = '#00ff00';
		}else{
			document.getElementById("deposit_creds").style.display = 'block';
			document.getElementById("deposit_creds").style.color = "#ffffff";
			document.getElementById("make-deposit-button").style.display = 'none';
			document.getElementById("deposit-timer").style.display = 'block';
			document.getElementById("deposit-reply").style.color = "#ff0000";
		}
		document.getElementById("deposit-waiter").style.display = errorBool?'block':'none';
		document.getElementById("submit-deposit-button").style.display = errorBool?'none':'block';
		document.getElementById("report-deposit-button").style.display = errorBool?'none':'block';

		document.getElementById("deposit-reply").innerHTML = message;
		if(newpw){
			document.getElementById("deposit-reply").innerHTML += "<br>The new password is "+newpw
		}
		document.getElementById("deposit-reply").style.display = 'block';
	})

	socket.on('deposit_report_reply',function(message,errorBool){
		if(errorBool){
			document.getElementById("deposit_creds").style.color = "#ffffff";
			document.getElementById("deposit-timer").style.display = 'block';
			document.getElementById("deposit-reply").style.color = '#00ff00';
		}else{
			document.getElementById("deposit-timer").style.display = 'none';
			document.getElementById("deposit_creds").style.color = "#ff0000";
			document.getElementById("deposit-reply").style.color = '#ff0000';
		}
		document.getElementById("make-deposit-button").style.display = errorBool?'none':'block';
		document.getElementById("deposit-waiter").style.display = errorBool?'none':'block';
		document.getElementById("submit-deposit-button").style.display = errorBool?'block':'none';
		document.getElementById("report-deposit-button").style.display = errorBool?'block':'none';
		document.getElementById("deposit_creds").style.display = errorBool?'block':'none';
		document.getElementById("deposit-reply").innerHTML = message;
	})

	document.getElementById('kkshop-package-buybtn').addEventListener("click", function(evt){
		$("#kkshop-package-buybtn").prop("disabled",true);
		document.getElementById('kkshop-package-buybtn').style.backgroundColor="#2a2a2a";
		socket.emit('buyPackage',document.getElementById('test-kk-packages-stage2-name').innerHTML);
	});
	var clearChestTimeout;
	socket.on('buyPackageReply',function(allGood,reply){
		$("#kkshop-package-buybtn").prop("disabled",false);
		document.getElementById('kkshop-package-buybtn').style.backgroundColor="#448844";
		if(!allGood){
			document.getElementById('kkshop-package-error').style.color = "#ff1a1a";
			document.getElementById('kkshop-package-error').innerHTML = reply;
		}else{
			openChest(reply)
			document.getElementById('kkshop-package-error').style.color = "#1afd1a";
			document.getElementById('kkshop-package-error').innerHTML = "Purchase complete!";
		}
	})
	$("#kkshop-package-completebtn").click(function(){
		prepareKKpackOut(KKpackagesOutcome,false);
		if(document.getElementById("kk-packages-complete").style.display == "block"){
			var thisButton = $(this);
			thisButton.prop("disabled",true);
			$("#kk-packages-complete-outcome").animate({bottom:"35%"},380);
			setTimeout(function(){$("#kk-packages-complete-outcome").animate({bottom:"3%"},380);},400)
			setTimeout(function(){thisButton.prop("disabled",false);},850)
		}
	});

	$(".infotab-button").click(function(){
		var findID = $(this).attr('idclick');
		$(".infotab-button").each(function(){
			$(this).removeClass('selected-info');
		})
		$(this).addClass('selected-info');
		$(".info-holder").each(function(){
			if($(this).attr('id') == findID){
				$(this).animate({left:"0%"},400);
			}else{
				$(this).animate({left:"100%"},400);
			}
		})
	});

	function openChest(reply){
		$("#kk-packages-chest-reveal").css("background-image","url('/client/resources/CChest1seq.png')");
		document.getElementById('kk-packages-complete-count').style.display = "none";
		document.getElementById('kkshop-package-completebtn').style.display = "none";
		$("#kk-packages-chest-reveal").css("animation","drop-down 1.5s");
		$("#kk-packages-complete-outcome").css("bottom","35%");
		clearChestTimeout = setTimeout(function(){
			$("#kk-packages-complete-outcome").animate({bottom:"3%"},380);
			$("#kk-packages-chest-reveal").css("animation","chest-open 0.3s steps(1) forwards");
			setTimeout(function(){
				document.getElementById('kk-packages-complete-count').style.display = "block";
				document.getElementById('kkshop-package-completebtn').style.display = "block";
			},400);
		},1750);
		document.getElementById('kk-packages-complete').style.display = "block";
		KKpackagesOutcome = reply;
		window.onresize();
		prepareKKpackOut(KKpackagesOutcome,true);
	}

	function prepareKKpackOut(outcome,fast){
		if(outcome.length == 0){
			document.getElementById('kk-packages-complete').style.display = "none";
			$("#kk-packages-complete-outcome").stop(true, true);
			$("#kk-packages-complete-outcome").css("bottom","35%");
		}else{
			setTimeout(function(){
				if(outcome.length == 1){
					document.getElementById('kkshop-package-completebtn').innerHTML = "Close";
				}else{
					document.getElementById('kkshop-package-completebtn').innerHTML = "Next";
				}
				document.getElementById('kk-packages-complete-outcome').innerHTML = "";
				var popped = outcome.shift();
				document.getElementById('kk-packages-complete-count').innerHTML = outcome.length
				if("items" in popped){
					for(var j in popped.items)document.getElementById('kk-packages-complete-outcome').innerHTML  += "<div class='item chest-reveal-item' style='background-image:url("+ items[window.id_to_pos(parseInt(j))].image.src +");'><div class='chest-reveal-item-q'>"+popped.items[j]+"</div></div>"		
				}else if("ranks" in popped){
					for(var j in popped.ranks)document.getElementById('kk-packages-complete-outcome').innerHTML  += "<div class='chest-reveal-rank-contain'><img class='chest-reveal-rank-img' src='"+siteranks[j].name+"'><div class='chest-reveal-rank-info' style='color:"+siteranks[j].namecolor+"'>"+siteranks[j].title+" Rank<br><span style='font-size:0.6em;color:white;'>Duration: "+time_to_english(popped.ranks[j])+"</span></div></div>" //RANK STUFF GOES HERE
				}else if("KK" in popped){
					document.getElementById('kk-packages-complete-outcome').innerHTML  += "<span style='font-size:2em;color:yellow'>"+popped.KK+"KK</span>"
				}else if("nothing" in popped){
					document.getElementById('kk-packages-complete-outcome').innerHTML  += "<div class='chest-reveal-rank-contain' style='border:none;color:white;font-size: 2em;padding-top:unset;'>Nothing!<br><span style='font-size:0.6em;'>Sorry, Try again!</span></div>" //RANK STUFF GOES HERE
				}
			},fast?1:400);
		}
	}

	socket.on('purchaseResponse',function(allGood,reply){
		if(allGood){
			document.getElementById('test-kk-shop-stage2-buy-msg').innerHTML = reply;
			$("#test-kk-shop-stage2-buy-btn").prop("disabled",false);
		}
	})

	$( 'button.test-kk-shop-switch' ).click(function(){
		if($(this).attr('id') == "kk-stoRS"){
			window.open('https://realmstock.com/');
		}else{
			var shop_switches = document.getElementsByClassName("kk-important-info");
			for(var h =0; h < shop_switches.length;h++)shop_switches[h].style.display = 'none';
		}
	})
	document.getElementById('kk-stoitems').onclick = function(){document.getElementById('kk-item-info').style.display = 'block';}
	document.getElementById('kk-stopacks').onclick = function(){document.getElementById('kk-packages-info').style.display = 'block';}
	document.getElementById('kk-stoclrs').onclick = function(){document.getElementById('kk-colors-info').style.display = 'block';}
	document.getElementById('kk-storanks').onclick = function(){document.getElementById('kk-ranks-info').style.display = 'block';}
	document.getElementById('kk-stokk').onclick = function(){document.getElementById('kk-buykk-info').style.display = 'block';}
	function build_pack_price(price){
		var a = [];
		if("KK" in price)a.push("<span style='color:yellow'>"+price.KK+"KK</span>")
		if("items" in price)a.push("Items" + form_help_bubble(price.items));
		return "<span style='color:yellow;'>Price: </span>"+a.join(" and ");
	}
	function form_help_bubble(obj_of_items){
		var block = '<div class="hover-for-info kk-pack-hoverinfo">?<div class="hover-for-info-content">'
		for(var i in obj_of_items)block +=  "<div class='kkpitemchance' style='position:relative;background-image:url("+ items[window.id_to_pos(i)].image.src +");background-size: contain;'>" + (obj_of_items[i]==1?"":"<div class='wdItemQuant' style='text-align:left;'>"+obj_of_items[i]+"</div>")+"</div>"
		block += '</div></div>';
		return block;
	}

	var KKpackages = [];
	var KKpackagesOutcome = [];
	socket.on('returnPackages',function(packs){
		KKpackages = packs;
		document.getElementById('test-packages-info').innerHTML = "";
		for(var m in packs){
			if(packs[m].expiry > Date.now() && packs[m].stock > 0){
				var block = "<div name='"+escapeHtml(packs[m].name)+"'class='kk-package-pack'><div class='kk-package-img' style='background:url(\""+packs[m].img+"\");background-size: contain;background-repeat: no-repeat;'></div><div class='kk-package-packinfo'>"+packs[m].name+" - Stock: "+packs[m].stock+"<br>";
				block += build_pack_price(packs[m].price);
				block += "<br><span style='font-size:0.8em;'>Expires in "+time_to_english(packs[m].expiry - Date.now())+".</span></div></div>"
				document.getElementById('test-packages-info').innerHTML += block;
			}
		}

		$( 'div.kk-package-pack' ).click(function(){
			for(var n in KKpackages){
				if(escapeHtml(KKpackages[n].name) == escapeHtml($(this).attr('name'))){
					document.getElementById('kkshop-package-error').innerHTML = "";
					document.getElementById('test-kk-packages-stage2-name').innerHTML = KKpackages[n].name;
					document.getElementById('test-kk-shop').style.display = "none";
					document.getElementById('test-kk-packages-stage2').style.display = "block";
					document.getElementById('kkshop-package-buybtnprice').innerHTML = build_pack_price(KKpackages[n].price);

					var block = "<div style='width: 100%;padding-top:30%;position:relative;'><img src='"+KKpackages[n].img+"' style='position:absolute;left:0px;top:0px;width:50%'><div class='packages_desc'>"+escapeHtml(KKpackages[n].desc)+"</div></div>";
					if(Object.keys(KKpackages[n].items).length > 0 || "chance" in KKpackages[n].special || "additional" in KKpackages[n].special || "chance_multiple" in KKpackages[n].special){
						block += "<div style='width: 100%'><span class='kkshop-package-header'>Items</span><br>"

						if(Object.keys(KKpackages[n].items).length > 0){
							block += "<div style='width: 100%'><span class='kkshop-package-header-small'>You get:</span><br>"
							for(var j in KKpackages[n].items)block+= "<div class='kkpitem' style='position:relative;background-image:url("+ items[window.id_to_pos(parseInt(j))].image.src +");background-size: contain;'>"+ (KKpackages[n].items[j]==1?"":("<div class='wdItemQuant' style='text-align:left;'>"+KKpackages[n].items[j]+"</div>")) + "</div>";
						}

						if("chance" in KKpackages[n].special){
							for(var i in KKpackages[n].special.chance){
								block += "<div style='width: 100%'><span class='kkshop-package-header-small'>You get one of these:</span><br><div style='border:solid 3px #333;position: relative;display: inline-block;background-color:#2e2e2e'>"
								for(var j in KKpackages[n].special.chance[i])block+= "<div class='kkpitemchance' style='position:relative;background-image:url("+ items[window.id_to_pos(KKpackages[n].special.chance[i][j].id)].image.src +");background-size: contain;'>" + (KKpackages[n].special.chance[i][j].quant==1?"":"<div class='wdItemQuant' style='text-align:left;'>"+KKpackages[n].special.chance[i][j].quant+"</div>")+"<div class='kkpitemprob'>" +Number(KKpackages[n].special.chance[i][j].prob.toFixed(2))+"%</div></div>"
								block+="</div><br></div>"
							}
						}
						if("chance_multiple" in KKpackages[n].special){
							for(var i in KKpackages[n].special.chance_multiple){
								block += "<div style='width: 100%'><span class='kkshop-package-header-small'>You get one of these:</span><br>"
								for(var j in KKpackages[n].special.chance_multiple[i]){
									block += "<div style='border:solid 2px #cd0;position: relative;display: inline-block;background-color:#2e2e2e'>"
									for(var x in KKpackages[n].special.chance_multiple[i][j].items)block+="<div class='kkpitemchance' style='position:relative;background-image:url("+ items[window.id_to_pos(x)].image.src +");background-size: contain;'>" + (KKpackages[n].special.chance_multiple[i][j].items[x]==1?"":"<div class='wdItemQuant' style='text-align:left;'>"+KKpackages[n].special.chance_multiple[i][j].items[x]+"</div>") + "</div>"
									block+= "<div class='kkpitemprob'>"+Number(KKpackages[n].special.chance_multiple[i][j].prob.toFixed(2))+"%</div></div>"
								}
								block+="</div><br>"
							}
						}
						if("additional" in KKpackages[n].special){
							block += "<div style='width: 100%'><span class='kkshop-package-header-small'>Chance to win items:</span><br>"
							for(var i in KKpackages[n].special.additional){
								block+="<div style='border:solid 3px #aa3;margin:8px;position: relative;display: inline-block;background-color:#2e2e2e'>"
								block+= "<div class='kkpitemchance' style='position:relative;background-image:url("+ items[window.id_to_pos(KKpackages[n].special.additional[i].id)].image.src +");background-size: contain;'>" + (KKpackages[n].special.additional[i].quant==1?"":"<div class='wdItemQuant' style='text-align:left;'>"+KKpackages[n].special.additional[i].quant+"</div>") + "<div class='kkpitemprob'>"+Number(KKpackages[n].special.additional[i].prob.toFixed(2))+"%</div></div>"
								block+="</div>"
							}
							block += "</div>"
						}
						block += "</div>"
					}
					if(round.rank > 0 && Object.keys(KKpackages[n].ranks).length > 0){
						block += "<div style='width: 100%'><span class='kkshop-package-header'>Ranks</span><br>"
						for(var j in KKpackages[n].ranks)block+= "<div class='kkprankcontain'><img class='kkprankimg' src='"+siteranks[j].name+"'><div class='kkprankinfo' style='color:"+siteranks[j].namecolor+"'>"+siteranks[j].title+" Rank<br><span style='font-size:0.6em;color:white;'>Duration: "+time_to_english(KKpackages[n].ranks[j])+"</span></div></div>" //RANK STUFF GOES HERE
						block += "</div>"
					}
					document.getElementById('kkshop-package-info').innerHTML = block;
					window.onresize();
					break;
				}
			}
		});
	})
	function time_to_english(mtime){
		if(mtime <= 0)return "now"
		var num = 0;
		var count = 0;
		var timetype = [31536000000,2592000000,604800000,86400000,3600000,60000,1000];
		var timeid = ["year","month","week","day","hour","minute","second"];
		var string = "";
		mtime = Math.ceil(mtime/1000)*1000
		for(var x = 0; x<timetype.length; x++){
			if(mtime>=timetype[x]){
				count++
				num = (mtime/timetype[x]);
				var num2 = Math.floor(num);
				var dec = (num%1);
				mtime = Math.ceil(dec*timetype[x]);
				if(count<4){
					var plural = "s"
					if(num<2){
						plural = ""
					}
					if(count==2&&mtime>=500){
						string+= ", "
					}
					if(count==2&&mtime<=500){			
						string+=" and "
					}
					if(count==3){
						string+= " and "
					}
					string += num2.toString() + " " + timeid[x] + plural
				}
			}
		}
		return string
	}

	var KKitemselected = 0;
	socket.on('shop',function(shopinv){
		document.getElementById('test-kk-shop-table').innerHTML = "";
		for(var j in shopinv){
			if(shopinv[j].quant > 0){
				block = "<div class='shop-i item' name='"+ escapeHtml(items[window.id_to_pos(shopinv[j].id)].name) +"' style='background-image:url("+ items[window.id_to_pos(shopinv[j].id)].image.src +");"
				block += " background-size: contain;  '"
				block += "itemid='"+ shopinv[j].id +"'"
				block += "itemprice='"+ shopinv[j].id +"'"
				block += "itemquant='"+ shopinv[j].quant +"'>"
				block += "</div>"
				document.getElementById('test-kk-shop-table').innerHTML += block;
			}
		}
		$( '.shop-i' ).mouseenter( function(){
			var block = "<span style='font-size:36px;'>"
			block += escapeHtml($(this).attr('name')) + "<br>"
			block += $(this).attr('itemquant')  +" left in stock!<br>Base price: ";
			var itemprice = Number((Math.round(FtoKK(items[window.id_to_pos(Number($(this).attr('itemid')))].val,1)*10)/10).toFixed(1));
			block += (itemprice>=myInv.KK?"<span style='color:#ee6666'>":"<span style='color:#66ee66'>") + itemprice +"KK</span></span>";
			document.getElementById('test-kk-shop-info').innerHTML = block;
		}).mouseleave( function(){
			document.getElementById('test-kk-shop-info').innerHTML = "";
		}).click(function(){
			window.onlyOpenOneWindow('test-kk-shop-stage2');
			document.getElementById('test-kk-shop-stage2-name').innerHTML = "How many of "+$(this).attr('name')+" would you like to purchase?"

			document.getElementById('test-kk-shop-stage2-img').style.backgroundImage = $(this).css('background-image')
			document.getElementById('test-kk-shop-stage2-img2').style.backgroundImage = $(this).css('background-image')

			document.getElementById('test-kk-shop-stage2-buy-msg').innerHTML = ""

			document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = ""
			document.getElementById("test-kk-shop-stage2-quantitybox").value = ""

			KKitemselected = $(this).attr('itemid');
			quantitemselected = $(this).attr('itemquant');

			$("#test-kk-shop-stage2-quantitybox").on('keyup', function (e) {
				quantityK = document.getElementById("test-kk-shop-stage2-quantitybox").value;
				if(quantityK == ""){
					document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = ""
					$("#test-kk-shop-stage2-buy-btn").prop("disabled",true);
				}else if(isNaN(Number(quantityK))){
					document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = "Not a valid number!"
					$("#test-kk-shop-stage2-buy-btn").prop("disabled",true);
				}else if(Number(quantityK) != parseInt(quantityK)){
					document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = "Cannot use decimals!"
					$("#test-kk-shop-stage2-buy-btn").prop("disabled",true);
				}else if(parseInt(quantityK) < 1){
					document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = "Can't buy negative or zero!"
					$("#test-kk-shop-stage2-buy-btn").prop("disabled",true);
				}else{
					KKshopprice = Number((Math.round(FtoKK(items[window.id_to_pos(Number(KKitemselected))].val,parseInt(quantityK))*parseInt(quantityK)*10)/10).toFixed(1))
					if(parseInt(quantityK) > quantitemselected){
						document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = "There is not enough of this to buy!"
						$("#test-kk-shop-stage2-buy-btn").prop("disabled",true);
					}else if(KKshopprice > myInv.KK){
						document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = "You do not have enough KK to buy this!"
						$("#test-kk-shop-stage2-buy-btn").prop("disabled",true);
					}else{
						document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = "Price: " + KKshopprice + "KK"
						$("#test-kk-shop-stage2-buy-btn").prop("disabled",false);
					}
				}
			});

			document.getElementById('test-kk-shop-stage2-buy-btn').onclick = function(){
				socket.emit('buy',Number(KKitemselected),Number(document.getElementById("test-kk-shop-stage2-quantitybox").value));
				$("#test-kk-shop-stage2-buy-btn").prop("disabled",true);
			};

			$('#test-kk-shop-stage2-maximize').click(function(){
				maxprice = Number((Math.round(FtoKK(items[window.id_to_pos(Number(KKitemselected))].val,parseInt(quantitemselected))*parseInt(quantitemselected)*10)/10).toFixed(1))
				if(maxprice <= myInv.KK){
					document.getElementById("test-kk-shop-stage2-quantitybox").value = quantitemselected;
					document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = "Price: " + maxprice + "KK"
					$("#test-kk-shop-stage2-buy-btn").prop("disabled",false);
				}else{
					lowestprice = Number((Math.round(FtoKK(items[window.id_to_pos(Number(KKitemselected))].val,1)*10)/10).toFixed(1))
					if(lowestprice > myInv.KK){
						document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = "You do not have enough KK to buy any of this!"
						$("#test-kk-shop-stage2-buy-btn").prop("disabled",true);
					}else{
						max_quant = highest_quant(1,parseInt(quantitemselected)-1,myInv.KK,parseInt(KKitemselected));
						document.getElementById("test-kk-shop-stage2-quantitybox").value = max_quant;
						price_of_max_quant = Number((Math.round(FtoKK(items[window.id_to_pos(Number(KKitemselected))].val,max_quant)*max_quant*10)/10).toFixed(1))
						document.getElementById('test-kk-shop-stage2-price-msg').innerHTML = "Price: " + price_of_max_quant + "KK"
						$("#test-kk-shop-stage2-buy-btn").prop("disabled",false);
					}
				}
			})
		});
	});

	socket.on('tasks',function(tasks){
		update_tasks(tasks);
	});
	socket.on('update_tasks',function(tasks,cc){
		update_tasks(tasks);	
		var itemBlock = "";
		for(var i in cc.items)itemBlock += list_prizes_snippet2(i,cc.items[i],25)
		if(cc.amount > 0){
			document.getElementById('WOW_OJ_TASKS_COMPLETE').style.display = "block";
			document.getElementById('WOW_OJ_TASKS_COMPLETE').innerHTML = "<span>"+ cc.amount + " challenge" + (cc.amount==1?"":"s") + " complete!</span>"+ (cc.KK==0?"":"<br><span style='color:#ffff00'>"+cc.KK+" KK</span>") + "<br><span style='position: relative;top: -11px;'>"+itemBlock+"</span>"
			$('#WOW_OJ_TASKS_COMPLETE').delay(7000).fadeOut(1200);
		}
	});
	document.getElementById('WOW_OJ_TASKS_COMPLETE').addEventListener("click", function(evt){window.onlyOpenOneWindow("giveaway_window");});
	function list_prizes_snippet2(id,quant,size){
		block = "<span style='height:"+size+"px;-webkit-text-fill-color: white;-webkit-text-stroke-width: 1px;-webkit-text-stroke-color: black;'>" + quant + "</span>"
		block += "<div class='item' style='font-size:26px;background-image:url("+ items[window.id_to_pos(id)].image.src +");width:"+size+"px;height:"+size+"px;top: 8px;background-size: contain;color:#ffffff; '></div>"
		return block;
	}
	function series_of_challenges(task_bunch){
		var data = "";
		var lastChallengeDone = true;
		for(var i = 0; i < task_bunch.length; i++){
			if(lastChallengeDone){
				lastChallengeDone = task_bunch[i].task.track //overwrite if current challenge is done
				data += add_task_title_snip2(task_bunch[i].title,lastChallengeDone) + add_progression_bar_snip2(task_bunch[i].percent,task_bunch[i].text) + add_task_prize_snip(task_bunch[i].task);
			}
		}
		return data;
	}
	function update_tasks(tasks){
		document.getElementById('giveaway_table_daily').innerHTML = series_of_challenges([
			{title:"Play some OryxJackpot!",percent:tasks.daily.total_wagered/200,task:tasks.daily.total_wagered_200,text:"Wager a total of 200F"},
			{title:"Play some OryxJackpot! II",percent:tasks.daily.total_wagered/1000,task:tasks.daily.total_wagered_1000,text:"Wager a total of 1000F"}
		])+ "<br>" + series_of_challenges([
			{title:"Make some money!",percent:tasks.daily.total_won/100,task:tasks.daily.total_won_100,text:"Win a total of 100F"}
		])+ "<br>" + series_of_challenges([
			{title:"Play Jackpot!",percent:tasks.daily.total_wagers_jp/5,task:tasks.daily.total_wagers_5_jp,text:"Play the Jackpot gamemode 5 times!"}
		])+ "<br>" + series_of_challenges([
			{title:"Play Break the Chest!",percent:tasks.daily.total_wagers_btc/5,task:tasks.daily.total_wagers_5_btc,text:"Play the Break the Chest gamemode 5 times!"}
		])+ "<br>" + series_of_challenges([
			{title:"Play Coinflip!",percent:tasks.daily.total_wagers_cf/5,task:tasks.daily.total_wagers_5_cf,text:"Play the Coinflip gamemode 5 times!"}
		])

		document.getElementById('giveaway_table_general').innerHTML = series_of_challenges([
			{title:"Wager items!",percent:tasks.general.total_wagered/100,task:tasks.general.total_wager_100,text:"Wager a total of 100F"},
			{title:"Wager items! II",percent:tasks.general.total_wagered/1500,task:tasks.general.total_wager_1500,text:"Wager a total of 1500F"},
			{title:"Wager items! III",percent:tasks.general.total_wagered/25000,task:tasks.general.total_wager_25000,text:"Wager a total of 25000F"},
			{title:"Wager items! IV",percent:tasks.general.total_wagered/80000,task:tasks.general.total_wager_80000,text:"Wager a total of 80000F"},
			{title:"Wager items! V",percent:tasks.general.total_wagered/200000,task:tasks.general.total_wager_200000,text:"Wager a total of 200000F"},
			{title:"Wager items! VI",percent:tasks.general.total_wagered/777777,task:tasks.general.total_wager_777777,text:"Wager a total of 777777F"}
			]) + "<br>" + series_of_challenges([
			{title:"Win rounds!",percent:tasks.general.total_wins,task:tasks.general.total_wins_1,text:"Win a round"},
			{title:"Win rounds! II",percent:tasks.general.total_wins/10,task:tasks.general.total_wins_10,text:"Win 10 rounds"},
			{title:"Win rounds! III",percent:tasks.general.total_wins/100,task:tasks.general.total_wins_100,text:"Win 100 rounds"},
			{title:"Win rounds! IV",percent:tasks.general.total_wins/1000,task:tasks.general.total_wins_1000,text:"Win 1000 rounds"}
			]) + "<br>" + series_of_challenges([
			{title:"Win items!",percent:tasks.general.total_won/300,task:tasks.general.total_won_300,text:"Win a total of 300F"},
			{title:"Win items! II",percent:tasks.general.total_won/4500,task:tasks.general.total_won_4500,text:"Win a total of 4500F"},
			{title:"Win items! III",percent:tasks.general.total_won/60000,task:tasks.general.total_won_60000,text:"Win a total of 60000F"},
			{title:"Win items! IV",percent:tasks.general.total_won/100000,task:tasks.general.total_won_100000,text:"Win a total of 100000F"},
			{title:"Win items! IV",percent:tasks.general.total_won/222222,task:tasks.general.total_won_222222,text:"Win a total of 222222F"}
			]) + "<br>" + series_of_challenges([
			{title:"Get lucky!",percent:(100-tasks.general.luckiest_win)/80,task:tasks.general.win_below_20,text:"Win with less than a 20% chance"},
			{title:"Get lucky! II",percent:(20-tasks.general.luckiest_win)/10,task:tasks.general.win_below_10,text:"Win with less than a 10% chance"},
			{title:"Get lucky! III",percent:(10-tasks.general.luckiest_win)/5,task:tasks.general.win_below_5,text:"Win with less than a 5% chance"},
			{title:"Get lucky! IV",percent:(5-tasks.general.luckiest_win)/3,task:tasks.general.win_below_2,text:"Win with less than a 2% chance"}
			]) + "<br>" + series_of_challenges([
			{title:"Better luck next time!",percent:tasks.general.total_rounds_lost/10,task:tasks.general.lose_rounds_10,text:"Lose 10 rounds"},
			{title:"Better luck next time! II",percent:tasks.general.total_rounds_lost/100,task:tasks.general.lose_rounds_100,text:"Lose 100 rounds"},
			{title:"Better luck next time! III",percent:tasks.general.total_rounds_lost/1000,task:tasks.general.lose_rounds_1000,text:"Lose 1000 rounds"},
			{title:"Better luck next time! IV",percent:tasks.general.total_rounds_lost/10000,task:tasks.general.lose_rounds_10000,text:"Lose 10000 rounds"}
			]) + "<br>" + series_of_challenges([
			{title:"Cruel Fate",percent:tasks.general.unluckiest_loss/70,task:tasks.general.lose_with_70,text:"Lose with more than a 70% chance"},
			{title:"Cruel Fate II",percent:tasks.general.unluckiest_loss/80,task:tasks.general.lose_with_80,text:"Lose with more than a 80% chance"},
			{title:"Cruel Fate III",percent:tasks.general.unluckiest_loss/86,task:tasks.general.lose_with_86,text:"Lose with more than a 86% chance"},
			{title:"Cruel Fate IV",percent:tasks.general.unluckiest_loss/92,task:tasks.general.lose_with_92,text:"Lose with more than a 92% chance"},
			]) + "<br>" + series_of_challenges([
			{title:"You were SO close!",percent:tasks.general.so_close_60_hash.track?100:0,task:tasks.general.so_close_60_hash,text:"Lose by a 6% difference or less"},
			{title:"You were SO close! II",percent:tasks.general.so_close_20_hash.track?100:0,task:tasks.general.so_close_20_hash,text:"Lose by a 2% difference or less"},
			{title:"You were SO close! III",percent:tasks.general.so_close_08_hash.track?100:0,task:tasks.general.so_close_08_hash,text:"Lose by a 0.8% difference or less"}
			]) + "<br>" + series_of_challenges([
			{title:"That's really low",percent:tasks.general.hash_lower_than_pt5.track?100:0,task:tasks.general.hash_lower_than_pt5,text:"Participate in a round with the hash lower than 0.5"},
			]) + "<br>" + series_of_challenges([
			{title:"That's really high",percent:tasks.general.hash_higher_than_99pt5.track?100:0,task:tasks.general.hash_higher_than_99pt5,text:"Participate in a round with the hash higher than 99.5"},
			]);

		document.getElementById('giveaway_table_jackpot').innerHTML = series_of_challenges([
			{title:"Off by an inch",percent:tasks.jackpot.close_image_roll.track?100:0,task:tasks.jackpot.close_image_roll,text:"With at most a 20% chance, lose with your image to the left and the right of the winner."},
			]) + "<br>" + series_of_challenges([
			{title:"Party in the House",percent:tasks.jackpot.participate_6_unique.track?100:0,task:tasks.jackpot.participate_6_unique,text:"Participate in a round with at least 6 players"},
			{title:"Party in the House II",percent:tasks.jackpot.participate_12_unique.track?100:0,task:tasks.jackpot.participate_12_unique,text:"Participate in a round with at least 12 players"}
			]) + "<br>" + series_of_challenges([
			{title:"The longest round ever!",percent:tasks.jackpot.timer_got_to_50_secs.track?100:0,task:tasks.jackpot.timer_got_to_50_secs,text:"Participate in a round where the timer reached 50 seconds"},
			]) + "<br>" + series_of_challenges([
			{title:"I have a dream...",percent:tasks.jackpot.pot_at_least_25000F.track?100:0,task:tasks.jackpot.pot_at_least_25000F,text:"Participate in a round where the pot is at least 25000F"},
			]) + "<br>" + series_of_challenges([
			{title:"Same game, different rules",percent:tasks.jackpot.special_rounds_count,task:tasks.jackpot.special_rounds_1,text:"Participate in a special round"},
			{title:"Same game, different rules II",percent:tasks.jackpot.special_rounds_count/10,task:tasks.jackpot.special_rounds_10,text:"Participate in 10 special rounds"},
			{title:"Same game, different rules III",percent:tasks.jackpot.special_rounds_count/100,task:tasks.jackpot.special_rounds_100,text:"Participate in 100 special rounds"}
			]);

		document.getElementById('giveaway_table_btc').innerHTML = series_of_challenges([
			{title:"Swordsman!",percent:tasks.btc.win_chest_one_swing.track?100:0,task:tasks.btc.win_chest_one_swing,text:"Break the chest containing at least 200F with just one sword swing"}
			]) + "<br>" + series_of_challenges([
			{title:"Hollow Chest",percent:tasks.btc.witness_1HP_chest.track?100:0,task:tasks.btc.witness_1HP_chest,text:"Participate in a round where the chest has 1HP when it could have had at least 100HP"},
			])+ "<br>" + series_of_challenges([
			{title:"Sturdy Chest",percent:tasks.btc.witness_1000HP_chest.track?100:0,task:tasks.btc.witness_1000HP_chest,text:"Participate in a round where the chest has at least 1000HP"},
			])

		document.getElementById('giveaway_table_coinflip').innerHTML = series_of_challenges([
			{title:"Coin Connoisseur",percent:replaceAll(tasks.coinflip.play_as_every_coin_track,"0","").length/30,task:tasks.coinflip.play_as_every_coin,text:"Play at least once as every coin"},
			{title:"Coin Connoisseur II",percent:replaceAll(tasks.coinflip.win_as_every_coin_track,"0","").length/30,task:tasks.coinflip.win_as_every_coin,text:"Win at least once as every coin"}
			]) + "<br>" + series_of_challenges([
			{title:"Coinflip Hijacker",percent:tasks.coinflip.joined_rooms/100,task:tasks.coinflip.join_100_rooms,text:"Join 100 Rooms"},
			{title:"Coinflip Hijacker II",percent:tasks.coinflip.joined_rooms/1000,task:tasks.coinflip.join_1000_rooms,text:"Join 1000 Rooms"}
			])
	}

	function minutesToMsg(mtime){
		if(mtime <= 0)return "now"
		var num = 0;
		var count = 0;
		var timetype = [31536000000,2592000000,604800000,86400000,3600000,60000,1000];
		var timeid = ["year","month","week","day","hour","minute","second"];
		var string = "";
		mtime = Math.ceil(mtime/1000)*1000
		for(var x = 0; x<timetype.length; x++){
			if(mtime>=timetype[x]){
				count++
				num = (mtime/timetype[x]);
				var num2 = Math.floor(num);
				var dec = (num%1);
				mtime = Math.ceil(dec*timetype[x]);
				if(count<4){
					var plural = "s"
					if(num<2){
						plural = ""
					}
					if(count==2&&mtime>=500){
						string+= ", "
					}
					if(count==2&&mtime<=500){			
						string+=" and "
					}
					if(count==3){
						string+= " and "
					}
					string += num2.toString() + " " + timeid[x] + plural
				}
			}
		}
		return string
	}

	function add_progression_bar_snip2(percentage,text){
		return '<div style="position:absolute;width:50%;right:5%;display: inline-block;"><div class="task_progressbar"><div class="task_prenup">'+text+'</div><div class="task_progressbar progression_bar" style="width:'+Math.min(percentage*100,100)+'%;"></div></div></div>'
	}
	function add_task_title_snip2(title,complete){
		return complete==true? ('<div><div class="task_title" style="color:#22aa22;">'+title+'</div>') :('<div><div class="task_title">'+title+'</div>');
	}
	function add_task_prize_snip(task){
		var itemSnip = "";
		var sumF = 0;
		for(var i in task.items){
			itemSnip+=' <div class="item task_item" style="background-image:url(\''+items[window.id_to_pos(i)].image.src+'\')">'+task.items[i]+'</div>';
			sumF += items[window.id_to_pos(i)].val * task.items[i];
		}
		var chooseImageT = (itemSnip=="") ? "/client/resources/CChest2.png" : ((sumF >= 2000 || task.KK>=200) ? "/client/resources/CChest3.png" : (sumF >= 400 ? "/client/resources/CChest1.png" : "/client/resources/CChest4.png"));
		return '<div class="task_prize_hover" style="background-image:url(\''+chooseImageT+'\')"><div class="task_prize_tooltip">'+ itemSnip + (task.KK==0?'':('<div class="task_KK">'+ task.KK +'KK</div>')) +'</div></div></div><br>';
	}

	function highest_quant(low,high,KKALLOWED,ITEMID){
		if(low == high){
			return low
		}else{
			medium = Math.ceil((low+high)/2);
			price_to_compare = Number((Math.round(FtoKK(items[window.id_to_pos(ITEMID)].val,medium)*medium*10)/10).toFixed(1))
			if(price_to_compare > KKALLOWED){
				return highest_quant(low,medium-1,KKALLOWED,ITEMID);
			}else{
				return highest_quant(medium,high,KKALLOWED,ITEMID); 
			}
		}
	}

	var cachedMules = {cache:[],filtered:[]};
	socket.on('getPossibleMules',function(muleList){
		document.getElementById('withdraw_mules_listed').innerHTML = "";
		if(muleList.length == 0){
			document.getElementById('withdraw_mules_listed').innerHTML = "<div id='iw-no-mules'>There are no available mules that you can withdraw.<br/>You should use regular withdrawals instead.</div>";
		}else{
			for(var x in muleList)muleList[x].items.sort(function(a,b){return b-a});
			cachedMules.cache = muleList.slice();
			for(var x in cachedMules.cache){
				var total = 0;
				for(var y in cachedMules.cache[x].items)total += items[window.id_to_pos(cachedMules.cache[x].items[y])].val;
				cachedMules.cache[x].sortby = {F:total,il:cachedMules.cache[x].items.length}
			}
			cachedMules.filtered = cachedMules.cache.slice();
			filterCachedMules();
			sortCachedMules();
			$('#withdraw_mules_listed').html(iwpage(1));
		}
		
	});
	$("#iw-page-left").on('click',function(){
		$('#withdraw_mules_listed').html(iwpage(parseInt($("#withdraw_mules_listed").attr("page"))-1));
	})
	$("#iw-page-right").on('click',function(){
		$('#withdraw_mules_listed').html(iwpage(parseInt($("#withdraw_mules_listed").attr("page"))+1));
	})
	$("div").on("click", "button.withdraw_mule_button", function(){
		$(this).prop("disabled",true);
		$(this).css("background-color","#222");
		$(this).text("Hold on...");
		socket.emit('withdraw_mule',$(this).attr('email'))
	});

	function iwpage(p){
		$("#iw-page-left").prop("disabled",true);
		$("#iw-page-left").css("background-color","#222");
		$("#iw-page-right").prop("disabled",true);
		$("#iw-page-right").css("background-color","#222");
		if(p==0){
			return "<div id='iw-wait'>Checking for possible mules...</div>"
		}else{
			$("#withdraw_mules_listed").attr('page', p);
			if(cachedMules.filtered.length > 0){
				data = "";
				for(var i = 50*(p-1); i < Math.min(cachedMules.filtered.length,50*p); i++){
					data+="<li style='position: relative;border-bottom:solid 1px white;'><div style='width:82%;left:0px;'>"
					for(var j in cachedMules.filtered[i].items){
						data += "<div class='item' style='background-image:url("+ items[window.id_to_pos(cachedMules.filtered[i].items[j])].image.src +");background-size: contain;width:40px;height:40px;'></div>"
					}
					data+="</div><div style='position:absolute;width:16%;right:0px;top:0px;bottom:0px;'>"
					data+='<button type="button" email="'+cachedMules.filtered[i].email+'" class="new-menu-button withdraw_mule_button">Withdraw</button>';
					data+='</div><div class="withdraw_mule_reply"></div></li>';
				}
				if(p>1){
					$("#iw-page-left").prop("disabled",false);
					$("#iw-page-left").removeAttr('style');
				}
				if(cachedMules.filtered.length > 50*p){
					$("#iw-page-right").prop("disabled",false);
					$("#iw-page-right").removeAttr('style');
				}
				$("#iw-page").html("Page " + p + " / " + Math.ceil(cachedMules.filtered.length/50));
				return data;
			}else{
				$("#iw-page").html("Page 0 / 0");
				return "<div id='iw-no-mules-filtered'>There are no mules with your filter.</div>";
			}
		}
	}

	$("#withdrawSearch").on('keyup', function (e) {
		if(e.keyCode == 13){
		    filterCachedMules();
		    sortCachedMules();
		    $('#withdraw_mules_listed').html(iwpage(1));
		}
	});


	socket.on('withdraw_mule_reply',function(email,reply,allGood,Canceldisable){
		$(".withdraw_mule_button").each(function(){
			if($(this).attr('email') == email){
				if(!Canceldisable){
					$(this).css("display","none");
				}else{
					$(this).prop("disabled",false);
					$(this).removeAttr('style');
					$(this).html("Withdraw");
				}
				if(allGood){
					$("#iw-mule-email").val(reply[0]);
					$("#iw-mule-password").val(reply[1]);
					$("#iw-withdraw-complete").css('display','block');
					window.onresize();
					var prevWithdrawn = localStorage.getItem("instant_withdrawn2") || "|" ;
					prevWithdrawn = "|" + reply[0]+":"+reply[1] + prevWithdrawn
					localStorage.setItem("instant_withdrawn2",prevWithdrawn);
				}else{
					var muleReply = $(this).parent().parent().children()[2];
					muleReply.innerHTML = reply;
				}
			}
		})
	});

	var withdrawalFree = 0;

	socket.on('muleInfo',function(listofItems,errorBool){
		document.getElementById('withdraw-wait').style.display = 'none';
		document.getElementById('withdraw-error').style.color = '#00ff00'
		if(errorBool){
			withdrawalFree = listofItems.length;
			document.getElementById('withdraw-items-insert').style.display = 'block';	
			document.getElementById('withdraw-owned-items').innerHTML = "";
			document.getElementById('withdraw-chosen-items').innerHTML = "";
			document.getElementById('withdraw-chosen-quant').innerHTML = withdrawalFree>0?("Choose " + withdrawalFree + " item" + (withdrawalFree==1?"":"s")):"No more space!";
			for(var j in myInv.items){
				if(myInv.items[j].quant>0){
					block = "<div class='item wd_unchosen' style='position:relative;background-image:url("+ items[myInv.items[j].id].image.src +"); background-size: contain;  '"
					block += "itemid='"+ myInv.items[j].id +"' itemq='"+ myInv.items[j].quant +"'>"
					block += "<div class='wdItemQuant'>"+myInv.items[j].quant+"</div>"
					block += "</div>"
					document.getElementById('withdraw-owned-items').innerHTML += block;
				}
			}
			document.getElementById('withdraw-error2').innerHTML = "";
		}else{
			document.getElementById('withdraw-prompt').style.display = 'block';
			document.getElementById('withdraw-error').style.color = '#ff0000'
			document.getElementById('withdraw-error').innerHTML = listofItems;
			document.getElementById('remove-withdrawal').style.display = listofItems.indexOf("You already have a pending withdrawal.") == 0?'block':'none';
			if(listofItems.indexOf("You have removed your pending withdrawal") == 0){
				document.getElementById('withdraw-error').style.color = '#00ff00';
				document.getElementById('remove-withdrawal').style.display = 'none';
				document.getElementById('withdrawal_hide_if_current').style.display = 'block';
			}
		}
	});

	document.getElementById('withdraw-submit2').addEventListener("click", function(evt){
		var IDofITEMS = [];
		list = document.getElementById('withdraw-chosen-items').getElementsByTagName('div');
		for (var i = 0; i < list.length; i++)IDofITEMS.push(items[parseInt(list[i].getAttribute("itemid"))].id);
		socket.emit('withdraw',document.getElementById('withdraw-user').value,document.getElementById('withdraw-pw').value,IDofITEMS);
		document.getElementById('withdraw-items-insert').style.display = "none";
		document.getElementById('withdraw-wait2').style.display = "block";
	})

	$(document).on('click', '.wd_unchosen', function() {
		if(withdrawalFree > 0){
			var itemID = parseInt($(this).attr('itemid'));
			var itemQ = parseInt($(this).attr('itemq'));
			if(keyDown[16]){
				var bigQ = Math.min(itemQ,withdrawalFree);
				if(itemQ-bigQ ==0){
					$(this).remove();
				}else{
					$(this).attr("itemq",itemQ-bigQ)
					$(this).html("<div class='wdItemQuant'>"+(itemQ-bigQ)+"</div>");
				}
				withdrawalFree-= bigQ;
				document.getElementById('withdraw-chosen-quant').innerHTML = withdrawalFree>0?("Choose " + withdrawalFree + " item" + (withdrawalFree==1?"":"s")):"No more space!";
				for(var i = 0; i < bigQ; i++)document.getElementById('withdraw-chosen-items').innerHTML += "<div class='item wd_chosen' itemid='"+ itemID +"' style='position:relative;background-image:url("+ items[itemID].image.src +"); background-size: contain;'></div>";
			}else{
				if(itemQ==1){
					$(this).remove();
				}else{
					$(this).attr("itemq",itemQ-1)
					$(this).html("<div class='wdItemQuant'>"+(itemQ-1)+"</div>");
				}
				withdrawalFree--;
				document.getElementById('withdraw-chosen-quant').innerHTML = withdrawalFree>0?("Choose " + withdrawalFree + " item" + (withdrawalFree==1?"":"s")):"No more space!";
				document.getElementById('withdraw-chosen-items').innerHTML += "<div class='item wd_chosen' itemid='"+ itemID +"' style='position:relative;background-image:url("+ items[itemID].image.src +"); background-size: contain;'></div>";
			}
			return;
		}
	})
	$(document).on('click', '.wd_chosen', function() {
		var itemID = parseInt($(this).attr('itemid'));
		$(this).remove();
		withdrawalFree++;
		document.getElementById('withdraw-chosen-quant').innerHTML = withdrawalFree>0?("Choose " + withdrawalFree + " items"):"No more space!";
		list = document.getElementById('withdraw-owned-items').getElementsByTagName('div');
		for (var i = 0; i < list.length; i++) {
			var iD = parseInt(list[i].getAttribute("itemid"));
			if(iD == itemID){
				var iQ = parseInt(list[i].getAttribute("itemq"));
				list[i].setAttribute("itemq", iQ+1);
				list[i].innerHTML = "<div class='wdItemQuant'>"+(iQ+1)+"</div>";
				return;
			}
	    }
		document.getElementById('withdraw-owned-items').innerHTML += "<div class='wd_unchosen item' style='position:relative;background-image:url("+ items[itemID].image.src +"); background-size: contain;  'itemid='"+ itemID +"' itemq='1'><div class='wdItemQuant'>1</div></div>";
	})

	socket.on('change_password_reply',function(reply,errorBool){
		document.getElementById('changepw-error').style.color = errorBool?'#00ff00':'#ff0000';
		document.getElementById('changepw-error').innerHTML = reply;
		document.getElementById('changepw-button').style.display = 'block';
	});


	socket.on('withdrawResult',function(err,bool){
		document.getElementById('withdraw-wait2').style.display = "none";
		if(bool){
			document.getElementById('withdraw-done').style.display = "block";
		}else{
			document.getElementById('withdraw-items-insert').style.display = "block";
			document.getElementById('withdraw-error2').innerHTML = err;
		}

	});

	socket.on('codereply',function(msg,allGood,contents){
		if(!allGood){
			document.getElementById('redeem-code-reply').innerHTML = msg;
		}else{
			openChest(contents);
			document.getElementById('redeem-code-reply').innerHTML = "Enjoy your loot!";
		}
	});

	socket.on('refer_reply',function(accounts){
		document.getElementById("information-refer-rate").innerHTML = "You will gain 1KK for every "+siteranks[round.rank].refKK+"F your referrals wager! You can refer people by getting them to enter your OJ username on sign-up! You can spread the following URL to help: <input type='text' readonly='readonly' class='copy-paste-field' style='width: 80%;' value='https://oryxjackpot.com/?r="+round.name+"'/>";
		if(accounts.length == 0){
			document.getElementById("referral_info").innerHTML = '<span class="bigger-font">Looks like you haven\'t referred anyone yet!</span>';
		}else{
			var block = "";
			for(var acc in accounts){
				block += '<tr>'
				block += '<td class="refer_info_img" style="background-image:url(\''+ escapeHtml(accounts[acc].img) +'\');"></td>'
				block += '<td style="color:'+accounts[acc].rankcolor+';">' + escapeHtml(accounts[acc].username)+'</td>'
				var amntOfDays = Math.floor((Date.now() - accounts[acc].lastAction)/(1000*60*60*24));
				block += '<td>' + (amntOfDays==0?'Recently active!':amntOfDays + ' day(s) ago.') + '</td>'
				block += '<td style="color:#ff7700;">' + accounts[acc].totalWagered+'F</td>'
				block +=  '</tr>'
			}
			document.getElementById("referral_info").innerHTML = '<table class="refer_info_table"><tr><td></td><td>Player</td><td>Last Seen</td><td>Total Wagered</td></tr>'+block+'</table>';
		}
	});

	$(".info-holder").on("click", "button.new-menu-button.infotab-collapsable", function(){
	    var infoTab = $(this).parent().children("span")[0];
		$(this).parent().toggleClass("open-info-collapse");
	    if(infoTab.style.display == 'block')infoTab.style.display = 'none';
	    else infoTab.style.display = 'block';
	});

	socket.on('information',function(faq,ch,rul,tos,emojis,clrs,siterankz){
		siteranks = siterankz;
		var siteRdescs = {
			maxspace:["Inventory Cap","The number of items you can hold before you are unable to deposit or cancel withdrawals."],
			depwait:["Deposit Cooldown","The amount of minutes you must wait before doing another deposit."],
			withwait:["Withdrawal Cooldown","The amount of minutes you must wait before doing another withdrawal."],
			commission:["Round Tax","The percentage of profit the site may take as tax from the winner."],
			refKK:["Referral Rewards","The amount of F a referral must wager for you to earn 1KK."],
			discount:["KK Item Shop Discount","The percentage of the price discounted from the KK Item Shop."],
			freeDepos:["Daily Free Deposits","The amount of daily deposits that will not apply a cooldown after success."],
			price:["Price","How much it costs to buy the rank in USD."]
		}
		document.getElementById("emojimenu").innerHTML = "";
		$('#test-rank-info').html("Purchasing ranks help Oryxjackpot continue to develop and provide our service. Oryxjackpot ranks provide perks that enhance your experience on Oryxjackpot!<table id='kk-ranks-table'></table>");

		var rankKeys = Object.keys(siterankz[0]);
		for(var i = 0; i < siterankz.length-1; i++){
			$('#emojimenu').append("<div class='emojiBar'>" + (siteranks[i].title==""?"Free":siteranks[i].title) + "</div>");
			for(var emoj in emojis[i]){
				var divemoji = document.createElement("div");
				divemoji.className += 'getemoji';
				divemoji.setAttribute("title", emoj);
				divemoji.style.backgroundImage = "url('"+emojis[i][emoj];+"')"
				document.getElementById("emojimenu").appendChild(divemoji);
			}
			$('#emojimenu').append("<div class='emojiBar' style='height:10px'></div>");
		}
		for(var y in rankKeys){
			if(rankKeys[y] != "name" && rankKeys[y] != "namecolor" ){
				var rankBlock = "<tr class='kk-table-row'>";

				if(rankKeys[y] in siteRdescs)rankBlock+= "<td class='kk-table-padding'>"+siteRdescs[rankKeys[y]][0]+"<br><span style='font-size:0.6em;font-family:\"Arial\"'>"+siteRdescs[rankKeys[y]][1]+"</span></td>";
				else if(rankKeys[y] == "linktobuy") rankBlock+= "<td>Buy this rank!</td>";
				else rankBlock+= "<td></td>";

				for(var i = 0; i < siterankz.length-1; i++){
					if(rankKeys[y] == "title"){
						if(i==0)rankBlock += "<td style='color:"+siterankz[i].namecolor+"'>Free</td>";
						else rankBlock += "<td style='color:"+siterankz[i].namecolor+"'>"+siterankz[i][rankKeys[y]]+"</td>";
					}
					else if(rankKeys[y] == "discount") rankBlock += "<td>"+ siterankz[i][rankKeys[y]]*100 +"%</td>";
					else if(rankKeys[y] == "depwait" || rankKeys[y] == "withwait") rankBlock += "<td>"+ (siterankz[i][rankKeys[y]]==0?"None!":siterankz[i][rankKeys[y]]+" mins") +"</td>";
					else if(rankKeys[y] == "commission") rankBlock += "<td>"+ (siterankz[i][rankKeys[y]]==0?"None!":siterankz[i][rankKeys[y]]+"%") + "</td>";
					else if(rankKeys[y] == "freeDepos" && i==3) rankBlock += "<td>N/A</td>";
					else if(rankKeys[y] == "price") rankBlock += "<td>$"+ siterankz[i][rankKeys[y]] +"</td>";
					else if(rankKeys[y] == "linktobuy" && i>0) rankBlock += "<td><a href='"+ siterankz[i][rankKeys[y]] +"' target='_blank' style='color:"+siterankz[i].namecolor+"'>Buy!</a></td>";
					else rankBlock += "<td>"+siterankz[i][rankKeys[y]]+"</td>";
				}
				document.getElementById("kk-ranks-table").innerHTML += rankBlock + "<tr>";
			}
		}
		$('#test-rank-info').html($('#test-rank-info').html() + "<br>All ranks last for 14 days as soon as the rank is redeemed.<br> We only accept PayPal for now, but you can contact KoolKash on Discord for other payment methods, such as Steam, Amazon, and Crypto!");

		$( 'div.getemoji' ).click(function(){
			$("#message").val( $("#message").val() + $(this).attr('title') );
			$('#message').focus();
			$(".menu").slideToggle(1);
		});
		document.getElementById("information-FAQ").innerHTML = "";
		document.getElementById("information-rules").innerHTML = "";
		document.getElementById("information-logs").innerHTML = "";
		document.getElementById("information-tos").innerHTML = "";
		for(var k=0;k<faq.length;k++)document.getElementById("information-FAQ").innerHTML += '<li class="infotab-box"><button class="new-menu-button infotab-collapsable">'+faq[k].title+'</button><span class="infotab-collapse-info">'+faq[k].desc.replace(/\\/g,'</br>')+'</span></li>';
		for(var k=0;k<rul.length;k++)document.getElementById("information-rules").innerHTML +=  '<li class="info-other-box"><span style="font-size:1.5em">'+ rul[k].rule+"</span></br><span>" + rul[k].minor + "</span></br><span style='color:#ff3333;font-size: 0.8em;'>"+ rul[k].punish.replace(/\\/g,'</br>')+'</span></li>';
		for(var k=0;k<ch.length;k++)document.getElementById("information-logs").innerHTML +=  '<li class="info-other-box"><span style="font-size:1.5em">'+ ch[k].version+"</span></br><ul class='changelogs-list'><li>" + ch[k].text.replace(/\\/g,'</li><li>') + "</li></ul></li>";
		for(var k=0;k<tos.length;k++)document.getElementById("information-tos").innerHTML +=  '<li class="info-other-box"><span style="font-size:1.5em">'+ tos[k].title+"</span></br>" + tos[k].desc + "</li>";
		document.getElementById("information-tos-signup").innerHTML = document.getElementById("information-tos").innerHTML + "<br><button type='button' class='new-menu-button' id='tos-signup-accept' onclick='window.acceptTOS();'>Accept</button>"

		block= "";
		for(var k=0;k<clrs.length;k++){
			block += "<div class='kk-colors-box' style='border-color:"+clrs[k].color+";color:"+clrs[k].color+";animation:"+clrs[k].animation+"'><div style='position:absolute;left:2px;top:4px;right:2px;bottom:41%;font-size:2.2vw;'>"+clrs[k].name +"; "+ clrs[k].desc+"</div><button type='button' class='kk-colors-buy' price='"+clrs[k].price+"' id='"+k+"'>Buy<br><span style='font-size:0.7em'>Price: "+clrs[k].price+"KK</span></button></div>"
		}
		document.getElementById("test-colors-info").innerHTML = block;

		$( '.kk-colors-buy' ).click(function(){
			$(this).prop("disabled",true);
			$(this).css("background-color","#333");
			socket.emit('buy_color',parseInt($(this).attr('id')))
		});

		if(localStorage.getItem("information")!==undefined){
			newChLogs = ch.length - localStorage.getItem("information");
			if(newChLogs > 0){
				for(var k=0;k<newChLogs;k++){
					var block= '<li class="chat-message-box" style>'+'<span class="chat-message-text">'+'<span style="font-size:34px">'
					block+= ch[k].version;
					block+= '</span>'+'</br><ul><li>';
					block+= ch[k].text.replace(/\\/g,'</li></br><li>');;
					block+= '</li></ul></span>'+'</li>';
					document.getElementById("information-prompt-logs").innerHTML += block;
				}
				document.getElementById("information-prompt").style.display = 'block';
			}
			localStorage.setItem("information",ch.length);
		}else{
			localStorage.setItem("information",ch.length);
		}

	});

	socket.on('playercount',function(count){
		document.getElementById("guest_viewer").innerHTML = count;
	});
	socket.on('specialround',function(s){
		round.special = s;
	});

	socket.on('buy_color_response',function(response,id){
		$( '.kk-colors-buy' ).each(function(){
			if(parseInt($(this).attr('id')) == id){
				var thisEle = $(this);
				thisEle.html("<span style='font-size:0.8em'>"+response+"</span>");
				setTimeout(function(){
					thisEle.prop("disabled",false);
					thisEle.css("background-color","#171");
					thisEle.html("Buy<br><span style='font-size:0.7em'>Price: "+ thisEle.attr('price') +"KK</span>")	
				},3000)
				
			}
		});
	})

	socket.on('timer',function(dateNow,timeLeft,timeLeft2){
		round.timer = timeLeft + (Date.now() - dateNow);
		round2.timer = timeLeft2 + (Date.now() - dateNow);

		var __timeLeftMs = round.timer - Date.now()

		if (__timeLeftMs > 0) {
			__bot.timeLeft = __timeLeftMs
			__bot.trackTimeLeft()
		}

	});

	socket.on('winnerA',function(hash,chance,victory,vol,positions){
		__bot.roundwinner(round.wagers[positions[120]].owner)
		round.victorysfx = new Audio(victory == "" ?"client/sfx/Enter_realm.oga":victory);
		round.victorysfx.volume = vol||0.3;
		round.winner = chance;
		round.hash = hash;
		round.imageroll = positions;
		round.endstart = Date.now();
		round.rollwin = true;
		if(gamemode==1)document.getElementById('switch-gamemodes-notif').style.display = "none";
		else $("#game-submit").addClass('ending');
	});
	socket.on('winnerB',function(hash,chance,victory,vol,seq){
		round2.victorysfx = new Audio(victory == "" ?"client/sfx/Enter_realm.oga":victory);
		round2.victorysfx.volume = vol||0.3;
		round2.winner = chance;
		round2.hash = hash;
		round2.attacks = seq;
		round2.rollwin = true;
		round2.cloneWagers = round2.wagers.slice();
		round2.win_init();
		if(gamemode==0)document.getElementById('switch-gamemodes-notif').style.display = "none";
		else $("#game-submit").addClass('ending');
	});

	var resetSettings = {p:9,v:100}

	socket.on('reset1',function(random){
		__bot.reset()
		round.wagers = [];
		round.p = 0;
		round.victorysfx.pause();
		if(gamemode==0){
			wagerscroll.offsety = 0;
			$("#game-submit").removeClass('ending');
		}
		round.totalval = 0;
		round.rollsfx = 0;
		round.rollwin = false;
		round.randomwin = random;

	});
	socket.on('reset2',function(random){
		round2.wagers = [];
		round2.victorysfx.pause();
		round2.totalval = 0;
		round2.rollwin = false;
		round2.win_finished(1);
		round2.updateWagers();
		if(gamemode==1)$("#game-submit").removeClass('ending');
	});

	$("#message").on('keyup', function (e) {
		if (e.keyCode == 13) {
			var message = $(this).val();
			if(message.length <= 200){
				socket.emit("chat",message);
				$(this).val("");
			} 
		}
	});

	socket.on('chat',function(newChat){
		if(newChat.length > 0){
			chatWindow.innerHTML = "";
			for(var i =0; i < newChat.length; i++){
				chatWindow.innerHTML += add_new_chat(newChat[i])	
			}
			$("#chat-window").animate({ scrollTop: $('#chat-window')[0].scrollHeight}, 1000);
		}
	});
	function add_new_chat(newChat){
		var block = '<li class="chat-message-box" style>' + '<img class="chat-message-image" src="'+ escapeHtml(newChat.image) +'">'
		block += '<button class="chat-message-username" style="color:'+newChat.namecolor+'" name="'+escapeHtml(newChat.name)+'">'
		block += emoji(newChat.icon)
		block += (newChat.rank==5?"(Admin)":"") + escapeHtml(" "+ newChat.name + ":" ) +'</button>' + "<br>"+ '<span class="chat-message-text" style="animation:'+(newChat.animation||"none")+';color:'+newChat.color+'">'+newChat.msg+'</span></li>'
		return block;
	}

	function replaceAll(str, term, replacement) {
		return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
	}
	function escapeRegExp(string){
		return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	socket.on('newchat',function(newChat,type){

		if(type == "player"){
			if(chatWindow.childNodes.length > 50)chatWindow.removeChild(chatWindow.childNodes[0]);
			newChat.msg = replaceAll(newChat.msg,"@"+round.name,"<mark>@"+round.name+"</mark>")
			chatWindow.innerHTML += add_new_chat(newChat)

			if(chatWindow.style.display == "block"){
				if( ($("#chat-window")[0].scrollHeight - $("#chat-window")[0].scrollTop - $("#chat-window")[0].clientHeight) < 200){
					$("#chat-window").animate({ scrollTop: $('#chat-window')[0].scrollHeight}, 400);
				}
				if(newChat.msg.indexOf("@"+round.name)>=0 && round.loggedin){
					var newchatsfx = new Audio("client/sfx/Sprite_god_hit.oga");newchatsfx.volume = window.handleWindowMute(0.7);newchatsfx.play();
				}else{
					var newchatsfx = new Audio("client/sfx/Sprites_hit.oga");newchatsfx.volume = window.handleWindowMute(0.5);newchatsfx.play();
				}
			}
		}else{
			sitechatWindow.innerHTML += add_new_chat(newChat)
			if(sitechatWindow.style.display == "block"){
				if( ($("#chat-window-2")[0].scrollHeight - $("#chat-window-2")[0].scrollTop - $("#chat-window-2")[0].clientHeight) < 280){
					$("#chat-window-2").animate({ scrollTop: $('#chat-window-2')[0].scrollHeight}, 700);
				}
			}
		}

	});

	function emoji(img){return img==""?"":'<img draggable="false" class="emoji" src="'+img+'">'};

	$("#chat-window").on("click", "button.chat-message-username", function(){
	    $("#message").val( $("#message").val() + "@" + $(this).attr('name') + " " );
		 $('#message').focus();
	});

	var siteranks = {}
	socket.on('items',function(arr){
		window.items = [];
		for(var i = 0; i < arr.length; i++){
			items[i]= new item(arr[i].img,arr[i].val,0,arr[i].name,arr[i].id);
			myInv.items[i] = {id:i,quant:0};
		}
		//experimental
		document.getElementById("sidebar_inv").innerHTML = "";
		for(var i in arr){
			document.getElementById("sidebar_inv").innerHTML += "<div class='item inv-i zero-stock' stock='0' itemid='"+arr[i].id+"' style='background-image:url(\""+arr[i].img+"\")'><div class='inv-i-quant'></div><div class='inv-i-val'>"+arr[i].val+"F</div></div>"
		}
		$("#sidebar_inv_worth").html("<span>INV</span><span style='float: right;color:#f70;'>0F</span>")
		$("#offer_inv_worth").html("<span>WAGER</span><span style='float: right;color:#f70;'>0F</span>")
	});
	$("#sidebar_inv").on("click", ".inv-i", function(){
		if($("#offer_inv").children().length < 8 && $("#offer_inv").css('display') == 'block'){
			var stockN = parseInt($(this).attr('stock'));
		    if( stockN> 0){
		    	var sfx = new Audio("client/sfx/Inventory_move_item.oga");sfx.volume = window.handleWindowMute(0.4);sfx.play();
		    	$(this).attr('stock', stockN-1);
		    	if(stockN == 1){
		    		$(this).addClass("zero-stock");
		    		if(myInv.filtered)$(this).css("display","none");
		    	}
		    	var eChildren = $(this).children();
		    	for(var z =0;z< eChildren.length;z++){
					if(eChildren[z].classList.contains("inv-i-quant")){
						eChildren[z].innerHTML = stockN-1==0?"":stockN-1;
						break;
					}
				}

				$("#game-submit").addClass('has-items');
				document.getElementById("offer_inv").innerHTML += "<div class='item offer-i' itemid='"+$(this).attr('itemid')+"' style='background-image:"+$(this).css('background-image')+"'><div class='inv-i-val'>"+items[window.id_to_pos(parseInt($(this).attr('itemid')))].val+"F</div></div>";
		    	$("#sidebar_inv_worth").attr('val',parseInt($("#sidebar_inv_worth").attr('val')) - items[window.id_to_pos(parseInt($(this).attr('itemid')))].val ); //add to value text
		    	$("#offer_inv_worth").attr('val',parseInt($("#offer_inv_worth").attr('val')) + items[window.id_to_pos(parseInt($(this).attr('itemid')))].val );
				$("#sidebar_inv_worth").html("<span>INV</span><span style='float: right;color:#f70;'>"+$("#sidebar_inv_worth").attr('val')+"F</span>")
				$("#offer_inv_worth").html("<span>WAGER</span><span style='float: right;color:#f70;'>"+$("#offer_inv_worth").attr('val')+"F</span>")
		    }
		}
	});
	$('#sidebar_inv').bind('mousewheel', function(e){
        if(e.originalEvent.wheelDelta /120 > 0) {
        	e.preventDefault();
        	keepTrackScroll-=1;
        }else{
        	e.preventDefault();
        	keepTrackScroll+=1;
        }
        if(window.innerHeight >= window.innerWidth){
			$('#sidebar_inv').scrollTop(keepTrackScroll*window.innerWidth*0.14/(1 + myInv.resize))
		}else{
			$('#sidebar_inv').scrollTop(keepTrackScroll*window.innerHeight*0.135/(1 + myInv.resize))
		}

        if(keepTrackScroll < 0){
			keepTrackScroll = 0;
        }else{
        	if(myInv.filtered){
        		var ownedcount = 0;
        		$('.inv-i').each(function(){
        			if($(this).css('display') == 'inline-block')ownedcount++;
        		})
        		if(keepTrackScroll > Math.ceil(ownedcount / (2 + 2*myInv.resize)) - myInv.resize-1){
		        	keepTrackScroll = Math.ceil(ownedcount / (2 + 2*myInv.resize)) - myInv.resize-1;
		        }
        	}else{
		        if(keepTrackScroll > Math.ceil($('#sidebar_inv').children().length / (2 + 2*myInv.resize)) - myInv.resize-1){
		        	keepTrackScroll = Math.ceil($('#sidebar_inv').children().length / (2 + 2*myInv.resize)) - myInv.resize-1;
		        }
		    }
        }

        return;
    });
	$("#offer_inv").on("click", ".offer-i", function(){
		var thisOfferItem = $(this);
		var sfx = new Audio("client/sfx/Inventory_move_item.oga");sfx.volume = window.handleWindowMute(0.4);sfx.play();
		$( '.inv-i' ).each(function(){
			if($(this).attr('itemid') == thisOfferItem.attr('itemid')){
				var istock = parseInt($(this).attr('stock'));
				if(istock == 0){
					$(this).removeClass("zero-stock");
					$(this).css('display','inline-block');
				}
				$(this).attr('stock',istock+1);
				var eChildren = $(this).children();
				for(var z =0;z< eChildren.length;z++){
					if(eChildren[z].classList.contains("inv-i-quant")){
						eChildren[z].innerHTML = istock+1;
						break;
					}
				}
				$("#sidebar_inv_worth").attr('val',parseInt($("#sidebar_inv_worth").attr('val')) + items[window.id_to_pos(parseInt($(this).attr('itemid')))].val ); //add to value text
		    	$("#offer_inv_worth").attr('val',parseInt($("#offer_inv_worth").attr('val')) - items[window.id_to_pos(parseInt($(this).attr('itemid')))].val );
				$("#sidebar_inv_worth").html("<span>INV</span><span style='float: right;color:#f70;'>"+$("#sidebar_inv_worth").attr('val')+"F</span>")
				$("#offer_inv_worth").html("<span>WAGER</span><span style='float: right;color:#f70;'>"+$("#offer_inv_worth").attr('val')+"F</span>")

				thisOfferItem.remove();

				if($("#offer_inv").children().length == 0){
					$("#game-submit").removeClass("has-items");
				}
			}
		});
	});

	socket.on('wagers',function(arr,arr2){
		for(var i = 0; i < arr.length; i++)round.wagers.push(new wager(arr[i].wage,arr[i].worth,arr[i].name,arr[i].image,round.wagers.length,arr[i].rankcolor,arr[i].color) );
		for(var i = 0; i < arr2.length; i++){
			round2.wagers.push(new wager(arr2[i].wage,arr2[i].worth,arr2[i].name,arr2[i].image,round2.wagers.length,arr2[i].rankcolor,arr2[i].color) );
			var data = "<div class='gm1_wager'><img src='"+arr2[i].image+"' class='gm1_wager_img'/><div class='gm1_wager_info' style='color:"+arr2[i].rankcolor+"'>"+escapeHtml(arr2[i].name)+"</div><div class='gm1_wager_info' type='wager_percent' name='"+escapeHtml(arr2[i].name)+"' style='top:30%'></div><div class='gm1_wager_info' style='top:60%;height:40%;'><div style='position:relative;width:100%;height:100%'>";
			for(var x in arr2[i].wage)data+="<img class='gm1_wager_item' src='"+items[window.id_to_pos(arr2[i].wage[x])].image.src+"' />"
			document.getElementById("gm1_wagers_table").innerHTML += data + "</div></div></div>";
		}
		round2.updateWagers();
		round2.updateWagersInfo();
	});
	socket.on('newwager',function(newWag){
		__bot.incomingWage({
			worth: newWag.worth,
			items: newWag.wage
		}, newWag.name)
		round.wagers[newWag.id] = new wager(newWag.wage,newWag.worth,newWag.name,newWag.image,newWag.id,newWag.rankcolor,newWag.color)
		if(gamemode==0){var sfx = new Audio("client/sfx/Loot_appears.oga");sfx.volume = window.handleWindowMute(0.4);sfx.play();}
		if(gamemode!=0 && round.wagers.length == 1)document.getElementById('switch-gamemodes-notif').style.display = "block";
	});
	socket.on('newwager2',function(newWag){
		round2.wagers[newWag.id] = new wager(newWag.wage,newWag.worth,newWag.name,newWag.image,newWag.id,newWag.rankcolor)
		if(gamemode==1){var sfx = new Audio("client/sfx/Loot_appears.oga");sfx.volume = window.handleWindowMute(0.4);sfx.play();}
		if(gamemode!=1 && round2.wagers.length == 1)document.getElementById('switch-gamemodes-notif').style.display = "block";
		var data = "<div class='gm1_wager'><img src='"+newWag.image+"' class='gm1_wager_img'/><div class='gm1_wager_info' style='color:"+newWag.rankcolor+"'>"+escapeHtml(newWag.name)+"</div><div class='gm1_wager_info' type='wager_percent' name='"+escapeHtml(newWag.name)+"' style='top:30%'></div><div class='gm1_wager_info' style='top:60%;height:40%;'><div style='position:relative;width:100%;height:100%'>";
		for(var x in newWag.wage)data+="<img class='gm1_wager_item' src='"+items[window.id_to_pos(newWag.wage[x])].image.src+"' />"
		document.getElementById("gm1_wagers_table").innerHTML += data + "</div></div></div>";
		round2.updateWagers();
		round2.updateWagersInfo();
	});
	socket.on('inventory',function(arr){
		process_inv(arr);
	});

	function process_inv(arr){
		myInv.items = [];
		var cloneoffer = [];
		for(var i = 0; i < items.length; i++){
			myInv.items[i] = {id:i,quant:0};
		}
		for(var i in arr){
			if(arr[i].quant>0){
				myInv.add(window.id_to_pos(arr[i].id),arr[i].quant);
			}
		}
		for(var i in cloneoffer){
			myInv.add(cloneoffer[i].id,-1);
		}
		socket.emit('ask_for_tasks');

		//experimental
		$( '.inv-i' ).each(function(){
			$(this).addClass('zero-stock');
			$(this).attr('stock',0);
			if(myInv.filtered)$(this).css('display','none');
			else $(this).css('display','inline-block');
			var eChildren = $(this).children();
			for(var z =0;z< eChildren.length;z++){
				if(eChildren[z].classList.contains("inv-i-quant")){
					eChildren[z].innerHTML = "";
					break;
				}
			}
		});

		var temp = [];
		$( '.offer-i' ).each(function(){
			temp.push($(this).attr('itemid'));
		});
		var totalF = 0;

		$( '.inv-i' ).each(function(){
			for(var h in arr){
				if(parseInt($(this).attr('itemid')) == arr[h].id){
					var quanti = arr[h].quant;
					for(var m in temp){
						if(temp[m] == $(this).attr('itemid'))quanti-=1;
					}
					$(this).attr('stock',quanti)
					if(quanti>0){
						$(this).removeClass("zero-stock");
						$(this).css('display','inline-block');
					}
					totalF += quanti*items[window.id_to_pos(arr[h].id)].val;
					var eChildren = $(this).children();
					for(var z =0;z< eChildren.length;z++){
						if(eChildren[z].classList.contains("inv-i-quant")){
							eChildren[z].innerHTML = quanti==0?"":quanti;
							break;
						}
					}
					break;
				}
			}
		});
		$("#sidebar_inv_worth").attr('val',totalF)
		$("#sidebar_inv_worth").html("<span>INV</span><span style='float: right;color:#f70;'>"+totalF+"F</span>")
		//$("#offer_inv_worth").html("<span>WAGER</span><span style='float: right;color:#f70;'>0F</span>")

	}

	window.id_to_pos = function(id){
		for(var k in items)if(items[k].id == id)return k;
		return -1;
	}

	socket.on('signup',function(reply){
		document.getElementById('signup-error').style.color = reply.indexOf("Success!")!=-1?"#99ff99":"#ff9999";
		document.getElementById('signup-error').innerHTML = reply;
	});

	socket.on('signin',function(reply,rotmgign){
		if(rotmgign == "unverified")window.onlyOpenOneWindow('verify-code');
		document.getElementById('login-error').innerHTML = reply;
		document.getElementById('login-submit').style.display = 'block';
	});

	function FtoKK(F,Q){
		return ((0.2333*(F-4.5)) +4.95 + (10 - 0.05*Math.abs(F - 200)))*(1-siteranks[round.rank].discount)*(0.15/(1 + Q/6) + 0.85)
	}

	function boxedText(OBJ){
		var options = OBJ;
		options.msg = String(OBJ.msg)||" ";
		options.texth = Math.min(Math.floor(OBJ.texth)||20,Math.floor(OBJ.h));
		options.font = OBJ.font||"";
		options.color = OBJ.color||'#ffffff';
		if(options.alignH===undefined)options.alignH=0.5;
		if(options.alignW===undefined)options.alignW=0.5;
		var lines = [];
		var word = "";
		for(var k = options.texth;k>1;k--){
			options.texth = k;
			lines = [];
			lines[0]="";
			word = "";
			ctx.font = options.font+' '+options.texth+"px Arial";
			for(var i = 0; i < options.msg.length; i++){
				if(options.msg[i]!==" "&&options.msg[i]!=="\\"&& i!=options.msg.length-1){//a letter AND not the last letter
					word += options.msg[i];
				}else{ //space or last letter
					if(options.msg[i]!="\\"){
						if(	ctx.measureText(lines[lines.length-1] + word + (options.msg[i]==" "?"":options.msg[i]) ).width > options.w  && ((options.texth+4)*(lines.length+1) -4) <= options.h){
							lines.push(word + options.msg[i]);
						}else{
							lines[lines.length-1] += word + options.msg[i];
						}
					}else{
						lines[lines.length-1] += word
						lines.push("");
					}
					word = "";
				}
			}
			var blockh = ((options.texth+4)*(lines.length) -4);
			var blockw = ctx.measureText(lines[0]).width;
			for(var i = 1; i < lines.length; i++)blockw = Math.max(ctx.measureText(lines[i]).width,blockw);
			////// Calc the w and h of the text block, make sure it stays inside.
			if( blockh <= options.h && blockw <= options.w)break;
		}
			ctx.fillStyle = options.color;
			for(var i = 0; i < lines.length; i++){
				ctx.fillText(lines[i],options.x + (options.w-blockw)*options.alignW, options.y + blockh + (options.h - blockh*1.055)*options.alignH - ((options.texth+4)*(lines.length-1 -i))-2  );
			}

				/*
				ctx.beginPath();
				ctx.moveTo(options.x,options.y);
				ctx.lineTo(options.x,options.y+options.h);
				ctx.lineTo(options.x + options.w,options.y +options.h);
				ctx.lineTo(options.x + options.w,options.y );
				ctx.lineTo(options.x,options.y);
				ctx.strokeStyle="#ff0000"; ctx.lineWidth=0.5;
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(options.x,options.y + (options.h-blockh)/2);
				ctx.lineTo(options.x,options.y + (options.h-blockh)/2 + blockh);
				ctx.strokeStyle="#00ff00"; ctx.lineWidth=1;
				ctx.stroke();*/
				
			}

function item(img,val,quant,name,id){
	this.name = name;
	this.image = new Image();
	this.image.src = img;
	this.quant = quant;
	this.val = val;
	this.id = id;
	this.x; this.y; this.w; this.h;
	this.draw = function(x,y,w,h,quant){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		if(myInv.hidden){
			if(quant == 0)ctx.globalAlpha = 0.3;
			ctx.drawImage(this.image,this.x,this.y,this.w,this.h);
			ctx.globalAlpha = 1;
		}else{
			if(quant == 0)ctx.globalAlpha = 0.3;
			ctx.drawImage(this.image,this.x,this.y,this.w,this.h);
			boxedText({msg:this.val+"F",x:this.x,w:this.w,y:this.y + this.h*0.6,h:this.h*0.4,font:'bold',texth:24,color:'#ff7700',alignW:1,alignH:1})
			if(quant == 0)ctx.globalAlpha = 1;
			if(quant > 0)boxedText({msg:quant,x:this.x+2,w:this.w,y:this.y,h:this.h*0.4,font:'bold',texth:24,alignW:0,alignH:0})
		}
	}
}

var myInv = new function(){
	this.items = [];
	this.offseth = 0;
	this.pot = 0;
	this.referred = "";
	this.hidden = false;
	this.filtered = false;
	this.resize = 1;
	this.KK = 0;

	this.add = function(id,quant){
		for(var i in this.items){
			if(this.items[i].id == id){
				this.items[i].quant += quant;
				this.pot += quant*items[i].val;
				return;
			}
		}
		this.items.push({id:id,quant:quant});
	}
	this.draw = function(){

		this.pot = 0;
		for(var i in this.items){
			this.pot += this.items[this.items[i].id].quant*items[this.items[i].id].val;
		}
	}
}

var round = window.round = new function(){
	this.timer = 20;
	this.winner = "";
	this.special = "";
	this.rollwin = false;
	this.name ="";
	this.loggedin = false;
	this.isAdmin = false;
	this.totalval = 0;
	this.rows = 5;
	this.wagers = [];
	this.specialRect = new rect(0.01,0,0.76,45/h,{
		boxcolor:{default:"#882200"}
	});

	this.draw = function(){
		this.totalval = 0;
		for(var i in this.wagers)this.totalval+=this.wagers[i].value;
		boxedText({msg:this.totalval + "F",
			x:w*0.2,
			y:h*0.1,
			w:w*.6,
			h:h*0.175,
			texth:50 + this.totalval/100,
			font:'800',
			color:'#ff8800',
			alignW:0.5,
			alignH:1});

	}
	this.specialDraw = function(){
		this.specialRect.w = w*0.98
		this.specialRect.h = 45;
		this.specialRect.draw();
		ctx.textAlign = 'left';
		boxedText({msg:"SPECIAL ROUND!! - "+this.special[0],
			x:this.specialRect.x,
			y:this.specialRect.y,
			w:this.specialRect.w,
			h:this.specialRect.h/2,
			texth:18,
			font:'bold',
			alignW:0.5,
			alignH:0.5});
		boxedText({msg:this.special[1],
			x:this.specialRect.x,
			y:this.specialRect.y+this.specialRect.h/2,
			w:this.specialRect.w,
			h:this.specialRect.h/2,
			texth:18,
			alignW:0.5,
			alignH:0});
	}

	this.imageroll = [];
	this.victorysfx;
	this.p = -Math.random()*(w/resetSettings.p)
	this.hash = "";
	var played = false;
	this.rollsfx = 0;
	this.endstart = Date.now();
	this.randomwin = Math.random();
	this.win = function(){
		var size = w/3*(720/1280);
		var xscreen = (w)*0.5

		var xval = Math.min((Date.now() - this.endstart)/1000,12);
		this.p = ((-81*xval*xval - 12)/(xval*xval + 6) - 2 + xval/2)*300 + (this.randomwin*143 - 33);

		for(var b = Math.max(this.rollsfx - 4,0); b < this.rollsfx + 4; b++){
			ctx.drawImage( this.wagers[this.imageroll[b]].image,(this.p* xscreen/500) + size*b,h*0.285,size,size);
			//ctx.fillText(b,(this.p* xscreen/500) + size*(b+.5) ,h*0.285 -30);
		}

		if((this.p* xscreen/500) + size*this.rollsfx < xscreen){
			try {
				if(gamemode == 0){var throwaway =  new Audio("client/sfx/Button_click.oga");throwaway.volume = window.handleWindowMute(0.6);throwaway.play();}
			} catch (e) {}
			
			
			this.rollsfx = Math.ceil( (xscreen - (this.p* xscreen/500))/(size) );
		}
		ctx.beginPath(); ctx.strokeStyle = '#ffff00'; ctx.lineWidth = Math.ceil(w/18)/10;
		ctx.moveTo(xscreen,h*0.285);
		ctx.lineTo(xscreen,h*0.285 + size);
		ctx.stroke();

		if(xval == 12){
			if(!played){
				if(!sfxMute && gamemode == 0){this.victorysfx.play();}
				played = true;
			}
			var winpercent = Math.floor(round.winner*100000)/1000;
			ctx.textAlign = 'left';
			boxedText({msg:round.wagers[this.imageroll[120]].owner +" wins!",
				x:0,
				w:w,
				y:h*0.285 - h*0.2,
				h: h*0.06,
				texth: h*0.06,
				alignH:0.5,
				alignW:0.5,
				font:'bold',
			})
			if(cursorCol({x:w*0.2,y:h*0.97,w:w*0.6,h:h*0.03}))boxedText({msg:"Hash: " + this.hash + " --> " + Math.floor(round.winner*100000)/1000 + "%",x:w*0.2,y:h*0.97,w:w*0.6,h:h*0.03,texth:14,alignW:0.5,alignH:0})
			ctx.beginPath(); ctx.strokeStyle = '#ffdd00'; ctx.lineWidth = Math.ceil(w/450);
			ctx.moveTo(wageroptions.x + wageroptions.w*(winpercent/100),wageroptions.y - wageroptions.h*0.2);
			ctx.lineTo(wageroptions.x + wageroptions.w*(winpercent/100),wageroptions.y + wageroptions.h*1.2);
			ctx.stroke();	
		}else{
			played = false;
			if(cursorCol({x:w*0.2,y:h*0.97,w:w*0.6,h:h*0.03})){
				ctx.clearRect(w*0.1,h*0.978,w*0.8,h*0.03);
				boxedText({msg:"Hash: " + this.hash,x:w*0.2,y:h*0.97,w:w*0.6,h:h*0.03,texth:14,alignW:0.5,alignH:0})
			}
		}
	}
}

var round2 = new function(){
	this.timer = 30;
	this.winner = "";
	this.rollwin = false;
	this.totalval = 0;
	this.wagers = [];
	this.attacks = [];
	this.dmgdealt = 0;
	this.cloneWagers = [];
	this.attackSpread = [{dmg:1,sfx:"/client/sfx/magicShoot.mp3",proj:"/client/resources/proj/staffShoot.gif"},{dmg:5,sfx:"/client/sfx/ArrowShoot.oga",proj:"/client/resources/proj/bowShoot.png"},{dmg:25,sfx:"/client/sfx/BladeSwing.oga",proj:"/client/resources/proj/swordShoot.png"}];

	this.updateWagers = function(){
		this.totalval = 0;
		var tempObj = {};
		for(var i in this.wagers){
			this.totalval+=this.wagers[i].value;
			for(var x in this.wagers[i].items){
				if(this.wagers[i].items[x] in tempObj)tempObj[this.wagers[i].items[x]]++;
				else tempObj[this.wagers[i].items[x]] = 1;
			}
		}	
		document.getElementById("gm1_items_table").innerHTML = "";
		document.getElementById("gm1_HP").innerHTML = this.totalval==0?"0 HP":("1 - " + this.totalval + " HP")
		for(var x in tempObj){
			document.getElementById("gm1_items_table").innerHTML += "<div class='kkpitem' style='position:relative;background-image:url("+ items[window.id_to_pos(x)].image.src +");background-size: contain;width:7.5vh;height:7.5vh;'><div class='wdItemQuant' style='text-align:left;height:3vh;font-size:3vh;'>"+tempObj[x]+"</div></div>"		
		}
	}
	this.updateWagersInfo = function(){
		var wager_infos = document.getElementsByClassName("gm1_wager_info");
		var index = 0;
		for(var h = 0; h < wager_infos.length; h++){
			for(var j = 0; j < this.wagers.length;j++){
				if(this.wagers[j].owner == wager_infos[h].getAttribute("name") && j===index){
					wager_infos[h].innerHTML = this.wagers[j].value + " DMG - " + (this.wagers[j].value*100/this.totalval).toFixed(2) + "&#37;";
					index++;
					break;
				}
			}
		}
	}
	this.win_init = function(){
		$("#gm1_wagers_table").animate({ top: "101vh",bottom:"-30vh"}, 900);
		$("#gm1_chest").animate({ top: "38vh",right:(document.getElementById("gamemode1").offsetWidth/2 - h*0.24) + "px"}, 900);
		$("#gm1_items_table").animate({ top: "65vh",bottom:"3vh"}, 900);
		$("#gm1_timer").css("display","none");
		$("#gm1_dmg_dealt").html(this.dmgdealt + " DMG DEALT");
		$("#gm1_attacker").animate({ top: "38vh"}, 500);
		$("#gm1_attacker").css("background-image","url(\""+this.cloneWagers[0].image.src+"\")");
		$("#gm1_attacker-info").html(this.cloneWagers[0].owner + "<br><span style='font-size:0.75em'>"+this.attacks[0].chance.toFixed(2)+"%</span>");
		setTimeout(function(){
			$("#gm1_chest").css("right","calc(50% - 24vh)");
			round2.win()
		}, 1300);
	}
	
	this.win = function(){
		if(this.attacks.length > 0 && this.rollwin){
			if(this.attacks[0].sequence.length == 0){
				this.attacks.shift();
				if(this.attacks.length > 0){
					this.cloneWagers.shift();
					$("#gm1_attacker").animate({ top: "101vh"}, 400);
					setTimeout(function(){
						$("#gm1_attacker").css("background-image","url(\""+round2.cloneWagers[0].image.src+"\")");
						$("#gm1_attacker").css("top", "-20vh");
						$("#gm1_attacker-info").html(round2.cloneWagers[0].owner + "<br><span style='font-size:0.75em'>"+round2.attacks[0].chance.toFixed(2)+"%</span>");
						setTimeout(function(){
							$("#gm1_attacker").animate({ top: "38vh"}, 400);
							setTimeout(function(){round2.win()}, 500);
						}, 50);
					}, 450);
				}else{
					$("#gm1_chest").css("top","-30vh");
					$("#gm1_chest").css("right","5.1vh");
					setTimeout(function(){
						$("#gm1_chest_broke").css("display","block");
						if(gamemode==1){var sfx = new Audio("client/sfx/Loot_appears.oga");sfx.volume = window.handleWindowMute(0.4);sfx.play();}
						setTimeout(function(){
							$("#gm1_winner").html(round2.cloneWagers[0].owner + " wins!<br><span style='font-size:0.5em;line-height: 0vh;'>The chest had " + (Math.floor(round2.totalval * round2.winner)+1) + " HP!</span><br><span style='font-weight: 700;font-size:0.2em;-webkit-text-stroke-width: 0px;'>Hash: "+round2.hash+" ---\> "+ (round2.winner*100).toFixed(4) +"&#37; ---\> " + (Math.floor(round2.totalval * round2.winner)+1) + " / "+ round2.totalval +"</span>")
							if(!sfxMute && gamemode==1){round2.victorysfx.play();}
						},1000);
					},150);
				}
			}else{
				nextAtt = this.attacks[0].sequence.shift();
				if(gamemode==1){var tempsfx = new Audio(this.attackSpread[nextAtt].sfx);tempsfx.volume = window.handleWindowMute(0.3);tempsfx.play();}
				$("#gm1_dmg").css("top","-1vh");
				$("#gm1_dmg").animate({ top: "-7vh"}, 600);
				$("#gm1_dmg").html("-" + this.attackSpread[nextAtt].dmg)
				$("#gm1_attacker-proj").css("background-image","url(\"" + this.attackSpread[nextAtt].proj + "\")");
				this.dmgdealt += this.attackSpread[nextAtt].dmg;
				$("#gm1_attacker-proj").css("left","17vh");
				$("#gm1_attacker-proj").css("display","block");
				$("#gm1_attacker-proj").animate({ left: "30vh"}, 250);
				setTimeout(function(){$("#gm1_attacker-proj").css("display","none");},250);
				setTimeout(function(){
					$("#gm1_dmg").css("display","block");
					$("#gm1_dmg_dealt").html(round2.dmgdealt + " DMG DEALT");
				},175);
				setTimeout(function(){$("#gm1_dmg").css("display","none");}, 600);
				setTimeout(function(){round2.win()}, this.attacks[0].sequence.length == 0 && this.attacks.length == 0?50:650);
			}
		}
	}

	this.win_finished = function(x){
		$("#gm1_wagers_table").stop(true, true);
		$("#gm1_attacker-proj").stop(true, true);
		$("#gm1_chest").stop(true, true);
		$("#gm1_items_table").stop(true, true);
		$("#gm1_attacker").stop(true, true);
		$("#gm1_wagers_table").animate({ top: "38.5vh",bottom:"7vh"}, 1000);
		$("#gm1_chest").animate({ top: "18vh",right:"5.1vh"}, 1000);
		$("#gm1_items_table").animate({ top: "38.5vh",bottom:"7vh"}, 1000);
		$("#gm1_attacker").css("top", "-30vh");
		$("#gm1_timer").css("display","block");
		$("#gm1_chest_broke").css("display","none");
		$("#gm1_winner").html("");
		$("#gm1_dmg_dealt").html("");
		this.dmgdealt = 0;
		if(x==1){
			$("#gm1_wagers_table").html("");
			$("#gm1_items_table").html("");
			$("#gm1_timer").html("");
			$("#gm1_HP").html("0 HP");
			setTimeout(function(){
				$("#gm1_chest").css("top","18vh");
				$("#gm1_chest").css("right","5.1vh");
				$("#gm1_items_table").css("top","38.5vh");
				$("#gm1_items_table").css("bottom","7vh");
				$("#gm1_wagers_table").css("top","38.5vh");
				$("#gm1_wagers_table").css("bottom","7vh");
				round2.victorysfx.pause();
				round2.win_finished(0)
			},1500);
		}
	}

	this.victorysfx;
	this.hash = "";
}

var wagerscroll = new rect((w*0.1)/w,wageroptions.y/h,(w*0.8)/w,h);
wagerscroll.offsety = 0;
function wager(itemsarr,worth,owner,image,id,rankcolor,color){
		//items is an array, id being wager #
		this.items = itemsarr;
		this.image = new Image();
		this.image.src = image;
		this.backup = new Image();
		this.backup.src = 'client/resources/favicon.png';
		this.value = worth;
		this.offset = 0; this.animateend = 200;
		this.id = id;
		this.owner = owner;
		this.rankcolor = rankcolor;
		this.idcolor = color;
		this.x,this.y,this.w,this.h;
		this.draw = function(){

			this.offset++;
			if(this.offset > this.animateend)this.offset = this.animateend;
			ctx.globalAlpha = this.offset/200;
			this.w = w/(round.rows+1);
			this.h = this.w;
			this.x = (w - this.w*round.rows)/2 + this.w*(this.id%round.rows)
			this.y = Math.max(h*0.58 + (h/3)*Math.pow(1.04,-(this.offset-2)) + this.h*(Math.floor(this.id/round.rows)) + wagerscroll.offsety,wageroptions.y - this.h*1.5);
			ctx.drawImage(this.image!==undefined?this.image:this.backup,this.x,this.y,this.h,this.h)

			ctx.beginPath();
			ctx.moveTo(this.x+1,this.y +1);
			ctx.lineTo(this.x +1,this.y+this.h -1);
			ctx.lineTo(this.x + this.w -1,this.y +this.h -1);
			ctx.lineTo(this.x + this.w -1,this.y  +1);
			ctx.lineTo(this.x +1,this.y +1);
			ctx.strokeStyle=this.idcolor;
			ctx.lineWidth=2;
			ctx.stroke();
			ctx.globalAlpha = 1;

		}
	}

	function rect(xx,yy,ww,hh,options,func){
		this.x = w*xx,this.y = h*yy,this.w = w*ww,this.h = h*hh;
		this.options = options||{};
		this.click = func||function(){};
		this.clicked = false;
		this.drawing = false;
		if(this.options.image!==undefined){
			this.options.images = {};
			this.options.images.default = new Image();
			this.options.images.default.src = this.options.image.default;
			this.options.images.hover = new Image();
			this.options.images.hover.src = this.options.image.hover;
			this.options.images.clicked = new Image();
			this.options.images.clicked.src = this.options.image.clicked;
			this.options.images.clickedhover = new Image();
			this.options.images.clickedhover.src = this.options.image.clickedhover;
		}

		this.draw = function(){
			if(this.options.boxcolor!==undefined){
				ctx.fillStyle =  (this.options.boxcolor.onhover!==undefined&&cursorCol(this) ) ? this.options.boxcolor.onhover : (this.options.boxcolor.clicked!==undefined&&this.clicked)? this.options.boxcolor.clicked :this.options.boxcolor.default;
				ctx.globalAlpha = (this.options.alpha!==undefined)?this.options.alpha:1;
				ctx.fillRect(this.x,this.y,this.w,this.h);
			}
			if(this.options.image!==undefined){
				if(this.clicked){
					if(cursorCol(this))ctx.drawImage(this.options.images.clickedhover||this.options.images.hover||this.options.images.default,this.x,this.y,this.w,this.h);
					else ctx.drawImage(this.options.images.clicked||this.options.images.default,this.x,this.y,this.w,this.h);
				}else{
					if(cursorCol(this)) ctx.drawImage(this.options.images.hover||this.options.images.default,this.x,this.y,this.w,this.h);
					else ctx.drawImage(this.options.images.default,this.x,this.y,this.w,this.h);
				}
			}
			ctx.globalAlpha = 1;

			if(this.options!==undefined){
				if(this.options.text!==undefined){
					var text = (this.options.text.onhover!==undefined&&cursorCol(this) )? this.options.text.onhover :(this.options.text.clicked!==undefined&&this.clicked)? this.options.text.clicked :  this.options.text.default;
					if(this.options.text.color!==undefined){
						var color =  this.options.text.color.onhover!==undefined&&cursorCol(this) ? this.options.text.color.onhover : this.options.text.color.clicked!==undefined&&this.clicked? this.options.text.color.clicked :  this.options.text.color.default;
					}else{
						var color = "#ffffff";
					}
					boxedText({msg:text,x:this.x,y:this.y,w:this.w,h:this.h,texth:this.options.text.size||20,color:color});

				}
				if(this.options.additionalText!==undefined){
					for(var i in this.options.additionalText){
						boxedText(this.options.additionalText[i])
					}
				}

			}
			

		}
		this.update = function(){
			this.x = w*xx; this.y = h*yy; this.w = w*ww; this.h = h*hh;
		}
		EDITBOXES.push(this);
	}


	function cursorCol(Element1){
		return (Element1.x + Element1.w > mx && Element1.x < mx && Element1.y < my && Element1.y + Element1.h > my)
	}

			function init()
			{
				if(typeof game_loop != "undefined") clearInterval(game_loop);
				game_loop = setInterval(paint, 12);
			} init();


	///////////////////////////////paint///////////////////////////
	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////

	function paint(){

		ctx.clearRect(0, 0, w, h);

			round.rows = Math.floor(5.5 * w/h);
			wageroptions = {worth:0,x:w*0.02,y:Math.max(h*0.285 + (w/3*(720/1280))*1.04,h/2),w:w*0.96,h:(w/3*(720/1280))*0.07}
			for(var i = 0; i < round.wagers.length; i++){
				var xx = wageroptions.x + wageroptions.w*(wageroptions.worth/round.totalval);
				var yy = wageroptions.y;
				var ww = wageroptions.w*(round.wagers[i].value/round.totalval);
				var hh = wageroptions.h;

				ctx.fillStyle = round.wagers[i].idcolor;
				ctx.fillRect(xx,yy,ww,hh)
				wageroptions.worth += round.wagers[i].value;

				ctx.beginPath();
				ctx.moveTo(xx,yy );
				ctx.lineTo(xx ,yy+hh );
				ctx.lineTo(xx + ww ,yy +hh );
				ctx.lineTo(xx + ww ,yy  );
				ctx.lineTo(xx ,yy );
				ctx.strokeStyle="#ffffff";
				ctx.lineWidth=1;
				ctx.stroke();

			}
			for(var i = 0; i < round.wagers.length; i++)round.wagers[i].draw();

			ctx.fillStyle = 'white';ctx.clearRect(0,0,w,wageroptions.y);
			if(!round.rollwin){
				if(round.wagers.length > 0){
					boxedText({msg:Math.max(((round.timer - Date.now())/1000),0).toFixed(1),
					//boxedText({msg:(round.timer).toFixed(1),
						x:0,
						y:h*0.30,
						w:w,
						h:h*0.08,
						font:'800',
						texth:h*0.08,
						alignW:0.5,
						alignH:0.5
					})
				}
			}else{
				round.win();
			}

			for(var i = 0; i < round.wagers.length; i++){
				if(cursorCol(round.wagers[i])){
					var size = w*0.04;
					ctx.font = size+'px Arial';
					ctx.fillStyle = "#000000"; ctx.globalAlpha = 0.9;
					var boxw = Math.max(round.wagers[i].w,size*(Math.min(8,round.wagers[i].items.length)+1),ctx.measureText(round.wagers[i].owner||"player").width);
					var boxx = [0,w-boxw,round.wagers[i].x + (round.wagers[i].w - boxw)/2].sort(function(a, b){return a-b})[1]
					ctx.fillRect(boxx,round.wagers[i].y + round.wagers[i].h - size*(Math.floor((round.wagers[i].items.length-1)/8) +4.5),boxw,size*(Math.floor( (round.wagers[i].items.length-1)/8)+4.5) );
					ctx.globalAlpha = 1; ctx.textAlign = 'left';
					for(var j in round.wagers[i].items){
						var xx = j%8;
						var yy = Math.floor(j/8);
						ctx.drawImage(items[window.id_to_pos(round.wagers[i].items[j])].image||round.wagers[i].backup,boxx + boxw/2 + size*(xx-Math.min(4,round.wagers[i].items.length/2)),round.wagers[i].y + round.wagers[i].h - size*( Math.floor((round.wagers[i].items.length-1)/8) - yy+1.5),size,size)
					}
					boxedText({msg:round.wagers[i].value+"F",
						x:boxx,
						y:round.wagers[i].y + round.wagers[i].h - size*(Math.floor((round.wagers[i].items.length-1)/8) - yy+3.5),
						w:boxw,
						h:size,
						texth:size,
						font:'bold',
						color:'#ff8800',
						alignW:0.5,
						alignH:0
					})
					boxedText({msg:round.wagers[i].owner||"player",
						x:boxx,
						y:round.wagers[i].y + round.wagers[i].h - size*(Math.floor((round.wagers[i].items.length-1)/8) - yy+4.5),
						w:boxw,
						h:size,
						texth:size,
						color:round.wagers[i].rankcolor,
						font:'bold',
						alignW:0.5,
						alignH:0
					})
					boxedText({msg:(Math.floor((round.wagers[i].value/round.totalval)*10000)/100).toFixed(2) + "%",
						x:boxx,
						y:round.wagers[i].y + round.wagers[i].h - size*(Math.floor((round.wagers[i].items.length-1)/8) - yy+2.5),
						w:boxw,
						h:size,
						font:'bold',
						texth:size,
						alignW:0.5,
						alignH:0.5
					});
					ctx.beginPath();
					ctx.moveTo(boxx,round.wagers[i].y + round.wagers[i].h - size*(Math.floor((round.wagers[i].items.length-1)/8) +4.5) );
					ctx.lineTo(boxx ,round.wagers[i].y + round.wagers[i].h - size*(Math.floor((round.wagers[i].items.length-1)/8) +4.5)+size*(Math.floor( (round.wagers[i].items.length-1)/8)+4.5) );
					ctx.lineTo(boxx + boxw ,round.wagers[i].y + round.wagers[i].h - size*(Math.floor((round.wagers[i].items.length-1)/8) +4.5) +size*(Math.floor( (round.wagers[i].items.length-1)/8)+4.5) );
					ctx.lineTo(boxx + boxw ,round.wagers[i].y + round.wagers[i].h - size*(Math.floor((round.wagers[i].items.length-1)/8) +4.5)  );
					ctx.lineTo(boxx ,round.wagers[i].y + round.wagers[i].h - size*(Math.floor((round.wagers[i].items.length-1)/8) +4.5) );
					ctx.strokeStyle="#ffffff";
					ctx.lineWidth=2;
					ctx.stroke();
					break;
				}
			}


		ctx.textAlign = 'left';
		if(round.special!="")round.specialDraw();
		round.draw();

			if(!round2.rollwin){
				if(round2.wagers.length > 0){
					temptimer = Math.max(((round2.timer - Date.now())/1000),0)
					document.getElementById("gm1_timer").innerHTML = temptimer.toFixed(1);
					temp = temptimer<=9 ? Math.ceil(255*Math.abs(Math.cos((temptimer / ( temptimer<=5?1 : 2 )*2*Math.PI ) ))) : 255;
					document.getElementById("gm1_timer").style.color = "rgb(255," + temp +","+ temp + ")";
				}
			}
			


	//////////////////

	ctx.globalAlpha = 1;
	for(var i in EDITBOXES)if(EDITBOXES[i].drawing)EDITBOXES[i].draw();

	if(document.getElementById("deposit-timer").style.display == 'block'){
		seconds = Math.floor((document.getElementById("deposit-timer").time - Date.now())/1000);
		if(seconds > 0){
			document.getElementById("deposit-timer").innerHTML = Math.floor(seconds/60) + ":" + (String(seconds%60).length == 1?"0":"") + Math.floor(seconds%60);
			document.getElementById("deposit-timer").style.color = (seconds%2 == 0 || seconds <= 10)?"#ff0000":"#ffffff";
		}else{
			document.getElementById("deposit-timer").style.color = "#ff0000";
			document.getElementById("deposit-timer").innerHTML = "Time's up!";
		}
	}


    }///////////////////////////////endpaint///////////////////////////

canvas.addEventListener('click', function (evt){
	for(var i in EDITBOXES){
		if(cursorCol(EDITBOXES[i]) && EDITBOXES[i].drawing){
			if(EDITBOXES[i].click!==undefined)EDITBOXES[i].click();
		}
	}
}, false);


window.addEventListener('mousemove', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	mx = mousePos.x;
	my = mousePos.y;
}, false);

var keyDown = [];
window.addEventListener('keydown', function(evt){
	keyDown[evt.keyCode] = true;
})
window.addEventListener('keyup', function(evt){
	keyDown[evt.keyCode] = false;
	if (evt.keyCode === 13 && document.getElementById('datamodal').style.display == "block"){
		if(document.getElementById('login-prompt').style.display == "block")document.getElementById("login-submit").click();
		if(document.getElementById('withdraw-window').style.display == "block")document.getElementById("withdraw-submit").click();
		if(document.getElementById('signup-prompt').style.display == "block"){
			if(document.getElementById('Tos-accept').style.display == "block")document.getElementById("Tos-accept").click();
			else if(document.getElementById('signup-submit').style.display == "block")document.getElementById("signup-submit").click();
		}
		if(document.getElementById('redeem-code').style.display == "block")document.getElementById("redeem-code-button").click();
	}
	if(evt.keyCode === 32 && document.getElementById('kk-packages-complete').style.display == "block"){
		if(document.getElementById('kkshop-package-completebtn').style.display == "none"){
			clearTimeout(clearChestTimeout);
			$("#kk-packages-complete-count").css("display","block");
			$("#kkshop-package-completebtn").css("display","block");
			$("#kk-packages-complete-outcome").stop(true,true);
			$("#kk-packages-chest-reveal").stop(true,true);
			$("#kk-packages-chest-reveal").css("animation","chest-open 0.05s steps(1) forwards");
			$("#kk-packages-chest-reveal").css("top","3%");
			$("#kk-packages-complete-outcome").css("bottom","3%");
		}else if(document.getElementById('kk-packages-complete-outcome').style.bottom == "3%"){
			prepareKKpackOut(KKpackagesOutcome,true);
		}
		$("#kkshop-package-completebtn").prop("disabled",false);
	}
})

function displaywheel(e){
    var evt=window.event || e //equalize event object
    var delta=evt.detail? evt.detail : evt.wheelDelta/120 //check for detail first so Opera uses that instead of wheelDelta

    if(cursorCol(wagerscroll) && document.getElementById('datamodal').style.display != 'block'){
    	wagerscroll.offsety += delta*(h/24);
    	if(wagerscroll.offsety > 0)wagerscroll.offsety=0;
    }
}

var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
if (document.attachEvent) //if IE (and Opera depending on user setting)
	document.attachEvent("on"+mousewheelevt, displaywheel)
else if (document.addEventListener) //WC3 browsers
	document.addEventListener(mousewheelevt, displaywheel, false)


function checkMobile(){
	return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
}

window.addEventListener('resize',function(evt){
	canvasSettings();
	if(window.innerHeight >= window.innerWidth){
		$(".inv-i").css('font-size',5*(1/(1 + myInv.resize)) + "vw");
		$('#sidebar_inv').scrollTop(keepTrackScroll*window.innerWidth*0.14/(1 + myInv.resize))
	}else{
		$(".inv-i").css('font-size',5*(1/(1 + myInv.resize)) + "vh");
		$('#sidebar_inv').scrollTop(keepTrackScroll*window.innerHeight*0.135/(1 + myInv.resize))
	}
	for(var i in EDITBOXES)EDITBOXES[i].update();
});

$(function() {
    $("form").submit(function() { return false; });
});

function getMousePos(canvas, evt) 
{
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

})//end doc