# QR-Liste
QR-Liste est un petit programme qui permet de compter le nombre de fois qu'un QR Code a été scanné.
Il a été conçu pour simplifier certains usages pédagogiques ; par exemple, en cours d'EPS, le nom d'un élève est associé à un QR Code et scanner ce QR Code permet de compter le nombre de tours fait par cet élève.

# Usage
On peut accéder au programme à cette adresse : [https://manip-syntax.github.io/qr-liste/dist/index.html](https://manip-syntax.github.io/qr-liste/dist/index.html).

Le programme se compose de deux parties.
## Générateur de QR Codes
On peut ajouter des noms de deux manières.
- En utilisant la zone de chargement de fichiers : dans ce cas, on clique sur la zone pour sélectionner un fichier, ou bien on le fait glisser-déposer. Le fichier doit être un fichier CSV avec le point-virgule comme séparateur, et dont la première colonne seulement sera utilisée. C'est le format utilisé par le logiciel Pronote pour exporter les listes d'élèves.
- En rajoutant un élève en indiquant son nom dans la partie 'Nouveau nom'. Notez que Pronote donne d'abord le nom de famille en lettres capitales, puis le prénom en minuscules (ex : DUPONT Jean).
Attention, les QR Codes générés sont sensibles à la casse : Dupont Jean ne donne pas le même QR Code que DUPONT JEAN, ou dupont jean, ou DuPonT jEan, non plus que Jean Dupont.
Vous pouvez spécifier la taille du QR Code. Changer ce paramètre change tous les QR Codes déjà générés.
Si vous avez des QR Codes en trop (par exemple si un élève est toujours dans les listes mais n'est plus réellement présent) vous pouvez supprimer le QR Code surnuméraire en cliquant dans la zone en haut à droite du QR Code : une croix apparaîtra.
Vous pouvez ensuite générer un fichier PDF que vous pourrez  télécharger et/ou imprimer à votre convenance.
## Lecteur de QR Code
Le lecteur de QR Code affiche la caméra en haut de la page. Votre navigateur vous demandera si vous acceptez son utilisation.
Un tableau se trouve juste en-dessous. Pour le remplir, commencez à scanner les QR Codes : les noms apparaîtront au fur et à mesure. Chaque scan donne un point.

# Utilisation des données
Ce programme fonctionne dans un navigateur web pour des raison de compatibilité, mais il n'envoie aucune donnée vers un serveur : tout se passe en local (sur la machine qui le fait tourner). Les informations contenues dans les fichiers chargés, notamment les noms et autres données personnelles, les photos prises par le programme, la vidéo tournée, tout est entièrement stocké dans la mémoire de l'appareil et détruit lorsque le programme est fermé. Les seules données qui peuvent être sauvegardées sont les QR Codes et les noms associés au nombre de fois où un QR Code aura été scanné.
Si nécessaire, vous pouvez supprimer une entrée inutile (par exemple si vous avez malencontreusement scanné un QR Code qui n'a rien à voir avec les vôtres) en cliquant sur la croix de la colonne 'Supprimer'.
Il est également possible de changer manuellement le nombre de points.
Vous noterez que, par défaut, les noms sont ajoutés au tableau au fur et à mesure. Pour l'ordonner, cliquez sur les flèches '⌃ ⌄' pour les classer par ordre alphabétique ou par nombre de points.
Si vous le désirez, vous pouvez sauvegarder votre tableau en rentrant un nom de fichier et en cliquant sur le bouton 'Enregistrer les résultats'. Vous pourrez ensuite réutiliser ce fichier en le glissant dans la zone 'Glisser les fichiers ou cliquer ici'.

# Précisions techniques
Le scanner scanne 20 images par seconde. Cela signifie que, si on laisse un QR Code face à la caméra une seconde, 20 points seront attribués à la même personne. Pour éviter ce problème, il n'est pas possible de scanner plus d'une fois le même QR Code dans un laps de temps inférieur à 10 secondes. En revanche, vous pouvez toujours changer le nombre de points manuellement et sans limite de temps.

# Suggestions
Toute suggestion est la bienvenue. N'hésitez pas à m'envoyer un mail à philippe[.]sergent [at] ac-poitiers[.]fr
