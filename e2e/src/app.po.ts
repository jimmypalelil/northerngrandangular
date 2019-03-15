import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-home h1')).getText();
  }

  getHomePage() {
    return element(by.css('app-home')).cli;
  }

  getInventoryPage() {
    return element(by.css('[href="#page-inventory"]')).click();
  }

  getLostPage() {
    return element(by.css('app-lost'));
  }

  clickMenuButton() {
    element(by.css('.menu-button')).click();
  }
}
