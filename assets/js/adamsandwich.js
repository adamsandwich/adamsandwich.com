var c = document.getElementById('canvas-bg'),
  x = c.getContext('2d'),
  w = window.innerWidth,
  h = window.innerHeight,
  f = 90,
  q,
  m = Math,
  r = 0,
  u = m.PI * 2,
  v = m.cos,
  z = m.random;
c.width = w;
c.height = h;
x.globalAlpha = 0.6;
function i() {
  x.clearRect(0, 0, w, h);
  q = [{ x: 0, y: h * .7 + f }, { x: 0, y: h * .7 - f }];
  while (q[1].x < w + f) d(q[0], q[1]);
}
function d(i, j) {
  x.beginPath();
  x.moveTo(i.x, i.y);
  x.lineTo(j.x, j.y);
  var k = j.x + (z() * 2 - 0.25) * f,
    n = y(j.y);
  x.lineTo(k, n);
  x.closePath();
  r -= u / -50;
  x.fillStyle = '#' + (v(r) * 127 + 128 << 16 | v(r + u / 3) * 127 + 128 << 8 | v(r + u / 3 * 2) * 127 + 128).toString(16);
  x.fill();
  q[0] = q[1];
  q[1] = { x: k, y: n };
}
function y(p) {
  var t = p + (z() * 2 - 1.1) * f;
  return (t > h || t < 0) ? y(p) : t;
}

window.onresize = function () {
  w = window.innerWidth,
    h = window.innerHeight
  c.width = w
  c.height = h
}
i()
var menu = document.getElementById('menu');
var ripple = menu.children.item(0);
var menuList = document.getElementById('menuList');
var menuList_flag = false;
menu.addEventListener('click', function () {
  ripple.classList.add('ripple_active');
  menuList.classList.add('menu--list_zoomin');
  menuList_flag = true;
});
ripple.addEventListener('animationend', function () {
  ripple.classList.remove('ripple_active');
});
document.body.addEventListener('click', function () {
  i();
  if (menuList_flag) {
    menuList.classList.remove('menu--list_zoomin')
    menuList_flag = false;
  }
}, true)
document.body.addEventListener('touchstart', function () {
  i();
  if (menuList_flag) {
    menuList.classList.remove('menu--list_zoomin')
    menuList_flag = false;
  }
}, true)
