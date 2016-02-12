var Suits = {
    glove : {
	text:'GLOVE',
	color:'Cornsilk',
	bgcolor:'Chocolate'
	},
    stump : {
	text:'STUMP',
	color:'Crimson',
	bgcolor:'DarkKhaki'
	},
    ball : {
	text:'BALL',
	color:'Maroon',
	bgcolor:'OldLace'
	},
    bat : {
	text:'BAT',
	color:'DarkBlue',
	bgcolor:'NavajoWhite'
	},
    pad: {
	text:'PAD',
	color:'Coral',
	bgcolor:'Beige'
	}
    };

var MAX_BALLS = 90;
var MAX_WIKS = 10;
var Cards = {
    bat : {
	hand : [],
	deck : [],
	discard : []
	},
    ball : {
	hand : [],
	deck : [],
	discard : []
	}
    };

ball = {};
shot = {};
var ballsSinceLastRun = 0;
function cardDiv(card)
    {
	var style = "style='background-color:" + (card.suit ?Suits[card.suit].bgcolor: 'gray') + ";color:" + (card.suit ?Suits[card.suit].color: 'white') + ";'";
	var cardHtml = "<div class='card'" + style + "><div class='num'>";
	cardHtml += card.number || '';
	cardHtml += "</div><div class='suit'>";
	cardHtml += card.suit ?Suits[card.suit].text: '';
	cardHtml += "</div></div>";
	return cardHtml;
    }

window.onerror = function(a, b, c, d, e)
    {
	alert(a + ' ' + b + ' ' + c + ' ' + d + ' ' + e);
    };

function initGame()
    {
	document.getElementById('maxovs').innerHTML = MAX_BALLS/6+' Over Match';
	innings = 0;
	initTeams();
	
	initInnings();
	displayArmchair();
    }

function displayArmchair()
    {
	document.getElementById('bowlcard').innerHTML = cardDiv(ball);
	document.getElementById('widecard').innerHTML = cardDiv(discard);
	document.getElementById('batcard').innerHTML = cardDiv(shot);
	document.getElementById('noball').innerHTML = noballsuit;
	document.getElementById('handtitle').innerHTML = (human === 'ball') ?'Bowling': 'Batting';
	document.getElementById('score').innerHTML = t[innings].score + '-' + t[innings].wickets + ' (' + ovrString(t[innings].balls) + ')' + ((innings === 1) ?('<br>Target :' + (t[0].score + 1)+'<br>'+remaining()): '');
	dispHand('human');
	//dispHand('comp');
	document.getElementById('scorecard').innerHTML ='';
	document.getElementById('scorecard').appendChild(displayStats(t[innings]));
    }

function ovrString(balls)
    {
	var ballRem = balls%6;
	return Math.floor(balls / 6) + ((ballRem>0)?('.' + ballRem):'');
    }

window.onload = function()
    {
	bindDeciders();
	bindClickEvents();
    };


function dispHand(id)
    {
	var i=0;
	var player = id === 'human' ?human: comp;
	for (;i < 6;i++)
	    {
		document.getElementById(id + '-card-' + (i + 1)).innerHTML = cardDiv(Cards[player].hand[i]);
	    }
    }

function bindDeciders()
    {
	var decider = document.getElementsByName('decide');
	var len = decider.length;
	for (i = 0;i < len;i++)
	    {
		decider[i].onclick = function()
		    {
			human = event.currentTarget.getAttribute('id');
			comp = (human === 'bat') ?'ball': 'bat';
			document.getElementById('decider').style.display = 'none';
			document.getElementById('armchair').style.display = '';
			initGame();
		    };
	    }
    }

function bindClickEvents()
    {

	var hand = document.getElementsByClassName('handcard');
	var len = hand.length;
	for (i = 0;i < len;i++)
	    {
		hand[i].onclick = function()
		    {
			var cardIndx = parseInt(event.currentTarget.getAttribute('id').replace('human-card-', '')) - 1;

			if (human === 'bat')
			    {
				var bathand = Cards[human].hand;
				shot = bathand[cardIndx];
				
				if (( striker>= 5 && striker <= 7) && shot.number === 1)
			        {
				    if(!confirm('Are you sure?')) {
					return;
				    }
			        }
			        else if ((striker >= 8 && striker <= 10) && (shot.number === 1 || shot.number === 2))
			        {
				    if(!confirm('Are you sure?')) {
					return;
				    }
			        }
				
				
				
				bathand.splice(cardIndx, 1);
				playCard(shot, human);
				dispHand('human');

				result = getBallvsBat(shot, ball, striker);

				interpretResult(ball, shot, result);
				displayArmchair();
				if(isMatchOver()) {
				    document.getElementById('decider').style.display='';
				    document.getElementById('armchair').style.display='none';
				    return;
				        
				} else if(thisTeam.balls === MAX_BALLS || thisTeam.wickets === 10){
				    alert('end of innings');
				    innings++;
				    if(innings===2) {
					document.getElementById('decider').style.display='';
					document.getElementById('armchair').style.display='none';
					return;
				    }
				    temp = comp;
				    comp = human;
				    human = temp;
				    initInnings();
				    
				    displayArmchair();
				    return;
				}
				
				var ballHand = Cards[comp].hand;
				ballId = bestBall(discard, noballsuit);
				ball = ballHand[ballId];
				playCard(ball, comp);
				ballHand.splice(ballId, 1);
				//dispHand('comp');
				displayArmchair();

			    }
			else
			    {
				var ballHand = Cards[human].hand;
				ball = ballHand[cardIndx];
				playCard(ball, human);
				ballHand.splice(cardIndx, 1);
				dispHand('human');

				var batHand = Cards[comp].hand;
				shotId = aiBat(noballsuit, ball);
				shot = batHand[shotId];
				batHand.splice(shotId, 1);
				playCard(shot, comp);
				//dispHand('comp');
				
				result = getBallvsBat(shot, ball, striker);

				interpretResult(ball, shot, result);

				displayArmchair();
				
				if(isMatchOver()) {
				    document.getElementById('decider').style.display='';
				    document.getElementById('armchair').style.display='none';
				    return;
				        
				} else if(thisTeam.balls === MAX_BALLS || thisTeam.wickets === 10){
				    alert('end of innings');
				    innings++;
				     if(innings===2) {
					document.getElementById('decider').style.display='';
					document.getElementById('armchair').style.display='none';
					return;
				    }
				    temp = comp;
				    comp = human;
				    human = temp;
				    initInnings();
				    
				    displayArmchair();
				    
				}
			    }

			

			
			
		    };
	    }
    }



function card(suit, number)
    {
	this.suit = suit;
	this.number = number;
    }

function team()
    {
	this.balls = 0;
	this.wickets = 0;
	this.players = [];
	this.extras = 0;
	this.score = 0;
    }

function player()
    {
	this.runs = 0;
	this.balls = 0;
	this.sixes = 0;
	this.fours = 0;
	this.dismissal = 'not out';
	this.runsGiven = 0;
	this.ballsBowled = 0;
	this.wickets = 0;
	this.maidens = 0;
    }

var t;
suits = ['bat', 'ball', 'glove', 'stump', 'pad'];
cards = [];
batHand = [];
ballHand = [];
batDeck = [];
ballDeck = [];
discardShots = [];
discardBalls = [];
noballsuit = '';
discard = new card();
delivs = [];


function msg(txt)
    {
	var d = document.createElement('div');
	var msgStr = '<b>' + ovrString(thisTeam.balls) + '</b> ';
	msgStr += txt;
	d.innerHTML = msgStr;
	var target = document.getElementById('msgs');
	if (target.childNodes.length > 10)
	    {
		target.removeChild(target.lastChild);
	    }
	target.insertBefore(d, target.firstChild);
    }

function playCard(card, id)
    {
	Cards[id].discard.push(card);

	// If ball deck runs out, shuffle and reload
	if (Cards[id].deck.length <= 0)
	    {
		shuffleDeck(Cards[id].discard);
		Cards[id].deck = Cards[id].discard;
		Cards[id].discard = [];
	    }
	//take new card from deck
	Cards[id].hand.push(Cards[id].deck.pop());
    }

function aiBat(noballsuit, ball)
    {
	var batOpt,i ;
	var batHand = Cards.bat.hand;
	// Play min shot if its a noball
	if (noballsuit === ball.suit)
	    {
		var min = batHand[0].number;
		batOpt = 0;
		for (i = 1;i < 6;i++)
		    {
			if (min >= batHand[i].number)
			    {
				batOpt = i;
			    }
		    }
	    }
	else
	    {
		// Select best shot
		batOpt = bestShot(ball, striker);
	    }
	return batOpt;
    }

function swap(arr, a, b)
    {
	var temp =arr[a];
	arr[a] = arr[b];
	arr[b] = temp;
    }
function generateDeck(id)
    {
	var suitCounter = 0,
        number = 1;
	Cards[id].deck = [];
	for (; suitCounter < 5; suitCounter++)
	    {
		for (number = 1; number <= 11; number++)
		    {
			Cards[id].deck.push(new card(suits[suitCounter], number));
		    }
	    }
    }

function shuffleDeck(cards)
    {
	var temp = {},
        i, picked,l=cards.length;
	for (i = 0; i < l; i++)
	    {
		picked = Math.floor(Math.random() * l);
		//swap(cards, cards[i], cards[picked]);
		temp = cards[i];
		cards[i] = cards[picked];
		cards[picked] = temp;
	    }
    }

function dealCards()
    {
	Cards['bat'].hand = [];
	Cards['ball'].hand = [];
	for (var i = 0; i < 6; i++)
	    {
		Cards['bat'].hand.push(Cards['bat'].deck.pop());
		Cards['ball'].hand.push(Cards['ball'].deck.pop());
	    }
    }

function initTeams()
    {
	t = [];
	t[0] = new team();
	t[1] = new team();
	for (var i=0;i < 2;i++)
	    {
		for (var j =0;j < 11;j++)
		    {
			t[i].players.push(new player());
		    }
	    }
    }

function initInnings()
    {
	generateDeck('bat');
	shuffleDeck(Cards.bat.deck);
	generateDeck('ball');
	shuffleDeck(Cards.ball.deck);
	dealCards();

// Discard a card from bowling hand

	Cards.bat.discard = [Cards.bat.hand.shift()];
	Cards.ball.discard = [Cards.ball.hand.shift()];
	discard = Cards.bat.discard[0];
	noballsuit = Cards.ball.discard[0].suit;

	Cards.bat.hand.push(Cards.bat.deck.pop());
	Cards.ball.hand.push(Cards.ball.deck.pop());

	striker = 0;
	nonstriker = 1;

	thisTeam = t[innings];
	ball = {};
	shot = {};

	if (comp === 'ball')
	    {
		ballId = bestBall(discard, noballsuit);
		ball = Cards.ball.hand[ballId];
		playCard(ball, comp);
		Cards[comp].hand.splice(ballId, 1);

	    }
    }



function interpretResult(ball, shot, result)
    {
	shotOffered = true;
	if (noballsuit === ball.suit)
	    {
		delivs.push(result + 'Nb');
		thisTeam.score += (result + 1);
		thisTeam.extras++;
		thisTeam.players[striker].balls++;
		thisTeam.players[striker].runs += result;
		// batsmen change ends
		if (result % 2 == 1)
		    {
			var k = nonstriker;
			nonstriker = striker;
			striker = k;
		    }

		msg('Noball and ' + (result + 1) + ' runs');


	    }
	else if (discard.number === ball.number)
	    {
		thisTeam.score++;
		delivs.push('Wd'); 
		thisTeam.extras++;
		shotOffered = false;

		msg('Wide.');
	    }
	else
	    { 
		thisTeam.balls++;
		thisTeam.players[striker].balls++;
		if (result === -2)
		    {
			thisTeam.wickets++;
			thisTeam.players[striker].dismissal = 'Out.';
			striker = thisTeam.wickets + 1;
			delivs.push('W');
			msg('Out.');
			ballsSinceLastRun++;
		    }
		else if (result > 0)
		    {
			thisTeam.players[striker].runs += result;
			if (result === 6)
			    {
				thisTeam.players[striker].sixes++;
			    }
			else if (result === 4)
			    {
				thisTeam.players[striker].fours++;
			    }
			if (result % 2 == 1)
			    {
				var k = nonstriker;
				nonstriker = striker;
				striker = k;
			    }
			delivs.push(result + '');
			thisTeam.score += result;

			msg(result + ' runs.');

		    }
		else if(result===-1)
		    {
			delivs.push('.');
			msg('Left. Dot ball');
			ballsSinceLastRun++;
		    }
		else {
		    delivs.push('.');
			msg('Blocked. Dot ball');
			
			ballsSinceLastRun++;
		}

		// End of the over.change ends.
		if (thisTeam.balls % 6 === 0)
		    {

			noballsuit = ball.suit;
			msg('Noball suit changed to ' + noballsuit);
			var k = nonstriker;
			nonstriker = striker;
			striker = k;
		    }

	    }


	if (shotOffered)
	    {
		discard = shot;
	    }



    }



function getBallvsBat(shot, ball, batno)
    {
	var runScored = [0, 1, 1, 1, 2, 2, 3, 4, 4, 4, 6];
	if (shot.suit === ball.suit || noballsuit === ball.suit)
	    {
		if (shot.number > ball.number)
		    {
			var diff = shot.number - ball.number;
			return runScored[diff];
		    }
		else
		    {
			if ((batno >= 5 && batno <= 7) && shot.number === 1)
			    {
				return -2;
			    }
			else if ((batno >= 8 && batno <= 10) && (shot.number === 1 || shot.number === 2))
			    {
				return -2;
			    }
			else
			    {
				return 0;
			    }
		    }
	    }
	else
	    {
		if (shot.number >= ball.number)
		    {
			return -1;
		    }
		else
		    {
			return -2;
		    }
	    }
    }

function analyseCard(suit, number, i)
    {
	this.suit = suit;
	this.number = number;
	this.rank = 0; // number of cards with value >= this card
	this.run = 0; // runs that can be scored
	this.suitCount = 0; //number of cards of same suit
	this.ballDiff = 0; // this.number - ball.number
	this.cardnumber = i;
    }

/*
 * Factors which helps select a good shot
 * number, run, 
 */
function bestShot(ball, batno)
    {
	var analyse = [],
        i, j;
	var suitCounter = [];
	var batHand = Cards.bat.hand;
	for (i = 0; i < 5; i++)
	    {
		suitCounter[suits[i]] = 0;
	    }
	// Copy hand to analyse hand
	for (i = 0; i < 6; i++)
	    {
		analyse[i] = new analyseCard();
		analyse[i].suit = batHand[i].suit;
		analyse[i].number = batHand[i].number;
		analyse[i].ballDiff = batHand[i].number - ball.number;
		analyse[i].run = getBallvsBat(batHand[i], ball, batno);
		analyse[i].cardnumber = i;
		if (analyse[i].run == -1)
		    {
			analyse[i].run = 0;
		    }
		suitCounter[analyse[i].suit]++;
	    }
	// Set suit count
	for (i = 0; i < 6; i++)
	    {
		analyse[i].suitCount = suitCounter[analyse[i].suit];
	    }

	// Set ranks
	for (i = 0; i < 6; i++)
	    {
		for (j = 0; j < 6; j++)
		    {
			if (j != i && analyse[j].number >= analyse[i].number)
			    {
				analyse[i].rank++;
			    }

		    }
	    }

	// Sort the analysehand based in the order of
	// run highest first
	// rank highest
	// suitCount highest
	// balldiff lowest
	for (i = 0; i < 5; i++)
	    {
		for (j = i + 1;
		j < 6;
		j++)
		    {
			if (analyse[i].run < analyse[j].run)
			    {
				swap(analyse, i, j);
			    }
			else if (analyse[i].run == analyse[j].run)
			    {
				if (analyse[i].rank < analyse[j].rank)
				    {
					swap(analyse, i, j);
				    }
				else if (analyse[i].rank == analyse[j].rank)
				    {
					if (analyse[i].suitCount < analyse[j].suitCount)
					    {
						swap(analyse, i, j);
					    }
					else if (analyse[i].suitCount == analyse[j].suitCount)
					    {
						if (analyse[i].ballDiff > analyse[j].ballDiff)
						    {
							swap(analyse, i, j);
						    }

					    }
				    }
			    }

		    }
	    }

	for (i = 0;i < 6;i++)
	    {
		if (analyse[i].rank !== 0)
		    return analyse[i].cardnumber;
	    }
	return analyse[0].cardnumber;
    }

function bestBall(discard, noballsuit)
    {
	var analyse = [],i,j,ballHand;

	ballHand = Cards.ball.hand;
	for (i = 0;i < 6;i++)
	    {

		analyse[i] = new analyseCard(ballHand[i].suit, ballHand[i].number, i);
	    }

	//aggressive bowling, best card
	for (i = 0;i < 5;i++)
	    {
		for (j = i + 1;j < 6;j++)
		    {
			if (analyse[i].number < analyse[j].number)
			    {
				swap(analyse, i, j);
			    }
		    }
	    }

	var count = 0;
	while (count < 6 && (analyse[count].suit == noballsuit || analyse[count].number == discard.number))       
	    {    count++; 
	    }

	return analyse[count % 6].cardnumber;

    }


function isMatchOver()
    {
	if (innings === 1)
	    {
		if (thisTeam.balls === MAX_BALLS || thisTeam.wickets === 10)
		    {
			if (t[1].score > t[0].score)
			    {
				alert((comp === 'bat' ?'comp': 'human') + ' wins by ' + (10 - t[1].wickets) + ' wickets');
			    }
			else if (t[0].score > t[1].score)
			    {
				alert((comp === 'ball' ?'comp': 'human') + ' wins by ' + (t[0].score - t[1].score) + ' runs');
			    }
			else
			    {
				alert('Tied');
			    }
			;return true;
		    }
		    else {
			if (t[1].score > t[0].score)
			    {
				alert((comp === 'bat' ?'comp': 'human') + ' wins by ' + (10 - t[1].wickets) + ' wickets');
				return true;
			    }
		    }
	    }
        return false;
    
    }
function displayStats(t)
    {
	var tab = document.createElement('table');
	var i,rowStr;
	for (i = 0;i < 11;i++)
	    {


		rowStr = '<td>' + (i + 1) +(i==striker?'*':'')+'</td>';
		rowStr += '<td>' +( (i<=(t.wickets+1))?t.players[i].dismissal:'' )+ '</td>';
		rowStr += '<td align="right">' + t.players[i].runs + '</td>';
		rowStr += '<td>' + t.players[i].balls + '</td>';
		rowStr += '<td>' + t.players[i].fours + '</td>';
		rowStr += '<td>' + t.players[i].sixes + '</td>';

		var row = document.createElement('tr');
		row.innerHTML = rowStr;
		//$('<tr>' + rowStr + '</tr>');
		tab.appendChild(row); 
	    }

	tab.innerHTML+='<tr><td colspan=2>Extras :</td><td colspan=4>' + t.extras + '</td></tr>';
	rowStr = '<td colspan=2>' + t.score;
	rowStr += (((t.wickets == 10) ?' Allout': ('-' + t.wickets)) + '</td>');
	rowStr += ('<td colspan=2>Overs</td><td colspan=2>' + ovrString(t.balls)+ '</td>');
	
	
	tab.innerHTML+='<tr>' + rowStr + '</tr>';
	tab.innerHTML+=runrates(t);
	return tab;

    }

    
    function runrateStr(title,runs,balls) {
	return '<tr><td>'+title+' </td><td>'+(runs/balls*6).toFixed(2)+'</td></tr>';
    }
    function runrates(te) {
	var row ='';
	if(te.balls>0 && te.score>0) {
	    row=runrateStr('CRR',te.score,te.balls);
	}
        
	if(innings === 1 && te.balls>11) {
	    var runsNeeded = t[0].score - t[1].score +1;
	    var ballsRemain = MAX_BALLS - t[1].balls;
	    if(ballsRemain>6) {
	    row+=runrateStr('Required',runsNeeded,ballsRemain);
	    }
	}
	return row;
    }
    
    function remaining() {
	var row = 'Need '+(t[0].score-t[1].score+1) + ' from ';
	if(t[1].balls< (2*MAX_BALLS/3)) {
	    row += ovrString(MAX_BALLS - t[1].balls)+' overs';
	} else {
	    row += (MAX_BALLS -  t[1].balls)+' balls';
	}
	return row;
    }
