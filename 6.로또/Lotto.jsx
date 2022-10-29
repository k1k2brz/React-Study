import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Ball from "./Ball";

// useMemo : 복잡한 함수 결괏값을 기억
// useRef: 일반 값을 기억
// useCallback : 함수 자체를 기억
// hooks는 전체가 재실행 되기 때문에 (함수실행이 비효율적 그래서 console.log를 잘 찍어봐야)

// state안쓰는 애들은 분리를 해둘 것
function getWinNumbers() {
  // 반복 실행 확인용 console.
  console.log("getWinNumbers");
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(
      candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]
    );
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

// hooks는 선언 순서가 중요하다
const Lotto = () => {
  // 계속 실행되는 getWinNumbers를 방지하기 위함
  // 숫자를 기억하기 위한 useMemo (재실행 방지) (함수의 리턴값을 기억)
  const lottoNumbers = useMemo(() => getWinNumbers(), []); //2번째 인자가 바뀌지 않는 한 다시 실행되지 않음
  const [winNumbers, setWinNumbers] = useState(lottoNumbers);
  const [winBalls, setWinBalls] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef([]);
  // hooks를 조건문 안에 넣으면 안되고 함수나 반복문 안에도 웬만하면 넣지 말것

  // ==========================================
  //   useEffect(() => {
  //     //ajax
  //   }, []) // componentDidMount만 하는 법

  //   const mounted = useRef(false);
  //   useEffect(() => {
  //     if (!mounted.current) {
  //         mounted.current = true;
  //     } else {
  //         //ajax
  //     }
  //   }, [바뀌는 값]); // componentDidUpdate만, componentDidMount X
  // ========================================

  // componentDidMount에 쓰일걸 넣어두고
  // componentDidUpdate에 쓰일걸 []안에
  // useEffect는 여러번 사용해도 된다.
  useEffect(() => {
    console.log("useEffect");
    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = setTimeout(() => {
        setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]);
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);
    return () => {
      timeouts.current.forEach((v) => {
        clearTimeout(v);
      });
    };
    // 바뀌는 시점을 감지하는 곳
  }, [timeouts.current]); // 빈 배열이면 componentDidMount와 동일
  // 배열에 요소가 있으면 componentDidMount랑 componentDidUpdate 둘 다 수행

  useEffect(() => {
    console.log("로또 숫자를 생성합니다.");
  }, [winNumbers]);

  // 자식컴포넌트에 props를 넘길때는 useCallback을 사용해서 매번 리렌더링 하는걸 막는다
  const onClickRedo = useCallback(() => {
    console.log("onClickRedo");
    console.log(winNumbers);
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  }, [winNumbers]); //2번째 인자가 어떨 때 다시 실행되는지를 결정한다.
  // []를 넣지 않으면 첫번째 값을 계속 기억하게 된다. (console찍으면 나옴)

  return (
    <>
      <div>당첨 숫자</div>
      <div id="결과창">
        {winBalls.map((v) => (
          <Ball key={v} number={v} />
        ))}
      </div>
      <div>보너스!</div>
      {bonus && <Ball number={bonus} onClick={onClickRedo} />}
      {redo && <button onClick={onClickRedo}>한 번 더!</button>}
    </>
  );
};

export default Lotto;
