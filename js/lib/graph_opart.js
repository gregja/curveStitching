
/**
 * Création de l'objet OpartDraw
 * @returns {OpartDraw}
 */
var OpartDraw = function () {
    "use strict";

    /**
     * Methode d'initialisation de l'objet OpartDraw
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
        this.var_ajust = 0;

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
        this.xdecalage = Math.round(this.xcentre * 1.1);
        this.ydecalage = this.xcentre;

        this.width = Math.round(this.xcentre * 2 + 50);
        this.height = Math.round(this.ycentre * 2 + 50);
        this.var_ajust = this.xcentre; // variable pour ajustement d'échelle

        this.pointer = document.getElementById(div_id);
        this.canvas = document.createElement('canvas');
        //this.pointer.appendChild(this.canvas);
        this.pointer.insertBefore(this.canvas, this.pointer.firstChild) ;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");
// this.context.imageSmoothingEnabled = true;
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
        var nbtriangles = Number(this.params['nbretri']);
        var divcote = Number(this.params['divcote']);
        var nbiter = Number(this.params['nbiter']);
        var rotation = this.params['sens_rotation'];
        var couleur = this.params['couleur'];
        var couleur_fond = this.params['couleur_fond'];
        var mode_trace = this.params['mode_trace'];
        var limite = 3;
        var sens = 1;
        var numtri = 0;
        var angle = 0;
        var reste = 0;
        var i, i2, j = 0;
        var xa, xb, ya, yb, x1, x2, y1, y2 = 0;

        var coef = 2 * Math.PI / nbtriangles;

        this.context.beginPath();
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = couleur_fond;
        this.context.fill();

        this.context.strokeStyle = couleur;
        this.context.lineWidth = 1;
        this.context.lineCap = 'square';
        this.context.beginPath();

        for (numtri = 1; numtri <= nbtriangles; numtri += 1) {
            x[1] = 0;
            y[1] = 0;
            angle = (numtri - 1) * coef;
            x[2] = Math.cos(angle);
            y[2] = Math.sin(angle);
            angle = numtri * coef;
            x[3] = Math.cos(angle);
            y[3] = Math.sin(angle);
            x[4] = 0;
            y[4] = 0;
            for (i = 1; i <= nbiter; i += 1) {
                xa = x[1];
                ya = y[1];
                for (i2 = 2; i2 <= limite + 1; i2 += 1) {
                    xb = x[i2];
                    yb = y[i2];

                    x1 = Math.round(xa * this.var_ajust + this.xdecalage);
                    y1 = Math.round(ya * this.var_ajust + this.ydecalage);
                    x2 = Math.round(xb * this.var_ajust + this.xdecalage);
                    y2 = Math.round(yb * this.var_ajust + this.ydecalage);

                    if (mode_trace == '1') {
                        this.context.moveTo(x1, y1);
                        this.context.lineTo(x2, y2);
                    } else {
                        this.coords.push({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2});
                    }
                }
                if (rotation == 3) {
                    reste = numtri % 2;
                    if (reste == 0) {
                        sens = -1;
                    } else {
                        sens = 1;
                    }
                } else {
                    if (rotation == 1) {
                        sens = -1;
                    } else {
                        sens = 1;
                    }
                }
                if (sens == -1) {
                    for (j = limite + 1; j >= 2; j--) {
                        x[j] += (x[j - 1] - x[j]) / divcote;
                        y[j] += (y[j - 1] - y[j]) / divcote;
                    }
                    x[1] = x[limite + 1];
                    y[1] = y[limite + 1];
                } else {
                    for (j = 1; j <= limite; j++) {
                        x[j] += (x[j + 1] - x[j]) / divcote;
                        y[j] += (y[j + 1] - y[j]) / divcote;
                    }
                    x[limite + 1] = x[1];
                    y[limite + 1] = y[1];
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
var MathGraph = new OpartDraw();

window.onload = function(){
    graph_event();
}
