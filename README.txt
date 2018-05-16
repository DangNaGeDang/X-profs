Projet de AWNG en groupe
Adrien Gimonnet, Arthur Braida, Paul Templier, Yiming Han

Base de données dans /databaseFile

url d'accueil:localhost:3000  ou  localhost:3000/auth

Basé sur le projet individuel de Adrien Gimonnet.

Yiming 's log:
1.Pour éviter la duplication, j'ai placé les mêmes styles écrits dans le fichier style.css  sous / public / stylesheets.
2.J'ai ajouté des fichiers bootstrap pour une typographie facile et la disposition réactive.
3. La barre de navigation ajoutée dans views/layouts/layout.hbs, elle jugera s'il faut afficher selon s'il y a un login utilisateur.Il va changer des contenus selon le role de utilisateur.
4.J’ai ajoute un attribut ‘course’ dans le class ‘evaluation’ pour afficher les évaluations par cours/compétence/session/étudiant. Donc je donne mon base de donnees dans le fichier /databaseFile ,il faut l’ajouter au mongodb de facon mentionnee sur ce lien http://lms.isae.fr/mod/folder/view.php?id=46249 
5.J’ai fait le page de affichage d’évaluations(F1), et il va changer des contenus selon le role de utilisateur. Paginate pas encore fait avec des preoblems déja demandés aux Tanguy.
6.J’ai fait filtrage et tri(F2), il va changer des contenus selon le role de utilisateur.Pour vérifier des fonctionnes, j’ai ajoute quelques sessions sous les cours de PHP et de Angular.
