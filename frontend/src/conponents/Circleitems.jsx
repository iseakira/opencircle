import React from 'react'

export default function Circleitems({items}) {
 let keywords;
 if(items&&items.length>0){
  if(items[0]==="未選択"){
  keywords=items.slice(1);
 }else {
  keywords=items;
 }
}
    return (
    <div>
        {Array.isArray(keywords)&&keywords.length>0 ?(
                            <p>キーワード: {keywords.join(', ')}</p>
                      ):(
                        <p>キーワード: なし</p>
                      
                        )}
    </div>
  );
}
