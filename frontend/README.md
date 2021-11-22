# Upute

Angular je framework za web aplikacije napisan u Javascript-u.

Pošto vas dosta nije upoznato kako raditi s Angular-om tu ću napisati sve što se tiče pokretanja, testiranja i pisanja frontend-a, a nakon uputa ću ostaviti sve što je Angular generirao tokom generiranja projekta. Ako vam je išta nejasno, javite mi se na Slack, pa ćemo to nekako zajedno riješiti.  

## Potrebne instalacije

1. Node.js
   
   Node.js je runtime za jezik Javascript. Javascript nema veze s Java-om, ali ono što je JVM (Java Virtual Machine) Java-i, to je Node.js Javascript-u. *Napomena: logiku frontend-a ćemo pisati u Typescript-u, koji se prevodi u Javascript, ali dodaje pogodnosti poput formaliziranih klasa Javascript-u.*     
   Npm (Node package manager) je manager paketa za jezik Javascript i dolazi s instalacijom Node.js-a.
   
   Na ovoj [stranici](https://nodejs.org/en/download/) možete preuzeti Node.js i npm. Obavezno označite opciju da dodate npm u PATH ako vas to installer pita da možete pokretati npm iz ljuske.

2. Visual Studio Code

   VS Code je jedan od najboljih editor-a za Angular aplikacije. Možete koristiti neki drugi editor (npr. Atom), ali preporučam VS Code radi količine ekstenzija (koje ćemo koristiti) i samog izgleda. Možete ga preuzeti na ovoj [stranici](https://code.visualstudio.com/download).

3. Google Chrome

   Da, obavezno trebate imati Google Chrome. Žalim ljude koji koriste ostale browser-e, ali nama će trebati baš Google Chrome.

4. Angular CLI

   Ovo su komande koje možete izvršavati pomoću ljuske za Angular (npr. pokretanje servera). Nakon što ste instalirali Node.js i npm izvršite u ljuskci komandu "npm install -g @angular/cli".


## Opcionalne instalacije

1. Git Extensions

   Pošto vas se dosta tek upoznaje sa git-om na 3. godini FER-a, preporučit ću vam jedan alat za git da si olakšate korištenje git-a, te da ga netrebate koristiti preko ljuske nego da ga možete koristiti putem grafičke aplikacije. Ljudi su ipak vizualna bića.
   
   Git Extensions možete preuzeti [ovdje](https://sourceforge.net/projects/gitextensions/). Instalacija je malo komplicirana jer ćete trebati dodatno instalirati [PuTTy](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) i [KDiff3](https://sourceforge.net/projects/kdiff3/) ako vam to ne ponudi Git Extensions installer.  
   Sljedeće, morate konfigurirati git postavke u Git Extensions. Unesite svoje GitLab korisničko ime i email adresu u Tools->Settings->Git->Config.  
   Nakon toga, da biste preuzeli repozitorij, kliknite na "Clone repository" i u polje "Repository to clone" upišite ovaj link: "https://gitlab.com/dario.simunovic/smart-home.git". Ostalo postavite kako želite i kliknite "Clone".

   Nako što ste sve ovo napravili, možete lagano upravljati repozitorijem preko Git Extensions-a i nadam se da će vam to bar malo olakšati život.

## Snalaženje u Visual Studio Code

Mislim da je najbolje da sami malo istražite VS Code, a ovdje ću ispisati listu potrebnih ekstenzija i upute za debug.

### Ekstenzije za Visual studio code

+ Angular Language Service - Angular
+ Debugger for Chrome - Microsoft
+ TSLint - Microsoft

Pazite da ne preuzmete zastarjelu verziju TSLint-a.

### Debug

1. Instaliranje modula

   Nakon što ste instalirali sve do sad potrebno je pokrenuti ljusku, pozicionirati se u mapu "frontend" i obraditi naredbu "npm install".  
   Ovo možete vrlo lagano iz VS Code. Otvorite folder frontend u VS Code i otvorite ljusku u Terminal->New Terminal i u otvoreni panel napišete "npm install" i pritisnete enter.

2. Pokretanje servera

   Opet pokrenite ljusku u mapi "frontend" i obradite naredbu "ng serve".

3. Pokretanje debugger-a

   Pritisnite bubu s lijeve strane prozora VS Code-a i pritisnite mali kotačić. Nakon toga će vam se ponuditi opcije "Chrome" ili "Node.js". Pritisnite opciju "Chrome" i u otvorenom JSON-u u polju "uri" napišite adresu "http://localhost:4200". Sada pritisnite zeleni play gumb i otvoriti će vam se web aplikacija u Google Chrome-u i debug sesija u VS Code.


## Uspjeli ste!

Sada možete debuggirat-i i pisati kod u isto vrijeme pomoću live reload-a! Kada god promjenite jedan od datoteka u mapi "frontend" aplikacija će se ponovno učitati i vidjeti ćete izmjene koje ste napravili u pokrenutom Google Chrome prozoru. Neka vam je sa srećom u pisanju aplikacije! :)

---

## Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.14.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
