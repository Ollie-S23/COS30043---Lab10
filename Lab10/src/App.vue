<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-wrapper">
    <header>
      <h1>Lab 08</h1>
      <nav>
        <RouterLink to="/interface">Interface</RouterLink>
        <RouterLink to="/table"> Table</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
    <footer>
      <p>Copyright &copy; 2026</p>
    </footer>
  </div>
</template>

<style scoped>
  .app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }

    nav {
    display: flex;
    gap: 0;
    padding: 0 1rem;
  }

  header h1 {
    color: black;
  }

  header, footer {
    background-color: grey;
  }

  footer p {
    color: white;
  }

  nav a {
    color: #fff;
    text-decoration: none;
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
    transition: background-color 0.2s;
  }

  nav a:hover {
    background-color: cyan;
  }

  nav a.router-link-exact-active {
    background-color: darkblue;
  }

</style>