import React, { useReducer, createContext, useMemo } from "react";
import Form from "./Form";
import Table from "./Table";

export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0, // 0이상히면 다 opened
};

// 다른 컴포넌트에서 쓰기 위해 export
export const TableContext = createContext({
  tableData: [[-1, -1, -1, -1, -1, -1, -1], [], [], [], []],
  halted: true,
  dispatch: () => {},
});

const initialState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: "",
  // 다른 칸 클릭해도 동작이 없도록
  halted: true,
  // 지금까지 칸 몇개 열었는지
  openedCount: 0,
};

// 지뢰심기
const plantMine = (row, cell, mine) => {
  console.log(row, cell, mine);
  const candidate = Array(row * cell)
    .fill()
    .map((arr, i) => {
      return i;
    });
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }
  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  // shuffle에 지뢰심기
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    // 몇 번째 줄 몇 번째 칸에 지뢰를 심을지
    data[ver][hor] = CODE.MINE;
  }

  console.log(data);
  return data;
};

export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const CLICK_MINE = "CLICK_MINE";
export const FLAG_CELL = "FLAG_CELL";
export const QUESTION_CELL = "QUESTION_CELL";
export const NORMALIZE_CELL = "NORMALIZE_CELL";
export const INCREMENT_TIMER = "INCREMENT_TIMER";

const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        // 초기화
        // 세로 가로 지뢰 갯수
        data: {
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
        timer: 0,
      };
    case OPEN_CELL: {
      // 불변성 유지
      const tableData = [...state.tableData[action.row]];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData.forEach((row, i) => {
        tableData[i] = [...state.tableData[i]];
      });
      // 한 번 검사한 칸
      const checked = [];
      let openedCount = 0;
      // 내 기준으로 주변 칸들 검사
      // 내가 빈칸일 때만
      const checkAround = (row, cell) => {
        if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
          return;
          // 상하와주 없는 칸은 안열기
        }
        if (
          [CODE.OPENED, CODE.FLAG_MINE, CODE.FLAG, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])
        ) {
          return;
          // 닫힌 칸만 열기
        }
        // 한 번 검사한 칸은 다시 하지 않는다.
        if (checked.includes(row + "," + cell)) {
          // 이미 검사한 칸이면
          return;
        } else {
          checked.push(row + "," + cell);
        } // 한 번 연 칸은 무시하기

        // OPENED를 Td에서 dispatch
        // tableData[action.row][action.cell] = CODE.OPENED;
        // 빈 칸 누르면 주변 8칸 검사
        let around = [tableData[row][cell - 1], tableData[row][cell + 1]];
        // 윗줄이 있는 경우
        // 매개변수화 해서 action 다 뗌
        if (tableData[row - 1]) {
          around = around.concat(tableData[row - 1][cell - 1], tableData[row - 1][cell], tableData[row - 1][cell + 1]);
        }
        if (tableData[row + 1]) {
          around = around.concat(tableData[row + 1][cell - 1], tableData[row + 1][cell], tableData[row + 1][cell + 1]);
        }
        // 내 왼쪽 칸 오른쪽 칸 넣어준다.
        around = around.concat(tableData[row][cell - 1], tableData[row][cell + 1]);
        // 아랫줄이 있는 경우
        if (tableData[row + 1]) {
          around = around.concat(tableData[row + 1][cell - 1], tableData[row + 1][cell], tableData[row + 1][cell + 1]);
        }
        // 주변 칸에 지뢰가 설치되어 있는지

        // 주변 칸 클릭
        const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v).length);
        tableData[row][cell] = count;
        if (count === 0) {
          // 주변칸 오픈
          if (row > -1) {
            const near = [];
            if (row - 1 > -1) {
              near.push([row - 1, cell - 1]);
              near.push([row - 1, cell]);
              near.push([row - 1, cell + 1]);
            }
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            if (row + 1 > tableData.length) {
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }
            // 있는 칸들만 주변 클릭
            // 좌우 예외처리 없는건 undefined가 되는데 filter를 할 때 사라져버림
            near.forEach((n) => {
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkAround(n[0], n[1]);
              }
            });
          }
        }
        // 지금 내 칸이 닫힌 칸이면 (일반칸이면)
        if (tableData[row][cell] === CODE.NORMAL) {
          // 카운트 증가
          openedCount += 1;
        }
        tableData[row][cell] = count;
      };
      checkAround(action.row, action.cell);
      let halted = false;
      let result = "";
      // 승리조건
      // console.log(state.data.row * state.data.cell - state.data.mine, state.openedCount + openedCount);
      if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) {
        halted = true;
        result = `${state.timer}초만에 승리하셨습니다`;
        // 승리
      }

      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result,
      };
    }
    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData,
        halted: true,
      };
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.MINE) {
        // FLAG_MINE과 FLAG를 구별해서 어떤 칸에는 지뢰가 심어져 있고 아니고를 판단
        tableData[action.row][action.cell] = CODE.FLAG_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.FLAG;
      }
      return {
        ...state,
        tableData,
      };
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {
        // FLAG_MINE과 FLAG를 구별해서 어떤 칸에는 지뢰가 심어져 있고 아니고를 판단
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData,
      };
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
        // FLAG_MINE과 FLAG를 구별해서 어떤 칸에는 지뢰가 심어져 있고 아니고를 판단
        tableData[action.row][action.cell] = CODE.MINE;
      } else {
        tableData[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData,
      };
    }
    // 타이머
    case INCREMENT_TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
      };
    }
    default:
      return state;
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state; // 구조분해로 길이 조절 (앞으로 state안붙여도 됨)

  // useContext(TableContext)가 계속 렌더링되는걸 막기 위해 useMemo로 캐싱
  // value들을 항상 캐싱해줘야 함
  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);

  // 1초마다 타이머 증가
  useEffect(() => {
    let timer;
    if (halted === false) {
      const timer = setInterval(() => {
        dispatch({ INCREMENT_TIMER });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [halted]);

  return (
    // Provider로 감싸서 어디에서든 값을 받을 수 있게 해준다.
    // useContext를 렌더링
    <TableContext.Provider value={value}>
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
  );
};

export default MineSearch;
