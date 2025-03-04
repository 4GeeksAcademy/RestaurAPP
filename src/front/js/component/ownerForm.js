import React, {useState, useContext,} from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const OwnerForm = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        actions.addOwner({ name, telephone, email, location, password });
        navigate("/owners");           // Dopo aver aggiunto l'owner, reindirizza alla lista degli owner
    };

    return (
        <form className="container mt-5" onSubmit={handleSubmit}>
            <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Full name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="exampleInputtext1" aria-describedby="textHelp"/>
            </div>
            <div className="mb-3">
                <label for="exampleInputtext1" className="form-label">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="form-control" id="exampleInputtext1" aria-describedby="textHelp"/>
            </div>
            <div className="mb-3">
                <label for="exampleInputtext1" className="form-label">Telephone</label>
                <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="form-control" id="exampleInputtext1" aria-describedby="textHelp"/>
            </div>
            <div className="mb-3">
                <label for="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label for="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1"/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default OwnerForm