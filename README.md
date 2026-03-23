# indexing

> A self-hosted index of every deployment, tool, and project under 5pyd3r.org — one place to track them all.

Live at → [index.5pyd3r.org](https://index.5pyd3r.org)

---

## Stack

Pure HTML/CSS/JS. No frameworks. No build tools. No dependencies.  
Data lives in a single `indexing.json` — edit it, push, done.

---

## Structure

```
indexing/
├── index.html       # markup
├── style.css        # styling
├── script.js        # renders entries from indexing.json
└── indexing.json    # source of truth
```

---

## Adding a Project

Open `indexing.json` and append an entry:

```json
{
  "name": "Project Name",
  "url": "https://your-deployment-url.com",
  "description": "One line. What it does, not what it is.",
  "category": "security",
  "deployed_on": "Cloudflare Pages",
  "repo": "https://github-or-gitlab/repo-name",
  "status": "live",
  "tags": ["tag1", "tag2"]
}
```

### Fields

| Field | Required | Description |
|---|---|---|
| `name` | ✅ | Display name of the project |
| `url` | ✅ | Live deployment URL |
| `subdomain` | ❌ | Display label for the subdomain column; falls back to extracting from `url` |
| `description` | ✅ | One-liner, keep it tight |
| `category` | ✅ | Drives the filter buttons |
| `deployed_on` | ✅ | Platform — Cloudflare Pages, GitHub Pages, etc. |
| `repo` | ❌ | Source repo URL |
| `status` | ✅ | `live` · `down` · `unstable` · `archived` |
| `tags` | ❌ | Array of strings, shown on desktop only |

### Status Values

| Value | Meaning |
|---|---|
| `live` | Deployed and working |
| `down` | Temporarily offline |
| `unstable` | Active development, may break |
| `archived` | No longer maintained |

---

## Deployment

Hosted on **Cloudflare Pages** via this repo.  
Every push to `main` triggers an automatic redeploy.

No build command. Output directory: `/`

---

## License

Licensed under the [Apache License 2.0](LICENSE).

---

*Maintained by [5pyD3R](https://github.com/3rr0r-505) · [5pyd3r.org](https://5pyd3r.org)*
