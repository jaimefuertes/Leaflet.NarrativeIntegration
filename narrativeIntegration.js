L.Control.Layers.include({
    getCurrentLayer: function() {
      // create hash to hold all layers
      var control, layers;
      layers = {};
      control = this;
  
      let i = 0, result = 0;
      // loop thru all layers in control
      control._layers.forEach(function(obj) {
        // check if layer is an overlay
        
        if (!obj.overlay) {
            i++;
            if(control._map.hasLayer(obj.layer)){
                return result = i;
            }
        }
      });
      return result;
    }
  });


L.NarrativeIntegration = L.Class.extend({

    //add options
    options:{
        textScrollBehavior: "auto",
        //center: map.getCenter(),
        //zoom: map.getZoom()
    },
    
    changeTextWithLayer : function (texts, {textScrollBehavior="auto"} = {}){
        map.on('baselayerchange', 
        function(e) {
                let i = controlLayers.getCurrentLayer() - 1;
                
                document.getElementById(text).scroll({
                    top: document.getElementById(texts[i]).offsetTop - 100,
                    behavior: scrollBehavior
                }); 
                section = i;
                scrollBehavior = textScrollBehavior;
        });
    },

    changeLayerWithText: function (texts, layers, {center = map.getCenter(), zoom = map.getZoom()} = {}){
        document.getElementById(text).onscroll = function() {
            //leaves section from top, changes to previous section
            if (document.getElementById(text).scrollTop <= (document.getElementById(texts[section]).offsetTop - 250)){
                if((section - 1) >= 0){
                    map.removeLayer(layers[controlLayers.getCurrentLayer() - 1]);
                    section = section - 1;
                    scrollBehavior = "smooth"
                    map.addLayer(layers[section]);
                    map.setView(center, zoom);
                }
            }
            //leaves section from bottom, changes to next section
            else if(document.getElementById(text).scrollTop >= (document.getElementById(texts[section + 1]).offsetTop - 80)){
                map.removeLayer(layers[controlLayers.getCurrentLayer() - 1]);
                section = section + 1;
                scrollBehavior = "smooth"
                map.addLayer(layers[section]);
                map.setView(center, zoom);
            }
        };
    }

});

//factory
L.narrativeIntegration = function (){
    return new L.NarrativeIntegration();
}


function readJsonData(id, dataPath){
    var promises=[]
    fetch(dataPath)
        .then(res => res.json())
        .then(data => {
            data = data["es"];
            for(i = 0; i< Object.keys(data).length;i++){
                for(j = 0; j< Object.keys(data[i]).length; j++){
                    var promise = searchInText(id, data[i][j]);
                    promises.push(promise);
                }
            }
            Promise.all(promises).then(values =>{
                for(let i= 0; i < values.length;i++){
                    console.log(values);
                    classes = document.getElementsByClassName(values[i][0]);
                    for (let j = 0; j < classes.length; j++) {
                        classes[j].style.background = "#EF5B47";
                        classes[j].style.opacity = 0.7;
                        classes[j].addEventListener("click", function(){map.flyTo([values[i][1], values[i][2]], 20);});
                        classes[j].addEventListener("mouseover", function(){this.style.background = "#ed978c";});
                        classes[j].addEventListener("mouseleave", function(){this.style.background = "#EF5B47";});
                    }
                }
                
            });
        })
    
}



function searchInText (id, path) {
    const promise = fetch("/data_json/" + path + ".json")
        .then(res => res.json())
        .then(data => { 
            let name = data.features[0].properties.Name;
            
            let lng = data.features[0].geometry.coordinates[0][0][0][0];
            let lat = data.features[0].geometry.coordinates[0][0][0][1];
            //name = name.normalize("NFD").replace(/[^a-zA-Z ]/g, "");
            console.log(name);
            name = name.toLowerCase();
            //console.log(name);
            html = document.getElementById(id).innerHTML;
            //---Eliminar los spans
            html = html.replace(/<span class="finded">(.*?)<\/span>/g, "$1");

            //---Crear la expresión regular que buscará la palabra
            var reg = new RegExp(name.replace(/[\[\]\(\)\{\}\.\-\?\*\+]/, "\\$&"), "gi");
            var htmlreg = /<\/?(?:a|b|br|em|font|img|p|span|strong)[^>]*?\/?>/g;

            //---Añadir los spans var array;
            var htmlarray;
            var len = 0;
            var sum = 0;
            var pad = 28 + name.length;
            let nameClass = name.normalize("NFD").replace(/[^a-zA-Z]/g, "");

            while ((array = reg.exec(html)) != null) {

                htmlarray = htmlreg.exec(html);

                //---Verificar si la búsqueda coincide con una etiqueta html 
                if (htmlarray != null && htmlarray.index < array.index && htmlarray.index + htmlarray[0].length > array.index + name.length) { 
                    reg.lastIndex = htmlarray.index + htmlarray[0].length; 
                    continue;
                }

                len = array.index + name.length;
                //html = html.slice(0, array.index) + "<span class='" + nameClass + "'>" + html.slice(array.index, len) + "</span>" + html.slice(len, html.length);
                //html = html.slice(0, array.index) + "<button type='button'>" + html.slice(array.index, len) + "</button>" + html.slice(len, html.length);
                html = html.slice(0, array.index) + "<a class='" + nameClass + "'>" + html.slice(array.index, len) + "</a>" + html.slice(len, html.length);
                

                reg.lastIndex += pad;

                if (htmlarray != null) htmlreg.lastIndex = reg.lastIndex;    
                sum++;

            }

            document.getElementById(id).innerHTML = html;
            
            
            
            return [nameClass, lat, lng];
        }
    );
    return promise;
}

//map.flyTo([lat, lng], 20);