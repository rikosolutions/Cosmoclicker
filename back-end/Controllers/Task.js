const { sequelize } = require("../config/mysql-sequelize");
const { Op, col } = require("sequelize");

const moment = require('moment');
const _ = require('lodash');
const { response } = require("express");


const Users = require("../Models/Users");
const Earnings = require("../Models/Earnings");
const Tasks = require("../Models/Tasks");
const TaskDetails = require("../Models/TaskDetail");


const removeTasks = (input, targetKeys) => {
    let keysArray = input.split('|');
    let targetKeysSet = new Set(targetKeys.map(key => key.toString()));
    let filteredArray = keysArray.filter(key => !targetKeysSet.has(key));
    return filteredArray.join('|');
}


async function lists(req, res, next) {

    try {

        const tgUser = req.user;
        const { status } = req.query;

        if (tgUser == null && tgUser.id == null) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const { id: teleid } = tgUser;
        const earnDetails = await Earnings.findOne({
            where: {
                userid: teleid,
            },
        });
        if (!earnDetails) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }
        
        const doneTaskIds = earnDetails.task ? earnDetails.task.split('|').map(id => parseInt(id)) : [];

        const tasks = await Tasks.findAll({
            where: {
                status: "ACTIVE"
            },
            order: [
                ["created_date", "DESC"]
            ],
            limit: 10,
            offset: 0,
        });

        if (tasks == null || tasks.length === 0) {
            return res.status(200).json({ message: 'No task found', data: [] });
        }

        let availabelTaskcount = 0
        const taskList = tasks.reduce((acc, task) => {
            const groupTitle = task.quest_group_title;
            if (!acc[groupTitle]) {
                acc[groupTitle] = []
            }
           
            const taskData = {
                id: task.id,
                title: task.title,
                points: task.claim_score,
                url: task.follow_url,
                img: task.logo_name,
                isClaimed: doneTaskIds.includes(task.id) ? "Y" : "N"
            };

            if(taskData.isClaimed == "N"){
                availabelTaskcount ++
            }
        
            acc[groupTitle].push(taskData);
            
            return acc;
        }, {});

        if ( taskList != null) {
            return res.status(200).json({ message: 'Success', data: { tasklist: taskList, availabelTaskcount:availabelTaskcount} });
        } else {
            return res.status(200).json({ message: 'No task found', data: [] });
        }

    } catch (error) {
        return next(error);
    }
}
// TODO : need to optimz this 
async function list(req, res, next) {
    try {
        const tgUser = req.user;
        const teleid = tgUser?.id;
        if (!teleid) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const earnDetails = await Earnings.findOne({ where: { userid: teleid } });
        if (!earnDetails) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const tasks = await Tasks.findAll({
            where: { status: 'ACTIVE' },
            order: [['id', 'ASC']],
            limit: 100,
        });

        if (!tasks) {
            return res.status(200).json({ message: 'No task found', data: [] });
        }

        const taskIds = tasks.map(task => task.id);
        const unlockedTask = taskIds.length > 0 ? taskIds.join('|') : null;
        var tasksdetails = await TaskDetails.findOne({
            where: { userid: teleid},
        });
        const taskDetailsUpdate = {
            userid: teleid,
            unlocked_task: unlockedTask || ''
        };

        if (!tasksdetails) {
            tasksdetails = await TaskDetails.create(taskDetailsUpdate);
            if (!tasksdetails) {
                return res.status(409).json({ error: 'Conflict', message: 'Failed to create Task Details' });
            }
        }else{
            const oldtaskDetailsDetails = {
                unlocked_task: (tasksdetails.unlocked_task && tasksdetails.unlocked_task.trim() !== '') ? tasksdetails.unlocked_task.split('|').map(Number) : [],
                verify_task: (tasksdetails.verify_task && tasksdetails.verify_task.trim() !== '') ? tasksdetails.verify_task.split('|').map(Number) : [],
                success_task: (tasksdetails.success_task && tasksdetails.success_task.trim() !== '') ? tasksdetails.success_task.split('|').map(Number) : [],
                task_under_by: tasksdetails.task_under_by || '',
            };
            const oldTaskList = new Set([
                ...oldtaskDetailsDetails["unlocked_task"],
                ...oldtaskDetailsDetails["verify_task"],
                ...oldtaskDetailsDetails["success_task"]
            ])
            const newtaskIds =  taskIds.filter((id)=> !oldTaskList.has(id) )
            if(newtaskIds.length > 0){
                const newtask = newtaskIds.join("|")
                const updateNewtask = oldtaskDetailsDetails["unlocked_task"].length > 0 ? `${oldtaskDetailsDetails["unlocked_task"].join("|")}|${newtask}` : newtask
                const newTaskUpdate = {
                    unlocked_task:updateNewtask
                };
                const [updated] = await TaskDetails.update(newTaskUpdate, {
                    where: {
                        userid: teleid,
                    },
                    
                });
                if(updated>0)(
                    taskDetailsUpdate.unlocked_task.concat(newtaskIds)
                )
            }
            Object.assign(taskDetailsUpdate,oldtaskDetailsDetails)            
        }
        const grouptask = tasks.reduce((acc, task) => {
            const groupTitle = task.quest_group_title;
            // console.log("groupTitle",groupTitle)
            if (!acc[groupTitle]) acc[groupTitle] = [];

            const status = Object.keys(taskDetailsUpdate).find(key => {
                const ids = taskDetailsUpdate[key];
                return Array.isArray(ids) && ids.includes(task.id);
            })?.replace('_task', '');

            acc[groupTitle].push({
                id: task.id,
                title: task.title,
                points: task.claim_score,
                url: task.follow_url,
                img: task.logo_name,
                status,
            });
            return acc;
        }, {});

        const others = {
            totalTask: tasks.length,
            avaible_task_count:taskDetailsUpdate["unlocked_task"].length,
            totalSuccessTask: taskDetailsUpdate["success_task"].length,
        };
        // console.log("others",others)

        return res.status(200).json({message: 'Success',data: { tasklist: grouptask, others }});
    } catch (error) {
        return next(error);
    }
}

async function checkTask(req, res, next) {
    try {
        const tgUser = req.user;
        const { taskID } = req.body;

        const responseData = { 
            taskid: taskID,
            nextStatus : 'unlocked'
        }
        
        if ( !tgUser || !tgUser.id ) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }
        if( !taskID  || taskID==="" ){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Request have no TaskID'});
        }
        const task = await Tasks.findOne({
            where: {
                [Op.and]: [
                    { id: taskID },
                    { status: "ACTIVE" }
                ],
            },
        });

        if(!task || task===''){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Requested TaskID have no active task'});
        }
        
        
        const tasksDetails = await TaskDetails.findOne({
            where: { 
                userid: tgUser.id
            },
        });

        if(!tasksDetails || tasksDetails===''){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Requested TaskID have no Tasks Details'});
        }

        
        const unlocked_task = (tasksDetails.unlocked_task && tasksDetails.unlocked_task.trim() !== '') ? tasksDetails.unlocked_task.split('|').map(Number) : [] ;
        const verify_task  = (tasksDetails.verify_task && tasksDetails.verify_task.trim() !== '') ? tasksDetails.verify_task.split('|').map(Number) : [] ;
        const success_task = (tasksDetails.success_task && tasksDetails.success_task.trim() !== '') ? tasksDetails.success_task.split('|').map(Number) : [] ;

        let isClaimed = success_task.includes(taskID); 

        if(isClaimed){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Task is already claimed'});
        }
        var taskDetailToUpdate = {};
        
        if(unlocked_task.includes(taskID) && !success_task.includes(taskID) && !verify_task.includes(taskID)){
            //setp-1 Follow the task
            //remove from unlocked_task and add to verify_task
            taskDetailToUpdate.unlocked_task = removeTasks(tasksDetails.unlocked_task,[taskID])
            taskDetailToUpdate.verify_task   = `${taskID}${tasksDetails.verify_task ? `|${tasksDetails.verify_task}` : ``}`;
            
            responseData.nextStatus  = 'verify'
            responseData.doneTask = success_task.length
            
        }

        // move to sucees state
        // else if(verify_task.includes(taskID) && !success_task.includes(taskID)  && !unlocked_task.includes(taskID)){
        //     //setp-1 vefiy task
        //     //remove from  verify_task and add to success_task
        //     let TgGroupId = task.telegram_group_id
        //     let isVefiyed =  false;
        //     // console.log("TgGroupId",TgGroupId)
        //     if(TgGroupId && TgGroupId!=''){
        //         if(isUserJoinedTg(next,TgGroupId,tgUser.id)){
        //             isVefiyed = true;
        //         }else{
        //             isVefiyed = false;
        //         }
        //     }else{
        //         isVefiyed=true;
        //     }
        //     if(isVefiyed){
        //         taskDetailToUpdate["verify_task"]  = removeTasks(tasksDetails.verify_task,[taskID])
        //         taskDetailToUpdate["success_task"] = `${taskID}${tasksDetails.success_task ? `|${tasksDetails.success_task}` : ``}`;

        //         // unlock the second task
        //         // taskDetailToUpdate["locked_task"] = locked_task.length > 0 ? removeTasks(tasksDetails.locked_task,[locked_task[0]]) : '';
        //         // taskDetailToUpdate["unlocked_task"] = `${locked_task[0] ? locked_task[0] : ''}${tasksDetails.unlocked_task ? `|${tasksDetails.unlocked_task}` : ``}`;
            
        //         responseData.nextStatus = 'success'
        //         responseData.doneTask = success_task.length + 1;

        //     }else{
        //         responseData.nextStatus = 'unlocked'
        //         return res.status(200).json({message: 'Task is not completed',data: responseData});
        //     }
        // }

        // console.log("taskDetailToUpdate==>",taskDetailToUpdate)
        if(!taskDetailToUpdate && Object.keys(taskDetailToUpdate).length <= 0){
            return res.status(409).json({ error: 'Conflict', message: 'Fail in Task Details', data: { taskid: taskID } });
        }
        const [updated] = await TaskDetails.update(taskDetailToUpdate, {
            where: {
                userid: tgUser.id,
            },
            individualHooks: true
        });
        if (updated > 0) {
            
            if(responseData.nextStatus === "success" && taskDetailToUpdate["unlocked_task"]!='') {
                responseData["unlockedTask"] = taskDetailToUpdate["unlocked_task"]
            }
            
            return res.status(200).json({ message: 'Success', data:responseData});
        } else {
            return res.status(409).json({ error: 'Conflict', message: 'Taks claim failed ', data: { taskid: taskID } });
        }

    }catch(e){
        // console.log("Error",e)
        next("Error in check the task");
    }
}

async function claim(req, res, next) {
    try {
        const tgUser = req.user;
        const { taskID } = req.body;

        if ( !tgUser || !tgUser.id ) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }
        if( !taskID || taskID==="" ){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Request have no taskID'});
        }

        const earnDetails = await Earnings.findOne({
            where: {
                userid: tgUser.id,
            },
        });

        if (!earnDetails && earnDetails == null) {
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Validation failed for the input data' });
        }

        const task = await Tasks.findOne({
            where: {
                [Op.and]: [
                    { id:taskID },
                    { status: "ACTIVE" }
                ],
            },
        });
        if(!task || task===''){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Requested Quest have no active task'});
        }
        const tasksDetails = await TaskDetails.findOne({
            where: { 
                userid: tgUser.id, 
            },
        });
        
        if(!tasksDetails || tasksDetails===''){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Requested TaskID have no Tasks Details'});
        }

        var taskDetailToUpdate = {};

        const unlocked_task = (tasksDetails.unlocked_task && tasksDetails.unlocked_task.trim() !== '') ? tasksDetails.unlocked_task.split('|').map(Number) : [] ;
        const verify_task   = (tasksDetails.verify_task && tasksDetails.verify_task.trim() !== '') ? tasksDetails.verify_task.split('|').map(Number) : [] ;
        const success_task  = (tasksDetails.success_task && tasksDetails.success_task.trim() !== '') ? tasksDetails.success_task.split('|').map(Number) : [] ;

        let isClaimed = success_task.includes(taskID);
        let isUnlockedTask = unlocked_task.includes(taskID);
        let isVerifyTask = verify_task.includes(taskID); 

        if(isClaimed){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Task is already claimed'});
        }

        if(isUnlockedTask){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'task still not done'});
        }

        const totalClaimScore = task.claim_score && task.claim_score!='' ? task.claim_score : 0

        if(verify_task.includes(taskID) && !success_task.includes(taskID)  && !unlocked_task.includes(taskID)){
            //setp-1 vefiy task
            //remove from  verify_task and add to success_task
            let TgGroupId = task.telegram_group_id
            let isVefiyed =  false;
            // console.log("TgGroupId",TgGroupId)
            if(TgGroupId && TgGroupId!=''){
                if(isUserJoinedTg(next,TgGroupId,tgUser.id)){
                    isVefiyed = true;
                }else{
                    isVefiyed = false;
                }
            }else{
                isVefiyed=true;
            }
            if(isVefiyed){
                taskDetailToUpdate["verify_task"]  = removeTasks(tasksDetails.verify_task,[taskID])
                taskDetailToUpdate["success_task"] = `${taskID}${tasksDetails.success_task ? `|${tasksDetails.success_task}` : ``}`;
            }
        }
        
        const earnUpdate = {
            task_score: earnDetails.task_score && earnDetails.task_score!=null ? parseInt(earnDetails.task_score) + parseInt(totalClaimScore) : parseInt(totalClaimScore)  ,
            tap_score: parseInt(earnDetails.tap_score) + parseInt(totalClaimScore),
        }

        // console.log("taskDetailToUpdate",taskDetailToUpdate)
        // console.log("earnUpdate",earnUpdate)
    
        const transaction = await sequelize.transaction();
        
        try {
            
            const [updated] = await Earnings.update(earnUpdate, {
                where: {
                    userid: tgUser.id,
                },
                transaction, 
            });
    
            const [taskDetailsUpdate] = await TaskDetails.update(taskDetailToUpdate, {
                where: {
                    userid: tgUser.id,
                },
                transaction, 
            });            
            await transaction.commit();
            if (updated > 0) {
                return res.status(200).json({ message: `You claimed ${totalClaimScore}`, isClaimed: true, points: totalClaimScore });
            } else {
                return res.status(409).json({ error: 'Conflict', message: 'Task claim failed', isClaimed: false });
            }
        } catch (error) {
            await transaction.rollback();
            next("An error occurred while claiming tasks")
        }

    } catch (error) {
        next(error)
    }

}



module.exports = {
    list,
    claim,
    checkTask
}