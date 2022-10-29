import React, { memo } from "react";
import Td from "./Td";

// useMemo로 <td> 컴포넌트 자체를 기억 해버려서 렌더링 막는법도 있다

const Tr = memo(({ rowData, rowIndex, dispatch }) => {
  console.log("tr rendered");
  return (
    <tr>
      {Array(rowData.length)
        .fill()
        .map((td, i) => (
          <Td
            key={i}
            dispatch={dispatch}
            rowIndex={rowIndex}
            cellIndex={i}
            cellData={rowData[i]}
          >
            {""}
          </Td>
        ))}
    </tr>
  );
});

export default Tr;
