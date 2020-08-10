import React, {Component} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from "primereact/button";
import {invitationApiService, teachersApiService} from "../service";
import {withRouter} from "react-router-dom";
import * as QueryString from "query-string"
import {stateObjectHandlerClassComp} from "../shared/functions";
import {RowDetails} from "../shared/components";
import {InputTextarea} from "primereact/inputtextarea";
import {Password} from 'primereact/password';
import {globals} from "../index";
class RegisterPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teacher: {},
            socialLinks: {},
            password: '',
            confirm: '',
            token: '',
        }

        this.updateTeacher = stateObjectHandlerClassComp.call(this, 'teacher');
        this.updateSocialLinks = stateObjectHandlerClassComp.call(this, 'socialLinks');
    }

    updateTeacher() {}

    goToLogin() {
        this.props.history.replace('/login');
    }

    componentDidMount() {
        const params = QueryString.parse(this.props.location.search);
        console.log('this.props.location.query :' , params);

        if (params.token) {
        //    go to access dene
            this.checkToken(params.token, (data) => {
                console.log('token data :', data);
                this.setState({token: params.token});
                this.initCurrentTeacherDetails(data);
            })
        } else {
            this.goToLogin();
        }
    }

    initCurrentTeacherDetails(teacherDetails) {
        // email: "Adirsimona@gmail.com"
        // iat: 1587898611
        // name: "adir simona"
        // status: "pending"
        // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRpciBzaW1vbmEiLCJlbWFpbCI6IkFkaXJzaW1vbmFAZ21haWwuY29tIiwiaWF0IjoxNTg3ODk4NjExfQ.5m0reIuxHUfTK5CeZJPJ3RmoySAsUfoGtw_NvILGiC0"
        // __v: 0
        // _id: "5ea568f3a7113ca7f53fef4f"

        const {name, email} = teacherDetails;
        this.updateTeacher('firstName', name.split(' ')[0]);
        this.updateTeacher('lastName', name.split(' ')[1]);
        this.updateTeacher('email', email);
    }

    checkToken(token, cl) {
        invitationApiService.get(`/checkToken/${token}`)
            .then(({data}) => {
                console.log('res', data);
                if (data) {
                    cl(data.data);
                } else {
                    this.goToLogin()
                }
            }).catch(err => {
                this.goToLogin();
        });
    }

    getDisableState() {
        const {firstName , lastName, email} = this.state.teacher;
        const {password , confirm} = this.state;
        return ((email && firstName && lastName && password && confirm) && (password === confirm)) ;
    }

    register() {
        const {firstName , lastName, email, age,bio} = this.state.teacher;
        const {socialLinks} = this.state;
        const {password , token} = this.state;

        if (this.getDisableState()) {
            const payload = {
                firstName,
                lastName,
                email,
                age,
                bio,
                password,
                socialLinks,
            }

            teachersApiService.post(`register/${token}`, payload)
                .then(data => {
                       globals.growlRef.show({severity: 'success', summary: `Register Success!`, details: 'We will redirect to our login page now.'});
                       setTimeout(() => {
                           this.goToLogin();
                       }, 3000);
                }).catch(err => {
                    console.log('err', err);
            });
        }

    }

    render() {
        const {firstName , lastName, email, age,bio} = this.state.teacher;
        const {facebook , instagram, website, youtube} = this.state.socialLinks;
        const {password , confirm} = this.state;
        return <div className="login-body">
            <div className="body-container">
                <div className="p-grid p-nogutter">
                    <div className="p-col-12 p-lg-6 left-side">
                        <img src="assets/layout/images/logo_login.png"  alt="logo" className="logo"/>
                        <h1>Welcome {firstName},</h1>
                        <p>
                            Let us know a bit more about you and lets start!
                        </p>
                    </div>
                    <div className="p-col-12 p-lg-6 right-side">
                        <div className="login-wrapper" style={{width: '60%'}}>
                            <div style={{paddingTop:'20%'}}>
                                {/*<span className="title">Login</span>*/}

                                <div className="p-grid p-fluid">
                                    <RowDetails label={'email *'}>
                                        {/*onInput={(e) => this.updateTeacher('email', e.target.value)}*/}
                                        <InputText
                                            value={email}
                                            disabled
                                            type="text"
                                            placeholder="email"/>
                                    </RowDetails>

                                    <RowDetails label={'First name *'}>
                                        <InputText
                                            value={firstName}
                                            onInput={(e) => this.updateTeacher('firstName', e.target.value)}
                                            type="text"
                                            placeholder="First Name *"/>
                                    </RowDetails>

                                    <RowDetails label={'Last name *'}>
                                        <InputText
                                            value={lastName}
                                            onInput={(e) => this.updateTeacher('lastName', e.target.value)}
                                            type="text"
                                            placeholder="Last Name"/>
                                    </RowDetails>

                                    <RowDetails label={'Password *'}>
                                        <Password value={password}  onChange={(e) => this.setState({password: e.target.value})} />
                                    </RowDetails>

                                    <RowDetails label={'Confirm Password *'}>
                                        <Password
                                            value={confirm}
                                            onChange={(e) => this.setState({confirm: e.target.value})} />
                                    </RowDetails>

                                    <RowDetails label={'Age'}>
                                        <InputText
                                            value={age}
                                            onInput={(e) => this.updateTeacher('age', e.target.value)}
                                            type="text"
                                            placeholder="Age"/>
                                    </RowDetails>

                                    <RowDetails label={'Bio'}>
                                        <InputTextarea
                                            value={bio}
                                            onInput={(e) => this.updateTeacher('bio', e.target.value)}
                                            rows={4}
                                            cols={30}
                                            placeholder="Your Bio"
                                            autoResize={true} />
                                    </RowDetails>

                                    <RowDetails label={'Facebook'}>
                                        <InputText
                                            value={facebook}
                                            onInput={(e) => this.updateSocialLinks('facebook', e.target.value)}
                                            type="text"
                                            placeholder="Facebook"/>
                                    </RowDetails>

                                    <RowDetails label={'Instagram'}>
                                        <InputText
                                            value={instagram}
                                            onInput={(e) => this.updateSocialLinks('instagram', e.target.value)}
                                            type="text"
                                            placeholder="Instagram"/>
                                    </RowDetails>

                                    <RowDetails label={'Website'}>
                                        <InputText
                                            value={website}
                                            onInput={(e) => this.updateSocialLinks('website', e.target.value)}
                                            type="text"
                                            placeholder="Website"/>
                                    </RowDetails>

                                    <RowDetails label={'Youtube'}>
                                        <InputText
                                            value={youtube}
                                            onInput={(e) => this.updateSocialLinks('youtube', e.target.value)}
                                            type="text"
                                            placeholder="Youtube"/>
                                    </RowDetails>

                                    <RowDetails label={''}>
                                        <Button
                                            disabled={!this.getDisableState()}
                                            label="Register"
                                            icon="pi pi-check"
                                            onClick={() => this.register()} />
                                    </RowDetails>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default withRouter(RegisterPage);
