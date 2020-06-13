
<template>
  <footer class="container portrait footer" id="footer">
    <p class="center">Copyright &copy; Adamsandwich {{year}}</p>
    <div id="slogons">
      <!-- <% config.slogons.forEach(function(slogon, i) { %>
      <p class="center displayNone">
        <%- slogon %>
      </p>
      <% }) %>-->
    </div>
    <p class="center">阿罗拉ICP备以太乐园号-6</p>
    <p class="center">
      Powered by
      <a href="https://nuxtjs.org">NUXT</a> and
      <a href="https://adamsandwich.com">Adamsandwich</a>
    </p>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  },
  created() {
    //     var slogons = document.getElementById('slogons');
    // var index = Math.floor(Math.random() * slogons.children.length);
    // slogons.children[index].classList.remove('displayNone');
  }
};
</script>

<style  scoped lang="less">
@import "~static/init.less";
footer {
  margin: 2rem 0;
  a {
    color: #337ab7 !important;
  }
  .center{
    color: #666;
  }
}
</style>
