# Ontario Roleplay Website
Node.js + Express + SQLite. All content is stored in the database (`DATA_DIR/site.db`), edited through `/admin/login`.

## 1. Hosting
- **GoDaddy shared/cPanel "Web Hosting" usually can NOT run this** (no persistent Node.js server). A GoDaddy **VPS** can. Easier: **Render, Railway, Fly.io, or a $5 VPS (DigitalOcean/Hetzner)**.
- You need: Node.js 18+, a **persistent disk/volume** (otherwise saved edits vanish on redeploy), and HTTPS.
- Your GoDaddy *domain* can still be pointed at any of these (step 6).

## 2. Install (VPS or any host with a terminal)
1. Upload this folder; put your images in `public/images/` named `logo.png` (Ontario Roleplay at Dusk) and `banner.png` (banner), or upload them later in the dashboard.
2. `npm install`
3. `cp .env.example .env`, then set `SESSION_SECRET` (command is in the file) and `DATA_DIR` (a persistent folder).
4. `npm run setup` : asks for admin username and password; stores only a salted bcrypt hash. Use a strong password, not the username. Change it later in Account Settings.
5. `npm start` (use `pm2 start server.js` to keep it running).
6. **Domain/HTTPS:** point your domain's A record to the server IP; on a VPS use Nginx + Let's Encrypt (`certbot --nginx`); Render/Railway give HTTPS automatically. Keep `NODE_ENV=production` (secure cookies need HTTPS).
7. Visit `/admin/login`.

## 3. Verify it works
- **Login:** wrong password is rejected; after 6 failed tries you're locked for 15 min; correct one opens `/admin/dashboard`. Visiting the dashboard logged out redirects to login.
- **Edit/save:** Homepage Editor → change the title → Save Changes → green "Saved" message.
- **Persists:** open the live site in another browser/phone (visitor view) and refresh: new title shows.
- **Restart:** stop and run `npm start` again (or restart the host): the title is still there.

## Notes
- Official department logos: upload only ones you have permission to use; placeholders show the abbreviation.
- No live player count is shown (no real integration).
- Rewriting source files from the dashboard is not implemented; database editing is the safe default.
- Backups: copy `DATA_DIR` (site.db + uploads) regularly.
