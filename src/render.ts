import { games, profiles, sites, software, type Project, type Site } from './data.ts';

const logo = `<span class="logo-gate" aria-hidden="true"><svg viewBox="0 0 40 28" width="40" height="28"><path d="M2 8h8M2 20h8M10 2h10a12 12 0 0 1 0 24H10z"/><path d="M32 14h6"/></svg></span>`;

const themeToggle = `<button type="button" class="theme-toggle" aria-label="Temayı değiştir">
  <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
  <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
</button>`;

function chip(site: Site): string {
    const tags = site.tags.map((tag) => `<span class="tag">#${tag}</span>`).join('');
    const lock = site.private ? '<span class="lock">giriş gerekli</span>' : '';
    return `<a class="chip" href="${site.href ?? `https://${site.host}/`}">
  <span class="chip-pins top" aria-hidden="true"></span>
  <span class="chip-body">
    <span class="chip-head">
      <img class="icon" src="${site.icon}" alt="" width="48" height="48" />
      <span class="chip-name">
        <span class="chip-id mono">${site.host}</span>
        <span class="chip-title">${site.title}</span>
      </span>
    </span>
    <span class="chip-summary">${site.summary}</span>
    <span class="chip-meta mono">${tags}${lock}</span>
  </span>
  <span class="chip-pins bottom" aria-hidden="true"></span>
</a>`;
}

function row(project: Project): string {
    return `<li><a href="${project.url}">
  <img class="icon" src="${project.icon}" alt="" width="32" height="32" loading="lazy" />
  <span class="row-name">${project.name}</span>
  <span class="row-summary">${project.summary}</span>
  <span class="row-source mono">${project.source} ↗</span>
</a></li>`;
}

function listing(command: string, projects: Project[]): string {
    return `<section class="listing">
  <h2 class="section-label mono"><span>${command}</span><span class="count">${projects.length} proje</span></h2>
  <ul class="rows">${projects.map(row).join('')}</ul>
</section>`;
}

function header(links: { label: string; url: string }[], navLabel: string): string {
    const nav = links.map((link) => `<a href="${link.url}">${link.label}</a>`).join('');
    return `<header class="site-header">
  <a class="logo" href="/" aria-label="zerohidz ana sayfa">${logo}<span class="logo-text">zerohidz</span></a>
  <div class="header-right"><nav class="site-nav" aria-label="${navLabel}">${nav}</nav>${themeToggle}</div>
</header>`;
}

function footer(): string {
    return `<footer class="site-footer"><span class="mono">$ exit 0</span><span>© ${new Date().getFullYear()} zerohidz</span></footer>`;
}

export function renderHome(): string {
    return `<div class="shell">
${header(profiles, 'Profiller')}
<main>
  <section class="hero">
    <p class="prompt mono"><span class="ps1">zerohidz@home</span>:<span class="cwd">~</span>$ whoami</p>
    <h1>Selamunaleyküm! Ben <span class="hl">zerohidz</span>.</h1>
    <p class="lede">Bilgisayar mühendisiyim. Yaptığım uygulama ve oyunlar aşağıda, yazılarım <a href="https://blog.zerohidz.com/">blogda</a>.</p>
    <p class="bits mono" aria-hidden="true">0x7A 0x65 0x72 0x6F 0x68 0x69 0x64 0x7A</p>
  </section>
  <section>
    <h2 class="section-label mono"><span>$ ls *.zerohidz.com</span><span class="count">${sites.length} adres</span></h2>
    <div class="chips">${sites.map(chip).join('')}</div>
  </section>
  ${listing('$ ls oyunlar/', games)}
  ${listing('$ ls projeler/', software)}
</main>
${footer()}
</div>`;
}

const repoUrl = 'https://github.com/Zerohidz/local-youtube-history';
const zipUrl = `${repoUrl}/archive/refs/heads/main.zip`;

const features = [
    ['Kaydetme', 'Video oynarken her 5 saniyede bir nerede olduğunu kaydeder. Reklamlar sayılmaz.'],
    ['Devam etme', 'Videoyu tekrar açtığında kaydedilen yere sarar.'],
    ['Biten videolar', 'Videoyu bitirdiğinde kaydı silinir.'],
    ['Eski kayıtlar', '90 günden eski kayıtlar silinir.'],
];

const steps = [
    `<a href="${zipUrl}">ZIP dosyasını indir</a> ve bir klasöre aç.`,
    '<code>chrome://extensions</code> sayfasını aç, <strong>Geliştirici modu</strong>nu etkinleştir.',
    '<strong>Paketlenmemiş öğe yükle</strong> düğmesine bas ve indirdiğin klasörün içindeki <code>extension</code> klasörünü seç.',
];

export function renderYoutubeResume(): string {
    const cards = features
        .map(([title, text]) => `<li class="feature"><h3>${title}</h3><p>${text}</p></li>`)
        .join('');
    const stepItems = steps.map((step) => `<li>${step}</li>`).join('');

    return `<div class="shell">
${header([{ label: 'github', url: repoUrl }], 'Bağlantılar')}
<main>
  <section class="hero">
    <p class="prompt mono"><span class="ps1">zerohidz@home</span>:<span class="cwd">~</span>$ ./youtube-resume</p>
    <h1><span class="hl">YouTube</span> Resume</h1>
    <p class="lede">YouTube videolarını kaldığın yerden açan bir tarayıcı eklentisi. Hesap istemez, kayıtlar sadece kendi tarayıcında durur.</p>
    <p class="cta"><a class="button" href="#kurulum">Kur</a><a class="button ghost" href="${repoUrl}">Kaynak kod ↗</a></p>
  </section>
  <section class="player" aria-hidden="true">
    <div class="player-screen"><img src="/local-youtube-history.svg" alt="" width="96" height="96" /></div>
    <div class="player-bar">
      <span class="mono">14:32 / 21:07</span>
      <span class="track"><span class="fill"></span><span class="knob"></span></span>
      <span class="mono resume-note">kaldığın yer</span>
    </div>
  </section>
  <section class="listing">
    <h2 class="section-label mono"><span>$ cat ozellikler.md</span></h2>
    <ul class="features">${cards}</ul>
  </section>
  <section class="listing">
    <h2 class="section-label mono"><span>$ cat gizlilik.md</span></h2>
    <div class="prose-block">
      <p>Kayıtlar tarayıcının yerel depolamasında durur, hiçbir sunucuya gitmez. Bu yüzden başka bir tarayıcıda ya da cihazda görünmez.</p>
      <p>İstediği izinler: <code>storage</code>, <code>alarms</code> ve <code>youtube.com</code>. Kodu <a href="${repoUrl}">GitHub'da</a>.</p>
    </div>
  </section>
  <section class="listing" id="kurulum">
    <h2 class="section-label mono"><span>$ cat kurulum.md</span></h2>
    <ol class="steps">${stepItems}</ol>
    <p class="note">Chromium tabanlı tarayıcılarda çalışır. Mağazada olmadığı için yeni sürümü elle indirmen gerekir.</p>
  </section>
  <p class="disclaimer mono">Bu proje YouTube ya da Google ile bağlantılı değildir.</p>
</main>
${footer()}
</div>`;
}
