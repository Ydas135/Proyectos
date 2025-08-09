document.addEventListener("DOMContentLoaded", () => {
  const fxCanvas = document.getElementById("fxCanvas"),
        ctx = fxCanvas.getContext("2d"),
        lyricsEl = document.getElementById("lyrics"),
        audio = document.getElementById("bgMusic");

  function resizeCanvas(){
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const hearts = [];
  function createHeart(){
    hearts.push({
      x: Math.random()*fxCanvas.width,
      y: fxCanvas.height + 20,
      size: Math.random()*10 + 8,
      speed: Math.random()*1 + 0.7,
      opacity: Math.random()*0.5 + 0.4,
      color: Math.random()>0.5 ? "#ff00e0" : "#00f5ff"
    });
  }
  function drawHearts(){
    ctx.clearRect(0,0,fxCanvas.width, fxCanvas.height);
    hearts.forEach((h,i) => {
      ctx.globalAlpha = h.opacity;
      ctx.fillStyle = h.color;
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.bezierCurveTo(h.x - h.size, h.y - h.size, h.x - h.size*2, h.y + h.size/3, h.x, h.y + h.size);
      ctx.bezierCurveTo(h.x + h.size*2, h.y + h.size/3, h.x + h.size, h.y - h.size, h.x, h.y);
      ctx.fill();
      h.y -= h.speed;
      if(h.y < -10) hearts.splice(i,1);
    });
  }
  function loop(){
    if(Math.random() < 0.05) createHeart();
    drawHearts();
    requestAnimationFrame(loop);
  }
  loop();

  const lyrics = [
    {t:2, text:"Encontré un amor para mí"},
    {t:9, text:"Cariño, solo sumérgete y sígueme"},
    {t:16, text:"Encontré una chica hermosa y dulce"},
    {t:24, text:"Nunca supe que eras quien me esperaba"},
    {t:31, text:"Porque éramos solo niños cuando nos enamoramos"},
    {t:36, text:"Sin saber lo que era"},
    {t:40, text:"Esta vez no te abandonaré"},
    {t:47, text:"Cariño, bésame lento, tu corazón es todo lo que tengo"},
    {t:55, text:"Y en tus ojos se reflejan los míos"},
    {t:62, text:"Cariño, bailo en la oscuridad contigo en mis brazos"},
    {t:72, text:"Descalzos sobre el césped, escuchando nuestra canción favorita"},
    {t:79.5, text:"Cuando dijiste que te veías mal, susurré en voz baja"},
    {t:86.5, text:"Pero lo escuchaste; cariño, esta noche te ves perfecta"},
    {t:100.5, text:"Encontré una mujer más fuerte que cualquiera que conozco"},
    {t:108, text:"Comparte mis sueños, espero que algún día comparta su hogar"},
    {t:116, text:"Encontré un amor para llevar más que mis secretos"},
    {t:122.5, text:"Para llevar amor, para llevar hijos propios"},
    {t:130, text:"Aún somos niños, pero tan enamorados, luchando contra todo pronóstico"},
    {t:138, text:"Sé que esta vez estaremos bien"},
    {t:146, text:"Cariño, solo toma mi mano, sé mi chica, yo seré tu hombre"},
    {t:154, text:"Veo mi futuro en tus ojos"},
    {t:160.5, text:"Cariño, bailo en la oscuridad contigo en mis brazos"},
    {t:171, text:"Descalzos sobre el césped, escuchando nuestra canción favorita"},
    {t:178, text:"Cuando te vi en ese vestido, viéndote tan hermosa"},
    {t:185.5, text:"No merezco esto, cariño, te ves perfecta esta noche"},
    {t:198.5, text:"No, no, no..."},
    {t:203.5, text:"Mm, oh..."},
    {t:206, text:"Cariño, bailo en la oscuridad contigo en mis brazos"},
    {t:215, text:"Descalzos sobre el césped, escuchando nuestra canción favorita"},
    {t:223.5, text:"Tengo fe en lo que veo, ahora sé que he conocido"},
    {t:231.5, text:"A un ángel en persona, y ella se ve perfecta"},
    {t:238, text:"Aunque no merezco esto, te ves perfecta esta noche"},
    {t:247, text:"Hagamos de esta canción una realidad mi amor. Te amo"}
    ];

  let last = "";
  audio.addEventListener("timeupdate", () => {
    const cur = audio.currentTime;
    const line = lyrics.slice().reverse().find(l => cur >= l.t);
    if (line && line.text !== last) {
      lyricsEl.style.opacity = 0;
      setTimeout(() => {
        lyricsEl.textContent = line.text;
        lyricsEl.style.opacity = 1;
      }, 500);
      last = line.text;
    }
  });

  document.body.addEventListener("click", () => {
    audio.play().catch(()=>{});
  }, { once:true });
});






