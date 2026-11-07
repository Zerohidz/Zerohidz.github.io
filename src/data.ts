export interface Site {
    host: string;
    /** Link target when the site is a page here rather than a subdomain. */
    href?: string;
    icon: string;
    title: string;
    summary: string;
    tags: string[];
    private?: boolean;
}

export interface Project {
    name: string;
    icon: string;
    summary: string;
    url: string;
    source: 'github' | 'itch.io';
}

export const profiles = [
    { label: 'github', url: 'https://github.com/Zerohidz' },
    { label: 'itch.io', url: 'https://zerohidz.itch.io/' },
];

/** Everything live under zerohidz.com. Add a new subdomain here. */
export const sites: Site[] = [
    {
        host: 'blog.zerohidz.com',
        icon: '/project-icons/blog.svg',
        title: 'zerohidz/blog',
        summary: 'Bir bilgisayar mühendisinin not defteri: mekanizmalar, zihinsel modeller ve hayatın tersine mühendisliği.',
        tags: ['yazı'],
    },
    {
        host: 'beg.zerohidz.com',
        icon: '/project-icons/beg.svg',
        title: 'BegController',
        summary: 'Küçük arkadaş grupları için hesap-verebilirlik uygulaması. Puanını sen değil, eşin girer.',
        tags: ['uygulama'],
    },
    {
        host: 'birnefes.zerohidz.com',
        icon: '/project-icons/birnefes.svg',
        title: 'Bir Nefes',
        summary: 'Ekrandan önce 30 saniye. Telefon ve Chrome aynı günlük hakları paylaşır.',
        tags: ['uygulama', 'android', 'chrome'],
    },
    {
        host: 'skywipe.zerohidz.com',
        icon: '/project-icons/skywipe.svg',
        title: 'Skywipe',
        summary: '2–4 arkadaş, rüzgârda sallanan gondolda gökdelen camı siler.',
        tags: ['oyun', 'co-op'],
    },
    {
        host: 'zerohidz.com/local-youtube-history',
        href: '/local-youtube-history/',
        icon: '/local-youtube-history.svg',
        title: 'YouTube Resume',
        summary: 'YouTube videolarını kaldığın yerden açan tarayıcı eklentisi.',
        tags: ['eklenti', 'chrome'],
    },
    {
        host: 'zmanga.zerohidz.com',
        icon: '/project-icons/kavita.png',
        title: 'Kavita',
        summary: 'Manga ve kitap sunucum.',
        tags: ['sunucu'],
        private: true,
    },
];

export const games: Project[] = [
    { name: 'Gladiohind', icon: '/project-icons/gladiohind.png', summary: 'Pumpkin Jam için yapılmış kısa bir platform oyunu.', url: 'https://zerohidz.itch.io/gladiohind', source: 'itch.io' },
    { name: '1 Kelime 1 İşlem Konsol Online', icon: '/project-icons/1-kelime.png', summary: 'Sunucu ve istemcisiyle çok oyunculu kelime oyunu.', url: 'https://zerohidz.itch.io/1-kelime-1-lem-konsol-online-v1', source: 'itch.io' },
    { name: 'Mysteries Of The Art Gallery', icon: '/project-icons/art-gallery.png', summary: "PURA GAMEJAM '22 için yapılan oyun.", url: 'https://zerohidz.itch.io/mysteriesoftheartgallery', source: 'itch.io' },
    { name: 'SurviveTheOcean', icon: '/project-icons/survive-the-ocean.svg', summary: 'Balıkları ve okyanusu koruma üzerine hayatta kalma oyunu. SEAJAM #TeamSeas.', url: 'https://zerohidz.itch.io/survivetheocean', source: 'itch.io' },
    { name: 'İnsan Kaynakları', icon: '/project-icons/insan-kaynaklari.svg', summary: 'Unity ve C# ile yapılmış oyun prototipi.', url: 'https://zerohidz.itch.io/insan-kaynaklari-prototip', source: 'itch.io' },
];

export const software: Project[] = [
    { name: 'NorthwindBackend', icon: '/project-icons/northwind.svg', summary: 'EntityFramework ile .NET WebAPI sistemi.', url: 'https://github.com/Zerohidz/NorthwindBackend', source: 'github' },
    { name: 'ZeroInputs', icon: '/project-icons/zeroinputs.svg', summary: 'C# ile hafif bir girdi API sarmalayıcısı.', url: 'https://github.com/Zerohidz/ZeroInputs', source: 'github' },
    { name: 'VideoContentAnalyzer', icon: '/project-icons/video-analyzer.svg', summary: 'Azure Content Safety ile videolarda uygunsuz kare arayan konsol uygulaması.', url: 'https://github.com/Zerohidz/VideoContentAnalyzer', source: 'github' },
    { name: 'GuestGrouper', icon: '/project-icons/guest-grouper.svg', summary: 'Etkinlik konuklarını ortak ilgi alanlarına göre gruplayan Blazor uygulaması.', url: 'https://github.com/Zerohidz/GuestGrouper', source: 'github' },
];
