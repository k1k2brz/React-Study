export default function Baseball() {
  // 배열 복사시 [...arr1, 추가하고 싶은 값] 이렇게 해야함
  // PureComponent (class)
  // memo로 부모컴포넌트 리렌더링 될때 자식컴포넌트 리렌더링 안하고싶은 컴포넌트 안에 들어가서 감싼다
  // displayName 으로 원래대로 이름 돌려줌
  <ul>
    {["사과", "바나나", "포도", "귤", "감", "배", "밤"].map((v, i) => {
      return <li key={v}>{v}</li>;
    })}
    <li></li>
  </ul>;
}
