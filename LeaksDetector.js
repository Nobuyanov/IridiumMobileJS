// Unit: LeaksDetector

function checkDryContacts(){
    var dry1 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 01");
    var dry2 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 02");
    var dry3 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 03");
    var dry4 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 04");
    var dry5 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 05");
    var dry6 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 06");
    var dry7 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 07");
    var dry8 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 08");
    var dry9 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 09");
    var dry10 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 10");
    var dry11 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 11");
    var dry12 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 12");
    var dry13 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 13");
    var dry14 = IR.GetDevice("HDL Buspro Network").GetFeedback("leakDryModule:Input 14");


}

IR.AddListener(IR.EVENT_START, 0, function () {
    
});

IR.AddListener(IR.EVENT_EXIT, 0, function () {
    
});
