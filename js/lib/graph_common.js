/**
 * Fonction drawProg
 *   Fonction dédiée au dessin de graphes en mode progressif
 *   Nécessite pour fonctionner que l'objet MathGraph soit dans
 *   un "scope" facile d'accès (en l'occurrence le scope "window"),
 *   sinon l'utilisation de la fonction requestAnimationFrame()
 *   se transforme en usine à gaz.
 * @returns {undefined}
 */
var drawProg = function () {
    "use strict";
    var tmp = MathGraph.coords[MathGraph.i_draw];
    MathGraph.context.lineCap = 'round';
    MathGraph.context.moveTo(tmp.x1, tmp.y1);
    MathGraph.context.lineTo(tmp.x2, tmp.y2);
    MathGraph.context.stroke();
    MathGraph.i_draw += 1;
    if (MathGraph.i_draw < MathGraph.nb_items) {
        MathGraph.idanim = window.requestAnimationFrame(drawProg, MathGraph.canvas);
    } else {
        MathGraph.context.closePath();
        window.cancelAnimationFrame(MathGraph.idanim);
        //setInterval(rotate, 100);
        //MathGraph.idanim2 = window.requestAnimationFrame(rotate, MathGraph.canvas);
    }
};

function rotate() {
    "use strict";
    var canvasWidth = 400 ;
    var canvasHeight = 400 ;
    //MathGraph.context.save();
    // Clear the canvas
    MathGraph.context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Move registration point to the center of the canvas
    MathGraph.context.translate(canvasWidth/2, canvasWidth/2);

    // Rotate 1 degree
    MathGraph.context.rotate(Math.PI / 180);

    // Move registration point back to the top left corner of canvas
    MathGraph.context.translate(-canvasWidth/2, -canvasWidth/2);
    //MathGraph.context.restore();

}


/**
 * Fonction canvasGetDataset
 *   Reprend le dataset défini sur un canvas et utilise les valeurs
 *   définies dans ce dataset pour rafraîchir le formulaire permettant
 *   de générer les graphes
 * @param {type} canvasref
 * @returns {Boolean}
 */
var canvasGetDataset = function (canvasref) {
    "use strict";
    var inputs = document.querySelectorAll('input, select');
    var dataset_items = canvasref.dataset ;
    var dataset_keys = Object.getOwnPropertyNames(dataset_items);
    var dataset_length = dataset_keys.length ;
    var i = 0 ;
    var form_values = {} ;
    for (i = 0 ; i < dataset_length ; i+=1) {
        form_values[dataset_keys[i]] = dataset_items[dataset_keys[i]];
    }
    var inputs = document.querySelectorAll('input, select');
    var xtmp = 0;
    var ztmp = 0;
    var xsize = inputs.length;
    var seloption = null ;
    var current_val = null ;
    for (xtmp = 0; xtmp < xsize; xtmp += 1) {
        current_val = form_values[inputs[xtmp].id] ;
        if (inputs[xtmp].tagName === 'INPUT') {
            inputs[xtmp].value = current_val ;
        } else {
            if (inputs[xtmp].tagName === 'SELECT') {
                seloption = inputs[xtmp].options ;
                for (ztmp = 0; ztmp < seloption.length; ztmp += 1) {
                    if (seloption[ztmp].value == current_val) {
                        seloption[ztmp].selected = true ;
                        break ;
                    }
                }
            }
        }
    }
    return true ;
};

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

