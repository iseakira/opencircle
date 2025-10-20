import { useState } from 'react';

function Toggle() {
  const [visible, setVisible] = useState(false);
  const make_visible = () => {
    setVisible(!visible);
  };
  return (
    <div>
      <button onClick={make_visible} aria-expanded={visible}>
        {visible ? '▶絞り込みを閉じる' : '▽絞り込みを開く'}
      </button>
      {visible && (
        <div className="tag-select">
          <form>
            <input type="text" placeholder="検索" />
          </form>
          <h4>タグを選択してください</h4>
          <div>
            <label>分野</label>
          </div>
        </div>
      )}
    </div>
  );
}
export default Toggle;
