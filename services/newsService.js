// Servicio para obtener noticias de cuentas de X usando solo feeds JSON de rss.app

// Función auxiliar para extraer la URL de la imagen del contenido HTML
const extractImageFromHTML = (htmlString) => {
  // Esta expresión regular busca una etiqueta <img> y extrae el valor de su atributo src
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = htmlString.match(imgRegex);
  return match ? match[1] : null;
};

// Función auxiliar para transformar un item del feed JSON obtenido desde rss.app
const transformRSSItem = (item, twitterUser) => {
  const pubDate = item.date_published ? new Date(item.date_published) : null;
  const timestamp = pubDate && !isNaN(pubDate) ? pubDate.toLocaleDateString() : 'N/A';

  // Primero, intenta obtener la imagen del objeto
  let imageUrl = item.image;
  
  // Si no existe en "image", revisa en "attachments"
  if (!imageUrl && item.attachments && item.attachments.length > 0) {
    imageUrl = item.attachments[0].url;
  }
  
  // Si aún no se encontró, intenta extraerla del HTML
  if (!imageUrl) {
    imageUrl = extractImageFromHTML(item.content_html || '');
  }

  // Si no hay imagen, se deja como null (no se mostrará nada en la UI)
  imageUrl = imageUrl || null;

  return {
    id: item.id || item.url,
    source: 'twitter',
    username: `@${twitterUser}`,
    profilePic: `https://unavatar.io/twitter/${twitterUser}`,
    content: item.title || '',
    description: item.content_text || '',
    image: imageUrl,
    timestamp,
    likes: Math.floor(Math.random() * 1000),
    retweets: Math.floor(Math.random() * 500),
    url: item.url,
  };
};



// Objeto que mapea cada cuenta a su URL JSON de rss.app
const RSS_APP_FEEDS = {
  'GOLPERUoficial': 'https://rss.app/feeds/v1.1/wmhFbB66bmvhUt8U.json',
  'Mercado_Ingles': 'https://rss.app/feeds/v1.1/3RNajw0jMLpgOVLv.json',      // Reemplaza 'OTRA_URL' por la URL correspondiente
  'goal': 'https://rss.app/feeds/v1.1/6l0ivhIDb73C6DB8.json',                 // Reemplaza 'OTRA_URL'
  'FabrizioRomano': 'https://rss.app/feeds/v1.1/gCpDGFezeiNHgdRn.json',         // Reemplaza 'OTRA_URL'
  'Fichajes_futbol': 'https://rss.app/feeds/v1.1/dBoXZU4JJ4jTLjtB.json',
  'TransferMarket es': 'https://rss.app/feeds/v1.1/5bR7mxNpPfkNXc70.json'         // Reemplaza 'OTRA_URL'
         // Reemplaza 'OTRA_URL'
};

export const fetchTweetsFromRSS = async (twitterUser) => {
  try {
    const rssUrl = RSS_APP_FEEDS[twitterUser];
    if (!rssUrl) {
      throw new Error(`No se encontró un feed RSS configurado para ${twitterUser}`);
    }
    const response = await fetch(rssUrl);
    if (!response.ok) {
      throw new Error(`Error al obtener RSS de rss.app: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error(`RSS feed vacío para ${twitterUser}`);
    }
    return data.items.map(item => transformRSSItem(item, twitterUser));
  } catch (error) {
    console.error(`fetchTweetsFromRSS (${twitterUser}):`, error);
    return [];
  }
};

// Función principal que combina las fuentes de rss.app para cada cuenta
export const fetchFootballNews = async () => {
  try {
    const [
      golPeruTweets,
      mercadoInglesTweets,
      goalTweets,
      fabrizioRomanoTweets,
      fichajesFutbolTweets,
      transferMarketTweets
    ] = await Promise.all([
      fetchTweetsFromRSS('GOLPERUoficial'),
      fetchTweetsFromRSS('Mercado_Ingles'),
      fetchTweetsFromRSS('goal'),
      fetchTweetsFromRSS('FabrizioRomano'),
      fetchTweetsFromRSS('Fichajes_futbol'),
      fetchTweetsFromRSS('TransferMarket es'),
    ]);

    const combinedNews = [
      ...golPeruTweets,
      ...mercadoInglesTweets,
      ...goalTweets,
      ...fabrizioRomanoTweets,
      ...fichajesFutbolTweets,
      ...transferMarketTweets
    ];

    return combinedNews.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('fetchFootballNews:', error);
    return [];
  }
};

// Datos de prueba en caso de que los feeds fallen o estén en mantenimiento
export const getFallbackNews = () => [
  {
    id: '1',
    source: 'twitter',
    username: '@GOLPERUoficial',
    profilePic: 'https://unavatar.io/twitter/GOLPERUoficial',
    content: 'Ejemplo de titular de GOLPERUoficial.',
    image: 'https://via.placeholder.com/300x200.png?text=GOLPERUoficial',
    timestamp: 'Hoy',
    likes: 100,
    retweets: 50,
    url: 'https://x.com/GOLPERUoficial',
  },
  {
    id: '2',
    source: 'twitter',
    username: '@goal',
    profilePic: 'https://unavatar.io/twitter/goal',
    content: 'Ejemplo de titular de goal.',
    image: 'https://via.placeholder.com/300x200.png?text=goal',
    timestamp: 'Hoy',
    likes: 200,
    retweets: 80,
    url: 'https://x.com/goal',
  },
];
