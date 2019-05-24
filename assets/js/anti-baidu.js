(function () {
  var isBaiduReferrer = (function () {
    var url = document.referrer || "";
    if (url && (url.search("http[s]?://") > -1)) {
      var refurl = url.match(/:\/\/(.[^/]+)/)[1];
      if (refurl.indexOf("baidu.com") > -1) {
        return true;
      }
    }
    return false;
  })();
  if (isBaiduReferrer) {
    console.log('anti-baidu detected');
    var dialog = document.createElement('div');
    dialog.className = "dialog";
    dialog.id = "anti-baidu-dialog";
    dialog.innerHTML = `
      <div class="dialog--mask"></div>
      <div class="dialog--content">
        <div class="dialog--content--title">
          <p>警告</p>
        </div>
        <div class="dialog--content--description">
          <p>检测到你还在使用百度这个搜索引擎。<br>作为一个程序员，这是一种自暴自弃！</p>
        </div>
        <div class="dialog--content--footer">
          <button id="anti-baidu-dialog-button">
            <span>关闭</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);
    var antiBaiduDialogButton = document.getElementById("anti-baidu-dialog-button");
    antiBaiduDialogButton.addEventListener('click', function () {
      dialog.remove();
    });
  }
})();
