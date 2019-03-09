//components: 리덕스 상태에 연결되지 않은 프리젠테이셔널 컴포넌트들이 들어 있습니다. 
//각 컴포넌트의 스타일도 이 디렉터리에 넣습니다.

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ListPage, PostPage, EditorPage, NotFoundPage } from 'pages';
 const App = () => {  
     return (  
        <div>  
            <Switch> 
                <Route exact path="/" component={ListPage}/> 
                <Route path="/page/:page" component={ListPage}/> 
                <Route path="/tag/:tag/:page?" component={ListPage}/> 
                <Route path="/post/:id" component={PostPage}/> 
                <Route path="/editor" component={EditorPage}/> 
                <Route component={NotFoundPage}/> 
            </Switch> 
        </div>  
    ); 
};  
export default App;