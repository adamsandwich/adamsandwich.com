<template>
  <div class="container portrait">
    <Header />
    <main class="container portrait">
      <article class="article" v-html="content"></article>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      content: ""
    };
  },
  async asyncData({ params }) {
    // 一定要有，这样才能告诉 webpack 以下的代码是要运行在服务端的，
    // 不然客户端可没有 fs，执行会出错。
    if (process.server) {
      var hljs = require('highlight.js')
      // 引入 markdown 处理工具
      const md = require("markdown-it")({
        breaks: true, // 转化段落里的 \n 成 <br>
        linkify: false, // 自动转化像 URL 的文本成链接
        highlight: function(str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str, true).value;
            } catch (__) {}
          }

          return ""; // 使用额外的默认转义
        }
      });
      const YAML = require("yaml");
      const { promisify } = require("util");
      const fs = require("fs-extra");
      const readdir = promisify(fs.readdir);
      const readFile = promisify(fs.readFile);

      let raw = await readFile(`static/posts/${params.id}.md`);
      raw = raw.toString();
      let post = {};
      let rawData = raw.split("---");
      // 配置参数
      post.conf = YAML.parse(rawData[1]);
      // 渲染后的正文
      post.content = md.render(rawData[2]);
      return { content: post.content };
    }
  }
};
</script>

<style scoped lang="less">
@import "~static/init.less";
main {
  margin-top: 1rem;
}
.article {
  font-size: 14px;
  font-size: 0.875rem;
  line-height: 1.85714286;
  font-weight: 300;
  cursor: default;
  border-radius: 4px;
  padding: 2rem;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);

  @media (prefers-color-scheme: dark) {
    color: @darkColor;
    background-color: #28292c;
  }

  @media (prefers-color-scheme: light), (prefers-color-scheme: no-preference) {
    color: #4a4a4a;
    background-color: rgb(255, 255, 255);
  }

  @media (min-width: 1200px) {
    width: 50vw;
  }

  @media (max-width: 1200px) {
    width: calc(100vw - 2rem);
    padding: 1rem;
  }
}
</style>
