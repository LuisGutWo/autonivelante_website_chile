# Video del hero

El video de fondo del banner de portada. `Banner.tsx` busca estos dos nombres
exactos:

```
public/assets/video/banner-autonivelante.webm   458 KB
public/assets/video/banner-autonivelante.mp4    567 KB
```

Si falta alguno, el banner muestra el póster
(`/assets/images/banner/autonivelante_banner_img.webp`) y se ve correcto: el
póster es el degradado previsto, no un error.

## De dónde salía antes

De Firebase Storage, en el bucket `login-huellitas.appspot.com`, con el
nombre `Untitled (700 x 840 px) (520 x 642 px).webm`. Esa URL responde **402
Payment Required**: la facturación de ese proyecto está cerrada. Era la causa
de que el banner se quedara congelado en la imagen fija.

## Qué se le hizo al original

El archivo que vino del respaldo medía **12,57 MB**: 17,9 s a 2174×952, con
pista de audio y el índice al final. Medido en una visita de escritorio,
costaba **9,51 MB en tres peticiones** y era el **91% del peso de la
portada**.

Los comandos que lo dejaron como está hoy, con `ffmpeg`:

```bash
# WebM (VP9) — el que usan Chrome, Firefox y Safari 16+
ffmpeg -t 10 -i original.mp4 \
  -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -cpu-used 2 \
  -vf "scale=1280:-2" -an -pix_fmt yuv420p \
  banner-autonivelante.webm

# MP4 (H.264) — respaldo para Safari anterior a la 16
ffmpeg -t 10 -i original.mp4 \
  -c:v libx264 -crf 30 -preset slow \
  -vf "scale=1280:-2" -an -movflags +faststart -pix_fmt yuv420p \
  banner-autonivelante.mp4
```

Qué hace cada parte, porque no es obvio:

- **`-t 10`** recorta a 10 segundos. Es lo que más pesa en el resultado: a
  igual calidad, la mitad de la duración es la mitad del archivo.
- **`scale=1280:-2`** baja de 2174 px a 1280. El banner se renderiza en una
  caja de 1425×663, así que el original traía casi el doble de píxeles de los
  que se ven. El `-2` deja el alto par, que es lo que exige H.264.
- **`-an`** quita el audio. El video va `muted` y en bucle: el audio eran 253
  kb/s que nadie iba a escuchar nunca.
- **`-movflags +faststart`** mueve el índice (`moov`) al principio del MP4.
  Sin eso el navegador no puede empezar a reproducir hasta encontrarlo al
  final, y se veía en la red: pedía el archivo, saltaba al último byte, y
  recién entonces descargaba. Tres peticiones en vez de una.

Resultado medido en el navegador, visita de escritorio en frío:

| | antes | después |
|---|---|---|
| transferido | 9,51 MB | **0,43 MB** |
| peticiones | 3 | **1** |
| peso de la portada | 10,47 MB | **1,39 MB** |
| el video era | 91% de la página | 31% |

## Si lo vuelves a cambiar

Apunta a **menos de 1 MB por archivo**. Esto no gasta transformaciones del
optimizador de imágenes, pero sí ancho de banda de Vercel, y se descarga
entero en cada visita sin caché.

Si no baja de ahí, **recorta la duración antes que la calidad**: un bucle de
6 segundos se ve igual de bien que uno de 20 y pesa un tercio.

### El bucle no tiene salto, y cómo se consiguió

El corte a 10 s dejaba un salto al volver al principio: la toma es un paneo
lento, así que el último cuadro y el primero mostraban encuadres distintos.
Medido con PSNR entre ambos: **15,3 dB**, es decir dos imágenes muy
diferentes.

Se arregló con un solape: el final se funde con el principio, y el resultado
dura 8,5 s en vez de 10.

```bash
ffmpeg -i entrada.mp4 -filter_complex \
  "[0:v]trim=start=1.5,setpts=PTS-STARTPTS[a]; \
   [0:v]trim=end=1.5,setpts=PTS-STARTPTS[b]; \
   [a][b]xfade=transition=fade:duration=1.5:offset=7[v]" \
  -map "[v]" -c:v libx264 -crf 28 -preset slow -an \
  -movflags +faststart -pix_fmt yuv420p salida.mp4
```

La idea: `a` es el clip desde el segundo 1,5 (dura 8,5 s) y `b` son sus
primeros 1,5 s. `xfade` los funde empezando en el segundo 7 de `a`, así que
el último cuadro de la salida es el primero de `b`, que a su vez es el primer
cuadro de la salida. El bucle cierra sobre sí mismo.

Con el solape el PSNR entre el primer y el último cuadro sube a **37,8 dB**:
prácticamente la misma imagen. El salto desaparece.

Para el WebM es el mismo `-filter_complex`, cambiando el códec por
`libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -cpu-used 2`.

La regla general: **la duración del solape sale de la velocidad del
movimiento**. 1,5 s funciona con este paneo; con una toma más rápida habría
que alargarlo, y con una cámara fija casi no haría falta.

`Banner.tsx` ya evita el gasto donde no aporta: en teléfono y con
`prefers-reduced-motion` no monta los `<source>`, así que el archivo ni se
pide. Verificado: a 390 px hay cero descargas de video.
