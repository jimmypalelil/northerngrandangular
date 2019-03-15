import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display home page', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Northern Grand Housekeeping Services');
  });

  it('should display menu', () => {
    page.clickMenuButton();
    setTimeout(() => {
      page.getInventoryPage();
      expect(element(by.css('app-inventory')).getText).toEqual('Inventor');
    }, 3000);

  });
});
