import callAPI from "callAPI";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ScreemScreen() {
  const navigate = useNavigate()
  const handleCreateRoom = async () => { 
    const res = await callAPI.post('/room' , {})
    navigate(`/room/${res.data._id}`)
  }
  return (
    <>
      <div className="container">
        <div onClick={handleCreateRoom} className="create-room">Tạo phòng</div>
      </div>
    </>
  );
}

export default ScreemScreen;
