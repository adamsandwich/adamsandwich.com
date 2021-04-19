<template>
  <div class="entity">
    <Header />
    <main id="recent-posts">
      <PostCard :key="post.conf.title" v-for="post in posts" :post="post" />
      <!-- <Pagination :posts="posts" :currentPage="currentPage" :pageSize="pageSize"/> -->
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "~/components/Header.vue";
import PostCard from "~/components/PostCard.vue";
import Footer from "~/components/Footer.vue";
import Pagination from "~/components/Pagination.vue";

export default {
  components: {
    Header,
    PostCard,
    Footer,
    Pagination,
  },
  data() {
    return {
      posts: [],
      pageSize: 5,
      currentPage: 1,
    };
  },
  async asyncData({}) {
    // 一定要有，这样才能告诉 webpack 以下的代码是要运行在服务端的，
    // 不然客户端可没有 fs，执行会出错。
    if (process.server) {
      // 引入 markdown 处理工具
      const md = require("markdown-it")();
      const YAML = require("yaml");
      const { promisify } = require("util");
      const fs = require("fs-extra");
      const readdir = promisify(fs.readdir);
      const readFile = promisify(fs.readFile);
      // 读取本地 md 文件名并按时间降序
      let postsFilePath = await readdir("static/posts", "utf-8");
      postsFilePath = postsFilePath
        .filter(data => /\.md$/.test(data))
        .sort((a, b) => new Date(b.slice(0, 10)) - new Date(a.slice(0, 10)));
      let posts = [];
      for (let v of postsFilePath) {
        let raw = await readFile(`static/posts/${v}`);
        raw = raw.toString();
        let post = {};
        let rawData = raw.split("---");
        // 配置参数
        post.fileName = v;
        post.conf = YAML.parse(rawData[1]);
        post.content = md.render(rawData[2]);
        // 渲染后的正文
        // console.log(md.render(post.content));
        posts.push(post);
      }
      // console.log(raw)
      // let data = md.render(raw);
      return { posts: posts };

      // 将 markdown 文本渲染为 html
      // let data = md.render(raw);
      // ....
    }
  }
};
</script>

<style scoped lang="less">
.entity {
  margin: 0 auto;
  flex-direction: column;
  justify-content: flex-start;
  text-align: center;
}

#recent-posts {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
