<template>
  <div class="hero">
    <img :src="hero" alt="Hero Image" />
  </div>
</template>

<script setup>
import hero from '@/components/backgroundimage.jpeg'
</script>

<style scoped>
.hero {
  width: 100%;
  height: 65vh; /* visina hero sekcije */
  overflow: hidden; /* da ništa ne izlazi iz div-a */
  margin: 0;
  padding: 0;
}

.hero img {
  width: 100%;
  height: 100%; /* zauzima celu visinu div-a */
  object-fit: inherit; /* slika pokriva div proporcionalno, crop ako treba */
  object-position: center; /* centriranje slike */
  display: block; /* uklanja inline spacing ispod slike */
  filter: blur(5px); /* ovde podesite koliko želite blur */
  transform: scale(1.05); /* malo povećanje da ne bude praznih ivica nakon blura */
}
</style>
