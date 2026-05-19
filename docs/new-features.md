此次重构计划引入的新功能:
1. 模型/提示词不再傻乎乎的"编辑模式", 而是item直接支持编辑按钮
2. 页面提取,增加方式: https://github.com/ctxinf/webpage-summary/pull/17/changes
3. 配置统一化,  全局/规则, 优先级由低到高, 可覆盖
4. 导入导出: 剪切板
5. 更好的Input Content View
6. 使用ai-sdk的chat组件
7. tokenizer替代字符串
8. 粘贴按钮/go top/go bottom 可以隐藏
9. 模型provider仅保留几个通用的provider, 尝试添加huggingface通用免费provider
10. provider自定义body
11. provider通过 /models获取可选择列表
12. provider test 按钮, 测试有效性
13. 显示thinking 内容
14. option页面顶部栏 切换 模型,prompt
15. 不要圆圈的悬浮栏



# 大
## 优化
优化summary.ts 核心流程


## 模型配置
- 不再写死为单个页面包含一些通用字段, 然后通过if扩展其他字段, 这是一个地域
- 改为每个provider对应一个配置页面, 通过**配置的描述列表**渲染input元素, 最后提交时组装为完成配置


## 多面板
支持多种选项开启/关闭:
- 页面内嵌侧边栏面板
- 页面内浮动面板(默认开启, 原有的)
- popup面板+固定