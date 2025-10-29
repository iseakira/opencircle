import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditCircle() {
  // 1. URLから :circleId を受け取る (例: "/edit-circle/3" なら circleId は "3")
  const { circleId } = useParams();
  const navigate = useNavigate();

  // 2. フォームの各項目を管理するための State
  const [circleName, setCircleName] = useState("");
  const [description, setDescription] = useState("");
  const [fee, setFee] = useState(""); // circle_fee
  const [maleCount, setMaleCount] = useState(0); // number_of_male
  const [femaleCount, setFemaleCount] = useState(0); // number_of_female
  // 'tags' は [1, 2, 5] のようなIDの配列。
  // 簡単のため、フォームでは "1,2,5" のようにカンマ区切りの文字列で扱う
  const [tagIds, setTagIds] = useState(""); 
  
  // 読み込み中・エラーの状態を管理
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. ページ読み込み時に、サークルの「現在の情報」をAPI (GET) から取得
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5001/api/circles/${circleId}`, { 
      //credentials: "include" 
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("サークル情報の取得に失敗しました");
        }
        return res.json();
      })
      .then(data => {
        // 取得したデータを State にセット
        setCircleName(data.circle_name);
        setDescription(data.circle_description);
        setFee(data.circle_fee || ""); // null の場合は空文字に
        setMaleCount(data.number_of_male || 0);
        setFemaleCount(data.number_of_female || 0);
        setTagIds(data.tags.join(",")); // 配列 [1, 3] を "1,3" という文字列に変換
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [circleId]); // circleId が変わった時（基本は初回のみ）実行

  // 4. 「更新」ボタンが押された時の処理 (PUT)
  const handleSubmit = (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ

    // API (PUT) に送信するデータを作成
    const updatedData = {
      circle_name: circleName,
      circle_description: description,
      circle_fee: fee || null, // 空文字なら null を送る
      number_of_male: parseInt(maleCount) || 0,
      number_of_female: parseInt(femaleCount) || 0,
      // "1,3,5" という文字列を [1, 3, 5] という数値の配列に変換
      tags: tagIds.split(",") // ["1", "3", "5", ""] のような配列になる
                 .filter(id => id.trim() !== "") // 空文字を除去
                 .map(id => parseInt(id)), // 数値に変換
    };

    // API (PUT) を叩く
    fetch(`http://localhost:5001/api/circles/${circleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedData),
    })
    .then(res => {
      if (!res.ok) {
        // バックエンドからのエラーメッセージを取得
        return res.json().then(err => { throw new Error(err.error || "更新に失敗しました"); });
      }
      return res.json();
    })
    .then(data => {
      alert(data.message); // "サークルを更新しました" などを表示
      navigate("/mypage"); // 更新成功したらマイページに戻る
    })
    .catch(err => {
      console.error("Update error:", err);
      setError(err.message); // 画面にエラーを表示
    });
  };

  // 5. 表示する内容 (JSX)

  if (loading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }
  
  // 取得エラー（権限がない、サークルが存在しないなど）
  if (error && !circleName) { 
    return <div className="p-8 text-center text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">サークル編集 (ID: {circleId})</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-5">
        
        {/* 送信時のエラー表示 */}
        {error && circleName && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            エラー: {error}
          </div>
        )}

        {/* サークル名 */}
        <div>
          <label htmlFor="circleName" className="block text-sm font-medium text-gray-700 mb-1">
            サークル名 <span className="text-red-500">*</span>
          </label>
          <input
            id="circleName"
            type="text"
            value={circleName}
            onChange={(e) => setCircleName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* サークル説明 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            サークル説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 会費 */}
        <div>
          <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-1">
            会費 (例: "月1000円", "無料")
          </label>
          <input
            id="fee"
            type="text"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 人数 */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="maleCount" className="block text-sm font-medium text-gray-700 mb-1">
              男性人数
            </label>
            <input
              id="maleCount"
              type="number"
              min="0"
              value={maleCount}
              onChange={(e) => setMaleCount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="femaleCount" className="block text-sm font-medium text-gray-700 mb-1">
              女性人数
            </label>
            <input
              id="femaleCount"
              type="number"
              min="0"
              value={femaleCount}
              onChange={(e) => setFemaleCount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* タグ (簡易版) */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            タグID (カンマ区切り)
          </label>
          <input
            id="tags"
            type="text"
            value={tagIds}
            onChange={(e) => setTagIds(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="例: 1,3,5"
          />
          <p className="mt-1 text-xs text-gray-500">（※本当はここはチェックボックス一覧にすべきUIです）</p>
        </div>
        
        {/* 更新ボタン */}
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-xl shadow-md hover:bg-blue-600 transition"
        >
          更新する
        </button>
      </form>
    </div>
  );
}
export default EditCircle;