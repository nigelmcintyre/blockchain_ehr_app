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
patient_address.sendKeys(['0xC02fb2BeE5A22b46712524fCAEF6e2c99815f201']);
WDS.log.info('entered patient address');

var patient_name = WDS.browser.findElement(pkg.By.id('patientName'));
patient_name.click();
patient_name.sendKeys(['Name']);
WDS.log.info('entered patient name');

var patient_email = WDS.browser.findElement(pkg.By.id('patientEmail'));
patient_email.click();
patient_email.sendKeys(['name@email']);
WDS.log.info('entered patient email');

var patient_password = WDS.browser.findElement(pkg.By.id('password'));
patient_password.click();
patient_password.sendKeys(['password']);
WDS.log.info('entered patient password');

var doctor_address = WDS.browser.findElement(pkg.By.id('doctorAddress'));
doctor_address.click();
doctor_address.sendKeys(['0x520E6Bb1238482C54F3eBdD9957d6fa8DdBE4e25']);
WDS.log.info('entered doctor address');

var doctor_key = WDS.browser.findElement(pkg.By.id('doctorKey'));
doctor_key.click();
doctor_key.sendKeys([
    '38134c48d5fcaf5f71777a054013d4d3579f78f6f2d3f48b7fbb539317ecada0',
]);
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
