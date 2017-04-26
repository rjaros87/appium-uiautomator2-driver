import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AndroidUiautomator2Driver from '../..';
import { APIDEMOS_CAPS } from './desired';


chai.should();
chai.use(chaiAsPromised);

const APIDEMOS_PACKAGE = 'io.appium.android.apis';

describe('createSession', function () {
  let driver;
  before(() => {
    driver = new AndroidUiautomator2Driver();
  });
  afterEach(async () => {
    await driver.deleteSession();
  });
  it('should start android session focusing on default pkg and act', async () => {
    await driver.createSession(APIDEMOS_CAPS);
    let {appPackage, appActivity} = await driver.adb.getFocusedPackageAndActivity();
    appPackage.should.equal(APIDEMOS_PACKAGE);
    appActivity.should.equal('.ApiDemos');
  });
  it('should start android session focusing on custom pkg and act', async () => {
    let caps = Object.assign({}, APIDEMOS_CAPS, {
      appPackage: APIDEMOS_PACKAGE,
      appActivity: '.view.SplitTouchView'
    });
    await driver.createSession(caps);
    let {appPackage, appActivity} = await driver.adb.getFocusedPackageAndActivity();
    appPackage.should.equal(caps.appPackage);
    appActivity.should.equal(caps.appActivity);
  });
  it('should error out for not apk extension', async () => {
    let caps = Object.assign({}, APIDEMOS_CAPS, {
      app: 'foo',
      appPackage: APIDEMOS_PACKAGE,
      appActivity: '.view.SplitTouchView'
    });
    await driver.createSession(caps).should.eventually.be.rejectedWith(/apk/);
  });
  it('should error out for invalid app path', async () => {
    let caps = Object.assign({}, APIDEMOS_CAPS, {
      app: 'foo.apk',
      appPackage: APIDEMOS_PACKAGE,
      appActivity: '.view.SplitTouchView'
    });
    await driver.createSession(caps).should.eventually.be.rejectedWith(/Could not find/);
  });
  it('should get device model, manufacturer and screen size in session details', async () => {
    let caps = Object.assign({}, APIDEMOS_CAPS, {
      appPackage: APIDEMOS_PACKAGE,
      appActivity: '.view.SplitTouchView'
    });
    await driver.createSession(caps);

    let serverCaps = await driver.getSession();
    serverCaps.deviceScreenSize.should.exist;
    serverCaps.deviceModel.should.exist;
    serverCaps.deviceManufacturer.should.exist;
  });
});

describe('close', function () {
  let driver;
  before(() => {
    driver = new AndroidUiautomator2Driver();
  });
  afterEach(async () => {
    await driver.deleteSession();
  });
  it('should close application', async () => {
    await driver.createSession(APIDEMOS_CAPS);
    await driver.closeApp();
    let {appPackage} = await driver.adb.getFocusedPackageAndActivity();
    if (appPackage) {
      appPackage.should.not.equal(APIDEMOS_PACKAGE);
    }
  });
});
