import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Anime from '../models/Anime.js';

dotenv.config();

const JIKAN_BASE = 'https://api.jikan.moe/v4';

const estadoMap = {
  'Currently Airing': 'En emisión',
  'Finished Airing':  'Finalizado',
  'Not yet aired':    'Próximamente',
};

const tipoMap = {
  TV:      'TV',
  Movie:   'Película',
  OVA:     'OVA',
  ONA:     'ONA',
  Special: 'Especial',
};

const esperar = (ms) => new Promise((res) => setTimeout(res, ms));

const transformarAnime = (item) => ({
  malId:      item.mal_id,
  titulo:     item.title,
  sinopsis:   item.synopsis || 'Sin sinopsis disponible.',
  imagen:     item.images?.jpg?.large_image_url || '',
  trailer: {
    youtubeId: item.trailer?.youtube_id || '',
    url:       item.trailer?.url || '',
  },
  generos:    item.genres?.map((g) => g.name) || [],
  estado:     estadoMap[item.status] || 'Desconocido',
  episodios:  item.episodes || null,
  puntuacion: item.score || null,
  anyo:       item.aired?.prop?.from?.year || null,
  destacado:  item.rank <= 10,
  tipo:       tipoMap[item.type] || 'Desconocido',
  fuente:     'jikan',
});

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    await Anime.deleteMany({ fuente: 'jikan' });
    console.log('Animes anteriores eliminados');

    const animes = [];
    for (let pagina = 1; pagina <= 5; pagina++) {
      console.log(`Descargando página ${pagina}/5...`);
      try {
        const { data } = await axios.get(`${JIKAN_BASE}/top/anime`, {
          params: { page: pagina, limit: 25 },
        });
        animes.push(...data.data);
        await esperar(1200);
      } catch (err) {
        console.error(`Error en página ${pagina}:`, err.message);
      }
    }

    let insertados = 0;
    for (const item of animes) {
      try {
        await Anime.create(transformarAnime(item));
        insertados++;
      } catch {
        // ignorar duplicados
      }
    }

    console.log(`\n Seed completado: ${insertados} animes guardados en catalogo_anime`);
    process.exit(0);
  } catch (error) {
    console.error('Error en el seed:', error.message);
    process.exit(1);
  }
};

seed();
