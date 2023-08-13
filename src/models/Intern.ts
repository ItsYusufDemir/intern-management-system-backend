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
  birthday?: number;
  internship_starting_date: number;
  internship_ending_date: number;
  cv_url: string | undefined;
  photo_url: string |undefined;
  overall_success: number | undefined;
  assignment_grades: number[] | undefined;
}


