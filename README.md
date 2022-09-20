Comment lancer l'application en local :

1- Clonez le projet et allez au repo cloné:

$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR.git


2- Accéder au repertoire contenant le backend du projet :
```
cd Billed-app-FR-Back
```
### Installer les dépendances du projet :

```
npm install
```
### Lancer l'API :

```
npm run run:dev
```
### Accéder à l'API :

L'api est accessible sur le port `5678` en local, c'est à dire `http://localhost:5678`

## Utilisateurs par défaut:

### administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```

3- Accéder au répertoire contenant l'application front-end:

$ cd Billed-app-FR

Installez les packages npm (décrits dans package.json) :

$ npm install

Installez live-server pour lancer un serveur local :

$ npm install -g live-server

Lancez l'application :

$ live-server

Puis allez à l'adresse : http://127.0.0.1:8080/

Comment lancer tous les tests en local avec Jest :

$ npm run test

Comment lancer un seul test :

Installez jest-cli :

$npm i -g jest-cli
$jest src/__tests__/your_test_file.js

Comment voir la couverture de test :

http://127.0.0.1:8080/coverage/lcov-report/
