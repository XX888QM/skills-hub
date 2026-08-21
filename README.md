# 汇总skill

中文 Agent Skills 市场。GitHub 上的公开 `SKILL.md` 是货源，本站做发现、预览和安装。

网站：https://skill.yxaikfz.com/
仓库：https://github.com/XX888QM/skills-hub

## 本地

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 http://localhost:3000

上线前先在本机跑一遍：

```bash
npm run build
npm start
```

## 上线

线上地址：https://skill.yxaikfz.com/

环境变量：
- `SITE_URL`：正式访问地址
- `GITHUB_TOKEN`：GitHub 只读 token，避免公开接口额度不够
- `CRON_SECRET`：仅在外部定时任务调用 `/api/cron/refresh` 时需要

不填 `GITHUB_TOKEN` 也能上，流量一大热门和详情可能暂时空。页面数据本身会按缓存时间更新；`CRON_SECRET` 只用于额外的主动刷新。

## 页面

| 路径 | 作用 |
| --- | --- |
| `/` | 首页：搜索、按用途、热门仓库 |
| `/search` | 关键词搜索 |
| `/skills` | 全部公开 Skill |
| `/packs` | 按用途看 |
| `/guide` | 怎么用 |
| `/submit` | 预览公开仓库，不存拷贝 |
| `/s/...` | Skill 说明书 |

## 技术

Next.js、React、Tailwind CSS、TypeScript。数据按需来自 skills.sh、SkillMD 与 GitHub 公开接口，不爬全站。
