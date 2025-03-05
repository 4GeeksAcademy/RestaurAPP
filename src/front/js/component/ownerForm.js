import React, {useState, useContext, useEffect} from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

const OwnerForm = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { ownerId } = useParams();

    
    useEffect(() => {  
        if (ownerId) {

            const owner = store.owners.find(owner => owner.id === parseInt(ownerId));
            if (owner) {
            setName(owner.name || "");
            setLocation(owner.location || "");
            setTelephone(owner.telephone || "");
            setEmail(owner.email || "");
            setPassword(owner.password || "");
        }
        }else {
            setName("");
            setLocation("");
            setTelephone("");
            setEmail("");
            setPassword("")
        }
    }, [ownerId, store.owners]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (ownerId) {
            actions.modifyOwner(ownerId, { name, telephone, email, location, password });
        } else {
            actions.addOwner({ name, telephone, email, location, password });
        }
        navigate("/owners");
    };

    return (
        <form className="container mt-5" onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="exampleInputname" className="form-label">Full name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="exampleInputname" aria-describedby="textHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputtext1" className="form-label">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="form-control" id="exampleInputlocation" aria-describedby="textHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputtelephone" className="form-label">Telephone</label>
                <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="form-control" id="exampleInputtelephone" aria-describedby="textHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail" aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword"/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default OwnerForm