import { useState } from 'react'
import './App.css'

function App() {
  // 1. 상태(변수) 관리
  // 날짜별 할 일 목록 (DB 대신 임시 저장소)
  const [todos, setTodos] = useState({
    '2025-12-08': [
      { id: 1, text: 'Vite 프로젝트 생성 성공!', done: true },
      { id: 2, text: 'CoreUI 탈출하기', done: true },
    ],
    '2025-12-09': [
      { id: 3, text: '리액트로 이사 완료', done: false }
    ]
  });

  const [selectedDate, setSelectedDate] = useState('2025-12-08'); // 선택된 날짜
  const [inputText, setInputText] = useState(''); // 입력창 내용

  // 선택된 날짜의 할 일 목록 가져오기
  const currentTodos = todos[selectedDate] || [];

  // 2. 기능 함수들
  // 할 일 추가
  const handleAddTodo = () => {
    if (!inputText.trim()) return;

    const newTodo = {
      id: Date.now(), // 고유 ID 생성
      text: inputText,
      done: false
    };

    setTodos(prev => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newTodo]
    }));

    setInputText(''); // 입력창 비우기
  };

  // 엔터키 입력 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTodo();
  };

  // 할 일 삭제
  const handleDelete = (id) => {
    setTodos(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter(todo => todo.id !== id)
    }));
  };

  // 할 일 완료 토글
  const handleToggle = (id) => {
    setTodos(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    }));
  };

  // 3. 캘린더 렌더링 도우미
  const renderCalendar = () => {
    const days = [];
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    // 2025년 12월 1일은 월요일 (일요일:0칸 빈칸)
    // 간단하게 1일~31일만 생성 (빈칸 1개 추가)
    
    // 요일 헤더
    const headers = weekDays.map(day => <div key={day} className="day-name">{day}</div>);
    
    // 빈칸 (일요일)
    const empties = [<div key="empty-0" className="day empty"></div>];

    // 날짜들
    for (let i = 1; i <= 31; i++) {
      const dateKey = `2025-12-${i < 10 ? '0' + i : i}`;
      const isSelected = selectedDate === dateKey ? 'selected' : '';
      
      days.push(
        <div 
          key={dateKey} 
          className={`day ${isSelected}`} 
          onClick={() => setSelectedDate(dateKey)}
        >
          {i}
        </div>
      );
    }

    return [...headers, ...empties, ...days];
  };

  // 4. 화면(HTML) 렌더링
  return (
    <>
      <header>
        <h1>My Green To-Do ✅</h1>
      </header>

      <div className="container">
        {/* 왼쪽: 캘린더 카드 */}
        <div className="card">
          <div className="calendar-header">2025년 12월</div>
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>

        {/* 오른쪽: 투두 리스트 카드 */}
        <div className="card">
          <div className="todo-header">
            <span>{selectedDate}</span>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>
              할 일 <span style={{ color: '#03C75A', fontWeight:'bold' }}>{currentTodos.length}</span>개
            </span>
          </div>

          <div className="input-group">
            <input 
              type="text" 
              placeholder="할 일을 입력하세요 (Enter)" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="add-btn" onClick={handleAddTodo}>추가</button>
          </div>

          <ul className="todo-list">
            {currentTodos.length === 0 ? (
              <li style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                등록된 할 일이 없습니다.
              </li>
            ) : (
              currentTodos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <input 
                    type="checkbox" 
                    checked={todo.done} 
                    onChange={() => handleToggle(todo.id)}
                  />
                  <span className={`todo-text ${todo.done ? 'completed' : ''}`}>
                    {todo.text}
                  </span>
                  <button className="delete-btn" onClick={() => handleDelete(todo.id)}>
                    🗑
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  )
}

export default App