/*
 * L.TileLayer.Grayscale is a regular tilelayer with grayscale makeover.
 * https://github.com/Zverik/leaflet-grayscale
 */
export let addGrayscale = (Leaflet: any) => {
  Leaflet.TileLayer.Grayscale = Leaflet.TileLayer.extend({
    options: {
      quotaRed: 21,
      quotaGreen: 71,
      quotaBlue: 8,
      quotaDividerTune: 0,
      quotaDivider() {
        return (
          this.quotaRed +
          this.quotaGreen +
          this.quotaBlue +
          this.quotaDividerTune
        )
      },
    },

    initialize(url: string, options: any) {
      options = options ?? {}
      options.crossOrigin = true
      Leaflet.TileLayer.prototype.initialize.call(this, url, options)

      this.on('tileload', (e: any) => this._makeGrayscale(e.tile))
    },

    _createTile() {
      let tile = Leaflet.TileLayer.prototype._createTile.call(this)
      tile.crossOrigin = 'Anonymous'
      return tile
    },

    _makeGrayscale(img: any) {
      if (img.getAttribute('data-grayscaled')) return

      img.crossOrigin = ''
      let canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      let ctx = canvas.getContext('2d')
      ctx!.drawImage(img, 0, 0)

      let imgd = ctx!.getImageData(0, 0, canvas.width, canvas.height)
      let pix = imgd.data

      for (let i = 0; i < pix.length; i += 4) {
        pix[i] =
          pix[i + 1] =
          pix[i + 2] =
            (this.options.quotaRed * pix[i] +
              this.options.quotaGreen * pix[i + 1] +
              this.options.quotaBlue * pix[i + 2]) /
            this.options.quotaDivider()
      }
      ctx!.putImageData(imgd, 0, 0)
      img.setAttribute('data-grayscaled', true)
      img.src = canvas.toDataURL()
    },
  })

  Leaflet.tileLayer.grayscale = (url: string, options: any) =>
    new Leaflet.TileLayer.Grayscale(url, options)

  return Leaflet
}
