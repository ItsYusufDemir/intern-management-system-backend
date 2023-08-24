import dayjs from "dayjs";
import { Intern } from "../models/Intern.js";
import pool from "./database.js";
import Queries from "./queries.js";

import cron from "node-cron";
import shcedule from "node-schedule";
import { emptyGarbegeFolder } from "./garbage.js";



export const handleSchedule = async () => {
    try {
        const internsResponse = await pool.query(Queries.getInternsQuery);
        const interns = internsResponse.rows;
  
        //Delete the intern in 7 days after the internship ends
        interns.map(intern => {

            var interval;
            if(dayjs(intern.internship_ending_date * 1000).isBefore(dayjs())){ //Delete it if it is already passed
                interval = dayjs().add(15, "second").toDate();
            }else{
                interval = dayjs(intern.internship_ending_date * 1000).add(7, "day").toDate();
            }
             
            const username = (intern.id_no);
            const job = shcedule.scheduleJob(username, interval, async () => {
                await deleteIntern(intern);
            })
        })


      emptyGarbegeFolder();
      //Empty the garbade folder every midnight
      cron.schedule('0 0 * * *', () => {
        emptyGarbegeFolder();
      });

      console.log("Schedule completed");
    } catch (error) {
        console.log("Error happened while scheduling", error);    
    }
  }
  
  
  const deleteIntern = async (intern: Intern) => {

    if(!intern){
        return;
    }
    try {
        
        await pool.query(Queries.deleteInternQuery, [intern.intern_id]);
        
        const username = intern.first_name + "." + intern.last_name;
  
        await pool.query("DELETE FROM users WHERE username = $1", [username]);

        console.log(username + " is deleted");
        
    } catch (error) {
        console.log("Error happened while deleting scheduled intern");
    }
  }