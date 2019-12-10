

var sstState = 0; //состояние системы - 0:ожидание, 1:Запуск, 2:стоп, 4:ошибка контроллера
var powerError = 0; //проблема с электропитанием
var launchTrigger = 0;//переключатель между состояниями - 0:инициализация, 1:система работает, 2:система остановлена

var moduleOneChannel = 0; //Первый модуль
var moduleOneChannelCount = 14;
var moduleTwoChannel = 0; //Второй модуль
var moduleTwoChannelCount = 8;
var moduleThreeChannel = 0; // Третий модуль
var moduleThreeChannelCount = 6;

var startingStep = 0; //Счетчик шагов для полного запуска ССТ
var startingStepCount = moduleOneChannelCount + moduleTwoChannelCount + moduleThreeChannelCount;

function checkHDL(){ //проверка модуля входов
    var dry1 = IR.GetDevice("HDL Buspro Network").GetFeedback("sstDryModule:Dry contact 1");
    var dry2 = IR.GetDevice("HDL Buspro Network").GetFeedback("sstDryModule:Dry contact 2");
    var dry3 = IR.GetDevice("HDL Buspro Network").GetFeedback("sstDryModule:Dry contact 3");
    var dry4 = IR.GetDevice("HDL Buspro Network").GetFeedback("sstDryModule:Dry contact 4");
    var dry5 = IR.GetDevice("HDL Buspro Network").GetFeedback("sstDryModule:Dry contact 5");
    var dry6 = IR.GetDevice("HDL Buspro Network").GetFeedback("sstDryModule:Dry contact 6");
    var dry7 = IR.GetDevice("HDL Buspro Network").GetFeedback("sstDryModule:Dry contact 7");
    var dry8 = IR.GetDevice("HDL Buspro Network").GetFeedback("sstDryModule:Dry contact 8");
    
    if (launchTrigger === 0) {
        if (dry1 === 0 && dry2 === 1){
            sstState = 1;
        }
        else if (dry1 === 0 && dry2 === 0){
            sstState = 2;
        }
    }


    if (dry1 === 1){
            sstState = 4;
    }
    if (dry1 === 0 && dry2 === 1 && launchTrigger === 2){
            sstState = 1;
    }
    else if (dry1 === 0 && dry2 === 0 && launchTrigger === 1){
            sstState = 2;
    }
    if (dry5 === 1 || dry6 === 1 || dry7 === 1 || dry8 === 1) {
            powerError = 1;
    } else {powerError = 0}
}

function sstStart() 
{   //Старт ССТ
    if (sstState === 1 && moduleOneChannel < moduleOneChannelCount) {
        moduleOneChannel++;
        startingStep++;
        IR.GetDevice("HDL Buspro Network").Set("sstModule1:ch" + moduleOneChannel, 100);
        IR.Log("Module One Ch:" + moduleOneChannel + " started");
    }
    else if (sstState === 1 && moduleTwoChannel < moduleTwoChannelCount && moduleOneChannel === moduleOneChannelCount) {
        moduleTwoChannel++;
        startingStep++;
        IR.GetDevice("HDL Buspro Network").Set("sstModule2:ch" + moduleTwoChannel, 100);
        IR.Log("Module Two Ch:" + moduleTwoChannel + " started");
    }
    else if (sstState === 1 && moduleThreeChannel < moduleThreeChannelCount && moduleTwoChannel === moduleTwoChannelCount) {
        moduleThreeChannel++;
        startingStep++;
        IR.GetDevice("HDL Buspro Network").Set("sstModule3:ch" + moduleThreeChannel, 100);
        IR.Log("Module Three Ch:" + moduleThreeChannel + " started");
    }
    if (sstState === 1 && startingStep === startingStepCount) {
        startingStep = 0;
        sstState = 0;
        launchTrigger = 1;
        moduleOneChannel = 0;
        moduleTwoChannel = 0;
        moduleThreeChannel = 0;
        IR.Log("SST fully started");
    }

    //Стоп ССТ
    if (sstState === 2 && moduleOneChannel < moduleOneChannelCount) {
        moduleOneChannel++;
        startingStep++;
        IR.GetDevice("HDL Buspro Network").Set("sstModule1:ch" + moduleOneChannel, 0);
        IR.Log("Module One Ch:" + moduleOneChannel + " stoped");
    }
    else if (sstState === 2 && moduleTwoChannel < moduleTwoChannelCount && moduleOneChannel === moduleOneChannelCount) {
        moduleTwoChannel++;
        startingStep++;
        IR.GetDevice("HDL Buspro Network").Set("sstModule2:ch" + moduleTwoChannel, 0);
        IR.Log("Module Two Ch:" + moduleTwoChannel + " stoped");
    }
    else if (sstState === 2 && moduleThreeChannel < moduleThreeChannelCount && moduleTwoChannel === moduleTwoChannelCount) {
        moduleThreeChannel++;
        startingStep++;
        IR.GetDevice("HDL Buspro Network").Set("sstModule3:ch" + moduleThreeChannel, 0);
        IR.Log("Module Three Ch:" + moduleThreeChannel + " stoped");
    }
    if (sstState === 2 && startingStep === startingStepCount) {
        startingStep = 0;
        sstState = 0;
        launchTrigger = 2;
        moduleOneChannel = 0;
        moduleTwoChannel = 0;
        moduleThreeChannel = 0;
        IR.Log("SST fully stoped");
    }

    //ССТ авария питания
    if (powerError === 1) {
        IR.Log("SST Power error");
    }

    //ССТ авария питания
    if (sstState === 4) {
        IR.Log("SST Controller error");
    }
}

IR.SetInterval (5000, checkHDL); //Проверка входов МВх
IR.SetInterval (15 * 1000, sstStart); //Таймер запуска и остановки ССТ


