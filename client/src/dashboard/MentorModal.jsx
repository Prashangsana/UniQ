import React from "react";
import {Icon} from "@iconify/react";

const MentorModal = ({ onClose, onSelectRole }) => {
    const userRole = localStorage.getItem('user_role');
    const isPeerMentor = localStorage.getItem('is_peer_mentor') === 'true';

    return (
        <div className="modal-overlay">
        <div className="modal-content size-sm">
            <button className="modal-close" onClick={onClose}>
            <Icon icon="lucide:x" width="20" />
            </button>
        
        <div className="modal-header">
            <h2>{userRole === 'lecturer' || isPeerMentor ? "Mentor Dashboards" : "Join as a Mentor"}</h2>
            <p>{userRole === 'lecturer' || isPeerMentor ? "Select your dashboard" : "How would you like to register to share your knowledge?"}</p>
        </div>

        <div className="modal-form">
            <button 
                className="btn-modal primary"
                onClick={() => onSelectRole('peer')}
            >
                <Icon icon="lucide:users" width="20" />
                {isPeerMentor ? "Peer Mentor Dashboard" : "Register as Peer Mentor"}
            </button>
            
            <div className="modal-divider">
                <div className="line"></div>
                <div className="text">OR</div>
                <div className="line"></div>
            </div>

            <button 
                className="btn-modal google"
                onClick={() => onSelectRole('lecturer')}
            >
                <Icon icon="lucide:graduation-cap" width="20" />
                {userRole === 'lecturer' ? "Lecturer Dashboard" : "Register as Lecturer"}
            </button>
        </div>
        </div>
    </div>
  );
};

export default MentorModal;
