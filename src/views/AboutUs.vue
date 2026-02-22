<template>
  <div class="about-page">
    <section class="hero">
      <h1>O nama</h1>
      <p>Upoznajte tim koji stoji iza naših ukusnih recepata.</p>
    </section>

    <section class="team">
      <h2>Naš tim</h2>
      <div class="team-grid">
        <div class="member" v-for="member in team" :key="member.id">
          <h3>{{ member.name }}</h3>
          <p>{{ member.role }}</p>
        </div>
      </div>
    </section>

    <section class="mission">
      <h2>Naša misija</h2>
      <p>
        Naš cilj je da vam donesemo najukusnije recepte sa jednostavnim uputstvima, i da inspirišemo
        sve ljubitelje hrane da uživaju u kuvanju.
      </p>
    </section>
  </div>
</template>

<script setup>
const team = [
  {
    id: 1,
    name: 'Aleksandar Jovanović',
    role: 'Osnivač & Glavni kuvar',
  },
  {
    id: 2,
    name: 'Marko Joksimović',
    role: 'Osnivač & Glavni kuvar',
  },
]
</script>

<style scoped>
.about-page {
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 1.6;
}

.hero {
  text-align: center;
  padding: 90px;
  background-color: #743f3f;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 15px;
  margin-top: 50px;
}

.hero p {
  font-size: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.team {
  padding: 60px 20px;
  text-align: center;
  background-color: #fff7f0;
}

.team h2 {
  font-size: 36px;
  color: #cc7836;
  margin-bottom: 40px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  justify-items: center;
}

.member {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.member:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.member img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.member h3 {
  font-size: 20px;
  color: #cc7836;
  margin-bottom: 5px;
}

.member p {
  font-size: 16px;
  color: #555;
}

.mission {
  padding: 60px 20px;
  background-color: #fff;
  text-align: center;
}

.mission h2 {
  font-size: 36px;
  color: #cc7836;
  margin-bottom: 20px;
}

.mission p {
  font-size: 18px;
  max-width: 700px;
  margin: 0 auto;
  color: #444;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 36px;
  }

  .hero p {
    font-size: 18px;
  }

  .team h2,
  .mission h2 {
    font-size: 28px;
  }

  .mission p {
    font-size: 16px;
  }
}
</style>
