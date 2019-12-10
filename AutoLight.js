// Unit: AutoLight

var lightState; //Состояние освещения 0 и 1
var globalCloudyData; //Сюда пишем данные о состоянии атмосферы
var cloudyCorrectionFlag; //Флаг включеной коррекции по погоде
var autoFlag; //Флаг автоматического режима
var nowDayNightAstro; //Время суток - День: 1, Ночь: 0 для астротаймера
var nowDayNightManual; //Время суток - День: 1, Ночь: 0 для ручной установки
var astroMode; //Работа по астротаймеру
var manualMode; //Работа по ручной установке времени

var devicesFeedback = [
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-103:Channel 1"), //Розетки для гирлянд
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-103:Channel 2"), //Дорожка до церкви (столбики)
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-103:Channel 3"), //Свет (столбики 4шт перед центральным входом)
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-103:Channel 4"), //Сад камней
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-103:Channel 5"), //Свет подсветка столбиков на террасе (шары) гр.41
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-103:Channel 6"), //Свет подсветка столбиков на террасе (встроенные) гр.42
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-103:Channel 7"), //Свет подвесы на террасе гр.91
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-103:Channel 8"), //Свет снежинка на фасаде гр.92
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-104:Channel 1"), //Свет настенный на фасаде гр.40
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-104:Channel 2"), //Свет уличный встроенный на лестнице гр.104
    IR.GetDevice("HDL Buspro Network").GetFeedback("2-104:Channel 3"), //Свет настенный на фасаде гр.86
    IR.GetDevice("HDL Buspro Network").GetFeedback("3-61:Channel 2"), // верх-фронт
    IR.GetDevice("HDL Buspro Network").GetFeedback("3-61:Channel 3"), //верх тыл
    IR.GetDevice("HDL Buspro Network").GetFeedback("3-61:Channel 4"), //низ фронт
];

function checkLightState() { //проверяем все каналы модулей реле управляющих фасадами и ландшафтом
    if (devicesFeedback[i] === 1){
        IR.Log("СВЕТ ВКЛЮЧЕН"); 
        return true;
    }else {
        IR.Log("СВЕТ ВЫКЛЮЧЕН"); 
        return false
    }

}

function timeToNumber12h(strTime){ //Переводим 12 часовой формат времени в минуты от начала суток
    if (strTime.length === 7){strTime = 0 + strTime}
    hours = parseInt(strTime.slice(0,2), 10);
    minutes = parseInt(strTime.slice(3,5), 10);
    amPm = strTime.slice(6);

    if (amPm === "am"){
        if (hours === 12){
                return minutes;
        }
        return hours * 60 + minutes;
    } else {
        if (hours === 12){
            return hours * 60 + minutes;
        }
        return (hours + 12) * 60 + minutes;
    }
}

function timeToNumber24h(strTime){ //Переводим 24 часовой формат времени в минуты от начала суток
    time = strTime.split(":");
    return parseInt(time[0], 10) * 60 + parseInt(time[1], 10);
}

function cloudyCorrection(){ //Проверка текущей погоды, возвращает true - облачно, false - ясно
    var clearData = [25, 29, 30, 31, 32, 33, 34, 36]; //Коды ствтусов с yahoo

    function checkCloud(clearData,serverData){
        for (var i=0; i<clearData.length; i++){
            if (clearData[i] === serverData){
                return true;
            }
        }
        return false;
    }
      
    if (checkCloud(clearData,globalCloudyData)){
        return false;
    } else {return true;}
}

function checkDayNight (minutesNow,minutesSunrise,minutesSunset,sunriseTimeCorrection,sunsetTimeCorrection){ //Определяем время суток - День: 1, Ночь: 0
    if (minutesNow >= minutesSunrise + sunriseTimeCorrection && minutesNow < minutesSunset + sunsetTimeCorrection){
        return 1
    } else { return 0}
}

function getDataFromServer(){
    var nowTime = IR.GetVariable("System.Time.12_AM_PM").toLowerCase(); //текущее время
    var nowTime24 = IR.GetVariable("System.Time.24").toLowerCase(); //текущее время
    var sunriseTime = IR.GetVariable("Server.Tags.sunrise"); //Время рассвета текущего дня
    var sunsetTime = IR.GetVariable("Server.Tags.sunset"); //Время заката текущего дня
    var manualSunriseTime = IR.GetVariable("Server.Tags.manualSunriseTime"); //Время рассвета текущего дня для ручного режиам
    var manualSunsetTime = IR.GetVariable("Server.Tags.manualSunsetTime"); //Время заката текущего дня для ручного режима
    var sunriseTimeCorrection = IR.GetVariable("Server.Tags.sunriseTimeCorrection"); //Корректировка времени рассвета в минутах
    var sunsetTimeCorrection = IR.GetVariable("Server.Tags.sunsetTimeCorrection"); //Корректировка времени заката в минутах
    globalCloudyData = IR.GetVariable("Server.Tags.currentState"); //Данные о погоде для корректировки времени
    cloudyCorrctionFlag = IR.GetVariable("Server.Tags.cloudyCorrctionFlag"); //Флаг корректировки по погоде
    autoFlag = IR.GetVariable("Server.Tags.autoFlag"); //Флаг авторежима
    nowDayNightAstro = checkDayNight(timeToNumber12h(nowTime),timeToNumber12h(sunriseTime),timeToNumber12h(sunsetTime),sunriseTimeCorrection,sunsetTimeCorrection);
    //nowDayNightManual = checkDayNight(timeToNumber24h(nowTime24),timeToNumber24h(manualSunriseTime),timeToNumber24h(manualSunsetTime),sunriseTimeCorrection,sunsetTimeCorrection);
    
    cloudyCorrection();

   //IR.Log("ВРЕМЯ СЕЙЧАС: " + timeToNumber24h(nowTime24) + "  ВРЕМЯ РАССВЕТА: " + sunriseTime + "  ВРЕМЯ ЗАКАТА: " + sunsetTime + "СЕЙЧАС: " + nowDayNightAstro);
}

IR.SetInterval (1000, getDataFromServer);




IR.AddListener(IR.EVENT_START, 0, function () {
    lightState = checkLightState();        
});


IR.AddListener(IR.EVENT_EXIT, 0, function () {
    
});
