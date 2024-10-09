const { sequelize } = require("../config/mysql-sequelize");
const { Op, col } = require("sequelize");

const { getUTCTime } = require("../Utils/helperfun")
const { getTapScore } = require("../Utils/validator");

const Users = require("../Models/Users");
const Earnings = require("../Models/Earnings");

function formatString(str) {
    if (str === undefined || str === null || typeof str !== 'string' || str.toLowerCase() === "none" || isNaN(str) && str == "") {
        return "pphuser";
    }
    if (str.length > 6) {
        str = str.substring(0, 6);
    }
    let formattedStr = str.substring(0, 3) + 'x'.repeat(str.length - 3);
    return formattedStr;
}




async function list(req, res, next) {

    try {
        const tgUser = req.user;

        const { id: userid, referral_code: referralCode } = tgUser;

        const UserData = await Users.findOne({
            where: {
                userid: userid,
                referral_code: referralCode,
            },
        });


        if (!UserData && UserData == null) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        
        // TODO : need add pagination
        const friends = await Users.findAll({
            where: {
                referral_by: referralCode,
            },
            order: [
                ["created_date", "DESC"]
            ],
            limit: 100,
            offset: 0,
        });
        const frdCount = await Users.count({
            where: {
                referral_by: referralCode,
            },
        });

        
        const friendsData = friends.map((user) => ({
            id: user.id,
            first_name: user.first_name || user.username,
            last_name:user.last_name || '',
            claim_status: user.referral_claim,
            Premium: user.tg_premium_user,
            claimscore:user.is_tg_premium_user === "Y" ? process.env.PREMIUM : process.env.NON_PREMIUM
        }));
        const totalClaimedReferrals = friendsData.reduce((count, user) => {
            return user.claim_status === "Y" ? count + 1 : count;
          }, 0);

        const unClaimed = frdCount - totalClaimedReferrals  
        const otherdetails = {
            Premium_score:process.env.PREMIUM,
            non_premium_score:process.env.NON_PREMIUM,
            totalReferral:frdCount,
            claimedReferral:totalClaimedReferrals,
            unClaimedReferral: unClaimed >=0 ? unClaimed : 0,
        }
        if (friendsData != null) {
            return res.status(200).json({ message: 'Success', data: { refCode: referralCode, friends: friendsData ,otherdetails} });
        } else {
            return res.status(200).json({ message: 'Success', data: { refCode: referralCode, friends: [] } });
        }

    } catch (error) {
        return next(error);

    }

}




async function claim(req, res, next) {
    try {
        const tgUser = req.user;
        const { friendID } = req.body;

        const refCode = tgUser.referral_code

        const earnDetails = await Earnings.findOne({
            where: {
                userid: tgUser.id,
            },
        });

        if (!earnDetails && earnDetails == null && !earnDetails.userid) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }
        const userDetails = await Users.findOne({
            where: {
                [Op.and]: [
                    { id: friendID },
                    { referral_claim: "N" },
                    { referral_by: refCode },
                ],
            },
        });

        if (!userDetails && userDetails == null) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invaild claim' });
        }

        const referral_score = userDetails.is_tg_premium_user === "Y" ? process.env.PREMIUM : process.env.NON_PREMIUM;

        const earnUpdata = {
            referral_score: parseInt(earnDetails.referral_score) + parseInt(referral_score),
            tap_score: parseInt(earnDetails.tap_score) + parseInt(referral_score)
        };
        const [updated] = await Earnings.update(earnUpdata, {
            where: {
                userid: tgUser.id,
            }
        });
        if (updated > 0) {
            const [isClaim] = await Users.update({ referral_claim: "Y" }, {
                where: {
                    [Op.and]: [
                        { id: friendID },
                        { referral_claim: "N" },
                        { referral_by: refCode },
                    ],
                },
            });
            if (isClaim > 0) {
                return res.status(200).json({ message: 'Success', data: { friendid: friendID, claimedPoint: referral_score } });
            } else {
                return res.status(409).json({ error: 'Conflict', message: 'Referral claim failed' });
            }
        } else {
            return res.status(409).json({ error: 'Conflict', message: 'Referral claim failed' });
        }
    } catch (error) {
        next(error)
    }
}

async function claimAll(req, res, next) {
    try {
        const tgUser = req.user;
        const refCode = tgUser.referral_code

        const userid = tgUser.id;
        const earnDetails = await Earnings.findOne({ where: { "userid": userid } });

        if (!earnDetails || !earnDetails.userid) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const unclaimedUsers = await Users.findAll({
            where: {
                referral_claim: "N",
                referral_by: refCode
            },
        });

        if (unclaimedUsers.length === 0) {
            return res.status(200).json({ message: 'No unclaimed referrals found', data: [] });
        }

        let totalReferralScore = 0;

        unclaimedUsers.forEach(user => {
            let referralScore = user.tg_premium_user === "Y" ? parseInt(process.env.PREMIUM) : parseInt(process.env.NON_PREMIUM);
            totalReferralScore += referralScore;
        });

        const earnUpdate = {
            referral_score: parseInt(earnDetails.referral_score) + totalReferralScore,
            tap_score: parseInt(earnDetails.tap_score) + totalReferralScore
        };
        
        const [updated] = await Earnings.update(earnUpdate, { where: { userid: userid }});

        if (updated > 0) {
            const userIds = unclaimedUsers.map(user => user.userid);
            const clamiedIds = unclaimedUsers.map(user => user.id);
            
            const [isClaim] = await Users.update({ referral_claim: "Y" }, {
                where: {
                    userid: {
                        [Op.in]: userIds
                    },
                    referral_by: refCode
                }
            });

            if (isClaim === userIds.length) {
                return res.status(200).json({ message: 'Success', data: { claimedPoints: totalReferralScore, claimedUsers: clamiedIds } });
            } else {
                return res.status(422).json({ error: 'Unprocessable Entity', message: 'Some users could not be updated' });
            }
        } else {
            return res.status(409).json({ error: 'Conflict', message: 'Score update failed' });
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    list,
    claim,
    claimAll
}