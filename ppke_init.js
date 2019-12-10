function dec2bin(dec){
	return (dec >>> 0).toString(2);	//перевод 10-чного в бинарное
};

var ppkeName = ["ppke1","ppke2","ppke3","ppke4","ppke5","ppke6"];   //имена ппке

var drebezgCounter = 0;	//инициализация счетчика дребезга

var sipStatus;	//статус SIP клиента iridium

var secZoneA = [0,0];	//двойные шлейфы
var secZoneB = [0,0];
var secZoneC = [0,0];
var secZoneD = [0,0];
var secZoneE = [0,0];
var secZoneF = [0,0];
var secZoneG = [0,0];
var secZoneH = [0,0];
var secZoneI = [0,0];
var secZoneJ = [0,0];
var secGateA = [0,0];
var secGateB = [0,0];

var prismZoneA = [0,0];	//шлейфы призм
var prismZoneB = [0,0];
var prismZoneC = [0,0];
var prismZoneD = [0,0];
var prismZoneE = [0,0];
var prismZoneF = [0,0];

var svetOut;
var svetIn;

var ppke1SvetIn;
var ppke1SvetOut;
var ppke2SvetIn;
var ppke2SvetOut;
var ppke3SvetIn;
var ppke3SvetOut;
var ppke4SvetIn;
var ppke4SvetOut;
var ppke5SvetIn;
var ppke5SvetOut;
var ppke6SvetIn;
var ppke6SvetOut;

var counterForPrismSms = 1;

var stateZoneA;	//состояния тэгов
var stateZoneB;
var stateZoneC;
var stateZoneD;
var stateZoneE;
var stateZoneF;
var stateZoneG;
var stateZoneH;
var stateZoneI;
var stateZoneJ;
var stateGateA;
var stateGateB;

var relaySet;
var relaySet1;
var autoTrigger;
var astrolog;	//состояние астролога

var logZoneColor = [" "," "," "," "," "," "," "," "," "," "," "," "];	//цвет зон для логирования
var stateColorNew = []; 

var prismAState = "init";	//инициализация переменных для контроля зависания призм
var prismBState = "init";
var prismCState = "init";
var prismDState = "init";
var prismEState = "init";
var prismFState = "init";

var xAState = "init";	//инициализация переменных для контроля зависания X
var xBState = "init";
var xCState = "init";
var xDState = "init";
var xEState = "init";
var xFState = "init";

IR.SetInterval (5000, watchDog);	//запуск сторожевого таймера ппке2 мс
IR.SetInterval (300, stateRequest);	//запрос состояния приборов  мс
IR.SetInterval (90000, pushingAlarm);	//вызов отправки пуш-уведомлений
IR.SetInterval (5000, logingChange);	//вызов логирования изменений зон
IR.SetInterval (30000, prismCheckOverload);	//вызов проверки зависания призм
IR.SetInterval (1000, sipCalling);	//вызов проверки проверки зоны на красный статус и звонок по Сип
IR.SetInterval (5000, sipStatusAvalible);

IR.SetInterval (1000, lightControl);

var shMin = 180;	//нижний порог срабатывания
var shMax = 254;	//верхний порог срабатывания

IR.AddListener(IR.EVENT_START,0,function()
{
   IR.SetVariable("Server.Channels.zoneA", IR.GetVariable("Server.Tags.zoneA"));	//присвоение каналов и тегов до падения	
	IR.SetVariable("Server.Channels.zoneB", IR.GetVariable("Server.Tags.zoneB"));  
	IR.SetVariable("Server.Channels.zoneC", IR.GetVariable("Server.Tags.zoneC"));  	
	IR.SetVariable("Server.Channels.zoneD", IR.GetVariable("Server.Tags.zoneD"));  	
	IR.SetVariable("Server.Channels.zoneE", IR.GetVariable("Server.Tags.zoneE"));  	
	IR.SetVariable("Server.Channels.zoneF", IR.GetVariable("Server.Tags.zoneF"));  	
	IR.SetVariable("Server.Channels.zoneG", IR.GetVariable("Server.Tags.zoneG"));  	
	IR.SetVariable("Server.Channels.zoneH", IR.GetVariable("Server.Tags.zoneH"));  	
	IR.SetVariable("Server.Channels.zoneI", IR.GetVariable("Server.Tags.zoneI"));  	
	IR.SetVariable("Server.Channels.zoneJ", IR.GetVariable("Server.Tags.zoneJ"));  	
	IR.SetVariable("Server.Channels.gateA", IR.GetVariable("Server.Tags.gateA"));  	
	IR.SetVariable("Server.Channels.gateB", IR.GetVariable("Server.Tags.gateB"));  
   
   IR.SetVariable("Server.Channels.homeAlarm", IR.GetVariable("Server.Tags.homeAlarm"));	//ревун
	
   
	IR.SetVariable("Server.Channels.faceDisable", IR.GetVariable("Server.Tags.faceDisable"));	//отключение управления 
	
   
	IR.SetVariable("Server.Channels.lightState", IR.GetVariable("Server.Tags.lightState"));	//состояние прожекторов 
	
   
	IR.SetVariable("Server.Channels.autoLightIn", IR.GetVariable("Server.Tags.autoLightIn"));	//автовключение прожекторов
   IR.SetVariable("Server.Channels.autoLightOut", IR.GetVariable("Server.Tags.autoLightOut"));					
})

function sipStatusAvalible(){
   if (sipStatus === "Not Available..." || sipStatus === "Service Unavailable..." || sipStatus === "Not Acceptable...") {
      IR.GetDevice('SIP').Set("UNREGISTER", 0);
      IR.GetDevice('SIP').Set("REGISTER", 0);
   }
}

IR.AddListener(IR.EVENT_WORK, 0, function (){
	sipStatus = IR.GetVariable("Drivers.SIP.Tags.STATUS");	//получаем статус SIP клиента  
   
	relaySet = IR.GetVariable("Server.Channels.relaySet");	//присвоение каналов и тегов реле
	IR.SetVariable("Server.Tags.relaySet",relaySet);
   
   relaySet1 = IR.GetVariable("Server.Channels.relaySet1");	//присвоение каналов и тегов реле
	IR.SetVariable("Server.Tags.relaySet1",relaySet1);
   
	stateZoneA = IR.GetVariable("Server.Channels.zoneA");	//присвоение каналов и тегов
	IR.SetVariable("Server.Tags.zoneA",stateZoneA);
	stateZoneB = IR.GetVariable("Server.Channels.zoneB");  
	IR.SetVariable("Server.Tags.zoneB",stateZoneB);
	stateZoneC = IR.GetVariable("Server.Channels.zoneC");  
	IR.SetVariable("Server.Tags.zoneC",stateZoneC);
	stateZoneD = IR.GetVariable("Server.Channels.zoneD");  
	IR.SetVariable("Server.Tags.zoneD",stateZoneD);
	stateZoneE = IR.GetVariable("Server.Channels.zoneE");  
	IR.SetVariable("Server.Tags.zoneE",stateZoneE);
	stateZoneF = IR.GetVariable("Server.Channels.zoneF");  
	IR.SetVariable("Server.Tags.zoneF",stateZoneF);
	stateZoneG = IR.GetVariable("Server.Channels.zoneG");  
	IR.SetVariable("Server.Tags.zoneG",stateZoneG);
	stateZoneH = IR.GetVariable("Server.Channels.zoneH");  
	IR.SetVariable("Server.Tags.zoneH",stateZoneH);
	stateZoneI = IR.GetVariable("Server.Channels.zoneI");  
	IR.SetVariable("Server.Tags.zoneI",stateZoneI);
	stateZoneJ = IR.GetVariable("Server.Channels.zoneJ");  
	IR.SetVariable("Server.Tags.zoneJ",stateZoneJ);
	stateGateA = IR.GetVariable("Server.Channels.gateA");  
	IR.SetVariable("Server.Tags.gateA",stateGateA);
	stateGateB = IR.GetVariable("Server.Channels.gateB");  
	IR.SetVariable("Server.Tags.gateB",stateGateB);
   
   IR.SetVariable("Server.Tags.autoLightIn", IR.GetVariable("Server.Channels.autoLightIn"));
   IR.SetVariable("Server.Tags.autoLightOut", IR.GetVariable("Server.Channels.autoLightOut"));
   
	homeAlarm = IR.GetVariable("Server.Channels.homeAlarm");	//ревун
	IR.SetVariable("Server.Tags.homeAlarm",homeAlarm);
   
	faceDisable = IR.GetVariable("Server.Channels.faceDisable");	//отключение управления 
	IR.SetVariable("Server.Tags.faceDisable",faceDisable);
   
	lightState = IR.GetVariable("Server.Channels.lightState");	//состояние прожекторов 
	IR.SetVariable("Server.Tags.lightState",lightState);
   
	autoTrigger = IR.GetVariable("Server.Channels.autoLight");	//автовключение прожекторов
	IR.SetVariable("Server.Tags.autoLight",autoTrigger);
	astrolog = IR.GetVariable("Drivers.HDL-BUS Pro Network (UDP).Tags.HDL-ML01 (Logic timer) [Лог_ модуль 1 этаж] 1:UV85");
   
	smscontrol = IR.GetVariable("Drivers.HDL-BUS Pro Network (UDP).Tags.HDL-ML01 (Logic timer) [Лог_ модуль 1 этаж] 1:UV222");
	smsrecive = IR.GetVariable("Drivers.HDL-BUS Pro Network (UDP).Tags.HDL-ML01 (Logic timer) [Лог_ модуль 1 этаж] 1:UV223");
 
 
   
/* 	if (smscontrol == 1 && smsrecive == 1){	//постановка и снятие по СМС
		IR.SetVariable("Server.Channels.zoneA","green");
		IR.SetVariable("Server.Channels.zoneB","green");
		IR.SetVariable("Server.Channels.zoneC","green");
		IR.SetVariable("Server.Channels.zoneD","green");
		IR.SetVariable("Server.Channels.zoneE","green");
		IR.SetVariable("Server.Channels.zoneF","green");
		IR.SetVariable("Server.Channels.zoneG","green");
		IR.SetVariable("Server.Channels.zoneH","green");
		IR.SetVariable("Server.Channels.zoneI","green");
		IR.SetVariable("Server.Channels.zoneJ","green");
		IR.SetVariable("Server.Channels.gateA","green");
		IR.SetVariable("Server.Channels.gateB","green");
		IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("HDL-ML01 (Logic timer) [Лог_ модуль 1 этаж] 1:UV223", 0);
		IR.Log("Зоны поставлены по СМС"); 
	}
	if (smscontrol == 0 && smsrecive == 1){
		IR.SetVariable("Server.Channels.zoneA","black");
		IR.SetVariable("Server.Channels.zoneB","black");
		IR.SetVariable("Server.Channels.zoneC","black");
		IR.SetVariable("Server.Channels.zoneD","black");
		IR.SetVariable("Server.Channels.zoneE","black");
		IR.SetVariable("Server.Channels.zoneF","black");
		IR.SetVariable("Server.Channels.zoneG","black");
		IR.SetVariable("Server.Channels.zoneH","black");
		IR.SetVariable("Server.Channels.zoneI","black");
		IR.SetVariable("Server.Channels.zoneJ","black");		
		IR.SetVariable("Server.Channels.gateA","black");
		IR.SetVariable("Server.Channels.gateB","black");			
		IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("HDL-ML01 (Logic timer) [Лог_ модуль 1 этаж] 1:UV223", 0);
		IR.Log("Зоны сняты по СМС"); 
	} */	
});


var stRelaytmp = 0;	//триггер сторожевого таймера
  
function watchDog(){	//сторожевой таймер
      switch (stRelaytmp){
         case 1:
	        stRelaytmp = 0;
			IR.GetDevice("ppke2").Set("relay4off","");          			
         break;
         case 0:
         	stRelaytmp = 1;
            IR.GetDevice("ppke2").Set("relay4on","");
         break;
      }
}          

function checkAlarm(name,sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8){    //проверка шлейфов на дребезг и сработку
	var checkSh = [sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8];
	for (var i = 0; i < checkSh.length; i++){
		var shNumber = i+1;
		var shVal = checkSh[i];      
		if (checkSh[i] < shMin || checkSh[i] > shMax){
         drebezgCounter ++        
			if (drebezgCounter > 10){           
				drebezgCounter = 0;
				getZone (name,shNumber);
				IR.Log("SRABOTAL SHLEIF: " + name+ "-" + shNumber);
			}
		}
	} 
}

function sendPrismSms(){
   if (counterForPrismSms === 1){
      IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 13);            
   }
   if (counterForPrismSms < 100){
      counterForPrismSms++;      
   }
   if (counterForPrismSms === 100){
      counterForPrismSms = 1;      
   }   
}

function prismCheckOverload(){ //проверка зависания призм
	if (prismAState === "red"){
		prismAState = "black";
		IR.Log("ZAVISLA PRIZMA A");
      sendPrismSms();   
	} 
	if (prismBState === "red"){
		prismBState = "black";
		IR.Log("ZAVISLA PRIZMA B");
      sendPrismSms();         
	} 
	if (prismCState === "red"){
		prismCState = "black";
		IR.Log("ZAVISLA PRIZMA C");
      sendPrismSms();         
	} 
	if (prismDState === "red"){
		prismDState = "black";
		IR.Log("ZAVISLA PRIZMA D"); 
      sendPrismSms();       
	} 
	if (prismEState === "red"){
		prismEState = "black";
		IR.Log("ZAVISLA PRIZMA E");
      sendPrismSms();        
	} 
   if (prismFState === "red"){
		prismFState = "black";
		IR.Log("ZAVISLA PRIZMA F"); 
      sendPrismSms();      
	}
   if (prismAState === "red"){
		xAState = "black";
		IR.Log("ZAVIS X A");
      sendPrismSms();        
	} 
	if (prismBState === "red"){
		xBState = "black";
		IR.Log("ZAVIS X B"); 
      sendPrismSms();        
	} 
	if (prismCState === "red"){
		xCState = "black";
		IR.Log("ZAVIS X C");
      sendPrismSms();         
	} 
	if (prismDState === "red"){
		xDState = "black";
		IR.Log("ZAVIS X D");
      sendPrismSms();         
	} 
	if (prismEState === "red"){
		xEState = "black";
		IR.Log("ZAVIS X E");
      sendPrismSms();         
	} 
   if (prismFState === "red"){
		xFState = "black";
		IR.Log("ZAVIS X F");
      sendPrismSms();         
	}                      
}

function watchDogPrism(name,sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8) {
	var checkPrism = [sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8];
	for (var i = 0; i < checkPrism.length; i++){
		var shNumber1 = i+1;
		if (checkPrism[i] < shMin || checkPrism[i] > shMax){
			RedPrismZone (name,shNumber1);                 
		}
		if (checkPrism[i] > shMin && checkPrism[i] < shMax){
			GreenPrismZone (name,shNumber1);        
        }
    }
}

function RedPrismZone(name,shNumber1) {
	zoneProps = [name,shNumber1];
	switch (zoneProps.join(',')) {
		case "ppke1,4": 
			prismAState = "red";
		break;
		case "ppke1,5":
			xAState = "red";
		break;
		case "ppke6,3":
			xBState = "red";
		break;
		case "ppke6,4":
			prismBState = "red";
		break;
		case "ppke5,1":
			xCState = "red";
		break;
		case "ppke5,4":
			prismCState = "red";
		break;
		case "ppke5,2":
			xDState = "red";
		break;
		case "ppke5,5":
			prismDState = "red";
		break;
		case "ppke5,3":
			xEState = "red";
		break;
		case "ppke5,6":
			prismEState = "red";
		break;
		case "ppke5,7":
			prismFState = "red";
		break;
		case "ppke5,8":
			xFState = "red";
		break;
		}
}

function GreenPrismZone(name,shNumber1) {
	zoneProps = [name,shNumber1];
	switch (zoneProps.join(',')) {
		case "ppke1,4": 
			prismAState = "Green";
		break;
		case "ppke1,5":
			xAState = "Green";
		break;
		case "ppke6,3":
			xBState = "Green";
		break;
		case "ppke6,4":
			prismBState = "Green";
		break;
		case "ppke5,1":
			xCState = "Green";
		break;
		case "ppke5,4":
			prismCState = "Green";
		break;
		case "ppke5,2":
			xDState = "Green";
		break;
		case "ppke5,5":
			prismDState = "Green";
		break;
		case "ppke5,3":
			xEState = "Green";
		break;
		case "ppke5,6":
			prismEState = "Green";
		break;
		case "ppke5,7":
			prismFState = "Green";
		break;
		case "ppke5,8":
			xFState = "Green";
		break;
		}
}


function logingChange(){	//логирование изменения цветов зон
	var zoneNames2 = ["zoneA","zoneB","zoneC","zoneD","zoneE","zoneF","zoneG","zoneH","zoneI","zoneJ","gateA","gateB"];
	for (var i = 0; i < zoneNames2.length; i++){
		var stateColor = IR.GetVariable("Server.Channels." + zoneNames2[i]);
		stateColorNew[i] = stateColor;
		if (stateColor !== logZoneColor[i]){
			IR.Log("ЗОНА: " + zoneNames2[i] + " ПЕРЕШЛА В: " + stateColorNew[i]);
			logZoneColor[i] = stateColor;
         if  (stateColorNew[i] !== "red") {
            IR.GetDevice('SIP').Set("CANCEL", 0);  
         }
         //send_mail("ЗОНА: " + zoneNames2[i] + " ПЕРЕШЛА В: " + stateColorNew[i]);                    
		}
	} 
}


function checkRelay(name,rl1,rl2,rl3,rl4){     //проверка состояний реле
   var checkRl = [rl1,rl2,rl3,rl4];
	for (var i = 0; i < checkRl.length; i++){ 		
      switch (name) {
				case "ppke1": 
					if (rl2 === "1"){
                  ppke1SvetIn = 1;                             
               }
               if (rl2 === "0"){
                  ppke1SvetIn = 0;  
               } 
               if (rl3 === "1"){
                  ppke1SvetOut = 1;   
               }
               if (rl3 === "0"){
                  ppke1SvetOut = 0;   
               }                     
				break;
            case "ppke2": 
					if (rl2 === "1"){
                  ppke2SvetIn = 1;   
               }
               if (rl2 === "0"){
                  ppke2SvetIn = 0;   
               } 
               if (rl3 === "1"){
                  ppke2SvetOut = 1;   
               }
               if (rl3 === "0"){
                  ppke2SvetOut = 0;   
               }              
				break;
            case "ppke3": 
					if (rl2 === "1"){
                  ppke3SvetIn = 1;   
               }
               if (rl2 === "0"){
                  ppke3SvetIn = 0;   
               } 
               if (rl3 === "1"){
                  ppke3SvetOut = 1;   
               }
               if (rl3 === "0"){
                  ppke3SvetOut = 0;   
               }              
				break;
            case "ppke4": 
					if (rl2 === "1"){
                  ppke4SvetIn = 1;   
               }
               if (rl2 === "0"){
                  ppke4SvetIn = 0;   
               } 
               if (rl3 === "1"){
                  ppke4SvetOut = 1;   
               }
               if (rl3 === "0"){
                  ppke4SvetOut = 0;   
               }              
				break;
            case "ppke5": 
					if (rl2 === "1"){
                  ppke5SvetIn = 1;   
               }
               if (rl2 === "0"){
                  ppke5SvetIn = 0;   
               } 
               if (rl3 === "1"){
                  ppke5SvetOut = 1;   
               }
               if (rl3 === "0"){
                  ppke5SvetOut = 0;   
               }              
				break;
            case "ppke6": 
					if (rl2 === "1"){
                  ppke6SvetIn = 1;   
               }
               if (rl2 === "0"){
                  ppke6SvetIn = 0;   
               } 
               if (rl3 === "1"){
                  ppke6SvetOut = 1;   
               }
               if (rl3 === "0"){
                  ppke6SvetOut = 0;   
               }              
				break;
		}            
   }
   if (ppke1SvetIn === 1 && ppke3SvetIn === 1 && ppke4SvetIn === 1 && ppke5SvetIn === 1 && ppke6SvetIn === 1) {
      var svetIn = 1;
      IR.SetVariable("Server.Tags.lightIn",svetIn);      
   }
   if (ppke1SvetIn === 0 || ppke3SvetIn === 0 || ppke4SvetIn === 0 || ppke5SvetIn === 0 || ppke6SvetIn === 0) {
      var svetIn = 0; 
      IR.SetVariable("Server.Tags.lightIn",svetIn);        
   }
   if (ppke1SvetOut === 1 && ppke3SvetOut === 1 && ppke4SvetOut === 1 && ppke5SvetOut === 1 && ppke6SvetOut === 1) {
      var svetOut = 1;
      IR.SetVariable("Server.Tags.lightOut",svetOut);        
   }
   if (ppke1SvetOut === 0 || ppke3SvetOut === 0 || ppke4SvetOut === 0 || ppke5SvetOut === 0 || ppke6SvetOut === 0) {
      var svetOut = 0; 
      IR.SetVariable("Server.Tags.lightOut",svetOut);  
   }   
}

 /*function autoLight(){	//автосвет
	if (autoTrigger == 1 && astrolog == 1 && lightState == 0){
		setRelayAuto(1);
	}
	if (autoTrigger == 1 && astrolog == 0 && lightState == 0){
		setRelayAuto(0);
	}
    
}
  */
function lightControl() {
   var tagButtonIn =  parseInt(IR.GetVariable("Server.Channels.manLightButtonIn"));
   var tagButtonOut = parseInt(IR.GetVariable("Server.Channels.manLightButtonOut"));
   var tagLightIn = parseInt(IR.GetVariable("Server.Tags.lightIn"));
   var tagLightOut = parseInt(IR.GetVariable("Server.Tags.lightOut"));
   
   var autoLightIn = parseInt(IR.GetVariable("Server.Tags.autoLightIn"));
   var autoLightOut = parseInt(IR.GetVariable("Server.Tags.autoLightOut"));
   
  // IR.Log(tagButtonIn + tagLightIn); 
   IR.Log(astrolog); 
 
if (autoLightIn === 0) {  
   if (tagButtonIn === 1 && tagLightIn === 0){
		for (var i = 0; i < ppkeName.length; i++){
			IR.GetDevice(ppkeName[i]).Set("relay2on","");			
		}
	}
   if (tagButtonIn === 0 && tagLightIn === 1){
		for (var i = 0; i < ppkeName.length; i++){
			IR.GetDevice(ppkeName[i]).Set("relay2off","");			
		}
	}
}
if (autoLightOut === 0) {    
   if (tagButtonOut === 1 && tagLightOut === 0){
   
		for (var i = 0; i < ppkeName.length; i++){
			IR.GetDevice(ppkeName[i]).Set("relay3on","");			
		}
	}
   if (tagButtonOut === 0 && tagLightOut === 1){
   IR.Log(IR.GetVariable("Server.Tags.lightOut")); 
		for (var i = 0; i < ppkeName.length; i++){
			IR.GetDevice(ppkeName[i]).Set("relay3off","");			
		}
	}
   }
if (autoLightIn === 1) {
   if (astrolog === 1 && tagLightOut === 0){
		for (var i = 0; i < ppkeName.length; i++){
			IR.GetDevice(ppkeName[i]).Set("relay2on","");			
		}
	}
   if (astrolog === 0 && tagLightOut === 1){
		for (var i = 0; i < ppkeName.length; i++){
			IR.GetDevice(ppkeName[i]).Set("relay2off","");			
		}
	}  
} 
if (autoLightOut === 1) {
   if (astrolog === 1 && tagLightOut === 0){
		for (var i = 0; i < ppkeName.length; i++){
			IR.GetDevice(ppkeName[i]).Set("relay3on","");			
		}
	}
   if (astrolog === 0 && tagLightOut === 1){
		for (var i = 0; i < ppkeName.length; i++){
			IR.GetDevice(ppkeName[i]).Set("relay3off","");			
		}
	}  
} 
}

function setRelay(relaySet){  //ручное включение света
	
}

function setRelay1(relaySet1){  //ручное включение света
	
}

/* function setRelayAuto(relaySet){ //автовключение света
	if (lightState === 0){
		for (var i = 0; i < ppkeName.length; i++){
			switch (relaySet) {
				case 1: 
					IR.GetDevice(ppkeName[i]).Set("relay2on","");
					IR.GetDevice(ppkeName[i]).Set("relay3on","");
				break;
				case 0: 
					IR.GetDevice(ppkeName[i]).Set("relay2off","");
					IR.GetDevice(ppkeName[i]).Set("relay3off","");
				break;
			}
		}
	}
}
*/
function setAlarm(zoneName){	//проверка цвета зоны и активация тревоги
	var state = IR.GetVariable("Server.Channels." + zoneName);
	if (state == "green"){
		IR.SetVariable("Server.Channels." + zoneName,"red");
		if (homeAlarm == 1) {
			IR.GetDevice('HDL-BUS Pro Network (UDP)').Set("HDL-MR1610_433 (16 channels 10A relay IV) [МР 1  2 этаж] 1:Channel 14",100);
         IR.Log("VKLUCHILSYA REVUN"); 
		} 
		else {
			IR.GetDevice('HDL-BUS Pro Network (UDP)').Set("HDL-MR1610_433 (16 channels 10A relay IV) [МР 1  2 этаж] 1:Channel 14",0);
         IR.Log("VIKLUCHILSYA REVUN"); 
		}
	}
}

function send_mail(text) {
   //var cmd_process   =  new Popen ("sudo echo " + "\"" + text + "\" | mail -s \"TARGAI IRIDIUM\" nobuyanov@gmail.com", null);
   //var cmd_result    =  new Listener (' ');
}

function Listener (cmd)
{
   this.onRecieve = function(line)
   {
      IR.Log(line); 
   }
 
   this.onEnd = function(result)
   {
      //IR.Log('Command: '+ cmd + " Result: " + result);
   }   
}
 
function stop()
{
  cmd_process.Stop();
}

var sipManual = 0;

function sipCalling() {	//звонок с SIP клиента на абонентов
	var zoneNamesSip = ["zoneA","zoneB","zoneC","zoneD","zoneE","zoneF","zoneG","zoneH","zoneI","zoneJ","gateA","gateB"];
	for (var i = 0; i < zoneNamesSip.length; i++){
		var stateRedSip = IR.GetVariable("Server.Channels." + zoneNamesSip[i]);
		if (stateRedSip === "red"){
			if (sipStatus === "On Hook..." && sipManual === 0) {
				IR.GetDevice('SIP').SetFeedback("NUMBER", "002");
				IR.GetDevice('SIP').Set("CALL", 0);
            IR.Log("ZVONIM PO SIP");
            sipManual = 1;
            IR.SetTimeout(20000, sipManualChange); 
				IR.SetTimeout(30000, callCancel);
			}
		}
	}
}

function callCancel() {
	if (sipStatus === "Ringing..."){
		IR.GetDevice('SIP').Set("CANCEL", 0);
	}
} 

function sipManualChange() {
	if (sipManual === 1){
		sipManual = 0;
	}
} 

function pushingAlarm() {  //проверяем цвет и отправляем пуши в группу 1
	var zoneNames1 = ["zoneA","zoneB","zoneC","zoneD","zoneE","zoneF","zoneG","zoneH","zoneI","zoneJ","gateA","gateB"];  
	for (var i = 0; i < zoneNames1.length; i++){
		var stateRed = IR.GetVariable("Server.Channels." + zoneNames1[i]);
		if (stateRed === "red"){
			switch (zoneNames1[i]) {
				case "zoneA": 
					IR.SendPush("Тревога в Зоне А", "Data", 1);
				break;
				case "zoneB": 
					IR.SendPush("Тревога в Зоне B", "Data", 1);
				break;
				case "zoneC": 
					IR.SendPush("Тревога в Зоне C", "Data", 1);
				break;
				case "zoneD": 
					IR.SendPush("Тревога в Зоне D", "Data", 1);
				break;
				case "zoneE": 
					IR.SendPush("Тревога в Зоне E", "Data", 1);
				break;
				case "zoneF": 
					IR.SendPush("Тревога в Зоне F", "Data", 1);
				break;
				case "zoneG": 
					IR.SendPush("Тревога в Зоне G", "Data", 1);
				break;
				case "zoneH": 
					IR.SendPush("Тревога в Зоне H", "Data", 1);
				break;
				case "zoneI": 
					IR.SendPush("Тревога в Зоне I", "Data", 1);
				break;
				case "zoneJ": 
					IR.SendPush("Тревога в Зоне J", "Data", 1);
				break;
				case "gateA": 
					IR.SendPush("Тревога Ворота А", "Data", 1);
               IR.Log("PUSH A"); 
				break;
				case "gateB": 
					IR.SendPush("Тревога Ворота В", "Data", 1);
				break;
			}
		}
	}
} 

function alarmPush(zoneNameRu, zoneName){  //проверяем цвет и отправляем СМС
	var state1 = IR.GetVariable("Server.Channels." + zoneName);
	if (state1 === "red"){
		switch (zoneName) {
			case "zoneA": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 1);
            IR.SendPush("Тревога в Зоне А", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС");
			break;
			case "zoneB": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 2);
            IR.SendPush("Тревога в Зоне B", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС");
			break;
			case "zoneC": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 3);
            IR.SendPush("Тревога в Зоне C", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС");  
			break;
			case "zoneD": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 4);
            IR.SendPush("Тревога в Зоне D", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС"); 
			break;
			case "zoneE": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 5);
            IR.SendPush("Тревога в Зоне E", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС"); 
			break;
			case "zoneF": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 6);
            IR.SendPush("Тревога в Зоне F", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС");  
			break;
			case "zoneG": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 7);
            IR.SendPush("Тревога в Зоне G", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС"); 
			break;
			case "zoneH": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 8);
            IR.SendPush("Тревога в Зоне H", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС"); 
			break;
			case "zoneI": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 9);
            IR.SendPush("Тревога в Зоне I", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС"); 
			break;
			case "zoneJ": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 10);
            IR.SendPush("Тревога в Зоне J", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС"); 
			break;
			case "gateA": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 11);
            IR.SendPush("Тревога в Воротах А", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС");  
			break;
			case "gateB": 
				IR.GetDevice("HDL-BUS Pro Network (UDP)").Set("SMS:sendsms", 12);
            IR.SendPush("Тревога в Воротах В", "Data", 1);
				IR.Log(zoneName + "Отправлена СМС");  
			break;
		}
	}
}          

function getZone(name,shNumber){	//получаем сработавшую зону
	zoneProps = [name,shNumber];
	switch (zoneProps.join(',')) {
		case "ppke1,4": secZoneA[1] = 1; break;
		case "ppke1,5": secZoneA[2] = 1; break;
		case "ppke6,3": secZoneB[1] = 1; break;
		case "ppke6,4": secZoneB[2] = 1; break;
		case "ppke5,1": secZoneC[1] = 1; break;
		case "ppke5,4": secZoneC[2] = 1; break;
		case "ppke5,2": secZoneD[1] = 1; break;
		case "ppke5,5": secZoneD[2] = 1; break;
		case "ppke5,3": secZoneE[1] = 1; break;
		case "ppke5,6": secZoneE[2] = 1; break;
		case "ppke5,7": secZoneF[1] = 1; break;
		case "ppke5,8": secZoneF[2] = 1; break;
		case "ppke4,2": secZoneG[1] = 1; break;
		case "ppke4,3": secZoneG[2] = 1; break;
		case "ppke3,2": secZoneH[1] = 1; break;
		case "ppke3,3": secZoneH[2] = 1; break;
		case "ppke2,2": secZoneI[1] = 1; break;
		case "ppke2,3": secZoneI[2] = 1; break;
		case "ppke1,2": secZoneJ[1] = 1; break;
		case "ppke1,3": secZoneJ[2] = 1; break;
		case "ppke6,7": secGateA[1] = 1; break;
		case "ppke6,8": secGateA[2] = 1; break;
		case "ppke6,5": secGateB[1] = 1; break;
		case "ppke6,6": secGateB[2] = 1; break;     
	}
}   

function stateRequest(){	//опрос приборов
	for (var i = 0; i < ppkeName.length; i++){
		IR.GetDevice(ppkeName[i]).Set("state","");
	}
//	autoLight();
//	setRelay(relaySet);
//   setRelay1(relaySet1);
} 

function ppkeDataParsing(name,text){    //парсинг данных от ппке
	var TmpStr = text;
	var cmdId = TmpStr.slice(1,2);  //id команды
	var Sh1 = TmpStr.slice(23,24);  //шлейф1
	var Sh2 = TmpStr.slice(24,25);  //шлейф2
	var Sh3 = TmpStr.slice(25,26);  //шлейф3
	var Sh4 = TmpStr.slice(26,27);  //шлейф4
	var Sh5 = TmpStr.slice(27,28);  //шлейф5
	var Sh6 = TmpStr.slice(28,29);  //шлейф6
	var Sh7 = TmpStr.slice(29,30);  //шлейф7
	var Sh8 = TmpStr.slice(30,31);  //шлейф8
	var relayState = TmpStr.slice(51,52);   //состояние реле
       
	var relayStateBin = dec2bin(relayState);
	var relayStateBinRev = relayStateBin.split("").reverse();
  
	var Relay1 = relayStateBinRev[0];  //реле1
	var Relay2 = relayStateBinRev[1];  //реле2
	var Relay3 = relayStateBinRev[2];  //реле3
	var Relay4 = relayStateBinRev[3];  //реле4
    
	if (cmdId == 83){	// проверка ID пришедшего пакета
		checkAlarm (name,Sh1,Sh2,Sh3,Sh4,Sh5,Sh6,Sh7,Sh8);
		watchDogPrism (name,Sh1,Sh2,Sh3,Sh4,Sh5,Sh6,Sh7,Sh8); 
		checkRelay (name,Relay1,Relay2,Relay3,Relay4); 
	}
}    

IR.AddListener(IR.EVENT_RECEIVE_DATA, IR.GetDevice("ppke1"), function(data){      //прием пакета и отправка в парсинг
	ppkeDataParsing ("ppke1",data);
});
IR.AddListener(IR.EVENT_RECEIVE_DATA, IR.GetDevice("ppke2"), function(data){
	ppkeDataParsing ("ppke2",data);
});
IR.AddListener(IR.EVENT_RECEIVE_DATA, IR.GetDevice("ppke3"), function(data){
	ppkeDataParsing ("ppke3",data);
});  
IR.AddListener(IR.EVENT_RECEIVE_DATA, IR.GetDevice("ppke4"), function(data){
	ppkeDataParsing ("ppke4",data);
});
IR.AddListener(IR.EVENT_RECEIVE_DATA, IR.GetDevice("ppke5"), function(data){
	ppkeDataParsing ("ppke5",data);
});
IR.AddListener(IR.EVENT_RECEIVE_DATA, IR.GetDevice("ppke6"), function(data){
	ppkeDataParsing ("ppke6",data);
});  

IR.AddListener(IR.EVENT_WORK, 0, function (){       //проверка сработки зон по 2-м шлейфам
	if (secZoneA[1] == 1 && secZoneA[2] == 1){       //задаем условие сработки
		setAlarm ("zoneA");                           //влючает тревогу
		alarmPush ("Зона А","zoneA");                 //отправляем пуш
		secZoneA = [0,0];                             //обнуляем проверку сработки
	}   
	if (secZoneB[1] == 1 && secZoneB[2] == 1){
		setAlarm ("zoneB");
		alarmPush ("Зона B","zoneB");
		secZoneB = [0,0];
   }      
	if (secZoneC[1] == 1 && secZoneC[2] == 1){
		setAlarm ("zoneC");
		alarmPush ("Зона C","zoneC");
		secZoneC = [0,0];
	}
	if (secZoneD[1] == 1 && secZoneD[2] == 1){
		setAlarm ("zoneD");
		alarmPush ("Зона D","zoneD");
		secZoneD = [0,0];
	}
	if (secZoneE[1] == 1 && secZoneE[2] == 1){
		setAlarm ("zoneE");
		alarmPush ("Зона E","zoneE");
		secZoneE = [0,0];
	}
	if (secZoneF[1] == 1 && secZoneF[2] == 1){
		setAlarm ("zoneF");
		alarmPush ("Зона F","zoneF");
		secZoneF = [0,0];
	}
	if (secZoneG[1] == 1 || secZoneG[2] == 1){
		setAlarm ("zoneG");
		alarmPush ("Зона G","zoneG");
		secZoneG = [0,0];
	}
	if (secZoneH[1] == 1){
		setAlarm ("zoneH");
		alarmPush ("Зона H","zoneH");
		secZoneH = [0,0];
	}
	if (secZoneI[1] == 1 || secZoneI[2] == 1){
		setAlarm ("zoneI");
		alarmPush ("Зона I","zoneI");
		secZoneI = [0,0];
	}
	if (secZoneJ[1] == 1 || secZoneJ[2] == 1){
		setAlarm ("zoneJ");
		alarmPush ("Зона J","zoneJ");
		secZoneJ = [0,0];
	}
	if (secGateA[1] == 1 || secGateA[2] == 1){
		setAlarm ("gateA");
		alarmPush ("Ворота A","gateA");
		secGateA = [0,0];
	}
	if (secGateB[1] == 1 || secGateB[2] == 1){
		setAlarm ("gateB");
		alarmPush ("Ворота B","gateB");
		secGateB = [0,0];
	}   
});











    