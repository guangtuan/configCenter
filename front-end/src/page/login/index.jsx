import React, { useState } from 'react';
import { Form, Input, Button, Loading } from 'element-react';
import { request, TOKEN_KEY } from "../../core/request";
import "./login.css"

export default function Login(props) {

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const displayLoading = setLoading.bind(null, true);
    const dismissLoading = setLoading.bind(null, false);

    const navigateToHome = () => {
        props.history.replace("/apps");
    }

    const login = async () => {
        try {
            displayLoading();
            const { data: { token } } = await request({
                path: "api/open/token.post",
                data: {
                    user,
                    password
                }
            })
            localStorage.setItem(TOKEN_KEY, token);
            navigateToHome();
        } catch (error) {
            console.log(error);
            dismissLoading();
        }
    };

    return (
        <div className="login-container">
            {
                loading && <Loading fullscreen={true} />
            }
            <div className="login-form">
                <Form>
                    <Input
                        onChange={setUser}
                        value={user}
                        trim
                        placeholder="user"
                        className="user" />
                    <Input
                        onChange={setPassword}
                        value={password}
                        trim
                        type="password"
                        placeholder="password"
                        className="password" />
                    <Button
                        className="login"
                        onClick={login}>
                        登陆
                    </Button>
                </Form>
            </div>
        </div>
    )
}