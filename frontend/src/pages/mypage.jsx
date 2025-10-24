import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";

export function Mypage() {
  const navigate = useNavigate();
  const [circles, setCircles] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5001/api/mypage", {
      credentials: "include", // Flask の session を維持
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setCircles(data.items);
      })
      .catch((err) => console.error("データ取得失敗:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-gray-50">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">マイページ</h1>
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => alert("編集権限メニューを開く")}
        >
          <MoreVertical size={24} />
        </button>
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        <button
          onClick={() => navigate("/add-circle")}
          className="bg-blue-500 text-white w-full sm:w-2/3 py-3 rounded-xl shadow-md hover:bg-blue-600 transition"
        >
          追加
        </button>
        <p className="text-gray-600 mt-2 mb-6 text-sm sm:text-base">
          （サークル追加用の画面へ）
        </p>

        <hr className="w-full border-gray-300 mb-6" />

        <h2 className="text-lg font-semibold mb-3">編集できるサークル一覧</h2>
        <div className="w-full max-w-md space-y-3">
          {circles.length > 0 ? (
            circles.map((c) => (
              <div
                key={c.circle_id}
                className="p-3 border rounded-lg bg-white shadow-sm"
              >
                {c.circle_name}
              </div>
            ))
          ) : (
            <p className="text-gray-500">編集できるサークルがありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Mypage;