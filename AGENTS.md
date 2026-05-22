 当前项目要对 reference 中的项目进行react 重写,  先分析它现在的情况 ,写入到docs/*.md中


 ## 重写综合要求
 1. 不必1:1复刻, 大胆重构, 因为原有的代码有些地方很垃圾
 2. 多问, 多停下来询问使用者意见

## 项目要求
1. 权限和原来一致, 是所有网站的权限
## 当前阶段:
现在来跑通一些示例, 必须以samples/ 子目录区分, 且通过constants配置开关统一控制.


## 配置AgentBrowser调试
不要运行"npm run dev", 这个一直常驻后台, 如果需要重启, 通知用户手动进行
```sh
agent-browser open "chrome-extension://agkkdeeogabdcoenmlakmamblageajhg/options.html#/general" #尽量直接打开需要测试的路径
agent-browser snapshot -i  

agent-browser console 
#... 更多参考对应skills
```