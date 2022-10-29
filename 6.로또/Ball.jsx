import React, { memo } from 'react';

// 하이 오더 컴포넌트
// hooks가 아니라 함수 컴포넌트  (useState, useEffect등을 안쓰기 때문)
// memo를 넣어 퓨어 컴포넌트 역할 (데이터 받는게 아니라 화면만 바꾸기 때문에 이거 씀)
// 자식 컴포넌트의 memo (불필요한 렌더링 막기)
const Ball = memo(({ number }) => {
  let background;
  if (number <= 10) {
    background = 'red';
  } else if (number <= 20) {
    background = 'orange';
  } else if (number <= 30) {
    background = 'yellow';
  } else if (number <= 40) {
    background = 'blue';
  } else {
    background = 'green';
  }

  return (
    <div className="ball" style={{ background }}>{number}</div>
  )
});

export default Ball;