import React, { useContext, memo } from "react";
import Tr from "./Tr";
import { TableContext } from "./MineSearch";

const Table = memo(() => {
  const { tableData } = useContext(TableContext);
  return (
    // 행 수 열 수 반복문 돌려주기
    <table>
      {Array(tableData.length)
        .fill()
        .map((tr, i) => (
          <Tr rowIndex={i} />
        ))}
    </table>
  );
});

export default Table;
