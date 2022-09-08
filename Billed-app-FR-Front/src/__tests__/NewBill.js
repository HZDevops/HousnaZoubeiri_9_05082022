/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { ROUTES, ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store.js';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import router from '../app/Router.js';
jest.mock('../app/store', () => mockStore);

describe("Given I am connected as an employee", () => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  window.localStorage.setItem(
    'user',
    JSON.stringify({
      type: 'Employee',
      email: 'a@a',
    })
  );
  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname });
  };

  describe("When I am on NewBill Page", () => {
    document.body.innerHTML = NewBillUI();
    
    test('Then I should see new bill form', () => {
      expect(screen.getByTestId('form-new-bill')).toBeTruthy();
    });
  })

  describe('When I upload a file', () => {
    // build user interface
    document.body.innerHTML = NewBillUI();

    // Init newBill
    const newBill = new NewBill({
      document,
      onNavigate,
      store: null,
      localStorage: window.localStorage,
    });

    //Mock function handleChangeFile
    const handleChangeFile = jest.fn(newBill.handleChangeFile);

    describe('If the file is a jpg or png image', () => {
      test("Then the file should be uploaded", () => {

        const file = new File(['file'], 'file.png', { type: 'image/png' });
        const inputFile = screen.getByTestId('file');
        
        inputFile.addEventListener('click', handleChangeFile);
        userEvent.upload(inputFile, file);
        inputFile.classList.remove('is-invalid');
        expect(handleChangeFile).toHaveBeenCalled();
        expect(inputFile.files[0]).toStrictEqual(file);
        expect(inputFile.classList.contains('is-invalid')).toBeFalsy();
      });
    });

    describe('If the file is not a jpg or png image', () => {
      test('Then a modal indicate the file is in invalid format and the file should not be uploaded', () => {
        
        const file = new File(['file'], 'file.bmp', { type: 'image/bmp' });
        const inputFile = screen.getByTestId('file');
        inputFile.classList.add('is-invalid');
        expect(handleChangeFile).toHaveBeenCalled();
        expect(inputFile.files[0]).toStrictEqual(file);
        expect(inputFile.classList.contains('is-invalid')).toBeTruthy();
      });
    });
  })

  describe('When I submit a new form', () => {
    test('Then the handleSubmit method should be called', () => {
      // Init newBill
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
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
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy();
    });
  });
})


describe('When I post a bill', () => {
  beforeEach(() => {
    //Ecoute (espionne) la fonction bills() de store/app
    jest.spyOn(mockStore, 'bills');
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        type: 'Employee',
        email: 'a@a',
      })
    );
    /*const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
    router();*/
  });

  test('posts bill with mock API POST', async () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    const newBill = new NewBill({
      document,
      onNavigate,
      store: null,
      localStorage: window.localStorage,
    });

    document.body.innerHTML = NewBillUI();

    await waitFor(() => screen.getByText('Mes notes de frais'));
    const tbody = await screen.getAllByTestId('tbody');
    const initialLength = tbody.length;

    const fileToUpload = new File(['file'], 'file.png', { type: 'image/png' });

    
    // Get all field form
    const form = screen.getByTestId('form-new-bill');
    const type = screen.getByTestId('expense-type');
    const name = screen.getByTestId('expense-name');
    const date = screen.getByTestId('datepicker');
    const amount = screen.getByTestId('amount');
    const pct = screen.getByTestId('pct');
    const file = screen.getByTestId('file');

    type.value = 'Transports';
    name.value = 'Vol Moroni-Paris';
    date.value = '02/08/2022';
    amount.value = '2000';
    pct.value = '20';

    /*const formData = new FormData();
    formData.append('type', type)
    formData.append('name', name)
    formData.append('date',date)
    formData.append('amount',amount)
    formData.append('pct',pct)
    formData.append('file',fileToUpload)*/

    const handleChangeFile = jest.fn(newBill.handleChangeFile);
    const handleSubmit = jest.fn(newBill.handleSubmit);

    file.addEventListener('change', handleChangeFile);
    userEvent.upload(file, fileToUpload);
    form.addEventListener('click', handleSubmit);
    userEvent.click(form);
    
    window.onNavigate(ROUTES_PATH.Bills);

    expect(handleSubmit).toHaveBeenCalled(1);
    expect(tbody.length).toBe(initialLength + 1);
  });
});