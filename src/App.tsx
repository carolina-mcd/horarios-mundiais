import { useEffect, useState } from 'react';

interface Country {
  city: string;
  country: string;
  timezone: string;
  lat: number;
  lon: number;
  image: string;
}

export default function WorldClockWeatherDashboard() {
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({});
  const [weatherData, setWeatherData] = useState<Record<string, string>>({});

  const countries: Country[] = [
    {
      city: 'São Paulo',
      country: 'Brasil',
      timezone: 'America/Sao_Paulo',
      lat: -23.5505,
      lon: -46.6333,
      image:
        'https://images.unsplash.com/photo-1543059080-f9b1272213d5?q=80&w=1200&auto=format&fit=crop',
    },
    {
      city: 'Nova York',
      country: 'Estados Unidos',
      timezone: 'America/New_York',
      lat: 40.7128,
      lon: -74.006,
      image:
        'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=1200&auto=format&fit=crop',
    },
    {
      city: 'Londres',
      country: 'Reino Unido',
      timezone: 'Europe/London',
      lat: 51.5072,
      lon: -0.1276,
      image:
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop',
    },
    {
      city: 'Tóquio',
      country: 'Japão',
      timezone: 'Asia/Tokyo',
      lat: 35.6762,
      lon: 139.6503,
      image:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop',
    },
    {
      city: 'Paris',
      country: 'França',
      timezone: 'Europe/Paris',
      lat: 48.8566,
      lon: 2.3522,
      image:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    },
    {
      city: 'Sydney',
      country: 'Austrália',
      timezone: 'Australia/Sydney',
      lat: -33.8688,
      lon: 151.2093,
      image:
        'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  useEffect(() => {
    const updateTimes = () => {
      const updatedTimes: Record<string, string> = {};

      countries.forEach((item) => {
        updatedTimes[item.city] = new Date().toLocaleTimeString('pt-BR', {
          timeZone: item.timezone,
        });
      });

      setCurrentTimes(updatedTimes);
    };

    updateTimes();

    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      const weatherResults: Record<string, string> = {};

      for (const item of countries) {
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${item.lat}&longitude=${item.lon}&current_weather=true`
          );

          const data = await response.json();

          const temp = data.current_weather.temperature;
          const code = data.current_weather.weathercode;

          const weatherDescription = getWeatherDescription(code);

          weatherResults[item.city] = `${weatherDescription} ${temp}°C`;
        } catch (error) {
          weatherResults[item.city] = 'Erro ao carregar clima';
        }
      }

      setWeatherData(weatherResults);
    };

    fetchWeather();
  }, []);

  const getWeatherDescription = (code: number) => {
    if (code === 0) return '☀️ Céu limpo';
    if (code <= 3) return '🌤️ Parcialmente nublado';
    if (code <= 48) return '☁️ Nublado';
    if (code <= 67) return '🌧️ Chuva';
    if (code <= 77) return '❄️ Neve';
    if (code <= 99) return '⛈️ Tempestade';

    return '🌍 Clima indisponível';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Olá bem-vinda Ana ✨
          </h1>

          <p className="text-slate-300 text-lg">
            Acompanhe os horários e o clima em diferentes países do mundo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {countries.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 group h-[420px]"
            >
              <img
                src={item.image}
                alt={item.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

              <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold">{item.city}</h2>
                    <p className="text-slate-300 text-lg">{item.country}</p>
                  </div>

                  <div className="text-5xl">🌎</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/10">
                  <p className="text-sm text-slate-300 mb-1">
                    Horário Atual
                  </p>

                  <p className="text-3xl font-bold tracking-widest">
                    {currentTimes[item.city] || 'Carregando...'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-sm text-slate-300 mb-1">Clima</p>

                  <p className="text-lg font-medium">
                    {weatherData[item.city] || 'Carregando clima...'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-slate-400 text-sm">
          Projeto desenvolvido em React + Tailwind CSS 🌍
        </div>
      </div>
    </div>
  );
}
