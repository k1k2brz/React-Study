import React, { useContext, useCallback, useMemo, memo } from "react";
import { CLICK_MINE, CODE, FLAG_CELL, NORMALIZE_CELL, OPEN_CELL, QUESTION_CELL, TableContext } from "./MineSearch";

// 색 변경하기
const getTdStyle = (code) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE:
      return {
        background: "#444",
      };
    case CODE.CLICKED_MINE:
    case CODE.OPENED:
      return {
        background: "white",
      };
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return {
        background: "yellow",
      };
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return {
        background: "red",
      };
    default:
      return {
        background: "white",
      };
  }
};

// 지뢰 칸에 뜨는 글자
const getTdText = (code) => {
  console.log("getTdtext");
  switch (code) {
    // 아무것도 아닌칸
    case CODE.NORMAL:
      return "";
    // 마인
    case CODE.MINE:
      return "X";
    // 마인 클릭
    case CODE.CLICKED_MINE:
      return "펑";
    // 깃발 (오른 클릭 1회)
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return "!";
    // 물음표 (오른 클릭 2회)
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return "?";
    default:
      // code넣어서 지뢰갯수 표시되게, 0인 경우 ""로 안나오게
      return code || "";
  }
};

const Td = memo(({ rowIndex, cellIndex }) => {
  const { tableData, dispatch, halted } = useContext(TableContext);

  const onClickTd = useCallback(() => {
    // 게임이 멈췄으면 아무일도 하지 않도록
    if (halted) {
      return;
    }
    // 클릭했을 때 상태 (지뢰인곳 아닌곳)
    switch (tableData[rowIndex][cellIndex]) {
      // 클릭 안되는 칸 들
      // 이미 연 칸
      case CODE.OPENED:
      // 깃발 칸
      case CODE.FLAG_MINE:
      case CODE.FLAG:
      // 물음표칸
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return;
      case CODE.NORMAL:
        dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
        return;
      case CODE.MINE:
        dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
        return;
      default:
        return;
    }
    // 바뀌는건 항상 여기
  }, [tableData[rowIndex][cellIndex], halted]);

  // 오른 마우스 클릭
  const onRightClickTd = useCallback(
    (e) => {
      e.preventDefault();
      if (halted) {
        return;
      }
      switch (tableData[rowIndex][cellIndex]) {
        case CODE.NORMAL:
        case CODE.MINE:
          dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
          return;
        case CODE.FLAG_MINE:
        case CODE.FLAG:
          dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex });
          return;
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
          dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex });
          return;
        default:
          return;
      }
    },
    [tableData[rowIndex][cellIndex], halted]
  );

  console.log("td rendered");
  // context API를 사용하면 자동 렌더링 됨
  // -> return 부분을 memo
  // 다 리렌더링 되는 것 같지만 실제로는 누르는 부분만 리렌더링 되도록 해야함

  // 방법 1
  // return useMemo(() => {
  //   <td style={getTdStyle(data)} onClick={onClickTd} onContextMenu={onRightClickTd}>
  //   {getTdText(tableData[rowIndex][cellIndex])}</td>
  // }, [tableData[rowIndex][cellIndex]]);

  // 방법2 (컴포넌트를 2개로 분리하는 방법)
  return <RealTd onClickTd={onClickTd} onRightClickTd={onRightClickTd} data={tableData[rowIndex][cellIndex]} />;
});

// 함수 자체는 여러번 실행 되더라도 이 부분은 클릭했을 때만 실행되게
const RealTd = memo(({ onClickTd, onRightClickTd, data }) => {
  console.log("real td rendered");
  return (
    <td style={getTdStyle(data)} onClick={onClickTd} onContextMenu={onRightClickTd}>
      {getTdText(data)}
    </td>
  );
});

export default Td;
