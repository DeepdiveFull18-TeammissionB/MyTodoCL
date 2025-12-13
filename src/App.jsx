import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // 1. 상태 관리
  const [todos, setTodos] = useState([]); 
  const [selectedDate, setSelectedDate] = useState('2025-12-08'); 
  const [inputText, setInputText] = useState('');
  
  // ★ DB 연결 상태를 저장하는 변수 추가 (기본값: false)
  const [dbStatus, setDbStatus] = useState(false); 

  // 2. [조회] 및 [연결 확인]
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // 데이터 요청 시도
        const res = await axios.get(`http://https://mytodosvr.onrender.com/api/todos?date=${selectedDate}`);
        
        // 에러 없이 여기까지 왔다면 성공!
        setTodos(res.data.todo); 
        setDbStatus(true); // ★ 연결 성공 도장 쾅!
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        setDbStatus(false); // ★ 연결 실패
      }
    };
    
    fetchTodos();
  }, [selectedDate]);

  // 3. 기능 함수들
  const handleAddTodo = async () => {
    if (!inputText.trim()) return;

    try {
      const res = await axios.post('http://https://mytodosvr.onrender.com/api/todos', {
        text: inputText,
        date: selectedDate,
        done: false
      });

      if (res.data.success) {
        setTodos([...todos, res.data.todo]); 
        setInputText('');
        setDbStatus(true); // 저장 성공 시에도 연결 확인
      }
    } catch (err) {
      console.error("추가 실패:", err);
      alert("서버 연결에 실패했습니다.");
      setDbStatus(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTodo();
  };

  const handleDelete = async (id) => {
    try {
        await axios.delete(`http://https://mytodosvr.onrender.com/api/todos/${id}`);
        setTodos(todos.filter(todo => todo._id !== id));
        setDbStatus(true);
    } catch (err) {
        console.error("삭제 실패:", err);
        setDbStatus(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.patch(`http://https://mytodosvr.onrender.com/api/todos/${id}/toggle`);
      if (res.data.success) {
        setTodos(todos.map(todo => 
          todo._id === id ? res.data.todo : todo
        ));
        setDbStatus(true);
      }
    } catch (err) {
      console.error("수정 실패:", err);
      setDbStatus(false);
    }
  };

  // 4. 캘린더 렌더링
  const renderCalendar = () => {
    const days = [];
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const headers = weekDays.map(day => <div key={day} className="day-name">{day}</div>);
    const empties = [<div key="empty-0" className="day empty"></div>];

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

  // 5. 화면 렌더링
  return (
    <>
      <header>
        <h1>
            My Green To-Do ✅ 
            {/* ★ dbStatus가 true일 때만 글씨를 보여줌 */}
            {dbStatus ? (
                <span style={{ fontSize: '0.8rem', color: '#03C75A', marginLeft: '10px' }}>
                    (DB연동됨 ✨)
                </span>
            ) : (
                <span style={{ fontSize: '0.8rem', color: '#ff4d4f', marginLeft: '10px' }}>
                    (연결안됨 ❌)
                </span>
            )}
        </h1>
      </header>

      <div className="container">
        <div className="card">
          <div className="calendar-header">2025년 12월</div>
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>

        <div className="card">
          <div className="todo-header">
            <span>{selectedDate}</span>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>
              할 일 <span style={{ color: '#03C75A', fontWeight:'bold' }}>{todos.length}</span>개
            </span>
          </div>

          <div className="input-group">
            <input 
              type="text" 
              placeholder={dbStatus ? "할 일을 입력하세요 (Enter)" : "서버 연결을 확인해주세요"}
              disabled={!dbStatus} // 연결 안되면 입력도 막음 (선택사항)
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="add-btn" onClick={handleAddTodo} disabled={!dbStatus}>추가</button>
          </div>

          <ul className="todo-list">
            {todos.length === 0 ? (
              <li style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                {dbStatus ? "등록된 할 일이 없습니다." : "서버와 연결할 수 없습니다."}
              </li>
            ) : (
              todos.map(todo => (
                <li key={todo._id} className="todo-item">
                  <input 
                    type="checkbox" 
                    checked={todo.done} 
                    onChange={() => handleToggle(todo._id)}
                  />
                  <span className={`todo-text ${todo.done ? 'completed' : ''}`}>
                    {todo.text}
                  </span>
                  <button className="delete-btn" onClick={() => handleDelete(todo._id)}>
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