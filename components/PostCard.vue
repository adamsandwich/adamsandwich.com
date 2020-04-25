<template>
  <div class="card">
    <!-- nuxt-link 使用 vue-router 不会触发 server 渲染 此处使用 a 标签 -->
    <a :href="`posts/${post.fileName.replace('.md','')}`">
      <hgroup>
        <h1>{{post.conf.title}}</h1>
        <h3>
          {{post.conf.date.slice(0, 10)}}
          <span class="post-count">· {{getReadTime}} min read</span>
        </h3>
      </hgroup>
    </a>
    <div class="tags">
      <a :key="tag" v-for="tag in post.conf.tags" class="tag">{{tag}}</a>
    </div>
    <div class="content">{{getTruncateContent}}</div>
  </div>
</template>

<script>
import { min2read } from "~/utils/wordcount.js";
import striptags from "striptags";

export default {
  computed: {
    getReadTime: function() {
      return min2read(this.post.content, { cn: 150, en: 100 });
    },
    getTruncateContent: function() {
      return striptags(this.post.content).slice(0, 200);
    }
  },
  props: ["post"]
};
</script>

<style scoped lang="less">
.card {
  border-radius: 2px;
  padding: 1rem;
  margin-top: 2rem;
  transition: 0.3s all;
  text-align: left;
  &:hover {
    box-shadow: 0 14px 20px 0 rgba(0, 0, 0, 0.26);
    transform: translateY(-2px);
  }

  a {
    line-height: 1.3;

    h1 {
      line-height: 1;
      color: #e8eae6;
    }
  }
  .tags {
    margin-bottom: 1em;

    .tag {
      border-radius: 2px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0 0.6rem;
      height: 1.8rem;
      margin-right: 0.6rem;

      @media (prefers-color-scheme: dark) {
        background-color: #444;
      }

      @media (prefers-color-scheme: light),
        (prefers-color-scheme: no-preference) {
        background-color: rgb(242, 242, 242);
        color: #666;
      }
    }
  }
  @media (max-width: 1200px) {
    width: calc(100% - 2rem);
  }

  @media (min-width: 1200px) {
    width: 50vw;
  }

  @media (prefers-color-scheme: dark) {
    background-color: #28292c;
  }

  @media (prefers-color-scheme: light), (prefers-color-scheme: no-preference) {
    background-color: rgb(255, 255, 255);

    a {
      color: #999;

      h1 {
        color: #333;
      }
    }

    .content {
      color: #999;
    }
  }
}
</style>
