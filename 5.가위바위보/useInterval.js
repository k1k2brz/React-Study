import { useRef, useEffect } from "react";

// const [isRunning, setRunning] = useState(true);
// useInterval(() => {
// console.log('hello')
// }, isRunning ? 1000 : null)

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    // 여기서 callback을 받으면 콜백 실행하는 동안 생기는 딜레이만큼 밀림
  }, [delay]);

  return savedCallback.current;
}

export default useInterval;
