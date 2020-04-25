<template>
  <header class="intro">
    <div class="header">
      <h1>Adamsandwich blog</h1>
      <span>Aim to be a Pokémon Master.</span>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
.intro {
  background: url(~assets/background.png) center no-repeat;
  background-size: cover;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
  width: 100vw;

  .header {
    padding: 4rem;
    text-align: center;
    background-color: rgba(70, 70, 70, 0.4);
    span {
      color: rgba(255, 255, 255, 0.74);
    }

    @media (max-width: 1200px) {
      padding: 3rem;
    }

    @media (prefers-color-scheme: dark) {
      h1 {
        color: #e8eae6;
      }
    }

    @media (prefers-color-scheme: light),
      (prefers-color-scheme: no-preference) {
      h1 {
        color: rgb(255, 255, 255);
      }
    }
  }
}
</style>
