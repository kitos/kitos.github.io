import Head from 'next/head'
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { useEffect, useRef } from 'react'
import got from 'got'
import { decode } from '@googlemaps/polyline-codec'
import { addGrayscale } from '../leaflet/grayscale'

interface IProps {
  ridesPolylines: string[]
}

let BerlinStravaRides = ({ ridesPolylines }: IProps) => {
  let mapRef = useRef()

  useEffect(() => {
    let Leaflet = window.L

    if (!mapRef.current) {
      addGrayscale(Leaflet)

      let map = Leaflet.map('os-map')

      map.setView([52.51, 13.38], 11.5)

      Leaflet.tileLayer
        .grayscale('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
        })
        .addTo(map)

      mapRef.current = map
    }

    ridesPolylines.forEach((polyline) =>
      Leaflet.polyline(decode(polyline), {
        color: '#E95A29',
        weight: 2,
        opacity: 0.8,
        lineJoin: 'round',
      }).addTo(mapRef.current)
    )
  }, [])

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
          integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
          crossOrigin=""
        />
      </Head>

      <h1>Berlin rides</h1>

      <div style={{ height: 580 }} id="os-map" />
    </div>
  )
}

let token = ''

interface IActivity {
  type: string
  map: { summary_polyline: string }
}

export let getStaticProps = async (
  ctx: GetStaticPropsContext
): Promise<GetStaticPropsResult<IProps>> => {
  let activities = await got
    .get('https://www.strava.com/api/v3/athlete/activities', {
      headers: { authorization: `Bearer ${token}` },
      searchParams: { per_page: 200 },
    })
    .json<IActivity[]>()
    .catch((_) =>
      got
        .post('https://www.strava.com/oauth/token', {
          form: {
            client_id: '1',
            client_secret: '',
            grant_type: 'refresh_token',
            refresh_token: '',
          },
        })
        .json<{
          token_type: 'Bearer'
          access_token: string
          expires_at: number
          expires_in: number
          refresh_token: string
        }>()
        .then((_) => [])
    )

  return {
    props: {
      ridesPolylines: activities
        .filter((a) => a.type === 'Ride' && a.map.summary_polyline)
        .map((a) => a.map.summary_polyline),
    },
  }
}

export default BerlinStravaRides
