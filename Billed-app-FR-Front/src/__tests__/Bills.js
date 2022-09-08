/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom"
import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event';
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from '../constants/routes.js';
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";
jest.mock ('../app/store', () => mockStore)



describe('Given I am connected as an employee', () => {

  describe('When I am on Bills Page', () => {
    test('Then bill icon in vertical layout should be highlighted', async () => {
             
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');

      //'windowIcon' must contain the class "active-icon"
      expect(windowIcon.classList.contains('active-icon')).toBe(true);
    });

    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills })
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
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))

      const billsContainer = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })
      document.body.innerHTML = BillsUI({ data: bills })

      // Mock modal comportment
      $.fn.modal = jest.fn();

      // Get button eye in DOM
      const eye = screen.getAllByTestId('icon-eye')[0];

      // Mock function handleClickIconEye
      const handleClickIconEye = jest.fn((e) => billsContainer.handleClickIconEye(eye));

      // Mock click event
      eye.addEventListener('click', handleClickIconEye);
      userEvent.click(eye);

      expect(handleClickIconEye).toHaveBeenCalled();
      const modale = document.getElementById('modaleFile');
      expect(modale).toBeTruthy();
    });
  });

  describe('When I click on the New bill button', () => {
    test('Then I should be redirected to new bill form', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))

      const billsContainer = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })
      document.body.innerHTML = BillsUI({ data: bills })

      const newBillButton = screen.getByTestId('btn-new-bill');
      const handleClickNewBill = jest.fn((e) => billsContainer.handleClickNewBill(e));

      newBillButton.addEventListener('click', handleClickNewBill);
      userEvent.click(newBillButton);

      expect(handleClickNewBill).toHaveBeenCalled();
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    });
  });

  describe('When I navigate to Bills UI', () => {
    beforeEach(() => {
      //Ecoute (espionne) la fonction bills() de store/app
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from mock API GET", async () => {
      window.onNavigate(ROUTES_PATH.Bills)
      //On attend le chargement de la page
      await waitFor(() => screen.getByText("Mes notes de frais"))
      //On attend le chargement du tableau des lignes notes de frais dans tbody
      const tbody  = await screen.getAllByTestId("tbody")
      expect(tbody.length).toBeGreaterThanOrEqual(1);
    })  

    test('fetches bills from an API and fails with 404 message error', async () => {
      // Exécuter une fonction donnée en paramètre
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)

      //Attend l'exécution de la ligne ci-dessous avant d'éxécuter la suivante
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    });

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
    
  }) 

  
})
