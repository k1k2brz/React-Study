import React, { useEffect, useState, useReducer } from "react";
import Table from "./Table";

// state의 갯수를 줄이는 useReducer
const initialState = {
  winner: "",
  turn: "o",
  tableData: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  // 없는칸으로 만드는 초기화
  recentCell: [-1, -1],
};

// 변수로 빼두면 좋다
// export를 붙여 모듈로 만들어준다 (td에서 써야하기 때문에)
export const SET_WINNER = "SET_WINNER";
export const CLICK_CELL = "CLICK_CELL";
export const CHANGE_TURN = "CHANGE_TURN";
export const RESET_GAME = "RESET_GAME";

// state를 어떻게 바꿀지 reducer에 기록
const reducer = (state, action) => {
  // 액션이 뭔지 구별
  switch (action.type) {
    // SET_WINNER라는 액션이면
    case SET_WINNER:
      // state실행
      // but - state.winner = action.winner; 이렇게 직접 바꾸면 절대 안된다
      // 새로운 객체를 만들어서 바뀐 값만 바꿔줄 것
      return {
        ...state,
        winner: action.winner,
      };
    // O X 나오게
    case CLICK_CELL:
      const tableData = [...state.tableData];
      tableData[action.row] = [...tableData[action.row]]; // immer라는 라이브러리로 가독성 해결
      tableData[action.row][action.cell] = state.turn;
      return {
        ...state,
        tableData,
        // 눌렀을 때 기억 좌표 (최근 클릭한 셀)
        recentCell: [action.row, action.cell],
      };
    case CHANGE_TURN: {
      return {
        ...state,
        turn: state.turn === "o" ? "x" : "o",
      };
    }
    case RESET_GAME: {
      return {
        ...state,
        turn: "o",
        tableData: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        recentCell: [-1, -1],
      };
    }
    default:
      return state;
  }
};

const TicTacToe = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, turn, winner, recentCell } = state;
  //   const [winner, setWinner] = useState("");
  //   const [turn, setTurn] = useState("o");
  //   const [tableData, setTableData] = useState([["", "", ""], ["", "", ""], ["", "", ""],]);

  const onClickTable = useCallback(() => {
    // action을 dispatch할 때 마다 reducer부분이 실행된다
    dispatch({ type: SET_WINNER, winner: "o" });
  }, []);

  useEffect(() => {
    const [row, cell] = recentCell;
    // useEffect는 처음부터 실행 되기 때문에 초기화 이전에 승패 가리는걸 방지
    if (row < 0) {
      return;
    }
    let win = false;
    // 일치 검사
    if (
      tableData[row][0] === turn &&
      tableData[row][1] === turn &&
      tableData[row][2] === turn
    ) {
      win = true;
    }
    if (
      tableData[0][cell] === turn &&
      tableData[1][cell] === turn &&
      tableData[2][cell] === turn
    ) {
      win = true;
    }
    if (
      tableData[0][0] === turn &&
      tableData[1][1] === turn &&
      tableData[2][2] === turn
    ) {
      win = true;
    }
    if (
      tableData[0][2] === turn &&
      tableData[1][1] === turn &&
      tableData[2][0] === turn
    ) {
      win = true;
    }
    console.log(win, row, cell, tableData, turn);
    if (win) {
      // 승리시
      dispatch({ type: SET_WINNER, winner: turn });
      dispatch({ type: RESET_GAME });
    } else {
      let all = true; // all이 true면 무승부라는 뜻
      tableData.forEach((row) => {
        // 무승부 검사
        row.forEach((cell) => {
          if (!cell) {
            // 하나라도 칸이 안 차있다면
            all = false;
          }
        });
      });
      if (all) {
        dispatch({ type: SET_WINNER, winner: null });
        dispatch({ type: RESET_GAME });
      } else {
        dispatch({ type: CHANGE_TURN });
      }
    }
  }, [recentCell]);

  return (
    <>
      <Table
        onClick={onClickTable}
        tableData={state.tableData}
        dispatch={dispatch}
      />
      {state.winner && <div>{state.winner}님의 승리</div>}
    </>
  );
};

export default TicTacToe;
