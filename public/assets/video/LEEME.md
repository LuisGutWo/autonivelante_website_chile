# Video del hero

Acá va el video de fondo del banner de portada. `Banner.tsx` lo busca con
estos dos nombres exactos:

```
public/assets/video/banner-autonivelante.webm
public/assets/video/banner-autonivelante.mp4
```

Mientras no estén, el banner muestra el póster
(`/assets/images/banner/autonivelante_banner_img.webp`) y se ve correcto: el
póster es el degradado previsto, no un error.

## De dónde salía antes

De Firebase Storage, en el bucket `login-huellitas.appspot.com`, con el
nombre `Untitled (700 x 840 px) (520 x 642 px).webm`. Esa URL hoy responde
**402 Payment Required**: la facturación de ese proyecto está cerrada. Era la
causa de que el banner se quedara congelado en la imagen fija.

## Los dos formatos

WebM lo reproducen Chrome, Firefox y Safari 16 en adelante. El MP4 está para
los Safari anteriores, que si no se quedarían con el póster. El navegador usa
el primer `<source>` que sabe leer, así que basta con poner los dos.

Si solo tienes el `.webm`, déjalo: el sitio funciona igual y Safari viejo ve
el póster.

## Cómo prepararlo

El original estaba pensado para un recuadro de 520 × 642. Como fondo a sangre
conviene algo más ancho, pero sin exagerar: es decoración detrás de un texto,
nadie lo mira de cerca.

```bash
# WebM (VP9) — el principal
ffmpeg -i original.mov -c:v libvpx-vp9 -crf 38 -b:v 0 -vf "scale=1280:-2" \
  -an -pix_fmt yuv420p banner-autonivelante.webm

# MP4 (H.264) — respaldo para Safari viejo
ffmpeg -i original.mov -c:v libx264 -crf 30 -preset slow -vf "scale=1280:-2" \
  -an -movflags +faststart -pix_fmt yuv420p banner-autonivelante.mp4
```

`-an` quita el audio: el video va en bucle y silenciado, el audio sería peso
puro. `-movflags +faststart` mueve el índice al principio del MP4 para que
empiece a reproducirse sin descargarlo entero.

## Vigila el peso

Esto no pasa por el optimizador de imágenes, así que no gasta
transformaciones — pero sí **ancho de banda**, y se descarga en cada visita
sin caché. Un video de hero de 3 MB pesa más que todas las imágenes del sitio
juntas (6,2 MB entre 106 archivos).

Apunta a **menos de 1,5 MB**. Si no baja de ahí, recorta la duración antes
que la calidad: un bucle de 6 segundos se ve igual de bien que uno de 20 y
pesa un tercio.

`Banner.tsx` ya evita el gasto donde no aporta: en teléfono y con
`prefers-reduced-motion` no pone los `<source>`, así que el archivo ni se
pide y esas visitas se quedan con el póster.
