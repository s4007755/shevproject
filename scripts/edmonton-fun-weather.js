(() => {
  const BOX = document.getElementById('edmFunWx');
  if (!BOX) return;

  // ---- Helpers -------------------------------------------------------------

  const EDM = { lat: 53.5461, lon: -113.4938 }; // Edmonton, AB
  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function codeToCond(code){
    if ([0].includes(code))            return {label:"clear",   emoji:"☀️"};
    if ([1].includes(code))            return {label:"mostly clear", emoji:"🌤️"};
    if ([2].includes(code))            return {label:"partly cloudy", emoji:"⛅"};
    if ([3].includes(code))            return {label:"overcast", emoji:"☁️"};
    if ([45,48].includes(code))        return {label:"foggy", emoji:"🌫️"};
    if ([51,53,55].includes(code))     return {label:"drizzle", emoji:"🌦️"};
    if ([61,63,65].includes(code))     return {label:"rain", emoji:"🌧️"};
    if ([71,73,75,77,85,86].includes(code)) return {label:"snow", emoji:"❄️"};
    if ([95,96,99].includes(code))     return {label:"thunder", emoji:"⛈️"};
    return {label:"weather", emoji:"🌍"};
  }

  const TEMPLATES = [
    "Edmonton report: {emoji} {cond}. Temperature {temp}°C (feels {feels}°). Sun is shining just enough to spotlight how cute you are.",
    "Breaking news: winds at {wind} m/s are picking up—perfect for blowing extra love straight to you. {emoji}",
    "{emoji} Current vibe is {cond} with {hum}% humidity. Scientists agree: the only real warmth is from my heart beaming at you.",
    "Forecast update: {cond}. Temperature {temp}°C, feels like {feels}°. Recommendation: 100% chance of cuddles.",
    "Public service announcement: it’s {cond} and the breeze is {wind} m/s. Please secure loose items like my jaw when you smile.",
    "Atmospheric nonsense: humidity {hum}% trying—and failing—to rival how moist my eyes get when I miss you. {emoji}",
    "{emoji} Sky says {cond}. I say you’re gorgeous. Temperature {temp}°C; my love is at a permanent 10,000°.",
    "Edmonton’s finest: {cond}, {wind} m/s winds, {hum}% humidity. Perfect conditions for a kiss delivery system.",
    "{emoji} Plot twist: {cond} right now, but the real storm is me showering you with compliments.",
    "Local alert: feels like {feels}°. If you feel a warm front, that’s me sending hugs at light speed."
  ];

  const FALLBACK = [
    "Edmonton forecast: 100% chance of me thinking about you.",
    "Skies unknown, feelings known: I love you absurdly much.",
    "If the sun is out, it’s jealous of your glow. If not, it’s hiding from your beauty.",
    "Weather offline. Love online. Constant.",
    "Ambient conditions: perfect for missing you dramatically."
  ];

  function render(data){
    let temp = "--", feels = "--", wind = "--", hum = "--", emoji = "💗", cond = "sweet chaos";

    if (data){
      const c = data.current;
      temp  = Math.round(c.temperature_2m);
      feels = Math.round(c.apparent_temperature);
      hum   = typeof c.relative_humidity_2m === "number" ? Math.round(c.relative_humidity_2m) : "--";
      wind  = typeof c.wind_speed_10m === "number" ? c.wind_speed_10m.toFixed(1) : "--";
      const cc = codeToCond(c.weather_code);
      cond  = cc.label;
      emoji = cc.emoji;
    }

    let line;
    if (!data) {
      line = pick(FALLBACK);
    } else {
      line = pick(TEMPLATES)
        .replaceAll("{temp}", temp)
        .replaceAll("{feels}", feels)
        .replaceAll("{wind}", wind)
        .replaceAll("{hum}", hum)
        .replaceAll("{cond}", cond)
        .replaceAll("{emoji}", emoji);
    }

    BOX.innerHTML = `
      <div class="funwx-card">
        <h3 class="funwx-title"><span class="badge">♥</span> Edmonton: Detailed Forecast</h3>
        <p class="funwx-line">${line}</p>
        ${
          data ? `
          <div class="funwx-stats">
            <span><strong>${Math.round(data.current.temperature_2m)}</strong>°C (feels ${Math.round(data.current.apparent_temperature)}°)</span>
            <span>Humidity: ${hum}%</span>
            <span>Wind: ${wind} m/s</span>
          </div>` : ``
        }
      </div>
    `;
  }

  async function load(){
    try{
      const qs = new URLSearchParams({
        latitude: EDM.lat,
        longitude: EDM.lon,
        current: "temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m",
        timezone: "auto",
        _r: String(rnd(1000,9999))
      });
      const url = `https://api.open-meteo.com/v1/forecast?${qs.toString()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`);
      const json = await res.json();
      render(json);
    } catch(err){
      console.warn("Using fallback silly line:", err);
      render(null);
    }
  }

  load();
})();
