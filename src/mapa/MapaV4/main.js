let divMapa = document.getElementById("divMapa");
let sizeMap = document.getElementById("sizeMap");
let contentMapa = document.getElementById("contentMapa");
let divPuntosUbicacion = document.getElementById("divPuntosUbicacion");
let divMainDivMapa = document.getElementById("divMainDivMapa");
let mainDivMapa = document.getElementById("mainDivMapa");
let departamentos = document.querySelectorAll(".element-departament");
let municipios = document.querySelectorAll(".municipio");
let tittleElement = document.getElementById("tittleElement");
let zoomPunto = 20 / window.screen.availWidth;
let departamentoFocus;
let focusDepartamento = "";
const heightMap = mainDivMapa.scrollHeight;
const widthMap = mainDivMapa.scrollWidth;
let lastScale = 1;
let lastFocusMunicipio = 0;
let lastHeight = 0;
let lastWidth = 0;
let focusElementDepartment = "";
let widthPoint = 100;
let lastWidthPoint = 100;
let less = 0
let lessPorcent = 1;
let lassClientX = 0;
let lassClienty = 0;
let clikeableStatus = true
const departamentosName = [];
const municipiosName = {};
///Configuracion inicial para el contenedor del mapa
mainDivMapa.style.width = divMapa.scrollWidth + "px";
mainDivMapa.style.height = divMapa.scrollHeight + "px";
const userAgent = navigator.userAgent;
const android = /Android/.test(userAgent);
const heightSizeLess = android ? 10 : 84;
let zoom = window.screen.availHeight > window.screen.availWidth ? ((window.screen.availWidth) / divMapa.scrollWidth) * 100 : ((window.screen.availHeight - heightSizeLess) / divMapa.scrollHeight) * 100;
let sizeLess = window.screen.availHeight > window.screen.availWidth ? 100000 : 0;
mainDivMapa.style.zoom = zoom + "%";

const widthDivMap = divMainDivMapa.scrollWidth;

function upperText(frase, limit) {

    if (frase) {
        const palabras = frase.split(" ");
        let resultado = palabras.map(function (word) {
            if (limit) {
                if (Number.isInteger(limit)) {
                    if (word.length > limit) {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    } else {
                        return word;
                    }
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1);

                }

            } else {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }

        });
        return resultado.join(" ");
    }
}

const nameElements = [
    "Amazonas",
    "Antioquia",
    "Arauca",
    "Atlántico",
    "Bolívar",
    "Boyacá",
    "Caldas",
    "Caquetá",
    "Casanare",
    "Cauca",
    "Cesar",
    "Chocó",
    "Córdoba",
    "Cundinamarca",
    "Güainia",
    "Guaviare",
    "Huila",
    "La Guajira",
    "Magdalena",
    "Meta",
    "Nariño",
    "Norte de Santander",
    "Putumayo",
    "Quindio",
    "Risaralda",
    "San Andrés y Providencia",
    "Santander",
    "Sucre",
    "Tolima",
    "Valle del Cauca",
    "Vaupés",
    "Vichada",
    "Leticia",
    "Puerto Nariño",
    "Abejorral",
    "Abriaquí",
    "Alejandria",
    "Amagá",
    "Amalfi",
    "Andes",
    "Angelópolis",
    "Angostura",
    "Anorí",
    "Anzá",
    "Apartadó",
    "Arboletes",
    "Argelia",
    "Armenia",
    "Barbosa",
    "Bello",
    "Belmira",
    "Betania",
    "Betulia",
    "Bolívar",
    "Briceño",
    "Burítica",
    "Caicedo",
    "Caldas",
    "Campamento",
    "Caracolí",
    "Caramanta",
    "Carepa",
    "Carmen de Viboral",
    "Carolina",
    "Caucasia",
    "Cañasgordas",
    "Chigorodó",
    "Cisneros",
    "Cocorná",
    "Concepción",
    "Concordia",
    "Copacabana",
    "Cáceres",
    "Dabeiba",
    "Don Matías",
    "Ebéjico",
    "El Bagre",
    "Entrerríos",
    "Envigado",
    "Fredonia",
    "Frontino",
    "Giraldo",
    "Girardota",
    "Granada",
    "Guadalupe",
    "Guarne",
    "Guatapé",
    "Gómez Plata",
    "Heliconia",
    "Hispania",
    "Itagüí",
    "Ituango",
    "Jardín",
    "Jericó",
    "La Ceja",
    "La Estrella",
    "La Pintada",
    "La Unión",
    "Liborina",
    "Maceo",
    "Marinilla",
    "Medellín",
    "Montebello",
    "Murindó",
    "Mutatá",
    "Nariño",
    "Nechí",
    "Necoclí",
    "Olaya",
    "Peque",
    "Peñol",
    "Pueblorrico",
    "Puerto Berrío",
    "Puerto Nare",
    "Puerto Triunfo",
    "Remedios",
    "Retiro",
    "Ríonegro",
    "Sabanalarga",
    "Sabaneta",
    "Salgar",
    "San Andrés de Cuerquía",
    "San Carlos",
    "San Francisco",
    "San Jerónimo",
    "San José de Montaña",
    "San Juan de Urabá",
    "San Luís",
    "San Pedro",
    "San Pedro de Urabá",
    "San Rafael",
    "San Roque",
    "San Vicente",
    "Santa Bárbara",
    "Santa Fé de Antioquia",
    "Santa Rosa de Osos",
    "Santo Domingo",
    "Santuario",
    "Segovia",
    "Sonsón",
    "Sopetrán",
    "Tarazá",
    "Tarso",
    "Titiribí",
    "Toledo",
    "Turbo",
    "Támesis",
    "Uramita",
    "Urrao",
    "Valdivia",
    "Valparaiso",
    "Vegachí",
    "Venecia",
    "Vigía del Fuerte",
    "Yalí",
    "Yarumal",
    "Yolombó",
    "Yondó",
    "Zaragoza",
    "Arauca",
    "Arauquita",
    "Cravo Norte",
    "Fortúl",
    "Puerto Rondón",
    "Saravena",
    "Tame",
    "Baranoa",
    "Barranquilla",
    "Campo de la Cruz",
    "Candelaria",
    "Galapa",
    "Juan de Acosta",
    "Luruaco",
    "Malambo",
    "Manatí",
    "Palmar de Varela",
    "Piojo",
    "Polonuevo",
    "Ponedera",
    "Puerto Colombia",
    "Repelón",
    "Sabanagrande",
    "Sabanalarga",
    "Santa Lucía",
    "Santo Tomás",
    "Soledad",
    "Suan",
    "Tubará",
    "Usiacuri",
    "Achí",
    "Altos del Rosario",
    "Arenal",
    "Arjona",
    "Arroyohondo",
    "Barranco de Loba",
    "Calamar",
    "Cantagallo",
    "Cartagena",
    "Cicuco",
    "Clemencia",
    "Córdoba",
    "El Carmen de Bolívar",
    "El Guamo",
    "El Peñon",
    "Hatillo de Loba",
    "Magangué",
    "Mahates",
    "Margarita",
    "María la Baja",
    "Mompós",
    "Montecristo",
    "Morales",
    "Norosí",
    "Pinillos",
    "Regidor",
    "Río Viejo",
    "San Cristobal",
    "San Estanislao",
    "San Fernando",
    "San Jacinto",
    "San Jacinto del Cauca",
    "San Juan de Nepomuceno",
    "San Martín de Loba",
    "San Pablo",
    "Santa Catalina",
    "Santa Rosa",
    "Santa Rosa del Sur",
    "Simití",
    "Soplaviento",
    "Talaigua Nuevo",
    "Tiquisio (Puerto Rico)",
    "Turbaco",
    "Turbaná",
    "Villanueva",
    "Zambrano",
    "Almeida",
    "Aquitania",
    "Arcabuco",
    "Belén",
    "Berbeo",
    "Beteitiva",
    "Boavita",
    "Boyacá",
    "Briceño",
    "Buenavista",
    "Busbanza",
    "Caldas",
    "Campohermoso",
    "Cerinza",
    "Chinavita",
    "Chiquinquirá",
    "Chiscas",
    "Chita",
    "Chitaraque",
    "Chivatá",
    "Chíquiza",
    "Chívor",
    "Ciénaga",
    "Coper",
    "Corrales",
    "Covarachía",
    "Cubará",
    "Cucaita",
    "Cuitiva",
    "Cómbita",
    "Duitama",
    "El Cocuy",
    "El Espino",
    "Firavitoba",
    "Floresta",
    "Gachantivá",
    "Garagoa",
    "Guacamayas",
    "Guateque",
    "Guayatá",
    "Guicán",
    "Gámeza",
    "Izá",
    "Jenesano",
    "Jericó",
    "La Capilla",
    "La Uvita",
    "La Victoria",
    "Labranzagrande",
    "Macanal",
    "Maripí",
    "Miraflores",
    "Mongua",
    "Monguí",
    "Moniquirá",
    "Motavita",
    "Muzo",
    "Nobsa",
    "Nuevo Colón",
    "Oicatá",
    "Otanche",
    "Pachavita",
    "Paipa",
    "Pajarito",
    "Panqueba",
    "Pauna",
    "Paya",
    "Paz de Río",
    "Pesca",
    "Pisva",
    "Puerto Boyacá",
    "Páez",
    "Quipama",
    "Ramiriquí",
    "Rondón",
    "Ráquira",
    "Saboyá",
    "Samacá",
    "San Eduardo",
    "San José de Pare",
    "San Luís de Gaceno",
    "San Mateo",
    "San Miguel de Sema",
    "San Pablo de Borbur",
    "Santa María",
    "Santa Rosa de Viterbo",
    "Santa Sofía",
    "Santana",
    "Sativanorte",
    "Sativasur",
    "Siachoque",
    "Soatá",
    "Socha",
    "Socotá",
    "Sogamoso",
    "Somondoco",
    "Sora",
    "Soracá",
    "Sotaquirá",
    "Susacón",
    "Sutamarchán",
    "Sutatenza",
    "Sáchica",
    "Tasco",
    "Tenza",
    "Tibaná",
    "Tibasosa",
    "Tinjacá",
    "Tipacoque",
    "Toca",
    "Toguí",
    "Topagá",
    "Tota",
    "Tunja",
    "Tunungua",
    "Turmequé",
    "Tuta",
    "Tutasá",
    "Ventaquemada",
    "Villa de Leiva",
    "Viracachá",
    "Zetaquirá",
    "Úmbita",
    "Aguadas",
    "Anserma",
    "Aranzazu",
    "Belalcázar",
    "Chinchiná",
    "Filadelfia",
    "La Dorada",
    "La Merced",
    "La Victoria",
    "Manizales",
    "Manzanares",
    "Marmato",
    "Marquetalia",
    "Marulanda",
    "Neira",
    "Norcasia",
    "Palestina",
    "Pensilvania",
    "Pácora",
    "Risaralda",
    "Río Sucio",
    "Salamina",
    "Samaná",
    "San José",
    "Supía",
    "Villamaría",
    "Viterbo",
    "Albania",
    "Belén de los Andaquíes",
    "Cartagena del Chairá",
    "Curillo",
    "El Doncello",
    "El Paujil",
    "Florencia",
    "La Montañita",
    "Milán",
    "Morelia",
    "Puerto Rico",
    "San José del Fragua",
    "San Vicente del Caguán",
    "Solano",
    "Solita",
    "Valparaiso",
    "Aguazul",
    "Chámeza",
    "Hato Corozal",
    "La Salina",
    "Maní",
    "Monterrey",
    "Nunchía",
    "Orocué",
    "Paz de Ariporo",
    "Pore",
    "Recetor",
    "Sabanalarga",
    "San Luís de Palenque",
    "Sácama",
    "Tauramena",
    "Trinidad",
    "Támara",
    "Villanueva",
    "Yopal",
    "Almaguer",
    "Argelia",
    "Balboa",
    "Bolívar",
    "Buenos Aires",
    "Cajibío",
    "Caldono",
    "Caloto",
    "Corinto",
    "El Tambo",
    "Florencia",
    "Guachené",
    "Guapí",
    "Inzá",
    "Jambaló",
    "La Sierra",
    "La Vega",
    "López",
    "Mercaderes",
    "Miranda",
    "Morales",
    "Padilla",
    "Patía",
    "Piamonte",
    "Piendamó",
    "Popayán",
    "Puerto Tejada",
    "Puracé",
    "Páez",
    "Rosas",
    "San Sebastián",
    "Santa Rosa",
    "Santander de Quilichao",
    "Silvia",
    "Sotara",
    "Sucre",
    "Suárez",
    "Timbiquí",
    "Timbío",
    "Toribío",
    "Totoró",
    "Villa Rica",
    "Aguachica",
    "Agustín Codazzi",
    "Astrea",
    "Becerríl",
    "Bosconia",
    "Chimichagua",
    "Chiriguaná",
    "Curumaní",
    "El Copey",
    "El Paso",
    "Gamarra",
    "Gonzalez",
    "La Gloria",
    "La Jagua de Ibirico",
    "La Paz ",
    "Manaure Balcón del Cesar",
    "Pailitas",
    "Pelaya",
    "Pueblo Bello",
    "Río de oro",
    "San Alberto",
    "San Diego",
    "San Martín",
    "Tamalameque",
    "Valledupar",
    "Acandí",
    "Alto Baudó",
    "Atrato",
    "Bagadó",
    "Bahía Solano",
    "Bajo Baudó",
    "Belén de Bajirá",
    "Bojayá",
    "Cantón de San Pablo",
    "Carmen del Darién",
    "Condoto",
    "Cértegui",
    "El Carmen de Atrato",
    "Istmina",
    "Juradó",
    "Lloró",
    "Medio Atrato",
    "Medio Baudó",
    "Medio San Juan",
    "Novita",
    "Nuquí",
    "Quibdó",
    "Río Iró",
    "Río Quito",
    "Ríosucio",
    "San José del Palmar",
    "Santa Genoveva de Docorodó",
    "Sipí",
    "Tadó",
    "Unguía",
    "Unión Panamericana",
    "Ayapel",
    "Buenavista",
    "Canalete",
    "Cereté",
    "Chimá",
    "Chinú",
    "Ciénaga de Oro",
    "Cotorra",
    "La Apartada y La Frontera",
    "Lorica",
    "Los Córdobas",
    "Momil",
    "Montelíbano",
    "Monteria",
    "Moñitos",
    "Planeta Rica",
    "Pueblo Nuevo",
    "Puerto Escondido",
    "Puerto Libertador",
    "Purísima",
    "Sahagún",
    "San Andrés Sotavento",
    "San Antero",
    "San Bernardo del Viento",
    "San Carlos",
    "San José de Uré",
    "San Pelayo",
    "Tierralta",
    "Tuchín",
    "Valencia",
    "Agua de Dios",
    "Albán",
    "Anapoima",
    "Anolaima",
    "Apulo",
    "Arbeláez",
    "Beltrán",
    "Bituima",
    "Bogotá D.C.",
    "Bojacá",
    "Cabrera",
    "Cachipay",
    "Cajicá",
    "Caparrapí",
    "Carmen de Carupa",
    "Chaguaní",
    "Chipaque",
    "Choachí",
    "Chocontá",
    "Chía",
    "Cogua",
    "Cota",
    "Cucunubá",
    "Cáqueza",
    "El Colegio",
    "El Peñón",
    "El Rosal",
    "Facatativá",
    "Fosca",
    "Funza",
    "Fusagasugá",
    "Fómeque",
    "Fúquene",
    "Gachalá",
    "Gachancipá",
    "Gachetá",
    "Gama",
    "Girardot",
    "Granada",
    "Guachetá",
    "Guaduas",
    "Guasca",
    "Guataquí",
    "Guatavita",
    "Guayabal de Siquima",
    "Guayabetal",
    "Gutiérrez",
    "Jerusalén",
    "Junín",
    "La Calera",
    "La Mesa",
    "La Palma",
    "La Peña",
    "La Vega",
    "Lenguazaque",
    "Machetá",
    "Madrid",
    "Manta",
    "Medina",
    "Mosquera",
    "Nariño",
    "Nemocón",
    "Nilo",
    "Nimaima",
    "Nocaima",
    "Pacho",
    "Paime",
    "Pandi",
    "Paratebueno",
    "Pasca",
    "Puerto Salgar",
    "Pulí",
    "Quebradanegra",
    "Quetame",
    "Quipile",
    "Ricaurte",
    "San Antonio de Tequendama",
    "San Bernardo",
    "San Cayetano",
    "San Francisco",
    "San Juan de Río Seco",
    "Sasaima",
    "Sesquilé",
    "Sibaté",
    "Silvania",
    "Simijaca",
    "Soacha",
    "Sopó",
    "Subachoque",
    "Suesca",
    "Supatá",
    "Susa",
    "Sutatausa",
    "Tabio",
    "Tausa",
    "Tena",
    "Tenjo",
    "Tibacuy",
    "Tibirita",
    "Tocaima",
    "Tocancipá",
    "Topaipí",
    "Ubalá",
    "Ubaque",
    "Ubaté",
    "Une",
    "Venecia",
    "Vergara",
    "Viani",
    "Villagómez",
    "Villapinzón",
    "Villeta",
    "Viotá",
    "Yacopí",
    "Zipacón",
    "Zipaquirá",
    "Útica",
    "Inírida",
    "Calamar",
    "El Retorno",
    "Miraflores",
    "San José del Guaviare",
    "Acevedo",
    "Agrado",
    "Aipe",
    "Algeciras",
    "Altamira",
    "Baraya",
    "Campoalegre",
    "Colombia",
    "Elías",
    "Garzón",
    "Gigante",
    "Guadalupe",
    "Hobo",
    "Isnos",
    "La Argentina",
    "La Plata",
    "Neiva",
    "Nátaga",
    "Oporapa",
    "Paicol",
    "Palermo",
    "Palestina",
    "Pital",
    "Pitalito",
    "Rivera",
    "Saladoblanco",
    "San Agustín",
    "Santa María",
    "Suaza",
    "Tarqui",
    "Tello",
    "Teruel",
    "Tesalia",
    "Timaná",
    "Villavieja",
    "Yaguará",
    "Íquira",
    "Albania",
    "Barrancas",
    "Dibulla",
    "Distracción",
    "El Molino",
    "Fonseca",
    "Hatonuevo",
    "La Jagua del Pilar",
    "Maicao",
    "Manaure",
    "Riohacha",
    "San Juan del Cesar",
    "Uribia",
    "Urumita",
    "Villanueva",
    "Algarrobo",
    "Aracataca",
    "Ariguaní",
    "Cerro San Antonio",
    "Chivolo",
    "Ciénaga",
    "Concordia",
    "El Banco",
    "El Piñon",
    "El Retén",
    "Fundación",
    "Guamal",
    "Nueva Granada",
    "Pedraza",
    "Pijiño",
    "Pivijay",
    "Plato",
    "Puebloviejo",
    "Remolino",
    "Sabanas de San Angel",
    "Salamina",
    "San Sebastián de Buenavista",
    "San Zenón",
    "Santa Ana",
    "Santa Bárbara de Pinto",
    "Santa Marta",
    "Sitionuevo",
    "Tenerife",
    "Zapayán",
    "Zona Bananera",
    "Acacías",
    "Barranca de Upía",
    "Cabuyaro",
    "Castilla la Nueva",
    "Cubarral",
    "Cumaral",
    "El Calvario",
    "El Castillo",
    "El Dorado",
    "Fuente de Oro",
    "Granada",
    "Guamal",
    "Lejanías",
    "Mapiripan",
    "Mesetas",
    "Puerto Concordia",
    "Puerto Gaitán",
    "Puerto Lleras",
    "Puerto López",
    "Puerto Rico",
    "Restrepo",
    "San Carlos de Guaroa",
    "San Juan de Arama",
    "San Juanito",
    "San Martín",
    "Uribe",
    "Villavicencio",
    "Vista Hermosa",
    "Albán",
    "Aldana",
    "Ancuya",
    "Arboleda",
    "Barbacoas",
    "Belén",
    "Buesaco",
    "Chachaguí",
    "Colón",
    "Consaca",
    "Contadero",
    "Cuaspud",
    "Cumbal",
    "Cumbitara",
    "Córdoba",
    "El Charco",
    "El Peñol",
    "El Rosario",
    "El Tablón de Gómez",
    "El Tambo",
    "Francisco Pizarro",
    "Funes",
    "Guachavés",
    "Guachucal",
    "Guaitarilla",
    "Gualmatán",
    "Iles",
    "Imúes",
    "Ipiales",
    "La Cruz",
    "La Florida",
    "La Llanada",
    "La Tola",
    "La Unión",
    "Leiva",
    "Linares",
    "Magüi",
    "Mallama",
    "Mosquera",
    "Nariño",
    "Olaya Herrera",
    "Ospina",
    "Policarpa",
    "Potosí",
    "Providencia",
    "Puerres",
    "Pupiales",
    "Ricaurte",
    "Roberto Payán",
    "Samaniego",
    "San Bernardo",
    "San Juan de Pasto",
    "San Lorenzo",
    "San Pablo",
    "San Pedro de Cartago",
    "Sandoná",
    "Santa Bárbara",
    "Sapuyes",
    "Sotomayor",
    "Taminango",
    "Tangua",
    "Tumaco",
    "Túquerres",
    "Yacuanquer",
    "Arboledas",
    "Bochalema",
    "Bucarasica",
    "Chinácota",
    "Chitagá",
    "Convención",
    "Cucutilla",
    "Cáchira",
    "Cácota",
    "Cúcuta",
    "Durania",
    "El Carmen",
    "El Tarra",
    "El Zulia",
    "Gramalote",
    "Hacarí",
    "Herrán",
    "La Esperanza",
    "La Playa",
    "Labateca",
    "Los Patios",
    "Lourdes",
    "Mutiscua",
    "Ocaña",
    "Pamplona",
    "Pamplonita",
    "Puerto Santander",
    "Ragonvalia",
    "Salazar",
    "San Calixto",
    "San Cayetano",
    "Santiago",
    "Sardinata",
    "Silos",
    "Teorama",
    "Tibú",
    "Toledo",
    "Villa Caro",
    "Villa del Rosario",
    "Ábrego",
    "Colón",
    "Mocoa",
    "Orito",
    "Puerto Asís",
    "Puerto Caicedo",
    "Puerto Guzmán",
    "Puerto Leguízamo",
    "San Francisco",
    "San Miguel",
    "Santiago",
    "Sibundoy",
    "Valle del Guamuez",
    "Villagarzón",
    "Armenia",
    "Buenavista",
    "Calarcá",
    "Circasia",
    "Cordobá",
    "Filandia",
    "Génova",
    "La Tebaida",
    "Montenegro",
    "Pijao",
    "Quimbaya",
    "Salento",
    "Apía",
    "Balboa",
    "Belén de Umbría",
    "Dos Quebradas",
    "Guática",
    "La Celia",
    "La Virginia",
    "Marsella",
    "Mistrató",
    "Pereira",
    "Pueblo Rico",
    "Quinchía",
    "Santa Rosa de Cabal",
    "Santuario",
    "Providencia",
    "Aguada",
    "Albania",
    "Aratoca",
    "Barbosa",
    "Barichara",
    "Barrancabermeja",
    "Betulia",
    "Bolívar",
    "Bucaramanga",
    "Cabrera",
    "California",
    "Capitanejo",
    "Carcasí",
    "Cepita",
    "Cerrito",
    "Charalá",
    "Charta",
    "Chima",
    "Chipatá",
    "Cimitarra",
    "Concepción",
    "Confines",
    "Contratación",
    "Coromoro",
    "Curití",
    "El Carmen",
    "El Guacamayo",
    "El Peñon",
    "El Playón",
    "Encino",
    "Enciso",
    "Floridablanca",
    "Florián",
    "Galán",
    "Girón",
    "Guaca",
    "Guadalupe",
    "Guapota",
    "Guavatá",
    "Guepsa",
    "Gámbita",
    "Hato",
    "Jesús María",
    "Jordán",
    "La Belleza",
    "La Paz",
    "Landázuri",
    "Lebrija",
    "Los Santos",
    "Macaravita",
    "Matanza",
    "Mogotes",
    "Molagavita",
    "Málaga",
    "Ocamonte",
    "Oiba",
    "Onzaga",
    "Palmar",
    "Palmas del Socorro",
    "Pie de Cuesta",
    "Pinchote",
    "Puente Nacional",
    "Puerto Parra",
    "Puerto Wilches",
    "Páramo",
    "Rio Negro",
    "Sabana de Torres",
    "San Andrés",
    "San Benito",
    "San Gíl",
    "San Joaquín",
    "San José de Miranda",
    "San Miguel",
    "San Vicente del Chucurí",
    "Santa Bárbara",
    "Santa Helena del Opón",
    "Simacota",
    "Socorro",
    "Suaita",
    "Sucre",
    "Suratá",
    "Tona",
    "Valle de San José",
    "Vetas",
    "Villanueva",
    "Vélez",
    "Zapatoca",
    "Buenavista",
    "Caimito",
    "Chalán",
    "Colosó",
    "Corozal",
    "Coveñas",
    "El Roble",
    "Galeras",
    "Guaranda",
    "La Unión",
    "Los Palmitos",
    "Majagual",
    "Morroa",
    "Ovejas",
    "Palmito",
    "Sampués",
    "San Benito Abad",
    "San Juan de Betulia",
    "San Marcos",
    "San Onofre",
    "San Pedro",
    "Sincelejo",
    "Sincé",
    "Sucre",
    "Tolú",
    "Tolú Viejo",
    "Alpujarra",
    "Alvarado",
    "Ambalema",
    "Anzoátegui",
    "Armero",
    "Ataco",
    "Cajamarca",
    "Carmen de Apicalá",
    "Casabianca",
    "Chaparral",
    "Coello",
    "Coyaima",
    "Cunday",
    "Dolores",
    "Espinal",
    "Falan",
    "Flandes",
    "Fresno",
    "Guamo",
    "Herveo",
    "Honda",
    "Ibagué",
    "Icononzo",
    "Lérida",
    "Líbano",
    "Mariquita",
    "Melgar",
    "Murillo",
    "Natagaima",
    "Ortega",
    "Palocabildo",
    "Piedras",
    "Planadas",
    "Prado",
    "Purificación",
    "Rioblanco",
    "Roncesvalles",
    "Rovira",
    "Saldaña",
    "San Antonio",
    "San Luis",
    "Santa Isabel",
    "Suárez",
    "Valle de San Juan",
    "Venadillo",
    "Villahermosa",
    "Villarrica",
    "Alcalá",
    "Andalucía",
    "Ansermanuevo",
    "Argelia",
    "Bolívar",
    "Buenaventura",
    "Buga",
    "Bugalagrande",
    "Caicedonia",
    "Calima",
    "Calí",
    "Candelaria",
    "Cartago",
    "Dagua",
    "El Cairo",
    "El Cerrito",
    "El Dovio",
    "El Águila",
    "Florida",
    "Ginebra",
    "Guacarí",
    "Jamundí",
    "La Cumbre",
    "La Unión",
    "La Victoria",
    "Obando",
    "Palmira",
    "Pradera",
    "Restrepo",
    "Riofrío",
    "Roldanillo",
    "San Pedro",
    "Sevilla",
    "Toro",
    "Trujillo",
    "Tulúa",
    "Ulloa",
    "Versalles",
    "Vijes",
    "Yotoco",
    "Yumbo",
    "Zarzal",
    "Carurú",
    "Mitú",
    "Taraira",
    "Cumaribo",
    "La Primavera",
    "Puerto Carreño",
    "Santa Rosalía",
    "La Macarena",

];

function getRealNameElement(element) {
    let nombreElemento = null;
    nameElements.forEach(function (cadena) {
        function quitarTildes(cadena) {
            let tildes = {
                'á': 'a',
                'é': 'e',
                'í': 'i',
                'ó': 'o',
                'ú': 'u',
                'Á': 'A',
                'É': 'E',
                'Í': 'I',
                'Ó': 'O',
                'Ú': 'U'
            };

            return cadena.replace(/[áéíóúÁÉÍÓÚ]/g, function (match) {
                return tildes[match];
            });
        }

        if (quitarTildes(cadena.toLowerCase().replace(" del ", "_").replace("ü", "u").replace(" el ", "_").replace(" la ", "_").replace(" y ", "_").replace(" de ", "_").replace(" a ", "_").replace(" ", "_")).toLowerCase() === element) {
            nombreElemento = cadena;
        }
    });
    return nombreElemento;
}


let puntos = [

    {
        "latitud": 0.10287578916813371,
        "longitud": -70.04369418794504
    }
    ,
    {
        "latitud": 1.4186731846984189,
        "longitud": -69.84584162919936
    }
    ,
    {
        "latitud": 3.969264398811022,
        "longitud": -71.07736457031923
    }
    ,
    {
        "latitud": 1.985982604211773,
        "longitud": -73.65877392715846
    }
    ,
    {
        "latitud": 7.357557,
        "longitud": -75.842235
    }
    ,
    {
        "latitud": 1.9738581104257213,
        "longitud": -75.93284581613543
    }
    ,
    {
        "latitud": 4.701439276695983,
        "longitud": -74.07546980228544
    }
    ,
    {
        "latitud": 1.2936957437233512,
        "longitud": -66.99156480767924
    }
    ,
    {
        "latitud": 1.7274986978666207,
        "longitud": -69.39093655804524
    },
    {
        "latitud": 4.924693,
        "longitud": -71.077501,
    },
    {
        "latitud": 0.298710,
        "longitud": -76.411780,
    },
    {
        "latitud": 1.514291,
        "longitud": -69.845834
    },
    {
        "latitud": 3.715723,
        "longitud": -74.435186
    },
    {
        "latitud": 1.972854,
        "longitud": -75.932052
    },
    {
        "latitud": 1.9738581104257213,
        "longitud": -75.93284581613543
    },
    {
        "latitud": 3.413367,
        "longitud": -75.042315
    },
    {
        "latitud": 2.972503,
        "longitud": -75.996008
    },
    {
        "latitud": 8.655260,
        "longitud": -77.367154
    },
    {
        "latitud": 4.657909,
        "longitud": -73.052816
    }
]

/* if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(position)
        }
    );
} */



for (let x = 0; x < puntos.length; x++) {
    getGeolocalizacion(puntos[x].latitud, puntos[x].longitud)
}

function getGeolocalizacion(latitud, longitud, classAdd, element) {

    let divPunto = document.createElement("div");
    divPunto.classList.add("punto");
    divPunto.innerHTML = (element ? (element) : ('<svg style="width:' + widthPoint + 'px" class="' + (classAdd ? (classAdd + " ") : "") + 'svg-ubicacion-cafe" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 176.000000 248.000000" preserveAspectRatio="xMidYMidmeet"style="&#10;  &#10;    height: max-content;&#10;"> <g transform = "translate(0.000000,248.000000) scale(0.100000,-0.100000)" fill "#000000" stroke = "none"><path d="M800 2449 c-247 -21 -477 -156 -621 -365 -45 -65 -104 -197 -125 -279 -29 -112 -25 -294 9 -421 40 -152 83 -266 149 -398 132 -263 291 -473 548 -723 l114 -111 26 18 c14 10 81 73 149 141 339 339 546 684 653 1089 29 111 31 300 4 405 -21 82 -80 214 -125 279 -176 255 -467 391 -781 365z m193 -84 c267 -29 527 -247 615 -516 56 -169 52 -318 -14 -537 -92 -309 -298 -634 -591 -932 l-122 -125 -101 100 c-372 366 -616 799 -662 1171 -43 356 180 698 532 813 72 23 195 41 250 35 19 -1 61 -6 93 -9z" /><path d="M925 2208 c85 -67 155 -215 155 -327 -1 -122 -30 -189 -141 -326 -115 -142 -134 -181 -133 -280 0 -72 4 -87 38 -155 20 -41 50 -90 65 -108 l27 -34 87 21 c126 30 198 70 298 166 135 129 206 333 180 518 -21 152 -76 261 -184 369 -101 101 -270 178 -390 178 l-30 0 28 -22z" /> <path d="M648 2186 c-194 -80 -341 -254 -379 -449 -13 -70 -13 -199 1 -267 30 -145 145 -307 275 -389 59 -37 193 -91 227 -91 10 0 2 24 -25 79 -54 108 -68 206 -44 299 22 82 55 138 158 267 93 116 114 171 107 270 -6 73 -34 131 -95 196 -50 54 -128 109 -152 109 -9 0 -41 -11 -73 -24z" /> <path d="M553 80 c-136 -8 -193 -17 -193 -29 0 -16 45 -21 277 -33 179 -9 289 -9 475 0 239 11 288 17 288 32 0 14 -44 20 -212 30 -181 11 -448 11 -635 0z" /> </g ></svg >'))
    let topP = 12.49090539183309842
    let bottom = -4.13552330887985
    let left = -66.8698311193493
    let right = -79.03642861496417

    let latitudPorcentaje = topP - (bottom);
    let valorLatitudPorcentaje = latitud - (bottom);
    let porcentajeTotalLaitud = (valorLatitudPorcentaje / latitudPorcentaje) * 100;
    let longitudPorcentaje = left - (right);
    let valorLongitudPorcentaje = longitud - (right);
    let porcentajeTotalLongitud = (valorLongitudPorcentaje / longitudPorcentaje) * 100;

    divPunto.style.bottom = "calc(" + porcentajeTotalLaitud + "% ";
    divPunto.style.left = "calc(" + porcentajeTotalLongitud + "% ";
    divPuntosUbicacion.appendChild(divPunto)
}



///Hacer que el elemento al que se le dio click se centre y crezca a una scalatan grande igual a su contenedor

let bboxMap = sizeMap.getBBox();
divPuntosUbicacion.style.width = (bboxMap.width) + "px";
divPuntosUbicacion.style.height = (bboxMap.height) + "px";


for (let x = 0; x < departamentos.length; x++) {
    if (departamentos[x].classList) {
        if (departamentos[x].classList[2]) {
            departamentosName.push(departamentos[x].classList[2])
        }
    }

    departamentos[x].addEventListener("click", function () {
        if (clikeableStatus) {


            tittleElement.style.display = "none"
            if (departamentos[x] != lastFocusMunicipio || document.body.scrollHeight != lastHeight || document.body.scrollWidth != lastWidth) {
                for (let mf = 0; mf < municipios.length; mf++) {
                    municipios[mf].classList.remove("municipio-focus")
                    if (!municipios[mf].classList.contains(municipiosName[mf]["name"])) {
                        municipios[mf].classList.add(municipiosName[mf]["name"])
                    }
                    if (!municipios[mf].classList.contains("municipio")) {
                        municipios[mf].classList.add("municipio")
                        if (municipiosName[mf]["department"] == ("municipio-" + focusDepartamento)) {
                            municipios[mf].style.visibility = "unset";
                        }
                    }
                    if (!municipios[mf].classList.contains(municipiosName[mf]["department"])) {
                        municipios[mf].classList.add(municipiosName[mf]["department"])
                    }
                }
                lastFocusMunicipio = departamentos[x]
                lastHeight = document.body.scrollHeight
                lastWidth = document.body.scrollWidth
                focusDepartamento = departamentosName[x];

                /* mainDivMapa.style.zoom = ((window.screen.availHeight - heightSizeLess ) / divMapa.scrollHeight) * 100+ "%"; */
                let bboxDepartamento = departamentos[x].getBBox();

                setMovementMap(bboxDepartamento, 1.8, departamentos[x])

                departamentoFocus = x;
                for (let f = 0; f < departamentos.length; f++) {
                    if (x == f) {

                        for (let m = 0; m < municipios.length; m++) {
                            if (municipios[m].classList.contains("municipio-" + departamentosName[x])) {
                                municipios[m].style.visibility = "unset";
                            } else {
                                municipios[m].style.visibility = "";
                            }
                        }
                        if (departamentos[x].classList) {
                            if (departamentosName[x]) {
                                if (departamentosName[x] == "bogota_d.c.") {

                                } else {
                                    departamentos[f].style.opacity = ""
                                    departamentos[f].style.visibility = "collapse"
                                    departamentos[f].style.stroke = "1px black"
                                }
                            }
                        }
                    } else {
                        if (!departamentos[f].classList.contains("department-" + departamentosName[f])) {
                            departamentos[f].classList.add("department-" + departamentosName[f])
                        }
                        if (!departamentos[f].classList.contains("element-department")) {
                            departamentos[f].classList.add("element-department")
                        }
                        if (!departamentos[f].classList.contains(departamentosName[f])) {
                            departamentos[f].classList.add(departamentosName[f])
                        }
                        departamentos[f].style.visibility = ""
                        departamentos[f].style.display = ""
                        departamentos[f].style.opacity = "0.5"
                    }
                }
            }
        }
    })


    departamentos[x].addEventListener("mouseover", function () {

        focusElementDepartment = departamentos[x];
        if (departamentos[x].classList) {
            if (departamentosName[x]) {
                tittleElement.innerHTML = upperText(getRealNameElement(departamentosName[x]) ? getRealNameElement(departamentosName[x]) : "Departamento", 3)
            } else {
                tittleElement.innerHTML = "Departamento"
            }
        } else {
            tittleElement.innerHTML = "Departamento"
        }

    });
    departamentos[x].addEventListener("mouseout", function () {
        if (focusElementDepartment == departamentos[x]) {
            focusElementDepartment = "";
        }
    })

}


document.addEventListener('mousemove', function (event) {
    if (focusElementDepartment != "") {
        tittleElement.style.display = "block"
        tittleElement.style.left = (event.clientX + 30) + "px"
        tittleElement.style.top = (event.clientY) + "px"
        let x = event.clientX;
        let y = event.clientY;
    } else {
        tittleElement.style.display = "none"
        tittleElement.innerHTML = ""
    }
    /* if (event.clientX <= 0) {
        tittleElement.style.display = "none"
    } */

    let posicionX = divMapa.offsetLeft;
    let posicionY = divMapa.offsetTop;



})

function moveMap(event) {
    clikeableStatus = false
    let setPositionX = lassClientX - event.clientX
    let setPositionY = lassClienty - event.clientY
    let expresion = /calc\((-?[\d.]+)%/;
    let division = (parseFloat(mainDivMapa.style.zoom.replace("%", ""))) / 100;

    let resultadoY = expresion.exec(divMapa.style.top);
    let resultadoX = expresion.exec(divMapa.style.left);
    if (lastScale != 0) {
        if (resultadoY) {
            if (resultadoY[1]) {
                divMapa.style.top = "calc(" + resultadoY[1] + "% + " + (((setPositionY / division) / 10) * -1) + "%)"
            } else {
            }
        } /* else {
            divMapa.style.top = "calc(" + (((setPositionY) / 10) * -1) + "%)"
        } */
        if (resultadoX) {
            if (resultadoX[1]) {
                divMapa.style.left = "calc(" + resultadoX[1] + "% + " + (((setPositionX / division) / 10) * -1) + "%)"
            }
        } /* else {
            divMapa.style.top = "calc(" + (((setPositionX) / 10) * -1) + "%)"
        } */

    } /* else {

        divMapa.style.top = (divMapa.style.top != "" ? divMapa.style.top.replace("%)", "") + "% + " + (((setPositionY) / 10) * -1) + "%)" : ("calc(" + (((setPositionY) / 10) * -1) + "%)")) + "%)"

        if (divMapa.style.top) {

        } else {
            divMapa.style.top = "calc(" + (((setPositionX) / 10) * -1) + "%)"
        }
    } */

    lassClientX = event.clientX
    lassClienty = event.clientY
}
document.addEventListener('mousedown', function (event) {
    divMapa.style.transition = "unset"
    lassClientX = event.clientX
    lassClienty = event.clientY
    if (clikeableStatus == false) {
        setTimeout(() => {
            document.addEventListener('mousemove', moveMap)
        }, [150])
    } else {
        document.addEventListener('mousemove', moveMap)
    }

});

document.addEventListener('mouseup', function (event) {
    divMapa.style.transition = "all 0.6s"
    document.removeEventListener('mousemove', moveMap)
    setTimeout(() => {
        clikeableStatus = true
    }, 150)
});
function setMovementMap(bboxElement, lessScale, element) {
    let puntos = document.querySelectorAll(".svg-ubicacion-cafe")
    const userAgent = navigator.userAgent;
    const android = /Android/.test(userAgent);
    if (android && screen.availHeight > (screen.availWidth * 2)) {
        lessScale = 2.87
    } else if (screen.availHeight <= 60) {
        lessScale = 38.5
    } else if (screen.availHeight <= 80) {
        lessScale = 24.5
    } else if (screen.availHeight <= 100) {
        lessScale = 17.5
    } else if (screen.availHeight <= 130) {
        lessScale = 14.5
    } else if (screen.availHeight <= 170) {
        lessScale = 11.5
    } else if (screen.availHeight <= 270) {
        lessScale = 7.5
    } else if (screen.availHeight <= 320) {
        lessScale = 6.7
    } else if (screen.availHeight <= 400) {
        lessScale = 4.7
    } else if (screen.availHeight <= 500) {
        lessScale = 3.7
    } else if (((screen.availHeight - screen.availWidth) < 0 ? (screen.availHeight - screen.availWidth) * -1 : (screen.availHeight - screen.availWidth)) <= 60) {
        lessScale = 3
    }
    if (screen.availWidth <= 60) {
        lessScale = 20.5
    } else if (screen.availWidth <= 80) {
        lessScale = 14.5
    } else if (screen.availWidth <= 110) {
        lessScale = 11.5
    } else if (screen.availWidth <= 140) {
        lessScale = 8.5
    } else if (screen.availWidth <= 240) {
        lessScale = 5.5
    } else if (screen.availWidth <= 340) {
        lessScale = 4
    }

    /*     sizeLess = window.screen.availHeight > window.screen.availWidth ? 100000 : 0;
        zoom = window.screen.availHeight > window.screen.availWidth ? ((window.screen.availWidth) / divMapa.scrollWidth) * 100 : ((window.screen.availHeight - heightSizeLess) / divMapa.scrollHeight) * 100; */
    if (lastScale != 0) {
        mainDivMapa.style.transition = "unset"
        mainDivMapa.style.transform = "scale(" + lastScale + ")"
        mainDivMapa.style.zoom = zoom + "%"
    }
    less = lessScale ? lessScale : 1.8;
    let topMap = ((bboxElement.y / divMapa.scrollHeight) * 100) + (((bboxElement.height / 2) / divMapa.scrollHeight) * 100);
    let leftMap = ((bboxElement.x / divMapa.scrollWidth) * 100) + (((bboxElement.width / 2) / divMapa.scrollWidth) * 100);
    divMapa.style.top = "calc(50% - " + topMap + "%)"
    divMapa.style.left = "calc(50% - " + leftMap + "%)"
    let scale = 0;
    if (bboxElement.width > bboxElement.height) {
        scale = document.body.scrollWidth / (bboxElement.width)
    } else {
        scale = document.body.scrollHeight / (bboxElement.height)
    }


    if (((widthDivMap) * (((bboxElement.width / mainDivMapa.clientWidth) * 100) * (scale * less))) / 100 > (document.body.scrollWidth - sizeLess)) {
        scale = document.body.scrollWidth / (bboxElement.width)
    } else if (((window.screen.availHeight - heightSizeLess) * (((bboxElement.height / mainDivMapa.clientHeight) * 100) * (scale * less))) / 100 > (document.body.scrollHeight - sizeLess)) {
        scale = document.body.scrollHeight / (bboxElement.height + 1)

    }
    for (let x = 0; x < puntos.length; x++) {

        puntos[x].style.zoom = (widthPoint * lessPorcent / ((scale * less) + (lessPorcent - 1))) + "%"

    }
    lastWidthPoint = (widthPoint / ((scale * less) + (lessPorcent - 1)))
    mainDivMapa.style.transition = "all 0.6s"
    mainDivMapa.style.transform = "scale(" + (scale * less) + ")"


    setTimeout(() => {
        if (element == lastFocusMunicipio) {
            mainDivMapa.style.transition = "unset"
            mainDivMapa.style.transform = ""
            mainDivMapa.style.zoom = ((scale * less) * zoom) + "%"
            tittleElement.style.display = "block"
        }
    }, 600)
    lastScale = (scale * less);
}


for (let m = 0; m < municipios.length; m++) {
    municipios[m].style.stroke = municipios[m].style.fill
    municipios[m].style.strokeWidth = 0.5 + "px"
    municipiosName[m] = {
        "name": municipios[m].classList[0],
        "department": municipios[m].classList[1]
    }
    municipios[m].addEventListener("click", function () {
        if (clikeableStatus) {


            /* tittleElement.innerHTML = ""
            tittleElement.style.display = "none" */

            for (let mf = 0; mf < municipios.length; mf++) {

                if (!municipios[mf].classList.contains(municipiosName[mf]["name"])) {
                    municipios[mf].classList.add(municipiosName[mf]["name"])
                }
                if (!municipios[mf].classList.contains("municipio")) {
                    municipios[mf].classList.add("municipio")
                    if (municipiosName[mf]["department"] == ("municipio-" + focusDepartamento)) {
                        municipios[mf].style.visibility = "unset";
                    }
                }
                if (!municipios[mf].classList.contains(municipiosName[mf]["department"])) {
                    municipios[mf].classList.add(municipiosName[mf]["department"])
                }

                municipios[mf].classList.remove("municipio-focus")

            }

            if (municipios[m].classList.contains("municipio-" + focusDepartamento)) {
                municipios[m].classList.add("municipio-focus")

                if (municipios[m] != lastFocusMunicipio || document.body.scrollHeight != lastHeight || document.body.scrollWidth != lastWidth) {
                    tittleElement.style.display = "none"
                    let bboxMunicipio = municipios[m].getBBox();
                    municipios[m].style.visibility = "unset";
                    setMovementMap(bboxMunicipio, 1.7, municipios[m])
                    lastFocusMunicipio = municipios[m]
                    lastHeight = document.body.scrollHeight
                    lastWidth = document.body.scrollWidth
                }

            } else {
                municipios[m].style.visibility = "";
            }
        }
    })
    municipios[m].addEventListener("mouseover", function () {
        focusElementDepartment = municipios[m];
        if (municipios[m].classList) {
            if (municipiosName[m]["name"]) {
                const name = getRealNameElement(municipiosName[m]["name"]);
                tittleElement.innerHTML = upperText(name != undefined ? name : "Municipio", 3)
            } else {
                tittleElement.innerHTML = "Municipio"
            }
        } else {
            tittleElement.innerHTML = "Municipio"
        }

    });
    municipios[m].addEventListener("mouseout", function () {
        if (focusElementDepartment == municipios[m]) {
            focusElementDepartment = "";
        }
    })
}


window.addEventListener("resize", function () {
    let puntoUbicacion = document.querySelectorAll(".punto-ubicacion")
    for (let x = 0; x < puntoUbicacion; x++) {

    }
})





window.addEventListener("resize", function () {
    lessPorcent = (((document.body.scrollHeight) / (screen.availHeight - 87)))
    ajustPoints()
})

function ajustPoints() {
    let puntos = document.querySelectorAll(".svg-ubicacion-cafe")

    for (let x = 0; x < puntos.length; x++) {
        puntos[x].style.width = (lastWidthPoint * lessPorcent) + "px"
    }
}
window.addEventListener("scroll", function () {
    console.log("xdd")
})

Mousetrap.bind('ctrl+g', function () {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getGeolocalizacion(position.coords.latitude, position.coords.longitude, "miUbicacion", '<svg class="miUbicacion" xmlns="http://www.w3.org/2000/svg" version="1.0" width="308.000000pt" height="405.000000pt" viewBox="0 0 308.000000 405.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,405.000000) scale(0.100000,-0.100000)"  stroke="none"> <path d="M1458 4010 c-207 -37 -375 -183 -433 -377 -83 -274 71 -571 344 -665 94 -32 248 -32 342 0 318 109 458 471 299 771 -100 188 -346 308 -552 271z"/> <path d="M887 2784 c-170 -41 -327 -168 -407 -330 -62 -126 -65 -154 -65 -539 l0 -350 300 -5 300 -5 195 -339 c112 -192 210 -351 228 -367 57 -51 147 -51 204 0 18 16 116 175 228 367 l195 339 303 3 303 2 -3 358 c-5 390 -7 412 -69 537 -81 165 -236 288 -413 329 -94 22 -1208 22 -1299 0z"/><path d="M899 1265 c-454 -94 -755 -264 -850 -481 -31 -69 -24 -179 17 -254 127 -237 542 -420 1100 -486 188 -23 560 -23 748 0 558 66 983 254 1102 487 36 71 44 179 19 244 -62 164 -273 316 -572 414 -116 38 -315 87 -382 93 l-33 3 -104 -178 c-57 -98 -104 -180 -104 -182 0 -3 6 -5 13 -5 21 0 167 -67 207 -95 118 -81 122 -211 11 -293 -251 -185 -811 -185 -1062 0 -111 82 -107 212 11 293 40 28 186 95 208 95 6 0 12 2 12 5 0 11 -208 359 -216 361 -5 2 -61 -8 -125 -21z"/></g></svg>')

            }
        );
    }
});
function mouseScroll(event) {
    let puntos = document.querySelectorAll(".svg-ubicacion-cafe")

    let zoomNow = parseFloat(mainDivMapa.style.zoom.replace("%", ""))

    if (event.deltaY > 0) {
        zoomNow = zoomNow - (((((document.body.scrollHeight) / (screen.availHeight - 87))) * lastScale) + 5)
    } else if (event.deltaY < 0) {
        zoomNow = zoomNow + (((((document.body.scrollHeight) / (screen.availHeight - 87))) * lastScale) + 5)
    }




    if (zoomNow > 5) {
        mainDivMapa.style.zoom = zoomNow + "%"
        for (let x = 0; x < puntos.length; x++) {
            let width = parseFloat(puntos[x].style.width)
            
            console.log(Math.floor((widthPoint / (mainDivMapa.style.zoom.replace("%", "") / zoom))))
            puntos[x].style.zoom = (widthPoint / ((mainDivMapa.style.zoom.replace("%", "") / zoom) )) + "%"
        }
    } else {
        mainDivMapa.style.zoom = 5 + "%"
    }


}

// Agregar un event listener para el evento de desplazamiento del ratón
document.addEventListener('wheel', mouseScroll);