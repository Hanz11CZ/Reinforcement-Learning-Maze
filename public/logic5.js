const starting_state = [1,1];
const actions = ["UP","RIGHT","DOWN","LEFT"];
//const createInitialBoardForKernel = require("./board.js")

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

// Unused
function updateQvalue(state,action,learning_rate = 0.8,discount_rate = 0.9) {
    // Base case for the recursive "go" function is when the reward = 1
    let reward = board[state[0]][state[1]];
    if(reward == 10) {
        return("WIN");
    }
    let next_state = whatIsNextState(state,action);
    let highest_q_value_in_next_state = findHighestQValue(next_state);
    let next_reward = board[next_state[0]][next_state[1]];
    Qvalues[state[0]+""+state[1]][action] = ((1-learning_rate)*Qvalues[state[0]+""+state[1]][action]) + (learning_rate*(next_reward+(discount_rate*highest_q_value_in_next_state[0])));
    return;
}

// Unused
function whatActionToTake(state,greed_parameter) {
    let action_to_take = getRandomInt(4);
    if(exploitOrExplore(greed_parameter) == "exploit") {
        result = findHighestQValue(state);
        action_to_take = result[1]
    } 
    return(action_to_take);
}

function updateMyQValueAndReturnIt(state,learning_rate,discount_rate,greed_parameter,goal_reward_amount) {
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
        return updateMyQValueAndReturnIt(next_state,learning_rate,discount_rate,greed_parameter,goal_reward_amount);
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
        return updateMyQValueAndReturnIt(next_state,learning_rate,discount_rate,greed_parameter,goal_reward_amount);
    }
}

function go(startingState,learning_rate,discount_rate,greed_parameter,goal_reward_amount) {
    updateMyQValueAndReturnIt(startingState,learning_rate,discount_rate,greed_parameter,goal_reward_amount);
    return;
}

function train(num_of_episodes,learning_rate = 0.8,discount_rate = 0.8,greed_parameter=0.6,goal_reward_amount=10) {
    for (let episode = 0; episode < num_of_episodes; episode++) {
        go(starting_state,learning_rate,discount_rate,greed_parameter,goal_reward_amount);
    }
    Object.keys(Qvalues).forEach(key => {
        let block_where_to_add_Q_values = document.getElementById(key);
        block_where_to_add_Q_values.innerHTML += Qvalues[key].map(Q_value => Q_value.toFixed(3));
    })   
    showBestPath(starting_state);
    console.log(Qvalues);
}

function showBestPath(state) {
    let box_to_paint = document.getElementById(state[0]+""+state[1]);
    box_to_paint.classList.add("visited");
    let q_values_in_array = box_to_paint.innerHTML.split(",");
    let highest_q_value = 0;
    let action_to_take = 0;
    for (let index = 0; index < q_values_in_array.length; index++) {
        if(parseFloat(q_values_in_array[index]) > highest_q_value) {
            highest_q_value = parseFloat(q_values_in_array[index]);
            action_to_take = index;
        }
    }
    box_to_paint.innerHTML += "<br>"+actions[action_to_take];
    let next_state = whatIsNextState(state,action_to_take);
    let next_box_to_paint = document.getElementById(next_state[0]+""+next_state[1]);
    // If two block next to each other direct with theit highest Q-value to one another (ends up in back-and-forth -> it would never stop)
    while(next_box_to_paint.classList.contains("visited")) {
        try {
            next_state = whatIsNextState(state,getRandomInt(4));
            while(isOutOfBoard(next_state)) {
                next_state = whatIsNextState(state,getRandomInt(4));
            }
            next_box_to_paint = document.getElementById(next_state[0]+""+next_state[1]);
        } catch(err) {}
    }
    // Base case when we reach the goal block:
    if(next_box_to_paint.classList.contains("goal")) {
        next_box_to_paint.innerHTML = "WIN";
        return true;
    }
    return showBestPath(next_state);
}


// Parameters in createInitialBoard(): width_of_board,height_of_board,
let boardAndQvalues = createInitialBoard(12,12,8,8,1,0);
const board = boardAndQvalues[0];
const Qvalues = boardAndQvalues[1];
//  x_goal_position(zero-based),y_goal_position(zero-based),goal_reward_amount,other_boxes_reward
//result_buff = createInitialBoardForKernel(12,12,9,11,10);
//const board = result_buff[0]
//const Qvalues = result_buff[1];
// Parameters in train(): num_of_episodes,learning_rate,discount_rate,greed_parameter,goal_reward_amount
train(1,0.7,0.90,0.8,1);
