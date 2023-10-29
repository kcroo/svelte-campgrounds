<script lang='ts'>
  // https://docs.maptiler.com/svelte/maplibre-gl-js/how-to-use-maplibre-gl-js/
  import { onMount, onDestroy } from 'svelte';
  import { Map } from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { PUBLIC_BASE_MAPS_KEY } from '$env/static/public';
 
  let map: Map;
  let mapContainer: HTMLElement;

  onMount(() => {
    const initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };

    console.log('making a map!')

    try {
      console.log('hello')
      map = new Map({
        container: mapContainer,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${PUBLIC_BASE_MAPS_KEY}`,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
      });

    } catch(Error) {
      console.log(Error)
    }
  });

  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div class="map-wrap">
  <a href="https://www.maptiler.com" class="watermark"><img
    src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo"/></a>
  <div class="map" bind:this={mapContainer}></div>
</div>

<style>
  .map-wrap {
    position: relative;
    width: 100%;
    height: 400px;
  }

  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .watermark {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 999;
  }
</style>