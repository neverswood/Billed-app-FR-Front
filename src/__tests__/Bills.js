/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockedBills from "../__mocks__/store.js";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true)

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    
  })
  describe("When I am on Bills page and I click on the eye icon", () => {
    test("Then show the proof", () => {
      // Create ...
      const html = BillsUI({
        data: bills
      });

      // HTML injection
      document.body.innerHTML = html;

      // Init firestore
      const firestore = null;
      // Init Bills
      const allBills = new Bills({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });

      // Mock modal comportment
      $.fn.modal = jest.fn();

      // Get button eye in DOM
      const eye = screen.getAllByTestId('icon-eye')[0];

      // Mock function handleClickIconEye
      const handleClickIconEye = jest.fn(() =>
        allBills.handleClickIconEye(eye)
      );

      // Add Event and fire
      eye.addEventListener('click', handleClickIconEye);
      fireEvent.click(eye);

      // handleClickIconEye function must be called
      expect(handleClickIconEye).toHaveBeenCalled();
      const modale = document.getElementById('modaleFile');
      // The modal must be present
      expect(modale).toBeTruthy();
    })
  } )

  describe("When I am on Bills page and I click on the new bill button", () => {
    test("click sur le bouton new bill", () => {
      const html = BillsUI({
        data: []
      });
      document.body.innerHTML = html;

      // Init firestore
      const firestore = null;

      // Init Bills
      const allBills = new Bills({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });

      // Mock handleClickNewBill
      const handleClickNewBill = jest.fn(allBills.handleClickNewBill);
      // Get button eye in DOM
      const billBtn = screen.getByTestId('btn-new-bill');
      console.log("btn", billBtn)

      // Add event and fire
      billBtn.addEventListener('click', handleClickNewBill);
      fireEvent.click(billBtn);

      // screen should show Envoyer une note de frais
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    })
    })

     /* describe("When I navigate to Bills UI", () => {
        test("fetches bills from mock API GET", async () => {
          const getSpy = jest.spyOn(mockedBills, "get");
    
          // Get bills and the new bill
          const bills = await mockedBills.get();
    
          // getSpy must have been called once
          expect(getSpy).toHaveBeenCalledTimes(1);
          // The number of bills must be 4
          expect(bills.data.length).toBe(4);
        });
    
        test("fetches bills from an API and fails with 404 message error", async () => {
          mockedBills.get.mockImplementationOnce(() =>
            Promise.reject(new Error("Erreur 404"))
          );
    
          // user interface creation with error code
          const html = BillsUI({
            error: "Erreur 404"
          });
          document.body.innerHTML = html;
    
          const message = await screen.getByText(/Erreur 404/);
          // wait for the error message 400
          expect(message).toBeTruthy();
        });
    
        test("fetches messages from an API and fails with 500 message error", async () => {
          mockedBills.get.mockImplementationOnce(() =>
            Promise.reject(new Error("Erreur 500"))
          );
    
          // user interface creation with error code
          const html = BillsUI({
            error: "Erreur 500"
          });
          document.body.innerHTML = html;
    
          const message = await screen.getByText(/Erreur 500/);
          // wait for the error message 400
          expect(message).toBeTruthy();
        });
      });*/
      // test d'intégration GET
/*  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get") // recupération de létat du get (applé ou non)
       const bills = await firebase.get() //attente de la réponse de firebase
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4) //recupération de 4 bills attendu
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() => // mise en place du mock
        Promise.reject(new Error("Erreur 404"))
      )
      const html =  BillsUI({ error: "Erreur 404" }) // construction de la page avec une erreur
      document.body.innerHTML = html // creation de la page
      const message = await screen.getByText(/Erreur 404/) // attente du message d'erreur
      expect(message).toBeTruthy() //recupération du message d'erreur
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() => // mise en place du mock
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" }) // construction de la page avec une erreur
      document.body.innerHTML = html // creation de la page
      const message = await screen.getByText(/Erreur 500/)// attente du message d'erreur
      expect(message).toBeTruthy()//recupération du message d'erreur
    })
  })*/

 /* describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })*/

})
