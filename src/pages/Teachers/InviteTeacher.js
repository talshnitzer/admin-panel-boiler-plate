import React, {useState} from "react";
import {globals} from "../../index";
import {invitationApiService} from "../../service";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";

export const InviteTeacher = (props) => {
    const [name, setName]   = useState('');
    const [email, setEmail] = useState('');

    const handleInvite = () => {
        const payload = {
            name: name,
            email: email,
        }
        const afterInviteSent = () => {
            globals.growlRef.show({severity: 'success', summary: `Invitation has benn sent.`});
            setName('');
            setEmail('');
        }
        invitationApiService.post('', payload)
            .then((response) => {
                afterInviteSent();
            });
    }


    return (
        <div className="card card-w-title p-fluid ">
            <h1 className='p-card-title' style={{ textAlign:'center'}}>Invite Teacher</h1>
            <div className={'p-grid'}>

                <div className="p-col-5">
                    <InputText
                        name='name'
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="p-col-5 ">
                    <InputText
                        name='email'
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="p-col-2">
                    <Button
                        disabled={!(name && email)}
                        label="Invite"
                        style={{fontWeight:'bold', fontSize:'16px'}}
                        onClick={handleInvite}  />
                </div>
            </div>

        </div>
    )
}
