export class WorkExperience{
    public constructor(
        public company: string = '',
        public startDate: Date,
        public endDate: Date,
        public isThisCurrentCompany: boolean = false
    ) {}
}