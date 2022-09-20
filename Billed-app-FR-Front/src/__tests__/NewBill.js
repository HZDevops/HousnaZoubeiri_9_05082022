/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { ROUTES } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store.js';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';

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
    test('Then I should see new bill form', () => {
      document.body.innerHTML = NewBillUI();
      expect(screen.getByTestId('form-new-bill')).toBeTruthy();
    });
  })

  describe('When I upload a jpg file', () => {
    test("Then the file should be uploaded", () => {
      jest.spyOn(mockStore, 'bills');
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
        type: 'Employee',
        email: 'a@a',
        })
      );

      // build user interface
      document.body.innerHTML = NewBillUI();

      // Init newBill
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      //Mock function handleChangeFile
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));

      const file = new File(['file'], 'file.png', { type: 'image/png' });
      const inputFile = screen.getByTestId('file');

      inputFile.addEventListener('change', handleChangeFile);
      userEvent.upload(inputFile, file);

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0]).toStrictEqual(file);
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

//Integration POST test
describe('When I post a bill', () => {
   jest.spyOn(mockStore, 'bills');
   Object.defineProperty(window, 'localStorage', { value: localStorageMock });
   window.localStorage.setItem(
     'user',
     JSON.stringify({
       type: 'Employee',
       email: 'a@a',
     })
   );
   
  test('posts bill with mock API POST', async () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    document.body.innerHTML = NewBillUI();

    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });

    // Get all field form
    const form = screen.getByTestId('form-new-bill');
    const type = screen.getByTestId('expense-type');
    const name = screen.getByTestId('expense-name');
    const date = screen.getByTestId('datepicker');
    const amount = screen.getByTestId('amount');
    const vat = screen.getAllByTestId('vat');
    const comment = screen.getAllByTestId('commentary');
    const pct = screen.getByTestId('pct');
    const file = screen.getByTestId('file');

    // Set form input values
    fireEvent.change(type, { target: { value: 'Transports' } });
    fireEvent.change(name, { target: { value: 'Vol Moroni-Paris' } });
    fireEvent.change(date, { target: { value: '02/08/2022' } });
    fireEvent.change(amount, { target: { value: '2000' } });
    vat.value = '70';
    comment.value = 'quelque chose';
    fireEvent.change(pct, { target: { value: 20 } });

    const fileToUpload = new File(['file'], 'file.png', { type: 'image/png' });

    const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

    file.addEventListener('change', handleChangeFile);
    userEvent.upload(file, fileToUpload);
    form.addEventListener('click', handleSubmit);
    userEvent.click(form);

    expect(handleChangeFile).toHaveBeenCalled();
  });
});