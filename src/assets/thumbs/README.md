# Session cover art

Drop the session thumbnails in this folder and they are picked up automatically
at build time — no code change needed.

- Supported: `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`
- Files are assigned to sessions in **filename order**, which is why the
  Academy's numbered exports (`01 …`, `02 …`) work well here.
- A session keeps the same image across all of its recordings.
- Any session left over when the images run out falls back to the generated
  artwork, so a partial set is fine.

Aim for 16:9 and roughly 640px wide. The build inlines every asset into a single
HTML file, so full-size 2MB PNGs will bloat it badly — resize before committing:

```bash
# with ImageMagick
mogrify -resize 640x360^ -gravity center -extent 640x360 -quality 78 -format jpg *.png
```

See `src/lib/thumbnails.ts` for the loading logic.
