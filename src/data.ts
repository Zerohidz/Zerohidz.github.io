export interface Site {
    host: string;
    title: string;
    summary: string;
    tags: string[];
    private?: boolean;
}

export interface Project {
    name: string;
    summary: string;
    url: string;
    source: 'github' | 'itch.io' | 'site';
}

export const profiles = [
    { label: 'github', url: 'https://github.com/Zerohidz' },
    { label: 'itch.io', url: 'https://zerohidz.itch.io/' },
];

/** Everything live under zerohidz.com. Add a new subdomain here. */
export const sites: Site[] = [
    {
        host: 'blog.zerohidz.com',
        title: 'zerohidz/blog',
        summary: 'Bir bilgisayar mühendisinin not defteri: mekanizmalar, zihinsel modeller ve hayatın tersine mühendisliği.',
        tags: ['yazı'],
    },
    {
        host: 'beg.zerohidz.com',
        title: 'BegController',
        summary: 'Küçük arkadaş grupları için hesap-verebilirlik uygulaması. Puanını sen değil, eşin girer.',
        tags: ['uygulama'],
    },
    {
        host: 'birnefes.zerohidz.com',
        title: 'Bir Nefes',
        summary: 'Ekrandan önce 30 saniye. Telefon ve Chrome aynı günlük hakları paylaşır.',
        tags: ['uygulama', 'android', 'chrome'],
    },
    {
        host: 'skywipe.zerohidz.com',
        title: 'Skywipe',
        summary: '2–4 arkadaş, rüzgârda sallanan gondolda gökdelen camı siler.',
        tags: ['oyun', 'co-op'],
    },
    {
        host: 'zmanga.zerohidz.com',
        title: 'Kavita',
        summary: 'Kendi sunucumda çalışan okuma kütüphanem.',
        tags: ['sunucu'],
        private: true,
    },
];

export const games: Project[] = [
    { name: 'Gladiohind', summary: 'Pumpkin Jam için yapılmış kısa bir platform oyunu.', url: 'https://zerohidz.itch.io/gladiohind', source: 'itch.io' },
    { name: '1 Kelime 1 İşlem Konsol Online', summary: 'Sunucu ve istemcisiyle çok oyunculu kelime oyunu.', url: 'https://zerohidz.itch.io/1-kelime-1-lem-konsol-online-v1', source: 'itch.io' },
    { name: 'Mysteries Of The Art Gallery', summary: "PURA GAMEJAM '22 için yapılan oyun.", url: 'https://zerohidz.itch.io/mysteriesoftheartgallery', source: 'itch.io' },
    { name: 'SurviveTheOcean', summary: 'Balıkları ve okyanusu koruma üzerine hayatta kalma oyunu. SEAJAM #TeamSeas.', url: 'https://zerohidz.itch.io/survivetheocean', source: 'itch.io' },
    { name: 'İnsan Kaynakları', summary: 'Unity ve C# ile yapılmış oyun prototipi.', url: 'https://zerohidz.itch.io/insan-kaynaklari-prototip', source: 'itch.io' },
];

export const software: Project[] = [
    { name: 'local-youtube-history', summary: 'YouTube videolarını kaldığın yerden sürdüren, veriyi yerelde tutan tarayıcı eklentisi.', url: '/local-youtube-history/', source: 'site' },
    { name: 'NorthwindBackend', summary: 'EntityFramework ile .NET WebAPI sistemi.', url: 'https://github.com/Zerohidz/NorthwindBackend', source: 'github' },
    { name: 'ZeroInputs', summary: 'C# ile hafif bir girdi API sarmalayıcısı.', url: 'https://github.com/Zerohidz/ZeroInputs', source: 'github' },
    { name: 'VideoContentAnalyzer', summary: 'Azure Content Safety ile videolarda uygunsuz kare arayan konsol uygulaması.', url: 'https://github.com/Zerohidz/VideoContentAnalyzer', source: 'github' },
    { name: 'GuestGrouper', summary: 'Etkinlik konuklarını ortak ilgi alanlarına göre gruplayan Blazor uygulaması.', url: 'https://github.com/Zerohidz/GuestGrouper', source: 'github' },
];
