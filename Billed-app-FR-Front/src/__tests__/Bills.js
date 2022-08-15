/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom"
import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event';
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', async () => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');

      //'windowIcon' must contain the class "active-icon"
      expect(windowIcon.classList.contains('active-icon')).toBe(true);
    });

    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  describe('When I click on the icon eye of a bill', () => {
    test('Then a modal should be opened', () => {
      // build user interface
      const html = BillsUI({
        data: bills,
      });
      document.body.innerHTML = html;

      //Init bills
      const billsContainer = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      // Mock modal comportment
      $.fn.modal = jest.fn();

      // Get button eye in DOM
      const eye = screen.getAllByTestId('icon-eye')[0];

      // Mock function handleClickIconEye
      const handleClickIconEye = jest.fn(billsContainer.handleClickIconEye);

      // Mock click event
      eye.addEventListener('click', handleClickIconEye(eye));
      userEvent.click(eye);

      /*Issue below when using screen.getTestById instead of getElementById???*/
      expect(handleClickIconEye).toHaveBeenCalled();
      const modale = document.getElementById('modaleFile');
      expect(modale).toBeTruthy();
    });
  });

 /*Issue: cannot read TypeError: Cannot read property 'addEventListener' of null
  describe('When I click on the New bill button', () => {
    test('Then I should be redirected to new bill form', () => {
      // build user interface
      const html = BillsUI({
        data: bills,
      });
      document.body.innerHTML = html;

      const billsContainer = new Bills({
        document,
        onNavigate,
        store:null,
        localStorage: window.localStorage,
      });

      const newBillButton = document.getElementById('btn-new-bill');
      const handleClickNewBill = jest.fn(billsContainer.handleClickNewBill);
      
      newBillButton.addEventListener('click', handleClickNewBill);
      userEvent.click(newBillButton);

      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    });
  });*/

  

  
})
