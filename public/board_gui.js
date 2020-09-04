// Later can be turned into function:
function newBoard(width,height,box_rewards) {
    let board_container = document.getElementById("grid_container");
    let newBoard = [];
    for (let i = 0;i < height;i++) {
        let newRow = []
        for (let j = 0;j < width;j++) {    
            newRow.push(parseInt(box_rewards));
        }
        newBoard.push(newRow);
    }
    return newBoard;
}

function insertGoal(board,position,goal_reward) {
    board[position[1]][position[0]] = goal_reward;
}

function drawBox(state,next_state) {
    let box_to_erase = document.getElementById(state[0]+""+state[1]);
    let box_to_draw = document.getElementById(next_state[0]+""+next_state[1]);
    box_to_erase.classList.remove("visited");
    box_to_draw.classList.add("visited");
    return true;
}

// Function to create a board, insert a goal with specified reward and specify rewards for other boxes:
//          Inserting goal (goal_x_position,goal_y_position) - zero-based order

function createInitialBoard(width,height,goal_x_position,goal_y_position,goal_reward=1,boxes_reward=0) {
    var grid_container = document.getElementById("grid_container");
    grid_container.style.gridTemplateColumns = "repeat(" + width + ", calc(" + grid_container.offsetWidth + "px/" + width + "))";
    grid_container.style.gridTemplateRows = "repeat(" + height + ", calc(" + grid_container.offsetHeight + "px/" + height + "))";
    var board = newBoard(width, height,boxes_reward);
    insertGoal(board,[goal_x_position,goal_y_position],goal_reward);
    console.log(board);
    // For each block in the board, create a grid box in html
    for (let i = 0;i < board.length;i++) {
        for (let j = 0;j < board[i].length;j++) {
            var block = document.createElement("div");
            block.classList.add("block");
            block.id = i+""+j;
            if (board[i][j] == goal_reward) {
                block.classList.add("goal");
            }
            grid_container.appendChild(block);
        }
    };
    // Table of Q-values
    // each state has an array of Q-values for each action in this order: [up,right,down,left]
    var Qvalues = {};
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            Qvalues[i+""+j] = [0,0,0,0];     
        }
    }
    console.log(Qvalues);
    return [board,Qvalues];
}

function finishAndUpdateGUI(num_of_steps) {
    
}
/*
let boardAndQvalues = createInitialBoard(15,8,5,6,1,0);
const board = boardAndQvalues[0];
const Qvalues = boardAndQvalues[1];*/
