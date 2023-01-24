export class Customer {

    constructor(
        public firstName = '',
        public lastName = '',
        public email = '',
        public sendCatalog = false,
        public notifyVia?: 'email' | 'text',
        public phone?: number,
        public birthDate?: Date,
        public addressType = 'home',
        public street1?: string,
        public street2?: string,
        public city?: string,
        public state = '',
        public zip?: string
    ) { }
}
