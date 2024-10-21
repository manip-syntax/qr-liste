import './style.css'
import '../node_modules/dropzone/src/basic.scss';
import '../node_modules/dropzone/src/dropzone.scss';
import * as QRCode from "@qrcode-js/browser";
import { parse } from 'csv-parse/browser/esm/sync';
import { by_id, create_html_element } from './util';
import  Dropzone  from "dropzone";
import * as html2pdf from 'html2pdf.js';

const reader = new FileReader();
const myDropzone = new Dropzone("#dropzone-file", {
                               acceptedFiles: "text/csv",
                               }
);
myDropzone.accept = (file, _) => {
    reader.addEventListener("loadend", function (_) {
                                       file.status = Dropzone.SUCCESS;
                                       myDropzone.emit("success", file);
                                       myDropzone.emit("complete", file);
                                   });

                               };

let names: Array<string> = [];
function create_qr_codes() {
    // reset state
    by_id("qr-zone").innerHTML = "";

    names.forEach( function (elt: string) {
        const id = `qr-${elt}`;
        const new_container = create_html_element(by_id("qr-zone"), "div", { class: "qr-container"});

        const new_elt = create_html_element(new_container, "canvas", { id: id}) as HTMLCanvasElement;
        const name_elt = create_html_element(new_container, "div", { "class": "qr-name"});
        const remove_elt = create_html_element(new_container, "div", {id: `${id}-remove`, class: "qr-remove"});
        remove_elt.innerHTML = "x";
        remove_elt.addEventListener("click", ()=> {
            names = names.filter(n => n !== elt);
            create_qr_codes();
        });
        name_elt.innerHTML= elt;
        const qr_code = QRCode.QRCodeBrowser(new_elt);
        qr_code.setOptions({
            text: elt,
            size: parseInt((by_id("qr-code-size") as HTMLInputElement).value)
        });
        qr_code.draw();
    });
}

reader.addEventListener("load", (_) => {
  const content = reader.result ?? "";
  if (typeof content !== "string" || content === "") {
      console.log("File error: content unrecognized");
  } else {
      const records = parse(content , {
        bom: true,
        delimiter: ";"
      });
      names = names.concat(records
        .map( function (elt: Array<Array<string>>) {  return elt[0]; })
        .filter (function (elt: string) { return elt.trim().length > 0;}));
        create_qr_codes();
  }
});

myDropzone.on("addedfile", file => {
  console.log(`File added: ${file.name}`);
  if (!((file.type ? file.type : "Not_found").includes("csv"))) {
      console.log("File error");
  } else {
      reader.readAsText(file);
  }

});

by_id("pdf-generator-button").addEventListener('click', 
                                               () => {
                                                   let opt = {
                                                       pagebreak: {
                                                           avoid: ".qr-container"
                                                       }
                                                   };
                                                   html2pdf.default(by_id('qr-zone'), opt);
});

by_id("qr-code-size").addEventListener("input",
                                       () => {
                                           create_qr_codes();
                                       });

by_id("qr-code-new-name-button").addEventListener("click",
                                                  () => {
                                                      names.push((by_id("qr-code-new-name") as HTMLInputElement).value);
                                                      create_qr_codes();

                                                  });

