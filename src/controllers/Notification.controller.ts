import path, { dirname } from "path";
import pool from "../utils/database.js";
import Queries from "../utils/queries.js";
import { fileURLToPath } from "url";
import fs from "fs";
import { Notification } from "../models/Notification.js";
import dayjs from "dayjs";
import { Intern } from "../models/Intern.js";
import { time } from "console";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cron from "node-cron";


const getNotifications = async (req, res) => {

    
    if(!req.role || !req.params.user_id){
        return res.end();
    }
    
    try {
        const notifications = await generateNotifications(req.role, parseInt(req.params.user_id));

        if(notifications) {
            return res.status(200).json(notifications);
        }
        return res.status(200).json([])

    } catch (error) {
        return res.sendStatus(500);
    }

}


const generateNotifications = async (role: number, user_id: number) => {

    try {
        
    if(role === 5150) {

        const applicationsResponse = await pool.query(Queries.getApplicationsQuery);
        const internsResponse = await pool.query(Queries.getInternsQuery);

        const applications = applicationsResponse.rows;
        const interns = internsResponse.rows;


        const newNotifications: Notification [] = [];

        const numberOfWaitingApplications = applications?.filter((application: Intern) => application.application_status === "waiting").length;
        if(numberOfWaitingApplications) {
            const content = `You have ${numberOfWaitingApplications} waiting application(s)`;
            const newNotification: Notification = {
                user_id: user_id,
                type_code: 3, //waiting application
                content: content,
                timestamp: dayjs().unix(),
                is_seen: false,
            }
            newNotifications.push(newNotification);
        }

        const endingInternships = interns?.filter(intern =>
            intern.internship_ending_date - dayjs().unix() < 60 * 60 * 24 * 6 //if the internship is going to end in 6 days
        );

    
        if(endingInternships) {
            endingInternships.map(endingInternship => {
                const name = endingInternship.first_name + " " + endingInternship.last_name;

                const content = `${name}'s internship will end on `
                const timestamp = endingInternship.internship_ending_date;

                const newNotification: Notification = {
                    user_id: user_id,
                    type_code: 2, //ending internship
                    content: content,
                    timestamp: timestamp,
                    is_seen: false,
                }
                newNotifications.push(newNotification);
            })
        }

        //We cancel storing the noticiation in the database
        /*
        const notificationsResponse = await pool.query(Queries.getNotificationsQuery);
        const oldNotifications: Notification [] = notificationsResponse.rows;


        await Promise.all(newNotifications.map(async notification => {

            const duplicate = oldNotifications?.filter(oldNotification => oldNotification.user_id === notification.user_id && oldNotification.type_code === notification.type_code);

            if(duplicate.length === 0) {
                await pool.query(Queries.addNotificationsQuery, [notification.user_id, notification.type_code, notification.content, notification.timestamp, false])
                oldNotifications.push(notification);
            } else { //update the notification <if there is a difference>

                const notificationToUpdate = oldNotifications.find(oldNotification => oldNotification.user_id === notification.user_id && oldNotification.type_code === notification.type_code && oldNotification.content !== notification.content);
   

                if(notificationToUpdate) {

                    try {
                        await pool.query(Queries.updateNotificationQuery, [notification.user_id, notification.type_code, notification.content, notification.timestamp, false, notificationToUpdate.notification_id])

                    } catch (error) {
                        console.log(error);
                    }
                    console.log("burada sorun var", notification);

                    notificationToUpdate.user_id = notification.user_id;
                    notificationToUpdate.type_code = notification.type_code;
                    notificationToUpdate.content = notification.content;
                    notificationToUpdate.timestamp = notification.timestamp;
                    notificationToUpdate.is_seen = false;
                }
            }

        }));
        */


        const sorted = await newNotifications.slice().sort((a,b) => a.timestamp - b.timestamp);

        return sorted;

    } else if (role === 1984) {


    } else if (role === 2001) {


    }



    } catch (error) {
        console.log(error);
    }

    

    
}


const handleSeen = async (req, res) => {

    const user_id = req.params.user_id;

    try {
        await pool.query(Queries.handleSeenquery, [user_id]);

        return res.sendStatus(200);
    } catch (error) {
        return res.sendStatus(500);
    }
}




const NotificationController = {
 getNotifications: getNotifications,
 handleSeen: handleSeen,
}

export default NotificationController;

