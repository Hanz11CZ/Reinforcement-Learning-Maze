let state = [3,0];
const actions = ["up","right","down","left"];

// Table of Q-values
// each state has an array of Q-values for each action in this order: [up,right,down,left]
let Qvalues = {};
for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
        Qvalues[i+""+j] = [0,0,0,0];      
    }
}

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

function whatIsNextState(state,action) {
    let state_after = state;
    switch (action) {
        case 0:
            // UP
            try {
                if(board[state[0]-1][state[1]] == undefined) {
                    throw "Out of the board";
                };
                state_after = [state[0]-1,state[1]];
            } catch(err) {}
            break;
        case 1:
            // RIGHT
            try {
                if(board[state[0]][state[1]+1] == undefined) {
                    throw "Out of the board";
                };
                state_after = [state[0],state[1]+1];
            } catch(err) {}
            break;
        case 2:
            // DOWN
            try {
                if(board[state[0]+1][state[1]] == undefined) {
                    throw "Out of the board";
                };
                state_after = [state[0]+1,state[1]];
            } catch(err) {}
            break;
        case 3:
            // LEFT
            try {
                if(board[state[0]][state[1]-1] == undefined) {
                    throw "Out of the board";
                };
                state_after = [state[0],state[1]-1];
            } catch(err) {}
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

function updateQvalue(state,action,learning_rate = 0.8,discount_rate = 0.9) {
    // Base case for the recursive "go" function is when the reward = 1
    let reward = board[state[0]][state[1]];
    if(reward == 1) {
        return("WIN");
    }
    let next_state = whatIsNextState(state,action);
    let highest_q_value_in_next_state = findHighestQValue(next_state);
    let next_reward = board[next_state[0]][next_state[1]];
    Qvalues[state[0]+""+state[1]][action] = ((1-learning_rate)*Qvalues[state[0]+""+state[1]][action]) + (learning_rate*(next_reward+(discount_rate*highest_q_value_in_next_state[0])));
    return;
}

let num_of_goes = 0;
function go(startingState) {
        num_of_goes += 1;
        console.log(num_of_goes);
        if(exploitOrExplore(0.8) == "explore") {
            // starting state is i.e [y,x] (first number represents the row in board, the second the column - both zero based)
            let action_to_take = getRandomInt(4);
            // Base case:
            let updatingQ = updateQvalue(startingState,action_to_take);
            if(updatingQ == "WIN") {
                console.log("Win!");
                console.log(Qvalues);
                return;
            };
            let next_state = whatIsNextState(startingState,action_to_take);
            drawBox(startingState,next_state);
            return(go(next_state));
        } else {
            // This will return an array [highest Q-value,direction] --> action number is in best_action[1]
            let best_action = findHighestQValue(startingState);
            let updatingQ = updateQvalue(startingState,best_action[1]);
            if(updatingQ == "WIN") {
                console.log("Win!");
                console.log(Qvalues);
                return;
            };
            let next_state = whatIsNextState(startingState,best_action[0]);
            drawBox(startingState,next_state);
            return(go(next_state));
        }
}


const num_of_episodes = 5;

function train(num_of_episodes) {
    for (let episode = 0; episode < num_of_episodes; episode++) {
        go(state);
    }
}

train(num_of_episodes);