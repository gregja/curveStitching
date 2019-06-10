
/**
 * Création de l'objet Epicycloide
 * @returns {EpicycloideDraw}
 */
var EpicycloideDrawSVG = function () {
    "use strict";

    /**
     * Methode d'initialisation de l'objet EpicycloideDraw
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
        this.svg = null;
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
        
        //this.svg = document.createElement('svg');
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        //this.pointer.appendChild(this.svg);
        this.pointer.insertBefore(this.svg, this.pointer.firstChild) ;

    var svg_img = document.createElementNS(
        "http://www.w3.org/2000/svg", "image");

        //svg_img.setAttributeNS(
        // "http://www.w3.org/1999/xlink", "xlink:href", img_dataurl);

        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.setAttribute('version', '1.1') ;
        this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg') ;
        this.svg.setAttribute('viewBox', '0 0 '+this.width+ ' '+this.height);
        //this.svg.setAttribute('baseProfile', 'full') ;

        var couleur = this.params['couleur'];
        var style = document.createElement('style') ;
        style.setAttribute('type', 'text/css') ;
        style.innerHTML = '<![CDATA[.stylegraph {stroke:'+couleur+';}]]>' ;
        //this.svg.appendChild(style);
                
        /*
         * On place les valeurs des formulaires en attributs de type 
         * "dataset" sur les canvas générés, de manière à conserver une trace
         * des valeurs ayant servi à générer chaque graphe.
         */
        for (xtmp = 0; xtmp < xsize; xtmp += 1) {
            //this.svg.dataset[inputs[xtmp].id] = inputs[xtmp].value;
        }
        
        /*
         * On ajoute un évènement de type click sur le canvas, pour pouvoir
         * récupérer ses paramètres (stockés dans dataset) sur le formulaire
         * de demande de génération de graphe
         */
        this.svg.addEventListener('click',
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
        var rebrous = Number(this.params['nbrebro']);
        var couleur = this.params['couleur'];
        var couleur_fond = this.params['couleur_fond'];

        var i, i2, j = 0;
        var ti, tj = 0;
        var x1, x2, y1, y2 = 0;

        var svggraph = document.createElement('g');
        //svggraph.setAttribute('class', 'stylegraph');
        svggraph.setAttribute('style', 'stroke:'+couleur+';stroke-width:1');
        //svggraph.setAttribute('stroke-width', '1') ;
        //svggraph.setAttribute('stroke', couleur) ;

        var svgline = '';
        rebrous += 1;
        for (i = 1; i <= nbiter - 1; i+=1) {
            ti = 2 * Math.PI * i / nbiter;
            j = i * rebrous - nbiter * Math.floor(i * rebrous / nbiter);
            tj = 2 * Math.PI * j / nbiter;
            x1 = Math.round(this.xcentre + rayon * Math.cos(ti));
            y1 = Math.round(this.ycentre + rayon * Math.sin(ti));
            x2 = Math.round(this.xcentre + rayon * Math.cos(tj));
            y2 = Math.round(this.ycentre + rayon * Math.sin(tj));
            
            svgline = document.createElement('line') ;
            svgline.setAttribute('x2', x2) ;
            svgline.setAttribute('y2', y2) ;
            svgline.setAttribute('x1', x1) ;
            svgline.setAttribute('y1', y1) ;
            svgline.setAttribute('stroke', couleur);
            svgline.setAttribute('stroke-width', '1');
            //svggraph.appendChild(svgline);
            this.svg.appendChild(svgline);
            
        }

        //this.svg.appendChild(svggraph);
        //this.svg.setAttribute('style', 'float:left; font-weight:bold');
        //this.svg.setAttribute('style', 'overflow: visible');

        return true;
    }
}

/**
 * On place un évènement sur le clic du bouton "Tracer"
 * @returns {undefined}
 */
function graph_event() {
    "use strict";
    document.querySelector('#submitbutton').addEventListener('click',
            function (event) {
                var inputs = document.querySelectorAll('input, select');
                MathGraph.init('image', inputs);
                MathGraph.calc();
            }, false
            );
}

var MathGraph = new EpicycloideDrawSVG();
window.onload = function(){
    graph_event();
}
