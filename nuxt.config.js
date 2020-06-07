
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~static/normalize.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
  ],
  // styleResources: {
  //   less: './**/*.less'
  // },
  loader: [
    {
      test: /\.less$/,
      loaders: 'style-loader!css-loader!less-loader'
    }
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      config.node = {
        console: true,
        fs: 'empty',
      }
    }
  },
  generate: {
    // 为动态路由添加静态化
    // 静态化站点的时候动态路由是无法被感知到的
    // 所以可以预测性的在这里配置
    routes: async () =>  {
      // readdirSync 轻松读取目录中的所有文件
      const fs = require("fs-extra");
      const { promisify } = require("util");
      const readdir = promisify(fs.readdir);
      // 读取本地 md 文件名并按时间降序
      let postsFilePath = await readdir("static/posts", "utf-8");
      return postsFilePath
        .filter(data => /\.md$/.test(data))
        .sort((a, b) => new Date(b.slice(0, 10)) - new Date(a.slice(0, 10)))
        .map((id) => {
          return {
            route: `/posts/${id.replace('.md', '')}`,
            payload: id.replace('.md', ''),
          }
        })
    }
  }
}
