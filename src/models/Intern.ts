import { Team } from "./Team";

export class Intern {
    photoUrl: string;
    name: string;
    lastName: string;
    fullName: string;
    id: string;
    tel: string;
    uni: string;
    major: string;
    grade: number;
    gpa: number;
    team: Team;
    birthday: Date;
    internshipStartingDate: Date;
    internshipEndingDate: Date;
    cvUrl: string;
    successGrades: number[];
    internshipPeriod: number;
    email: string;
    overallSuccess: number | undefined;

    constructor(
        photoUrl: string,
        name: string,
        lastName: string,
        id: string,
        tel: string,
        uni: string,
        major: string,
        grade: number,
        gpa: number,
        team: Team,
        birthday: Date,
        internshipStartingDate: Date,
        internshipEndingDate: Date,
        cvUrl: string,
        email: string,
      ) {
        this.photoUrl = photoUrl;
        this.name = name;
        this.lastName = lastName;
        this.id = id;
        this.tel = tel;
        this.uni = uni;
        this.major = major;
        this.grade = grade;
        this.gpa = gpa;
        this.team = team;
        this.birthday = birthday;
        this.internshipStartingDate = internshipStartingDate;
        this.internshipEndingDate = internshipEndingDate;
        this.cvUrl = cvUrl;
        this.fullName = this.name + " " + this.lastName;
        this.successGrades = [];
        this.internshipPeriod = Math.round(((this.internshipEndingDate.getTime() - this.internshipStartingDate.getTime())/(1000 * 60 * 60 * 24 * 7)));
        this.email = email;
        this.overallSuccess = undefined;
        this.successGrades = new Array(this.team.curriculum.length);
      }


      //Compute the overall point
       computeOverallSuccess(): void  {
        
        let totalPoint = 0;

        let counter = 0;
        this.successGrades.forEach(week => {
          if(this.successGrades[counter] !== undefined){
            totalPoint = totalPoint + this.successGrades[counter];
            counter++;
          }
        })
        console.log("totalPoint: " + totalPoint);
        console.log(this.successGrades);

        this.overallSuccess = totalPoint / counter;

      }
}


