var jwt = require("jsonwebtoken");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/mysql-sequelize");
const { isMobileDevice } =  require("../Utils/validator")


async function Auth(req, res, next) {

    if(process.env.RUNNING_PLATFORM === "mobile"){
        var user_agent = req.headers["user-agent"];
        var is_mobile = isMobileDevice(user_agent);
        if (user_agent === undefined || is_mobile !== true) {
            return res.status(403).json({ error: 'Forbidden', message: 'Only available for mobile devices' });
        }
    }
    
    try {
        
        var token = jwt.sign({ 
            // add data you want to in sign 
        }, process.env.SECRET_KEY );

        sync_data["auth_token"] = token;

        return res.status(200).json({ status: "success",message: "Successfully authenticated", sync_data: sync_data});

    } catch (err) {
        return next(err);
    }
}

module.exports = {
    Auth,
};