# node-game 以express框架为基础的node项目
[![dependencies Status](https://david-dm.org/bestsamcn/node-game/status.svg)](https://david-dm.org/bestsamcn/node-game)


## 简介
node-game 是一个以express框架（后端）和hAdmin（前端）为基础的javascript项目，涵盖了用户注册，登录，信息修改，用户筛选，搜索等功能

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
