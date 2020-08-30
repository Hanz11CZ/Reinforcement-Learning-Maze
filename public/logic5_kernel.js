const starting_state = [1,1];
const actions = ["UP","RIGHT","DOWN","LEFT"];
const createInitialBoardForKernel = require("./board.js")

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function exploitOrExplore(greedParameter = 0.8) {
    random_num = Math.random();
    if (random_num <= greedParameter) {
        return("exploit");
    } else {
        return("explore");
    }
}

function isOutOfBoard(next_state) {
    try {
        if(board[next_state[0]][next_state[1]] == undefined) {
            return true;
        } else {
            return false
        }
    } catch(err) {}
}

function whatIsNextState(state,action) {
    let state_after = state;
    switch (action) {
        case 0:
            // UP
            try {
                if(board[state[0]-1][state[1]] == undefined) {
                    throw "Out of the board";
                } else {
                    state_after = [state[0]-1,state[1]];
                }
            } catch(err) {
            }
            break;
        case 1:
            // RIGHT
            try {
                if(board[state[0]][state[1]+1] == undefined) {
                    throw "Out of the board";
                } else {
                    state_after = [state[0],state[1]+1];
                }
            } catch(err) {
            }
            break;
        case 2:
            // DOWN
            try {
                if(board[state[0]+1][state[1]] == undefined) {
                    throw "Out of the board";
                } else {
                    state_after = [state[0]+1,state[1]];
                }
            } catch(err) {
            }
            break;
        case 3:
            // LEFT
            try {
                if(board[state[0]][state[1]-1] == undefined) {
                    throw "Out of the board";
                } else {
                    state_after = [state[0],state[1]-1];
                }
            } catch(err) {
            }
            break;
    }
    return(state_after);
}

function findHighestQValue(state) {
    // I will return array [highest Q-value around, what direction it is(in number)]
    // direction = 0 (up), direction = 1 (right),...
    let highestQ = 0;
    let direction = getRandomInt(4);
    for (let directionToLoop = 0; directionToLoop < 4; directionToLoop++) {
        if(Qvalues[state[0]+""+state[1]][directionToLoop] > highestQ) {
            highestQ = Qvalues[state[0]+""+state[1]][directionToLoop];
            direction = directionToLoop;
        };
    }
    return([highestQ,direction])
}

function updateMyQValueAndReturnIt(state,learning_rate,discount_rate,greed_parameter,goal_reward_amount,num_of_steps) {
    num_of_steps += 1;
    // Base case after some number of steps:
    if(num_of_steps > 800) {
        return(0);
    }
    let action_to_take = getRandomInt(4);
    if(exploitOrExplore(greed_parameter) == "explore") {
        let next_state = whatIsNextState(state,action_to_take);
        while(isOutOfBoard(next_state) == true || next_state == state) {
            action_to_take = getRandomInt(4);
            next_state = whatIsNextState(state,action_to_take);
        }
        let next_reward = board[next_state[0]][next_state[1]];
        // base case:
        if(next_reward == parseInt(goal_reward_amount)) {
            Qvalues[state[0]+""+state[1]][action_to_take] = ((1-learning_rate)*Qvalues[state[0]+""+state[1]][action_to_take]) + (learning_rate*(next_reward+(discount_rate*1)));
            return(Qvalues[state[0]+""+state[1]][action_to_take]);
        }
        highest_q_value_in_next_state = findHighestQValue(next_state);
        Qvalues[state[0]+""+state[1]][action_to_take] = ((1-learning_rate)*Qvalues[state[0]+""+state[1]][action_to_take]) + (learning_rate*(next_reward+(discount_rate*highest_q_value_in_next_state[0])));
        return updateMyQValueAndReturnIt(next_state,learning_rate,discount_rate,greed_parameter,goal_reward_amount,num_of_steps);
    } else {
        let resultArray = findHighestQValue(state);
        action_to_take = resultArray[1];
        let next_state = whatIsNextState(state,action_to_take);
        while(isOutOfBoard(next_state) == true || next_state == state) {
            action_to_take = getRandomInt(4);
            next_state = whatIsNextState(state,action_to_take);
        }
        let next_reward = board[next_state[0]][next_state[1]];
        // base case:
        if(next_reward == parseInt(goal_reward_amount)) {
            Qvalues[state[0]+""+state[1]][action_to_take] = ((1-learning_rate)*Qvalues[state[0]+""+state[1]][action_to_take]) + (learning_rate*(next_reward+(discount_rate*1)));
            return(Qvalues[state[0]+""+state[1]][action_to_take]);
        }
        highest_q_value_in_next_state = findHighestQValue(next_state);
        Qvalues[state[0]+""+state[1]][action_to_take] = ((1-learning_rate)*Qvalues[state[0]+""+state[1]][action_to_take]) + (learning_rate*(next_reward+(discount_rate*highest_q_value_in_next_state[0])));
        return updateMyQValueAndReturnIt(next_state,learning_rate,discount_rate,greed_parameter,goal_reward_amount,num_of_steps);
    }
}

function go(startingState,learning_rate,discount_rate,greed_parameter,goal_reward_amount) {
    let num_of_steps = 0;
    updateMyQValueAndReturnIt(startingState,learning_rate,discount_rate,greed_parameter,goal_reward_amount,num_of_steps);
    return;
}

function showBestPathAndCountSteps(state,goal_reward_amount,steps_needed) {
    steps_needed += 1;
    let highest_q_value = 0;
    let action_to_take = 0;
    let q_values_in_array = Qvalues[state[0]+""+state[1]];
    for (let index = 0; index < q_values_in_array.length; index++) {
        if(parseFloat(q_values_in_array[index]) > highest_q_value) {
            highest_q_value = parseFloat(q_values_in_array[index]);
            action_to_take = index;
        }
    }
    let next_state = whatIsNextState(state,action_to_take);
    // Base case when we reach the goal block:
    if(board[next_state[0]][next_state[1]] == goal_reward_amount) {
        return steps_needed;
    }
    return showBestPathAndCountSteps(next_state,goal_reward_amount,steps_needed);
}

var board = [];
var Qvalues = {};

function train(num_of_episodes,learning_rate = 0.8,discount_rate = 0.2,greed_parameter=0.6,width=15,height=15,x_goal_position=12,y_goal_position=12,goal_reward_amount=10,other_boxes_reward=0) {
    result_buff = createInitialBoardForKernel(width,height,x_goal_position,y_goal_position,goal_reward_amount,other_boxes_reward);
    board = result_buff[0];
    Qvalues = result_buff[1];
    for (let episode = 0; episode < num_of_episodes; episode++) {
        go(starting_state,learning_rate,discount_rate,greed_parameter,goal_reward_amount);
    }
    let steps_needed = 0;
    console.log(showBestPathAndCountSteps(starting_state,goal_reward_amount,steps_needed));
}


/*
    HOW TO RUN THE REINFORCEMENT LEARNING CUSTOM MODEL AND RETURN LENGTH OF THE SHORTEST PATH?

    Run train() with the following parameters: 
        num_of_episodes,learning_rate,discount_rate,greed_parameter,goal_reward_amount,
        width_of_board,height_of_board,x_goal_position(zero-based),y_goal_position(zero-based),
        goal_reward_amount,other_boxes_reward
*/

train(300,0.7,0.92,0.85,16,16,15,14,10);
