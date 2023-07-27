export interface Intern {
  intern_id?: number;
  first_name: string;
  last_name: string;
  id_no: string;
  phone_number: string;
  email: string;
  uni: string | undefined;
  major: string | undefined;
  grade: number | undefined;
  gpa: number | undefined;
  team_id: number;
  birthday: Date | undefined;
  internship_starting_date: Date;
  internship_ending_date: Date;
  cv_url: string | undefined;
  photo_url: string |undefined;
  overall_success: number | undefined;
}


