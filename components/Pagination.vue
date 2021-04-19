<template>
  <div class="pagination-container">
    <div class="pagination" :key="pageNumber" v-for="pageNumber in getPaginationItemSize">
      <div v-if="pageNumber === currentPage" class="current">
        {{ pageNumber }}
      </div>
      <div v-else class="item" :href="`/${pageNumber}`">{{ pageNumber }}</div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    getPaginationItemSize: function () {
      return Math.ceil(this.posts.length / this.pageSize);
    },
  },
  methods: {
    getReadTime: function (post) {
      return min2read(post.content, { cn: 150, en: 100 });
    },
  },
  props: ["posts", "currentPage","pageSize"],
};
</script>

<style scoped lang="less">
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.8rem;

  .pagination {
    margin: 0 0.4rem;
  }
  .current {
    cursor: default;
    line-height: 1.4rem;
    border-radius: 50%;
    width: 1.4em;
    height: 1.4em;
    @media (prefers-color-scheme: dark) {
      background-color: #444;
    }

    @media (prefers-color-scheme: light),
      (prefers-color-scheme: no-preference) {
      background-color: rgb(242, 242, 242);
      color: #666;
    }
  }
  .item {
    cursor: pointer;
  }
}
</style>
