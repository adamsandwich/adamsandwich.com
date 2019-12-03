---
title: 使用 certbot 自动更新 SSL 证书
date: 2019-12-03 20:16:32
tags:
  - certbot
  - 教程
---

# 使用 certbot 自动更新 SSL 证书

如果你想用 Let's encrypt 为你的网站提供免费的 SSL 证书，之后最重要的便是自动更新你的证书以防用户获得糟糕的 SSL 安全警告。 Let's encrypt 的 SSL 证书会在安装之后的 90 天失效除非你在过期前更新。

## Certbot 更新命令
Certbot 包含更新已存在证书的脚本，你可以使用下方的更新演练脚本来测试。

```sh
$ sudo certbot renew --dry-run
```

如果上方的测试成功了接下来创建一个 cron 任务按间隔自动执行。

## Certbot 自动更新 Cron 任务

```sh
$ crontab -l
no crontab for root
$ crontab -e
```

add `0 */12 * * * root test -x /usr/bin/certbot  -a \! -d /run/systemd/system &&  perl -e 'sleep int(rand(43200))' &&  certbot -q renew` to crontab file

## 它是如何运作的

这个 cron 任务会每天触发两次更新证书。`certbot -q renew` 会检查证书是否在接下来的 30 过期。如果会过期接着它会静默更新。如果证书不会过期它不会执行其他操作。在更新证书时，它将使用证书创建过程中提供的相同信息，如电子邮件地址、域名、web 服务器根路径等。
