# node-game 以express框架为基础的node项目
[![dependencies Status](https://david-dm.org/bestsamcn/node-game/status.svg)](https://david-dm.org/bestsamcn/node-game)


## 简介
node-game 是一个以express框架（后端）和hAdmin（前端）为基础的javascript项目，涵盖了用户注册，登录，信息修改，用户筛选，搜索等功能。
- develop分支适应需求已经修改了网站首页路由为用户中心
- master主分支路由正常不变

## 准备
```
mongodb 3.2+
redis 3.2
```
## 开发
```
https://github.com/bestsamcn/node-game.git
cd node-game
npm install
grunt
```

##测试
####使用了[mocha](https://github.com/mochajs/mocha "mocha")  [supertest](https://github.com/visionmedia/supertest "supertest") [chai](https://github.com/chaijs/chai "chai")
####[请看阮一峰老师的入门教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html "入门教程")
####请先关闭了node服务器再测试
```
cd test
mocha user.test.js
```

##部署
- 项目使用了nginx服务器做反向代理
- 在config目录中的index.js需要在生产环境中配置好相关的环境变量
- mongodb需要开启权限，并添加授权用户，还需要做好日常定时备份
- linux对外限制访问端口
- 启动项目
```
redis-server.exe
nginx start
mongod -f game.conf
pm2 start start.json
```
