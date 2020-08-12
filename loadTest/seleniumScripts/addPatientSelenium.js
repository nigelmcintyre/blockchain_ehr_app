var pkg = JavaImporter(org.openqa.selenium);
var ui = JavaImporter(org.openqa.selenium.support.ui);
var wait = new ui.WebDriverWait(WDS.browser, 30);

WDS.sampleResult.sampleStart();
WDS.sampleResult.getLatency();
WDS.log.info('Sample started');

WDS.browser.get('http://localhost:3000/addPatient');
WDS.log.info('navigated to add patient page');

var patient_address = WDS.browser.findElement(pkg.By.id('patientAddress'));
patient_address.click();
patient_address.sendKeys([WDS.args[0]]);
WDS.log.info('entered patient address');

var patient_age = WDS.browser.findElement(pkg.By.id('age'));
patient_age.click();
patient_age.sendKeys([WDS.args[1]]);
WDS.log.info('entered patient age');

var patient_gender = WDS.browser.findElement(pkg.By.id('gender'));
patient_gender.click();
patient_gender.sendKeys([WDS.args[2]]);
WDS.log.info('entered patient gender');

var patient_totalBiliruben = WDS.browser.findElement(
    pkg.By.id('totalBilirubin'),
);
patient_totalBiliruben.click();
patient_totalBiliruben.sendKeys([WDS.args[3]]);
WDS.log.info('entered patient totalBilirubin');

var patient_directBilirubin = WDS.browser.findElement(
    pkg.By.id('directBilirubin'),
);
patient_directBilirubin.click();
patient_directBilirubin.sendKeys([WDS.args[4]]);
WDS.log.info('entered patient directBilirubin');

var patient_alkalinePhosphotase = WDS.browser.findElement(
    pkg.By.id('alkalinePhosphotase')
);
patient_alkalinePhosphotase.click();
patient_alkalinePhosphotase.sendKeys([WDS.args[5]]);
WDS.log.info('entered patient alkalinePhosphotase');

var patient_alamineAminotransferase = WDS.browser.findElement(
    pkg.By.id('alamineAminotransferase')
);
patient_alamineAminotransferase.click();
patient_alamineAminotransferase.sendKeys([WDS.args[6]]);
WDS.log.info('entered patient alamineAminotransferase');

var patient_totalProteins = WDS.browser.findElement(pkg.By.id('totalProteins'));
patient_totalProteins.click();
patient_totalProteins.sendKeys([WDS.args[7]]);
WDS.log.info('entered patient totalProteins');

var patient_albumin = WDS.browser.findElement(pkg.By.id('albumin'));
patient_albumin.click();
patient_albumin.sendKeys([WDS.args[8]]);
WDS.log.info('entered patient albumin');

var patient_albuminGlobulinRatio = WDS.browser.findElement(
    pkg.By.id('albuminGlobulinRatio')
);
patient_albuminGlobulinRatio.click();
patient_albuminGlobulinRatio.sendKeys([WDS.args[9]]);
WDS.log.info('entered patient albuminGlobulinRatio');

var doctor_address = WDS.browser.findElement(pkg.By.id('doctorAddress'));
doctor_address.click();
doctor_address.sendKeys([WDS.args[10]]);
WDS.log.info('entered doctor address');

var doctor_key = WDS.browser.findElement(pkg.By.id('doctorKey'));
doctor_key.click();
doctor_key.sendKeys([WDS.args[11]]);
WDS.log.info('entered doctor key');

WDS.browser.findElement(pkg.By.cssSelector('button.btn.btn-primary')).click();

new org.openqa.selenium.support.ui.WebDriverWait(WDS.browser, 30000).until(
    org.openqa.selenium.support.ui.ExpectedConditions.alertIsPresent(),
);

WDS.browser
    .switchTo()
    .alert()
    .accept();

WDS.sampleResult.sampleEnd();

${patientAddress} ${age} ${gender ${totalBilirubin} ${directBilirubin} ${alkalinePhosphotase} ${alamineAminotransferase} ${totalProteins} ${albumin} ${albuminGlobulinRatio} ${doctorAddress} ${doctorKey}