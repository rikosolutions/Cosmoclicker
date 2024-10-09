var jwt = require("jsonwebtoken");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/mysql-sequelize");
const { isMobileDevice,getTapScore,verifyTelegramWebAppData } =  require("../Utils/validator");
const Users = require("../Models/Users");
const Earnings = require("../Models/Earnings");

function isTimeCrossed(lastminedate) {
    if (_.isNil(lastminedate) || _.isEmpty(lastminedate) || !moment(lastminedate, moment.ISO_8601, true).isValid()) {
        return false;
    }
    const time = moment(lastminedate);
    const currentTime = moment();
    const diff = time.diff(currentTime);
    return diff <= 0;
}


async function Auth(req, res, next) {
    var user_agent = req.headers["user-agent"];
    var is_mobile = isMobileDevice(user_agent);
    if (user_agent === undefined || is_mobile !== true) {
        return res.status(403).json({
            statusCode: 403,
            status: "error",
            message: "Only available for mobile devices",
        });
    }
    var currentDate = moment.utc().toDate();

    try {


        const tguser = req.body;

        if (!tguser || !tguser.initData || !tguser.initData.user) {
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'user data is not found' });
        }

        console.log("tguser",tguser)

        const { initDataRaw, initData, platform, referralBy } = tguser;

        // console.log("vefiy",verifyTelegramWebAppData("7083287740:AAGrZim9naRtSBXgUWecVz-kg2OhN3wkixE",initDataRaw))

        var {
                id, username, firstName, lastName,
                language_code, is_premium, 
            } = initData.user;

        var referral_code = ''
        var sync_data = null;

        if (!_.isNil(id)) {
            var tgUser = await Users.findOne({
                where: { userid: id }
            });
            
            if (tgUser === null) {
              referral_code = uuidv4().replace(/-/g, "");
                
                var tgUserData = {
                    userid: id,
                    username: username,
                    first_name: firstName,
                    last_name: lastName,
                    language_code: language_code,
                    referral_by: referralBy,
                    referral_code: referral_code,
                };

                if (is_premium === true) {
                    tgUserData["tg_premium_user"] = "Y";
                }

                try {
                    const result = await sequelize.transaction(async t => {
                        const user = await Users.create(tgUserData, { transaction: t });
                        const earnings = await Earnings.create({ 'userid': id, 'last_login_at': currentDate }, { transaction: t });
                        return user;
                    });
                } catch (error) {
                    return next(error);
                }

                sync_data = {
                    score: 0,
                    isNewuser:"Y",
                    ph:0,
                    mineAmmout:0,
                };

            } else {
                var earnings = await Earnings.findOne({
                    where: {
                        userid: tgUser.userid,
                    },
                });              
                referral_code = tgUser.referral_code && tgUser.referral_code!='' && tgUser.referral_code!=null ? tgUser.referral_code : '';
                if (earnings !== null) {

                    var [tapScore, isClientScore ] = getTapScore(req, earnings);
                    const ph = earnings.mining_amount && earnings.mining_amount!='' && earnings.mining_amount!=null ? parseInt(earnings.mining_amount) : 0
            
                    if(isClientScore){
                        earnings.tap_score = tapScore;
                        earnings.last_tap_at = currentDate;
                    }
                    earnings.last_login_at = currentDate;
                    await earnings.save();
                    
                    let isCrossed = isTimeCrossed(earnings.last_mine_at);
                    let mineAmount = 0;

                    if(isCrossed){
                        if (!_.isEmpty(earnings) && !_.isNil(earnings.mining_amount) && !_.isEmpty(earnings.mining_amount) &&  !isNaN(Number(earnings.mining_amount)) && parseInt(earnings.mining_amount) > 0 ) {
                            mineAmount = earnings.mining_amount && earnings.mining_amount!='' ? parseInt(earnings.mining_amount) : 0;
                        }
                    }
                    sync_data = {
                        score: tapScore,
                        isNewuser:"N",
                        ph:ph,
                        miner:mineAmount
                    };
                } else {
                    throw new Error(`Earnings is not found for ${id}`);
                }
            }

            var token = jwt.sign({
                    id: id,
                    username: username,
                    referral_code
                },
                process.env.SECRET_KEY
            );
            sync_data["auth_token"] = token;

            return res.status(200).json({
                status: "success",
                sync_data: sync_data,
                message: "Successfully authenticated",
            });
        }

        return res.status(400).json({
            status: "error",
            message: "Invalid input data",
        });
    } catch (err) {
        return next(err);
    }
}


module.exports = {
    Auth,
};