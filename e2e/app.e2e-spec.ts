import { Econ2Page } from './app.po';

describe('econ2 App', () => {
  let page: Econ2Page;

  beforeEach(() => {
    page = new Econ2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
