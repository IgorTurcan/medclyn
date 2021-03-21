export class portfolioCard {
    public showFlag: boolean = false;
    public selectedImageIndex: number = 0;
    public currentIndex: number = 0;
    public showLightbox: CallableFunction = () => 
        { this.showFlag = true; };
    public closeEventHandler: CallableFunction = () => 
        { this.showFlag = false; };

    constructor(
        public title: string, public subtitle: string, 
        public paths: Array<object>, public images: Array<object>,
    ) { }
}