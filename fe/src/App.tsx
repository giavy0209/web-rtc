import { useCallback, useEffect, useState, } from "react";
import { Route, Routes } from "react-router-dom";
import socket from "socket";
import ScreemScreen from "StreamScreen";
import Room from "Room";
import { useDispatch, useSelector } from "react-redux";
import callAPI from "callAPI";
import { actionChangeFirstIn, actionChangeUser } from "store/actions";
import storage from "helpers/storage";
function App() {
  const isFirstIn = useSelector((state: any) => state.isFirstIn)
  const dispatch = useDispatch()
  const [Username , setUsername ] = useState('')
  const handleJoin = useCallback(async () => {
    const res = await callAPI.post('/auth' , {username : Username})
    storage.setToken(res.token)
    dispatch(actionChangeFirstIn(false))
    dispatch(actionChangeUser(res.data))
  },[Username, dispatch])
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connect', socket.id);
    })
  }, [])
  return (
    <>
      {isFirstIn && <div className="reg">
        <div className="mask"></div>
        <div className="body">
          <input onChange={e => setUsername(e.target.value)} value={Username} type="text" placeholder="Nhập username" />
          <button onClick={handleJoin}>Tham gia</button>
        </div>
      </div>}
      <Routes>
        <Route path='/' element={<ScreemScreen />} />
        <Route path='/room/:id' element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
