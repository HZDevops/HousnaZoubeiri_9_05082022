/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { ROUTES } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import store from '../__mocks__/store.js';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';



beforeEach(() => {
  document.body.innerHTML = NewBillUI();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  window.localStorage.setItem(
    'user',
    JSON.stringify({
      type: 'Employee',
    })
  );
});

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test('Then I should see new bill form', () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      expect(screen.getByTestId('form-new-bill')).toBeTruthy();
    });
  })

  describe('When I submit the form with an image (jpg, jpeg, png)', () => {
    test('Then it should create a new bill', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      document.body.innerHTML = NewBillUI();
        
      // Init newBill
      const newBill = new NewBill({
        document,
        onNavigate,
        store : null,
        localStorage: window.localStorage,
      });

      // Mock of handleSubmit function
      const handleSubmit = jest.fn(newBill.handleSubmit);

      // EventListener to submit the form
      const submitBtn = screen.getByTestId('form-new-bill');
      submitBtn.addEventListener('click', handleSubmit);
      userEvent.click(submitBtn);

      // handleSubmit function must be called
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

})
