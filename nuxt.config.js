
export default {
  target: 'static',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Adamsandwich\'s blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: 'Adamsandwich\'s blog' },
      { name: 'author', content: 'adamsandwich@outlook.com' },
      { hid: 'keywords', name: 'keywords', content: 'adamsandwich, blog, 博客, 个人网站, 互联网, Web' },
      { hid: 'google-site-verification', name: 'google-site-verification', content: 'iJHrfNU6l9QRkLKpfbp-4UC2o-hA8Xewpjk54YZ3MYc' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/L2Dwidget.min.js', async: false },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/static/normalize.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/live2d.js', ssr: false },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/google-analytics'
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
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 1000, // 1kB
        name: 'fonts/[name].[hash:7].[ext]'
      }
    },
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
    },
    build: {
      publicPath: 'https://adamsandwich.com/',
      extractCSS: true,
      optimization: {
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.(css|vue)$/,
              chunks: 'all',
              enforce: true
            }
          }
        }
      },
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
  },
  googleAnalytics: {
    id: 'UA-131159968-1',
  }
}
