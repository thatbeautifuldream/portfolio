# Inter web fonts

`InterVariable-latin.woff2` and `InterVariable-Italic-latin.woff2` are subsets of
the official [Inter 4.1 web fonts](https://rsms.me/inter/inter.css), licensed under
the included `Inter-LICENSE.txt`.

Both preserve the weight (100–900) and optical-size (14–32) axes, standard shaping,
kerning, ligatures, numeric features, and the character variants and stylistic sets enabled in
`src/styles/global.css`. The Latin subset covers every character in the previous
Inter files, plus general punctuation. Hindi uses the separate Noto Sans
Devanagari font. Font metrics match the existing Inter fallback.

To regenerate, download `InterVariable.woff2` and `InterVariable-Italic.woff2`
from `https://rsms.me/inter/font-files/`, then run FontTools' `pyftsubset` on each:

```sh
pyftsubset InterVariable.woff2 \
  --output-file=InterVariable-latin.woff2 --flavor=woff2 \
  --layout-features='ccmp,locl,mark,mkmk,kern,liga,calt,dnom,frac,numr,pnum,tnum,cv02,cv03,cv04,cv11,ss01,ss03' \
  --unicodes='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0304,U+0308-0309,U+0323,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
```

Use the corresponding `InterVariable-Italic` input and output names for italics.
FontTools needs Brotli support to read and write WOFF2.
