export class AdSenseService {
    static readonly AD_CLIENT = 'ca-pub-7682466066834889';
    static readonly AD_SLOT_1 = '4790856624';
    static readonly AD_SLOT_2 = '3077732970';

    static showAdBanner1(containerId: string): void {
        this.createAdIns(containerId, this.AD_SLOT_1);
    }

    static showAdBanner2(containerId: string): void {
        this.createAdIns(containerId, this.AD_SLOT_2);
    }

    private static createAdIns(containerId: string, slot: string, format: string = 'auto'): void {
        const adContainer = document.getElementById(containerId);

        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', this.AD_CLIENT);
        ins.setAttribute('data-ad-slot', slot);
        ins.setAttribute('data-ad-format', format);
        ins.setAttribute('data-full-width-responsive', 'true');
        adContainer?.appendChild(ins);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }
}
