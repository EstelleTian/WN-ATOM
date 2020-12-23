import React, { Component, Suspense } from 'react';
import { HashRouter as Router , Switch, Redirect, Route } from "react-router-dom";
import { Provider } from 'mobx-react';
import * as stores  from '../stores/stores.jsx'
import routes from './index';

class Routes extends Component {
    render() {
        return (
            <Router>
                <Provider {...stores}>
                    <Suspense fallback={<div>loading</div>}>
                        <Switch>
                            {
                                routes.length > 0 && routes.map((route) => {  //遍历路由数组
                                    const {
                                        path,
                                        component:C,  // 这样写，是为了以下写法中，用C来代替标签如<Home />,因为不能<component />
                                        exact,
                                    } = route;
                                    return (
                                        <Route
                                            exact={exact}
                                            key={path}
                                            path={path}
                                            render={(props) => {
                                                // 实际上这里会处理很多的业务逻辑，如权限和登录（无token自动跳转到登录页），相当于vue的导航守卫
                                                // console.log(props);
                                                return (<C />);
                                            }}
                                        />
                                    );
                                })
                            }
                            {/* 默认进入/时自动匹配到/Home */}
                            <Redirect
                                exact
                                from="/"
                                to={'/'}
                            />
                            {/* 默认无效路径时自动匹配到首页 */}
                            <Redirect to="/" />
                        </Switch>
                    </Suspense>
                </Provider>
            </Router>
        );
    }
}

// const Routes = () => (
//
//         <HashRouter>
//             <Provider {...stores}>
//             <Switch>
//                 <Route  path="/info" component={ (props)=> <InfoPage { ...props }/> } />
//                 <Route  exact path="/fangxing" component={ (props)=> <FangxingPage { ...props }/> } />
//                 <Route  exact path="/total" component={ (props)=> <TotalPage { ...props } /> } />
//                 <Redirect to="/info" />
//             </Switch>
//             </Provider>
//         </HashRouter>
//
// );

export default Routes;