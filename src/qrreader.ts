import './style.css';
import '../node_modules/dropzone/src/basic.scss';
import '../node_modules/dropzone/src/dropzone.scss';
import { by_id } from "./util";
import { parse } from 'csv-parse/browser/esm/sync';
import QrScanner from 'qr-scanner';
import Dropzone from 'dropzone';
import {stringify} from 'csv-stringify/browser/esm';


const table: HTMLTableElement = by_id("results") as HTMLTableElement;
const min_between_two_scans = 10000; // in milliseconds

class TableItem {
    _name: string;
    _points: number;
    html: HTMLTableRowElement;
    _last_edit: number;

    constructor(name: string, points: number) {
        this._name = name;
        this._points = points;
        this._last_edit = -min_between_two_scans;

        this.html = table.insertRow(-1);
        const name_elt = this.html.insertCell(0);
        name_elt.innerText = name;
        const points_elt = this.html.insertCell(1);
        points_elt.innerHTML = `<input type="number" id="points-${name}" value="${points}" />`;
        const remove_elt = this.html.insertCell(2);
        remove_elt.innerHTML = `<span id="remove-${name}" class="remove-name">x</span>`;

        let ti = this;
        by_id(`points-${name}`).addEventListener("input",function (e) { 
            ti._points = parseInt((e.currentTarget as HTMLInputElement).value);
        });

        by_id(`remove-${name}`).addEventListener("click", function () {
            rm.remove(name);
        });
    }

    increment(): void {
        if ((Date.now() - this._last_edit) < min_between_two_scans) {
            // discard this increment if qr code was scanned less than 10s before
            return;
        }
        this._points += 1;
        (by_id(`points-${this._name}`) as HTMLInputElement).value = this._points.toString();
        this._last_edit = Date.now();
    }

    set points(value: number) {
        this._points = value;
    }

    get points(): number {
        return this._points;
    }

    get name(): string {
        return this._name;
    }

    get row(): HTMLTableRowElement {
        return this.html;
    }

    get data(): Array<string|number> {
        return [this._name, this._points];
    }
}

class ResultManager {
    _items: Array<TableItem> = [];
    _sort: "no" | "names"|"points" = "no";
    _ascending_order: boolean = true;

    constructor() {
    }

    to_array() {
        return this._items
        .map( elt => elt.data);
    }

    add(name: string, points: number): TableItem {
        const ti = new TableItem(name, points);
        this._items.push(ti);
        return ti;
    }

    increment(name: string) {
        // update or add a name
        let ti = this._items.find( (elt) => elt.name === name) ?? this.add(name, 0);
        ti.increment();
    }

    remove(name: string) {
        this._items = this._items.filter( elt => elt.name !== name);
        this.generate();
    }

    generate() {

        table.innerHTML = "";
        generate_table_header(this._sort, this._ascending_order);
        this._items.forEach( elt => {
            table.append(elt.row);
        });
    }


    sort(ascending: boolean, value: "names"|"points") : void {
        this._sort = value;
        this._ascending_order = ascending;
        this._items.sort( (a: TableItem, b: TableItem) => {
            if (value === "points") {
                return ascending ? a.points - b.points : b.points - a.points;
            }
            // names
            if (ascending) {
                return a.name > b.name ? 1:-1;
            } else {
                return b.name > a.name ? 1:-1;
            }
        });
        this.generate();

    }
}

export function sort_table(ascending: boolean, name: "names"|"points"){
    rm.sort(ascending, name);
}

function caret_table_header(sort: "no"|"names"|"points", name: "names"|"points", ascending: boolean): string {
    const caret_up = `<span id="header-caret-up-${name}" class="caret" onclick="sort_table(true, '${name}')">⌃</span>`
    const caret_down = `<span id="header-caret-down-${name}" class="caret" onclick="sort_table(false, '${name}')">⌄</span>`
    if (sort === "no" || !(sort === name)) {
        return ` ${caret_up} ${caret_down}`;
    }
    else if (ascending) {
        return ` ${caret_down}`;
    } else {
        return ` ${caret_up}`;
    }
}

function generate_table_header(sort: "no"|"names"|"points", ascending: boolean) {
    const header = table.insertRow(0);
    const caret_names = caret_table_header(sort, "names", ascending);
    const caret_points = caret_table_header(sort, "points", ascending);
    header.innerHTML = `<th>Noms${caret_names}</th><th>Points${caret_points}</th><th>Supprimer</th>`;
    header.className = "header";
    console.log(sort, ascending);
    
}

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
myDropzone.on("addedfile", file => {
  console.log(`File added: ${file.name}`);
  if (!((file.type ? file.type : "Not_found").includes("csv"))) {
      console.log("File error");
  } else {
      reader.readAsText(file);
  }

});

reader.addEventListener("load", (_) => {
  const content = reader.result ?? "";
  if (typeof content !== "string" || content === "") {
      console.log("File error: content unrecognized");
  } else {
      const records = parse(content , {
        bom: true,
        delimiter: ";"
      });
      records
        .map( function (elt: Array<Array<string>>) {  return [ elt[0], elt[1] ]; })
        .filter (function (elt: Array<string>) { return elt[0].trim().length > 0;})
        .forEach( (infos: Array<string>) => rm.add(infos[0],parseInt(infos[1]) ));
  }
});

by_id("save-results-button").addEventListener("click", () => {
    stringify( rm.to_array(),
        {
            delimiter: ";"
        },
        function (err, output) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(output);
            const blob = new Blob([output], {type: "text/csv" });
            const lk = document.createElement('a');
            lk.download = (by_id("save-results-input") as HTMLInputElement).value + ".csv";
            lk.href = window.URL.createObjectURL(blob);
            lk.dataset.downloadurl = ["text/csv", lk.download, lk.href].join(":");
            const evt = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            lk.dispatchEvent(evt);
            lk.remove();
    });
});

let rm = new ResultManager();


const notif_sound = new Audio("./bell.mp3");
const scan = new QrScanner( document.querySelector<HTMLVideoElement>('#qr-video') as HTMLVideoElement,
                           result => {
                                        console.log('decoded: ', result);
                                        // bugfix
                                        if (result.data === "") {
                                            return;
                                        }
                                        rm.increment(result.data);
                                        notif_sound.play()
                                            .catch(e => console.log("Error playing bell", e));
                            },
                           {
                                maxScansPerSecond: 20,
                                highlightScanRegion: true,
                                highlightCodeOutline: true,
});

generate_table_header("no", true);

scan.start();
(window as any).sort_table = sort_table;
// for tests only:
(window as any).fill_table = function () {
    rm.increment("Marie Boucher");
    rm.increment("Yov Cohen");
    rm.increment("Nasra Hamdullah");
    rm.increment("Park Jung-un");
    rm.increment("Papadiamantopoulos Mikhail");
    ["Saadi Lesroses",
     "Clémence Eaux",
     "John Tole-Kin",
     "Cléo Ptolémée",
     "Erik Lerouge",
     "Ram De Cesse"
    ].
        forEach(e => rm.increment(e));
}
