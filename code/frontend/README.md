# TO-DO

- Highlight uzlov podľa fulltext search (Andrej)
- Prepojenie grafov navzájom napríklad bag of words prepojiť s hlavným grafom filtrovaním podľa keyword (Andrej)
- tooltips (Andrej)
- names of the nodes 
- linked views
- view switch - for scenes
- stretch graph bag of words
- color for all graph scenes 
- scenare 
- default depth for all views
- Searcher remove fetch data from backend 
- remove apply graph colors
- graph visual apperance 
- graph names over node 
- kewords on hover over node



# SCENARE
1. Chce vizuálne preskúmať kategorizáciu dokumentov podľa kľúčových slov a fráz definovaných v stromovej štruktúre a nájsť rozsiahle a/alebo najmenšie výskumné oblasti.

Pre tento účel môže používateľ použiť zobrazenie dát v histograme(tree map) alebo v grafe bag of words. 

Používateľ môže si zobraziť tieto grafy iba od hĺbky 2 od koreňa grafu, keďže koreň neobsahuje žiadne kľúčové slová.
- V classic, explorer alebo searcher móde klikne používateľ na Fetch data from backend
- Pod hlavným grafom sa zobrazia oba grafy

Histogram zobrazuje kľúčové slová, ktoré sa vyskytujú v názvoch dokumentov v štandardnom tvare. Histogram pozostáva z dielikov v tvare obdĺžnikov, ktoré majú veľkosť úmernú počtu výskytov kľúčového slova v názve dokumentu. Používateľ si môže zobraziť konkrétny počet výskytov kľúčového slova prejdením myšou ponad obdĺžnik. Kľúčové slová ktoré sa vyskytujú často v názvoch súborov sú červené, tie ktoré sa vyskytujú najmenej sú zelené.

Graf bag of words zobrazuje taktiež najviac vyskytujúce sa slová, avšak zobrazuje ich vo forme textu. Po zakliknutí niektorého kľúčového slova v grafe bag of words sa filtrujú dáta v hlavnom grafe podľa zakliknutého kľúčového slova. Kľúčové slová ktoré sa vyskytujú často v názvoch, sú zobrazené väčším písmom ako tie ktoré sa zobrazujú pomenej.

2. Chce analyzovať vzťahy medzi kľúčovými slovami a frázami definované v stromovej štruktúre a samotnými kľúčovými slovami a frázami v názvoch dokumentov

Pre tento účel máme v aplikácii graf pozostávajúci z uzlov a hrán.

- V classic, explorer alebo searcher móde klikne používateľ na Fetch data from backend
- Zobrazí sa graf s uzlami a hranami
- V classic móde môže používateľ rotovať okolo grafu stlačením ľavého tlačidla myši ponad grafom
- V explorer móde môže používateľ zakliknúť uzol, v tom prípade sa nastaví kamera na pohľad od zakliknutého uzla grafu
    - v tomto móde naviac používateľ vidí namiesto uzlov grafu ich názov, čo môže pomôcť pre rýchle zorientovanie sa v súborovej štruktúre
- V searcher móde používateľ môže filtrovať časti zobrazeného grafu
    - Na to slúži vyhľadavánie podľa kľúčových slov - pomocou tohto vyhľadávania je možné aplikovať kombináciu viacerých kľúčových slov
    - Dá sa vyhľadávať aj fulltextovo - vieme takto filtrovať nielen kľúčové slová ale aj koncovky súborov
- Používateľ môže ofarbiť uzly v ľavom paneli aplikácie, alebo ofarbiť označené uzly

Hrany znamenajú v grafe prepojenie adresárov so súbormi. Uzly grafu reprezentujú buď súbory alebo adresáre. Graf sa zobrazuje do priestoru silovo-riadeným spôsobom, teda rozloženie grafu je závislé na odpudivých silách(medzi všetkými uzlami) a príťažlivých silách(uzly prepojené hranami).

3. Chce vizuálne preskúmať konkrétne časové intervaly aby rozpoznal trendy v témach v korpusoch dokumentov

Pre tento účel slúži graf Chords - nachádza sa v aplikácii ako posledný graf na spodnej časti stránky.

- Používateľ zaklikne na spodnej časti Dashboard tlačidlo "By year"
- Posledný graf aplikácie zobrazí skrátené názvy dokumentov zoradené podľa roku vydania
- Používateľ môže prechádzať ponad názvy dokumentov, čím sa zobrazí celý názov dokumentov


4. ?? (Doplnit scenar)

5. Preskumat stromovu strukturu zloziek a suborov na zaklade klucovych slov

- Používateľ zaklikne Searcher mód
- V ľavom paneli môže pridávať kľúčové slová, následne klikne Fetch data from backend
- Na backende sa vyhľadá, či niektoré adresáre alebo súbory obsahujú niektoré z kľúčových slov(nie nutne ich kombináciu)
- Zoznam uzlov a hrán sa vráti späť do rozhrania


own:

1. Pouzivatel chce z mnoziny dat urcit velkost suborov

- Pre tento účel slúži posledný graf - Chords
- Používateľ zaklikne v ľavom paneli - Fetch data from backend
- Používateľ zaklikne vyhľadávanie By file size
- Prekreslí sa graf, zobrazí sa rozdelenie súborov do vedierok - podľa rozsahu veľkosti
- Používateľ nemá možnosť zistiť presnú veľkosť súboru iba približnú, podľa veľkosti vedierka
- Používateľ môže aplikovať kľúčové slová nad vyhľadávaním a to v Searcher móde

2. Používateľ si chce zobraziť dokumenty, ktoré majú rovnakú koncovku súboru

- Pre tento účel použije rovnaký graf ako v predošlom scenári - Chords
- Používateľ zaklikne v ľavom paneli - Fetch data from backend
- Používateľ zaklikne vyhľadávanie By file ending
- Zobrazí sa rozdelenie súborov do vedierok - podľa koncovky súboru
- Používateľ môže aplikovať kľúčové slová nad vyhľadávaním a to v Searcher móde