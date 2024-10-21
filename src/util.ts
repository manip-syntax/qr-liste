export function non_null<T>(elt: T | null): T { // TEST
    /* Vérifie que elt n'est pas null
     * Si elt est null, renvoie une erreur
     * sinon, renvoie l'objet
     */
    if (elt === null) {
        throw TypeError("elt is null");
    } else {
        return elt;
    }
}
export function by_id(id: string):HTMLElement {
    return non_null(document.getElementById(id));
}

export function create_html_element(
    parent: HTMLElement,
    balise: string,
    attributs: {[id : string]: string} = {})
        : HTMLElement {
    /* Crée un élément enfant de parent et lui donne les attributs donnés.
     */
    let elt = document.createElement(balise);
    parent.appendChild(elt);
    Object.entries(attributs).forEach(
            ([key, value],/*index est enlevé ici: attention au comma*/ ) => elt.setAttribute(key, value)
        );
    return elt;
}
