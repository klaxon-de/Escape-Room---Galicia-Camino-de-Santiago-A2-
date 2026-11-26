import heroSantiagoImg from '../assets/images/hero_santiago_camino_1795712718200.jpg';
import etapaAlbergueImg from '../assets/images/etapa_albergue_mochila_1795712718818.jpg';
import etapaGaliciaImg from '../assets/images/etapa_galicia_camino_1795712720553.jpg';
import etapaTabernaImg from '../assets/images/etapa_taberna_galicia_1795712721895.jpg';
import etapaOficinaImg from '../assets/images/etapa_oficina_peregrino_1795712721798.jpg';

export type StageId = 1 | 2 | 3 | 4;

export interface StageMetadata {
  id: StageId;
  shortTitle: string;
  title: string;
  location: string;
  kmRemaining: string;
  stampName: string;
  stampPlace: string;
  image: string;
  imageAlt: string;
  story: string;
  culturalFactTitle: string;
  culturalFact: string;
  clueLabel: string;
  clueValue: string;
  hints: [string, string, string];
  teacherSolution: string;
  teacherFocus: string;
}

export interface BackpackItem {
  id: string;
  name: string;
  detail: string;
  codeDigit: string;
  required: boolean;
  wrongHint?: string;
}

export interface TrailStep {
  id: number;
  landmark: string;
  instruction: string;
  correctDirection: 'left' | 'straight' | 'right';
  wrongFeedback: string;
}

export interface DiaryBlank {
  id: number;
  before: string;
  after: string;
  correctWord: string;
  letter: string;
  options: string[];
  grammarCue: string;
}

export interface LockDial {
  id: string;
  label: string;
  question: string;
  options: string[];
  correctValue: string;
  clueRef: string;
}

export interface GlossaryEntry {
  es: string;
  de: string;
  category: 'Camino' | 'Galicia' | 'Comida' | 'Direcciones y estados';
  example: string;
}

export const SHARED_APP_URL =
  'https://ais-pre-5wrijnwdjpvul42f4zedps-687935988361.europe-west3.run.app';

export const HERO_IMAGE = {
  src: heroSantiagoImg,
  alt: 'Ilustración de la Catedral de Santiago de Compostela vista desde un sendero de piedra del Camino con una flecha amarilla y una concha de vieira.',
};

export const STAGES: Record<StageId, StageMetadata> = {
  1: {
    id: 1,
    shortTitle: 'Albergue',
    title: '01. La mochila en el albergue',
    location: 'Sarria, Galicia',
    kmRemaining: '111 km hasta Santiago',
    stampName: 'La Concha',
    stampPlace: 'Albergue de Sarria',
    image: etapaAlbergueImg,
    imageAlt:
      'Banco de madera en un albergue gallego con una mochila de peregrino, una concha de vieira, un chubasquero amarillo, botas y una cantimplora.',
    story:
      '¡Buenos días desde Sarria! Estoy un poco nerviosa, pero muy contenta. Hoy empezamos la última parte del Camino de Santiago. Antes de salir del albergue, lee la nota de Sofía, prepara la mochila con los 4 objetos correctos y abre la taquilla para conseguir el primer sello.',
    culturalFactTitle: '¿Sabías que...?',
    culturalFact:
      'Para recibir la Compostela a pie hay que caminar al menos 100 kilómetros. Por eso muchísimos peregrinos empiezan en Sarria (a 111 km de Santiago) y llevan la concha de vieira en la mochila.',
    clueLabel: 'Dato 1 · Distancia mínima',
    clueValue: '100 km a pie',
    hints: [
      'Lee con calma las 4 frases de Sofía: cada frase describe exactamente un objeto necesario para caminar por Galicia.',
      'Vocabulario útil: «el chubasquero» = Regenjacke, «las botas de montaña» = Wanderschuhe, «la cantimplora» = Trinkflasche, «la credencial» = Pilgerpass.',
      'Objetos correctos: chubasquero (2), botas de montaña (4), cantimplora (7) y credencial (1). El código de la taquilla en orden del 1 al 4 es 2471.',
    ],
    teacherSolution:
      '4 Gegenstände: el chubasquero (2), las botas de montaña (4), la cantimplora (7), la credencial (1) → Zahlencode: 2471',
    teacherFocus:
      'Pilger- & Wettervokabular (Galicia), Leseverständnis A2, Zustände mit estar + Adjektiv.',
  },
  2: {
    id: 2,
    shortTitle: 'Flechas',
    title: '02. Las flechas amarillas',
    location: 'Entre Portomarín y Arzúa',
    kmRemaining: '54 km hasta Santiago',
    stampName: 'La Flecha Amarilla',
    stampPlace: 'Camino de Arzúa',
    image: etapaGaliciaImg,
    imageAlt:
      'Camino verde en Galicia con un puente de piedra, un hórreo tradicional gallego y un mojón con la flecha amarilla.',
    story:
      'Ya estamos caminando por los verdes paisajes de Galicia. Por la mañana hay un poco de niebla y el camino tiene cuatro cruces. Sigue las indicaciones de Sofía paso a paso y elige siempre la dirección correcta.',
    culturalFactTitle: '¿Sabías que...?',
    culturalFact:
      'En los pueblos de Galicia se ven muchos hórreos: pequeños graneros de piedra o madera sobre columnas. Además, en Galicia hay dos lenguas oficiales: el español y el gallego.',
    clueLabel: 'Dato 2 · Lengua regional',
    clueValue: 'El gallego',
    hints: [
      'Fíjate bien en los verbos de dirección en cada cruce: «seguir recto», «girar a la derecha» y «girar a la izquierda».',
      'Vocabulario útil: «sigue recto» = geradeaus gehen, «a la derecha» = nach rechts, «a la izquierda» = nach links.',
      'Secuencia correcta en los 4 cruces: 1. Seguir recto (↑), 2. Girar a la derecha (→), 3. Girar a la izquierda (←), 4. Seguir recto (↑).',
    ],
    teacherSolution:
      'Wegfolge: 1. Seguir recto (↑) → 2. Girar a la derecha (→) → 3. Girar a la izquierda (←) → 4. Seguir recto (↑)',
    teacherFocus:
      'Wegbeschreibungen & Imperativ (sigue recto, gira a la derecha/izquierda), Landeskunde (hórreo, gallego).',
  },
  3: {
    id: 3,
    shortTitle: 'Taberna',
    title: '03. Sabores de Galicia y el diario',
    location: 'Taberna en O Pedrouzo',
    kmRemaining: '19 km hasta Santiago',
    stampName: 'El Hórreo',
    stampPlace: 'Taberna de O Pedrouzo',
    image: etapaTabernaImg,
    imageAlt:
      'Mesa de madera en una taberna gallega con empanada gallega, pulpo a la gallega, tarta de Santiago y un diario de viaje abierto.',
    story:
      '¡Qué hambre tenemos! Hacemos una pausa en una taberna gallega. Sobre la mesa está el diario de viaje de Sofía, pero faltan cuatro palabras. Completa las frases sobre Galicia y el día de ayer: la primera letra de cada palabra correcta forma la palabra secreta.',
    culturalFactTitle: '¿Sabías que...?',
    culturalFact:
      'La tarta de Santiago es un pastel de almendras con la cruz de Santiago en azúcar glas. Muchos peregrinos siguen caminando después hasta Finisterre (Fisterra), el «fin del mundo» en la costa atlántica.',
    clueLabel: 'Dato 3 · «El fin del mundo»',
    clueValue: 'Finisterre (Fisterra)',
    hints: [
      'Completa primero las 4 frases del diario haciendo clic en la palabra correcta. Después junta las 4 primeras letras.',
      'Pista cultural: en Galicia se come «pulpo a la gallega» y «tarta de Santiago», y la región está junto al «océano» Atlántico. Para el pasado («caminamos») usamos «ayer».',
      'Las palabras son Pulpo (P), Ayer (A), Santiago (S) y Océano (O). La palabra secreta de 4 letras es PASO.',
    ],
    teacherSolution:
      'Lückenwörter: pulpo (P), ayer (A), Santiago (S), océano (O) → Lösungswort: PASO',
    teacherFocus:
      'Galicische Küche & Geografie, Indefinido/Imperfecto-Signalwörter (ayer caminamos, estábamos cansados).',
  },
  4: {
    id: 4,
    shortTitle: 'Oficina',
    title: '04. La Oficina del Peregrino',
    location: 'Plaza del Obradoiro, Santiago',
    kmRemaining: '0 km · Meta',
    stampName: 'La Catedral',
    stampPlace: 'Santiago de Compostela',
    image: etapaOficinaImg,
    imageAlt:
      'Puerta de piedra de la Oficina del Peregrino en Santiago de Compostela con una concha tallada y un candado de combinación.',
    story:
      '¡Por fin estamos en la Plaza del Obradoiro, delante de la Catedral de Santiago! Solo falta abrir el candado de cuatro ruedas de la Oficina del Peregrino. Usa los datos que has guardado en tu Credencial para elegir las 4 respuestas correctas.',
    culturalFactTitle: '¡Enhorabuena, peregrino/a!',
    culturalFact:
      'Has completado tu viaje por Galicia y el Camino de Santiago. La Plaza del Obradoiro es el punto de encuentro de peregrinos de todo el mundo frente a la fachada barroca de la Catedral.',
    clueLabel: 'Dato 4 · Saludo del Camino',
    clueValue: '¡Buen Camino!',
    hints: [
      'Mira la sección «Datos guardados» en tu Credencial a la derecha: allí están las respuestas de las tres primeras ruedas.',
      'Recuerda: se caminan al menos 100 km, en Galicia se habla español y gallego, y el cabo famoso en la costa se llama Finisterre.',
      'Combinación exacta: 100 km · gallego · Finisterre · ¡Buen Camino!',
    ],
    teacherSolution:
      'Kombinationsschloss: 100 km · gallego · Finisterre · ¡Buen Camino!',
    teacherFocus:
      'Wissenssicherung zu Galicia & El Camino de Santiago (¡Vamos! ¡Adelante! 3, Unidad 3).',
  },
};

export const STAGE_ORDER: StageId[] = [1, 2, 3, 4];

export const SOFIA_ALBERGUE_NOTES: string[] = [
  '1. En Galicia llueve a menudo: siempre llevo algo amarillo para la lluvia.',
  '2. Caminamos 20 kilómetros cada día por caminos de piedra: necesito calzado cómodo.',
  '3. Cuando tengo sed en la etapa, bebo agua fresca de las fuentes.',
  '4. Sin este documento de papel con los sellos no puedo recibir la Compostela.',
];

export const BACKPACK_ITEMS: BackpackItem[] = [
  {
    id: 'chubasquero',
    name: 'El chubasquero',
    detail: 'Chaqueta ligera para la lluvia',
    codeDigit: '2',
    required: true,
  },
  {
    id: 'tacones',
    name: 'Los zapatos de tacón',
    detail: 'Elegantes, pero muy incómodos',
    codeDigit: '8',
    required: false,
    wrongHint: '¿Caminar 20 km por Galicia con zapatos de tacón? ¡Mejor calzado cómodo!',
  },
  {
    id: 'botas',
    name: 'Las botas de montaña',
    detail: 'Calzado resistente para caminar',
    codeDigit: '4',
    required: true,
  },
  {
    id: 'maleta',
    name: 'La maleta gigante',
    detail: 'Demasiado pesada para llevar a pie',
    codeDigit: '5',
    required: false,
    wrongHint: 'Una maleta gigante pesa demasiado para el Camino. Los peregrinos llevan mochila.',
  },
  {
    id: 'cantimplora',
    name: 'La cantimplora',
    detail: 'Botella reutilizable para el agua',
    codeDigit: '7',
    required: true,
  },
  {
    id: 'credencial',
    name: 'La credencial',
    detail: 'El pasaporte del peregrino para los sellos',
    codeDigit: '1',
    required: true,
  },
];

export const ALBERGUE_LOCK_CODE = '2471';

export const TRAIL_STEPS: TrailStep[] = [
  {
    id: 1,
    landmark: 'El puente de piedra',
    instruction:
      'Cruce 1: Cruza el viejo puente de piedra y sigue recto hacia el pequeño pueblo.',
    correctDirection: 'straight',
    wrongFeedback:
      'Mira la indicación: después del puente hay que seguir recto, sin girar.',
  },
  {
    id: 2,
    landmark: 'El hórreo gallego',
    instruction:
      'Cruce 2: Delante del hórreo de piedra, gira a la derecha por el sendero de tierra.',
    correctDirection: 'right',
    wrongFeedback:
      'Ese camino vuelve hacia la carretera. Delante del hórreo debes girar a la derecha.',
  },
  {
    id: 3,
    landmark: 'El bosque de eucaliptos',
    instruction:
      'Cruce 3: Al salir del bosque verde, no bajes al río: gira a la izquierda siguiendo la flecha amarilla.',
    correctDirection: 'left',
    wrongFeedback:
      '¡Cuidado, ese sendero baja al río! Busca la dirección «a la izquierda».',
  },
  {
    id: 4,
    landmark: 'La fuente del pueblo',
    instruction:
      'Cruce 4: ¡Ya estás muy cerca! Sigue recto hasta la fuente para encontrar el sello de Arzúa.',
    correctDirection: 'straight',
    wrongFeedback:
      'Ya casi llegamos a la plaza: solo tienes que seguir recto hasta la fuente.',
  },
];

export const DIARY_BLANKS: DiaryBlank[] = [
  {
    id: 1,
    before: 'Al mediodía comimos un plato muy típico de Galicia:',
    after: 'a la gallega, con patatas y pimentón.',
    correctWord: 'pulpo',
    letter: 'P',
    options: ['pulpo', 'gazpacho', 'paella'],
    grammarCue: 'Gastronomía gallega',
  },
  {
    id: 2,
    before: '',
    after: 'caminamos veinte kilómetros y por la tarde estábamos muy cansados.',
    correctWord: 'ayer',
    letter: 'A',
    options: ['mañana', 'ayer', 'siempre'],
    grammarCue: 'Pasado (Indefinido / Imperfecto)',
  },
  {
    id: 3,
    before: 'De postre probamos la famosa tarta de',
    after: ', un dulce tradicional de almendras.',
    correctWord: 'Santiago',
    letter: 'S',
    options: ['Madrid', 'Sevilla', 'Santiago'],
    grammarCue: 'Postre típico',
  },
  {
    id: 4,
    before: 'Galicia está en el noroeste de España, junto al',
    after: 'Atlántico.',
    correctWord: 'océano',
    letter: 'O',
    options: ['desierto', 'océano', 'volcán'],
    grammarCue: 'Geografía de Galicia',
  },
];

export const TABERNA_SECRET_WORD = 'PASO';

export const OFFICE_LOCK_DIALS: LockDial[] = [
  {
    id: 'distance',
    label: 'Rueda 1 · Distancia mínima',
    question: '¿Cuántos kilómetros hay que caminar como mínimo para la Compostela?',
    options: ['50 km', '100 km', '250 km', '500 km'],
    correctValue: '100 km',
    clueRef: 'Dato 1 de tu Credencial',
  },
  {
    id: 'language',
    label: 'Rueda 2 · Lengua regional',
    question: 'Además del español, ¿qué lengua oficial se habla en Galicia?',
    options: ['catalán', 'vasco', 'gallego', 'andaluz'],
    correctValue: 'gallego',
    clueRef: 'Dato 2 de tu Credencial',
  },
  {
    id: 'cape',
    label: 'Rueda 3 · Costa atlántica',
    question: '¿Qué cabo gallego es conocido como «el fin del mundo»?',
    options: ['Gibraltar', 'Finisterre', 'Mallorca', 'Toledo'],
    correctValue: 'Finisterre',
    clueRef: 'Dato 3 de tu Credencial',
  },
  {
    id: 'greeting',
    label: 'Rueda 4 · Saludo peregrino',
    question: '¿Qué se dicen los peregrinos al encontrarse en el camino?',
    options: ['¡Hasta luego!', '¡Buen provecho!', '¡Buen Camino!', '¡Feliz año!'],
    correctValue: '¡Buen Camino!',
    clueRef: 'Cultura del Camino',
  },
];

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    es: 'el peregrino / la peregrina',
    de: 'der Pilger / die Pilgerin',
    category: 'Camino',
    example: 'Muchos peregrinos caminan hasta Santiago.',
  },
  {
    es: 'la credencial',
    de: 'der Pilgerpass (zum Sammeln der Stempel)',
    category: 'Camino',
    example: 'Necesito un sello en mi credencial.',
  },
  {
    es: 'el sello',
    de: 'der Stempel',
    category: 'Camino',
    example: 'En el albergue nos ponen el primer sello.',
  },
  {
    es: 'el albergue',
    de: 'die Pilgerherberge',
    category: 'Camino',
    example: 'Dormimos en un albergue en Sarria.',
  },
  {
    es: 'la concha (de vieira)',
    de: 'die Jakobsmuschel',
    category: 'Camino',
    example: 'Llevo una concha en mi mochila.',
  },
  {
    es: 'la flecha amarilla',
    de: 'der gelbe Pfeil (Wegmarkierung)',
    category: 'Camino',
    example: 'Seguimos las flechas amarillas.',
  },
  {
    es: 'la etapa',
    de: 'die Etappe / Tagesstrecke',
    category: 'Camino',
    example: 'La etapa de hoy tiene 20 kilómetros.',
  },
  {
    es: 'el chubasquero',
    de: 'die Regenjacke',
    category: 'Camino',
    example: 'En Galicia llueve, lleva el chubasquero.',
  },
  {
    es: 'la cantimplora',
    de: 'die Trinkflasche',
    category: 'Camino',
    example: 'Lleno mi cantimplora en la fuente.',
  },
  {
    es: 'el hórreo',
    de: 'traditioneller galicischer Getreidespeicher auf Steinsäulen',
    category: 'Galicia',
    example: 'En los pueblos gallegos hay muchos hórreos.',
  },
  {
    es: 'el gallego',
    de: 'das Galicische (Regionalsprache in Galicien)',
    category: 'Galicia',
    example: 'En Galicia se habla español y gallego.',
  },
  {
    es: 'la niebla',
    de: 'der Nebel',
    category: 'Galicia',
    example: 'Por la mañana hay niebla en el bosque.',
  },
  {
    es: 'el océano Atlántico',
    de: 'der Atlantische Ozean',
    category: 'Galicia',
    example: 'Galicia está junto al océano Atlántico.',
  },
  {
    es: 'el pulpo a la gallega',
    de: 'Tintenfisch nach galicischer Art',
    category: 'Comida',
    example: 'En la taberna probamos pulpo a la gallega.',
  },
  {
    es: 'la empanada gallega',
    de: 'herzhafte galicische Teigtasche / Pastete',
    category: 'Comida',
    example: 'La empanada de atún está riquísima.',
  },
  {
    es: 'la tarta de Santiago',
    de: 'galicischer Mandelkuchen mit Jakobskreuz',
    category: 'Comida',
    example: 'De postre comemos tarta de Santiago.',
  },
  {
    es: 'seguir recto',
    de: 'geradeaus weitergehen',
    category: 'Direcciones y estados',
    example: 'Cruza el puente y sigue recto.',
  },
  {
    es: 'girar a la izquierda / derecha',
    de: 'nach links / rechts abbiegen',
    category: 'Direcciones y estados',
    example: 'Delante del hórreo gira a la derecha.',
  },
  {
    es: 'estar cansado/a',
    de: 'müde sein',
    category: 'Direcciones y estados',
    example: 'Después de caminar estamos muy cansados.',
  },
  {
    es: 'estar contento/a / nervioso/a',
    de: 'froh / nervös sein',
    category: 'Direcciones y estados',
    example: 'Estoy muy contenta de llegar a Santiago.',
  },
];
