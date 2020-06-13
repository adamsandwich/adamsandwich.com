if (process.client) {
  L2Dwidget.init({
    pluginRootPath: "live2dw/",
    pluginJsPath: "lib/",
    pluginModelPath: "assets/",
    tagMode: false,
    debug: false,
    model: {
      display: { position: "right", width: 150, height: 300 },
      mobile: { show: true },
      jsonPath: "/live2d-widget-model-hijiki/assets/hijiki.model.json"
      // jsonPath: "/live2dw/assets/hijiki.model.json"
    },
    log: false
  });
}
