# 汇总

中文 Agent Skills 市场。GitHub 上的公开 `SKILL.md` 是货源，本站做发现、预览和安装。

仓库名：`skills-hub`  
地址：https://github.com/XX888QM/skills-hub

## 能做什么

- 检索 skills.sh、SkillMD 与 GitHub 上的公开 Skill
- 在本站读中文说明书，再决定装不装
- 复制 `npx skills add owner/repo`，或复制一段话交给 Agent 代装
- 贴 `owner/repo` 解析上架，不另存一份拷贝
- 不爬全站，只按需打公开接口

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000

可选环境变量：

```
GITHUB_TOKEN=你的 GitHub token
```

有 token 时，热门仓库和上架解析更稳，不容易碰到接口额度。

## 主要页面

| 路径 | 作用 |
| --- | --- |
| `/` | 首页：检索、GitHub 热门、星标榜 |
| `/search` | 关键词检索 |
| `/skills` | 公开 Skill 总览，可排序筛选 |
| `/packs` | 按 GitHub 上比较火的方向收束 |
| `/guide` | 使用说明 |
| `/submit` | 上架：解析公开仓库里的 SKILL.md |
| `/s/...` | Skill 详情 |

## 技术

Next.js、React、Tailwind CSS、TypeScript。数据来自 skills.sh、SkillMD 与 GitHub 公开接口。
