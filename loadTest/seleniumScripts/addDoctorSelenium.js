var pkg = JavaImporter(org.openqa.selenium);
var ui = JavaImporter(org.openqa.selenium.support.ui); //WebDrive
var wait = new ui.WebDriverWait(WDS.browser, 30);
var doctorAddress = WDS.args[0];

WDS.sampleResult.sampleStart();
WDS.sampleResult.getLatency();
WDS.log.info('Sample started');

WDS.browser.get('http://localhost:3000/addDoctor');
WDS.log.info('navigated to add doctor page');

var doctor_address = WDS.browser.findElement(pkg.By.id('doctorAddress'));
doctor_address.click();
doctor_address.sendKeys([WDS.args[0]]);
WDS.log.info('entered doctor address');

var doctor_name = WDS.browser.findElement(pkg.By.id('doctorName'));
doctor_name.click();
doctor_name.sendKeys([WDS.args[1]]);
WDS.log.info('entered doctor name');

var doctor_email = WDS.browser.findElement(pkg.By.id('doctorEmail'));
doctor_email.click();
doctor_email.sendKeys([WDS.args[2]]);
WDS.log.info('entered doctor email');

WDS.browser.findElement(pkg.By.cssSelector('button.btn.btn-primary')).click();

// WDS.browser.wait.until(ui.ExpectedConditions.alertIsPresent());
new org.openqa.selenium.support.ui.WebDriverWait(WDS.browser, 30000).until(
    org.openqa.selenium.support.ui.ExpectedConditions.alertIsPresent(),
);

WDS.browser
    .switchTo()
    .alert()
    .accept();

// var alertText = alert.getText()

// WDS.browser.switchTo().alert();
// alert.accept();

WDS.sampleResult.sampleEnd();
