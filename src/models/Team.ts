import { Program } from "./Program";

export class Team {
    name: string;
    curriculum: Program[];
    teamSuccess: number | undefined;

    constructor(name: string, curriculum: Program[]) {
        this.name = name;
        this.curriculum = curriculum;
        this.teamSuccess = undefined;
    }

    calculateTeamSuccess(): void {

    }
}