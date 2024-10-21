import './style.css';
import { by_id } from "./util";
import QrScanner from 'qr-scanner';

const table: HTMLTableElement = by_id("results") as HTMLTableElement;

class TableItem {
    _name: string;
    _points: number;
    html: HTMLTableRowElement;
    // _last_edit: DateTime;

    constructor(name: string, points: number) {
        this._name = name;
        this._points = points;
        this.html = table.insertRow(0);
        const name_elt = this.html.insertCell(0);
        name_elt.innerText = name;
        const points_elt = this.html.insertCell(1);
        points_elt.innerHTML = `<input type="number" id="points-${name}" value="${points}" />`;
        let ti = this;
        by_id(`points-${name}`).addEventListener("input",function (e) { 
            ti._points = parseInt((e.currentTarget as HTMLInputElement).value);
        });
    }

    increment(): void {
        this._points += 1;
        (by_id(`points-${this._name}`) as HTMLInputElement).value = this._points.toString();
    }

    set points(value: number) {
        this._points = value;
    }

    get name(): string {
        return this._name;
    }
}

class ResultManager {
    _items: Array<TableItem> = [];
    constructor() {
    }

    increment(name: string) {
        // update or add a name
        let rm = this;
        let ti = this._items.find( (elt) => elt.name === name) ?? (function () {
            const ti = new TableItem(name, 0);
            rm._items.push(ti);
            return ti;
        })();
        ti.increment();


    }
}

let rm = new ResultManager();

const scan = new QrScanner( document.querySelector<HTMLVideoElement>('#qr-video') as HTMLVideoElement,
                           result => {
                                        console.log('decoded: ', result);
                                        rm.increment(result.data);
                            },
                           {
                                maxScansPerSecond: 1,
                                highlightScanRegion: true,
                                highlightCodeOutline: true,
});

scan.start();

