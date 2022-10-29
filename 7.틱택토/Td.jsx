import React, { useCallback, memo, useEffect, useRef } from "react";
import { CLICK_CELL } from "./TicTacToe";

const Td = memo(({ rowIndex, cellIndex, dispatch, cellData }) => {
  console.log("td rendered");

  // 검사법 어떤게 바뀌고 안바뀌는지 (False가 나오면 걔 떄문에 리렌더링 되는거)
  /** const ref = useRef([]);
  useEffect(() => {
    console.log(
      rowIndex === ref.current[0],
      cellIndex === ref.current[1],
      dispatch === ref.current[2],
      cellData === ref.current[3]
    );
    // cellData가 false면 얘가 어떻게 바꼈는지
    console.log(cellData, ref.current[3]);
    ref.current = [rowIndex, cellIndex, dispatch, cellData];
  }, [rowIndex, cellIndex, dispatch, cellData]); */

  const onClickTd = useCallback(() => {
    console.log(rowIndex, cellIndex);
    // cellData가 있다면 return
    if (cellData) {
      return;
    }
    // 몇 번째 줄 몇 번째 칸
    dispatch({ type: CLICK_CELL, row: rowIndex, cell: cellIndex });
  }, [cellData]);

  return <td onClick={onClickTd}>{cellData}</td>;
});

export default Td;
