import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import * as pdf2html from 'pdf2html';
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import * as xml2js from 'xml2js';
import { xml2json, Options } from 'xml-js';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Proyect1';

   xmltojson() {
    console.log('Hola Mundo');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/xml';
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const xml = reader.result as string;
        const options: Options.XML2JSON = {
          compact: true,
          spaces: 2
        };
        const json = xml2json(xml, options);
        console.log('JSON resultante:', json);
      };
      reader.readAsText(file);
    });
    fileInput.click();
  }
  

  


  pdfToHtml() {
    const JSON: any = {};

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file); // Leer el archivo como un búfer binario
      reader.onload = async () => {
        const pdfData = reader.result; // Obtener los datos binarios del archivo
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        // Recorrer las páginas del PDF y extraer información
        const page = await pdf.getPage(1);
        const content: any = (await page.getTextContent()).items;

        // console.log(content[239].str);
        // console.log(content[268].str);
        // console.log(content[292].str);

        const nit =
          content[239].str +
          content[241].str +
          content[243].str +
          content[245].str +
          content[247].str +
          content[249].str +
          content[251].str +
          content[253].str +
          content[255].str +
          content[257].str;

        const name = content[268].str;

        // console.log(content);
        let startAddress;
        let endAddress;
        const startAddresses = ['KM', 'CR', 'CL', 'AV'];

        for (let i = 200; i < 300; i++) {
          if (startAddresses.includes(content[i].str.split(' ')[0])) {
            startAddress = i;
          }

          if (content[i].str.indexOf('@') > -1) {
            // console.log('El final de la dirección es ' + (i - 1));
            endAddress = i - 1;
            break;
          }
        }

        let address = '';
        console.log(startAddress, ' ', endAddress);

        for (let k = startAddress; k <= endAddress; k++) {
          // address += content[k].str;
          address = address + content[k].str;
        }

        console.log(address);

        // const address =
        //   content[292].str +
        //   content[294].str +
        //   content[296].str +
        //   content[298].str;

        JSON.nit = nit;
        JSON.name = name;
        JSON.address = address;

        console.log(JSON);

        // Aquí podrías generar HTML adicional a partir de la información extraída
      };
    });

    fileInput.click();
  }

  xmlajson() {
    console.log('Hola Mundo');
    const items = [];
    const parse = new DOMParser();
    const JSON: any = {};
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/xml';
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const xmlContent = reader.result as string;
        const xmlDoc = new DOMParser().parseFromString(
          xmlContent,
          'application/xml'
        );



        // JSON.parentDocumentID =
        //   xmlDoc.querySelector('ParentDocumentID').textContent;
        // JSON.ublExtensions = xmlDoc.querySelector('UBLExtensions').textContent;
        // JSON.customizationID =
        //   xmlDoc.querySelector('CustomizationID').textContent;
        // JSON.profileID = xmlDoc.querySelector('ProfileID').textContent;
        // JSON.profileExecutionID =
        //   xmlDoc.querySelector('ProfileExecutionID').textContent;
        // JSON.id = xmlDoc.querySelector('ID').textContent;
        // JSON.issueDate = xmlDoc.querySelector('IssueDate').textContent;
        // JSON.issueTime = xmlDoc.querySelector('IssueTime').textContent;
        // JSON.documentType = xmlDoc.querySelector('DocumentType').textContent;
        // JSON.parentDocumentID =
        //   xmlDoc.querySelector('ParentDocumentID').textContent;



        // JSON.senderParty = {
        //   partyTaxScheme: xmlDoc.querySelector('PartyTaxScheme').textContent,
        // };
        // JSON.senderParty.registrationName =
        //   xmlDoc.querySelector('RegistrationName').textContent;
        // JSON.senderParty.companyID =
        //   xmlDoc.querySelector('CompanyID').textContent;
        // JSON.senderParty.taxLevelCode =
        //   xmlDoc.querySelector('TaxLevelCode').textContent;
        // JSON.senderParty.id = xmlDoc.querySelector(
        //   'SenderParty PartyTaxScheme TaxScheme ID'
        // ).textContent;
        // JSON.senderParty.name = xmlDoc.querySelector(
        //   'SenderParty PartyTaxScheme TaxScheme Name'
        // ).textContent;



        JSON.senderParty = {
          partyTaxScheme: {
            registrationName: xmlDoc.querySelector('SenderParty PartyTaxScheme RegistrationName').textContent,
            companyID: xmlDoc.querySelector('SenderParty PartyTaxScheme CompanyID').textContent,
            taxLevelCode: xmlDoc.querySelector('SenderParty PartyTaxScheme TaxLevelCode').textContent,

            taxScheme: {
              id: xmlDoc.querySelector('SenderParty PartyTaxScheme TaxScheme ID').textContent,
              name: xmlDoc.querySelector('SenderParty PartyTaxScheme TaxScheme Name').textContent,

            }
          }
        }



        const xmlDoc2 = parse.parseFromString(
          xmlDoc
            .querySelector('ExternalReference Description')
            .textContent.trim(),
          'text/xml'
        );

        JSON.qrCode =
          xmlDoc2.querySelector('DianExtensions QRCode').textContent;

        JSON.description = {
          paymentDueDate: xmlDoc2.querySelector('PaymentMeans PaymentDueDate').textContent,
          companyID: xmlDoc2.querySelector('CompanyID').textContent,
          taxTotal: xmlDoc2.querySelector('TaxTotal TaxAmount').textContent,
          withholdingTaxTotal: xmlDoc2.querySelector('WithholdingTaxTotal TaxAmount').textContent,


          legalMonetaryTotal: {
            lineExtensionAmount: xmlDoc2.querySelector('LineExtensionAmount').textContent,
            taxExclusiveAmount: xmlDoc2.querySelector('TaxExclusiveAmount').textContent,
            taxInclusiveAmount: xmlDoc2.querySelector('TaxInclusiveAmount').textContent,
            allowanceTotalAmount: xmlDoc2.querySelector('AllowanceTotalAmount').textContent,
            chargeTotalAmount: xmlDoc2.querySelector('ChargeTotalAmount').textContent,
            prepaidAmount: xmlDoc2.querySelector('PrepaidAmount').textContent,
            payableAmount: xmlDoc2.querySelector('PayableAmount').textContent,
          },

          accountingCustomerParty: {
            additionalAccountID: xmlDoc2.querySelector('AdditionalAccountID').textContent,
            name: xmlDoc2.querySelector('AccountingCustomerParty PartyName Name').textContent,
            id: xmlDoc2.querySelector('Address ID').textContent,
            cityName: xmlDoc2.querySelector('Address CityName').textContent,
            postalZone: xmlDoc2.querySelector('Address PostalZone').textContent,
            country: xmlDoc2.querySelector('Address Country').textContent,
            countrySubentity: xmlDoc2.querySelector('Address CountrySubentity').textContent,
            countrySubentityCode: xmlDoc2.querySelector('Address CountrySubentityCode').textContent,
            identificationCode: xmlDoc2.querySelector('Address Country IdentificationCode ').textContent,
            countryName: xmlDoc2.querySelector('Address Country Name').textContent,
            registrationName: xmlDoc2.querySelector('AccountingCustomerParty PartyTaxScheme RegistrationName').textContent,
            companyID: xmlDoc2.querySelector('PartyTaxScheme CompanyID').textContent
          },

          accountingSupplierParty: {
            additionalAccountID: xmlDoc2.querySelector('AdditionalAccountID').textContent,
            name: xmlDoc2.querySelector('PartyName Name').textContent,
            id: xmlDoc2.querySelector('Address ID').textContent,
            cityName: xmlDoc2.querySelector('Address CityName').textContent,
            postalZone: xmlDoc2.querySelector('Address PostalZone').textContent,
            country: xmlDoc2.querySelector('Address Country').textContent,
            countrySubentity: xmlDoc2.querySelector('Address CountrySubentity').textContent,
            countrySubentityCode: xmlDoc2.querySelector('Address CountrySubentityCode').textContent,
            identificationCode: xmlDoc2.querySelector('Address Country IdentificationCode ').textContent,
            countryName: xmlDoc2.querySelector('Address Country Name').textContent,
            registrationName: xmlDoc2.querySelector('PartyTaxScheme RegistrationName').textContent,
            companyID: xmlDoc2.querySelector('PartyTaxScheme CompanyID').textContent,
            contactName: xmlDoc2.querySelector('Contact Name').textContent,
            telephone: xmlDoc2.querySelector('Contact Telephone').textContent,
            electronicMail: xmlDoc2.querySelector('Contact ElectronicMail').textContent,

            partyTaxScheme: {
              registrationName: xmlDoc2.querySelector('PartyTaxScheme RegistrationName').textContent,
              companyID: xmlDoc2.querySelector('PartyTaxScheme CompanyID').textContent,
              taxLevelCode: xmlDoc2.querySelector('PartyTaxScheme TaxLevelCode').textContent,

              registrationAddress: {
                id: xmlDoc2.querySelector('PartyTaxScheme RegistrationAddress ID').textContent,
                cityName: xmlDoc2.querySelector('PartyTaxScheme RegistrationAddress CityName').textContent,
                postalZone: xmlDoc2.querySelector('PartyTaxScheme RegistrationAddress PostalZone').textContent,
                countrySubentity: xmlDoc2.querySelector('PartyTaxScheme RegistrationAddress CountrySubentity').textContent,
                countrySubentityCode: xmlDoc2.querySelector('PartyTaxScheme RegistrationAddress CountrySubentityCode').textContent,

                addressLine: {
                  line: xmlDoc2.querySelector('PartyTaxScheme RegistrationAddress AddressLine Line').textContent,
                },

                country: {
                  identificationCode: xmlDoc2.querySelector('PartyTaxScheme RegistrationAddress Country IdentificationCode').textContent,
                  name: xmlDoc2.querySelector('PartyTaxScheme RegistrationAddress Country Name').textContent,
                }
              }
            },

            partyLegalEntity: {
              registrationName: xmlDoc2.querySelector('AccountingSupplierParty Party PartyLegalEntity RegistrationName').textContent,
              companyID: xmlDoc2.querySelector('AccountingSupplierParty Party PartyLegalEntity CompanyID').textContent,
              id: xmlDoc2.querySelector('AccountingSupplierParty Party PartyLegalEntity CorporateRegistrationScheme ID').textContent,
            }
          }



        }



        // JSON.partyLegalEntity = {
        //   registrationName:
        //     xmlDoc2.querySelector('RegistrationName').textContent,
        // };
        // JSON.partyLegalEntity.companyID = xmlDoc2.querySelector(
        //   'PartyLegalEntity CompanyID'
        // ).textContent;
        // JSON.partyLegalEntity.id = xmlDoc2.querySelector(
        //   'PartyLegalEntity CorporateRegistrationScheme ID'
        // )?.textContent;

        JSON.paymentMeans = {
          paymentMeans: xmlDoc2.querySelector('PaymentMeans').textContent,
        };
        JSON.paymentMeans.id =
          xmlDoc2.querySelector('PaymentMeans ID').textContent;
        JSON.paymentMeans.paymentMeansCode = xmlDoc2.querySelector(
          'PaymentMeans PaymentMeansCode'
        ).textContent;
        JSON.paymentMeans.paymentDueDate = xmlDoc2.querySelector(
          'PaymentMeans PaymentDueDate'
        ).textContent;



        const itemsXML = xmlDoc2.querySelectorAll('InvoiceLine');
        itemsXML.forEach((elemento) => {
          items.push({
            description: elemento.querySelector('Item Description').textContent,
            standardItemIdentification: elemento.querySelector(
              'StandardItemIdentification ID'
            ).textContent,
            priceAmount:
              elemento.querySelector('Price PriceAmount').textContent,
            baseQuantity:
              elemento.querySelector('Price BaseQuantity').textContent,
            taxableAmount: elemento.querySelector('TaxSubtotal TaxableAmount')
              .textContent,
            taxAmount: elemento.querySelector('TaxTotal TaxAmount').textContent,
          });
        });

        JSON.items = items;
        console.log(JSON);
      };
      reader.readAsText(file);
    });
    fileInput.click();
  }

  generatePdf() {
    const doc = new jsPDF();
    let pageNumber = 0;
    const products = [];
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

    const array = [
      {
        costo: 5500,
        costoTotal: 550000,
        vat: 1045,
        cant: 100,
        producto: {
          ultimoCosto: 6580,
          unidad: {
            simbolo: 'PAR',
          },
          codigo: 3014,
          nombre: 'GUANTE VAQUETA CORTO',
        },
        total: 654500,
        vatTotal: 104500,
        _id: '6451593d33ff1e6e52db4708',
      },
      {
        costo: 5500,
        costoTotal: 550000,
        vat: 1045,
        cant: 100,
        producto: {
          ultimoCosto: 6580,
          unidad: {
            simbolo: 'PAR',
          },
          codigo: 3015,
          nombre: 'GUANTE VAQUETA CORTO',
        },
        total: 654500,
        vatTotal: 104500,
        _id: '6451593d33ff1e6e52db4708',
      },
    ];

    array.forEach((el, index) => {
      console.log();
      products.push([
        index,
        `(${el['producto'].codigo}) ${el['producto'].nombre}`,
        el['producto'].unidad['simbolo'],
        el.cant,
        formatter.format(el.costo),
        formatter.format(el.costoTotal),
      ]);
    });

    products.push(
      [
        {
          content: 'Lugar Entrega',
          colSpan: 4,
          rowSpan: 3,
        },
        {
          content: 'SubTotal',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
          },
        },
        '10.111.920,00 $',
      ],
      [
        {
          content: 'IVA',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
          },
        },
        '1.921.264,80 $',
      ],
      [
        {
          content: 'TOTAL A PAGAR*',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
          },
        },
        {
          content: '12.033.184,80 $',
          styles: {
            fontStyle: 'bold',
          },
        },
      ],
      [
        {
          content: 'Observaciones',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
          },
          colSpan: 6,
        },
      ],
      [
        {
          content: '',
          colSpan: 6,
        },
      ],
      [
        {
          content: 'IVA',
          styles: {
            fontStyle: 'bold',
          },
          colSpan: 6,
        },
      ],
      [
        {
          content: 'TARIFA',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
          },
        },
        {
          content: '19%',
          colSpan: 6,
        },
      ],
      [
        {
          content: 'BASE',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
          },
        },
        {
          content: '10.111.920,00 $',
          colSpan: 6,
        },
      ],
      [
        {
          content: 'IVA',
          styles: {
            halign: 'left',
            fontStyle: 'bold',
          },
        },
        {
          content: '1.921.264,80 $',
          colSpan: 6,
        },
      ]
    );

    let imgData =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAF1A0cDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKbJJsoEmVzQA6io/tA3dPxo+1KWxnn6igCSim+aPem/aFI+X5voaAJKKjS4DZ4Py04Pn1pXC46igHJopgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFNd9nYn6UAOoqP7Qrd+nWgTr60ASUUzz19aPPX1oAfRTPPX1oE6mgB9FME6t0P60huR2Vm+lAbElFRrchs/K3HagT5PQj60LXYFrsSUU1ZN3Y04GgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKaz7ab5272ouA26wByucc1BeajDYWjSTt5MMY3M7nCqPU+g9zVXxZ4lsfCmhXWqalcR2dhp8L3NxPIcJDGilmY/RQT+Br8rP+CjP/BRb4Y/tWafbeG9H+LXi/w74ZjUm8t9G8MGdtUfIILzvPG2wDooHO457V7vDvDuKzjFKhh4SaW7jFysvRHjZ1nWHy+j7StNXeyfU+/PHH7fPwh8DNcwy+PPDNzqUKnZZw6jE0krf3VYtsz9WwO5FeG/Ej/gqh460uSS48E/AvVfG2kx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0rVXY7YzClrslcZ6DCsRnoBRZk3PzA/4KSftxX37c/7GX7P/AMOPBL/afFHxya2m1K1ifOHibynjYDJVPtSyHkZ2xAkDpX6kfsz/AAO0n9m/4E+FvA+ihW0/w3p0NmkoTa1wyr88rerOxLH3avyJ/wCDeP8AZNt/iH+074o+I0klxqHhn4dNLYaC8/R7qbdiUDohEQzgd3B7nH7XQrtLe/IGOnt/P86pbCY+iiimIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAAjNN8sA5706igBoTnn+VOAxRRQAjJvpFQL/wDWp1FACAYoZd3bpS0UANCDNDR5H9adRQA0xAt0/HNATH/66dRQA1kyMY470nkKRjt9afRQAwQKO369KVolP8NOooAYIVBzj9aXy+c9/rTqKAGlM9QKPKXP3V/KnUUANVMUNGD6fXFOooAase30+uKcVzRRQA1olfqooCYHb8BTqKAGmJT1HNIYVbqq/hxT6KAGrHs6fr2o8sfnTqKAG+UMf/XriP2kfhJJ8dPgL4u8GQXkemyeJtJuNOjuXQyJC0iFQzLxkDPTNdzRQB8+/wDBNX9iu6/YJ/Zjs/h7da9b+I5rO/ubz7bDafZlYSkEKI8nGMepzX0Ai7B/XFOooADzTfJX069c806igBvl4HGB9BQibSf8adRQA11yQf7vvXk/7a/wL8Q/tL/s4eJvA/hrxFb+Fb7xJamyk1CaBp1SFiPMTYCM7lG3OcgE+pr1qgDFAHiH/BPr9jHT/wBhH9mPRfh9Z3q6vcWTy3Woal5RiOo3MjlmlKlm24XYgGekYr25RilooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//Z';

    // 1. Bloque: Titulo y logo del documento
    autoTable(doc, {
      body: [
        [
          {
            styles: {
              cellWidth: 124,
            },
          },
          {
            styles: {
              cellPadding: 10,
            },
          },
        ],
      ],
      theme: 'plain',
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          autoTable(doc, {
            styles: {
              textColor: '#000000',
              fillColor: '#FBFBFB',
              halign: 'center',
            },
            body: [
              [
                {
                  content: 'ORDEN DE COMPRA Y/O SERVICIO',
                  styles: {
                    fontSize: 15,
                    cellWidth: 124,
                    cellPadding: {
                      top: 10,
                      bottom: 2,
                    },
                  },
                },
              ],
              [
                {
                  content: 'COM-FOR-04',
                  styles: {
                    fontSize: 10,
                    cellPadding: {
                      bottom: 0,
                    },
                  },
                },
              ],
              [
                {
                  content: 'Versión 3 - Julio 2018',
                  styles: {
                    fontSize: 5,
                    cellPadding: {
                      top: 0,
                      bottom: 5,
                    },
                  },
                },
              ],
            ],
            startY: data.cell.y + 2,
            theme: 'plain',
          });
        }

        if (data.section === 'body' && data.column.index === 1) {
          doc.addImage(
            imgData,
            'JPEG',
            data.cell.x + 10,
            data.cell.y + 2,
            45,
            22
          );
        }
      },
    });

    // 2. Bloque Fecha, número de documento e identificador
    autoTable(doc, {
      body: [
        [
          {
            content: 'Código OC-7960',
            styles: {
              fontStyle: 'bold',
            },
          },
          {
            content: 'Fecha: 25/04/23',
            styles: {
              fontStyle: 'bold',
              halign: 'right',
            },
          },
        ],
        [
          {
            content: 'Proyecto',
            styles: {
              lineWidth: 0.1,
            },
          },
          {
            content: 'TK-402/403 APIAY CENIT',
            styles: {
              lineWidth: 0.1,
            },
          },
        ],
      ],
      theme: 'plain',
    });

    //3. Datos cabecera
    autoTable(doc, {
      body: [
        [
          {
            content: '',
            styles: {
              cellPadding: 20,
            },
          },
          '',
        ],
      ],
      theme: 'plain',
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          autoTable(doc, {
            styles: {
              textColor: '#000000',
            },
            body: [
              ['Comprador', 'ZH INGENIEROS SAS'],
              ['Nit', '900.210.398-1'],
              ['Dirección', 'CALLE 138 NO 57 - 75 OFC 402 BOGOTA D.C'],
              ['Teléfono', '(1)702-9452'],
            ],
            startY: data.cell.y + 2,
            margin: {
              right: 107,
            },
            theme: 'grid',
            columnStyles: {
              0: {
                fontStyle: 'bold',
              },
            },
          });
        }

        if (data.section === 'body' && data.column.index === 1) {
          autoTable(doc, {
            styles: {
              textColor: '#000000',
            },
            body: [
              ['', 'STECKERL ACEROS SOCIEDAD POR ACCIONES SIMPLIFICADA '],
              ['Nit', '9004990322'],
              ['Dirección', 'KM 114 CRT LA CORDIALIDAD K3 CRV BARRANQUILLA '],
              ['Teléfono', '(605) 3850707 - 3671777'],
            ],
            startY: data.cell.y + 2,
            margin: {
              left: 107,
            },
            theme: 'grid',
            columnStyles: {
              0: {
                fontStyle: 'bold',
              },
            },
          });
        }
      },
    });

    //4. Datos cabecera 2
    autoTable(doc, {
      theme: 'plain',
      styles: {
        halign: 'center',
        lineWidth: 0.1,
      },
      head: [['Forma de Pago', 'Condiciones de Pago', 'Fecha de Entrega']],
      body: [['TRANSFERENCIA', '45 DÍAS', '22/04/23']],
    });

    // 5. Listado

    autoTable(doc, {
      theme: 'plain',
      styles: {
        halign: 'left',
      },
      head: [['Total Items: 1 - Total Productos 60']],
    });

    autoTable(doc, {
      theme: 'plain',
      didDrawPage: (data) => {
        pageNumber++;
        doc.text(
          `Página ${pageNumber}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
      styles: {
        halign: 'center',
        lineWidth: 0.1,
      },
      head: [
        ['#', 'Descripción', 'UND', 'Cant', 'Valor Unitario', 'Valor Total'],
      ],
      body: products,
    });

    // // 6. Observaciones

    // autoTable(doc, {
    //     theme: 'plain',
    //     styles: {
    //         lineWidth: 0.1
    //     },
    //     head: [
    //         ['Observaciones']
    //     ],
    //     body: [
    //         ['']
    //     ]
    // })

    // // 7. IVA
    // autoTable(doc, {
    //     theme: 'plain',
    //     styles: {
    //         lineWidth: 0.1,
    //         halign: 'center'
    //     },
    //     head: [
    //         [{
    //             content: 'IVA',
    //             colSpan: 3
    //         }]
    //     ],
    //     body: [
    //         ['TARIFA', 'BASE', 'IVA'],
    //         ['19%', '10.111.920,00 $', '1.921.264,80 $'],
    //     ],

    //     didParseCell: (data) => {
    //         if (data.section === 'body' && data.row.index === 0) {
    //             data.cell.styles.fontStyle = 'bold';
    //         }
    //     }
    // })

    return doc.save('orden-compra');
  }
}
