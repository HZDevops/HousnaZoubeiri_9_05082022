/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { ROUTES, ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store.js';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import router from '../app/Router.js';

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
    /*test('Then the file should be added to the form', async (done) => {
      const snapshot = {
        ref: {
          getDownloadURL: () => 'https://url.test',
        },
      };

      class Storage {
        ref() {
          return this;
        }
        async put() {
          return snapshot;
        }
      }

      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store: { storage: new Storage() },
        localStorage: window.localStorage,
      });

      const file = new File(['file'], 'file.png', { type: 'image/png' });

      const handleChangeFile = jest.fn(async (e) => {
        await newBillContainer.handleChangeFile(e);

        expect(newBillContainer.fileUrl).toBe(snapshot.ref.getDownloadURL());
        expect(newBillContainer.fileName).toBe(file.name);
        done();
      });

      const fileInput = screen.getByTestId('file');
      fileInput.addEventListener('change', handleChangeFile);

      userEvent.upload(fileInput, file);

      expect(handleChangeFile).toHaveBeenCalled();
      expect(fileInput.files[0].name).toBe(file.name);
    });
  });*/
    
    test('Then the file input should get the file name', () => {
        // build user interface
        const html = NewBillUI();
        document.body.innerHTML = html;

        // Init newBill
        const newBill = new NewBill({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });

        const file = new File(['file'], 'file.png', { type: 'image/png' });

        // Mock function handleChangeFile
        const handleChangeFile = jest.fn(newBill.handleChangeFile);

        // Add Event
        const inputFile = screen.getByTestId('file');
        inputFile.addEventListener('click', handleChangeFile);
        userEvent.upload(inputFile, file);
        // Launch event
        /*userEvent.click(inputFile, {
          target: {
            files: [
              new File(['image.png'], 'image.png', {
                type: 'image/png',
              }),
            ],
          },
        });*/
       
        
        // handleChangeFile function must be called
        expect(handleChangeFile).toBeCalled();
        // The name of the file should be 'image.png'
        expect(inputFile.files[0].name).toBe('file.png');
        expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();
      });
    })
  describe('When I submit a new form', () => {
      test('Then I should be redirected to Bills page', () => {
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

    describe('When I create a New Bill', () => {
    
      //Ecoute (espionne) la fonction bills() de store/app
      jest.spyOn(mockStore, 'bills')
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
    
    test("fetches bill to mock API POST", async () => {
      // Init newBill
       const newBill = {
         id: 'eoKIpYhECmaZAGRrHjaC',
         status: 'refused',
         pct: 10,
         amount: 500,
         email: 'john@doe.com',
         name: 'Facture 236',
         vat: '60',
         fileName: 'preview-facture-free-201903-pdf-1.jpg',
         date: '2021-03-13',
         commentAdmin: 'à valider',
         commentary: 'A déduire',
         type: 'Restaurants et bars',
         fileUrl: 'https://localhost:3456/images/test.jpg',
       };
       const formData = new FormData();
       formData.append ('fileUrl', newBill.fileUrl)
        //const file = new File(['file'], 'file.png', { type: 'image/png' });

        // Mock function handleChangeFile
        //const handleChangeFile = jest.fn(newBill.handleChangeFile);

        // Add Event
        /*const inputFile = screen.getByTestId('file');
        inputFile.addEventListener('click', handleChangeFile);
        userEvent.upload(inputFile, file);*/
      
        
      
        const bill = mockStore.bills.mockImplementationOnce(() => {});
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        expect (bill.fileUrl).toBe(newBill.fileUrl)
    })  

    
    
  }) 
})
