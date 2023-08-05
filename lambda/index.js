/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const DOCUMENT_ID = ["Bienvenida","holamundo","help","despedida","error","categorias","elegir","datos"];
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const IDVH = ["vh1","ups"];
var persistenceAdapter = getPersistenceAdapter();
function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'say_name_table';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}

var contvh=0;
var contlla=0;
var contfa=0;
var contdata=0;
const datasource = {
    "helloWorldDataSource": {
        "primaryText": "Hola mundooooooo!",
        "secondaryText": "Welcome to alexa presentation",
        "color": "@colorRed800"
    },
    "msgBienvenida": {
        "texto": "Hola!, bienvenido a dino juguetes, estoy aqui para brindarte información sobre nuestros juguetes, ¿te gustaría saber la información?",
    },
    "juguetesDataSource": {
        "titulo": "",
        "contenido": "",
        "imagenSource": ""
    },
    "Therizinosaurus": {
        "titulo": "Figura de acción de Therizinosaurus",
        "contenido": "Figura de acción de Therizinosaurus con sonido de rugido incluido. Tiene puntos de articulación en manos, brazos y piernas, TIENE UN COSTO DE $650.",
        "imagenSource": "https://m.media-amazon.com/images/I/61GiUvvtqwL.jpg"
    },
    "brontosaurio": {
        "titulo": "Figura de accion de brontosaurio",
        "contenido": "Figura de accion de Brontosaurio articulado en las 4 patas, cuenta con sonido de rugidos y movimiento de la cola, SU PRECIO ES DE $1200",
        "imagenSource": "https://ss424.liverpool.com.mx/xl/1096693083.jpg"
    },
    "llaveroBrontosaurio": {
        "titulo": "LLavero de brontosaurio pequeño",
        "contenido": "Llavero con un pequeño brontosaurio, ideal para llevar como accesorio en la mochila, cuenta con un seguro en forma de gancho para colocarlo en la parte que quiereas, SU PRECIO ES DE $40",
        "imagenSource": "https://img.ltwebstatic.com/images3_pi/2021/06/17/1623899415478cf5bee212abaff5753ef77a0dcbad.webp"
    },
    "llaveroTrex": {
        "titulo": "LLavero de T-Rex",
        "contenido": "Llavero de T-Rex flexible, ideal para llevar como accesorio en la mochila, cuenta con un seguro en forma de aro para colocarlo en la parte que quiereas, SU PRECIO ES DE $50",
        "imagenSource": "https://i.etsystatic.com/21982949/r/il/6bf017/3398343507/il_570xN.3398343507_iyxd.jpg"
    },
    "vehiculoBlindado": {
        "titulo": "Vehiculo blindado del mundo jurasico",
        "contenido": "Vehiculo de camion blindado todo terreno, de un gran tamaño, tiene tracción 4x4. Color gris, manejable con control remoto y puede manejarse en todo tipo de terreno, TIENE UN PRECIO DE $900",
        "imagenSource": "https://m.media-amazon.com/images/I/81sXfUyR8cL._AC_UF894,1000_QL80_.jpg"
    },
    "vehiculoMecanico": {
        "titulo": "Coche jurasico mecanico",
        "contenido": "Vehiculo jurasico todo terreno, de un tamaño mediano, con frente de T-Rex. Color gris, manejable con control remoto y puede manejarse en todo tipo de terreno, TIENE UN PRECIO DE $400",
        "imagenSource": "https://i5.walmartimages.com.mx/mg/gm/3pp/asr/9df72f6d-2602-454a-b8f9-f9f38a4c3b3b.8e9990c05cd1170643d97103a19bf583.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
    },
    "bienvenidaData":{
        "texto":"Hola!, Bienvenido a dino juguetes, estoy aqui para brindarte información sobre nuestros juguetes, ¿te gustaría saber la información?"
    },
    "categoriaData": {
        "titulo": "Selecciona una categoria",
        "vehiculos": "1.- Vehiculos",
        "llaveros": "2.- Llaveros",
        "figuras": "3.- Fuguras de acción"
    },
    "elegirData": {
        "texto": "Entiendo, Puedes consultar cuando quieras diciendo si quiero o puedes finalizar diciendo Adiós"
    },
    "upsData": {
        "texto": "Al parecer son todos los juguets disponibles en esta categoría"
    },
    "ayudaData": {
            "texto": "Parece que algo no está muy claro, ¿Necesitas ayuda con algo?"
    },
    "despedidaData": {
        "texto": "Hasta luego, Nos vemos pronto"
    },
    "datosDataSource":{
         "titulo": "LLavero de brontosaurio pequeño",
        "contenido": "Llavero con un pequeño brontosaurio, ideal para llevar como accesorio en la mochila, cuenta con un seguro en forma de gancho para colocarlo en la parte que quiereas, SU PRECIO ES DE $40",
        "imagenSource": "https://img.ltwebstatic.com/images3_pi/2021/06/17/1623899415478cf5bee212abaff5753ef77a0dcbad.webp"    
    }
};
const languageStrings = {
    es : {
        translation : {
            BIENVENIDA: "Hola! %s, Bienvenido a dino juguetes, estoy aqui para brindarte información sobre nuestros juguetes, ¿te gustaría saber la información? o consultar datos sobre los dinosaurios.",
            COMENZAR:"Antes de comenzar dime tu nombre",
            SELECCIONA:"Selecciona entre una de las categorías, 1. Vehiculos, 2. Llaveros o 3. Figuras de acción",
            DECIRADIOS:"Entiendo, Puedes consultar cuando quieras diciendo sí quiero, o puedes finalizar diciendo Adiós",
            VH:"1.- Vehiculos",
            LL:"2.- Llaveros",
            FA:"3.- Figuras de acción",
            TITULO:"Selecciona una categoría",
            MOSTRAROTRA:"¿Deseas que te muestre otro juguete de esta u otra categoría?",
            TITULOTherizinosaurus:"Figura de acción de Therizinosaurus",
            CONTENIDOTherizinosaurus:"Figura de acción de Therizinosaurus con sonido de rugido incluido. Tiene puntos de articulación en manos, brazos y piernas, TIENE UN COSTO DE $650.",
            TITULOBrontosaurio:"Figura de accion de brontosaurio",
            CONTENIDOBrontosaurio:"Figura de accion de Brontosaurio articulado en las 4 patas, cuenta con sonido de rugidos y movimiento de la cola, SU PRECIO ES DE $1200",
            ACABARON:"Al parecer son todos los juguetes disponibles en esta categoría, si gustas puedo mostrarte nuevamente los juguetes de esta categoría u otras desde el principio",
            TITULOLLT:"LLavero de brontosaurio pequeño",
            TITULOLLB:"LLavero de T-Rex",
            CONTENIDOLLT:"Llavero de T-Rex flexible, ideal para llevar como accesorio en la mochila, cuenta con un seguro en forma de aro para colocarlo en la parte que quiereas, SU PRECIO ES DE $50",
            CONTENIDOLLB:"Llavero con un pequeño brontosaurio, ideal para llevar como accesorio en la mochila, cuenta con un seguro en forma de gancho para colocarlo en la parte que quiereas, SU PRECIO ES DE $40",
            TITULOVHB:"Vehiculo blindado del mundo jurasico",
            TITULOVHM:"Coche jurasico mecanico",
            CONTENIDOVHB:"Vehiculo de camion blindado todo terreno, de un gran tamaño, tiene tracción 4x4. Color gris, manejable con control remoto y puede manejarse en todo tipo de terreno, TIENE UN PRECIO DE $900",
            CONTENIDOVHM:"Vehiculo jurasico todo terreno, de un tamaño mediano, con frente de T-Rex. Color gris, manejable con control remoto y puede manejarse en todo tipo de terreno, TIENE UN PRECIO DE $400",
            MSGNOMBRE:"Recordaré que tu nombre es: ",
            MSGRECORDAR:"Puedes indicarme cual es tu nombre",
            AYUDA:"¿En que te puedo ayudar?",
            DESPEDIDA:"Hasta luego, Nos vemos pronto",
            ACABRON2:"Al parecer son todos los juguetes disponibles en esta categoría",
            BRACHIOT:"El Brachiosaurus era un dinosaurio herbívoro que vivió durante el período Jurásico, hace aproximadamente 154 a 153 millones de años. Las estimaciones sugieren que podía medir alrededor de 25 metros de largo y alcanzar alturas de unos 13 metros.",
            BRACHIOI:"https://i.pinimg.com/originals/1a/79/e1/1a79e1e53a17c515a137fdfd3ae436f3.png",
            TREXT:"El Tyrannosaurus rex, también conocido como T-rex, fue uno de los dinosaurios carnívoros más grandes y feroces que existieron. Vivieron durante el período Cretácico, hace aproximadamente 68 a 66 millones de años. Tenían una longitud de hasta 12-15 metros.",
            TREXI:"https://assets.stickpng.com/images/5887bb7cbc2fc2ef3a186029.png",
            TRIT:"El Triceratops era un dinosaurio herbívoro que vivió durante el período Cretácico, hace aproximadamente 68 a 66 millones de años. Tenía un cuerpo grande y pesado, alcanzando una longitud de hasta 9 metros y una altura de unos 3 metros en los hombros.",
            TRII:"https://static.vecteezy.com/system/resources/previews/008/844/237/original/triceratops-dinosaur-on-white-background-clipping-path-png.png",
            EXTRA:" ¿Desea que le muestre mas información?",
            MSGUNACAT:"Selecciona unicamente entre las categorías 1, 2 o 3",
            MSGREALI:"indique que desea realizar"
            
            
        }
    },
    en : {
        translation : {
            BIENVENIDA: "Hello! %s, Welcome to dino toys, I am here to provide you with information about our toys, would you like to know the information? or consult facts about dinosaurs",
            COMENZAR:"Before we start tell me your name",
            SELECCIONA:"Select from one of the categories, 1. Vehicles, 2. Keychains or 3. Action Figures",
            DECIRADIOS:"I understand You can consult whenever you want by saying if I want or you can end by saying Goodbye",
            VH:"1.- Vehicles",
            LL:"2.- Keychains",
            FA:"3.- Action figures",
            TITULO:"Select a category",
            MOSTRAROTRA:"Do you want me to show you another toy from this or another category?",
            TITULOTherizinosaurus:"Therizinosaurus Action Figure",
            CONTENIDOTherizinosaurus:"Therizinosaurus action figure with roaring sound included. It has points of articulation in hands, arms and legs, IT HAS A COST OF $38",
            TITULOBrontosaurio:"Brontosaurus Action Figure",
            CONTENIDOBrontosaurio: "Brontosaurus action figure articulated on all 4 legs, it has roaring sounds and tail movement, ITS PRICE IS $70",
            ACABARON:"Apparently they are all the toys available in this category, if you like I can show you again the toys of this category or others from the beginning",
            TITULOLLT:"T Rex Keychain",
            TITULOLLB:"Small Brontosaurus Keychain",
            CONTENIDOLLT:"Flexible T-Rex keychain, ideal to carry as an accessory in your backpack, it has a ring-shaped insurance to place it in the part you want, ITS PRICE IS $3",
            CONTENIDOLLB:"Keychain with a small brontosaurus, ideal to carry as an accessory in your backpack, it has a hook-shaped lock to place it in the part you want, ITS PRICE IS $2",
            TITULOVHB:"Jurassic World Armored Vehicle",
            TITULOVHM:"mechanical jurassic car",
            CONTENIDOVHM:"Jurassic all-terrain vehicle, medium size, with a T-Rex front. Gray color, manageable with remote control and can be driven on all types of terrain, IT HAS A PRICE OF $24",
            CONTENIDOVHB:"All-terrain armored truck vehicle, large, has 4x4 traction. Gray color, manageable with remote control and can be driven on all types of terrain, IT HAS A PRICE OF $53",
            MSGNOMBRE:"I will remember that your name is:",
            MSGRECORDAR:"Can you tell me what your name is",
            AYUDA:"How can I help you?",
            DESPEDIDA:"Goodbye, see you soon",
            ACABRON2:"Apparently they are all the toys available in this category",
            BRACHIOT: "The Brachiosaurus was a herbivorous dinosaur that lived during the Jurassic period, approximately 154 to 153 million years ago. Estimates suggest that it could measure around 25 meters in length and reach heights of about 13 meters.",
            BRACHIOI:"https://i.pinimg.com/originals/1a/79/e1/1a79e1e53a17c515a137fdfd3ae436f3.png",
            TREXT: "The Tyrannosaurus rex, also known as T. rex, was one of the largest and most ferocious carnivorous dinosaurs that ever lived. They lived during the Cretaceous period, approximately 68 to 66 million years ago. They were up to 12-15 m in length meters.",
            TREXI:"https://assets.stickpng.com/images/5887bb7cbc2fc2ef3a186029.png",
            TRIT: "Triceratops was a herbivorous dinosaur that lived during the Cretaceous period, approximately 68 to 66 million years ago. It had a large and heavy body, reaching a length of up to 9 meters and a height of about 3 meters at the shoulders. ",
            TRII:"https://static.vecteezy.com/system/resources/previews/008/844/237/original/triceratops-dinosaur-on-white-background-clipping-path-png.png",
            EXTRA:" Do you want me to show you more information?",
            MSGUNACAT:"Select only between categories 1, 2 or 3",
            MSGREALI:"indicate what you want to do"
            
            
        }
    }
}

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const name = sessionAttributes['name'];

        
        let speechText = requestAttributes.t('COMENZAR');
        datasource['bienvenidaData']['texto']=speechText;

        if(name){
            speechText = requestAttributes.t('BIENVENIDA',name);
            datasource['bienvenidaData']['texto']=speechText;
            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID[0], datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
            }
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const respuestaHandler = {
      canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'resp';
    },
    handle(handlerInput) {
        const respuesta=handlerInput.requestEnvelope.request.intent.slots.res.value;
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        let speakOutput;
        var type;
        if(respuesta === "si" || respuesta==="yes"){
            speakOutput = requestAttributes.t('SELECCIONA');
            datasource['categoriaData']['titulo']=requestAttributes.t('TITULO');
            datasource['categoriaData']['Vehiculos']=requestAttributes.t('VH');
            datasource['categoriaData']['llaveros']=requestAttributes.t('LL');
            datasource['categoriaData']['figuras']=requestAttributes.t('FA')
            type=5;
        }else if(respuesta==="no"){
            speakOutput = requestAttributes.t('DECIRADIOS');
            datasource['elegirData']['texto']=speakOutput;
            type=6;
        }
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID[type], datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const datosHandler = {
      canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'datosIntent';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        let speakOutput;
        let type;
        if(contdata===0){
            
            datasource['datosDataSource']['titulo']="Tyrannosaurus rex";
            datasource['datosDataSource']['contenido']=requestAttributes.t('TREXT');
            datasource['datosDataSource']['imagenSource']=requestAttributes.t('TREXI');
            speakOutput=requestAttributes.t('TREXT')+requestAttributes.t('EXTRA');
            contdata=contdata+1;
        }else if(contdata===1){
            datasource['datosDataSource']['titulo']="Triceratops";
            datasource['datosDataSource']['contenido']=requestAttributes.t('TRIT');
            datasource['datosDataSource']['imagenSource']=requestAttributes.t('TRII');
            speakOutput=requestAttributes.t('TRIT')+requestAttributes.t('EXTRA');
            contdata=contdata+1;
        }else if(contdata===2){
            datasource['datosDataSource']['titulo']="Brachiosaurus";
            datasource['datosDataSource']['contenido']=requestAttributes.t('BRACHIOT');
            datasource['datosDataSource']['imagenSource']=requestAttributes.t('BRACHIOI');
            speakOutput=requestAttributes.t('BRACHIOT')+requestAttributes.t('EXTRA');
            contdata=0;
        }
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID[7], datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(requestAttributes.t('EXTRA'))
            .getResponse();
    }
};
const seleccionarHandler = {
      canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'seleccion';
    },
    handle(handlerInput) {
        const respuesta=handlerInput.requestEnvelope.request.intent.slots.cat.value;
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const otra=requestAttributes.t('MOSTRAROTRA')
        var respue=parseInt(respuesta);
        let speakOutput;
        var type;
        var type2;
        var type3;
        if(Number.isInteger(respue)){
            if(respue === 1){
                if(contvh===0){
                    type=0;
                    datasource['juguetesDataSource']['contenido']=requestAttributes.t('CONTENIDOVHM');
                    datasource['juguetesDataSource']['titulo']=requestAttributes.t('TITULOVHM')
                    datasource['juguetesDataSource']['imagenSource']=datasource.vehiculoMecanico.imagenSource;
                    speakOutput= requestAttributes.t('CONTENIDOVHM')+' '+otra;
                    contvh=contvh+1;
                }else if(contvh===1){
                    type=0;
                    datasource['juguetesDataSource']['contenido']=requestAttributes.t('CONTENIDOVHB');
                    datasource['juguetesDataSource']['titulo']=requestAttributes.t('TITULOVHB')
                    datasource['juguetesDataSource']['imagenSource']=datasource.vehiculoBlindado.imagenSource;
                    speakOutput= requestAttributes.t('CONTENIDOVHB')+', '+otra;
                    contvh=contvh+1;
                }
                else if(contvh>=2){
                    speakOutput=requestAttributes.t('ACABARON');
                    datasource['upsData']['texto']=requestAttributes.t('ACABRON2');
                    contvh=0;
                    type=1;
                }
                if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(IDVH[type], datasource);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
                }
            }else if(respue===2){
                if(contlla===0){
                    type2=0;
                    datasource['juguetesDataSource']['contenido']=requestAttributes.t('CONTENIDOLLB');
                    datasource['juguetesDataSource']['titulo']=requestAttributes.t('TITULOLLB')
                    datasource['juguetesDataSource']['imagenSource']=datasource.llaveroBrontosaurio.imagenSource;
                    speakOutput= requestAttributes.t('CONTENIDOLLT')+' '+otra;
                    //speakOutput= datasource['juguetesDataSource']['contenido']+' ¿Deseas que te muestre otro juguete de esta u otra categoria?';
                    contlla=contlla+1;
                }else if(contlla===1){
                    type2=0;
                    datasource['juguetesDataSource']['contenido']=requestAttributes.t('CONTENIDOLLT');
                    datasource['juguetesDataSource']['titulo']=requestAttributes.t('TITULOLLT')
                    datasource['juguetesDataSource']['imagenSource']=datasource.llaveroTrex.imagenSource;
                    speakOutput= requestAttributes.t('CONTENIDOLLT')+', '+otra;
                    contlla=contlla+1;
                }
                else if(contlla>=2){
                    speakOutput=requestAttributes.t('ACABARON');
                    datasource['upsData']['texto']=requestAttributes.t('ACABRON2');
                    contlla=0;
                    type2=1;
                }
                if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(IDVH[type2], datasource);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
                }
            }
            else if(respue===3){
                if(contfa===0){
                    type3=0;
                    datasource['juguetesDataSource']['contenido']=requestAttributes.t('CONTENIDOTherizinosaurus');
                    datasource['juguetesDataSource']['titulo']=requestAttributes.t('TITULOTherizinosaurus')
                    datasource['juguetesDataSource']['imagenSource']=datasource.Therizinosaurus.imagenSource;
                    speakOutput= requestAttributes.t('CONTENIDOTherizinosaurus')+' '+otra;
                    contfa=contfa+1;
                }else if(contfa===1){
                    type3=0;
                    datasource['juguetesDataSource']['contenido']=requestAttributes.t('CONTENIDOBrontosaurio');
                    datasource['juguetesDataSource']['titulo']=requestAttributes.t('TITULOBrontosaurio');
                    datasource['juguetesDataSource']['imagenSource']=datasource.brontosaurio.imagenSource;
                    speakOutput= requestAttributes.t('CONTENIDOBrontosaurio')+' '+otra;
                    contfa=contfa+1;
                }
                else if(contfa>=2){
                    speakOutput=requestAttributes.t('ACABARON');
                    datasource['upsData']['texto']=requestAttributes.t('ACABRON2');
                    contfa=0;
                    type3=1;
                }
                if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                // generate the APL RenderDocument directive that will be returned from your skill
                const aplDirective = createDirectivePayload(IDVH[type3], datasource);
                // add the RenderDocument directive to the responseBuilder
                handlerInput.responseBuilder.addDirective(aplDirective);
                }
            }else if(respue>=4){
                speakOutput=requestAttributes.t('MSGUNACAT')
                
            }else if(respue<1){
              speakOutput=requestAttributes.t('MSGUNACAT')   
            }
            
        }else{
            speakOutput=requestAttributes.t('MSGUNACAT')
        }
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RegisterNameIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'registrarNombre';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();

        const name = intent.slots.nombre.value;
        
        
        sessionAttributes['name'] = name;
        const speakOutput=requestAttributes.t('MSGNOMBRE')+name;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(requestAttributes.t('MSGRECORDAR'))
            .getResponse();
    }
};
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Bienvenido a este basto mundo de juegos y entretenimiento';
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID[1], datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        // send out skill response
         return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }

};

        

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('AYUDA');
        datasource['ayudaData']['texto']=speakOutput;
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID[2], datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('DESPEDIDA');
        datasource['despedidaData']['texto']=speakOutput;
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID[3], datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(requestAttributes.t('MSGREALI'))
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID[4], datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`)
    }
}

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`)
    }
}

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'es',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}
const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            //copy persistent attribute to session attributes
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);//is this a session end?
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterNameIntentHandler,
        datosHandler,
        respuestaHandler,
        seleccionarHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
            LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
            SaveAttributesResponseInterceptor)
    .addRequestInterceptors(LoggingRequestInterceptor, LocalizationInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withPersistenceAdapter(persistenceAdapter)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();