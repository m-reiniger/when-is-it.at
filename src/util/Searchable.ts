import { onMounted } from 'vue';

export class Searchable {
    private formatter = (key: string) => key;
    private searchable: HTMLInputElement | null | undefined = null;
    private valueField: HTMLInputElement | null | undefined = null;
    private dropdown: HTMLElement | null | undefined = null;

    constructor(formatter: (key: string) => string, elementId: string = 'searchable') {
        this.formatter = formatter;

        onMounted(() => {
            this.searchable = document
                .getElementById(elementId)
                ?.querySelector('input[type="search"]');
            this.valueField = document
                .getElementById(elementId)
                ?.querySelector('input[type="hidden"]');

            this.dropdown = document.getElementById(elementId)?.querySelector('ul');

            this.searchable?.addEventListener('keydown', this.showDropdown);
            this.searchable?.addEventListener('blur', this.hideDropdown);
            this.searchable?.addEventListener('focus', this.showDropdown);
            this.searchable?.addEventListener('search', this.showDropdown);
        });
    }

    public onSelect = (e: Event, key: string) => {
        this.hideDropdown();
        this.valueField!.value = key;
        this.valueField!.dispatchEvent(new Event('input'));
        this.searchable!.value = this.formatter(key);
        this.searchable!.dispatchEvent(new Event('input'));
    };

    private showDropdown = () => {
        this.dropdown?.classList.add('show');
    };

    private hideDropdown = () => {
        setTimeout(() => {
            this.dropdown?.classList.remove('show');
        }, 250);
    };
}
