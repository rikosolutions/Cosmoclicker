const { sequelize } = require("../config/mysql-sequelize");
const { Op, col } = require("sequelize");
const moment = require("moment");
const _ = require("lodash");
const { getTapScore,addHours } = require("../Utils/validator");

const Earnings = require("../Models/Earnings");
const Users = require("../Models/Users");
const MinnerShop = require("../Models/MinerShop");
const MinerShopDetails = require("../Models/MinerShopDetails");

function calculateCost(baseCost,levels) {
    const multiplier = 1.5
    return baseCost * Math.pow(multiplier, levels - 1);
}
function reduceTimeFromDate(dateTime, value) {
    
    const [hours, minutes] = value.split(':').map(Number);
    const dateMoment = moment(dateTime);
    const reducedTime = dateMoment.subtract(hours, 'hours').subtract(minutes, 'minutes');    return { 
        "todate": reducedTime.toDate(),
        "toformate": reducedTime.format('YYYY-MM-DD HH:mm:ss')
    };
}

function isTimeCrossed(lastminedate) {
    if (_.isNil(lastminedate) || _.isEmpty(lastminedate) || !moment(lastminedate, moment.ISO_8601, true).isValid()) {
        return false;
    }
    const time = moment(lastminedate);
    const currentTime = moment();
    const diff = time.diff(currentTime);
    return diff <= 0;
}


async function getminerlist(earnDetails, userid) {
    try {
        const minners = await MinnerShop.findAll({
            where: {
                status: "ACTIVE",
            },
            order: [
                ["created_date", "DESC"]
            ],
        });

        if (!minners || minners.length === 0) {
            return { message: 'Shop has no active minners', data: [] }; 
        }

        const earn_tapScore = earnDetails && earnDetails.tap_score ? parseInt(earnDetails.tap_score) : 0
        const minnersId = minners.map(minner => minner.id);

        const MinerShopDetailsList = await MinerShopDetails.findAll({
            where: {
                [Op.and]: [
                    { userid: userid },
                    { minner_id: { [Op.in]: minnersId } },
                ],
            },
        });

        const myMinnerIds = MinerShopDetailsList.map(minner => minner.id);

        const minnershopDetailsMap = MinerShopDetailsList.reduce((acc, detail) => {
            acc[detail.minner_id] = detail;
            return acc;
        }, {});

        const minner = minners.reduce((acc, minner, index) => {
            const under_by = minner.type;
        
           
            if (!acc[under_by]) {
                acc[under_by] = {
                    my_minners: [],
                    new_minners: [],
                    lastUnlockedMinnerIndex: -1, 
                };
            }
        
            
            const minerInShopDetails = minnershopDetailsMap[minner.id];
            const isMinnerPurchased = !!minerInShopDetails;
    
            const minnerLevel = isMinnerPurchased ? parseInt(minerInShopDetails.minner_level) || 1 : 1;
            const minnerProfitPerHr = parseInt(minner.profit_per_hr) || 0;
            const minnerPurchaseAmount = parseInt(minner.purchase_amount) || 0;
        
            const temp_minner = {
                id: minner.id,
                title: minner.title,
                profit_per_hr: (minnerProfitPerHr * minnerLevel),
                purchase_amount: (minnerPurchaseAmount * minnerLevel),
                status: "locked",
            };
        
            
            if (isMinnerPurchased) {
                acc[under_by].my_minners.push(temp_minner);
                acc[under_by].lastUnlockedMinnerIndex = index; 
                temp_minner.status = "Purchased"; 
            } else {
                acc[under_by].new_minners.push(temp_minner);
            }
        

            if (acc[under_by].my_minners.length === 0 && index === 0) {
                
                if (temp_minner.purchase_amount <= earn_tapScore) {
                    temp_minner.status = "unlocked";
                }
                
            }
    
            const lastUnlockedIndex = acc[under_by].lastUnlockedMinnerIndex;
            if (lastUnlockedIndex !== -1 && index === lastUnlockedIndex + 1) {
                if (temp_minner.purchase_amount <= earn_tapScore) {
                    temp_minner.status = "unlocked";
                }
            }
        
            return acc;
        }, {});
        
        return minner;

    } catch (error) {
        console.error('Error fetching miner list:', error);
        throw error;  
    }
}


// TODO need adhh error handle type conversion
async function getList(req, res, next) {
    try {
        const tgUser = req.user;
        if (!tgUser || !tgUser.id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const { id: userid } = tgUser;

        const earnDetails = await Earnings.findOne({
            where: {
                userid: userid,
            },
        });

        if (!earnDetails) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const score  = earnDetails && earnDetails.tap_score ? parseInt(earnDetails.tap_score) : 0
        const ph  = earnDetails && earnDetails.mining_amount ? parseInt(earnDetails.mining_amount) : 0

        const minnerss = await getminerlist(earnDetails,userid)

        return res.status(200).json({ message: 'Success', data: { "minnerList": minnerss,score,ph } });
      

    } catch (error) {
        return next(error);
    }
}

async function upgrade(req, res, next) {
    const transaction = await sequelize.transaction(); 
    try {
        const tgUser = req.user;
        const { minner_id } = req.body;
        const userid = tgUser.id;

        if (!tgUser || !tgUser.id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        if (minner_id === undefined || minner_id === "") {
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Validation failed for the input data' });
        }

        const MinnerDetails = await MinnerShop.findOne({
            where: {
                [Op.and]: [
                    { id: minner_id },
                    { status: "ACTIVE" }
                ],
            },
        });

        if (!MinnerDetails) {
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Product details not found' });
        }

        const ShopDetail = await MinerShopDetails.findOne({
            where: {
                [Op.and]: [
                    { userid },
                    { minner_id }
                ],
            },
        });

        if(ShopDetail && ShopDetail!=null){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'You already have the minner ' });
        }
        
        const minnerPrice = MinnerDetails.purchase_amount ? parseInt(MinnerDetails.purchase_amount) : 0;
        const profitPerHr = MinnerDetails.profit_per_hr ? parseInt(MinnerDetails.profit_per_hr) : 0;

        if (minnerPrice <= 0) {
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Invalid product price' });
        }

        const earnDetails = await Earnings.findOne({
            where: { userid }
        });

        if (!earnDetails) {
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Earnings not found' });
        }

        const earned_score = earnDetails.tap_score ? parseInt(earnDetails.tap_score) : 0;

        if (earned_score <= 0) {
            return res.status(201).json({ message: "You don't have enough points to buy" , data: []});
        }

        let balanceScore = earned_score - minnerPrice;

        if (balanceScore <= 0) {
            return res.status(201).json({ message: "You don't have enough points to buy", data: [] });
        }

        const shop_details_update = {
            minner_id: MinnerDetails.id,
            profit_per_hr: profitPerHr,
            profit_amount: profitPerHr,
            purchase_amount: minnerPrice,
            user_spend_amount: minnerPrice,
            minner_level: 1
        };

        const earningMineAmount =  earnDetails.mining_amount && earnDetails.mining_amount!=''  && earnDetails.mining_amount!=null ? parseInt(earnDetails.mining_amount) : 0 
        const mineAmout = earningMineAmount + profitPerHr
        const earn_details_update = {
            tap_score: balanceScore,
            last_tap_at: moment.utc().toDate(),
            mining_amount:mineAmout
        };

        if (_.isNil(earnDetails.last_mine_at) || _.isEmpty(earnDetails.last_mine_at) || !moment(earnDetails.last_mine_at, moment.ISO_8601, true).isValid()) {
            const { todate }= addHours("1:00");
            earn_details_update.last_mine_at = todate;
        }
    
        await MinerShopDetails.create({
            userid,
            ...shop_details_update
        }, { transaction });
        

        await Earnings.update(earn_details_update, {
            where: { userid },
            transaction
        });

        await transaction.commit();


        return res.status(200).json({ message: 'Success', data: { minnerId: MinnerDetails.id, score: balanceScore,"ph":mineAmout } });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

async function claim(req, res, next) {
    try {
        const tgUser = req.user;
        const userid = tgUser.id;

        if (!tgUser || !tgUser.id) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const earnDetails = await Earnings.findOne({
            where: { userid }
        });

        if (!earnDetails) {
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'Earnings not found' });
        }

        if(!earnDetails.last_mine_at || earnDetails.last_mine_at == null){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'You dont have the minner' });
        }

        if(!earnDetails.mining_amount || earnDetails.mining_amount == null || earnDetails.mining_amount <= 0){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'You dont have the minner' });
        }

        const isCrossed = isTimeCrossed(earnDetails.last_mine_at);

        if(!isCrossed){
            return res.status(422).json({ error: 'Unprocessable Entity', message: 'You Still have time to claim' });
        }

        const earned_score = earnDetails.tap_score ? parseInt(earnDetails.tap_score) : 0;
        const earned_minerClaimAmount = earnDetails.mining_amount ? parseInt(earnDetails.mining_amount) : 0;
        const newTapScore = earned_score + earned_minerClaimAmount;

        const { todate }= addHours("1:00");
        
        const earn_details_update = {
            tap_score: newTapScore,
            last_tap_at: moment.utc().toDate(),
            last_mine_at :todate
        };

       const [updateCount] = await Earnings.update(earn_details_update, {
            where: { userid }
        });

        if(updateCount > 0){
            return res.status(200).json({ message: 'Success', data: { score:newTapScore } });
        }else{
            return res.status(422).json({error:"confilt", message: 'fail to update', data: { score:newTapScore } });
        }

    } catch (error) {
        
        next(error);
    }
}



module.exports = {
    getList,
    upgrade,
    claim
};