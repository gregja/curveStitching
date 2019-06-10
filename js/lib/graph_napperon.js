
/**
 * Création de l'objet Napperon
 * @returns {NapperonDraw}
 */
var NapperonDraw = function () {
    "use strict";

    /**
     * Methode d'initialisation de l'objet NapperonDraw
     * @param {String} div_id
     * @param {NodeList} inputs
     * @returns {Boolean}
     */
    this.init = function (div_id, inputs) {
        this.nbtriangles = null;
        this.divcote = null;
        this.nbiter = null;
        this.rotation = null;

        this.params = {};

        this.pointer = null;
        this.canvas = null;
        this.context = null;

        this.nb_items = 0;
        this.idanim = 0;
        this.i_draw = 0;

        this.xcentre = 0;
        this.ycentre = 0;
        this.xdecalage = 0;
        this.ydecalage = 0;

        this.width = 0;
        this.height = 0;

        this.coords = []; // utilisation uniquement dans le cas de tracé progressif

        var xtmp = 0;
        var xsize = inputs.length;

        /*
         * Récupération des champs de formulaires dans le tableau "params"
         */
        for (xtmp = 0; xtmp < xsize; xtmp += 1) {
            this.params[inputs[xtmp].id] = inputs[xtmp].value;
        }

        this.xcentre = Number(this.params['rayon_forme']);
        this.ycentre = this.xcentre;
        this.xdecalage = this.xcentre * 1.1;
        this.ydecalage = this.xcentre;

        this.width = this.xcentre * 2 + 50;
        this.height = this.ycentre * 2 + 50;

        this.pointer = document.getElementById(div_id);
        this.canvas = document.createElement('canvas');
        //this.pointer.appendChild(this.canvas);
        this.pointer.insertBefore(this.canvas, this.pointer.firstChild) ;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");

        /*
         * On place les valeurs des formulaires en attributs de type 
         * "dataset" sur les canvas générés, de manière à conserver une trace
         * des valeurs ayant servi à générer chaque graphe.
         */
        for (xtmp = 0; xtmp < xsize; xtmp += 1) {
            this.canvas.dataset[inputs[xtmp].id] = inputs[xtmp].value;
        }
        
        /*
         * On ajoute un évènement de type click sur le canvas, pour pouvoir
         * récupérer ses paramètres (stockés dans dataset) sur le formulaire
         * de demande de génération de graphe
         */
        this.canvas.addEventListener('click',
            function (event) {
                canvasGetDataset(event.currentTarget) ;
            }, false
            );

        return true;
    }

    /**
     * Méthode dédiée au calcul du graphe
     * Cette méthode effectue également le tracé du graphe, si le 
     * mode de tracé "immédiat" a été demandé (dans le cas contraire,
     * c'est la fonction drawProg() qui réalise le tracé).
     * @returns {Boolean}
     */
    this.calc = function () {
        var x = [];
        var y = [];
        var rayon = Number(this.params['rayon_forme']);
        var nbiter = Number(this.params['nbiter']);
        var couleur = this.params['couleur'];
        var couleur_fond = this.params['couleur_fond'];
        var mode_trace = this.params['mode_trace'];
        var i, i2, j = 0;
        var ti, tj = 0;
        var x1, x2, y1, y2 = 0;

        this.context.beginPath();
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = couleur_fond;
        this.context.fill();

        this.context.strokeStyle = couleur;
        this.context.lineWidth = 1;
        this.context.lineCap = 'square';
        this.context.beginPath();

        for (i = 0; i <= nbiter - 2; i+=1) {
            ti = 2 * Math.PI * i / nbiter;
            for (j = i + 1; j <= nbiter - 1; j+=1) {
                tj = 2 * Math.PI * j / nbiter;
                x1 = Math.round(this.xcentre + rayon * Math.cos(ti));
                y1 = Math.round(this.ycentre + rayon * Math.sin(ti));
                x2 = Math.round(this.xcentre + rayon * Math.cos(tj));
                y2 = Math.round(this.ycentre + rayon * Math.sin(tj));
                if (mode_trace == '1') {
                    this.context.moveTo(x1, y1);
                    this.context.lineTo(x2, y2);
                } else {
                    this.coords.push({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2});
                }
            }
        }

        this.nb_items = this.coords.length;
        if (this.nb_items > 0) {
            this.i_draw = 0;
            drawProg();
        }

        this.context.stroke();
        this.context.closePath();

        return true;
    }
}

/*
 * On est obligé de déclarer l'objet MathGraph globalement pour 
 * faciliter son utilisation dans la fonction drawProg(). 
 * Si on ne procède pas ainsi, l'utilisation dans drawProg() de la fonction 
 * requestAnimationFrame() devient complexe (problème de "scope"). 
 */
var MathGraph = new NapperonDraw();


window.onload = function(){
    graph_event();
}
