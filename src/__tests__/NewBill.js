/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from '@testing-library/dom';

import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import { ROUTES } from '../constants/routes';
import { ROUTES_PATH } from '../constants/routes.js';
import mockStore from '../__mocks__/store.js';
import router from '../app/Router.js';
import BillsUI from '../views/BillsUI';

jest.mock('../app/Store', () => mockStore);

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then this new file should have been changed in the input', () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion

      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBills = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn((e) => newBills.handleChangeFile);
      const fileInput = screen.getByTestId('file');

      fileInput.addEventListener('change', handleChangeFile);
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['bill.png'], 'bill.png', { type: 'image/png' })],
        },
      });
      expect(handleChangeFile).toHaveBeenCalled();
      expect(fileInput.files[0].name).toBe('bill.png');
    });
    describe('When I add a file that is not an image', () => {
      test('Then the file is empty', () => {
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          'user',
          JSON.stringify({
            type: 'Employee',
          })
        );
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const html = NewBillUI();
        document.body.innerHTML = html;

        const newBills = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn((e) => newBills.handleChangeFile);
        const fileInput = screen.getByTestId('file');

        fileInput.addEventListener('change', handleChangeFile);
        fireEvent.change(fileInput, {
          target: {
            files: [
              new File(['video.mp4'], 'video.mp4', { type: 'video/mp4' }),
            ],
          },
        });

        expect(handleChangeFile).toHaveBeenCalled();
        expect(fileInput.value).toEqual('');
      });
    });
    describe('When I Submit form', () => {
      test('Then, I should be sent on Bills page', () => {
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          'user',
          JSON.stringify({
            type: 'Employee',
          })
        );
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const html = NewBillUI();
        document.body.innerHTML = html;

        const newBills = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const handleSubmit = jest.fn((e) => newBills.handleSubmit);
        const newBillForm = screen.getByTestId('form-new-bill');
        newBillForm.addEventListener('submit', handleSubmit);

        fireEvent.submit(newBillForm);

        expect(handleSubmit).toHaveBeenCalled();
        expect(screen.getAllByText('Mes notes de frais')).toBeTruthy();
      });
    });
  });
});

// Test d'intégration POST

describe('Given I am a user connected as employee', () => {
  describe('When I send a new Bill', () => {
    test('fetches bills from mock API POST', async () => {
      localStorage.setItem(
        'user',
        JSON.stringify({ type: 'Employee', email: 'a@a' })
      );
      const getSpy = jest.spyOn(mockStore, 'bills');

      const newBill = {
        id: '47qAXb6fIm2zOKkLzMro',
        vat: '80',
        fileUrl:
          'https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a',
        status: 'pending',
        type: 'Hôtel et logement',
        commentary: 'séminaire billed',
        name: 'encore',
        fileName: 'preview-facture-free-201801-pdf-1.jpg',
        date: '2004-04-04',
        amount: 400,
        commentAdmin: 'ok',
        email: 'a@a',
        pct: 20,
      };
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      const bills = mockStore.bills(newBill);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect((await bills.list()).length).toBe(4);
    });

    test('fetches bills from an API and fails with 404 message error', async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error('Erreur 404'));
          },
        };
      });
      const html = BillsUI({ error: 'Erreur 404' });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test('fetches messages from an API and fails with 500 message error', async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error('Erreur 500'));
          },
        };
      });
      const html = BillsUI({ error: 'Erreur 500' });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
