# 汇总skill

中文 Agent Skills 市场。GitHub 上的公开 `SKILL.md` 是货源，本站做发现、预览和安装。

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

## 上线（Vercel）

1. 把仓库接到 Vercel，Framework 选 Next.js。
2. 在项目 Environment Variables 里填：
   - `NEXT_PUBLIC_SITE_URL`：正式域名，例如 `https://xxx.vercel.app` 或你的自定义域
   - `GITHUB_TOKEN`：GitHub 只读 token，避免公开接口额度不够
   - `CRON_SECRET`：随便一串足够长的随机字符。Vercel 每天 UTC 16:00（北京时间 0:00）打 `/api/cron/refresh` 时会带上它
3. 部署 Production。
4. 打开首页、搜索、全部、任意一条详情、预览仓库，确认能出说明书和安装命令。

不填 `GITHUB_TOKEN` 也能上，流量一大热门和详情可能暂时空。不填 `CRON_SECRET` 则每日刷新不会跑。

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
