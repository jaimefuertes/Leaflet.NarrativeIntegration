# Leaflet.NarrativeIntegration
Leaflet plugin for narrative integration



#### Requirements
>
> - Leaflet v1.8.0.
> - Supports all browsers.

#### Demos
#### User guide
#### Code example
```javascript
//layers
var evolutionStages = {
"<strong>El lugar</strong>": thePlace,
"<strong>Antes del siglo XII</strong>": prerromanesqueSpaces,
"<strong>Del siglo XII al XV</strong>": romanesqueSpaces,
"<strong>Primera mitad del siglo XVI</strong>": firstHalf16thCentury,
"<strong>Segunda mitad del siglo XVI</strong>": secondHalf16thCentury,
"<strong>Primera mitad del siglo XVII</strong>": firstHalf17thCentury,
"<strong>Segunda mitad del siglo XVII</strong>": secondHalf17thCentury,
};

//text sections
var text = "left_column",
place = "marker01",
preroman = "marker02",
roman = "marker03",
first16 = "marker04",
second16 = "marker05",
first17 = "marker06",
second17 = "marker07";

texts = [place, preroman, roman, first16, second16, first17, second17];
layers = [thePlace, prerromanesqueSpaces, romanesqueSpaces, firstHalf16thCentury, secondHalf16thCentury, firstHalf17thCentury, secondHalf17thCentury];
		
	

let demo = L.narrativeIntegration();
demo.readJSONData("left_column", "./data_json/data.json");
demo.changeTextWithLayer(texts);
demo.changeLayerWithText(texts, layers);
```
#### API
|Method|Returns|Description|
|---|---|---|
|changeTextWithLayer(<string array> texts, <string options> textScrollBehaviour)|void|Allows users to change the text shown on screen when the layer is changed on the map control|
|changeLayerWithText(<string array> texts, <layer array> layers, <Number/Number options> center/zoom)|void|Allows users to change the layer when the text is scrolled while reading.|
|readJSONData(<string> id, <string> dataPath)|void|Allows users to link text data with map structures via regular expresions|
