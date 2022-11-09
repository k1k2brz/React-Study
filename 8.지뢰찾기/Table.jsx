import React, { useContext, memo } from "react";
import Tr from "./Tr";
import { TableContext } from "./MineSearch";

// memo를 사용하려면 하위 컴포넌트에도 다 memo 적용이 되어 있어야 함
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
